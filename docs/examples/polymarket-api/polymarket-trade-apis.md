---
title: Polymarket Trade APIs
description: Comprehensive guide to Polymarket trading APIs using Bitquery's DEXTradeByTokens cube. Access real-time and historical trade data, streaming updates, and market analytics for Polymarket's prediction markets on Polygon network with USDC trades.
keywords:
  - Polymarket API
  - DEXTradeByTokens
  - Prediction markets
  - Polymarket trades
  - Real-time trading data
  - Polygon blockchain
  - USDC trades
  - Bitquery API
  - Prediction market analytics
  - Polymarket streaming
  - DEX trading data
  - Market data API
  - Trading analytics
  - Prediction market trading
sidebar_position: 5
---

# Polymarket Trade APIs

This guide covers Polymarket trade APIs on Bitquery: real-time and historical trade data, streaming, and market analytics for Polymarket on Polygon (USDC). You can use the unified [Prediction Market API](/docs/examples/prediction-market/prediction-market-api) for real-time data.

## Real-Time Trade Streaming

Subscribe to live Polymarket trades as they happen. Use **PredictionTrades** with a Polymarket filter for real-time updates and rich fields (question title, MarketId, outcome labels, buyer/seller).

**Try it live:** [Polymarket Trades Stream](https://ide.bitquery.io/Polymarket-trade-stream)

```graphql
subscription PredictionTradesStream {
  EVM(network: matic) {
    PredictionTrades(
      where: {TransactionStatus: {Success: true}, Trade: {Prediction: {Marketplace: {ProtocolName: {is: "polymarket"}}}}}
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

## Historical Trade Queries (Polygon APIs)

Use **DEXTradeByTokens** when you need **historical** Polymarket data (date ranges, backtests, aggregations). For real-time or recent trades with rich prediction fields (Question, MarketId, Outcome), use [PredictionTrades with a Polymarket filter](/docs/examples/prediction-market/prediction-trades-api#polymarket-only-filter) instead.

### Get latest trades (historical)

Retrieve the most recent Polymarket trades with pagination. Uses **DEXTradeByTokens** for full historical access.

**Try it live:** [Polymarket Trades API](https://ide.bitquery.io/Polymarket-trade-stream)

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
      Block { Time }
      Transaction { Hash }
      Trade {
        Dex { OwnerAddress ProtocolFamily ProtocolName }
        AmountInUSD
        Amount
        PriceInUSD
        Side {
          Type
          Amount
          AmountInUSD
          Currency { Symbol SmartContract Name }
        }
        Ids
        OrderId
        Currency { Symbol SmartContract Name }
      }
    }
  }
}
```

### Filter by time range

```graphql
{
  EVM(network: matic) {
    DEXTradeByTokens(
      orderBy: { descending: Block_Time }
      limit: { count: 100 }
      where: {
        TransactionStatus: { Success: true }
        Block: {
          Time: {
            since: "2024-01-01T00:00:00Z"
            till: "2024-01-31T23:59:59Z"
          }
        }
        Trade: {
          Dex: { ProtocolName: { is: "polymarket" } }
          # Add other filters as needed
        }
      }
    ) {
      # ... same fields as above
    }
  }
}
```

## Specific Asset Trading

### Trades for Specific Market/Condition

Filter trades by specific position token IDs to track activity for particular prediction markets.

**Try it live:** [Polymarket Trades for Specific Asset](https://ide.bitquery.io/polymarket-trades-api-for-specific-asset-id_1)

```graphql
{
  EVM(network: matic) {
    DEXTradeByTokens(
      orderBy: { descending: Block_Time }
      limit: { count: 100 }
      where: {
        TransactionStatus: { Success: true }
        Trade: {
          Ids: {
            includes: {
              in: ["56913537276977443440562201098597093132803911231987825986901262729097468643752"]
            }
          }
          Side: {
            Currency: {
              SmartContract: {
                is: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174"
              }
            }
          }
          Dex: { ProtocolName: { is: "polymarket" } }
        }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Trade {
        Dex {
          OwnerAddress
          ProtocolFamily
          ProtocolName
        }
        AmountInUSD
        Amount
        PriceInUSD
        Side {
          Type
          Amount
          AmountInUSD
          Currency {
            Symbol
            SmartContract
            Name
          }
          Ids
          OrderId
        }
        Currency {
          Symbol
          SmartContract
          Name
        }
        Ids
        OrderId
      }
    }
  }
}
```

### Finding Position Token IDs

To get trades for specific markets, you need the position token IDs. You can find these by:

1. **Using the CTF Exchange API** to query `TokenRegistered` events
2. **Using the Main Contract API** to query `ConditionPreparation` events
3. **Checking Polymarket's market data** for condition IDs, then deriving position tokens

Example: Convert condition ID to position token IDs using this formula:
- Position 0 (NO): `keccak256(abi.encodePacked(conditionId, 0))`
- Position 1 (YES): `keccak256(abi.encodePacked(conditionId, 1))`

## Advanced Filtering

### Filter by Trade Size

```graphql
{
  EVM(network: matic) {
    DEXTradeByTokens(
      where: {
        Trade: {
          AmountInUSD: { ge: "100" }  # Trades over $100
          Dex: { ProtocolName: { is: "polymarket" } }
        }
      }
    ) {
      # ... fields
    }
  }
}
```

### Filter by Order Side

```graphql
{
  EVM(network: matic) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Side: { Type: { is: "BUY" } }  # Only buy orders
          Dex: { ProtocolName: { is: "polymarket" } }
        }
      }
    ) {
      # ... fields
    }
  }
}
```

## Aggregation and Analytics

### Volume by Hour

```graphql
{
  EVM(network: matic, date: "2024-01-15") {
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

```graphql
{
  EVM(network: matic) {
    DEXTradeByTokens(
      orderBy: { descending: sum_of_Trade_AmountInUSD }
      limit: { count: 10 }
      where: {
        Block: { Time: { since: "2024-01-01" } }
        Trade: { Dex: { ProtocolName: { is: "polymarket" } } }
      }
    ) {
      Trade {
        Ids
      }
      sum(of: Trade_AmountInUSD)
      count
    }
  }
}
```

## Choosing the right API (advanced)

You can access Polymarket trade data through two APIs. Use this when you need something beyond the [real-time stream](#real-time-trade-streaming) or [historical DEXTradeByTokens](#historical-trade-queries-dextradebytokens) examples above.

| Need | Use | Cube | Historical? |
|------|-----|------|-------------|
| **Real-time stream** or **recent trades** with Question, MarketId, Outcome, Buyer/Seller | [Prediction Market Trades API](/docs/examples/prediction-market/prediction-trades-api) | `EVM` → `PredictionTrades` with `Trade.Prediction.Marketplace.ProtocolName: { is: "polymarket" }` | Recent/live only today; we may add historical data in the future |
| **Historical trades**, date ranges, backtests, volume by hour, top markets | DEXTradeByTokens (this page) | `EVM` → `DEXTradeByTokens` with `Trade.Dex.ProtocolName: { is: "polymarket" }` | **Yes** — full history |

- **PredictionTrades**: Best for live streams and recent activity with rich prediction fields. Today it does not provide deep historical data; for full history use DEXTradeByTokens below. We may add Prediction Market historical data in the future.
- **DEXTradeByTokens**: Use for historical Polymarket trade data, time-range queries, and aggregations (e.g. volume by hour, top markets by volume).

## Related Documentation

- [Prediction Market Trades API](/docs/examples/prediction-market/prediction-trades-api) — real-time and recent Polymarket trades with Question, MarketId, Outcome (use filter `ProtocolName: { is: "polymarket" }`);
- [Polymarket CTF Exchange API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-ctf-exchange)
- [Polymarket Market Data API](https://docs.bitquery.io/docs/examples/polymarket-api/get-market-data)
- [UMA Adapter Contract API](https://docs.bitquery.io/docs/examples/polymarket-api/uma-adapter-contract)
- [DEXTradeByTokens Schema Reference](https://docs.bitquery.io/docs/graphql-reference/objects/DEXTradeByTokens)

## Support

For questions or issues:
- [Bitquery Documentation](https://docs.bitquery.io)
- [Polymarket Documentation](https://docs.polymarket.com)
- [Bitquery IDE](https://ide.bitquery.io)
