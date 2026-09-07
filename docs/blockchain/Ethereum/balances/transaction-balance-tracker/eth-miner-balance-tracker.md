---
sidebar_position: 3
title: "Ethereum Miner Balance Tracker: Block Producer Income After the Merge"
sidebar_label: "Ethereum Miner Balance Tracker"
description: "Ethereum has had no miners since the Merge. Track what block producers earn now with Bitquery GraphQL: priority fees per transaction, block and builder."
keywords:
  - Ethereum miner balance tracker
  - Ethereum block builder rewards API
  - Ethereum priority fee tracker
  - Ethereum block rewards after the Merge
  - balance change reason code 5
---

import VideoPlayer from "../../../../../src/components/videoplayer.js";
import FAQ from "@site/src/components/FAQ";

# Ethereum Miner Balance Tracker: Block Producer Income After the Merge

Ethereum stopped mining at the Merge in September 2022. The mining codes stay in the balance schema, 1 for an uncle reward and 2 for a block reward, but the `TransactionBalances` cube covers the recent realtime window only, so on Ethereum they never appear and a filter on them returns nothing. What a block producer earns today shows up under other codes:

- **Priority fees**, reason code 5, credited to the block's fee recipient for each transaction. In practice that address is a block builder, since most blocks are built through MEV-Boost.
- **Consensus-layer rewards**, which reach validators through beacon-chain withdrawals. Withdrawals are not transactions, so this cube does not record them; reason code 3 exists in the schema for them but returns no rows in live data. The [validator balance tracker](/docs/blockchain/Ethereum/balances/transaction-balance-tracker/eth-validator-balance-tracker) covers what can be tracked on the execution layer.
- **Builder payments to the proposer**, ordinary transfers in the last transaction of a block, covered by the [MEV balance tracker](/docs/blockchain/Ethereum/balances/transaction-balance-tracker/eth-mev-balance-tracker).

This page tracks the first of these. Every example runs in the [IDE](https://ide.bitquery.io) on a free account. The example builder is Titan Builder, `0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97`; the query under "Who collected fees" lists the others.

## Stream fee credits as they happen

Each message is one transaction's priority fee. `tip` is the balance after minus the balance before, in ETH. Saved stream [here](https://ide.bitquery.io/Track-Transaction-Fee-Rewards).

```graphql
subscription {
  EVM(network: eth) {
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
      }
      tip: calculate(
        expression: "$TokenBalance_PostBalance - $TokenBalance_PreBalance"
      )
    }
  }
}
```

## Largest tips in the last ten minutes

Sort on the computed field. `calculate` only sees fields that are selected, so `PreBalance` and `PostBalance` stay in the query. Saved query [here](https://ide.bitquery.io/Track-Block-Mining-Rewards).

```graphql
{
  EVM(network: eth) {
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
        Address
        PreBalance
        PostBalance
      }
      Transaction {
        Hash
        From
      }
      tip: calculate(
        expression: "$TokenBalance_PostBalance - $TokenBalance_PreBalance"
      )
    }
  }
}
```

## One builder's income per block

Group by block for one address. The balance before the first credit and after the last credit in the block bracket the block's fee income, so `end` minus `start` is what the builder collected in that block, and `count` is the number of transactions that paid. Saved query [here](https://ide.bitquery.io/Filter-by-Miner-Address).

```graphql
{
  EVM(network: eth) {
    TransactionBalances(
      limit: { count: 20 }
      orderBy: { descending: Block_Number }
      where: {
        TokenBalance: {
          BalanceChangeReasonCode: { eq: 5 }
          Address: { is: "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97" }
        }
        Block: { Time: { since_relative: { minutes_ago: 30 } } }
      }
    ) {
      Block {
        Number
      }
      count
      start: TokenBalance {
        PreBalance(minimum: Transaction_Index)
      }
      end: TokenBalance {
        PostBalance(maximum: Transaction_Index)
      }
    }
  }
}
```

## Who collected fees in the last hour

Group the code 5 rows by receiving address to see which builders and fee recipients were active, ranked by the number of transactions that paid them. Saved query [here](https://ide.bitquery.io/Track-Miner-Balance-Updates).

```graphql
{
  EVM(network: eth) {
    TransactionBalances(
      limit: { count: 20 }
      orderBy: { descendingByField: "count" }
      where: {
        TokenBalance: { BalanceChangeReasonCode: { eq: 5 } }
        Block: { Time: { since_relative: { hours_ago: 1 } } }
      }
    ) {
      TokenBalance {
        Address
      }
      count
    }
  }
}
```

## Why the mining codes return nothing

Codes 1 and 2 belong to proof-of-work blocks. The cube has no archive dataset on Ethereum, so the pre-Merge era is out of reach and the count below is zero in any window. Saved query [here](https://ide.bitquery.io/Track-Uncle-Block-Rewards).

```graphql
{
  EVM(network: eth) {
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

## Video walkthrough

<VideoPlayer url="https://www.youtube.com/watch?v=VqV1K4RJc6U" />

<FAQ
  items={[
    { q: "Does Ethereum still have mining rewards?", a: "No. Mining ended at the Merge in September 2022. Reason codes 1 and 2 never appear in the realtime balance data, and the cube has no archive, so the pre-Merge era cannot be queried through it." },
    { q: "Who receives reason code 5 on Ethereum?", a: "The block's fee recipient, which for most blocks is a builder such as Titan Builder. Group code 5 rows by TokenBalance.Address to list the active builders and how many transactions paid each." },
    { q: "How do I compute a builder's income for one block?", a: "Filter code 5 rows on the builder's address, group by block, and take PostBalance at the maximum transaction index minus PreBalance at the minimum transaction index. The difference is the block's fee income." },
    { q: "Where are the proposer's earnings?", a: "Builder payments to the proposer are regular transfers at the end of a block, covered by the MEV balance tracker. Consensus-layer rewards arrive as beacon-chain withdrawals, which are not transactions, so this cube does not record them and reason code 3 returns no rows." },
  ]}
/>

## Related pages

- [Ethereum MEV balance tracker](/docs/blockchain/Ethereum/balances/transaction-balance-tracker/eth-mev-balance-tracker)
- [Ethereum validator balance tracker](/docs/blockchain/Ethereum/balances/transaction-balance-tracker/eth-validator-balance-tracker)
- [Ethereum gas balance tracker](/docs/blockchain/Ethereum/balances/transaction-balance-tracker/eth-gas-balance-tracker)
- [Ethereum transaction balance tracker](/docs/blockchain/Ethereum/balances/transaction-balance-tracker/eth-transaction-balance-tracker)
