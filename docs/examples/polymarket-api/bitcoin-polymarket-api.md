---
title: "Polymarket Bitcoin Up or Down API & Websocket"
description: "Polymarket Bitcoin Up or Down API & Websocket: Bitquery documentation with GraphQL examples, real-time streams, and integration guidance."
keywords:
  - polymarket bitcoin price prediction
  - polymarket bitcoin up or down
  - polymarket bitcoin price odds
  - Bitcoin Polymarket API
  - Bitcoin Up or Down prediction market
  - Polymarket Bitcoin trades
  - Bitcoin prediction market GraphQL
  - stream Bitcoin Polymarket trades
  - Polygon prediction market Bitcoin
  - Bitcoin price direction market API
  - PredictionTrades Bitcoin
---
# Polymarket Bitcoin Up or Down Prediction Odds API

Query and stream **Polymarket Bitcoin up or down** prediction market trades and **Bitcoin price odds** via Bitquery’s GraphQL API. These markets ask whether Bitcoin will be **up** or **down** at a specific time (e.g. daily or weekly settlement).

**What you can do with this API:** Build real-time dashboards, aggregate odds across markets, track top traders by volume, identify top winners from settlements, analyze market liquidity, monitor whale activity, backtest strategies, and power alerts or bots.

## How Bitcoin Up or Down markets are identified

Trades are filtered by **Question.Title** containing **"Bitcoin Up or Down"**.

| Filter             | Use case                        | Where to apply                              |
| ------------------ | ------------------------------- | ------------------------------------------- |
| **Question.Title** | Bitcoin Up or Down markets only | `Trade.Prediction.Question.Title.includes`  |
| **ProtocolName**   | Polymarket only (optional)      | `Trade.Prediction.Marketplace.ProtocolName` |

---

## Real-time: Subscriptions and Kafka

### GraphQL subscriptions

The **subscription** below streams live Bitcoin Up or Down trades as they occur on Polygon. Change `subscription` to `query` and add `limit` / `orderBy` for historical results.

### Kafka streams

For **ultra-low-latency** consumption, prediction market data (including Bitcoin Up/Down) is available via **Kafka**:

- **`matic.predictions.proto`** — Raw prediction market events (trades, creations, resolutions)
- **`matic.broadcasted.predictions.proto`** — Mempool prediction market data

