---
title: Cardano Coinpath API - Trace ADA Flows Across Multiple Hops
sidebar_label: Cardano Coinpath API
description: "Cardano Coinpath API - Trace ADA Flows Across Multiple Hops: query and stream Cardano on-chain data with Bitquery GraphQL examples for developers."
keywords:
  - Cardano coinpath API
  - Cardano fund tracing
  - ADA flow analysis
  - Cardano forensics
  - eUTXO tracing
  - Cardano compliance API
  - Cardano GraphQL
  - Bitquery Cardano
---
# Cardano Coinpath API

Coinpath walks ADA flows between Cardano addresses across multiple hops — forward to see where funds went, backward to see where they came from. Because Cardano uses an eUTXO model, the API stitches chains of UTXOs together and returns senders, receivers, hop depth, amounts, and transaction counts at each level. Common use cases: AML / compliance screening, DAO treasury audits, exchange deposit tracing, and source-of-funds verification.

:::info Endpoint
Cardano GraphQL queries are served at `https://graphql.bitquery.io`.
:::

## Trace inbound and outbound ADA flows for an address

This query runs both directions in one request. The `inbound` block walks backward from the initial address to find fund sources; the `outbound` block walks forward to find destinations. Each side is capped at 2 hops with up to 2 paths per hop — a good starting point before widening for deeper investigations.

```graphql
{
  cardano(network: cardano) {
    inbound: coinpath(
      currency: {is: "ADA"}
      initialAddress: {is: "addr1q8hq60cyqg68aqfzs9geq084yj0tvvpm7rnckn6gsf3ahyrwak0antyvs6lyd7ymqg2zp6q8999vsdadmpm70x93f8msd7uwux"}
      depth: {lteq: 2}
      options: {direction: inbound, asc: "depth", desc: "amount", limitBy: {each: "depth", limit: 2}}
      date: {since: "2023-11-30", till: "2023-12-18"}
    ) {
      sender {
        address
        annotation
      }
      receiver {
        address
        annotation
      }
      amount
      depth
      count
    }
    outbound: coinpath(
      currency: {is: "ADA"}
      initialAddress: {is: "addr1q8hq60cyqg68aqfzs9geq084yj0tvvpm7rnckn6gsf3ahyrwak0antyvs6lyd7ymqg2zp6q8999vsdadmpm70x93f8msd7uwux"}
      depth: {lteq: 2}
      options: {asc: "depth", desc: "amount", limitBy: {each: "depth", limit: 2}}
      date: {since: "2023-11-30", till: "2023-12-18"}
    ) {
      sender {
        address
        annotation
      }
      receiver {
        address
        annotation
      }
      amount
      depth
      count
    }
  }
}
```

Raise `depth: {lteq: N}` (typically 3–5) for broader tracing, increase `limitBy.limit` for more paths per hop, and widen the `date` window. Keep only the block you need if a single direction is enough.

## Deeper outbound ADA trace

Walk forward from an address up to 3 hops deep with 5 paths per hop — a compact view that covers more ground than the 2-hop example above. Returns `amount`, `depth`, and `count` per hop, which is enough for most DAO treasury audits and fraud investigations.

```graphql
{
  cardano(network: cardano) {
    coinpath(
      currency: {is: "ADA"}
      initialAddress: {is: "addr1q8hq60cyqg68aqfzs9geq084yj0tvvpm7rnckn6gsf3ahyrwak0antyvs6lyd7ymqg2zp6q8999vsdadmpm70x93f8msd7uwux"}
      depth: {lteq: 3}
      options: {asc: "depth", desc: "amount", limitBy: {each: "depth", limit: 5}}
      date: {since: "2023-01-01", till: "2023-12-31"}
    ) {
      sender {
        address
        annotation
      }
      receiver {
        address
        annotation
      }
      amount
      depth
      count
    }
  }
}
```

For forensic work, depths of 5–7 are common. Add `direction: inbound` to `options` to flip the trace. If you're running the same query repeatedly in parallel and want to bypass intermediate-stage caching, set `options: {seed: 110, ...}` with any random integer.

## Related resources

- [Cardano Address API](/docs/blockchain/Cardano/address) — wallet balances, staking, and `addressStats`
- [Cardano Inputs and Outputs API](/docs/blockchain/Cardano/inputs-outputs) — UTXO-level inflows and outflows
