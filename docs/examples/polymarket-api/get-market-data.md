---
title: "How to Get All Data for a Specific Polymarket Market - Complete Guide"
description: "Step-by-step guide: How to get all Polymarket market data including metadata, prices, trades, token holders. Learn how to query by condition ID, question ID, or market ID using GraphQL APIs."
keywords:
  - how to get Polymarket market data
  - Polymarket market data API
  - get Polymarket market by ID
  - Polymarket condition ID query
  - Polymarket question ID query
  - Polymarket market analytics
  - condition ID
  - question ID
  - market ID
  - Polymarket trading data
  - Polymarket market metadata
  - query Polymarket by condition
  - Polymarket complete market data
---

# How to Get All Data for a Specific Polymarket Market - Complete Guide

Learn how to query all Polymarket market data including prices, trades, metadata, and token holders. This step-by-step guide shows you how to get complete market information using condition ID, question ID, or market ID.

## Overview

To get all data for a specific Polymarket market, you'll need to query multiple contracts and events. The data is distributed across:

- **Main Polymarket Contract**: Market creation, position splits, resolution
- **CTF Exchange Contract**: Trading activity, token registrations
- **UMA Adapter Contract**: Market metadata (ancillaryData)

## Starting Points

You can start with any of these identifiers:

- **Condition ID**: Found in `ConditionPreparation` and `TokenRegistered` events
- **Question ID**: Found in `ConditionPreparation` events
- **Market ID**: Found in decoded `ancillaryData` from `QuestionInitialized` events

## Complete Workflow

### Step 1: Get Market Metadata (Question Information)

If you have a **Question ID**, start here to get the market metadata:

```graphql
{
  EVM(dataset: combined, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {
        Block: {
          Time: {
            since_relative: {hours_ago: 36}
          }
        }, 
        Arguments: {
          includes: {
            Name: {is: "questionID"}, 
            Value: {Bytes: {is: "QUESTION_ID_HERE"}}
          }
        }, 
        Log: {Signature: {Name: {in: ["QuestionInitialized"]}}}, 
        LogHeader: {Address: {is: "0x65070BE91477460D8A7AeEb94ef92fe056C2f2A7"}}
      }
      limit: {count: 1}
    ) {
      Block {
        Time
        Number
        Hash
      }
      Transaction {
        Hash
        From
        To
      }
      TransactionStatus {
        Success
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
        }
      }
    }
  }
}
```

**What you get:**
- `questionID`: The question identifier
- `ancillaryData`: Hex-encoded market metadata (needs decoding)
- `creator`: Market creator address
- `requestTimestamp`: When the question was created
- `reward` and `proposalBond`: Oracle reward parameters

**Decode ancillaryData** to get:
- `title`: Market question title
- `description`: Market resolution conditions
- `market_id`: Polymarket numeric market ID
- `res_data`: Payout mapping (p1, p2, p3)
- `p1`, `p2`, `p3`: Outcome labels
- `initializer`: Market creator address

