---
title: "Hyperliquid Trades & Candles API"
description: "Query and stream Hyperliquid trades (fills) and OHLCV candles with Bitquery GraphQL and WebSocket: price, size, direction, fees, leverage, realized PnL and per-interval OHLCV."
sidebar_position: 2
keywords:
  - Hyperliquid trades API
  - Hyperliquid fills API
  - Hyperliquid trade stream
  - Hyperliquid OHLCV
  - Hyperliquid candles API
  - Hyperliquid candlestick data
  - Hyperliquid BTC trades
  - Hyperliquid realized PnL
  - Hyperliquid trade direction
  - Hyperliquid WebSocket trades
  - Bitquery Hyperliquid trades
---

# Hyperliquid Trades & Candles API

This page covers the `Trades` and `Candles` cubes: every fill on Hyperliquid with full execution context, and OHLCV candles per market and interval.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

## Latest trades

Each fill carries the execution (price, size, side, aggressor flag), the position it changed (leverage, margin mode, size before, realized PnL) and fees. `Direction` is one of `Open Long`, `Open Short`, `Close Long`, `Close Short`.

Run it in the IDE: [Hyperliquid Latest Trades ➤](https://ide.bitquery.io/hyperliquid-latest-trades)

```graphql
query {
  Hyperliquid {
    Trades(limit: {count: 50}, orderBy: {descending: Block_Time}) {
      Block { Number Time }
      Trade {
        Market { Symbol CoinRaw Kind IsPerp Protocol }
        Execution { Price Size Side Direction IsAggressor Oid Tid Hash }
        Fees { Fee FeeToken BuilderFee }
        IsTwap
        Position { Leverage IsCross Side SizeBefore RealizedPnl }
        Trader { Address Vault Signer }
      }
    }
  }
}
```

Notes on the payload:

- `Execution.Tid` is the trade id, `Oid` the order id that got filled, `Hash` the action hash.
- `Fees.Fee` is in `FeeToken` (usually USDC); a **negative fee is a maker rebate**.
- `Position.SizeBefore` is the signed position size before the fill (negative = short); `RealizedPnl` is the PnL realized by this fill.
- `IsTwap: true` marks fills produced by a TWAP order (see [TWAPs](/docs/blockchain/hyperliquid/hyperliquid-orders-api#twap-orders)).

### Trades of one market

Run it in the IDE: [Hyperliquid BTC Perp Trades ➤](https://ide.bitquery.io/hyperliquid-btc-perp-trades)

```graphql
query {
  Hyperliquid {
    Trades(
      limit: {count: 50}
      orderBy: {descending: Block_Time}
      where: {Trade: {Market: {Symbol: {is: "BTC"}}}}
    ) {
      Block { Time }
      Trade {
        Execution { Price Size Side Direction IsAggressor }
        Position { Leverage IsCross RealizedPnl }
        Trader { Address }
      }
    }
  }
}
```

Filter by trader instead with `where: {Trade: {Trader: {Address: {is: "0x..."}}}}`.

## Real-time trades stream

Run it in the IDE: [Hyperliquid Trades Stream ➤](https://ide.bitquery.io/hyperliquid-trades-stream)

```graphql
subscription {
  Hyperliquid {
    Trades {
      Block { Number Time }
      Trade {
        Market { Symbol Kind IsPerp }
        Execution { Price Size Side Direction IsAggressor Oid Tid }
        Fees { Fee FeeToken }
        IsTwap
        Position { Leverage IsCross Side RealizedPnl }
        Trader { Address }
      }
    }
  }
}
```

## OHLCV candles

The `Candles` cube provides OHLCV per market and interval. `Interval.Time.Duration` is the candle length in **seconds** (e.g. `60` for one minute), `Start` the interval open time. OHLCV values are floats.

Run it in the IDE: [Hyperliquid BTC OHLCV Candles ➤](https://ide.bitquery.io/hyperliquid-btc-ohlcv-candles)

```graphql
query {
  Hyperliquid {
    Candles(
      limit: {count: 60}
      orderBy: {descending: Interval_Time_Start}
      where: {Market: {Symbol: {is: "BTC"}}, Interval: {Time: {Duration: {eq: 60}}}}
    ) {
      Interval { Time { Start Duration } }
      Market { Symbol Kind CoinRaw }
      Ohlc { Open High Low Close Volume }
    }
  }
}
```

HIP-3 markets get candles too — e.g. `where: {Market: {CoinRaw: {is: "mkts:AAPL"}}}` for the tokenized-stock market.

### Real-time candle stream

Run it in the IDE: [Hyperliquid Candles Stream ➤](https://ide.bitquery.io/hyperliquid-candles-stream)

```graphql
subscription {
  Hyperliquid {
    Candles(where: {Market: {Symbol: {is: "BTC"}}}) {
      Interval { Time { Start Duration } }
      Market { Symbol Kind }
      Ohlc { Open High Low Close Volume }
    }
  }
}
```

Remove the `Symbol` filter to stream candle updates for every market.
