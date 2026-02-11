---
title: "Prediction Market API"
description: "Universal prediction market API: query market lifecycle, trades, and settlements across chains. Polymarket and more; additional EVM chains coming soon."
keywords:
  - prediction market API
  - Polymarket API
  - prediction market GraphQL
  - PredictionManagements
  - PredictionTrades
  - PredictionSettlements
  - multi-chain prediction markets
  - Polygon prediction markets
  - conditional tokens
  - market resolution
  - outcome tokens
---

# Prediction Market API

The **Prediction Market API** is a **universal** API for querying **market lifecycle events**, **trades**, and **settlements** across prediction markets (e.g. Polymarket). Use it to filter by question title, event type, outcome, collateral token, and more. **Additional EVM chains will be supported soon**; query the cube under `EVM(network: ...)` for the chain you need.

## Cubes overview

| Cube                      | Use case                                                  |
| ------------------------- | --------------------------------------------------------- |
| **PredictionManagements** | Market creation and resolution events (Created, Resolved) |
| **PredictionTrades**      | Buy/sell outcome tokens (taker/maker, amounts, outcome)   |
| **PredictionSettlements** | Split, merge, and redemption of outcome tokens            |

**Networks:** Currently **Polygon** (`network: matic`). More EVM chains coming soon.

This is a **universal** prediction market API: the same cubes and fields work across supported chains. Use `EVM(network: matic)` for Polygon today; more chains will be added over time.

For contract-level and event-based Polymarket data (e.g. OrderFilled, ConditionResolution), see the [Polymarket API](../polymarket-api/polymarket-api) docs.

## PredictionManagements

Market creation and resolution (Created, Resolved). Filter by question title, event type, and prediction metadata.

```graphql
query PredictionManagements {
  EVM(network: matic) {
    PredictionManagements(
      limit: { count: 10 }
      orderBy: { descending: Transaction_Time }
      where: {
        Management: {
          Prediction: { Question: { Title: { includes: "Bitcoin" } } }
          EventType: { in: ["Created", "Resolved"] }
        }
      }
    ) {
      Transaction {
        Hash
        Time
      }
      Block {
        Number
      }
      Management {
        Description
        EventType
        Prediction {
          CollateralToken {
            Name
            Symbol
            Decimals
          }
          Condition {
            Id
            QuestionId
            Outcomes {
              Id
              Label
            }
          }
          Marketplace {
            ProtocolName
          }
          Question {
            CreatedAt
            Id
            Image
            MarketId
            ResolutionSource
            Title
          }
          Outcome {
            Id
            Index
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

### Key fields

- **Management.EventType** — `"Created"` or `"Resolved"`.
- **Management.Prediction.Question** — Title, MarketId, Id, Image, ResolutionSource, CreatedAt. **Title** is useful for filtering (e.g. by keyword like "Bitcoin"). **MarketId** links to full info: `https://gamma-api.polymarket.com/markets/{MarketId}`.

- **Management.Prediction.Condition** — Id, QuestionId, **Outcomes** (all possible outcomes; usually two: Id, Label).
- **Management.Prediction.Outcome** / **OutcomeToken** — For **Resolved**: winning outcome token Id/AssetId; for **Created**: often empty.
- **Management.Prediction.CollateralToken** — Name, Symbol (e.g. USDC), Decimals.
- **Management.Prediction.Marketplace** — ProtocolName.

## PredictionTrades (Recent Buys)

Buy/sell activity on outcome tokens: taker/maker (Buyer/Seller), amounts, and whether the trade is a buy or sell of the outcome.

```graphql
query PredictionTrades {
  EVM(network: matic) {
    PredictionTrades(
      limit: { count: 10 }
      where: { Trade: { OutcomeTrade: { IsOutcomeBuy: true } } }
      orderBy: { descending: Transaction_Time }
    ) {
      Transaction {
        Hash
        Time
      }
      Block {
        Hash
      }
      Trade {
        Prediction {
          CollateralToken {
            Decimals
            Name
            SmartContract
            Symbol
          }
          ConditionId
          Marketplace {
            ProtocolName
          }
          Outcome {
            Label
            Id
            Index
          }
          Question {
            MarketId
            CreatedAt
            Id
            Image
            Title
          }
          OutcomeToken {
            Decimals
            ProtocolName
            AssetId
          }
        }
        OutcomeTrade {
          Amount
          Buyer
          Seller
          CollateralAmount
          IsOutcomeBuy
        }
      }
    }
  }
}
```

### Key fields

- **Trade.OutcomeTrade.IsOutcomeBuy** — `true`: taker (Buyer) pays USDC (collateral), maker (Seller) gives outcome tokens. `false`: maker pays USDC, taker gives outcome tokens.
- **Trade.OutcomeTrade** — Amount, Buyer (taker), Seller (maker), CollateralAmount.
- **Trade.Prediction.Question** — MarketId (full info: `https://gamma-api.polymarket.com/markets/{MarketId}`), Title, Id, Image, CreatedAt.
- **Trade.Prediction.Outcome** — Label, Id (tokenId), Index (index in Condition.Outcomes; see PredictionManagements).
- **Trade.Prediction.CollateralToken** — Token used to pay for the outcome (e.g. USDC): Symbol, Name, Decimals, SmartContract.
- **Trade.Prediction.OutcomeToken** — Outcome as a token: AssetId, Decimals, ProtocolName.

---

## PredictionSettlements

Split, merge, and redemption of outcome tokens (minting, merging positions, redeeming after resolution).

```graphql
query PredictionSettlements {
  EVM(network: matic) {
    PredictionSettlements(
      limit: { count: 10 }
      orderBy: { descending: Transaction_Time }
      where: {
        Settlement: {
          EventType: { in: ["Split", "Merge", "Redemption"] }
          Prediction: { CollateralToken: { Symbol: { not: "USDC" } } }
        }
      }
    ) {
      Transaction {
        Hash
        Time
      }
      Block {
        Number
      }
      Settlement {
        Holder
        Amounts {
          Amount
          CollateralAmount
        }
        EventType
        OutcomeTokenIds
        Prediction {
          CollateralToken {
            Name
            Symbol
            Decimals
          }
          ConditionId
          Marketplace {
            ProtocolName
            SmartContract
          }
          OutcomeToken {
            Decimals
            SmartContract
          }
          Question {
            CreatedAt
            Id
            Image
            MarketId
            Title
            ResolutionSource
          }
        }
      }
    }
  }
}
```

### Key fields

- **Settlement.EventType** — `"Split"`, `"Merge"`, or `"Redemption"`.
- **Settlement.OutcomeTokenIds** — Token IDs from Condition.Outcomes. **Split/Merge:** all possible outcome token IDs; **Redemption:** usually all possible values.
- **Settlement.Amounts** — Amount, CollateralAmount.
- **Settlement.Holder** — Address that receives or sends.
- **Settlement.Prediction.CollateralToken** — Token used: for **Split** the sender gives this for OutcomeTokenIds; for **Merge/Redemption** they receive it. Symbol can be e.g. `"USDC"` or `"WCOL"`.
- **Settlement.Prediction.Question** — MarketId, Title, Id, Image, ResolutionSource, CreatedAt.
- **Settlement.Prediction.OutcomeToken** — Outcome token contract; AssetId is typically empty here.
