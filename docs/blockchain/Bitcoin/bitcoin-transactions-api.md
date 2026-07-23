---
title: "Bitcoin Transactions API"
sidebar_label: Bitcoin Transactions API
description: "Bitcoin Transactions API: query and stream Bitcoin on-chain data with Bitquery GraphQL examples for developers. Run it in the IDE, then ship in your app."
keywords:
  - Bitcoin transactions API
  - Bitcoin transaction history
  - Bitcoin fee API
  - Bitcoin transaction count
  - Bitcoin GraphQL
  - BTC transaction list
  - Bitcoin address transactions
  - Bitquery Bitcoin
---
# Bitcoin Transactions API

The Transactions API returns transaction-level data on Bitcoin: input and output totals in BTC and USD, fees, input/output counts, block context, and per-address transaction history. Use it for paginated transaction feeds, daily activity dashboards, fee trend analysis, and wallet history widgets.

:::info Endpoint
Bitcoin GraphQL queries are served at `https://graphql.bitquery.io`.
:::

## Get the latest Bitcoin transactions with fees and transfer values

A reusable query that takes `limit`, `offset`, and a date range as variables. Returns input value (BTC and USD), output count, input count, fees (BTC and USD), and block context — the standard shape for paginated transaction feeds.

```graphql
query ($network: BitcoinNetwork!, $limit: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
  bitcoin(network: $network) {
    transactions(
      options: {desc: ["block.height", "index"], limit: $limit, offset: $offset}
      time: {since: $from, till: $till}
    ) {
      block {
        timestamp {
          time(format: "%Y-%m-%d %H:%M:%S")
        }
        height
      }
      inputValue
      input_value_usd: inputValue(in: USD)
      outputCount
      inputCount
      index
      hash
      feeValue
      fee_value_usd: feeValue(in: USD)
    }
  }
}
```

Adjust `limit` and `offset` for pagination, narrow with `inputAddress` or `outputAddress` for a single wallet, or add `hash: {is: "..."}` for a single-transaction lookup.

## Daily Bitcoin transaction count and average fee

Aggregate transactions by day to track network throughput and fee trends over time. Returns one row per day with the total transaction count, total fees, and average fee per transaction.

```graphql
query ($network: BitcoinNetwork!, $dateFormat: String!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
  bitcoin(network: $network) {
    transactions(options: {asc: "date.date"}, date: {since: $from, till: $till}) {
      date: date {
        date(format: $dateFormat)
      }
      count: countBigInt
      feeValue
      avgFee: feeValue(calculate: average)
    }
  }
}
```

Use `feeValue(calculate: median)` for median fees, or add `count(uniq: addresses)` to get daily active address counts alongside the fee stats.

## List Bitcoin transactions sent from a specific address

Returns every transaction where a given address appears on the input side — the standard query for an outbound wallet history.

```graphql
query ($network: BitcoinNetwork!) {
  bitcoin(network: $network) {
    transactions(
      options: {desc: ["block.height"]}
      inputAddress: {is: "bc1p4kufll9uhnpkgzuc65slcxd2qaw2hl9xecket3h8yyu4awglcsqslqaztd"}
    ) {
      block {
        timestamp {
          time(format: "%Y-%m-%d %H:%M:%S")
        }
        height
      }
      inputValue
      hash
      feeValue
      outputValue
    }
  }
}
```

Swap `inputAddress` for `outputAddress` to see received transactions instead. Add `date` for a window, `limit` / `offset` for pagination, and `inputValue(in: USD)` / `outputValue(in: USD)` for USD-equivalent amounts.

## Related resources

- [Bitcoin Blocks API](/docs/blockchain/Bitcoin/bitcoin-blocks-api) — block-level lookups and stats
- [Bitcoin Inputs and Outputs API](/docs/blockchain/Bitcoin/bitcoin-inputs-outputs) — UTXO-level transaction detail
- [Bitcoin Fee API](/docs/blockchain/Bitcoin/bitcoin-fee-api) — focused fee queries and aggregates
- [Bitcoin Address API](/docs/blockchain/Bitcoin/bitcoin-address-api) — wallet balances and activity stats
