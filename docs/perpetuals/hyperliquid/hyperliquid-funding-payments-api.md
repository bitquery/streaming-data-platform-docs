---
title: "Hyperliquid Funding Payments API"
description: "Export every funding payment a Hyperliquid wallet paid or received: signed amount, funding rate, position size and market, per hourly funding tick, over GraphQL and WebSocket."
sidebar_position: 10
keywords:
  - Hyperliquid funding payments
  - Hyperliquid funding payment history
  - Hyperliquid funding fees export
  - Hyperliquid funding paid received
  - Hyperliquid funding API
  - Hyperliquid funding history wallet
  - Hyperliquid missing funding payments
  - Hyperliquid funding tax
  - Bitquery Hyperliquid funding
---

# Hyperliquid Funding Payments API

Every hour, Hyperliquid settles funding between longs and shorts. Each settlement is a **transfer against a specific wallet**, not a market statistic — and it is one of the event types that goes missing most often when people export their history for accounting.

This page covers the `PerpFundings` cube: the complete funding history of any address.

:::info Funding payments vs funding rates
A **funding rate** is a market-level number traders use to size a position. A **funding payment** is what actually left or entered one wallet's account. This page is about payments. For the rate applied at each tick, read `Funding.Rate` on the same records.
:::

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

## Funding payments of one wallet

`Amount` is signed: **negative means the trader paid funding**, positive means they received it. `Rate` is the funding rate applied at that tick and `Size` the position size it applied to.

Run it in the IDE: [Hyperliquid Wallet Funding Payments ➤](https://ide.bitquery.io/hyperliquid-wallet-funding-payments)

```graphql
query {
  Hyperliquid {
    PerpFundings(
      limit: {count: 100}
      orderBy: {descending: Block_Time}
      where: {Funding: {Trader: {Address: {is: "0x1e6db0fdf1a0f6edb78753184eb0fe5485c2eef2"}}}, Block: {Time: {since_relative: {days_ago: 3}}}}
    ) {
      Block { Time }
      Funding {
        Market { Symbol Kind }
        Amount
        Rate
        Size
        Trader { Address }
      }
    }
  }
}
```

Sample response:

```json
{
  "Block": { "Time": "2026-09-04T09:00:00.048813Z" },
  "Funding": {
    "Market": { "Symbol": "XYZ100" },
    "Amount": "-15.217007",
    "Rate": "0.0000096689",
    "Size": "53.1425",
    "Trader": { "Address": "0x1e6db0fdf1a0f6edb78753184eb0fe5485c2eef2" }
  }
}
```

## Total funding paid and received per market

Rather than paging every tick, aggregate them. This gives one row per market with the net funding and the number of ticks.

Run it in the IDE: [Hyperliquid Funding Totals By Market ➤](https://ide.bitquery.io/hyperliquid-funding-totals-by-market)

```graphql
query {
  Hyperliquid {
    PerpFundings(
      where: {Funding: {Trader: {Address: {is: "0x1e6db0fdf1a0f6edb78753184eb0fe5485c2eef2"}}}, Block: {Time: {since_relative: {days_ago: 3}}}}
    ) {
      Funding { Market { Symbol } }
      ticks: count
      net: sum(of: Funding_Amount)
    }
  }
}
```

`net` is the signed total: a negative number is net funding **paid** over the whole period.

## Funding paid only

Split the two directions by filtering on the sign of `Amount`. Use `lt: "0"` for funding paid, `gt: "0"` for funding received.

Run it in the IDE: [Hyperliquid Funding Paid Only ➤](https://ide.bitquery.io/hyperliquid-funding-paid-only)

```graphql
query {
  Hyperliquid {
    PerpFundings(
      where: {
        Funding: {
          Trader: {Address: {is: "0x1e6db0fdf1a0f6edb78753184eb0fe5485c2eef2"}}
          Amount: {lt: "0"}
        }
        Block: {Time: {since_relative: {days_ago: 3}}}
      }
    ) {
      Funding { Market { Symbol } }
      ticks: count
      paid: sum(of: Funding_Amount)
    }
  }
}
```

## Funding over a date range

Add a `Block: {Time: ...}` filter to bound the export to a tax year, a quarter or any window.

Run it in the IDE: [Hyperliquid Funding By Date Range ➤](https://ide.bitquery.io/hyperliquid-funding-by-date-range)

```graphql
query {
  Hyperliquid {
    PerpFundings(
      limit: {count: 100}
      orderBy: {ascending: Block_Time}
      where: {
        Funding: {Trader: {Address: {is: "0x1e6db0fdf1a0f6edb78753184eb0fe5485c2eef2"}}}
        Block: {Time: {since: "2026-09-01T00:00:00Z", till: "2026-09-04T00:00:00Z"}}
      }
    ) {
      Block { Time }
      Funding {
        Market { Symbol }
        Amount
        Rate
        Size
      }
    }
  }
}
```

## Real-time funding stream

Change `query` to `subscription` and drop `limit` and `orderBy` to receive each funding settlement as it happens.

Run it in the IDE: [Hyperliquid Funding Payments Stream ➤](https://ide.bitquery.io/hyperliquid-funding-payments-stream)

```graphql
subscription {
  Hyperliquid {
    PerpFundings(
      where: {Funding: {Trader: {Address: {is: "0x1e6db0fdf1a0f6edb78753184eb0fe5485c2eef2"}}}}
    ) {
      Block { Time }
      Funding {
        Market { Symbol }
        Amount
        Rate
        Size
        Trader { Address }
      }
    }
  }
}
```

Drop the `where` clause entirely to stream funding for every trader on the exchange.

## Notes

- Funding settles hourly. A wallet holding several perp positions produces one record per market per tick, so a busy account accumulates thousands of rows per month.
- `Market.Kind` distinguishes native perps from HIP-3 builder markets — see the [HIP-3 stocks API](/docs/perpetuals/hyperliquid/hip3-stocks-api).
- To pair funding with the fills that opened and closed the position, use the [Trades API](/docs/perpetuals/hyperliquid/hyperliquid-trades-api); for the currently open positions and their accumulated funding, use `CurrentPositions` on the [perpetuals page](/docs/perpetuals/hyperliquid/hyperliquid-perpetuals-api#current-positions).
