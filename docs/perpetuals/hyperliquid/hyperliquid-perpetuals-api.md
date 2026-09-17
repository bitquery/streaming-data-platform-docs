---
title: "Hyperliquid Liquidations, Funding, Positions & Leverage API"
description: "Stream Hyperliquid perp liquidations, per-trader funding payments, current open positions and leverage changes with Bitquery GraphQL and WebSocket."
sidebar_position: 5
keywords:
  - Hyperliquid liquidations API
  - Hyperliquid liquidation stream
  - Hyperliquid funding rate API
  - Hyperliquid funding payments
  - Hyperliquid positions API
  - Hyperliquid open positions
  - Hyperliquid leverage API
  - Hyperliquid backstop liquidation
  - Hyperliquid trader positions
  - Bitquery Hyperliquid perps
---

# Hyperliquid Liquidations, Funding, Positions & Leverage API

This page covers the perp risk cubes: `PerpLiquidations`, `PerpFundings`, `CurrentPositions` and `TraderLeverageUpdates`.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

## Liquidations

Each liquidation includes the liquidated user, the `Method` (`market` for open-market liquidation, `backstop` when the backstop vault takes over), the mark price at liquidation and the actual execution.

For every liquidation of one address, see [Hyperliquid Liquidation History by Wallet](/docs/perpetuals/hyperliquid/hyperliquid-liquidation-history-by-wallet).

Run it in the IDE: [Hyperliquid Liquidations ➤](https://ide.bitquery.io/hyperliquid-liquidations)

```graphql
query {
  Hyperliquid {
    PerpLiquidations(limit: {count: 50}, orderBy: {descending: Block_Time}) {
      Block { Time }
      Liquidation {
        Market { Symbol Kind }
        Method MarkPx Liquidator LiquidatedUser
        Execution { Price Size Side Direction Hash }
        Position { Leverage IsCross Side SizeBefore }
        Fees { Fee FeeToken }
      }
    }
  }
}
```

### Real-time liquidation alerts

Run it in the IDE: [Hyperliquid Liquidations Stream ➤](https://ide.bitquery.io/hyperliquid-liquidations-stream)

```graphql
subscription {
  Hyperliquid {
    PerpLiquidations {
      Block { Time }
      Liquidation {
        Market { Symbol }
        Method MarkPx LiquidatedUser
        Execution { Price Size Side }
        Position { Leverage IsCross SizeBefore }
      }
    }
  }
}
```

## Funding payments

`PerpFundings` records **per-trader funding transfers** at each hourly funding tick: the signed `Amount` (negative = the trader paid funding), the funding `Rate` applied and the position `Size` it applied to.

Run it in the IDE: [Hyperliquid Funding Payments ➤](https://ide.bitquery.io/hyperliquid-funding-payments)

```graphql
query {
  Hyperliquid {
    PerpFundings(limit: {count: 50}, orderBy: {descending: Block_Time}) {
      Block { Time }
      Funding {
        Market { Symbol Kind }
        Amount Rate Size
        Trader { Address }
      }
    }
  }
}
```

Filter to one wallet with `where: {Funding: {Trader: {Address: {is: "0x..."}}}}` to compute its total funding paid/received. The [Hyperliquid Funding Payments API](/docs/perpetuals/hyperliquid/hyperliquid-funding-payments-api) page has ready-made wallet queries: per-market totals, paid-only, date ranges and a live stream.

## Current positions

`CurrentPositions` is a **state cube** with the currently open perp positions: signed `Size` (negative = short, empty = flat), leverage, margin mode, accumulated `Funding` and `RealizedPnl`.

Run it in the IDE: [Hyperliquid Current Positions ➤](https://ide.bitquery.io/hyperliquid-current-positions)

```graphql
query {
  Hyperliquid {
    CurrentPositions(
      limit: {count: 50}
      orderBy: {descending: LastTime}
      where: {Market: {Symbol: {is: "BTC"}}}
    ) {
      LastBlock
      LastTime
      Market { Symbol Kind }
      Position { Size Leverage IsCross Funding RealizedPnl }
      Trader { Address }
    }
  }
}
```

Swap the filter to `where: {Trader: {Address: {is: "0x..."}}}` to get every open position of one trader.

## Leverage updates

`TraderLeverageUpdates` fires whenever a trader changes leverage or switches between cross and isolated margin on a market.

Run it in the IDE: [Hyperliquid Leverage Updates ➤](https://ide.bitquery.io/hyperliquid-leverage-updates)

```graphql
query {
  Hyperliquid {
    TraderLeverageUpdates(limit: {count: 50}, orderBy: {descending: Block_Time}) {
      Block { Time }
      LeverageUpdate {
        Leverage IsCross
        Market { Symbol }
        Trader { Address }
      }
    }
  }
}
```

All four cubes stream over WebSocket with the same shape — change `query` to `subscription` and drop `limit`/`orderBy`.

## Related

- [Liquidation History by Wallet](/docs/perpetuals/hyperliquid/hyperliquid-liquidation-history-by-wallet)
- [Funding Payments by Wallet](/docs/perpetuals/hyperliquid/hyperliquid-funding-payments-api)
- [HIP-3 Stocks API](/docs/perpetuals/hyperliquid/hip3-stocks-api) — funding and liquidations on stock, index and commodity perps
- [Track ZEC on Hyperliquid](/docs/perpetuals/hyperliquid/track-zec-on-hyperliquid) — positions, liquidations and funding for one market
