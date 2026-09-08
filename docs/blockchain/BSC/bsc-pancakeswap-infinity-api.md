---
sidebar_position: 7
title: "PancakeSwap Infinity API on BNB Chain: Swaps, Pools by PoolId, Prices, Traders"
sidebar_label: "PancakeSwap Infinity API"
description: "PancakeSwap Infinity on BNB Chain via Bitquery GraphQL: live swaps with USD, busiest pools by PoolId, a token's price, OHLC, volume and top traders."
keywords:
  - PancakeSwap Infinity API
  - PancakeSwap Infinity BSC
  - pancakeswap_infinity PoolId
  - PancakeSwap Infinity trades GraphQL
  - BNB Chain DEX API
---

import VideoPlayer from "../../../src/components/videoplayer.js";
import FAQ from "@site/src/components/FAQ";

# PancakeSwap Infinity API on BNB Chain: Swaps, Pools by PoolId, Prices, Traders

PancakeSwap Infinity keeps all of its pools inside one manager contract on BNB Chain, `0xa0ffb9c1ce1fe56963b0321b32e7a0302114058b`, the same singleton design as Uniswap v4. In Bitquery's cubes that means the protocol name `pancakeswap_infinity` selects the venue, `Trade.PoolId` selects a pool, and `Dex.SmartContract` is the manager on every row. Infinity is one of the busiest venues on the chain, and stablecoin pairs such as USDT/KII are among its most traded markets. Every example runs in the [IDE](https://ide.bitquery.io) on a free account. The worked token is POWER, `0x9dc44ae5be187eca9e2a67e33f27a4c91cea1223`, and the worked pool is USDT/KII, `PoolId 0xf43fdb854021ddeb41e06ac1d6e5df475197038ba5d3cba147f469a56870cd1b`. Bitquery also indexes PancakeSwap v2 and v3 on BNB Chain; those are on the [PancakeSwap API](/docs/blockchain/BSC/pancake-swap-api/) page.

## Live swaps with USD on every row

The Trading cube streams every Infinity swap with the trader, USD amounts and the token's market cap. Saved stream [here](https://ide.bitquery.io/Trading-API-PancakeSwap-Infinity-Trades-BSC).

```graphql
subscription {
  Trading {
    Trades(
      where: {
        Pair: {
          Market: { Network: { is: "Binance Smart Chain" }, Protocol: { is: "pancakeswap_infinity" } }
        }
      }
    ) {
      Block {
        Time
      }
      Side
      Trader {
        Address
      }
      Price
      PriceInUsd
      AmountsInUsd {
        Base
        Quote
      }
      Pair {
        Currency {
          Symbol
        }
        QuoteCurrency {
          Symbol
        }
        Pool {
          Id
        }
      }
      Supply {
        MarketCap
      }
    }
  }
}
```

<VideoPlayer url="https://www.youtube.com/watch?v=nVHdJUdKrJ8" />

## Latest swaps on Infinity

