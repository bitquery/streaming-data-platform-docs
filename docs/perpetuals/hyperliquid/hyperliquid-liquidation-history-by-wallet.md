---
title: "Hyperliquid Liquidation History by Wallet"
description: "Pull every liquidation for a single Hyperliquid address: market, method, mark price, execution, the position size before it was closed, and fees, over GraphQL and WebSocket."
sidebar_position: 12
keywords:
  - Hyperliquid liquidation history wallet
  - Hyperliquid liquidation by address
  - was my Hyperliquid position liquidated
  - Hyperliquid liquidation export
  - Hyperliquid liquidated user
  - Hyperliquid backstop liquidation wallet
  - Hyperliquid liquidation tax
  - Bitquery Hyperliquid liquidations
---

# Hyperliquid Liquidation History by Wallet

The [perpetuals page](/docs/perpetuals/hyperliquid/hyperliquid-perpetuals-api#liquidations) covers the market-wide liquidation feed. This page is the other direction: **one address, its complete liquidation history**.

That is the query you need to answer "was this position liquidated or did I close it", to reconstruct a blown-up account, or to fill the gap left when an export shows a position disappearing with no closing trade.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

## Every liquidation of one address

`LiquidatedUser` is the address whose position was closed. `Method` is `market` for an open-market liquidation and `backstop` when the backstop vault takes over. `Position.SizeBefore` is the signed size that existed immediately before the liquidation — negative for a short.

Run it in the IDE: [Hyperliquid Wallet Liquidation History ➤](https://ide.bitquery.io/hyperliquid-wallet-liquidation-history)

```graphql
query {
  Hyperliquid {
    PerpLiquidations(
      limit: {count: 100}
      orderBy: {descending: Block_Time}
      where: {Liquidation: {LiquidatedUser: {is: "0x2b5dba3bc4cbb1b94d1e57fcbe0fbc82731ce5f2"}}}
    ) {
      Block { Time }
      Liquidation {
        Market { Symbol Kind }
        Method
        MarkPx
        LiquidatedUser
        Execution { Price Size Side Direction Hash }
        Position { Leverage IsCross Side SizeBefore }
        Fees { Fee FeeToken }
      }
    }
  }
}
```

Sample response:

```json
{
  "Block": { "Time": "2026-09-04T09:58:14.257546Z" },
  "Liquidation": {
    "Market": { "Symbol": "SKR" },
    "Method": "market",
    "MarkPx": "0.024767",
    "LiquidatedUser": "0x2b5dba3bc4cbb1b94d1e57fcbe0fbc82731ce5f2",
    "Execution": { "Price": "0.024831", "Size": "2663.0", "Side": "Buy", "Direction": "Close Short" },
    "Position": { "Leverage": 3, "IsCross": false, "Side": "Short", "SizeBefore": "-2663.0" },
    "Fees": { "Fee": "0.028565", "FeeToken": "USDC" }
  }
}
```

`Execution.Direction` reads `Close Short` because liquidating a short is a buy that closes it — the direction describes the effect on the liquidated position, not the trader's intent.

## Liquidation totals per market

One row per market and method, with the number of liquidation events, the total size closed and the fees charged.

Run it in the IDE: [Hyperliquid Wallet Liquidation Totals ➤](https://ide.bitquery.io/hyperliquid-wallet-liquidation-totals)

```graphql
query {
  Hyperliquid {
    PerpLiquidations(
      where: {Liquidation: {LiquidatedUser: {is: "0x2b5dba3bc4cbb1b94d1e57fcbe0fbc82731ce5f2"}}}
    ) {
      Liquidation { Market { Symbol } Method }
      events: count
      size: sum(of: Liquidation_Execution_Size)
      fees: sum(of: Liquidation_Fees_Fee)
    }
  }
}
```

## Liquidations over a date range

Bound the export to a tax year, a quarter, or the window around a specific market event.

Run it in the IDE: [Hyperliquid Liquidations By Date Range ➤](https://ide.bitquery.io/hyperliquid-liquidations-by-date-range)

```graphql
query {
  Hyperliquid {
    PerpLiquidations(
      limit: {count: 1000}
      orderBy: {ascending: Block_Time}
      where: {
        Liquidation: {LiquidatedUser: {is: "0x2b5dba3bc4cbb1b94d1e57fcbe0fbc82731ce5f2"}}
        Block: {Time: {since: "2026-09-01T00:00:00Z", till: "2026-09-04T00:00:00Z"}}
      }
    ) {
      Block { Time }
      Liquidation {
        Market { Symbol }
        Method
        MarkPx
        Execution { Price Size Side Direction }
        Position { Leverage IsCross Side SizeBefore }
        Fees { Fee FeeToken }
      }
    }
  }
}
```

## Backstop liquidations only

Filter on `Method` to isolate the liquidations the backstop vault absorbed rather than the open market. These carry different `Execution.Direction` values from ordinary liquidations — `Auto-Deleveraging` and `Partial Borrow Liquidation` both appear here.

Run it in the IDE: [Hyperliquid Backstop Liquidations By Wallet ➤](https://ide.bitquery.io/hyperliquid-backstop-liquidations-by-wallet)

```graphql
query {
  Hyperliquid {
    PerpLiquidations(
      limit: {count: 100}
      orderBy: {descending: Block_Time}
      where: {
        Liquidation: {
          LiquidatedUser: {is: "0x2b5dba3bc4cbb1b94d1e57fcbe0fbc82731ce5f2"}
          Method: {is: "backstop"}
        }
      }
    ) {
      Block { Time }
      Liquidation {
        Market { Symbol }
        Method
        MarkPx
        Execution { Price Size Side Direction }
        Position { Leverage IsCross SizeBefore }
      }
    }
  }
}
```

## Real-time liquidation alerts for one wallet

Run it in the IDE: [Hyperliquid Wallet Liquidation Stream ➤](https://ide.bitquery.io/hyperliquid-wallet-liquidation-stream)

```graphql
subscription {
  Hyperliquid {
    PerpLiquidations(
      where: {Liquidation: {LiquidatedUser: {is: "0x2b5dba3bc4cbb1b94d1e57fcbe0fbc82731ce5f2"}}}
    ) {
      Block { Time }
      Liquidation {
        Market { Symbol }
        Method
        MarkPx
        LiquidatedUser
        Execution { Price Size Side Direction }
        Position { Leverage IsCross Side SizeBefore }
      }
    }
  }
}
```

Drop the `where` clause to stream every liquidation on the exchange, or swap the address for a list to watch a set of accounts.

## Notes

- `Liquidator` is empty on open-market liquidations; it is populated when a specific liquidator address takes the position.
- A single blow-up can produce several records — one per market the account held.
- To see what the position looked like before it was closed, pair `Position.SizeBefore` here with the fills on the [Trades API](/docs/perpetuals/hyperliquid/hyperliquid-trades-api) and the funding it accrued on the [Funding Payments API](/docs/perpetuals/hyperliquid/hyperliquid-funding-payments-api).
