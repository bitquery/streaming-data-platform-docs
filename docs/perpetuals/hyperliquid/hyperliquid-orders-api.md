---
title: "Hyperliquid L3 Order Book API — Market-by-Order Data with Trader Attribution"
description: "Stream Hyperliquid's order book at L3 (market-by-order) granularity: every order delta carries its own order id and the wallet address behind it. Covers order lifecycle, book deltas and TWAPs over GraphQL and WebSocket."
sidebar_position: 3
keywords:
  - Hyperliquid L3 order book
  - Hyperliquid market by order data
  - Hyperliquid order book API
  - Hyperliquid order flow by wallet
  - Hyperliquid MBO data
  - Hyperliquid book updates
  - Hyperliquid orders API
  - Hyperliquid order status
  - Hyperliquid limit orders
  - Hyperliquid trigger orders
  - Hyperliquid TWAP API
  - Hyperliquid order stream
  - Bitquery Hyperliquid orders
---

# Hyperliquid L3 Order Book API

This page covers the `Orders`, `BookUpdates` and `Twaps` cubes: the full order lifecycle, order-book deltas you can rebuild the book from, and TWAP order execution.

## L2 vs L3: what you get here

Most order-book feeds — including Hyperliquid's own public `l2Book` websocket channel and the L2 snapshots in its `s3://hyperliquid-archive` bucket — are **L2**: resting size aggregated per price level. You see that 40 BTC sits at $95,000. You cannot see whether that is one order or twenty, whose it is, or which one was pulled a moment later.

`BookUpdates` is **L3 (market-by-order)**. Every delta is a single order, and it carries:

| | L2 (aggregated) | L3 (market-by-order) — Bitquery |
| --- | --- | --- |
| Grain | Total size per price level | One event per individual order |
| Order identity | — | `Oid`, joinable to `Orders` and `Trades` |
| Who placed it | — | `Trader { Address }` — the wallet itself |
| Size change | Net level change only | `Size` and `SizeBefore` on that specific order |
| Depth | Hyperliquid's `l2Book` returns 5–20 levels | Unlimited |

Because Hyperliquid settles on a transparent L1, the wallet behind each order is public. That makes this L3 **with named attribution** — something that does not exist on centralised venues, where L3 feeds are anonymised by the exchange. Hyperliquid's own API only exposes order-level detail for *your own* account (`orderUpdates`, `userFills`); market-wide, it serves aggregated L2.

This is what makes wallet-level analysis possible: watching a market maker quote and pull, reconstructing a trader's full order flow rather than just their fills, or spotting orders that were never intended to trade. See [Track Hyperliquid Order Flow by Wallet](/docs/perpetuals/hyperliquid/hyperliquid-order-flow-by-wallet) for worked examples.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::
## Order updates

Every order event carries `Status` (`open`, `filled`, `canceled`, `rejected`, ...), `OrderType` (`Limit`, trigger types like Stop Market / Take Profit), time-in-force `Tif` (`Gtc`, `Ioc`, `Alo`), the limit price, the current and original size, and trigger settings for conditional orders.

Run it in the IDE: [Hyperliquid Recent Orders ➤](https://ide.bitquery.io/hyperliquid-recent-orders)

```graphql
query {
  Hyperliquid {
    Orders(
      limit: {count: 50}
      where: {Block: {Time: {since_relative: {minutes_ago: 1}}}}
    ) {
      Block { Time }
      Order {
        Market { Symbol Kind }
        Oid Status OrderType Tif Side LimitPx Size OrigSz
        IsTrigger TriggerPx TriggerCondition ReduceOnly Cloid
        Trader { Address }
      }
    }
  }
}
```

- `Oid` links order events to fills (`Trade.Execution.Oid`) and book updates (`BookUpdate.Oid`); `Cloid` is the client-assigned order id.
- `Size` is the remaining size, `OrigSz` the original size.
- `IsTrigger`, `TriggerPx`, `TriggerCondition` describe stop / take-profit orders; `IsPositionTpsl` marks position-attached TP/SL.

### Real-time order stream

Run it in the IDE: [Hyperliquid Orders Stream ➤](https://ide.bitquery.io/hyperliquid-orders-stream)

```graphql
subscription {
  Hyperliquid {
    Orders(where: {Order: {Market: {Symbol: {is: "ETH"}}}}) {
      Block { Time }
      Order {
        Market { Symbol }
        Oid Status OrderType Tif Side LimitPx Size OrigSz IsTrigger ReduceOnly
        Trader { Address }
      }
    }
  }
}
```

## Order book updates

`BookUpdates` streams **deltas of the on-chain order book**. `Kind` is `new` (level added), `change` (size changed) or `remove` (order left the book); with `Px`, `Size`, `SizeBefore`, the order `Oid` and the trader behind the order. Consume the stream and apply the deltas to maintain a live book.

Run it in the IDE: [Hyperliquid Order Book Stream ➤](https://ide.bitquery.io/hyperliquid-orderbook-stream)

```graphql
subscription {
  Hyperliquid {
    BookUpdates(where: {BookUpdate: {Market: {Symbol: {is: "BTC"}}}}) {
      Block { Time }
      BookUpdate {
        Kind Side Px Size SizeBefore Oid
        Market { Symbol }
        Trader { Address }
      }
    }
  }
}
```

This is the L3 grain described above: unlike an aggregated L2 feed, each delta is attributable to an **individual order and trader address** — you can watch a specific market maker's quoting in real time by filtering on `BookUpdate: {Trader: {Address: {is: "0x..."}}}`.

## TWAP orders

`Twaps` tracks the lifecycle of TWAP orders: `State.Status` moves from `activated` through execution to `finished` (or `terminated`), with executed size and notional so far.

Run it in the IDE: [Hyperliquid TWAP Orders ➤](https://ide.bitquery.io/hyperliquid-twap-orders)

```graphql
query {
  Hyperliquid {
    Twaps(limit: {count: 50}, orderBy: {descending: Block_Time}) {
      Block { Time }
      Twap {
        TwapId
        Market { Symbol }
        Order { Side Size ReduceOnly Randomize }
        Interval { DurationMinutes StartTime EventTime }
        State { Status StatusError ExecutedSize ExecutedNotional }
        Trader { Address }
      }
    }
  }
}
```

`TwapId` matches `Trade.TwapId` on fills with `IsTwap: true`, so you can join a TWAP to its individual child fills.
