---
title: Solana API Documentation
description: Collection of Solana APIs organized by project.
slug: /examples/Solana/
keywords:
  - Solana API
  - Solana RPC
  - Solana RPC API
  - Best Solana API
  - Solana Explorer API
  - solana wallet transaction monitoring api
  - solana api docs
  - solana websocket api
  - solana blockchain api
  - solana token api
  - solana transaction api
---

# Solana API Documentation

In this section we will see how to fetch data on different tokens, transactions, DEXs like Pumpfun, Raydium, Meteora etc via APIs and Streams.

If you need help getting data on Solana,reach out to [support](https://t.me/Bloxy_info)

### What is Solana API?

Bitquery Solana APIs help you fetch onchain data by writing a graphQL query.

### What are capabilities of Bitquery Solana API?

Bitquery Solana APIs are very flexible, you can fetch trade, transaction, balance information for a period, for a specific wallet and join with other information.

### Difference between Solana RPC and Bitquery Solana API?

**Solana RPC**

- JSON-RPC endpoint exposing raw on-chain state & transactions
- No built-in history or analytics—any indexing/aggregation you build or outsource
- Ideal for submitting transactions

**Bitquery Solana API**

- GraphQL endpoint over pre-indexed, parsed Solana data (token transfers, DEX trades, NFTs, etc.)
- Historical data, joins, aggregations & real-time subscriptions
- Great for real-time data and historical backtesting without running your own indexer

### Difference between Solana Geyser stream and Bitquery Kafka Stream?

**Solana Geyser stream**

- **Data & Protocol**: Runs as a plugin in your own Solana validator, emitting raw on-chain events (account updates, slot status changes, processed transactions, block metadata) over binary or gRPC feeds.
- **Infra & Maintenance**: You must host, scale, and secure the node yourself, parse and index all raw data client-side, and deal with only basic filtering—latency and reliability depend entirely on your setup; no built-in historical querying.

**Bitquery Kafka Stream**

- **Data & Protocol**: Provides fully managed Kafka topics—`solana.dextrades.proto`, `solana.tokens.proto`, and `solana.transactions.proto`—delivering pre-parsed, enriched Protocol-Buffers events (DEX trades, token transfers, supply/balance updates, instructions, blocks, etc.).
- **Infra & Maintenance**: Enterprise-grade, auto-scaling Kafka streams with sub-second latency, schema-based filtering, instruction-level balance updates, built-in replication/failover—no node ops or custom parsing needed. 

Read more [here](https://docs.bitquery.io/docs/streams/real-time-solana-data/) and contact sales via [Telegram](https://t.me/Bloxy_info) or [form](https://bitquery.io/forms/api) for a **Trial**.

### Does Bitquery support Solana Websocket and Solana Webhooks?

## PumpFun

- [Pump Fun API](./Pump-Fun-API)
- [Pump Swap API](./pump-swap-api)
- [Marketcap Bonding Curve API](./Pump-Fun-Marketcap-Bonding-Curve-API)
- [Pump Fun to Pump Swap](./pump-fun-to-pump-swap)

## Raydium

- [Raydium Launchpad](./launchpad-raydium)
- [Raydium DEX API](./Solana-Raydium-DEX-API)
- [Raydium CLMM API](./raydium-clmm-API)
- [Raydium CPMM API](./raydium-cpmm-API)

## Meteora

- [Meteora DAMM v2 API](./Meteora-DAMM-v2-API)
- [Meteora DLMM API](./Meteora-DLMM-API)
- [Meteora DYN API](./Meteora-DYN-API)
- [Meteora Dynamic Bonding Curve API](./meteora-dynamic-bonding-curve-api)

## Other Solana APIs

- [Solana Balance Updates](./solana-balance-updates)
- [Solana Dex Trades](./solana-dextrades)
- [Solana Trader API](./solana-trader-API)
- [Historical Aggregate Data](./historical-aggregate-data)
- [Token Supply Cube](./token-supply-cube)
- [Solana Instructions](./solana-instructions)
- [Solana Transactions](./solana-transactions)
- [Solana Transfers](./solana-transfers)
- [Solana Fees API](./solana_fees_api)
- [Boop Fun API](./Boop-Fun-API)
- [Bonk Fun API](./Bonk-Fun-API)
- [Solana Jupiter API](./solana-jupiter-api)
- [Solana GMGN API](./solana-gmgn-api)
- [Solana BullX API](./solana-bullx-api)
- [Solana Photon API](./solana-photon-api)
- [Solana Logs](./solana-logs)
- [Solana NFT](./solana-nft)
- [Solana Orca DEX API](./solana-orca-dex-api)
- [Solana Rewards](./solana-rewards)
- [Solana Search Tokens](./solana-search-tokens)
- [Solana Zeta](./solana-zeta)
- [Moonshot API](./Moonshot-API)
- [Solana Aldrin AMM API](./Solana-AldrinAmm-api)
- [Solana DEX Orders API](./Solana-DEX-Orders-API)
- [Solana Dex Pools API](./Solana-DexPools-API)
- [Solana Jito Bundle API](./Solana-Jito-Bundle-api)
- [Solana Lifinity DEX API](./Solana-Lifinity-dex-api)
- [Believe API](./Believe-API)
- [Solana OpenBook API](./Solana-OpenBook-api)
- [Solana Phoenix API](./Solana-Phoenix-api)
- [SolFi API](./SolFi-api)
- [Orbic API](./Orbic-API)
- [DEX Screener (Solana)](../dextrades/DEXScreener/solana_dexscreener)
