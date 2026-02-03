---
sidebar_position: 4
title: Tools & SDKs Directory
description: Discover sample apps, dashboards, and SDKs built with Bitquery blockchain data APIs. Try live demos, clone repos, and integrate crypto data into your projects.
keywords:
  - Bitquery tools
  - blockchain API tools
  - crypto data SDKs
  - Bitquery sample apps
  - blockchain dashboards
  - DEX analytics tools
  - staking API
  - crypto price SDK
---

# Tools & SDKs Directory

Explore **sample applications**, **dashboards**, and **SDKs** built with Bitquery blockchain data. Use these tools to analyze tokens, monitor liquidity, score DeFi portfolios, build charts, or integrate real-time crypto data into your own apps. Each entry includes source code (GitHub), documentation, and—where available—a live demo you can try.

---

## Apps & Dashboards (UI-based)

Ready-to-use web apps and dashboards powered by Bitquery APIs. Many include a live demo, GitHub repository, and a step-by-step how-to guide in our docs.

### Try live & documented

| Tool | Description | Try it | How-to guide | Source |
|------|-------------|--------|---------------|--------|
| **Pump.fun Token Sniffer** | Analyze Pump.fun (Solana) token metrics: holder distribution, transfer vs purchase patterns, top holders, bonding curve. | [Open app](https://docs.bitquery.io/pumpfun-token-sniffer/) | [Guide](/docs/usecases/pumpfun-token-sniffer) | [GitHub](https://github.com/Akshat-cs/pumpfun-token-sniffer) |
| **DeFi Portfolio Scorer** | Calculate a DeFi Strategy Score (25–100) for any Ethereum address using transaction count, protocol usage, and asset diversity. | [Open app](https://docs.bitquery.io/ethereum-wallet-defi-score/) | [Guide](/docs/usecases/defi_portfolio_scorer) | [GitHub](https://github.com/Akshat-cs/Defi-Portfolio-Profiler) |
| **Realtime Liquidity Drain Detector** | Monitor DEX pools in real time via Kafka; detect significant liquidity drops and get alerts on a web dashboard. | — | [Guide](/docs/usecases/realtime-liquidity-drain-detector) | [GitHub](https://github.com/Akshat-cs/realtime-liquidity-drain-detector) |

### Open-source apps (GitHub)

| Tool | Description | Source |
|------|-------------|--------|
| **Wash Trading Detector** | Detect wash trades on Solana using Bitquery data and ML. | [GitHub](https://github.com/Kshitij0O7/wash-trading-detector) |
| **Staking Tax Report Generator** | Generate staking tax reports from blockchain data. | [GitHub](https://github.com/Kshitij0O7/staking-tax-report-generator) |
| **Staking Dashboard** | Dashboard for staking activity and metrics. | [GitHub](https://github.com/Kshitij0O7/staking-dashboard) |
| **Validator Data Dashboard** | Monitor and visualize validator data. | [GitHub](https://github.com/Kshitij0O7/validator-data-dashboard) |
| **EVM Sniper** | EVM-based sniper tool using Bitquery data. | [GitHub](https://github.com/Kshitij0O7/evm-sniper) |
| **Sentinel Crypto Watch** | Crypto monitoring and alerting. | [GitHub](https://github.com/Kshitij0O7/sentinel-crypto-watch) |

### Charting & trading

| Tool | Description | Source | Docs |
|------|-------------|--------|------|
| **TradingView with Realtime Data** | TradingView charts with real-time OHLCV via Bitquery subscriptions. | [GitHub](https://github.com/bitquery/tradingview-subscription-realtime/tree/main) | [TradingView Realtime guide](/docs/usecases/tradingview-subscription-realtime/getting-started) |
| **AI Crypto Trader All-in-One** | AI-driven crypto trading sample using Bitquery data. | [GitHub](https://github.com/divyasshree-BQ/AI-crypto-trader-all-in-one) | — |
| **AI Crypto Trader All-in-One (CoW Intent)** | CoW Intent–based variant of the AI crypto trader. | [GitHub](https://github.com/divyasshree-BQ/AI-crypto-trader-all-in-one-CoW-Intent) | — |

---

## SDKs & npm Packages

Install these packages to fetch crypto prices, staking rewards, prediction market data, or to work with Bitquery Kafka protobuf schemas and TON.

| Package | Description | npm |
|---------|-------------|-----|
| **bitquery-tradingview-sdk** | Easy TradingView Charting via Bitquery | [npm](https://www.npmjs.com/package/@bitquery/tradingview-sdk) |
| **bitquery-crypto-price** | Crypto price data via Bitquery APIs. | [npm](https://www.npmjs.com/package/bitquery-crypto-price) |
| **staking-rewards-api** | Staking rewards and validator data. | [npm](https://www.npmjs.com/package/staking-rewards-api) |
| **polymarket-api** | Polymarket prediction market data. | [npm](https://www.npmjs.com/package/polymarket-api) |
| **bitquery-protobuf-schema** | Protobuf schemas for Bitquery Kafka streams (e.g. DEX pools, trades). | [npm](https://www.npmjs.com/package/bitquery-protobuf-schema) |
| **bitquery-ton-sdk** | Bitquery SDK for TON blockchain data. | [npm](https://www.npmjs.com/package/bitquery-ton-sdk) |


---

## How to use this directory

- **Try an app** — Use the “Try it” / “Open app” links to run demos in your browser.
- **Build it yourself** — Follow the “How-to guide” links for installation, configuration, and code walkthroughs.
- **Extend or fork** — Clone the GitHub repos to customize logic, add features, or integrate with your stack.
- **Integrate via SDK** — Use the npm packages in Node.js or TypeScript projects for prices, staking, Polymarket, Kafka protobuf, or TON.

For more step-by-step tutorials (Discord/Telegram bots, dashboards, snipers, wash trading, NFT tools), see [How-To Guides](/docs/category/how-to-guides/).
