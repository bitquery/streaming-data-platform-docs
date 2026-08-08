---
title: "Perp DEX API — Onchain Perpetual Futures Data & Streams"
sidebar_label: "Overview"
sidebar_position: 1
description: "Perp DEX API for onchain perpetual futures: orders, trades, positions, PnL, liquidations, funding, mark price and open interest on Solana, via GraphQL and WebSocket."
keywords:
  - perp dex api
  - perp dex data
  - perpetual futures api
  - onchain perpetuals data
  - perpetual trading data
  - solana perps api
  - solana perpetual futures data
  - perps order book api
  - crypto liquidations api
  - open interest api
  - funding rate api
  - mark price websocket
  - crypto derivatives api
  - perpetual positions api
  - realized pnl api
  - phoenix perpetuals api
---

import FAQ from "@site/src/components/FAQ";

# Perp DEX API — Onchain Perpetual Futures Data & Streams

Bitquery indexes **onchain perpetual futures DEXs** at event level and exposes the data
as five GraphQL cubes. Every order placement and cancellation, every fill, every position
change, every liquidation, every order-book price tick and every open-interest update is
queryable over HTTP **and** streamable over WebSocket — the same query text works as a
`query` (history) and as a `subscription` (live stream).

|               |                                                                                       |
| ------------- | ------------------------------------------------------------------------------------- |
| **Cubes**     | `PerpetualOrders`, `PerpetualFills`, `PerpetualPositions`, `PerpetualPrices`, `PerpetualMarketSummaries` |
| **Endpoints** | `https://streaming.bitquery.io/graphql` and `https://streaming.bitquery.io/eap`        |
| **Streaming** | `wss://streaming.bitquery.io/graphql` — see [WebSocket docs](/docs/subscriptions/websockets) |
| **Kafka**     | `solana.perpetual.proto` protobuf topic — see the [Solana Perpetuals Kafka Stream](/docs/streams/protobuf/chains/Solana-perpetual-protobuf) |
| **Auth**      | [OAuth token](/docs/authorization/how-to-generate) as `Authorization: Bearer <token>`  |

## The five cubes

| Cube                       | One row per…                          | What it answers                                                                 |
| -------------------------- | ------------------------------------- | ------------------------------------------------------------------------------- |
| `PerpetualOrders`          | order lifecycle event                 | Who placed, cancelled, or got rejected; limit/market/post-only/stop orders; cancel and reject reasons |
| `PerpetualFills`           | trade execution                       | Executions with price, size, fee, taker side, maker counterparty, and the position that resulted |
| `PerpetualPositions`       | position state change                 | Entry price, size before/after, realized PnL, funding settlements, liquidations |
| `PerpetualPrices`          | order-book price tick                 | Best bid, best ask, mark price, last trade — tick by tick                       |
| `PerpetualMarketSummaries` | market state update                   | Open interest, spot index vs mark price, cumulative maker/taker fees            |

Together they cover the full trading loop: an order enters the book (`PerpetualOrders`),
matches (`PerpetualFills`), moves a position (`PerpetualPositions`), and the market's
price and open interest move with it (`PerpetualPrices`, `PerpetualMarketSummaries`).

## Why this data is different

- **Cross-asset markets.** Onchain perp DEXs now list far more than crypto pairs: the
  currently indexed venue trades crypto majors and memecoins alongside **US equities,
  commodities like gold, silver and oil, and pre-IPO names** — all as perpetual futures,
  all settled onchain, all in one API.
- **Order-book depth of detail.** This is not OHLC candles. You see individual
  post-only quotes, stop-loss placements, cancel reasons, and which fills were matched
  by the AMM backstop versus another trader's resting order.
- **Liquidations as first-class events.** Liquidation fills and liquidated positions
  carry the liquidator address, liquidated size and quote value — enough to build a
  live liquidation feed or long-term liquidation analytics.
- **PnL without reconstruction.** Position rows carry `RealizedPnl`, entry price and
  size transitions, so trader leaderboards don't require you to replay fills yourself.

## Supported DEXs

Coverage is organized by chain, then by protocol:

