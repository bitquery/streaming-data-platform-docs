---
sidebar_position: 3
title: "BSC Miner Balance Tracker: Block Producer Rewards on BNB Chain"
description: "BNB Chain has validators, not miners, so mining codes never fire. Track block producer income with Bitquery GraphQL: fees per transaction, block and validator."
keywords:
  - BSC miner balance tracker
  - BNB Chain validator rewards API
  - BSC block rewards
  - BSC transaction fee rewards
  - balance change reason codes
---

import FAQ from "@site/src/components/FAQ";

# BSC Miner Balance Tracker: Block Producer Rewards on BNB Chain

BNB Chain has never had miners. Blocks are produced by a fixed set of validators under the Parlia consensus, so the two mining codes in the balance schema, 1 for an uncle reward and 2 for a block reward, never appear in BNB Chain data. A filter on them returns nothing, and the last query on this page shows that. What a block producer earns instead is the gas paid by the transactions in its block, and the `TransactionBalances` cube shows that income in two places: as a code 5 credit for each transaction, and as one deposit per block into the ValidatorSet contract. Every example runs in the [IDE](https://ide.bitquery.io) on a free account; the cube covers the recent realtime window only.

## How block producer income shows up

1. While a block executes, each transaction's fee is credited to the fee holder `0xfffffffffffffffffffffffffffffffffffffffe` with reason code 5.
2. At the end of the block, the validator sends the collected total to the ValidatorSet system contract `0x0000000000000000000000000000000000001000`. `Transaction.From` on that deposit is the validator and `Transaction.Value` is the block's income.
3. Validators withdraw their share from the contract later; those withdrawals are ordinary transfers.

## Fee income per block

One row per block, newest first. Saved query [here](https://ide.bitquery.io/Track-Block-Mining-Rewards-bsc).

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

The deposit rows do not stream well as a subscription on BNB Chain because the filter has to scan every balance row on the network; poll this query, or stream the code 5 credits below, which are keyed by the fee holder and arrive at once.

## Blocks produced per validator

Group the deposits by the validator address; `uniq` on the transaction hash counts blocks. Saved query [here](https://ide.bitquery.io/Historical-Miner-Balance-Data-bsc).

```graphql
{
  EVM(network: bsc) {
    TransactionBalances(
      limit: { count: 50 }
      orderBy: { descendingByField: "blocks" }
      where: {
        TokenBalance: {
          Address: { is: "0x0000000000000000000000000000000000001000" }
          Currency: { Native: true }
        }
        Transaction: { Value: { gt: "0" } }
        Block: { Time: { since_relative: { hours_ago: 1 } } }
      }
    ) {
      Transaction {
        From
      }
      blocks: uniq(of: Transaction_Hash)
    }
  }
}
```

## Income of one validator

Add the validator to `Transaction.From`. The example is one of the active validators; take any address from the query above. Saved query [here](https://ide.bitquery.io/Filter-by-Miner-Address-bsc).

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
        Transaction: {
          Value: { gt: "0" }
          From: { is: "0x1579ca96ebd49a0b173f86c372436ab1ad393380" }
        }
        Block: { Time: { since_relative: { hours_ago: 1 } } }
      }
    ) {
      Block {
        Number
        Time
      }
      Transaction {
        Hash
        Value
      }
    }
  }
}
```

## Fee credits per transaction

The per-transaction view is reason code 5 on the fee holder. The [BSC MEV balance tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-mev-balance-tracker) streams these with the tip computed per row and ranks the largest. Saved stream [here](https://ide.bitquery.io/Track-Transaction-Fee-Rewards-bsc).

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
      }
      Transaction {
        Hash
        From
      }
    }
  }
}
```

## Why the mining codes return nothing

Codes 1 and 2 exist in the schema because the same cube serves chains with a proof-of-work past. On BNB Chain the count is zero in any window. Saved query [here](https://ide.bitquery.io/Track-Uncle-Block-Rewards-bsc).

```graphql
{
  EVM(network: bsc) {
    TransactionBalances(
      where: {
        TokenBalance: { BalanceChangeReasonCode: { in: [1, 2] } }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      count
    }
  }
}
```

<FAQ
  items={[
    { q: "Does BNB Chain have mining rewards?", a: "No. BNB Chain has used validators under the Parlia consensus since launch. Reason codes 1 and 2 never appear in its balance data; block producers earn transaction fees, visible as code 5 credits and as per-block deposits into the ValidatorSet contract." },
    { q: "How do I get a validator's earnings per block?", a: "Query TransactionBalances rows on 0x0000000000000000000000000000000000001000 with Transaction.Value above zero and limitBy on the transaction hash. Transaction.From is the validator and Value is the block's fee income." },
    { q: "How far back does this data go?", a: "The cube holds the recent realtime window and has no archive dataset. Stream the deposits and store them to keep a longer record." },
    { q: "Where do I see validator withdrawals and staking?", a: "The BSC validator balance tracker covers the staking side. This page is about the fee income that a block producer collects." },
  ]}
/>

## Related pages

- [BSC MEV balance tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-mev-balance-tracker)
- [BSC validator balance tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-validator-balance-tracker)
- [BSC transaction balance tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-transaction-balance-tracker)
- [Balance change reason codes](/docs/blockchain/BSC/transaction-balance-tracker/#balance-change-reason-codes)
