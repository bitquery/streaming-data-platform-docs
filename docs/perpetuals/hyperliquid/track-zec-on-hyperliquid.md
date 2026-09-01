---
title: "Track ZEC on Hyperliquid — Positions, Liquidations, Funding & Trades API"
description: "Track Zcash (ZEC) perp activity on Hyperliquid with the Bitquery API: every open ZEC position market-wide, real-time liquidations, funding payments, whale trades, candles and mark prices over GraphQL and WebSocket."
sidebar_position: 7
keywords:
  - hyperliquid api
  - hyperliquid liquidations
  - ZEC hyperliquid
  - zcash perp api
  - hyperliquid funding rate api
  - hyperliquid open interest
  - hyperliquid positions api
  - ZEC liquidations
  - zcash futures data
  - hyperliquid whale tracking
  - ZEC funding rate
  - hyperliquid ZEC perpetual
---

# Track ZEC on Hyperliquid

ZEC (Zcash) is one of the most actively traded perp markets on Hyperliquid. This page collects ready-to-run queries for tracking the entire ZEC market — every open position, liquidations as they happen, funding flow, whale-sized fills, candles and mark prices — using the `Hyperliquid` cube on the [streaming API](https://streaming.bitquery.io/graphql).

Every query below also works as a real-time WebSocket stream: change `query` to `subscription` and drop `limit`/`orderBy`.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

## Every open ZEC position on the exchange

`CurrentPositions` is a state cube: it holds the currently open perp position of every trader. Unlike the native Hyperliquid API — which only returns positions for an address you already know — this enumerates the whole ZEC book, so you can compute market-wide long/short totals or find the biggest whales without knowing a single wallet in advance. Negative `Size` is a short; `Funding` is the position's accumulated funding (positive = collected, negative = paid).

Run it in the IDE: [All Open ZEC Positions ➤](https://ide.bitquery.io/zec-hyperliquid-open-positions)

```graphql
query {
  Hyperliquid {
    CurrentPositions(
      limit: {count: 200}
      orderBy: {descending: LastTime}
      where: {Market: {Symbol: {is: "ZEC"}}}
    ) {
      LastTime
      Market { Symbol Kind }
      Position { Size Leverage IsCross Funding RealizedPnl }
      Trader { Address }
    }
  }
}
```

To watch one whale instead, swap the filter to `where: {Trader: {Address: {is: "0x..."}}}` and you get every open position of that wallet across all markets.

## ZEC liquidations — history and live stream

Each liquidation carries the liquidated user, the `Method` (`market` for open-market liquidation, `backstop` when the backstop vault takes over), the mark price and the forced execution. The execution `Side` tells you which side got wiped: a liquidated short is closed by a `Buy`, a liquidated long by a `Sell`.

Run it in the IDE: [ZEC Liquidations ➤](https://ide.bitquery.io/zec-hyperliquid-liquidations)

```graphql
query {
  Hyperliquid {
    PerpLiquidations(
      limit: {count: 100}
      orderBy: {descending: Block_Time}
      where: {Liquidation: {Market: {Symbol: {is: "ZEC"}}}}
    ) {
      Block { Time }
      Liquidation {
        Market { Symbol }
        Method MarkPx Liquidator LiquidatedUser
        Execution { Price Size Side }
        Position { Leverage IsCross Side SizeBefore }
      }
    }
  }
}
```

### Real-time ZEC liquidation alerts

Run it in the IDE: [ZEC Liquidations Stream ➤](https://ide.bitquery.io/zec-hyperliquid-liquidations-stream)

```graphql
subscription {
  Hyperliquid {
    PerpLiquidations(
      where: {Liquidation: {Market: {Symbol: {is: "ZEC"}}}}
    ) {
      Block { Time }
      Liquidation {
        Market { Symbol }
        Method MarkPx LiquidatedUser
        Execution { Price Size Side }
        Position { Leverage IsCross SizeBefore }
      }
    }
  }
}
```

## ZEC funding payments — who pays whom

`PerpFundings` records every per-trader funding transfer at each hourly tick: the signed `Amount` (negative = the trader paid funding), the `Rate` applied and the position `Size`. When ZEC longs are crowded the rate is positive and longs pay shorts — summing `Amount` over a window shows exactly how much it costs to stay long.

Run it in the IDE: [ZEC Funding Payments ➤](https://ide.bitquery.io/zec-hyperliquid-funding-payments)

```graphql
query {
  Hyperliquid {
    PerpFundings(
      limit: {count: 200}
      orderBy: {descending: Block_Time}
      where: {Funding: {Market: {Symbol: {is: "ZEC"}}}}
    ) {
      Block { Time }
      Funding {
        Market { Symbol }
        Amount Rate Size
        Trader { Address }
      }
    }
  }
}
```

Add `Trader: {Address: {is: "0x..."}}` inside the `Funding` filter to compute the total funding one wallet has paid or collected on ZEC.

## Whale-sized ZEC trades

Every fill carries direction, leverage and realized PnL. Filter on `Execution: {Size: ...}` to see only whale prints — here, fills of 200 ZEC or more.

Run it in the IDE: [ZEC Whale Trades ➤](https://ide.bitquery.io/zec-hyperliquid-whale-trades)

```graphql
query {
  Hyperliquid {
    Trades(
      limit: {count: 100}
      orderBy: {descending: Block_Time}
      where: {Trade: {Market: {Symbol: {is: "ZEC"}}, Execution: {Size: {ge: "200"}}}}
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

### Stream every ZEC fill in real time

Run it in the IDE: [ZEC Trades Stream ➤](https://ide.bitquery.io/zec-hyperliquid-trades-stream)

```graphql
subscription {
  Hyperliquid {
    Trades(
      where: {Trade: {Market: {Symbol: {is: "ZEC"}}}}
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

## ZEC candles (OHLCV)

Candle `Duration` is in seconds — `60` for 1-minute, `300` for 5-minute, `3600` for hourly.

Run it in the IDE: [ZEC Hourly Candles ➤](https://ide.bitquery.io/zec-hyperliquid-hourly-candles)

```graphql
query {
  Hyperliquid {
    Candles(
      limit: {count: 168}
      orderBy: {descending: Interval_Time_Start}
      where: {Market: {Symbol: {is: "ZEC"}}, Interval: {Time: {Duration: {eq: 3600}}}}
    ) {
      Interval { Time { Start Duration } }
      Market { Symbol }
      Ohlc { Open High Low Close Volume }
    }
  }
}
```

## ZEC mark price

The latest mark price per market, streamable for live dashboards.

Run it in the IDE: [ZEC Mark Price ➤](https://ide.bitquery.io/zec-hyperliquid-mark-price)

```graphql
query {
  Hyperliquid {
    MarkPrices(
      limit: {count: 1}
      orderBy: {descending: LastTime}
      where: {Market: {Symbol: {is: "ZEC"}}}
    ) {
      LastTime
      Mark
      Market { Symbol Kind }
    }
  }
}
```

## ZEC leverage changes

`TraderLeverageUpdates` fires whenever a trader changes leverage or flips between cross and isolated margin on ZEC — often the tell that a large position is about to be opened or defended.

Run it in the IDE: [ZEC Leverage Updates ➤](https://ide.bitquery.io/zec-hyperliquid-leverage-updates)

```graphql
query {
  Hyperliquid {
    TraderLeverageUpdates(
      limit: {count: 100}
      orderBy: {descending: Block_Time}
      where: {LeverageUpdate: {Market: {Symbol: {is: "ZEC"}}}}
    ) {
      Block { Time }
      LeverageUpdate {
        Leverage IsCross
        Market { Symbol }
        Trader { Address }
      }
    }
  }
}
```

## Related pages

- [Hyperliquid API overview](/docs/perpetuals/hyperliquid) — all available cubes and the Kafka streams
- [Trades & Candles](/docs/perpetuals/hyperliquid/hyperliquid-trades-api)
- [Liquidations, Funding, Positions & Leverage](/docs/perpetuals/hyperliquid/hyperliquid-perpetuals-api)
- [Mark Prices & Price Updates](/docs/perpetuals/hyperliquid/hyperliquid-prices-api)
