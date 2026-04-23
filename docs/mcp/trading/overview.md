---
title: "Trading Data on the Bitquery MCP — Overview"
description: "What trading data the Bitquery MCP exposes: chains, DEX protocols, granularity & outlier filtering across Solana, Ethereum, BSC, Base, Arbitrum & more."
keywords:
  - Bitquery MCP trading data
  - DEX trades MCP
  - Solana trading MCP
  - Ethereum DEX MCP
  - multi-chain trading data
  - mcp.bitquery.io trading
  - blockchain data AI agent
  - DEX OHLC AI
---

<head>
  <meta name="title" content="Trading Data on the Bitquery MCP — Overview"/>
  <meta name="description" content="What trading data the Bitquery MCP exposes: chains, DEX protocols, granularity & outlier filtering across Solana, Ethereum, BSC, Base, Arbitrum & more."/>
  <meta name="robots" content="index, follow"/>
  <meta property="og:type" content="article"/>
  <meta property="og:title" content="Trading Data on the Bitquery MCP — Overview"/>
  <meta property="og:description" content="What trading data the Bitquery MCP exposes across Solana, Ethereum, BSC, Base, Arbitrum, Optimism, Polygon, Tron — DEX trades, OHLC, market cap, wallet flow."/>
  <meta property="og:url" content="https://docs.bitquery.io/docs/mcp/trading/overview/"/>
  <meta property="og:image" content="https://docs.bitquery.io/img/mcp/charts/cross-chain-volume.svg"/>
  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="Trading Data on the Bitquery MCP — Overview"/>
  <meta property="twitter:description" content="What trading data the Bitquery MCP exposes across Solana, Ethereum, BSC, Base, Arbitrum, Optimism, Polygon, Tron — DEX trades, OHLC, market cap, wallet flow."/>
  <meta property="twitter:image" content="https://docs.bitquery.io/img/mcp/charts/cross-chain-volume.svg"/>
  <link rel="canonical" href="https://docs.bitquery.io/docs/mcp/trading/overview/"/>
</head>

# Trading Data on the Bitquery MCP

The [Bitquery MCP server](/docs/mcp/mcp-server/) plugs your AI agent directly into Bitquery's **trading dataset** — the same data that powers the [Crypto Trades API](/docs/trading/crypto-trades-api/trades-api/), [Crypto Price API](/docs/trading/crypto-price-api/introduction/), [TradingView feeds](/docs/usecases/tradingview-subscription-realtime/getting-started/), and our GraphQL endpoints.

Ask in plain English, get clean rows back. No SQL required.

## At a Glance

