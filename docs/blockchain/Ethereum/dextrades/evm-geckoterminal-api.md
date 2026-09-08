---
sidebar_position: 1
sidebar_label: GeckoTerminal
title: "GeckoTerminal-style Pool Data on Ethereum: Trending Pools, OHLC, Reserves"
description: "GeckoTerminal-style pool pages on Ethereum via Bitquery GraphQL: trending pools, live pool trades, buys, sells and makers, hourly OHLC, reserves, new pools."
keywords:
  - GeckoTerminal API
  - GeckoTerminal alternative Ethereum
  - Ethereum pool trades API
  - trending pools Ethereum
  - Ethereum pool reserves API
---

import FAQ from "@site/src/components/FAQ";

# GeckoTerminal-style Pool Data on Ethereum: Trending Pools, OHLC, Reserves

GeckoTerminal is organised around pools: a ranked list of them, and for each one the trades, the buy and sell counts, the makers, the candles and the reserves. Bitquery's `DEXTradeByTokens` cube keys Ethereum trades by pool contract, and `DEXPoolEvents` records reserves in USD after every change, so each panel is one query. The worked pool is Mog/WETH on Uniswap v2, `0xc2eab7d33d3cb97692ecb231a5d0e4a649cb539d`, with Mog at `0xaaee1a9723aadb7afa2810263653a34ba2c21c7a`. Every example runs in the [IDE](https://ide.bitquery.io) on a free account, and the same queries work on BSC, Base, Arbitrum and the other EVM chains by changing the network. The [Solana version](/docs/blockchain/Solana/solana-geckoterminal-api/) covers Solana pools.

## Recommended: Trading API queries (real-time + last ~30 days)

### Live trades with USD price, market cap and supply

