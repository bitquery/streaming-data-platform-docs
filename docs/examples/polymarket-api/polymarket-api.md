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

Follow the steps here: [How to generate Bitquery API token ➤](../../authorisation/how-to-generate/)
:::

---

## Start Here: Choose Your Path

### **Working with Trades & Prices?**
Use the **[Prediction Trades API](../prediction-market/prediction-trades-api)** — query buy/sell activity, track prices, and monitor volume across Polymarket.

[→ Prediction Trades API](../prediction-market/prediction-trades-api)

### **Tracking Positions & Redemptions?**
Use the **[Prediction Settlements API](../prediction-market/prediction-settlements-api)** — query splits, merges, and redemptions after market resolution.

[→ Prediction Settlements API](../prediction-market/prediction-settlements-api)

### **Need Market Lifecycle Data?**
Use the **[Prediction Market API](../prediction-market/prediction-market-api)** — query market creation, resolution, and complete lifecycle events.

[→ Prediction Market API](../prediction-market/prediction-market-api)

### **Need Real-Time Streaming?**
Use **Kafka Streams** for ultra-low-latency Polymarket data. Subscribe to trades, settlements, and market events as they happen.

Available Kafka topics:
- `matic.predictions.proto` — Raw prediction market events
- `matic.broadcasted.predictions.proto` — Mempool prediction market data

