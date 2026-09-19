---
sidebar_position: 7
title: "Polygon Matic Uniswap API"
description: "Polygon Uniswap API: GraphQL examples for v3 trades, top traders, hourly OHLC, volume and top tokens. Each filters Uniswap's own factory, so QuickSwap and other forks stay out."
---
import FAQ from "@site/src/components/FAQ";

import VideoPlayer from "../../../src/components/videoplayer.js";

# Matic Uniswap API


## Filter by factory to exclude forks

`Trade.Dex.ProtocolName` records which code a pool runs. Forks of v2 and v3 run the
same code, so their trades carry the same `uniswap_v2` and `uniswap_v3` labels. In Bitquery's trade data for Polygon on 17 and 18 September 2026, about 89% of transactions labelled
`uniswap_v2` went through other factories' pools, most of them QuickSwap's. For
`uniswap_v3` it was about one in five.

To keep only Uniswap's own pools, filter on the contract that owns them, as every example
on this page now does.

| Version | Filter field | Address on Polygon |
| --- | --- | --- |
| v2 | `Trade.Dex.OwnerAddress` | `0x9e5a52f57b3038f1b8eee45f28b3c1967e22799c` |
| v3 | `Trade.Dex.OwnerAddress` | `0x1f98431c8ad98523631ae4a59f267346ea31f984` |
| v4 | `Trade.Dex.SmartContract` | `0x67366782805870060151383f4bbff9dab53e5cd6` |

