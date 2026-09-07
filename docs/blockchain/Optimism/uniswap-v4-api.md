---
title: "Optimism Uniswap v4 API: Pools by PoolId, Swaps, Traders and Reserves"
sidebar_label: "Uniswap v4 API"
description: "Uniswap v4 on Optimism with Bitquery GraphQL: the v4 pools of USDC by PoolId, live swaps, the ETH/USDC pool's stats, top traders and reserves."
keywords:
  - Optimism Uniswap v4 API
  - Uniswap v4 Optimism trades
  - Uniswap v4 PoolId Optimism
  - Optimism PoolManager
  - USDC Optimism pools
---

import FAQ from "@site/src/components/FAQ";

# Optimism Uniswap v4 API: Pools by PoolId, Swaps, Traders and Reserves

Uniswap v4 on Optimism is small next to Base or BNB Chain: a few hundred swaps an hour, most of them in ETH/USDC, in the pool that converts between native USDC and the bridged USDC.e, and in OP/USDC. That shapes the queries on this page: windows are a day rather than an hour, and the stream examples pick pools that move. The venue itself works like v4 everywhere: one PoolManager, `0x9a13f98cb987694c9f086b1f5eb990eea8264ec3`, holds every pool; a pool is a `PoolId`, the hash of its tokens, fee, tick spacing and hook; and on raw swap rows the buyer and seller are both the PoolManager, so the trader is `Transaction.From`. Every example runs in the [IDE](https://ide.bitquery.io) on a free account. The worked token is native USDC, `0x0b2c639c533813f4aa9d7837caf62653d097ff85`, and the worked pool is ETH/USDC, `PoolId 0x51bf4cc5b8d9f7f759e41f572fe2a25bc2aeb42432bf12544a350595e5c8bb43`.

## The v4 pools of USDC on Optimism

Group `DEXTradeByTokens` by `PoolId` with USDC in `Currency`. The rows are its pools with the counter token, trade count and USD volume; the ETH pool and the USDC.e pool lead. This is where a `PoolId` for the other queries comes from. Saved query [here](https://ide.bitquery.io/get-virtual-pool-address-for-a-token-on-uniswap-v4-optimism).

```graphql
{
  EVM(network: optimism) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: { ProtocolName: { is: "uniswap_v4" } }
          Currency: { SmartContract: { is: "0x0b2c639c533813f4aa9d7837caf62653d097ff85" } }
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

## Latest swaps in the ETH/USDC pool

Saved query [here](https://ide.bitquery.io/Latest-Trades-for-a-currency-pair-on-optimism).

```graphql
{
  EVM(network: optimism) {
    DEXTrades(
      where: {
        Trade: {
          PoolId: { is: "0x51bf4cc5b8d9f7f759e41f572fe2a25bc2aeb42432bf12544a350595e5c8bb43" }
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

## Live swaps across all v4 pools on Optimism

The protocol filter as a subscription. Messages arrive every few seconds, which is slow enough to watch by eye. Saved stream [here](https://ide.bitquery.io/Real-time-trades-for-uniswap-v4-optimism).

```graphql
subscription {
  EVM(network: optimism) {
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

## Daily stats of the pool

Trades, distinct buyers and sellers, and USD volume by direction for the token you name. Saved query [here](https://ide.bitquery.io/trade-stats-for-a-token-pair-on-uniswap-v4-optimism).

```graphql
{
  EVM(network: optimism) {
    DEXTradeByTokens(
      where: {
        Trade: {
          PoolId: { is: "0x51bf4cc5b8d9f7f759e41f572fe2a25bc2aeb42432bf12544a350595e5c8bb43" }
          Currency: { SmartContract: { is: "0x0b2c639c533813f4aa9d7837caf62653d097ff85" } }
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

## Top traders of the pool

Rank by `Transaction.From`, since the PoolManager appears as buyer and seller on every raw v4 swap. `bought` sums the token the trader received and `sold` the token it paid; `Side.Type` describes the counter-side, which is why the conditions look swapped. On Optimism a handful of bots account for most of the pool's trades. Saved queries: [top buyers](https://ide.bitquery.io/top-buyers-of-a-currency-on-uniswap-v4-optimism), [top sellers](https://ide.bitquery.io/top-sellers-of-a-token-on-uniswap-v4-pool-optimism).

```graphql
{
  EVM(network: optimism) {
    DEXTradeByTokens(
      where: {
        Trade: {
          PoolId: { is: "0x51bf4cc5b8d9f7f759e41f572fe2a25bc2aeb42432bf12544a350595e5c8bb43" }
          Currency: { SmartContract: { is: "0x0b2c639c533813f4aa9d7837caf62653d097ff85" } }
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

`DEXPoolEvents` gives the reserves the PoolManager holds for the pool after each change, rebuilt from the concentrated positions around the current price and priced in USD. Filter on `PoolId`, or keep the protocol name alone to follow every v4 pool on Optimism.

```graphql
{
  EVM(network: optimism) {
    DEXPoolEvents(
      where: {
        PoolEvent: {
          Pool: {
            PoolId: { is: "0x51bf4cc5b8d9f7f759e41f572fe2a25bc2aeb42432bf12544a350595e5c8bb43" }
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
    { q: "What is the Uniswap v4 PoolManager address on Optimism?", a: "0x9a13f98cb987694c9f086b1f5eb990eea8264ec3. Every v4 pool on Optimism lives inside it and Trade.PoolId tells them apart." },
    { q: "How do I get the PoolId of a v4 pool on Optimism?", a: "Group DEXTradeByTokens by Trade.PoolId with one token in Currency and ProtocolName uniswap_v4. Each row is a pool of that token with its counter token, trade count and volume." },
    { q: "Why do my one-hour queries return little on Optimism?", a: "Uniswap v4 on Optimism trades a few hundred times an hour across all pools. Use a day or longer as the window, and dataset: combined on the EVM root for anything older than the realtime window." },
    { q: "Why are buyer and seller the same address on v4 swaps?", a: "The PoolManager settles both sides. Use Transaction.From for the account that sent the swap, or DEXTradeByTokens, whose Buyer and Seller fields are trader-aware." },
    { q: "Which USDC is which on Optimism?", a: "0x0b2c639c533813f4aa9d7837caf62653d097ff85 is native USDC and 0x7f5c764cbc14f9669b88837ca1490cca17c31607 is the bridged USDC.e; the v4 pool between them is one of the busiest on the chain." },
  ]}
/>

## Related pages

- [Optimism DEX trades API](/docs/blockchain/Optimism/optimism-dextrades)
- [Optimism transfers API](/docs/blockchain/Optimism/optimism-transfers)
- [Uniswap v4 on Ethereum](/docs/blockchain/Ethereum/dextrades/uniswap-v4-api)
- [Uniswap v4 on Base](/docs/blockchain/Base/uniswap-v4-api)
- [Uniswap v4 on Arbitrum](/docs/blockchain/Arbitrum/uniswap-v4-api)
