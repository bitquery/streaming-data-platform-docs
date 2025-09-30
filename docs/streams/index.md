---
title: Real-time Blockchain Data Streaming API | Bitquery Streaming Platform
description: Access real-time cryptocurrency and DeFi data with Bitquery's streaming APIs. Choose from WebSocket, Kafka, or gRPC streams for trading bots, DEX monitoring, and blockchain analytics.
keywords: [real-time blockchain data, cryptocurrency data API, DeFi data streams, trading data feeds, blockchain WebSocket API, Kafka blockchain streams, gRPC blockchain data, crypto market data, DEX trading data, blockchain analytics API]
---

# Real-time Blockchain Data Streaming API | Bitquery Platform

Bitquery provides powerful **real-time blockchain data streaming** capabilities through three distinct technologies, each optimized for different use cases and requirements. Whether you're building a **cryptocurrency trading bot**, **DeFi trading terminal**, **DEX pool monitoring** system, or **token sniping** application, we have the right **blockchain data streaming solution** for your needs.

## Blockchain Data Streaming Technologies Overview

### Real-time GraphQL Subscriptions (WebSocket API)
**Multichain Support** | **Live Data** | **Beginner-friendly**

Our **WebSocket-based GraphQL subscriptions** provide **real-time cryptocurrency data** with very high filtering and formatting capabilities. You can filter by wallet addresses, token contracts, transaction amounts, USD values, and much more directly in your queries. Perfect for **crypto trading applications**, **[DeFi dashboards](https://docs.bitquery.io/docs/usecases/crypto-dashboard/)**, and **blockchain analytics platforms**.

- **Endpoint**: `wss://streaming.bitquery.io/graphql`
- **Protocols**: `graphql-transport-ws`, `graphql-ws`
- **Latency**: ~1 second (network + parsing overhead)
- **Use Cases**: **Crypto trading dashboards**, **DeFi interfaces**, **real-time portfolio monitoring**

### High-Performance Kafka Blockchain Streams  
**Multichain Support** | **Ultra-low latency** | **High throughput**

High-performance, **low-latency blockchain data streaming** for mission-critical **cryptocurrency trading systems** requiring maximum reliability and scalability. **No server-side filtering available** – you receive complete blockchain transaction data and must filter on the client side. Ideal for **MEV bots**, **arbitrage trading systems**, and **high-frequency DeFi applications** that need complete data streams.

- **Endpoints**: `rpk0.bitquery.io:9092`, `rpk1.bitquery.io:9092`, `rpk2.bitquery.io:9092`
- **Protocol**: Apache Kafka with SASL authentication
- **Latency**: < 500ms (sub-second)
- **Use Cases**: **[Cryptocurrency trading bots](https://docs.bitquery.io/docs/streams/sniper-trade-using-bitquery-kafka-stream/)**, **real-time DeFi applications**, **MEV bot development**, **high-frequency blockchain monitoring**

### Ultra-fast gRPC Streams (CoreCast)
**Solana Blockchain** | **Sub-100ms latency** | **Smart filtering**

Our newest **ultra-low latency streaming technology** provides the fastest **Solana blockchain data** with server-side filtering capabilities and efficient binary serialization. Perfect for **Solana trading bots** and **MEV applications**. Filtering is available but more limited compared to WebSocket's extensive filtering options.

- **Endpoint**: `corecast.bitquery.io`
- **Protocol**: gRPC with Protobuf
- **Latency**: < 100ms (ultra-low latency)
- **Use Cases**: **Solana trading bots**, **Solana MEV applications**, **real-time Solana DeFi protocols**, **Jupiter aggregator monitoring**

## Feature Comparison

| Feature / Stream | WebSocket | Kafka | CoreCast (Smart gRPC) |
|------------------|-----------|-------|----------------------|
| **Latency** | ~1 second (network + parsing overhead) | < 500 ms (sub-second) | < 100 ms (ultra-low latency) |
| **Filtering** | ✅ Very high capability: addresses, tokens, pools, value thresholds, USD values, complex conditions | ❌ No filtering - complete data stream | ✅ Basic filtering: addresses, tokens, pools, thresholds (limited compared to WebSocket) |
| **USD Values** | ✅ Built-in | ❌ Not available (Available in different topic) | ❌ Not available (planned) |
| **Reliability** | Auto-reconnect via GraphQL, but no replay | ✅ Retention available, replay from checkpoints | Query GraphQL, no replay support |
| **Retention / Replay** | ❌ No | ✅ Yes, configurable retention window | ❌ No |
| **Schema / Data Format** | JSON over WebSocket | Avro/Protobuf over Kafka | Protobuf (typed contracts) |
| **Delivery Guarantee** | At-most-once | ✅ At-least-once (can configure exactly-once) | At-most-once |
| **Integration Complexity** | Easiest for frontends, explorers, bots | Requires infra (Kafka cluster, consumers) | Lightweight, good for backend apps and trading stratergies |
| **Bandwidth Efficiency** | Medium (JSON, more verbose) | High (binary encoding, batching) | Medium (Protobuf, direct streams) |
| **Use Case Fit** | Dashboards, explorers, analytics needing USD values & rich filters | Mission-critical infra: indexing, ETL pipelines, archival, guaranteed delivery | Ultra-low latency trading, real-time DeFi apps, terminals, Telegram bots |

## Choosing the Right Blockchain Data Streaming API

### Choose **Real-time GraphQL WebSocket API** if:

- Building **crypto trading web applications**
- Need **[advanced filtering capabilities](https://docs.bitquery.io/docs/graphql/filters/)** with complex conditions and **real-time USD prices**
- Require **[cryptocurrency price calculations](https://docs.bitquery.io/docs/trading/crypto-price-api/introduction/)** and **DeFi token metrics**
- Want fastest development and prototyping experience for **blockchain applications**
- Building **crypto dashboards**, **DeFi monitoring tools**, or **blockchain analytics platforms**
- Need unified interface for both **historical blockchain data** and **real-time streams**

### Choose **High-Performance Kafka Blockchain Streams** if:

- **Low-latency trading** is critical for your **cryptocurrency application**
- Cannot afford to lose any **blockchain transactions** (guaranteed delivery)
- Need horizontal scalability and **high-throughput blockchain data processing**
- Building **enterprise-grade crypto trading infrastructure**
- Require **transaction replay** and **blockchain data retention** capabilities
- Processing large volumes of **DeFi transaction data** with complex transformations (filtering must be done client-side)

### Choose **Ultra-fast gRPC Streams (CoreCast)** if:

- Working specifically with **Solana blockchain ecosystem**
- Need **ultra-low latency** (< 100ms) for **Solana trading**
- Want basic server-side filtering to reduce bandwidth (more limited than WebSocket)
- Building **[high-frequency Solana trading applications](https://docs.bitquery.io/docs/blockchain/Solana/Solana-Raydium-DEX-API/)** and **MEV bots**
- Developing lightweight backend services for **Solana DeFi**
- Creating **[Solana trading Telegram bots](https://docs.bitquery.io/docs/usecases/telegram-bot/)** or **terminal applications**

## Getting Started

### GraphQL Subscriptions (WebSockets)
1. **Authentication**: Use your [IDE credentials](https://docs.bitquery.io/docs/authorisation/how-to-generate/) or [OAuth tokens](https://docs.bitquery.io/docs/authorisation/websocket/)
2. **Connect**: `wss://streaming.bitquery.io/graphql`
3. **Start**: Create your first subscription in the [Bitquery IDE](https://ide.bitquery.io) using our [starter subscriptions](https://docs.bitquery.io/docs/start/starter-subscriptions/)

**Learn more**: [WebSocket Documentation](https://docs.bitquery.io/docs/subscriptions/websockets/) | [Examples](https://docs.bitquery.io/docs/subscriptions/examples/)

### Kafka Streams
1. **Get Access**: Contact our [sales team](https://bitquery.io/forms/api) for Kafka credentials
2. **Connect**: Use SASL authentication with provided username/password
3. **Subscribe**: Choose from topics like `ethereum.dextrades`, `solana.transactions`, etc.

**Learn more**: [Kafka Concepts](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/) | [Best Practices](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/#best-practises)

### gRPC Streams (CoreCast)
1. **Get Token**: Generate at [API Access Tokens](https://account.bitquery.io/user/api_v2/access_tokens)
2. **Connect**: `corecast.bitquery.io` with your API token
3. **Filter**: Define filters for addresses, tokens, or value thresholds

**Learn more**: [gRPC Introduction](https://docs.bitquery.io/docs/grpc/solana/introduction/) | [Code Examples](https://github.com/bitquery/grpc-code-samples)

## Multi-chain Blockchain Data Coverage

### GraphQL Subscriptions & Kafka Support:
- **[Ethereum](https://docs.bitquery.io/docs/blockchain/Ethereum/)** & Layer 2s ([Arbitrum](https://docs.bitquery.io/docs/blockchain/Arbitrum/), [Optimism](https://docs.bitquery.io/docs/blockchain/Optimism/), [Base](https://docs.bitquery.io/docs/blockchain/Base/), [Polygon](https://docs.bitquery.io/docs/blockchain/Matic/))
- **[Binance Smart Chain (BSC)](https://docs.bitquery.io/docs/blockchain/BSC/)**
- **[Solana](https://docs.bitquery.io/docs/blockchain/Solana/)**
- **[TRON](https://docs.bitquery.io/docs/blockchain/Tron/)**
- **[TON](https://docs.bitquery.io/docs/blockchain/TON/)** (limited support)

### gRPC Streams:
- **[Solana](https://docs.bitquery.io/docs/blockchain/Solana/)** (with more blockchains coming soon)

## Support & Resources

- **Documentation**: Comprehensive guides for each technology
- **Community**: Join our [Telegram](https://t.me/Bloxy_info) for support
- **Code Examples**: [GitHub repositories](https://github.com/bitquery) with sample implementations
- **Interactive Tools**: Test queries in our [IDE](https://ide.bitquery.io) with our [starter queries](https://docs.bitquery.io/docs/start/starter-queries/)

---

Ready to start streaming? Choose the technology that best fits your use case and dive into the detailed documentation for implementation guides, best practices, and code examples.
