---
title: "Blockchain Data APIs Overview"
description: "Explore Bitquery multi-chain blockchain APIs for trades, transfers, balances, NFTs, mempool data, and real-time streams."
keywords: ["blockchain API", "blockchain data API", "multi-chain API", "Ethereum API", "Solana API", "BSC API", "Arbitrum API", "Base API", "Polygon API", "Tron API", "blockchain GraphQL API", "real-time blockchain data", "historical blockchain data", "DEX API", "DeFi API", "NFT API", "token API", "transaction API", "balance API", "smart contract API", "mempool API", "blockchain streaming", "WebSocket blockchain", "Kafka blockchain", "blockchain analytics", "blockchain developer tools", "blockchain infrastructure", "blockchain indexing", "blockchain data platform", "stablecoin API", "MEV detection", "mempool monitoring", "crypto price API", "real-time trading data", "cross-chain analytics", "blockchain compliance", "payment processing API"]
---
import FAQ from "@site/src/components/FAQ";

# Blockchain Data APIs

Bitquery provides the most comprehensive blockchain data platform, offering real-time and historical access to data across **40+ blockchains** including Bitcoin, Ethereum, Solana, BSC, Arbitrum, Base, Polygon, Tron, and more. Our platform serves as the backbone for thousands of developers building DeFi applications, trading tools, analytics dashboards, and blockchain infrastructure.

## Why Choose Bitquery's Blockchain Data APIs?

Unlike traditional blockchain RPC providers that offer raw node data, Bitquery provides **pre-indexed, enriched, and analytics-ready** blockchain data through multiple interfaces:

- **Real-time Streaming**: Live data via GraphQL subscriptions, gRPC and Kafka streams
- **Pre-computed Analytics**: Real-time OHLC with 1-second aggregation, moving averages, volume metrics, and more
- **Cross-chain Aggregation**: Unified view of tokens and currencies across chains
- **High Performance**: Sub-second response times for complex queries
- **Developer-Friendly**: GraphQL interface with comprehensive documentation

## Supported Blockchains

**[Supported blockchains & networks (V1, V2, Kafka, gRPC, ClickHouse, cloud) →](/docs/blockchain/supported-chains/)** — See a single matrix of which chains are covered per interface (GraphQL versions, Kafka, CoreCast, ClickHouse warehouse, Parquet/datashares).

Bitquery provides comprehensive blockchain data across **40+ blockchains** through two active API versions:

### **V2 APIs**
Our V2 API version with enhanced features and real-time streaming:

**EVM-Compatible Chains:**
- **[Ethereum](/docs/blockchain/Ethereum/)**
- **[BSC (Binance Smart Chain)](/docs/blockchain/BSC/)**
- **[Arbitrum](/docs/blockchain/Arbitrum/)**
- **[Base](/docs/blockchain/Base/)**
- **[Polygon](/docs/blockchain/Matic/)**
- **[Optimism](/docs/blockchain/Optimism/)**
- **[opBNB](/docs/blockchain/supported-chains/)** (IDE / limited docs)
- **[Robinhood](/docs/blockchain/robinhood/)**

**Non-EVM Chains:**
- **[Solana](/docs/blockchain/Solana/)**
- **[Tron](/docs/blockchain/Tron/)**
- **[TON](/docs/blockchain/supported-chains/)** (limited support)
- **[Bitcoin](/docs/blockchain/Bitcoin/)**
- **[Cardano](/docs/blockchain/Cardano/)**

### **V1 APIs**
Our comprehensive V1 API supporting 40+ blockchains with historical data:

**Supported Blockchains:** Bitcoin, Ethereum, Solana, BSC, Polygon, Bitcoin Cash, Litecoin, Bitcoin SV, Dash, Zcash, Avalanche, Klaytn, Celo, Moonbeam, Fantom, Cronos, Cosmos, Hedera, Flow, EOS, Ripple (XRP), Stellar, Algorand, Cardano, Filecoin, and more.

