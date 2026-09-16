---
title: "Circle Blockchain API for Arc Mainnet"
description: "Query and stream Circle blockchain data on Arc mainnet (chain ID 5042) with Bitquery GraphQL and WebSocket APIs for trades, transfers, balances and blocks."
sidebar_position: 0
keywords:
  - Circle blockchain
  - Circle blockchain API
  - Circle Arc blockchain
  - Arc mainnet API
  - Arc blockchain API
  - Circle Arc API
  - Arc mainnet GraphQL
  - Arc mainnet WebSocket
  - Arc mainnet chain ID 5042
  - Arc USDC gas token
  - Arc mainnet explorer API
  - Arc mainnet Uniswap v4
  - EVM network arc
  - Bitquery Arc API
---

import FAQ from "@site/src/components/FAQ";

# Circle Blockchain API for Arc Mainnet

Bitquery indexes **Circle blockchain data on Arc mainnet** as `EVM(network: arc)`. Use the same EVM cubes as Ethereum or Base to query and stream swaps, transfers, balances, logs, calls, transactions and blocks.

Arc is Circle's EVM-compatible Layer 1. USDC pays gas, blocks reach finality in under a second, and the network is built for payments, foreign exchange and tokenized assets. [Arc Public Mainnet launched](https://www.arc.io/blog/arc-mainnet-goes-live-on-september-16-2026) on **16 September 2026**. Circle's current RPC reference still labels its listed mainnet endpoints and explorer as permissioned; Bitquery's indexed API is live.

:::info Availability checked 16 September 2026
The `realtime` dataset, USD fields, `Holders`, and `Trading.Trades` returned live Arc data in production tests. `dataset: combined` and `dataset: archive` did not answer yet. Leave the dataset argument out until those modes are enabled.
:::

:::note API Key Required
To query or stream outside the Bitquery IDE, create an [API access token](/docs/authorization/how-to-generate/).
:::

---

## Arc mainnet at a glance {#network-facts}