The chain cube view: what the pool received and paid out, with USD on both sides and the PoolId. Saved query [here](https://ide.bitquery.io/pancakeswap-infinity-trades-on-bsc).

```graphql
{
  EVM(network: bsc) {
    DEXTrades(
      where: { Trade: { Dex: { ProtocolName: { is: "pancakeswap_infinity" } } } }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
    ) {
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

## The busiest Infinity pools

Group by `PoolId` over the last day. Each row is one pool with the token, the trade count and USD volume; the single-trade USD cap keeps thin-pool outliers out of the sums.

```graphql
{
  EVM(network: bsc) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: { ProtocolName: { is: "pancakeswap_infinity" } }
          Side: { AmountInUSD: { lt: "10000000" } }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      orderBy: { descendingByField: "trades" }
      limit: { count: 20 }
    ) {
      Trade {
        PoolId
        Currency {
          Symbol
          SmartContract
        }
        Side {
          Currency {
            Symbol
          }
        }
      }
      trades: count
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
    }
  }
}
```

## Price of a token on Infinity

The newest `DEXTradeByTokens` row for the token carries its price in the quote and in USD, plus the pool it traded in. Saved query [here](https://ide.bitquery.io/Get-Latest-Price-of-a-token-on-PancakeSwap-Infinity_1).

```graphql
{
  EVM(network: bsc) {
    DEXTradeByTokens(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        Trade: {
          Currency: { SmartContract: { is: "0x9dc44ae5be187eca9e2a67e33f27a4c91cea1223" } }
          Dex: { ProtocolName: { is: "pancakeswap_infinity" } }
        }
      }
    ) {
      Block {
        Time
      }
      Trade {
        Price
        PriceInUSD
        PoolId
        Currency {
          Symbol
          Name
          SmartContract
          Decimals
        }
        Side {
          Currency {
            Symbol
          }
        }
      }
    }
  }
}
```

The same row answers the metadata question, so the saved [token metadata](https://ide.bitquery.io/get-metadata-for-bsc-pancakeswap-infnity-token) query is this one with the price fields removed.

## Hourly OHLC in USD

One-hour candles for the last day. `PriceAsymmetry` below 0.1 drops trades whose two sides disagree on price, which cleans candles on thin pools. Saved query [here](https://ide.bitquery.io/OHLC-on-bsc-pancakeswap-infinity).

```graphql
{
  EVM(network: bsc) {
    DEXTradeByTokens(
      orderBy: { descendingByField: "Block_testfield" }
      where: {
        Trade: {
          Currency: { SmartContract: { is: "0x9dc44ae5be187eca9e2a67e33f27a4c91cea1223" } }
          Dex: { ProtocolName: { is: "pancakeswap_infinity" } }
          PriceAsymmetry: { lt: 0.1 }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      limit: { count: 24 }
    ) {
      Block {
        testfield: Time(interval: { in: hours, count: 1 })
      }
      volume: sum(of: Trade_Amount)
      Trade {
        high: PriceInUSD(maximum: Trade_PriceInUSD)
        low: PriceInUSD(minimum: Trade_PriceInUSD)
        open: PriceInUSD(minimum: Block_Number)
        close: PriceInUSD(maximum: Block_Number)
      }
      count
    }
  }
}
```

## Volume, bought and sold

Totals for the token over a day. `Side.Type` describes the counter-side of each trade, so the token was bought where the side was sold. Saved query [here](https://ide.bitquery.io/trade_volume_bsc_pancakeswap_infinity).

```graphql
{
  EVM(network: bsc) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: { SmartContract: { is: "0x9dc44ae5be187eca9e2a67e33f27a4c91cea1223" } }
          Dex: { ProtocolName: { is: "pancakeswap_infinity" } }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      trades: count
      volume: sum(of: Trade_Amount)
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
      bought: sum(of: Trade_Amount, if: { Trade: { Side: { Type: { is: sell } } } })
      sold: sum(of: Trade_Amount, if: { Trade: { Side: { Type: { is: buy } } } })
    }
  }
}
```

## Top traders of a token

Rank by `Transaction.From`, the account that sent the swap, since the manager contract appears as buyer and seller on raw Infinity rows. Saved query [here](https://ide.bitquery.io/top-traders-of-a-token-on-pancakeswap_1).

```graphql
{
  EVM(network: bsc) {
    DEXTradeByTokens(
      orderBy: { descendingByField: "volumeUsd" }
      limit: { count: 20 }
      where: {
        Trade: {
          Currency: { SmartContract: { is: "0x9dc44ae5be187eca9e2a67e33f27a4c91cea1223" } }
          Dex: { ProtocolName: { is: "pancakeswap_infinity" } }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
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

## Most bought and most sold tokens on Infinity

One query, sorted on `bought` for the buy side; sort on `sold` for the other list. Saved queries: [top bought](https://ide.bitquery.io/top-bought-tokens-on-pancakeswap_infinity_1), [top sold](https://ide.bitquery.io/top-sold-tokens-on-pancake-infinty_1).

```graphql
{
  EVM(network: bsc) {
    DEXTradeByTokens(
      orderBy: { descendingByField: "bought" }
      limit: { count: 20 }
      where: {
        Trade: {
          Dex: { ProtocolName: { is: "pancakeswap_infinity" } }
          Side: { AmountInUSD: { lt: "10000000" } }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      Trade {
        Currency {
          Symbol
          SmartContract
        }
      }
      bought: sum(of: Trade_Side_AmountInUSD, if: { Trade: { Side: { Type: { is: sell } } } })
      sold: sum(of: Trade_Side_AmountInUSD, if: { Trade: { Side: { Type: { is: buy } } } })
      trades: count
    }
  }
}
```

## Reserves of a pool

`DEXPoolEvents` emits the reserves in USD after every change; filter on the `PoolId`. The [BNB Chain liquidity API](/docs/blockchain/BSC/bsc-liquidity-api) has the stream form and the other pool queries.

```graphql
{
  EVM(network: bsc) {
    DEXPoolEvents(
      where: {
        PoolEvent: {
          Pool: {
            PoolId: { is: "0xf43fdb854021ddeb41e06ac1d6e5df475197038ba5d3cba147f469a56870cd1b" }
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
    { q: "How do I get PancakeSwap Infinity trades on BNB Chain?", a: "Filter Trade.Dex.ProtocolName on pancakeswap_infinity in DEXTrades or DEXTradeByTokens under EVM(network: bsc), or use the Trading cube with Market Protocol pancakeswap_infinity for swaps with the trader and USD on every row." },
    { q: "Why do all Infinity pools share one contract address?", a: "Infinity keeps every pool inside its manager contract, 0xa0ffb9c1ce1fe56963b0321b32e7a0302114058b. Trade.PoolId identifies the pool; Dex.SmartContract is always the manager." },
    { q: "How do I find the PoolId of a pair?", a: "Group DEXTradeByTokens by Trade.PoolId with one token in Currency and ProtocolName pancakeswap_infinity. Each row is a pool of that token with its counter token and volume." },
    { q: "Is Infinity the same as Uniswap v4 on BNB Chain?", a: "Same singleton design, different protocol and manager. Uniswap v4 on BNB Chain has its own page and PoolManager address; filter ProtocolName uniswap_v4 for it." },
    { q: "How far back does Infinity trade data go?", a: "DEXTrades and DEXTradeByTokens reach history on the archive and combined datasets; the Trading cube keeps about a month; DEXPoolEvents is realtime-only." },
  ]}
/>

## Related pages

- [PancakeSwap API on BNB Chain](/docs/blockchain/BSC/pancake-swap-api/)
- [Uniswap v4 on BNB Chain](/docs/blockchain/BSC/uniswap-v4-api)
- [BNB Chain liquidity API](/docs/blockchain/BSC/bsc-liquidity-api)
- [BNB Chain DEX trades API](/docs/blockchain/BSC/bsc-dextrades)
- [Four.meme API](/docs/blockchain/BSC/four-meme-api/)
