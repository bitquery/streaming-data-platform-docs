---
title: "Example: Pump.fun Launch Pulse — Tokens Launched per Hour"
description: "Use the Bitquery MCP to track new Pump.fun token launches hour by hour. Spot launchpad waves, fade exhaustion & quantify the meta of the moment."
keywords:
  - Pump.fun launches per hour
  - new memecoin tracker
  - launchpad analytics
  - Solana token launches
  - Pumpfun analytics
  - memecoin meta
  - Bitquery MCP example
sidebar_label: "Pump.fun Launch Pulse"
---

<head>
  <meta name="title" content="Pump.fun Launch Pulse — New Tokens per Hour (Bitquery MCP)"/>
  <meta name="description" content="Use the Bitquery MCP to track new Pump.fun token launches hour by hour. Spot launchpad waves, fade exhaustion & quantify the meta of the moment."/>
  <meta name="robots" content="index, follow"/>
  <meta property="og:type" content="article"/>
  <meta property="og:title" content="Pump.fun Launch Pulse — New Tokens per Hour"/>
  <meta property="og:description" content="36-hour view of new-token creation on Pump.fun — diurnal cycles, frenzy hours, meta cooldowns, and how to apply the same lens to LetsBonk, FourMeme, and other launchpads."/>
  <meta property="og:url" content="https://docs.bitquery.io/docs/mcp/trading/examples/pumpfun-launch-pulse/"/>
  <meta property="og:image" content="https://docs.bitquery.io/img/mcp/charts/pumpfun-launches-hourly.svg"/>
  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="Pump.fun Launch Pulse — New Tokens per Hour"/>
  <meta property="twitter:description" content="36-hour view of new-token creation on Pump.fun — diurnal cycles, frenzy hours, meta cooldowns, and how to apply the same lens to LetsBonk, FourMeme, and other launchpads."/>
  <meta property="twitter:image" content="https://docs.bitquery.io/img/mcp/charts/pumpfun-launches-hourly.svg"/>
  <link rel="canonical" href="https://docs.bitquery.io/docs/mcp/trading/examples/pumpfun-launch-pulse/"/>
</head>

# Pump.fun Launch Pulse — New Tokens per Hour

> **The trader question:** *"Is launchpad activity heating up or cooling down? When are people actually deploying tokens?"*

A single sentence to the agent gives you the answer for any launchpad on any chain.

## Ask the Agent

> *"Using the Bitquery MCP, count distinct new tokens that traded on Pump.fun per hour over the last 36 hours. Plot the trend."*

## Result (live data, 2026-04-23 snapshot, last 36 hours)

![Pump.fun new tokens per hour, last 36 hours](/img/mcp/charts/pumpfun-launches-hourly.svg)

| Window (UTC) | Avg new tokens / hr | Peak hour | Peak count |
|---|---:|---:|---:|
| Day -1 (00:00 → 23:59) | **2,108** | 20:00 | **2,698** |
| Day 0  (00:00 → now)   | 1,489 | 11:00 | 1,736 |

Two patterns emerge from the chart:

1. **Strong diurnal cycle** — launches cluster around **15:00–22:00 UTC** (US morning + EU evening), tail off through the Asia overnight.
2. **Day-over-day deceleration** — Day 0 is running ~30% slower than Day −1. That's the kind of signal a discretionary trader would pair with sentiment data to call a meta cooldown.

## What This Tells a Trader

- **Launchpad activity is your meta thermometer.** Sustained launch counts above the baseline suggest fresh capital and risk-on sentiment; falling counts often precede a quieter trading session.
- **There's a clock to launches.** US morning + EU evening hours produce the most activity. If you're sniping or providing liquidity to fresh launches, that's when to focus.
- **You can apply the same lens to any launchpad.** Just say *"do the same for LetsBonk"* or *"compare Pump.fun and FourMeme"* — see the [Solana](/docs/blockchain/Solana/) and [BSC](/docs/blockchain/BSC/) sections for the full set.

## Trader Playbook

| You want to … | Just ask the agent |
|---|---|
| **Catch a launch wave early** | *"Alert me whenever the last hour's new-token count is more than 1.5× the trailing 24h average."* (poll the agent every minute) |
| **Filter to "successful" launches only** | *"Of the tokens launched on Pump.fun in the last 24h, how many crossed $10K in cumulative USD volume in their first hour?"* |
| **Compare two launchpads** | *"Plot hourly new-token counts for Pump.fun vs LetsBonk for the last 7 days."* |
| **Heatmap by hour-of-day × day-of-week** | *"Build a 7×24 grid of average new-token count per hour-of-day per weekday for Pump.fun."* |
| **Quantify graduation flow** | *"What percentage of Pump.fun-launched tokens in the last 24h ever traded on Pumpswap?"* |

## Variations the Agent Handles in One Sentence

- *"For each launchpad on Solana, show today's new-token count and yesterday's, side by side."*
- *"Show me the 10 most-traded tokens that were launched on Pumpfun in the last 6 hours."*
- *"What % of Pumpfun-launched tokens in the last 24h ever traded on Pumpswap (i.e. graduated)?"*
- *"Plot the cumulative number of new Pumpfun tokens this week vs last week."*

## Take It Further

- For deeper Pumpfun coverage in GraphQL — including bonding-curve progress, market cap snapshots, and Pumpfun → Pumpswap migration — see the [Pump.fun API](/docs/blockchain/Solana/Pumpfun/Pump-Fun-API/), [Pump.fun ↔ Pump-swap migration](/docs/blockchain/Solana/Pumpfun/pump-fun-to-pump-swap/), and [Bonding-Curve Market Cap API](/docs/blockchain/Solana/Pumpfun/Pump-Fun-Marketcap-Bonding-Curve-API/).
- Build a real-time sniper from the same data via [Solana sniper bot](/docs/usecases/solana-sniper-bot/).
- See where Pumpfun sits in the wider Solana DEX landscape: [Solana DEX Market Share](/docs/mcp/trading/examples/solana-dex-market-share/).
- Identify the wallets sniping fresh launches by combining this pattern with [Decode a Whale Wallet](/docs/mcp/trading/examples/whale-wallet-decode/).
- For a tour of what's in the trading dataset, see the [trading overview](/docs/mcp/trading/overview/).
