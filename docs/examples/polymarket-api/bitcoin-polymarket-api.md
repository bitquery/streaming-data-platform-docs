---
title: "Bitcoin Up or Down Polymarket API - Stream Trades"
description: "Query and stream Polymarket Bitcoin Up or Down prediction market trades via GraphQL. Real-time subscriptions and historical queries on Polygon. Filter by question title for Bitcoin price direction markets."
keywords:
  - Bitcoin Polymarket API
  - Bitcoin Up or Down prediction market
  - Polymarket Bitcoin trades
  - Bitcoin prediction market GraphQL
  - stream Bitcoin Polymarket trades
  - Polygon prediction market Bitcoin
  - Bitcoin price direction market API
  - PredictionTrades Bitcoin
---

# Bitcoin Up or Down Polymarket API

Query and stream **Bitcoin Up or Down** prediction market trades on Polymarket. These markets ask whether Bitcoin will be **up** or **down** at a specific time (e.g. daily or weekly settlement). 


## How Bitcoin Up or Down markets are identified

Trades are filtered by **Question.Title** containing **"Bitcoin Up or Down"**. 

| Filter           | Use case                          | Where to apply                               |
| ---------------- | --------------------------------- | -------------------------------------------- |
| **Question.Title** | Bitcoin Up or Down markets only   | `Trade.Prediction.Question.Title.includes`    |
| **ProtocolName**  | Polymarket only (optional)        | `Trade.Prediction.Marketplace.ProtocolName`   |

---

## Real-time: Subscriptions and Kafka

### GraphQL subscriptions

The **subscription** below streams live Bitcoin Up or Down trades as they occur on Polygon. Change `subscription` to `query` and add `limit` / `orderBy` for historical results.

### Kafka streams

For **ultra-low-latency** consumption, prediction market data (including Bitcoin Up/Down) is available via **Kafka**:

- **`matic.predictions.proto`** — Raw prediction market events (trades, creations, resolutions)
- **`matic.broadcasted.predictions.proto`** — Mempool prediction market data

Kafka requires **separate credentials**. See [Kafka Streaming Concepts](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/). For access, [contact support](https://t.me/bloxy_info) or email support@bitquery.io.

---

## Stream Bitcoin Up or Down trades (real-time)

Subscribe to live Polymarket trades for markets whose question title includes **"Bitcoin Up or Down"**. Includes block time, call/log signatures, full outcome trade details (buyer, seller, amount, price, USD values), and prediction metadata (question, outcomes, collateral token, marketplace).

[Run in Bitquery IDE](https://ide.bitquery.io/Bitcoin-Up-or-Down-Trades-Stream)

```graphql
subscription {
  EVM(network: matic) {
    PredictionTrades(
      where: {
        Trade: {
          Prediction: {
            Marketplace: { ProtocolName: { is: "polymarket" } }
            Question: { Title: { includes: "Bitcoin Up or Down" } }
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

## Top Traders of Bitcoin Up or Down Market by Volume

This **query** returns the top 10 **buyers** and top 10 **sellers** by traded volume in Bitcoin Up or Down markets on Polymarket over the last 24 hours. Results are aggregated by trader address and ordered by `buy_amount` (buyers) or `sell_amount` (sellers).

[Run in Bitquery IDE](https://ide.bitquery.io/Top-BuyersSellers-of-Bitcoin-up-down-market)

```graphql
{
  EVM(network: matic) {
    Top_buyers: PredictionTrades(
      where: {Trade: {Prediction: {Marketplace: {ProtocolName: {is: "polymarket"}}, Question: {Title: {includes: "Bitcoin Up or Down"}}}, OutcomeTrade: {IsOutcomeBuy: true}}, Block: {Time: {since_relative: {hours_ago: 24}}}}
      limit: {count: 10}
      orderBy: {descendingByField: "buy_amount"}
    ) {
      Trade {
        OutcomeTrade {
          Buyer
        }
      }
      buy_amount: sum(of: Trade_OutcomeTrade_Amount)
    }
    Top_sellers: PredictionTrades(
      where: {Trade: {Prediction: {Marketplace: {ProtocolName: {is: "polymarket"}}, Question: {Title: {includes: "Bitcoin Up or Down"}}}, OutcomeTrade: {IsOutcomeBuy: false}}, Block: {Time: {since_relative: {hours_ago: 24}}}}
      limit: {count: 10}
      orderBy: {descendingByField: "sell_amount"}
    ) {
      Trade {
        OutcomeTrade {
          Buyer
        }
      }
      sell_amount: sum(of: Trade_OutcomeTrade_Amount)
    }
  }
}
```



## Related APIs

| Need                             | API                                                                                                                                 |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **All Polymarket trades & prices** | [Polymarket API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-api/) / [Prediction Trades API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-trades-api/) |
| **Filter by slug, condition, token** | [Polymarket Markets API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-markets-api/)                             |
| **Settlements & redemptions**    | [Prediction Settlements API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-settlements-api/)                   |
| **Market creation & resolution** | [Prediction Market API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-market-api/)                             |
| **User & wallet activity**       | [Polymarket Wallet & User Activity API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-wallet-api/)                 |
| **Real-time: Kafka streams**     | [Kafka Streaming Concepts](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/)                                         |

---

## Support

- [Bitquery Telegram](https://t.me/bloxy_info)
