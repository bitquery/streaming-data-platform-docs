---
title: "Polymarket API - Get Prices, Trades & Market Data"
description: "Build Polymarket apps fast: Query trades, settlements, and market data using optimized APIs. Real-time prediction market data via GraphQL on Polygon."
keywords:
  - Polymarket API
  - Polymarket GraphQL API
  - prediction market trades
  - Polymarket trading data
  - prediction market API
  - query Polymarket markets
  - Polymarket price API
  - get Polymarket data
  - Polymarket blockchain API
  - prediction market trades API
  - position settlement API
  - oracle resolution
  - Polygon smart contracts
  - GraphQL blockchain API
  - cryptocurrency prediction markets
  - real-time market data
  - position trading API
  - oracle resolution API
---

# Polymarket API - Modern APIs for Prediction Markets

Query Polymarket trades, settlements, and market data using optimized GraphQL APIs. Stream real-time data via Kafka for ultra-low-latency applications.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](https://docs.bitquery.io/docs/authorisation/how-to-generate/)
:::

---

## Start Here: Choose Your Path

### **Working with Trades & Prices?**

Use the **[Prediction Trades API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-trades-api)** — query buy/sell activity, track prices, and monitor volume across Polymarket.

[→ Prediction Trades API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-trades-api)

### **Tracking Positions & Redemptions?**

Use the **[Prediction Settlements API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-settlements-api)** — query splits, merges, and redemptions after market resolution.

[→ Prediction Settlements API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-settlements-api)

### **Need Market Lifecycle Data?**

Use the **[Prediction Market API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-market-api)** — query market creation, resolution, and complete lifecycle events.

[→ Prediction Market API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-market-api)

### **User & Wallet Activity?**

Use the **[Polymarket Wallet & User Activity API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-wallet-api)** — query recent activity, volume, and market counts by wallet address; link to official profile and bridge APIs.

[→ Wallet & User Activity API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-wallet-api)

### **Need Real-Time Streaming?**

Use **Kafka Streams** for ultra-low-latency Polymarket data. Subscribe to trades, settlements, and market events as they happen.

Available Kafka topics:

- `matic.predictions.proto` — Raw prediction market events
- `matic.broadcasted.predictions.proto` — Mempool prediction market data

Note: Kafka streaming requires separate credentials. [Contact support](https://t.me/bloxy_info) or email support@bitquery.io for access.

[→ Kafka Streams Documentation](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts)

---

## Quick Query: Get Recent Polymarket Trades

[Run this query](https://ide.bitquery.io/prediction_trades)

```graphql
query {
  EVM(network: matic) {
    PredictionTrades(
      limit: { count: 10 }
      orderBy: { descending: Transaction_Time }
      where: { Trade: { OutcomeTrade: { IsOutcomeBuy: true } } }
    ) {
      Transaction {
        Hash
        Time
      }
      Trade {
        Prediction {
          Question {
            Title
            MarketId
          }
          Outcome {
            Label
          }
          CollateralToken {
            Symbol
          }
        }
        OutcomeTrade {
          Buyer
          Seller
          Amount
          CollateralAmount
        }
      }
    }
  }
}
```

---

## Query Examples

### Real-Time Trade Streaming

Subscribe to live Polymarket trades as they happen with rich market data:

```graphql
subscription PredictionTradesStream {
  EVM(network: matic) {
    PredictionTrades(
      where: {
        TransactionStatus: { Success: true }
        Trade: {
          Prediction: { Marketplace: { ProtocolName: { is: "polymarket" } } }
        }
      }
    ) {
      Block {
        Time
      }
      Trade {
        OutcomeTrade {
          Buyer
          Seller
          Amount
          CollateralAmount
          Price
          IsOutcomeBuy
        }
        Prediction {
          Question {
            Title
            MarketId
          }
          Outcome {
            Label
          }
          CollateralToken {
            Symbol
          }
        }
      }
      Transaction {
        Hash
      }
    }
  }
}
```

### Get Latest Trades (Historical)

Retrieve recent Polymarket trades with full pagination:

```graphql
{
  EVM(network: matic) {
    DEXTradeByTokens(
      orderBy: { descending: Block_Time }
      limit: { count: 100 }
      where: {
        TransactionStatus: { Success: true }
        Trade: { Dex: { ProtocolName: { is: "polymarket" } } }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Trade {
        AmountInUSD
        PriceInUSD
        Side {
          Type
          Amount
          Currency {
            Symbol
          }
        }
        Currency {
          Symbol
        }
      }
    }
  }
}
```

### Trades by Time Range

```graphql
{
  EVM(network: matic) {
    DEXTradeByTokens(
      orderBy: { descending: Block_Time }
      limit: { count: 100 }
      where: {
        TransactionStatus: { Success: true }
        Block: {
          Time: { since: "2024-01-01T00:00:00Z", till: "2024-01-31T23:59:59Z" }
        }
        Trade: { Dex: { ProtocolName: { is: "polymarket" } } }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Trade {
        AmountInUSD
        PriceInUSD
      }
    }
  }
}
```

### Trades for Specific Asset

Find markets by outcome token ID (AssetId). For more options (condition_id, market_slug, combined filters), see the [Polymarket Markets API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-markets-api/).

[Run query](https://ide.bitquery.io/Filter-markets-by-asset-ID-Polymarket)

```graphql
query MarketsByAssetId($assetIds: [String!]) {
  EVM(network: matic) {
    PredictionManagements(
      limit: { count: 50 }
      orderBy: { descending: Block_Time }
      where: {
        Management: {
          Prediction: {
            Marketplace: { ProtocolName: { is: "polymarket" } }
            OutcomeToken: { AssetId: { in: $assetIds } }
          }
        }
      }
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
        Time
      }
      Management {
        EventType
        Prediction {
          Condition {
            Id
            QuestionId
            Outcomes {
              Id
              Index
              Label
            }
          }
          Question {
            MarketId
            Title
            Image
            ResolutionSource
            CreatedAt
          }
          CollateralToken {
            Symbol
            Name
          }
          Outcome {
            Id
            Label
          }
          OutcomeToken {
            AssetId
            SmartContract
          }
        }
      }
    }
  }
}
```

**Variables (example):**

```json
{
  "assetIds": [
    "19443761038809394075988687891855393102730862479306560066876868792031660494383"
  ]
}
```

### Filter by Trade Size

Get large trades only:

```graphql
{
  EVM(network: matic) {
    DEXTradeByTokens(
      where: {
        Trade: {
          AmountInUSD: { ge: "100" }
          Dex: { ProtocolName: { is: "polymarket" } }
        }
      }
    ) {
      Block {
        Time
      }
      Trade {
        AmountInUSD
        PriceInUSD
      }
    }
  }
}
```

### Volume by Hour

Aggregate trading volume over hourly intervals:

```graphql
{
  EVM(network: matic) {
    DEXTradeByTokens(
      where: { Trade: { Dex: { ProtocolName: { is: "polymarket" } } } }
    ) {
      Block {
        Time(interval: { count: 1, in: hours })
      }
      sum(of: Trade_AmountInUSD)
      count
    }
  }
}
```

### Top Markets by Volume

Rank Polymarket markets by total trading volume (buy + sell) over a time window. Use this to see the most active prediction markets. Results are limited per market (`limitBy: Trade_Prediction_Question_Id`) and ordered by volume.

[Run query](https://ide.bitquery.io/Top-Polymarket-Markets-by-Volume)

```graphql
query questionsByVolume($time_ago: DateTime) {
  EVM(network: matic) {
    PredictionTrades(
      where: {TransactionStatus: {Success: true}, Block: {Time: {since: $time_ago}}}
      limit: {count: 100}
      orderBy: {descendingByField: "sumBuyAndSell"}
      limitBy: {by: Trade_Prediction_Question_Id}
    ) {
      Trade {
        Prediction {
          Question {
            Id
            Image
            Title
            CreatedAt
          }
        }
      }
      buyUSD: sum(
        of: Trade_OutcomeTrade_CollateralAmountInUSD
        if: {Trade: {OutcomeTrade: {IsOutcomeBuy: true}}}
      )
      sellUSD: sum(
        of: Trade_OutcomeTrade_CollateralAmountInUSD
        if: {Trade: {OutcomeTrade: {IsOutcomeBuy: false}}}
      )
      sumBuyAndSell: calculate(expression: "$buyUSD + $sellUSD")
    }
  }
}
{
  "time_ago": "2026-02-24T07:22:21Z"
}
```


---

## Support

For questions and technical support:

- [Bitquery Telegram](https://t.me/bloxy_info)
