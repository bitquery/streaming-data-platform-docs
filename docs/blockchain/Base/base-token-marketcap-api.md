---
sidebar_position: 10
title: "Base Token Market Cap API: Market Cap, FDV and Supply for Tokens on Base"
sidebar_label: "Token Market Cap API"
description: "Market cap, FDV, supply and price for Base tokens with Bitquery GraphQL: AERO or cbBTC now, a watchlist, hourly history, a live stream and a threshold alert."
keywords:
  - Base token market cap API
  - Base FDV API
  - AERO market cap
  - cbBTC market cap API
  - Base token supply GraphQL
---

import FAQ from "@site/src/components/FAQ";

# Base Token Market Cap API: Market Cap, FDV and Supply for Tokens on Base

Base tokens trade against ETH and USDC on Aerodrome, Uniswap and the launchpads, and the `Tokens` cube of the Trading API turns those trades into candles that carry price, USD volume, circulating and total supply, market cap and fully diluted valuation, refreshed every block. Address a token by id, `bid:base:` plus its lowercase contract, and the chain by `Token.Network: "Base"`. The cube keeps about a month of candles; the [Base transaction balance tracker](/docs/blockchain/Base/transaction-balance-tracker/base-transaction-balance-tracker) gives total supply at any recent transaction if supply alone is enough. Every example runs in the [IDE](https://ide.bitquery.io) on a free account; the worked tokens are AERO, `0x940181a94a35a4569e4529a3cdfb74e38fd98631`, and cbBTC, `0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf`.

## Market cap of one token now

Exact id, one candle size, a short window, newest row first. The window matters: without it the query scans the whole cube and times out. Saved query [here](https://ide.bitquery.io/specific-base-token-latest-marketcap).

```graphql
{
  Trading {
    Tokens(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        Token: { Id: { is: "bid:base:0x940181a94a35a4569e4529a3cdfb74e38fd98631" } }
        Interval: { Time: { Duration: { eq: 60 } } }
        Block: { Time: { since_relative: { hours_ago: 1 } } }
      }
    ) {
      Block {
        Time
      }
      Token {
        Name
        Symbol
        Address
        Network
      }
      Price {
        Ohlc {
          Close
        }
        Average {
          Mean
        }
      }
      Supply {
        CirculatingSupply
        TotalSupply
        MarketCap
        FullyDilutedValuationUsd
      }
      Volume {
        Usd
      }
    }
  }
}
```

For AERO the market cap and the FDV differ by about half, because only part of the supply is in circulation; for cbBTC they are equal, since every minted coin circulates.

## A watchlist in one query

List the ids and keep the newest row per token with `limitBy`. The example is AERO, cbBTC and WETH on Base.

```graphql
{
  Trading {
    Tokens(
      limitBy: { by: Token_Id, count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        Token: {
          Id: {
            in: [
              "bid:base:0x940181a94a35a4569e4529a3cdfb74e38fd98631"
              "bid:base:0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf"
              "bid:base:0x4200000000000000000000000000000000000006"
            ]
          }
        }
        Interval: { Time: { Duration: { eq: 60 } } }
        Block: { Time: { since_relative: { hours_ago: 1 } } }
      }
    ) {
      Block {
        Time
      }
      Token {
        Symbol
        Id
      }
      Price {
        Ohlc {
          Close
        }
      }
      Supply {
        MarketCap
        FullyDilutedValuationUsd
        CirculatingSupply
        TotalSupply
      }
      Volume {
        Usd
      }
    }
  }
}
```

## A day of hourly market cap

One-hour candles hold the market cap at each close with the hour's open, close and USD volume; the difference between the first and last row is the 24-hour change. Saved query [here](https://ide.bitquery.io/top-base-tokens-by-Market-Cap-Change-1h).

```graphql
{
  Trading {
    Tokens(
      limit: { count: 24 }
      orderBy: { descending: Block_Time }
      where: {
        Token: { Id: { is: "bid:base:0x940181a94a35a4569e4529a3cdfb74e38fd98631" } }
        Interval: { Time: { Duration: { eq: 3600 } } }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      Interval {
        Time {
          Start
        }
      }
      Price {
        Ohlc {
          Open
          Close
        }
      }
      Supply {
        MarketCap
      }
      Volume {
        Usd
      }
    }
  }
}
```

## Stream every Base token's market cap

Filter on the chain prefix in `Currency.Id` and subscribe; each message is a candle closing for some Base token. `Duration` above one second leaves out the tick-level candles. Saved stream [here](https://ide.bitquery.io/base-token-marketcap-stream).

```graphql
subscription {
  Trading {
    Tokens(
      where: {
        Currency: { Id: { includes: "base" } }
        Interval: { Time: { Duration: { gt: 1 } } }
      }
    ) {
      Block {
        Time
      }
      Token {
        Symbol
        Id
      }
      Interval {
        Time {
          Duration
        }
      }
      Price {
        Ohlc {
          Close
        }
      }
      Supply {
        MarketCap
        FullyDilutedValuationUsd
        TotalSupply
      }
      Volume {
        Usd
      }
    }
  }
}
```

## Alert on tokens above a market cap

A `Supply.MarketCap` bound on the stream turns it into a screener for launches that crossed a size. Saved stream [here](https://ide.bitquery.io/realtime-stream-base-tokens-with-marketcap-above-1-million).

```graphql
subscription {
  Trading {
    Tokens(
      where: {
        Token: { Network: { is: "Base" } }
        Interval: { Time: { Duration: { gt: 1 } } }
        Supply: { MarketCap: { gt: 1000000 } }
      }
    ) {
      Block {
        Time
      }
      Token {
        Symbol
        Id
      }
      Supply {
        MarketCap
        TotalSupply
      }
      Price {
        Ohlc {
          Close
        }
      }
    }
  }
}
```

## Treat rankings as a screen, not a league table

Market cap here is on-chain supply times an on-chain price, and Base has thousands of launchpad tokens with enormous supplies and a few dollars of trades in one thin pool. A raw "top tokens by market cap" over the cube is led by them. Rank inside a list you trust, as the watchlist query does, or bound the ranking with `Volume: { Usd: { gt: ... } }` and `Supply: { MarketCap: { lt: ... } }`; the saved [top tokens by market cap](https://ide.bitquery.io/Top-Tokens-by-Market-Cap-on-Base) query shows the bounded form.

<FAQ
  items={[
    { q: "How do I get the market cap of a token on Base?", a: "Query Trading.Tokens with Token.Id set to bid:base: plus the lowercase contract, a candle duration, a short time window and limit 1 ordered by Block_Time descending. Supply.MarketCap and FullyDilutedValuationUsd are on the row." },
    { q: "Why do market cap and FDV differ?", a: "Market cap uses circulating supply and FDV uses total supply, both times the same trade-weighted price. For tokens with locked or unvested supply, such as AERO, FDV is much larger." },
    { q: "Why does a query on the token id time out?", a: "A partial or case-insensitive match has to scan every token. Use the exact bid:base: id with is, one candle duration and a time window." },
    { q: "How far back does the Tokens cube go on Base?", a: "About a month of candles. For older supply values use the transaction balance tracker, which records total supply on every token row." },
    { q: "Can I get the same data for other chains?", a: "Yes. The id prefix changes: bid:eth:, bid:bsc:, bid:arbitrum:, bid:matic:, bid:solana:. Each chain has its own market cap page with that chain's examples." },
  ]}
/>

## Related pages

- [BSC token market cap API](/docs/blockchain/BSC/bsc-token-marketcap-api)
- [Ethereum token market cap API](/docs/blockchain/Ethereum/token-supply/ethereum-token-marketcap-api)
- [Tokens cube](/docs/trading/crypto-price-api/tokens)
- [Supply fields](/docs/trading/crypto-price-api/supply-fields)
- [Base transaction balance tracker](/docs/blockchain/Base/transaction-balance-tracker/base-transaction-balance-tracker)
