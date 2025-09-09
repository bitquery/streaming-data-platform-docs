---
title: "Bags FM API - Bitquery"
description: "Access real-time Bags FM token data, USD price streams, token transfers, trades, and creation events on Solana. Complete blockchain API for Bags FM with Bitquery's low-latency data."
keywords:
  [
    "Bags FM API",
    "Bags FM token data",
    "Solana token creation API",
    "Bags FM token transfers",
    "Bags FM token trades",
    "Bags FM token USD price stream",
    "blockchain API for Bags FM",
    "real-time Bags FM price API",
    "Bitquery Bags FM API",
  ]
---

# Bags FM API Documentation

Welcome to the **Bags FM API documentation**, powered by **Bitquery blockchain data APIs**.  
This guide covers how to use Bitquery to fetch and analyze **Bags FM token data** on Solana, including **token creation, supply, transfers, trades, and prices**.

You can use these APIs to integrate **real-time Bags FM data** into your applications.

The **Bitquery Bags FM API** provides comprehensive access to **Bags FM launchpad data**, including **Bags FM token creation API**, **Bags FM token transfers**, **Bags FM token trades**, and **real-time Bags FM price API** streams.

## Table of Contents

### [API Endpoints](#-endpoints--queries)

1. **[New Bags FM Token Created (Instructions API v1)](#1-new-bags-fm-token-created-instructions-api-v1)**

2. **[New Bags FM Token Created (Instructions API v2)](#2-new-bags-fm-token-created-instructions-api-v2)**

3. **[New Bags FM Token Created (TokenSupply API)](#3-new-bags-fm-token-created-tokensupply-api)**

4. **[USD Price of All Bags FM Tokens (Stream API)](#4-usd-price-of-all-bags-fm-tokens-stream-api)**

5. **[Price of Bags FM Tokens vs Quote Tokens (Stream API)](#5-price-of-bags-fm-tokens-vs-quote-tokens-stream-api)**

6. **[All Trades of Bags FM Tokens (DEXTrades API)](#6-all-trades-of-bags-fm-tokens-dextrades-api)**

7. **[Latest Trades of Bags FM Tokens (DEXTradeByToken API)](#7-latest-trades-of-bags-fm-tokens-dextradebytoken-api)**

8. **[All Transfers of Bags FM Tokens (Token Transfers API)](#8-all-transfers-of-bags-fm-tokens-token-transfers-api)**

## Key Features

- **Real-time Bags FM token creation tracking** via **Solana token creation API**
- **Solana token supply updates** for Bags FM tokens
- **Live USD price streams** for Bags FM tokens with **Bags FM token USD price stream**
- **Price feeds against quote tokens** for comprehensive market data
- **Historical and latest trades** from DEXs using **Bags FM token trades** endpoints
- **Complete token transfer history** with **Bags FM token transfers** tracking

---

## Endpoints & Queries

### 1. New Bags FM Token Created (Instructions API v1)

Track **new Bags FM token creation** events on Solana using the **Instructions API**. This **Bags token creation API** endpoint provides real-time data on token launches by tracking the Bags.FM Creator program.

To convert this API into a stream, simply add `subscription` in front of the query. Check out [this example](https://ide.bitquery.io/of-Bagsfm-token-creation-using-instructions-stream-v1).

🔗 [Try Query](https://ide.bitquery.io/Bagsfm-token-creation-using-instructions-api-v1_2)

```graphql
{
  Solana {
    Instructions(
      orderBy: { descending: Block_Time }
      where: {
        Instruction: { Program: { Method: { is: "mintTo" } } }
        Transaction: {
          Result: { Success: true }
          Signer: { is: "BAGSB9TpGrZxQbEsrEznv5jXXdwyP6AXerN8aVRiAmcv" }
        }
      }
      limit: { count: 10 }
    ) {
      Instruction {
        Program {
          Arguments {
            Name
            Value {
              __typename
              ... on Solana_ABI_String_Value_Arg {
                string
              }
              ... on Solana_ABI_Integer_Value_Arg {
                integer
              }
              ... on Solana_ABI_Address_Value_Arg {
                address
              }
              ... on Solana_ABI_BigInt_Value_Arg {
                bigInteger
              }
              ... on Solana_ABI_Bytes_Value_Arg {
                hex
              }
              ... on Solana_ABI_Boolean_Value_Arg {
                bool
              }
              ... on Solana_ABI_Float_Value_Arg {
                float
              }
              ... on Solana_ABI_Json_Value_Arg {
                json
              }
            }
          }
          Method
          AccountNames
          Json
          Name
        }
        Accounts {
          Address
        }
        BalanceUpdatesCount
        CallPath
        CallerIndex
        Data
        Depth
        ExternalSeqNumber
        Index
        InternalSeqNumber
        Logs
        TokenBalanceUpdatesCount
      }
      Transaction {
        Signature
        FeePayer
        Signer
      }
    }
  }
}
```

---

### 2. New Bags FM Token Created (Instructions API v2)

Fetch Bags FM token creation using the **Instructions API**. In this version, we track Meteora DBC's instructions.
To convert this API into a stream, simply add `subscription` in front of the query. Check out [this example](https://ide.bitquery.io/Bagsfm-token-creation-using-instructions-stream-v2_4).

🔗 [Try Query](https://ide.bitquery.io/Bagsfm-token-creation-using-instructions-stream-v2_5)

```graphql
query {
  Solana {
    Instructions(
      limit: { count: 100 }
      orderBy: { descending: Block_Time }
      where: {
        Instruction: {
          Program: {
            Address: { is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN" }
            Method: { is: "initialize_virtual_pool_with_spl_token" }
          }
          Accounts: {
            includes: {
              Address: { is: "BAGSB9TpGrZxQbEsrEznv5jXXdwyP6AXerN8aVRiAmcv" }
            }
          }
        }
        Transaction: { Result: { Success: true } }
      }
    ) {
      Instruction {
        Program {
          Arguments {
            Name
            Value {
              __typename
              ... on Solana_ABI_String_Value_Arg {
                string
              }
              ... on Solana_ABI_Integer_Value_Arg {
                integer
              }
              ... on Solana_ABI_Address_Value_Arg {
                address
              }
              ... on Solana_ABI_BigInt_Value_Arg {
                bigInteger
              }
              ... on Solana_ABI_Bytes_Value_Arg {
                hex
              }
              ... on Solana_ABI_Boolean_Value_Arg {
                bool
              }
              ... on Solana_ABI_Float_Value_Arg {
                float
              }
              ... on Solana_ABI_Json_Value_Arg {
                json
              }
            }
          }
          Method
          AccountNames
          Json
          Name
        }
        Accounts {
          Address
        }
        BalanceUpdatesCount
        CallPath
        CallerIndex
        Data
        Depth
        ExternalSeqNumber
        Index
        InternalSeqNumber
        Logs
        TokenBalanceUpdatesCount
      }
      Transaction {
        Signature
        FeePayer
        Signer
      }
    }
  }
}
```

---

### 3. New Bags FM Token Created (TokenSupply API)

Track Bags FM token creation using the **Solana TokenSupply API**. This endpoint provides **Bags FM token data** including supply information and creation timestamps. For the same API as a WebSocket stream, [try this](https://ide.bitquery.io/Bagsfm-token-creation-stream-using-Solana-token-supply-updates).

🔗 [Try Query](https://ide.bitquery.io/Bagsfm-token-creation-using-Solana-token-supply-updates)

```graphql
{
  Solana {
    TokenSupplyUpdates(
      where: {
        Instruction: {
          Program: {
            Address: { is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN" }
            Method: { is: "initialize_virtual_pool_with_spl_token" }
          }
        }
        Transaction: {
          Signer: { is: "BAGSB9TpGrZxQbEsrEznv5jXXdwyP6AXerN8aVRiAmcv" }
        }
        TokenSupplyUpdate: { Amount: { ne: "0" } }
      }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
    ) {
      Instruction {
        Program {
          Method
        }
      }
      TokenSupplyUpdate {
        Currency {
          Name
          Symbol
          MintAddress
          Decimals
        }
        Amount
        AmountInUSD
        PreBalance
        PreBalanceInUSD
        PostBalance
        PostBalanceInUSD
        Account {
          Address
          Owner
          Token {
            Owner
          }
        }
      }
      Block {
        Time
        Height
      }
      Instruction {
        Program {
          Address
          Method
        }
      }
      Transaction {
        Signature
        Signer
      }
    }
  }
}
```

---

### 4. USD Price of All Bags FM Tokens (Stream API)

Get **real-time USD prices** of all Bags FM tokens with the **Bitquery Price Index Stream API**. This **Bags FM token USD price WebSocket stream** provides continuous price updates.

🔗 [Try Stream](https://ide.bitquery.io/USD-Price-of-all-BAGs-token-in-Stream)

If you want to use it as a regular API, simply remove `subscription` from the front of the query.

```graphql
subscription {
  Trading {
    Pairs(
      where: {
        Interval: { Time: { Duration: { eq: 1 } } }
        Price: { IsQuotedInUsd: true }
        Token: { Address: { endsWith: "BAGS" } }
      }
    ) {
      Token {
        Id
        Symbol
        Address
        Name
      }
      Interval {
        Time {
          Start
          End
          Duration
        }
      }
      Volume {
        Usd
        Quote
        Base
      }
      Price {
        Average {
          Mean
        }
        Ohlc {
          Open
          High
          Low
          Close
        }
      }
    }
  }
}
```

---

### 5. Price of Bags FM Tokens vs Quote Tokens (Stream API)

Fetch **token-to-token prices** for all Bags FM tokens against their **quote tokens**. This **real-time Bags FM price WebSocket stream** provides comprehensive market data.

🔗 [Try Query](https://ide.bitquery.io/Price-of-all-Bags-FM-token-against-their-relevant-quote-token-in-Stream)

```graphql
subscription {
  Trading {
    Pairs(
      where: {
        Interval: { Time: { Duration: { eq: 1 } } }
        Price: { IsQuotedInUsd: false }
        Token: { Address: { endsWith: "BAGS" } }
      }
    ) {
      Token {
        Id
        Symbol
        Address
        Name
      }
      QuoteToken {
        Name
        Symbol
        Address
      }
      Interval {
        Time {
          Start
          End
          Duration
        }
      }
      Volume {
        Usd
        Quote
        Base
      }
      Price {
        Average {
          Mean
        }
        Ohlc {
          Open
          High
          Low
          Close
        }
      }
    }
  }
}
```

---

### 6. All Trades of Bags FM Tokens (DEXTrades API)

Get **all trades of Bags FM tokens** from Meteora and other DEXs. This **Bags FM token trades** WebSocket provides comprehensive trading data.

🔗 [Try Query](https://ide.bitquery.io/All-Trade-for-Bagsfm-tokens)

```graphql
subscription {
  Solana {
    DEXTrades(
      where: {
        any: [
          {
            Trade: {
              Buy: {
                Currency: {
                  UpdateAuthority: {
                    is: "BAGSB9TpGrZxQbEsrEznv5jXXdwyP6AXerN8aVRiAmcv"
                  }
                }
              }
            }
          }
          {
            Trade: {
              Sell: {
                Currency: {
                  UpdateAuthority: {
                    is: "BAGSB9TpGrZxQbEsrEznv5jXXdwyP6AXerN8aVRiAmcv"
                  }
                }
              }
            }
          }
        ]
      }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
    ) {
      Trade {
        Dex {
          ProtocolName
          ProtocolFamily
        }
        Buy {
          Amount
          AmountInUSD
          Currency {
            MetadataAddress
            ProgramAddress
            TokenCreator {
              Address
            }
            UpdateAuthority
            Symbol
            Name
            MintAddress
          }
          Price
        }
        Sell {
          Amount
          AmountInUSD
          Currency {
            Symbol
            Name
            MintAddress
          }
          Price
        }
      }
      Block {
        Time
        Height
      }
      Transaction {
        Signature
        FeePayer
      }
    }
  }
}
```

---

### 7. Latest Trades of Bags FM Tokens (DEXTradeByToken API)

Fetch the **latest trades of Bags FM tokens** with the **DEXTradeByToken API**. This endpoint provides real-time **Bags FM token trades** data.

🔗 [Try Query](https://ide.bitquery.io/Latest-trades-of-Bags-FM-token-using-Dextradebytoken-api_1)

```graphql
query LatestTrades {
  Solana {
    DEXTradeByTokens(
      orderBy: { descending: Block_Time }
      limit: { count: 50 }
      where: {
        Trade: {
          Currency: {
            UpdateAuthority: {
              is: "BAGSB9TpGrZxQbEsrEznv5jXXdwyP6AXerN8aVRiAmcv"
            }
          }
          Side: {
            Currency: {
              MintAddress: {
                in: [
                  "11111111111111111111111111111111"
                  "So11111111111111111111111111111111111111112"
                  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
                  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
                  "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN"
                  "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"
                ]
              }
            }
          }
        }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Signature
        Signer
        FeePayer
      }
      Trade {
        Market {
          MarketAddress
        }
        Dex {
          ProtocolName
          ProtocolFamily
          ProgramAddress
        }
        AmountInUSD
        PriceInUSD
        Price
        Amount
        Currency {
          Symbol
          MintAddress
          Name
        }
        Side {
          Type
          Currency {
            Symbol
            MintAddress
            Name
          }
          AmountInUSD
          Amount
        }
      }
    }
  }
}
```

---

### 8. All Transfers of Bags FM Tokens (Token Transfers API)

Track **all transfers of Bags FM tokens** across wallets. This **Bags FM token transfers** endpoint provides complete transfer history.  
🔗 [Try Query](https://ide.bitquery.io/Solana-token-transfers-of-Bags-fm-tokens)

```graphql
{
  Solana {
    Transfers(
      orderBy: { descending: Block_Time }
      limit: { count: 10 }
      where: {
        Transfer: {
          Currency: {
            UpdateAuthority: {
              is: "BAGSB9TpGrZxQbEsrEznv5jXXdwyP6AXerN8aVRiAmcv"
            }
          }
        }
      }
    ) {
      Block {
        Time
        Height
        Slot
      }
      Transfer {
        Amount
        AmountInUSD
        Authority {
          Address
        }
        Currency {
          UpdateAuthority
          Name
          Symbol
          MintAddress
        }
        Index
        Receiver {
          Address
          Owner
        }
        Sender {
          Address
          Owner
        }
      }
    }
  }
}
```

## Use Cases

- **Trading Platforms** – Integrate **Bags FM price feeds**, **Bags FM token trades**, and liquidity data using the **Bitquery Bags FM API**
- **Analytics Dashboards** – Track creation, **Bags FM token transfers**, supply, and prices with comprehensive **Bags FM token data**
- **Arbitrage Bots** – Monitor **Bags FM token USD price stream** differences in real time

## Why Use Bitquery for Bags FM API?

- **Low-latency blockchain data** (sub-400ms, moving to <100ms) for **real-time Bags FM price API**
- **Comprehensive Solana coverage** with real-time streams for **Bags FM token data**
- **Unified price index** for accurate token valuations via **Bags FM token USD price stream**
- **Historical + real-time queries** for flexible use cases with **Bags FM token trades** and **Bags FM token transfers**

## Multi-Exchange Data

The **Bags FM token trades** endpoints aggregate data from multiple Solana DEXs:

- [Meteora API](https://docs.bitquery.io/docs/blockchain/Solana/Meteora-DAMM-v2-API/)
- [Raydium API](https://docs.bitquery.io/docs/blockchain/Solana/Solana-Raydium-DEX-API/)
- [Orca API](https://docs.bitquery.io/docs/blockchain/Solana/solana-orca-dex-api/)
- [Jupiter API](https://docs.bitquery.io/docs/blockchain/Solana/solana-jupiter-api/)
- [PumpFun API](https://docs.bitquery.io/docs/blockchain/Solana/Pump-Fun-API/)
- [Letsbonk API](https://docs.bitquery.io/docs/blockchain/Solana/letsbonk-api/)

## 🔗 Related Solana APIs

- **[Solana Instructions API](https://docs.bitquery.io/docs/blockchain/Solana/solana-instructions/)** - Track token creation and burn instructions
- **[Solana DEX Trades API](https://docs.bitquery.io/docs/blockchain/Solana/solana-dextrades/)** - Monitor trading activities across all DEXs
- **[Solana Transfers API](https://docs.bitquery.io/docs/blockchain/Solana/solana-transfers/)** - Track token transfers and movements
- **[Solana Balance Updates API](https://docs.bitquery.io/docs/blockchain/Solana/solana-balance-updates/)** - Monitor balance changes from trades and transfers
- **[Solana Token Supply API](https://docs.bitquery.io/docs/blockchain/Solana/token-supply-cube/)** - Track token supply and creation events

## Conclusion

The **Bags FM API (via Bitquery)** delivers **complete blockchain data access** for Bags FM tokens.  
From **token creation** and **supply updates** to **real-time USD prices** through [crypto price API](https://docs.bitquery.io/docs/trading/crypto-price-api/introduction/), **DEX trades**, and **transfers**, it provides everything you need to build apps, dashboards, and trading systems.

The **Bitquery Bags FM API** is your comprehensive solution for accessing **Bags FM token data**, **Bags FM token transfers**, **Bags FM token trades**, and **real-time Bags FM price API** streams on the Solana blockchain.
