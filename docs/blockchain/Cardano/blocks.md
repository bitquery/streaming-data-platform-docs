---
title: Cardano Blocks API - Query Blocks by Height, Slot & Epoch
sidebar_label: Cardano Blocks API
description: "Cardano Blocks API - Query Blocks by Height, Slot & Epoch: query and stream Cardano on-chain data with Bitquery GraphQL examples for developers."
keywords:
  - Cardano blocks API
  - Cardano block explorer API
  - Cardano epoch slot API
  - slot leader API
  - VRF key Cardano
  - Cardano GraphQL
  - Cardano block height query
  - Bitquery Cardano
---
# Cardano Blocks API

The Blocks API exposes everything you'd expect from a Cardano block: height, hash, size, protocol version, epoch and slot context, slot-leader metadata, VRF key, transaction count, and timestamp. Use it to power explorer front-ends, monitor chain progression, or pull historical block context for downstream analytics.

:::info Endpoint
Cardano GraphQL queries are served at `https://graphql.bitquery.io`.
:::

## Look up a Cardano block by height

Fetch a single block by its height. The response carries the block hash, size and protocol version, epoch and slot context, operational certificate, slot-leader description and hash, VRF key, transaction count, and the production timestamp.

```graphql
query {
  cardano(network: cardano) {
    blocks(height: {is: 9612373}) {
      timestamp {
        time(format: "%Y-%m-%d %H:%M:%S")
      }
      blockHash
      blockSize
      blockVersion
      transactionCount
      epoch
      opCert
      slot
      slotInEpoch
      slotLeaderDescription
      slotLeaderHash
      vrfKey
      height
    }
  }
}
```

To look up by hash instead, swap `height` for `blockHash: {is: "..."}`. To pull several blocks in one request, pass an array with `height: {in: [...]}`.

## List recent Cardano blocks in a time window

Get the 10 most recent blocks produced between two timestamps. Handy for explorer recent-block widgets, throughput dashboards, and watching slot leaders across an epoch.

```graphql
{
  cardano(network: cardano) {
    blocks(
      options: {desc: "height", limit: 10, offset: 0}
      time: {since: "2023-11-30T06:10:00Z", till: "2023-11-30T06:17:00Z"}
    ) {
      height
      blockHash
      blockSize
      transactionCount
      epoch
      slot
      slotInEpoch
      timestamp {
        time(format: "%Y-%m-%d %H:%M:%S")
      }
    }
  }
}
```

Sort ascending with `asc: "height"` to walk the chain forward, and widen the `time` window for longer scans.

## Related resources

- [Cardano Transactions API](/docs/blockchain/Cardano/transactions) — per-block transaction details and fees
- [Cardano Inputs and Outputs API](/docs/blockchain/Cardano/inputs-outputs) — UTXO data tied to each transaction
