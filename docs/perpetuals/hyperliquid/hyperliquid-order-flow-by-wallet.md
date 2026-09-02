---
title: "Track Hyperliquid Order Flow by Wallet — Market Makers, Spoofing & Quote Behaviour"
description: "Use Hyperliquid L3 market-by-order data to follow a single wallet's order flow: watch a market maker quote and pull, measure cancel-to-fill ratios, spot orders never intended to trade, and reconstruct full order lifecycles by trader address."
sidebar_position: 7
keywords:
  - track Hyperliquid market maker
  - Hyperliquid order flow by wallet
  - detect spoofing Hyperliquid
  - Hyperliquid wallet order history
  - Hyperliquid cancel to fill ratio
  - Hyperliquid L3 order book
  - Hyperliquid market by order
  - Hyperliquid trader analysis
  - Hyperliquid quote behaviour
  - Bitquery Hyperliquid analytics
---

# Track Hyperliquid Order Flow by Wallet

On an aggregated **L2** feed you can see that 40 BTC rests at $95,000. You cannot see whether that is one order or twenty, who placed it, or whether it was pulled the instant a buyer approached.

Bitquery serves Hyperliquid's book at **L3 (market-by-order)**: one event per individual order, carrying its order id (`Oid`) and the **wallet address** that placed it. Because Hyperliquid settles on a transparent L1, that attribution is public — L3 with real identity, which does not exist on centralised venues where L3 feeds are anonymised.

This page shows what that unlocks. For the schema itself see the [L3 Order Book API](/docs/perpetuals/hyperliquid/hyperliquid-orders-api).

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

## 1. Watch one wallet quote in real time

Filter the book stream to a single address and you see that participant's quoting as it happens — every level they add, resize and pull.

Run it in the IDE: [Hyperliquid Wallet Book Activity ➤](https://ide.bitquery.io/hyperliquid-wallet-book-activity)

```graphql
subscription {
  Hyperliquid {
    BookUpdates(
      where: {BookUpdate: {Trader: {Address: {is: "0x0000000000000000000000000000000000000000"}}}}
    ) {
      Block { Time }
      BookUpdate {
        Kind Side Px Size SizeBefore Oid
        Market { Symbol }
      }
    }
  }
}
```

`Kind` tells you what happened to that specific order: `new` (placed), `change` (resized) or `remove` (pulled or filled). `SizeBefore` gives you the delta on that one order rather than a net change across the level.

Swap the address for a list to follow a whole desk:

```graphql
where: {BookUpdate: {Trader: {Address: {in: ["0xaaa...", "0xbbb...", "0xccc..."]}}}}
```

## 2. Reconstruct a trader's full order lifecycle

Fills alone tell you what a trader *did*. Orders tell you what they *intended* — including everything they placed and then cancelled, which never appears in trade data.

Run it in the IDE: [Hyperliquid Wallet Order Lifecycle ➤](https://ide.bitquery.io/hyperliquid-wallet-order-lifecycle)

```graphql
query {
  Hyperliquid {
    Orders(
      limit: {count: 200}
      orderBy: {descending: Block_Time}
      where: {Order: {Trader: {Address: {is: "0x0000000000000000000000000000000000000000"}}}}
    ) {
      Block { Time }
      Order {
        Market { Symbol }
        Oid Cloid Status OrderType Tif Side LimitPx Size OrigSz
        IsTrigger TriggerPx ReduceOnly
      }
    }
  }
}
```

`Oid` is the join key. The same id appears on `BookUpdate.Oid` (how the order sat in the book) and on `Trade.Execution.Oid` (how it filled), so one order can be followed end to end across all three cubes.

## 3. Cancel-to-fill ratio — the spoofing signal

An order placed and pulled without ever trading is normal market making. A wallet doing it at scale, on one side, repeatedly, is a different thing. L3 is what makes the ratio measurable at all: on L2 you cannot tell a cancellation from a fill, because both simply reduce the level.

Count orders by status for a market over a window:

Run it in the IDE: [Hyperliquid Order Status Breakdown ➤](https://ide.bitquery.io/hyperliquid-order-status-breakdown)

```graphql
query {
  Hyperliquid {
    Orders(
      limit: {count: 100}
      orderBy: {descendingByField: "placed"}
      where: {
        Order: {Market: {Symbol: {is: "BTC"}}}
        Block: {Time: {since_relative: {hours_ago: 24}}}
      }
    ) {
      Order {
        Trader { Address }
      }
      placed: count
      canceled: count(if: {Order: {Status: {is: "canceled"}}})
      filled: count(if: {Order: {Status: {is: "filled"}}})
    }
  }
}
```

This returns one row per wallet with all three counts, so the cancel-to-fill ratio is `canceled / filled` directly. A wallet with a very high cancel share, concentrated on one `Side`, placing size well away from the touch and pulling it as price approaches, is worth a closer look — pull that address back through query 1 to see the behaviour tick by tick.

:::caution Interpret with care
A high cancel rate on its own is not evidence of manipulation. Market makers legitimately cancel the large majority of their orders as they requote. Treat this as a screen that tells you where to look, not as a conclusion.
:::

## 4. Follow the wallet off Hyperliquid

This is the part no Hyperliquid-only data source can do. Once you have an address of interest, the same API covers Solana, Ethereum, Base, BNB, Tron and Bitcoin — so you can ask where that trader's funds came from before the position and where they went after it.

```graphql
query {
  EVM(network: eth) {
    Transfers(
      limit: {count: 50}
      orderBy: {descending: Block_Time}
      where: {Transfer: {Sender: {is: "0x0000000000000000000000000000000000000000"}}}
    ) {
      Block { Time }
      Transfer {
        Amount
        Currency { Symbol SmartContract }
        Receiver
      }
    }
  }
}
```

Liquidation on Hyperliquid, followed by a deposit somewhere else, is a single question here rather than a reconciliation job across two vendors.

## Data window

The `Hyperliquid` cubes serve a **rolling ~30-day window**, which covers live monitoring and recent-history analysis. For longer studies — behavioural baselines over months, backtests — use the [Blockchain Data Lake](/docs/data-lake/) for the full archive.

## Related

- [Hyperliquid L3 Order Book API](/docs/perpetuals/hyperliquid/hyperliquid-orders-api) — `Orders`, `BookUpdates`, `Twaps` schema
- [Hyperliquid Trades & Candles](/docs/perpetuals/hyperliquid/hyperliquid-trades-api) — fills, PnL, OHLCV
- [Hyperliquid Signed Actions](/docs/perpetuals/hyperliquid/hyperliquid-signed-actions-api) — raw L1 actions beneath the book
- [Bitquery vs Hyperliquid's free data](/docs/perpetuals/hyperliquid/vs-hyperliquid-api) — what the native API and S3 archive do and don't cover