Kafka requires **separate credentials**. See [Kafka Streaming Concepts](/docs/streams/kafka-streaming-concepts/). For access, [contact support](https://t.me/bloxy_info) or email support@bitquery.io.

---

## How do I stream Bitcoin Up or Down trades in real time?

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

## How do I get Bitcoin price odds for all active Polymarket up/down markets?

This WebSocket subscription streams real-time odds (prices) for all active "Bitcoin Up or Down" Polymarket markets.
Use a GraphQL subscription on `PredictionTrades` with `limitBy: { count: 1, by: [Trade_Prediction_Question_Id, Trade_Prediction_Outcome_Label] }` to stream the latest odds (Up/Down outcome prices) for every active Bitcoin Up or Down market. Each market returns one row per outcome with `Price`, `PriceInUSD`, and market metadata.

[Run in Bitquery IDE](https://ide.bitquery.io/Odds-of-all-Bitcoin-up-and-down-markets)

```graphql
subscription {
  EVM(network: matic) {
    PredictionTrades(
      orderBy: { descending: Block_Time }
      limitBy: {
        count: 1
        by: [Trade_Prediction_Question_Id, Trade_Prediction_Outcome_Label]
      }
      where: {
        Trade: {
          Prediction: {
            Outcome: { Label: { in: ["Up", "Down"] } }
            Marketplace: { ProtocolName: { is: "polymarket" } }
            Question: { Title: { includes: "Bitcoin Up or Down" } }
          }
        }
      }
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

## How do I get the latest Bitcoin price odds for a specific up/down market?

To track a single specific Bitcoin Up or Down market, use its unique question ID (condition ID) with the following query. This lets you fetch real-time or latest odds for just that market:

Use `PredictionTrades` with `limitBy: { count: 1, by: Trade_Prediction_Outcome_Label }` and filter by `Question.Id` (condition ID) to get the latest odds for a single Bitcoin Up or Down market. Returns one row per outcome (Up/Down) with `Price` and `PriceInUSD`. Use a `query` for one-time fetch or change to `subscription` for real-time updates. Replace `Question.Id` with any market's condition ID to query odds for other Polymarket markets.

[Run in Bitquery IDE](https://ide.bitquery.io/Odds-of-a-specific-Bitcoin-up-and-down-market)

```graphql
{
  EVM(network: matic) {
    PredictionTrades(
      orderBy: { descending: Block_Time }
      limitBy: { count: 1, by: Trade_Prediction_Outcome_Label }
      where: {
        Trade: {
          Prediction: {
            Outcome: { Label: { in: ["Up", "Down"] } }
            Marketplace: { ProtocolName: { is: "polymarket" } }
            Question: {
              Id: {
                is: "0xd8c16674c7242c146cd9662906af3a442ba702d08f079885287ebc194ab0c271"
              }
              Title: { includes: "Bitcoin Up or Down" }
            }
          }
        }
      }
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

For real-time odds via WebSocket, use the same query with `subscription` instead of `query`:

```graphql
subscription {
  EVM(network: matic) {
    PredictionTrades(
      orderBy: { descending: Block_Time }
      limitBy: { count: 1, by: Trade_Prediction_Outcome_Label }
      where: {
        Trade: {
          Prediction: {
            Outcome: { Label: { in: ["Up", "Down"] } }
            Marketplace: { ProtocolName: { is: "polymarket" } }
            Question: {
              Id: {
                is: "0xd8c16674c7242c146cd9662906af3a442ba702d08f079885287ebc194ab0c271"
              }
              Title: { includes: "Bitcoin Up or Down" }
            }
          }
        }
      }
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

Replace `Question.Id` with any market's condition ID and adjust the `Title` filter to get odds for other Polymarket prediction markets.

## How do I get top traders of Bitcoin Up or Down markets by volume?

This **query** returns the top 10 **buyers** and top 10 **sellers** by traded volume in Bitcoin Up or Down markets on Polymarket over the last 24 hours. Results are aggregated by trader address and ordered by `buy_amount` (buyers) or `sell_amount` (sellers).

[Run in Bitquery IDE](https://ide.bitquery.io/Top-BuyersSellers-of-Bitcoin-up-down-market)

```graphql
{
  EVM(network: matic) {
    Top_buyers: PredictionTrades(
      where: {
        Trade: {
          Prediction: {
            Marketplace: { ProtocolName: { is: "polymarket" } }
            Question: { Title: { includes: "Bitcoin Up or Down" } }
          }
          OutcomeTrade: { IsOutcomeBuy: true }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      limit: { count: 10 }
      orderBy: { descendingByField: "buy_amount" }
    ) {
      Trade {
        OutcomeTrade {
          Buyer
        }
      }
      buy_amount: sum(of: Trade_OutcomeTrade_Amount)
    }
    Top_sellers: PredictionTrades(
      where: {
        Trade: {
          Prediction: {
            Marketplace: { ProtocolName: { is: "polymarket" } }
            Question: { Title: { includes: "Bitcoin Up or Down" } }
          }
          OutcomeTrade: { IsOutcomeBuy: false }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      limit: { count: 10 }
      orderBy: { descendingByField: "sell_amount" }
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

## How do I get top winners of Bitcoin Up or Down markets by redemption volume?

Use `PredictionSettlements` filtered by `EventType: "Redemption"` and `Question.Title` including "Bitcoin Up or Down" to return the top 10 holders by redeemed amount over the last hour. Useful for tracking which traders won the most on settled Bitcoin Up or Down markets.

[Run in Bitquery IDE](https://ide.bitquery.io/Top-Winners-of-Bitcoin-up-down-market)

```graphql
query MyQuery {
  EVM(network: matic) {
    PredictionSettlements(
      limit: { count: 10 }
      orderBy: { descendingByField: "redeemed_amount" }
      where: {
        Block: { Time: { since_relative: { hours_ago: 1 } } }
        Settlement: {
          EventType: { is: "Redemption" }
          Prediction: {
            Question: { Title: { includes: "Bitcoin Up or Down" } }
          }
        }
      }
    ) {
      Settlement {
        Holder
        Prediction {
          Question {
            Title
          }
        }
      }
      redeemed_amount: sum(of: Settlement_Amounts_Amount)
    }
  }
}
```

## Monitoring High-Value Trades on Polymarket Bitcoin Markets

Use the following WebSocket subscription to monitor live trades greater than $5,000 USD on Polymarket Bitcoin Up or Down markets. This is ideal for detecting whale activity and large market movements in real time.

```graphql
subscription {
  EVM(network: matic) {
    PredictionTrades(
      where: {TransactionStatus: {Success: true},
        Trade: {OutcomeTrade: {CollateralAmountInUSD: {gt: "5000"}},
          Prediction: {Question: {Title: {includes: "Bitcoin Up or Down"}}}}}
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

## How do I monitor specific wallets on Bitcoin Up or Down markets in real time?

Stream every Bitcoin Up or Down trade where one of a given list of wallets is the **Buyer** or the **Seller**. Pass the wallets you want to watch in the `$wallets` variable — the `any` predicate matches a trade if the wallet appears on either side. Useful for wallet-level alerting bots, copy-trading signals, and PnL tracking dashboards.

[Run in Bitquery IDE](https://ide.bitquery.io/montioring-specific-wallets-in-realtime-for-Bitcoin-Up-or-Down-markets)

```graphql
subscription MyQuery($wallets: [String!]) {
  EVM(network: matic) {
    PredictionTrades(
      where: {
        any: [
          { Trade: { OutcomeTrade: { Buyer: { in: $wallets } } } }
          { Trade: { OutcomeTrade: { Seller: { in: $wallets } } } }
        ]
        Trade: {
          Prediction: {
            Question: {
              Title: { includesCaseInsensitive: "Bitcoin Up or Down" }
            }
            Marketplace: { ProtocolName: { is: "polymarket" } }
          }
        }
        TransactionStatus: { Success: true }
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

**Variables:**

```json
{
  "wallets": [
    "0x87a961f161681cc1e9b3af2b6542b95ef3c4bd70",
    "0x0bab932893a7efc76d8e0951366ba933ba9fd3be"
  ]
}
```

### Same query for other Up or Down markets

The same wallet-monitoring pattern works for every Polymarket Up or Down market — only the `Question.Title` filter changes. Open any of the pre-built IDE queries below to stream trades for the chain you care about:

- [Solana Up or Down — monitor specific wallets](https://ide.bitquery.io/montioring-specific-wallets-in-realtime-for-Solana-Up-or-Down-markets_1)
- [Ethereum Up or Down — monitor specific wallets](https://ide.bitquery.io/monitoring-specific-wallets-trades-in-realtime-for-Ethereum-up-or-down-market)
- [XRP Up or Down — monitor specific wallets](https://ide.bitquery.io/monitoring-specific-wallets-trades-in-realtime-for-XRP-up-or-down-market)

Each query exposes the same `$wallets` variable, so you can drop the same wallet list into all four and run them in parallel to cover every chain at once.

## Related APIs

| Need                                 | API                                                                                                                                                                                                |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **All Polymarket trades & prices**   | [Polymarket API](/docs/examples/polymarket-api/polymarket-api/) / [Prediction Trades API](/docs/examples/prediction-market/prediction-trades-api/) |
| **Filter by slug, condition, token** | [Polymarket Markets API](/docs/examples/polymarket-api/polymarket-markets-api/)                                                                                            |
| **Settlements & redemptions**        | [Prediction Settlements API](/docs/examples/prediction-market/prediction-settlements-api/)                                                                                 |
| **Market creation & resolution**     | [Prediction Market API](/docs/examples/prediction-market/prediction-market-api/)                                                                                           |
| **User & wallet activity**           | [Polymarket Wallet & User Activity API](/docs/examples/polymarket-api/polymarket-wallet-api/)                                                                              |
| **Real-time: Kafka streams**         | [Kafka Streaming Concepts](/docs/streams/kafka-streaming-concepts/)                                                                                                        |

---

## Support

- [Bitquery Telegram](https://t.me/bloxy_info)
