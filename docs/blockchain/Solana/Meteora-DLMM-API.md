---
title: "Meteora DLMM API: Trades, Pools, Prices & OHLC on Solana"
sidebar_label: "Meteora DLMM API"
description: "Meteora DLMM API on Solana: swaps, new pools, prices, OHLC candles, top traders, volume and pool liquidity via Bitquery GraphQL, WebSocket and Kafka."
keywords:
  - Meteora API
  - Meteora DLMM API
  - Meteora DLMM program ID
  - Meteora DLMM Solana
  - Meteora DLMM pools
  - Meteora DLMM OHLCV
  - Meteora DLMM trades
  - Meteora API documentation
  - does Meteora have an API
  - Solana DEX API
---

import FAQ from "@site/src/components/FAQ";

# Meteora DLMM API

Meteora DLMM (Dynamic Liquidity Market Maker) is Meteora's concentrated-liquidity DEX on Solana. It runs on the `lb_clmm` program at `LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo`, holds liquidity in discrete price bins, and raises fees when volatility rises. Bitquery reads that program's activity into GraphQL queries, WebSocket subscriptions, Kafka and gRPC streams: live swaps, new pools, token prices, OHLC candles, pool reserves, top traders and volume. Every query below runs as written in the [Bitquery IDE](https://ide.bitquery.io) with a free trial token. Meteora's own [DLMM Data API](#does-meteora-have-an-api) serves pool state, positions and per-pool candles but has no trade feed and no streaming; the queries below cover both, with history back to mid-2024.

:::tip Start with the Trading API
The [**Trading API**](/docs/trading/trading-data-overview) answers most questions on this page fastest. [`Trading.Trades`](/docs/trading/crypto-trades-api/trades-api) returns **MEV-filtered swaps with USD price, market cap and supply on every row**, across **9 chains in one API**, and [`Trading.Pairs`](/docs/trading/crypto-price-api/pairs) gives pre-aggregated OHLC per DLMM pool down to one second.

Drop to the chain-level cubes further down for what the Trading API does not carry: **history older than about 30 days**, pool reserves, and per-instruction detail such as pool creation.
:::

:::note
To query or stream data via GraphQL **outside the Bitquery IDE**, you need to generate an API access token.

Follow the steps here to create one: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

## What is the Meteora DLMM program ID on Solana?

The Meteora DLMM program, `lb_clmm`, is deployed at `LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo` on Solana mainnet, and Meteora uses the same address on devnet.

```
LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo
```

Filter the Solana trade cubes with `Trade: { Dex: { ProgramAddress: { is: "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo" } } }` and the `Instructions` cube with `Instruction: { Program: { Address: { is: "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo" } } }`. DLMM rows carry `ProtocolName` `lb_clmm` and `ProtocolFamily` `Meteora`; in the cross-chain Trading cube the venue is `Market.Protocol` `lb_clmm`.

Meteora runs four trading programs on Solana, each with its own Bitquery page:

| Meteora program | Program ID | `ProtocolName` / `Market.Protocol` | Bitquery page |
| --- | --- | --- | --- |
| DLMM, concentrated liquidity in price bins | `LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo` | `lb_clmm` | This page |
| DAMM v2, constant-product pools with position NFTs | `cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG` | `cp_amm` | [Meteora DAMM v2 API](/docs/blockchain/Solana/Meteora-DAMM-v2-API/) |
| DAMM v1, the legacy Dynamic AMM | `Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB` | `amm` | [Meteora DYN API](/docs/blockchain/Solana/Meteora-DYN-API/) |
| Dynamic Bonding Curve, token launches that graduate to a DAMM pool | `dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN` | `dynamic_bonding_curve` | [Meteora DBC API](/docs/blockchain/Solana/meteora-dynamic-bonding-curve-api/) |

Method names follow each program's IDL as Bitquery loaded it. DLMM methods are camelCase (`initializeLbPair2`, `swapExactOut2`) even though Meteora's current IDL file spells them `initialize_lb_pair2` and `swap_exact_out2`, while DBC and DAMM v2 methods are snake_case (`initialize_virtual_pool_with_spl_token`, `claim_position_fee`), so copy the spelling from the examples on each page. Rows named `Swap`, `LbPairCreate` or `EvtSwap` are the programs' event logs, emitted as inner instructions next to the real instruction. The trade cubes decode DLMM `swap` and `swap2` instructions wherever they run, including as inner instructions of aggregator routes through Jupiter and other routers, so filter trades by program address rather than by method.

## Does Meteora have an API?

Yes, for pool-level data. Meteora publishes a free REST [DLMM Data API](https://docs.meteora.ag/developer-guides/dlmm/api-reference/overview) at `https://dlmm.datapi.meteora.ag`, limited to 30 requests a second with no key, covering pools and pool groups, per-pool OHLCV and volume history, wallet portfolios, positions and PnL, limit orders and protocol stats. It has no per-swap trade endpoint, no per-wallet swap history and no streaming. The older `dlmm-api.meteora.ag` host and its `/pair/all` route have been superseded by it. Bitquery reads the same activity from the chain: swaps as individual rows, new pools the moment they are created, reserves after every liquidity change, and history back to mid-2024.

| | Meteora DLMM Data API | Bitquery Meteora DLMM API |
| --- | --- | --- |
| Access | REST, no key, 30 requests a second | GraphQL, WebSocket, Kafka and gRPC with an access token; seven-day free trial |
| Pools | Paginated pool list with search and windowed sorting; single-pool state | New pools as they are created; reserves after each decoded swap, deposit or withdrawal |
| Trades | No per-swap endpoint | Swaps as individual rows with trader, amounts, price, USD value and signature |
| Candles and volume | Per-pool OHLCV and volume history | OHLC at any interval from `DEXTradeByTokens`; pre-built candles from `Trading.Pairs` |
| Traders | Portfolio, positions and limit orders per wallet | Top traders, buy and sell volume per wallet, PnL from `Trading.Trades` |
| History | Per-pool candles and volume; depth not stated in the reference | `DEXTradeByTokens` back to mid-2024 on the `archive` dataset; realtime cubes hold hours to days |
| Rate limits | 30 requests a second | 30, 90 or 240 query requests a minute by plan, custom on Enterprise; streams are metered by stream entitlements, not per request |

## Real-time Meteora DLMM trades {#subscribe-to-realtime-dlmm-trades}

Stream every decoded DLMM swap with the trader, both amounts, the USD price and the token's market cap and circulating supply. `Side` is the trader's own side. This is where most integrations start.

```graphql
subscription {
  Trading {
    Trades(
      where: {
        Pair: { Market: { Protocol: { is: "lb_clmm" }, Network: { is: "Solana" } } }
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
      Supply {
        MarketCap
        CirculatingSupply
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

Add `Pair: { Token: { Address: { is: "<mint>" } } }` to follow one token, or `AmountsInUsd: { Base: { gt: 10000 } }` to watch only large trades. The same body runs as a query with `limit`, `orderBy: { descending: Block_Time }` and a `Block: { Time: { since_relative: { minutes_ago: 10 } } }` filter.

For the lowest latency the same swaps are on the Kafka topic `solana.dextrades.proto` and the [gRPC DEX trades topic](/docs/grpc/solana/topics/dextrades/); filter on `ProgramAddress` or on `ProtocolFamily` `Meteora` in the consumer. See the [Solana protobuf reference](/docs/streams/protobuf/chains/Solana-protobuf/) and [real-time Solana streams](/docs/streams/real-time-solana-data/).

:::note Some DLMM swaps are not decoded yet
The trade cubes decode DLMM `swap` and `swap2` instructions, including inside aggregator routes through Jupiter and other routers. Swaps sent as `swapExactOut`, `swapExactOut2` or `swapWithPriceImpact2` do not currently produce trade rows in either the chain-level or the Trading cubes, so DLMM volume read from any cube is lower than the on-chain total.
:::

## Latest price of a token on Meteora DLMM {#latest-price-of-a-token-on-meteora-dlmm}

The token examples below use TRUMP (`6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN`), which has traded on Meteora DLMM since its launch in January 2025; where a pool address is needed they use a TRUMP/USDC DLMM pool, `3C5YE97HADPDxZehYq9Cis8AXr9aNyrUsczKzE1nDbW9`. `Trading.Pairs` returns the latest interval for the pool with OHLC, average price, volume and market cap already computed.

`Price: { IsQuotedInUsd: true }` matters: every market publishes each interval twice, once in USD and once in the quote token.

```graphql
{
  Trading {
    Pairs(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        Token: { Address: { is: "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN" } }
        Market: { Protocol: { is: "lb_clmm" }, Network: { is: "Solana" } }
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
        Protocol
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
      Supply {
        MarketCap
        FullyDilutedValuationUsd
      }
    }
  }
}
```

This gives the price **on DLMM**, which is what you want on a venue page. For a token's price across every venue, weighted to its deepest market, drop the protocol filter and add `Ranking: { Position: { eq: 1 } }` as described in [most accurate token price](/docs/trading/crypto-price-api/pairs/#most-accurate-token-price).

## Real-time price feed of a token {#realtime-price-feed-of-a-token-on-meteora-dlmm}

The same filter as a subscription, at one-second intervals.

```graphql
subscription {
  Trading {
    Pairs(
      where: {
        Token: { Address: { is: "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN" } }
        Market: { Protocol: { is: "lb_clmm" }, Network: { is: "Solana" } }
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
      Supply {
        MarketCap
      }
    }
  }
}
```

## Meteora DLMM OHLC API {#meteora-dlmm-ohlc-api}

`Trading.Pairs` serves candles at whatever interval you ask for, so there is nothing to aggregate. Set `Interval.Time.Duration` in seconds: 1 for one-second candles, 60 for one-minute, 3600 for hourly.

```graphql
{
  Trading {
    Pairs(
      limit: { count: 30 }
      orderBy: { descending: Block_Time }
      where: {
        Token: { Address: { is: "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN" } }
        Market: { Protocol: { is: "lb_clmm" }, Network: { is: "Solana" } }
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

## Top traders of a token on Meteora DLMM {#get-the-top-traders-of-a-specific-token-on-meteora-dlmm-dex}

Ranks wallets by USD volume on DLMM over the last 24 hours, one row per wallet, with the USD each bought and sold. `Trading.Trades` reports `Side` from the trader's point of view, so the split needs no field gymnastics.

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
          Market: { Protocol: { is: "lb_clmm" }, Network: { is: "Solana" } }
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
  "token": "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN"
}
```

Subtracting `bought` from `sold` gives a rough realised PnL for the window. The [wallet PnL guide](/docs/trading/crypto-trades-api/wallet-pnl/) covers the full method.

## Trading volume, buy volume and sell volume of a token {#get-trading-volume-buy-volume-sell-volume-of-a-token}

Seven-day totals for TRUMP on DLMM: USD volume, the buy and sell split, trade counts and the number of distinct wallets. Change `days_ago` for other windows, up to the roughly 30-day Trading window. Drop the `Token` filter for the whole DLMM program.

```graphql
{
  Trading {
    Trades(
      where: {
        Pair: {
          Market: { Protocol: { is: "lb_clmm" }, Network: { is: "Solana" } }
          Token: { Address: { is: "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN" } }
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

## Chain-level DLMM data

The sections above cover trades, prices, candles, traders and volume through the Trading cubes. Three things live only in the Solana chain-level cubes: pool creation, pool reserves, and history older than the roughly 30-day Trading window. See [DEXTrades vs DEXTradeByTokens vs Trading.Trades](/docs/cubes/dextrades-dextradebytokens-trading-trades/) for the full comparison.

### New Meteora DLMM pools in real time {#latest-pool-creation-on-meteora-dlmm}

Every DLMM pool is an `LbPair` account created by one of the pool-creation instructions: `initializeLbPair2` for standard permissionless pools, `initializeCustomizablePermissionlessLbPair2` for pools with custom parameters, `initializePermissionLbPair` for permissioned launches, and the un-numbered legacy SPL-Token-only forms. This subscription emits one row per new pool. `Program.AccountNames` gives the meaning of each entry in `Instruction.Accounts` in order: the first account is the new pool address (`lbPair`), `tokenMintX` and `tokenMintY` are the two token mints, `reserveX` and `reserveY` the pool vaults, and `funder` the wallet that paid for the pool's creation. Pool creation is far less frequent than swaps, so expect this stream to stay quiet for minutes at a time. To list recent pools instead, run the same filter as a query with `Block: { Time: { since_relative: { hours_ago: 24 } } }`.

You can test the subscription [in the Bitquery IDE](https://ide.bitquery.io/Track-Latest-created-pools-on-Meteora-DLMM_1).

```graphql
subscription {
  Solana {
    Instructions(
      where: {
        Transaction: { Result: { Success: true } }
        Instruction: {
          Program: {
            Address: { is: "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo" }
            Method: {
              in: [
                "initializeLbPair2",
                "initializeCustomizablePermissionlessLbPair2",
                "initializePermissionLbPair",
                "initializeLbPair",
                "initializeCustomizablePermissionlessLbPair"
              ]
            }
          }
        }
      }
    ) {
      Block {
        Time
      }
      Instruction {
        Accounts {
          Address
          IsWritable
          Token {
            Mint
            Owner
            ProgramId
          }
        }
        Program {
          AccountNames
          Address
          Method
          Name
          Arguments {
            Name
            Type
            Value {
              ... on Solana_ABI_Integer_Value_Arg {
                integer
              }
              ... on Solana_ABI_String_Value_Arg {
                string
              }
              ... on Solana_ABI_Address_Value_Arg {
                address
              }
              ... on Solana_ABI_BigInt_Value_Arg {
                bigInteger
              }
              ... on Solana_ABI_Bytes_Value_Arg {
                hex
              }
              ... on Solana_ABI_Boolean_Value_Arg {
                bool
              }
              ... on Solana_ABI_Float_Value_Arg {
                float
              }
              ... on Solana_ABI_Json_Value_Arg {
                json
              }
            }
          }
        }
      }
      Transaction {
        Signature
        Signer
      }
    }
  }
}
```

### Liquidity of a Meteora DLMM pool

`DEXPools` records a pool's reserves after each swap, deposit or withdrawal it decodes. `Base.PostAmount` and `Quote.PostAmount` are the balances after the event, `PostAmountInUSD` their USD value, and `ChangeAmount` the signed change that event caused.

:::note
`DEXPools` is a realtime-only cube: it keeps roughly the last 12 hours and has no archive dataset, so use it for current reserves and live liquidity events rather than TVL history. See [data coverage and retention](/docs/graphql/data-coverage-retention/).
:::

```graphql
{
  Solana {
    DEXPools(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        Pool: {
          Market: { MarketAddress: { is: "3C5YE97HADPDxZehYq9Cis8AXr9aNyrUsczKzE1nDbW9" } }
          Dex: { ProgramAddress: { is: "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo" } }
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

To stream liquidity changes across all DLMM pools, subscribe to the same cube and keep rows where either reserve moved. DLMM deposits are often one-sided, so filter on `Base` or `Quote` with `any` rather than on `Base` alone.

```graphql
subscription {
  Solana {
    DEXPools(
      where: {
        Pool: { Dex: { ProgramAddress: { is: "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo" } } }
        any: [
          { Pool: { Base: { ChangeAmount: { ne: "0" } } } }
          { Pool: { Quote: { ChangeAmount: { ne: "0" } } } }
        ]
        Transaction: { Result: { Success: true } }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Signature
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

### Historical Meteora DLMM trades

For anything older than the Trading window, use `DEXTradeByTokens` with `dataset: archive`, which reaches back to mid-2024. This returns monthly trade counts and TRUMP volume on DLMM.

:::caution Aggregate in native amounts on `archive` and `combined`, not USD
Summing `Trade_Side_AmountInUSD` on the Solana `archive` and `combined` datasets does not aggregate cleanly: adding it to a grouped query shatters one row per month into many partial rows, and `combined` also returns fewer trades than `realtime` over the same window. Aggregate `Trade_Amount` instead, and take USD figures from the Trading cubes, where every row carries a vetted USD price.
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
          Currency: { MintAddress: { is: "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN" } }
          Dex: { ProgramAddress: { is: "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo" } }
        }
      }
    ) {
      Block {
        month: Time(interval: { in: months, count: 1 })
      }
      volume_trump: sum(of: Trade_Amount)
      trades: count
    }
  }
}
```

The chain-level cubes also carry per-swap detail the Trading cubes leave out, such as the exact instruction behind a swap and the token accounts on each side; the [Solana DEX Trades API](/docs/blockchain/Solana/solana-dextrades/) documents those fields.

## API key, free trial and pricing

Create an access token at [account.bitquery.io](https://account.bitquery.io/) and follow [how to generate a token](/docs/authorization/how-to-generate/); there is no approval step. The free trial runs for seven days and includes 1,000 API points, 100 MCP credits and two simultaneous streams. Request rate limits by plan are 30 a minute on Personal, 90 on Pro and 240 on Scale, with custom limits on Enterprise; see [rate limits](/docs/plans/rate-limits/). Points and streams are explained on [how billing works](/docs/plans/how-billing-works/), and plan prices are on the [Solana DEX API product page](https://bitquery.io/products/solana-dex-api) and the [pricing page](https://bitquery.io/pricing). Kafka access is a separate line item from the GraphQL plan.

<FAQ
  items={[
    { q: "Does Meteora have an official API?", a: "Yes, for pool-level data. Meteora's free DLMM Data API at dlmm.datapi.meteora.ag returns pools, per-pool OHLCV and volume history, wallet positions and portfolio PnL, limit orders and protocol stats, at 30 requests a second with no key. It has no per-swap trade feed, no per-wallet swap history and no streaming; Bitquery serves those over GraphQL, WebSocket, Kafka and gRPC with history back to mid-2024." },
    { q: "What is the Meteora DLMM program ID on Solana?", a: "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo, the same on mainnet and devnet. In Bitquery trade data DLMM rows carry ProtocolName lb_clmm and ProtocolFamily Meteora, and the Trading cube uses Market.Protocol lb_clmm." },
    { q: "How do I stream Meteora DLMM trades in real time?", a: "Subscribe to Solana.DEXTrades filtered by the DLMM program address, or to Trading.Trades with Market.Protocol lb_clmm for USD price and market cap on every row. For the lowest latency, consume the Kafka topic solana.dextrades.proto or the gRPC DEX trades stream and filter on the program address." },
    { q: "How do I detect new Meteora DLMM pools?", a: "Subscribe to Solana.Instructions on the DLMM program with the pool-creation methods initializeLbPair2, initializeCustomizablePermissionlessLbPair2 and initializePermissionLbPair. The first account in the instruction is the new pool address, tokenMintX and tokenMintY are the pair's mints, and funder is the wallet that created the pool." },
    { q: "Can I get historical Meteora DLMM trades?", a: "Yes. Solana.DEXTradeByTokens with dataset archive or combined reaches back to mid-2024 and covers trades, OHLC, volume and top traders. Solana.DEXTrades and DEXPools are realtime-only cubes that keep roughly 12 hours, and the Trading cube keeps about 30 days." },
    { q: "How do I get OHLC candles for a Meteora DLMM pair?", a: "Aggregate DEXTradeByTokens by a time interval as shown in the OHLC section, or read pre-built candles from Trading.Pairs filtered by Market.Protocol lb_clmm with Price.IsQuotedInUsd true. Run the DEXTradeByTokens aggregate as a query; Trading.Pairs also works as a subscription." },
    { q: "How do I get the liquidity of a Meteora DLMM pool?", a: "Query Solana.DEXPools for the pool's market address: Base.PostAmount and Quote.PostAmount are the reserves after the latest event and PostAmountInUSD their USD value. DEXPools keeps roughly 12 hours, so it answers current reserves and live liquidity changes rather than long TVL history." },
    { q: "What is the difference between Meteora DLMM, DAMM v2, DAMM v1 and DBC?", a: "All four are Meteora programs on Solana. DLMM (lb_clmm) is concentrated liquidity in price bins with dynamic fees, DAMM v2 (cp_amm) is the current constant-product AMM with position NFTs, DAMM v1 (amm) is the legacy Dynamic AMM, and the Dynamic Bonding Curve (dynamic_bonding_curve) launches tokens that graduate to a DAMM pool. Each has its own Bitquery page." },
    { q: "Do I need an API key, and is there a free tier?", a: "Yes, an access token from account.bitquery.io, generated without an approval step. The seven-day trial includes 1,000 API points, 100 MCP credits and two simultaneous streams; paid plans are listed on the pricing page." },
  ]}
/>

## Related documentation

- [Meteora DAMM v2 API](/docs/blockchain/Solana/Meteora-DAMM-v2-API/)
- [Meteora DYN API (DAMM v1)](/docs/blockchain/Solana/Meteora-DYN-API/)
- [Meteora Dynamic Bonding Curve API](/docs/blockchain/Solana/meteora-dynamic-bonding-curve-api/)
- [Solana DEX Trades API](/docs/blockchain/Solana/solana-dextrades/)
- [Trading API overview](/docs/trading/trading-data-overview/), [Trades cube](/docs/trading/crypto-trades-api/trades-api/) and [Pairs cube](/docs/trading/crypto-price-api/pairs/)
- [DEXTrades vs DEXTradeByTokens vs Trading.Trades](/docs/cubes/dextrades-dextradebytokens-trading-trades/)
- [Data coverage and retention](/docs/graphql/data-coverage-retention/)
- [gRPC DEX trades topic](/docs/grpc/solana/topics/dextrades/) and [real-time Solana streams over Kafka](/docs/streams/real-time-solana-data/)
- [Believe API](/docs/blockchain/Solana/Believe-API/) and [Jupiter Studio API](/docs/blockchain/Solana/jupiter-studio-api/), launchpads that trade on Meteora DBC
- [Solana Token Holders API](/docs/blockchain/Solana/solana-token-holders/)
- [Schema overview](/docs/schema/schema-intro/)
- [API Authorization](/docs/authorization/how-to-use/)

## Support

For technical support and questions contact our support team via telegram or create a ticket [here](https://support.bitquery.io/)
