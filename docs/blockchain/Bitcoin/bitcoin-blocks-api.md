---
title: "Bitcoin Blocks API"
sidebar_label: Bitcoin Blocks API
description: "Bitcoin Blocks API: query and stream Bitcoin on-chain data with Bitquery GraphQL examples for developers. Run it in the IDE, then ship in your app."
keywords:
  - Bitcoin blocks API
  - Bitcoin block explorer API
  - Bitcoin difficulty API
  - Bitcoin block height query
  - Bitcoin GraphQL
  - Bitcoin mining analytics
  - BTC block size
  - Bitquery Bitcoin
---
# Bitcoin Blocks API

The Blocks API returns block-level data on Bitcoin: height, difficulty, size, transaction count, and timestamp. Use it to drive explorer front-ends, monitor chain progression, or pull historical block context for mining and network analytics.

:::info Endpoint
Bitcoin GraphQL queries are served at `https://graphql.bitquery.io`.
:::

## Get the 10 most recent Bitcoin blocks

Returns blocks ordered by height descending, with the timestamp formatted for display. Add a `date` filter to constrain the window.

```graphql
query {
  bitcoin(network: bitcoin) {
    blocks(options: {desc: "height", limit: 10}, date: {after: "2023-10-10"}) {
      timestamp {
        time(format: "%Y-%m-%d %H:%M:%S")
      }
      height
      difficulty
      transactionCount
      blockSizeBigInt
    }
  }
}
```

Use `height: {is: N}` to look up a single block, or `height: {in: [N1, N2, ...]}` for several at once. The same query shape works on other UTXO networks supported here by swapping `network: bitcoin` for `litecoin`, `dogecoin`, and others.

## Find the busiest Bitcoin blocks by transaction count

Sort blocks by `transactionCount` descending to surface the busiest blocks on-chain — useful for network congestion studies and block utilization analysis.

```graphql
query {
  bitcoin(network: bitcoin) {
    blocks(options: {limit: 10, desc: "transactionCount"}) {
      timestamp {
        time(format: "%Y-%m-%d %H:%M:%S")
      }
      difficulty
      maximum(of: transaction_count, get: transaction_count)
      transactionCount
    }
  }
}
```

Swap the sort to `desc: "difficulty"` or `desc: "blockSizeBigInt"` for different angles. Add `date: {since: ..., till: ...}` to search inside a specific window, or use `average(of: transaction_count)` for average transactions per block.

## Related resources

- [Bitcoin Transactions API](/docs/blockchain/Bitcoin/bitcoin-transactions-api) — per-block transaction details and fees
- [Bitcoin Inputs and Outputs API](/docs/blockchain/Bitcoin/bitcoin-inputs-outputs) — UTXO data and miner rewards
- [Bitcoin Kafka stream](/docs/streams/protobuf/chains/Bitcoin-protobuf) — real-time block and transaction delivery
