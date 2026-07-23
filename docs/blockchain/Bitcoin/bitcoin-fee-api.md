---
title: Bitcoin Fee API - Get Per-Tx Fees, USD Fees, and Address Aggregates
sidebar_label: Bitcoin Fee API
description: Query Bitcoin transaction fees with per-tx breakdowns and aggregate totals in BTC and USD. Useful for fee estimation, wallet expense tracking, and cost analysis.
keywords:
  - Bitcoin fee API
  - Bitcoin transaction fees
  - Bitcoin fee estimation
  - BTC fee in USD
  - Bitcoin wallet expenses
  - Bitcoin GraphQL
  - Bitcoin fee aggregates
  - Bitquery Bitcoin
---
# Bitcoin Fee API

Query Bitcoin transaction fees at the per-transaction level or aggregated across an address or time window — in BTC and USD. Use it for fee estimation, wallet expense tracking, and historical fee trend analysis.

:::info Endpoint
Bitcoin GraphQL queries are served at `https://graphql.bitquery.io`.
:::

import VideoPlayer from "../../../src/components/videoplayer.js";

## List Bitcoin transactions with per-tx fees in BTC and USD

Pulls transactions for a specific address on a given day with per-transaction fee amounts (BTC and USD), input/output values, and counts. [Run query](https://ide.bitquery.io/bitcoin-trxn-fees-for-a-account_2).

```graphql
query MyQuery {
  bitcoin(network: bitcoin) {
    transactions(
      options: {limit: 10, desc: ["block.height"]}
      date: {is: "2025-05-08"}
      inputAddress: {is: "bc1qrtjvr4d8qtstw5334mspp7rmrzl55uj3dcwj09"}
    ) {
      block {
        timestamp {
          iso8601
        }
        height
      }
      feeValue
      feeInUSD: feeValue(in: USD)
      feeValueDecimal
      hash
      index
      inputValue
      inputCountBigInt
      inputCount
      outputValueDecimal
      outputValue
      outputCountBigInt
      outputCount
      inputValueDecimal
    }
  }
}
```

Drop the `inputAddress` filter to see fees across all transactions, add `date: {since: ..., till: ...}` for a window, or sort by `feeValue` to surface the highest-fee transactions first.

## Sum total Bitcoin fees paid by an address on a single day

Aggregate total fees paid by an address with `feeValue(calculate: sum)` in both BTC and USD. [Run query](https://ide.bitquery.io/Get-Total-fees-paid-by-an-account-on-Bitcoin-network).

```graphql
query MyQuery {
  bitcoin(network: bitcoin) {
    transactions(
      date: {is: "2025-05-08"}
      inputAddress: {is: "bc1qrtjvr4d8qtstw5334mspp7rmrzl55uj3dcwj09"}
    ) {
      total_fees_in_usd: feeValue(calculate: sum, in: USD)
      total_fees: feeValue(calculate: sum)
    }
  }
}
```

Change `date` to a range for multi-day totals, drop `inputAddress` for a network-wide aggregate, or add `feeValue(calculate: average)` for average fee per transaction.

## Video tutorial: getting Bitcoin transaction fee data

<VideoPlayer url="https://www.youtube.com/watch?v=OR_7gQT71D4" />

## Related resources

- [Bitcoin Transactions API](/docs/blockchain/Bitcoin/bitcoin-transactions-api) — full transaction query patterns
- [Bitcoin Address API](/docs/blockchain/Bitcoin/bitcoin-address-api) — address balances and activity
- [Bitcoin Inputs and Outputs API](/docs/blockchain/Bitcoin/bitcoin-inputs-outputs) — UTXO-level detail
