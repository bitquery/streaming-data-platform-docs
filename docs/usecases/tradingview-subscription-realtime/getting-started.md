---
title: "Real-Time Crypto Charting API - Live OHLCV Stream & TradingView Integration"
description: "Build real-time crypto charts with live OHLCV data streams. Get 1-second candlestick updates, real-time price data, and seamless TradingView integration for DEX trading analytics."
sidebar_position: 1
keywords:
  [
    real-time crypto charting,
    OHLCV stream,
    live candlestick data,
    crypto price streaming,
    TradingView API,
    real-time OHLC,
    crypto trading charts,
    live DEX data,
    streaming candlesticks,
    real-time price feed,
  ]
---

# TradingView API - Real-Time Crypto OHLC Stream

In this tutorial, we will see how to use [TradingView's Advanced Charts API](https://in.tradingview.com/advanced-charts/) and plot DEX trading data with Bitquery APIs. Additionally, this tutorial will show how to use TradingView subscriptions to calculate OHLC in real-time. You can find the complete code of the tutorial [here](https://github.com/bitquery/tradingview-subscription-realtime/tree/main).

The final chart will look like this and will add new candlestick as data is updated.
![](/img/ApplicationExamples/charting.gif)

## What You'll Build

This tutorial will help you create a **professional-grade real-time crypto charting application** with:

- **Real-time 1-second candlestick updates** - See price changes as they happen on-chain
- **Historical OHLC data backfill** - Load historical candlestick data for any timeframe
- **Multiple timeframe support** - 1m, 5m, 15m, 1h, 4h, 1d, and more
- **DEX trading data** - Track decentralized exchange trades from Uniswap, PancakeSwap, Raydium, and 100+ other DEXs
- **Multi-chain support** - Ethereum, BSC, Solana, Base, Arbitrum, Polygon, and more
- **TradingView's professional UI** - Industry-standard charting interface with technical indicators

**Perfect for:** Traders, DeFi platforms, portfolio trackers, analytics dashboards, and trading bots.

## Prerequisites

Before you begin, ensure you have:

### Technical Requirements

- **Node.js** version 16.x or higher
- **React** knowledge (intermediate level)
- **JavaScript/TypeScript** proficiency
- **Basic understanding** of GraphQL and WebSockets
- **Estimated time:** 2-3 hours for complete implementation

### Required Accounts & Access

#### 1. Bitquery Account Setup

1. **Create a free account** at [Bitquery.io](https://bitquery.io)
2. **Generate your OAuth Token** [here](https://account.bitquery.io/user/api_v2/access_tokens)

#### 2. TradingView Advanced Charts Access

- Request access to TradingView's **private Advanced Charts API library** by [filling out their form](https://in.tradingview.com/advanced-charts/)
- This is a commercial product that requires approval and licensing
- Wait for TradingView team approval (typically 1-3 business days)

### Bitquery API Capabilities

**Supported Networks:**

- **EVM Chains:** Ethereum, BSC, Polygon (Matic), Arbitrum, Optimism, Base
- **Solana:** Including Raydium, Orca,Pumpfun, PumpSwap, Heaven and other Solana DEXs
- **Other Chains:** Tron, and expanding

## Architecture Overview

The application uses a hybrid approach to deliver real-time charting:

1. **Historical Data:**

   - Initial chart load fetches historical OHLC data via GraphQL queries
   - Backfills data for the selected timeframe
   - Uses Bitquery's aggregated OHLC endpoints

2. **Real-time Updates (WebSocket Subscriptions or Kafka Stream):**

   - Establishes persistent WebSocket connection to Bitquery or setup Kafka consumer that connects to Bitquery servers.
   - Subscribes to OHLC updates
   - Receives 1-second candlestick updates
   - Automatically updates the chart without full page refresh

## Installation & Setup

### Step 1: Create React Project

```bash
npx create-react-app tradingview-crypto-charts
cd tradingview-crypto-charts
```

### Step 2: Install Dependencies

```bash
npm install graphql-request subscriptions-transport-ws
```

### Step 3: Add TradingView Libraries

- After receiving TradingView Advanced Charts access, download the library
- Add the **charting_library** and **datafeeds** folders to your React project
- For this tutorial, place them in the `src` and `public` folders

### Step 4: Configure Environment Variables

Create a `.env` file in your project root:

```bash
REACT_APP_BITQUERY_OAUTH_TOKEN=your_oauth_token_here
REACT_APP_BITQUERY_ENDPOINT=https://streaming.bitquery.io/graphql
REACT_APP_BITQUERY_WSS_ENDPOINT=wss://streaming.bitquery.io/graphql
```

**How to get these values:**

1. Log in to [Bitquery Account](https://account.bitquery.io/)
2. Navigate to API Keys section
3. Copy your API key and OAuth token
4. Use the endpoints shown above (or your region-specific endpoints)

## Queries and Streams Used

- [Crypto Price OHLC API for historical data](https://ide.bitquery.io/Historical-price-data)
- [Crypto Price OHLC Stream for Realtime OHLC](https://ide.bitquery.io/1-second-crypto-price-stream)

**Test Before Implementing:**

- Open the query links above in [Bitquery IDE](https://ide.bitquery.io)
- Click "Run" to see live data
- Modify token addresses or chains to test different pairs
- Use the "Save" button to keep your custom queries
- View the schema explorer to understand available fields

## Live Demo & Examples

**Complete Source Code:** [GitHub Repository](https://github.com/bitquery/tradingview-subscription-realtime/tree/main)

## Key Features & Capabilities

### Real-time Streaming

- **1-second OHLC updates** - Fastest candlestick refresh rate in the industry
- **WebSocket-based** - Persistent connection for low-latency updates
- **Automatic reconnection** - Handles network interruptions gracefully
- **Subscription-based** - Only receive data for tokens you're tracking

### Historical Data

- **Unlimited lookback** - Access historical data from chain genesis
- **Multiple timeframes** - 1m, 5m, 15m, 30m, 1h, 4h, 12h, 1d, 1w, 1M
- **Instant backfill** - Fast historical data loading
- **Aggregated OHLC** - Pre-calculated candlesticks for efficiency

### Data Quality

- **DEX aggregation** - Combines trades from all major DEXs
- **Volume-weighted** - Accurate OHLC based on trade volumes
- **Outlier filtering** - Removes flash loan attacks and wash trading
- **Multi-source validation** - Cross-verified blockchain data

## Community & Support

### Get Help

- **Telegram Group:** [Bitquery Developers](https://t.me/Bloxy_info) - Active developer community
- **Email Support:** support@bitquery.io

## Getting Started

- Now we will write different parts of the logic:

  - The main App
  - The logic to get historical OHLC using [Crypto Price API](https://docs.bitquery.io/docs/trading/price-index/introduction/)
  - The logic to subscribe to real-time OHLC using same APIs
  - The custom datafeed object setup
  - The widget code

- We will start by building the historical OHLC data.
