---
title: "Polymarket Data API"
description: "Complete guide to Polymarket API: Query prediction market data, track trades, get market prices, and access smart contract events on Polygon. Learn how to use GraphQL APIs for Polymarket markets, conditions, tokens, and oracle resolution."
keywords: 
  - Polymarket API
  - Polymarket GraphQL API
  - how to query Polymarket
  - Polymarket data API
  - prediction market API
  - Polymarket smart contract API
  - query Polymarket markets
  - Polymarket trading API
  - Polymarket price API
  - get Polymarket data
  - Polymarket blockchain API
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
  - Polymarket condition ID
  - Polymarket question ID
  - Polymarket market ID
---

# Polymarket API Documentation - How to Query Polymarket Data

Learn how to query Polymarket data using GraphQL APIs. This comprehensive guide shows you how to access prediction market data, track trades, get market prices, and monitor smart contract events on the Polygon blockchain.

## What is Polymarket API?

The Polymarket API provides programmatic access to prediction market data through GraphQL queries. You can query market information, trading activity, token holders, prices, and oracle resolution data directly from the blockchain.

## Overview

Polymarket is a decentralized prediction market protocol powered by Conditional Tokens Framework (CTF). It enables users to:

- **Create markets (conditions)** tied to real-world events
- **Trade outcome tokens** representing possible results  
- **Resolve markets** via UMA oracles
- **Redeem winning positions** for collateral

This comprehensive API documentation focuses on smart contract events emitted through the Polymarket protocol. However, through Bitquery's APIs, developers can access much more than just events - including [smart contract calls (traces)](https://docs.bitquery.io/docs/blockchain/Ethereum/calls/smartcontract), [token transfers](https://docs.bitquery.io/docs/blockchain/Ethereum/transfers/erc20-token-transfer-api), [transaction data](https://docs.bitquery.io/docs/blockchain/Ethereum/transactions/transaction-api), [balance updates](https://docs.bitquery.io/docs/blockchain/Ethereum/balances/balance-api), and complete blockchain analytics for prediction market data, oracle resolution tracking, and decentralized trading insights.

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
| **CTF Exchange Contract (Current)** | `0xC5d563A36AE78145C45a50134d48A1215220f80a` | Handles trading of ERC-1155 conditional tokens with AMM and orderbook logic (NegRisk multi-outcome) |
| **CTF Exchange Contract (Legacy)** | `0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E` | Legacy binary markets exchange contract |

## Quick Start - How to Query Polymarket Data