| | |
|---|---|
| **Endpoint** | [`https://mcp.bitquery.io`](https://mcp.bitquery.io) |
| **Chains** | Solana, Ethereum, BSC, Base, Arbitrum, Optimism, Polygon (Matic), Tron |
| **Granularity** | Per-trade rows + pre-aggregated 1m / 5m / 1h / 1d cubes |
| **Outlier filter** | Built in — just say "skip wash-traded pools" in your prompt |
| **Latency** | Near real-time, updates as blocks land |
| **Coverage** | Years of history on every supported chain |

## Chains and DEX Protocols

Live on the MCP today:

| Network | DEXs / venues exposed |
|---|---|
| **Solana** | Raydium, Pumpfun, PumpSwap, Meteora (DLMM, DAMM v2, Dynamic Bonding Curve), Orca Whirlpool, BonkSwap, Lifinity, Phoenix, OpenBook, Manifest, MagicEden, Moonshot, Believe, LetsBonk, Heaven, Goonfi, Bags.fm, Trends.fun, Jupiter Studio, Boop.fun, Aldrin, SolFi, Orbic, xStocks, … |
| **Ethereum** | Uniswap (v2/v3/v4), PancakeSwap, Curve, Balancer, 1inch, Bancor, KyberNetwork, Mooniswap, Magpie, Seaport, … |
| **Binance Smart Chain** | PancakeSwap (incl. Infinity), Uniswap, FourMeme, Flap, Magpie, Aerodrome, Bancor, Balancer, 1inch, … |
| **Base** | Aerodrome, Uniswap (incl. v4), PancakeSwap, Zora, Magpie, Apestore, Clanker, JumpBase, Seaport, … |
| **Arbitrum** | Uniswap, PancakeSwap, Curve, Balancer, Magpie, GMX, esGMX, … |
| **Optimism** | Uniswap, Aerodrome, Balancer, PancakeSwap, … |
| **Polygon (Matic)** | Uniswap, PancakeSwap, Balancer, Polymarket, Seaport, … |
| **Tron** | SunSwap, SunPump |

Per-chain coverage details live in the [Blockchains section](/docs/blockchain/introduction/).

## What's on Every Trade

For each swap, the agent can pull:

- **When** — block date and time, down to the millisecond.
- **What** — the base token (network, contract, name, symbol) and the quote token (USDC, WETH, SOL, …).
- **Where** — the DEX (Meteora, Pumpswap, Raydium, Uniswap, …) and the specific pool address.
- **How much** — base and quote amounts, both in USD; the realised price; whether it was a buy or a sell.
- **Who** — the trader's wallet, the transaction hash, the fee payer.
- **Token economics at the moment of the trade** — total, circulating, and max supply; market cap; fully diluted valuation.
- **A quality score** — Bitquery's outlier ranking, so you can tell real liquidity from wash-traded noise in one filter.

## Two Levels of Granularity

The dataset gives you two views of the same trades:

1. **Per-trade rows** — one row per swap. Best for replays, audits, wallet PnL, sniping research, and any trader-level breakdown.
2. **Pre-built candles** at 1-minute, 5-minute, hourly, and daily intervals — with OHLC, multiple price averages, USD volume, and a supply snapshot on every row. Best for charts, dashboards, and trends.

When you ask the agent for "candles", "OHLC", "hourly volume", or "trend", it picks the candle view. When you ask for "trades", "swaps", "wallet history", or "the last 100 buys", it picks the per-trade view. You don't have to think about it.

## Outlier Filtering Is Built In

Every row carries a quality score from Bitquery's [price-index ranking](/docs/trading/crypto-price-api/price-index-algorithm/). Pools with low scores are noisy, wash-traded, or thinly liquid.

To activate it, just say *"skip wash-traded pools"* or *"only clean volume"* in your prompt — the agent applies the filter automatically. Companion read: [How to filter anomaly prices](/docs/usecases/how-to-filter-anomaly-prices/).

## Where to Go Next

- [**Worked examples with charts**](/docs/mcp/trading/examples/) — six self-contained trader workflows with prompts and real-data charts:
  - [Hottest Solana Tokens](/docs/mcp/trading/examples/top-tokens-discovery/)
  - [Cross-Chain DEX Snapshot](/docs/mcp/trading/examples/cross-chain-snapshot/)
  - [Build an OHLC Candle Chart](/docs/mcp/trading/examples/token-ohlc-chart/)
  - [Solana DEX Market Share Battle](/docs/mcp/trading/examples/solana-dex-market-share/)
  - [Pump.fun Launch Pulse](/docs/mcp/trading/examples/pumpfun-launch-pulse/)
  - [Decode a Whale Wallet](/docs/mcp/trading/examples/whale-wallet-decode/)
- [**What you can do with it**](/docs/mcp/trading/use-cases/) — eleven common patterns with the natural-language prompts that trigger them, plus best practices for prompting.
- [**MCP server landing**](/docs/mcp/mcp-server/) — install, OAuth, architecture.
- [**Crypto Price Index Algorithm**](/docs/trading/crypto-price-api/price-index-algorithm/) — how outlier filtering and ranking are computed.
- [**Supply fields**](/docs/trading/crypto-price-api/supply-fields/) — what `MarketCap`, `FDV`, `CirculatingSupply` mean and how they are derived.
