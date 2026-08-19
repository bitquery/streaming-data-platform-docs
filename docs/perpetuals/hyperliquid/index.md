---
title: "Hyperliquid API — Real-time Trades, Orders, Liquidations & Prices"
description: "Query and stream Hyperliquid data with Bitquery: trades, orders, order book updates, OHLCV candles, liquidations, funding, positions, TWAPs, mark prices and signed actions over GraphQL and WebSocket."
sidebar_position: 1
slug: /perpetuals/hyperliquid
keywords:
  - Hyperliquid API
  - Hyperliquid GraphQL API
  - Hyperliquid WebSocket
  - Hyperliquid streams
  - Hyperliquid trades API
  - Hyperliquid orders API
  - Hyperliquid liquidations API
  - Hyperliquid funding API
  - Hyperliquid order book API
  - Hyperliquid candles API
  - Hyperliquid perp data
  - Hyperliquid HIP-3
  - Hyperliquid Kafka
  - Bitquery Hyperliquid
---

# Hyperliquid API

Bitquery indexes **Hyperliquid core** (the L1 order-book exchange) and exposes it through the `Hyperliquid` cube on the [streaming API](https://streaming.bitquery.io/graphql). Every dataset is available both as a **GraphQL query** (historical + latest) and as a **WebSocket subscription** (real-time stream) — change `query` to `subscription` and drop `limit`/`orderBy`.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

## Available datasets

```graphql
query {
  Hyperliquid {
    BookUpdates            # order book deltas (new / change / remove)
    Candles                # OHLCV candles per market and interval
    CurrentPositions       # current open perp positions per trader
    MarkPrices             # latest mark price per market
    Orders                 # order lifecycle: placed, filled, canceled, rejected
    PerpFundings           # per-trader funding payments
    PerpLiquidations       # perp liquidations
    PriceUpdates           # oracle / reference price updates
    SignedActions          # raw signed L1 actions (order, cancel, modify, ...)
    TraderLeverageUpdates  # leverage / margin-mode changes
    Trades                 # fills with direction, fees, leverage, PnL
    Twaps                  # TWAP order lifecycle
  }
}
```

| Page | Cubes covered |
| --- | --- |
| [Trades & Candles](/docs/perpetuals/hyperliquid/hyperliquid-trades-api) | `Trades`, `Candles` |
| [Orders, Order Book & TWAPs](/docs/perpetuals/hyperliquid/hyperliquid-orders-api) | `Orders`, `BookUpdates`, `Twaps` |
| [Mark Prices & Price Updates](/docs/perpetuals/hyperliquid/hyperliquid-prices-api) | `MarkPrices`, `PriceUpdates` |
| [Liquidations, Funding, Positions & Leverage](/docs/perpetuals/hyperliquid/hyperliquid-perpetuals-api) | `PerpLiquidations`, `PerpFundings`, `CurrentPositions`, `TraderLeverageUpdates` |
| [Signed Actions](/docs/perpetuals/hyperliquid/hyperliquid-signed-actions-api) | `SignedActions` |

## Why Bitquery instead of the native Hyperliquid WebSocket API?

The [native Hyperliquid API](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/websocket/subscriptions) is built for trading your own account. Bitquery is built for seeing the whole market:

| Capability | Hyperliquid native WS | Bitquery |
| --- | --- | --- |
| Scope of user data (orders, fills, funding, TWAPs, positions) | Any single address you already know, one subscription each — no market-wide stream, no trader discovery | Every trader on the exchange in one stream, or filter to any list of addresses |
| Order book | `l2Book`, aggregated, 5–20 levels max | L4 per-order deltas, unlimited depth, order id + trader address per level |
| Liquidations | Per-address only, via `userEvents` — no exchange-wide feed | All liquidations exchange-wide, with liquidated user, method, mark price, leverage |
| Open positions | Per-address snapshot (`clearinghouseState`) — cannot enumerate or rank the market | Whole market queryable (`CurrentPositions`): every open position, sortable and filterable |
| Historical data | Live + snapshot only; separate REST with pagination limits | Same GraphQL query for history and live stream |
| Filtering | Per-coin or per-user only | Any field: market, trader, side, size, leverage, status |
| Fill context | Rich (PnL, direction) only on per-user feeds; the public `trades` feed is bare price/size/side | Direction, fees, leverage, size-before, realized PnL on every fill, market-wide |
| Raw L1 actions | Not exposed | `SignedActions`: action type, signer vs user (agent wallets), bundle, broadcaster |
| Delivery | WebSocket only; reconnect/gap handling yours; some feeds base64+DEFLATE encoded | GraphQL WS + Kafka (protobuf, offsets, consumer groups, no gaps) |
| Subscription model | One subscription per coin / per user, per-connection limits | One stream can carry everything unfiltered, or a list of values on any filter field (many markets or wallets in one stream); runs 1,000+ concurrent streams at scale |
| Latency at market scale | Fast for a single coin/user feed, but covering the whole market means hundreds of subscriptions, client-side merging and rate limits | Lowest latency for the entire market in one pipeline — Kafka delivers every event exchange-wide, keyed by block, with no fan-out to assemble |

## Markets: perp, spot and HIP-3

Every cube carries a `Market` object that identifies the instrument:

| Field | Meaning | Example values |
| --- | --- | --- |
| `Symbol` | Human-readable market symbol | `BTC`, `HYPE`, `AAPL` |
| `CoinRaw` | Raw Hyperliquid coin id; HIP-3 markets are prefixed with their deployer namespace | `BTC`, `xyz:SMSN`, `mkts:AAPL` |
| `Kind` | Market class | `perp`, `spot`, `hip3` |
| `IsPerp` | `true` for perpetual markets (including HIP-3 perps) | `true` / `false` |
| `Protocol` | HIP-3 deployer namespace, empty for native markets | `xyz`, `mkts` |
| `MaxLeverage` | Maximum leverage allowed on the market | `40` |

**HIP-3** markets are builder-deployed perps — tokenized stocks (`mkts:AAPL`), indices (`xyz:KR200`, `TOTAL2`) and other synthetic assets trade alongside native Hyperliquid perps and appear in the same cubes with `Kind: hip3`.

`ChainId` is `hyperliquid-core` on all event cubes.

## Common fields

- `Block { Number Time }` — Hyperliquid L1 block height and timestamp; filter with `Block: {Time: {since_relative: {minutes_ago: 5}}}` or absolute `since`/`till`.
- `Trader { Address Vault Signer Broadcaster SignedAt }` — the account behind an event. `Vault` is set when the action is performed on behalf of a vault; `Signer` is the signing key (may be an agent/API wallet distinct from `Address`).
- Numeric amounts (price, size, PnL, fees) are returned as **strings** at native precision; candle OHLCV values are floats.

## WebSocket streams

Any query becomes a live stream over `wss://streaming.bitquery.io/graphql` (transport `graphql-transport-ws`):

```graphql
subscription {
  Hyperliquid {
    Trades {
      Block { Time }
      Trade {
        Market { Symbol }
        Execution { Price Size Side Direction }
      }
    }
  }
}
```

See [WebSocket subscriptions](/docs/subscriptions/websockets/) for connection details.

## Kafka streams (protobuf)

For the lowest latency, the same data is available as Kafka streams:

| Topic | Protobuf schema |
| --- | --- |
| `hyperliquid.candles.proto` | [hyperliquid/candles.proto](https://github.com/bitquery/streaming_protobuf/blob/main/hyperliquid/candles.proto) |
| `hyperliquidcore.messages.proto` | [hyperliquid/hypercore.proto](https://github.com/bitquery/streaming_protobuf/blob/main/hyperliquid/hypercore.proto) |

See [Kafka Streaming Concepts](/docs/streams/kafka-streaming-concepts) for access and consumer setup.
