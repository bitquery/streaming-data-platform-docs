---
title: "Cardano Mints API - Track Native Token Mints"
sidebar_label: Cardano Mints API
description: "Cardano Mints API - Track Native Token Mints: query and stream Cardano on-chain data with Bitquery GraphQL examples for developers."
keywords:
  - Cardano mints API
  - Cardano native tokens API
  - Cardano NFT mint API
  - Cardano policy ID
  - Cardano burn events
  - Cardano token issuance
  - Cardano GraphQL
  - Bitquery Cardano
---
# Cardano Mints API

Cardano doesn't mint tokens through smart contracts the way EVM chains do. Every native token — fungible or NFT — is issued under a **minting policy**, and every mint or burn shows up on-chain as a single event tied to that policy. The Mints API exposes those events with amounts, transaction hash, block context, and the full asset metadata. Use it to track NFT collection drops, fungible-token issuance, stablecoin supply changes, or any kind of on-chain supply movement.

:::info Endpoint
Cardano GraphQL queries are served at `https://graphql.bitquery.io`.
:::

## Get recent Cardano mint and burn events

Pull the 10 most recent mint events across every minting policy on a given date. The `value` field is signed: positive numbers are mints, negative numbers are burns. Each result includes block height and timestamp, transaction hash and index, and full currency metadata — including the policy-based `address`, asset name, symbol, `tokenId` (CIP-14 fingerprint), `tokenType`, and decimals.

```graphql
{
  cardano(network: cardano) {
    mints(options: {limit: 10, desc: "block.height"}, date: {is: "2026-05-01"}) {
      block {
        height
        timestamp {
          time(format: "%Y-%m-%d %H:%M:%S")
        }
      }
      value
      transaction {
        hash
        index
      }
      currency {
        address
        name
        symbol
        tokenId
        tokenType
        decimals
      }
    }
  }
}
```

To find the largest single mints, sort by `desc: "value"`. To filter by a specific policy or asset, add `currency: {is: "<asset fingerprint>"}` — see the [DJED examples](/docs/blockchain/Cardano/djed) for the pattern. On Cardano, the policy ID is the first 56 hex characters of `currency.address`; the remainder is the hex-encoded asset name.

## Aggregate Cardano mints by month

Get monthly mint counts by pulling `mintCount` from the `transactions` cube. Returns one row per month with the total mint count, input and output values, and fees — a compact view for tracking issuance trends across quarters or years.

```graphql
{
  cardano(network: cardano) {
    transactions(
      options: {desc: "date.month", limit: 12}
      date: {since: "2023-01-01", till: "2023-12-31"}
    ) {
      date {
        month
        startOfInterval(unit: month)
      }
      mintCount(calculate: sum)
      inputValue
      input_value_usd: inputValue(in: USD)
      outputCount
      inputCount
      feeValue
      fee_value_usd: feeValue(in: USD)
    }
  }
}
```

Change `startOfInterval(unit: month)` to `week` or `day` for finer buckets. To drill from a monthly total down to the individual mint events, combine this query with the one above.

## Related resources

- [Djed Stablecoin API](/docs/blockchain/Cardano/djed) — currency-filtered mint and burn examples on a real asset
- [Cardano Transactions API](/docs/blockchain/Cardano/transactions) — full transaction context for mint events
