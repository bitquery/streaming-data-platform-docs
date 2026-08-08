---
title: "Phoenix Perpetuals API — Solana Perp DEX Data & Streams"
sidebar_label: "Phoenix Perpetuals (Solana)"
sidebar_position: 2
description: "Phoenix Perpetuals API on Solana: query and stream orders, fills, positions, realized PnL, liquidations, funding, best bid/ask, mark price and open interest."
keywords:
  - phoenix perpetuals api
  - phoenix perps solana
  - phoenix perp dex
  - ellipsis labs phoenix
  - phoenix eternal program
  - solana perp dex api
  - solana perps api
  - solana perpetual futures data
  - solana liquidations api
  - solana open interest api
  - perps order lifecycle
  - solana mark price stream
  - stock perpetuals solana
  - commodity perps api
  - solana derivatives websocket
  - realized pnl api
---

import FAQ from "@site/src/components/FAQ";

# Phoenix Perpetuals API — Solana Perp DEX Data & Streams

[Phoenix Perpetuals](https://www.ellipsislabs.xyz/) is the fully onchain perpetual
futures exchange built by Ellipsis Labs, the team behind the Phoenix spot order book on
Solana. Bitquery indexes it at event level into five cubes, each available as a GraphQL
`query` and as a WebSocket `subscription`.

|                     |                                                        |
| ------------------- | ------------------------------------------------------ |
| **Exchange family** | `Phoenix`                                              |
| **Exchange name**   | `phoenix_eternal`                                      |
| **Program**         | `EtrnLzgbS7nMMy5fbD42kXiUzGg8XQzJ972Xtk1cjWih`         |
| **Quote currency**  | `PhUsd` — mint `PhUsd11YkbjSaWjFncfAAmatntsjx3MgDR9B6g1ks3A`, 6 decimals |
| **Markets**         | Crypto majors and memecoins, US equities, commodities, pre-IPO names |
| **Endpoints**       | `https://streaming.bitquery.io/graphql` and `…/eap`; streams via `wss://streaming.bitquery.io/graphql` |
| **Kafka**           | Same data as protobuf on the [`solana.perpetual.proto` topic](/docs/streams/protobuf/chains/Solana-perpetual-protobuf) |

## Reading the data model

Every cube shares the same `Asset` block — the perpetual market being traded:

- **`Asset.Id`** — the venue's numeric market id (e.g. BTC is `"1"`). Stable key; filter on it or on `Symbol`.
- **`Asset.Symbol`** — the underlying: `BTC`, `SOL`, `AAPL`, `TSLA`, `GOLD`, `WTIOIL`, …
- **`Asset.LotSize` / `Asset.TickSize`** — minimum size and price increments.
- **`Asset.QuoteCurrency`** — always `PhUsd` on Phoenix; all prices and quote amounts are in it.
- **Sizes are signed** where direction matters: negative size = short / sell side.
- **`Trader` vs `Signer`** — `Trader` is the account whose position or order it is;
  `Signer` signed the transaction (they differ for liquidations, AMM flow, and delegated flows).
- **`TraderIsAmm` / `CounterpartyIsAmm`** — Phoenix runs an AMM backstop alongside the
  order book. Rows flag whether each side is the AMM.

To see which markets exist right now, group fills (or any cube) by asset:

```graphql
query {
  Solana {
    PerpetualFills(limit: { count: 100 }, orderBy: { descendingByField: "count" }) {
      count
      Fill {
        Asset {
          Id
          Symbol
          LotSize
          TickSize
          QuoteCurrency { Symbol }
        }
      }
    }
  }
}
```

## Live prices — `PerpetualPrices`

One row per order-book price tick: best bid, best ask, mark price, and the last trade
price when the tick was caused by a trade.

```graphql
query {
  Solana {
    PerpetualPrices(limit: { count: 10 }, orderBy: { descending: Block_Time }) {
      Block { Time }
      Transaction { Signature Signer }
      Price {
        Asset {
          Symbol
          QuoteCurrency { Symbol }
        }
        BestAsk
        BestBid
        LastTrade
        Mark
        SequenceNumber
      }
    }
  }
}
```

Notes:

- `LastTrade` is `0` on ticks not caused by a trade (quote updates, cancels). Filter
  `Price: { LastTrade: { gt: 0 } }` for trade prints only.
- `SequenceNumber` is the venue's monotonic sequence — use it to order ticks within a slot.

Stream the BBO for one market live:

```graphql
subscription {
  Solana {
    PerpetualPrices(where: { Price: { Asset: { Symbol: { is: "BTC" } } } }) {
      Block { Time }
      Price {
        Asset { Symbol }
        BestBid
        BestAsk
        Mark
      }
    }
  }
}
```

## Open interest & fees — `PerpetualMarketSummaries`

Market-level state updates: mark price, the spot index it tracks, open interest, and
fee counters.

```graphql
query {
  Solana {
    PerpetualMarketSummaries(
      where: { MarketSummary: { Asset: { Symbol: { is: "JTO" } } } }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Block { Time }
      Transaction { Signature }
      MarketSummary {
        Asset {
          Id
          Symbol
          QuoteCurrency { Symbol }
        }
        Mark
        SpotIndex
        OpenInterest
        MakerFees
        TakerFees
      }
    }
  }
}
```

You can filter by the numeric market id instead — `where: { MarketSummary: { Asset: { Id: { eq: "22" } } } }`
selects the same JTO market.

Notes:

- `OpenInterest` is in base units of the asset (e.g. BTC for the BTC market).
- **`MakerFees` and `TakerFees` are cumulative counters** since market inception, in
  `PhUsd`. To get fees generated over an interval, take the difference between the
  latest value and the value at the start of the interval — don't read a single row
  as a per-block fee.
- `Mark` vs `SpotIndex` gives you the perp premium/discount at any moment.

For a dashboard, grab the **latest snapshot of every market in one query** with `limitBy`
on the asset id:

```graphql
query {
  Solana {
    PerpetualMarketSummaries(
      limitBy: { by: MarketSummary_Asset_Id, count: 1 }
      limit: { count: 100 }
      orderBy: { descending: Block_Time }
    ) {
      Block { Time }
      MarketSummary {
        Asset { Id Symbol }
        Mark
        SpotIndex
        OpenInterest
      }
    }
  }
}
```

Stream open-interest changes across all markets:

```graphql
subscription {
  Solana {
    PerpetualMarketSummaries {
      Block { Time }
      MarketSummary {
        Asset { Symbol }
        Mark
        SpotIndex
        OpenInterest
      }
    }
  }
}
```

## Order lifecycle — `PerpetualOrders`

One row per order event. `Order.Type` is the **event**, and the nested
`Order.Order.Type` is the **order kind**:

| Field                | Values seen                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------ |
| `Order.Type` (event) | `OrderRequested`, `OrderPlaced`, `OrderCancelled`, `OrderRejected`, `StopLossPlaced`, `TakeProfitPlaced`, `TriggerPlaced`, `TriggerExecuted`, `TriggerCancelled`, `ConditionalExecuted`, `ConditionalCancelled` |
| `Order.Order.Type` (kind) | `limit`, `market`, `post-only`, `stop-loss`, `take-profit` (empty on events where kind isn't re-stated, e.g. cancels) |
| `Order.Order.CancelReason` | `UserRequested`, `Expired`, `ReduceOnlyInvalidated`, `SelfTradeCancelProvide`                          |
| `Order.Order.RejectReason` | `TiFInvalid`, `PostOnlyCross`                                                                          |

A typical placement produces `OrderRequested` followed by `OrderPlaced` (which carries
the assigned `Order.Order.Id`) in the same transaction.

More lifecycle details, all observable in the data:

- **Conditional & trigger events** (`Conditional*`, `Trigger*`) describe the stop/take-profit
  machinery: a `StopLossPlaced` row carries the `Price.Trigger` level and a
  `Order.ConditionalId` that later `TriggerExecuted` / `ConditionalCancelled` rows
  reference. These bookkeeping rows have an empty `Side`.
- **Time-in-force**: `Order.Order.ValidUntilSlot` is a slot-based expiry for resting
  quotes (`0` = no expiry). Orders that hit it are cancelled with
  `CancelReason: "Expired"`.
- **`Order.Order.ClientId`** is the trader's own hex order identifier, when supplied —
  useful for reconciling your execution system against the chain.

```graphql
query {
  Solana {
    PerpetualOrders(limit: { count: 10 }, orderBy: { descending: Block_Time }) {
      Block { Time }
      Transaction { Signature }
      Order {
        Asset { Symbol }
        Type
        Side
        Trader
        Signer
        Price {
          Limit
          Trigger
          Mark
        }
        Amount {
          Size
          Remaining
          Quote
        }
        Order {
          Id
          Type
          ReduceOnly
          CancelReason
          RejectReason
        }
      }
    }
  }
}
```

Stream every stop-loss and take-profit placement as it happens:

```graphql
subscription {
  Solana {
    PerpetualOrders(
      where: { Order: { Type: { in: ["StopLossPlaced", "TakeProfitPlaced"] } } }
    ) {
      Block { Time }
      Order {
        Asset { Symbol }
        Type
        Side
        Trader
        Price { Trigger Mark }
        Amount { Size }
      }
    }
  }
}
```

## Trades — `PerpetualFills`

One row per execution. `Side` is the taker's side (`bid` = taker bought,
`ask` = taker sold); `Amount.Size` is signed by direction while `Amount.Filled` is the
unsigned fill quantity and `Amount.Quote` the quote value.

```graphql
query {
  Solana {
    PerpetualFills(limit: { count: 10 }, orderBy: { descending: Block_Time }) {
      Block { Time }
      Transaction { Signature }
      Fill {
        Asset {
          Symbol
          QuoteCurrency { Symbol Decimals }
        }
        Side
        ExecutionPrice
        MarkPrice
        Amount {
          Filled
          Size
          Quote
          Fee
          Remaining
        }
        Trader
        TraderIsAmm
        Counterparty
        CounterpartyIsAmm
        MakerOrderId
        SplineId
        Collateral
        Position {
          EntryPrice
          Size
        }
        Liquidation
        Liquidator
      }
    }
  }
}
```

Notes:

- **AMM fills**: when `CounterpartyIsAmm` is `true`, the fill matched the AMM backstop —
  `MakerOrderId` is empty and `SplineId` identifies the AMM curve segment. Book fills
  carry the maker's `MakerOrderId` instead. The AMM currently absorbs the large majority
  of taker flow, so segment by this flag before drawing conclusions about book liquidity.
- `Amount.Fee` is the fee charged on the fill in `PhUsd`; it is `0` on most fills and
  never negative in observed data.
- `Position { EntryPrice, Size }` is the trader's position **after** this fill — you
  can follow a position's evolution from fills alone.
- `Collateral` is the trader's collateral balance snapshot in `PhUsd`.
- `Liquidation: true` marks forced fills, with the `Liquidator` address populated.

All fills of one trader (excluding liquidations):

```graphql
query {
  Solana {
    PerpetualFills(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: {
        Fill: {
          Liquidation: false
          Signer: { is: "7Kjwrohbf49adi5Gg4WM1M9h68UZSBFvLVRdw7PoeX5E" }
        }
      }
    ) {
      Block { Time }
      Transaction { Signature }
      Fill {
        Asset { Symbol }
        Side
        ExecutionPrice
        Amount { Filled Quote Fee }
        Position { EntryPrice Size }
      }
    }
  }
}
```

## Positions, PnL & liquidations — `PerpetualPositions`

One row per position state change: size transitions, realized PnL, funding settlements,
and liquidations.

```graphql
query {
  Solana {
    PerpetualPositions(limit: { count: 10 }, orderBy: { descending: Block_Time }) {
      Block { Time }
      Transaction { Signature Signer }
      Position {
        Asset {
          Symbol
          QuoteCurrency { Symbol }
        }
        Type
        Trader
        TraderIsAmm
        Position {
          EntryPrice
          Size
          SizeBefore
        }
        MarkPrice
        RealizedPnl
        Funding
        Closed
        Liquidation
        Liquidator
        LiquidatedQuote
        LiquidatedSize
      }
    }
  }
}
```

Notes:

- `Position.Type` is `PnL` for normal position accounting rows and `Liquidation` for
  the dedicated liquidation rows.
- `SizeBefore → Size` is the transition; `Closed: true` marks a full close.
- `RealizedPnl` (in `PhUsd`) is booked on closes and reductions; `Funding` is non-zero
  on funding settlement rows.
- **Funding settlements are their own rows**: `Funding ≠ 0`, position size unchanged
  (`SizeBefore` = `Size`), `RealizedPnl: 0` and `MarkPrice: 0`. The sign is from the
  trader's perspective — positive means the position received funding, negative means
  it paid. Filter `Position: { Funding: { ne: 0 } }` for a funding history.
- **A liquidation emits multiple rows in one transaction**: the trader's forced close
  (`Type: "PnL"`, `Closed: true`, negative `RealizedPnl`) plus a `Type: "Liquidation"`
  row carrying `LiquidatedSize` and `LiquidatedQuote`, with `Liquidator` set on each —
  and the liquidator's own position rows alongside. Count *events*, not rows, when
  measuring liquidation activity.

Profitable closed trades — every close that realized more than 100 `PhUsd`:

```graphql
query {
  Solana {
    PerpetualPositions(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: { Position: { RealizedPnl: { gt: 100 }, Closed: true } }
    ) {
      Block { Time }
      Transaction { Signature Signer }
      Position {
        Asset { Symbol }
        Trader
        Position { EntryPrice Size SizeBefore }
        MarkPrice
        RealizedPnl
        Closed
      }
    }
  }
}
```

A realized-PnL leaderboard falls out of one aggregation — total booked PnL per trader
across closed positions, AMM excluded:

```graphql
query {
  Solana {
    PerpetualPositions(
      limit: { count: 10 }
      orderBy: { descendingByField: "pnl" }
      where: { Position: { TraderIsAmm: false, Closed: true } }
    ) {
      Position { Trader }
      pnl: sum(of: Position_RealizedPnl)
      closes: count
    }
  }
}
```

Live liquidation feed:

```graphql
subscription {
  Solana {
    PerpetualPositions(where: { Position: { Liquidation: true } }) {
      Block { Time }
      Transaction { Signature }
      Position {
        Asset { Symbol }
        Type
        Trader
        Liquidator
        LiquidatedSize
        LiquidatedQuote
        RealizedPnl
        MarkPrice
      }
    }
  }
}
```

## Ideas to build

Worked, runnable versions of the recipes below — copy-trade feeds, trader report
cards, unrealized-PnL rankings, OHLC candles, OI/basis series, order-flow pressure —
live in the [Perps Trader Cookbook](/docs/perpetuals/solana/perps-trader-cookbook).

- **Liquidation alerts** — the subscription above, pushed to Telegram/Discord.
- **PnL leaderboard** — aggregate `RealizedPnl` by `Trader` over `PerpetualPositions`,
  excluding `TraderIsAmm: true`.
- **OI & premium dashboard** — periodic snapshots of `PerpetualMarketSummaries`
  (`OpenInterest`, `Mark` vs `SpotIndex`, fee-counter diffs).
- **Equity & commodity perps tracker** — filter any cube to `AAPL`, `TSLA`, `GOLD`,
  `WTIOIL` markets: stock and commodity price action, settled onchain, streaming in
  real time.
- **Execution analytics** — compare `ExecutionPrice` to `MarkPrice` on fills; split
  volume by AMM vs order-book counterparty.

<FAQ
  items={[
    { q: "What is Phoenix Perpetuals?", a: "Phoenix Perpetuals is a fully onchain perpetual futures exchange on Solana, built by Ellipsis Labs, the team behind the Phoenix spot order book. In Bitquery data it appears with Exchange Family Phoenix and Exchange Name phoenix_eternal, under the program EtrnLzgbS7nMMy5fbD42kXiUzGg8XQzJ972Xtk1cjWih." },
    { q: "Which markets can I query on Phoenix Perpetuals?", a: "Markets span crypto majors and memecoins, US equities, commodities such as gold, silver, copper and oil, and pre-IPO names. Every market is quoted in PhUsd and identified by a numeric Asset.Id together with an Asset.Symbol such as BTC, SOL, AAPL or GOLD." },
    { q: "How do I filter for a specific perpetual market?", a: "Filter on either Asset.Symbol or the numeric Asset.Id inside the cube's where clause. For example, where MarketSummary Asset Symbol is BTC, or where MarketSummary Asset Id eq 22, both select a single market." },
    { q: "Are MakerFees and TakerFees per-block values?", a: "No. They are cumulative counters denominated in PhUsd that increase monotonically since market inception. To measure fees generated over an interval, take the difference between the value at the end of the interval and the value at the start rather than reading a single row." },
    { q: "How are liquidations represented?", a: "A single liquidation emits several rows in one transaction: the trader's forced-close row with Type PnL, Closed true and a negative RealizedPnl, plus a dedicated row with Type Liquidation carrying LiquidatedSize and LiquidatedQuote, with the Liquidator address populated. Count liquidation events rather than rows when measuring activity." },
    { q: "How do I find funding payments for a position?", a: "Funding settlements are their own rows in PerpetualPositions where Funding is non-zero, the position size is unchanged, and RealizedPnl and MarkPrice are zero. A positive value means the position received funding and a negative value means it paid." },
    { q: "What does CounterpartyIsAmm mean on a fill?", a: "Phoenix runs an AMM backstop alongside the order book. When CounterpartyIsAmm is true the fill matched the AMM, MakerOrderId is empty and SplineId identifies the AMM curve segment; when it is false the fill matched a resting order and carries that maker's MakerOrderId." },
    { q: "Can I stream Phoenix Perpetuals data over WebSocket?", a: "Yes. All five cubes are available under the GraphQL subscription root, so any query on this page becomes a live stream by replacing query with subscription and removing the pagination arguments, connecting over wss://streaming.bitquery.io/graphql." },
  ]}
/>
