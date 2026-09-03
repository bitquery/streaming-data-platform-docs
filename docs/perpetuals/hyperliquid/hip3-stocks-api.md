---
title: "Hyperliquid HIP-3 Stocks API — S&P 500, US Equity & Commodity Perps"
description: "Query and stream Hyperliquid HIP-3 markets with Bitquery: S&P 500, NVDA, TSLA and other US stock perpetuals, plus gold, oil and FX. Trades, mark prices, oracle inputs, L4 order book, candles, funding and liquidations over GraphQL and WebSocket."
sidebar_position: 6
keywords:
  - Hyperliquid HIP-3 API
  - Hyperliquid stock perpetuals
  - Hyperliquid SP500 perp
  - HIP-3 markets API
  - tokenized stock perpetuals data
  - Hyperliquid NVDA perp price
  - Hyperliquid TSLA perp
  - onchain stock data API
  - Hyperliquid equity perps
  - Hyperliquid commodity perps
  - Hyperliquid gold oil perps
  - HIP-3 deployer markets
  - Hyperliquid basis trade data
  - Bitquery Hyperliquid stocks
---

# Hyperliquid HIP-3 Stocks API

HIP-3 lets anyone deploy a perpetual market on Hyperliquid. In practice that has produced a
full off-chain asset complex trading on-chain: **S&P 500, Nasdaq-100, individual US
equities, country ETFs, gold, oil, natural gas and FX** — all as perps settled in USDC on
HyperCore.

Bitquery indexes every HIP-3 market alongside the native perps, in the same `Hyperliquid`
cube. This page covers how to address those markets, and the queries that matter for
pricing, market making and basis trading against the underlying.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

## How HIP-3 markets are addressed

Every market carries a `Market` object. Three fields identify a HIP-3 market:

| Field | Native perp | HIP-3 market |
| --- | --- | --- |
| `Kind` | `perp` | `hip3` |
| `Protocol` | `hypercore` | the deployer, e.g. `xyz`, `io`, `para`, `mkts`, `hyna` |
| `CoinRaw` | `BTC` | `xyz:SP500` — `deployer:symbol` |
| `Symbol` | `BTC` | `SP500` — the bare symbol |

Two consequences worth knowing before you write a filter:

- **`Symbol` is not unique across deployers.** `SNDK` trades under both `xyz:` and `io:`,
  `AVGO` under both `xyz:` and `para:`, `UNITREE` under `xyz:` and `para:`. Filter on
  `CoinRaw` when you mean one specific market, and on `Symbol` only when you deliberately
  want every deployer's version of the same underlying.
- **Filter the whole asset class with `Kind`,** not with a `Protocol` allowlist. New
  deployers appear without notice; `Kind: {is: "hip3"}` keeps working.

## List every HIP-3 market

Ranks all HIP-3 markets by traded size over the last 24 hours, with distinct trader counts.
This is the discovery query — run it first to see what exists right now.

