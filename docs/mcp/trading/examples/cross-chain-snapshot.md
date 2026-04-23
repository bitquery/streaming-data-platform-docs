---
title: "Example: Cross-Chain DEX Volume Snapshot"
description: "Use the Bitquery MCP to compare 24h DEX volume, trades & unique traders across Solana, Ethereum, BSC, Base, Arbitrum, Optimism, Polygon & Tron in one query."
keywords:
  - cross-chain DEX volume
  - chain comparison MCP
  - multi-chain analytics AI
  - blockchain market overview
  - DEX liquidity comparison
  - Solana vs Ethereum volume
sidebar_label: "Cross-Chain DEX Snapshot"
---

<head>
  <meta name="title" content="Cross-Chain DEX Volume Snapshot — Bitquery MCP Example"/>
  <meta name="description" content="Use the Bitquery MCP to compare 24h DEX volume, trades & unique traders across Solana, Ethereum, BSC, Base, Arbitrum, Optimism, Polygon & Tron in one query."/>
  <meta name="robots" content="index, follow"/>
  <meta property="og:type" content="article"/>
  <meta property="og:title" content="Cross-Chain DEX Volume Snapshot — Bitquery MCP Example"/>
  <meta property="og:description" content="One MCP query, eight chains: USD volume, trade count, unique traders, average trade size — see where the DEX action really is."/>
  <meta property="og:url" content="https://docs.bitquery.io/docs/mcp/trading/examples/cross-chain-snapshot/"/>
  <meta property="og:image" content="https://docs.bitquery.io/img/mcp/charts/cross-chain-volume.svg"/>
  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="Cross-Chain DEX Volume Snapshot — Bitquery MCP Example"/>
  <meta property="twitter:description" content="One MCP query, eight chains: USD volume, trade count, unique traders, average trade size — see where the DEX action really is."/>
  <meta property="twitter:image" content="https://docs.bitquery.io/img/mcp/charts/cross-chain-volume.svg"/>
  <link rel="canonical" href="https://docs.bitquery.io/docs/mcp/trading/examples/cross-chain-snapshot/"/>
</head>

# Cross-Chain DEX Volume Snapshot

> **The trader question:** *"Where is the action right now? Which chain is the most liquid, the most active, and has the most distinct traders?"*

A single MCP query returns the answer for **all chains at once** — no per-chain GraphQL juggling.

## Ask the Agent

> *"Using the Bitquery MCP, give me a 24h cross-chain DEX snapshot: USD volume, total trade count, and unique traders per chain. Sort by volume."*

## Result (live data, 2026-04-23 snapshot)

![24h DEX volume share across chains](/img/mcp/charts/cross-chain-volume.svg)

| Chain | 24h Volume (USD) | Trades | Unique Traders | Avg trade size |
|---|---:|---:|---:|---:|
| Solana | **$25.97 B** | 50.5 M | 1,259,514 | $514 |
| BNB Smart Chain | $5.39 B | 10.6 M | 452,085 | $510 |
| Ethereum | $2.99 B | 946 K | 55,229 | $3,160 |
| Base | $1.52 B | 2.55 M | 35,901 | $596 |
| Polygon (Matic) | $0.57 B | 14.1 M | 379,596 | $40 |
| Arbitrum | $0.47 B | 726 K | 9,283 | $650 |
| Tron | $0.10 B | 16 K | 1,208 | $6,229 |
| Optimism | $0.03 B | 282 K | 1,836 | $115 |

The "average trade size" column tells its own story: **Tron** has the largest typical trade (whales / OTC-style flow), while **Polygon** is dominated by tiny on-chain payments.

## What This Tells a Trader

- **Where the flow really is.** Solana is now ~5× the next chain by USD volume — and ~25× by trade count. Most retail attention is there.
- **Where the price-takers are.** Ethereum's average trade size ($3,160) is 5–8× larger than Solana / Base — a sign that institutional and large-portfolio activity still concentrates on EVM L1.
- **Where the bots are.** Polygon's microscopic average trade size ($40) means most volume there is from automated payment / aggregator flow, not discretionary trading.

## Trader Playbook

| You want to … | Just ask the agent |
|---|---|
| **Spot a chain rotation** | *"Compare today's volume per chain with the same window 7 days ago. Where is volume rotating to?"* |
| **Filter to memecoin chains only** | *"Same snapshot, but only Solana, Base, and BNB Smart Chain."* |
| **Compare protocols across chains** | *"For each chain, show the top 3 DEXs by 24h volume."* — see [Solana DEX market share](/docs/mcp/trading/examples/solana-dex-market-share/) for a chain-specific cut. |
| **Track a stablecoin's flow** | *"Same snapshot, but only count trades where the quote token is USDC or USDT."* |
| **Find the chain with the cleanest data** | *"Run this twice: all flow vs only clean (non-wash-traded) flow. Show the % drop per chain."* |

## Variations the Agent Handles in One Sentence

- *"Same snapshot but bucketed every 4 hours for the last 24h, so I can see when each chain peaked."*
- *"Plot a stacked area chart of hourly USD volume per chain for the last 7 days."* (paste output into your analysis tool)
- *"Which chain has the highest ratio of unique traders to total trades? That's the most retail-driven."*
- *"For each chain, show the top 3 quote tokens by volume."*

## Take It Further

- Drill into one chain's DEX breakdown with [Solana DEX Market Share Battle](/docs/mcp/trading/examples/solana-dex-market-share/).
- Track new-token velocity per chain by re-using the launch-counting pattern from [Pump.fun Launch Pulse](/docs/mcp/trading/examples/pumpfun-launch-pulse/).
- For a tour of what's in the trading dataset, see the [trading overview](/docs/mcp/trading/overview/).
