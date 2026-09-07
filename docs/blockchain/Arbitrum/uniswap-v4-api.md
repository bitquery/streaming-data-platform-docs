---
title: "Arbitrum Uniswap v4 API: Swaps, Pools by PoolId, Traders and Liquidity"
sidebar_label: "Uniswap v4 API"
description: "Uniswap v4 on Arbitrum with Bitquery GraphQL: live swaps, pools of a token by PoolId, daily pool stats, top traders and reserves, worked on ETH/USDC."
keywords:
  - Arbitrum Uniswap v4 API
  - Uniswap v4 Arbitrum trades
  - Uniswap v4 PoolId Arbitrum
  - Arbitrum PoolManager
  - Uniswap v4 liquidity Arbitrum
---

import FAQ from "@site/src/components/FAQ";

# Arbitrum Uniswap v4 API: Swaps, Pools by PoolId, Traders and Liquidity

Uniswap v4 on Arbitrum runs through one contract, the PoolManager at `0x360e68faccca8ca495c1b759fd9eee466db9fb32`. Every pool is a record inside it, identified by a `PoolId` hash of the two tokens, the fee, the tick spacing and the hook, not by an address of its own. That changes how you query: the protocol name `uniswap_v4` selects the whole venue, `Trade.PoolId` selects a pool, and on swap rows the buyer and seller fields both show the PoolManager, so the trader is `Transaction.From`. Activity on Arbitrum sits in a few majors: ETH/USDC, USDC against the USDT0 bridged stablecoin, WBTC/USDC, and a rotating set of launch tokens. Every example runs in the [IDE](https://ide.bitquery.io) on a free account; the worked pool is ETH/USDC, `PoolId 0x864abca0a6202dba5b8868772308da953ff125b0f95015adbf89aaf579e903a8`, and the worked token is USDC, `0xaf88d065e77c8cc2239327c5edb3a432268e5831`.

## Live swaps across all v4 pools

Filter `DEXTrades` on the protocol name and subscribe. Each message is one swap with both sides priced in USD; `Trade.PoolId` says which pool. Saved stream [here](https://ide.bitquery.io/Real-time-trades-for-uniswap-v4-arbitrum).

```graphql
subscription {
  EVM(network: arbitrum) {
    DEXTrades(where: { Trade: { Dex: { ProtocolName: { is: "uniswap_v4" } } } }) {
      Block {
        Time
      }
      Trade {
        PoolId
        Buy {
          Currency {
            Symbol
            SmartContract
          }
          Amount
          AmountInUSD
          PriceInUSD
        }
        Sell {
          Currency {
            Symbol
            SmartContract
          }
          Amount
          AmountInUSD
        }
      }
      Transaction {
        From
        Hash
      }
    }
  }
}
```

## Every v4 pool that trades a token

Group `DEXTradeByTokens` by `PoolId` with the token in `Currency` to list its pools, ranked by trades in the window, with the other token of each pool and its USD volume. This is how you find the `PoolId` to use in the queries below. Saved query [here](https://ide.bitquery.io/get-virtual-pool-address-for-a-token-on-uniswap-v4-arbitrum).

```graphql
{
  EVM(network: arbitrum) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: { ProtocolName: { is: "uniswap_v4" } }
          Currency: { SmartContract: { is: "0xaf88d065e77c8cc2239327c5edb3a432268e5831" } }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      orderBy: { descendingByField: "count" }
      limit: { count: 20 }
    ) {
      Trade {
        PoolId
        Side {
          Currency {
            Symbol
            SmartContract
          }
        }
      }
      count
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
    }
  }
}
```

## Latest swaps in one pool

Filter on the `PoolId`. Saved query [here](https://ide.bitquery.io/Latest-Trades-for-a-currency-pair-on-arbitrum).

```graphql
{
  EVM(network: arbitrum) {
    DEXTrades(
      where: {
        Trade: {
          PoolId: { is: "0x864abca0a6202dba5b8868772308da953ff125b0f95015adbf89aaf579e903a8" }
        }
      }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Trade {
        Buy {
          Currency {
            Symbol
          }
          Amount
          AmountInUSD
          PriceInUSD
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
        From
        Hash
      }
    }
  }
}
```

## Pool stats for the last 24 hours

One row with trades, distinct buyers and sellers, and volume split by direction, for the token you name in `Currency`. Saved query [here](https://ide.bitquery.io/trade-stats-for-a-token-pair-on-uniswap-v4-arbitrum).

```graphql
{
  EVM(network: arbitrum) {
    DEXTradeByTokens(
      where: {
        Trade: {
          PoolId: { is: "0x864abca0a6202dba5b8868772308da953ff125b0f95015adbf89aaf579e903a8" }
          Currency: { SmartContract: { is: "0xaf88d065e77c8cc2239327c5edb3a432268e5831" } }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      Trade {
        Currency {
          Symbol
        }
        Side {
          Currency {
            Symbol
          }
        }
      }
      trades: count
      buyers: uniq(of: Trade_Buyer)
      sellers: uniq(of: Trade_Seller)
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
      buyVolumeUsd: sum(of: Trade_Side_AmountInUSD, if: { Trade: { Side: { Type: { is: buy } } } })
      sellVolumeUsd: sum(of: Trade_Side_AmountInUSD, if: { Trade: { Side: { Type: { is: sell } } } })
    }
  }
}
```

## Top traders of a pool

Because the PoolManager settles every v4 swap, `Trade.Buyer` and `Trade.Seller` on `DEXTrades` are the PoolManager itself. Group by `Transaction.From` instead to rank the accounts that sent the swaps. `bought` sums the token the trader received and `sold` the token it gave up; `Side.Type` describes the counter-side of the trade, which is why the two conditions look reversed. Saved query [here](https://ide.bitquery.io/top-buyers-of-a-currency-on-uniswap-v4-arbitrum).

```graphql
{
  EVM(network: arbitrum) {
    DEXTradeByTokens(
      where: {
        Trade: {
          PoolId: { is: "0x864abca0a6202dba5b8868772308da953ff125b0f95015adbf89aaf579e903a8" }
          Currency: { SmartContract: { is: "0xaf88d065e77c8cc2239327c5edb3a432268e5831" } }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      orderBy: { descendingByField: "volumeUsd" }
      limit: { count: 20 }
    ) {
      Transaction {
        From
      }
      trades: count
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
      bought: sum(of: Trade_Amount, if: { Trade: { Side: { Type: { is: sell } } } })
      sold: sum(of: Trade_Amount, if: { Trade: { Side: { Type: { is: buy } } } })
    }
  }
}
```

Put one of those addresses into `Transaction: { From: { is: "0x..." } }` on the latest-swaps query to see its trades. The [top sellers](https://ide.bitquery.io/top-sellers-of-a-token-on-uniswap-v4-arbitrum) saved query is the same shape sorted on `sold`.

## Reserves of a v4 pool

`DEXPoolEvents` emits a row on every reserve change. For v4 the reserves are rebuilt from the concentrated positions around the current price, so they are what the PoolManager holds for that pool, priced in USD. Filter by `PoolId`; drop the filter and keep the protocol name to stream every v4 pool on Arbitrum. Saved stream for [all pools](https://ide.bitquery.io/uniswap-v4-pool-liquidity-arbitrum).

```graphql
{
  EVM(network: arbitrum) {
    DEXPoolEvents(
      where: {
        PoolEvent: {
          Pool: {
            PoolId: { is: "0x864abca0a6202dba5b8868772308da953ff125b0f95015adbf89aaf579e903a8" }
          }
        }
      }
      limit: { count: 5 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      PoolEvent {
        Pool {
          PoolId
          CurrencyA {
            Symbol
          }
          CurrencyB {
            Symbol
          }
        }
        Liquidity {
          AmountCurrencyA
          AmountCurrencyAInUSD
          AmountCurrencyB
          AmountCurrencyBInUSD
        }
        AtoBPrice
      }
    }
  }
}
```

<FAQ
  items={[
    { q: "What is the Uniswap v4 PoolManager address on Arbitrum?", a: "0x360e68faccca8ca495c1b759fd9eee466db9fb32. Every v4 pool on Arbitrum lives inside it, so Dex.SmartContract is the same on every row and Trade.PoolId identifies the pool." },
    { q: "How do I find the PoolId of a pair on Arbitrum?", a: "Group DEXTradeByTokens by Trade.PoolId with one token in Currency and the protocol name uniswap_v4. Each row is a pool of that token with its counter token, trade count and volume." },
    { q: "Why are the buyer and seller the same address on v4 swaps?", a: "The PoolManager settles both sides, so DEXTrades shows it as buyer and seller. Use Transaction.From for the trader, or DEXTradeByTokens, whose Buyer and Seller fields are trader-aware." },
    { q: "Can I get Uniswap v4 liquidity on Arbitrum?", a: "Yes. DEXPoolEvents rows carry the pool's reserves in token units and USD after each change; filter on PoolEvent.Pool.PoolId or on the protocol name for all pools." },
    { q: "How far back does v4 trade data go on Arbitrum?", a: "DEXTrades and DEXTradeByTokens reach history on the archive and combined datasets; DEXPoolEvents is realtime-only. Add dataset: combined to the EVM root for longer windows." },
  ]}
/>

## Related pages

- [Arbitrum liquidity API](/docs/blockchain/Arbitrum/arbitrum-liquidity-api)
- [Arbitrum DEX trades API](/docs/blockchain/Arbitrum/DexTrades)
- [Uniswap v4 on Ethereum](/docs/blockchain/Ethereum/dextrades/uniswap-v4-api)
- [Uniswap v4 on Base](/docs/blockchain/Base/uniswap-v4-api)
- [Uniswap v4 on BNB Chain](/docs/blockchain/BSC/uniswap-v4-api)
