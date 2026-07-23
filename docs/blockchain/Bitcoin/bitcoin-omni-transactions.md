---
title: Bitcoin Omni Layer API - Track USDT on Bitcoin and Other Omni Tokens
sidebar_label: Bitcoin Omni Layer API
description: Query Omni Layer transactions and transfers on Bitcoin with Bitquery GraphQL. Track USDT-on-Bitcoin and other Omni-issued assets with senders, receivers, and fees.
keywords:
  - Bitcoin Omni Layer API
  - Omni Layer GraphQL
  - USDT on Bitcoin API
  - Omni transactions
  - Omni transfers
  - Bitcoin token API
  - Bitcoin GraphQL
  - Bitquery Omni
---
# Bitcoin Omni Layer API

The Omni Layer is a protocol built on top of Bitcoin for issuing and trading custom tokens — most famously the original Bitcoin-issued USDT. These APIs return Omni-specific transaction and transfer data so you can track issuance, redemptions, and per-address Omni token activity directly on the Bitcoin chain.

:::info Endpoint
Bitcoin GraphQL queries are served at `https://graphql.bitquery.io`.
:::

## Get the latest Omni transactions on Bitcoin

Returns the 10 most recent Omni Layer transactions with block height, timestamp, fee in USD, transaction hash, and sender address — ordered by block height descending.

```graphql
query ($network: BitcoinNetwork!) {
  bitcoin(network: $network) {
    omniTransactions(
      options: {desc: "block.height", limit: 10}
      date: {after: "2023-11-20"}
    ) {
      block {
        height
      }
      blockHash
      date {
        date
      }
      feeValue(in: USD)
      hash
      index
      txSender
    }
  }
}
```

Filter by sender with `txSender: {is: "..."}`, narrow with a different `date` window, or add `limit` / `offset` for pagination.

## List Omni transfers for a specific address

Returns every Omni token transfer originating from a given Bitcoin address — block hash, sender (`transferFrom`), and receiver (`transferTo`). Replace `ADDRESS_HERE` with the wallet you want to inspect.

```graphql
query ($network: BitcoinNetwork!) {
  bitcoin(network: $network) {
    omniTransfers(options: {desc: "block.height"}, txSender: {is: "ADDRESS_HERE"}) {
      block {
        height
      }
      blockHash
      transferFrom
      transferTo
    }
  }
}
```

Filter incoming transfers with `transferTo: {is: "..."}` instead, add a `date` window to scope a period, or extend the query with currency / amount fields to identify which Omni token moved.

## Related resources

- [Bitcoin Transactions API](/docs/blockchain/Bitcoin/bitcoin-transactions-api) — base-layer Bitcoin transactions
- [Bitcoin Address API](/docs/blockchain/Bitcoin/bitcoin-address-api) — address balances and activity
- [Bitcoin Coinpath API](/docs/blockchain/Bitcoin/bitcoin-coinpath-api) — multi-hop BTC fund tracing
