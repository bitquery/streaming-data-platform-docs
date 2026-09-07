---
sidebar_position: 3
title: "Arbitrum Slippage API: How Much a Pool Can Absorb at Each Slippage Level"
sidebar_label: "Arbitrum Slippage API"
description: "Slippage tables for Arbitrum pools with Bitquery GraphQL: the largest trade a pool takes at each level, the minimum output, and the deepest pool for a token."
keywords:
  - Arbitrum slippage API
  - Arbitrum price impact
  - Arbitrum pool depth
  - DEXPoolSlippages Arbitrum
  - Uniswap v3 Arbitrum slippage
---

import FAQ from "@site/src/components/FAQ";

# Arbitrum Slippage API: How Much a Pool Can Absorb at Each Slippage Level

The `DEXPoolSlippages` cube under `EVM(network: arbitrum)` publishes a slippage table for a pool every time its reserves change. For seven slippage levels, 0, 10, 50, 100, 200, 500 and 1000 basis points, it gives the largest input the pool can take before the price moves past that level, the minimum output that trade would return, and the average execution price, in both directions. That answers the pre-trade question directly: can this pool take my size at my tolerance, and what do I get back. The tables cover the same pools as the [Arbitrum liquidity API](/docs/blockchain/Arbitrum/arbitrum-liquidity-api): Uniswap v2, v3 and v4 and PancakeSwap v3. The cube holds the recent realtime window only; record the stream for history. Every example runs in the [IDE](https://ide.bitquery.io) on a free account. The worked pool is the Uniswap v3 WETH/ARB pool, `0xc6f780497a95e246eb9449f5e4770916dcd6396a`.

## The slippage table of one pool

Seven rows per update, one per level. At 50 basis points the `AtoB.MaxAmountIn` row reads as: selling this much WETH moves the price by no more than 0.5%, and `MinAmountOut` is the ARB you get for it. The 0 basis point row carries the spot price with zero size. Saved query [here](https://ide.bitquery.io/Latest-slippage-of-a-pool-on-Uniswap-v3).

```graphql
{
  EVM(network: arbitrum) {
    DEXPoolSlippages(
      where: {
        Price: {
          Pool: { SmartContract: { is: "0xc6f780497a95e246eb9449f5e4770916dcd6396a" } }
        }
      }
      limit: { count: 7 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
        Number
      }
      Price {
        SlippageBasisPoints
        AtoB {
          Price
          MaxAmountIn
          MinAmountOut
        }
        BtoA {
          Price
          MaxAmountIn
          MinAmountOut
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
    }
  }
}
```

## One level, as a stream

Fix `SlippageBasisPoints` to the tolerance you trade with and subscribe: each message is the pool's new capacity at that level. Saved stream [here](https://ide.bitquery.io/realtime-slippage-on-arbitrum).

```graphql
subscription {
  EVM(network: arbitrum) {
    DEXPoolSlippages(
      where: {
        Price: {
          Pool: { SmartContract: { is: "0xc6f780497a95e246eb9449f5e4770916dcd6396a" } }
          SlippageBasisPoints: { eq: 50 }
        }
      }
    ) {
      Block {
        Time
      }
      Price {
        SlippageBasisPoints
        AtoB {
          Price
          MaxAmountIn
          MinAmountOut
        }
        BtoA {
          Price
          MaxAmountIn
          MinAmountOut
        }
      }
    }
  }
}
```

## The deepest pool for a token at a given tolerance

Which pool takes the largest WETH sell within 0.5%? Keep the newest row per pool with `limitBy`, fix the level, and compare `AtoB.MaxAmountIn` across pools that list WETH first. On Arbitrum the Uniswap v3 WETH/USDC pool usually leads by a wide margin. Repeat with WETH under `CurrencyB` and read `BtoA` for pools that list it second.

```graphql
{
  EVM(network: arbitrum) {
    DEXPoolSlippages(
      where: {
        Price: {
          SlippageBasisPoints: { eq: 50 }
          Pool: {
            CurrencyA: { SmartContract: { is: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1" } }
          }
        }
        Block: { Time: { since_relative: { hours_ago: 1 } } }
      }
      limitBy: { by: Price_Pool_SmartContract, count: 1 }
      orderBy: { descending: Block_Time }
      limit: { count: 20 }
    ) {
      Price {
        Pool {
          SmartContract
          CurrencyB {
            Symbol
            SmartContract
          }
        }
        Dex {
          ProtocolName
        }
        AtoB {
          MaxAmountIn
          MinAmountOut
          Price
        }
      }
    }
  }
}
```

## Reading the fields

| Field | Meaning |
|---|---|
| `Price.SlippageBasisPoints` | The level of the row: 0, 10, 50, 100, 200, 500 or 1000 (100 = 1%) |
| `Price.AtoB.MaxAmountIn` | Largest amount of CurrencyA the pool takes within that level |
| `Price.AtoB.MinAmountOut` | CurrencyB returned for that input |
| `Price.AtoB.Price` | Average execution price of that trade |
| `Price.BtoA` | The same three numbers for selling CurrencyB |
| `Price.Pool`, `Price.Dex` | Pool contract, the two tokens, protocol name |

The `arbitrum.dexpools.proto` Kafka topic carries the same tables as protobuf messages; Kafka needs its own credentials, see the [Kafka streams hub](/docs/category/kafka-streams).

<FAQ
  items={[
    { q: "How do I check price impact before a trade on Arbitrum?", a: "Query DEXPoolSlippages for the pool and read the row for your tolerance. If your size is below MaxAmountIn at that level, the trade stays within it, and MinAmountOut is the least you receive." },
    { q: "Which slippage levels are available?", a: "Seven fixed levels per update: 0, 10, 50, 100, 200, 500 and 1000 basis points. Filter on Price.SlippageBasisPoints to keep one." },
    { q: "How do I find the deepest pool for a token on Arbitrum?", a: "Fix the slippage level, filter the token as CurrencyA, keep the latest row per pool with limitBy, and compare AtoB.MaxAmountIn. Run it again with the token as CurrencyB and compare BtoA." },
    { q: "Which pools have slippage tables on Arbitrum?", a: "The same set as the liquidity cube: Uniswap v2, v3 and v4 pools and PancakeSwap v3 pools. Other Arbitrum protocols are not in this cube." },
    { q: "Is there history for slippage data?", a: "No. The cube holds the recent realtime window and has no archive. Subscribe, or consume the Kafka topic, and store the rows you need." },
  ]}
/>

## Related pages

- [Arbitrum liquidity API](/docs/blockchain/Arbitrum/arbitrum-liquidity-api)
- [Arbitrum DEX trades API](/docs/blockchain/Arbitrum/DexTrades)
- [DEXPools cube](/docs/cubes/evm-dexpool/)
- [Base slippage API](/docs/blockchain/Base/base-slippage-api)
