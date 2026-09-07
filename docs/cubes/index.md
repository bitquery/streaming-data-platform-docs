---
title: "Understanding Bitquery Cubes: Which Cube Answers Which Question"
description: "One GraphQL root per data type: trades, transfers, balances, calls, events, blocks. The EVM, Solana and Trading cube families, datasets, and which cube to pick."
slug: /category/understanding-cubes
sidebar_label: "Understanding Cubes"
keywords:
  - Bitquery cubes
  - DEXTrades cube
  - DEXTradeByTokens cube
  - Transfers cube
  - Balances cube
  - Bitquery GraphQL schema
---

import FAQ from "@site/src/components/FAQ";

# Understanding Bitquery Cubes: Which Cube Answers Which Question

A cube is one GraphQL root per kind of on-chain fact. `DEXTrades` holds swaps, `Transfers` holds token movements, `Balances` holds what an address owns now, `Calls` and `Events` hold decoded contract activity, `Blocks` and `Transactions` hold the chain itself. Every cube takes the same `where`, `orderBy` and `limit` arguments, supports aggregates such as `count`, `sum` and `uniq`, and runs as a query or, with the keyword changed, as a WebSocket subscription. Cubes come in three families: chain-level EVM cubes under `EVM(network: ...)`, chain-level Solana cubes under `Solana`, and the cross-chain `Trading` cubes that carry USD prices for nine chains in one schema. The `dataset` argument decides how far back a chain-level cube reaches.

## The three families

| Family | Root | Cubes | What it is for |
|---|---|---|---|
| EVM | `EVM(network: eth)` and the other EVM chains | DEXTrades, DEXTradeByTokens, DEXPools, Transfers, Balances, Holders, BalanceUpdates, Transactions, Calls, Events, Blocks, MinerRewards | Anything on Ethereum, BNB Chain, Base, Arbitrum, Optimism, Polygon or Robinhood Chain, from a single swap to decoded contract logs |
| Solana | `Solana` | DEXTrades, DEXTradeByTokens, DEXOrders, DEXPools, Transfers, BalanceUpdates, Instructions, Transactions, Blocks, Rewards, TokenSupplyUpdates | Solana at instruction level, including launchpads and program calls |
| Trading | `Trading` | Trades, Tokens, Pairs, Currencies | Prices, OHLC, market cap and supply across nine chains with one schema and USD on every row |

## Which cube answers which question

| Question | Cube |
|---|---|
| Every swap on a DEX, with both sides and the trader | `DEXTrades` |
| Volume, OHLC, buyers and sellers for one token over time | `DEXTradeByTokens` |
| Pool creation and liquidity changes | `DEXPools` |
| Who sent what to whom | `Transfers` |
| What an address holds right now, or who holds a token | `Balances` and `Holders` |
| Every balance change, with the reason | `BalanceUpdates` |
| Method calls, internal transactions, reverts | `Calls` |
| Decoded contract logs, an `eth_getLogs` replacement | `Events` |
| Receipts, gas, status | `Transactions` |
| A token's price on any chain, market cap, candles | `Trading.Tokens`, `Trading.Pairs`, `Trading.Currencies` |

The comparison page [DEXTrades vs DEXTradeByTokens vs Trades](/docs/cubes/dextrades-dextradebytokens-trading-trades) settles the most common choice: swap rows, per-token aggregates, or cross-chain USD prices.

## Datasets decide depth

Chain-level cubes accept `dataset: realtime`, `archive` or `combined`. Realtime is the freshest and shortest window (hours to days depending on the cube), archive is the history, combined stitches both. Leaving the argument out means realtime, which is the usual reason a query "works" but returns nothing for last month. The Trading cubes take no dataset argument and hold roughly the last 30 days. Per-cube windows are on [data coverage and retention](/docs/graphql/data-coverage-retention).

## A first cube query

The latest three DEX trades on Ethereum. Run it in the [Bitquery IDE](https://ide.bitquery.io) on a free account, then change the network, the cube or the filter.

```graphql
{
  EVM(network: eth) {
    DEXTrades(limit: { count: 3 }, orderBy: { descending: Block_Time }) {
      Block {
        Time
      }
      Trade {
        Dex {
          ProtocolName
        }
        Buy {
          Currency {
            Symbol
          }
          Amount
        }
        Sell {
          Currency {
            Symbol
          }
          Amount
        }
      }
    }
  }
}
```

## Pages in this section

| Page | Read it for |
|---|---|
| [EVM builder terms](/docs/cubes/EVM) | Every argument and field name across the EVM cubes, in one place |
| [Solana builder terms](/docs/cubes/solana) | The same for Solana |
| [DEX Trades cube](/docs/cubes/dextrades) | Swap-level rows with filters and aggregates |
| [DEXTradeByTokens cube](/docs/cubes/dextradesbyTokens) | Per-token aggregates, OHLC and stats |
| [DEXTrades vs DEXTradeByTokens vs Trades](/docs/cubes/dextrades-dextradebytokens-trading-trades) | Picking between the three trade cubes |
| [DEXPools cube on EVM](/docs/cubes/evm-dexpool) | Pools, reserves and liquidity events |
| [Transaction cube](/docs/cubes/transaction-cube) | Transactions and receipts |
| [Balances and Holders cubes](/docs/cubes/balances-cube) | Current balances and holder rankings |
| [Balance Updates cube](/docs/cubes/balance-updates-cube) | Per-change balance history |
| [Transfers cube](/docs/cubes/transfers-cube) | Token and native transfers |
| [EVM token holders schema](/docs/schema/evm/token-holders) | Field reference for holders |

<FAQ
  items={[
    { q: "What is a cube in the Bitquery API?", a: "One GraphQL root per kind of on-chain fact, such as DEXTrades for swaps, Transfers for token movements or Balances for current holdings. Every cube takes the same where, orderBy and limit arguments and supports aggregates like count and sum." },
    { q: "Which cube should I use for token prices?", a: "The Trading cubes: Tokens for a token across its pairs, Pairs for one pair, Currencies for an asset aggregated across chains. They carry USD prices, OHLC, market cap and supply for nine chains. For raw swaps on one chain use DEXTrades, and for per-token aggregates over history use DEXTradeByTokens." },
    { q: "Why does my query return nothing for older dates?", a: "Chain-level cubes default to the realtime dataset, which holds only a short recent window. Add dataset: archive or dataset: combined to reach history. The Trading cubes hold about the last 30 days and take no dataset argument." },
    { q: "What is the difference between DEXTrades and DEXTradeByTokens?", a: "DEXTrades returns one row per swap with both sides. DEXTradeByTokens returns one row per token side of a trade, which makes per-token filters and aggregates such as volume, OHLC and buyer counts simple. The comparison page covers the choice in detail." },
    { q: "Can every cube be streamed?", a: "Yes. Change query to subscription and keep the selection set; the same rows arrive over WebSocket as they are produced. Aggregates and some Trading cube features do not survive the conversion, as the subscriptions section explains." },
  ]}
/>

## Related pages

- [Building GraphQL queries](/docs/category/building-queries)
- [GraphQL query capabilities](/docs/category/capabilities)
- [Data coverage and retention](/docs/graphql/data-coverage-retention)
- [Crypto Price API (Trading cubes)](/docs/trading/crypto-price-api/)
