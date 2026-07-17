---
title: "Trading Data Overview — Chain-Level Trades vs Trading Cube"
description: "Bitquery exposes DEX trading data in two ways: raw chain-level trades (DEXTrades / DEXTradeByTokens) and the unified Trading cube (Trading.Trades, Currencies, Tokens, Pairs). Learn the difference and pick the right API."
sidebar_position: 1
keywords:
  - bitquery trading data
  - dex trades vs trading trades
  - dextrades api
  - dextradebytokens api
  - trading.trades
  - trading.tokens
  - trading.currencies
  - trading.pairs
  - bitquery price index
  - crypto price api
  - multi-chain trading api
---

import FAQ from "@site/src/components/FAQ";

# Trading Data Overview — Chain-Level Trades vs Trading Cube

Bitquery exposes DEX trading data through **two complementary product families**. The choice between them is driven primarily by **how far back you need to look**.

:::tip Rule of thumb — pick by time window
- **Real-time + last ~30 days** → use the **Trading cube** ([`Trading.Trades`](/docs/trading/crypto-trades-api/trades-api) for swap-level rows, [`Trading.Tokens`](/docs/trading/crypto-price-api/tokens) / [`Currencies`](/docs/trading/crypto-price-api/currency) / [`Pairs`](/docs/trading/crypto-price-api/pairs) for pre-aggregated OHLC). USD price, market cap, and supply come baked in — across **9 chains in one API**.
- **Older than ~30 days (historical / archive)** → use chain-level [**`DEXTrades`**](/docs/cubes/dextrades) or [**`DEXTradeByTokens`**](/docs/cubes/dextradesbyTokens) (with `dataset: combined` or `dataset: archive`). Full history, raw on-chain detail, but you derive USD yourself.
:::

> Already know you want a chain-level cube and just need to choose between `DEXTrades` and `DEXTradeByTokens`? Jump to the row-shape-level comparison: [**DEXTrades vs DEXTradeByTokens vs Trades cube**](/docs/cubes/dextrades-dextradebytokens-trading-trades).

| | **Chain-Level Trades** | **Trading Cube** |
|---|---|---|
| **Time window** | **Full historical archive** — years of data via `dataset: combined` / `archive` | **Real-time + last ~30 days only** (rolling window) |
| **Cubes / fields** | `EVM.DEXTrades`, `EVM.DEXTradeByTokens`, `Solana.DEXTrades`, `Solana.DEXTradeByTokens`, etc. | `Trading.Trades`, `Trading.Currencies`, `Trading.Tokens`, `Trading.Pairs` |
| **What it is** | Raw, parsed swaps directly from each chain | Curated, multi-chain trading feed built **on top of** chain-level trades |
| **Granularity** | Per-chain, per-DEX, per-swap (with calls / instructions / events context) | Per-swap (`Trades`) + pre-aggregated OHLC (`Tokens` / `Currencies` / `Pairs`) |
| **USD prices** | Not present for every token — you derive prices yourself | USD price, market cap, FDV, supply on every row via the **Bitquery Price Index** |
| **OHLC** | Built **on the fly** from raw trades inside your query (any interval) | **Pre-aggregated** down to **1 second** (fixed intervals) |
| **Quality filtering** | Raw — every on-chain swap, including MEV / outliers | **MEV and low-quality trades filtered** out for cleaner feeds |
| **Calls / events / instructions** | Yes — full transaction context available | No — trade-only schema |
| **Chains** | Each chain has its own root (EVM, Solana, Tron, etc.) | **9 chains under one API**: Ethereum, BSC, Solana, Base, Arbitrum, Tron, Optimism, Polygon, Robinhood |
| **Best for** | **Historical analytics** (anything older than ~30 days), archive backfills, on-chain research, anything that needs call / event context | **Real-time + last ~30 days** — trading UIs, charting apps, price tickers, bots, screeners, alerts — anything that wants "ready-to-use" trade + price + supply data |

> **TL;DR** — **Last 30 days + real-time → Trading cube. Older than 30 days → DEXTrades / DEXTradeByTokens.** Same trades underneath: the Trading cube reads from DEXTrades, attaches Price-Index USD + supply, drops MEV / bad trades, and ships a clean multi-chain stream — but only for the rolling 30-day window. For anything deeper into history, drop down to the chain-level archive.

---

## 1. Chain-Level Trades — `DEXTrades` & `DEXTradeByTokens`

Chain-level trades are parsed **directly from each blockchain**. Every DEX swap that lands on-chain is captured, decoded, and exposed under the chain's root in GraphQL (e.g. `EVM.DEXTrades`, `Solana.DEXTradeByTokens`).

**Characteristics**

