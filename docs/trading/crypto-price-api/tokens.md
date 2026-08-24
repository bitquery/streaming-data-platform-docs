---
title: "Crypto Token Price API"
description: "Fetch token USD prices, market stats, and history with Bitquery crypto price APIs using GraphQL queries and live subscriptions."
---
# Tokens Cube

:::tip Looking for one token's price? Use the Pairs cube with rank 1
The price on this cube is a **volume-weighted blend of every pool** where the token is the base asset. That is what you want for a chain-wide number or a firehose of all tokens on a chain. But for a **specific token** — especially one whose liquidity is spread across many pools — thin pools contribute to the blend and can pull the price away from where the token actually trades. For a single token's price, query the [Pairs cube with `Ranking: { Position: { eq: 1 } }`](/docs/trading/crypto-price-api/pairs#most-accurate-token-price) to get the quote from its top market.
:::

The **Tokens** cube provides chain-specific, aggregated price and volume data for individual tokens. For a **query** example that returns tokens with volume and average price over the last 24h (including conditional metrics for 1h, 4h, 24h), see [Aggregated Token Data](https://ide.bitquery.io/aggregated-data) or the [Crypto Price API examples](/docs/trading/crypto-price-api/examples#aggregated-token-data-volume--price-last-24h).

### Fields in the Schema

```graphql
subscription {
  Trading {
    Tokens(where: { Interval: { Time: { Duration: { eq: 60 } } } }) {
      Token {
        Address
        Id
        IsNative
        Name
        Network
        Symbol
        TokenId
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
        Base # Volume of the token itself
        Quote # Volume of all tokens it traded against
        Usd # Combined USD volume across all trades
      }
      Supply {
        TotalSupply
        FullyDilutedValuationUsd
        MarketCap
      }
      Price {
        IsQuotedInUsd # Whether price values are in USD (true/false)
        Ohlc {
          Open
          High
          Low
          Close
        }
        Average {
          Mean
          SimpleMoving
          WeightedSimpleMoving
          ExponentialMoving
        }
      }
      Currency {
        Name
        Symbol
        Id
      }
    }
  }
}
```

### Key Points to Understand:

- **What is the Tokens Cube?**  
  The **Tokens** cube provides chain-specific, aggregated price and volume data for individual tokens. This includes OHLC values, moving averages, and volume across **all pairs** the token is traded with.
- **Volume Section Explained:**

  - `Base`: Volume of the token itself (the token in question) for all pairs.
  - `Quote`: Sum of **quote token** amounts (the tokens it traded against). This is not USD—for USD amounts use `Usd`. (As of March 11 2026, see [Price Index Algorithm](/docs/trading/crypto-price-api/price-index-algorithm).)
  - `Usd`: Total volume in USD. Use this when you need USD amounts.

- **IsQuotedInUsd**:  
  A boolean indicating whether the OHLC and average prices are expressed in USD (`true`) or in the quote token's value (`false`).
- **Clarification on "Quote":**  
  The **Tokens** cube **does not show the specific quote tokens** used in each trade. Instead, it aggregates across all pairs the token is involved in—regardless of which token acted as the quote in those trades.
- If you need **pair-level granularity** (i.e., to know exactly which token was the quote in a specific pair), use the **Pairs Cube** instead.
- **Where the blend can mislead:** because every pool contributes in proportion to its decay-weighted volume, tokens with **fragmented liquidity** (one primary pool plus a tail of thin ones) can report a price that drifts from the primary market. Check `Ranking.Weight` on the [Pairs cube](/docs/trading/crypto-price-api/pairs#most-accurate-token-price): a top-market weight near 1 means the blend is effectively one pool and this cube's price is equivalent; a low weight means you should price the token from its [rank-1 market](/docs/trading/crypto-price-api/pairs#most-accurate-token-price) instead.
- **`Supply`**: Currency-level metrics for the asset (aggregated across chains); price and volume on the row remain chain-specific. See [Supply fields reference](/docs/trading/crypto-price-api/supply-fields) for each subfield (`CirculatingSupply`, `TotalSupply`, `MaxSupply`, `MarketCap`, `FullyDilutedValuationUsd`).
