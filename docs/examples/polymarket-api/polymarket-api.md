---
title: "Polymarket API Documentation - DeFi Prediction Markets"
description: "Access Polymarket prediction market data via GraphQL APIs. Track smart contracts, oracle resolution, and trading on Polygon blockchain."
keywords: 
  - Polymarket API
  - prediction market API
  - DeFi betting API
  - blockchain oracle data
  - decentralized trading API
  - Polygon smart contracts
  - GraphQL blockchain API
  - cryptocurrency prediction markets
  - UMA oracle integration
  - conditional token framework
  - real-time market data
  - smart contract events
  - position trading API
  - oracle resolution API
  - CTF exchange API
---

# Polymarket API Documentation

## Overview

Polymarket is a decentralized prediction market protocol powered by Conditional Tokens Framework (CTF). It enables users to:

- **Create markets (conditions)** tied to real-world events
- **Trade outcome tokens** representing possible results  
- **Resolve markets** via UMA oracles
- **Redeem winning positions** for collateral

This comprehensive API documentation focuses on smart contract events emitted through the Polymarket protocol. However, through Bitquery's APIs, developers can access much more than just events - including smart contract calls (traces), token transfers, transaction data, balance updates, and complete blockchain analytics for prediction market data, oracle resolution tracking, and decentralized trading insights.

### How Polymarket Protocol Works

1. **Market Creation**: Questions about real-world events are created with multiple possible outcomes for crypto prediction markets
2. **Position Trading**: Users can buy and sell positions (represented as ERC-1155 tokens) based on their predictions  
3. **Collateral Management**: Positions are backed by collateral tokens (typically USDC stablecoin)
4. **Oracle Resolution**: UMA's Optimistic Oracle system determines the outcome of prediction events
5. **Payouts**: Users who predicted correctly receive payouts proportional to their stakes and market liquidity

The platform uses three main smart contracts deployed on Polygon network to handle different aspects of the decentralized prediction market ecosystem:

## Contract Addresses

| Contract | Address | Purpose |
|----------|---------|---------|
| **Main Polymarket Contract** | `0x4d97dcd97ec945f40cf65f87097ace5ea0476045` | Implements the core market logic including condition setup, token minting/splitting, merging, and redemption |
| **UMA Adapter Contract** | `0x65070BE91477460D8A7AeEb94ef92fe056C2f2A7` | Acts as middleware between Polymarket and UMA's Optimistic Oracle, submits and retrieves outcome data |
| **CTF Exchange Contract** | `0xC5d563A36AE78145C45a50134d48A1215220f80a` | Handles trading of ERC-1155 conditional tokens with AMM and orderbook logic |

---

## Main Polymarket Contract APIs

**Address**: `0x4d97dcd97ec945f40cf65f87097ace5ea0476045`