- **Raw and complete** — every swap on every supported DEX, including MEV bots, sandwich attacks, and zero-value noise.
- **No USD price on every row** — many long-tail tokens have no direct USD pair, so price has to be derived (e.g. via a routing token like WETH/USDC).
- **Full chain context** — same row can be joined to **calls / instructions** and **events / logs** for the originating transaction.
- **Full historical archive** — use `dataset: archive` or `dataset: combined` to backfill years of trades.
- **OHLC is built in-query** — aggregate `Trade.Price` / `Trade.PriceInUSD` with `Block.Time(interval: ...)` to build candles at **any** custom interval.
- **Two access shapes for the same data**:
  - **`DEXTrades`** — one row per swap, *from the pool's perspective* (Buy / Sell side).
  - **`DEXTradeByTokens`** — two rows per swap, *from each token's perspective* (ideal for token-level OHLC and "all pairs a token trades in"). Read more in the [DEXTradeByTokens cube guide](/docs/cubes/dextradesbyTokens).

**Use chain-level trades when you need:**

- **Data older than ~30 days** — the Trading cube doesn't go back further; only chain-level archives do.
- Deep historical OHLC, backfills, or archive ranges of any size.
- Per-trade detail that includes the originating call, instruction, or event log.
- Custom OHLC intervals not supported by the pre-aggregated cubes.
- On-chain analytics scoped to a single chain or a specific DEX protocol.

