---
title: "Prediction Market Settlements API"
description: "Query prediction market settlements: real-time streams, latest settlements, redemptions, whale activity, top winners, and top market questions. Split, merge, and redemption events on Polygon (Polymarket and more)."
keywords:
  - PredictionSettlements
  - prediction market settlements API
  - Polymarket settlements
  - Split Merge Redemption
  - prediction market redemptions
  - outcome token redemption
  - Polygon prediction markets
  - conditional tokens settlement
  - market resolution payouts
  - prediction market analytics
  - Bitquery GraphQL prediction
---

# Prediction Market Settlements API

The **PredictionSettlements** API returns **Split**, **Merge**, and **Redemption** events for prediction markets (e.g. Polymarket) on Polygon. Use it to stream live settlements, list latest activity, count events by type, find large redemptions (whales), and rank top winners or top markets by redeemed amount.

**Network:** Polygon (`network: matic`). Part of the [Prediction Market API](/docs/examples/prediction-market/prediction-market-api) lifecycle (Management → Trades → **Settlement**).

### Event types

| EventType   | Description |
| ----------- | ----------- |
| **Split**   | Collateral converted into outcome tokens (minting). |
| **Merge**   | Outcome tokens converted back to collateral. |
| **Redemption** | After resolution: winning outcome tokens redeemed for collateral (payout). |

---

## Key fields

- **Settlement.EventType** — `"Split"`, `"Merge"`, or `"Redemption"`.
- **Settlement.OutcomeTokenIds** — Token IDs from the condition. **Split/Merge:** all outcome token IDs; **Redemption:** typically all (redeemer holds winning outcome).
- **Settlement.Amounts** — **Amount** (outcome token amount), **CollateralAmount**, **AmountInUSD**, **CollateralAmountInUSD**.
- **Settlement.Holder** — Address that receives or sends tokens/collateral.
- **Settlement.Prediction.CollateralToken** — Collateral token (e.g. USDC): Name, Symbol, AssetId, SmartContract.
- **Settlement.Prediction.Question** — **Title**, MarketId, Id, Image, ResolutionSource, CreatedAt. Use **Title** to filter by market (e.g. specific question).
- **Settlement.Prediction.Outcome** — Id, Index, Label (winning outcome on Redemption).
- **Settlement.Prediction.Marketplace** — ProtocolName, ProtocolFamily, SmartContract.
- **Settlement.Prediction.OutcomeToken** — Outcome token contract: Name, Symbol, AssetId, SmartContract.

---

## Real-time settlement stream

Subscribe to live Split, Merge, and Redemption events as they occur on Polygon.

