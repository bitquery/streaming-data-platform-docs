---
sidebar_position: 7
title: "BNB Chain Uniswap API"
description: "BNB Chain Uniswap API: GraphQL examples for v3 trades, top traders, hourly OHLC, 24-hour volume and top tokens, filtered to Uniswap's own factory. Most uniswap_v2 trades there are PancakeSwap V2."
---
import FAQ from "@site/src/components/FAQ";

import VideoPlayer from "../../../src/components/videoplayer.js";

# BSC Uniswap API

:::tip Real-time data or the last 30 days? Use the Trading cube
For real-time trades and anything from the last 30 days, use the [Trading cube](/docs/trading/trading-data-overview): [`Trading.Trades`](/docs/trading/crypto-trades-api/trades-api) returns MEV-filtered swaps with a USD price on every row. Use the `EVM` queries on this page for raw per-swap detail or call and event context. An `EVM` query without a `dataset` argument runs on the realtime dataset, which holds only the last few days; add `dataset: combined` or `dataset: archive` for older history.
:::


## Filter by factory to exclude forks

`Trade.Dex.ProtocolName` records which code a pool runs. Forks of v2 and v3 run the
same code, so their trades carry the same `uniswap_v2` and `uniswap_v3` labels. On BNB Chain the forks dominate. In Bitquery's trade data for 17 and 18 September 2026, more than 99% of
transactions labelled `uniswap_v2` went through other factories' pools, about 96%
through PancakeSwap V2 alone. For `uniswap_v3` the share was more than a quarter.

To keep only Uniswap's own pools, filter on the contract that owns them, as every example
on this page now does.

| Version | Filter field | Address on BNB Chain |
| --- | --- | --- |
| v2 | `Trade.Dex.OwnerAddress` | `0x8909dc15e40173ff4699343b6eb8132c65e18ec6` |
| v3 | `Trade.Dex.OwnerAddress` | `0xdb1d10011ad0ff90774d0c6bb92e5c5c8b4461f7` |
| v4 | `Trade.Dex.SmartContract` | `0x28e2ea090877bf75740558f6bfb36a5ffee9e9df` |