The main contract implements the core market logic including condition setup, token minting/splitting, merging, and redemption. These [GraphQL APIs](https://docs.bitquery.io/docs/graphql/query/) provide real-time blockchain data for smart contract events, trading activities, and market analytics.

### Key Events Overview

| Event Name | Description | Triggered When |
|------------|-------------|----------------|
| **ConditionPreparation** | A new market (condition) is initialized | `prepareCondition()` is called |
| **ConditionResolution** | Oracle publishes final outcomes for a question | `reportPayouts()` is called |
| **PositionSplit** | Collateral is divided into outcome tokens | `splitPosition()` is called |
| **PositionsMerge** | Opposite outcomes are recombined back into collateral | `mergePositions()` is called |
| **PayoutRedemption** | Winning token holders redeem collateral | `redeemPositions()` is called |
| **TransferSingle / TransferBatch** | ERC-1155 transfers of outcome tokens | During user trading or AMM swaps |
| **ApprovalForAll** | Operator approval granted or revoked | When user allows another address to manage positions |
| **URI** | Token metadata updated | URI of a position token changes |

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

#### Example: Condition Creation

```javascript
emit ConditionPreparation(
    conditionId,
    oracle,
    questionId,
    outcomeSlotCount
);
```

**Emitted When:**
- A new question is defined and linked to an oracle
- This marks the birth of a prediction market

#### Example: Outcome Resolution

```javascript
emit ConditionResolution(
    conditionId,
    oracle,
    questionId,
    outcomeSlotCount,
    payoutNumerators
);
```

**Emitted When:**
- The oracle reports the result, setting final payout ratios
- This locks the market and determines which outcomes win

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
              in:["ConditionPreparation","QuestionPrepared"]
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

### 3. Latest Resolved Questions
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

### 5. Condition Resolution Events
**Endpoint**: [PolyMarket - Condition Resolution Event](https://ide.bitquery.io/PolyMarket---Condition-Resolution-Event)

Specifically track condition resolution events when oracles determine outcomes.

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
- Automate payout calculations
- Track oracle performance
- Monitor resolution timing

**Resolution Details**:
- Condition IDs and outcomes
- Payout numerator arrays
- Oracle addresses and timestamps

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

---

## UMA Adapter APIs

**Address**: `0x65070BE91477460D8A7AeEb94ef92fe056C2f2A7`

The UMA Adapter acts as a middleware between Polymarket and UMA's Optimistic Oracle. It submits and retrieves outcome data for market questions, managing the integration with UMA's Optimistic Oracle system for decentralized question resolution and dispute handling.

### Typical Events

| Event Name | Description | Triggered When |
|------------|-------------|----------------|
| **RequestPrice** | A new question is submitted to UMA for resolution | Market condition is prepared |
| **ProposePrice** | UMA proposer suggests an outcome | Oracle phase begins |
| **DisputePrice** | UMA disputer challenges the proposed outcome | Dispute window active |
| **ResolvedPrice** | UMA confirms final result | Oracle resolution completed |

### Oracle Lifecycle:

1. **Market Creation** → Question submitted via `RequestPrice`
2. **UMA Oracle Phase** → Proposes and disputes results  
3. **Resolution** → Emits `ResolvedPrice`, which triggers `reportPayouts()` in the main contract

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

### 2. Question Resolved
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

**Resolution Data**:
- Question IDs and final answers
- Resolution timestamps
- Oracle dispute information (if any)

### 3. New Questions Initialized
**Endpoint**: [PolyMarket - UMA Adapter - New Questions](https://ide.bitquery.io/PolyMarket---UMA-Adapter-Question-Initialized)

Monitor when new questions are initialized in the UMA oracle system.

```graphql
{
  EVM(dataset: realtime, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {
        Log:{
          Signature:{
            Name:{
              in:["QuestionInitialized"]
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
- Track question creation pipeline
- Monitor oracle assignment process
- Analyze question complexity and types

**Initialization Data**:
- Question identifiers
- Oracle parameters
- Reward and bond amounts
- Expiry times

---

## CTF Exchange APIs

**Address**: `0xC5d563A36AE78145C45a50134d48A1215220f80a`

The Conditional Token Framework (CTF) Exchange handles trading of ERC-1155 conditional tokens (YES/NO outcomes). It implements AMM and orderbook-like logic for liquidity provision and swaps. These APIs provide access to [DEX trading data](https://docs.bitquery.io/docs/evm/dextrades/) including order fills, token registrations, and market making activities for prediction market tokens.

### Key Trading Events

| Event Name | Description | Triggered When |
|------------|-------------|----------------|
| **OrderCreated** | New buy/sell order placed | User submits order to trade outcome tokens |
| **OrderFilled** | Trade executed between counterparties | Matching occurs on-chain or through relayers |
| **OrderCancelled** | Open order withdrawn by user | User cancels order before fill |
| **LiquidityAdded** | LP adds collateral & outcome tokens | User joins liquidity pool |
| **LiquidityRemoved** | LP withdraws funds from pool | User exits market liquidity |

#### Example: Trade Execution

```javascript
emit OrderFilled(
    trader,
    outcomeToken,
    collateralToken,
    price,
    amount
);
```

**Emitted When:**
- Outcome token trade occurs
- Used for analytics, AMM state tracking, and off-chain price feeds

### 1. Token Registered Events
**Endpoint**: [PolyMarket CTF Exchange Contract - TokenRegistered Event](https://ide.bitquery.io/Polymarket-Neg-Risk-CTF-Exchange-contract----TokenRegistered-Event)

Track when new outcome tokens are registered for trading.

```graphql
{
  EVM(dataset: realtime, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {Log: {Signature: {Name: {in: ["TokenRegistered"]}}}, LogHeader: {Address: {is: "0xC5d563A36AE78145C45a50134d48A1215220f80a"}}}
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
- Monitor new trading pairs
- Build token registries
- Track market expansion

**Registration Data**:
- Token addresses and metadata
- Market associations
- Trading parameters

### 2. Orders Matched Events
**Endpoint**: [PolyMarket CTF Exchange Contract - OrdersMatched Event](https://ide.bitquery.io/Polymarket-Neg-Risk-CTF-Exchange-contract----OrderMatched-Event_2)

Monitor successful order matching and trade executions.

```graphql
{
  EVM(dataset: realtime, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {Log: {Signature: {Name: {in: ["OrdersMatched"]}}}, LogHeader: {Address: {is: "0xC5d563A36AE78145C45a50134d48A1215220f80a"}}}
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
- Track trading volume and activity
- Analyze price discovery
- Calculate market metrics

**Match Data**:
- Order details and participants
- Trade amounts and prices
- Market identifiers
- Execution timestamps

### 3. Order Filled Events
**Endpoint**: [PolyMarket CTF Exchange Contract - OrderFilled Event](https://ide.bitquery.io/Polymarket-Neg-Risk-CTF-Exchange-contract----OrderFilled-Event)

Track individual order fills and partial executions.

```graphql
{
  EVM(dataset: realtime, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {Log: {Signature: {Name: {in: ["OrderFilled"]}}}, LogHeader: {Address: {is: "0xC5d563A36AE78145C45a50134d48A1215220f80a"}}}
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
- Detailed trade analysis
- Order book reconstruction
- User trading pattern analysis

**Fill Data**:
- Order IDs and fill amounts
- Price execution details
- Maker/taker information
- Fee calculations

---

## Market Lifecycle Summary

The complete Polymarket prediction market lifecycle involves coordinated interactions across all three smart contracts:

| Stage | Contract | Action | Event(s) |
|-------|----------|--------|----------|
| **Market Creation** | Main Polymarket | `prepareCondition()` | `ConditionPreparation` |
| **Oracle Request** | UMA Adapter | Oracle submission | `RequestPrice` |
| **Token Minting** | Main Polymarket | `splitPosition()` | `PositionSplit` |
| **Trading** | CTF Exchange | Orders & swaps | `OrderCreated`, `OrderFilled` |
| **Market Resolution** | UMA Adapter → Main | `reportPayouts()` | `ResolvedPrice`, `ConditionResolution` |
| **Redemption** | Main Polymarket | `redeemPositions()` | `PayoutRedemption` |
| **Liquidity Management** | CTF Exchange | LP add/remove | `LiquidityAdded`, `LiquidityRemoved` |

### Event Flow Visualization

```
prepareCondition() 
    ↓ ConditionPreparation
splitPosition() 
    ↓ PositionSplit  
Trading on CTF Exchange
    ↓ OrderCreated / OrderFilled
reportPayouts()
    ↓ ConditionResolution
redeemPositions()
    ↓ PayoutRedemption
Collateral Released
```

## Developer Notes

### Important Implementation Details

- **Event Indexing**: Most events include indexed parameters (e.g. `conditionId`, `oracle`, `trader`) for efficient log filtering
- **Collateral Tokens**: Typically USDC on Polygon mainnet for consistent value reference
- **UMA Oracle Finality**: Resolution finality depends on dispute windows and proposer bonds
- **Gas Considerations**: `redeemPositions()` may be gas-intensive when redeeming multiple index sets
- **ERC-1155 Compliance**: All outcome tokens follow ERC-1155 standard for batch operations
- **Oracle Integration**: UMA's Optimistic Oracle provides decentralized, dispute-based resolution

### Best Practices

- Always monitor both `ConditionPreparation` and `RequestPrice` events for complete market creation tracking
- Use `TransferSingle`/`TransferBatch` events to track position token movements
- Monitor `ResolvedPrice` events from UMA Adapter to trigger market resolution processes
- Track `OrderFilled` events for real-time trading analytics and price discovery
- Implement proper error handling for oracle disputes and resolution delays

---

## Developer Integration Guide

### Getting Started with Polymarket APIs

1. **Choose Your Data Source**: Use the appropriate smart contract address based on what blockchain data you need:
   - Market events and condition management: Main Polymarket contract
   - Oracle resolution and dispute handling: UMA Adapter contract
   - Trading activity and order matching: CTF Exchange contract

2. **Set Up Bitquery Access**: All prediction market APIs are accessible through Bitquery's GraphQL IDE for real-time blockchain analytics
   - Sign up for a [Bitquery account](https://ide.bitquery.io/) 
   - Use the provided query links as starting points for your DeFi applications
   - Customize GraphQL queries for your specific prediction market use case


### Common Use Cases for Polymarket Data

**Prediction Market Discovery Application**:
- Use "Newly Created Questions" API for discovering new betting markets and investment opportunities
- Subscribe to real-time blockchain updates for market creation events
- Display market metadata, odds, and betting parameters for user engagement

**DeFi Trading Analytics Dashboard**:
- Combine CTF Exchange APIs for comprehensive decentralized trading data and market insights
- Track trading volume, liquidity pools, and price movements across prediction markets
- Analyze user trading patterns, bet distributions, and market maker activities

**Oracle Monitoring and Risk Management System**:
- Use UMA Adapter APIs to track question lifecycle and resolution accuracy
- Monitor oracle resolution times, dispute rates, and consensus mechanisms
- Alert on oracle failures, delays, or potential market manipulation for risk assessment

### Additional Resources

- [Polymarket Official Documentation](https://docs.polymarket.com/)
- [UMA Oracle Documentation](https://docs.umaproject.org/)
- [Conditional Token Framework](https://docs.gnosis.io/conditionaltokens/)
- [Bitquery GraphQL API Documentation](https://docs.bitquery.io/)

### Support

For technical support and questions:
- Join the [Bitquery Telegram](https://t.me/bloxy_info)

---

*This comprehensive API documentation covers Polymarket's core prediction market functionality, smart contract events, and DeFi trading data through Bitquery's blockchain APIs. For real-time cryptocurrency market data, decentralized oracle information, and the most up-to-date prediction market insights, always refer to the official Polymarket documentation and verify smart contract source code on Polygon blockchain explorers.*
