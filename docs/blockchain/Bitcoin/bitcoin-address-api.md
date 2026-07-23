---
title: Bitcoin Address API - Get BTC Balance, UTXO Activity & USD Values
sidebar_label: Bitcoin Address API
description: Query Bitcoin address balances from raw UTXOs, balance at a historical block height, multi-address aggregates, first/last active timestamps, and per-period activity.
keywords:
  - Bitcoin address API
  - Bitcoin balance API
  - BTC wallet balance
  - Bitcoin UTXO balance
  - Bitcoin address activity
  - Bitcoin GraphQL
  - Bitcoin historical balance
  - addressStats Bitcoin
  - Bitquery Bitcoin
---
# Bitcoin Address API

Bitcoin doesn't store account balances on-chain — there is no `getBalance` call. The reliable way to get an address balance is to sum every UTXO the address received (outputs) and subtract every UTXO it has spent (inputs). Bitquery indexes that UTXO data and pairs every value with the BTC/USD price at the time of the transaction, so you can pull current balances, historical balances at a specific block, or full activity timelines in a single request.

:::info Endpoint
Bitcoin GraphQL queries are served at `https://graphql.bitquery.io`.
:::

## Get a Bitcoin address balance from UTXOs (recommended)

Returns total BTC sent (inputs) and received (outputs) for an address, along with USD-equivalent values and first / last activity dates. Subtract `inputs.value` from `outputs.value` to get the current balance.

```graphql
{
  bitcoin(network: bitcoin) {
    inputs(
      inputAddress: {is: "bc1ppu6akjngyvpxwz0w38n4evcygwh08tjtmcc0dx6ft2zzgkxtd97stwehcq"}
    ) {
      count
      value
      value_usd: value(in: USD)
      min_date: minimum(of: date)
      max_date: maximum(of: date)
    }
    outputs(
      outputAddress: {is: "bc1ppu6akjngyvpxwz0w38n4evcygwh08tjtmcc0dx6ft2zzgkxtd97stwehcq"}
    ) {
      count
      value
      value_usd: value(in: USD)
      min_date: minimum(of: date)
      max_date: maximum(of: date)
    }
  }
}
```

## Get a Bitcoin address balance via addressStats