`OwnerAddress` is the factory that deployed the pool. A v4 pool has no factory: its
`OwnerAddress` is the zero address, and the PoolManager is its `SmartContract`. In the
Trading API the factory is `Pair.Market.Address`. Addresses are from the official
[deployments list](https://developers.uniswap.org/deployments).

The link in each example's description opens an earlier copy saved in the Bitquery IDE,
which may still filter by `ProtocolName`. Use the code on this page when you need Uniswap's
own pools only.

## Live Uniswap v3 Trades on Polygon (Trading API, recommended)

This subscription streams every Uniswap v3 trade on Polygon in real time with **USD price and USD amounts on every row**, MEV-filtered. Run it [in the IDE](https://ide.bitquery.io/Trading-API-Uniswap-v3-Trades-Matic).

```graphql
subscription {
  Trading {
    Trades(
      where: {Pair: {Market: {Network: {is: "Matic"}, Address: {is: "0x1f98431c8ad98523631ae4a59f267346ea31f984"}}}}
    ) {
      Block { Time }
      Price
      PriceInUsd
      AmountsInUsd { Base Quote }
      Trader { Address }
      Pair { Token { Symbol } QuoteToken { Symbol } Market { Protocol } }
    }
  }
}
```

## Get Latest Trades on Uniswap v3

The query below returns the [latest DEX trades on MATIC Uniswap v3](https://ide.bitquery.io/uniswap-v3-trades-matic).

```graphql
query MyQuery {
  EVM(dataset: realtime, network: matic) {
    DEXTrades(
      where: {Trade: {Dex: {OwnerAddress: {is: "0x1f98431c8ad98523631ae4a59f267346ea31f984"}}}}
      limit: {count: 10}
      orderBy:{descending:Block_Time}
    ) {
      Transaction {
        From
        To
      }
      Trade {
        Dex {
          ProtocolName
          SmartContract
        }
        Buy {
          Currency {
            Name
          }
          Price
          Amount
        }
        Sell {
          Amount
          Currency {
            Name
          }
          Price
        }
      }
      Block {
        Time
      }
    }
  }
}
```

## Get Top Traders of a token on uniswap v3

This query returns the [top traders of a token](https://ide.bitquery.io/top-traders-of-a-token-on-uniswapv3-matic) on the selected network. `Side.Type` describes the counter-side of each trade, so `bought` sums the rows where the side was sold.

```graphql
query topTraders($network: evm_network, $token: String) {
  EVM(network: $network) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "volumeUsd"}
      limit: {count: 100}
      where: {Trade: {Currency: {SmartContract: {is: $token}}, Dex: {OwnerAddress: {is: "0x1f98431c8ad98523631ae4a59f267346ea31f984"}}}}
    ) {
      Trade {
        Dex {
          OwnerAddress
          ProtocolFamily
          ProtocolName
        }
        Buyer
      }
      bought: sum(of: Trade_Amount, if: {Trade: {Side: {Type: {is: sell}}}})
      sold: sum(of: Trade_Amount, if: {Trade: {Side: {Type: {is: buy}}}})
      volume: sum(of: Trade_Amount)
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
    }
  }
}
{
  "network": "matic",
  "token": "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"
}
```

## OHLC in USD of a Token

This query retrieves [hourly open, high, low and close prices in USD](https://ide.bitquery.io/OHLCV-on-MATIC-uniswap-v3#) for one token traded on Uniswap v3.

```graphql
{
  EVM(network: matic, dataset: realtime) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Block_testfield"}
      where: {Trade: {Currency: {SmartContract: {is: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"}}, PriceAsymmetry: {lt: 0.1}, Dex: {OwnerAddress: {is: "0x1f98431c8ad98523631ae4a59f267346ea31f984"}}, Side: {Currency: {SmartContract: {is: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359"}}, Type: {is: buy}}}}
      limit: {count: 10}
    ) {
      Block {
        testfield: Time(interval: {in: hours, count: 1})
      }
      volume: sum(of: Trade_Amount)
      Trade {
        high: Price(maximum: Trade_Price)
        low: Price(minimum: Trade_Price)
        open: Price(minimum: Block_Number)
        close: Price(maximum: Block_Number)
      }
      count
    }
  }
}
```

## Get trading volume, buy volume, sell volume of a token

This query returns the [traded, buy and sell volume](https://ide.bitquery.io/trade_volume_matic_uniswapv3) of token `0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270` on Uniswap v3.

```graphql
query MyQuery {
  EVM(network: matic) {
    DEXTradeByTokens(
      where: {Trade: {Currency: {SmartContract: {is: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"}}, Dex: {OwnerAddress: {is: "0x1f98431c8ad98523631ae4a59f267346ea31f984"}}}, TransactionStatus: {Success: true}, Block: {Time: {since: "2025-02-12T00:00:00Z"}}}
    ) {
      Trade {
        Currency {
          Name
          Symbol
          SmartContract
          Decimals
        }
      }
      traded_volume_in_usd: sum(of: Trade_Side_AmountInUSD)
      sell_volume_in_usd: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: buy}}}}
      )
      buy_volume_in_usd: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: sell}}}}
      )
    }
  }
}
```

## Get top bought tokens on uniswap v3

This query returns the [top bought tokens on Uniswap v3](https://ide.bitquery.io/top-bought-tokens-on-matic-uniswap-v3_4). Buys are the rows where `Side.Type`, the counter-side, is `sell`.

```graphql
query timeDiagram($network: evm_network) {
  EVM(network: $network) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "buy"}
      limit: {count: 100}
      where: {Trade: {Dex: {OwnerAddress: {is: "0x1f98431c8ad98523631ae4a59f267346ea31f984"}}}}
    ) {
      Trade {
        Currency {
          Symbol
          Name
          SmartContract
        }
        Dex{
          ProtocolName
        }
      }
      buy: sum(of: Trade_Side_AmountInUSD, if: {Trade: {Side: {Type: {is: sell}}}})
      sell: sum(of: Trade_Side_AmountInUSD, if: {Trade: {Side: {Type: {is: buy}}}})
    }
  }
}
{
  "network": "matic"
}
```

## Get top sold tokens on uniswap v3

This query returns the [top sold tokens on Uniswap v3](https://ide.bitquery.io/top-sold-tokens-on-matic-uniswap-v3). Sales are the rows where `Side.Type`, the counter-side, is `buy`.

```graphql
query timeDiagram($network: evm_network) {
  EVM(network: $network) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "sell"}
      limit: {count: 100}
      where: {Trade: {Dex: {OwnerAddress: {is: "0x1f98431c8ad98523631ae4a59f267346ea31f984"}}}}
    ) {
      Trade {
        Currency {
          Symbol
          Name
          SmartContract
        }
        Dex{
          ProtocolName
        }
      }
      buy: sum(of: Trade_Side_AmountInUSD, if: {Trade: {Side: {Type: {is: sell}}}})
      sell: sum(of: Trade_Side_AmountInUSD, if: {Trade: {Side: {Type: {is: buy}}}})
    }
  }
}
{
  "network": "matic"
}
```

<FAQ
  items={[
    { q: "How do I get Uniswap trades on Polygon?", a: "Query EVM.DEXTrades with network matic and filter Trade.Dex.OwnerAddress to the v2 factory (0x9e5a52f57b3038f1b8eee45f28b3c1967e22799c) or the v3 factory (0x1f98431c8ad98523631ae4a59f267346ea31f984), or Trade.Dex.SmartContract to the v4 PoolManager (0x67366782805870060151383f4bbff9dab53e5cd6). Filtering on protocol names also returns forks such as QuickSwap." },
    { q: "Can I filter by token pair?", a: "Yes. Filter Trade.Buy.Currency.SmartContract and Trade.Sell.Currency.SmartContract in your where clause." },
  ]}
/>