`OwnerAddress` is the factory that deployed the pool. A v4 pool has no factory: its
`OwnerAddress` is the zero address, and the PoolManager is its `SmartContract`. In the
Trading cube, filter `Pair.Market.Address` to the v2 or v3 factory, or `Pair.Market.Program`
to the v4 PoolManager. Addresses are from the official
[deployments list](https://developers.uniswap.org/deployments).

The link in each example's description opens an earlier copy saved in the Bitquery IDE,
which may still filter by `ProtocolName` or use older conditions and time windows. Use the
code on this page when you need Uniswap's own pools only.

## Live Uniswap v3 Trades on BSC (Trading API, recommended)

This subscription streams every Uniswap v3 trade on BSC in real time with **USD price and USD amounts on every row**, MEV-filtered. Run it [in the IDE](https://ide.bitquery.io/Trading-API-Uniswap-v3-Trades-BSC).

```graphql
subscription {
  Trading {
    Trades(
      where: {Pair: {Market: {Network: {is: "Binance Smart Chain"}, Address: {is: "0xdb1d10011ad0ff90774d0c6bb92e5c5c8b4461f7"}}}}
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

The query below returns the [latest DEX trades on BSC Uniswap v3](https://ide.bitquery.io/uniswap-v3-trades-bsc).

```graphql
query MyQuery {
  EVM(dataset: realtime, network: bsc) {
    DEXTrades(
      where: {Trade: {Dex: {OwnerAddress: {is: "0xdb1d10011ad0ff90774d0c6bb92e5c5c8b4461f7"}}}}
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

This query returns the [top traders of a token](https://ide.bitquery.io/top-traders-of-a-token-on-uniswapv3-bsc) on the selected network. It ranks `Transaction.From`, the account that sent each swap, since on a sale `Trade.Buyer` is the pool or a router. `Side.Type` describes the counter-side of each trade, so `bought` sums the rows where `Side.Type` is `sell`. `PriceAsymmetry: {lt: 0.1}` drops trades whose two sides disagree badly on value ([PriceAsymmetry reference](/docs/graphql/metrics/priceAsymmetry/)), which would otherwise inflate the USD totals.

```graphql
query topTraders($network: evm_network, $token: String) {
  EVM(network: $network) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "volumeUsd"}
      limit: {count: 100}
      where: {Trade: {Currency: {SmartContract: {is: $token}}, Dex: {OwnerAddress: {is: "0xdb1d10011ad0ff90774d0c6bb92e5c5c8b4461f7"}}, PriceAsymmetry: {lt: 0.1}}}
    ) {
      Transaction {
        From
      }
      Trade {
        Dex {
          OwnerAddress
          ProtocolFamily
          ProtocolName
        }
      }
      bought: sum(of: Trade_Amount, if: {Trade: {Side: {Type: {is: sell}}}})
      sold: sum(of: Trade_Amount, if: {Trade: {Side: {Type: {is: buy}}}})
      volume: sum(of: Trade_Amount)
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
    }
  }
}
{
  "network": "bsc",
  "token": "0x55d398326f99059ff775485246999027b3197955"
}
```

## OHLC in USD of a Token

This query retrieves [hourly open, high, low and close prices in USD](https://ide.bitquery.io/OHLC-on-BSC-Uniswap-v3) for one token traded on Uniswap v3.

```graphql
{
  EVM(network: bsc, dataset: realtime) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Block_testfield"}
      where: {Trade: {Currency: {SmartContract: {is: "0x55d398326f99059ff775485246999027b3197955"}}, PriceAsymmetry: {lt: 0.1}, Dex: {OwnerAddress: {is: "0xdb1d10011ad0ff90774d0c6bb92e5c5c8b4461f7"}}, Side: {Currency: {SmartContract: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}}, Type: {is: buy}}}}
      limit: {count: 10}
    ) {
      Block {
        testfield: Time(interval: {in: hours, count: 1})
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

## Get trading volume, buy volume, sell volume of a token

This query returns the [traded, buy and sell volume](https://ide.bitquery.io/trade_volume_bsc_uniswapv3) of token `0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c` on Uniswap v3 over the last 24 hours. `PriceAsymmetry: {lt: 0.1}` drops mispriced trades, which would otherwise skew the USD sums.

```graphql
query MyQuery {
  EVM(network: bsc) {
    DEXTradeByTokens(
      where: {Trade: {Currency: {SmartContract: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}}, Dex: {OwnerAddress: {is: "0xdb1d10011ad0ff90774d0c6bb92e5c5c8b4461f7"}}, PriceAsymmetry: {lt: 0.1}}, TransactionStatus: {Success: true}, Block: {Time: {since_relative: {hours_ago: 24}}}}
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

This query returns the [top bought tokens on Uniswap v3](https://ide.bitquery.io/top-bought-tokens-on-bsc-uniswap-v3). Buys are the rows where `Side.Type`, the counter-side, is `sell`. The `PriceAsymmetry` filter keeps mispriced trades out of the totals.

```graphql
query timeDiagram($network: evm_network) {
  EVM(network: $network) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "buy"}
      limit: {count: 100}
      where: {Trade: {Dex: {OwnerAddress: {is: "0xdb1d10011ad0ff90774d0c6bb92e5c5c8b4461f7"}}, PriceAsymmetry: {lt: 0.1}}}
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
  "network": "bsc"
}
```

## Get top sold tokens on uniswap v3

This query returns the [top sold tokens on Uniswap v3](https://ide.bitquery.io/top-sold-tokens-on-bsc-uniswap-v3). Sales are the rows where `Side.Type`, the counter-side, is `buy`.

```graphql
query timeDiagram($network: evm_network) {
  EVM(network: $network) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "sell"}
      limit: {count: 100}
      where: {Trade: {Dex: {OwnerAddress: {is: "0xdb1d10011ad0ff90774d0c6bb92e5c5c8b4461f7"}}, PriceAsymmetry: {lt: 0.1}}}
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
  "network": "bsc"
}
```

## Get Metadata of a token

The query below returns a [token's metadata](https://ide.bitquery.io/get-metadata_1): `Name`, `symbol`, `SmartContract Address` and `Decimals`.

```graphql
query MyQuery {
  EVM(network: bsc, dataset: realtime) {
    DEXTradeByTokens(
      limit: {count: 1}
      orderBy: {descending: Block_Time}
      where: {Trade: {Currency: {SmartContract: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}}, Dex: {OwnerAddress: {is: "0xdb1d10011ad0ff90774d0c6bb92e5c5c8b4461f7"}}}}
    ) {
      Trade {
        Currency {
          Name
          Symbol
          SmartContract
          ProtocolName
          HasURI
          Fungible
          Decimals
        }
      }
    }
  }
}

```

<FAQ
  items={[
    { q: "How do I get Uniswap trades on BSC?", a: "Query EVM.DEXTrades with network bsc and filter Trade.Dex.OwnerAddress to the v2 factory (0x8909dc15e40173ff4699343b6eb8132c65e18ec6) or the v3 factory (0xdb1d10011ad0ff90774d0c6bb92e5c5c8b4461f7), or Trade.Dex.SmartContract to the v4 PoolManager (0x28e2ea090877bf75740558f6bfb36a5ffee9e9df). Filtering on Trade.Dex.ProtocolName also returns forks such as PancakeSwap V2." },
    { q: "Does this include Uniswap v3 on BSC?", a: "Yes. Every example on this page runs on Uniswap v3." },
  ]}
/>
