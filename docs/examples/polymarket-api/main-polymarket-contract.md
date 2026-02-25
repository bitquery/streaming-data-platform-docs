---
title: "Main Polymarket Contract API"
description: "Learn how to query Polymarket main contract events: ConditionPreparation, PositionSplit, PositionsMerge, ConditionResolution. Get condition ID, question ID, and track market lifecycle on Polygon."
keywords:
  - Polymarket main contract
  - Polymarket condition ID
  - how to query Polymarket conditions
  - ConditionPreparation API
  - PositionSplit API
  - CTF core contract
  - Polymarket condition preparation
  - Polymarket position split
  - PositionsMerge
  - ConditionResolution
  - PayoutRedemption
  - Polymarket question ID
  - query Polymarket events
---

# Main Polymarket Contract API - How to Query ConditionPreparation and PositionSplit Events

**Address**: `0x4d97dcd97ec945f40cf65f87097ace5ea0476045`

Learn how to query the Main Polymarket Contract API to get condition IDs, question IDs, position splits, and market resolution data. This guide shows you how to access all Polymarket main contract events using GraphQL queries.

The Main Polymarket Contract is the Conditional Tokens Framework (CTF) core contract - the fundamental ERC-1155 system used for all prediction markets. This contract implements the core market logic including condition setup, token minting/splitting, merging, and redemption.

## Contract Overview

This is the Conditional Tokens Framework itself - the fundamental ERC-1155 system used for all prediction markets.

**What it does:**
- `prepareCondition()` - registers a new condition (market question)
- `splitPosition()` - mints outcome tokens (YES/NO, or more for multi-outcome)
- `mergePositions()` - burns tokens to reconstitute collateral
- `redeemPositions()` - lets users claim collateral after resolution
- Stores: conditionId, payoutNumerators, payoutDenominator

**Think of it as:** The "token factory" that issues and redeems conditional ERC-1155 tokens.

## Key Events

The Main Polymarket Contract has 3 major events:

### 1. ConditionPreparation

This event is emitted when a new prediction market condition (or question) is created. It defines the "question" being asked, the oracle that will resolve it, and the number of possible outcomes.

A condition represents a specific real-world event with one or more possible outcomes (binary or multi-way).

**Emitted When:**
- A new question is defined and linked to an oracle
- This marks the birth of a prediction market

**Example:**
```javascript
emit ConditionPreparation(
    conditionId,
    oracle,
    questionID,
    outcomeSlotCount
);
```

### 2. PositionSplit

This is the minting event - it occurs when collateral (e.g., USDC.e) is split into outcome tokens representing each possible result of a condition.

You're locking some collateral (say 100 USDC) and creating ERC-1155 tokens for each outcome. Partition defines how the total condition space is divided.

For binary markets: partition = [1, 2] → meaning "NO" and "YES".

**Example:**
If you split 100 USDC:
- You get 100 YES tokens and 100 NO tokens
- Together, they represent full ownership of the collateral

**Emitted When:**
- `splitPosition()` is called
- Collateral is divided into outcome tokens

### 3. PositionsMerge

This is the reverse of PositionSplit - you're burning outcome tokens of all outcomes to reclaim the original collateral.

When you hold both sides of a bet (YES and NO tokens in equal amount), you can "merge" them back into collateral - because you've recreated the complete state of uncertainty (no exposure).

**Example:**
If you own 50 YES and 50 NO for the same market:
- Merge them → burn both → receive back 50 USDC collateral

**Emitted When:**
- `mergePositions()` is called
- Opposite outcomes are recombined back into collateral

### Additional Events

| Event Name | Description | Triggered When |
|------------|-------------|----------------|
| **ConditionResolution** | Oracle publishes final outcomes for a question | `reportPayouts()` is called |
| **PayoutRedemption** | Winning token holders redeem collateral | `redeemPositions()` is called |
| **TransferSingle / TransferBatch** | ERC-1155 transfers of outcome tokens | During user trading or AMM swaps |
| **ApprovalForAll** | Operator approval granted or revoked | When user allows another address to manage positions |
| **URI** | Token metadata updated | URI of a position token changes |

## Real-World Analogy

| Concept | Real-world Analogy |
|---------|-------------------|
| ConditionPreparation | "Creating a new bet." |
| PositionSplit | "Printing the betting slips for YES and NO." |
| PositionsMerge | "Exchanging both slips back for your money before the game ends." |

## How to Query Polymarket Main Contract Events

This section shows you how to query all events from the Main Polymarket Contract. Learn how to get condition IDs, question IDs, position splits, and market resolution data.

### 1. All Available Events

