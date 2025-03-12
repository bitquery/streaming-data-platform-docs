---
sidebar_position: 7
---

import VideoPlayer from "../../../src/components/videoplayer.js";

# Base Uniswap API

This section provides you with a set of queries that provides an insight about the Uniswap DEX on Base.

## Subscribe to Latest Trades on Uniswap v3

Below query will subscribe you to the latest DEX Trades on Uniswap v3. Try out the API [here](https://ide.bitquery.io/uniswap-v3-trades_2)

```graphql
squery MyQuery {
  EVM(dataset: realtime, network: base) {
    DEXTrades(
      where: {Trade: {Dex: {ProtocolName: {is: "uniswap_v3"}}}}
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

This query will fetch you top traders of a token for the selected network. You can test the query [here](https://ide.bitquery.io/top-traders-of-a-token-on-uniswap_v3).

```
query topTraders($network: evm_network, $token: String) {
  EVM(network: $network) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "volumeUsd"}
      limit: {count: 100}
      where: {Trade: {Currency: {SmartContract: {is: $token}}, Dex: {ProtocolName: {is: "uniswap_v3"}}}}
    ) {
      Trade {
        Dex {
          OwnerAddress
          ProtocolFamily
          ProtocolName
        }
      }
      bought: sum(of: Trade_Amount, if: {Trade: {Side: {Type: {is: buy}}}})
      sold: sum(of: Trade_Amount, if: {Trade: {Side: {Type: {is: sell}}}})
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

This query retrieves the Open, High, Low, and Close (OHLC) prices in USD for a specific token traded on Uniswap v3 over a defined time period and interval. You can try out the API [here](https://ide.bitquery.io/OHLC-on-BASE-Uniswap-v3) on Bitquery Playground.

```
{
  EVM(network: base, dataset: realtime) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Block_testfield"}
      where: {Trade: {Currency: {SmartContract: {is: "0x22af33fe49fd1fa80c7149773dde5890d3c76f3b"}}, Side: {Currency: {SmartContract: {is: "0x4200000000000000000000000000000000000006"}}, Type: {is: buy}}, PriceAsymmetry: {lt: 0.1}, Dex: {ProtocolName: {is: "uniswap_v3"}}}}
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

This query fetches you the traded volume, buy volume and sell volume of a token `0x22af33fe49fd1fa80c7149773dde5890d3c76f3b`. Try out the API [here](https://ide.bitquery.io/trade_volume_base_uniswapv3).

```
query MyQuery {
  EVM(network: base) {
    DEXTradeByTokens(
      where: {Trade: {Currency: {SmartContract: {is: "0x22af33fe49fd1fa80c7149773dde5890d3c76f3b"}}}, TransactionStatus: {Success: true}, Block: {Time: {since: "2025-02-12T00:00:00Z"}}}
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

This query will fetch you the top bought tokens on uniswap v3. Try out the query [here](https://ide.bitquery.io/top-bought-tokens-on-uniswap-v3).

```
query timeDiagram($network: evm_network) {
  EVM(network: $network) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "buy"}
      limit: {count: 100}
      where: {Trade: {Dex: {ProtocolName: {is: "uniswap_v3"}}}}
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
      buy: sum(of: Trade_Side_AmountInUSD, if: {Trade: {Side: {Type: {is: buy}}}})
      sell: sum(of: Trade_Side_AmountInUSD, if: {Trade: {Side: {Type: {is: sell}}}})
    }
  }
}
```

## Get top sold tokens on uniswap v3

This query will fetch you the top bought tokens on uniswap v3. Try out the query [here](https://ide.bitquery.io/top-sold-tokens-on-uniswap-v3).

```
query timeDiagram($network: evm_network) {
  EVM(network: $network) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "sell"}
      limit: {count: 100}
      where: {Trade: {Dex: {ProtocolName: {is: "uniswap_v3"}}}}
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
      buy: sum(of: Trade_Side_AmountInUSD, if: {Trade: {Side: {Type: {is: buy}}}})
      sell: sum(of: Trade_Side_AmountInUSD, if: {Trade: {Side: {Type: {is: sell}}}})
    }
  }
}
{
  "network": "base"
}
```

## Get Metadata of a token

Use the below query to get Token's metadata like `Name`, `symbol`, `SmartContract Address`, `Decimals`. Try out the API [here](https://ide.bitquery.io/get-metadata) in the Bitquery Playground.

```
query MyQuery {
  EVM(network: base, dataset: combined) {
    DEXTradeByTokens(
      limit: {count: 1}
      orderBy: {descending: Block_Time}
      where: {Trade: {Currency: {SmartContract: {is: "0x22af33fe49fd1fa80c7149773dde5890d3c76f3b"}}, Dex: {ProtocolName: {is: "uniswap_v3"}}}}
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
