---
title: Djed Stablecoin API on Cardano - Track DJED Mints, Burns & Transfers
sidebar_label: Djed Stablecoin API on Cardano
description: Query the Djed stablecoin on Cardano with Bitquery GraphQL. Track DJED mints, burns, recent transfers, wallet balances, and per-address DJED activity.
keywords:
  - Djed API
  - DJED Cardano
  - Djed stablecoin API
  - Cardano stablecoin
  - DjedMicroUSD
  - Cardano native token API
  - Cardano GraphQL
  - Bitquery Djed
  - DJED supply tracking
---

# Djed Stablecoin API

[Djed](https://djed.xyz) is an overcollateralized, USD-pegged stablecoin on Cardano, issued by COTI and designed in collaboration with Input Output Global. It trades under the ticker **DJED** (asset name `DjedMicroUSD`) and is backed by ADA reserves. Every issuance is an on-chain **mint** of the DJED native token, and every redemption is a **burn** — which means Djed's full lifecycle maps cleanly onto Bitquery's existing Cardano primitives:

- Mint and burn activity → [Cardano Mints API](https://docs.bitquery.io/docs/blockchain/Cardano/mints)
- Holder balances → [Cardano Address API](https://docs.bitquery.io/docs/blockchain/Cardano/address)
- Movements between wallets → [Cardano Inputs and Outputs API](https://docs.bitquery.io/docs/blockchain/Cardano/inputs-outputs)

You can verify the on-chain asset on Cardanoscan: [DjedMicroUSD token page](https://cardanoscan.io/token/8db269c3ec630e06ae29f74bc39edd1f87c819f1056206e879a1cd61446a65644d6963726f555344).

:::info Endpoint
Cardano GraphQL queries are served at `https://graphql.bitquery.io`.
:::

## How to filter for DJED in Bitquery

Bitquery's `currency: {is: "..."}` filter on Cardano matches native tokens by their **`tokenId`** — the [CIP-14 asset fingerprint](https://cips.cardano.org/cip/CIP-0014). For DJED, that value is:

```graphql
currency: {is: "asset15f3ymkjafxxeunv5gtdl54g5qs8ty9k84tq94x"}
```

The asset name / symbol (`DjedMicroUSD`) and the `currency.address` field are **not** usable as filter values — Bitquery returns `currency.address` as `"-"` for Cardano native tokens. Always filter by the `tokenId` fingerprint above.

## Recent DJED mint and burn events

Pulls the 25 most recent DJED mint events, filtered server-side. A positive `value` is a mint (DJED issued against ADA collateral), a negative `value` is a burn (redemption). Useful for tracking Djed supply changes, correlating large mints with ADA price moves, or driving an issuance dashboard.

```graphql
{
  cardano(network: cardano) {
    mints(
      currency: {is: "asset15f3ymkjafxxeunv5gtdl54g5qs8ty9k84tq94x"}
      options: {limit: 25, desc: "block.height"}
    ) {
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

Sort with `desc: "value"` to surface the largest single mints and burns. Tighten the `date` filter or raise `limit` for deeper history.

## Wallet's DJED and ADA balances

Returns every asset a Cardano address holds, plus stake and rewards context. The `balance` block lists one entry per currency, so ADA and every native token in the wallet — including DJED — come back in the same response. On the client, match `currency.tokenId == "asset15f3ymkjafxxeunv5gtdl54g5qs8ty9k84tq94x"` to pull out just the DJED position.

Good for portfolio tracking of Djed holders, wallet-level risk analytics, or balance widgets in Djed-aware wallet UIs.

```graphql
{
  cardano(network: cardano) {
    address(
      address: {is: "addr1q8de89fu0j09gze96nf8mfrcz056tw8nz35lqkr46zn52j9cvtjm8enawhyjjkcf6eves2cwz4c8y9tvhjuzpvmu4rwstxfht5"}
    ) {
      address {
        address
        annotation
      }
      balance {
        value
        currency {
          name
          symbol
          decimals
          tokenId
          tokenType
        }
      }
      staking {
        controlledTotalStake
        stakedAmount
        stakedAmountWithRewards
        rewardsAmount
        rewardsAvailable
        withdrawnAmount
        address {
          address
          annotation
        }
      }
    }
  }
}
```

Drop the `staking` block when you don't need stake context, or pair this with `addressStats` (see the [Cardano Address API](https://docs.bitquery.io/docs/blockchain/Cardano/address)) to combine per-asset balances with aggregate activity metrics in a single request.

## Recent DJED movements network-wide

Lists the 10 most recent DJED movements across the chain. In the eUTXO model, `inputs` are UTXOs being spent (DJED "sent") and `outputs` are UTXOs being created (DJED "received"). Each row carries block height and timestamp, transaction hash, counterparty address, UTXO index, raw DJED `value`, and USD-equivalent `value_usd`. Good for live activity feeds, recent-transfers widgets, or auditing large DJED transactions.

```graphql
{
  cardano(network: cardano) {
    inputs(
      currency: {is: "asset15f3ymkjafxxeunv5gtdl54g5qs8ty9k84tq94x"}
      options: {desc: "block.height", limit: 10}
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
      inputAddress {
        address
        annotation
      }
      inputIndex
      value
      value_usd: value(in: USD)
      currency {
        name
        symbol
        tokenId
      }
    }
    outputs(
      currency: {is: "asset15f3ymkjafxxeunv5gtdl54g5qs8ty9k84tq94x"}
      options: {desc: "block.height", limit: 10}
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
      outputAddress {
        address
        annotation
      }
      outputIndex
      outputDirection
      value
      value_usd: value(in: USD)
      currency {
        name
        symbol
        tokenId
      }
    }
  }
}
```

Replace the `options` block with aggregates (`count`, `value(calculate: sum)`, `value(in: USD, calculate: sum)`) when you want totals instead of a row-level list.

## DJED received by a specific address

Lists the 20 most recent DJED-bearing UTXOs received by an address, with block context, transaction hash, output index, DJED `value`, and USD equivalent. "Received" in eUTXO terms means the address appears as the `outputAddress` on a UTXO that contains DJED. Useful for merchant payment ingestion, on-chain invoicing, and exchange deposit monitoring.

```graphql
{
  cardano(network: cardano) {
    outputs(
      currency: {is: "asset15f3ymkjafxxeunv5gtdl54g5qs8ty9k84tq94x"}
      outputAddress: {is: "addr1q8de89fu0j09gze96nf8mfrcz056tw8nz35lqkr46zn52j9cvtjm8enawhyjjkcf6eves2cwz4c8y9tvhjuzpvmu4rwstxfht5"}
      options: {desc: "block.height", limit: 20}
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
        name
        symbol
        tokenId
      }
    }
  }
}
```

Pass `outputAddress: {in: [...]}` with a list of addresses to aggregate receipts across several wallets. Replace `options` with aggregates to get totals received instead of per-UTXO rows.

## DJED sent by a specific address

Same idea as above, in reverse. Lists the 20 most recent DJED-bearing UTXOs spent by an address — i.e. UTXOs where the address appears as `inputAddress` and the UTXO is being consumed. Useful for outflow tracking, spend-side accounting, and tax reporting.

```graphql
{
  cardano(network: cardano) {
    inputs(
      currency: {is: "asset15f3ymkjafxxeunv5gtdl54g5qs8ty9k84tq94x"}
      inputAddress: {is: "addr1q8de89fu0j09gze96nf8mfrcz056tw8nz35lqkr46zn52j9cvtjm8enawhyjjkcf6eves2cwz4c8y9tvhjuzpvmu4rwstxfht5"}
      options: {desc: "block.height", limit: 20}
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
      inputIndex
      value
      value_usd: value(in: USD)
      currency {
        name
        symbol
        tokenId
      }
    }
  }
}
```

Combine this with the "received" query above to reconstruct a wallet's complete DJED ledger — net DJED held equals the sum of received `value` minus the sum of sent `value`.

## Related resources

- [Cardano Mints API](https://docs.bitquery.io/docs/blockchain/Cardano/mints) — generic mint and burn query patterns
- [Cardano Address API](https://docs.bitquery.io/docs/blockchain/Cardano/address) — wallet balances and the `addressStats` cube
- [Cardano Inputs and Outputs API](https://docs.bitquery.io/docs/blockchain/Cardano/inputs-outputs) — full UTXO query reference
- [Cardano Coinpath API](https://docs.bitquery.io/docs/blockchain/Cardano/coinpath) — multi-hop fund tracing
- [Djed official site](https://djed.xyz)
- [Djed app (mint / redeem UI)](https://app.djed.xyz/)
- [Djed launch announcement on COTI Medium](https://medium.com/cotinetwork/a-new-era-for-stablecoins-begins-djed-is-live-on-mainnet-55971971f2a8)
