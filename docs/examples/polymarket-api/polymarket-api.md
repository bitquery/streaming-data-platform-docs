---
title: "Polymarket API - Get Prices, Trades & Market Data"
description: "Build Polymarket apps fast: Get real-time prices, track trades, discover markets, and monitor oracle resolutions. Complete GraphQL API guide with code examples for Polygon prediction markets."
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

# Polymarket Data API - Build Prediction Market Apps in Minutes

**Get real-time Polymarket data: prices, trades, markets, and oracle resolutions** — all accessible through simple GraphQL queries on Polygon.

## Quick Start: Get Polymarket Prices in 30 Seconds

**Try it now**: [Open in Bitquery IDE](https://ide.bitquery.io/) → Paste query → Get instant results

Copy and paste this query to get the latest Polymarket trades with prices:

```graphql
{
  EVM(dataset: realtime, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {
        Block: {Time: {since_relative: {hours_ago: 24}}}
        Log: {Signature: {Name: {in: ["OrderFilled"]}}}
        LogHeader: {
          Address: {
            in: [
              "0xC5d563A36AE78145C45a50134d48A1215220f80a",
              "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E"
            ]
          }
        }
      }
      limit: {count: 10}
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
      }
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


### What You Can Build

- **Trading dashboards** with real-time Polymarket prices
- **Market discovery apps** to find new prediction markets
- **Analytics platforms** tracking volume, liquidity, and trends
- **Trading bots** monitoring oracle resolutions and market movements
- **Portfolio trackers** for prediction market positions

## Complete Guide: Get All Market Data

**New to Polymarket APIs?** Follow our step-by-step guide: [**How to Get All Data for a Specific Market**](./get-market-data) — covers everything from market metadata to trades and token holders.

## What is Polymarket API?

Polymarket API provides programmatic access to prediction market data through GraphQL queries. Query market information, trading activity, token holders, prices, and oracle resolution data directly from the Polygon blockchain.

### What You Can Query

- **Market prices** — Real-time YES/NO prices from OrderFilled events
- **Trading activity** — All trades, order matches, and fills
- **Market metadata** — Titles, descriptions, outcomes (decoded from blockchain)
- **Oracle resolutions** — UMA oracle outcomes and dispute data
- **Token holders** — Who holds positions in each market
- **Liquidity data** — Position splits, merges, and collateral flows

## Smart Contract Addresses

| Contract | Address | What It Does |
|----------|---------|--------------|
| **Main Polymarket Contract** | `0x4d97dcd97ec945f40cf65f87097ace5ea0476045` | Creates markets, mints/burns tokens, handles redemptions |
| **CTF Exchange (Current)** | `0xC5d563A36AE78145C45a50134d48A1215220f80a` | Trading venue for outcome tokens (multi-outcome markets) |
| **CTF Exchange (Legacy)** | `0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E` | Legacy exchange for binary markets |
| **UMA Adapter** | `0x65070BE91477460D8A7AeEb94ef92fe056C2f2A7` | Connects Polymarket to UMA oracle for market resolution |

## Common API Queries

- **Get markets**: Query `QuestionInitialized` events from UMA Adapter
- **Get prices**: Query `OrderFilled` events from CTF Exchange
- **Get trades**: Query `OrderFilled` and `OrderMatched` events
- **Get condition ID**: Query `ConditionPreparation` events from Main Contract
- **Decode market data**: Decode `ancillaryData` from `QuestionInitialized` events

## Real Example: Polymarket Dashboard

See it in action — a complete Next.js app built with these APIs:

**[View Live Dashboard →](https://github.com/buddies2705/polymarket-dashboard)**

![Polymarket Markets List](/img/polymarket-dashboard/markets-list.png)
*Real-time market list with prices and trade counts*

![Market Details](/img/polymarket-dashboard/market-details.png)
*Complete market view with metadata, prices, and technical details*

**What it does:**
- Lists all Polymarket markets with live prices
- Shows trade history and token holders
- Decodes market metadata from blockchain
- Calculates prices from OrderFilled events

**Tech stack**: Next.js + TypeScript + Bitquery GraphQL APIs

**CLI Tool**: [Polymarket Trade Tracker CLI](https://github.com/Divyn/Polymarket-trade-Tracker-cli) — Built using Bitquery for inspecting OrderFilled events, tracking traders, and analyzing market data.

## API Documentation by Contract

Choose the contract based on what data you need:

### [Main Polymarket Contract](./main-polymarket-contract) — Market Creation & Resolution

**Use for**: Creating markets, minting tokens, checking resolution status

**Key Events:**
- `ConditionPreparation` — New markets created
- `PositionSplit` — Tokens minted from collateral
- `ConditionResolution` — Market resolved by oracle
- `PayoutRedemption` — Users claiming winnings

**Address**: `0x4d97dcd97ec945f40cf65f87097ace5ea0476045`

### [CTF Exchange Contract](./polymarket-ctf-exchange) — Trading & Prices

**Use for**: Getting prices, tracking trades, monitoring liquidity

**Key Events:**
- `OrderFilled` — Individual trades (use for price calculation)
- `OrderMatched` — Order matching events
- `TokenRegistered` — New trading pairs created

**Addresses**:
- Current: `0xC5d563A36AE78145C45a50134d48A1215220f80a`
- Legacy: `0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E`

### [UMA Adapter Contract](./uma-adapter-contract) — Market Metadata

**Use for**: Getting market titles, descriptions, and question data

**Key Events:**
- `QuestionInitialized` — New questions with metadata (decode `ancillaryData`)
- `QuestionResolved` — Oracle resolution outcomes

**Address**: `0x65070BE91477460D8A7AeEb94ef92fe056C2f2A7`

## Getting Started: 3 Steps to Your First Query

### Step 1: Sign Up for Bitquery
[Create an account](https://ide.bitquery.io/)

### Step 2: Choose What Data You Need

| What You Want | Which Contract | Which Event |
|---------------|----------------|-------------|
| **Market prices** | CTF Exchange | `OrderFilled` |
| **New markets** | UMA Adapter | `QuestionInitialized` |
| **Market creation** | Main Contract | `ConditionPreparation` |
| **Trades** | CTF Exchange | `OrderFilled`, `OrderMatched` |
| **Market resolution** | Main Contract | `ConditionResolution` |

### Step 3: Copy a Query Template

Each contract documentation page includes ready-to-use GraphQL queries. Start with:
- [Get all market data](./get-market-data) — Complete workflow
- [CTF Exchange queries](./polymarket-ctf-exchange) — Prices and trades
- [Main Contract queries](./main-polymarket-contract) — Market lifecycle

## Use Cases

**Build a trading dashboard** — Track prices, volume, and liquidity across all markets

**Create a market explorer** — Discover new prediction markets as they're created

**Monitor oracle resolutions** — Get alerts when markets resolve and track payout data

**Analyze trading patterns** — Study market maker behavior and trading flows

## Market Lifecycle: How It Works

```
1. Market Created → ConditionPreparation event
2. Oracle Question → QuestionInitialized event  
3. Tokens Minted → PositionSplit event
4. Trading Begins → OrderFilled events (prices update here)
5. Market Resolves → ConditionResolution event
6. Users Redeem → PayoutRedemption events
```

See the [complete guide](./get-market-data) for step-by-step queries covering the entire lifecycle.

## Quick Answers

**Q: How do I get Polymarket prices?**  
A: Query `OrderFilled` events from CTF Exchange. Price = USDC paid / tokens received. [See example →](./polymarket-ctf-exchange#price-calculation)

**Q: How do I find a market's condition ID?**  
A: Query `ConditionPreparation` events from Main Contract. The `conditionId` is in the event arguments. [Full guide →](./get-market-data)

**Q: How do I decode market titles and descriptions?**  
A: Query `QuestionInitialized` events, get `ancillaryData`, then decode hex to UTF-8. [Decoding guide →](./polymarket-ctf-exchange#step-4-decode-ancillary-data)

**Q: How do I get all trades for a market?**  
A: Get token addresses from `TokenRegistered` events, then query `OrderFilled` events using those addresses. [Step-by-step →](./get-market-data)

**Q: What's the difference between the two exchange contracts?**  
A: Current (`0xC5d5...`) handles multi-outcome markets. Legacy (`0x4bFb...`) handles binary YES/NO markets. Query both for complete coverage.

**Q: How do I know if a market is resolved?**  
A: Query `ConditionResolution` events. If found, market is resolved. If not, it's still open. [Check resolution →](./get-market-data#step-7-get-market-resolution-status)

## Additional Resources

- [Polymarket Official Documentation](https://docs.polymarket.com/)
- [UMA Oracle Documentation](https://docs.umaproject.org/)
- [Conditional Token Framework](https://docs.gnosis.io/conditionaltokens/)
- [Bitquery GraphQL API Documentation](https://docs.bitquery.io/)

### Support

For technical support and questions:
- Join the [Bitquery Telegram](https://t.me/bloxy_info)

## Quick Reference

**Contract Addresses:**
- Main: `0x4d97dcd97ec945f40cf65f87097ace5ea0476045`
- CTF Exchange (Current): `0xC5d563A36AE78145C45a50134d48A1215220f80a`
- CTF Exchange (Legacy): `0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E`
- UMA Adapter: `0x65070BE91477460D8A7AeEb94ef92fe056C2f2A7`

**Network:** Polygon (Matic)

**API:** Bitquery GraphQL — [Try it now](https://ide.bitquery.io/)
