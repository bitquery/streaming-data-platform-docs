---
title: "Crypto Tokens OHLC Candle K-Line API"
description: "Crypto Tokens OHLC Candle K-Line API via Bitquery Trading APIs for multi-chain prices, OHLC candles, volume metrics, and live streams."
keywords: ["OHLC API", "crypto candle data", "K-line API", "real-time price data", "crypto trading API", "blockchain price data", "candlestick charts", "crypto market data", "trading bot API", "crypto analytics", "multi-chain price data", "DEX price API", "crypto streaming API", "Kafka crypto data", "TradingView integration", "crypto arbitrage API"]
---
# Crypto Tokens OHLC Candle K-Line API - Real-Time & Historical Price Data

Get real-time and historical OHLC (Open, High, Low, Close) candle data, K-line charts, and price analytics for crypto tokens across all supported blockchains including Ethereum, Solana, BSC, Polygon, and Tron.

**Recommendation:** Use the **[Crypto Price API](/docs/trading/crypto-price-api/introduction/)** as your **main source** for OHLC and K-line data—**real-time streams** and **pre-aggregated** bars (low-latency, easy to use). When you need **full historical OHLC** (deep backfill, archive ranges, or candles built from raw DEX trades), use **`DEXTradeByTokens`** on **`EVM`** or **`Solana`** and aggregate trades into candles—see [comparison below](#crypto-price-api-vs-dextradebytoken).

## How do I get OHLCV data for a token using Bitquery? {#how-do-i-get-ohlcv-data-for-a-token-using-bitquery}

**Use the [Crypto Price API](/docs/trading/crypto-price-api/introduction/) first** (`Trading` → `Tokens`, `Pairs`, or `Currencies`): **pre-aggregated OHLC**, streaming, and intervals such as **1-second** and **1-minute**, with a **clean, multi-DEX index** view. **For historical OHLC** beyond what the Price API covers, switch to **`DEXTradeByTokens`** (or chain-specific DEX docs): bucket with **`Block { Time(interval: { count, in: minutes | hours | days }) }`** and derive open/high/low/close from **`PriceInUSD`** / **`Trade_Price`**. See [Crypto Price API vs DEXTradeByTokens](#crypto-price-api-vs-dextradebytoken) and the quick table below.

## OHLCV & price data — quick answers {#ohlcv-and-price-data-quick-answers}

| Question | Where to read / run |
|----------|---------------------|
| How do I get OHLCV data for a token using Bitquery? | **Last ~30 days:** [Crypto Price API](/docs/trading/crypto-price-api/introduction/) ; **older history:** [DEXTradeByTokens OHLC](/docs/cubes/dextradesbyTokens/#how-do-i-get-ohlc-in-a-dextradebytokens-query) |
| How do I get OHLC in a DEXTradeByTokens query? | [DEXTradeByTokens OHLC](/docs/cubes/dextradesbyTokens/#how-do-i-get-ohlc-in-a-dextradebytokens-query) (for **historical** OHLC or DEX-level control) |
| How do I get historical OHLCV for a Solana token? | **Main OHLC:** [Crypto Price API — Quick start](/docs/trading/crypto-price-api/introduction/#quick-start) · [Tokens cube](/docs/trading/crypto-price-api/tokens/) · **Historical / DEX:** [Historical OHLCV on Solana](/docs/blockchain/Solana/solana-dextrades/#how-do-i-get-historical-ohlcv-for-a-solana-token) · [Solana OHLC API](/docs/blockchain/Solana/solana-dextrades/#solana-ohlc-api) |
| How do I get the current price of a token using Bitquery API? | **Recommended:** [Pairs + rank 1 (top market)](/docs/trading/crypto-price-api/pairs#most-accurate-token-price) · [Quick start](/docs/trading/crypto-price-api/introduction/#quick-start) · [Examples](/docs/trading/crypto-price-api/examples/) |
| Which cube gives the most accurate price for one token? | [Pairs with `Ranking: { Position: { eq: 1 } }`](/docs/trading/crypto-price-api/pairs#most-accurate-token-price) — prices from the token's top market rather than a blend across all its pools |
| How do I get price change percentage for a token? | [Price change](/docs/start/starter-queries/#volume-of-multiple-tokens-across-different-chains) |
| How do I get 1-minute OHLC candles for a DEX pair? | **Main:** [Your first OHLC query](#your-first-ohlc-query) (`Duration: { eq: 60 }`) · [Pairs cube](/docs/trading/crypto-price-api/pairs/) · **Historical:** [DEX OHLC pattern](/docs/cubes/dextradesbyTokens/#how-do-i-get-ohlc-in-a-dextradebytokens-query) |
| How do I get the all-time high (ATH) price of a token? | [Solana ATH example](/docs/blockchain/Solana/solana-dextrades/#get-ath-market-cap-of-tokens)|
| Is there an API to get token price in USD on Solana? | [Pairs + rank 1 (top market)](/docs/trading/crypto-price-api/pairs#most-accurate-token-price) · [Crypto Price API — Quick start](/docs/trading/crypto-price-api/introduction/#quick-start) · [Latest USD (Solana DEX trades)](/docs/blockchain/Solana/solana-dextrades/#latest-usd-price-of-a-token) |
| How do I use DEXTradeByTokens vs DEXTrades for OHLCV? | [OHLCV: which cube?](/docs/cubes/dextradesbyTokens/#how-do-i-use-dextradebytokens-vs-dextrades-for-ohlcv) · [DEXTrades cube](/docs/cubes/dextrades/) |

## What is OHLC Data?

OHLC (Open, High, Low, Close) data, also known as candlestick or K-line data, is the foundation of technical analysis in cryptocurrency trading. Each OHLC candle represents price movement over a specific time interval:

- **Open**: The first price recorded in the interval
- **High**: The highest price reached during the interval  
- **Low**: The lowest price reached during the interval
- **Close**: The last price recorded in the interval

Our [Crypto Price API](/docs/trading/crypto-price-api/introduction/) provides pre-aggregated OHLC data with ultra-low latency—**use it as the main source** for live charts and typical OHLC needs.

**Historical OHLC:** For **deep history** or candles computed from **raw DEX trades**, use **[DEXTradeByTokens](/docs/cubes/dextradesbyTokens/)** on **EVM** or **Solana** (with `dataset: combined` or `archive` as needed).

## Getting Started

### **Quick Start Steps**

1. **Get API Key**: Sign up at [Bitquery IDE](https://ide.bitquery.io) to get your API key
2. **Choose your method**
   - **GraphQL queries**: For one-off APIs
   - **WebSocket Streams**: For real-time data feeds
   - **Kafka**: For high-throughput applications with high degree of relibility
3. **Select the Right Cube**: Choose between Currency, Tokens, or Pairs based on your needs
4. **Start with Examples**: Use our ready-to-run examples below

### **Your First OHLC Query** {#your-first-ohlc-query}

Get real-time Bitcoin OHLC data across all chains:

> Note: We include `Volume: { Usd: { gt: 5 } }` to further remove extreme outliers; the stream already pre-filters outliers—this is an additional check.

```graphql
subscription {
  Trading {
    Currencies(
      where: {
        Currency: { Id: { is: "bid:bitcoin" } },
        Interval: { Time: { Duration: { eq: 60 } } },
        Volume: { Usd: { gt: 5 } }
      }
    ) {
      Currency {
        Id
        Name
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
      }
      Supply {
        TotalSupply
        FullyDilutedValuationUsd
        MarketCap
      }
    }
  }
}
```

[Run this query ➤](https://ide.bitquery.io/bitcoin-currency-price-stream)

## Why Use Our OHLC API?

### **Pre-Aggregated Data**
- No need to calculate OHLC from raw trade data
- Ready-to-use candlestick data for any time interval
- Optimized for performance and accuracy
- Uses pre-aggregated price data updated in real-time

### **Multi-Chain Support**
- Get OHLC data across all major blockchains
- Chain-agnostic currency views (e.g., Bitcoin across all chains)
- Cross-chain price aggregation

### **Real-Time Streaming**
- WebSocket subscriptions for live OHLC updates
- Kafka streams for high-throughput applications
- Sub-second latency for trading applications

### **Advanced Analytics**
- Moving averages (SMA, WMA, EMA)
- Volume-weighted prices
- Price change calculations
- Technical indicators

## Crypto Price API vs DEXTradeByToken {#crypto-price-api-vs-dextradebytoken}

**Default for OHLC:** Use the **Crypto Price API** as the **primary** source for real-time and standard OHLC. Use **`DEXTradeByTokens`** when you need **full historical** OHLC or trade-based aggregation over long ranges.

| Feature | Crypto Price API | DEXTradeByTokens |
|---------|------------------|-----------------|
| **Data Availability** | Real-time + **recent** OHLC (Price Index) | Real-time + **full** historical (with `dataset: combined` / `archive` as supported) |
| **Data Processing** | Pre-aggregated and real time aggregation of price data | Raw trades aggregated on-the-fly in your query |
| **Data Quality** | Filtered, clean price feed, second level | Trade Level Price |

### **When to Use Crypto Price API:**
- **Default for OHLC and K-lines**—live streaming and pre-aggregated bars
- Real-time trading applications requiring normalized pricing
- Live charting and dashboards with aggregated price feeds
- High-frequency trading strategies with sub-second updates
- Limit order execution with reliable mark prices
- Futures trading and derivatives pricing
- Lending and borrowing protocols requiring accurate rates
- DeFi applications needing real-time price oracles
- Any application requiring reliable real-time price streams
- Fixed time intervals available due to pre-aggregated data

### **When to Use DEXTradeByTokens API:**

- **Historical OHLC** and long-range backfills
- When you need **actual per-trade** detail not only index OHLC
- **Full** price history, custom intervals, or archive-backed ranges
- Any time interval can be used because aggregation is defined in the query over trades

## Supported Time Intervals

Our [Crypto Price API](/docs/trading/crypto-price-api/introduction/) OHLC API supports fixed time intervals optimized for different trading strategies:

| Interval | Duration |
|----------|----------|
| 1 second | 1s |
| 3 seconds | 3s |
| 5 seconds | 5s |
| 10 seconds | 10s |
| 30 seconds | 30s |
| 1 minute | 60s |
| 5 minutes | 300s |
| 15 minutes | 900s |
| 30 minutes | 1800s |
| 1 hour | 3600s |

These **ten values are the complete set**. Any other value — 120, 7200, 86400 — is not an error:
the query returns `[]` with HTTP 200 and **no `errors` key**, so a typo reads as "this token has
no data" rather than "unsupported interval".

:::danger The Duration filter is effectively mandatory
The cube stores **all ten durations simultaneously**. A query without
`Interval: { Time: { Duration: { eq: ... } } }` returns one row per duration for the same
timestamp, so any aggregate over it is inflated roughly **ten-fold**:

```graphql
where: {
  Interval: { Time: { Duration: { eq: 3600 } } }   # never omit this
  ...
}
```

Without it, a `sum(of: Volume_Usd)` over a window returns close to ten times the real figure.
Row counts behave the same way — the unfiltered count equals the sum of the ten per-duration
counts exactly.
:::

### Bucket arithmetic

- `Interval.Time.End` == `Start + Duration - 1 second`. At Duration 1, `End == Start`.
- Buckets are Unix-epoch aligned: `Start_epoch % Duration == 0` for every row.
- Candles are **sparse**. A bucket with no trades is simply absent — there is no gap filling and
  no zero-volume filler. Do not assume a contiguous series; reindex client-side if you need one.

### Multiple timeframes in one request

`Duration` accepts the full `OLAP_Integer` comparator set — `eq`, `ne`, `in`, `notIn`, `gt`,
`ge`, `lt`, `le` — so you can pull several timeframes at once and split them client-side on
`Interval.Time.Duration`:

```graphql
Interval: { Time: { Duration: { in: [60, 300, 3600] } } }
```

Combining two comparators applies AND.

:::note The 1-second series under-reports totals
Aggregate volume at Duration 1 comes in **below** every coarser bucket — by up to a few percent,
varying by token and window. Coarser buckets agree with each other closely. Use 60s or larger
when totals must reconcile.
:::

## Custom 4-hour, daily and weekly candles

Durations above 3600s do not exist natively, but you can **roll native candles up to any
multiple** with the `interval:` argument plus argmin/argmax selectors. The aggregation is exact:

```graphql
{
  Trading {
    Tokens(
      where: {
        Token: { Address: { is: "So11111111111111111111111111111111111111112" }, Network: { is: "Solana" } }
        Interval: { Time: { Duration: { eq: 3600 } } }
        Block: { Time: { since: "...", till: "..." } }
      }
      limit: { count: 1000 }
    ) {
      Block { Time(interval: { in: hours, count: 4 }) }
      Price {
        Ohlc {
          Open(minimum: Interval_Time_Start)
          High(maximum: Price_Ohlc_High)
          Low(minimum: Price_Ohlc_Low)
          Close(maximum: Interval_Time_Start)
        }
      }
      volume: sum(of: Volume_Usd)
      n: count
    }
  }
}
```

`interval:` accepts `seconds`, `minutes`, `hours`, `days`, `weeks`, `months` and `years` with a
`count` and an optional `offset`, so 4-hour, 12-hour, daily and weekly candles all come from the
same pattern.

:::warning Do not add `orderBy` to a roll-up query
Any `orderBy` un-groups the aggregation and you silently get the raw source rows back instead of
your buckets — a 21-row daily series becomes 504 hourly rows. Sort client-side.
:::

## Volume-Based Aggregation

:::caution Not currently available
Volume-based intervals are **not currently available**. `Interval.VolumeBased` is `false` and
`Interval.TargetVolume` is `0` on every row, and filtering on either
(`Interval: { VolumeBased: true }` or any `Interval: { TargetVolume: ... }` value) returns
**zero rows** with HTTP 200 and no error — so a query written against them looks like a token
with no data rather than an unsupported feature.

Use time-based intervals via `Interval: { Time: { Duration: { eq: <seconds> } }}` instead, and
apply a volume threshold in the `where` clause with `Volume: { Usd: { gt: ... } }`.
:::

## Choosing the Right Cube for OHLC Data

The [Crypto Price API](/docs/trading/crypto-price-api/introduction/) offers three different cubes for accessing OHLC data. Understanding which cube to use is crucial for getting the right data for your specific use case:

Before we dive into the cubes, let's clarify the key terminology:

**Currency** - The underlying asset (e.g., BTC, ETH, SOL)
**Token** - Specific implementations of a currency on blockchains (e.g., cbBTC, WBTC are Bitcoin tokens)
**Pair** - Trading pairs between two assets (e.g., cbBTC/ETH, WBTC/ETH, WBTC/SOL)

### **Currency Cube** - Chain-Agnostic Aggregated View

Use the **Currency** cube when you want a unified price view of an asset across all blockchains.

**Key Features:**
- Aggregates all token representations of the same underlying asset for example for BTC it will combine multiple tokens like WBTC, cbBTC, LBTC etc.
- Can provide both chain specific and chain agnostic prices
- Can provide only USD-quoted prices
- Can combine volume and price data from all chains

[Learn more about Currency Cube ➤](/docs/trading/crypto-price-api/currency/)

### **Tokens Cube** - Chain-Wide Blended Candles

Use the **Tokens** cube when you want one candle per token per chain, or a stream of candles for every token on a chain.

**Key Features:**
- Aggregates across all pairs for that token
- Can provide both chain specific and chain agnostic prices
- Can provide only USD-quoted prices
- Can combine volume and price data from all chains

> Because the candle blends every pool where the token is base, thin pools contribute to it as well. For candles on **one specific token**, prefer the Pairs cube with rank 1 (below).

[Learn more about Tokens Cube ➤](/docs/trading/crypto-price-api/tokens/)

### **Pairs Cube** - Top Market and Pair-Specific Candles

Use the **Pairs** cube for OHLC on a specific market — and, with the rank filter, for the most accurate candles on a specific **token**.

**Key Features:**
- **Recommended for a single token:** add `Ranking: { Position: { eq: 1 } }` to get candles from the token's top market instead of a blend across all pools ([how and why](/docs/trading/crypto-price-api/pairs#most-accurate-token-price))
- Pair-specific OHLC data (e.g., ETH/USDC on Uniswap)
- Can be quoted in USD or quote token
- Market/DEX-specific data
- Most granular level of price data

[Learn more about Pairs Cube ➤](/docs/trading/crypto-price-api/pairs/)

## Real-Time OHLC Stream Examples

### 1. Live Bitcoin OHLC Across All Chains

Stream real-time Bitcoin OHLC data aggregated from all supported blockchains (Bitcoin, Ethereum WBTC, Solana, etc.) with 60-second intervals:

> Note: We include `Volume: { Usd: { gt: 5 } }` to further remove extreme outliers; the stream already pre-filters outliers—this is an additional check.

```graphql
subscription {
  Trading {
    Currencies(
      where: {
        Currency: { Id: { is: "bid:bitcoin" } },
        Interval: { Time: { Duration: { eq: 60 } } },
        Volume: { Usd: { gt: 5 } }
      }
    ) {
      Currency {
        Id
        Name
        Symbol
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
        BaseAttributedToUsd
        Quote
        Usd
      }
      Supply {
        TotalSupply
        FullyDilutedValuationUsd
        MarketCap
      }
      Price {
        IsQuotedInUsd
        Ohlc {
          Open    # First price in interval
          High    # Highest price in interval
          Low     # Lowest price in interval
          Close   # Last price in interval
        }
        Average {
          Mean
          SimpleMoving
          WeightedSimpleMoving
          ExponentialMoving
        }
      }
    }
  }
}
```

[Run Live Stream ➤](https://ide.bitquery.io/OHLC-of-a-currency-on-multiple-blockchains)

### 2. Ethereum OHLC on All DEXs

Get real-time Ethereum OHLC data from all decentralized exchanges:

> Note: We include `Volume: { Usd: { gt: 5 } }` to further remove extreme outliers; the stream already pre-filters outliers—this is an additional check.

```graphql
subscription {
  Trading {
    Pairs(
      where: {Currency: {Id: {is: "bid:eth"}}, Interval: {Time: {Duration: {eq: 60}}}, Volume: {Usd: {gt: 5}}}
    ) {
      Token {
        Symbol
        Network
        Address
      }
      QuoteToken {
        Symbol
        Network
        Address
      }
      Market {
        Name
        Protocol
        Network
        Address
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
        IsQuotedInUsd
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
    }
  }
}
```

[Run Live Stream ➤](https://ide.bitquery.io/All-pairs-of-ETH-currency)

### 3. Solana Token OHLC Stream

Monitor all Solana tokens with real-time OHLC data:

> Note: We include `Volume: { Usd: { gt: 5 } }` to further remove extreme outliers; the stream already pre-filters outliers—this is an additional check.

```graphql
subscription {
  Trading {
    Tokens(
      where: {
        Token: { Network: { is: "Solana" } },
        Interval: { Time: { Duration: { eq: 60 } } },
        Volume: { Usd: { gt: 5 } }
      }
    ) {
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
        IsQuotedInUsd
        Ohlc {
          Close
          High
          Low
          Open
        }
        Average {
          ExponentialMoving
          Mean
          SimpleMoving
          WeightedSimpleMoving
        }
      }
    }
  }
}
```

[Run Live Stream ➤](https://ide.bitquery.io/Aggregated-Price-of-all-tokens-in-real-time-on-one-chain)

## Historical OHLC Queries

**Note:** These examples use the **Crypto Price API** for **recent** OHLC. For **full historical** OHLC, use **[DEXTradeByTokens](/docs/cubes/dextradesbyTokens/)**.

### 1. Bitcoin OHLC (Crypto Price API)

Recent Bitcoin OHLC using the Crypto Price API (time range in the query matches what the Price Index supports).

[Run Query](https://ide.bitquery.io/historical-Bitcoin-OHLC-data-for-the-last-7-days)

> Note: We include `Volume: { Usd: { gt: 5 } }` in most examples to remove extreme outliers. The example uses a relative time window in `Block.Time`.

```graphql
{
  Trading {
    Currencies(
      where: {
        Currency: { Id: { is: "bid:bitcoin" } },
        Interval: { Time: { Duration: { eq: 3600 } } },
        Volume: { Usd: { gt: 5 } },
        Block: {Time:{
          since_relative:{days_ago:7}
        }}
      },
      limit: { count: 240 },
      orderBy: { descending: Block_Time }
    ) {
      Currency {
        Id
        Name
        Symbol
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
        BaseAttributedToUsd
        Quote
        Usd
      }
      Supply {
        TotalSupply
        FullyDilutedValuationUsd
        MarketCap
      }
      Price {
        IsQuotedInUsd
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
    }
  }
}
```

### 2. Top 10 Tokens by 5-Minute Price Change

Find the biggest movers with OHLC data and price change calculations:

> Note: We include `Volume: { Usd: { gt: 5 } }` in most examples to remove extreme outliers; this example already filters by `Volume: { Usd: { gt: 100000 } }`.

```graphql
{
  Trading {
    Tokens(
      limit: { count: 10 }
      orderBy: { descendingByField: "change" }
      where: {
        Price: { IsQuotedInUsd: true }
        Volume: { Usd: { gt: 100000 } }
        Interval: { Time: { Duration: { eq: 300 } } }
      }
    ) {
      Token {
        Address
        Id
        IsNative
        Name
        Network
        Symbol
        TokenId
      }
      Currency {
        Symbol
        Id
        Name
      }
      Interval {
        Time {
          Start
          End
          Duration
        }
      }
      Volume {
        Base
        BaseAttributedToUsd
        Quote
        Usd
      }
      Supply {
        TotalSupply
        FullyDilutedValuationUsd
        MarketCap
      }
      Price {
        IsQuotedInUsd
        Ohlc {
          Close
          High
          Low
          Open
        }
        Average {
          Estimate
          ExponentialMoving
          Mean
          SimpleMoving
          WeightedSimpleMoving
        }
      }
      diff: calculate(expression: "Price_Ohlc_Close - Price_Ohlc_Open")
      change: calculate(expression: "round(($diff / Price_Ohlc_Open), 3) * 100")
    }
  }
}
```

[Run Query ➤](https://ide.bitquery.io/5-minute-price-change-api)

## DEX-Specific OHLC Streams

### 1. Uniswap v3 OHLC Stream

Monitor all tokens on Uniswap v3 with 1-second OHLC data:

> Note: We include `Volume: { Usd: { gt: 5 } }` to further remove extreme outliers; the stream already pre-filters outliers—this is an additional check.

```graphql
subscription {
  Trading {
    Pairs(
      where: {
        Interval: { Time: { Duration: { eq: 1 } } },
        Price: { IsQuotedInUsd: true },
        Market: { 
          Network: { is: "Ethereum" },
          Address: { is: "0x1f98431c8ad98523631ae4a59f267346ea31f984" }
        },
        Volume: { Usd: { gt: 5 } }
      }
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
        IsQuotedInUsd
      }
      Currency {
        Symbol
        Name
        Id
      }
      QuoteCurrency {
        Name
        Symbol
        Id
      }
      Token {
        Name
        Symbol
        Address
        Id
        NetworkBid
      }
      QuoteToken {
        Name
        Symbol
        Id
        Address
        NetworkBid
      }
    }
  }
}
```

[Run Stream ➤](https://ide.bitquery.io/Uniswap-v3-DEX-tokens-1-second-price-stream-with-OHLC)

### 2. Raydium OHLC Stream (Solana)

Track all tokens on Raydium with real-time OHLC data:

> Note: We include `Volume: { Usd: { gt: 5 } }` to further remove extreme outliers; the stream already pre-filters outliers—this is an additional check.

```graphql
subscription {
  Trading {
    Pairs(
      where: {
        Interval: { Time: { Duration: { eq: 1 } } },
        Price: { IsQuotedInUsd: true },
        Market: { 
          Network: { is: "Solana" },
          Program: { is: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8" }
        },
        Volume: { Usd: { gt: 5 } }
      }
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
        IsQuotedInUsd
      }
      Currency {
        Symbol
        Name
        Id
      }
      QuoteCurrency {
        Name
        Symbol
        Id
      }
      Token {
        Name
        Symbol
        Address
        Id
        NetworkBid
      }
      QuoteToken {
        Name
        Symbol
        Id
        Address
        NetworkBid
      }
    }
  }
}
```

[Run Stream ➤](https://ide.bitquery.io/Raydium-Launchpad-DEX-tokens-1-second-price-stream-with-OHLC)

### 3. PancakeSwap v3 OHLC Stream (BSC)

Monitor BSC tokens on PancakeSwap v3:

> Note: We include `Volume: { Usd: { gt: 5 } }` to further remove extreme outliers; the stream already pre-filters outliers—this is an additional check.

```graphql
subscription {
  Trading {
    Pairs(
      where: {
        Interval: { Time: { Duration: { eq: 1 } } },
        Price: { IsQuotedInUsd: true },
        Market: { 
          Network: { is: "Binance Smart Chain" },
          Address: { is: "0x0bfbcf9fa4f9c56b0f40a671ad40e0805a091865" }
        },
        Volume: { Usd: { gt: 5 } }
      }
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
        IsQuotedInUsd
      }
      Currency {
        Symbol
        Name
        Id
      }
      QuoteCurrency {
        Name
        Symbol
        Id
      }
      Token {
        Name
        Symbol
        Address
        Id
        NetworkBid
      }
      QuoteToken {
        Name
        Symbol
        Id
        Address
        NetworkBid
      }
    }
  }
}
```

[Run Stream ➤](https://ide.bitquery.io/PancakeSwap-v3-DEX-tokens-1-second-price-stream-with-OHLC)

## Kafka Streaming for OHLC Data

For high-throughput applications, use our Kafka streams to get real-time OHLC data:

### Kafka Topic: `trading.prices`

The Kafka topic delivers real-time, pre-aggregated OHLC data for all supported tokens and currencies.

**Schema**: [Protobuf Schema](https://github.com/bitquery/streaming_protobuf/tree/main/market)

**Packages**:
- [Python Package](https://pypi.org/project/bitquery-pb2-kafka-package/)
- [NPM Package](https://www.npmjs.com/package/bitquery-protobuf-schema)

### Kafka Consumer Example (Python)

```python
from kafka import KafkaConsumer
import bitquery_pb2

# Configure Kafka consumer
consumer = KafkaConsumer(
    'trading.prices',
    bootstrap_servers=['your-kafka-broker:9092'],
    value_deserializer=lambda m: bitquery_pb2.PriceIndexMessage().ParseFromString(m)
)

# Consume OHLC data
for message in consumer:
    price_data = message.value
    
    # Extract OHLC data
    ohlc = price_data.price.ohlc
    print(f"Token: {price_data.token.symbol}")
    print(f"Open: {ohlc.open}")
    print(f"High: {ohlc.high}")
    print(f"Low: {ohlc.low}")
    print(f"Close: {ohlc.close}")
    print(f"Volume: {price_data.volume.usd}")
    print("---")
```

### Kafka Consumer Example (Node.js)

```javascript
const kafka = require('kafkajs');
const { PriceIndexMessage } = require('bitquery-protobuf-schema');

const client = kafka({
  clientId: 'ohlc-consumer',
  brokers: ['your-kafka-broker:9092']
});

const consumer = client.consumer({ groupId: 'ohlc-group' });

async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'trading.prices' });
  
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const priceData = PriceIndexMessage.decode(message.value);
      
      // Extract OHLC data
      const ohlc = priceData.price.ohlc;
      console.log(`Token: ${priceData.token.symbol}`);
      console.log(`Open: ${ohlc.open}`);
      console.log(`High: ${ohlc.high}`);
      console.log(`Low: ${ohlc.low}`);
      console.log(`Close: ${ohlc.close}`);
      console.log(`Volume: ${priceData.volume.usd}`);
      console.log('---');
    },
  });
}

run().catch(console.error);
```

## TradingView Integration

Our OHLC API is perfect for TradingView charting. Use our ready-to-use SDK:

### TradingView SDK

```javascript
import { BitqueryTradingViewDatafeed } from '@bitquery/tradingview-sdk';

const datafeed = new BitqueryTradingViewDatafeed({
  apiKey: 'your-bitquery-api-key',
  token: 'BTC', // or any supported token
  interval: '1m', // 1m, 5m, 15m, 1h, etc.
});

// Initialize TradingView widget
const widget = new TradingView.widget({
  symbol: 'BTC/USD',
  interval: '1m',
  container: 'tradingview_chart',
  datafeed: datafeed,
  library_path: '/tradingview/',
  locale: 'en',
  disabled_features: ['use_localstorage_for_settings'],
  enabled_features: ['study_templates'],
  charts_storage_url: 'https://saveload.tradingview.com',
  charts_storage_api_version: '1.1',
  client_id: 'tradingview.com',
  user_id: 'public_user_id',
  fullscreen: false,
  autosize: true,
});
```

[Get TradingView SDK ➤](https://www.npmjs.com/package/@bitquery/tradingview-sdk)

## Advanced OHLC Analytics

### 1. Price Change Analysis

Calculate percentage price changes using expressions:

```graphql
{
  Trading {
    Tokens(
      where: {
        Price: { IsQuotedInUsd: true },
        Volume: { Usd: { gt: 100000 } },
        Interval: { Time: { Duration: { eq: 300 } } }
      }
    ) {
      Token {
        Symbol
        Network
      }
      Price {
        Ohlc {
          Open
          Close
        }
      }
      # Calculate price change percentage
      priceChange: calculate(expression: "((Price_Ohlc_Close - Price_Ohlc_Open) / Price_Ohlc_Open) * 100")
      # Calculate absolute price change
      priceDiff: calculate(expression: "Price_Ohlc_Close - Price_Ohlc_Open")
    }
  }
}
```

### 2. Volume-Weighted OHLC

Get volume-weighted OHLC data for more accurate price representation:

> Note: We include `Volume: { Usd: { gt: 5 } }` to further remove extreme outliers; the stream already pre-filters outliers—this is an additional check.

```graphql
subscription {
  Trading {
    Pairs(
      where: {
        Currency: { Id: { is: "bid:eth" } },
        Interval: { Time: { Duration: { eq: 60 } } },
        Volume: { Usd: { gt: 5 } }
      }
    ) {
      Token {
        Symbol
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
          Open
          High
          Low
          Close
        }
        Average {
          WeightedSimpleMoving  # Volume-weighted average
          Mean                  # Simple average
        }
      }
    }
  }
}
```

### 3. Cross-Chain Arbitrage Detection

Find arbitrage opportunities using OHLC data across chains:

> Note: We include `Volume: { Usd: { gt: 5 } }` to further remove extreme outliers; the stream already pre-filters outliers—this is an additional check.

```graphql
{
  Trading {
    Pairs(
      where: {
        Currency: { Id: { is: "bid:bitcoin" } },
        QuoteCurrency: { Id: { is: "usdt" } },
        Volume: { Usd: { gt: 5 } }
      },
      limit: { count: 10 },
      orderBy: { descending: Block_Time },
      limitBy: { by: Market_Address, count: 1 }
    ) {
      Currency {
        Name
        Symbol
      }
      Market {
        Name
        Network
        Address
      }
      Price {
        Ohlc {
          Close
        }
        Average {
          Mean
        }
      }
      QuoteCurrency {
        Symbol
      }
    }
  }
}
```

[Run Query ➤](https://ide.bitquery.io/Find-arbitrage-opportunity-with-same-token-across-chains)

## Can I get 1-minute historical OHLC data for a full year? {#can-i-get-1-minute-historical-ohlc-data-for-a-full-year}

**Crypto Price API:** best for **live and recent** OHLC; an unbroken **one-year 1-minute** series may exceed what the Price Index is designed to serve—check your **plan** and try coarser intervals or **DEX-derived** data for deep history. **DEXTradeByTokens:** bucket with **`Time(interval: { count: 1, in: minutes })`** and a **365-day** **`Block.Time`** range; **minutes with no trades** will be **empty** or **sparse**, and the query can be **heavy**. Prefer **hourly/daily** bars or export **raw trades** for backfill. See [Historical Solana aggregate data](/docs/blockchain/Solana/historical-aggregate-data/) and [DEXTradesByTokens OHLC](/docs/cubes/dextradesbyTokens/#how-do-i-get-ohlc-in-a-dextradebytokens-query).

## Supported Blockchains

Our OHLC API supports all major blockchains:

- **Ethereum** - ETH, ERC-20 tokens
- **Solana** - SOL, SPL tokens  
- **Binance Smart Chain (BSC)** - BNB, BEP-20 tokens
- **Polygon** - MATIC, ERC-20 tokens
- **Arbitrum** - ETH, ERC-20 tokens
- **Optimism** - ETH, ERC-20 tokens
- **Base** - ETH, ERC-20 tokens
- **Tron** - TRX, TRC-20 tokens

## API Endpoints

- **GraphQL Endpoint**: `https://streaming.bitquery.io/graphql`
- **Kafka Broker**: `streaming.bitquery.io:9092`
- **Topic**: `trading.prices`

## Best Practices

1. **Choose the right API**: Use [Crypto Price API](/docs/trading/crypto-price-api/introduction/) as the **main** source for OHLC; use [DEXTradeByTokens](/docs/cubes/dextradesbyTokens/) for **historical** OHLC from DEX trades
2. **Choose the Right Interval**: Use 1s for high-frequency trading, 1m for standard charting
3. **Use USD Quoting**: Set `IsQuotedInUsd: true` for consistent price comparison

## Support

- **Documentation**: [Crypto Price API Docs](/docs/trading/crypto-price-api/introduction/)
- **IDE**: [Bitquery IDE](https://ide.bitquery.io)
- **Community**: [Discord](https://discord.gg/bitquery)
- **Support**: [Contact Support](https://support.bitquery.io)

---

*Get started with real-time OHLC data today and build the next generation of crypto trading applications.*
