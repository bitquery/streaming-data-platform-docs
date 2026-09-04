---
title: "Hyperliquid TWAP Orders & Child Fills"
description: "Reconstruct a Hyperliquid TWAP order end to end: the parent order lifecycle and every child fill it produced, joined on TwapId, with size, price, fees and realized PnL."
sidebar_position: 11
keywords:
  - Hyperliquid TWAP history
  - Hyperliquid TWAP fills
  - Hyperliquid TWAP orders API
  - Hyperliquid TWAP child fills
  - Hyperliquid TWAP export
  - Hyperliquid TWAP missing transactions
  - Hyperliquid TWAP sub orders
  - Hyperliquid TwapId
  - Bitquery Hyperliquid TWAP
---

# Hyperliquid TWAP Orders & Child Fills

A TWAP on Hyperliquid is one parent order that executes as many small child fills over a set duration. Tools that only read the parent order see a single line; tools that only read fills see dozens of unexplained trades. Neither reconciles.

This page joins the two: the `Twaps` cube for the parent order lifecycle, and the `Trades` cube filtered on `TwapId` for every fill it produced.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

## TWAP orders of one wallet

`State.Status` moves from `activated` through execution to `finished` (or `terminated`). Each status change is its own record, so a completed TWAP appears at least twice — once on activation with zero executed, once at the end with the final totals.

Run it in the IDE: [Hyperliquid Wallet TWAP Orders ➤](https://ide.bitquery.io/hyperliquid-wallet-twap-orders)

```graphql
query {
  Hyperliquid {
    Twaps(
      limit: { count: 50 }
      orderBy: { descending: Block_Time }
      where: {
        Twap: {
          Trader: {
            Address: { is: "0x1e6db0fdf1a0f6edb78753184eb0fe5485c2eef2" }
          }
        }
        Block: {Time: {since_relative: {days_ago: 3}}}
      }
    ) {
      Block {
        Time
      }
      Twap {
        TwapId
        Market {
          Symbol
        }
        Order {
          Side
          Size
          ReduceOnly
          Randomize
        }
        Interval {
          DurationMinutes
          StartTime
        }
        State {
          Status
          StatusError
          ExecutedSize
          ExecutedNotional
        }
        Trader {
          Address
        }
      }
    }
  }
}
```

Sample response — the same TWAP at activation and at completion:

```json
{
  "Block": { "Time": "2026-09-04T09:42:28.039330Z" },
  "Twap": {
    "TwapId": "2180078",
    "Market": { "Symbol": "GOLD" },
    "Order": {
      "Side": "Sell",
      "Size": "40.0",
      "ReduceOnly": true,
      "Randomize": true
    },
    "Interval": { "DurationMinutes": 240 },
    "State": {
      "Status": "finished",
      "ExecutedSize": "40.0",
      "ExecutedNotional": "178900.30962"
    }
  }
}
```

## Every child fill of one TWAP

`TwapId` on the parent matches `Trade.TwapId` on the fills. Filter the `Trades` cube on it to get the complete execution.

Run it in the IDE: [Hyperliquid TWAP Child Fills ➤](https://ide.bitquery.io/hyperliquid-twap-child-fills)

```graphql
query {
  Hyperliquid {
    Trades(
      limit: { count: 1000 }
      orderBy: { ascending: Block_Time }
      where: {
        Trade: {TwapId: {eq: "2180078"}}
        Block: {Time: {since_relative: {days_ago: 3}}}
      }
    ) {
      Block {
        Time
      }
      Trade {
        TwapId
        Market {
          Symbol
        }
        Execution {
          Price
          Size
          Side
          Direction
          Tid
        }
        Fees {
          Fee
          FeeToken
        }
        Position {
          RealizedPnl
        }
        Trader {
          Address
        }
      }
    }
  }
}
```

`TwapId` is a big integer, so the filter operator is `eq`, not `is`.

## TWAP execution summary

Aggregate the child fills to reconcile against the parent order's `ExecutedSize` and `ExecutedNotional`.

Run it in the IDE: [Hyperliquid TWAP Execution Summary ➤](https://ide.bitquery.io/hyperliquid-twap-execution-summary)

```graphql
query {
  Hyperliquid {
    Trades(
      where: {
        Trade: {TwapId: {eq: "2180078"}}
        Block: {Time: {since_relative: {days_ago: 3}}}
      }
    ) {
      Trade { TwapId Market { Symbol } }
      fills: count
      filled: sum(of: Trade_Execution_Size)
      avgPrice: average(of: Trade_Execution_Price)
      fees: sum(of: Trade_Fees_Fee)
      pnl: sum(of: Trade_Position_RealizedPnl)
    }
  }
}
```

For TWAP `2180078` this returns 522 fills totalling exactly the 40.0 size on the parent order, at an average price of 4472.40, with 161.01 USDC of fees and 12,061.51 of realized PnL. That reconciliation — parent `ExecutedSize` equals the sum of child fill sizes — is the check most exports fail.

## All TWAP fills of a wallet

To pull every TWAP-produced fill for an address without going TWAP by TWAP, filter on `IsTwap` instead.

Run it in the IDE: [Hyperliquid Wallet TWAP Fills ➤](https://ide.bitquery.io/hyperliquid-wallet-twap-fills)

```graphql
query {
  Hyperliquid {
    Trades(
      limit: { count: 1000 }
      orderBy: { descending: Block_Time }
      where: {
        Trade: {
          IsTwap: true
          Trader: {
            Address: { is: "0x1e6db0fdf1a0f6edb78753184eb0fe5485c2eef2" }
          }
        }
        Block: {Time: {since_relative: {days_ago: 3}}}
      }
    ) {
      Block {
        Time
      }
      Trade {
        TwapId
        Market {
          Symbol
        }
        Execution {
          Price
          Size
          Side
          Direction
          Tid
        }
        Fees {
          Fee
          FeeToken
        }
        Position {
          RealizedPnl
        }
      }
    }
  }
}
```

## Real-time TWAP stream

Run it in the IDE: [Hyperliquid TWAP Orders Stream ➤](https://ide.bitquery.io/hyperliquid-twap-orders-stream)

```graphql
subscription {
  Hyperliquid {
    Twaps {
      Block {
        Time
      }
      Twap {
        TwapId
        Market {
          Symbol
        }
        Order {
          Side
          Size
          ReduceOnly
          Randomize
        }
        State {
          Status
          ExecutedSize
          ExecutedNotional
        }
        Trader {
          Address
        }
      }
    }
  }
}
```

## Notes

- `Order.Randomize` indicates the TWAP randomises its slice sizes, which is why child fills are uneven.
- `Interval.DurationMinutes` is the configured TWAP length; `StartTime` is a millisecond timestamp.
- For non-TWAP order lifecycle and L3 book deltas, see the [Orders API](/docs/perpetuals/hyperliquid/hyperliquid-orders-api).
