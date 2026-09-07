---
sidebar_position: 2
title: "Optimism DEX Trades API: Uniswap, Velodrome and Every Swap on Optimism"
sidebar_label: "Optimism DEX Trades API"
description: "Optimism DEX data with Bitquery GraphQL: live swaps with trader and USD, which DEXs trade, busiest pairs, top traders, token prices and top tokens."
keywords:
  - Optimism DEX trades API
  - Velodrome API
  - Uniswap Optimism trades
  - Optimism token price API
  - top traders Optimism
---

import FAQ from "@site/src/components/FAQ";

# Optimism DEX Trades API: Uniswap, Velodrome and Every Swap on Optimism

Optimism's DEX trading runs through Uniswap v3, which carries most of the swaps, Uniswap v4, Velodrome, whose pools report under the protocol name `aerodrome_v1` because they share that code base, v2-style pairs, and Balancer. Bitquery indexes all of them into the chain cubes, `DEXTrades` for one row per swap and `DEXTradeByTokens` for one row per swap per token, and into the Trading cube, which adds the trader, USD price, market cap and supply on every row for the last month or so. Every example runs in the [IDE](https://ide.bitquery.io) on a free account. Two Optimism details shape the examples: native USDC is `0x0b2c639c533813f4aa9d7837caf62653d097ff85` and the bridged USDC.e is `0x7f5c764cbc14f9669b88837ca1490cca17c31607`, and a few swaps in thin pools carry absurd USD values, so every USD sum here caps a single trade with `Side: { AmountInUSD: { lt: "10000000" } }`.

## Live swaps with trader and USD

The [Crypto Trades API](/docs/trading/crypto-trades-api/trades-api) of the Trading cube, filtered to the Optimism market. Each message is one swap with the side, the trader, both amounts in USD and the token's supply. Paste it into the [IDE](https://ide.bitquery.io) to run.

```graphql
subscription {
  Trading {
    Trades(where: { Pair: { Market: { Network: { is: "Optimism" } } } }) {
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
      Pair {
        Currency {
          Symbol
          Id
        }
        QuoteCurrency {
          Symbol
        }
        Market {
          Protocol
          Address
        }
      }
      Supply {
        MarketCap
      }
    }
  }
}
```

## Which DEXs trade on Optimism

