---
title: "Crypto Tokens OHLC Candle K-Line API"
description: "Get real-time and historical OHLC (Open, High, Low, Close) candle data, K-line charts, and price analytics for crypto tokens across all supported blockchains. Perfect for trading bots, charting applications, and market analysis."
keywords: ["OHLC API", "crypto candle data", "K-line API", "real-time price data", "crypto trading API", "blockchain price data", "candlestick charts", "crypto market data", "trading bot API", "crypto analytics", "multi-chain price data", "DEX price API", "crypto streaming API", "Kafka crypto data", "TradingView integration", "crypto arbitrage API"]
---

# Crypto Tokens OHLC Candle K-Line API - Real-Time & Historical Price Data

Get real-time and historical OHLC (Open, High, Low, Close) candle data, K-line charts, and price analytics for crypto tokens across all supported blockchains including Ethereum, Solana, BSC, Polygon, and Tron.

## What is OHLC Data?

OHLC (Open, High, Low, Close) data, also known as candlestick or K-line data, is the foundation of technical analysis in cryptocurrency trading. Each OHLC candle represents price movement over a specific time interval:

- **Open**: The first price recorded in the interval
- **High**: The highest price reached during the interval  
- **Low**: The lowest price reached during the interval
- **Close**: The last price recorded in the interval