**Documentation:**
- **[Supported chains by interface](/docs/blockchain/supported-chains/)** — Coverage matrix: V1/V2, Kafka, gRPC, ClickHouse, cloud
- **[V2 Documentation](/docs/)** - Latest APIs with real-time streaming
- **[V1 Documentation](https://docs.bitquery.io/v1/)** - Comprehensive APIs with 40+ blockchain support

## Bitquery's Core Blockchain Data Capabilities

**Popular APIs:** [Solana API](/docs/blockchain/Solana/) (DEX trades, Pump.fun, Raydium) · [Polymarket API](/docs/examples/polymarket-api/polymarket-api) · [BSC API](/docs/blockchain/BSC/) · [Base API](/docs/blockchain/Base/) · [DEX API](/docs/blockchain/Ethereum/dextrades/dex-api) · [Crypto Price API](/docs/trading/crypto-price-api/introduction/)

### **Crypto Price API - Real-Time Multi-Chain Price Data**

Bitquery's dedicated **[Crypto Price API](/docs/trading/crypto-price-api/introduction/)** provides real-time, aggregated cryptocurrency price data with ultra-low latency across multiple blockchains. This specialized API is designed specifically for trading applications, DeFi protocols, and financial analytics.

**Key Features:**
- **Real-time Streaming**: 1-second granularity via GraphQL subscriptions and Kafka streams
- **Pre-aggregated Data**: OHLC, SMA, WMA, EMA, and mean prices calculated automatically
- **Multi-chain Support**: Ethereum, Solana, BSC, Arbitrum, Base, Optimism, Polygon, and more
- **Clean Data**: Automatic filtering of low-quality trades and outliers
- **Cross-chain Aggregation**: Unified view of token prices across multiple ecosystems
- **Three Data Cubes**: Tokens (chain-specific), Currencies (cross-chain), and Pairs (market-specific)
- **TradingView Integration**: Ready-to-chart SDK for real-time price feeds

**Available Endpoints:**
- **Streaming Endpoint**: Real-time data via WebSocket subscriptions
- **Kafka Topic**: `trading.prices` for high-volume streaming applications

### **Trading & DeFi Data**
- **DEX Trades**: Real-time and historical trading data across all major DEXs
- **Price Data**: Real-time OHLC, moving averages, volume metrics with 1-second aggregation that updates consistently as trades come in
- **Liquidity Events**: Pool creation, liquidity additions/removals
- **Cross-chain Arbitrage**: Price differences across chains and DEXs

### **Token & Balance Data**
- **Token Transfers**: ERC-20, ERC-721, ERC-1155, SPL, TRC-20 transfers
- **Balance Updates**: Real-time wallet balance changes
- **Token Holders**: Distribution analysis and holder tracking
- **Token Supply**: Circulating supply, total supply, and burn events

### **Smart Contract Data**
- **Contract Events**: Decoded smart contract events and logs
- **Contract Calls**: Detailed contract interaction data
- **Contract Creation**: New contract deployments
- **Gas Analytics**: Fee analysis and optimization insights

### **Block & Transaction Data**
- **Block Information**: Headers, timestamps, gas usage, miner data
- **Transaction Details**: Complete transaction data with receipts
- **Mempool Monitoring**: Pending transactions and fee estimation
- **Network Statistics**: Block production, network health metrics

### **NFT Data**
- **NFT Transfers**: Ownership changes and marketplace trades
- **Collection Analytics**: Floor prices, volume, holder distributions
- **Metadata**: Token attributes, images, and rarity information
- **Marketplace Integration**: OpenSea, LooksRare, and other platforms

### **Stablecoin APIs - Specialized Payment Infrastructure**
Bitquery provides dedicated **[Stablecoin APIs](/docs/category/stablecoin-apis/)** for comprehensive stablecoin data across multiple blockchains, designed specifically for payment applications, compliance, and financial analytics.

**Key Features:**
- **Real-time Price Monitoring**: Track stablecoin [price deviations](/docs/stablecoin-APIs/stablecoin-price-api/) and arbitrage opportunities
- **Payment Detection**: Instant identification of incoming [stablecoin transfers](/docs/stablecoin-APIs/stablecoin-payments-api/)
- **Multi-chain Support**: USDT, USDC, DAI, and other stablecoins across all supported chains
- **Compliance Tools**: AML/KYC support with transaction monitoring
- **Cross-chain Analytics**: Unified view of stablecoin movements across ecosystems

**Available APIs:**
- **[Stablecoin Price API](/docs/stablecoin-APIs/stablecoin-price-api/)** - Real-time price tracking and deviation monitoring
- **[Stablecoin Payments API](/docs/stablecoin-APIs/stablecoin-payments-api/)** - Payment detection and compliance tools
- **[Stablecoin Trades API](/docs/stablecoin-APIs/stablecoin-trades-api/)** - Trading data and volume analytics
- **USDT API** - Specialized Tether data across all chains

### **Mempool Monitoring - Pre-Confirmation Data**
Access real-time data from the mempool before transactions are confirmed, enabling advanced trading strategies and MEV detection.

**Key Features:**
- **Pre-confirmation Visibility**: See transactions before they're included in blocks
- **MEV Detection**: Identify arbitrage opportunities and sandwich attacks
- **Fee Estimation**: Real-time gas price recommendations and market analysis
- **Transaction Simulation**: Test transaction success before broadcasting
- **Cross-chain Mempool**: Monitor pending transactions across multiple chains

**Available Endpoints:**
- **Ethereum Mempool**: Real-time pending transactions and events
- **BSC Mempool**: High-speed mempool monitoring for Binance Smart Chain
- **Tron Mempool**: TRX network pending transaction tracking
- **Kafka Mempool Streams**: Ultra-low latency mempool data via Protocol Buffers

**Learn More:** [Mempool Subscriptions](/docs/subscriptions/mempool-subscriptions/)

### **Advanced Features & Enterprise Capabilities**

**Backfilling & Historical Data Recovery:**
- **Gap-free Data**: Automatic backfilling of missing data during connection interruptions
- **Historical Recovery**: Retrieve data from any point in blockchain history
- **Seamless Integration**: Combine historical and real-time data in single applications

**Connection Management:**
- **Silent Disconnect/Reconnect**: Automatic connection recovery for production applications
- **Connection Pooling**: Efficient resource management for high-volume applications
- **Load Balancing**: Automatic traffic distribution across multiple endpoints

**Advanced Analytics:**
- **Custom Aggregations**: Build sophisticated analytics with custom time windows and metrics
- **Cross-chain Analytics**: Unified analytics across multiple blockchain ecosystems

**Learn More:** [Advanced Features](/docs/subscriptions/backfilling-subscription/)

## Developer Interfaces

### **GraphQL API**
Our primary interface for querying blockchain data with powerful filtering, aggregation, and real-time capabilities. The GraphQL API provides a flexible, type-safe way to query exactly the data you need.

**Key Features:**
- **Type-safe queries** with comprehensive schema documentation
- **Powerful filtering** with complex where clauses and nested conditions
- **Aggregation support** for time-series data and statistical analysis
- **Join capabilities** across different data types (transactions, events, transfers)
- **Pagination** with cursor-based and offset-based options
- **Field selection** - request only the data you need to optimize performance

:::note Migration Notice
Chains from the Early Access Program (EAP) have moved to v2.

- **Existing customers**: You can continue using the EAP endpoint without making any changes.
- **New users**: You must use the v2 endpoint for all blockchains.
:::

**Endpoints:**
- **V2 Primary Endpoint**: `https://streaming.bitquery.io/graphql`
- **V1 Endpoint**: `https://graphql.bitquery.io/` (for comprehensive blockchain support)

```graphql
{
  EVM(network: eth) {
    DEXTrades(
      where: {
        Block: {Time: {after: "2024-01-01"}}
        Trade: {Amount: {gt: "1000"}}
      }
      limit: {count: 10}
      orderBy: {descending: Block_Time}
    ) {
      Block { 
        Time 
        Number 
      }
      Transaction { 
        Hash 
        From 
        To 
      }
      Trade { 
        Amount 
        Price 
        BuyAmount 
        SellAmount 
      }
      Protocol { 
        Name 
        Type 
      }
      Currency {
        Symbol
        Name
      }
    }
  }
}
```

**Advanced Query Features:**
- **Nested filtering**: Filter by multiple criteria across related entities
- **Time-based queries**: Query by specific time ranges, intervals, or relative periods
- **Cross-chain queries**: Query data across multiple blockchains in a single request
- **Expression support**: Use mathematical expressions and calculations in queries
- **Custom aggregations**: Group and aggregate data by any field or time interval

### **Real-time Subscriptions (WebSocket)**
Convert any query to a live stream by changing `query` to `subscription`. Our WebSocket implementation provides real-time blockchain data with sub-second latency.

**Learn More:** [WebSocket Subscriptions](/docs/subscriptions/websockets/)

**WebSocket Features:**
- **Protocol Support**: Both `graphql-ws` and `subscriptions-transport-ws` protocols
- **Automatic Reconnection**: Built-in reconnection logic with exponential backoff
- **Connection Management**: Handle multiple subscriptions on a single connection
- **Error Handling**: Comprehensive error reporting and recovery mechanisms
- **Authentication**: Secure token-based authentication for WebSocket connections

**Trigger Options:**
- **`trigger_on: head`**: Receive data as soon as new blocks are mined
- **`trigger_on: block`**: Trigger on specific block conditions
- **Custom triggers**: Set up triggers based on specific data conditions

**WebSocket Endpoint**: `wss://streaming.bitquery.io/graphql`

```graphql
subscription {
  EVM(network: eth, trigger_on: head) {
    DEXTrades(
      where: {
        Trade: {Amount: {gt: "10000"}}
        Protocol: {Name: {in: ["Uniswap", "SushiSwap"]}}
      }
    ) {
      Block { 
        Time 
        Number 
      }
      Transaction { 
        Hash 
        From 
        To 
      }
      Trade { 
        Amount 
        Price 
        BuyAmount 
        SellAmount 
      }
      Protocol { 
        Name 
        Type 
      }
      Currency {
        Symbol
        Name
      }
    }
  }
}
```

**WebSocket Connection Example (JavaScript):**
```javascript
import { createClient } from 'graphql-ws';

const client = createClient({
  url: 'wss://streaming.bitquery.io/graphql',
  connectionParams: {
    Authorization: 'Bearer YOUR_ACCESS_TOKEN',
  },
});

const unsubscribe = client.subscribe(
  {
    query: `
      subscription {
        EVM(network: eth, trigger_on: head) {
          DEXTrades {
            Block { Time }
            Trade { Amount }
            Protocol { Name }
          }
        }
      }
    `,
  },
  {
    next: (data) => console.log('Received:', data),
    error: (err) => console.error('Error:', err),
    complete: () => console.log('Subscription completed'),
  }
);
```

**Use Cases:**
- **Real-time trading bots**: Monitor live DEX trades and price movements
- **Portfolio tracking**: Track wallet balance changes in real-time
- **MEV detection**: Monitor mempool for arbitrage opportunities
- **DeFi monitoring**: Track liquidity events and protocol interactions
- **Alert systems**: Set up notifications for specific blockchain events

### **Kafka Streaming**
High-throughput streaming for enterprise applications with pre-parsed Protocol Buffers. Our Kafka infrastructure provides enterprise-grade data streaming with guaranteed delivery and horizontal scalability.

**Learn More:** [Kafka Streaming Concepts](/docs/streams/kafka-streaming-concepts/)

**Kafka Infrastructure:**
- **Broker**: `streaming.bitquery.io:9092`
- **Protocol**: Apache Kafka with Protocol Buffers serialization
- **Latency**: Sub-second data delivery with guaranteed ordering
- **Reliability**: Built-in replication, failover, and data retention policies
- **Scalability**: Auto-scaling consumer groups and partition management

**Available Topics by Blockchain:**

**Ethereum Topics:**
- `eth.dextrades.proto` - DEX trading data across all Ethereum DEXs
- `eth.transactions.proto` - Complete transaction data with receipts
- `eth.tokens.proto` - Token transfers and balance updates
- `eth.blocks.proto` - Block headers and metadata
- `eth.events.proto` - Smart contract events and logs
- `eth.calls.proto` - Smart contract function calls

**Solana Topics:**
- `solana.dextrades.proto` - DEX trading data (Raydium, Orca, Jupiter, etc.)
- `solana.transactions.proto` - Transaction data with instruction details
- `solana.tokens.proto` - SPL token transfers and balance updates
- `solana.instructions.proto` - Individual instruction data
- `solana.blocks.proto` - Block data and slot information

**BSC Topics:**
- `bsc.dextrades.proto` - PancakeSwap and other BSC DEX data
- `bsc.transactions.proto` - BSC transaction data
- `bsc.tokens.proto` - BEP-20 token transfers

**Other Chains:**
- `arbitrum.dextrades.proto`, `base.dextrades.proto`, `polygon.dextrades.proto`
- `tron.dextrades.proto`, `tron.transactions.proto`

**Kafka Consumer Example (Python):**
```python
from kafka import KafkaConsumer
import bitquery_pb2

# Initialize consumer
consumer = KafkaConsumer(
    'eth.dextrades.proto',
    bootstrap_servers=['streaming.bitquery.io:9092'],
    security_protocol='SASL_SSL',
    sasl_mechanism='PLAIN',
    sasl_plain_username='YOUR_USERNAME',
    sasl_plain_password='YOUR_PASSWORD',
    value_deserializer=lambda m: bitquery_pb2.DEXTrade().ParseFromString(m)
)

# Consume messages
for message in consumer:
    trade = message.value
    print(f"Trade: {trade.amount} {trade.currency.symbol} on {trade.protocol.name}")
    print(f"Price: ${trade.price_usd}")
    print(f"Block: {trade.block.number}")
```

**Kafka Features:**
- **Schema Evolution**: Backward and forward compatible Protocol Buffer schemas
- **Consumer Groups**: Scale horizontally with multiple consumers
- **Offset Management**: Automatic and manual offset management options
- **Dead Letter Queues**: Handle failed message processing
- **Monitoring**: Comprehensive metrics and alerting
- **Data Retention**: Configurable retention policies (7 days to 1 year)

**Enterprise Features:**
- **Dedicated Clusters**: Isolated Kafka clusters for high-volume customers
- **Custom Topics**: Create custom topics for specific data requirements
- **Priority Support**: Dedicated support for Kafka infrastructure issues
- **SLA Guarantees**: 99.9% uptime with performance SLAs
- **Silent Disconnect/Reconnect**: Automatic connection management for production applications

### **Cloud Data Storage & Data Export**
Raw and processed data available in cloud storage for machine learning, deep analysis, and data export capabilities.

**Cloud Storage Features:**
- **AWS S3 Integration**: Direct access to optimized data formats
- **Historical Data**: Complete blockchain history since genesis
- **Multiple Formats**: JSON, Parquet, Protocol Buffers, and CSV
- **Partitioned Data**: Optimized for time-based and blockchain-based queries
- **Compression**: Efficient storage with gzip and snappy compression

**Data Export Capabilities:**

**1. Bulk Data Export**
- **Time Range Exports**: Export data for specific date ranges
- **Blockchain Selection**: Choose specific blockchains or all chains
- **Data Type Filtering**: Export specific data types (trades, transfers, events)
- **Format Options**: JSON, CSV, Parquet, or Protocol Buffers
- **Compression**: Optional compression for large exports

**Data Formats Available:**

**JSON Format:** A human-readable, nested format ideal for development, debugging, and small to medium datasets.  
**Parquet Format:** A columnar, highly compressed format optimized for analytics and fast queries, perfect for data science and machine learning.  
**CSV Format:** A simple tabular format compatible with spreadsheets and BI tools, suitable for reporting and visualization.  
**Protocol Buffers:** A compact binary format with schema evolution, offering minimal storage and fast serialization for high-performance applications.

**Use Cases for Data Export:**
- **Machine Learning**: Train models on historical blockchain data
- **Business Intelligence**: Create dashboards and reports
- **Compliance**: Generate audit reports and regulatory filings
- **Research**: Academic research and blockchain analysis
- **Backup**: Create local backups of critical data
- **Migration**: Move data to other systems or databases

## Getting Started

### 1. **Create Your Account**
- Visit [Bitquery IDE](https://ide.bitquery.io/) to get started
- **Free Trial**: 10,000 API points for 1 month, no credit card required
- Access to all blockchain data and real-time streaming

### 2. **Generate API Key**
- Navigate to [Applications](https://account.bitquery.io/user/api_v2/applications)
- Create an application and generate your access token
- Use OAuth2 for secure, programmatic access

### 3. **Run Your First Query**
- Try our [starter queries](/docs/start/starter-queries/) for common use cases
- Use the IDE's autocomplete (Ctrl+Space) for query building
- Convert queries to subscriptions for real-time data

### 4. **Explore Blockchain-Specific APIs**
- **[Ethereum APIs](/docs/blockchain/Ethereum/)** - Complete EVM ecosystem data
- **[Solana APIs](/docs/blockchain/Solana/)** - High-speed blockchain analytics
- **[BSC APIs](/docs/blockchain/BSC/)** - Binance Smart Chain data
- **[Trading APIs](/docs/category/trading-apis/)** - Real-time price and trading data

## Use Cases & Applications

### **DeFi Applications**
- **DEX Aggregators**: Best [price discovery](/docs/schema/evm/dextrades/) across multiple DEXs
- **Yield Farming**: Track liquidity positions and rewards
- **Lending Protocols**: Monitor collateral ratios and liquidations
- **Cross-chain Bridges**: Track asset movements between chains

### **Trading & Analytics**
- **Trading Bots**: Real-time price feeds with 1-second aggregation and market data via [Crypto Price API](/docs/trading/crypto-price-api/introduction/)
- **Portfolio Trackers**: Multi-chain wallet monitoring
- **Market Analytics**: Volume, liquidity, and price analysis
- **Arbitrage Detection**: Cross-chain and cross-DEX opportunities
- **Charting Applications**: TradingView integration with real-time OHLC data

### **Enterprise Solutions**
- **Compliance Tools**: Transaction monitoring and reporting
- **Risk Management**: Real-time exposure tracking
- **Business Intelligence**: Custom dashboards and KPIs
- **Audit & Forensics**: Complete transaction history analysis
- **MEV Detection**: Identify arbitrage opportunities and sandwich attacks
- **Stablecoin Payments**: Real-time payment detection and compliance monitoring

### **Consumer Applications**
- **Wallet Apps**: Balance tracking and transaction history
- **NFT Marketplaces**: Collection analytics and trading data
- **Block Explorers**: Enhanced blockchain data presentation
- **Gaming**: In-game asset tracking and trading
- **Payment Apps**: Real-time stablecoin payment processing
- **MEV Tools**: Advanced trading strategies and arbitrage detection

## Data Quality & Reliability

### **Data Processing Pipeline**
1. **Real-time Ingestion**: Direct from blockchain nodes
2. **Quality Filtering**: Automatic removal of low-quality trades and outliers
3. **Enrichment**: USD values, protocol identification, and metadata
4. **Aggregation**: Pre-computed metrics and time-series data
5. **Distribution**: Multiple interfaces for different use cases

### **Enterprise-Grade Infrastructure**
- **99.9% Uptime SLA**: Redundant systems with automatic failover
- **Enterprise Support**: Dedicated support with guaranteed response times
- **Scalable Architecture**: Auto-scaling infrastructure that grows with your needs
- **Data Retention**: Complete historical data archive for comprehensive analysis

## Support & Community

### **Documentation & Resources**
- **[Complete API Documentation](/docs/)** - Comprehensive guides for all features
- **[Code Examples](/docs/category/how-to-guides/)** - Real-world implementation examples
- **[Video Tutorials](/docs/blockchain/Ethereum/)** - Step-by-step guides
- **[Postman Collection](https://www.postman.com/interstellar-eclipse-270749/workspace/bitquery)** - Ready-to-use API examples

### **Community Support**
- **[Telegram](https://t.me/Bloxy_info)** - Quick questions and community help
- **[Community Forum](https://community.bitquery.io/)** - Feature requests and technical discussions
- **[Support Desk](https://support.bitquery.io/)** - Technical issues and data problems

### **Learning Resources**
- **[Learning Path](/docs/start/learning-path/)** - Structured learning from beginner to advanced
- **[Starter Queries](/docs/start/starter-queries/)** - Pre-built queries for common use cases
- **[GraphQL Guide](/docs/category/building-queries/)** - Complete GraphQL reference
- **[Integration Examples](/docs/category/how-to-guides/)** - Real-world application examples

## Next Steps

Ready to start building with blockchain data? Here's your path forward:

1. **[Create Your Account](https://ide.bitquery.io/)** - Get instant access to our platform
2. **[Run Your First Query](/docs/start/first-query/)** - Learn the basics in 5 minutes
3. **[Explore Blockchain APIs](/docs/blockchain/supported-chains/)** - Dive into specific blockchain data
4. **[Build Real-time Applications](/docs/category/graphql-subscriptions/)** - Set up live data streams
5. **[Join Our Community](https://t.me/Bloxy_info)** - Get help and share your projects

<FAQ
  items={[
    { q: "What is Bitquery and how is it different from an RPC node?", a: "Bitquery pre-indexes and enriches blockchain data across 40+ chains. You get GraphQL, subscriptions, and Kafka — not raw JSON-RPC responses you parse yourself." },
    { q: "Which blockchains does Bitquery support?", a: "Ethereum, Solana, BSC, Base, Arbitrum, Polygon, Tron, Bitcoin, and many more. See the supported chains page for coverage by interface (GraphQL, Kafka, gRPC, cloud)." },
    { q: "Should I use GraphQL, WebSocket subscriptions, or Kafka?", a: "GraphQL for flexible queries and dashboards. Subscriptions for live apps and bots. Kafka for high-volume pipelines and enterprise throughput." },
    { q: "How do I get crypto prices, trades, and OHLC?", a: "Use the Trading cube — Crypto Trades API and Crypto Price API for recent cross-chain data. Use chain-level DEXTrades or cloud Parquet exports for deep history." },
    { q: "How do I get historical data in bulk?", a: "Order Parquet exports to S3, GCS, Snowflake, or BigQuery via the cloud datasets program — better than paginating GraphQL for full-chain backfills." },
    { q: "How do I authenticate?", a: "Create a free account, generate an OAuth token at account.bitquery.io, and pass it as Authorization Bearer in API requests." },
  ]}
/>

---

**Start building the future of blockchain applications today with Bitquery's comprehensive multi-chain data platform.**

