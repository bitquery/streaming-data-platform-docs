---
title: "Prediction Market Trades API"
description: "Query prediction market trades: real-time streams, latest trades, trades by market or trader, volume by outcome, and current prices. Buy/sell outcome tokens on Polygon (Polymarket and more)."
keywords:
  - PredictionTrades
  - prediction market trades API
  - Polymarket trades
  - outcome token buy sell
  - prediction market volume
  - Polygon prediction markets
  - conditional tokens trading
  - market price prediction
  - prediction market analytics
  - Bitquery GraphQL prediction
---

# Prediction Market Trades API

The **PredictionTrades** API returns **buy/sell** activity on outcome tokens for prediction markets (e.g. Polymarket) on Polygon. Use it to stream live trades, list latest activity, filter by market or trader, compute volume per outcome, and get current prices per outcome from the latest trade.

**Network:** Polygon (`network: matic`). Part of the [Prediction Market API](../prediction-market-api) lifecycle (Management → **Trades** → Settlement).

:::info Historical data
For **historical** Polymarket trades (date ranges, backtests, volume over time), use the [Polymarket API](https://docs.bitquery.io/docs/examples/polymarket-api/) docs (e.g. **DEXTradeByTokens** for historical trades on EVM).
:::

### Trade direction

- **IsOutcomeBuy: true** — Seller (maker) gives USDC (collateral), Buyer (taker) gives outcome tokens.
- **IsOutcomeBuy: false** — Buyer gives USDC (collateral), Seller gives outcome tokens.

## Key fields

- **Trade.OutcomeTrade.IsOutcomeBuy** — `true`: Seller gives collateral (USDC), Buyer gives outcome tokens; `false`: Buyer gives collateral, Seller gives outcome tokens.
- **Trade.OutcomeTrade** — **Buyer**, **Seller**, **Amount** (outcome tokens), **CollateralAmount**, **CollateralAmountInUSD**, **OrderId**, **Price**, **PriceInUSD**.
- **Trade.Prediction.Question** — **Title**, **MarketId**, Id, Image, ResolutionSource, CreatedAt. Use **MarketId** to filter by market (e.g. `"1391179"`). Full info: `https://gamma-api.polymarket.com/markets/{MarketId}`.
- **Trade.Prediction.Outcome** — **Label**, Id, Index.
- **Trade.Prediction.CollateralToken** — Token used to pay for the outcome (e.g. USDC): Name, Symbol, SmartContract, AssetId.
- **Trade.Prediction.OutcomeToken** — Outcome as a token: Name, Symbol, SmartContract, **AssetId** (use for volume/price per outcome).
- **Trade.Prediction.Marketplace** — ProtocolName, ProtocolFamily, SmartContract, ProtocolVersion.

## Polymarket-only filter {#polymarket-only-filter}

To restrict results to **Polymarket** only, add this to your `where` clause:

```graphql
Trade: { Prediction: { Marketplace: { ProtocolName: { is: "polymarket" } } } }
```

Example: real-time stream for Polymarket only — use the [real-time trades stream](#real-time-trades-stream) query and add the filter above inside `PredictionTrades(where: { ... })`.

## Real-time trades stream

Subscribe to live prediction market trades as they occur on Polygon (successful transactions only).

[Run in Bitquery IDE](https://ide.bitquery.io/prediction-market-trades-subscription)

```graphql
subscription PredictionTradesStream {
  EVM(network: matic) {
    PredictionTrades(where: { TransactionStatus: { Success: true } }) {
      Block {
        Time
      }
      Call {
        Signature {
          Name
        }
      }
      Log {
        Signature {
          Name
        }
        SmartContract
      }
      Trade {
        OutcomeTrade {
          Buyer
          Seller
          Amount
          CollateralAmount
          CollateralAmountInUSD
          OrderId
          Price
          PriceInUSD
          IsOutcomeBuy
        }
        Prediction {
          CollateralToken {
            Name
            Symbol
            SmartContract
            AssetId
          }
          ConditionId
          OutcomeToken {
            Name
            Symbol
            SmartContract
            AssetId
          }
          Marketplace {
            SmartContract
            ProtocolVersion
            ProtocolName
            ProtocolFamily
          }
          Question {
            Title
            ResolutionSource
            Image
            MarketId
            Id
            CreatedAt
          }
          Outcome {
            Id
            Index
            Label
          }
        }
      }
      Transaction {
        From
        Hash
      }
    }
  }
}
```
## Latest Prediction Market trades API

Fetch the most recent prediction market trades with full details, ordered by block time.

[Run in Bitquery IDE](https://ide.bitquery.io/latest-prediction-market-trades)

```graphql
query LatestPredictionTrades {
  EVM(network: matic) {
    PredictionTrades(
      limit: { count: 50 }
      orderBy: { descending: Block_Time }
      where: { TransactionStatus: { Success: true } }
    ) {
      Block {
        Time
      }
      Call {
        Signature {
          Name
        }
      }
      Log {
        Signature {
          Name
        }
        SmartContract
      }
      Trade {
        OutcomeTrade {
          Buyer
          Seller
          Amount
          CollateralAmount
          CollateralAmountInUSD
          OrderId
          Price
          PriceInUSD
          IsOutcomeBuy
        }
        Prediction {
          CollateralToken {
            Name
            Symbol
            SmartContract
            AssetId
          }
          ConditionId
          OutcomeToken {
            Name
            Symbol
            SmartContract
            AssetId
          }
          Marketplace {
            SmartContract
            ProtocolVersion
            ProtocolName
            ProtocolFamily
          }
          Question {
            Title
            ResolutionSource
            Image
            MarketId
            Id
            CreatedAt
          }
          Outcome {
            Id
            Index
            Label
          }
        }
      }
      Transaction {
        From
        Hash
      }
    }
  }
}
```
## Stream Trades for a specific market 

Subscribe to trades for one market only by filtering on **Question.MarketId**. Replace `"1391179"` with your market ID.

[Run in Bitquery IDE](https://ide.bitquery.io/subscribe-to-specific-market-trades)

```graphql
subscription TradesForSpecificMarket {
  EVM(network: matic) {
    PredictionTrades(
      where: {
        TransactionStatus: { Success: true }
        Trade: {
          Prediction: { Question: { MarketId: { is: "1391179" } } }
        }
      }
    ) {
      Block {
        Time
      }
      Call {
        Signature {
          Name
        }
      }
      Log {
        Signature {
          Name
        }
        SmartContract
      }
      Trade {
        OutcomeTrade {
          Buyer
          Seller
          Amount
          CollateralAmount
          CollateralAmountInUSD
          OrderId
          Price
          PriceInUSD
          IsOutcomeBuy
        }
        Prediction {
          CollateralToken {
            Name
            Symbol
            SmartContract
            AssetId
          }
          ConditionId
          OutcomeToken {
            Name
            Symbol
            SmartContract
            AssetId
          }
          Marketplace {
            SmartContract
            ProtocolVersion
            ProtocolName
            ProtocolFamily
          }
          Question {
            Title
            ResolutionSource
            Image
            MarketId
            Id
            CreatedAt
          }
          Outcome {
            Id
            Index
            Label
          }
        }
      }
      Transaction {
        From
        Hash
      }
    }
  }
}
```
## Trades for a specific trader

Fetch all trades where the given address is either **Buyer** or **Seller**. Pass the trader address as the `$trader` variable.

[Run in Bitquery IDE](https://ide.bitquery.io/Trades-for-a-specific-trader)

```graphql
query TradesForTrader($trader: String) {
  EVM(network: matic) {
    PredictionTrades(
      limit: { count: 50 }
      orderBy: { descending: Block_Time }
      where: {
        TransactionStatus: { Success: true }
        any: [
          { Trade: { OutcomeTrade: { Buyer: { is: $trader } } } }
          { Trade: { OutcomeTrade: { Seller: { is: $trader } } } }
        ]
      }
    ) {
      Block {
        Time
      }
      Call {
        Signature {
          Name
        }
      }
      Log {
        Signature {
          Name
        }
        SmartContract
      }
      Trade {
        OutcomeTrade {
          Buyer
          Seller
          Amount
          CollateralAmount
          CollateralAmountInUSD
          OrderId
          Price
          PriceInUSD
          IsOutcomeBuy
        }
        Prediction {
          CollateralToken {
            Name
            Symbol
            SmartContract
            AssetId
          }
          ConditionId
          OutcomeToken {
            Name
            Symbol
            SmartContract
            AssetId
          }
          Marketplace {
            SmartContract
            ProtocolVersion
            ProtocolName
            ProtocolFamily
          }
          Question {
            Title
            ResolutionSource
            Image
            MarketId
            Id
            CreatedAt
          }
          Outcome {
            Id
            Index
            Label
          }
        }
      }
      Transaction {
        From
        Hash
      }
    }
  }
}
```

**Variables (example):**

```json
{
  "trader": "0x101f2f96db1e39a9f36a1fa067751d541fd38e1a"
}
```
## Total volume and Yes/No volume for a market

Aggregate USD volume for a market over a time window: total volume plus volume per outcome. Many markets have **two outcomes** (e.g. Yes/No, Up/Down); this example uses a **Yes/No** market, so we split volume by outcome label "Yes" and "No". Pass the market’s outcome token **AssetId**s in `$marketAssets` (typically two: one per outcome).

[Run in Bitquery IDE](https://ide.bitquery.io/total-volume-outcome-1-volume-outcome-2-volume-of-a-market)

```graphql
query MarketVolumeByOutcome($marketAssets: [String!]) {
  EVM(network: matic) {
    PredictionTrades(
      where: {
        Block: { Time: { since_relative: { hours_ago: 1 } } }
        TransactionStatus: { Success: true }
        Trade: {
          Prediction: { OutcomeToken: { AssetId: { in: $marketAssets } } }
        }
      }
    ) {
      Trade {
        Prediction {
          Question {
            Title
            ResolutionSource
            Image
            MarketId
            Id
            CreatedAt
          }
        }
      }
      yes_volume: sum(
        of: Trade_OutcomeTrade_CollateralAmountInUSD
        if: { Trade: { Prediction: { Outcome: { Label: { is: "Yes" } } } } }
      )
      no_volume: sum(
        of: Trade_OutcomeTrade_CollateralAmountInUSD
        if: { Trade: { Prediction: { Outcome: { Label: { is: "No" } } } } }
      )
      total_volume: sum(of: Trade_OutcomeTrade_CollateralAmountInUSD)
    }
  }
}
```

**Variables (example):**

```json
{
  "marketAssets": [
    "46746822541461330721074821991383617225657173789584499857683753079229786702095",
    "70771354585365381988139008309072205730081182435161568795508496003376222185889"
  ]
}
```
## Current price per outcome (latest trade)

Get the latest trade price for each outcome in a market (e.g. Yes/No, Up/Down—each market defines its own outcome labels). Uses `limitBy` so you get one row per outcome (by `Trade_Prediction_OutcomeToken_AssetId`), with **Price** and **PriceInUSD** taken at the maximum block time (most recent). The response includes **Outcome.Label** so you can see which outcome each price refers to.

[Run in Bitquery IDE](https://ide.bitquery.io/Current-price-inside-the-market-for-all-options-based-on-latest-trade)

```graphql
query CurrentPricePerOutcome {
  EVM(network: matic) {
    PredictionTrades(
      limitBy: { by: Trade_Prediction_OutcomeToken_AssetId, count: 1 }
      where: {
        TransactionStatus: { Success: true }
        Trade: {
          Prediction: { Question: { MarketId: { is: "1391179" } } }
        }
      }
    ) {
      Trade {
        OutcomeTrade {
          Price(maximum: Block_Time)
          PriceInUSD(maximum: Block_Time)
        }
        Prediction {
          OutcomeToken {
            Name
            AssetId
          }
          Outcome {
            Id
            Label
          }
        }
      }
    }
  }
}
```
## Use cases

| Use case | Approach |
| -------- | -------- |
| **Live trade feed** | Use the real-time *Prediction trades stream* subscription. |
| **Recent activity** | Use *Latest trades* with `limit` and `orderBy: { descending: Block_Time }`. |
| **One market only** | Use *Trades for a specific market* with `Question.MarketId: { is: "..." }`. |
| **Trader history** | Use *Trades for a specific trader* with variable `$trader` (Buyer or Seller). |
| **Market volume (total / Yes / No)** | Use *Total volume and Yes/No volume* with `$marketAssets` and optional time window. |
| **Current market price** | Use *Current price per outcome* with `limitBy` and `MarketId`. |

For market creation and resolution, see [PredictionManagements](../prediction-market-api#predictionmanagements). For settlements (split, merge, redemption), see [Prediction Market Settlements API](../prediction-settlements-api).