| Property | Value |
| --- | --- |
| Bitquery network | `arc` in `EVM(network: arc)` |
| Chain ID | `5042` |
| Gas token | USDC, tracked as `Currency.Native: true` |
| USDC ERC-20 interface | `0x3600000000000000000000000000000000000000` (6 decimals) |
| EURC | `0xbEf5f6d51CB62b58e6A8f77868681825C6fe21c1` (6 decimals) |
| USYC | `0x8a5D989Bbb96929F689B0200f435f53dA42bF490` (6 decimals) |
| Uniswap v4 PoolManager seen by Bitquery | `0x8366a39cc670b4001a1121b8f6a443a643e40951` |
| Mainnet explorer | [explorer.arc.io](https://explorer.arc.io) (listed as permissioned in Arc's RPC reference) |
| Arc RPC | `https://rpc.mainnet.arc.io` (listed as permissioned in Arc's RPC reference) |
| Bitquery GraphQL | `https://streaming.bitquery.io/graphql` |

Arc's [network reference](https://docs.arc.io/arc/references/rpc-endpoints) confirms chain ID `5042`, USDC as the currency symbol, the RPC and the explorer. Arc's [contract list](https://docs.arc.io/arc/references/contract-addresses) gives the stablecoin addresses.

---

## Quick start: latest Arc mainnet swaps {#quick-start}

This query returns the newest swaps with USD values and the DEX name.

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-docs-overview-quick-start-latest-arc-mainnet-swaps)

```graphql
{
  EVM(network: arc) {
    DEXTrades(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
    ) {
      Block {
        Number
        Time
      }
      Transaction {
        Hash
        From
      }
      Trade {
        Dex {
          ProtocolName
          SmartContract
        }
        Buy {
          Amount
          AmountInUSD
          Currency {
            Name
            Symbol
            SmartContract
          }
        }
        Sell {
          Amount
          AmountInUSD
          Currency {
            Name
            Symbol
            SmartContract
          }
        }
      }
    }
  }
}
```

Change `query` to `subscription`, remove `limit` and `orderBy`, then send it to `wss://streaming.bitquery.io/graphql` for a live feed.

---

## Pick the right API {#pick-the-right-api}

| What you need | Cube | Guide |
| --- | --- | --- |
| Swaps, prices, OHLCV, tokens and traders | `DEXTrades`, `DEXTradeByTokens` | [DEX Trades API](/docs/blockchain/arc-mainnet/arc-mainnet-trades-api/) |
| New tokens from verified launchpads, then their first trades | `Events`, `DEXTradeByTokens` | [Launchpads API](/docs/blockchain/arc-mainnet/arc-mainnet-launchpads-api/) |
| Tolly launches, token trades, trader rankings and OHLCV | `Events`, `Trading.Trades`, `Trading.Pairs`, `Trading.Tokens` | [Tolly Launchpad API](/docs/blockchain/arc-mainnet/tolly-launchpad-api/) |
| RadarDEX Classic and Reflection launches, trades and prices | `Events`, `Trading.Trades`, `Trading.Pairs`, `Trading.Tokens` | [RadarDEX Launchpad API](/docs/blockchain/arc-mainnet/radardex-launchpad-api/) |
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
| Native USDC | `Currency.Native: true`, `SmartContract: "0x"` in `Transfers` and `Balances`; zero address in DEX cubes | 18 |
| ERC-20 USDC | `SmartContract: "0x3600000000000000000000000000000000000000"` | 6 |
| System ledger mirror | `0xfffffffffffffffffffffffffffffffffffffffe`, no symbol | raw integer |

Filter on `Native: true` for gas-token value transfers. Use the `0x3600...` address for ERC-20 calls and transfers. Exclude the system ledger mirror from token rankings.

---

## DEX data on launch day {#dexes}

Production checks found active Uniswap v4, v3 and v2 markets. Uniswap v4 used PoolManager `0x8366...0951` for most swaps. The chain-level cubes also decoded Seaport sales, so filter `Trade.Dex.ProtocolFamily` when you need swaps only.

Arc is also present in the multi-chain `Trading.Trades` cube as network `Arc`, with token IDs beginning `bid:arc:`. Use `EVM(network: arc)` when you need EVM log, call or transfer context on each trade.

---

## Datasets and history {#datasets}

On 16 September 2026, only the realtime path answered. Its depth changes, so measure the current window before running a long-range query:

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

Every page in this section includes queries that can run as WebSocket subscriptions. Connect to `wss://streaming.bitquery.io/graphql`, change `query` to `subscription`, and drop query-only paging fields such as `limit` and `orderBy`.

See [WebSocket subscriptions](/docs/subscriptions/websockets/) and [WebSocket authorization](/docs/authorization/websocket/).

---

<FAQ
  title="FAQ"
  items={[
    { q: "What is the Bitquery network name for Arc mainnet?", id: "what-is-the-bitquery-network-name-for-arc-mainnet", a: "Use EVM(network: arc). Arc mainnet's chain ID is 5042.",
      answer: <p>{"Use "}<code>{"EVM(network: arc)"}</code>{". Arc mainnet's chain ID is "}<strong>{"5042"}</strong>{"."}</p> },
    { q: "Are USD fields available?", id: "are-usd-fields-available", a: "Yes. AmountInUSD, PriceInUSD, CostInUSD and fee USD fields returned populated values in production checks on 16 September 2026.",
      answer: <p>{"Yes. "}<code>{"AmountInUSD"}</code>{", "}<code>{"PriceInUSD"}</code>{", "}<code>{"CostInUSD"}</code>{" and fee USD fields returned populated values in production checks on 16 September 2026."}</p> },
    { q: "How far back does Arc mainnet data go?", id: "how-far-back-does-arc-mainnet-data-go", a: "The realtime dataset was live at launch. Combined and archive were not ready during the 16 September check. Run the dataset probe before assuming a time range.",
      answer: <p>{"The realtime dataset was live at launch. Combined and archive were not ready during the 16 September check. Run the "}<a href="#datasets">{"dataset probe"}</a>{" before assuming a time range."}</p> },
    { q: "Can I use Trading.Trades for Arc?", id: "can-i-use-trading-trades-for-arc", a: "Yes. Filter Pair.Market.Network by Arc. Arc token IDs use the bid:arc: prefix.",
      answer: <p>{"Yes. Filter "}<code>{"Pair.Market.Network"}</code>{" by "}<code>{"Arc"}</code>{". Arc token IDs use the "}<code>{"bid:arc:"}</code>{" prefix."}</p> },
    { q: "Does Bitquery provide Arc RPC access?", id: "does-bitquery-provide-arc-rpc-access", a: "No. Bitquery is an indexed data API. Use Arc's RPC for state calls and transaction submission; use Bitquery for indexed queries and streams.",
      answer: <p>{"No. Bitquery is an indexed data API. Use Arc's RPC for state calls and transaction submission; use Bitquery for indexed queries and streams."}</p> },
  ]}
/>