**Endpoint**: [PolyMarket - All Available Events](https://ide.bitquery.io/PolyMarket---All-Available-Events)

Get all events emitted by the main Polymarket contract to track all platform activities.

```graphql
{
  EVM(network: matic) {
    Events(
      where: {LogHeader: {Address: {is: "0x4d97dcd97ec945f40cf65f87097ace5ea0476045"}}}
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

**Use Case**: Monitor all platform activities, track user interactions, and analyze market dynamics.

**Key Events Tracked**:
- `ConditionPreparation`: When new prediction conditions are created
- `ConditionResolution`: When oracles resolve prediction outcomes
- `PositionSplit`: When users split positions into outcome-specific tokens
- `PositionsMerge`: When users merge outcome tokens back to collateral
- `PayoutRedemption`: When users claim winnings after resolution

### 2. Newly Created Questions/Market ID

**Endpoint**: [PolyMarket Newly Created Questions / Market ID](https://ide.bitquery.io/Polymarket-Newly-Created-MarketQuestions)

Track new prediction markets as they are created on the platform.

```graphql
{
  EVM(dataset: realtime, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {
        Log:{
          Signature:{
            Name:{
              in:["ConditionPreparation"]
            }
          }
        }
        LogHeader: {Address: {is: "0x4d97dcd97ec945f40cf65f87097ace5ea0476045"}}}
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
- Monitor new market opportunities
- Build market discovery features
- Track platform growth and activity

**Data Includes**:
- Question text and parameters
- Market IDs for cross-referencing
- Creation timestamps
- Oracle assignments

**Note**: Using the `conditionId` from `ConditionPreparation` events, you can get the `questionID` from the event arguments. This `questionID` can then be used to query the [UMA Adapter Contract API](./uma-adapter-contract.md) `QuestionInitialized` event to retrieve question metadata (ancillaryData) containing the market title, description, and other details.

### 3. Condition Preparation by Condition ID

Track condition preparation events for a specific condition ID. This condition ID can be found in TokenRegistered events from the CTF Exchange contract.

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
      limit: {count: 100}
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

### 4. Latest Position Splits

**Endpoint**: [Latest position Split](https://ide.bitquery.io/PolyMarket---Latest-Position-Split)

Track when users split their collateral into outcome-specific position tokens.

```graphql
{
  EVM(dataset: realtime, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {
        Log:{
          Signature:{
            Name:{
              in:["PositionSplit"]
            }
          }
        }
        LogHeader: {Address: {is: "0x4d97dcd97ec945f40cf65f87097ace5ea0476045"}}}
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
- Monitor trading activity and market participation
- Analyze user betting patterns
- Track liquidity flows

**Split Event Details**:
- User addresses (stakeholders)
- Collateral tokens and amounts
- Partition arrays showing outcome distribution
- Parent collection IDs

### 5. Latest Resolved Questions

**Endpoint**: [PolyMarket Latest Resolved Questions](https://ide.bitquery.io/PolyMarket---Latest-Resolved-Questions)

Monitor recently resolved prediction markets and their outcomes.

```graphql
{
  EVM(dataset: realtime, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {
        Log:{
          Signature:{
            Name:{
              in:["ConditionResolution"]
            }
          }
        }
        LogHeader: {Address: {is: "0x4d97dcd97ec945f40cf65f87097ace5ea0476045"}}}
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
- Track market resolution patterns
- Analyze oracle accuracy
- Calculate historical performance metrics
- Trigger payout processes

**Resolution Data**:
- Final outcomes and payout numerators
- Resolution timestamps
- Oracle addresses
- Market performance metrics
- Condition IDs and outcomes
- Payout numerator arrays

### 6. Payout Received by Specific Polymarket Trader

**Endpoint**: [Payout received by polymarket trader](https://ide.bitquery.io/Payout-received-by-polymarket-trader)

Track all payouts received by a specific trader when they redeem winning positions.

```graphql
{
  EVM(dataset: realtime, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {Log: {Signature: {Name: {in: ["PayoutRedemption"]}}},
        Arguments:{
          includes:{
            Name:{is:"redeemer"}
            Value:{Address:{is:"0x1ff49fdcb6685c94059b65620f43a683be0ce7a5"}}
          }
        }
        LogHeader:
        {Address: {is: "0x4d97dcd97ec945f40cf65f87097ace5ea0476045"}}}
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
- Track specific trader performance and winnings
- Monitor high-volume trader activity  
- Calculate individual trader profit/loss over time
- Build trader portfolio analytics

**Payout Data Includes**:
- Redeemer address and transaction details
- Payout amounts and token types
- Market condition IDs and outcomes
- Redemption timestamps and block information
- Complete argument data for detailed analysis

**How to Use**:
Replace `0x1ff49fdcb6685c94059b65620f43a683be0ce7a5` with any trader address you want to monitor. This query filters `PayoutRedemption` events specifically for the specified `redeemer` address, allowing you to track all winning positions and payouts for that trader.

## Integration with Other Contracts

### Finding Question Metadata

The `conditionId` from `ConditionPreparation` events contains a `questionID` that can be used to query the UMA Adapter contract for question metadata (ancillaryData) from the `QuestionInitialized` event.

See the [UMA Adapter Contract documentation](./uma-adapter-contract.md) for details on querying question metadata.

## Best Practices

- Always monitor both `ConditionPreparation` and `QuestionInitialized` events (from UMA Adapter) for complete market creation tracking
- Use `TransferSingle`/`TransferBatch` events to track position token movements
- Monitor `ConditionResolution` events to trigger market resolution processes
- Track `PositionSplit` events to understand market participation and liquidity flows
- Implement proper error handling for oracle disputes and resolution delays

## Additional Resources

- [Polymarket API Overview](./polymarket-api.md)
- [UMA Adapter Contract](./uma-adapter-contract.md)
- [Bitquery GraphQL API Documentation](https://docs.bitquery.io/)

