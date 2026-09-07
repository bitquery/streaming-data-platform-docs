---
sidebar_position: 6
title: "Base Gas Balance Tracker: Fees Paid by Senders and Collected by Vaults"
sidebar_label: "Base Gas Balance Tracker"
description: "Track gas on Base from balance changes with Bitquery GraphQL: the three fee vaults, the largest fee credits, what one address paid, and a live fee stream."
keywords:
  - Base gas balance tracker
  - Base fee vault balances
  - Base gas fees API
  - Base sequencer fee vault
  - Base transaction fees GraphQL
---

import FAQ from "@site/src/components/FAQ";

# Base Gas Balance Tracker: Fees Paid by Senders and Collected by Vaults

Base reports gas differently from Ethereum in the `TransactionBalances` cube. Ethereum splits a fee into a gas purchase, a refund and a tip, with reason codes 6, 7 and 5. Base emits two codes only:

- **Code 0** for every ordinary balance change: the sender's ETH goes down by the value sent plus the gas paid, and the receiver's goes up by the value.
- **Code 5** for the fee credited to the three OP Stack fee vaults: `0x4200000000000000000000000000000000000011` (SequencerFeeVault), `0x4200000000000000000000000000000000000019` (BaseFeeVault) and `0x420000000000000000000000000000000000001a` (L1FeeVault).

So the gas a sender paid is read from its own code 0 row, and the fees the network collected are read from the vaults' code 5 rows. Every example runs in the [IDE](https://ide.bitquery.io) on a free account; the cube covers the recent realtime window only, so queries carry a time filter.

## Fee vault balances now

`limitBy` on the address keeps the newest row per vault; `PostBalance` is the balance after the latest credit. Saved query [here](https://ide.bitquery.io/top-gas-fee-collectors-base).

```graphql
{
  EVM(network: base) {
    TransactionBalances(
      limitBy: { by: TokenBalance_Address, count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        TokenBalance: { BalanceChangeReasonCode: { eq: 5 } }
        Block: { Time: { since_relative: { minutes_ago: 5 } } }
      }
    ) {
      Block {
        Time
      }
      TokenBalance {
        Address
        PostBalance
        PostBalanceInUSD
      }
    }
  }
}
```

## Largest fee credits in the last ten minutes

Each code 5 row is one transaction's contribution to one vault; `fee` is the balance after minus the balance before. Sort on it to find the transactions that paid most.

```graphql
{
  EVM(network: base) {
    TransactionBalances(
      limit: { count: 20 }
      orderBy: { descendingByField: "fee" }
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
        Address
        PreBalance
        PostBalance
      }
      Transaction {
        Hash
        From
        To
      }
      fee: calculate(
        expression: "$TokenBalance_PostBalance - $TokenBalance_PreBalance"
      )
    }
  }
}
```

## What one address paid in gas

The sender's own code 0 row holds the balance before and after; subtracting the value sent leaves the gas. Filter on the address as both the balance owner and the transaction sender. If the address also received ETH inside the same transaction, for example from a swap, the result goes negative, so read it alongside `Transaction.Value`. Saved query [here](https://ide.bitquery.io/Latest-balance-and-gas-fee-paid-for-an-address-base_1).

```graphql
{
  EVM(network: base) {
    TransactionBalances(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: {
        TokenBalance: {
          BalanceChangeReasonCode: { eq: 0 }
          Currency: { Native: true }
          Address: { is: "0x6c8ab6bd67d4df8d131e952edcb00b7e77183b60" }
        }
        Transaction: { From: { is: "0x6c8ab6bd67d4df8d131e952edcb00b7e77183b60" } }
      }
    ) {
      Block {
        Time
      }
      TokenBalance {
        PreBalance
        PostBalance
        PostBalanceInUSD
      }
      Transaction {
        Hash
        Value
      }
      gas: calculate(
        expression: "$TokenBalance_PreBalance - $TokenBalance_PostBalance - $Transaction_Value"
      )
    }
  }
}
```

## Stream fee income live

Every fee credit as it lands, with the sender that paid it.

```graphql
subscription {
  EVM(network: base) {
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
      }
      Transaction {
        Hash
        From
        To
      }
      fee: calculate(
        expression: "$TokenBalance_PostBalance - $TokenBalance_PreBalance"
      )
    }
  }
}
```

To watch one wallet's spending instead, stream code 0 rows with `Currency: { Native: true }` and the wallet in both `TokenBalance.Address` and `Transaction.From`, the same filter as the query above.

<FAQ
  items={[
    { q: "Why are there no gas codes 6 and 7 on Base?", a: "Base emits reason codes 0 and 5 only. The sender's gas payment is folded into its code 0 balance change, and the collected fee appears as a code 5 credit to the OP Stack fee vaults." },
    { q: "What are the three fee vault addresses on Base?", a: "0x4200...0011 is the SequencerFeeVault, 0x4200...0019 the BaseFeeVault and 0x4200...001a the L1FeeVault. Every transaction credits one or more of them with reason code 5." },
    { q: "How do I get the gas one address paid?", a: "Take the address's code 0 row for the transaction, subtract PostBalance from PreBalance and then subtract Transaction.Value. Filter on the address as both the balance owner and the transaction sender." },
    { q: "Can I get historical gas data on Base this way?", a: "TransactionBalances holds the recent realtime window only. For history, query the Transactions cube, which carries gas and cost per transaction, or stream and store these rows." },
  ]}
/>

## Related pages

- [Base transaction balance tracker](/docs/blockchain/Base/transaction-balance-tracker/base-transaction-balance-tracker)
- [Base MEV balance tracker](/docs/blockchain/Base/transaction-balance-tracker/base-mev-balance-tracker)
- [Ethereum gas balance tracker](/docs/blockchain/Ethereum/balances/transaction-balance-tracker/eth-gas-balance-tracker)
- [Balance change reason codes](/docs/blockchain/Base/transaction-balance-tracker/#balance-change-reason-codes)
