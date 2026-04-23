---
title: "Trading MCP — What You Can Do With It"
description: "Bitquery MCP use cases: token discovery, trader PnL, OHLC, market cap, wash-trade filtering, launchpad pulse, sniping research, slippage & AI-agent analysis."
keywords:
  - Bitquery MCP use cases
  - trading AI agent
  - token discovery MCP
  - trader PnL MCP
  - DEX OHLC AI
  - wash trade filtering
  - launchpad analytics
  - copy trading research
  - mcp.bitquery.io
sidebar_label: "Use Cases"
---

<head>
  <meta name="title" content="Trading MCP — What You Can Do With It"/>
  <meta name="description" content="Bitquery MCP use cases: token discovery, trader PnL, OHLC, market cap, wash-trade filtering, launchpad pulse, sniping research, slippage & AI-agent analysis."/>
  <meta name="robots" content="index, follow"/>
  <meta property="og:type" content="article"/>
  <meta property="og:title" content="Trading MCP — What You Can Do With It"/>
  <meta property="og:description" content="11 conversational patterns the Bitquery MCP unlocks for AI-driven crypto trading research, with prompts you can paste straight into Claude or Cursor."/>
  <meta property="og:url" content="https://docs.bitquery.io/docs/mcp/trading/use-cases/"/>
  <meta property="og:image" content="https://docs.bitquery.io/img/mcp/charts/wsol-24h-candles.svg"/>
  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="Trading MCP — What You Can Do With It"/>
  <meta property="twitter:description" content="11 conversational patterns the Bitquery MCP unlocks for AI-driven crypto trading research, with prompts you can paste straight into Claude or Cursor."/>
  <meta property="twitter:image" content="https://docs.bitquery.io/img/mcp/charts/wsol-24h-candles.svg"/>
  <link rel="canonical" href="https://docs.bitquery.io/docs/mcp/trading/use-cases/"/>
</head>

# Trading MCP — What You Can Do With It

These are the patterns we see most often when teams plug the [Bitquery MCP server](/docs/mcp/mcp-server/) into Claude, Cursor, ChatGPT, or Claude Code. **You don't write SQL** — you ask in plain English, the agent does the rest. Each pattern below shows the kind of question that works and what comes back.

For end-to-end worked answers — including the live data table and a chart — see the [examples section](/docs/mcp/trading/examples/).

---

## 1. Token Discovery and Trending

> *"What are the top 10 Solana tokens by USD volume in the last 24 hours? Skip wash-traded pools."*

You get a clean, ranked list of the most-traded tokens for any chain — your daily watchlist generator. The agent automatically applies Bitquery's outlier filter so the noise is already gone.

**See it live:** [Hottest Solana Tokens](/docs/mcp/trading/examples/top-tokens-discovery/).

## 2. Trader Analytics and Realized PnL

> *"Pull every trade for wallet `7xKX…` in the last 7 days. Compute realized PnL per token in USD."*

Wallet-centric breakdown — token by token, with bought, sold, and net flow in USD. Same idea works for any wallet on any supported chain. For a GraphQL equivalent see the [Traders API](/docs/trading/crypto-trades-api/traders-api/).

**See it live:** [Decode a Whale Wallet](/docs/mcp/trading/examples/whale-wallet-decode/).

## 3. OHLC Charts for Any Pool or Token

> *"Give me 1-minute OHLC for the WIF/USDC pool on Raydium for the last 6 hours."*

Pre-aggregated candles at any interval — 1m, 5m, 1h, daily — for any pool, token, or currency. Ready to drop into [TradingView](/docs/usecases/tradingview-subscription-realtime/getting-started/) or your bot.

**See it live:** [Build an OHLC Candle Chart](/docs/mcp/trading/examples/token-ohlc-chart/).

## 4. Market Cap and FDV Monitoring

> *"Which Base tokens crossed $10M market cap in the last 24 hours?"*

Every token aggregate row carries the latest market cap and fully diluted valuation. Background on the math: [Supply fields](/docs/trading/crypto-price-api/supply-fields/).

## 5. Wash-Trade and Outlier Filtering

> *"Show me 24h volume per chain, but only counting clean (non-wash-traded) flow."*

Bitquery's price-index ranking is baked into every row. A simple "skip the noisy pools" instruction in your prompt is enough — no model to train, no list to maintain. Companion read: [How to filter anomaly prices](/docs/usecases/how-to-filter-anomaly-prices/) and the [price-index algorithm](/docs/trading/crypto-price-api/price-index-algorithm/).

## 6. New Token / Launch Monitoring

> *"How many new tokens launched on Pump.fun in the last hour? How does that compare to the 24h average?"*

Track launchpad activity in real time across **Pump.fun**, **LetsBonk**, **FourMeme**, **Boop**, **Bags**, **Believe**, **Heaven**, **Goonfi**, **Trends.fun**, **Meteora Dynamic Bonding Curve**, and more. Spot meta cooldowns and frenzy hours.

**See it live:** [Pump.fun Launch Pulse](/docs/mcp/trading/examples/pumpfun-launch-pulse/). Per-launchpad GraphQL coverage: [Pump.fun](/docs/blockchain/Solana/Pumpfun/Pump-Fun-API/), [LetsBonk](/docs/blockchain/Solana/letsbonk-api/), [FourMeme](/docs/blockchain/BSC/four-meme-api/), [Meteora DBC](/docs/blockchain/Solana/meteora-dynamic-bonding-curve-api/).

## 7. Cross-Chain Market Overview

