---
sidebar_position: 2
sidebar_label: Pairs for a Token
title: "Ethereum Trading Pairs API: Every Pool a Token Trades In"
description: "Every trading pair of an Ethereum token with Bitquery GraphQL: pools across DEXs, pools on one protocol, pair stats, reserves, the tokens behind a pool."
keywords:
  - Ethereum trading pairs API
  - token pairs Ethereum
  - pools of a token
  - pair liquidity Ethereum
  - DEXTradeByTokens pairs
---

import FAQ from "@site/src/components/FAQ";

# Ethereum Trading Pairs API: Every Pool a Token Trades In

A token trades in many places at once: a Uniswap v3 pool against WETH, a v2 pair, a v4 pool, maybe a Curve or Balancer pool. To follow all of its trading you first need that list, and the `DEXTradeByTokens` cube produces it in one query, because every swap is stored once per token with the other token and the pool alongside. From there a pair's stats, a pool's reserves and the two tokens behind a pool address are each one more query. Every example runs in the [IDE](https://ide.bitquery.io) on a free account. The worked token is BLUR, `0x5283d291dbcf85356a21ba090e6db59121208b44`, whose pools are spread across Uniswap v2, v3 and v4.

## Every pair of a token across all DEXs

Group by the other token and the pool over a month on the `combined` dataset. Each row is one pool with its protocol, trade count and USD volume in the window. Saved query [here](https://ide.bitquery.io/Pair-tokens-for-BLUR-token-for-all-DEXs_1).

```graphql
{
  EVM(dataset: combined, network: eth) {
    DEXTradeByTokens(
      where: {
        Trade: { Currency: { SmartContract: { is: "0x5283d291dbcf85356a21ba090e6db59121208b44" } } }
        Block: { Time: { since_relative: { days_ago: 30 } } }
      }
      orderBy: { descendingByField: "trades" }
      limit: { count: 50 }
    ) {
      Trade {
        Side {
          Currency {
            Symbol
            SmartContract
          }
        }
        Dex {
          ProtocolName
          SmartContract
        }
      }
      trades: count
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
    }
  }
}
```

`Dex.SmartContract` is the pool for v2 and v3 pairs and the PoolManager for Uniswap v4, where pools are told apart by `Trade.PoolId` instead.

## The pairs on one protocol

Add the protocol name to the filter. The saved query used the Uniswap v3 factory as an owner filter; the protocol name does the same with less to remember. Saved query [here](https://ide.bitquery.io/pairs-of-blur-token-new-dataset_1).

```graphql
{
  EVM(dataset: combined, network: eth) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: { SmartContract: { is: "0x5283d291dbcf85356a21ba090e6db59121208b44" } }
          Dex: { ProtocolName: { is: "uniswap_v3" } }
        }
        Block: { Time: { since_relative: { days_ago: 30 } } }
      }
      orderBy: { descendingByField: "trades" }
      limit: { count: 20 }
    ) {
      Trade {
        Side {
          Currency {
            Symbol
            SmartContract
          }
        }
        Dex {
          SmartContract
        }
      }
      trades: count
    }
  }
}
```

## Stats of one pair

Fix both tokens and a window: trades, distinct buyers and sellers, USD volume, and how much of the token was bought and sold. `Side.Type` describes the counter-side of each trade, so the token was bought where the side was sold, which is why the two conditions look reversed.

```graphql
{
  EVM(network: eth, dataset: combined) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: { SmartContract: { is: "0x5283d291dbcf85356a21ba090e6db59121208b44" } }
          Side: { Currency: { SmartContract: { is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" } } }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      trades: count
      buyers: uniq(of: Trade_Buyer)
      sellers: uniq(of: Trade_Seller)
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
      bought: sum(of: Trade_Amount, if: { Trade: { Side: { Type: { is: sell } } } })
      sold: sum(of: Trade_Amount, if: { Trade: { Side: { Type: { is: buy } } } })
    }
  }
}
```

## Reserves of a pool

A pool's reserves are its token balances. The `Balances` cube returns them for the pool address; the example is the Uniswap v3 USDC/USDT pool, `0x7858E59e0C01EA06Df3aF3D20aC7B0003275D4Bf`. Saved query [here](https://ide.bitquery.io/liquidity-of-token-pair-on-ethereum).

```graphql
{
  EVM(dataset: combined, network: eth) {
    Balances(
      where: {
        Balance: { Address: { is: "0x7858E59e0C01EA06Df3aF3D20aC7B0003275D4Bf" } }
        Currency: {
          SmartContract: {
            in: [
              "0xdAC17F958D2ee523a2206206994597C13D831ec7"
              "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ]
          }
        }
      }
      orderBy: { descending: Balance_Amount }
    ) {
      Currency {
        Symbol
        SmartContract
      }
      Balance {
        Amount
      }
    }
  }
}
```

For reserves that update on every swap with USD values and spot prices, use the [DEXPools cube](/docs/cubes/evm-dexpool/).

## The two tokens behind a pool address

One trade from the pool names both sides. Saved query [here](https://ide.bitquery.io/tokens-in-a-given-pair-token).

```graphql
{
  EVM(dataset: combined, network: eth) {
    DEXTrades(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        Trade: { Dex: { SmartContract: { is: "0x7858E59e0C01EA06Df3aF3D20aC7B0003275D4Bf" } } }
      }
    ) {
      Trade {
        Dex {
          ProtocolName
        }
        Buy {
          Currency {
            Symbol
            SmartContract
          }
        }
        Sell {
          Currency {
            Symbol
            SmartContract
          }
        }
      }
    }
  }
}
```

<FAQ
  items={[
    { q: "How do I find all trading pairs of a token on Ethereum?", a: "Group DEXTradeByTokens by Trade.Side.Currency and Trade.Dex.SmartContract with the token in Trade.Currency over a window on the combined dataset. Each row is a pool the token trades in, with its protocol and volume." },
    { q: "How do I limit the list to one DEX?", a: "Add Trade.Dex.ProtocolName, such as uniswap_v3 or uniswap_v2, to the filter. ProtocolFamily groups all versions of a protocol." },
    { q: "How do I get the liquidity of a pair?", a: "Query the Balances cube for the pool address with both token contracts; the amounts are the reserves. The DEXPools cube gives the same reserves updated per swap with USD values." },
    { q: "How do I know which tokens a pool address holds?", a: "Fetch one DEXTrades row where Trade.Dex.SmartContract is the pool; Buy.Currency and Sell.Currency are the two tokens." },
    { q: "Does this work for Uniswap v4 pools?", a: "Yes, with one difference: v4 pools share the PoolManager address in Dex.SmartContract, so group or filter on Trade.PoolId to separate them." },
  ]}
/>

## Related pages

- [Ethereum DEX trades API](/docs/blockchain/Ethereum/dextrades/dex-api)
- [Uniswap v4 on Ethereum](/docs/blockchain/Ethereum/dextrades/uniswap-v4-api)
- [DEXPools cube](/docs/cubes/evm-dexpool/)
- [Balances and Holders cubes](/docs/cubes/balances-cube)