[Run in Bitquery IDE](https://ide.bitquery.io/realtime-predicion-market-settlements-stream)

```graphql
subscription PredictionSettlementsStream {
  EVM(network: matic) {
    PredictionSettlements {
      Block {
        Time
      }
      Log {
        Signature {
          Name
        }
        SmartContract
      }
      Settlement {
        Amounts {
          Amount
          AmountInUSD
          CollateralAmount
          CollateralAmountInUSD
        }
        EventType
        Holder
        OutcomeTokenIds
        Prediction {
          CollateralToken {
            Name
            Symbol
            AssetId
            SmartContract
          }
          ConditionId
          OutcomeToken {
            Name
            Symbol
            AssetId
            SmartContract
          }
          Marketplace {
            SmartContract
            ProtocolFamily
            ProtocolName
          }
          Question {
            Title
            MarketId
            ResolutionSource
            Image
            CreatedAt
            Id
          }
          Outcome {
            Id
            Index
            Label
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

---

## Latest settlements (historical)

Fetch the most recent settlements with full details, ordered by block time.

[Run in Bitquery IDE](https://ide.bitquery.io/latest-prediction-market-settlements_2)

```graphql
query LatestPredictionSettlements {
  EVM(network: matic) {
    PredictionSettlements(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Log {
        Signature {
          Name
        }
        SmartContract
      }
      Settlement {
        Amounts {
          Amount
          AmountInUSD
          CollateralAmount
          CollateralAmountInUSD
        }
        EventType
        Holder
        OutcomeTokenIds
        Prediction {
          CollateralToken {
            Name
            Symbol
            AssetId
            SmartContract
          }
          ConditionId
          OutcomeToken {
            Name
            Symbol
            AssetId
            SmartContract
          }
          Marketplace {
            SmartContract
            ProtocolFamily
            ProtocolName
          }
          Question {
            Title
            MarketId
            ResolutionSource
            Image
            CreatedAt
            Id
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

---

## Redemption / Merge / Split count (last 1 hour)

Count how many settlement events occurred in the last hour, grouped by event signature (Split, Merge, Redemption).

[Run in Bitquery IDE](https://ide.bitquery.io/redemptions-merge-split-count-in-last-1-hour)

```graphql
query RedemptionsMergeSplitCount {
  EVM(network: matic) {
    PredictionSettlements(
      where: { Block: { Time: { since_relative: { hours_ago: 1 } } } }
    ) {
      count
      Log {
        Signature {
          Name
        }
      }
    }
  }
}
```

---

## Latest whale settlements (large redemptions)

Find the most recent high-value redemptions (e.g. amount ≥ 10,000 in outcome token units). Useful for tracking large payouts and whale activity.

[Run in Bitquery IDE](https://ide.bitquery.io/latest-whale-settlements-on-prediction-market_1)

```graphql
query LatestWhaleSettlements {
  EVM(network: matic) {
    PredictionSettlements(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: {
        Settlement: {
          EventType: { is: "Redemption" }
          Amounts: { Amount: { ge: "10000" } }
        }
      }
    ) {
      Block {
        Time
      }
      Log {
        Signature {
          Name
        }
        SmartContract
      }
      Settlement {
        Amounts {
          Amount
          AmountInUSD
          CollateralAmount
          CollateralAmountInUSD
        }
        EventType
        Holder
        OutcomeTokenIds
        Prediction {
          CollateralToken {
            Name
            Symbol
            AssetId
            SmartContract
          }
          ConditionId
          OutcomeToken {
            Name
            Symbol
            AssetId
            SmartContract
          }
          Marketplace {
            SmartContract
            ProtocolFamily
            ProtocolName
          }
          Question {
            Title
            MarketId
            ResolutionSource
            Image
            CreatedAt
            Id
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

---

## Top 10 winners of a specific market question

Rank holders by total redeemed amount for one market (filter by question title). Replace the title with your market question.

[Run in Bitquery IDE](https://ide.bitquery.io/top-10-winners-of-a-market-question)

```graphql
query TopWinnersByMarketQuestion {
  EVM(network: matic) {
    PredictionSettlements(
      limit: { count: 10 }
      orderBy: { descendingByField: "redeemed_amount" }
      where: {
        Block: { Time: { since_relative: { hours_ago: 1 } } }
        Settlement: {
          EventType: { is: "Redemption" }
          Prediction: {
            Question: {
              Title: {
                is: "Bitcoin Up or Down - February 17, 3:00AM-3:15AM ET"
              }
            }
          }
        }
      }
    ) {
      Settlement {
        Holder
      }
      redeemed_amount: sum(of: Settlement_Amounts_Amount)
    }
  }
}
```

---

## Top 10 market questions by redeemed amount (last 1 hour)

Aggregate redemptions by market question and sort by total redeemed amount. Use this to see which markets had the most payout activity recently.

[Run in Bitquery IDE](https://ide.bitquery.io/top-10-market-questions-in-last-1-hour_1)

```graphql
query TopMarketQuestionsByRedeemedAmount {
  EVM(network: matic) {
    PredictionSettlements(
      limit: { count: 10 }
      orderBy: { descendingByField: "redeemed_amount" }
      where: {
        Block: { Time: { since_relative: { hours_ago: 1 } } }
        Settlement: { EventType: { is: "Redemption" } }
      }
    ) {
      Settlement {
        Prediction {
          Question {
            Title
          }
          Outcome {
            Label
          }
        }
      }
      redeemed_amount: sum(of: Settlement_Amounts_Amount)
    }
  }
}
```

---

## Top 10 redeemers (last 1 hour)

Rank addresses by total amount redeemed in the last hour across all markets. Useful for leaderboards and whale tracking.

[Run in Bitquery IDE](https://ide.bitquery.io/top-10-redeemers)

```graphql
query TopRedeemers {
  EVM(network: matic) {
    PredictionSettlements(
      limit: { count: 10 }
      orderBy: { descendingByField: "redeemed_amount" }
      where: {
        Block: { Time: { since_relative: { hours_ago: 1 } } }
        Settlement: { EventType: { is: "Redemption" } }
      }
    ) {
      Settlement {
        Holder
      }
      redeemed_amount: sum(of: Settlement_Amounts_Amount)
    }
  }
}
```

---

## Use cases

| Use case | Approach |
| -------- | -------- |
| **Live settlement feed** | Use the real-time subscription above. |
| **Recent activity** | Use *Latest settlements* with `limit` and `orderBy: { descending: Block_Time }`. |
| **Volume by event type** | Use *Redemption/Merge/Split count* with a time window. |
| **Large payouts** | Use *Latest whale settlements* with `Amounts.Amount: { ge: "..." }` and `EventType: Redemption`. |
| **Winners for one market** | Use *Top 10 winners of a market question* with `Question.Title: { is: "..." }`. |
| **Hottest markets by redemptions** | Use *Top 10 market questions by redeemed amount*. |
| **Top redeemers** | Use *Top 10 redeemers* (optionally change `hours_ago` or add more filters). |

For market creation and resolution events, see [PredictionManagements](/docs/examples/prediction-market/prediction-market-api#predictionmanagements). For trades, see [PredictionTrades](/docs/examples/prediction-market/prediction-market-api#predictiontrades-recent-buys).
