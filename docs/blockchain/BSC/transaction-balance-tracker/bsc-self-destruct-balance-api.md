---
sidebar_position: 5
title: "BSC Self-Destruct Balance Tracker: Destroyed Contracts and Who Gets the BNB"
sidebar_label: "BSC Self-Destruct Balance Tracker"
description: "Self-destructs on BNB Chain with Bitquery GraphQL: the contract that empties (code 13), the recipient of its BNB (code 12), the SELFDESTRUCT calls, a stream."
keywords:
  - BSC self-destruct tracker
  - BNB Chain selfdestruct
  - balance change reason code 13
  - ephemeral MEV contracts BSC
  - SELFDESTRUCT opcode Calls
---

import FAQ from "@site/src/components/FAQ";

# BSC Self-Destruct Balance Tracker: Destroyed Contracts and Who Gets the BNB

When a contract on BNB Chain runs `selfdestruct`, its BNB moves to the address it names in one step, and the `TransactionBalances` cube records both ends: the destroyed contract's balance falling to zero with reason code 13, and the recipient's balance rising with reason code 12. On BNB Chain almost all of it is one pattern: an MEV bot deploys a helper contract with CREATE2, runs its trade through it and destroys it inside the same transaction, sweeping the leftover BNB back. A few hundred destructions a day, most of them into the same handful of recipients. Every example runs in the [IDE](https://ide.bitquery.io) on a free account; the cube covers the recent realtime window only. The third code in this family, 14, marks BNB sent to an account that was already destroyed in the same transaction and does not occur in live data.

## The destroyed contracts

Code 13 rows: `TokenBalance.Address` is the contract that destroyed itself, `PreBalance` is what it held, `PostBalance` is zero. `Transaction.From` is usually the bot that deployed it. Saved query [here](https://ide.bitquery.io/Self-Destruct-Balance-Decrease-API-bsc).

```graphql
{
  EVM(network: bsc) {
    TransactionBalances(
      where: { TokenBalance: { BalanceChangeReasonCode: { eq: 13 } } }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
        Number
      }
      TokenBalance {
        Address
        PreBalance
        PostBalance
        PostBalanceInUSD
      }
      Transaction {
        Hash
        From
        To
      }
    }
  }
}
```

## Who received the BNB

Code 12 rows are the other side of the same transactions: the recipient named in the `selfdestruct` call, with its balance before and after. Saved query [here](https://ide.bitquery.io/Self-Destruct-Balance-Increase-API-bsc).

```graphql
{
  EVM(network: bsc) {
    TransactionBalances(
      where: { TokenBalance: { BalanceChangeReasonCode: { eq: 12 } } }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
        Number
      }
      TokenBalance {
        Address
        PreBalance
        PostBalance
        PostBalanceInUSD
      }
      Transaction {
        Hash
        From
        To
      }
      received: calculate(
        expression: "$TokenBalance_PostBalance - $TokenBalance_PreBalance"
      )
    }
  }
}
```

Group the same rows by `TokenBalance.Address` with `count` to see which recipients collect most often; in live data a few MEV addresses dominate.

## One recipient's self-destruct inflow

Filter code 12 on the recipient. The example is one of the busiest MEV recipients on the chain, which collects from freshly destroyed helpers many times an hour; put any address in its place. Saved query [here](https://ide.bitquery.io/Track-Self-Destruct-Balance-Changes-for-Specific-Address-bsc).

```graphql
{
  EVM(network: bsc) {
    TransactionBalances(
      where: {
        TokenBalance: {
          BalanceChangeReasonCode: { eq: 12 }
          Address: { is: "0xc6acbee42e9e323140c1ed060c2f6ea9cc3b4b75" }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      TokenBalance {
        PreBalance
        PostBalance
      }
      Transaction {
        Hash
        To
      }
      received: calculate(
        expression: "$TokenBalance_PostBalance - $TokenBalance_PreBalance"
      )
    }
  }
}
```

## The SELFDESTRUCT calls themselves

The `Calls` cube records the opcode, so you can list destructions even when the contract held nothing and no balance row exists. `Call.From` is the contract that died and `Call.To` the recipient. Saved query [here](https://ide.bitquery.io/Track-recent-ephemeral-contract-patterns-bsc).

```graphql
{
  EVM(network: bsc) {
    Calls(
      where: {
        Call: { Opcode: { Name: { is: "SELFDESTRUCT" } } }
        Block: { Time: { since_relative: { hours_ago: 1 } } }
      }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Call {
        From
        To
        Value
      }
      Transaction {
        Hash
        From
      }
    }
  }
}
```

## Stream every self-destruct

Both codes in one subscription; each destruction produces one row of each. Self-destructs run to a few hundred a day on BNB Chain, so expect minutes between messages; the queries above are the quicker way to look. Saved stream [here](https://ide.bitquery.io/All-Self-Destruct-Event-Balances-Stream-bsc).

```graphql
subscription {
  EVM(network: bsc) {
    TransactionBalances(
      where: { TokenBalance: { BalanceChangeReasonCode: { in: [12, 13] } } }
    ) {
      Block {
        Time
        Number
      }
      TokenBalance {
        Address
        BalanceChangeReasonCode
        PreBalance
        PostBalance
        PostBalanceInUSD
      }
      Transaction {
        Hash
        From
        To
      }
    }
  }
}
```

## Totals for a window

`count` and `uniq` over code 13 rows give how many contracts died and how many distinct bots were behind them; the same over code 12 gives the recipients. Saved query [here](https://ide.bitquery.io/Aggregate-Self-Destruct-Statistics-bsc).

```graphql
{
  EVM(network: bsc) {
    TransactionBalances(
      where: {
        TokenBalance: { BalanceChangeReasonCode: { eq: 13 } }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      destroyed: count
      senders: uniq(of: Transaction_From)
      recipients: uniq(of: Transaction_To)
    }
  }
}
```

<FAQ
  items={[
    { q: "How do I track contract self-destructs on BNB Chain?", a: "Filter TransactionBalances on reason code 13 for the contract that emptied and code 12 for the address that received its BNB. Both rows carry the balance before and after and the transaction hash." },
    { q: "Why are most self-destructs on BSC MEV bots?", a: "Bots deploy a helper contract, run their trade through it and destroy it in the same transaction, sweeping the leftover BNB back. It leaves no reusable contract behind and costs less than keeping state." },
    { q: "Can a destroyed contract hold no BNB?", a: "Yes. Then no balance row is written, but the Calls cube still records the SELFDESTRUCT opcode with Call.From as the contract and Call.To as the recipient." },
    { q: "Does reason code 14 ever appear?", a: "Not in live BNB Chain data. It is defined for BNB sent to an account already destroyed in the same transaction, a case that current contracts do not produce." },
    { q: "How far back does self-destruct data go?", a: "TransactionBalances holds the recent realtime window only. The Calls cube reaches history on the archive dataset, so use the opcode query with a date range for older destructions." },
  ]}
/>

## Related pages

- [BSC transaction balance tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-transaction-balance-tracker)
- [BSC MEV balance tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-mev-balance-tracker)
- [BSC smart contract calls API](/docs/blockchain/BSC/bsc-calls-api)
- [Balance change reason codes](/docs/blockchain/BSC/transaction-balance-tracker/#balance-change-reason-codes)