Our [Crypto Price API](https://docs.bitquery.io/docs/trading/crypto-price-api/introduction/) provides pre-aggregated OHLC data with ultra-low latency, perfect for building trading applications, charting libraries, and real-time analytics dashboards.

**Important Note**: The [Crypto Price API](https://docs.bitquery.io/docs/trading/crypto-price-api/introduction/) currently provides real-time data and the last 7 days of price history. For full historical OHLC data beyond 7 days, you should use [DEXTradeByToken](https://docs.bitquery.io/docs/evm/dextradesbyTokens/), which supports both real-time and complete historical data.

## Getting Started

### **Quick Start Steps**

1. **Get API Key**: Sign up at [Bitquery IDE](https://ide.bitquery.io) to get your API key
2. **Choose Your Method**: git s
   - **GraphQL Queries**: For APIs
   - **WebSocket Streams**: For real-time data feeds
   - **Kafka**: For high-throughput applications with high degree of relibility
3. **Select the Right Cube**: Choose between Currency, Tokens, or Pairs based on your needs
4. **Start with Examples**: Use our ready-to-run examples below

### **Your First OHLC Query**

Get real-time Bitcoin OHLC data across all chains:

```graphql
subscription {
  Trading {
    Currencies(
      where: {
        Currency: { Id: { is: "bid:bitcoin" } },
        Interval: { Time: { Duration: { eq: 60 } } }
      }
    ) {
      Currency {
        Id
        Name
        Symbol
      }
      Price {
        Ohlc {
          Open
          High
          Low
          Close
        }
      }
      Volume {
        Usd
      }
    }
  }
}
```

[Run this query ➤](https://ide.bitquery.io/bitcoin-currency-price-stream)

### **API Endpoints**

- **GraphQL Endpoint**: `https://streaming.bitquery.io/graphql`
- **EAP Endpoint**: `https://streaming.bitquery.io/eap`
- **Topic**: `trading.prices`. Please contact sales for a trial username, password.

## Why Use Our OHLC API?

### **Pre-Aggregated Data**
- No need to calculate OHLC from raw trade data
- Ready-to-use candlestick data for any time interval
- Optimized for performance and accuracy
- Uses pre-aggregated price data updated in real-time

### **Multi-Chain Support**
- Get OHLC data across all major blockchains
- Chain-agnostic currency views (e.g., Bitcoin across all chains)
- Cross-chain price aggregation

### **Real-Time Streaming**
- WebSocket subscriptions for live OHLC updates
- Kafka streams for high-throughput applications
- Sub-second latency for trading applications

### **Advanced Analytics**
- Moving averages (SMA, WMA, EMA)
- Volume-weighted prices
- Price change calculations
- Technical indicators

## Crypto Price API vs DEXTradeByToken

Understanding the key differences between these two approaches for getting OHLC data:

| Feature | Crypto Price API | DEXTradeByToken |
|---------|------------------|-----------------|
| **Data Availability** | Real-time + Last 7 days | Real-time + Complete historical |
| **Data Processing** | Pre-aggregated and real time aggregation of price data | Raw trades aggregated on-the-fly |
| **Data Quality** | Filtered, clean price feed | All trades included |

### **When to Use Crypto Price API:**
- Real-time trading applications requiring normalized pricing
- Live charting and dashboards with aggregated price feeds
- High-frequency trading strategies with sub-second updates
- Limit order execution with reliable mark prices
- Futures trading and derivatives pricing
- Lending and borrowing protocols requiring accurate rates
- DeFi applications needing real-time price oracles
- Any application requiring reliable real-time price streams
- Fixed time intervals available due to pre-aggregated data


### **When to Use DEXTradeByTokens API:**

- When Actual Trades are required 
- Complete price history requirements
- Any time interval can be used as it do aggregation in real time


## Supported Time Intervals

Our [Crypto Price API](https://docs.bitquery.io/docs/trading/crypto-price-api/introduction/) OHLC API supports fixed time intervals optimized for different trading strategies:

| Interval | Duration |
|----------|----------|
| 1 second | 1s |
| 3 seconds | 3s |
| 5 seconds | 5s |
| 10 seconds | 10s |
| 30 seconds | 30s |
| 1 minute | 60s |
| 5 minutes | 300s |
| 15 minutes | 900s |
| 30 minutes | 1800s |
| 1 hour | 3600s |

## Volume-Based Aggregation

For volume-driven analysis, we also support volume-based intervals:

- **$1,000 USD**
- **$10,000 USD**  
- **$100,000 USD**
- **$1,000,000 USD**

## Choosing the Right Cube for OHLC Data

The [Crypto Price API](https://docs.bitquery.io/docs/trading/crypto-price-api/introduction/) offers three different cubes for accessing OHLC data. Understanding which cube to use is crucial for getting the right data for your specific use case:

Before we dive into the cubes, let's clarify the key terminology:

**Currency** - The underlying asset (e.g., BTC, ETH, SOL)
**Token** - Specific implementations of a currency on blockchains (e.g., cbBTC, WBTC are Bitcoin tokens)
**Pair** - Trading pairs between two assets (e.g., cbBTC/ETH, WBTC/ETH, WBTC/SOL)


### **Currency Cube** - Chain-Agnostic Aggregated View

Use the **Currency** cube when you want a unified price view of an asset across all blockchains.

**Key Features:**
- Aggregates all token representations of the same underlying asset for example for BTC it will combine multiple tokens like WBTC, cbBTC, LBTC etc.
- Can provide both chain specific and chain agnostic prices
- Can provide only USD-quoted prices
- Can combine volume and price data from all chains

[Learn more about Currency Cube ➤](https://docs.bitquery.io/docs/trading/crypto-price-api/currency/)

### **Tokens Cube** - Chain-Specific Token Data

Use the **Tokens** cube when you need OHLC data for a specific token on a specific blockchain.

**Key Features:**
- Aggregates across all pairs for that token
- Can provide both chain specific and chain agnostic prices
- Can provide only USD-quoted prices
- Can combine volume and price data from all chains


[Learn more about Tokens Cube ➤](https://docs.bitquery.io/docs/trading/crypto-price-api/tokens/)

### **Pairs Cube** - Trading Pair Specific Data

Use the **Pairs** cube when you need OHLC data for specific trading pairs on specific DEXs.

**Key Features:**
- Pair-specific OHLC data (e.g., ETH/USDC on Uniswap)
- Can be quoted in USD or quote token
- Market/DEX-specific data
- Most granular level of price data


[Learn more about Pairs Cube ➤](https://docs.bitquery.io/docs/trading/crypto-price-api/pairs/)

## Real-Time OHLC Stream Examples

### 1. Live Bitcoin OHLC Across All Chains

Stream real-time Bitcoin OHLC data aggregated from all supported blockchains (Bitcoin, Ethereum WBTC, Solana, etc.) with 60-second intervals:

```graphql
subscription {
  Trading {
    Currencies(
      where: {
        Currency: { Id: { is: "bid:bitcoin" } },
        Interval: { Time: { Duration: { eq: 60 } } }
      }
    ) {
      Currency {
        Id
        Name
        Symbol
      }
      Block {
        Date
        Time
        Timestamp
      }
      Interval {
        Time {
          Start
          Duration
          End
        }
      }
      Volume {
        Base
        BaseAttributedToUsd
        Quote
        Usd
      }
      Price {
        IsQuotedInUsd
        Ohlc {
          Open    # First price in interval
          High    # Highest price in interval
          Low     # Lowest price in interval
          Close   # Last price in interval
        }
        Average {
          Mean
          SimpleMoving
          WeightedSimpleMoving
          ExponentialMoving
        }
      }
    }
  }
}
```

[Run Live Stream ➤](https://ide.bitquery.io/OHLC-of-a-currency-on-multiple-blockchains)

### 2. Ethereum OHLC on All DEXs

Get real-time Ethereum OHLC data from all decentralized exchanges:

```graphql
subscription {
  Trading {
    Pairs(
      where: {Currency: {Id: {is: "bid:eth"}}, Interval: {Time: {Duration: {eq: 60}}}}
    ) {
      Token {
        Symbol
        Network
        Address
      }
      QuoteToken {
        Symbol
        Network
        Address
      }
      Market {
        Name
        Protocol
        Network
        Address
      }
      Interval {
        Time {
          Start
          Duration
          End
        }
      }
      Volume {
        Base
        Quote
        Usd
      }
      Price {
        IsQuotedInUsd
        Ohlc {
          Open
          High
          Low
          Close
        }
        Average {
          Mean
          SimpleMoving
          WeightedSimpleMoving
          ExponentialMoving
        }
      }
    }
  }
}
```

[Run Live Stream ➤](https://ide.bitquery.io/All-pairs-of-ETH-currency)

### 3. Solana Token OHLC Stream

Monitor all Solana tokens with real-time OHLC data:

```graphql
subscription {
  Trading {
    Tokens(
      where: {
        Token: { Network: { is: "Solana" } },
        Interval: { Time: { Duration: { eq: 60 } } }
      }
    ) {
      Token {
        Address
        Id
        IsNative
        Name
        Network
        Symbol
        TokenId
      }
      Block {
        Date
        Time
        Timestamp
      }
      Interval {
        Time {
          Start
          Duration
          End
        }
      }
      Volume {
        Base
        Quote
        Usd
      }
      Price {
        IsQuotedInUsd
        Ohlc {
          Close
          High
          Low
          Open
        }
        Average {
          ExponentialMoving
          Mean
          SimpleMoving
          WeightedSimpleMoving
        }
      }
    }
  }
}
```

[Run Live Stream ➤](https://ide.bitquery.io/Aggregated-Price-of-all-tokens-in-real-time-on-one-chain)

## Historical OHLC Queries

**Note**: The following examples work for the last 7 days of data. For historical data beyond 7 days, use [DEXTradeByToken](https://docs.bitquery.io/docs/evm/dextradesbyTokens/).

### 1. Bitcoin Historical OHLC (Last 7 Days)

Get historical Bitcoin OHLC data for the last 7 days.

[Run Query](https://ide.bitquery.io/historical-Bitcoin-OHLC-data-for-the-last-7-days)

```graphql
{
  Trading {
    Currencies(
      where: {
        Currency: { Id: { is: "bid:bitcoin" } },
        Interval: { Time: { Duration: { eq: 3600 } } },
        Block: {Time:{
          since_relative:{days_ago:7}
        }}
      },
      limit: { count: 240 },
      orderBy: { descending: Block_Time }
    ) {
      Currency {
        Id
        Name
        Symbol
      }
      Block {
        Date
        Time
        Timestamp
      }
      Interval {
        Time {
          Start
          Duration
          End
        }
      }
      Volume {
        Base
        BaseAttributedToUsd
        Quote
        Usd
      }
      Price {
        IsQuotedInUsd
        Ohlc {
          Open
          High
          Low
          Close
        }
        Average {
          Mean
          SimpleMoving
          WeightedSimpleMoving
          ExponentialMoving
        }
      }
    }
  }
}
```

### 2. Top 10 Tokens by 5-Minute Price Change

Find the biggest movers with OHLC data and price change calculations:

```graphql
{
  Trading {
    Tokens(
      limit: { count: 10 }
      orderBy: { descendingByField: "change" }
      where: {
        Price: { IsQuotedInUsd: true }
        Volume: { Usd: { gt: 100000 } }
        Interval: { Time: { Duration: { eq: 300 } } }
      }
    ) {
      Token {
        Address
        Id
        IsNative
        Name
        Network
        Symbol
        TokenId
      }
      Currency {
        Symbol
        Id
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
        Base
        BaseAttributedToUsd
        Quote
        Usd
      }
      Price {
        IsQuotedInUsd
        Ohlc {
          Close
          High
          Low
          Open
        }
        Average {
          Estimate
          ExponentialMoving
          Mean
          SimpleMoving
          WeightedSimpleMoving
        }
      }
      diff: calculate(expression: "Price_Ohlc_Close - Price_Ohlc_Open")
      change: calculate(expression: "round(($diff / Price_Ohlc_Open), 3) * 100")
    }
  }
}
```

[Run Query ➤](https://ide.bitquery.io/5-minute-price-change-api)

## DEX-Specific OHLC Streams

### 1. Uniswap v3 OHLC Stream

Monitor all tokens on Uniswap v3 with 1-second OHLC data:

```graphql
subscription {
  Trading {
    Pairs(
      where: {
        Interval: { Time: { Duration: { eq: 1 } } },
        Price: { IsQuotedInUsd: true },
        Market: { 
          Network: { is: "Ethereum" },
          Address: { is: "0x1f98431c8ad98523631ae4a59f267346ea31f984" }
        }
      }
    ) {
      Market {
        Protocol
        Program
        Network
        Name
        Address
      }
      Block {
        Date
        Time
        Timestamp
      }
      Interval {
        Time {
          Start
          Duration
          End
        }
      }
      Volume {
        Base
        Quote
        Usd
      }
      Price {
        Ohlc {
          Close
          High
          Low
          Open
        }
        IsQuotedInUsd
      }
      Currency {
        Symbol
        Name
        Id
      }
      QuoteCurrency {
        Name
        Symbol
        Id
      }
      Token {
        Name
        Symbol
        Address
        Id
        NetworkBid
      }
      QuoteToken {
        Name
        Symbol
        Id
        Address
        NetworkBid
      }
    }
  }
}
```

[Run Stream ➤](https://ide.bitquery.io/Uniswap-v3-DEX-tokens-1-second-price-stream-with-OHLC)

### 2. Raydium OHLC Stream (Solana)

Track all tokens on Raydium with real-time OHLC data:

```graphql
subscription {
  Trading {
    Pairs(
      where: {
        Interval: { Time: { Duration: { eq: 1 } } },
        Price: { IsQuotedInUsd: true },
        Market: { 
          Network: { is: "Solana" },
          Program: { is: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8" }
        }
      }
    ) {
      Market {
        Protocol
        Program
        Network
        Name
        Address
      }
      Block {
        Date
        Time
        Timestamp
      }
      Interval {
        Time {
          Start
          Duration
          End
        }
      }
      Volume {
        Base
        Quote
        Usd
      }
      Price {
        Ohlc {
          Close
          High
          Low
          Open
        }
        IsQuotedInUsd
      }
      Currency {
        Symbol
        Name
        Id
      }
      QuoteCurrency {
        Name
        Symbol
        Id
      }
      Token {
        Name
        Symbol
        Address
        Id
        NetworkBid
      }
      QuoteToken {
        Name
        Symbol
        Id
        Address
        NetworkBid
      }
    }
  }
}
```

[Run Stream ➤](https://ide.bitquery.io/Raydium-Launchpad-DEX-tokens-1-second-price-stream-with-OHLC)

### 3. PancakeSwap v3 OHLC Stream (BSC)

Monitor BSC tokens on PancakeSwap v3:

```graphql
subscription {
  Trading {
    Pairs(
      where: {
        Interval: { Time: { Duration: { eq: 1 } } },
        Price: { IsQuotedInUsd: true },
        Market: { 
          Network: { is: "Binance Smart Chain" },
          Address: { is: "0x0bfbcf9fa4f9c56b0f40a671ad40e0805a091865" }
        }
      }
    ) {
      Market {
        Protocol
        Program
        Network
        Name
        Address
      }
      Block {
        Date
        Time
        Timestamp
      }
      Interval {
        Time {
          Start
          Duration
          End
        }
      }
      Volume {
        Base
        Quote
        Usd
      }
      Price {
        Ohlc {
          Close
          High
          Low
          Open
        }
        IsQuotedInUsd
      }
      Currency {
        Symbol
        Name
        Id
      }
      QuoteCurrency {
        Name
        Symbol
        Id
      }
      Token {
        Name
        Symbol
        Address
        Id
        NetworkBid
      }
      QuoteToken {
        Name
        Symbol
        Id
        Address
        NetworkBid
      }
    }
  }
}
```

[Run Stream ➤](https://ide.bitquery.io/PancakeSwap-v3-DEX-tokens-1-second-price-stream-with-OHLC)

## Kafka Streaming for OHLC Data

For high-throughput applications, use our Kafka streams to get real-time OHLC data:

### Kafka Topic: `trading.prices`

The Kafka topic delivers real-time, pre-aggregated OHLC data for all supported tokens and currencies.

**Schema**: [Protobuf Schema](https://github.com/bitquery/streaming_protobuf/tree/main/market)

**Packages**:
- [Python Package](https://pypi.org/project/bitquery-pb2-kafka-package/)
- [NPM Package](https://www.npmjs.com/package/bitquery-protobuf-schema)

### Kafka Consumer Example (Python)

```python
from kafka import KafkaConsumer
import bitquery_pb2

# Configure Kafka consumer
consumer = KafkaConsumer(
    'trading.prices',
    bootstrap_servers=['your-kafka-broker:9092'],
    value_deserializer=lambda m: bitquery_pb2.PriceIndexMessage().ParseFromString(m)
)

# Consume OHLC data
for message in consumer:
    price_data = message.value
    
    # Extract OHLC data
    ohlc = price_data.price.ohlc
    print(f"Token: {price_data.token.symbol}")
    print(f"Open: {ohlc.open}")
    print(f"High: {ohlc.high}")
    print(f"Low: {ohlc.low}")
    print(f"Close: {ohlc.close}")
    print(f"Volume: {price_data.volume.usd}")
    print("---")
```

### Kafka Consumer Example (Node.js)

```javascript
const kafka = require('kafkajs');
const { PriceIndexMessage } = require('bitquery-protobuf-schema');

const client = kafka({
  clientId: 'ohlc-consumer',
  brokers: ['your-kafka-broker:9092']
});

const consumer = client.consumer({ groupId: 'ohlc-group' });

async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'trading.prices' });
  
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const priceData = PriceIndexMessage.decode(message.value);
      
      // Extract OHLC data
      const ohlc = priceData.price.ohlc;
      console.log(`Token: ${priceData.token.symbol}`);
      console.log(`Open: ${ohlc.open}`);
      console.log(`High: ${ohlc.high}`);
      console.log(`Low: ${ohlc.low}`);
      console.log(`Close: ${ohlc.close}`);
      console.log(`Volume: ${priceData.volume.usd}`);
      console.log('---');
    },
  });
}

run().catch(console.error);
```

## TradingView Integration

Our OHLC API is perfect for TradingView charting. Use our ready-to-use SDK:

### TradingView SDK

```javascript
import { BitqueryTradingViewDatafeed } from '@bitquery/tradingview-sdk';

const datafeed = new BitqueryTradingViewDatafeed({
  apiKey: 'your-bitquery-api-key',
  token: 'BTC', // or any supported token
  interval: '1m', // 1m, 5m, 15m, 1h, etc.
});

// Initialize TradingView widget
const widget = new TradingView.widget({
  symbol: 'BTC/USD',
  interval: '1m',
  container: 'tradingview_chart',
  datafeed: datafeed,
  library_path: '/tradingview/',
  locale: 'en',
  disabled_features: ['use_localstorage_for_settings'],
  enabled_features: ['study_templates'],
  charts_storage_url: 'https://saveload.tradingview.com',
  charts_storage_api_version: '1.1',
  client_id: 'tradingview.com',
  user_id: 'public_user_id',
  fullscreen: false,
  autosize: true,
});
```

[Get TradingView SDK ➤](https://www.npmjs.com/package/@bitquery/tradingview-sdk)

## Advanced OHLC Analytics

### 1. Price Change Analysis

Calculate percentage price changes using expressions:

```graphql
{
  Trading {
    Tokens(
      where: {
        Price: { IsQuotedInUsd: true },
        Volume: { Usd: { gt: 100000 } },
        Interval: { Time: { Duration: { eq: 300 } } }
      }
    ) {
      Token {
        Symbol
        Network
      }
      Price {
        Ohlc {
          Open
          Close
        }
      }
      # Calculate price change percentage
      priceChange: calculate(expression: "((Price_Ohlc_Close - Price_Ohlc_Open) / Price_Ohlc_Open) * 100")
      # Calculate absolute price change
      priceDiff: calculate(expression: "Price_Ohlc_Close - Price_Ohlc_Open")
    }
  }
}
```

### 2. Volume-Weighted OHLC

Get volume-weighted OHLC data for more accurate price representation:

```graphql
subscription {
  Trading {
    Pairs(
      where: {
        Currency: { Id: { is: "bid:eth" } },
        Interval: { Time: { Duration: { eq: 60 } } }
      }
    ) {
      Token {
        Symbol
      }
      Volume {
        Base
        Quote
        Usd
      }
      Price {
        Ohlc {
          Open
          High
          Low
          Close
        }
        Average {
          WeightedSimpleMoving  # Volume-weighted average
          Mean                  # Simple average
        }
      }
    }
  }
}
```

### 3. Cross-Chain Arbitrage Detection

Find arbitrage opportunities using OHLC data across chains:

```graphql
{
  Trading {
    Pairs(
      where: {
        Currency: { Id: { is: "bid:bitcoin" } },
        QuoteCurrency: { Id: { is: "usdt" } }
      },
      limit: { count: 10 },
      orderBy: { descending: Block_Time },
      limitBy: { by: Market_Address, count: 1 }
    ) {
      Currency {
        Name
        Symbol
      }
      Market {
        Name
        Network
        Address
      }
      Price {
        Ohlc {
          Close
        }
        Average {
          Mean
        }
      }
      QuoteCurrency {
        Symbol
      }
    }
  }
}
```

[Run Query ➤](https://ide.bitquery.io/Find-arbitrage-opportunity-with-same-token-across-chains)

## Supported Blockchains

Our OHLC API supports all major blockchains:

- **Ethereum** - ETH, ERC-20 tokens
- **Solana** - SOL, SPL tokens  
- **Binance Smart Chain (BSC)** - BNB, BEP-20 tokens
- **Polygon** - MATIC, ERC-20 tokens
- **Arbitrum** - ETH, ERC-20 tokens
- **Optimism** - ETH, ERC-20 tokens
- **Base** - ETH, ERC-20 tokens
- **Tron** - TRX, TRC-20 tokens

## API Endpoints

- **GraphQL Endpoint**: `https://streaming.bitquery.io/graphql`
- **EAP Endpoint**: `https://streaming.bitquery.io/eap`
- **Kafka Broker**: `streaming.bitquery.io:9092`
- **Topic**: `trading.prices`



## Best Practices

1. **Choose the Right API**: Use [Crypto Price API](https://docs.bitquery.io/docs/trading/crypto-price-api/introduction/) for real-time data and recent history (7 days), DEXTradeByToken for complete historical data
2. **Choose the Right Interval**: Use 1s for high-frequency trading, 1m for standard charting
3. **Use USD Quoting**: Set `IsQuotedInUsd: true` for consistent price comparison

## Support

- **Documentation**: [Crypto Price API Docs](https://docs.bitquery.io/docs/trading/crypto-price-api/)
- **IDE**: [Bitquery IDE](https://ide.bitquery.io)
- **Community**: [Discord](https://discord.gg/bitquery)
- **Support**: [Contact Support](https://bitquery.io/contact)

---

*Get started with real-time OHLC data today and build the next generation of crypto trading applications.*
