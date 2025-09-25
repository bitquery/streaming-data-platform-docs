---
title: "Limit Order Price API"
description: "Use our crypto price API for limit orders to get reliable price for limit order execution. Our limit order price API prevents false triggers with aggregated price feeds and dampening mechanisms."
keywords:
  [
    "limit order price api",
    "crypto price api for limit orders",
    "price for limit order",
    "limit orders",
    "crypto price data",
    "aggregated prices",
    "trading bot",
    "stop loss",
    "take profit",
    "algorithmic trading",
    "price aggregation",
    "trading automation",
    "false triggers",
    "risk management",
    "real-time price feed",
    "limit order execution",
    "trading price api",
    "crypto limit orders"
  ]
---

# Limit Order Price API: Crypto Price API for Limit Orders

## The Problem: Why Raw Trade Data Fails for Limit Orders

Finding reliable price for limit order execution is critical for automated trading systems. Raw DEX trade data creates unreliable price signals that trigger false limit order executions, making a dedicated limit order price API essential for trading platforms.

### **Pool-Based Monitoring Issues**
Current platforms monitor pool-based DEX streams filtered by specific addresses, but sometimes even a $500 trade can move prices 20-50% in less liquid pools:

- **False triggers**: Price spikes cause unintended executions, requiring complex retry logic
- **No pre-execution validation**: Systems skip validation to avoid latency, relying on user slippage tolerance
- **User behavior**: Traders gravitate toward liquid pools, leaving smaller pools vulnerable
- **System complexity**: Sophisticated retry mechanisms needed for erratic executions
- **Poor execution**: Bad price signals reduce user confidence

### **Cross-DEX Price Fragmentation**
The same token can trade at vastly different prices (e.g., $100 on Uniswap vs $95 on SushiSwap) due to liquidity isolation, arbitrage delays, and varying AMM formulas.

## The Solution: Aggregated Price Streams

Bitquery's [Crypto Price API for limit orders](https://docs.bitquery.io/docs/trading/crypto-price-api/introduction/) provides **aggregated price data** with built-in dampening mechanisms, serving as a reliable limit order price API:

**Multi-pool aggregation** across all major DEXs  
**Cross-chain price discovery** for market-wide pricing  
**Real-time USD pricing** with built-in conversion  
**Time & volume thresholds** preventing manipulation