See the [CTF Exchange documentation](./polymarket-ctf-exchange.md#step-4-decode-ancillary-data) for decoding instructions.

### Step 2: Get Condition Information

If you have a **Condition ID**, get the condition details:

```graphql
{
  EVM(dataset: combined, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {
        Block: {Time: {since_relative: {hours_ago: 36}}}, 
        Arguments: {
          includes: {
            Name: {is: "conditionId"}, 
            Value: {Bytes: {in: ["CONDITION_ID_HERE"]}}
          }
        }, 
        Log: {Signature: {Name: {in: ["ConditionPreparation"]}}}, 
        LogHeader: {Address: {is: "0x4d97dcd97ec945f40cf65f87097ace5ea0476045"}}
      }
      limit: {count: 1}
    ) {
      Block {
        Time
        Number
        Hash
      }
      Transaction {
        Hash
        From
        To
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
        }
      }
    }
  }
}
```

**What you get:**
- `conditionId`: The condition identifier
- `questionId`: Links to UMA question (use this for Step 1)
- `oracle`: Oracle address for resolution
- `outcomeSlotCount`: Number of possible outcomes

### Step 3: Get Trading Pairs (Token0 and Token1)

Get the trading pair information from `TokenRegistered` events:

```graphql
{
  EVM(dataset: combined, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {
        Block: {Time: {since_relative: {days_ago: 6}}},
        Arguments: {
          includes: {
            Name: {is: "conditionId"}, 
            Value: {Bytes: {is: "CONDITION_ID_HERE"}}
          }
        }, 
        Log: {Signature: {Name: {in: ["TokenRegistered"]}}}, 
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
      Block {
        Time
        Number
        Hash
      }
      Transaction {
        Hash
        From
        To
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
        }
      }
    }
  }
}
```

**What you get:**
- `conditionId`: Links to the market condition
- `token0`: First token in the trading pair (usually YES outcome token)
- `token1`: Second token in the trading pair (usually NO outcome token or USDC)

**Note**: These token addresses are the asset IDs used in trading events. If `token0` or `token1` is `0x0000000000000000000000000000000000000000`, it represents USDC collateral.

### Step 4: Get Trading Activity (OrderFilled Events)

Get all trades for this market using the token addresses from Step 3:

```graphql
{
  EVM(dataset: realtime, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {
        Block: {Time: {since_relative: {days_ago: 6}}},
        Arguments: {
          includes: {
            Value: {
              Bytes: {
                in: ["TOKEN0_ADDRESS", "TOKEN1_ADDRESS"]
              }
            }
          }
        }, 
        Log: {Signature: {Name: {in: ["OrderFilled"]}}}, 
        LogHeader: {
          Address: {
            in: [
              "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E",
              "0xC5d563A36AE78145C45a50134d48A1215220f80a"
            ]
          }
        }
      }
      limit: {count: 1000}
    ) {
      Block {
        Time
        Number
        Hash
      }
      Transaction {
        Hash
        From
        To
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
        }
      }
    }
  }
}
```

**What you get:**
- `orderHash`: Unique order identifier
- `maker`: Address that created the order
- `taker`: Address that filled the order
- `makerAssetId`: Asset ID being sold by maker
- `takerAssetId`: Asset ID being bought by taker
- `makerAmountFilled`: Amount of maker asset filled
- `takerAmountFilled`: Amount of taker asset filled
- `fee`: Trading fee

**Calculate Prices:**
- If `takerAssetId` is USDC (0x0) and `makerAssetId` is YES token: **Price (YES) = takerAmountFilled / makerAmountFilled**
- If `makerAssetId` is USDC (0x0) and `takerAssetId` is YES token: **Price (YES) = makerAmountFilled / takerAmountFilled**
- **Price (NO) = 1 - Price(YES)**

### Step 5: Get Order Matched Events

Get order matching information:

```graphql
{
  EVM(dataset: realtime, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {
        Arguments: {
          includes: {
            Value: {
              Bytes: {
                in: ["TOKEN0_ADDRESS", "TOKEN1_ADDRESS"]
              }
            }
          }
        }, 
        Log: {Signature: {Name: {in: ["OrdersMatched"]}}}, 
        LogHeader: {
          Address: {
            in: [
              "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E",
              "0xC5d563A36AE78145C45a50134d48A1215220f80a"
            ]
          }
        }
      }
      limit: {count: 1000}
    ) {
      Block {
        Time
        Number
        Hash
      }
      Transaction {
        Hash
        From
        To
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
        }
      }
    }
  }
}
```

### Step 6: Get Liquidity Data (PositionSplit Events)

Get information about liquidity provision (when users split positions):

```graphql
{
  EVM(dataset: realtime, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {
        Arguments: {
          includes: {
            Name: {is: "conditionId"}, 
            Value: {Bytes: {is: "CONDITION_ID_HERE"}}
          }
        }, 
        Log: {Signature: {Name: {in: ["PositionSplit"]}}}, 
        LogHeader: {Address: {is: "0x4d97dcd97ec945f40cf65f87097ace5ea0476045"}}
      }
      limit: {count: 1000}
    ) {
      Block {
        Time
        Number
        Hash
      }
      Transaction {
        Hash
        From
        To
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
        }
      }
    }
  }
}
```

**What you get:**
- `stakeholder`: Address that split the position
- `collateralToken`: Collateral token address (usually USDC)
- `parentCollectionId`: Parent collection identifier
- `conditionId`: Market condition identifier
- `partition`: Array defining outcome distribution
- `amount`: Amount of collateral split

### Step 7: Get Market Resolution Status

Check if the market has been resolved:

```graphql
{
  EVM(dataset: realtime, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {
        Arguments: {
          includes: {
            Name: {is: "conditionId"}, 
            Value: {Bytes: {is: "CONDITION_ID_HERE"}}
          }
        }, 
        Log: {Signature: {Name: {in: ["ConditionResolution"]}}}, 
        LogHeader: {Address: {is: "0x4d97dcd97ec945f40cf65f87097ace5ea0476045"}}
      }
      limit: {count: 1}
    ) {
      Block {
        Time
        Number
        Hash
      }
      Transaction {
        Hash
        From
        To
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
        }
      }
    }
  }
}
```

**What you get:**
- `conditionId`: Market condition identifier
- `oracle`: Oracle address that resolved the market
- `questionId`: Question identifier
- `outcomeSlotCount`: Number of outcomes
- `payoutNumerators`: Array defining payout ratios for each outcome

**Resolution Status:**
- If this query returns results, the market is **resolved**
- If no results, the market is **open** or **pending resolution**

### Step 8: Get Payout Redemptions

If the market is resolved, get information about payouts:

```graphql
{
  EVM(dataset: realtime, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {
        Arguments: {
          includes: {
            Name: {is: "conditionId"}, 
            Value: {Bytes: {is: "CONDITION_ID_HERE"}}
          }
        }, 
        Log: {Signature: {Name: {in: ["PayoutRedemption"]}}}, 
        LogHeader: {Address: {is: "0x4d97dcd97ec945f40cf65f87097ace5ea0476045"}}
      }
      limit: {count: 1000}
    ) {
      Block {
        Time
        Number
        Hash
      }
      Transaction {
        Hash
        From
        To
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
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
- `parentCollectionId`: Collection identifier
- `conditionId`: Market condition identifier
- `indexSets`: Array of outcome index sets redeemed
- `payout`: Amount of collateral redeemed

## Complete Example: Starting from Market ID

If you only have a **Market ID** (numeric ID from Polymarket UI), follow this workflow:

### 1. Find Question ID from Market ID

Query `QuestionInitialized` events and decode `ancillaryData` to find the market with matching `market_id`:

```graphql
{
  EVM(dataset: combined, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {
        Block: {Time: {since_relative: {days_ago: 30}}}, 
        Log: {Signature: {Name: {in: ["QuestionInitialized"]}}}, 
        LogHeader: {Address: {is: "0x65070BE91477460D8A7AeEb94ef92fe056C2f2A7"}}
      }
      limit: {count: 10000}
    ) {
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

Decode all `ancillaryData` fields and search for the one containing `market_id: YOUR_MARKET_ID`.

### 2. Get Condition ID from Question ID

Once you have the question ID, query `ConditionPreparation` events:

```graphql
{
  EVM(dataset: combined, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {
        Arguments: {
          includes: {
            Name: {is: "questionId"}, 
            Value: {Bytes: {is: "QUESTION_ID_FROM_STEP_1"}}
          }
        }, 
        Log: {Signature: {Name: {in: ["ConditionPreparation"]}}}, 
        LogHeader: {Address: {is: "0x4d97dcd97ec945f40cf65f87097ace5ea0476045"}}
      }
      limit: {count: 1}
    ) {
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

Extract the `conditionId` from the results.

### 3. Continue with Steps 3-8 Above

Use the `conditionId` to get all remaining market data following Steps 3-8.

## Data Relationships

Understanding how the data connects:

```
QuestionInitialized (UMA Adapter)
    ↓ questionID
ConditionPreparation (Main Contract)
    ↓ conditionId
TokenRegistered (CTF Exchange)
    ↓ token0, token1
OrderFilled (CTF Exchange)
    ↓ trading activity
PositionSplit (Main Contract)
    ↓ liquidity data
ConditionResolution (Main Contract)
    ↓ resolution status
PayoutRedemption (Main Contract)
    ↓ payout data
```

## Summary: Complete Market Data Checklist

For a complete market view, collect:

- [ ] **Market Metadata**: Title, description, outcomes (from decoded `ancillaryData`)
- [ ] **Condition Info**: Condition ID, question ID, oracle address
- [ ] **Trading Pairs**: Token0, Token1 addresses
- [ ] **Trading Activity**: All `OrderFilled` events with prices
- [ ] **Order Matching**: `OrdersMatched` events
- [ ] **Liquidity**: `PositionSplit` events showing liquidity provision
- [ ] **Resolution Status**: `ConditionResolution` event (if resolved)
- [ ] **Payouts**: `PayoutRedemption` events (if resolved)

## Best Practices

1. **Cache condition IDs**: Once you have a condition ID, use it for all subsequent queries
2. **Decode ancillaryData**: Always decode and parse `ancillaryData` to get human-readable market information
3. **Handle both exchanges**: Query both legacy (`0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E`) and current (`0xC5d563A36AE78145C45a50134d48A1215220f80a`) exchange contracts
4. **Calculate prices correctly**: Use `OrderFilled` events to calculate current market prices
5. **Check resolution status**: Always check `ConditionResolution` to determine if market is open or resolved
6. **Use appropriate time ranges**: Adjust `since_relative` parameters based on market age

## Additional Resources

- [Polymarket API Overview](./polymarket-api.md)
- [Main Polymarket Contract](./main-polymarket-contract.md)
- [CTF Exchange Contract](./polymarket-ctf-exchange.md)
- [UMA Adapter Contract](./uma-adapter-contract.md)
- [Bitquery GraphQL API Documentation](https://docs.bitquery.io/)

