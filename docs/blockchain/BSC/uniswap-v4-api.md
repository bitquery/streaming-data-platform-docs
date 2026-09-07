---
title: "BNB Chain Uniswap v4 API: Stablecoin Pools, Swaps, Traders and Reserves"
sidebar_label: "Uniswap v4 API"
description: "Uniswap v4 on BNB Chain with Bitquery GraphQL: live swaps, the v4 pools of USDT by PoolId, the USDT/USDC pool's daily stats, top traders and reserves."
keywords:
  - BSC Uniswap v4 API
  - Uniswap v4 BNB Chain
  - Uniswap v4 PoolId BSC
  - BNB Chain PoolManager
  - USDT USDC Uniswap v4 pool
---

import FAQ from "@site/src/components/FAQ";

# BNB Chain Uniswap v4 API: Stablecoin Pools, Swaps, Traders and Reserves

On BNB Chain, Uniswap v4 is above all a stablecoin venue: the USDT/USDC pools inside its PoolManager, `0x28e2ea090877bf75740558f6bfb36a5ffee9e9df`, turn over tens of millions of dollars a day, while meme launches route a long tail of smaller pools through the same contract. Because v4 keeps every pool inside the PoolManager, pools are told apart by `PoolId`, a hash of the two tokens, the fee, the tick spacing and the hook, and on swap rows the buyer and seller fields both show the PoolManager, so the trader is `Transaction.From`. PancakeSwap Infinity uses the same singleton design on BNB Chain and has [its own page](/docs/blockchain/BSC/bsc-pancakeswap-infinity-api). Every example runs in the [IDE](https://ide.bitquery.io) on a free account; the worked token is USDT, `0x55d398326f99059ff775485246999027b3197955`, and the worked pool is the busiest USDT/USDC pool, `PoolId 0x628ea54a6450645d2bb7b2911c8c6f3d7f3944c2f4703c259a1b85bf5569870b`.

## Which v4 pools trade USDT

Start here to get a `PoolId`. Grouping `DEXTradeByTokens` by `PoolId` with USDT in `Currency` lists every v4 pool of the token, its counter token, and the trades and USD volume in the window. Saved query [here](https://ide.bitquery.io/get-virtual-pool-address-for-a-token-on-uniswap-v4-bsc).

```graphql
{
  EVM(network: bsc) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: { ProtocolName: { is: "uniswap_v4" } }
          Currency: { SmartContract: { is: "0x55d398326f99059ff775485246999027b3197955" } }
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

## Daily stats of the USDT/USDC pool

Trades, distinct buyers and sellers, and USD volume split by direction, for the pool and the token you name. Saved query [here](https://ide.bitquery.io/trade-stats-for-a-token-pair-on-uniswap-v4-bsc_1).

```graphql
{
  EVM(network: bsc) {
    DEXTradeByTokens(
      where: {
        Trade: {
          PoolId: { is: "0x628ea54a6450645d2bb7b2911c8c6f3d7f3944c2f4703c259a1b85bf5569870b" }
          Currency: { SmartContract: { is: "0x55d398326f99059ff775485246999027b3197955" } }
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

## Latest swaps in the pool

Filter `DEXTrades` on the `PoolId`. Saved query [here](https://ide.bitquery.io/Latest-Trades-for-a-currency-pair-on-bsc).

```graphql
{
  EVM(network: bsc) {
    DEXTrades(
      where: {
        Trade: {
          PoolId: { is: "0x628ea54a6450645d2bb7b2911c8c6f3d7f3944c2f4703c259a1b85bf5569870b" }
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

## Live swaps across every v4 pool on BNB Chain

The protocol filter as a subscription. On BNB Chain this stream is busy, so filter on `PoolId` or on a token when you only need part of it. Saved stream [here](https://ide.bitquery.io/Real-time-trades-for-uniswap-v4-bsc).

```graphql
subscription {
  EVM(network: bsc) {
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

## Top traders of the pool

The PoolManager settles both sides of every v4 swap, so `Trade.Buyer` and `Trade.Seller` on `DEXTrades` are the PoolManager; rank accounts by `Transaction.From` instead. `bought` sums the token the trader received and `sold` the token it paid; `Side.Type` describes the counter-side, which is why the conditions look swapped. Saved query [here](https://ide.bitquery.io/top-buyers-of-a-currency-on-uniswap-v4-bsc); the [top sellers](https://ide.bitquery.io/top-sellers-of-a-token-on-uniswap-v4-pool-bsc) query is the same sorted on `sold`.

```graphql
{
  EVM(network: bsc) {
    DEXTradeByTokens(
      where: {
        Trade: {
          PoolId: { is: "0x628ea54a6450645d2bb7b2911c8c6f3d7f3944c2f4703c259a1b85bf5569870b" }
          Currency: { SmartContract: { is: "0x55d398326f99059ff775485246999027b3197955" } }
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

## Reserves of the pool

`DEXPoolEvents` rows carry the reserves the PoolManager holds for the pool after each change, in token units and USD. For v4 they are rebuilt from the concentrated positions around the current price. Filter on `PoolId`, or keep only the protocol name to stream every v4 pool. Saved queries [by pool](https://ide.bitquery.io/uniswap-v4-pool-liquidity-by-poolid-bsc) and [all pools](https://ide.bitquery.io/uniswap-v4-pool-liquidity-bsc).

```graphql
subscription {
  EVM(network: bsc) {
    DEXPoolEvents(
      where: {
        PoolEvent: {
          Pool: {
            PoolId: { is: "0x628ea54a6450645d2bb7b2911c8c6f3d7f3944c2f4703c259a1b85bf5569870b" }
          }
        }
      }
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
    { q: "What is the Uniswap v4 PoolManager address on BNB Chain?", a: "0x28e2ea090877bf75740558f6bfb36a5ffee9e9df. All v4 pools on BNB Chain live inside it; Trade.PoolId tells them apart." },
    { q: "How do I get the PoolId of a Uniswap v4 pool on BSC?", a: "Group DEXTradeByTokens by Trade.PoolId with one of the tokens in Currency and ProtocolName uniswap_v4. The rows list each pool of that token with its counter token and volume." },
    { q: "Why does every v4 swap show the PoolManager as buyer and seller?", a: "The PoolManager settles both sides. Use Transaction.From for the account that sent the swap, or DEXTradeByTokens, whose Buyer and Seller are trader-aware." },
    { q: "Is PancakeSwap Infinity the same as Uniswap v4?", a: "Same singleton design, separate protocol. Filter ProtocolName pancakeswap_infinity for it; its manager on BNB Chain is a different contract with its own PoolIds." },
    { q: "How far back does Uniswap v4 data go on BNB Chain?", a: "DEXTrades and DEXTradeByTokens reach history on the archive and combined datasets. DEXPoolEvents is realtime-only, so record the reserve stream if you need it later." },
  ]}
/>

## Related pages

- [BNB Chain liquidity API](/docs/blockchain/BSC/bsc-liquidity-api)
- [BNB Chain DEX trades API](/docs/blockchain/BSC/bsc-dextrades)
- [PancakeSwap Infinity API](/docs/blockchain/BSC/bsc-pancakeswap-infinity-api)
- [Uniswap v4 on Ethereum](/docs/blockchain/Ethereum/dextrades/uniswap-v4-api)
- [Uniswap v4 on Arbitrum](/docs/blockchain/Arbitrum/uniswap-v4-api)