`addressStats` is a pre-aggregated view — fast, but it can lag the chain. Use it for quick lookups and dashboards; use the UTXO sum above when you need exact, up-to-the-block accuracy. [Run query](https://ide.bitquery.io/Bitcoin-balance_5).

:::caution
`addressStats` is pre-aggregated and may occasionally be out of date. For precise balance math, use the inputs / outputs query above.
:::

```graphql
{
  bitcoin(network: bitcoin) {
    addressStats(address: {is: "bc1q6xra3s8c5c4vr8m5f9htkuc3neyn4zykv5seua"}) {
      address {
        balance
        inboundTransactions
        firstActive {
          time
        }
        address
        annotation
        outflows
        lastActive {
          time
        }
        uniqueSenders
        uniqueReceivers
      }
    }
  }
}
```

## Get a Bitcoin balance at a specific block height

Need to know what a wallet held at a particular point in time? The `height` filter caps inputs and outputs at a given block number, which is exactly what you need for audits, tax reporting, and point-in-time portfolio snapshots. Balance at that height equals `outputs.value - inputs.value`. [Run query](https://ide.bitquery.io/bitcoin-balance-at-a-given-height).

```graphql
{
  bitcoin(network: bitcoin) {
    inputs(
      inputAddress: {is: "bc1ppu6akjngyvpxwz0w38n4evcygwh08tjtmcc0dx6ft2zzgkxtd97stwehcq"}
      height: {lteq: 944000}
    ) {
      count
      value
      value_usd: value(in: USD)
      min_date: minimum(of: date)
      max_date: maximum(of: date)
    }
    outputs(
      outputAddress: {is: "bc1ppu6akjngyvpxwz0w38n4evcygwh08tjtmcc0dx6ft2zzgkxtd97stwehcq"}
      height: {lteq: 944000}
    ) {
      count
      value
      value_usd: value(in: USD)
      min_date: minimum(of: date)
      max_date: maximum(of: date)
    }
  }
}
```

## Aggregate balances for multiple Bitcoin addresses in one call

Pass an array of addresses to `inputAddress` and `outputAddress` with `{in: [...]}` to get per-wallet totals in a single request. Useful for exchanges, custodians, and portfolio dashboards that monitor many wallets at once. [Run query](https://ide.bitquery.io/BTC-balance-API-for-multiple-addresses).

```graphql
{
  bitcoin(network: bitcoin) {
    inputs(
      inputAddress: {in: ["bc1ppu6akjngyvpxwz0w38n4evcygwh08tjtmcc0dx6ft2zzgkxtd97stwehcq", "bc1p2gel5e7ny42epalps3vddqrwedqh8ca4v6fdjem3pa3930ltl90s2cfg6e"]}
    ) {
      count
      value
      value_usd: value(in: USD)
      min_date: minimum(of: date)
      max_date: maximum(of: date)
      inputAddress {
        address
      }
    }
    outputs(
      outputAddress: {in: ["bc1ppu6akjngyvpxwz0w38n4evcygwh08tjtmcc0dx6ft2zzgkxtd97stwehcq", "bc1p2gel5e7ny42epalps3vddqrwedqh8ca4v6fdjem3pa3930ltl90s2cfg6e"]}
    ) {
      count
      value
      value_usd: value(in: USD)
      min_date: minimum(of: date)
      max_date: maximum(of: date)
      outputAddress {
        address
      }
    }
  }
}
```

## Get a Bitcoin address's first and last active timestamps

Quick way to find when a wallet first appeared on-chain and the last time it transacted. Useful for wallet age analysis, dormant-address screening, and compliance checks.

:::caution
`addressStats` is pre-aggregated and may occasionally be inaccurate. For precise timestamps, query inputs and outputs directly with `minimum(of: date)` and `maximum(of: date)`.
:::

```graphql
query ($network: BitcoinNetwork!) {
  bitcoin(network: $network) {
    addressStats(address: {is: "ADDRESS_HERE"}) {
      address {
        firstActive {
          year
          month
          dayOfMonth
        }
        lastActive {
          year
          month
          dayOfMonth
        }
      }
    }
  }
}
```

Replace `ADDRESS_HERE` with the Bitcoin address you want to inspect.

## List inputs and outputs for an address over a date range

Returns every UTXO an address spent or received inside a time window, with block height, timestamp, transaction hash, output index, BTC value, and USD-equivalent. Use it for transaction reports, payment reconciliation, and per-period wallet activity feeds. [Run query](https://ide.bitquery.io/Input-and-outputs-of-a-bitcoin-address).

```graphql
{
  bitcoin(network: bitcoin) {
    outputs(
      date: {since: "2024-03-19", till: "2024-03-26"}
      outputAddress: {is: "bc1p2gel5e7ny42epalps3vddqrwedqh8ca4v6fdjem3pa3930ltl90s2cfg6e"}
      options: {desc: ["block.height", "outputIndex"], limit: 10, offset: 0}
    ) {
      block {
        height
        timestamp {
          time(format: "%Y-%m-%d %H:%M:%S")
        }
      }
      transaction {
        hash
      }
      outputIndex
      outputDirection
      value
      value_usd: value(in: USD)
    }
    inputs(
      date: {since: "2024-03-19", till: "2024-03-26"}
      inputAddress: {is: "bc1p2gel5e7ny42epalps3vddqrwedqh8ca4v6fdjem3pa3930ltl90s2cfg6e"}
      options: {desc: ["block.height", "transaction.index"], limit: 10, offset: 0}
    ) {
      block {
        height
        timestamp {
          time(format: "%Y-%m-%d %H:%M:%S")
        }
      }
      outputTransaction {
        hash
        index
      }
      transaction {
        hash
        index
      }
      inputIndex
      value
      value_usd: value(in: USD)
    }
  }
}
```

## Related resources

- [Bitcoin Inputs and Outputs API](/docs/blockchain/Bitcoin/bitcoin-inputs-outputs) — more UTXO patterns, miner rewards, and historical BTC price
- [Bitcoin Transactions API](/docs/blockchain/Bitcoin/bitcoin-transactions-api) — per-tx detail and pagination
- [Bitcoin Coinpath API](/docs/blockchain/Bitcoin/bitcoin-coinpath-api) — multi-hop fund tracing
