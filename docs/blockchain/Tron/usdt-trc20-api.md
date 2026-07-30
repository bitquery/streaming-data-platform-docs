---
title: "TRC20 USDT API - Transfers, Holders & Flows"
description: "Query and stream USDT TRC20 on Tron with Bitquery GraphQL: live transfers, whale holders, exchange deposit flows, mempool, and cross-chain USDT comparison."
keywords:
  - TRC20 API
  - USDT TRC20 API
  - Tron USDT API
  - USDT transfers Tron
  - TRC20 token transfers
  - USDT holders Tron
  - Tron stablecoin API
---
# TRC20 USDT API

Tron carries more USDT transfer activity than any other chain, which makes TRC20 USDT the single most-queried asset in the Bitquery Tron dataset. This page covers the queries people actually need: live transfer and DEX-trade streams, whale holders, exchange deposit flows, mempool visibility, and a cross-chain comparison.

Every example uses the canonical USDT TRC20 contract:

```
TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
```

:::tip Looking for USDT beyond Tron?
This page is Tron-specific. For USDT price, payments, reserves and balances **across all supported chains**, see the [USDT Stablecoin API](/docs/stablecoin-APIs/usdt-api) and the broader [stablecoin API pages](/docs/category/stablecoin-apis). A single-request cross-chain comparison is included [below](#cross-chain).
:::

## Tether USD (USDT) transfers in real time

To monitor USDT transfers on Tron in real time, use the following subscription.
You can run the query [here](https://ide.bitquery.io/usdt-trc20-transfers_1)

```graphql
subscription {
  Tron {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"}}}}
    ) {
      Transaction {
        Hash
      }
      Transfer {
        Amount
        Sender
        Receiver
        Currency {
          SmartContract
          Symbol
          Name
          Fungible
          Native
        }
        Id
        AmountInUSD
      }
      Block {
        Number
      }
    }
  }
}
```

## Daily USDT TRC20 transfer volume {#daily-volume}

Daily transfer volume, transfer count and unique-address counts. Useful for stablecoin reports, market analytics and macro dashboards.

Using `since_relative` instead of a fixed timestamp keeps the query correct whenever it runs — a hardcoded date silently widens the window every day it sits in your codebase.

Run the query [here](https://ide.bitquery.io/daily-usdt-trc20-volume).

```graphql
query DailyUSDTVolumeTron {
  Tron {
    Transfers(
      where: {
        Transfer: { Currency: { SmartContract: { is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t" } } }
        Block: { Time: { since_relative: { days_ago: 30 } } }
        TransactionStatus: { Success: true }
      }
      orderBy: { ascendingByField: "Block_Date" }
    ) {
      Block {
        Date(interval: { count: 1, in: days })
      }
      transfers: count
      senders: uniq(of: Transfer_Sender)
      receivers: uniq(of: Transfer_Receiver)
      volume_usdt: sum(of: Transfer_Amount)
      volume_usd: sum(of: Transfer_AmountInUSD)
    }
  }
}
```

`TransactionStatus: { Success: true }` matters here — without it, reverted transfers inflate both the count and the volume.

## Largest USDT transfers (whale movements) {#whale-transfers}

Single transfers above a threshold, largest first. This is the fastest way to spot treasury moves, exchange rebalancing and OTC settlement.

```graphql
query LargestUSDTTransfers($min_amount: String, $since: DateTime) {
  Tron {
    Transfers(
      limit: { count: 25 }
      orderBy: { descending: Transfer_Amount }
      where: {
        Transfer: {
          Currency: { SmartContract: { is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t" } }
          Amount: { ge: $min_amount }
        }
        Block: { Time: { since: $since } }
        TransactionStatus: { Success: true }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Transfer {
        Amount
        Sender
        Receiver
      }
    }
  }
}
```

```json
{
  "min_amount": "1000000",
  "since": "2026-01-01T00:00:00Z"
}
```

## Top USDT receivers — finding exchange deposit addresses {#top-receivers}

Aggregating inbound transfers per receiver surfaces the busiest USDT destinations on Tron. Read two fields together and the address type becomes obvious:

- **High `inbound` count and high `distinct_senders`** → an exchange hot wallet or payment processor. Many unrelated parties paying one address.
- **High `received` but only a handful of senders** → a treasury, bridge or OTC desk. Few counterparties, large amounts.

```graphql
query TopUSDTReceivers($since: DateTime) {
  Tron {
    Transfers(
      limit: { count: 50 }
      orderBy: { descendingByField: "received" }
      where: {
        Transfer: { Currency: { SmartContract: { is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t" } } }
        Block: { Time: { since: $since } }
        TransactionStatus: { Success: true }
      }
    ) {
      Transfer {
        Receiver
      }
      received: sum(of: Transfer_Amount)
      inbound: count
      distinct_senders: uniq(of: Transfer_Sender)
    }
  }
}
```

Swap `Receiver` for `Sender` and `descendingByField: "sent"` to rank outbound flow instead — useful for spotting withdrawal hot wallets.

## USDT balance of an address {#balances}

Use the **`Balances`** cube for current token balances. It is live — no snapshot date needed — and returns USD value alongside the raw amount.

:::note Use `Balances`, not `BalanceUpdates`
`Balances` gives you the current balance directly. Summing `BalanceUpdates` to reconstruct a balance is slower, heavier, and easy to get wrong.
:::

```graphql
query USDTBalance($addresses: [String!]) {
  Tron {
    Balances(
      where: {
        Balance: { Address: { in: $addresses } }
        Currency: { SmartContract: { is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t" } }
      }
      orderBy: { descending: Balance_Amount }
    ) {
      Balance {
        Address
        Amount
        AmountInUSD
        UpdateCount
        FirstChangeTime
        LastChangeTime
      }
      Currency {
        Symbol
        Name
        SmartContract
      }
    }
  }
}
```

```json
{
  "addresses": [
    "TDqSquXBgUCLYvYC4XZgrprLK589dkhSCf",
    "TStieorQGxR7iVtUtUZPeyyVxQJR4TSQwu"
  ]
}
```

### Telling hot wallets from cold storage

`UpdateCount` alongside `FirstChangeTime` / `LastChangeTime` classifies an address without any labelling data:

- **Very high `UpdateCount`, `LastChangeTime` seconds ago** → exchange hot wallet or payment processor. Balance churns constantly.
- **Single-digit `UpdateCount` on a large balance** → cold storage, treasury or a custody wallet. Funded once, rarely touched.

Drop the `Balance.Address` filter and keep `Currency` to get every USDT balance the cube holds, but see the caution below first.

:::caution Ranking all USDT holders on Tron
USDT on Tron has tens of millions of holders. An unbounded `orderBy: { descending: Balance_Amount }` across all of them **times out server-side** on both `Balances` and `Holders` — this is a dataset-size limit, not a syntax problem.

The `Balances` filter accepts `Balance.Address` only, so it cannot be narrowed by amount. If you need a *top-N whale list* rather than specific addresses, use the `Holders` snapshot cube with an amount floor:

```graphql
query USDTWhales($floor: String, $date: String) {
  Tron {
    Holders(
      limit: { count: 100 }
      orderBy: { descending: Balance_Amount }
      date: $date
      where: {
        Currency: { SmartContract: { is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t" } }
        Balance: { Amount: { ge: $floor } }
      }
    ) {
      Holder {
        Address
      }
      Balance {
        Amount
      }
    }
  }
}
```

With `floor: "10000000"` this returns promptly. For a *complete* holder distribution, use [Bitquery Cloud exports](/docs/cloud/) or [Kafka streams](/docs/streams/protobuf/kafka-protobuf-python) rather than a synchronous GraphQL query. For TRC20 tokens far smaller than USDT you can drop the floor entirely.
:::

## USDT TRC20 DEX trades in real time

Real-time DEX trades where USDT is the bought currency on Tron — protocol, buyer and seller, amounts and order IDs.

Note that most USDT movement on Tron is plain transfers rather than DEX swaps, so this stream is far quieter than the transfer stream above. For trade-oriented work across chains, the [Trading API](/docs/trading/trading-data-overview) carries USD price, market cap and supply on every row.

You can run the query [here](https://ide.bitquery.io/USDT-TRC20-DEX-Trades)

```graphql
subscription {
  Tron {
    DEXTrades(
      where: {Trade: {Buy: {Currency: {SmartContract: {is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"}}}}}
    ) {
      Block {
        Time
      }
      Trade {
        Dex {
          ProtocolName
          ProtocolFamily
          SmartContract
        }
        Buy {
          Amount
          Buyer
          Seller
          Currency {
            Decimals
            Fungible
            HasURI
            Name
            ProtocolName
            SmartContract
            Symbol
          }
          OrderId
          AmountInUSD
        }
        Sell {
          Buyer
          Seller
          Currency {
            Fungible
            Decimals
            Name
            Native
            SmartContract
            Symbol
          }
          AmountInUSD
          Amount
        }
      }
    }
  }
}
```

## USDT across chains in one request {#cross-chain}

Because `Tron` and `EVM` are separate top-level selectors, you can alias several of them in a **single GraphQL request** and compare the same asset across networks without four round trips. This is the clearest demonstration of why a unified API beats per-chain RPC nodes.

The query below compares USDT transfer activity on Tron, Ethereum, BSC and Polygon over one window. Each chain uses its own USDT contract.

```graphql
query USDTAcrossChains($since: DateTime) {
  tron: Tron {
    Transfers(
      where: {
        Transfer: { Currency: { SmartContract: { is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t" } } }
        Block: { Time: { since: $since } }
        TransactionStatus: { Success: true }
      }
    ) {
      transfers: count
      senders: uniq(of: Transfer_Sender)
      receivers: uniq(of: Transfer_Receiver)
      volume: sum(of: Transfer_Amount)
    }
  }
  ethereum: EVM(network: eth) {
    Transfers(
      where: {
        Transfer: { Currency: { SmartContract: { is: "0xdac17f958d2ee523a2206206994597c13d831ec7" } } }
        Block: { Time: { since: $since } }
        TransactionStatus: { Success: true }
      }
    ) {
      transfers: count
      senders: uniq(of: Transfer_Sender)
      receivers: uniq(of: Transfer_Receiver)
      volume: sum(of: Transfer_Amount)
    }
  }
  bsc: EVM(network: bsc) {
    Transfers(
      where: {
        Transfer: { Currency: { SmartContract: { is: "0x55d398326f99059ff775485246999027b3197955" } } }
        Block: { Time: { since: $since } }
        TransactionStatus: { Success: true }
      }
    ) {
      transfers: count
      senders: uniq(of: Transfer_Sender)
      receivers: uniq(of: Transfer_Receiver)
      volume: sum(of: Transfer_Amount)
    }
  }
  polygon: EVM(network: matic) {
    Transfers(
      where: {
        Transfer: { Currency: { SmartContract: { is: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f" } } }
        Block: { Time: { since: $since } }
        TransactionStatus: { Success: true }
      }
    ) {
      transfers: count
      senders: uniq(of: Transfer_Sender)
      receivers: uniq(of: Transfer_Receiver)
      volume: sum(of: Transfer_Amount)
    }
  }
}
```

```json
{
  "since": "2026-07-29T00:00:00Z"
}
```

USDT contract addresses by chain:

| Chain | Selector | USDT contract | Reported symbol |
| --- | --- | --- | --- |
| Tron | `Tron` | `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t` | `USDT` |
| Ethereum | `EVM(network: eth)` | `0xdac17f958d2ee523a2206206994597c13d831ec7` | `USDT` |
| BNB Smart Chain | `EVM(network: bsc)` | `0x55d398326f99059ff775485246999027b3197955` | `USDT` |
| Polygon | `EVM(network: matic)` | `0xc2132d05d31c914a87c6611c10748aeb04b58e8f` | `USDT0` |

:::note Transfer counts are not comparable to volume
Chains differ enormously in how USDT is used: some see very high transfer counts at small average size, others fewer and much larger transfers. Always read `transfers` and `volume` together — ranking chains on either one alone will mislead you. Note too that Polygon's bridged Tether reports as `USDT0`, so filter by contract, not symbol.
:::

## TRC20 mempool transfers

Pending USDT transfers from the Tron mempool, before inclusion in a block — transaction hash, amount, sender and receiver, and the anticipated block number.

```graphql
subscription {
  Tron(mempool: true) {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"}}}}
    ) {
      Transaction {
        Hash
      }
      Transfer {
        Amount
        Sender
        Receiver
        Currency {
          SmartContract
          Symbol
          Name
          Fungible
          Native
        }
        Id
        AmountInUSD
      }
      Block {
        Number
      }
    }
  }
}
```

## Related APIs

- [USDT Stablecoin API](/docs/stablecoin-APIs/usdt-api) — USDT price, payments, reserves and balances across chains
- [Tron Transfers API](/docs/blockchain/Tron/tron-transfers) — all TRC10/TRC20 and native TRX transfers
- [Tron DEX Trades API](/docs/blockchain/Tron/tron-dextrades) — SunSwap and other Tron DEX activity
- [SunSwap API](/docs/blockchain/Tron/sunswap-api) — Tron's largest DEX
- [Trading API overview](/docs/trading/trading-data-overview) — structured trades and prices across 9 chains
