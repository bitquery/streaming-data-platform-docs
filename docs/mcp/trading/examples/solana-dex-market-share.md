---
title: "Example: Solana DEX Market Share — Meteora vs Pumpswap vs Raydium"
description: "Use the Bitquery MCP to break down Solana DEX volume by protocol family — Meteora, Pumpswap, Raydium, Orca and the long tail. Real 24h numbers."
keywords:
  - Solana DEX market share
  - Meteora vs Pumpswap
  - Raydium volume
  - Solana DEX comparison
  - DEX volume MCP
  - Pumpswap volume
  - Orca Whirlpool volume
sidebar_label: "Solana DEX Market Share"
---

<head>
  <meta name="title" content="Solana DEX Market Share — Meteora vs Pumpswap vs Raydium (Bitquery MCP)"/>
  <meta name="description" content="Use the Bitquery MCP to break down Solana DEX volume by protocol family — Meteora, Pumpswap, Raydium, Orca and the long tail. Real 24h numbers."/>
  <meta name="robots" content="index, follow"/>
  <meta property="og:type" content="article"/>
  <meta property="og:title" content="Solana DEX Market Share — Meteora vs Pumpswap vs Raydium"/>
  <meta property="og:description" content="Live ranking of Solana DEX protocol families by 24h USD volume — Meteora dominates with ~58%, Pumpswap absorbs graduated tokens, the long tail still moves $80M–200M / day."/>
  <meta property="og:url" content="https://docs.bitquery.io/docs/mcp/trading/examples/solana-dex-market-share/"/>
  <meta property="og:image" content="https://docs.bitquery.io/img/mcp/charts/solana-dex-share.svg"/>
  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="Solana DEX Market Share — Meteora vs Pumpswap vs Raydium"/>
  <meta property="twitter:description" content="Live ranking of Solana DEX protocol families by 24h USD volume — Meteora dominates with ~58%, Pumpswap absorbs graduated tokens, the long tail still moves $80M–200M / day."/>
  <meta property="twitter:image" content="https://docs.bitquery.io/img/mcp/charts/solana-dex-share.svg"/>
  <link rel="canonical" href="https://docs.bitquery.io/docs/mcp/trading/examples/solana-dex-market-share/"/>
</head>

# Solana DEX Market Share Battle

> **The trader question:** *"Which Solana DEX is winning today's volume? Where is liquidity actually flowing?"*

Every trade row in the dataset is tagged with its DEX — so a single sentence to the agent ranks the entire venue landscape.

## Ask the Agent

> *"Using the Bitquery MCP, show me the top 10 Solana DEXs by 24h USD volume, with trade counts. Sort by volume."*

## Result (live data, 2026-04-23 snapshot)

![Solana DEX market share — 24h USD volume](/img/mcp/charts/solana-dex-share.svg)

| # | DEX | 24h Volume (USD) | Trades | Vol / trade |
|---|---|---:|---:|---:|
| 1 | **Meteora** (DLMM, DAMM, DBC) | $15.97 B | 22.4 M | $712 |
| 2 | **Pumpswap** | $8.29 B | 19.5 M | $425 |
| 3 | Raydium | $704.9 M | 3.0 M | $231 |
| 4 | OrcaWhirlpool | $318.5 M | 1.1 M | $295 |
| 5 | Manifest | $197.0 M | 293 K | $673 |
| 6 | GoonFi | $123.5 M | 545 K | $227 |
| 7 | AlphaQ | $109.9 M | 402 K | $273 |
| 8 | Pumpfun | $105.1 M | 2.6 M | $40 |
| 9 | SolFi | $88.1 M | 262 K | $336 |
| 10 | PancakeSwap | $51.1 M | 302 K | $169 |

**Two clear stories:**

1. **Meteora dominates** by a wide margin — the combined DLMM + DAMM v2 + Dynamic Bonding Curve product family is now ~58% of all Solana DEX volume in this snapshot.
2. **Pumpfun's per-trade size ($40)** confirms the meme-launch / micro-trade reality of the bonding-curve venue, while **Pumpswap** ($425) is where graduated tokens get serious flow.

## What This Tells a Trader

- **Routing matters.** If you're trading a major Solana pair, ignoring Meteora pools means leaving liquidity (and likely better pricing) on the table.
- **Bonding-curve graduation is real.** The Pumpfun → Pumpswap funnel is visible right in the volume gap — early discovery happens on Pumpfun, but serious flow lives on Pumpswap.
- **The long tail is alive.** GoonFi, AlphaQ, SolFi, Manifest each move $80M–200M / day — small enough to be ignored by aggregators, large enough to source unique flow.

For deeper per-DEX coverage in GraphQL, see [Raydium](/docs/blockchain/Solana/Solana-Raydium-DEX-API/), [Meteora DLMM](/docs/blockchain/Solana/Meteora-DLMM-API/), [Meteora DAMM v2](/docs/blockchain/Solana/Meteora-DAMM-v2-API/), [Meteora Dynamic Bonding Curve](/docs/blockchain/Solana/meteora-dynamic-bonding-curve-api/), [Pump.fun](/docs/blockchain/Solana/Pumpfun/Pump-Fun-API/), [PumpSwap](/docs/blockchain/Solana/Pumpfun/pump-swap-api/), [Orca Whirlpool](/docs/blockchain/Solana/solana-orca-dex-api/).

## Trader Playbook

| You want to … | Just ask the agent |
|---|---|
| **Track DEX market share over time** | *"Plot hourly USD volume per DEX for the last 24h as a stacked area."* |
| **Find the cheapest venue** for a given pair | *"For pair `<token>` / USDC on Solana, show me each DEX with its 1h volume, average trade size, and average realised price."* |
| **Spot a routing arbitrage** | *"In the last 5 minutes, what's the average price for `<token>` on each DEX? Flag the biggest spread."* |
| **Compare clean vs noisy volume per DEX** | *"Run the DEX share table twice: all volume vs only clean (non-wash-traded) volume. Show the % drop per DEX."* |
| **Volume by DEX × token category** | *"For each DEX, what % of volume is in stablecoin pairs vs SOL pairs vs memecoin pairs?"* |

## Variations the Agent Handles in One Sentence

- *"Same chart but for Ethereum: Uniswap vs PancakeSwap vs 1inch vs Curve."*
- *"Show me Meteora's product split — DLMM vs DAMM v2 vs Dynamic Bonding Curve volume in the last 24h."*
- *"Which DEX has the highest unique-trader-to-trade ratio? That's where the most distinct people are trading, not bots."*
- *"Plot hourly Pumpswap volume vs Pumpfun volume to see graduation flow."*

## Take It Further

- Drill into a single DEX by asking for per-pool OHLC: *"For pool `<address>`, give me 1-minute OHLC for the last hour."* See the [trading overview](/docs/mcp/trading/overview/) for what's available.
- Cross-chain version of the same question: [Cross-Chain DEX Snapshot](/docs/mcp/trading/examples/cross-chain-snapshot/).
- Track new launches inside the leading DEX in [Pump.fun Launch Pulse](/docs/mcp/trading/examples/pumpfun-launch-pulse/).