Note: Kafka streaming requires separate credentials. [Contact support](https://t.me/bloxy_info) or email support@bitquery.io for access.

[→ Kafka Streams Documentation](../../streams/kafka-streaming-concepts)

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
        TransactionStatus: {Success: true}
        Trade: {Prediction: {Marketplace: {ProtocolName: {is: "polymarket"}}}}
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
      Block { Time }
      Transaction { Hash }
      Trade {
        AmountInUSD
        PriceInUSD
        Side {
          Type
          Amount
          Currency { Symbol }
        }
        Currency { Symbol }
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
          Time: {
            since: "2024-01-01T00:00:00Z"
            till: "2024-01-31T23:59:59Z"
          }
        }
        Trade: { Dex: { ProtocolName: { is: "polymarket" } } }
      }
    ) {
      Block { Time }
      Transaction { Hash }
      Trade {
        AmountInUSD
        PriceInUSD
      }
    }
  }
}
```

### Trades for Specific Market/Asset

Filter trades by specific position token IDs:

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
          Dex: { ProtocolName: { is: "polymarket" } }
        }
      }
    ) {
      Block { Time }
      Transaction { Hash }
      Trade {
        AmountInUSD
        PriceInUSD
        Side {
          Amount
          Currency { Symbol }
        }
      }
    }
  }
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
      Block { Time }
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

Find the most active markets:

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

---

## Complete Workflow: Get All Market Data

Learn how to query all Polymarket market data including prices, trades, metadata, and token holders step-by-step.

### Step 1: Get Market Metadata (Question Information)

Query `QuestionInitialized` events to get market metadata:

```graphql
{
  EVM(dataset: realtime, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {
        Arguments: {
          includes: {
            Name: {is: "questionID"}
          }
        }
        Log: {Signature: {Name: {in: ["QuestionInitialized"]}}}
        LogHeader: {Address: {is: "0x65070BE91477460D8A7AeEb94ef92fe056C2f2A7"}}
      }
      limit: {count: 10}
    ) {
      Block { Time Number }
      Transaction { Hash }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
        }
      }
    }
  }
}
```

**What you get:**
- `questionID`: Question identifier
- `ancillaryData`: Hex-encoded market metadata (needs decoding)
- `creator`: Market creator address
- `requestTimestamp`: When the question was created

### Step 2: Get Condition Information

Query condition details by condition ID:

```graphql
{
  EVM(dataset: realtime, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {
        Arguments: {
          includes: {
            Name: {is: "conditionId"}
          }
        }
        Log: {Signature: {Name: {in: ["ConditionPreparation"]}}}
        LogHeader: {Address: {is: "0x4d97dcd97ec945f40cf65f87097ace5ea0476045"}}
      }
      limit: {count: 1}
    ) {
      Block { Time Number }
      Transaction { Hash }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
        }
      }
    }
  }
}
```

**What you get:**
- `conditionId`: Condition identifier
- `questionId`: Links to UMA question
- `oracle`: Oracle address for resolution
- `outcomeSlotCount`: Number of possible outcomes

### Step 3: Get Trading Pairs

Get trading pair information from `TokenRegistered` events:

```graphql
{
  EVM(dataset: realtime, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {
        Arguments: {
          includes: {
            Name: {is: "conditionId"}
          }
        }
        Log: {Signature: {Name: {in: ["TokenRegistered"]}}}
        LogHeader: {
          Address: {
            in: [
              "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E",
              "0xC5d563A36AE78145C45a50134d48A1215220f80a"
            ]
          }
        }
      }
      limit: {count: 10}
    ) {
      Block { Time Number }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
        }
      }
    }
  }
}
```

**What you get:**
- `conditionId`: Links to market condition
- `token0`: First token in pair (YES outcome token)
- `token1`: Second token in pair (NO outcome or USDC)

### Step 4: Get Trading Activity

Query trading activity for specific markets:

```graphql
{
  EVM(network: matic) {
    DEXTradeByTokens(
      orderBy: {descending: Block_Time}
      limit: {count: 50}
      where: {
        TransactionStatus: {Success: true}
        Trade: {
          Dex: {ProtocolName: {is: "polymarket"}}
        }
      }
    ) {
      Block { Time }
      Transaction { Hash }
      Trade {
        AmountInUSD
        PriceInUSD
        Side {
          Type
          Amount
          Currency { Symbol SmartContract }
        }
      }
    }
  }
}
```

**Calculate Prices:**
- If taker asset is USDC and maker asset is YES token: **Price(YES) = takerAmount / makerAmount**
- If maker asset is USDC: **Price(YES) = makerAmount / takerAmount**
- **Price(NO) = 1 - Price(YES)**

### Step 5: Get Market Resolution Status

Check if market has been resolved:

```graphql
{
  EVM(dataset: realtime, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {
        Arguments: {
          includes: {
            Name: {is: "conditionId"}
          }
        }
        Log: {Signature: {Name: {in: ["ConditionResolution"]}}}
        LogHeader: {Address: {is: "0x4d97dcd97ec945f40cf65f87097ace5ea0476045"}}
      }
      limit: {count: 1}
    ) {
      Block { Time }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
        }
      }
    }
  }
}
```

**Resolution Status:**
- If query returns results → market is **resolved**
- If no results → market is **open** or **pending**

### Step 6: Get Payout Redemptions

Query payout redemption events for resolved markets:

```graphql
{
  EVM(dataset: realtime, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {
        Arguments: {
          includes: {
            Name: {is: "conditionId"}
          }
        }
        Log: {Signature: {Name: {in: ["PayoutRedemption"]}}}
        LogHeader: {Address: {is: "0x4d97dcd97ec945f40cf65f87097ace5ea0476045"}}
      }
      limit: {count: 1000}
    ) {
      Block { Time }
      Transaction { Hash }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
        }
      }
    }
  }
}
```

**What you get:**
- `redeemer`: Address that redeemed payouts
- `collateralToken`: Collateral token address
- `payout`: Amount of collateral redeemed



## Deep Dives by Contract

For contract-level details and advanced queries:

- **[Main Polymarket Contract](./main-polymarket-contract)** — Market creation, token minting, redemptions
- **[CTF Exchange](./polymarket-ctf-exchange)** — Order events and raw trading data
- **[UMA Adapter](./uma-adapter-contract)** — Oracle integration and resolution data

---

## Support

For questions and technical support:
- [Bitquery Telegram](https://t.me/bloxy_info)
- [Polymarket Docs](https://docs.polymarket.com/)
- [UMA Oracle Docs](https://docs.umaproject.org/)