Group the last day by protocol. Saved query [here](https://ide.bitquery.io/trending-pairs-on-optimism).

```graphql
{
  EVM(network: optimism) {
    DEXTradeByTokens(
      where: {
        Trade: { Side: { AmountInUSD: { lt: "10000000" } } }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      orderBy: { descendingByField: "trades" }
      limit: { count: 20 }
    ) {
      Trade {
        Dex {
          ProtocolFamily
          ProtocolName
        }
      }
      trades: count
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
      traders: uniq(of: Transaction_From)
    }
  }
}
```

## The busiest pairs

Tokens traded against WETH, USDC or USDC.e over the last day, ranked by USD volume, with distinct buyers and sellers and the latest price. [DEXrabbit](https://dexrabbit.bitquery.io/optimism) shows the same table live.

```graphql
{
  EVM(network: optimism) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Side: {
            AmountInUSD: { lt: "10000000" }
            Currency: {
              SmartContract: {
                in: [
                  "0x4200000000000000000000000000000000000006"
                  "0x0b2c639c533813f4aa9d7837caf62653d097ff85"
                  "0x7f5c764cbc14f9669b88837ca1490cca17c31607"
                ]
              }
            }
          }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      orderBy: { descendingByField: "volumeUsd" }
      limit: { count: 30 }
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
      }
      trades: count
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
      buyers: uniq(of: Trade_Buyer)
      sellers: uniq(of: Trade_Seller)
      price: Trade {
        PriceInUSD(maximum: Block_Time)
      }
    }
  }
}
```

![Trending pairs on Optimism](/img/dexrabbit/optimism_trending_pairs.png)

## Latest swaps, live

The raw `DEXTrades` stream for the chain: pool-side buy and sell with USD on both, the protocol and the transaction. Saved stream [here](https://ide.bitquery.io/Realtime-optimism-dex-trades-websocket).

```graphql
subscription {
  EVM(network: optimism) {
    DEXTrades {
      Block {
        Time
      }
      Trade {
        Dex {
          ProtocolName
          SmartContract
        }
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
        Hash
        From
      }
    }
  }
}
```

## Top traders on Optimism

Rank by `Transaction.From` over the last day. Saved query [here](https://ide.bitquery.io/top-traders-on-optimism).

```graphql
{
  EVM(network: optimism) {
    DEXTradeByTokens(
      where: {
        Trade: { Side: { AmountInUSD: { lt: "10000000" } } }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      orderBy: { descendingByField: "volumeUsd" }
      limit: { count: 50 }
    ) {
      Transaction {
        From
      }
      trades: count
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
      tokens: uniq(of: Trade_Currency_SmartContract)
    }
  }
}
```

![Top traders on Optimism](/img/dexrabbit/optimism_top_traders.png)

## Top traders of one pair

Fix the token and the quote. The example is WETH against native USDC over the last day; the saved query used WLD/USDC, a quieter pair that needs a week. Saved query [here](https://ide.bitquery.io/top-traders-for-wld-usdc-pair).

```graphql
{
  EVM(network: optimism) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: { SmartContract: { is: "0x4200000000000000000000000000000000000006" } }
          Side: {
            AmountInUSD: { lt: "10000000" }
            Currency: { SmartContract: { is: "0x0b2c639c533813f4aa9d7837caf62653d097ff85" } }
          }
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

![Top traders for a pair](/img/dexrabbit/optimism_top_pair_traders.png)

## Latest price of a token

The newest `DEXTradeByTokens` row for a token carries its price in USD and the quote it traded against; the example is WBTC. For a price in a specific quote, filter the quote under `Side` as well, as in the WETH in USDC.e example. Saved queries: [WBTC in USD](https://ide.bitquery.io/Get-latest-price-of-WBTC-in-USD-on-optimism), [WETH in USDC.e](https://ide.bitquery.io/Price-of-WETH-in-terms-of-USDC-on-Optimism).

```graphql
{
  EVM(network: optimism) {
    DEXTradeByTokens(
      where: {
        Trade: { Currency: { SmartContract: { is: "0x68f180fcCe6836688e9084f035309E29Bf0A2095" } } }
      }
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Trade {
        PriceInUSD
        Price
        Side {
          Currency {
            Symbol
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

Change `query` to `subscription` and drop `limit` and `orderBy` to stream each new price; WBTC trades often enough on Optimism for that to update every few minutes.

## Top tokens by trades

Tokens ranked by number of trades over the last day, with buyers, sellers, pools and volume. Saved query [here](https://ide.bitquery.io/top-tokens-on-optimism).

```graphql
{
  EVM(network: optimism) {
    DEXTradeByTokens(
      where: {
        Trade: { Side: { AmountInUSD: { lt: "10000000" } } }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      orderBy: { descendingByField: "trades" }
      limit: { count: 50 }
    ) {
      Trade {
        Currency {
          Symbol
          SmartContract
        }
      }
      trades: count
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
      buyers: uniq(of: Trade_Buyer)
      sellers: uniq(of: Trade_Seller)
      pools: uniq(of: Trade_Dex_SmartContract)
    }
  }
}
```

![Top tokens on Optimism](/img/dexrabbit/optimism_top_tokens.png)

<FAQ
  items={[
    { q: "Which DEXs does Bitquery index on Optimism?", a: "Uniswap v2, v3 and v4, Velodrome, which reports as aerodrome_v1, Balancer and the smaller venues. The protocol query on this page lists whatever traded in the window." },
    { q: "How do I get Velodrome trades on Optimism?", a: "Filter Trade.Dex.ProtocolName on aerodrome_v1 in DEXTrades or DEXTradeByTokens; Velodrome and Aerodrome share a code base and the cube uses that name on both chains." },
    { q: "Why cap AmountInUSD in the queries?", a: "A swap in a pool with almost no liquidity can carry a nonsense USD value that swamps any sum. Keeping single trades under ten million dollars removes those rows from rankings." },
    { q: "How do I get the price of a token on Optimism?", a: "Take the newest DEXTradeByTokens row for the token contract and read PriceInUSD, or filter the quote currency under Side for the price in that quote." },
    { q: "Where do the trader addresses come from?", a: "Transaction.From is the account that sent the swap. The Trading cube's Trader field is the same idea with USD and market cap attached." },
  ]}
/>

## Related pages

- [Optimism API hub](/docs/blockchain/Optimism/)
- [Uniswap v4 on Optimism](/docs/blockchain/Optimism/uniswap-v4-api)
- [Optimism transfers API](/docs/blockchain/Optimism/optimism-transfers)
- [Crypto Trades API](/docs/trading/crypto-trades-api/trades-api)
- [DEXTrades vs DEXTradeByTokens vs Trades](/docs/cubes/dextrades-dextradebytokens-trading-trades)
