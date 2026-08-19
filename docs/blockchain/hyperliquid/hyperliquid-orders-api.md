---
title: "Hyperliquid Orders, Order Book & TWAP API"
description: "Track Hyperliquid order lifecycle, real-time order book deltas and TWAP orders with Bitquery GraphQL and WebSocket: statuses, time-in-force, trigger orders, book levels and TWAP execution progress."
sidebar_position: 3
keywords:
  - Hyperliquid orders API
  - Hyperliquid order book API
  - Hyperliquid book updates
  - Hyperliquid order status
  - Hyperliquid limit orders
  - Hyperliquid trigger orders
  - Hyperliquid TWAP API
  - Hyperliquid order stream
  - Hyperliquid L2 book
  - Bitquery Hyperliquid orders
---

# Hyperliquid Orders, Order Book & TWAP API

This page covers the `Orders`, `BookUpdates` and `Twaps` cubes: the full order lifecycle, order-book deltas you can rebuild the book from, and TWAP order execution.

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

Unlike typical L2 feeds, each delta is attributable to an **individual order and trader address** — you can watch a specific market maker's quoting in real time by filtering on `BookUpdate: {Trader: {Address: {is: "0x..."}}}`.

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
