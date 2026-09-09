---
title: "Meteora DAMM v1 API: Dynamic AMM Trades and Pools"
sidebar_label: "Meteora DAMM v1 API"
description: "Meteora DAMM v1 (Dynamic AMM) API on Solana: swaps with USD price, OHLC candles, top traders, volume and pool liquidity on the amm program via Bitquery."
keywords:
  - Meteora DAMM v1 API
  - Meteora Dynamic AMM
  - Meteora DYN API
  - Meteora amm program
  - Meteora DAMM v1 program ID
  - Meteora stable pools
  - Meteora LST pools
  - Meteora API
  - Solana DEX API
---

import FAQ from "@site/src/components/FAQ";

# Meteora DAMM v1 API

Meteora DAMM v1 is the Dynamic AMM, Meteora's original constant-product pool program on Solana, at `Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB`. It runs stable pools for pegged assets, LST pools for staked SOL, and full-range pools whose idle reserves can earn extra yield through Meteora's Dynamic Vaults. Bitquery reads its swaps, prices, candles, traders and reserves over GraphQL, WebSocket, Kafka and gRPC.

Meteora files DAMM v1 under legacy products. The pools that exist keep trading, and the deepest of them are still meaningful markets for staked SOL and stablecoins, but **new DAMM v1 pools are no longer being created**: new launches go to DAMM v2, and Dynamic Bonding Curve graduations now migrate into DAMM v2 as well. Plan integrations around the pools that exist rather than around pool creation.

