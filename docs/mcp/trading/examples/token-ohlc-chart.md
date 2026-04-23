---
title: "Example: Build an OHLC Candle Chart for Any Token"
description: "Use the Bitquery MCP to pull real-time hourly OHLC + volume for any token on any supported chain — feed it into TradingView or your bot."
keywords:
  - OHLC chart MCP
  - candlestick chart Solana
  - WSOL price chart
  - token chart AI agent
  - crypto candles MCP
  - TradingView feed MCP
  - Bitquery MCP example
sidebar_label: "OHLC Candle Chart"
---

<head>
  <meta name="title" content="Build an OHLC Candle Chart for Any Token — Bitquery MCP"/>
  <meta name="description" content="Use the Bitquery MCP to pull real-time hourly OHLC + volume for any token on any supported chain — feed it into TradingView or your bot."/>
  <meta name="robots" content="index, follow"/>
  <meta property="og:type" content="article"/>
  <meta property="og:title" content="Build an OHLC Candle Chart for Any Token — Bitquery MCP"/>
  <meta property="og:description" content="One prompt to your AI agent returns 1-minute, 5-minute, hourly, or daily candles for any token on Solana, Ethereum, BSC, Base, and more."/>
  <meta property="og:url" content="https://docs.bitquery.io/docs/mcp/trading/examples/token-ohlc-chart/"/>
  <meta property="og:image" content="https://docs.bitquery.io/img/mcp/charts/wsol-24h-candles.svg"/>
  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="Build an OHLC Candle Chart for Any Token — Bitquery MCP"/>
  <meta property="twitter:description" content="One prompt to your AI agent returns 1-minute, 5-minute, hourly, or daily candles for any token on Solana, Ethereum, BSC, Base, and more."/>
  <meta property="twitter:image" content="https://docs.bitquery.io/img/mcp/charts/wsol-24h-candles.svg"/>
  <link rel="canonical" href="https://docs.bitquery.io/docs/mcp/trading/examples/token-ohlc-chart/"/>
</head>

# Build an OHLC Candle Chart for Any Token

> **The trader question:** *"Give me the last 24 hours of price action for WSOL so I can eyeball the trend."*

The same pre-built candles feed Bitquery's [TradingView integration](/docs/usecases/tradingview-subscription-realtime/getting-started/), Telegram bots, and Kafka streams. Through the MCP, your agent can pull them on demand for **any token, any chain, any interval**.

## Ask the Agent

> *"Using the Bitquery MCP, pull hourly OHLC + USD volume for WSOL (`So11111111111111111111111111111111111111112`) on Solana for the last 24 hours and render it as a markdown table I can paste into a chart."*

## Result (live data, 2026-04-23 snapshot)

![WSOL hourly candles for the last 24 hours](/img/mcp/charts/wsol-24h-candles.svg)

The 24h move on this snapshot: **$88.59 → $86.04 (−2.88%)**. Note the volume spike on the down-leg around hour 11 (`$26.5M`) — classic capitulation-then-stabilisation pattern.

| Time (UTC) | Open | High | Low | Close | Volume |
|---|---:|---:|---:|---:|---:|
| 00:00 | 88.59 | 89.18 | 88.48 | 89.13 | $20.0M |
| 01:00 | 89.13 | 89.33 | 88.53 | 88.77 | $21.1M |
| 02:00 | 88.79 | 88.81 | 88.08 | 88.24 | $18.3M |
| 03:00 | 88.23 | 88.48 | 87.56 | 87.67 | $12.8M |
| 04:00 | 87.70 | 88.04 | 87.65 | 87.84 | $11.4M |
| … | … | … | … | … | … |
| 11:00 | 86.88 | 87.17 | **86.01** | 86.89 | **$26.5M** |
| … | … | … | … | … | … |
| 22:00 | 85.48 | 85.92 | 85.41 | 85.86 | $7.1M |
| 23:00 | 85.86 | 86.10 | 85.84 | **86.04** | $30.2M |

## What This Tells a Trader

- **Candles are pre-built.** Bitquery rolls up trades into 1-minute, 5-minute, hourly, and daily candles automatically — the agent picks the bucket size you asked for and returns clean rows.
- **Token-level vs pool-level.** This chart aggregates **every WSOL pool across Solana** into one view. To chart a single pool (say WIF/USDC on Raydium) instead, just say *"chart it for pool `<address>`"* and the agent narrows the lookup.
- **Always fresh.** The data updates as blocks land — re-run the same prompt 30 seconds later and you'll get the next candle.

## Trader Playbook

| You want to … | Just ask the agent |
|---|---|
| **Daily candles** for back-testing | *"Same chart but daily candles, last 90 days."* |
| **Multiple price averages** for indicator overlays | *"Add 7-period SMA and 14-period EMA columns to each row."* |
| **Realised vs estimated price** divergence | *"For the same window, also include Bitquery's estimated price — flag any candles where they diverge by more than 1%."* |
| **Volume profile** by price bucket | *"Bucket the last 24h of trades into $0.50 price bins and sum the USD volume per bin."* |
| **Live chart** that auto-updates | The dataset updates in near real time — re-run the prompt on a 5–10s interval and the result is always fresh. |
| **Compare two tokens** on one chart | *"Compare 1h close prices of WSOL and ETH for the last 24h on the same scale."* |

## Variations the Agent Handles in One Sentence

- *"Show me 1-minute candles for the last 60 minutes for `<token>` and tell me the max drawdown."*
- *"For pool `<X>`, plot the divergence between OHLC close and the volume-weighted moving average."*
- *"Find every 1h candle in the last 24h where the high-to-low range exceeds 5% — those are the volatile hours."*
- *"Bucket today's candles into hourly groups and tell me the most volatile hour of the day."*

## Take It Further

- Plug the result straight into [TradingView Advanced Charts](/docs/usecases/tradingview-subscription-realtime/getting-started/) — same data, prettier UI.
- For per-trade replay (bigger granularity), ask the agent for the raw trades instead of candles — *"show me every WSOL trade in the last 5 minutes"*. See the [trading overview](/docs/mcp/trading/overview/) for what's on every trade row.
- Background on price derivation: [Crypto Price Index Algorithm](/docs/trading/crypto-price-api/price-index-algorithm/).
- Find tokens worth charting first with [Hottest Solana Tokens](/docs/mcp/trading/examples/top-tokens-discovery/), or check which DEX has the deepest pool with [Solana DEX Market Share](/docs/mcp/trading/examples/solana-dex-market-share/).