Every Ethereum DEX trade with the trader, USD amounts and the market on the row, MEV trades filtered out; drop the network filter for all nine chains. Run it [in the IDE](https://ide.bitquery.io/Trading-API-Live-Trades-All-Chains).

```graphql
subscription {
  Trading {
    Trades(where: { Pair: { Market: { Network: { is: "Ethereum" } } } }) {
      Block { Time }
      Price
      PriceInUsd
      Amounts { Base Quote }
      AmountsInUsd { Base Quote }
      Trader { Address }
      Pair {
        Token { Symbol Network }
        QuoteToken { Symbol }
        Market { Protocol Network }
      }
    }
  }
}
```

### Most accurate token price with 1-minute OHLC (top market)

`Ranking: { Position: { eq: 1 } }` picks the token's deepest market, so this is the price a pool list should show; change the token address and network for any other token. Run it [in the IDE](https://ide.bitquery.io/Trading-API-Token-Price-Top-Market-Rank-1).

```graphql
{
  Trading {
    Pairs(
      where: {
        Token: {Address: {is: "0xaaee1a9723aadb7afa2810263653a34ba2c21c7a"}, Network: {is: "Ethereum"}}
        Ranking: {Position: {eq: 1}}
        Interval: {Time: {Duration: {eq: 60}}}
        Price: {IsQuotedInUsd: true}
      }
      limit: {count: 1}
      orderBy: {descending: Block_Time}
    ) {
      Token { Symbol Address }
      QuoteToken { Symbol }
      Market { Protocol Address Network }
      Price { IsQuotedInUsd Ohlc { Open High Low Close } Average { Mean } }
      Volume { Base Usd }
      Block { Time }
    }
  }
}
```

## Trending pools

The pools with the most trades in the last day, one row per pool contract with the pair, the maker count and USD volume. The single-trade USD cap keeps mispriced thin-pool rows out of the sums. Saved query [here](https://ide.bitquery.io/List-of-trading-pairs-in-descending-order-of-trxns-in-last-24-hours).

```graphql
{
  EVM(network: eth) {
    DEXTradeByTokens(
      orderBy: { descendingByField: "trades" }
      where: {
        Block: { Time: { since_relative: { hours_ago: 24 } } }
        TransactionStatus: { Success: true }
        Trade: { Side: { AmountInUSD: { lt: "10000000" } } }
      }
      limit: { count: 20 }
      limitBy: { by: Trade_Dex_SmartContract, count: 1 }
    ) {
      Trade {
        Dex {
          SmartContract
          ProtocolName
        }
        Currency {
          Symbol
          SmartContract
        }
        Side {
          Currency {
            Symbol
            SmartContract
          }
        }
      }
      trades: count
      makers: uniq(of: Transaction_From)
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
    }
  }
}
```

## Live trades of a pool

Each message is one swap in the pool with the amount, the USD price, the side and the wallet that sent it. Saved stream [here](https://ide.bitquery.io/Get-pair-trades-data-just-like-geckoterminal).

```graphql
subscription {
  EVM(network: eth) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: { SmartContract: { is: "0xc2eab7d33d3cb97692ecb231a5d0e4a649cb539d" } }
          Currency: { SmartContract: { is: "0xaaee1a9723aadb7afa2810263653a34ba2c21c7a" } }
        }
      }
    ) {
      Block {
        Time
      }
      Trade {
        Amount
        PriceInUSD
        Currency {
          Symbol
        }
        Side {
          Amount
          AmountInUSD
          Type
          Currency {
            Symbol
          }
        }
      }
      Transaction {
        Maker: From
        Hash
      }
    }
  }
}
```

## Buys, sells, makers and volume of a pool

The stat block of a pool page: trades, buys, sells, makers, buyers, sellers and USD volume over the last day, each with a one-hour sub-window, plus the price at both ends of the window. `Side.Type` names the counter-side of a trade, so the token was bought where the side was sold, and wallets are counted by `Transaction.From`. Saved query [here](https://ide.bitquery.io/Buys-Sells-BuyVolume-SellVolume-Makers-TotalTradedVolume-PriceinUSD-for-a-eth-pair).

```graphql
{
  EVM(network: eth) {
    DEXTradeByTokens(
      where: {
        TransactionStatus: { Success: true }
        Trade: {
          Dex: { SmartContract: { is: "0xc2eab7d33d3cb97692ecb231a5d0e4a649cb539d" } }
          Currency: { SmartContract: { is: "0xaaee1a9723aadb7afa2810263653a34ba2c21c7a" } }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      Trade {
        Currency {
          Symbol
          SmartContract
        }
        Side {
          Currency {
            Symbol
          }
        }
        Dex {
          ProtocolName
        }
        start: PriceInUSD(minimum: Block_Number)
        end: PriceInUSD(maximum: Block_Number)
      }
      trades: count
      trades1h: count(if: { Block: { Time: { after_relative: { hours_ago: 1 } } } })
      buys: count(if: { Trade: { Side: { Type: { is: sell } } } })
      sells: count(if: { Trade: { Side: { Type: { is: buy } } } })
      makers: uniq(of: Transaction_From)
      makers1h: uniq(of: Transaction_From, if: { Block: { Time: { after_relative: { hours_ago: 1 } } } })
      buyers: uniq(of: Transaction_From, if: { Trade: { Side: { Type: { is: sell } } } })
      sellers: uniq(of: Transaction_From, if: { Trade: { Side: { Type: { is: buy } } } })
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
      volumeUsd1h: sum(of: Trade_Side_AmountInUSD, if: { Block: { Time: { after_relative: { hours_ago: 1 } } } })
      buyVolumeUsd: sum(of: Trade_Side_AmountInUSD, if: { Trade: { Side: { Type: { is: sell } } } })
      sellVolumeUsd: sum(of: Trade_Side_AmountInUSD, if: { Trade: { Side: { Type: { is: buy } } } })
    }
  }
}
```

## Hourly OHLC of a pair

Candles from the Trading cube for WETH against USDT, quoted in USD, one row per hour. Change the two token ids for any pair. Saved query [here](https://ide.bitquery.io/WETH-USDT-OHLC-on-Ethereum_1).

```graphql
{
  Trading {
    Pairs(
      where: {
        Token: { Id: { is: "bid:eth:0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" } }
        QuoteToken: { Id: { is: "bid:eth:0xdac17f958d2ee523a2206206994597c13d831ec7" } }
        Interval: { Time: { Duration: { eq: 3600 } } }
        Price: { IsQuotedInUsd: true }
      }
      limit: { count: 24 }
      orderBy: { descending: Interval_Time_Start }
    ) {
      Interval {
        Time {
          Start
        }
      }
      Token {
        Symbol
      }
      QuoteToken {
        Symbol
      }
      Price {
        Ohlc {
          Open
          High
          Low
          Close
        }
        Average {
          Mean
        }
      }
      Volume {
        Base
        Usd
      }
    }
  }
}
```

## Reserves of a pool

`DEXPoolEvents` emits both reserves in USD after every swap, mint or burn in the pool. The newest rows are the current liquidity. Saved query [here](https://ide.bitquery.io/Get-liquidity-of-a-pair_1).

```graphql
{
  EVM(network: eth) {
    DEXPoolEvents(
      where: { PoolEvent: { Pool: { SmartContract: { is: "0xc2eab7d33d3cb97692ecb231a5d0e4a649cb539d" } } } }
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

## New pools

`PoolCreated` on the Uniswap v3 factory names both tokens, the fee tier and the pool address; the v2 factory at `0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f` emits `PairCreated` for the older design. Only a handful of pools a day appear on Ethereum, so query the last day rather than waiting on a stream. Saved query [here](https://ide.bitquery.io/Latest-pools-created-Uniswap-v3_9).

```graphql
{
  EVM(network: eth) {
    Events(
      where: {
        Log: {
          SmartContract: { is: "0x1f98431c8ad98523631ae4a59f267346ea31f984" }
          Signature: { Name: { is: "PoolCreated" } }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      limit: { count: 50 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
        }
      }
    }
  }
}
```

<FAQ
  items={[
    { q: "How do I build a GeckoTerminal-style pool page for Ethereum?", a: "Filter DEXTradeByTokens on the pool under Trade.Dex.SmartContract for trades, stats and rankings, DEXPoolEvents on the same address for reserves in USD, and the Trading cube for candles." },
    { q: "How do I find trending pools?", a: "Group DEXTradeByTokens over a window with limitBy on Trade.Dex.SmartContract and sort by count. Add a single-trade USD cap so a mispriced thin pool does not top the volume column." },
    { q: "How are buys and sells told apart?", a: "By Side.Type, which describes the counter-side of the trade: a buy of the token under Trade.Currency is a row whose side type is sell, and a sale is a row whose side type is buy." },
    { q: "Where do reserves come from?", a: "DEXPoolEvents, which records both reserves with USD values after every change in Uniswap and PancakeSwap family pools. It is realtime only; the Ethereum liquidity API page covers history." },
    { q: "Can I run these queries on BSC, Base or Arbitrum?", a: "Yes. Set network to bsc, base or arbitrum and swap the pool and token addresses; DEXTradeByTokens and DEXPoolEvents have the same fields on each of them." },
  ]}
/>

## Related pages

- [GeckoTerminal-style Solana API](/docs/blockchain/Solana/solana-geckoterminal-api/)
- [BullX-style EVM API](/docs/blockchain/Ethereum/dextrades/evm-bullx-api/)
- [Ethereum liquidity API](/docs/blockchain/Ethereum/dextrades/ethereum-liquidity-api)
- [Ethereum DEX trades API](/docs/blockchain/Ethereum/dextrades/dex-api)
