---
title: "Uniswap V3 Position API: Mints, Burns, Liquidity Changes and Fee Collections"
sidebar_label: "Uniswap v3 LP Positions"
description: "Uniswap V3 positions on Ethereum via Bitquery GraphQL: mints with token IDs, burns, liquidity increases and decreases, fee collections, and V4 ModifyLiquidity."
keywords:
  - Uniswap V3 position API
  - NonfungiblePositionManager
  - Uniswap LP position token ID
  - Uniswap V3 collect fees API
  - Uniswap V4 ModifyLiquidity
---

import FAQ from "@site/src/components/FAQ";

# Uniswap V3 Position API: Mints, Burns, Liquidity Changes and Fee Collections

Every Uniswap V3 liquidity position on Ethereum is an NFT issued by the NonfungiblePositionManager, `0xc36442b4a4522e871399cd717abdd847ab11fe88`. The contract's calls and events are the whole lifecycle: `mint` creates a position and returns its token ID, `increaseLiquidity` and `decreaseLiquidity` resize it, `Collect` pays out fees, `burn` destroys it. Bitquery decodes all of them in the `Calls` and `Events` cubes, arguments and return values included, and the contract sees hundreds of position changes and around a thousand fee collections on a busy day. Every example below runs in the [IDE](https://ide.bitquery.io) on a free account against the realtime dataset, which is where decoded call arguments and returns live; the archive dataset does not serve the `Calls` cube. Uniswap V4 keeps positions inside its PoolManager instead, and the last section covers it.

## New positions with their token IDs

