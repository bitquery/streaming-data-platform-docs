---
title: Ethereum API Documentation
description: Collection of Ethereum APIs, Streams
slug: /examples/Ethereum/
keywords:
  - Ethereum API
  - Ethereum RPC
  - Ethereum blockchain API
  - Ethereum GraphQL API
  - EVM API
---

This page is your hub for Ethereum on‑chain analytics—transactions, token balances and holders, DEX trades/liquidity, blocks, events, fees, mempool, and NFTs—available via GraphQL APIs and real‑time streams.

Need help crafting a query or subscription? Message us on [support](https://t.me/Bloxy_info).

## What is the Bitquery Ethereum API?

It’s a GraphQL interface over curated, indexed Ethereum data. Write concise queries instead of building and maintaining your own indexer.

## What can you build with it?

Track wallet portfolios and token holders, monitor DEX price/volume and liquidity events, analyze gas and fees, stream mempool activity, compute KPIs over blocks/transactions, and power dashboards or trading systems with real‑time data.

## How is it different from raw Ethereum RPC?

**Ethereum RPC**

- Low‑level JSON‑RPC that returns raw node data
- No historical indexing, joins, or analytics out of the box
- Best for transaction submission and node-level introspection

**Bitquery Ethereum API**

- Pre‑indexed, enriched datasets exposed via GraphQL
- Powerful filtering, joins, aggregations, and subscriptions
- Ideal for analytics, monitoring, dashboards, and backtesting without running infra

## WebSockets and Webhooks

Most queries can be turned into live streams by switching `query` to `subscription`, and consumed over WebSocket. See examples and code snippets [here](https://docs.bitquery.io/docs/subscriptions/websockets/).

## DEX Trades

- [DEX API](https://docs.bitquery.io/docs/examples/dextrades/dex-api)
- [Token Trades APIs](https://docs.bitquery.io/docs/examples/dextrades/token-trades-apis)
- [Trades of an Address API](https://docs.bitquery.io/docs/examples/dextrades/trades-of-an-address-api)
- [Uniswap API](https://docs.bitquery.io/docs/examples/dextrades/uniswap-api)
- [Pancakeswap API](https://docs.bitquery.io/docs/examples/dextrades/pancakeswap-api)
- [DEXScreener (EVM)](https://docs.bitquery.io/docs/examples/dextrades/DEXScreener/evm_dexscreener)

Query and subscribe to on‑chain swaps, OHLCV, liquidity events, pools, and per‑wallet trading activity across major EVM DEXes.

## Token Holders

- [Token Holder API](https://docs.bitquery.io/docs/examples/token-holders/token-holder-api)

Identify top holders, concentration, new/active holders, and changes over time.

## Transactions

- [Transaction API](https://docs.bitquery.io/docs/examples/transactions/transaction-api)

Inspect transaction metadata, status, value flows, method signatures, and more.

## Transfers

- [ERC20 Token Transfer API](https://docs.bitquery.io/docs/examples/transfers/erc20-token-transfer-api)
- [Total Supply](https://docs.bitquery.io/docs/examples/transfers/total-supply)

Follow ERC‑20 token flows and compute supply‑side metrics.

## Blocks

- [Blocks API](https://docs.bitquery.io/docs/examples/blocks/blocks-api)

Build time‑series metrics from block headers, miner/validator stats, and base fee changes.

## Balances

- [Balance API](https://docs.bitquery.io/docs/examples/balances/balance-api)

Get real‑time and historical balances for addresses and tokens.

## Events

- [Events API](https://docs.bitquery.io/docs/examples/events/events-api)

Query decoded contract logs with precise filtering on topics and parameters.

## Fees

- [Fees API](https://docs.bitquery.io/docs/examples/fees/fees-api)

Analyze gas usage, base fee dynamics, and transaction cost distributions.

## Mempool

- [Mempool API](https://docs.bitquery.io/docs/examples/mempool/mempool-api)

Monitor pending transactions to react before inclusion.

## NFT

- [NFT API](https://docs.bitquery.io/docs/examples/nft/nft-api)

Fetch collections, ownership, transfers, trades, and metadata.

## Videos

import VideoPlayer from "../../../src/components/videoplayer.js";

### DEX Trades on EVM (Uniswap, Aggregators, Screens)

<VideoPlayer url="https://youtu.be/xcW_Na7YwSk" />

<VideoPlayer url="https://www.youtube.com/watch?v=K_H3to_nIdY" />

<VideoPlayer url="https://www.youtube.com/watch?v=sdQxnuRftaw" />

<VideoPlayer url="https://www.youtube.com/watch?v=xw8eezkFejI" />

### Ethereum Price & Balances

<VideoPlayer url="https://youtu.be/qsg86xlfnhM" />