Run it in the IDE: [Hyperliquid HIP-3 Markets ➤](https://ide.bitquery.io/hyperliquid-hip3-markets)

```graphql
query {
  Hyperliquid {
    Trades(
      limit: {count: 300}
      orderBy: {descendingByField: "volume"}
      where: {
        Trade: {Market: {Kind: {is: "hip3"}}}
        Block: {Time: {since_relative: {hours_ago: 24}}}
      }
    ) {
      Trade {
        Market { Symbol CoinRaw Protocol }
      }
      volume: sum(of: Trade_Execution_Size)
      trades: count
      traders: count(distinct: Trade_Trader_Address)
    }
  }
}
```

Swap `Kind` for `Protocol: {is: "xyz"}` to scope to a single deployer.

## Trades on a stock market

Every fill on `xyz:SP500`, both sides of each match. `IsAggressor` marks the taker, and a
**negative `Fee` is a maker rebate**.

Run it in the IDE: [Hyperliquid SP500 Perp Trades ➤](https://ide.bitquery.io/hyperliquid-sp500-trades)

```graphql
query {
  Hyperliquid {
    Trades(
      limit: {count: 50}
      orderBy: {descending: Block_Time}
      where: {Trade: {Market: {CoinRaw: {is: "xyz:SP500"}}}}
    ) {
      Block { Time }
      Trade {
        Market { Symbol CoinRaw Kind Protocol }
        Execution { Price Size Side Direction IsAggressor Oid Tid }
        Fees { Fee FeeToken BuilderFee }
        Position { Leverage IsCross SizeBefore RealizedPnl }
        Trader { Address }
      }
    }
  }
}
```

Change `CoinRaw` to any market from the discovery query — `xyz:NVDA`, `xyz:TSLA`,
`xyz:GOLD`, `mkts:USTECH`, `io:GPRO`.

## Mark prices across all HIP-3 markets

`MarkPrices` is a **latest-state cube**: one row per market holding its current mark, not a
time series. Use it for a pricing snapshot; use `Candles` or `Trades` for history.

Run it in the IDE: [Hyperliquid HIP-3 Mark Prices ➤](https://ide.bitquery.io/hyperliquid-hip3-mark-prices)

```graphql
query {
  Hyperliquid {
    MarkPrices(
      limit: {count: 200}
      orderBy: {descending: LastTime}
      where: {Market: {Kind: {is: "hip3"}}}
    ) {
      LastTime
      LastBlock
      Mark
      Market { Symbol CoinRaw Protocol }
    }
  }
}
```

Note the field names differ from the other cubes: `LastTime` / `LastBlock` rather than
`Block { Time }`, and the price is `Mark`.

## Basis: on-chain mark vs off-chain reference

This is the query behind the HIP-3 arbitrage trade. `PriceUpdates` carries the oracle feed
the market is priced against, and `Kind` separates the components:

| `Kind` | Meaning |
| --- | --- |
| `spotInput` | the off-chain reference price for the underlying |
| `markInput` | the input to the on-chain mark |
| `oracle` | the published oracle price |
| `extPerpInput` | external perp reference, where used |

Because `spotInput` is indexed alongside the mark, **the basis is computable from Bitquery
alone** — you do not need to bring your own equities feed just to measure the spread.

Run it in the IDE: [Hyperliquid HIP-3 Basis Spread ➤](https://ide.bitquery.io/hyperliquid-hip3-basis-spread)

```graphql
query {
  Hyperliquid {
    PriceUpdates(
      limit: {count: 100}
      orderBy: {descending: Block_Time}
      where: {PriceUpdate: {Market: {CoinRaw: {is: "xyz:NVDA"}}}}
    ) {
      Block { Time }
      PriceUpdate {
        Market { Symbol CoinRaw }
        Kind
        Price
        DailyPx
        UpdateClass
        UpdateTime
      }
    }
  }
}
```

Pair the `spotInput` series with `Trades` on the same market to see where fills landed
relative to the reference, which is what decides whether a basis trade was actually
capturable rather than just visible.

## OHLCV candles for a stock perp

`Candles` are pre-aggregated. `Interval.Time.Duration` is in **seconds** — `60` for 1m,
`300` for 5m, `3600` for 1h.

Run it in the IDE: [Hyperliquid Stock Perp Candles ➤](https://ide.bitquery.io/hyperliquid-stock-perp-candles)

```graphql
query {
  Hyperliquid {
    Candles(
      limit: {count: 60}
      orderBy: {descending: Interval_Time_Start}
      where: {
        Market: {CoinRaw: {is: "xyz:NVDA"}}
        Interval: {Time: {Duration: {eq: 60}}}
      }
    ) {
      Interval { Time { Start Duration } }
      Market { Symbol CoinRaw }
      Ohlc { Open High Low Close Volume }
    }
  }
}
```

If you need an interval the `Candles` cube does not carry, aggregate `Trades` directly:

Run it in the IDE: [Hyperliquid HIP-3 OHLC From Trades ➤](https://ide.bitquery.io/hyperliquid-hip3-ohlc-from-trades)

```graphql
query {
  Hyperliquid {
    Trades(
      limit: {count: 100}
      orderBy: {descendingByField: "minute_Time"}
      where: {
        Trade: {Market: {CoinRaw: {is: "xyz:SP500"}}}
        Block: {Time: {since_relative: {hours_ago: 6}}}
      }
    ) {
      minute: Block { Time(interval: {in: minutes, count: 5}) }
      open: Trade { Execution { Price(minimum: Block_Time) } }
      high: Trade { Execution { Price(maximum: Trade_Execution_Price) } }
      low: Trade { Execution { Price(minimum: Trade_Execution_Price) } }
      close: Trade { Execution { Price(maximum: Block_Time) } }
      volume: sum(of: Trade_Execution_Size)
      trades: count
    }
  }
}
```

## L4 order book for a stock perp

`BookUpdates` are **per-order** deltas, not aggregated price levels. Each row names the
order id and the wallet behind it, so you can reconstruct the book at any instant and
measure queue position, order lifetime and maker behaviour.

Run it in the IDE: [Hyperliquid Stock Book Updates ➤](https://ide.bitquery.io/hyperliquid-stock-book-updates)

```graphql
subscription {
  Hyperliquid {
    BookUpdates(
      where: {BookUpdate: {Market: {CoinRaw: {is: "xyz:NVDA"}}}}
    ) {
      Block { Time }
      BookUpdate {
        Market { Symbol CoinRaw }
        Kind
        Side
        Px
        Size
        SizeBefore
        Oid
        Trader { Address }
      }
    }
  }
}
```

`Kind` is `new`, `update` or `remove`. **`Size` is empty on a `remove`** — the order is
gone, so there is no resting size to report; use `Px`, `Side` and `Oid` to find the level
it left. Change `subscription` to `query` and add `limit` / `orderBy` for history.

## Funding on HIP-3 markets

Funding is per trader, per market, and settles hourly. `Rate` is the funding rate applied
and `Amount` the USDC paid or received.

Run it in the IDE: [Hyperliquid HIP-3 Funding ➤](https://ide.bitquery.io/hyperliquid-hip3-funding)

```graphql
query {
  Hyperliquid {
    PerpFundings(
      limit: {count: 50}
      orderBy: {descending: Block_Time}
      where: {Funding: {Market: {Kind: {is: "hip3"}}}}
    ) {
      Block { Time }
      Funding {
        Market { Symbol CoinRaw Protocol }
        Trader { Address }
        Rate
        Amount
        Size
      }
    }
  }
}
```

Equity perps have no natural funding anchor overnight or at weekends, when the underlying
market is closed. Funding is where that dislocation shows up, so this series is worth
watching if you carry HIP-3 positions across a session boundary.

## Liquidations on HIP-3 markets

Run it in the IDE: [Hyperliquid HIP-3 Liquidations ➤](https://ide.bitquery.io/hyperliquid-hip3-liquidations)

```graphql
query {
  Hyperliquid {
    PerpLiquidations(
      limit: {count: 50}
      orderBy: {descending: Block_Time}
      where: {Liquidation: {Market: {Kind: {is: "hip3"}}}}
    ) {
      Block { Time }
      Liquidation {
        Market { Symbol CoinRaw Protocol }
        LiquidatedUser
        Liquidator
        MarkPx
        Method
        Execution { Price Size Side }
        Position { Leverage SizeBefore RealizedPnl }
      }
    }
  }
}
```

`Method` distinguishes a `market` liquidation from a `backstop` one.

## Top traders on a stock market

Ranks wallets by traded size on one market, with realized PnL. Useful for copy-trading,
market-maker identification and flow analysis.

Run it in the IDE: [Hyperliquid HIP-3 Top Traders ➤](https://ide.bitquery.io/hyperliquid-hip3-top-traders)

```graphql
query {
  Hyperliquid {
    Trades(
      limit: {count: 50}
      orderBy: {descendingByField: "volume"}
      where: {
        Trade: {Market: {CoinRaw: {is: "xyz:SP500"}}}
        Block: {Time: {since_relative: {hours_ago: 24}}}
      }
    ) {
      Trade { Trader { Address } }
      volume: sum(of: Trade_Execution_Size)
      trades: count
      pnl: sum(of: Trade_Position_RealizedPnl)
    }
  }
}
```

## Field notes

- **Prices and sizes are decimal strings**, not floats, in every cube except `Candles`
  (whose `Ohlc` fields are floats). Parse with `Decimal` where precision matters.
- **A match produces two `Trades` rows**, one per counterparty. Key a trade on
  `(Block.Number, Market.CoinRaw, Execution.Tid)` — not on `Hash`, which spans many matches
  and is all zeroes on both sides of a TWAP fill.
- **`Position.SizeBefore` is a signed position size** before the fill, negative for short.
  It is not money; realized PnL is `Position.RealizedPnl`.
- **`Direction`** takes values like `Open Long`, `Close Short` and `Short > Long` — a flip
  through flat is one fill, not two.
- **Retention.** These cubes are served from realtime with roughly a 30-day window (shorter
  for signed actions). For longer ranges, see
  [Data Coverage & Retention](/docs/graphql/data-coverage-retention/) or contact
  [sales@bitquery.io](mailto:sales@bitquery.io) for a historical export.

## Related

- [Hyperliquid API overview](/docs/perpetuals/hyperliquid)
- [Trades & Candles](/docs/perpetuals/hyperliquid/hyperliquid-trades-api)
- [Orders, Order Book & TWAPs](/docs/perpetuals/hyperliquid/hyperliquid-orders-api)
- [Mark Prices & Price Updates](/docs/perpetuals/hyperliquid/hyperliquid-prices-api)
- [Liquidations, Funding, Positions & Leverage](/docs/perpetuals/hyperliquid/hyperliquid-perpetuals-api)
