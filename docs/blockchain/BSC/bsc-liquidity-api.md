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

## Reserves of one pool now

The newest rows for a pool. `AmountCurrencyA` and `AmountCurrencyB` are the reserves after each change, the `InUSD` twins price them, and `AtoBPrice` is how much of B one unit of A buys at the spot. Saved query [here](https://ide.bitquery.io/Latest-Liquidity-Changes-of-a-Specific-Pool_2).

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

## Stream one pool

The same filter as a subscription delivers a row on every reserve change; this pool changes many times a second. Saved stream [here](https://ide.bitquery.io/Realtime-Liquidity-Stream-of-a-Specific-Pool_1).

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

## Pools that hold a token, with their current reserves

`limitBy` on the pool address keeps the newest row per pool, so the result is the current state of every pool that had the token as `CurrencyA` and changed inside the window. Run it a second time with the token under `CurrencyB` to catch pools that list it second. The example is CAKE, `0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82`; the PancakeSwap v2 CAKE/WBNB pair leads. Sort the rows by the USD reserve in your code to rank them. Saved query [here](https://ide.bitquery.io/Realtime-Liquidity-Stream_2).

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

## Fields on every row

| Field | Meaning |
|---|---|
| `PoolEvent.Liquidity.AmountCurrencyA`, `AmountCurrencyB` | Reserves of each token after the change, in token units |
| `AmountCurrencyAInUSD`, `AmountCurrencyBInUSD` | The same reserves priced in USD |
| `PoolEvent.AtoBPrice`, `BtoAPrice` | Spot price in each direction after the change |
| `PoolEvent.Pool.SmartContract`, `PoolId` | Pool contract; for Infinity and Uniswap v4 the manager plus the pool id |
| `PoolEvent.Dex.ProtocolName` | `uniswap_v2` (v2 pairs of any fork, PancakeSwap v2 included), `pancake_swap_v3`, `pancakeswap_infinity`, `uniswap_v3`, `uniswap_v4` |
| `Transaction.Hash` | The transaction that changed the reserves |

## The same data over Kafka

The `bsc.dexpools.proto` topic carries the same rows as protobuf messages with lower latency and no WebSocket to keep alive. Kafka needs its own credentials, separate from the IDE token; see the [Kafka streams hub](/docs/category/kafka-streams).

<FAQ
  items={[
    { q: "How do I get the reserves of a PancakeSwap pool?", a: "Query DEXPoolEvents under EVM(network: bsc) with the pool contract in PoolEvent.Pool.SmartContract, ordered by Block_Time descending. The newest row holds both reserves in token units and USD plus the spot price." },
    { q: "Why do PancakeSwap v2 pairs show ProtocolName uniswap_v2?", a: "The cube names v2-style pairs after the protocol they fork, so every Uniswap v2 fork on BNB Chain, PancakeSwap v2 included, reports as uniswap_v2. PancakeSwap v3 and Infinity pools carry their own names." },
    { q: "How do I tell PancakeSwap Infinity pools apart?", a: "Infinity pools share one manager contract in Pool.SmartContract, so filter and group on Pool.PoolId. The same applies to Uniswap v4 pools on BNB Chain." },
    { q: "How far back does liquidity data go on BNB Chain?", a: "DEXPoolEvents keeps the recent realtime window only and has no archive dataset. Record the subscription or the Kafka topic to build a history." },
    { q: "Can I get pool reserves from the balance cube instead?", a: "Yes, for any pool contract: TransactionBalances rows on the pool address give its token balances. DEXPoolEvents adds spot prices, USD values and protocol names in one row." },
  ]}
/>

## Related pages

- [BNB Chain DEX trades API](/docs/blockchain/BSC/bsc-dextrades)
- [PancakeSwap Infinity API](/docs/blockchain/BSC/bsc-pancakeswap-infinity-api)
- [DEXPools cube](/docs/cubes/evm-dexpool/)
- [Arbitrum liquidity API](/docs/blockchain/Arbitrum/arbitrum-liquidity-api)
- [Base liquidity API](/docs/blockchain/Base/base-liquidity-api)
