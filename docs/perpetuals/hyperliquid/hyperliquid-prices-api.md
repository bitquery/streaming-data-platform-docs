---
title: "Hyperliquid Mark Prices & Price Updates API"
description: "Get real-time Hyperliquid mark prices and oracle price updates with Bitquery GraphQL and WebSocket, covering native perps, spot and HIP-3 builder markets like tokenized stocks."
sidebar_position: 4
keywords:
  - Hyperliquid mark price API
  - Hyperliquid oracle price
  - Hyperliquid price updates
  - Hyperliquid price stream
  - Hyperliquid HIP-3 prices
  - Hyperliquid tokenized stocks
  - Hyperliquid AAPL price
  - Bitquery Hyperliquid prices
---

# Hyperliquid Mark Prices & Price Updates API

This page covers the `MarkPrices` and `PriceUpdates` cubes: the current mark price of every market, and the underlying oracle / reference price feed.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

## Mark prices

`MarkPrices` is a **state cube**: one row per market with the latest mark price and the block it was last updated at. It includes HIP-3 markets, so tokenized stocks (`mkts:AAPL`, `mkts:GOOGL`) and indices are covered too.

Run it in the IDE: [Hyperliquid Mark Prices ➤](https://ide.bitquery.io/hyperliquid-mark-prices)

```graphql
query {
  Hyperliquid {
    MarkPrices(limit: {count: 100}, orderBy: {descending: LastTime}) {
      LastBlock
      LastTime
      Mark
      Market { Symbol Kind IsPerp Protocol CoinRaw }
    }
  }
}
```

Get one market with `where: {Market: {Symbol: {is: "BTC"}}}` (or `CoinRaw` for HIP-3 markets, since symbols can repeat across deployer namespaces).

## Price updates

`PriceUpdates` is the event feed the mark prices are built from. `Kind` distinguishes the source — values observed include `spotInput`, `extPerp` and `extPerpInput` — and `DailyPx` carries the daily reference price when present. `UpdateClass` is `Normal` in regular operation.

Run it in the IDE: [Hyperliquid Price Updates Stream ➤](https://ide.bitquery.io/hyperliquid-price-updates-stream)

```graphql
subscription {
  Hyperliquid {
    PriceUpdates {
      Block { Time }
      PriceUpdate {
        Kind Price DailyPx UpdateClass UpdateTime
        Market { Symbol Kind }
      }
    }
  }
}
```

The same shape works as a `query` with `limit`, `orderBy: {descending: Block_Time}` and a `where` filter for historical lookups.

For tradeable OHLCV rather than oracle prices, use [Candles](/docs/perpetuals/hyperliquid/hyperliquid-trades-api#ohlcv-candles).
