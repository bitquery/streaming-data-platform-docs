---
title: "UMA Adapter Contract API"
description: "Learn how to query UMA Adapter for Polymarket: Get QuestionInitialized events, decode ancillaryData, extract market titles and descriptions. Track oracle resolution and question metadata."
keywords:
  - UMA Adapter
  - Polymarket question ID
  - QuestionInitialized API
  - decode Polymarket ancillaryData
  - Polymarket market metadata
  - UMA oracle
  - QuestionResolved
  - oracle resolution
  - prediction market oracle
  - Polymarket market title
  - Polymarket market description
  - how to decode Polymarket data
---

# UMA Adapter Contract API - How to Get Market Metadata

**Address**: `0x65070BE91477460D8A7AeEb94ef92fe056C2f2A7`

Learn how to query UMA Adapter Contract to get Polymarket market metadata, decode ancillaryData, and extract market titles and descriptions. This guide shows you how to access question initialization data and oracle resolution information.

The UMA Adapter acts as middleware between Polymarket and UMA's Optimistic Oracle. It submits and retrieves outcome data for market questions, managing the integration with UMA's Optimistic Oracle system for decentralized question resolution and dispute handling.

## Contract Overview

The UMA Adapter Contract acts as middleware between Polymarket and UMA's Optimistic Oracle. It submits and retrieves outcome data for market questions, managing the integration with UMA's Optimistic Oracle system for decentralized question resolution and dispute handling.

**What it does:**
- Submits questions to UMA oracle system
- Retrieves resolution data from UMA
- Manages question lifecycle and dispute handling
- Provides question metadata (ancillaryData) for market questions

## Key Events

### 1. QuestionInitialized

The `QuestionInitialized` event is emitted when a new question is initialized in the UMA oracle system. This event contains the question metadata (ancillaryData) which describes the actual market question being asked.

**Emitted When:**
- A new question is submitted to UMA for resolution
- Market condition is prepared and linked to UMA oracle
- Question parameters are set (reward, bond, expiry times)

**Key Fields:**
- `questionID`: The unique identifier for the question
- `ancillaryData`: The actual question text/metadata describing the market

### 2. QuestionResolved

The `QuestionResolved` event is emitted when UMA oracle resolves questions with final outcomes.

**Emitted When:**
- UMA confirms final result
- Oracle resolution completed
- This triggers `reportPayouts()` in the main contract

### Additional Events

| Event Name | Description | Triggered When |
|------------|-------------|----------------|
| **RequestPrice** | A new question is submitted to UMA for resolution | Market condition is prepared |
| **ProposePrice** | UMA proposer suggests an outcome | Oracle phase begins |
| **DisputePrice** | UMA disputer challenges the proposed outcome | Dispute window active |
| **ResolvedPrice** | UMA confirms final result | Oracle resolution completed |

## Oracle Lifecycle

1. **Market Creation** → Question submitted via `RequestPrice` / `QuestionInitialized`
2. **UMA Oracle Phase** → Proposes and disputes results  
3. **Resolution** → Emits `QuestionResolved` / `ResolvedPrice`, which triggers `reportPayouts()` in the main contract

## How to Query UMA Adapter Contract Events

Learn how to query UMA Adapter to get Polymarket question metadata, decode ancillaryData, and track oracle resolution. These queries show you how to access all UMA Adapter contract events.

### 1. All UMA Adapter Events

