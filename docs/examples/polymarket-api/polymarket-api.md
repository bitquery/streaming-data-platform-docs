---
title: "Polymarket API - Trade, Prices & Market Data"
description: "How to query Polymarket prediction market trades, prices, and volume via Bitquery GraphQL. Stream real-time data, filter by condition_id, rank by volume. REST, WebSocket, or Kafka on Polygon."
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

# Polymarket API - Trade, Prices & Market Data

The Bitquery Polymarket API provides prediction market data on Polygon via GraphQL. Use **`dataset: realtime`** on `EVM` queries for **`PredictionTrades`**, **`PredictionSettlements`**, and related prediction-market APIs—this dataset retains roughly the **last 7 days**. Use it to query trades, settlements, market metadata, and volume; filter by condition_id, outcome token, or trade size; and access data via REST, WebSocket subscriptions, or Kafka streams. Filter by Polymarket using `ProtocolName: "polymarket"` or `Marketplace.ProtocolName` in your queries.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](https://docs.bitquery.io/docs/authorisation/how-to-generate/)
:::

:::note Dataset
Polymarket prediction-market data on Polygon requires **`dataset: realtime`** (~**7 days** of rolling history). Add `dataset: realtime` to the `EVM(...)` argument in your GraphQL examples when using prediction trades and settlements.
:::

---

## What Polymarket data can I get with Bitquery?

Bitquery provides **trades and prices** (buy/sell activity, volume, outcome prices), **positions and redemptions** (splits, merges after resolution), **market lifecycle** (creation, resolution, oracle outcomes), **market metadata** (condition ID, slug, token filters via CTF Exchange), **wallet activity** (volume and market counts by address), and **real-time streaming** (Kafka for trades and settlements). All data is on Polygon (`network: matic`) with **`dataset: realtime`** (about the **last 7 days**). Use the links below to find the right API.


### How do I get Polymarket trades and prices?

Use the **[Prediction Trades API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-trades-api)** to query buy/sell activity, track prices, and monitor volume across Polymarket.

[→ Prediction Trades API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-trades-api)

### How do I track positions and redemptions?

Use the **[Prediction Settlements API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-settlements-api)** to query splits, merges, and redemptions after market resolution.

[→ Prediction Settlements API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-settlements-api)

### How do I get market lifecycle data?

Use the **[Prediction Market API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-market-api)** to query market creation, resolution, and complete lifecycle events.

[→ Prediction Market API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-market-api)

### How do I query Polymarket CTF exchange data (condition ID, slug, token)?

Use the **[Polymarket Markets API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-markets-api)** (CTF Exchange) to query market data by slug, condition ID, outcome token, or event. Combine with [Prediction Trades API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-trades-api) and [Prediction Market API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-market-api) for full lifecycle.

[→ Polymarket Markets API (CTF Exchange)](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-markets-api)

### How do I get Polymarket wallet and user activity?

Use the **[Polymarket Wallet & User Activity API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-wallet-api)** to query recent activity, volume, and market counts by wallet address.

[→ Wallet & User Activity API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-wallet-api)

### How do I build TVL, open-interest-style metrics, maker/taker splits, and order-flow analytics?

Use the **[Polymarket Advanced Analytics API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-advanced-analytics-api)** for GraphQL examples: USDC balances in core contracts, daily volume and maker/taker splits, order-flow by market, whale-trade subscriptions, settlement flows, and top markets by volume.

[→ Polymarket Advanced Analytics API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-advanced-analytics-api)

### How do I stream Polymarket data in real time?

Use **Kafka Streams** for ultra-low-latency Polymarket data. Subscribe to trades, settlements, and market events as they happen.

Available Kafka topics:

- `matic.predictions.proto` — Raw prediction market events
- `matic.broadcasted.predictions.proto` — Mempool prediction market data

Note: Kafka streaming requires separate credentials. [Contact support](https://t.me/bloxy_info) or email support@bitquery.io for access.

[→ Kafka Streams Documentation](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts)

---

## How do I get real-time Polymarket trades using Bitquery?

Use Bitquery's `PredictionTrades` GraphQL query filtered by `ProtocolName: "polymarket"` on Polygon (`network: matic`). For live streaming, use a subscription or Kafka.

[Run in Bitquery IDE](https://ide.bitquery.io/prediction_trades)

```graphql
query {
  EVM(network: matic) {
    PredictionTrades(
      limit: { count: 10 }
      orderBy: { descending: Transaction_Time }
      where: {
        Trade: {
          Prediction: { Marketplace: { ProtocolName: { is: "polymarket" } } }
          OutcomeTrade: { IsOutcomeBuy: true }
        }
      }
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

### How do I subscribe to live Polymarket trades?

Use a GraphQL subscription on `PredictionTrades` filtered by `Marketplace.ProtocolName: "polymarket"` to stream trades as they happen on Polygon:

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



### How do I filter Polymarket trades by condition_id or asset ID?

Use `PredictionManagements` with `OutcomeToken.AssetId` or `Condition.Id` in the where clause. For condition_id, market_slug, and combined filters, see the [Polymarket Markets API (CTF Exchange)](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-markets-api/).

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


### How do I get Polymarket markets ranked by volume?

Use Bitquery's `PredictionTrades` with `limitBy: Trade_Prediction_Question_Id`, `orderBy: descendingByField: "sumBuyAndSell"`, and `sum(of: Trade_OutcomeTrade_CollateralAmountInUSD)` grouped by buy/sell to rank markets by total volume over a time window.

[Run query](https://ide.bitquery.io/Top-Polymarket-Markets-by-Volume)

```graphql
query questionsByVolume($time_ago: DateTime) {
  EVM(network: matic) {
    PredictionTrades(
      where: {
        TransactionStatus: {Success: true}
        Block: {Time: {since: $time_ago}}
        Trade: {Prediction: {Marketplace: {ProtocolName: {is: "polymarket"}}}}
      }
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
```

**Variables (example):**

```json
{
  "time_ago": "2026-02-24T07:22:21Z"
}
```

## How do I get real-time odds for all active Polymarket markets?

Use a GraphQL subscription on `PredictionTrades` with `limitBy: { count: 1, by: [Trade_Prediction_Question_Id, Trade_Prediction_Outcome_Label] }` filtered by `ProtocolName: "polymarket"` to stream the latest odds for every active market. Returns live price and outcome probabilities.

[Run in Bitquery IDE](https://ide.bitquery.io/How-do-I-get-real-time-odds-for-all-active-Polymarket-markets)

```graphql
subscription {
  EVM(network: matic) {
    PredictionTrades(
      limitBy: {count: 1, by: [Trade_Prediction_Question_Id, Trade_Prediction_Outcome_Label]}
      where: {Trade: {Prediction: {Marketplace: {ProtocolName: {is: "polymarket"}}}}}
    ) {
      Trade {
        OutcomeTrade {
          Price
          PriceInUSD
          IsOutcomeBuy
        }
        Prediction {
          CollateralToken {
            Name
            Symbol
            AssetId
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
            Label
          }
        }
      }
    }
  }
}
```

## How do I track high-value or whale trades on Polymarket?

Use a GraphQL subscription on `PredictionTrades` filtered by `CollateralAmountInUSD: { gt: "10000" }` and `ProtocolName: "polymarket"` to monitor trades exceeding $10,000 USD in real time. Ideal for detecting whale activity and large market movements.

[Run in Bitquery IDE](https://ide.bitquery.io/How-do-I-track-high-value-or-whale-trades-on-Polymarket)

```graphql
subscription {
  EVM(network: matic) {
    PredictionTrades(
      where: {
        TransactionStatus: {Success: true}
        Trade: {
          Prediction: {Marketplace: {ProtocolName: {is: "polymarket"}}}
          OutcomeTrade: {CollateralAmountInUSD: {gt: "10000"}}
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

## What are the largest Polymarket trades in the last 7 days?

Use `PredictionTrades` with `orderBy: { descending: Trade_OutcomeTrade_CollateralAmountInUSD }` and filter by `ProtocolName: "polymarket"` to get the top 10 largest trades by USD volume. Add `Block.Time: { since: $time_ago }` for a custom time window.

[Run in Bitquery IDE](https://ide.bitquery.io/What-are-the-largest-Polymarket-trades-in-the-last-7-days)

```graphql
query {
  EVM(network: matic) {
    PredictionTrades(
      limit: {count: 10}
      orderBy: {descending: Trade_OutcomeTrade_CollateralAmountInUSD}
      where: {
        TransactionStatus: {Success: true}
        Trade: {
          Prediction: {Marketplace: {ProtocolName: {is: "polymarket"}}}
          OutcomeTrade: {CollateralAmountInUSD: {gt: "10000"}}
        }
      }
    ) {
      Block{
        Time
        Date
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

## How do I get top buyers and sellers on Polymarket by volume?

Use `PredictionTrades` with `limitBy` and `sum(of: Trade_OutcomeTrade_CollateralAmountInUSD)` grouped by Buyer (or Seller) to rank the top 100 wallets by volume over the last 5 days. Useful for leaderboards, whale tracking, and trader analytics.

[Run in Bitquery IDE](https://ide.bitquery.io/How-do-I-get-top-buyers-and-sellers-on-Polymarket-by-volume)

```graphql
query {
  EVM(network: matic) {
    buyers: PredictionTrades(
      limit: {count: 100}
      orderBy: {descendingByField: "volume_usd"}
      where: {
        Block: {Time: {since_relative: {days_ago: 5}}}
        TransactionStatus: {Success: true}
        Trade: {Prediction: {Marketplace: {ProtocolName: {is: "polymarket"}}}}
      }
    ) {
      volume_usd: sum(of: Trade_OutcomeTrade_CollateralAmountInUSD)
      Trade {
        OutcomeTrade {
          Buyer
        }
      }
    }
    sellers: PredictionTrades(
      limit: {count: 100}
      orderBy: {descendingByField: "volume_usd"}
      where: {
        Block: {Time: {since_relative: {days_ago: 5}}}
        TransactionStatus: {Success: true}
        Trade: {Prediction: {Marketplace: {ProtocolName: {is: "polymarket"}}}}
      }
    ) {
      volume_usd: sum(of: Trade_OutcomeTrade_CollateralAmountInUSD)
      Trade {
        OutcomeTrade {
          Seller
        }
      }
    }
  }
}
```


## How do I count trades for a specific Polymarket trader?

Use `PredictionTrades` with `any` filter on `Buyer` or `Seller` to return the total trade count for a wallet. Add `ProtocolName: "polymarket"` to restrict to Polymarket only. Replace the address with your target wallet.

[Run in Bitquery IDE](https://ide.bitquery.io/How-do-I-count-trades-for-a-specific-Polymarket-trader)

```graphql
query {
  EVM(network: matic) {
    PredictionTrades(
      where: {
        TransactionStatus: {Success: true}
        any: [
          {Trade: {Prediction: {Marketplace: {ProtocolName: {is: "polymarket"}}}, OutcomeTrade: {Buyer: {is: "0xd48165a42bb4eeb5971e5e830c068eef0890af35"}}}}
          {Trade: {Prediction: {Marketplace: {ProtocolName: {is: "polymarket"}}}, OutcomeTrade: {Seller: {is: "0xd48165a42bb4eeb5971e5e830c068eef0890af35"}}}}
        ]
      }
    ) {
      count
    }
  }
}
```

---

## Frequently Asked Questions

### What is the Polymarket CTF Exchange?

The CTF (Conditional Token Framework) Exchange is Polymarket's prediction market layer on Polygon. Bitquery indexes it as `polymarket` protocol. Use the [Polymarket Markets API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-markets-api) to query markets by condition_id, slug, or token ID.

### How do I filter Polymarket trades by condition_id?

Use the [Polymarket Markets API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-markets-api) with `Condition.Id` in your query, or `PredictionManagements` with `Prediction.Condition.Id: { in: $conditionIds }`. Combine with the [Prediction Trades API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-trades-api) for trade history.

### Where can I get the Polymarket 5-minute BTC up/down API?

Bitquery provides prediction market data via the [Prediction Trades API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-trades-api). Filter by market question or condition ID for BTC up/down markets. For a dedicated 5-minute product, contact [support](https://t.me/bloxy_info).

### What network does Polymarket use?

Polymarket runs on Polygon. Use `EVM(dataset: realtime, network: matic)` for prediction trades and settlements (see the **Dataset** note above—**realtime** holds about the **last 7 days**).

### Does Bitquery support real-time Polymarket streaming?

Yes. Use GraphQL subscriptions (change `query` to `subscription`) or [Kafka Streams](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts) for `matic.predictions.proto`. Contact support for Kafka access.

---

## Support

For questions and technical support:

- [Bitquery Telegram](https://t.me/bloxy_info)
