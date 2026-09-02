---
title: "Robinhood Chain API — Trades, Launchpads & Real-Time Streams"
description: "Robinhood Chain APIs from Bitquery: query trades, transfers, balances, token holders, liquidity, events, and every major launchpad on chain 4663 with GraphQL and WebSocket streams."
sidebar_position: 0
keywords:
  - Robinhood Chain API
  - Robinhood Chain data API
  - Robinhood Chain 4663
  - Robinhood Chain GraphQL API
  - Robinhood Chain launchpad API
  - Robinhood Chain trades API
  - Robinhood Chain WebSocket
  - Robinhood Chain token launches
  - Robinhood Chain bonding curve
  - Robinhood Chain memecoin API
  - Robinhood Chain holders API
  - Robinhood Chain liquidity API
  - how to index Robinhood Chain
  - track new tokens Robinhood Chain
  - Bitquery Robinhood API
---

# Robinhood Chain API — Trades, Launchpads & Real-Time Streams

**Robinhood Chain** (`network: robinhood`, chain ID **4663**) is an EVM network. Bitquery indexes it end to end — blocks, transactions, internal calls, decoded events, token transfers, balances, DEX trades, and pool liquidity — and exposes all of it through one GraphQL endpoint, with any query convertible into a live WebSocket stream.

This page is the index for that coverage. Start here if you are deciding **which cube answers your question**; go straight to a linked page once you know.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

---

:::tip Live trades and prices — use the Trading API
For real-time trades, USD prices, market cap, and OHLC on Robinhood Chain (and 8 other chains in the same API), use the [Trading cubes](/docs/trading/trading-data-overview/) (`Trading.Trades` / `Tokens` / `Pairs`). Use chain-level `DEXTrades` for history older than ~30 days or when you need call/event context.
:::

## Pick the right API

| What you want | Use this | Page |
| --- | --- | --- |
| Swap prices, volume, OHLCV | `Trading` cubes (real-time + last ~30 days); `DEXTrades` for older history | [Robinhood Trades API](/docs/blockchain/robinhood/robinhood-trades) |
| Who sent what to whom | `Transfers` | [Robinhood Transfers API](/docs/blockchain/robinhood/robinhood-transfers) |
| A wallet's portfolio and history | `Balances` | [Robinhood Balances API](/docs/blockchain/robinhood/robinhood-balances-api) |
| Holder counts and distribution | `TokenHolders` | [Robinhood Token Holders API](/docs/blockchain/robinhood/robinhood-token-holders-api) |
| Circulating and total supply | `TokenSupply` | [Robinhood Token Supply API](/docs/blockchain/robinhood/robinhood-token-supply) |
| Pool depth and per-swap slippage | `DEXPools` | [Robinhood Liquidity & Slippage API](/docs/blockchain/robinhood/robinhood-liquidity) |
| Any decoded contract event | `Events` | [Robinhood Events API](/docs/blockchain/robinhood/robinhood-events-api) |
| Method calls, internal calls, traces | `Calls` | [Robinhood Calls & Traces API](/docs/blockchain/robinhood/robinhood-calls-api) |
| Raw transactions and receipts | `Transactions` | [Robinhood Transactions & Receipts API](/docs/blockchain/robinhood/robinhood-transactions-receipts-api) |
| Perp positions and funding | Perp DEX cubes | [Lighter Perp DEX API](/docs/blockchain/robinhood/lighter-perp-dex-api) |

---

## Launchpads on Robinhood Chain {#launchpads}

Robinhood Chain hosts several token launchpads. They are **not interchangeable** — each has its own factory contracts, its own event signatures, and a different relationship to the DEX it graduates into. A query written for one will silently return nothing on another.

| Launchpad | Model | Guide |
| --- | --- | --- |
| **Pons** | Real bonding curve per token, graduates into a Uniswap v4 pool behind a Pons-owned hook | [Pons Launchpad API on Robinhood Chain](/docs/blockchain/robinhood/pons-api) |
| **pools.trade** | Uniswap v4 pool from block one — no curve, no graduation event | [Pools.trade API on Robinhood](/docs/blockchain/robinhood/pools-trade-api) |
| **Flap.sh** | Bonding curve with per-token tax and progress events, graduates to a DEX | [Flap.sh API on Robinhood](/docs/blockchain/robinhood/flap-sh-api) |
| **Bags.fm** | Creator-fee launchpad | [Bags.fm API on Robinhood](/docs/blockchain/robinhood/bags-fm-api) |

For a **cross-launchpad feed** — every new token on the network regardless of which factory minted it — use the [Robinhood Meme Coin Launches API](/docs/blockchain/robinhood/robinhood-meme-coin-launches), which covers the factories above plus the smaller ones.

:::tip Choosing between a launchpad page and the cross-launchpad feed
The cross-launchpad feed answers *"what launched?"*. The per-launchpad pages answer *"what is this token doing?"* — curve trades, graduation progress, fee splits, and pool state. Most production pipelines use the feed for discovery and one launchpad page for depth.
:::

---

## Streaming

Every query on every page below can run as a WebSocket subscription — swap `query` for `subscription` and keep the same selection set. For firehose-scale workloads, use Kafka instead of WebSocket.

- [WebSocket subscriptions](/docs/subscriptions/websockets/)
- [Authorizing a WebSocket connection](/docs/authorization/websocket/)
- [Streams overview — WebSocket vs Kafka vs gRPC](/docs/streams/)

---

## Datasets and history

Robinhood Chain queries accept a `dataset` argument that decides how far back you can reach and how fresh the tail is.

- [`realtime`](/docs/graphql/dataset/realtime) — lowest latency, limited retention window
- [`archive`](/docs/graphql/dataset/archive) — full history, higher latency
- [`combined`](/docs/graphql/dataset/combined) — both, stitched
- [Data coverage and retention](/docs/graphql/data-coverage-retention) — what each window actually holds

If a query on recent data works but the same query returns nothing for older blocks, the dataset argument is almost always the reason.