:::note This page was previously published as the Meteora DYN API
"DYN" was our shorthand, not a Meteora product name. The program, the URL and every query here are unchanged; only the naming now matches [Meteora's own documentation](https://docs.meteora.ag/legacy-products/damm-v1/what-is-damm-v1).
:::

:::tip Start with the Trading API
The [**Trading API**](/docs/trading/trading-data-overview) answers most questions on this page fastest. [`Trading.Trades`](/docs/trading/crypto-trades-api/trades-api) returns **MEV-filtered swaps with USD price, market cap and supply on every row**, and [`Trading.Pairs`](/docs/trading/crypto-price-api/pairs) gives pre-aggregated OHLC per pool down to one second. Filter either with `Market: { Protocol: { is: "amm" } }` and `Network: { is: "Solana" }` for DAMM v1.

Drop to the chain-level cubes for pool reserves and for history older than about 30 days.
:::

:::note
To query or stream data via GraphQL **outside the Bitquery IDE**, you need to generate an API access token.

Follow the steps here to create one: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

## What is the Meteora DAMM v1 program ID on Solana? {#track-latest-created-pools-on-meteora-dyn}

The Dynamic AMM program is `Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB` on Solana mainnet, and Meteora uses the same address on devnet. Two related programs sit beside it: Dynamic Vault at `24Uqj9JCLxUeoC3hGfh5W3s9FM9uCHDS2SG3LYwBpyTi`, which earns yield on idle reserves, and Farming at `FarmuwXPWXvefWUeqFAa5w6rifLkq5X6E8bimYvrhCB1`.

```
Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB
```

In the Trading cubes DAMM v1 is `Market.Protocol` `amm`. In the Solana chain-level cubes the rows carry `Dex.ProtocolName` `amm` and `Dex.ProtocolFamily` `Meteora`. Method names on this program are camelCase, as on DLMM: swaps are `swap`, liquidity moves are `addBalanceLiquidity` and `removeBalanceLiquidity`. DAMM v2 and DBC use snake_case instead, so do not copy method spellings between Meteora pages.

Meteora runs four trading programs on Solana, each with its own Bitquery page:

| Meteora program | Program ID | Protocol name | Bitquery page |
| --- | --- | --- | --- |
| DAMM v1, the legacy Dynamic AMM | `Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB` | `amm` | This page |
| DAMM v2, constant-product pools with position NFTs | `cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG` | `cp_amm` | [Meteora DAMM v2 API](/docs/blockchain/Solana/Meteora-DAMM-v2-API/) |
| DLMM, concentrated liquidity in price bins | `LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo` | `lb_clmm` | [Meteora DLMM API](/docs/blockchain/Solana/Meteora-DLMM-API/) |
| Dynamic Bonding Curve, launches that graduate to a DAMM pool | `dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN` | `dynamic_bonding_curve` | [Meteora DBC API](/docs/blockchain/Solana/meteora-dynamic-bonding-curve-api/) |

## Does Meteora have an API?

Yes, for pool-level data. Meteora publishes a free REST [DAMM v1 Data API](https://docs.meteora.ag/developer-guides/damm-v1/api-reference/overview) at `https://damm-api.meteora.ag`, limited to 10 requests a second with no key, covering pool state and related vault data. It has no per-swap trade endpoint, no per-wallet swap history and no streaming. Bitquery reads the same activity from the chain: swaps as individual rows with the trader and a USD price, reserves after every liquidity change, and history back to mid-2024.

## Which DAMM v1 pools are still active

Since new pools are not being created, the useful starting point is a ranking of the pools that exist. This returns the busiest DAMM v1 markets over the last 24 hours by USD volume.

```graphql
{
  Trading {
    Pairs(
      limit: { count: 25 }
      orderBy: { descendingByField: "usd" }
      where: {
        Market: { Protocol: { is: "amm" }, Network: { is: "Solana" } }
        Price: { IsQuotedInUsd: true }
        Interval: { Time: { Duration: { eq: 3600 } } }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      Market {
        Address
      }
      Token {
        Symbol
        Address
      }
      QuoteToken {
        Symbol
      }
      usd: sum(of: Volume_Usd)
    }
  }
}
```

The examples below use JitoSOL (`J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn`), whose WSOL pool `ERgpKaq59Nnfm9YRVAAhnq16cZhHxGcDoDWCzXbhiaNw` is the deepest DAMM v1 market and one of the LST pools the program was built for.

## Meteora DAMM v1 trades in real time {#meteora-dyn-trades-in-real-time}

Stream every decoded DAMM v1 swap with the trader, both amounts and the USD price.

```graphql
subscription {
  Trading {
    Trades(
      where: {
        Pair: { Market: { Protocol: { is: "amm" }, Network: { is: "Solana" } } }
      }
    ) {
      Block {
        Time
      }
      Side
      Price
      PriceInUsd
      Trader {
        Address
      }
      Amounts {
        Base
        Quote
      }
      AmountsInUsd {
        Base
        Quote
      }
      TransactionHeader {
        Hash
      }
      Pair {
        Market {
          Address
          Protocol
        }
        Token {
          Symbol
          Address
        }
        QuoteToken {
          Symbol
          Address
        }
      }
    }
  }
}
```

Add `Pair: { Token: { Address: { is: "<mint>" } } }` to follow one token. For the lowest latency the same swaps are on the Kafka topic `solana.dextrades.proto` and the [gRPC DEX trades topic](/docs/grpc/solana/topics/dextrades/); filter on `ProtocolName` `amm` in the consumer.

## Latest price of a token on Meteora DAMM v1 {#latest-price-of-a-token-on-meteora-dyn}

`Trading.Pairs` returns the latest interval for the pool with OHLC, average price and volume already computed. `Price: { IsQuotedInUsd: true }` matters: every market publishes each interval twice, once in USD and once in the quote token.

```graphql
{
  Trading {
    Pairs(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        Token: { Address: { is: "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn" } }
        Market: { Protocol: { is: "amm" }, Network: { is: "Solana" } }
        Price: { IsQuotedInUsd: true }
        Interval: { Time: { Duration: { eq: 60 } } }
      }
    ) {
      Block {
        Time
      }
      Token {
        Symbol
        Address
      }
      QuoteToken {
        Symbol
      }
      Market {
        Address
      }
      Price {
        Ohlc {
          Open
          High
          Low
          Close
        }
        Average {
          Mean
        }
      }
      Volume {
        Usd
        Base
      }
    }
  }
}
```

This is the price **on DAMM v1**. For a token's price across every venue, weighted to its deepest market, drop the protocol filter and add `Ranking: { Position: { eq: 1 } }` as described in [most accurate token price](/docs/trading/crypto-price-api/pairs/#most-accurate-token-price). On a legacy program the two often differ, because the token's main market has usually moved elsewhere.

## Real-time price feed of a token on Meteora DAMM v1 {#realtime-price-feed-of-a-token-on-meteora-dyn}

The same filter as a subscription, at one-second intervals.

```graphql
subscription {
  Trading {
    Pairs(
      where: {
        Token: { Address: { is: "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn" } }
        Market: { Protocol: { is: "amm" }, Network: { is: "Solana" } }
        Price: { IsQuotedInUsd: true }
        Interval: { Time: { Duration: { eq: 1 } } }
      }
    ) {
      Block {
        Time
      }
      Token {
        Symbol
      }
      QuoteToken {
        Symbol
      }
      Market {
        Address
      }
      Price {
        Ohlc {
          Open
          High
          Low
          Close
        }
      }
      Volume {
        Usd
      }
    }
  }
}
```

## Meteora DAMM v1 OHLC API {#meteora-dyn-ohlc-api}

Candles come pre-built from `Trading.Pairs`. Set `Interval.Time.Duration` in seconds: 1, 60 or 3600.

```graphql
{
  Trading {
    Pairs(
      limit: { count: 30 }
      orderBy: { descending: Block_Time }
      where: {
        Token: { Address: { is: "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn" } }
        Market: { Protocol: { is: "amm" }, Network: { is: "Solana" } }
        Price: { IsQuotedInUsd: true }
        Interval: { Time: { Duration: { eq: 3600 } } }
      }
    ) {
      Block {
        Time
      }
      Market {
        Address
      }
      QuoteToken {
        Symbol
      }
      Price {
        Ohlc {
          Open
          High
          Low
          Close
        }
      }
      Volume {
        Usd
        Base
        Quote
      }
    }
  }
}
```

## Top traders of a token on Meteora DAMM v1 {#get-the-top-traders-of-a-specific-token-on-meteora-dyn-dex}

Ranks wallets by USD volume over the last 24 hours, one row per wallet, with the USD each bought and sold.

:::note
Run this as a query, not a subscription. Aggregates over WebSocket return partial results.
:::

```graphql
query TopTraders($token: String) {
  Trading {
    Trades(
      limit: { count: 100 }
      orderBy: { descendingByField: "volumeUsd" }
      where: {
        Pair: {
          Market: { Protocol: { is: "amm" }, Network: { is: "Solana" } }
          Token: { Address: { is: $token } }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      Trader {
        Address
      }
      volumeUsd: sum(of: AmountsInUsd_Base)
      bought: sum(of: AmountsInUsd_Base, if: { Side: { is: "Buy" } })
      sold: sum(of: AmountsInUsd_Base, if: { Side: { is: "Sell" } })
      buys: count(if: { Side: { is: "Buy" } })
      sells: count(if: { Side: { is: "Sell" } })
      trades: count
    }
  }
}
{
  "token": "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn"
}
```

## Trading volume, buy volume and sell volume {#get-trading-volume-buy-volume-sell-volume-of-a-token}

Seven-day totals on DAMM v1: USD volume, the buy and sell split, trade counts and distinct wallets. Drop the `Token` filter for the whole program.

```graphql
{
  Trading {
    Trades(
      where: {
        Pair: {
          Market: { Protocol: { is: "amm" }, Network: { is: "Solana" } }
          Token: {
            Address: { is: "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn" }
          }
        }
        Block: { Time: { since_relative: { days_ago: 7 } } }
      }
    ) {
      volumeUsd: sum(of: AmountsInUsd_Base)
      buy_volume: sum(of: AmountsInUsd_Base, if: { Side: { is: "Buy" } })
      sell_volume: sum(of: AmountsInUsd_Base, if: { Side: { is: "Sell" } })
      buys: count(if: { Side: { is: "Buy" } })
      sells: count(if: { Side: { is: "Sell" } })
      traders: count(distinct: Trader_Address)
    }
  }
}
```

## Liquidity of a Meteora DAMM v1 pool

`DEXPools` records reserves after each swap, deposit or withdrawal it decodes. This returns the latest state of the JitoSOL/WSOL pool.

:::note
`DEXPools` is a realtime-only cube: it keeps roughly the last 12 hours and has no archive dataset. See [data coverage and retention](/docs/graphql/data-coverage-retention/).
:::

```graphql
{
  Solana {
    DEXPools(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        Pool: {
          Market: {
            MarketAddress: { is: "ERgpKaq59Nnfm9YRVAAhnq16cZhHxGcDoDWCzXbhiaNw" }
          }
          Dex: {
            ProgramAddress: { is: "Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB" }
          }
        }
      }
    ) {
      Block {
        Time
      }
      Pool {
        Market {
          MarketAddress
          BaseCurrency {
            Symbol
            MintAddress
          }
          QuoteCurrency {
            Symbol
            MintAddress
          }
        }
        Dex {
          ProtocolName
          ProtocolFamily
        }
        Base {
          ChangeAmount
          PostAmount
          PostAmountInUSD
        }
        Quote {
          ChangeAmount
          PostAmount
          PostAmountInUSD
          PriceInUSD
        }
      }
    }
  }
}
```

Liquidity still moves on DAMM v1 through `addBalanceLiquidity` and `removeBalanceLiquidity`, though rarely. To watch it, subscribe to the same cube filtered by the program and keep rows where either reserve moved, using `any` over `Base` and `Quote`.

## Historical Meteora DAMM v1 trades

The Trading cubes hold about 30 days. For older data use `DEXTradeByTokens` with `dataset: archive`, which reaches back to mid-2024. This returns monthly trade counts and JitoSOL volume on DAMM v1.

:::caution Aggregate in native amounts on `archive` and `combined`, not USD
Summing `Trade_Side_AmountInUSD` on the Solana `archive` and `combined` datasets does not aggregate cleanly: adding it to a grouped query shatters one row per month into many partial rows, and `combined` also returns fewer trades than `realtime` over the same window. Aggregate `Trade_Amount` instead, and take USD figures from the Trading cubes.
:::

```graphql
{
  Solana(dataset: archive) {
    DEXTradeByTokens(
      orderBy: { descendingByField: "Block_month" }
      where: {
        Block: { Time: { since: "2025-01-01T00:00:00Z" } }
        Transaction: { Result: { Success: true } }
        Trade: {
          Currency: {
            MintAddress: { is: "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn" }
          }
          Dex: {
            ProgramAddress: { is: "Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB" }
          }
        }
      }
    ) {
      Block {
        month: Time(interval: { in: months, count: 1 })
      }
      volume_jitosol: sum(of: Trade_Amount)
      trades: count
    }
  }
}
```

## API key, free trial and pricing

Create an access token at [account.bitquery.io](https://account.bitquery.io/) and follow [how to generate a token](/docs/authorization/how-to-generate/). The free trial runs for seven days and includes 1,000 API points, 100 MCP credits and two simultaneous streams. Request rate limits by plan are 30 a minute on Personal, 90 on Pro and 240 on Scale, with custom limits on Enterprise; see [rate limits](/docs/plans/rate-limits/). Plan prices are on the [Solana DEX API product page](https://bitquery.io/products/solana-dex-api) and the [pricing page](https://bitquery.io/pricing).

<FAQ
  items={[
    { q: "What is Meteora DAMM v1, and what happened to the DYN API page?", a: "DAMM v1 is Meteora's original Dynamic AMM on Solana, at program Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB. Bitquery previously published this page as the Meteora DYN API; DYN was our shorthand rather than a Meteora product name. The program, the URL and the queries are unchanged." },
    { q: "Are new Meteora DAMM v1 pools still being created?", a: "No. Meteora files DAMM v1 under legacy products, and no pool-creation instructions have been observed on the program recently. New launches go to DAMM v2, and Dynamic Bonding Curve graduations migrate into DAMM v2. Existing DAMM v1 pools keep trading normally." },
    { q: "What is the Meteora DAMM v1 program ID on Solana?", a: "Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB, the same on mainnet and devnet. Dynamic Vault is 24Uqj9JCLxUeoC3hGfh5W3s9FM9uCHDS2SG3LYwBpyTi and Farming is FarmuwXPWXvefWUeqFAa5w6rifLkq5X6E8bimYvrhCB1. In Bitquery data DAMM v1 is Market.Protocol amm in the Trading cubes and ProtocolName amm, family Meteora, in the Solana cubes." },
    { q: "Does Meteora have an API for DAMM v1?", a: "Yes, for pool-level data: a free REST API at damm-api.meteora.ag, limited to 10 requests a second with no key, covering pool and vault state. It has no per-swap trade endpoint and no streaming, which is what the queries on this page provide." },
    { q: "Which DAMM v1 pools are worth integrating?", a: "The deepest remaining markets are LST and stablecoin pools, which is what the program was built for. Run the pool ranking query on this page to list the busiest DAMM v1 markets by USD volume over the last 24 hours before hardcoding any pool address." },
    { q: "What is the difference between Meteora DAMM v1 and DAMM v2?", a: "DAMM v1 is the legacy Dynamic AMM with full-range liquidity, stable and LST pool types, and Dynamic Vault yield on idle reserves. DAMM v2 is the current constant-product program with position NFTs, optional concentrated ranges and an anti-sniper fee schedule. They are separate programs with separate Bitquery pages." },
    { q: "Can I get historical Meteora DAMM v1 data?", a: "Yes. The Trading cubes hold about 30 days. For older data use Solana.DEXTradeByTokens with dataset archive, which reaches back to mid-2024, aggregating native Trade_Amount rather than Trade_Side_AmountInUSD, which does not aggregate cleanly on archive or combined." },
  ]}
/>

## Related documentation

- [Meteora DAMM v2 API](/docs/blockchain/Solana/Meteora-DAMM-v2-API/), the current AMM
- [Meteora DLMM API](/docs/blockchain/Solana/Meteora-DLMM-API/)
- [Meteora Dynamic Bonding Curve API](/docs/blockchain/Solana/meteora-dynamic-bonding-curve-api/)
- [Trading API overview](/docs/trading/trading-data-overview/), [Trades cube](/docs/trading/crypto-trades-api/trades-api/) and [Pairs cube](/docs/trading/crypto-price-api/pairs/)
- [Solana DEX Trades API](/docs/blockchain/Solana/solana-dextrades/)
- [Data coverage and retention](/docs/graphql/data-coverage-retention/)
- [gRPC DEX trades topic](/docs/grpc/solana/topics/dextrades/) and [real-time Solana streams over Kafka](/docs/streams/real-time-solana-data/)
- [API Authorization](/docs/authorization/how-to-use/)

## Support

For technical support and questions contact our support team via telegram or create a ticket [here](https://support.bitquery.io/)
