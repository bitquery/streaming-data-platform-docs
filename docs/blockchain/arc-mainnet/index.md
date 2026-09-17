---
title: "Arc Blockchain API: GraphQL and WebSocket"
description: "Query and stream Circle’s Arc blockchain data with Bitquery’s Arc Blockchain API. Get trades, transfers, balances and blocks through GraphQL and WebSocket."
sidebar_position: 0
keywords:
  - Circle blockchain
  - Circle blockchain API
  - Circle Arc blockchain
  - Arc API
  - Arc blockchain API
  - Circle Arc API
  - Arc GraphQL
  - Arc WebSocket
  - Arc chain ID 5042
  - Arc USDC gas token
  - Arc explorer API
  - Arc Uniswap v4
  - EVM network arc
  - Bitquery Arc API
---

import FAQ from "@site/src/components/FAQ";

# Arc Blockchain API

Bitquery’s [**Arc Blockchain API**](https://bitquery.io/blockchains/arc-blockchain-api) queries and streams data from Circle’s Arc blockchain (chain ID `5042`). Use `Trading` for trading queries and streams, with `Pair.Market.Network: "Arc"` on `Trading.Trades`. Use `EVM(network: arc)` for transfers, balances, logs, calls, transactions and blocks.

:::tip Trading queries and streams
Use `Trading.Trades`, `Trading.Tokens` and `Trading.Pairs` for live data and the last 30 days. Use `EVM.DEXTrades` or `EVM.DEXTradeByTokens` only for trades older than 30 days, subject to Arc archive availability.
:::

Arc is Circle's EVM-compatible Layer 1. USDC pays gas, blocks reach finality in under a second, and the network is built for payments, foreign exchange and tokenized assets. [Arc launched](https://www.arc.io/blog/arc-mainnet-goes-live-on-september-16-2026) on **16 September 2026**. Circle's current RPC reference still labels its listed Arc endpoints and explorer as permissioned; Bitquery's indexed API is live.

:::info Availability checked 16 September 2026
`Trading.Trades`, `Trading.Tokens`, `Trading.Pairs`, and the realtime EVM cubes returned Arc data in production tests. Leave the dataset argument out of `Trading`; it does not support archive or combined. Arc's EVM `dataset: combined` and `dataset: archive` did not answer at this check.
:::

:::note API Key Required
To query or stream outside the Bitquery IDE, create an [API access token](/docs/authorization/how-to-generate/).
:::

---

## Arc at a glance {#network-facts}

| Property | Value |
| --- | --- |
| Trading network | `Arc` in `Pair.Market.Network` for trades; `Market.Network` for pair candles; `Token.Network` for token candles |
| EVM network | `arc` in `EVM(network: arc)` for other chain data |
| Chain ID | `5042` |
| Gas token | USDC, tracked as `Currency.Native: true` |
| USDC ERC-20 interface | `0x3600000000000000000000000000000000000000` (6 decimals) |
| EURC | `0xbEf5f6d51CB62b58e6A8f77868681825C6fe21c1` (6 decimals) |
| USYC | `0x8a5D989Bbb96929F689B0200f435f53dA42bF490` (6 decimals) |
| Uniswap v4 PoolManager seen by Bitquery | `0x8366a39cc670b4001a1121b8f6a443a643e40951` |
| Arc explorer | [explorer.arc.io](https://explorer.arc.io) (listed as permissioned in Arc's RPC reference) |
| Arc RPC | `https://rpc.mainnet.arc.io` (listed as permissioned in Arc's RPC reference) |
| Bitquery GraphQL | `https://streaming.bitquery.io/graphql` |

Arc's [network reference](https://docs.arc.io/arc/references/rpc-endpoints) confirms chain ID `5042`, USDC as the currency symbol, the RPC and the explorer. Arc's [contract list](https://docs.arc.io/arc/references/contract-addresses) gives the stablecoin addresses.

---

## Quick start: latest Arc swaps {#quick-start}

This Trading query returns the newest Arc trade rows with USD amounts and the market name.

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-trading-overview-quick-start-latest-arc-mainnet-swaps)

```graphql
{
  Trading {
    Trades(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {Pair: {Market: {Network: {is: "Arc"}}}}
    ) {
      Block { Time }
      TransactionHeader { Hash }
      Trader { Address }
      Side
      Amounts { Base Quote }
      AmountsInUsd { Quote }
      PriceInUsd
      Pair {
        Market { Network Protocol }
        Token { Id Symbol }
        QuoteToken { Id Symbol }
      }
    }
  }
}
```

Change `query` to `subscription` and remove `limit` and `orderBy` for a live feed. Follow [WebSocket authentication](/docs/authorization/websocket/) to connect. See the [Arc trades guide](/docs/blockchain/arc-mainnet/arc-mainnet-trades-api/) for token, pool, trader and protocol filters.

---

## Pick the right API {#pick-the-right-api}

| What you need | Cube | Guide |
| --- | --- | --- |
| Recent trades, USD volume and traders | `Trading.Trades` | [DEX Trades API](/docs/blockchain/arc-mainnet/arc-mainnet-trades-api/) |
| Recent token prices and OHLCV | `Trading.Tokens`, `Trading.Pairs` | [Prices and candles](/docs/blockchain/arc-mainnet/arc-mainnet-trades-api/#ohlcv-candles-for-a-token) |
| Trades older than 30 days, once Arc archive is available | `EVM.DEXTrades`, `EVM.DEXTradeByTokens` | [Older history](/docs/blockchain/arc-mainnet/arc-mainnet-trades-api/#trades-older-than-30-days) |
| New tokens from verified launchpads, then their first trades | `EVM.Events`, then `Trading.Trades` | [Launchpads API](/docs/blockchain/arc-mainnet/arc-mainnet-launchpads-api/) |
| Tolly launches, token trades, trader rankings and OHLCV | `Events`, `Trading.Trades`, `Trading.Pairs`, `Trading.Tokens` | [Tolly Launchpad API](/docs/blockchain/arc-mainnet/tolly-launchpad-api/) |
| RadarDEX Classic and Reflection launches, trades and prices | `Events`, `Trading.Trades`, `Trading.Pairs`, `Trading.Tokens` | [RadarDEX Launchpad API](/docs/blockchain/arc-mainnet/radardex-launchpad-api/) |
| Minara launches, pool creators, trades and OHLCV | `Events`, `Trading.Trades`, `Trading.Pairs`, `Trading.Tokens` | [Minara Launchpad API](/docs/blockchain/arc-mainnet/minara-launchpad-api/) |
| Token and native USDC movement | `Transfers` | [Transfers API](/docs/blockchain/arc-mainnet/arc-mainnet-transfers-api/) |
| Decoded logs and new pool events | `Events` | [Events API](/docs/blockchain/arc-mainnet/arc-mainnet-events-api/) |
| Method calls, call trees and reverts | `Calls` | [Calls API](/docs/blockchain/arc-mainnet/arc-mainnet-calls-api/) |
| Transactions, receipts, blocks and fees | `Transactions`, `Blocks` | [Transactions API](/docs/blockchain/arc-mainnet/arc-mainnet-transactions-api/) |
| Portfolios, holders, balance history and supply | `Balances`, `Holders`, `BalanceUpdates`, `TransactionBalances` | [Balances API](/docs/blockchain/arc-mainnet/arc-mainnet-balances-api/) |

---

## USDC on Arc {#usdc}

Native USDC and the ERC-20 interface share Arc's USDC model, but Bitquery exposes separate rows so each source stays clear.

| Form | Bitquery fields | Decimals |
| --- | --- | --- |
| Native USDC | `Token.Id: "bid:arc"` and empty `Token.Address` in Trading; `Currency.Native: true`, `SmartContract: "0x"` in EVM transfers and balances | 18 |
| ERC-20 USDC | `SmartContract: "0x3600000000000000000000000000000000000000"` | 6 |
| System ledger mirror | `0xfffffffffffffffffffffffffffffffffffffffe`, no symbol | raw integer |

Filter on `Native: true` for gas-token value transfers. Use the `0x3600...` address for ERC-20 calls and transfers. Exclude the system ledger mirror from token rankings.

---

## DEX data on launch day {#dexes}

Production checks found active Uniswap v4, v3 and v2 markets. Use `Trading.Trades` with `Pair.Market.Network: "Arc"` for these trades. The feed can include NFT market fills; filter `Pair.Market.Protocol` or `Pair.Market.ProtocolFamily` when you need a specific swap venue.

Arc token IDs use `bid:arc:<contract>`, and native USDC uses `bid:arc`. To inspect a trade's calls, logs or transfers, take `TransactionHeader.Hash` and query the matching EVM cube separately.

---

## Datasets and history {#datasets}

Trading serves live data and a rolling window of about 30 days. Arc may have less history while indexing starts. Only use the EVM trade cubes for older trades, after archive support is confirmed.

On 16 September 2026, only Arc's realtime EVM path answered. The following check measures EVM block history; it does not measure the Trading window:

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-docs-overview-datasets-and-history)

```graphql
{
  EVM(network: arc) {
    Blocks {
      count
      earliest: Block {
        Number(minimum: Block_Number)
        Time(minimum: Block_Time)
      }
      latest: Block {
        Number(maximum: Block_Number)
        Time(maximum: Block_Time)
      }
    }
  }
}
```

`dataset: combined` returned an unavailable-data error and `dataset: archive` could not reach its backing host during the check. Retry before treating those modes as live.

---

## Real-time streams {#streaming}

Use `Trading.Trades` for trade streams and `Trading.Tokens` or `Trading.Pairs` for price and candle streams. Change the operation to `subscription` and drop `limit`, `orderBy`, and historical time filters. Keep token and trader leaderboards built with aggregates such as `count` or `sum` as HTTP queries; see [streaming limits](/docs/subscriptions/what-does-not-survive-streaming/). The `Ranking.Position` filter on the candle cubes can still be used in a subscription.

See [WebSocket subscriptions](/docs/subscriptions/websockets/) and [WebSocket authorization](/docs/authorization/websocket/).

---

<FAQ
  title="FAQ"
  items={[
    { q: "What is the Bitquery network name for Arc?", id: "what-is-the-bitquery-network-name-for-arc-mainnet", a: "Use Arc in Pair.Market.Network for Trading.Trades. For other chain data use EVM(network: arc). The chain ID is 5042.",
      answer: <p>{"Use "}<code>{"Arc"}</code>{" in "}<code>{"Pair.Market.Network"}</code>{" for Trading.Trades. For other chain data use "}<code>{"EVM(network: arc)"}</code>{". The chain ID is "}<strong>{"5042"}</strong>{"."}</p> },
    { q: "Are USD fields available?", id: "are-usd-fields-available", a: "Yes. Trading.Trades returns PriceInUsd and AmountsInUsd.Quote. Trading.Tokens and Trading.Pairs return USD candles and Volume.Usd. Field names differ from those on the EVM cubes.",
      answer: <p>{"Yes. Trading.Trades returns "}<code>{"PriceInUsd"}</code>{" and "}<code>{"AmountsInUsd.Quote"}</code>{". Trading.Tokens and Trading.Pairs return USD candles and "}<code>{"Volume.Usd"}</code>{". Field names differ from those on the EVM cubes."}</p> },
    { q: "How far back does Arc data go?", id: "how-far-back-does-arc-mainnet-data-go", a: "Trading has a rolling window of about 30 days; Arc may have less history while indexing starts. Arc's realtime EVM dataset was live at launch, but combined and archive were not ready during the 16 September check.",
      answer: <p>{"Trading has a rolling window of about 30 days; Arc may have less history while indexing starts. Arc's realtime EVM dataset was live at launch, but combined and archive were not ready during the 16 September check. See "}<a href="#datasets">{"datasets and history"}</a>{"."}</p> },
    { q: "Can I use Trading.Trades for Arc?", id: "can-i-use-trading-trades-for-arc", a: "Yes. It is the default for Arc trade streams and trades within the last 30 days. Filter Pair.Market.Network by Arc. Use EVM trade cubes only for older trades, subject to archive availability.",
      answer: <p>{"Yes. It is the default for Arc trade streams and trades within the last 30 days. Filter "}<code>{"Pair.Market.Network"}</code>{" by "}<code>{"Arc"}</code>{". Use EVM trade cubes only for older trades, subject to archive availability."}</p> },
    { q: "Does Bitquery provide Arc RPC access?", id: "does-bitquery-provide-arc-rpc-access", a: "No. Bitquery is an indexed data API. Use Arc's RPC for state calls and transaction submission; use Bitquery for indexed queries and streams.",
      answer: <p>{"No. Bitquery is an indexed data API. Use Arc's RPC for state calls and transaction submission; use Bitquery for indexed queries and streams."}</p> },
  ]}
/>
