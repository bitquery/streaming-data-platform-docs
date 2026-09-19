---
sidebar_position: 7
title: "Base PancakeSwap Infinity API"
description: "Base PancakeSwap Infinity API: query and stream Base on-chain data with Bitquery GraphQL examples for developers. Built for traders and analytics teams."
---
import VideoPlayer from "../../../src/components/videoplayer.js";

# Base PancakeSwap Infinity API

Bitquery provides PancakeSwap Infinity (Base) data through APIs, Streams and Data Dumps.
The GraphQL APIs and streams below show the data Bitquery has for PancakeSwap Infinity on Base.


## Live PancakeSwap Infinity Trades on Base (Trading API, recommended)

This subscription streams every PancakeSwap Infinity trade on Base in real time with **USD price and USD amounts on every row**, MEV-filtered. Run it [in the IDE](https://ide.bitquery.io/Trading-API-PancakeSwap-Infinity-Trades-Base).

```graphql
subscription {
  Trading {
    Trades(
      where: {Pair: {Market: {Network: {is: "Base"}, Protocol: {is: "pancakeswap_infinity"}}}}
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
If you have any question on other data points reach out to [support](https://t.me/Bloxy_info)

Need zero-latency Base data? [Read about our Kafka Streams and Contact us for a Trial](/docs/streams/kafka-streaming-concepts/).

You may also be interested in:

- [Clanker APIs ➤](/docs/blockchain/Base/base-clanker-api/)
- [Base DEX Trade APIs ➤](/docs/blockchain/Base/base-dextrades/)

:::note
To query or stream data via graphQL **outside the Bitquery IDE**, you need to generate an API access token.

Follow the steps here to create one: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

## Get Latest Trades on PancakeSwap Infinity

Returns the [latest DEX trades on PancakeSwap Infinity](https://ide.bitquery.io/pancakeswap-infinity-trades).

```graphql
query MyQuery {
  EVM(dataset: realtime, network: base) {
    DEXTrades(
      where: {
        Trade: { Dex: { ProtocolName: { is: "pancakeswap_infinity" } } }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
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

## Get Latest Price of a token on PancakeSwap Infinity

Returns the [latest price of cbBTC on PancakeSwap Infinity](https://ide.bitquery.io/Get-Latest-Price-of-a-token-on-PancakeSwap-Infinity) from its 10 most recent trades.

```graphql
query MyQuery {
  EVM(dataset: realtime, network: base) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: {
            SmartContract: { is: "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf" }
          }
          Dex: { ProtocolName: { is: "pancakeswap_infinity" } }
        }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Transaction {
        From
        To
      }
      Block {
        Time
      }
      Trade {
        Price
        PriceInUSD
        Amount
        AmountInUSD
        Currency {
          Name
          Symbol
          SmartContract
        }
        Dex {
          ProtocolName
          SmartContract
        }
        Side {
          Amount
          AmountInUSD
          Currency {
            Name
            Symbol
            SmartContract
          }
        }
      }
    }
  }
}
```

## Get Top Traders of a token on PancakeSwap Infinity

Returns the [top 100 traders of cbBTC on PancakeSwap Infinity](https://ide.bitquery.io/top-traders-of-a-token-on-pancakeswap) by USD volume. It ranks `Transaction.From`, the account that sent each swap, since on a sale `Trade.Buyer` is the pool or a router. `Side.Type` describes the counter-side of each trade, so `bought` sums the rows where `Side.Type` is `sell`. `PriceAsymmetry: {lt: 0.1}` leaves out trades whose two sides disagree on value ([PriceAsymmetry reference](/docs/graphql/metrics/priceAsymmetry/)).

```graphql
query topTraders($network: evm_network, $token: String) {
  EVM(network: $network) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "volumeUsd"}
      limit: {count: 100}
      where: {Trade: {Currency: {SmartContract: {is: $token}}, Dex: {ProtocolName: {is: "pancakeswap_infinity"}}, PriceAsymmetry: {lt: 0.1}}}
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
  "network": "base",
  "token": "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf"
}
```

## OHLC in USD of a Token

Returns [hourly open, high, low and close prices in USD](https://ide.bitquery.io/OHLC-on-BASE-pancakeswap-infinity) for cbBTC traded against ETH on PancakeSwap Infinity.

```graphql
{
  EVM(network: base, dataset: realtime) {
    DEXTradeByTokens(
      orderBy: { descendingByField: "Block_testfield" }
      where: {
        Trade: {
          Currency: {
            SmartContract: { is: "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf" }
          }
          Side: {
            Currency: {
              SmartContract: {
                is: "0x0000000000000000000000000000000000000000"
              }
            }
            Type: { is: buy }
          }
          PriceAsymmetry: { lt: 0.1 }
          Dex: { ProtocolName: { is: "pancakeswap_infinity" } }
        }
      }
      limit: { count: 10 }
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

## Get trading volume, buy volume, sell volume of a token

Returns the [traded, buy and sell volume of cbBTC](https://ide.bitquery.io/trade_volume_base_pancakeswap_infinity) (`0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf`) on PancakeSwap Infinity over the last 24 hours. `PriceAsymmetry: { lt: 0.1 }` drops mispriced trades, which would otherwise skew the USD sums.

```graphql
query MyQuery {
  EVM(network: base) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: {
            SmartContract: { is: "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf" }
          }
          Dex: { ProtocolName: { is: "pancakeswap_infinity" } }
          PriceAsymmetry: { lt: 0.1 }
        }
        TransactionStatus: { Success: true }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
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
        if: { Trade: { Side: { Type: { is: buy } } } }
      )
      buy_volume_in_usd: sum(
        of: Trade_Side_AmountInUSD
        if: { Trade: { Side: { Type: { is: sell } } } }
      )
    }
  }
}
```

## Get top bought tokens on PancakeSwap Infinity

Returns the [top bought tokens on PancakeSwap Infinity](https://ide.bitquery.io/top-bought-tokens-on-pancakeswap_infinity). Buys are the rows where `Side.Type`, the counter-side, is `sell`, and the `PriceAsymmetry` filter keeps mispriced trades out of the totals.

```graphql
query timeDiagram($network: evm_network) {
  EVM(network: $network) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "buy"}
      limit: {count: 100}
      where: {Trade: {Dex: {ProtocolName: {is: "pancakeswap_infinity"}}, PriceAsymmetry: {lt: 0.1}}}
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
  "network": "base"
}
```

## Get top sold tokens on PancakeSwap Infinity

Returns the [top sold tokens on PancakeSwap Infinity](https://ide.bitquery.io/top-sold-tokens-on-pancake-infinty). Sales are the rows where `Side.Type` is `buy`.

```graphql
query timeDiagram($network: evm_network) {
  EVM(network: $network) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "sell"}
      limit: {count: 100}
      where: {Trade: {Dex: {ProtocolName: {is: "pancakeswap_infinity"}}, PriceAsymmetry: {lt: 0.1}}}
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
  "network": "base"
}
```

## Get Metadata of a token

Returns a [token's metadata](https://ide.bitquery.io/get-metadata-for-base-pancakeswap-infnity-token), here cbBTC's: `Name`, `Symbol`, `SmartContract` and `Decimals`..

```graphql
query MyQuery {
  EVM(network: base, dataset: realtime) {
    DEXTradeByTokens(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        Trade: {
          Currency: {
            SmartContract: { is: "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf" }
          }
          Dex: { ProtocolName: { is: "pancakeswap_infinity" } }
        }
      }
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
