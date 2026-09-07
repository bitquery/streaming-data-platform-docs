---
sidebar_position: 15
title: "Base Liquidity API: Uniswap and PancakeSwap Pool Reserves in Real Time"
sidebar_label: "Base Liquidity API"
description: "Base pool reserves and spot prices with Bitquery GraphQL: one pool now or streamed, every Uniswap v4 pool by PoolId, pools holding cbBTC. Aerodrome excluded."
keywords:
  - Base liquidity API
  - Base pool reserves
  - Uniswap v4 Base liquidity
  - Base DEX liquidity stream
  - DEXPoolEvents Base
---

import FAQ from "@site/src/components/FAQ";

# Base Liquidity API: Uniswap and PancakeSwap Pool Reserves in Real Time

The `DEXPoolEvents` cube under `EVM(network: base)` emits one row every time a pool's reserves change, whether by a swap, a deposit or a withdrawal. Each row carries the reserves of both tokens after the change, in token units and in USD, the spot price in both directions, the pool and its protocol, and the transaction that moved it. On Base the rows come from Uniswap v2, v3 and v4 pools and from PancakeSwap v3 and Infinity pools. Aerodrome, the largest DEX on Base by volume, is not in this cube: its swaps are in the [Base DEX trades API](/docs/blockchain/Base/base-dextrades) and its pool balances in the [balance tracker](/docs/blockchain/Base/transaction-balance-tracker/base-transaction-balance-tracker). The cube holds the recent realtime window only and has no archive dataset: to keep a history, record the stream. Every example runs in the [IDE](https://ide.bitquery.io) on a free account. The worked pool is the Uniswap v3 WETH/USDC pool, `0xb4cb800910b228ed3d0834cf79d697127bbb00e5`.

## Reserves of one pool now

