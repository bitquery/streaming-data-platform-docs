---
title: "Crypto Trading Pairs Price API"
description: "Get crypto trading pair prices, volume, and OHLC with Bitquery Trading APIs using GraphQL queries and real-time stream options."
---
# Pairs Cube

The Pairs cube provides trading data for a base token traded against a quote token on a particular DEX or protocol.

## Getting the Most Accurate Token Price (Rank 1) {#most-accurate-token-price}

:::tip Querying the price of a specific token? Use this pattern
Query the **Pairs** cube with **`Ranking: { Position: { eq: 1 } }`**. This returns the token's price on its **top market** — the pool currently contributing the most volume to that token's price — rather than a value blended across every pool the token trades in.
:::

### Why the top market, and not the blended token price

The [Tokens cube](/docs/trading/crypto-price-api/tokens) reports one price per token per chain, computed as a **volume-weighted blend of every pool** where the token is the base asset (see [Price Index Algorithm](/docs/trading/crypto-price-api/price-index-algorithm)). That blend is the right answer when you want a single chain-wide number, and for a token whose liquidity sits in one deep pool the blended price and the top-market price agree closely.

Fragmented tokens behave differently. When the same token trades across many pools — one primary pool plus a long tail of thin ones — every pool contributes to the blend in proportion to its decay-weighted volume. Thin pools quote wider, move on small trades, and can sit at prices the primary market has already left. Their share of the blend pulls the reported number away from the price you could actually trade at.

Filtering `Pairs` to `Ranking.Position = 1` avoids that: you get the quote from the single market carrying the most volume for that token, which is the closest thing to an executable price.

| You want | Use |
| --- | --- |
| The price of one specific token | **`Pairs` + `Ranking: { Position: { eq: 1 } }`** |
| A firehose of every token on a chain, or one chain-wide number per token | [`Tokens`](/docs/trading/crypto-price-api/tokens) |
| One number for an asset across all chains (BTC, ETH) | [`Currencies`](/docs/trading/crypto-price-api/currency) |
| A specific pool you already know the address of | `Pairs` + `Market: { Address: ... }` |

### Latest price of a token from its top market

```graphql
{
  Trading {
    Pairs(
      where: {
        Token: {
          Address: { is: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263" }
          Network: { is: "Solana" }
        }
        Ranking: { Position: { eq: 1 } }
        Interval: { Time: { Duration: { eq: 60 } } }
      }
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
    ) {
      Token {
        Symbol
        Address
      }
      QuoteToken {
        Symbol
      }
      Market {
        Protocol
        Address
        Network
      }
      Price {
        IsQuotedInUsd
        Ohlc {
          Open
          High
          Low
          Close
        }
      }
      Ranking {
        Position
        Weight
      }
      Volume {
        Usd
      }
      Block {
        Time
      }
    }
  }
}
```

`Price.Ohlc.Close` is the token's latest price on its top market. Values come back in **USD** (`IsQuotedInUsd: true`) even when the quote token is WSOL or another non-stable asset, because the index normalizes the quote side — see [How Pool Prices Are Normalized](/docs/trading/crypto-price-api/price-index-algorithm#how-pool-prices-are-normalized-to-the-current-quote-token).

### Stream the same price

Change `query` to `subscription` and drop `limit`/`orderBy` to receive top-market updates as they happen:

```graphql
subscription {
  Trading {
    Pairs(
      where: {
        Token: {
          Address: { is: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263" }
          Network: { is: "Solana" }
        }
        Ranking: { Position: { eq: 1 } }
        Interval: { Time: { Duration: { eq: 1 } } }
      }
    ) {
      Token {
        Symbol
        Address
      }
      QuoteToken {
        Symbol
      }
      Market {
        Protocol
        Address
      }
      Price {
        IsQuotedInUsd
        Ohlc {
          Close
        }
      }
      Ranking {
        Position
        Weight
      }
    }
  }
}
```

To stream the top market of **every** token on a chain, replace the `Token.Address` filter with `Token: { Network: { is: "Solana" } }` and keep the rank filter.

### Watchlist: top-market price for several tokens

Add `limitBy` to collapse the result to one current row per token:

```graphql
{
  Trading {
    Pairs(
      where: {
        Token: {
          Address: {
            in: [
              "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
              "So11111111111111111111111111111111111111112"
              "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
            ]
          }
          Network: { is: "Solana" }
        }
        Ranking: { Position: { eq: 1 } }
        Interval: { Time: { Duration: { eq: 60 } } }
        Block: { Time: { since_relative: { minutes_ago: 10 } } }
      }
      limit: { count: 10 }
      limitBy: { by: Token_Address, count: 1 }
      orderBy: { descending: Block_Time }
    ) {
      Token {
        Symbol
        Address
      }
      QuoteToken {
        Symbol
      }
      Market {
        Protocol
      }
      Price {
        Ohlc {
          Close
        }
      }
      Ranking {
        Position
        Weight
      }
      Block {
        Time
      }
    }
  }
}
```

