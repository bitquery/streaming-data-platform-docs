# Price Index API - Introduction

Starting July 2025, we have a introduced separate multi-chain **Price index APIs and Streams** via graphQL and [Kafka](https://github.com/bitquery/streaming_protobuf/blob/feature/trading/market/price_index.proto).

These tools let you stream and query aggregated price data—in USD or other paired currencies—based on time and volume for all tokens across EVM, Solana, Tron, and other supported chains.

The Price Index provides more than just pair prices—it also includes OHLCV (K-Line), Simple Moving Averages (SMA), Weighted Moving Averages (WMA), mean prices, and other key price-related statistics.
While you can access the aggregated price for a single trading pair, the Price Index also supports cross-chain and cross-DEX aggregation, giving you a unified view of token prices across multiple ecosystems.

These APIs are available on the **[EAP Endpoint](https://ide.bitquery.io/?endpoint=https://streaming.bitquery.io/eap)** and **[Streaming Endpoint](https://ide.bitquery.io/?endpoint=https://streaming.bitquery.io/graphql)**

## What is the Price Index API and Why Does It Matter?

The Price Index API/Stream provides real-time, aggregated price data with ultra-low latency across multiple trading pairs, tokens, decentralized exchanges (DEXs), and blockchains. It’s the first product of its kind, designed to help developers access accurate, up-to-the-second prices for building financial applications.

This API is the foundational layer of our trading-focused data suite. We're actively expanding our trading dataset, with much more to come in the months and years ahead.

The focus of this product suite is to help traders win. As we receive feedback, we will improve the dataset quality, add more metrics and APIs.

## How is this API different from our existing DEXTrades and DEXTRadesByToken APIs?

The Price Index API is a chain-agnostic, pre-aggregated price feed designed specifically for trading,futures, charting, and analytics. Here's how it differs from the existing **DEXTrades** and **DEXTradesByToken** APIs:

- **Granularity**:

  - **DEXTrades / DEXTradesByToken** provide **transaction-level data**, showing every trade on supported DEXs for each chain.
  - The **Price Index API** provides **pre-aggregated price metrics** such as OHLC (Open, High, Low, Close) and average prices, calculated over volume- or time-based intervals—as granular as 1 second.

- **Aggregation**:

  - In DEX APIs, you had to **aggregate trades** to calculate OHLC or moving averages.
  - The Price Index API provides **ready-to-use OHLC and price statistics** out of the box , no need to calculate anything.

- **Filtering Bad Trades**:

  - DEX APIs provide all trade data, including every transaction. You can filter this data by trade amount and other parameters to exclude outliers or irrelevant trades that could distort price accuracy.
  - The Price Index API does this automatically—filtering out bad or low-quality trades—to deliver a clean, reliable, and accurate price feed.

- **Chain Perspective**:

  - DEX APIs are **chain-specific**: each query targets a specific network (e.g., Ethereum, Solana, Tron).
  - The Price Index API is **chain-agnostic**: you can get price data across all chains for a given token or token representation (e.g., WBTC on Ethereum, native BTC on Bitcoin, etc.).

## Accessing the API

![](/img/trade_api/api.png)

This stream has premade-OHLC in the response which you feed directly to your charting solution without having to calculate it.

> Note: All queries can be converted to a graphQL stream (Websocket) by changing the keyword `query` to `subscription`

### Kafka Topic for Price Index Stream: `trading.prices`

This Kafka topic delivers **real-time, pre-aggregated price data** for tokens, currencies, and trading pairs across all supported blockchains. The data structure is a combination of all 3 cubes described in next section. 

Schema for the proto topic is [here](https://github.com/bitquery/streaming_protobuf/tree/main/market).
The [python package](https://pypi.org/project/bitquery-pb2-kafka-package/) and [npm package](https://www.npmjs.com/package/bitquery-protobuf-schema) already have all schema updated.

Each message contains:

- **Price metrics** – OHLC (Open, High, Low, Close), Mean Price, SMA, WMA, EMA in USD
- **Volume data** – Base, Quote, and Base in USD
- **Interval-based aggregation** – fixed durations (1s, 3s, 5s, 10s, etc.)
- **Clean feed** – low-quality and outlier trades are filtered automatically for accuracy.

> **Note on `"Quotes"`**:  
> The `"Quotes": [...]` section in the Kafka stream shows how much was traded in the native token (e.g., SOL) and how the USD value was derived.  
> All following price entries (`MeanPrice`, `SMA`, `OHLC`, etc.) are already expressed in USD and ready for direct use in charting, bots, or analytics.

### Cubes in the API

The Price APIs have three core data cubes:

- **Tokens**: Price data for a specific token on a specific chain. Use this when you care about chain-specific prices like USDT on Solana.
- **Currencies**: An aggregated view of tokens that represent the same underlying asset. For example, tokens like cbBTC, WBTC, and other Bitcoin-wrapped tokens are all grouped under the Bitcoin currency.
- **Pairs**: Price and volume data for token pairs on specific markets/protocols. E.g., SOL/USDC on Raydium (Solana) or ETH/USDT on Uniswap (Ethereum).

> Note: Expressions are supported in this API.

## Currencies

Currencies are representation of all tokens on various chains supported on Price Index. For example, take the case of Bitcoin, while it is a native token on Bitcoin chain, it is also traded on EVM chains as WBTC ( wrapped BTC). Now all these representations of BTC are represented as a single currency.

```

{
  Trading {
    Currencies(
      limit: {count: 1}
      orderBy: {descending: Block_Time}
      where: {Currency: {Id: {is: "bid:bitcoin"}}}
    ) {
      Volume {
        Usd
        Quote
        BaseQuotedInUsd
        Base
      }
      Price {
        Ohlc {
          Open
          Low
          High
          Close
        }
        IsQuotedInUsd
        Average {
          Mean
          WeightedSimpleMoving
          SimpleMoving
          ExponentialMoving

        }
      }
      Currency {
        Symbol
        Name
        Id
      }
      Block {
        Timestamp
      }
      Interval {
        Time {
          Duration
          Start
          End
        }

      }
    }
  }
}

```

### How the above query work?

It takes amounts and prices from all chains that use BTC and wrapped versions (including bridged versions) and presents an aggregated view. The OHLC, mean and other values represent a stable BTC picture.

## Tokens

Let's say you don't want a chain agnostic view, but want to focus on a particular chain. How to stream or query prices for it? This is where tokens come in.

```
{
  Trading {
    Tokens(
      where: {Token: {Address: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}, Network: {is: "solana"}}, Interval: {Time: {Duration: {eq: 1}}}}
      limit: {count: 1}
      orderBy: {descending: Block_Time}
    ) {
      Token {
        Address
        Id
        IsNative
        Name
        Network
        Name
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
        BaseQuotedInUsd
        Quote
        Usd
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

We filter for specific tokens using the token `Address` and `Network`. If you need to stream all token prices on say Solana, simply set `Network` to `solana`.

```
subscription {
  Trading {
    Tokens(where: {Token: {Network: {is: "solana"}}}) {
      Token {
        Address
        Id
        IsNative
        Name
        Network
        Name
        Symbol
        TokenId
        Network
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
        BaseQuotedInUsd
        Quote
        Usd
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

## Pairs

This is the 3rd cube in these set of APIs. The Pairs cube gives you price, volume, and market-level trading data between two tokens — a base token and a quote token.
We will breakdown in detail how base token and Quote are chosen in the next section.

> **Tip**: Use `TokenId` instead of `Token.Address` to fetch all variants of the same token (e.g., ETH, WETH, bridged ETH) across multiple chains.

```
subscription {
  Trading {
    Pairs(
      where: {Market: {Network: {is: "Base"}}, QuoteToken: {Address: {is: "0x4200000000000000000000000000000000000006"}}, Token: {Address: {is: "0x940181a94a35a4569e4529a3cdfb74e38fd98631"}}}
    ) {
      Currency {
        Symbol
        Name
        Id
      }
      Market {
        Protocol
        Program
        Network
        Name
        Address
      }
      Token {
        Address
        Id
        Name
        Symbol
        TokenId
      }
      Volume {
        Usd
        Base
        Quote
        BaseQuotedInUsd
      }
      QuoteToken {
        TokenId
        Name
        Id
        Address
        Symbol
      }
      QuoteCurrency {
        Id
      }
      Price {
        Ohlc {
          Open
          Low
          High
          Close
        }
        Average {
          WeightedSimpleMoving
          SimpleMoving
          Mean
          ExponentialMoving
        }
      }
    }
  }
}


```

## Understanding Intervals

Unlike DEXtrades APIs, the intervals here are fixed and cannot be arbitrary.

### Supported Time Intervals

The following durations (in seconds) are supported for querying or streaming historical and real-time data, unlike DEX APIs, these intervals are fixed, other values are not supported.

`1,  3,  5,  10,  30,  60,  300,  900,  1800,  3600`

### Supported Volume Aggregation Levels

Use `TargetVolume` to get price intervals aggregated over a volume threshold:

`1000, 10000, 100000, 1000000 (USD)`

## When to Choose Which Cube (Token, Currency, Pair)?

### Use the **`Tokens`** cube when:

- You want token price data **on a specific blockchain**.
- You're interested in metrics like OHLC, volume, and moving averages **for one network** (e.g., USDC on Solana or ETH on Arbitrum).
- You want to stream or query **chain-specific** price movements.

### Use the **`Currencies`** cube when:

- You want a **chain-agnostic view** of a token (e.g., BTC across Bitcoin, Ethereum (WBTC), Solana, etc.).
- You need a **global price** for a currency, combining its various representations.
- You're looking for **aggregated OHLC and average prices** for a token across chains.

### Use the **`Pairs`** cube when:

- You want **pair-level trading data** (e.g., SOL/USDC, ETH/DAI).
- You’re analyzing trading activity **on a specific market or DEX** (e.g., Uniswap, PancakeSwap, Raydium).
- You need **OHLC, volume, liquidity**, and market-specific pricing between two tokens.
- You're exploring **price arbitrage** or spreads across chains or platforms.
