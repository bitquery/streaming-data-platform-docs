---
title: "Ethereum Uniswap v4 API: Swaps, PoolIds, Pool Stats, Traders and Reserves"
description: "Uniswap v4 on Ethereum with Bitquery GraphQL: swaps with trader and market cap, raw PoolManager swaps, pools by PoolId, pool stats, top traders, reserves."
sidebar_label: Uniswap v4 Trades
keywords:
  - Ethereum Uniswap v4 API
  - Uniswap v4 trades API
  - Uniswap v4 PoolId
  - Uniswap v4 PoolManager Ethereum
  - Uniswap v4 liquidity API
---

import FAQ from "@site/src/components/FAQ";

# Ethereum Uniswap v4 API: Swaps, PoolIds, Pool Stats, Traders and Reserves

Uniswap v4 replaced one contract per pool with one contract for all pools. On Ethereum that contract is the PoolManager at `0x000000000004444c5dc75cB358380D2e3dE08A90`; a pool is a `PoolId`, the hash of its two tokens, fee, tick spacing and hook, and swaps, deposits and withdrawals all surface as events of the PoolManager. Bitquery decodes those into the same cubes as every other DEX, with two things to know. `Trade.PoolId` is how you pick a pool, since `Dex.SmartContract` is always the PoolManager. And on raw `DEXTrades` rows the buyer and seller are both the PoolManager, because it settles both sides; the trader is `Transaction.From`, or the `Trader` field of the Trading cube. Every example runs in the [IDE](https://ide.bitquery.io) on a free account. The worked pool is ETH/USDC, `PoolId 0x00b9edc1583bf6ef09ff3a09f6c23ecb57fd7d0bb75625717ec81eed181e22d7`, and the worked token is USDC, `0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48`.

## Live swaps with trader, USD and market cap

For a live feed with the trader, USD amounts and the token's supply and market cap on every row, use the [Crypto Trades API](/docs/trading/crypto-trades-api/trades-api) of the Trading cube and filter the market to Ethereum and `uniswap_v4`. `Pair.Pool.Id` is the PoolId and `Pair.Pool.Address` the PoolManager. The Trading cube keeps about 30 days; the chain cubes below reach further back. Saved stream [here](https://ide.bitquery.io/Uniswap-v4-trades-with-pool-id-and-mcap).

```graphql
subscription {
  Trading {
    Trades(
      where: { Pair: { Market: { Network: { is: "Ethereum" }, Protocol: { is: "uniswap_v4" } } } }
    ) {
      Block {
        Time
      }
      Side
      Trader {
        Address
      }
      Amounts {
        Base
        Quote
      }
      AmountsInUsd {
        Base
        Quote
      }
      Supply {
        CirculatingSupply
        MarketCap
      }
      Pair {
        Currency {
          Symbol
          Id
        }
        QuoteCurrency {
          Symbol
        }
        Pool {
          Id
          Address
        }
      }
      TransactionHeader {
        Sender
      }
    }
  }
}
```

## Raw swaps from the PoolManager

The chain-specific `DEXTrades` cube gives the pool-side view of each swap: what the pool received and what it paid out, with USD on both sides. Filter on the protocol name and subscribe, or add a `PoolId`. Saved stream [here](https://ide.bitquery.io/Real-time-trades-on-uniswap-v4----subscription).

```graphql
subscription {
  EVM(network: eth) {
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

## Every v4 pool of a token

Group `DEXTradeByTokens` by `PoolId` with the token in `Currency`. Each row is one pool with its counter token, trade count and USD volume in the window; this is the lookup that gives you a `PoolId`. Saved query [here](https://ide.bitquery.io/All-Pool_Ids-for-currency).

```graphql
{
  EVM(network: eth) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: { ProtocolName: { is: "uniswap_v4" } }
          Currency: { SmartContract: { is: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" } }
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

## Latest swaps in one pool

Saved query [here](https://ide.bitquery.io/Latest-trades-for-a-Pool-Id-on-uniswap-v4).

```graphql
{
  EVM(network: eth) {
    DEXTrades(
      where: {
        Trade: {
          PoolId: { is: "0x00b9edc1583bf6ef09ff3a09f6c23ecb57fd7d0bb75625717ec81eed181e22d7" }
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

## Pool stats for the last 24 hours

Trades, distinct buyers and sellers, and USD volume split by direction for the token you name. Saved query [here](https://ide.bitquery.io/uniswap-v4-stats---Volume-bought-and-sold).

```graphql
{
  EVM(network: eth) {
    DEXTradeByTokens(
      where: {
        Trade: {
          PoolId: { is: "0x00b9edc1583bf6ef09ff3a09f6c23ecb57fd7d0bb75625717ec81eed181e22d7" }
          Currency: { SmartContract: { is: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" } }
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

Rank by `Transaction.From`, the account that sent the swap. `bought` sums the token the trader received and `sold` the token it paid; `Side.Type` describes the counter-side of each trade, which is why the two conditions are the other way round. Saved queries: [top buyers](https://ide.bitquery.io/Top-Buyers-of-a-currency-on-uniswap-v4), [top sellers](https://ide.bitquery.io/Top-Sellers-of-a-currency-on-uniswap-v4).

```graphql
{
  EVM(network: eth) {
    DEXTradeByTokens(
      where: {
        Trade: {
          PoolId: { is: "0x00b9edc1583bf6ef09ff3a09f6c23ecb57fd7d0bb75625717ec81eed181e22d7" }
          Currency: { SmartContract: { is: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" } }
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

## Reserves of a v4 pool

`DEXPoolEvents` rows carry the reserves the PoolManager holds for the pool after each change, rebuilt from the concentrated positions around the current price and priced in USD. Filter by `PoolId` for one pool, or keep only the protocol name to stream them all. Saved streams: [all v4 pools](https://ide.bitquery.io/Latest-Liquidity-Changes-of-Pools-in-a-Specific-DEX-Protocol---Uniswap-V4_6), [by PoolId](https://ide.bitquery.io/uniswap-v4-pool-liquidity-by-poolid-ethereum).

```graphql
{
  EVM(network: eth) {
    DEXPoolEvents(
      where: {
        PoolEvent: {
          Pool: {
            PoolId: { is: "0x00b9edc1583bf6ef09ff3a09f6c23ecb57fd7d0bb75625717ec81eed181e22d7" }
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
    { q: "How do I query Uniswap v4 trades on Ethereum?", a: "Two ways. Trading.Trades with the market filtered to Ethereum and uniswap_v4 gives swaps with trader, USD and market cap for the last month or so. EVM.DEXTrades with ProtocolName uniswap_v4 gives the raw pool-side rows with history on the archive dataset." },
    { q: "What is the Uniswap v4 PoolManager address on Ethereum?", a: "0x000000000004444c5dc75cB358380D2e3dE08A90. Every v4 pool on Ethereum lives inside it, so Dex.SmartContract repeats and Trade.PoolId identifies the pool." },
    { q: "How do I find a pool's PoolId?", a: "Group DEXTradeByTokens by Trade.PoolId with one token in Currency and the protocol name uniswap_v4; the rows are the pools of that token with counter token and volume. The Trading cube shows the same id as Pair.Pool.Id." },
    { q: "Why are buyer and seller the same address on v4 swap rows?", a: "The PoolManager settles both sides, so DEXTrades shows it twice. Use Transaction.From, the Trader field of the Trading cube, or DEXTradeByTokens for trader-level data." },
    { q: "Which chains have Uniswap v4 pages?", a: "Ethereum, Base, BNB Chain, Arbitrum, Optimism and Polygon each have a page with that chain's PoolManager address and live pools." },
  ]}
/>

## Related pages

- [Ethereum DEX trades API](/docs/blockchain/Ethereum/dextrades/dex-api)
- [Crypto Trades API](/docs/trading/crypto-trades-api/trades-api)
- [Uniswap v4 on Base](/docs/blockchain/Base/uniswap-v4-api)
- [Uniswap v4 on Arbitrum](/docs/blockchain/Arbitrum/uniswap-v4-api)
- [Uniswap v4 on Optimism](/docs/blockchain/Optimism/uniswap-v4-api)
