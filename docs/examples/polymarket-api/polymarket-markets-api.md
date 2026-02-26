---
title: "Polymarket Markets API - Filter by Slug, Condition & Token"
description: "Find Polymarket markets using market slug, event slug, condition ID, and token ID filters. Query markets with multiple filter options for integration with trades and settlements."
keywords:
  - Polymarket Markets API
  - Polymarket market slug
  - Polymarket event slug
  - condition ID Polymarket
  - token ID filter
  - prediction market filters
  - Polymarket market search
  - filter markets by slug
---

# Markets API

Find markets on Polymarket using various filters, including **market slug**, **event slug**, **condition ID**, and **token ID**. Use these parameters to narrow results to specific markets or events when building apps that combine market metadata with [trades](https://docs.bitquery.io/docs/examples/prediction-market/prediction-trades-api/) and [settlements](https://docs.bitquery.io/docs/examples/prediction-market/prediction-settlements-api/).

**Network:** Polygon (`network: matic`). For full lifecycle and trade data, see the [Polymarket API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-api/) overview and the [Prediction Market API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-market-api/).

---

## Filter parameters

All parameters are optional. You can combine multiple filters; results match markets that satisfy the criteria you provide.

| Parameter        | Type     | Description                                                         |
| ---------------- | -------- | ------------------------------------------------------------------- |
| **market_slug**  | string[] | Filter markets by market slug(s). Can provide multiple values.      |    |
| **condition_id** | string[] | Filter markets by condition ID(s). Can provide multiple values.     |
| **token_id**     | string[] | Filter markets by outcome token ID(s). Can provide multiple values. |



## Find markets by condition_id

Use when you have on-chain condition IDs (e.g. from [Main Polymarket Contract](https://docs.bitquery.io/docs/examples/polymarket-api/main-polymarket-contract/) events). Condition IDs are hex strings; you can pass one or more.

Get market lifecycle events (created/resolved) for one or more condition IDs. Condition IDs are hex strings (with or without `0x`). [Run Query](https://ide.bitquery.io/Filter-markets-by-condition-ID-Polymarket)

```graphql
query MarketsByConditionId($conditionIds: [String!]) {
  EVM(network: matic) {
    PredictionManagements(
      limit: { count: 50 }
      orderBy: { descending: Block_Time }
      where: {
        Management: {
          Prediction: {
            Condition: { Id: { in: $conditionIds } }
            Marketplace: { ProtocolName: { is: "polymarket" } }
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
  "conditionIds": [
    "0x4567b275e6b667a6217f5cb4f06a797d3a1eaf1d0281fb5bc8c75e2046ae7e57"
  ]
}
```


## Find markets by token_id (AssetId)

Use when you have outcome token IDs (e.g. from [Prediction Trades](https://docs.bitquery.io/docs/examples/prediction-market/prediction-trades-api/) `OutcomeToken.AssetId`). Pass one or more AssetIds.

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

## Find markets by market_slug

Filter by market slug or keyword using **Question.Title** with case-insensitive match. Use the URL slug (e.g. `bitcoin-up-or-down-july-25-8pm-et`) or a keyword (e.g. `XRP`).

[Run query](https://ide.bitquery.io/Find-Markets-by-market_slug-on-Polymarket)

```graphql
query MarketsByMarketSlug($marketSlug: String!) {
  EVM(network: matic) {
    PredictionManagements(
      limit: { count: 50 }
      orderBy: { descending: Block_Time }
      where: {
        Management: {
          Prediction: {
            Question: { Title: { includesCaseInsensitive: $marketSlug } }
            Marketplace: { ProtocolName: { is: "polymarket" } }
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
  "marketSlug": "bitcoin-up-or-down-july-25-8pm-et"
}
```



### Combined filters (condition_id + time range)

Combine **condition_id** with other filters such as a time window or event type in the same `where` clause.

You can combine **condition_id** with other filters (e.g. time range, event type) in the same `where` clause.

```graphql
query MarketsByConditionIdRecent($conditionIds: [String!]) {
  EVM(network: matic) {
    PredictionManagements(
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
      where: {
        Block: { Time: { since_relative: { days_ago: 7 } } }
        Management: {
          Prediction: {
            Condition: { Id: { in: $conditionIds } }
            Marketplace: { ProtocolName: { is: "polymarket" } }
          }
        }
      }
    ) {
      Block {
        Time
      }
      Management {
        EventType
        Prediction {
          Condition {
            Id
          }
          Question {
            MarketId
            Title
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

**Variables (example):**

```json
{
  "conditionIds": [
    "0x4567b275e6b667a6217f5cb4f06a797d3a1eaf1d0281fb5bc8c75e2046ae7e57"
  ]
}
```

---

## Related APIs

| Need                             | API                                                                                                                                                 |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Trades & prices**              | [Prediction Trades API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-trades-api/)                                                                                 |
| **Settlements & redemptions**    | [Prediction Settlements API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-settlements-api/)                                                                       |
| **Market creation & resolution** | [Prediction Market API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-market-api/) / [Prediction Managements API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-managements-api/) |
| **Polymarket overview**          | [Polymarket API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-api/)                                                                                                                  |
| **User & wallet activity**       | [Polymarket Wallet & User Activity API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-wallet-api/)                                                                                     |
| **On-chain condition & tokens**  | [Main Polymarket Contract](https://docs.bitquery.io/docs/examples/polymarket-api/main-polymarket-contract/)                                                   |