> *"For each chain, show 24h DEX volume, number of trades, and number of unique traders."*

A single sentence gets you a chain-by-chain comparison — no per-chain GraphQL juggling. Useful for spotting chain rotations and weighing where to deploy capital next.

**See it live:** [Cross-Chain DEX Snapshot](/docs/mcp/trading/examples/cross-chain-snapshot/).

## 8. DEX Market Share Battles

> *"Which Solana DEX is winning today's volume? Meteora vs Pumpswap vs Raydium vs Orca."*

The agent ranks DEXs (Meteora, Pumpswap, Raydium, Uniswap, PancakeSwap, …) by 24h volume. The same pattern answers *"which DEX is the cheapest for this pair?"*, *"which DEX is the most retail-driven?"*, or *"which DEX has the most active market-makers?"*

**See it live:** [Solana DEX Market Share](/docs/mcp/trading/examples/solana-dex-market-share/).

## 9. Sniping and Copy-Trading Research

> *"Find Solana wallets that bought any token in the first 60 seconds of its first Pumpfun trade in the last 24 hours, then sold within 10 minutes for a positive USD PnL."*

The same data behind production bots — [Solana sniper](/docs/usecases/solana-sniper-bot/), [Base sniper](/docs/usecases/base-sniper-bot/), [Arbitrum sniper](/docs/usecases/arbitrum-sniper-bot/), [copy-trading bot](/docs/usecases/copy-trading-bot/) — is queryable conversationally. Perfect for prototyping signals before you commit to a Kafka stream.

## 10. Slippage and Liquidity Inspection

> *"For pool `0xabc…` on the last 100 trades, compute realized slippage relative to the volume-weighted price."*

Every trade row carries price, USD amount, and side — enough to derive realised slippage and effective depth. Conceptual companion docs: [Ethereum slippage](/docs/blockchain/Ethereum/dextrades/ethereum-slippage-api/), [Base slippage](/docs/blockchain/Base/base-slippage-api/), [BSC slippage](/docs/blockchain/BSC/bsc-slippage-api/).

## 11. AI Agents and Trading Copilots

The MCP is also the data layer for autonomous trading workflows:

- **In a chat assistant** — Claude, Cursor, or ChatGPT answers ad-hoc data questions without context-switching to a separate IDE.
- **In a coding agent** — Claude Code or Cursor generates ready-to-run analyses, charts, and alerts grounded in real on-chain data.
- **In a custom agent loop** — pipe MCP tool calls into your own agent skill or trading bot. See the [AI Agent on Solana data](/docs/blockchain/Solana/ai-agent-solana-data/) and [AI Agent on Base data](/docs/blockchain/Base/ai-agent-base-data/) walkthroughs.

---

## Best Practices for Prompting

You don't need to know SQL or the schema — but a few prompt habits make the agent's answers dramatically better.

### 1. Be explicit about the time window

The trading dataset is huge. Always tell the agent the window you care about: *"in the last 24 hours"*, *"yesterday vs the day before"*, *"since 09:00 UTC today"*. Without it, the agent may scan more data than it needs to (slow) or pick a default that doesn't match what you wanted.

### 2. Name the chain (or "all chains")

Solana, Ethereum, BNB Smart Chain, Base, Arbitrum, Optimism, Polygon, and Tron are all in the same dataset. *"on Solana"* or *"across all chains"* keeps the agent's filter clean.

### 3. Ask for clean (non-wash-traded) data when relevant

Just say *"skip wash-traded pools"* or *"only clean volume"*. The agent will apply Bitquery's outlier filter automatically. Use this for token discovery, market-cap rankings, and any time you want a "real" view of the market.

### 4. Pin the granularity for charts

For OHLC and trend questions, name the bucket size: *"1-minute candles"*, *"hourly volume"*, *"daily for the last 30 days"*. Otherwise the agent guesses.

### 5. Give it the address if you have one

If you know a token contract, pool address, or wallet, **paste it**. Address-based lookups are the fastest the MCP can do, and they avoid symbol collisions (there are dozens of tokens called "PEPE").

### 6. Ask for the data shape you want

*"Give me a markdown table I can paste"*, *"return JSON for my script"*, *"format it for a Telegram message"* — the agent will adapt. For chart-ready output: *"return rows with timestamp, open, high, low, close, volume"*.

### 7. Iterate, don't restart

Once you've built a good question, refine it instead of starting over: *"same query, but for Base"*, *"same chart, but only memecoins"*, *"same wallet, but for the last 7 days"*. The agent keeps context.

### 8. Trust the read-only sandbox

The MCP only allows reads. The agent **cannot** delete, insert, drop, or modify anything — even if you ask it to. Explore freely.

---

## When MCP, When GraphQL, When Kafka?

| Need | Best fit |
|---|---|
| Conversational analysis, ad-hoc questions, agent loops | **MCP** (this server) |
| Application backend, predictable contract, subscriptions, mempool | [**GraphQL API**](/docs/intro/) and [WebSocket subscriptions](/docs/subscriptions/websockets/) |
| Lowest-latency, highest-throughput streaming for production bots | [**Kafka streams**](/docs/streams/kafka-streaming-concepts/) and [**gRPC streams**](/docs/grpc/solana/introduction/) |
| Pre-built OHLC, market cap, token metadata over GraphQL | [**Crypto Price API**](/docs/trading/crypto-price-api/introduction/) |

The MCP and the GraphQL API read the **same dataset**, so anything you discover via MCP is reproducible in GraphQL or your production stream.
