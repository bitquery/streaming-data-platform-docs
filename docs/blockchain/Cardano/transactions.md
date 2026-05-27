---
title: Cardano Transactions API - Fees, Inputs, Outputs & Mints
sidebar_label: Cardano Transactions API
description: Query Cardano transactions with input and output totals, fees in ADA and USD, mint counts, withdrawals, and daily transaction counts via Bitquery GraphQL.
keywords:
  - Cardano transactions API
  - Cardano fee API
  - Cardano transaction count
  - Cardano mintCount
  - Cardano withdrawal API
  - Cardano GraphQL
  - ADA transaction fees
  - Bitquery Cardano
---

# Cardano Transactions API

The Transactions API returns transaction-level data on Cardano: input and output totals, fees in ADA and USD, mint counts, withdrawals, and block context. Use it for daily reporting, fee analysis, spotting outlier transactions, and building activity dashboards.

:::info Endpoint
Cardano GraphQL queries are served at `https://graphql.bitquery.io`.
:::

## Get Cardano transactions for a specific date

Pull 10 transactions from a single day with full economic context — input value in ADA and USD, fee value in ADA and USD, mint count, withdrawal totals, output value, and input/output counts.

```graphql
{
  cardano(network: cardano) {
    transactions(options: {limit: 10}, date: {is: "2023-11-29"}) {
      block {
        timestamp {
          time(format: "%Y-%m-%d %H:%M:%S")
        }
        height
      }
      hash
      index
      inputValue
      input_value_usd: inputValue(in: USD)
      outputValue
      inputCount
      outputCount
      feeValue
      fee_value_usd: feeValue(in: USD)
      mintCount
      withdrawalValue
      withdrawalCount
    }
  }
}
```

Switch `date: {is: ...}` to `date: {since: ..., till: ...}` for a range, sort with `options: {desc: ["block.height", "index"], limit: 10}` to pull the latest, or add `feeValue: {gt: ...}` to surface high-fee transactions only.

## Count daily Cardano transactions

Aggregate the total transaction count per day for the last 10 days. Useful for activity dashboards, throughput monitoring, and spotting unusual spikes.

```graphql
{
  cardano(network: cardano) {
    transactions(options: {desc: "date.date", limit: 10}) {
      date {
        date
      }
      count
    }
  }
}
```

Use `startOfInterval(unit: day, interval: 10)` for coarser buckets, raise `limit` for more days, or add a `date: {since: ..., till: ...}` window.

## Related resources

- [Cardano Blocks API](https://docs.bitquery.io/docs/blockchain/Cardano/blocks) — block-level lookups and time-window queries
- [Cardano Inputs and Outputs API](https://docs.bitquery.io/docs/blockchain/Cardano/inputs-outputs) — UTXO-level transaction data
- [Cardano Mints API](https://docs.bitquery.io/docs/blockchain/Cardano/mints) — drill into the mint events behind `mintCount`