The newest rows for a pool. `AmountCurrencyA` and `AmountCurrencyB` are the reserves after each change, the `InUSD` twins price them, and `AtoBPrice` is how much of B one unit of A buys at the spot. Saved query [here](https://ide.bitquery.io/Latest-Liquidity-Changes-of-a-Specific-Pool_4).

```graphql
{
  EVM(network: base) {
    DEXPoolEvents(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: {
        PoolEvent: {
          Pool: { SmartContract: { is: "0xb4cb800910b228ed3d0834cf79d697127bbb00e5" } }
        }
      }
    ) {
      Block {
        Time
        Number
      }
      PoolEvent {
        AtoBPrice
        BtoAPrice
        Liquidity {
          AmountCurrencyA
          AmountCurrencyAInUSD
          AmountCurrencyB
          AmountCurrencyBInUSD
        }
        Pool {
          SmartContract
          CurrencyA {
            Symbol
            SmartContract
          }
          CurrencyB {
            Symbol
            SmartContract
          }
        }
        Dex {
          ProtocolName
        }
      }
      Transaction {
        Hash
      }
    }
  }
}
```

## Stream one pool

The same filter as a subscription delivers a row on every reserve change, several per minute for this pool. Saved stream [here](https://ide.bitquery.io/Realtime-Liquidity-Stream-of-a-Specific-Pool_3).

```graphql
subscription {
  EVM(network: base) {
    DEXPoolEvents(
      where: {
        PoolEvent: {
          Pool: { SmartContract: { is: "0xb4cb800910b228ed3d0834cf79d697127bbb00e5" } }
        }
      }
    ) {
      Block {
        Time
        Number
      }
      PoolEvent {
        AtoBPrice
        BtoAPrice
        Liquidity {
          AmountCurrencyA
          AmountCurrencyAInUSD
          AmountCurrencyB
          AmountCurrencyBInUSD
        }
        Pool {
          SmartContract
          CurrencyA {
            Symbol
          }
          CurrencyB {
            Symbol
          }
        }
      }
      Transaction {
        Hash
      }
    }
  }
}
```

## Every Uniswap v4 pool on Base

Uniswap v4 is the busiest source of pool events on Base. All v4 pools live in the PoolManager, `0x498581ff718922c3f8e6a244956af099b2652b2b`, so `Pool.SmartContract` repeats on every row and `Pool.PoolId` is the field that tells pools apart; for v2 and v3 pools `PoolId` is empty. Saved stream [here](https://ide.bitquery.io/Latest-Liquidity-Changes-of-Pools-in-a-Specific-DEX-Protocol---Uniswap-V4_5).

```graphql
subscription {
  EVM(network: base) {
    DEXPoolEvents(
      where: { PoolEvent: { Dex: { ProtocolName: { is: "uniswap_v4" } } } }
    ) {
      Block {
        Time
      }
      PoolEvent {
        Pool {
          PoolId
          SmartContract
          CurrencyA {
            Symbol
            SmartContract
          }
          CurrencyB {
            Symbol
            SmartContract
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
      Transaction {
        Hash
      }
    }
  }
}
```

Other protocol names that report on Base: `uniswap_v3`, `uniswap_v2`, `pancake_swap_v3` and `pancakeswap_infinity`.

## Pools that hold a token, with their current reserves

`limitBy` on the pool address keeps the newest row per pool, so the result is the current state of every pool that had the token as `CurrencyA` and changed inside the window. Run it a second time with the token under `CurrencyB` to catch pools that list it second. The example is cbBTC, `0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf`; sort the rows by the USD reserve in your code to rank the pools. Saved query [here](https://ide.bitquery.io/top-liquidity-pools-of-cbBTC).

```graphql
{
  EVM(network: base) {
    DEXPoolEvents(
      limit: { count: 20 }
      limitBy: { by: PoolEvent_Pool_SmartContract, count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        PoolEvent: {
          Pool: {
            CurrencyA: { SmartContract: { is: "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf" } }
          }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      Block {
        Time
      }
      PoolEvent {
        Dex {
          ProtocolName
        }
        Pool {
          SmartContract
          PoolId
          CurrencyB {
            Symbol
            SmartContract
          }
        }
        Liquidity {
          AmountCurrencyA
          AmountCurrencyAInUSD
          AmountCurrencyB
          AmountCurrencyBInUSD
        }
      }
    }
  }
}
```

## Fields on every row

| Field | Meaning |
|---|---|
| `PoolEvent.Liquidity.AmountCurrencyA`, `AmountCurrencyB` | Reserves of each token after the change, in token units |
| `AmountCurrencyAInUSD`, `AmountCurrencyBInUSD` | The same reserves priced in USD |
| `PoolEvent.AtoBPrice`, `BtoAPrice` | Spot price in each direction after the change |
| `PoolEvent.Pool.SmartContract`, `PoolId` | Pool contract; for Uniswap v4 and PancakeSwap Infinity the manager plus the pool id |
| `PoolEvent.Dex.ProtocolName` | `uniswap_v4`, `uniswap_v3`, `uniswap_v2`, `pancake_swap_v3` or `pancakeswap_infinity` |
| `Transaction.Hash` | The transaction that changed the reserves |

## The same data over Kafka

The `base.dexpools.proto` topic carries the same rows as protobuf messages with lower latency and no WebSocket to keep alive. Kafka needs its own credentials, separate from the IDE token; see the [Kafka streams hub](/docs/category/kafka-streams). Slippage tables for the same pools are on the [Base slippage API](/docs/blockchain/Base/base-slippage-api) page.

<FAQ
  items={[
    { q: "How do I get the reserves of a pool on Base?", a: "Query DEXPoolEvents under EVM(network: base) with the pool contract in PoolEvent.Pool.SmartContract, ordered by Block_Time descending. The newest row holds both reserves in token units and USD plus the spot price." },
    { q: "Does the Base liquidity API cover Aerodrome?", a: "No. Aerodrome pools are not in DEXPoolEvents. Aerodrome swaps are in the DEX trades cube, and a pool's token balances can be read from the transaction balance tracker." },
    { q: "How do I tell Uniswap v4 pools apart on Base?", a: "All v4 pools share the PoolManager address 0x498581ff718922c3f8e6a244956af099b2652b2b, so filter and group on PoolEvent.Pool.PoolId instead of SmartContract." },
    { q: "How far back does liquidity data go on Base?", a: "DEXPoolEvents keeps the recent realtime window only and has no archive dataset. Record the subscription or the Kafka topic to build a history." },
    { q: "How do I rank the pools of a token by liquidity?", a: "Take the newest row per pool with limitBy on the pool address, once with the token as CurrencyA and once as CurrencyB, and sort by the USD reserve fields in your code." },
  ]}
/>

## Related pages

- [Base slippage API](/docs/blockchain/Base/base-slippage-api)
- [Base DEX trades API](/docs/blockchain/Base/base-dextrades)
- [Uniswap v4 on Base](/docs/blockchain/Base/uniswap-v4-api)
- [DEXPools cube](/docs/cubes/evm-dexpool/)
- [Arbitrum liquidity API](/docs/blockchain/Arbitrum/arbitrum-liquidity-api)
