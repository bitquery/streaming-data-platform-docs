---
sidebar_position: 8
title: "BSC Token Market Cap API: Market Cap, FDV and Supply of BNB Chain Tokens"
sidebar_label: "Token Market Cap API"
description: "Market cap, FDV, supply and price for BNB Chain tokens with Bitquery GraphQL: one token now, a watchlist, hourly history, a chain stream and an alert."
keywords:
  - BSC token market cap API
  - BNB Chain market cap
  - CAKE market cap API
  - BSC FDV API
  - token supply BNB Chain
---

import FAQ from "@site/src/components/FAQ";

# BSC Token Market Cap API: Market Cap, FDV and Supply of BNB Chain Tokens

The `Tokens` cube of the Trading API keeps, for every token that trades on BNB Chain, a rolling set of candles with price, USD volume, circulating and total supply, market cap and fully diluted valuation. Market cap is circulating supply times the trade-weighted price, computed from on-chain trades, so it follows the market with a delay of a block rather than an hour. Tokens are addressed by id, `bid:bsc:` followed by the lowercase contract, and the chain is `Token.Network: "Binance Smart Chain"`. The cube keeps about a month; the [BSC transaction balance tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-transaction-balance-tracker) gives on-chain total supply at any recent transaction if you only need supply. Every example runs in the [IDE](https://ide.bitquery.io) on a free account; the worked token is CAKE, `0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82`.

## Market cap of one token now

Match the id exactly, keep one candle size and a short window, and take the newest row. Without the window the query scans the whole cube and times out; without the duration it returns one row per candle size. Saved query [here](https://ide.bitquery.io/specific-bsc-token-latest-marketcap_1).

```graphql
{
  Trading {
    Tokens(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        Token: { Id: { is: "bid:bsc:0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82" } }
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

## A watchlist in one query

`in` takes a list of ids and `limitBy` on the token id keeps the newest row per token. The example is CAKE, WBNB and USDT.

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
              "bid:bsc:0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82"
              "bid:bsc:0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
              "bid:bsc:0x55d398326f99059ff775485246999027b3197955"
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

## Hourly market cap over the last day

One-hour candles carry the market cap at the close of each hour, with open and close price and the hour's USD volume, which is enough for a chart or a change-over-24-hours figure. Saved query [here](https://ide.bitquery.io/top-bsc-tokens-by-Market-Cap-Change-1h).

```graphql
{
  Trading {
    Tokens(
      limit: { count: 24 }
      orderBy: { descending: Block_Time }
      where: {
        Token: { Id: { is: "bid:bsc:0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82" } }
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

## Stream market cap updates for every BNB Chain token

Filter `Currency.Id` on the chain prefix and subscribe. Each message is a candle closing for some token; `Duration` above one second skips the tick-level candles. Saved stream [here](https://ide.bitquery.io/bsc-token-marketcap-stream).

```graphql
subscription {
  Trading {
    Tokens(
      where: {
        Currency: { Id: { includes: "bsc" } }
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

## Alert when a token crosses a market cap

Add a `Supply.MarketCap` bound to the stream and only tokens above it arrive, which is a launch screener in one filter. Saved stream [here](https://ide.bitquery.io/realtime-stream-bsc-tokens-with-marketcap-above-1-million_1).

```graphql
subscription {
  Trading {
    Tokens(
      where: {
        Token: { Network: { is: "Binance Smart Chain" } }
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

## Why some market caps look absurd

Market cap here is on-chain supply times an on-chain price. A token with a huge minted supply and a few dollars of trades in a thin pool can show a market cap in the billions, and a plain "top tokens by market cap" ranking of the cube is led by those. Rank inside a list you trust, as in the watchlist query, or bound the ranking with `Volume: { Usd: { gt: ... } }` and `Supply: { MarketCap: { lt: ... } }` and treat the result as a screen rather than a league table. The saved [top tokens by market cap](https://ide.bitquery.io/Top-Tokens-by-Market-Cap-on-bsc) query shows the bounded form.

<FAQ
  items={[
    { q: "How do I get the market cap of a BNB Chain token?", a: "Query Trading.Tokens with Token.Id set to bid:bsc: plus the lowercase contract, one candle duration, a short time window and limit 1 ordered by Block_Time descending. Supply.MarketCap and FullyDilutedValuationUsd are on the row." },
    { q: "How is market cap computed?", a: "Circulating supply times the trade-weighted price of the candle, both from on-chain data. FDV uses total supply instead." },
    { q: "How far back does the Tokens cube go?", a: "About a month of candles. For older supply figures use the transaction balance tracker, which records total supply on token rows." },
    { q: "Why does a query with includesCaseInsensitive on the id time out?", a: "It has to scan every token. Use the exact bid:bsc: id with is, add a candle duration and a time window, and the query returns in well under a second." },
    { q: "Can I stream market caps for one token only?", a: "Yes. Put the exact Token.Id in the stream filter instead of the chain prefix; a message arrives whenever one of its candles closes." },
  ]}
/>

## Related pages

- [Base token market cap API](/docs/blockchain/Base/base-token-marketcap-api)
- [Ethereum token market cap API](/docs/blockchain/Ethereum/token-supply/ethereum-token-marketcap-api)
- [Tokens cube](/docs/trading/crypto-price-api/tokens)
- [Supply fields](/docs/trading/crypto-price-api/supply-fields)
- [BSC transaction balance tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-transaction-balance-tracker)
