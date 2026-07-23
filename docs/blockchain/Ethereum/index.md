---
title: Ethereum API - Best Blockchain Data API for Developers
description: "Ethereum API - Best Blockchain Data API for Developers: query and stream Ethereum on-chain data with Bitquery GraphQL examples for developers."
slug: /blockchain/Ethereum/
keywords:
  - Ethereum API
  - Ethereum RPC
  - Ethereum blockchain API
  - Ethereum GraphQL API
  - EVM API
  - best ethereum rpc api for web3 use
  - ethereum node api
  - ethereum api documentation
  - ethereum blockchain data api
  - eth api
  - backend apis
  - ethereum rpc
  - eth rpc
  - mempool api
  - json rpc api
  - free ethereum rpc
  - ethereum data api
---
import VideoPlayer from "../../../src/components/videoplayer.js";
import FAQ from "@site/src/components/FAQ";

# Ethereum API - Complete Developer Guide

:::tip Building a trading app or DEX UI on Ethereum?
For **real-time trades and prices on Ethereum** (and the last ~30 days), use the curated [**Trading cube**](/docs/trading/trading-data-overview) — [`Trading.Trades`](/docs/trading/crypto-trades-api/trades-api) gives you clean, MEV-filtered swaps with **USD price, market cap, and supply on every row** across **9 chains in one API**. For **historical Ethereum data older than ~30 days**, use the chain-level `DEXTrades` / `DEXTradeByTokens` APIs documented below.
:::

## What is Bitquery?

Bitquery is the leading blockchain data platform that provides comprehensive **Ethereum API** solutions for developers. Instead of running your own Ethereum node or building complex indexing infrastructure, you can use our pre-built **Ethereum API** to get the blockchain data you need in seconds.

Our **Ethereum API** provides comprehensive access to all Ethereum blockchain data including transactions, token balances, DEX trades, liquidity events, slippage data, pool reserves, blocks, smart contract events, gas fees, mempool data, and NFT information. Available through GraphQL API with real-time streaming via GraphQL subscriptions and Kafka.

## Getting Started

New to Bitquery? Here's how to get started:

1. **[Create a free account](https://ide.bitquery.io/)** - Get instant access to our GraphQL IDE
2. **[Generate your API key](/docs/authorization/how-to-generate/)** - Required for API access
3. **[Run your first query](/docs/start/first-query/)** - Learn the basics in 5 minutes
4. **[Explore examples](/docs/start/starter-queries/)** - Copy-paste ready queries

**Free Trial**: 100,000 API points for 1 month. No credit card required.

Need help crafting a query or subscription? Message us on [support](https://t.me/Bloxy_info).

## Why Choose Bitquery's Ethereum API?

Unlike traditional Ethereum JSON-RPC providers, our **Ethereum API** stores, indexes, and enriches every Ethereum transaction, event, contract call, token transfer, balance update, and DEX trade. Our advanced **Ethereum API** allows you to query both historical and real-time Ethereum blockchain data from multiple dimensions without the complexity of running your own infrastructure.

### Key Benefits of Our Ethereum API:
- **Complete Data Coverage**: Access to all Ethereum blockchain data since genesis
- **Real-time Updates**: Live data streaming via GraphQL subscriptions and Kafka
- **Advanced Analytics**: Pre-computed metrics and enriched data
- **Developer-Friendly**: GraphQL interface with comprehensive documentation
- **High Performance**: Sub-second response times for complex queries
- **Cost-Effective**: Free tier with 1,000 API calls per day

## How is it different from raw Ethereum RPC or Ethereum node API?

**Ethereum RPC**

- Low‑level JSON‑RPC that returns raw node data
- No historical indexing, joins, or analytics out of the box
- Best for transaction submission and node-level introspection

**Bitquery Ethereum API**

- Pre‑indexed, enriched datasets exposed via GraphQL
- Powerful filtering, joins, aggregations, and subscriptions (Websockets / Webhooks)
- Ideal for building applications, analytics, monitoring, dashboards, and reporting without running infra

## What can you build with it?

Build powerful applications including:
- **Trading Tools**: Trading terminals, bots, and automated strategies
- **Portfolio Trackers**: Monitor wallet portfolios and token holders
- **Compliance Tools**: Tax reporting, auditing, and accounting products
- **DeFi Analytics**: Monitor DEX price/volume, liquidity events, slippage, and pool reserves
- **Network Analysis**: Analyze gas usage, fees, and network health
- **Real-time Monitoring**: Stream mempool activity and pending transactions
- **Business Intelligence**: Compute KPIs over blocks/transactions for dashboards

## Real-time Data & Streaming

Get live Ethereum data through our streaming solutions:

- **GraphQL Subscriptions**: Convert any query to a live stream by changing `query` to `subscription`
- **Kafka Streaming**: High-throughput streaming for enterprise applications

See examples and code snippets [here](/docs/subscriptions/websockets/) for GraphQL subscription implementation, and learn about [Kafka streaming](/docs/streams/kafka-streaming-concepts/) for high-volume use cases.

## Ethereum DEX Trades APIs

- [Ethereum DEX API](/docs/blockchain/Ethereum/dextrades/dex-api)
- [Ethereum Token Trades APIs](/docs/blockchain/Ethereum/dextrades/token-trades-apis)
- [Trades of an Ethereum Address API](/docs/blockchain/Ethereum/dextrades/trades-of-an-address-api)
- [Uniswap API](/docs/blockchain/Ethereum/dextrades/uniswap-api)
- [Pancakeswap API](/docs/blockchain/Ethereum/dextrades/pancakeswap-api)
- [DEXScreener (EVM)](/docs/blockchain/Ethereum/dextrades/DEXScreener/evm_dexscreener)

Query and subscribe to on‑chain swaps, OHLCV, liquidity events, pools, and per‑wallet trading activity across major EVM DEXes.

## Ethereum Slippage API

- [Ethereum Slippage API](/docs/blockchain/Ethereum/dextrades/ethereum-slippage-api)

Get slippage and price impact data for Ethereum DEX pools. Understand price impact and liquidity depth for token swaps, calculate maximum input amounts at different slippage tolerances, and monitor real-time slippage data across all DEX pools on Ethereum.

## Ethereum Liquidity API

- [Ethereum Liquidity API](/docs/blockchain/Ethereum/dextrades/ethereum-liquidity-api)

Monitor real-time liquidity changes, track pool reserves, and analyze liquidity depth for token pairs on Ethereum DEX pools. Track when liquidity is added or removed, monitor pool health and depth, and analyze liquidity patterns across different pools.

## Ethereum Token Holders API

- [Token Holder API](/docs/blockchain/Ethereum/token-holders/token-holder-api)

Track and analyze token holder distributions with comprehensive historical and real-time data. Get top holders by balance, monitor holder count changes, calculate distribution metrics like Gini coefficient and Nakamoto coefficient for decentralization analysis, identify new and active holders, and track first/last activity dates for any ERC-20 token on Ethereum.

## Ethereum Balance API

- [Balance API](/docs/blockchain/Ethereum/balances/balance-api)

Get real‑time and historical token and native ETH balances for any Ethereum address. Track balance changes over time, calculate portfolio values in USD, and monitor wallet holdings across ERC20, ERC721, and ERC1155 tokens. Perfect for building portfolio trackers, tax tools, and wallet analytics.

## Ethereum Token Transfers API

- [ERC20 Token Transfer API](/docs/blockchain/Ethereum/transfers/erc20-token-transfer-api)
- [Ethereum Token Total Supply API](/docs/blockchain/Ethereum/transfers/total-supply)

Track comprehensive token transfer activity across Ethereum with support for all major ERC standards including ERC20, ERC721, ERC1155, and more. Monitor transfers for any Ethereum address or smart contract, analyze inflow and outflow patterns, and discover specific transfers across the entire blockchain for any token. Get enriched data with corresponding USD values, transfer volumes, and detailed transaction context to power portfolio tracking, Tax tools, compliance monitoring, and token analytics applications.

## Ethereum Blocks API

- [Ethereum Blocks API](/docs/blockchain/Ethereum/blocks/blocks-api)

Access comprehensive Ethereum block data including block headers, timestamps, gas usage, miner/validator information, base fees, and transaction counts. Build time‑series analytics, monitor network health, track block production patterns, analyze fee dynamics, and compute blockchain metrics. Perfect for building block explorers, network monitoring tools, and blockchain analytics dashboards.

## Ethereum Smart Contract Events API

- [Ethereum Smart Contract Events API](/docs/blockchain/Ethereum/events/events-api)

Access and analyze smart contract events across Ethereum with comprehensive filtering and decoding capabilities. Query contract logs by specific topics, parameters, addresses, and event signatures to track contract interactions, state changes, and protocol activity. Get decoded event data with parameter names and values, filter by block ranges or time periods, and monitor real-time contract events. Essential for building DeFi analytics, protocol monitoring tools, governance trackers, and smart contract auditing systems.

## Ethereum Transaction Fees API

- [Ethereum Transaction Fees API](/docs/blockchain/Ethereum/fees/fees-api)

Analyze comprehensive transaction fee data across Ethereum including gas usage patterns, base fee dynamics, priority fees, and transaction cost distributions. Track gas consumption by transaction type, monitor EIP-1559 fee market mechanics, calculate average gas prices over time, and analyze fee optimization strategies. Get detailed gas usage statistics, fee predictions, and cost analysis to power gas estimation tools, transaction optimization services, and fee market analytics dashboards.

## Ethereum Mempool API

- [Ethereum Mempool API](/docs/blockchain/Ethereum/mempool/mempool-api)

Monitor and analyze Ethereum's mempool to track pending transactions before they are included in blocks. Get real-time insights into transaction queues, fee estimations, and network congestion patterns. Track pending transactions by address, value, gas price, and transaction type to build MEV strategies, optimize transaction timing, and provide better fee estimation services. Additionally, simulate mempool transactions to preview potential transfers, trades, and contract interactions before execution, enabling advanced analysis of transaction outcomes and state changes. Essential for building frontrunning protection, transaction monitoring tools, MEV detection systems, and advanced DeFi applications that need to react to pending on-chain activity.

## Ethereum NFT API

- [Ethereum NFT API](/docs/blockchain/Ethereum/nft/nft-api)

Access comprehensive NFT data across Ethereum including collections, ownership tracking, transfer history, marketplace trades, and metadata. Query NFT collections by contract address, track ownership changes and holder distributions, monitor NFT transfers and sales across major marketplaces like OpenSea and LooksRare, and retrieve detailed token metadata including images, attributes, and rarity information. Get enriched trading data with USD values, floor prices, and volume metrics to power NFT analytics dashboards, portfolio trackers, rarity tools, and marketplace monitoring applications.

## Ethereum Transactions API

- [Ethereum Transaction API](/docs/blockchain/Ethereum/transactions/transaction-api)

Query detailed Ethereum transaction data including transaction hashes, from/to addresses, values transferred, gas prices, gas limits, gas used, nonce values, and transaction status. Access transaction input data, method signatures, internal transactions, and execution traces. Filter transactions by sender, receiver, value ranges, time periods, or transaction type to analyze payment flows, contract calls, and wallet behavior. Retrieve comprehensive transaction receipts with logs, events, and error details for both successful and failed transactions. Essential for transaction monitoring, forensic analysis, compliance reporting, and building comprehensive blockchain data applications.

<FAQ
  items={[
    {
      q: "Do I need to run my own Ethereum node?",
      a: "No. Bitquery indexes the full chain — query transactions, DEX trades, token transfers, NFTs, and smart contract events via GraphQL without node infrastructure.",
    },
    {
      q: "How do I get real-time Ethereum DEX trades?",
      a: "Use Trading.Trades for recent enriched swaps across chains, or EVM.DEXTrades on network eth for raw protocol-level detail and deeper history.",
    },
    {
      q: "How far back does Ethereum historical data go?",
      a: "To Ethereum genesis for indexed datasets. Use dataset: combined for merged archive and realtime, or cloud Parquet exports for bulk warehouse loads.",
    },
  ]}
/>

## Ethereum Videos Tutorials

### DEX Trades on EVM (Uniswap, Aggregators, Screens)

<VideoPlayer url="https://youtu.be/xcW_Na7YwSk" />

<VideoPlayer url="https://www.youtube.com/watch?v=K_H3to_nIdY" />

<VideoPlayer url="https://www.youtube.com/watch?v=sdQxnuRftaw" />

<VideoPlayer url="https://www.youtube.com/watch?v=xw8eezkFejI" />

### Ethereum Price & Balances

<VideoPlayer url="https://youtu.be/qsg86xlfnhM" />
