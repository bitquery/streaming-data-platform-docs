---
sidebar_position: 7
title: "Base Uniswap API"
description: "Base Uniswap API: a v2, v3 and v4 trade stream plus GraphQL examples for v3 trades, top traders, hourly OHLC, volume and top tokens, each filtered to Uniswap's own contracts on Base."
---
import FAQ from "@site/src/components/FAQ";

import VideoPlayer from "../../../src/components/videoplayer.js";

# Base Uniswap API

:::tip Need real-time Base Uniswap data or anything from the last ~30 days?
For **real-time + last ~30 days**, use the [**Trading cube**](/docs/trading/trading-data-overview): [`Trading.Trades`](/docs/trading/crypto-trades-api/trades-api) gives you clean, MEV-filtered Base Uniswap swaps with **USD price, market cap, and supply on every row** across **10 chains in one API**. Use this page when you need **historical Base Uniswap data older than ~30 days**, raw per-swap detail, or call / event context.
:::

Bitquery provides Uniswap data through APIs, Streams and Data Dumps.

## Filter by factory to exclude forks

`Trade.Dex.ProtocolName` records which code a pool runs. Forks of v2 and v3 run the
same code, so their trades carry the same `uniswap_v2` and `uniswap_v3` labels. In Bitquery's trade data for Base, dozens of other factories trade under both labels.

To keep only Uniswap's own pools, filter on the contract that owns them, as every example
on this page now does.

| Version | Filter field | Address on Base |
| --- | --- | --- |
| v2 | `Trade.Dex.OwnerAddress` | `0x8909dc15e40173ff4699343b6eb8132c65e18ec6` |
| v3 | `Trade.Dex.OwnerAddress` | `0x33128a8fc17869897dce68ed026d694621f6fdfd` |
| v4 | `Trade.Dex.SmartContract` | `0x498581ff718922c3f8e6a244956af099b2652b2b` |