**Endpoint**: [UMACFA Adapter All events](https://ide.bitquery.io/PolyMarket---UMA-Adapter-All-events)

Comprehensive tracking of all UMA Adapter contract events.

```graphql
{
  EVM(network: matic) {
    Events(
      where: {LogHeader: {Address: {is: "0x65070BE91477460D8A7AeEb94ef92fe056C2f2A7"}}}
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

**Use Case**: 
- Monitor oracle integration health
- Track question lifecycle from initialization to resolution
- Debug oracle-related issues

### 2. Question Initialized Events

**Endpoint**: [PolyMarket - UMA Adapter - New Questions](https://ide.bitquery.io/PolyMarket---UMA-Adapter-Question-Initialized)

Monitor when new questions are initialized in the UMA oracle system. This event contains the question metadata (ancillaryData) which describes the actual market question.

```graphql
{
  EVM(dataset: realtime, network: matic) {
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

**Use Case**:
- Track question creation pipeline
- Monitor oracle assignment process
- Analyze question complexity and types
- Get question metadata (ancillaryData) for market questions

**Initialization Data**:
- Question identifiers (questionID)
- Question metadata (ancillaryData) - the actual question text
- Oracle parameters
- Reward and bond amounts
- Expiry times

**How to Use**:
Replace `QUESTION_ID_HERE` with the actual question ID. The question ID can be found in `ConditionPreparation` events from the Main Polymarket Contract.

### 2.1. Find Creation Transaction of Question by Question ID

**Endpoint**: [find question creation of question id](https://ide.bitquery.io/find-question-creation-of-question-id)

Find the creation transaction for a specific question by searching for both `QuestionPrepared` and `QuestionInitialized` events. 

```graphql
{
  EVM(dataset: realtime, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {Log: {Signature: {Name: {in: ["QuestionPrepared", "QuestionInitialized"]}}}, LogHeader: {Address: {is: "0x65070BE91477460D8A7AeEb94ef92fe056C2f2A7"}}, Block: {Time: {since: "2026-01-02T00:00:00Z", till: "2026-01-06T22:00:00Z"}}, Arguments: {includes: {Value: {Bytes: {is: "0x11d5e64512e6e01e1f83630ee7e29509f98b540eaae3ffc96e8de65fe3039f5f"}}}}}
      limit: {count: 20}
    ) {
      Block {
        Time
        Number
        Hash
      }
      Receipt {
        ContractAddress
      }
      Topics {
        Hash
      }
      TransactionStatus {
        Success
      }
      LogHeader {
        Address
        Index
        Data
      }
      Transaction {
        Hash
        From
        To
      }
      Log {
        EnterIndex
        ExitIndex
        Index
        LogAfterCallIndex
        Pc
        SmartContract
        Signature {
          Name
          Signature
        }
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


**How to Use**:
1. Replace the question ID in `Bytes: {is: "0x11d5e64512e6e01e1f83630ee7e29509f98b540eaae3ffc96e8de65fe3039f5f"}` with your target question ID
2. Adjust the time range (`since` and `till`) to cover the period when the question was created
3. Change `dataset: realtime` to `dataset: archive` if you need to search older transactions
4. **Tip**: For older questions, search smaller time periods at a time for better performance

### Decoding Ancillary Data

The `ancillaryData` field in `QuestionInitialized` events contains hex-encoded market question metadata. To decode it and extract human-readable information (title, description, market_id, etc.), see the [CTF Exchange documentation](./polymarket-ctf-exchange.md#step-4-decode-ancillary-data) for complete decoding instructions and examples.

### 3. Question Resolved Events

**Endpoint**: [UMA Adapter Question Resolved](https://ide.bitquery.io/PolyMarket---UMA-Adapter-Question-Resolved)

Track when UMA oracle resolves questions with final outcomes.

```graphql
{
  EVM(dataset: realtime, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {
        Log:{
          Signature:{
            Name:{
              in:["QuestionResolved"]
            }
          }
        }
        LogHeader: {Address: {is: "0x65070BE91477460D8A7AeEb94ef92fe056C2f2A7"}}}
      limit: {count: 20}
    ) {
      Block {
        Time
        Number
        Hash
      }
      Receipt {
        ContractAddress
      }
      Topics {
        Hash
      }
      TransactionStatus {
        Success
      }
      LogHeader {
        Address
        Index
        Data
      }
      
      Transaction {
        Hash
        From
        To
      }
      Log {
        
        EnterIndex
        ExitIndex
        Index
        LogAfterCallIndex
        Pc
        SmartContract
        Signature {
          Name
          Signature
        }
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

**Use Case**:
- Trigger automated payouts
- Update market status in applications
- Analyze resolution patterns and timing
- Monitor oracle performance

**Resolution Data**:
- Question IDs and final answers
- Resolution timestamps
- Oracle dispute information (if any)

## Workflow: From Question ID to Trading Activity

This workflow shows how to start with a `questionID` from `QuestionInitialized` events and trace it through to get registered tokens and their trading activity.

### Step 1: Get Condition ID from Question ID

Use the `questionID` to query `ConditionPreparation` events from the [Main Polymarket Contract](./main-polymarket-contract.md) to get the `conditionId`:

```graphql
{
  EVM(dataset: realtime, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {
        Block: {Time: {since_relative: {hours_ago: 36}}}, 
        Arguments: {
          includes: {
            Name: {is: "questionId"}, 
            Value: {Bytes: {is: "QUESTION_ID_HERE"}}
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

Extract the `conditionId` from the event arguments.

### Step 2: Get Registered Tokens (Token0 and Token1)

Use the `conditionId` to query `TokenRegistered` events from the [CTF Exchange Contract](./polymarket-ctf-exchange.md) to get the trading pair tokens:

```graphql
{
  EVM(dataset: realtime, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {
        Block: {Time: {since_relative: {days_ago: 6}}},
        Arguments: {
          includes: {
            Name: {is: "conditionId"}, 
            Value: {Bytes: {is: "CONDITION_ID_FROM_STEP_1"}}
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

Extract `token0` and `token1` addresses from the event arguments.

### Step 3: Get Order Activity

Use the token addresses (asset IDs) to query `OrderFilled` events to get trading activity and calculate market prices. See the [Order Filled by Asset IDs](./polymarket-ctf-exchange.md#4-order-filled-by-asset-ids) query for details.

## Integration with Other Contracts

### Linking Questions to Conditions

The UMA Adapter's `QuestionInitialized` event contains a `questionID` that links to the `questionId` in the Main Polymarket Contract's `ConditionPreparation` event. This allows you to:

1. Get question metadata (ancillaryData) from UMA Adapter
2. Link questions to market conditions
3. Track the complete lifecycle from question creation to resolution

### Resolution Flow

1. `QuestionInitialized` in UMA Adapter → Question created
2. `ConditionPreparation` in Main Contract → Condition created with question ID
3. Trading occurs on CTF Exchange
4. `QuestionResolved` in UMA Adapter → Oracle resolves question
5. `ConditionResolution` in Main Contract → Market resolved with payouts

## Best Practices

- Always monitor both `ConditionPreparation` (Main Contract) and `QuestionInitialized` (UMA Adapter) events for complete market creation tracking
- Use `QuestionInitialized` events to get question metadata (ancillaryData) for displaying market questions
- Monitor `QuestionResolved` events to trigger market resolution processes in the Main Contract
- Track resolution timing and dispute rates for oracle performance analysis
- Implement proper error handling for oracle disputes and resolution delays

## Additional Resources

- [Polymarket API Overview](./polymarket-api.md)
- [Main Polymarket Contract](./main-polymarket-contract.md)
- [CTF Exchange Contract](./polymarket-ctf-exchange.md)
- [UMA Oracle Documentation](https://docs.umaproject.org/)
- [Bitquery GraphQL API Documentation](https://docs.bitquery.io/)

