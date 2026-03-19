---
title: "Polymarket Commodity API - Gold, Crude Oil & Commodity Markets"
description: "Query Polymarket commodity prediction markets: Gold (GC), Crude Oil, and other commodities. Market creation, resolution, prices, OHLC, volume by outcome, and top redeemers via GraphQL on Polygon."
keywords:
  - Polymarket commodity API
  - Polymarket Gold markets
  - Polymarket Crude Oil markets
  - commodity prediction markets
  - Gold GC Polymarket
  - Crude Oil Polymarket API
  - prediction market OHLC
  - outcome volume Polymarket
  - Polygon commodity markets
  - PredictionManagements commodity
  - PredictionTrades commodity
---

# Polymarket Commodity API — Gold, Crude Oil & Commodity Markets

Query **commodity-related prediction markets** on Polymarket: **Gold (GC)** (e.g. “Gold Up or Down”), **Crude Oil**, and other commodity price-direction markets. Use **PredictionManagements** for market creation and resolution events, **PredictionTrades** for prices and volume, and **PredictionSettlements** for redemptions and top redeemers. All data is on Polygon (`network: matic`).

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token. See [How to generate Bitquery API token ➤](https://docs.bitquery.io/docs/authorisation/how-to-generate/).
:::

---

## How commodity markets are identified

Markets are filtered by **Question.Title** using case-insensitive keywords. Use the same filters in **PredictionManagements**, **PredictionTrades**, or **PredictionSettlements** as needed.

| Filter | Use case | Where to apply |
|--------|----------|----------------|
| **Question.Title** | Gold (GC) markets | `includesCaseInsensitive: "Gold (GC)"` |
| **Question.Title** | Crude Oil markets | `includesCaseInsensitive: "crude oil"` |
| **MarketId** | Specific market (prices, OHLC, volume) | `Question.MarketId` (replace with your market ID) |
| **ProtocolName** | Polymarket only | `Marketplace.ProtocolName: "polymarket"` |

**Network:** Polygon (`network: matic`). For full lifecycle and trade APIs, see the [Polymarket API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-api) overview and [Prediction Market API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-market-api).

---

## Latest Gold (GC) markets created

Returns the 10 most recent **Created** events for Polymarket markets whose question title includes **"Gold (GC)"**, with full condition, outcomes, question, and collateral token details.

[Run in Bitquery IDE](https://ide.bitquery.io/latest-created-gold-markets-on-polymarket_5)

```graphql
query LatestMarketCreations {
  EVM(network: matic) {
    PredictionManagements(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: {
        Management: {
          EventType: { is: "Created" }
          Prediction: {
            Question: { Title: { includesCaseInsensitive: "Gold (GC)" } }
            Marketplace: { ProtocolName: { is: "polymarket" } }
          }
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
      Management {
        Description
        EventType
        Prediction {
          CollateralToken {
            Name
            SmartContract
            Symbol
            AssetId
          }
          Condition {
            Id
            Oracle
            Outcomes {
              Id
              Index
              Label
            }
            QuestionId
          }
          Marketplace {
            ProtocolName
            ProtocolFamily
            SmartContract
          }
          Outcome {
            Id
            Index
            Label
          }
          OutcomeToken {
            Symbol
            SmartContract
            Name
            AssetId
          }
          Question {
            CreatedAt
            Id
            Image
            MarketId
            ResolutionSource
            Title
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

---

## Latest Crude Oil markets created

Returns the 10 most recent **Created** events for Polymarket markets whose question title includes **"crude oil"**, with full prediction metadata.

[Run in Bitquery IDE](https://ide.bitquery.io/latest-created-crude-oil-markets-on-polymarket)

```graphql
query LatestMarketCreations {
  EVM(network: matic) {
    PredictionManagements(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: {
        Management: {
          EventType: { is: "Created" }
          Prediction: {
            Question: { Title: { includesCaseInsensitive: "crude oil" } }
            Marketplace: { ProtocolName: { is: "polymarket" } }
          }
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
      Management {
        Description
        EventType
        Prediction {
          CollateralToken {
            Name
            SmartContract
            Symbol
            AssetId
          }
          Condition {
            Id
            Oracle
            Outcomes {
              Id
              Index
              Label
            }
            QuestionId
          }
          Marketplace {
            ProtocolName
            ProtocolFamily
            SmartContract
          }
          Outcome {
            Id
            Index
            Label
          }
          OutcomeToken {
            Symbol
            SmartContract
            Name
            AssetId
          }
          Question {
            CreatedAt
            Id
            Image
            MarketId
            ResolutionSource
            Title
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

---

## Latest resolved Gold (GC) markets

Returns the 10 most recent **Resolved** events for Polymarket Gold (GC) markets, including the winning outcome and full prediction details.

[Run in Bitquery IDE](https://ide.bitquery.io/latest-resolved-gold-markets_1)

```graphql
query LatestMarketResolutions {
  EVM(network: matic) {
    PredictionManagements(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: {
        Management: {
          EventType: { is: "Resolved" }
          Prediction: {
            Marketplace: { ProtocolName: { is: "polymarket" } }
            Question: { Title: { includesCaseInsensitive: "Gold (GC)" } }
          }
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
      Management {
        Description
        EventType
        Prediction {
          CollateralToken {
            Name
            SmartContract
            Symbol
            AssetId
          }
          Condition {
            Id
            Oracle
            Outcomes {
              Id
              Index
              Label
            }
            QuestionId
          }
          Marketplace {
            ProtocolName
            ProtocolFamily
            SmartContract
          }
          Outcome {
            Id
            Index
            Label
          }
          OutcomeToken {
            Symbol
            SmartContract
            Name
            AssetId
          }
          Question {
            CreatedAt
            Id
            Image
            MarketId
            ResolutionSource
            Title
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

---

## Latest resolved Crude Oil markets

Returns the 10 most recent **Resolved** events for Polymarket Crude Oil markets.

[Run in Bitquery IDE](https://ide.bitquery.io/latest-resolved-crudeoil-markets)

```graphql
query LatestMarketResolutions {
  EVM(network: matic) {
    PredictionManagements(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: {
        Management: {
          EventType: { is: "Resolved" }
          Prediction: {
            Marketplace: { ProtocolName: { is: "polymarket" } }
            Question: { Title: { includesCaseInsensitive: "crude oil" } }
          }
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
      Management {
        Description
        EventType
        Prediction {
          CollateralToken {
            Name
            SmartContract
            Symbol
            AssetId
          }
          Condition {
            Id
            Oracle
            Outcomes {
              Id
              Index
              Label
            }
            QuestionId
          }
          Marketplace {
            ProtocolName
            ProtocolFamily
            SmartContract
          }
          Outcome {
            Id
            Index
            Label
          }
          OutcomeToken {
            Symbol
            SmartContract
            Name
            AssetId
          }
          Question {
            CreatedAt
            Id
            Image
            MarketId
            ResolutionSource
            Title
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

---

## Latest price of outcomes of a Crude Oil market

Returns the **latest trade price** (and price in USD) per outcome for a **single market** by `MarketId`. Replace `"1570893"` with the target Crude Oil market ID from [Polymarket](https://polymarket.com) or from the creation/resolution queries above.

[Run in Bitquery IDE](https://ide.bitquery.io/latest-price-of-outcomes-of-a-crude-oil-market)

```graphql
query {
  EVM(network: matic) {
    PredictionTrades(
      limitBy: { by: Trade_Prediction_OutcomeToken_AssetId, count: 1 }
      where: {
        TransactionStatus: { Success: true }
        Trade: {
          Prediction: { Question: { MarketId: { is: "1570893" } } }
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

---

## OHLC of an outcome of a Gold market

Returns **OHLC** (Open, High, Low, Close) in USD for one outcome of a Gold market, bucketed by time (e.g. 1-minute intervals). Replace `MarketId` `"1606192"` and outcome `"Down"` with the desired market and outcome label (e.g. `"Up"` or `"Down"`).

[Run in Bitquery IDE](https://ide.bitquery.io/OHLC-of-a-outcome-of-a-gold-market)

```graphql
query {
  EVM(network: matic) {
    PredictionTrades(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: {
        TransactionStatus: { Success: true }
        Trade: {
          Prediction: {
            Question: { MarketId: { is: "1606192" } }
            Outcome: { Label: { is: "Down" } }
          }
        }
      }
    ) {
      Block {
        Interval: Time(interval: { count: 1, in: minutes })
      }
      Trade {
        OutcomeTrade {
          Open: PriceInUSD(minimum: Block_Time)
          High: PriceInUSD(maximum: Trade_OutcomeTrade_PriceInUSD)
          Low: PriceInUSD(minimum: Trade_OutcomeTrade_PriceInUSD)
          Close: PriceInUSD(maximum: Block_Time)
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

---

## Outcome volumes of a Gold market (last 24 hours)

Returns **total volume** and **volume by outcome** (e.g. Up vs Down) for a single Gold market in the last 24 hours. Replace `MarketId` `"1650002"` with your target market ID.

[Run in Bitquery IDE](https://ide.bitquery.io/outcome-volumes-of-a-gold-market-in-last-24-hours_1)

```graphql
query MarketVolumeByOutcome {
  EVM(network: matic) {
    PredictionTrades(
      where: {
        Block: { Time: { since_relative: { hours_ago: 24 } } }
        TransactionStatus: { Success: true }
        Trade: {
          Prediction: { Question: { MarketId: { is: "1650002" } } }
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
      up_volume: sum(
        of: Trade_OutcomeTrade_CollateralAmountInUSD
        if: { Trade: { Prediction: { Outcome: { Label: { is: "Up" } } } } }
      )
      down_volume: sum(
        of: Trade_OutcomeTrade_CollateralAmountInUSD
        if: { Trade: { Prediction: { Outcome: { Label: { is: "Down" } } } } }
      )
      total_volume: sum(of: Trade_OutcomeTrade_CollateralAmountInUSD)
    }
  }
}
```

---

## Top 10 redeemers of a Gold market

Returns the **top 10 holders** by **redeemed amount** (in USD) for a specific Gold market after resolution. Uses **PredictionSettlements** with `EventType: "Redemption"`. Replace the question title with your market’s exact **Question.Title** (e.g. from the creation/resolution queries).

[Run in Bitquery IDE](https://ide.bitquery.io/top-10-traders-of-a-gold-market)

```graphql
query TopRedeemersGoldMarket {
  EVM(network: matic) {
    PredictionSettlements(
      limit: { count: 10 }
      orderBy: { descendingByField: "redeemed_amount" }
      where: {
        Settlement: {
          EventType: { is: "Redemption" }
          Prediction: {
            Question: {
              Title: {
                is: "Gold (GC) Up or Down on March 18?"
              }
            }
          }
        }
      }
    ) {
      Settlement {
        Holder
      }
      redeemed_amount: sum(of: Settlement_Amounts_CollateralAmountInUSD)
    }
  }
}
```

---

## Real-time: Subscriptions and Kafka

### GraphQL subscriptions

Any **query** on this page can be run as a **subscription**: use the same `where` filters and fields, and change the keyword **`query`** to **`subscription`**. You will receive new events (creations, resolutions, or trades) as they occur on Polygon over a WebSocket connection.

### Kafka streams

For **ultra-low-latency** consumption, prediction market data (including commodity markets) is available via **Kafka**:

- **`matic.predictions.proto`** — Raw prediction market events (creations, resolutions, trades)
- **`matic.broadcasted.predictions.proto`** — Mempool prediction market data

Kafka requires **separate credentials**. See [Kafka Streaming Concepts](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/). For access, [contact support](https://t.me/bloxy_info) or email support@bitquery.io.
