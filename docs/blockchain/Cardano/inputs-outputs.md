---
title: Cardano Inputs and Outputs API - UTXO Data & Address Balances
sidebar_label: Cardano Inputs & Outputs API
description: Query Cardano UTXO inputs and outputs to reconstruct address balances, list transfers in a date range, and build wallet activity feeds via Bitquery GraphQL.
keywords:
  - Cardano inputs outputs API
  - Cardano UTXO API
  - eUTXO API
  - Cardano address balance reconstruction
  - Cardano transfer history
  - Cardano GraphQL
  - ADA inputs outputs
  - Bitquery Cardano
---

# Cardano Inputs and Outputs API

Cardano runs on an **eUTXO** model — there are no account balances stored on-chain. To get an address's balance or activity you walk its inputs (UTXOs being spent) and outputs (UTXOs being received). These APIs return that UTXO-level data with transaction hash, output index, ADA and USD values, and block timestamps.

:::info Endpoint
Cardano GraphQL queries are served at `https://graphql.bitquery.io`.
:::

## Compute a Cardano address balance from UTXOs

In the eUTXO model, an address balance is simply `sum(outputs received) - sum(inputs spent)`. This query pulls both sides in one request, with total counts, ADA values, USD values, and the first / last active dates.

```graphql
{
  cardano(network: cardano) {
    inputs(
      currency: {is: "ADA"}
      inputAddress: {is: "addr1v9m34968vfwya2dydafkaq48ag9pzerznwjf0ewu4jj5vfsvgmyhk"}
    ) {
      count
      value
      value_usd: value(in: USD)
      min_date: minimum(of: date)
      max_date: maximum(of: date)
    }
    outputs(
      currency: {is: "ADA"}
      outputAddress: {is: "addr1v9m34968vfwya2dydafkaq48ag9pzerznwjf0ewu4jj5vfsvgmyhk"}
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

Add `date: {since: ..., till: ...}` to scope a window, pass `inputAddress: {in: [...]}` / `outputAddress: {in: [...]}` to aggregate across multiple wallets in one call, or drop the `currency: {is: "ADA"}` filter to include native tokens alongside ADA.

For the aggregate shortcut (with pre-computed inflows, outflows, counterparty counts, etc.) see the [`addressStats` query](https://docs.bitquery.io/docs/blockchain/Cardano/address#get-cardano-address-activity-stats-addressstats).

## List UTXO outputs received by a Cardano address

Return individual UTXOs received by an address inside a date window. Each row carries block height and timestamp, transaction hash, output index, output direction, and ADA / USD value. Use it for transaction reports, wallet activity feeds, or merchant payment ingestion.

```graphql
{
  cardano(network: cardano) {
    outputs(
      currency: {is: "ADA"}
      date: {since: "2022-10-19", till: "2022-10-26T23:59:59"}
      outputAddress: {is: "addr1qxz3ve4caaywwg6q82ax9l5xknyc7juvwwsw20cpugyz5gv9zent3m6guu35qw46vtlgddxf3a9ccuaqu5lsrcsg9gss69fhxw"}
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
      currency {
        symbol
      }
    }
  }
}
```

Swap `outputs` for `inputs` (and `outputAddress` for `inputAddress`) to see UTXOs the wallet has spent. Remove the `currency` filter entirely to include every asset type — native tokens included.

## Get the parsed datum of a Cardano transaction UTXO

Cardano UTXOs can carry inline `datum` — script-readable data attached to an output, used by Plutus smart contracts. This query returns all outputs for a given transaction hash and exposes the parsed datum inside `currency.properties` (in YAML-like format), so you don't have to decode CBOR yourself.

```graphql
query ($network: CardanoNetwork!, $hash: String!, $limit: Int!, $offset: Int!) {
  cardano(network: $network) {
    outputs(
      txHash: {is: $hash}
      options: {asc: "outputIndex", limit: $limit, offset: $offset}
    ) {
      outputIndex
      address: outputAddress {
        address
        annotation
      }
      value
      value_usd: value(in: USD)
      currency {
        symbol
        tokenType
        tokenId
        properties
        name
        decimals
        address
      }
      outputDirection
      date {
        date
      }
      transaction {
        hash
      }
      valueDecimal
    }
  }
}
```

Variables:

```json
{
  "limit": 10,
  "offset": 0,
  "network": "cardano",
  "hash": "6c83cf62225ecdf0cbb57e11718a8ec079f490b7f05d97f5a6d2214fb00be182"
}
```

The `properties` field on the currency object contains the parsed datum:

```
"properties": "---\nassetName: 494e4459\nfingerprint: asset1u8caujpkc0km4vlwxnd8f954lxphrc8l55ef3j\npolicyId: 533bb94a8850ee3ccbe483106489399112b74c905342cb1792a797a0\n",
```

## Related resources

- [Cardano Address API](https://docs.bitquery.io/docs/blockchain/Cardano/address) — balances, staking, and the `addressStats` aggregate cube
- [Cardano Coinpath API](https://docs.bitquery.io/docs/blockchain/Cardano/coinpath) — multi-hop ADA flow tracing across addresses
- [Cardano Transactions API](https://docs.bitquery.io/docs/blockchain/Cardano/transactions) — transaction-level totals and fees