[Try the API live ➤](https://ide.bitquery.io/1-second-crypto-price-stream)

### How Price Aggregation Works

#### 1. **Time-Based Aggregation (1s to 1h)**
- **1-3s**: High-frequency trading with minimal smoothing
- **5s**: Optimal for most automated platforms  
- **30s**: Swing trading with reduced noise
- **1h**: Long-term portfolio management

#### 2. **Volume Thresholds ($1K to $1M)**
- **$1K+**: Small-cap tokens
- **$10K+**: Mid-cap tokens  
- **$100K+**: High-cap tokens
- **$1M+**: Enterprise stability

#### 3. **Multi-Chain Coverage**
- **Ethereum**: Uniswap, SushiSwap, Curve, 1inch
- **Solana**: Raydium, Orca, Jupiter
- **BSC**: PancakeSwap, Venus
- **Cross-chain normalization** for unified pricing

#### 4. **Bad Trade Filtering**
Automatic outlier removal:
- Statistical anomaly detection
- Flash loan/MEV attack filtering  
- Moving averages (SMA, WMA, EMA)
- Anomaly-resistant OHLC



## TradingView Integration

TradingView integration can be achieved through a custom datafeed that connects to Bitquery's real-time price streams. The datafeed supports multiple timeframe resolutions (1s to 1h), subscribes to real-time OHLC data via WebSocket, and provides the structured bar data format that TradingView requires for live chart updates. This enables professional-grade charting with institutional-quality aggregated price data.

[View live TradingView demo ➤](https://github.com/bitquery/tradingview-subscription-realtime/tree/main#demo)

### **Production Resources**

**Complete Tutorial**: Follow our comprehensive [TradingView Real-Time Streaming Tutorial](https://docs.bitquery.io/docs/usecases/tradingview-subscription-realtime/getting-started/) that shows how to integrate Bitquery's Crypto Price API with TradingView's Advanced Charts.

**Production-Ready Code**: 
- **GitHub Repository**: [Complete implementation examples](https://github.com/bitquery/tradingview-subscription-realtime/tree/main)
- **NPM SDK**: [`@bitquery/tradingview-sdk`](https://www.npmjs.com/package/@bitquery/tradingview-sdk) - Ready-to-chart SDK with copy-paste integration

**Quick Start**: Simply copy the Advanced Charting Library into your project, add your Bitquery access token, and you're ready to stream real-time crypto price data to TradingView charts.

## Raw vs Aggregated Price Data: Real Examples

### **Raw Trade Data Issues (DEXTradeByTokens API)**

Using raw DEX trade data directly can lead to unreliable limit order triggers. Here's what you typically see:

**Example: ETH Price Volatility from Raw Trades**
```graphql
subscription {
  EVM {
    DEXTradeByTokens(
      where: {Trade: {Currency: {Symbol: {is: "WETH"}}}}
    ) {
      Trade {
        PriceInUSD
        AmountInUSD
      }
      Block {
        Time
      }
    }
  }
}
```
[Run this query ➤](https://ide.bitquery.io/ETH-price-raw-trades)

**Typical Raw Data Results:**
- **12:00:01** - $2,420.15 (normal trade)
- **12:00:02** - $3,890.44 (**+60% spike** from $500 sandwich attack)
- **12:00:03** - $2,418.33 (back to normal)
- **12:00:04** - $1,205.67 (**-50% crash** from MEV bot)
- **12:00:05** - $2,422.89 (normal again)

**Result**: Your limit orders at $2,500 would trigger falsely on the $3,890 spike, executing at poor prices.

### **Aggregated Price Data Solution (Crypto Price API)**

The same ETH data through aggregated price feeds provides stability:

**Example: ETH Price with 5-Second Time Aggregation**
```graphql
subscription {
  Trading {
    Tokens(
      where: {
        Token: {Symbol: {is: "WETH"}, Network: {is: "ethereum"}}
        Interval: {Time: {Duration: {eq: 5}}}
      }
    ) {
      Price {
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
        }
      }
      Volume {
        Usd
      }
    }
  }
}
```
[Run this query ➤](https://ide.bitquery.io/ETH-aggregated-5s-intervals)

**Aggregated Results (Same Time Period):**
- **12:00:05** - OHLC: $2,420/$2,425/$2,418/$2,423 (**Stable range**)
- **Mean Price**: $2,421.50 (outliers filtered)
- **Volume**: $847,500 (sufficient for reliability)

**Result**: Your limit order at $2,500 remains inactive, preventing false execution.

## Types of Aggregation Available

### **1. Time-Based Aggregation**

**Available Intervals**: `1, 3, 5, 10, 30, 60, 300, 900, 1800, 3600` seconds

**Use Cases by Interval:**
- **1-3 seconds**: High-frequency trading with minimal smoothing
- **5-10 seconds**: Standard automated trading platforms 
- **30-60 seconds**: Swing trading and portfolio management
- **15+ minutes**: Long-term position management

**Production Examples**: 
- [Real-time 1-second price stream ➤](https://ide.bitquery.io/1-second-crypto-price-stream)
- [Multi-timeframe aggregation ➤](https://ide.bitquery.io/crypto-price-multiple-intervals)
- [Volume-based thresholds ➤](https://ide.bitquery.io/volume-threshold-pricing)

### **2. Volume-Based Aggregation**

**Available Thresholds**: `$1,000, $10,000, $100,000, $1,000,000`

```graphql
subscription {
  Trading {
    Tokens(
      where: {
        Token: {Symbol: {is: "USDC"}}
        Interval: {TargetVolume: {eq: 100000}}
      }
    ) {
      Price {
        Ohlc {
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
[Try volume-based aggregation ➤](https://ide.bitquery.io/volume-based-price-aggregation)

**Example Results**:
- **$100k volume threshold**: Price updates only when $100k+ traded
- **Result**: Ultra-stable pricing, immune to low-volume manipulation
- **Update frequency**: Variable (every 30 seconds to 5 minutes depending on activity)

### **3. Multi-Chain Currency Aggregation**

**Cross-chain Bitcoin pricing example:**
```graphql
subscription {
  Trading {
    Currencies(
      where: {Currency: {Id: {is: "bid:bitcoin"}}}
    ) {
      Price {
        Ohlc {
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
[Run cross-chain Bitcoin query ➤](https://ide.bitquery.io/bitcoin-cross-chain-price)

**Aggregation Sources**:
- Native BTC on Bitcoin network
- WBTC on Ethereum
- Wrapped BTC on Solana  
- cbBTC on Base

**Result**: True market-wide Bitcoin price, not isolated to single chain.

### **4. Pair-Specific Market Data**

**Example: SOL/USDC on Raydium**
```graphql
subscription {
  Trading {
    Pairs(
      where: {
        Market: {Protocol: {is: "Raydium"}}
        Token: {Symbol: {is: "SOL"}}
        QuoteToken: {Symbol: {is: "USDC"}}
      }
    ) {
      Price {
        Ohlc {
          Close
        }
      }
      Volume {
        Base
        Quote
        Usd
      }
    }
  }
}
```
[Try SOL/USDC pair data ➤](https://ide.bitquery.io/SOL-USDC-pair-trading-data)

**Use Case**: Market-making, arbitrage detection, DEX-specific strategies.

## Production Resources & Documentation

### **Implementation Guides**
- **[Crypto Price API Documentation](https://docs.bitquery.io/docs/trading/crypto-price-api/introduction/)** - Complete API reference with live examples
- **[DEX Trade Filtering Guide](https://docs.bitquery.io/docs/usecases/how-to-filter-anomaly-prices/)** - How to handle raw data anomalies
- **[OHLC Candlestick API](https://docs.bitquery.io/docs/trading/crypto-price-api/crypto-ohlc-candle-k-line-api/)** - Ready-to-chart data with [live Bitcoin OHLC example ➤](https://ide.bitquery.io/bitcoin-currency-price-stream)
- **[DEXTradeByTokens API](https://docs.bitquery.io/docs/evm/dextradesbyTokens/)** - Raw trade data for comparison

### **Real-Time Streaming**
- **GraphQL Endpoint**: `https://streaming.bitquery.io/graphql` ([Try in IDE ➤](https://ide.bitquery.io/?endpoint=https://streaming.bitquery.io/graphql))
- **Kafka Topic**: `trading.prices` ([Schema & SDKs ➤](https://github.com/bitquery/streaming_protobuf/tree/main/market))
- **WebSocket Subscriptions**: Convert any query to `subscription` for real-time data ([WebSocket Guide ➤](https://docs.bitquery.io/docs/subscriptions/websockets/))

## **Proven Production Benefits**
Based on real trading platform implementations ([see live comparison ➤](https://ide.bitquery.io/raw-vs-aggregated-price-comparison)):
- **81% reduction** in false triggers from price spike dampening
- **Eliminated retry logic complexity** through built-in price stability
- **Universal pool coverage** removing need for manual liquidity selection
- **Improved execution quality** leading to higher user confidence
- **Reduced system latency** by eliminating pre-execution quote validation needs

## **Technical Advantages Over Raw Price Feeds**
- **Time-based aggregation**: 1-second to 1-hour intervals proven in production
- **Volume thresholds**: $1K to $1M+ filtering ensuring significant trading activity
- **Multi-pool aggregation**: Comprehensive price discovery across all major DEXs
- **Real-time USD pricing**: Built-in conversion eliminating additional API calls
- **Bad trade filtering**: Automatic removal of outliers and routing anomalies

[Explore all technical features ➤](https://docs.bitquery.io/docs/trading/crypto-price-api/introduction/#key-features-of-these-apis)

Ready to implement our crypto price API for limit orders in your trading system? 

**Get Started with Our Limit Order Price API:**
- [Try live examples in our IDE ➤](https://ide.bitquery.io/?query_name=crypto-price-examples)
- [Read the complete API documentation ➤](https://docs.bitquery.io/docs/trading/crypto-price-api/introduction)
- [Download SDKs and schemas ➤](https://github.com/bitquery/streaming_protobuf/tree/main/market)
- [Join our community ➤](https://t.me/Bloxy_info)

Join trading platforms that have already upgraded from unreliable raw data to our enterprise-grade limit order price API for reliable price for limit order execution.
