---
sidebar_label: DEX Trades API
title: "Ethereum DEX Trades API: Every DEX, Pair Stats, Traders and Latest Swaps"
description: "Ethereum DEX data with Bitquery GraphQL: which protocols trade and how much, one family's daily stats, busiest pairs, top traders, latest swaps, no outliers."
keywords:
  - Ethereum DEX trades API
  - Ethereum DEX list
  - Uniswap stats API
  - top traders Ethereum DEX
  - DEXTradeByTokens Ethereum
---

import FAQ from "@site/src/components/FAQ";

# Ethereum DEX Trades API: Every DEX, Pair Stats, Traders and Latest Swaps

Two cubes hold Ethereum's DEX swaps. `DEXTrades` has one row per swap with both sides, the pool and the protocol, and reaches history on the archive dataset. `DEXTradeByTokens` has one row per swap per token, which is the shape for anything grouped by token, pair, protocol or trader. The [Trading cube](/docs/trading/crypto-trades-api/trades-api) adds a third option for the last month or so: swaps with the trader, USD price, market cap and supply on every row across nine chains, and it is the better start for live feeds. This page uses the two chain cubes to answer the questions people ask about Ethereum DEXs as a whole: which ones trade, how much, who trades on them, what just happened. Every example runs in the [IDE](https://ide.bitquery.io) on a free account. One caution runs through the page: a few swaps in thin pools carry absurd USD values, so every sum here caps the USD of a single trade with `Side: { AmountInUSD: { lt: "10000000" } }`; drop the cap if you want raw totals.

## Which DEXs trade on Ethereum, and how much

