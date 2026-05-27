---
title: Bitcoin Coinpath API - Trace BTC Fund Flows Across Addresses
sidebar_label: Bitcoin Coinpath API
description: Trace Bitcoin fund flows between addresses with Bitquery Coinpath. Track inbound and outbound paths, multi-hop tracing, and address-to-address verification for AML and forensics.
keywords:
  - Bitcoin coinpath API
  - Bitcoin fund tracing
  - BTC flow analysis
  - Bitcoin AML
  - Bitcoin forensics API
  - Bitcoin transaction path
  - Bitcoin GraphQL
  - Bitquery Bitcoin
---

# Bitcoin Coinpath API

Coinpath walks Bitcoin fund flows between addresses — forward to see where funds went, backward to see where they came from. Use it for AML investigations, source-of-funds verification, exchange deposit tracing, and mapping transaction paths across wallets.

:::info Endpoint
Bitcoin GraphQL queries are served at `https://graphql.bitquery.io`.
:::

## Trace outbound fund flow from a Bitcoin address

Returns direct recipients of an address with USD amounts, block heights, and transaction hashes. The `seed` option controls the starting point for repeated runs when you want consistent samples. [Run query](https://ide.bitquery.io/Destination-of-Funds-from-a-Specific-Address-on-Bitcoin).

```graphql
{
  bitcoin(network: bitcoin) {
    coinpath(
      initialAddress: {is: "bc1p4kufll9uhnpkgzuc65slcxd2qaw2hl9xecket3h8yyu4awglcsqslqaztd"}
      date: {after: "2023-10-10"}
      options: {limit: 10, asc: "block.height", seed: 10}
    ) {
      amount(in: USD)
      block {
        height
      }
      sender {
        address
      }
      receiver {
        address
      }
      transaction {
        hash
      }
      currency {
        name
        address
      }
    }
  }
}
```

For multi-hop tracing, add `depth: {lteq: N}` (typically 3–5; deeper for forensic work). Switch direction with `options: {direction: inbound}` to walk backward instead.

## Track all incoming fund paths to a Bitcoin address

Use the `receiver` filter to see who sent BTC to a specific wallet. Returns sender addresses, USD amounts, and transaction hashes — the standard "who funded this wallet?" query.

```graphql
query ($network: BitcoinNetwork!) {
  bitcoin(network: $network) {
    coinpath(
      date: {after: "2023-10-10"}
      options: {limit: 10, desc: "block.height"}
      receiver: {is: "bc1p4kufll9uhnpkgzuc65slcxd2qaw2hl9xecket3h8yyu4awglcsqslqaztd"}
    ) {
      amount(in: USD)
      block {
        height
      }
      sender {
        address
      }
      receiver {
        address
      }
      transaction {
        hash
      }
    }
  }
}
```

Swap `receiver` for `sender` to trace outflows instead, or add `initialAddress` to find paths between two specific addresses.

## Verify a path between two specific Bitcoin addresses

Combine `initialAddress` and `receiver` to check whether BTC moved from address A to address B — useful for chain-of-custody verification and direct flow auditing.

```graphql
query ($network: BitcoinNetwork!) {
  bitcoin(network: $network) {
    coinpath(
      date: {after: "2023-10-10"}
      options: {limit: 10, desc: "block.height"}
      receiver: {is: "bc1p4kufll9uhnpkgzuc65slcxd2qaw2hl9xecket3h8yyu4awglcsqslqaztd"}
      initialAddress: {is: "bc1pu349c0fvmqnv5s0aj3aracrsvn696hzhuyyukn6r5c9h03y88plql53h5h"}
    ) {
      amount(in: USD)
      block {
        height
      }
      sender {
        address
      }
      receiver {
        address
      }
      transaction {
        hash
      }
    }
  }
}
```

Raise `limit` for more rows and add `depth: {lteq: N}` to follow multi-hop paths between the two addresses.

import VideoPlayer from "../../../src/components/videoplayer.js";

## Video tutorial: tracing Bitcoin fund flows

<VideoPlayer url="https://www.youtube.com/watch?v=pEVNAhfEOJ4" />

## Related resources

- [Bitcoin Address API](https://docs.bitquery.io/docs/blockchain/Bitcoin/bitcoin-address-api) — balances and activity stats
- [Bitcoin Inputs and Outputs API](https://docs.bitquery.io/docs/blockchain/Bitcoin/bitcoin-inputs-outputs) — UTXO-level inflows and outflows
- [Bitcoin Transactions API](https://docs.bitquery.io/docs/blockchain/Bitcoin/bitcoin-transactions-api) — per-tx detail
