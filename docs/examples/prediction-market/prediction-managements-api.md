---
title: "Prediction Market Managements API"
description: "Query prediction market lifecycle: real-time streams and historical queries for market creation and resolution. Created and Resolved events on Polygon (Polymarket and more)."
keywords:
  - PredictionManagements
  - prediction market management API
  - Polymarket market creation
  - market resolution
  - prediction market lifecycle
  - Polygon prediction markets
  - conditional tokens market
  - outcome tokens
  - Bitquery GraphQL prediction
---

# Prediction Market Managements API

The **PredictionManagements** API returns **market lifecycle** events for prediction markets (e.g. Polymarket) on Polygon: **Created** (new market) and **Resolved** (outcome determined). Use it to stream live creations and resolutions, list latest events, and count Created vs Resolved over a time window.

**Network:** Polygon (`network: matic`). Part of the [Prediction Market API](../prediction-market-api) lifecycle (**Management** → Trades → Settlement).

### Event types

| EventType   | Description |
| ----------- | ----------- |
| **Created** | New prediction market created; condition and possible outcomes are set. |
| **Resolved** | Market resolved; the winning outcome is determined. |

---

## Key fields

- **Management.EventType** — `"Created"` or `"Resolved"`.
- **Management.Prediction.Question** — **Title**, **MarketId**, Id, Image, ResolutionSource, CreatedAt. Use **Title** to filter (e.g. by keyword). **MarketId** links to full info: `https://gamma-api.polymarket.com/markets/{MarketId}`.
- **Management.Prediction.Condition** — Id, QuestionId, Oracle, **Outcomes** (all possible outcomes for this market: Id, Index, Label). For **Created** events, this lists every outcome the market can settle to.
- **Management.Prediction.Outcome** — For **Resolved** events: the **winning** outcome (Id, Index, Label). For **Created**: often empty.
- **Management.Prediction.OutcomeToken** — For **Resolved**: token details for the winning outcome (Name, Symbol, **AssetId**, SmartContract). Use this for contract address and asset ID of the winning outcome token.
- **Management.Prediction.CollateralToken** — Collateral token (e.g. USDC): Name, Symbol, AssetId, SmartContract.
- **Management.Prediction.Marketplace** — ProtocolName, ProtocolFamily, SmartContract.

---

## Real-time management stream (creations + resolutions)

Subscribe to all prediction market lifecycle events (Created and Resolved) as they occur on Polygon.

[Run in Bitquery IDE](https://ide.bitquery.io/Prediction-Managements-subscription-resolutions-creations)

```graphql
subscription PredictionManagementsStream {
  EVM(network: matic) {
    PredictionManagements {
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

## Latest managements (historical)

Fetch the most recent creation and resolution events with full details, ordered by block time.

[Run in Bitquery IDE](https://ide.bitquery.io/latest-Prediction-managements-resolutions-creations)

```graphql
query LatestPredictionManagements {
  EVM(network: matic) {
    PredictionManagements(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
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

## Created vs Resolved count (last 24 hours)

Count how many **Created** and **Resolved** events occurred in the last 24 hours. Use the **Log.Signature.Name** or **Management.EventType** in the response to distinguish them.

[Run in Bitquery IDE](https://ide.bitquery.io/last-24-hr-resolution-and-ceated-count)

```graphql
query CreatedResolvedCountLast24h {
  EVM(network: matic) {
    PredictionManagements(
      where: { Block: { Time: { since_relative: { hours_ago: 24 } } } }
    ) {
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
        EventType
      }
      count
    }
  }
}
```

---

## Real-time market creations (subscription)

Subscribe only to **Created** events so you can track new markets as they are created. For each creation, the full list of possible outcomes for that market is available under **Prediction.Condition.Outcomes** (Id, Index, Label for each outcome).

[Run in Bitquery IDE](https://ide.bitquery.io/track-realtime-new-polymarket-creations)

```graphql
subscription RealtimeMarketCreations {
  EVM(network: matic) {
    PredictionManagements(where: { Management: { EventType: { is: "Created" } } }) {
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

## Real-time market resolutions (subscription)

Subscribe only to **Resolved** events. For each resolution, the **winning outcome** is given in **Prediction.Outcome** (Id, Index, Label). Token-level details for that outcome—such as **AssetId** and **SmartContract**—are in **Prediction.OutcomeToken**.

[Run in Bitquery IDE](https://ide.bitquery.io/track-realtime-polymarket-resolutions)

```graphql
subscription RealtimeMarketResolutions {
  EVM(network: matic) {
    PredictionManagements(where: { Management: { EventType: { is: "Resolved" } } }) {
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

## Latest market creations (query)

Fetch the most recent **Created** events. For each market, all possible outcomes are listed under **Prediction.Condition.Outcomes**.

[Run in Bitquery IDE](https://ide.bitquery.io/latest-polymarket-creations)

```graphql
query LatestMarketCreations {
  EVM(network: matic) {
    PredictionManagements(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: { Management: { EventType: { is: "Created" } } }
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

## Latest market resolutions (query)

Query that returns the 10 most recent **Resolved** events. The winning outcome is in **Prediction.Outcome**; **Prediction.OutcomeToken** holds the asset ID and contract details for that outcome.

[Run in Bitquery IDE](https://ide.bitquery.io/latest-polymarket-resolutions_1)

```graphql
query LatestMarketResolutions {
  EVM(network: matic) {
    PredictionManagements(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: { Management: { EventType: { is: "Resolved" } } }
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

## Use cases

| Use case | Approach |
| -------- | -------- |
| **Live creation + resolution feed** | Use the real-time *Prediction managements stream* subscription. |
| **Recent activity (any type)** | Use *Latest managements* with `limit` and `orderBy: { descending: Block_Time }`. |
| **New markets only (stream)** | Use *Real-time market creations* with `EventType: { is: "Created" }`. |
| **Resolutions only (stream)** | Use *Real-time market resolutions* with `EventType: { is: "Resolved" }`. |
| **Latest creations (historical)** | Use *Latest market creations* query. |
| **Latest resolutions** | Use *Latest market resolutions* query. |

For trades on outcome tokens, see [Prediction Market Trades API](../prediction-trades-api). For settlements (split, merge, redemption), see [Prediction Market Settlements API](../prediction-settlements-api).
