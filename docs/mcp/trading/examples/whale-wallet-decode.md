---
title: "Example: Decode a Whale Wallet's 24h Activity"
description: "Use the Bitquery MCP to break down any wallet's 24h DEX trading: tokens touched, buy vs sell volume, and behavioural signature in one query."
keywords:
  - whale wallet tracker
  - trader analytics MCP
  - wallet portfolio analysis
  - copy trading research
  - smart money tracker
  - on-chain wallet decoder
  - Bitquery MCP example
sidebar_label: "Decode a Whale Wallet"
---

<head>
  <meta name="title" content="Decode a Whale Wallet's 24h Activity — Bitquery MCP Example"/>
  <meta name="description" content="Use the Bitquery MCP to break down any wallet's 24h DEX trading: tokens touched, buy vs sell volume, and behavioural signature in one query."/>
  <meta name="robots" content="index, follow"/>
  <meta property="og:type" content="article"/>
  <meta property="og:title" content="Decode a Whale Wallet's 24h Activity"/>
  <meta property="og:description" content="Spot bots vs humans, find directional whales worth copying, audit a token's smart money — all from one prompt to your AI agent through the Bitquery MCP."/>
  <meta property="og:url" content="https://docs.bitquery.io/docs/mcp/trading/examples/whale-wallet-decode/"/>
  <meta property="og:image" content="https://docs.bitquery.io/img/mcp/charts/whale-portfolio.svg"/>
  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="Decode a Whale Wallet's 24h Activity"/>
  <meta property="twitter:description" content="Spot bots vs humans, find directional whales worth copying, audit a token's smart money — all from one prompt to your AI agent through the Bitquery MCP."/>
  <meta property="twitter:image" content="https://docs.bitquery.io/img/mcp/charts/whale-portfolio.svg"/>
  <link rel="canonical" href="https://docs.bitquery.io/docs/mcp/trading/examples/whale-wallet-decode/"/>
</head>

# Decode a Whale Wallet's 24h Activity

> **The trader question:** *"Who is `MfDuWeqS…` and what are they doing? Are they accumulating, distributing, or making markets?"*

A common trader workflow: Etherscan / Solscan shows you transactions, but it doesn't aggregate USD flow per token by direction. The MCP makes that one query.

## How to Find a Wallet to Investigate

We pulled this wallet from the **top traders by USD volume on WSOL in the last 24h**:

> *"Using the Bitquery MCP, find the top 5 wallets that traded WSOL on Solana in the last 24 hours, sorted by total USD volume."*

That returned `MfDuWeqSHEqTFVYZ7LoexgAK9dxk7cy4DFJWjWMGVWa` at #1 with **$83.6M** in WSOL volume across **49,385** trades in 24 hours. That density (~34 trades / minute) is a giveaway: it's an aggregator / market-maker bot. Let's dissect it.

## Ask the Agent

> *"Using the Bitquery MCP, for wallet `MfDuWeqSHEqTFVYZ7LoexgAK9dxk7cy4DFJWjWMGVWa`, break down 24h activity per token: trade count, USD bought, USD sold, and net flow."*

## Result (live data, 2026-04-23 snapshot)

![Whale wallet 24h buy vs sell volume per token](/img/mcp/charts/whale-portfolio.svg)

| Token | Trades | Bought (USD) | Sold (USD) | Net flow (USD) | Behavioural read |
|---|---:|---:|---:|---:|---|
| **WSOL** | 49,405 | $39.2M | $44.5M | **−$5.3M** | Net distributing — a few % of WSOL out of the wallet. |
| **cbBTC** | 16,740 | $7.0M | $6.4M | +$0.6M | Roughly balanced, slight accumulation. |
| **WETH** | 9,190 | $3.9M | $5.2M | −$1.3M | Net distributing. |
| **MET** | 25,517 | $4.2M | $4.2M | ~$0 | Pure two-sided market making. |
| **TRUMP** | 997 | $3.3M | $1.2M | **+$2.1M** | Strong directional accumulation. |
| EURC | 1,837 | $1.0M | $1.1M | ~$0 | Stablecoin pass-through. |
| WBTC | 2,948 | $1.2M | $0.7M | +$0.5M | Moderate accumulation. |
| JLP | 7,023 | $0.9M | $1.0M | ~$0 | Two-sided. |

**Behavioural signature:** the wallet is overwhelmingly two-sided on WSOL/cbBTC/WETH/MET/EURC (classic market-maker profile), but takes a clear **directional long on TRUMP**. That's the kind of mixed strategy you'd want to copy-trade selectively, not blindly.

## What This Tells a Trader

- **Spot bots vs humans.** A wallet with thousands of trades on a handful of tokens at near-balanced buy/sell is almost certainly a bot. A wallet with a few large directional trades is a discretionary actor.
- **Find directional whales worth copying.** The MM-style flow on this wallet is noise — but the TRUMP position is signal. The same wallet can produce both.
- **Audit a token's "smart money".** Ask the agent: *"For token X, who were the top 10 wallets by USD volume in the last 24h, and what's their net flow?"* You'll see whether smart money is accumulating or distributing.
- **Wallet lookups are instant.** Even a wallet with 50,000 trades a day comes back in well under a second.

## Trader Playbook

| You want to … | Just ask the agent |
|---|---|
| **Realised PnL** instead of flow | *"For wallet `<X>`, compute realised USD PnL per token in the last 7 days."* |
| **Mark-to-market unrealised PnL** | *"…and value any open position at the latest token price."* |
| **First and last trade** of each token | *"Per token, when did this wallet first buy and last touch it?"* |
| **DEX preference** for the wallet | *"Which DEXs does this wallet use the most, by volume?"* |
| **Build a copy-trading shortlist** | *"Find wallets that bought any new Pumpfun token in its first 60 seconds in the last 24h, then sold higher within 10 minutes. Rank by hit rate."* |

## Variations the Agent Handles in One Sentence

- *"Same wallet, same breakdown, but for the last 7 days bucketed daily."*
- *"For wallet `<X>`, show every trade in the last 24h ordered by time, and flag any larger than $500K USD."*
- *"For the top 20 wallets by 24h USD volume on Solana, show their net flow per token — find the most directional ones."*
- *"Did wallet `<X>` ever buy `<token>`? What was the average entry price?"*

## Take It Further

- For wallet-centric trade analytics in GraphQL, see the [Traders API](/docs/trading/crypto-trades-api/traders-api/).
- To stream a wallet's trades in real time, use the [GraphQL subscriptions](/docs/subscriptions/websockets/) or [Solana Kafka stream](/docs/streams/real-time-solana-data/).
- Pick a high-volume token from [Hottest Solana Tokens](/docs/mcp/trading/examples/top-tokens-discovery/) and re-run this analysis on its top traders.
- Spot whales who buy launches first by combining this pattern with [Pump.fun Launch Pulse](/docs/mcp/trading/examples/pumpfun-launch-pulse/).
- For copy-trading at production latency, see the [copy-trading bot](/docs/usecases/copy-trading-bot/) and [gRPC copy-trading bot](/docs/grpc/solana/examples/grpc-copy-trading-bot/) walkthroughs.