**New to Polymarket APIs?** Start with the [Complete Guide to Get All Market Data](https://docs.bitquery.io/docs/examples/polymarket-api/get-market-data) to learn how to retrieve all information for a specific market.

### Common Polymarket API Queries

- **How to get Polymarket markets**: Query `QuestionInitialized` events from UMA Adapter contract
- **How to get Polymarket prices**: Query `OrderFilled` events from CTF Exchange contract
- **How to get Polymarket trades**: Query `OrderFilled` and `OrderMatched` events
- **How to get Polymarket condition ID**: Query `ConditionPreparation` events from Main Contract
- **How to decode Polymarket market data**: Decode `ancillaryData` from `QuestionInitialized` events

## Documentation Structure

This documentation is organized into three main sections, each covering a specific smart contract:

### [Main Polymarket Contract](https://docs.bitquery.io/docs/examples/polymarket-api/main-polymarket-contract)

The Conditional Tokens Framework (CTF) core contract - the fundamental ERC-1155 system used for all prediction markets. This contract handles:

- **ConditionPreparation**: Creating new prediction market conditions (questions)
- **PositionSplit**: Minting outcome tokens by splitting collateral
- **PositionsMerge**: Burning tokens to reconstitute collateral
- **ConditionResolution**: Oracle publishing final outcomes
- **PayoutRedemption**: Users claiming collateral after resolution

**Address**: `0x4d97dcd97ec945f40cf65f87097ace5ea0476045`

Think of it as the "token factory" that issues and redeems conditional ERC-1155 tokens.

### [Polymarket CTF Exchange](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-ctf-exchange)

Polymarket's trading venue where users buy and sell ERC-1155 outcome tokens created by the CTF contract. This exchange handles:

- **TokenRegistered**: New asset IDs created when positions are split (similar to new pools on AMM)
- **OrderMatched**: Successful order matching and trade executions
- **OrderFilled**: Individual order fills and partial executions

**Addresses**:
- Current (NegRisk multi-outcome): `0xC5d563A36AE78145C45a50134d48A1215220f80a`
- Legacy (binary markets): `0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E`

Think of it as the "exchange layer" that gives the conditional tokens a live market.

### [UMA Adapter Contract](./uma-adapter-contract)

Middleware between Polymarket and UMA's Optimistic Oracle. It submits and retrieves outcome data for market questions, managing the integration with UMA's Optimistic Oracle system for decentralized question resolution and dispute handling.

**Address**: `0x65070BE91477460D8A7AeEb94ef92fe056C2f2A7`

## Market Lifecycle Summary

The complete Polymarket prediction market lifecycle involves coordinated interactions across all three smart contracts:

| Stage | Contract | Action | Event(s) |
|-------|----------|--------|----------|
| **Market Creation** | Main Polymarket | `prepareCondition()` | `ConditionPreparation` |
| **Oracle Request** | UMA Adapter | Oracle submission | `QuestionInitialized` |
| **Token Minting** | Main Polymarket | `splitPosition()` | `PositionSplit` |
| **Trading** | CTF Exchange | Orders & swaps | `TokenRegistered`, `OrderMatched`, `OrderFilled` |
| **Market Resolution** | UMA Adapter → Main | `reportPayouts()` | `QuestionResolved`, `ConditionResolution` |
| **Redemption** | Main Polymarket | `redeemPositions()` | `PayoutRedemption` |

### Event Flow Visualization

```
prepareCondition() 
    ↓ ConditionPreparation
splitPosition() 
    ↓ PositionSplit  
Trading on CTF Exchange
    ↓ TokenRegistered / OrderMatched / OrderFilled
reportPayouts()
    ↓ ConditionResolution
redeemPositions()
    ↓ PayoutRedemption
Collateral Released
```

## Developer Integration Guide

### Getting Started with Polymarket APIs

Learn how to query Polymarket data step by step:

1. **Choose Your Data Source**: Use the appropriate smart contract address based on what blockchain data you need:
   - **How to get Polymarket markets and conditions**: Query [Main Polymarket contract](./main-polymarket-contract) for `ConditionPreparation` events
   - **How to get Polymarket market metadata**: Query [UMA Adapter contract](./uma-adapter-contract) for `QuestionInitialized` events and decode `ancillaryData`
   - **How to get Polymarket prices and trades**: Query [CTF Exchange contract](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-ctf-exchange) for `OrderFilled` and `TokenRegistered` events

2. **Set Up Bitquery Access**: All Polymarket APIs are accessible through Bitquery's GraphQL IDE for real-time blockchain analytics
   - Sign up for a [Bitquery account](https://ide.bitquery.io/) 
   - Use the provided query links as starting points for your DeFi applications
   - Customize GraphQL queries for your specific prediction market use case
   - Get your OAuth token from [Bitquery account settings](https://account.bitquery.io/user/api_v2/access_tokens)

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

## Example Implementation: Polymarket Dashboard

A complete Next.js application demonstrating how to build a Polymarket dashboard using Bitquery APIs.

### GitHub Repository

**[Polymarket Dashboard](https://github.com/buddies2705/polymarket-dashboard)** - Open source implementation showcasing real-time Polymarket data visualization.

### Features

- **Market Discovery**: Browse all Polymarket markets with trading activity
- **Real-time Prices**: View current YES/NO prices for each market
- **Trade History**: Detailed trade history with maker/taker information and prices
- **Token Holders**: Track token holders and balances for each market
- **Market Details**: Complete market information including:
  - Market title and description (decoded from ancillaryData)
  - Condition ID, Question ID, and Oracle addresses
  - Current prices in USDC and cents
  - Trade counts and activity metrics

### Screenshots

![Polymarket Markets List](/img/polymarket-dashboard/markets-list.png)

*Markets list showing all available prediction markets with trade counts and current prices*

![Market Details](/img/polymarket-dashboard/market-details.png)

*Detailed market view with description, outcomes, technical details, and current prices*

![Trades and Token Holders](/img/polymarket-dashboard/trades-holders.png)

*Trade history and token holders for a specific market*

### Technical Stack

- **Framework**: Next.js with TypeScript
- **Database**: SQLite for local data storage
- **APIs**: Bitquery GraphQL APIs for blockchain data
- **Data Sources**:
  - `QuestionInitialized` events for market metadata
  - `ConditionPreparation` events for condition information
  - `TokenRegistered` events for trading pairs
  - `OrderFilled` events for trade data

### Getting Started

The dashboard demonstrates practical implementation of:
- Querying Bitquery APIs for Polymarket data
- Decoding ancillaryData to extract market information
- Calculating prices from OrderFilled events
- Building a complete market explorer interface

Visit the [GitHub repository](https://github.com/buddies2705/polymarket-dashboard) for:
- Complete source code
- Setup instructions
- API integration examples
- Database schema and data flow documentation

### Best Practices

- Always monitor both `ConditionPreparation` and `QuestionInitialized` events for complete market creation tracking
- Monitor `QuestionResolved` events from UMA Adapter to trigger market resolution processes
- Track `OrderFilled` events for real-time trading analytics and price discovery

## Frequently Asked Questions (FAQ)

### How do I query Polymarket data?

Use GraphQL queries to access Polymarket smart contract events. Start with the [Complete Guide to Get All Market Data](./get-market-data) for step-by-step instructions.

### How to get Polymarket prices?

Query `OrderFilled` events from the CTF Exchange contract and calculate prices using the formula: Price (YES) = USDC paid / YES tokens received. See the [CTF Exchange documentation](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-ctf-exchange#price-calculation) for details.

### How to get Polymarket market metadata?

Query `QuestionInitialized` events from the UMA Adapter contract to get `ancillaryData`, then decode it to extract market title, description, and other metadata. See [decoding instructions](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-ctf-exchange#step-4-decode-ancillary-data).

### How to find Polymarket condition ID?

Query `ConditionPreparation` events from the Main Polymarket Contract using either a `questionId` or by filtering recent events. The `conditionId` is in the event arguments.

### How to get Polymarket trades?

Query `OrderFilled` events from the CTF Exchange contract using token addresses (asset IDs) obtained from `TokenRegistered` events. See the [CTF Exchange documentation](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-ctf-exchange#3-order-filled-events).

### What is Polymarket API?

Polymarket API refers to GraphQL queries that access Polymarket smart contract events on the Polygon blockchain. These APIs allow you to query market data, trades, prices, and oracle resolution information.

## Additional Resources

- [Polymarket Official Documentation](https://docs.polymarket.com/)
- [UMA Oracle Documentation](https://docs.umaproject.org/)
- [Conditional Token Framework](https://docs.gnosis.io/conditionaltokens/)
- [Bitquery GraphQL API Documentation](https://docs.bitquery.io/)

### Support

For technical support and questions:
- Join the [Bitquery Telegram](https://t.me/bloxy_info)

## Summary: Common Polymarket API Queries

This documentation helps you answer common questions about querying Polymarket data:

- **How to query Polymarket**: Use GraphQL queries to access smart contract events on Polygon
- **How to get Polymarket prices**: Query `OrderFilled` events and calculate using USDC paid / tokens received
- **How to get Polymarket trades**: Query `OrderFilled` and `OrderMatched` events from CTF Exchange
- **How to get Polymarket markets**: Query `QuestionInitialized` events from UMA Adapter
- **How to get Polymarket condition ID**: Query `ConditionPreparation` events from Main Contract
- **How to decode Polymarket data**: Decode `ancillaryData` hex to UTF-8 to get market metadata
- **Polymarket API GraphQL**: All queries use Bitquery's GraphQL API on Polygon network
- **Polymarket smart contract addresses**: Main Contract (0x4d97dcd97ec945f40cf65f87097ace5ea0476045), CTF Exchange (0xC5d563A36AE78145C45a50134d48A1215220f80a), UMA Adapter (0x65070BE91477460D8A7AeEb94ef92fe056C2f2A7)

---

*This comprehensive API documentation covers Polymarket's core prediction market functionality, smart contract events, and DeFi trading data through Bitquery's blockchain APIs. For real-time cryptocurrency market data, decentralized oracle information, and the most up-to-date prediction market insights, always refer to the official Polymarket documentation and verify smart contract source code on Polygon blockchain explorers.*