### Reading `Ranking.Weight`

`Weight` is that market's share of the token's total decay-weighted volume, a float in `[0, 1]`; weights across all contributing pools sum to 1. Treat it as a confidence signal on the blended price:

- **Weight close to 1** — a single pool drives essentially the whole token price. The blended `Tokens` price and the rank-1 price will be nearly identical, so either works.
- **Low weight** — liquidity is fragmented across many pools and the blended price mixes all of them. This is exactly the case where the rank-1 price and the blended price diverge, and where the rank-1 price is the one you want.

`Position` and `Weight` are computed over the rolling **1-hour, decay-weighted** window described in the [Price Index Algorithm](/docs/trading/crypto-price-api/price-index-algorithm#ranking-on-trades-pairs-and-tokens) — not over the interval of the row you are reading. A rank-1 row can therefore report less `Volume.Usd` for its own interval than a lower-ranked row does for another.

### Things to know

- **The top market can change.** Ranking is recomputed as volume moves, so a token's rank-1 pool — and its quote token — may flip during a stream. Key your state on `Market.Address` from each message instead of assuming a fixed pool.
- **Always scope the query.** A rank filter is not a substitute for a token filter: an unscoped rank-1 query across a whole chain scans very wide and can time out. Filter by `Token.Address` with `Network` (or `Market: { NetworkBid: { is: "bid:eth" } }` for lower latency), and add `Block: { Time: { since_relative: { minutes_ago: N } } }` for broad queries.
- **Want the runner-up markets too?** Use `Ranking: { Position: { in: [1, 2, 3] } }` to compare a token's main venues — useful for spread and arbitrage checks. You can also sort by `orderBy: { descending: Ranking_Weight }`.
- **`Ranking` does not exist on `Currencies`.** It is available on `Trades`, `Pairs`, and `Tokens` only.

## Schema and Fields

```graphql
{
  Trading {
    Pairs(
      where: {Market: {Network: {is: "Solana"}, Address: {in: ["PAIR ADDRESS HERE"]}}, Interval: {Time: {Duration: {eq: 300}}}, Price: {IsQuotedInUsd: true}}
      orderBy: {descendingByField: "Block_Time"}
    ) {
      Market {
        Protocol
        Program
        Network
        Name
        Address
      }
      Block {
        Date
        Time
        Timestamp
      }
      Interval {
        Time {
          Start
          Duration
          End
        }
      }
      Volume {
        Base
        Quote
        Usd
      }
      Supply {
        TotalSupply
        FullyDilutedValuationUsd
        MarketCap
      }
      Price {
        Ohlc {
          Close
          High
          Low
          Open
        }
        IsQuotedInUsd #Are the values in USD or Native
      }
    }
  }
}

```

- `Volume.Base`:  
  Total amount of base token traded during the interval.
- `Volume.Quote`:  
  Sum of **quote token** amounts traded (e.g. USDT, USDC). For USD-base pairs this is not USD—it is the total in quote token units. For USD amounts use `Volume.Usd`. (As of March 11 2026, see [Price Index Algorithm](/docs/trading/crypto-price-api/price-index-algorithm) for details.)
- `Volume.Usd`:  
  Total trade volume in USD. Use this when you need USD amounts.
- `Volume.BaseAttributedToUsd`:  
  Portion of the `Volume.Base` that was traded against quote tokens with known USD prices. Used to accurately calculate average USD price.
- `Price.Ohlc.*`:  
  OHLC candles (Open, High, Low, Close) for the interval, computed using only trades with known USD values.
- `Price.IsQuotedInUsd`:  
   Boolean flag indicating if the price values are quoted in USD. If `false`, the price is in quote token terms.
- **`Supply`**: Currency-level metrics for the asset (not pair- or pool-specific). See [Supply fields reference](/docs/trading/crypto-price-api/supply-fields) for definitions of each subfield.

A rough pseudo-code of how price is calculated:

```
if quoteInUsd {
  vol.AveragePrice.Price = vol.AveragePrice.Usd / vol.AveragePrice.BaseAttributedToUsd
} else {
  vol.AveragePrice.Price = vol.AveragePrice.Quote / vol.AveragePrice.Base
}
```

For an in-depth breakdown of how quote and base are assigned, see [Breaking Down Price Streams in Detail](/docs/trading/crypto-price-api/in-depth). It is not necessary for basic use.
