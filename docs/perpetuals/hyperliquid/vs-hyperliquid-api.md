---
title: "Bitquery vs Hyperliquid's Free API and S3 Archive"
description: "An honest comparison of Hyperliquid's native Info API, its free s3://hyperliquid-archive bucket, and Bitquery: order book granularity (L2 vs L3), what the archive actually contains, rate limits, history depth and cross-chain coverage."
sidebar_position: 8
keywords:
  - Hyperliquid api rate limit
  - Hyperliquid historical data
  - Hyperliquid candle history
  - Hyperliquid backtest data
  - hyperliquid-archive S3
  - Hyperliquid info API
  - Hyperliquid data provider
  - Hyperliquid L2 vs L3
  - Hyperliquid market data comparison
---

# Bitquery vs Hyperliquid's free data

Hyperliquid publishes its own API and its own historical archive, both free. Any honest evaluation should start there, so this page does.

## When you should just use Hyperliquid directly

Use the [native Info API](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api) if:

- You are **trading your own account** and need your own orders, fills and positions. It is the canonical source, closest to the matching engine, with the lowest possible latency.
- You need the **current** aggregated book for one or two coins, and 5–20 levels is enough.
- You are building something small, single-venue, and free matters more than completeness.

It is a good API. For those jobs nothing else will be better, and you should not pay for a substitute.

Bitquery is for the jobs it is not built for: **seeing the whole market, at order granularity, over time, alongside other chains.**

## What Hyperliquid's free archive actually contains

This is the part most evaluations get wrong. The public `s3://hyperliquid-archive` bucket is narrower than people assume:

| | Included | Not included |
| --- | --- | --- |
| `market_data/` | **L2 book snapshots** | — |
| `asset_ctxs/` | Asset contexts | — |
| Everything else | — | **Trades, candles and spot data are explicitly not provided via S3** |

Hyperliquid's own documentation also states that data is uploaded roughly **once a month**, with **no guarantee of timely updates**, and that **data may be missing**.

So if you are backtesting on fills, building candles from trades, or studying spot markets, the free archive does not cover it — and that is by design, not an oversight.

## The core difference: L2 vs L3

Hyperliquid's public market-wide book data — both the `l2Book` websocket channel and the S3 snapshots — is **L2**: size aggregated per price level. Order-level detail (`orderUpdates`, `userFills`) exists in the native API, but only for **your own account**.

Bitquery serves the book market-wide at **L3 (market-by-order)**.

| | Hyperliquid native (market-wide) | Bitquery |
| --- | --- | --- |
| Book grain | L2 — total size per price level | **L3 — one event per individual order** |
| Order identity | — | `Oid`, joins `Orders` ↔ `BookUpdates` ↔ `Trades` |
| Who placed the order | — | `Trader { Address }` |
| Depth | 5–20 levels | Unlimited |
| Order-level data for other traders | Not served | Every order, every trader |

Because Hyperliquid settles on a transparent L1, the wallet behind each order is public. That makes this **L3 with named attribution** — something that does not exist on centralised venues, where exchanges anonymise L3 feeds. It is what makes market-maker tracking, cancel-to-fill analysis and wallet-level order flow possible at all. See [Track Order Flow by Wallet](/docs/perpetuals/hyperliquid/hyperliquid-order-flow-by-wallet).

:::note This data is on-chain
Hyperliquid is a transparent L1, so this information is *derivable* by anyone who indexes the chain — Bitquery's contribution is the indexing, normalisation and delivery, not exclusive access. The claim here is specifically that **Hyperliquid's own API does not serve it market-wide**, which is verifiable in their docs.
:::

## Full comparison

| Capability | HL Info API | HL S3 archive | Bitquery |
| --- | --- | --- | --- |
| Cost | Free | Free | Paid |
| Book granularity | L2 aggregated (L3 for own account only) | L2 snapshots | **L3 market-by-order, market-wide** |
| Trades / fills market-wide | Bare price/size/side | **Not provided** | Full: direction, fees, leverage, size-before, realized PnL |
| Candles | Via REST, pagination-limited | **Not provided** | `Candles` cube, any interval |
| Spot markets | Yes | **Not provided** | Yes |
| Liquidations market-wide | Per-address only | Not provided | Exchange-wide, with method, mark price, leverage |
| Funding per trader | Per-address only | Not provided | `PerpFundings`, market-wide |
| Open positions | Per-address snapshot | Not provided | `CurrentPositions`, whole market, sortable |
| Raw L1 actions | Not exposed | Not provided | `SignedActions` |
| Update cadence | Real time | ~Monthly, no guarantee | Real time |
| Completeness guarantee | — | **Stated: data may be missing** | SLA available |
| History depth | Snapshot + limited REST | Since inception (L2 only) | Rolling ~30 days via API; **full archive via [Data Lake](/docs/data-lake/)** |
| Delivery | WebSocket / REST | S3 files | GraphQL, WebSocket, Kafka (protobuf) |
| Rate limits | Yes, per-connection and per-endpoint | S3 egress | Plan-based, no per-coin fan-out |
| Other chains | Hyperliquid only | Hyperliquid only | **Solana, EVM, Base, BNB, Tron, Bitcoin — same schema, same key** |

## Same question, both ways

**"Give me 1-hour OHLCV for BTC-PERP."**

Natively, candles are not in the archive, so you either page through the REST `candleSnapshot` endpoint within its limits, or collect trades live and aggregate them yourself, then persist them.

With Bitquery it is one query:

```graphql
query {
  Hyperliquid {
    Candles(
      limit: {count: 100}
      orderBy: {descending: Interval_Time_Start}
      where: {
        Market: {Symbol: {is: "BTC"}}
        Interval: {Time: {Duration: {eq: 3600}}}
      }
    ) {
      Interval { Time { Start Duration } }
      Market { Symbol Kind }
      Ohlc { Open High Low Close Volume }
    }
  }
}
```

The same query becomes a live stream by changing `query` to `subscription`.

## Where Bitquery is genuinely weaker

Worth saying plainly:

- **Latency to the matching engine.** For your own order placement and fills, the native API is closer to the source. Bitquery indexes blocks; there is a step in between.
- **Cost.** Free is free. If your use case fits inside the native API, use it.
- **API history depth.** The GraphQL cubes serve a rolling ~30-day window. Deeper history is a [Data Lake](/docs/data-lake/) or enterprise export, not a plan upgrade.

## Where Bitquery is decisive

- **L3 with wallet attribution, market-wide** — not available from the native API at all.
- **Trades, candles and spot history** — explicitly absent from the free archive.
- **One stream for the entire market** rather than per-coin, per-user subscriptions you merge client-side.
- **Cross-chain.** A Hyperliquid-only provider can tell you a wallet was liquidated. Only a multi-chain provider can tell you where the money went afterwards.

## Next steps

- [Hyperliquid API overview](/docs/perpetuals/hyperliquid) — every cube
- [L3 Order Book API](/docs/perpetuals/hyperliquid/hyperliquid-orders-api)
- [Track Order Flow by Wallet](/docs/perpetuals/hyperliquid/hyperliquid-order-flow-by-wallet)
- [Blockchain Data Lake](/docs/data-lake/) — full archive access
- [Data Coverage & Retention](/docs/graphql/data-coverage-retention) — exact windows per cube