Learn more: [DEX Trades API (EVM)](/docs/evm/dextrades) · [DEXTradeByTokens Cube](/docs/cubes/dextradesbyTokens) · [Crypto Price API vs DEXTradeByTokens](/docs/trading/crypto-price-api/crypto-ohlc-candle-k-line-api#crypto-price-api-vs-dextradebytoken).

---

## 2. Trading Cube — `Trading.Trades`, `Tokens`, `Currencies`, `Pairs`

The Trading cube is the **product layer** built on top of chain-level trades. It is designed for people who want **trade and price data they can put straight into a UI, bot, or chart** without writing aggregation logic.

It is exposed under a single `Trading` root and covers **9 chains in one API**: Ethereum, BSC, Solana, Base, Arbitrum, Tron, Optimism, Polygon, and Robinhood.

### What lives in the Trading cube?

| Cube | What it gives you | Typical use |
|---|---|---|
| **`Trading.Trades`** | Individual swap-level rows with **USD price**, **USD amounts**, **market cap**, **FDV**, **supply**, and pair / trader / tx context | Live trade feeds, copy-trading bots, whale alerts, per-swap analytics |
| **`Trading.Tokens`** | Pre-aggregated OHLC, volume, supply and moving averages for a **token on a specific chain** | Token-level price charts, token screeners |
| **`Trading.Currencies`** | Pre-aggregated OHLC for a **currency aggregated across chains** (e.g. BTC across WBTC, cbBTC, native BTC, etc.) | Chain-agnostic global price for an asset |
| **`Trading.Pairs`** | Pre-aggregated OHLC and volume **per trading pair on a specific market/DEX** | Pair-specific charts (e.g. SOL/USDC on Raydium) |

### Characteristics

- **USD price on every row** — powered by the [Bitquery Price Index](/docs/trading/crypto-price-api/price-index-algorithm), which derives a USD value for **every** token (even long-tail tokens with no direct stable pair).
- **Supply & market-cap snapshots** included — `MarketCap`, `FullyDilutedValuationUsd`, `CirculatingSupply`, `TotalSupply`, `MaxSupply`. See [Supply fields](/docs/trading/crypto-price-api/supply-fields).
- **Pre-aggregated OHLC** in `Tokens`, `Currencies` and `Pairs` — down to **1-second** candles, with fixed intervals (`1, 3, 5, 10, 30, 60, 300, 900, 1800, 3600` seconds).
- **MEV and low-quality trades are filtered out** — outliers, sandwich attacks, near-zero amounts, and bad prints are removed so the feed is safe to render to end users.
- **No calls / events / instructions** — the schema is intentionally trade-shaped; for transaction context, drop down to the chain-level APIs.
- **Rolling ~30-day window** — Trading cube data is not a deep archive; for older trades use the chain-level DEXTrades archive.

### Use the Trading cube when you need:

- **Real-time data or anything within the last ~30 days** — this is the default for live trading UIs, bots, dashboards, and screeners.
- A **multi-chain trade or price stream** without writing per-chain queries.
- **USD pricing, market cap, and supply** ready on every row (no separate price lookups).
- **Pre-aggregated OHLC** at 1-second or longer intervals (Tokens / Currencies / Pairs).
- A **clean, MEV-filtered** feed safe to render in a trading UI or feed to a bot.
- Sub-second latency over GraphQL subscriptions or the [`trading.prices`](/docs/trading/crypto-price-api/introduction#kafka-topic-for-crypto-price-stream-tradingprices) Kafka topic.

Learn more: [Crypto Trades API](/docs/trading/crypto-trades-api/trades-api) · [Crypto Price API](/docs/trading/crypto-price-api/introduction) · [Price Index Algorithm](/docs/trading/crypto-price-api/price-index-algorithm).

---

## How the two layers relate

```
                ┌───────────────────────────────────────┐
                │     On-chain swaps (every DEX)        │
                └────────────────────┬──────────────────┘
                                     │ parsed per chain
                                     ▼
   ┌──────────────────────────────────────────────────────────────┐
   │  Chain-Level Trades                                          │
   │    EVM.DEXTrades / EVM.DEXTradeByTokens                      │
   │    Solana.DEXTrades / Solana.DEXTradeByTokens / …            │
   │    + calls, events, instructions                             │
   │    + full historical archive                                 │
   └────────────────────┬─────────────────────────────────────────┘
                        │ MEV + bad-trade filtering
                        │ Bitquery Price Index attaches USD + supply
                        ▼
   ┌──────────────────────────────────────────────────────────────┐
   │  Trading Cube  (9 chains under one API)                      │
   │    Trading.Trades        — clean swap-level rows + USD       │
   │    Trading.Tokens        — pre-aggregated token OHLC         │
   │    Trading.Currencies    — cross-chain currency OHLC         │
   │    Trading.Pairs         — per-market pair OHLC              │
   │    ~30-day rolling window                                    │
   └──────────────────────────────────────────────────────────────┘
```

In short: **`Trading.Trades` is sourced from `DEXTrades`**, with MEV / low-quality trades dropped and Price-Index USD + supply data joined on. The aggregated cubes (`Tokens`, `Currencies`, `Pairs`) are then built on top of that cleaned trade stream.

---

## Which API should I use?

The first two rows answer the question for 80% of users — pick by **how far back you need data**. The rest are tie-breakers when both windows would technically work.

| If you want to… | Use |
|---|---|
| Get **real-time** or **last ~30 days** of trades / OHLC | **`Trading.Trades`** (swap-level) or **`Trading.Tokens` / `Pairs` / `Currencies`** (OHLC) |
| Get **older than ~30 days** of trades or candles (historical / archive) | **`EVM.DEXTradeByTokens`** / **`Solana.DEXTradeByTokens`** (with `dataset: combined` or `archive`) |
| Render a real-time trade tape in a trading UI | `Trading.Trades` |
| Power a price ticker / candle chart with ready USD values | `Trading.Tokens` or `Trading.Pairs` |
| Get a chain-agnostic price for an asset (e.g. BTC across all chains) | `Trading.Currencies` |
| Stream all swaps on 9 chains in **one** subscription | `Trading.Trades` |
| Build OHLC at a **custom** interval (e.g. 7-second, 4-hour) | `DEXTradeByTokens` (in-query aggregation) |
| Join trades to the originating **call / instruction / event log** | `EVM.DEXTrades` / `Solana.DEXTrades` |
| Analyse MEV, sandwich attacks, or raw flow | Chain-level (Trading cube filters these out) |
| Build wallet-level PnL with USD attribution out-of-the-box | `Trading.Trades` |

:::tip Mixing both layers
A common pattern is to use the **Trading cube** for the live + 30-day-window tab of your UI (clean USD prices, low latency, multi-chain) and drop down to **`DEXTradeByTokens`** for the *historical* tab of the same UI (deep archive, custom intervals).
:::

---

## Next steps

- **Trading cube docs:** [Crypto Trades API](/docs/trading/crypto-trades-api/trades-api) · [Crypto Price API](/docs/trading/crypto-price-api/introduction) · [Tokens cube](/docs/trading/crypto-price-api/tokens) · [Currencies cube](/docs/trading/crypto-price-api/currency) · [Pairs cube](/docs/trading/crypto-price-api/pairs)
- **Chain-level trade docs:** [DEX Trades (EVM)](/docs/evm/dextrades) · [DEXTradeByTokens cube](/docs/cubes/dextradesbyTokens) · [Solana DEX Trades](/docs/blockchain/Solana/solana-dextrades)
- **Price Index internals:** [Price Index Algorithm](/docs/trading/crypto-price-api/price-index-algorithm) · [Supply fields reference](/docs/trading/crypto-price-api/supply-fields)
- **API delivery comparison:** [GraphQL Query vs Subscription vs Kafka](/docs/api-comparison)

<FAQ
  items={[
    { q: "When should I use Trading.Trades instead of DEXTrades?", a: "Use Trading.Trades for real-time or last ~30 days when you want clean USD prices, market cap, and MEV-filtered swaps across 9 chains in one query. Use DEXTrades when you need call/event context or raw per-chain detail." },
    { q: "How far back does the Trading cube go?", a: "Roughly the last 30 days. For older OHLC or trade history, use DEXTradeByTokens with dataset combined or archive." },
    { q: "Can I use both the Trading cube and chain-level APIs in one app?", a: "Yes — a common pattern is Trading.Trades for the live tab and DEXTradeByTokens for the historical tab of the same UI." },
    { q: "Does the Trading cube filter out bad trades?", a: "Yes. MEV, wash, and outlier trades are dropped before USD price and supply fields are joined on each row." },
    { q: "Which chains does Trading.Trades cover?", a: "Solana, Ethereum, BSC, Base, Arbitrum, Optimism, Polygon, Tron, and Robinhood in one unified schema." },
  ]}
/>
