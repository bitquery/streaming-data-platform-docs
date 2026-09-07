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

## Current reserves of a pool

The last ten changes to the pool, newest first. Each row is the state after that change: `AmountCurrencyA` and `AmountCurrencyB` are the reserves, `AmountCurrencyAInUSD` and `AmountCurrencyBInUSD` their dollar value, and `AtoBPrice` the spot rate of A in B. Saved query [here](https://ide.bitquery.io/Latest-Liquidity-Changes-of-a-Specific-Pool_4).

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

## The same pool, live

As a subscription the filter yields a row per reserve change, a few per minute on this pool. Saved stream [here](https://ide.bitquery.io/Realtime-Liquidity-Stream-of-a-Specific-Pool_3).

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

## Every pool of a token

Which pools hold cbBTC, `0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf`, and how much? Ask for pools with cbBTC as `CurrencyA` in the window and keep only the newest row of each with `limitBy` on the pool address; a second run with cbBTC as `CurrencyB` covers the pools that list it second. Because Aerodrome is outside this cube, the answer covers Uniswap and PancakeSwap pools only. Rank by the USD reserve in your code. Saved query [here](https://ide.bitquery.io/top-liquidity-pools-of-cbBTC).

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

## Row anatomy

A row is one reserve change. `Liquidity` holds the two reserves after it, in token units and in USD; `AtoBPrice` and `BtoAPrice` hold the spot rate both ways; `Pool` names the contract, or for Uniswap v4 and PancakeSwap Infinity the manager plus a `PoolId`; `Dex.ProtocolName` is one of `uniswap_v4`, `uniswap_v3`, `uniswap_v2`, `pancake_swap_v3` and `pancakeswap_infinity`; and `Transaction.Hash` points at the swap, deposit or withdrawal behind it.

## Kafka and slippage

The `base.dexpools.proto` topic streams these rows as protobuf with lower latency than WebSocket and needs its own credentials; start at the [Kafka streams hub](/docs/category/kafka-streams). The [Base slippage API](/docs/blockchain/Base/base-slippage-api) turns the same pool states into how much each pool can absorb at a given tolerance.

<FAQ
  items={[
    { q: "How do I get the reserves of a pool on Base?", a: "Filter DEXPoolEvents on network base by the pool contract in PoolEvent.Pool.SmartContract and take the newest row. Its Liquidity fields are the reserves in token units and USD, and AtoBPrice is the spot rate." },
    { q: "Does the Base liquidity API cover Aerodrome?", a: "No. Aerodrome pools are not in DEXPoolEvents. Aerodrome swaps are in the DEX trades cube, and a pool's token balances can be read from the transaction balance tracker." },
    { q: "How do I tell Uniswap v4 pools apart on Base?", a: "All v4 pools share the PoolManager address 0x498581ff718922c3f8e6a244956af099b2652b2b, so filter and group on PoolEvent.Pool.PoolId instead of SmartContract." },
    { q: "Can I get past reserves of a Base pool?", a: "Only what is inside the realtime window; DEXPoolEvents has no archive dataset. Keep the stream or the Kafka topic if you need a history." },
    { q: "How do I rank the pools of a token by liquidity?", a: "Take the newest row per pool with limitBy on the pool address, once with the token as CurrencyA and once as CurrencyB, and sort by the USD reserve fields in your code." },
  ]}
/>

## Related pages

- [Base slippage API](/docs/blockchain/Base/base-slippage-api)
- [Base DEX trades API](/docs/blockchain/Base/base-dextrades)
- [Uniswap v4 on Base](/docs/blockchain/Base/uniswap-v4-api)
- [DEXPools cube](/docs/cubes/evm-dexpool/)
- [Arbitrum liquidity API](/docs/blockchain/Arbitrum/arbitrum-liquidity-api)