Group by protocol over the last day. `ProtocolFamily` is the brand and `ProtocolName` the version; Uniswap v3 and v4 lead by trades, with v2 pairs, Curve, Balancer, 1inch and the rest behind them. Saved query [here](https://ide.bitquery.io/dex-markets).

```graphql
{
  EVM(network: eth) {
    DEXTradeByTokens(
      where: {
        Trade: { Side: { AmountInUSD: { lt: "10000000" } } }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      orderBy: { descendingByField: "trades" }
      limit: { count: 30 }
    ) {
      Trade {
        Dex {
          ProtocolFamily
          ProtocolName
        }
      }
      trades: count
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
      traders: uniq(of: Transaction_From)
    }
  }
}
```

The same list, kept live, is on [DEXrabbit](https://dexrabbit.bitquery.io/eth/dex_market).

## One DEX family's day

Trades, USD volume, distinct traders, tokens and pools for a protocol family. Saved query [here](https://ide.bitquery.io/dex-info).

```graphql
{
  EVM(network: eth) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: { ProtocolFamily: { is: "Uniswap" } }
          Side: { AmountInUSD: { lt: "10000000" } }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      trades: count
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
      traders: uniq(of: Transaction_From)
      tokens: uniq(of: Trade_Currency_SmartContract)
      pools: uniq(of: Trade_Dex_SmartContract)
    }
  }
}
```

## The busiest pairs on a DEX

Pairs against WETH, USDC or USDT on Uniswap over the last three hours, ranked by USD volume, with distinct buyers and sellers. Each row is a token and the quote it traded against. Saved query [here](https://ide.bitquery.io/trading-pairs-on-a-specific-dex).

```graphql
{
  EVM(network: eth) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: { ProtocolFamily: { is: "Uniswap" } }
          Side: {
            AmountInUSD: { lt: "10000000" }
            Currency: {
              SmartContract: {
                in: [
                  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
                  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
                  "0xdac17f958d2ee523a2206206994597c13d831ec7"
                ]
              }
            }
          }
        }
        Block: { Time: { since_relative: { hours_ago: 3 } } }
      }
      orderBy: { descendingByField: "volumeUsd" }
      limit: { count: 50 }
    ) {
      Trade {
        Currency {
          Symbol
          SmartContract
        }
        Side {
          Currency {
            Symbol
          }
        }
        Dex {
          ProtocolName
        }
      }
      trades: count
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
      buyers: uniq(of: Trade_Buyer)
      sellers: uniq(of: Trade_Seller)
    }
  }
}
```

## Top traders on a DEX

Rank by `Transaction.From`, the account that sent the swap, which works for every protocol version including Uniswap v4, where the pool manager appears as buyer and seller on raw rows. Saved query [here](https://ide.bitquery.io/top-traders-on-a-DEX_1).

```graphql
{
  EVM(network: eth) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: { ProtocolFamily: { is: "Uniswap" } }
          Side: { AmountInUSD: { lt: "10000000" } }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      orderBy: { descendingByField: "volumeUsd" }
      limit: { count: 50 }
    ) {
      Transaction {
        From
      }
      trades: count
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
      tokens: uniq(of: Trade_Currency_SmartContract)
    }
  }
}
```

[DEXrabbit](https://dexrabbit.bitquery.io/eth/dex_market/Uniswap#traders) shows this table for each DEX.

## Latest swaps on a DEX

Raw rows from `DEXTrades`, newest first; change `query` to `subscription` and drop `limit` and `orderBy` for a live feed. Saved query [here](https://ide.bitquery.io/latest-trades_5).

```graphql
{
  EVM(network: eth) {
    DEXTrades(
      where: { Trade: { Dex: { ProtocolFamily: { is: "Uniswap" } } } }
      orderBy: { descending: Block_Time }
      limit: { count: 50 }
    ) {
      Block {
        Time
      }
      Trade {
        Dex {
          ProtocolName
          SmartContract
        }
        Buy {
          Currency {
            Symbol
          }
          Amount
          AmountInUSD
        }
        Sell {
          Currency {
            Symbol
          }
          Amount
          AmountInUSD
        }
      }
      Transaction {
        Hash
        From
      }
    }
  }
}
```

## Where to go next

- One venue in depth: [Uniswap](/docs/blockchain/Ethereum/dextrades/uniswap-api), [Uniswap v4](/docs/blockchain/Ethereum/dextrades/uniswap-v4-api), [PancakeSwap](/docs/blockchain/Ethereum/dextrades/pancakeswap-api).
- Every pool a token trades in: [trading pairs API](/docs/blockchain/Ethereum/dextrades/get-trading-pairs-of-token).
- Live swaps with trader and market cap on each row: [Crypto Trades API](/docs/trading/crypto-trades-api/trades-api).
- When to use which cube: [DEXTrades vs DEXTradeByTokens vs Trades](/docs/cubes/dextrades-dextradebytokens-trading-trades).

<FAQ
  items={[
    { q: "How do I list every DEX on Ethereum with its volume?", a: "Group DEXTradeByTokens by Trade.Dex.ProtocolFamily and ProtocolName over a window with count and a USD sum. Cap the USD of a single trade so thin-pool outliers do not swamp the totals." },
    { q: "Which DEXs are indexed on Ethereum?", a: "Uniswap v2, v3 and v4, Curve, Balancer, 1inch, SushiSwap, PancakeSwap and many smaller ones. The first query on this page lists whatever traded in the window, so it is always current." },
    { q: "Why do some USD sums look impossible?", a: "A swap in a pool with almost no liquidity can be priced at a nonsense USD value. Filtering Trade.Side.AmountInUSD below a cap removes those rows; the queries here use ten million dollars per trade." },
    { q: "How do I get Uniswap trades with the trader's address?", a: "Use Transaction.From on the chain cubes, which is the account that sent the swap, or the Trader field of the Trading cube's Trades." },
    { q: "How do I build OHLC from Ethereum DEX trades?", a: "Use DEXTradeByTokens with Block.Time intervals and price aggregates, or the Crypto Price API, which serves USD candles directly for the last month." },
  ]}
/>
