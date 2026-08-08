---
title: "Solana Perps Trader Cookbook — Copy Trading, PnL & Signals"
sidebar_label: "Trader Cookbook"
sidebar_position: 3
description: "Ready-to-run queries for Solana perps: copy-trade a wallet, rank traders by PnL and win rate, top unrealized positions, whale fills, OHLC candles, open interest and order-flow signals."
keywords:
  - copy trading api solana
  - solana perps signals
  - track perp trader wallet
  - perp trader pnl api
  - trader win rate api
  - unrealized pnl api
  - whale trades solana
  - perps ohlc candles api
  - open interest chart api
  - order flow imbalance api
  - funding payments api
  - liquidation leaderboard
  - solana trading strategy data
  - perp dex analytics queries
---

# Solana Perps Trader Cookbook

Ready-to-run recipes for the questions traders, copy-traders and strategy builders
actually ask, built on the [Perp DEX cubes](/docs/perpetuals/). Every query here was
validated against the live endpoint; swap the example wallet/market for your own. Field
semantics live on the [Phoenix Perpetuals API](/docs/perpetuals/solana/phoenix-perpetuals-api)
page.

Two rules apply to almost every recipe:

- **`TraderIsAmm: false`** — the venue's AMM backstop trades every market; leave it in
  and it tops every leaderboard.
- **Latest-state snapshots** use `limitBy` + `orderBy: {descending: Block_Time}` — the
  newest row per key *is* the current state. Don't pre-filter `Closed: false` or
  `Size: {ne: 0}`: that skips past closing rows and resurrects stale positions. Take
  the latest row, then drop flats (`Size == 0`) client-side.

## Copy trading

### Follow a trader's every fill, live

Stream each execution of a wallet you follow — the copy-trade signal, including the
position it produced:

```graphql
subscription {
  Solana {
    PerpetualFills(
      where: {
        Fill: {
          Trader: { is: "DUGirckBgoaW3zoEPhTVVo68pZpXrTKuJrsLBLWcZQo2" }
          Liquidation: false
        }
      }
    ) {
      Block { Time }
      Fill {
        Asset { Symbol }
        Side
        ExecutionPrice
        Amount { Filled Quote }
        Position { Size EntryPrice }
      }
    }
  }
}
```

`Position { Size, EntryPrice }` after each fill tells you their resulting exposure —
you see reduces and flips, not just entries. Note that `Trader` is the venue's
position account (a PDA), which you learn from any of their fills or positions.

### A trader's current open book

Latest state per market for one wallet — what they hold right now:

```graphql
query {
  Solana {
    PerpetualPositions(
      limitBy: { by: Position_Asset_Id, count: 1 }
      orderBy: { descending: Block_Time }
      limit: { count: 100 }
      where: {
        Position: { Trader: { is: "DUGirckBgoaW3zoEPhTVVo68pZpXrTKuJrsLBLWcZQo2" } }
      }
    ) {
      Block { Time }
      Position {
        Asset { Symbol }
        Position { EntryPrice Size }
        MarkPrice
      }
    }
  }
}
```

Rows with `Size: 0` are markets they've fully closed — drop them and the rest is the
live book, with entry prices.

### Who is worth copying — the report card

Realized PnL, close count, win rate and liquidation count per trader, in one
aggregation:

```graphql
query {
  Solana {
    PerpetualPositions(
      limit: { count: 20 }
      orderBy: { descendingByField: "realized" }
      where: { Position: { TraderIsAmm: false, Closed: true } }
    ) {
      Position { Trader }
      realized: sum(of: Position_RealizedPnl)
      closes: count
      wins: count(if: { Position: { RealizedPnl: { gt: 0 } } })
      losses: count(if: { Position: { RealizedPnl: { lt: 0 } } })
      liquidated: count(if: { Position: { Liquidation: true } })
    }
  }
}
```

Win rate is `wins / closes`; a high `realized` with `liquidated > 0` tells you how
they treat risk. Add a `Block: { Time: { since: … } }` filter to score a recent window
instead of all time.

## Positions & PnL

### Top unrealized positions and traders

Unrealized PnL is `(mark − entry) × size` over each trader's latest open position.
One request returns both the position snapshot and fresh marks:

```graphql
query {
  Solana {
    openPositions: PerpetualPositions(
      limitBy: { by: [Position_Trader, Position_Asset_Id], count: 1 }
      orderBy: { descending: Block_Time }
      limit: { count: 3000 }
      where: { Position: { TraderIsAmm: false } }
    ) {
      Block { Time }
      Position {
        Trader
        Asset { Id Symbol }
        Position { EntryPrice Size }
        MarkPrice
      }
    }
    marks: PerpetualPrices(
      limitBy: { by: Price_Asset_Id, count: 1 }
      orderBy: { descending: Block_Time }
      limit: { count: 200 }
    ) {
      Price { Asset { Id Symbol } Mark }
    }
  }
}
```

Then a few lines client-side:

```python
marks = {m["Price"]["Asset"]["Id"]: m["Price"]["Mark"] for m in d["marks"]}
open_pos = []
for r in d["openPositions"]:
    p = r["Position"]; size = p["Position"]["Size"]
    if size == 0:
        continue  # flat = closed
    mark = marks.get(p["Asset"]["Id"]) or p["MarkPrice"]
    upnl = (mark - p["Position"]["EntryPrice"]) * size  # signed Size handles shorts
    open_pos.append((p["Trader"], p["Asset"]["Symbol"], size, upnl))

top_positions = sorted(open_pos, key=lambda x: x[3], reverse=True)
```