`mint` calls from the last day, newest first. The `params` struct arrives as one argument per member in contract order: token0, token1, fee, tickLower, tickUpper, amount0Desired, amount1Desired, amount0Min, amount1Min, recipient, deadline. `Returns` carries the new `tokenId`, the `liquidity` minted and the two amounts pulled in. Saved query [here](https://ide.bitquery.io/recent-uniswap-position-NFTs-mint_1).

```graphql
{
  EVM(network: eth) {
    Calls(
      where: {
        Call: {
          Signature: { Name: { is: "mint" } }
          To: { is: "0xc36442b4a4522e871399cd717abdd847ab11fe88" }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Transaction {
        From
        Hash
      }
      Arguments {
        Name
        Path {
          Name
        }
        Value {
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
        }
      }
      Returns {
        Name
        Value {
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
        }
      }
    }
  }
}
```

The same filter as a subscription delivers each new position as it is minted; expect one every few minutes rather than a firehose.

```graphql
subscription {
  EVM(network: eth) {
    Calls(
      where: {
        Call: {
          Signature: { Name: { is: "mint" } }
          To: { is: "0xc36442b4a4522e871399cd717abdd847ab11fe88" }
        }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        From
        Hash
      }
      Returns {
        Name
        Value {
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
        }
      }
    }
  }
}
```

## Closed positions

`burn` destroys the NFT once its liquidity is zero and fees are collected. The only argument is the token ID. Saved query [here](https://ide.bitquery.io/Uniswap-v3-weth-usdt-burn-calls-only).

```graphql
{
  EVM(network: eth) {
    Calls(
      where: {
        Call: {
          Signature: { Name: { is: "burn" } }
          To: { is: "0xc36442b4a4522e871399cd717abdd847ab11fe88" }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Transaction {
        From
        Hash
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
        }
      }
    }
  }
}
```

## Liquidity added to or removed from a position

`increaseLiquidity` and `decreaseLiquidity` keep the token ID and change the size. The `params` members arrive in order: tokenId, then the desired and minimum amounts for `increaseLiquidity` or the liquidity to remove and the minimum amounts for `decreaseLiquidity`, then the deadline. `Returns` gives the liquidity delta and the token amounts moved. Saved query [here](https://ide.bitquery.io/uniswap-v3-liquidity-increase-decrease).

```graphql
{
  EVM(network: eth) {
    Calls(
      where: {
        Call: {
          Signature: { Name: { in: ["increaseLiquidity", "decreaseLiquidity"] } }
          To: { is: "0xc36442b4a4522e871399cd717abdd847ab11fe88" }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Call {
        Signature {
          Name
        }
      }
      Transaction {
        From
        Hash
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
        }
      }
      Returns {
        Name
        Value {
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
        }
      }
    }
  }
}
```

## Position details by token ID

`positions(tokenId)` is a view function, but contracts call it on-chain all day, and each recorded call returns the full position: `token0`, `token1`, `fee`, `tickLower`, `tickUpper`, `liquidity`, the fee growth counters and the tokens owed. Add the commented `Arguments` filter to pin one token ID. Saved query [here](https://ide.bitquery.io/uniswap-v3-weth-usdt-positions-of-tokenid-with-returns).

```graphql
{
  EVM(network: eth) {
    Calls(
      where: {
        Call: {
          Signature: { Name: { is: "positions" } }
          To: { is: "0xc36442b4a4522e871399cd717abdd847ab11fe88" }
        }
        # Arguments: { includes: { Value: { BigInteger: { eq: "1360638" } } } }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Call {
        From
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
        }
      }
      Returns {
        Name
        Value {
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
        }
      }
    }
  }
}
```

## Fee collections

The `Collect` event on the position manager names the `tokenId`, the `recipient` and the raw `amount0` and `amount1` paid out. Filtering on the log's contract catches collections routed through other contracts as well as direct calls. Saved query [here](https://ide.bitquery.io/Fee-collection-on-Uniswap-v3-Positions).

```graphql
{
  EVM(network: eth) {
    Events(
      where: {
        Log: {
          SmartContract: { is: "0xc36442b4a4522e871399cd717abdd847ab11fe88" }
          Signature: { Name: { is: "Collect" } }
        }
      }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
        From
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
        }
      }
    }
  }
}
```

## Uniswap V4 positions

V4 has no position NFT contract of its own: the PoolManager, `0x000000000004444c5dc75cb358380d2e3de08a90`, emits `ModifyLiquidity` with the pool `id`, the `sender`, `tickLower`, `tickUpper`, the signed `liquidityDelta` and the position `salt`. A positive delta adds liquidity and a negative one removes it. Saved query [here](https://ide.bitquery.io/Latest-ModifyLiquidity-Events-on-Uniswap-v4).

```graphql
{
  EVM(network: eth) {
    Events(
      where: {
        Log: {
          SmartContract: { is: "0x000000000004444c5dc75cb358380d2e3de08a90" }
          Signature: { Name: { is: "ModifyLiquidity" } }
        }
      }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Transaction {
        From
        Hash
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
        }
      }
    }
  }
}
```

## Turning ticks into a price band

A position earns fees only while the pool price sits between its ticks. The price at a tick is `1.0001 ^ tick` in token1 per token0 raw units, so a position with `tickLower` of -100 and `tickUpper` of 100 covers roughly 0.990 to 1.010. Multiply by `10 ^ (decimals0 - decimals1)` to get a human price, and invert it if you want token0 per token1. The tick values come from the `mint` arguments, the `positions` returns or the V4 `ModifyLiquidity` event above.

<FAQ
  items={[
    { q: "How do I get the token ID of a new Uniswap V3 position?", a: "Query mint calls to the NonfungiblePositionManager and read Returns: tokenId is the first return value, followed by liquidity, amount0 and amount1. The subscription form delivers each new position as it is minted." },
    { q: "Why does the archive dataset fail for these queries?", a: "Decoded call arguments and returns are served from the realtime dataset only; the archive dataset does not serve the Calls cube. Use relative time windows on the default dataset as the examples do." },
    { q: "How do I track fees collected by one position?", a: "Filter the Collect events on the position manager and add Arguments includes Value BigInteger eq with the token ID, the same filter shape shown for positions calls." },
    { q: "Which contract holds Uniswap V4 positions?", a: "The PoolManager, 0x000000000004444c5dc75cb358380d2e3de08a90. Its ModifyLiquidity event carries the pool id, sender, tick range, liquidityDelta and salt; there is no separate position NFT contract in V4." },
    { q: "Can I see the liquidity of a whole pool rather than one position?", a: "Yes. The Ethereum liquidity API page covers pool reserves and changes through DEXPoolEvents, with USD values on every row." },
  ]}
/>

## Related pages

- [Uniswap API on Ethereum](/docs/blockchain/Ethereum/dextrades/uniswap-api/)
- [Uniswap v4 API on Ethereum](/docs/blockchain/Ethereum/dextrades/uniswap-v4-api)
- [Ethereum liquidity API](/docs/blockchain/Ethereum/dextrades/ethereum-liquidity-api)
- [Ethereum slippage API](/docs/blockchain/Ethereum/dextrades/ethereum-slippage-api)
