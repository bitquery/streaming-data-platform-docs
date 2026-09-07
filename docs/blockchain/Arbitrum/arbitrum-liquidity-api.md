---
sidebar_position: 4
title: "Arbitrum Liquidity API: Pool Reserves and Liquidity Changes in Real Time"
sidebar_label: "Arbitrum Liquidity API"
description: "Read Arbitrum pool reserves and spot prices with Bitquery GraphQL: one pool now or as a stream, every Uniswap v4 pool, and the pools that hold a token, in USD."
keywords:
  - Arbitrum liquidity API
  - Arbitrum pool reserves
  - Arbitrum DEX liquidity stream
  - Uniswap v3 Arbitrum liquidity
  - DEXPoolEvents Arbitrum
---

import FAQ from "@site/src/components/FAQ";

# Arbitrum Liquidity API: Pool Reserves and Liquidity Changes in Real Time

The `DEXPoolEvents` cube under `EVM(network: arbitrum)` emits one row every time a pool's reserves change, whether by a swap, a deposit or a withdrawal. Each row carries the reserves of both tokens after the change, in token units and in USD, the spot price in both directions, the pool and its protocol, and the transaction that moved it. On Arbitrum today the rows come from Uniswap v2, v3 and v4 pools and PancakeSwap v3 pools; pools of other protocols on Arbitrum, such as Camelot, are not in this cube, so check the [DEX trades API](/docs/blockchain/Arbitrum/DexTrades) for those. The cube holds the recent realtime window only and has no archive dataset: to keep a history, record the stream. Every example runs in the [IDE](https://ide.bitquery.io) on a free account. The worked pool is the Uniswap v3 WETH/ARB pool, `0xc6f780497a95e246eb9449f5e4770916dcd6396a`, one of the busiest on the chain.

## Reserves of one pool now

The newest rows for a pool. `AmountCurrencyA` and `AmountCurrencyB` are the reserves after each change, the `InUSD` twins price them, and `AtoBPrice` is how much of B one unit of A buys at the spot. Saved query [here](https://ide.bitquery.io/latest-liquidity-changes-of-a-specific-pool).

```graphql
{
  EVM(network: arbitrum) {
    DEXPoolEvents(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: {
        PoolEvent: {
          Pool: { SmartContract: { is: "0xc6f780497a95e246eb9449f5e4770916dcd6396a" } }
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

The same filter as a subscription delivers a row on every reserve change, which for this pool means several per minute. Saved stream [here](https://ide.bitquery.io/realtime-liquidity-stream-of-a-specific-pool).

```graphql
subscription {
  EVM(network: arbitrum) {
    DEXPoolEvents(
      where: {
        PoolEvent: {
          Pool: { SmartContract: { is: "0xc6f780497a95e246eb9449f5e4770916dcd6396a" } }
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

## Every Uniswap v4 pool on Arbitrum

Filter on the protocol to follow a whole family of pools. Uniswap v4 keeps all pools inside one PoolManager contract, `0x360e68faccca8ca495c1b759fd9eee466db9fb32` on Arbitrum, so `Pool.SmartContract` is the same on every row and `Pool.PoolId` is the field that tells pools apart. For v2 and v3 pools `PoolId` is empty and `SmartContract` is the pool. Saved stream [here](https://ide.bitquery.io/latest-liquidity-changes-in-uniswap-v4-pools).

```graphql
subscription {
  EVM(network: arbitrum) {
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

Other protocol names that report on Arbitrum: `uniswap_v3`, `uniswap_v2` and `pancake_swap_v3`.

## Pools that hold a token, with their current reserves

`limitBy` on the pool address keeps the newest row per pool, so the result is the current state of every pool that had the token as `CurrencyA` and changed inside the window. Run it a second time with the token under `CurrencyB` to catch pools that list it second. The example is ARB, `0x912ce59144191c1204e64559fe8253a0e49e6548`; sort the rows by the USD reserve in your code to rank the pools. Saved query [here](https://ide.bitquery.io/realtime-liquidity-stream_1).

```graphql
{
  EVM(network: arbitrum) {
    DEXPoolEvents(
      limit: { count: 20 }
      limitBy: { by: PoolEvent_Pool_SmartContract, count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        PoolEvent: {
          Pool: {
            CurrencyA: { SmartContract: { is: "0x912ce59144191c1204e64559fe8253a0e49e6548" } }
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
| `PoolEvent.Pool.SmartContract`, `PoolId` | Pool contract; for Uniswap v4 the PoolManager plus the pool id |
| `PoolEvent.Dex.ProtocolName` | `uniswap_v2`, `uniswap_v3`, `uniswap_v4` or `pancake_swap_v3` |
| `Transaction.Hash` | The transaction that changed the reserves |

## The same data over Kafka

The `arbitrum.dexpools.proto` topic carries the same rows as protobuf messages with lower latency and no WebSocket to keep alive. Kafka needs its own credentials, separate from the IDE token; see the [Kafka streams hub](/docs/category/kafka-streams). The slippage tables for the same pools are on the [Arbitrum slippage API](/docs/blockchain/Arbitrum/arbitrum-slippage-api) page.

<FAQ
  items={[
    { q: "How do I get the reserves of a pool on Arbitrum?", a: "Query DEXPoolEvents under EVM(network: arbitrum) with the pool contract in PoolEvent.Pool.SmartContract, ordered by Block_Time descending. The newest row holds both reserves in token units and USD plus the spot price." },
    { q: "Which DEXs does the Arbitrum liquidity cube cover?", a: "Rows come from Uniswap v2, v3 and v4 pools and PancakeSwap v3 pools. Pools of other Arbitrum protocols are not in this cube; use the DEX trades cube to see their swaps." },
    { q: "How do I tell Uniswap v4 pools apart?", a: "All v4 pools share the PoolManager address 0x360e68faccca8ca495c1b759fd9eee466db9fb32, so filter and group on PoolEvent.Pool.PoolId instead of SmartContract." },
    { q: "How far back does liquidity data go on Arbitrum?", a: "DEXPoolEvents keeps the recent realtime window only and has no archive dataset. Record the subscription or the Kafka topic to build a history." },
    { q: "Does a liquidity row tell me whether it was a swap or a deposit?", a: "Not directly. Compare consecutive rows for the pool: a swap moves the two reserves in opposite directions, a deposit or withdrawal moves both the same way. The transaction hash links to the call for detail." },
  ]}
/>

## Related pages

- [Arbitrum slippage API](/docs/blockchain/Arbitrum/arbitrum-slippage-api)
- [Arbitrum DEX trades API](/docs/blockchain/Arbitrum/DexTrades)
- [DEXPools cube](/docs/cubes/evm-dexpool/)
- [BNB Chain liquidity API](/docs/blockchain/BSC/bsc-liquidity-api)
- [Base liquidity API](/docs/blockchain/Base/base-liquidity-api)
