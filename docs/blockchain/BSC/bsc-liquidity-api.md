---
sidebar_position: 11
title: "BNB Chain Liquidity API: PancakeSwap Pool Reserves in Real Time"
sidebar_label: "BNB Chain Liquidity API"
description: "BNB Chain pool reserves and spot prices with Bitquery GraphQL: PancakeSwap v2, v3 and Infinity pools, one pool now or streamed, every pool holding CAKE."
keywords:
  - BSC liquidity API
  - BNB Chain pool reserves
  - PancakeSwap liquidity API
  - PancakeSwap Infinity pools
  - DEXPoolEvents BSC
---

import FAQ from "@site/src/components/FAQ";

# BNB Chain Liquidity API: PancakeSwap Pool Reserves in Real Time

The `DEXPoolEvents` cube under `EVM(network: bsc)` emits one row every time a pool's reserves change, whether by a swap, a deposit or a withdrawal. Each row carries the reserves of both tokens after the change, in token units and in USD, the spot price in both directions, the pool and its protocol, and the transaction that moved it. BNB Chain is PancakeSwap territory, and the cube reports its three pool types under their own names: v2 pairs as `uniswap_v2`, the name shared by every Uniswap v2 fork, v3 pools as `pancake_swap_v3`, and Infinity pools as `pancakeswap_infinity`, alongside `uniswap_v3` and `uniswap_v4` pools. The cube holds the recent realtime window only and has no archive dataset: to keep a history, record the stream. Every example runs in the [IDE](https://ide.bitquery.io) on a free account. The worked pool is the PancakeSwap v3 USDT/WBNB pool, `0x172fcd41e0913e95784454622d1c3724f546f849`, the busiest pool on the chain.

## What the pool holds right now

Ten rows, newest first, each a snapshot taken after one change. Read `AmountCurrencyA` and `AmountCurrencyB` for the two reserves, their `InUSD` twins for the dollar value, and `AtoBPrice` for the spot rate of A in B at that moment. Saved query [here](https://ide.bitquery.io/Latest-Liquidity-Changes-of-a-Specific-Pool_2).

```graphql
{
  EVM(network: bsc) {
    DEXPoolEvents(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: {
        PoolEvent: {
          Pool: { SmartContract: { is: "0x172fcd41e0913e95784454622d1c3724f546f849" } }
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

## Follow the pool as it moves

Subscribe with the same pool filter and a row arrives on every reserve change; on this pool that is many rows a second, so batch them on your side. Saved stream [here](https://ide.bitquery.io/Realtime-Liquidity-Stream-of-a-Specific-Pool_1).

```graphql
subscription {
  EVM(network: bsc) {
    DEXPoolEvents(
      where: {
        PoolEvent: {
          Pool: { SmartContract: { is: "0x172fcd41e0913e95784454622d1c3724f546f849" } }
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

## Every PancakeSwap Infinity pool

Infinity pools live inside one manager contract, like Uniswap v4, so `Pool.SmartContract` repeats on every row and `Pool.PoolId` identifies the pool. Filter on the protocol name to follow all of them; swap in `uniswap_v4` for the Uniswap v4 pools on BNB Chain. Saved stream [here](https://ide.bitquery.io/Latest-Liquidity-Changes-of-Pools-in-a-Specific-DEX-Protocol---Uniswap-V4).

```graphql
subscription {
  EVM(network: bsc) {
    DEXPoolEvents(
      where: { PoolEvent: { Dex: { ProtocolName: { is: "pancakeswap_infinity" } } } }
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

## Where a token sits

To see every pool that holds CAKE, `0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82`, keep the newest row per pool with `limitBy` and ask for pools that list CAKE as `CurrencyA` inside the window; a second run with CAKE under `CurrencyB` catches the pools that list it second. The PancakeSwap v2 CAKE/WBNB pair comes out on top by a wide margin. Rank the rows by the USD reserve in your code. Saved query [here](https://ide.bitquery.io/Realtime-Liquidity-Stream_2).

```graphql
{
  EVM(network: bsc) {
    DEXPoolEvents(
      limit: { count: 20 }
      limitBy: { by: PoolEvent_Pool_SmartContract, count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        PoolEvent: {
          Pool: {
            CurrencyA: { SmartContract: { is: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82" } }
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

## How to read a row

- Reserves after the change: `Liquidity.AmountCurrencyA` and `AmountCurrencyB` in token units, `AmountCurrencyAInUSD` and `AmountCurrencyBInUSD` in dollars.
- Spot rate after the change: `AtoBPrice` and `BtoAPrice`.
- Which pool: `Pool.SmartContract` for v2 and v3 pools; for Infinity and Uniswap v4 the manager address plus `Pool.PoolId`.
- Which protocol: `Dex.ProtocolName`, one of `uniswap_v2` (every v2 fork, PancakeSwap v2 included), `pancake_swap_v3`, `pancakeswap_infinity`, `uniswap_v3` or `uniswap_v4`.
- Which transaction: `Transaction.Hash`.

## Kafka instead of WebSocket

The `bsc.dexpools.proto` topic delivers these rows as protobuf messages, which is the better fit for BNB Chain's volume: no socket to keep alive and consumers can be scaled out. Kafka credentials are separate from the IDE token; the [Kafka streams hub](/docs/category/kafka-streams) explains how to get them.

<FAQ
  items={[
    { q: "How do I get the reserves of a PancakeSwap pool?", a: "Put the pool contract in PoolEvent.Pool.SmartContract on DEXPoolEvents for network bsc and take the newest row by Block_Time. It carries both reserves in token units and USD and the spot rate after the last change." },
    { q: "Why do PancakeSwap v2 pairs show ProtocolName uniswap_v2?", a: "The cube names v2-style pairs after the protocol they fork, so every Uniswap v2 fork on BNB Chain, PancakeSwap v2 included, reports as uniswap_v2. PancakeSwap v3 and Infinity pools carry their own names." },
    { q: "How do I tell PancakeSwap Infinity pools apart?", a: "Infinity pools share one manager contract in Pool.SmartContract, so filter and group on Pool.PoolId. The same applies to Uniswap v4 pools on BNB Chain." },
    { q: "Is there historical liquidity data for BNB Chain pools?", a: "Not in this cube: DEXPoolEvents keeps the recent realtime window only. Write the stream or the Kafka topic to your own store if you need reserves over time." },
    { q: "Can I get pool reserves from the balance cube instead?", a: "Yes, for any pool contract: TransactionBalances rows on the pool address give its token balances. DEXPoolEvents adds spot prices, USD values and protocol names in one row." },
  ]}
/>

## Related pages

- [BNB Chain DEX trades API](/docs/blockchain/BSC/bsc-dextrades)
- [PancakeSwap Infinity API](/docs/blockchain/BSC/bsc-pancakeswap-infinity-api)
- [DEXPools cube](/docs/cubes/evm-dexpool/)
- [Arbitrum liquidity API](/docs/blockchain/Arbitrum/arbitrum-liquidity-api)
- [Base liquidity API](/docs/blockchain/Base/base-liquidity-api)
