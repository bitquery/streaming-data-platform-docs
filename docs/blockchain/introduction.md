---
title: "Blockchain Data APIs - Multi-Chain Developer Platform"
description: "Access comprehensive blockchain data across Ethereum, Solana, BSC, Arbitrum, Base, Polygon, Tron, and more. Real-time and historical data via GraphQL APIs, WebSocket subscriptions, and Kafka streams. Free tier available."
keywords: ["blockchain API", "blockchain data API", "multi-chain API", "Ethereum API", "Solana API", "BSC API", "Arbitrum API", "Base API", "Polygon API", "Tron API", "blockchain GraphQL API", "real-time blockchain data", "historical blockchain data", "DEX API", "DeFi API", "NFT API", "token API", "transaction API", "balance API", "smart contract API", "mempool API", "blockchain streaming", "WebSocket blockchain", "Kafka blockchain", "blockchain analytics", "blockchain developer tools", "blockchain infrastructure", "blockchain indexing", "blockchain data platform", "stablecoin API", "MEV detection", "mempool monitoring", "crypto price API", "real-time trading data", "cross-chain analytics", "blockchain compliance", "payment processing API"]
---

# Blockchain Data APIs

Bitquery provides the most comprehensive blockchain data platform, offering real-time and historical access to data across **40+ blockchains** including Bitcoin, Ethereum, Solana, BSC, Arbitrum, Base, Polygon, Tron, and more. Our platform serves as the backbone for thousands of developers building DeFi applications, trading tools, analytics dashboards, and blockchain infrastructure.

## Why Choose Bitquery's Blockchain Data APIs?

Unlike traditional blockchain RPC providers that offer raw node data, Bitquery provides **pre-indexed, enriched, and analytics-ready** blockchain data through multiple interfaces:

- **Real-time Streaming**: Live data via GraphQL subscriptions and Kafka streams
- **Pre-computed Analytics**: Real-time OHLC with 1-second aggregation, moving averages, volume metrics, and more
- **Cross-chain Aggregation**: Unified view of tokens and currencies across chains
- **High Performance**: Sub-second response times for complex queries
- **Developer-Friendly**: GraphQL interface with comprehensive documentation

## Supported Blockchains

Bitquery provides comprehensive blockchain data across **40+ blockchains** through two active API versions:

### **V2 APIs**
Our V2 API version with enhanced features and real-time streaming:

**EVM-Compatible Chains:**
- **[Ethereum](https://docs.bitquery.io/docs/blockchain/Ethereum/)**
- **[BSC (Binance Smart Chain)](https://docs.bitquery.io/docs/blockchain/BSC/)**
- **[Arbitrum](https://docs.bitquery.io/docs/blockchain/Arbitrum/)**
- **[Base](https://docs.bitquery.io/docs/blockchain/Base/)**
- **[Polygon](https://docs.bitquery.io/docs/blockchain/Matic/)**
- **[Optimism](https://docs.bitquery.io/docs/blockchain/Optimism/)**
- **[opBNB](https://docs.bitquery.io/docs/blockchain/opBNB/)**

**Non-EVM Chains:**
- **[Solana](https://docs.bitquery.io/docs/blockchain/Solana/)**
- **[Tron](https://docs.bitquery.io/docs/blockchain/Tron/)**
- **[TON](https://docs.bitquery.io/docs/blockchain/TON/)**

### **V1 APIs**
Our comprehensive V1 API supporting 40+ blockchains with historical data:

**Supported Blockchains:** Bitcoin, Ethereum, Solana, BSC, Polygon, Bitcoin Cash, Litecoin, Bitcoin SV, Dash, Zcash, Avalanche, Klaytn, Celo, Moonbeam, Fantom, Cronos, Cosmos, Hedera, Flow, EOS, Ripple (XRP), Stellar, Algorand, Cardano, Filecoin, and more.

**Documentation:**
- **[V2 Documentation](https://docs.bitquery.io/docs/)** - Latest APIs with real-time streaming
- **[V1 Documentation](https://docs.bitquery.io/v1/)** - Comprehensive APIs with 40+ blockchain support

## Bitquery's Core Blockchain Data Capabilities

### **Crypto Price API - Real-Time Multi-Chain Price Data**

Bitquery's dedicated **[Crypto Price API](https://docs.bitquery.io/docs/trading/crypto-price-api/introduction/)** provides real-time, aggregated cryptocurrency price data with ultra-low latency across multiple blockchains. This specialized API is designed specifically for trading applications, DeFi protocols, and financial analytics.

**Key Features:**
- **Real-time Streaming**: 1-second granularity via GraphQL subscriptions and Kafka streams
- **Pre-aggregated Data**: OHLC, SMA, WMA, EMA, and mean prices calculated automatically
- **Multi-chain Support**: Ethereum, Solana, BSC, Arbitrum, Base, Optimism, Polygon, and more
- **Clean Data**: Automatic filtering of low-quality trades and outliers
- **Cross-chain Aggregation**: Unified view of token prices across multiple ecosystems
- **Three Data Cubes**: Tokens (chain-specific), Currencies (cross-chain), and Pairs (market-specific)
- **TradingView Integration**: Ready-to-chart SDK for real-time price feeds

**Available Endpoints:**
- **EAP Endpoint**: Advanced analytics and complex queries
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
Bitquery provides dedicated **[Stablecoin APIs](https://docs.bitquery.io/docs/stablecoin-APIs/)** for comprehensive stablecoin data across multiple blockchains, designed specifically for payment applications, compliance, and financial analytics.

**Key Features:**
- **Real-time Price Monitoring**: Track stablecoin [price deviations](https://docs.bitquery.io/docs/stablecoin-APIs/stablecoin-price-api.md) and arbitrage opportunities
- **Payment Detection**: Instant identification of incoming [stablecoin transfers](https://docs.bitquery.io/docs/stablecoin-APIs/stablecoin-payments-api.md)
- **Multi-chain Support**: USDT, USDC, DAI, and other stablecoins across all supported chains
- **Compliance Tools**: AML/KYC support with transaction monitoring
- **Cross-chain Analytics**: Unified view of stablecoin movements across ecosystems

**Available APIs:**
- **[Stablecoin Price API](https://docs.bitquery.io/docs/stablecoin-APIs/stablecoin-price-api.md)** - Real-time price tracking and deviation monitoring
- **[Stablecoin Payments API](https://docs.bitquery.io/docs/stablecoin-APIs/stablecoin-payments-api.md)** - Payment detection and compliance tools
- **[Stablecoin Trades API](https://docs.bitquery.io/docs/stablecoin-APIs/stablecoin-trades-api.md)** - Trading data and volume analytics
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

**Learn More:** [Mempool Subscriptions](https://docs.bitquery.io/docs/subscriptions/mempool-subscriptions/)

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
- **EAP Endpoint**: Enhanced analytics platform for complex queries and calculations
- **Custom Aggregations**: Build sophisticated analytics with custom time windows and metrics
- **Cross-chain Analytics**: Unified analytics across multiple blockchain ecosystems

**Learn More:** [Advanced Features](https://docs.bitquery.io/docs/subscriptions/backfilling-subscription/)

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

**Endpoints:**
- **V2 Primary Endpoint**: `https://streaming.bitquery.io/graphql`
- **V2 EAP Endpoint**: `https://streaming.bitquery.io/eap` (for advanced analytics)
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

**Learn More:** [WebSocket Subscriptions](https://docs.bitquery.io/docs/subscriptions/websockets/)

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

**Learn More:** [Kafka Streaming Concepts](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/)

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
- **Advanced Analytics**: EAP endpoint for complex queries and analytics
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
- Try our [starter queries](https://docs.bitquery.io/docs/start/starter-queries/) for common use cases
- Use the IDE's autocomplete (Ctrl+Space) for query building
- Convert queries to subscriptions for real-time data

### 4. **Explore Blockchain-Specific APIs**
- **[Ethereum APIs](https://docs.bitquery.io/docs/blockchain/Ethereum/)** - Complete EVM ecosystem data
- **[Solana APIs](https://docs.bitquery.io/docs/blockchain/Solana/)** - High-speed blockchain analytics
- **[BSC APIs](https://docs.bitquery.io/docs/blockchain/BSC/)** - Binance Smart Chain data
- **[Trading APIs](https://docs.bitquery.io/docs/trading/)** - Real-time price and trading data

## Use Cases & Applications

### **DeFi Applications**
- **DEX Aggregators**: Best [price discovery](https://docs.bitquery.io/docs/evm/dextrades/) across multiple DEXs
- **Yield Farming**: Track liquidity positions and rewards
- **Lending Protocols**: Monitor collateral ratios and liquidations
- **Cross-chain Bridges**: Track asset movements between chains

### **Trading & Analytics**
- **Trading Bots**: Real-time price feeds with 1-second aggregation and market data via [Crypto Price API](https://docs.bitquery.io/docs/trading/crypto-price-api/introduction/)
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
- **[Complete API Documentation](https://docs.bitquery.io/docs/)** - Comprehensive guides for all features
- **[Code Examples](https://docs.bitquery.io/docs/usecases/)** - Real-world implementation examples
- **[Video Tutorials](https://docs.bitquery.io/docs/blockchain/Ethereum/)** - Step-by-step guides
- **[Postman Collection](https://www.postman.com/interstellar-eclipse-270749/workspace/bitquery)** - Ready-to-use API examples

### **Community Support**
- **[Telegram](https://t.me/Bloxy_info)** - Quick questions and community help
- **[Community Forum](https://community.bitquery.io/)** - Feature requests and technical discussions
- **[Support Desk](https://support.bitquery.io/)** - Technical issues and data problems

### **Learning Resources**
- **[Learning Path](https://docs.bitquery.io/docs/start/learning-path/)** - Structured learning from beginner to advanced
- **[Starter Queries](https://docs.bitquery.io/docs/start/starter-queries/)** - Pre-built queries for common use cases
- **[GraphQL Guide](https://docs.bitquery.io/docs/graphql/)** - Complete GraphQL reference
- **[Integration Examples](https://docs.bitquery.io/docs/usecases/)** - Real-world application examples

## Next Steps

Ready to start building with blockchain data? Here's your path forward:

1. **[Create Your Account](https://ide.bitquery.io/)** - Get instant access to our platform
2. **[Run Your First Query](https://docs.bitquery.io/docs/start/first-query/)** - Learn the basics in 5 minutes
3. **[Explore Blockchain APIs](https://docs.bitquery.io/docs/blockchain/)** - Dive into specific blockchain data
4. **[Build Real-time Applications](https://docs.bitquery.io/docs/subscriptions/)** - Set up live data streams
5. **[Join Our Community](https://t.me/Bloxy_info)** - Get help and share your projects

## Frequently Asked Questions


### Q: What is Bitquery and how is it different from other blockchain data providers?

A: Bitquery is a comprehensive blockchain data platform that provides pre-indexed, enriched, and analytics-ready data across 40+ blockchains. Unlike traditional RPC providers that offer raw node data, Bitquery provides:
- Pre-computed analytics (real-time OHLC with 1-second aggregation, moving averages, volume metrics)
- Real-time streaming via GraphQL subscriptions and Kafka
- Cross-chain aggregation and unified data views
- Historical data since blockchain genesis
- Enterprise-grade infrastructure with 99.9% uptime

### Q: Which blockchains does Bitquery support?

A: Bitquery supports 40+ blockchains across two API versions:

**V2 APIs:**
- **EVM Chains**: Ethereum, BSC, Arbitrum, Base, Polygon, Optimism, opBNB
- **Non-EVM**: Solana, Tron, TON

**V1 APIs:**
- **Supported Blockchains**: Bitcoin, Ethereum, Solana, BSC, Polygon, Bitcoin Cash, Litecoin, Bitcoin SV, Dash, Zcash, Avalanche, Klaytn, Celo, Moonbeam, Fantom, Cronos, Cosmos, Hedera, Flow, EOS, Ripple (XRP), Stellar, Algorand, Cardano, Filecoin, and more.

**Documentation:**
- **[V2 Documentation](https://docs.bitquery.io/docs/)** - Latest APIs with real-time streaming
- **[V1 Documentation](https://docs.bitquery.io/v1/)** - Comprehensive APIs with 40+ blockchain support

### Q: How accurate and reliable is the data?

A: Bitquery provides enterprise-grade data accuracy and reliability:
- **99.9% uptime** with redundant infrastructure
- **Real-time data validation** and quality filtering
- **Automatic outlier detection** and low-quality trade filtering
- **Cross-validation** with multiple data sources
- **Historical data integrity** maintained since blockchain genesis

## **API & Technical Questions**

### Q: What's the difference between GraphQL API, GraphQL subscriptions, and Kafka streaming?

A: Each interface serves different use cases:
- **GraphQL API**: Best for data queries, analytics, and applications needing flexible data retrieval
- **GraphQL Subscriptions (WebSocket)**: Ideal for real-time applications, trading bots, and live dashboards
- **Kafka Streaming**: Perfect for high-volume enterprise applications, data pipelines, and microservices

### Q: How fast is the API response time?

A: Bitquery provides sub-second response times:
- **GraphQL queries**: Typically under 1 second for most queries
- **WebSocket subscriptions**: Sub-second latency for real-time data
- **Kafka streaming**: Sub-second data delivery with guaranteed ordering
- **Complex analytics**: 2-5 seconds for heavy aggregation queries

### Q: What are the rate limits and pricing?

A: Bitquery offers flexible pricing:
- **Free Tier**: 10,000 API points for 1 month (no credit card required)
- **Enterprise**: Custom solutions with dedicated support
- **Rate limits**: Vary by plan, with enterprise customers getting higher limits

### Q: How do I authenticate with the API?

A: Bitquery uses OAuth2 for secure authentication:
1. Create an application at [account.bitquery.io](https://account.bitquery.io/user/api_v2/applications)
2. Generate an access token
3. Include the token in your requests: `Authorization: Bearer YOUR_ACCESS_TOKEN`
4. Tokens can be set with custom expiration times

## **Bitquery Data & Features Questions**

### Q: What types of blockchain data can I access?

A: Bitquery provides comprehensive blockchain data including:
- **Trading Data**: DEX trades, OHLC, volume, liquidity events
- **Token Data**: Transfers, balances, holders, supply information
- **Smart Contract Data**: Events, function calls, contract creation
- **Block Data**: Headers, transactions, gas usage, network statistics
- **NFT Data**: Transfers, collections, marketplace trades, metadata
- **Stablecoin Data**: Real-time price monitoring, payment detection, compliance tools
- **Mempool Data**: Pre-confirmation transactions, MEV detection, fee estimation
- **Advanced Analytics**: Cross-chain aggregation, custom metrics, historical analysis

### Q: Can I get real-time data?

A: Yes, Bitquery provides multiple real-time data options:
- **GraphQL Subscriptions**: Convert any query to a live stream via WebSocket
- **Kafka Streaming**: High-throughput real-time data streams
- **Mempool Monitoring**: Pre-confirmation transaction data for MEV and trading strategies
- **Stablecoin APIs**: Real-time payment detection and price monitoring

### Q: How far back does the historical data go?

A: Yes, Bitquery provides complete historical data for all supported blockchains since their respective launch dates. Historical data is permanently stored and accessible for comprehensive analysis.

### Q: Can I query data across multiple blockchains simultaneously?

A: Yes, Bitquery supports cross-chain queries:
- **Unified queries**: Query multiple blockchains in a single request
- **Cross-chain aggregation**: Get unified views of tokens across chains
- **Currency-level data**: Aggregate data for tokens like BTC across all chains
- **Cross-chain analytics**: Compare metrics across different blockchains

### Q: What are stablecoin APIs and how do they work?

A: Bitquery's stablecoin APIs provide specialized infrastructure for stablecoin applications:
- **Price Monitoring**: Track real-time price deviations from pegged values
- **Payment Detection**: Instantly identify incoming stablecoin transfers
- **Compliance Tools**: AML/KYC support with transaction monitoring
- **Multi-chain Support**: USDT, USDC, DAI across all supported blockchains
- **Cross-chain Analytics**: Unified view of stablecoin movements

### Q: How does mempool monitoring work?

A: Bitquery's mempool monitoring provides pre-confirmation data:
- **Pre-confirmation Visibility**: See transactions before they're included in blocks
- **MEV Detection**: Identify arbitrage opportunities and sandwich attacks
- **Fee Estimation**: Real-time gas price recommendations
- **Transaction Simulation**: Test transaction success before broadcasting
- **Cross-chain Support**: Monitor pending transactions across multiple chains

### Q: What advanced features are available for enterprise users?

A: Enterprise users get access to advanced capabilities:
- **EAP Endpoint**: Enhanced analytics platform for complex queries
- **Backfilling**: Automatic recovery of missing data during interruptions
- **Silent Disconnect/Reconnect**: Automatic connection management
- **Dedicated Infrastructure**: Isolated clusters for high-volume customers
- **Custom Topics**: Tailored Kafka topics for specific requirements

## **Integration & Development Questions**

### Q: What programming languages are supported?

A: Bitquery works with any programming language that supports HTTP requests:
- **JavaScript/TypeScript**: Native GraphQL support
- **Python**: Popular libraries like `requests`, `gql`, `kafka-python`
- **Go**: Built-in HTTP client and Kafka libraries
- **Java**: Spring Boot, Apache Kafka client
- **Rust**: `reqwest`, `kafka-rust` crates
- **PHP, Ruby, C#**: Standard HTTP libraries

### Q: How do I get started with development?

A: Getting started is easy:
1. **Create account**: Visit our [GraphQL IDE](https://ide.bitquery.io/)
2. **Run first query**: Try our [starter queries](https://docs.bitquery.io/docs/start/starter-queries/)
3. **Generate API key**: Set up authentication at [account management](https://account.bitquery.io/user/api_v2/applications)
4. **Explore examples**: Check our [use cases](https://docs.bitquery.io/docs/usecases/)
5. **Join community**: Get help on [Telegram](https://t.me/Bloxy_info)

### Q: Do you provide SDKs or libraries?

A: Yes, Bitquery provides several tools:
- **GraphQL IDE**: Built-in query builder and testing environment at [ide.bitquery.io](https://ide.bitquery.io/)
- **Code generation**: Auto-generate code in your preferred language
- **Postman collection**: Ready-to-use API examples in our [Postman documentation](https://docs.bitquery.io/docs/graphql/postman/)
- **Protocol Buffer schemas**: For Kafka streaming in our [Protobuf documentation](https://docs.bitquery.io/docs/streams/protobuf/)
- **TradingView SDK**: Ready-to-chart library for price data

### Q: Can I use this for commercial applications?

A: Absolutely! Bitquery is designed for both personal and commercial use:
- **Commercial licensing**: Clear terms for commercial applications
- **Enterprise support**: Dedicated support for business customers
- **SLA guarantees**: Performance and uptime guarantees for enterprise
- **Custom solutions**: Tailored solutions for specific business needs

### **Data Export & Storage Questions**

### Q: Can I export data for offline analysis?

A: Yes, Bitquery provides comprehensive data export capabilities:
- **Bulk exports**: Export large datasets for specific time ranges
- **Scheduled exports**: Automated recurring exports
- **Multiple formats**: JSON, CSV, Parquet, Protocol Buffers
- **Cloud storage**: Direct access to AWS S3 data
- **Custom filters**: Export only the data you need

### Q: What data formats are available for export?

A: Multiple formats are supported:
- **JSON**: Human-readable, nested structure
- **Parquet**: Columnar format for analytics and ML
- **CSV**: Tabular format for spreadsheets and BI tools
- **Protocol Buffers**: Binary format for high-performance applications
- **Compression**: Optional gzip and snappy compression

### Q: Can I set up automated data pipelines?

A: Yes, Bitquery supports automated data pipelines:
- **Kafka streaming**: Continuous data streams for real-time pipelines
- **Scheduled exports**: Automated data exports on custom schedules
- **Webhook integration**: Trigger external systems on data events
- **Cloud integration**: Direct integration with AWS, Google Cloud, Azure

### **Support & Community Questions**

### Q: What support options are available?

A: Bitquery provides multiple support channels:
- **Documentation**: Comprehensive guides and API reference at [docs.bitquery.io](https://docs.bitquery.io/)
- **Community Forum**: Technical discussions and feature requests at [community.bitquery.io](https://community.bitquery.io/)
- **Telegram**: Quick questions and community help on [Telegram](https://t.me/Bloxy_info)
- **Discord**: Developer community and discussions on [Discord](https://discord.gg/bitquery)
- **Support Desk**: Technical issues and data problems at [support.bitquery.io](https://support.bitquery.io/)
- **Enterprise Support**: Dedicated support for enterprise customers

### Q: Is there a community or developer resources?

A: Yes, Bitquery has an active developer community:
- **Learning Path**: Structured learning from beginner to advanced in our [learning path guide](https://docs.bitquery.io/docs/start/learning-path/)
- **Video Tutorials**: Step-by-step guides and examples
- **Code Examples**: Real-world implementation examples in our [examples section](https://docs.bitquery.io/docs/examples/)
- **Community Forum**: Share knowledge and get help at [community.bitquery.io](https://community.bitquery.io/)
- **GitHub**: Open source tools and examples

### Q: How do I report bugs or request features?

A: You can report issues and request features through:
- **Support Desk**: [support.bitquery.io](https://support.bitquery.io/) for bugs
- **Community Forum**: [community.bitquery.io](https://community.bitquery.io/) for feature requests
- **Telegram**: Quick questions and community feedback on [Telegram](https://t.me/Bloxy_info)
- **Enterprise customers**: Direct contact with dedicated support team

### **Enterprise & Scaling Questions**

### Q: Do you offer enterprise solutions?

A: Yes, Bitquery provides enterprise-grade solutions:
- **Dedicated infrastructure**: Isolated clusters for high-volume customers
- **Custom SLAs**: Performance and uptime guarantees
- **Priority support**: Dedicated support team
- **Custom topics**: Tailored Kafka topics for specific needs
- **Volume discounts**: Reduced rates for high-volume usage

### Q: How does Bitquery handle high-volume applications?

A: Bitquery is designed for scale:
- **Auto-scaling**: Infrastructure scales with your usage
- **Kafka streaming**: Handle millions of events per second
- **Load balancing**: Automatic traffic distribution
- **Monitoring**: Comprehensive metrics and alerting

### Q: What are the data retention policies?

A: Bitquery provides flexible data retention:
- **Historical data**: Permanently stored since blockchain genesis
- **Real-time data**: Available for immediate querying
- **Kafka topics**: Configurable retention (7 days to 1 year)
- **Export data**: Custom retention based on your needs
- **Backup policies**: Multiple backups for data safety

---

**Start building the future of blockchain applications today with Bitquery's comprehensive multi-chain data platform.**
