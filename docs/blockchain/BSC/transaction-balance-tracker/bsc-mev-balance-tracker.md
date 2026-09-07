---
sidebar_position: 4
title: "BSC MEV Balance Tracker: Priority Fees and Block Producer Income"
description: "Track MEV on BNB Chain from balance changes with Bitquery GraphQL: stream fee credits, rank the largest tips, follow one bot and see fee income per block."
keywords:
  - BSC MEV balance tracker
  - BNB Chain MEV API
  - BSC priority fee tracker
  - BSC block producer rewards
  - balance change reason code 5
---

import FAQ from "@site/src/components/FAQ";

# BSC MEV Balance Tracker: Priority Fees and Block Producer Income

MEV on BNB Chain leaves one clean trace in balance data: the fee a transaction pays to be included ahead of others. The `TransactionBalances` cube records that credit as a balance change with reason code 5, `BalanceIncreaseRewardTransactionFee`, with the balance before and after it, so the tip is the difference between the two. This page streams those credits, ranks the largest, follows what one bot pays and shows how the fees reach the validator that produced the block. Every example runs in the [IDE](https://ide.bitquery.io) on a free account. The cube holds the recent realtime window only, so queries need a time filter and history has to be collected as it streams.

## Where the fee credit lands on BNB Chain

On Ethereum a code 5 credit goes to the block builder's own address. On BNB Chain it goes to one fixed address, `0xfffffffffffffffffffffffffffffffffffffffe`, the fee holder that the Parlia consensus uses as the coinbase while a block's transactions execute. At the end of the block the validator moves the collected fees into the ValidatorSet system contract, `0x0000000000000000000000000000000000001000`, with a system transaction whose `Value` is the block's fee income. Two consequences for your filters:

- Every code 5 row carries the fee holder as `TokenBalance.Address`; the transaction that paid the tip is in `Transaction`.
- Rows on the ValidatorSet contract with `Transaction.Value` above zero are one per block; `Transaction.From` is the validator that earned them.

## Stream every priority fee

The `tip` field subtracts the balance before from the balance after, so each message carries the fee in BNB. Saved stream [here](https://ide.bitquery.io/Track-MEV-Related-Balance-Updates-bsc).

```graphql
subscription {
  EVM(network: bsc) {
    TransactionBalances(
      where: { TokenBalance: { BalanceChangeReasonCode: { eq: 5 } } }
    ) {
      Block {
        Number
        Time
      }
      TokenBalance {
        Address
        PreBalance
        PostBalance
        Currency {
          Symbol
        }
      }
      Transaction {
        Hash
        From
        To
        GasPrice
      }
      tip: calculate(
        expression: "$TokenBalance_PostBalance - $TokenBalance_PreBalance"
      )
    }
  }
}
```

## Largest tips in the last ten minutes

Sort by the computed field to find the transactions that paid most for their position. `calculate` can only reference fields that are selected, so keep `PreBalance` and `PostBalance` in the query. Saved query [here](https://ide.bitquery.io/Track-Large-MEV-Transactions-bsc).

```graphql
{
  EVM(network: bsc) {
    TransactionBalances(
      limit: { count: 20 }
      orderBy: { descendingByField: "tip" }
      where: {
        TokenBalance: { BalanceChangeReasonCode: { eq: 5 } }
        Block: { Time: { since_relative: { minutes_ago: 10 } } }
      }
    ) {
      Block {
        Number
        Time
      }
      TokenBalance {
        PreBalance
        PostBalance
      }
      Transaction {
        Hash
        From
        To
        GasPrice
      }
      tip: calculate(
        expression: "$TokenBalance_PostBalance - $TokenBalance_PreBalance"
      )
    }
  }
}
```

## What one bot pays

Filter on `Transaction.From` to follow a single sender. The example address is a bot that pays some of the largest tips on the network; put any sender in its place. Saved query [here](https://ide.bitquery.io/Filter-by-MEV-Bot-or-Builder-Address-bsc).

```graphql
{
  EVM(network: bsc) {
    TransactionBalances(
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
      where: {
        TokenBalance: { BalanceChangeReasonCode: { eq: 5 } }
        Transaction: { From: { is: "0x4848489f0b2bedd788c696e2d79b6b69d7484848" } }
        Block: { Time: { since_relative: { hours_ago: 1 } } }
      }
    ) {
      Block {
        Number
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
      tip: calculate(
        expression: "$TokenBalance_PostBalance - $TokenBalance_PreBalance"
      )
    }
  }
}
```

Change `query` to `subscription` and drop `limit`, `orderBy` and the time filter to get an alert each time the address pays a tip.

## Fee income per block and per validator

The validator's deposit into the ValidatorSet contract closes each block. `limitBy` on the transaction hash keeps one row per block, `Transaction.Value` is the block's fee income and `Transaction.From` is the validator. Saved query [here](https://ide.bitquery.io/Aggregate-MEV-Rewards-bsc).

```graphql
{
  EVM(network: bsc) {
    TransactionBalances(
      limit: { count: 20 }
      limitBy: { by: Transaction_Hash, count: 1 }
      orderBy: { descending: Block_Number }
      where: {
        TokenBalance: {
          Address: { is: "0x0000000000000000000000000000000000001000" }
          Currency: { Native: true }
        }
        Transaction: { Value: { gt: "0" } }
        Block: { Time: { since_relative: { minutes_ago: 10 } } }
      }
    ) {
      Block {
        Number
        Time
      }
      Transaction {
        Hash
        From
        Value
      }
    }
  }
}
```

Group the same rows by `Transaction.From` with `uniq(of: Transaction_Hash)` to count the blocks each validator produced in the window; the [BSC miner balance tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-miner-balance-tracker) shows that query.

<FAQ
  items={[
    { q: "How do I detect MEV on BNB Chain with balance data?", a: "Filter TransactionBalances on reason code 5. Each row is a priority fee credited to the fee holder, and the difference between PostBalance and PreBalance is the tip the transaction paid; sort by that difference to find the transactions that paid most." },
    { q: "Why does every code 5 row show the address 0xffff...fffe?", a: "BNB Chain credits transaction fees to a fixed fee holder while the block executes. The validator moves the total into the ValidatorSet contract at the end of the block, so per-block income appears on 0x...1000, not on the fee holder." },
    { q: "How do I find which validator earned a block's fees?", a: "Query rows on the ValidatorSet contract 0x0000000000000000000000000000000000001000 with Transaction.Value above zero. Transaction.From is the validator and Value is the fee income of that block." },
    { q: "Can I query MEV history on BNB Chain?", a: "TransactionBalances holds the recent realtime window only; there is no archive dataset for this cube. Stream the rows and store them, or use the Kafka balance streams, to build a longer history." },
    { q: "Does the same page work on Ethereum?", a: "The code 5 filter does, but on Ethereum the credit goes to the block builder's own address, so you can filter by builder. See the Ethereum MEV balance tracker." },
  ]}
/>

## Related pages

- [BSC transaction balance tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-transaction-balance-tracker)
- [BSC miner balance tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-miner-balance-tracker)
- [BSC validator balance tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-validator-balance-tracker)
- [Ethereum MEV balance tracker](/docs/blockchain/Ethereum/balances/transaction-balance-tracker/eth-mev-balance-tracker)
- [Balance change reason codes](/docs/blockchain/BSC/transaction-balance-tracker/#balance-change-reason-codes)