Sum per `Trader` for a whale-exposure leaderboard. Prefer the `marks` alias over the
position row's own `MarkPrice` — the latter is denormalized and can be `0`.

### Funding a trader has paid or received

Funding settlements are their own rows — `Funding` non-zero, size unchanged:

```graphql
query {
  Solana {
    PerpetualPositions(
      limit: { count: 100 }
      orderBy: { descending: Block_Time }
      where: {
        Position: {
          Trader: { is: "DUGirckBgoaW3zoEPhTVVo68pZpXrTKuJrsLBLWcZQo2" }
          Funding: { ne: 0 }
        }
      }
    ) {
      Block { Time }
      Position { Asset { Symbol } Funding }
    }
  }
}
```

Positive = received, negative = paid. Replace the field list with
`total: sum(of: Position_Funding)` for the net carry cost of holding their positions.

## Market signals

### Whale fills

Every fill above a notional threshold — as history or a live tape:

```graphql
subscription {
  Solana {
    PerpetualFills(where: { Fill: { Amount: { Quote: { gt: 5000 } } } }) {
      Block { Time }
      Fill {
        Asset { Symbol }
        Side
        ExecutionPrice
        Amount { Filled Quote }
        Trader
        Liquidation
      }
    }
  }
}
```

As a `query`, add `orderBy: { descending: Block_Time }` and a `limit` for the recent
whale prints.

### OHLC candles from the mark price

Strategy builders and backtesters: bucket `PerpetualPrices` into intervals and take
argMin/argMax aggregates —

```graphql
query {
  Solana {
    PerpetualPrices(
      where: { Price: { Asset: { Symbol: { is: "BTC" } } } }
      orderBy: { ascendingByField: "Block_Time" }
      limit: { count: 96 }
    ) {
      Block { Time(interval: { in: minutes, count: 15 }) }
      Price {
        open: Mark(minimum: Block_Time)
        high: Mark(maximum: Price_Mark)
        low: Mark(minimum: Price_Mark)
        close: Mark(maximum: Block_Time)
      }
    }
  }
}
```

`Mark(minimum: Block_Time)` reads "the Mark at the earliest time in the bucket" —
open; `Mark(maximum: Price_Mark)` is the bucket's high. Price rows are emitted on
trading activity, so an interval with no trades produces no candle (no
zero-filled bars).

### Open interest, basis and fee revenue over time

One query per market gives an OI series, the perp-vs-spot basis, and — because
`TakerFees`/`MakerFees` are cumulative counters — per-bucket fee revenue as
end-minus-start:

```graphql
query {
  Solana {
    PerpetualMarketSummaries(
      where: { MarketSummary: { Asset: { Symbol: { is: "SOL" } } } }
      orderBy: { ascendingByField: "Block_Time" }
      limit: { count: 168 }
    ) {
      Block { Time(interval: { in: hours, count: 1 }) }
      MarketSummary {
        oi: OpenInterest(maximum: Block_Time)
        mark: Mark(maximum: Block_Time)
        spot: SpotIndex(maximum: Block_Time)
        takerFeesEnd: TakerFees(maximum: Block_Time)
        takerFeesStart: TakerFees(minimum: Block_Time)
      }
    }
  }
}
```

Basis = `mark − spot`; hourly taker fees = `takerFeesEnd − takerFeesStart`. Rising OI
with a widening basis is the classic crowded-longs signal.

### Order-flow pressure — taker buys vs sells

Conditional sums split taker volume by side per bucket:

```graphql
query {
  Solana {
    PerpetualFills(
      where: { Fill: { Asset: { Symbol: { is: "SOL" } } } }
      orderBy: { ascendingByField: "Block_Time" }
      limit: { count: 168 }
    ) {
      Block { Time(interval: { in: hours, count: 1 }) }
      buyVol: sum(of: Fill_Amount_Quote, if: { Fill: { Side: { is: "bid" } } })
      sellVol: sum(of: Fill_Amount_Quote, if: { Fill: { Side: { is: "ask" } } })
      trades: count
    }
  }
}
```

`(buyVol − sellVol) / (buyVol + sellVol)` is a ready order-flow-imbalance series.

## Risk

### Biggest liquidations

Rank forced closes by what they took:

```graphql
query {
  Solana {
    PerpetualPositions(
      limit: { count: 20 }
      orderBy: { descendingByField: "lost" }
      where: { Position: { Type: { is: "Liquidation" } } }
    ) {
      Position { Trader Asset { Symbol } }
      lost: sum(of: Position_LiquidatedQuote)
      events: count
    }
  }
}
```

For the live feed version and the multi-row anatomy of a liquidation, see the
[liquidation section](/docs/perpetuals/solana/phoenix-perpetuals-api#positions-pnl--liquidations--perpetualpositions)
of the Phoenix page.

---

Every `query` above becomes a live stream by switching to `subscription` and removing
`limit`/`orderBy`/`limitBy` — except the snapshot and interval recipes, which are
inherently query-shaped. Run them over Kafka instead with the
[`solana.perpetual.proto` topic](/docs/streams/protobuf/chains/Solana-perpetual-protobuf)
when you need the full firehose.