| Chain  | Protocol                                                       | Docs                                                        |
| ------ | -------------------------------------------------------------- | ----------------------------------------------------------- |
| Solana | **Phoenix Perpetuals** (`phoenix_eternal`, by Ellipsis Labs)   | [Phoenix Perpetuals API](/docs/perpetuals/solana/phoenix-perpetuals-api) |

More venues will appear here as they are enabled. To check what is indexed at any moment,
group any cube by `Exchange`:

```graphql
query {
  Solana {
    PerpetualFills(limit: { count: 20 }, orderBy: { descendingByField: "count" }) {
      count
      Fill {
        Exchange {
          Family
          Name
          Program
          Version
        }
      }
    }
  }
}
```

## Query or stream — your choice

Every cube is available in both forms. A historical query:

```graphql
query {
  Solana {
    PerpetualFills(limit: { count: 10 }, orderBy: { descending: Block_Time }) {
      Block { Time }
      Fill {
        Asset { Symbol }
        Side
        ExecutionPrice
        Amount { Filled Quote }
      }
    }
  }
}
```

…becomes a live stream by changing one word and dropping the pagination arguments:

```graphql
subscription {
  Solana {
    PerpetualFills {
      Block { Time }
      Fill {
        Asset { Symbol }
        Side
        ExecutionPrice
        Amount { Filled Quote }
      }
    }
  }
}
```

## What people build with it

- **Liquidation alert bots** — stream `PerpetualPositions` filtered to `Liquidation: true`
- **Trader analytics and leaderboards** — aggregate `RealizedPnl` per `Trader`
- **Open-interest and fee dashboards** — snapshot `PerpetualMarketSummaries` per market
- **Live tickers and charting** — stream `PerpetualPrices` best bid/ask and mark
- **Market-maker monitoring** — follow order lifecycle and AMM-vs-book fill share

Start with the [Phoenix Perpetuals API](/docs/perpetuals/solana/phoenix-perpetuals-api)
page — it documents every cube with working queries and streams. Then jump to the
[Perps Trader Cookbook](/docs/perpetuals/solana/perps-trader-cookbook) for
workflow-shaped recipes: copy-trading a wallet, trader win-rate report cards, top
unrealized positions, whale fills, OHLC candles, open-interest and order-flow series.

<FAQ
  items={[
    { q: "What is the Bitquery Perp DEX API?", a: "It is a set of five GraphQL cubes — PerpetualOrders, PerpetualFills, PerpetualPositions, PerpetualPrices and PerpetualMarketSummaries — that expose event-level data from onchain perpetual futures DEXs. Each cube is available as an HTTP query for history and as a WebSocket subscription for live streaming." },
    { q: "Which perpetual DEXs are supported?", a: "Phoenix Perpetuals on Solana, the onchain perpetual futures exchange built by Ellipsis Labs, is currently indexed. Coverage expands over time; you can list the indexed venues at any moment by grouping any perpetual cube by the Exchange field." },
    { q: "Can I stream perpetual futures data in real time?", a: "Yes, two ways. All five perpetual cubes exist under the GraphQL subscription root — change the word query to subscription and connect over wss://streaming.bitquery.io/graphql. For the lowest-latency firehose, the same data is published as protobuf messages on the solana.perpetual.proto Kafka topic." },
    { q: "Can I get liquidation data for perpetuals?", a: "Yes. PerpetualPositions rows carry Liquidation, Liquidator, LiquidatedSize and LiquidatedQuote, and PerpetualFills marks forced fills with the same Liquidation flag. Filtering either cube on Liquidation true gives a historical liquidation record or a live liquidation feed." },
    { q: "Does the API provide open interest and funding data?", a: "Yes. PerpetualMarketSummaries carries OpenInterest along with mark price and the spot index per market. Funding settlements appear in PerpetualPositions as rows where the Funding field is non-zero and the position size is unchanged." },
    { q: "Are stock and commodity perpetuals included?", a: "Yes, where the venue lists them. The currently indexed venue trades perpetuals on US equities and commodities such as gold, silver and oil alongside crypto markets, and they are queried through exactly the same cubes and fields as crypto markets." },
    { q: "How do I calculate trader PnL?", a: "PerpetualPositions rows carry RealizedPnl directly, alongside entry price and the size transition, so PnL does not need to be reconstructed from fills. Summing RealizedPnl per Trader over closed positions produces a leaderboard in a single aggregation query." },
  ]}
/>