`OwnerAddress` is the factory that deployed the pool. A v4 pool has no factory: its
`OwnerAddress` is the zero address, and the PoolManager is its `SmartContract`. In the
Trading API the factory is `Pair.Market.Address`. Addresses are from the official
[deployments list](https://developers.uniswap.org/deployments).

The link in each example's description opens an earlier copy saved in the Bitquery IDE,
which may still filter by `ProtocolName`. Use the code on this page when you need Uniswap's
own pools only.

## Stream Base Uniswap trades

Every query on this page also works as a subscription: change `query` to `subscription` and drop the `orderBy`, since a stream already arrives in block order.

```graphql
subscription BaseUniswapTrades {
  EVM(network: base) {
    DEXTrades(
      where: {
        any: [
          { Trade: { Dex: { OwnerAddress: { in: ["0x8909dc15e40173ff4699343b6eb8132c65e18ec6", "0x33128a8fc17869897dce68ed026d694621f6fdfd"] } } } }
          { Trade: { Dex: { SmartContract: { is: "0x498581ff718922c3f8e6a244956af099b2652b2b" } } } }
        ]
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Trade {
        Dex {
          ProtocolName
          SmartContract
        }
        Buy {
          Amount
          Buyer
          Currency {
            Symbol
            SmartContract
          }
        }
        Sell {
          Amount
          Seller
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

The two conditions cover the v2, v3 and v4 pools listed above. To narrow to one version, keep only that version's address. For a single pool, use `Trade: { Dex: { SmartContract: { is: "<pool>" } } }` on v2 and v3, or `Trade: { PoolId: { is: "<pool id>" } }` on v4.
If you have any question on other data points reach out to [support](https://t.me/Bloxy_info)

Need zero-latency Base data? [Read about our Kafka Streams and Contact us for a Trial](/docs/streams/kafka-streaming-concepts/).

You may also be interested in:

- [Clanker APIs ➤](/docs/blockchain/Base/base-clanker-api/)
- [Base DEX Trade APIs ➤](/docs/blockchain/Base/base-dextrades/)

:::note
To query or stream data via graphQL **outside the Bitquery IDE**, you need to generate an API access token.

Follow the steps here to create one: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

## Get Latest Trades on Uniswap v3

The query below returns the [latest DEX trades on Uniswap v3](https://ide.bitquery.io/uniswap-v3-trades_2).

```graphql
query MyQuery {
  EVM(dataset: realtime, network: base) {
    DEXTrades(
      where: { Trade: { Dex: { OwnerAddress: { is: "0x33128a8fc17869897dce68ed026d694621f6fdfd" } } } }
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

## Get Top Traders of a token on uniswap v3

This query returns the [top traders of a token](https://ide.bitquery.io/top-traders-of-a-token-on-uniswapv3_4) on the selected network. `Side.Type` describes the counter-side of each trade, so `bought` sums the rows where the side was sold.

```graphql
query topTraders($network: evm_network, $token: String) {
  EVM(network: $network) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "volumeUsd"}
      limit: {count: 100}
      where: {Trade: {Currency: {SmartContract: {is: $token}}, Dex: {OwnerAddress: {is: "0x33128a8fc17869897dce68ed026d694621f6fdfd"}}}}
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
  "network": "base",
  "token": "0x22af33fe49fd1fa80c7149773dde5890d3c76f3b"
}
```

## OHLC in USD of a Token

This query retrieves [hourly open, high, low and close prices in USD](https://ide.bitquery.io/OHLC-on-BASE-Uniswap-v3) for one token traded on Uniswap v3.

```graphql
{
  EVM(network: base, dataset: realtime) {
    DEXTradeByTokens(
      orderBy: { descendingByField: "Block_testfield" }
      where: {
        Trade: {
          Currency: {
            SmartContract: { is: "0x22af33fe49fd1fa80c7149773dde5890d3c76f3b" }
          }
          Side: {
            Currency: {
              SmartContract: {
                is: "0x4200000000000000000000000000000000000006"
              }
            }
            Type: { is: buy }
          }
          PriceAsymmetry: { lt: 0.1 }
          Dex: { OwnerAddress: { is: "0x33128a8fc17869897dce68ed026d694621f6fdfd" } }
        }
      }
      limit: { count: 10 }
    ) {
      Block {
        testfield: Time(interval: { in: hours, count: 1 })
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

This query returns the [traded, buy and sell volume](https://ide.bitquery.io/trade_volume_base_uniswapv3) of token `0x22af33fe49fd1fa80c7149773dde5890d3c76f3b` on Uniswap v3.

```graphql
query MyQuery {
  EVM(network: base) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: {
            SmartContract: { is: "0x22af33fe49fd1fa80c7149773dde5890d3c76f3b" }
          }
          Dex: { OwnerAddress: { is: "0x33128a8fc17869897dce68ed026d694621f6fdfd" } }
        }
        TransactionStatus: { Success: true }
        Block: { Time: { since: "2025-02-12T00:00:00Z" } }
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

## Get top bought tokens on uniswap v3

This query returns the [top bought tokens on Uniswap v3](https://ide.bitquery.io/top-bought-tokens-on-uniswap-v3). Buys are the rows where `Side.Type`, the counter-side, is `sell`.

```graphql
query timeDiagram($network: evm_network) {
  EVM(network: $network) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "buy"}
      limit: {count: 100}
      where: {Trade: {Dex: {OwnerAddress: {is: "0x33128a8fc17869897dce68ed026d694621f6fdfd"}}}}
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

## Get top sold tokens on uniswap v3

This query returns the [top sold tokens on Uniswap v3](https://ide.bitquery.io/top-sold-tokens-on-uniswap-v3). Sales are the rows where `Side.Type`, the counter-side, is `buy`.

```graphql
query timeDiagram($network: evm_network) {
  EVM(network: $network) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "sell"}
      limit: {count: 100}
      where: {Trade: {Dex: {OwnerAddress: {is: "0x33128a8fc17869897dce68ed026d694621f6fdfd"}}}}
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

The query below returns a [token's metadata](https://ide.bitquery.io/get-metadata-for-base-uniswap-token): `Name`, `symbol`, `SmartContract Address` and `Decimals`.

```graphql
query MyQuery {
  EVM(network: base, dataset: realtime) {
    DEXTradeByTokens(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        Trade: {
          Currency: {
            SmartContract: { is: "0x22af33fe49fd1fa80c7149773dde5890d3c76f3b" }
          }
          Dex: { OwnerAddress: { is: "0x33128a8fc17869897dce68ed026d694621f6fdfd" } }
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

## Building with Bitquery and Uniswap API

Start with the [Base Sniper Bot guide](/docs/usecases/base-sniper-bot/) to build a working project on these APIs.

<FAQ
  items={[
    { q: "How do I query Uniswap on Base?", a: "Use EVM.DEXTrades with network base and filter Trade.Dex.OwnerAddress to the v2 factory (0x8909dc15e40173ff4699343b6eb8132c65e18ec6) or the v3 factory (0x33128a8fc17869897dce68ed026d694621f6fdfd), or Trade.Dex.SmartContract to the v4 PoolManager (0x498581ff718922c3f8e6a244956af099b2652b2b). Protocol name filters also return forks." },
    { q: "Can I get OHLC for Uniswap pairs on Base?", a: "Use DEXTradeByTokens interval aggregation or Trading.Trades for recent USD candles." },
  ]}
/>
