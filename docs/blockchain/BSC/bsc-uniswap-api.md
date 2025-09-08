---
sidebar_position: 7
---

import VideoPlayer from "../../../src/components/videoplayer.js";

# BSC Uniswap API

This section provides you with a set of queries that provides an insight about the Uniswap DEX on BSC.

<head>
  <meta name="title" content="BSC Uniswap API - BSC - Tokens, Trades, Live Prices"/>
  <meta name="description" content="Get on-chain data of any Uniswap based token through our Uniswap API."/>
  <meta name="keywords" content="Uniswap API,Uniswap on-chain data API,Uniswap token data API,BSC blockchain API,Uniswap DEX data API,Uniswap API documentation,Uniswap crypto API,Uniswap web3 API,DEX Trades,BSC,BNB, Uniswap,Uniswap memecoins,BSC DEX,Uniswap DEX,token trading,blockchain data,crypto trading"/>
  <meta name="robots" content="index, follow"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="language" content="English"/>

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="BSC Uniswap API - BSC - Tokens, Trades, Live Prices"
/>
<meta
  property="og:description"
  content="Get on-chain data of any Uniswap BSCd token through our Uniswap API."
/>

  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="Uniswap API - BSC - Tokens, Trades, Live Prices"/>
  <meta property="twitter:description" content="Get on-chain data of any Uniswap BSCd token through our Uniswap API."/>
</head>

## Get Latest Trades on Uniswap v3

Below query will subscribe you to the latest DEX Trades on BSC Uniswap v3. Try out the API [here](https://ide.bitquery.io/uniswap-v3-trades-bsc)

```graphql
query MyQuery {
  EVM(dataset: realtime, network: bsc) {
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

This query will fetch you top traders of a token for the selected network. You can test the query [here](https://ide.bitquery.io/top-traders-of-a-token-on-uniswapv3-bsc).

```graphql
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
        Buyer
      }
      bought: sum(of: Trade_Amount, if: {Trade: {Side: {Type: {is: buy}}}})
      sold: sum(of: Trade_Amount, if: {Trade: {Side: {Type: {is: sell}}}})
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

This query retrieves the Open, High, Low, and Close (OHLC) prices in USD for a specific token traded on Uniswap v3 over a defined time period and interval. You can try out the API [here](https://ide.bitquery.io/OHLC-on-BSC-Uniswap-v3) on Bitquery Playground.

```graphql
{
  EVM(network: bsc, dataset: realtime) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Block_testfield"}
      where: {Trade: {Currency: {SmartContract: {is: "0x55d398326f99059ff775485246999027b3197955"}}, PriceAsymmetry: {lt: 0.1}, Dex: {ProtocolName: {is: "uniswap_v3"}}, Side: {Currency: {SmartContract: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}}, Type: {is: buy}}}}
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

This query fetches you the traded volume, buy volume and sell volume of a token `0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c`. Try out the API [here](https://ide.bitquery.io/trade_volume_bsc_uniswapv3).

```graphql
query MyQuery {
  EVM(network: bsc) {
    DEXTradeByTokens(
      where: {Trade: {Currency: {SmartContract: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}}}, TransactionStatus: {Success: true}, Block: {Time: {since: "2025-02-12T00:00:00Z"}}}
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

This query will fetch you the top bought tokens on uniswap v3. Try out the query [here](https://ide.bitquery.io/top-bought-tokens-on-bsc-uniswap-v3).

```graphql
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
{
  "network": "bsc"
}
```

## Get top sold tokens on uniswap v3

This query will fetch you the top bought tokens on uniswap v3. Try out the query [here](https://ide.bitquery.io/top-sold-tokens-on-bsc-uniswap-v3).

```graphql
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
  "network": "bsc"
}
```

## Get Metadata of a token

Use the below query to get Token's metadata like `Name`, `symbol`, `SmartContract Address`, `Decimals`. Try out the API [here](https://ide.bitquery.io/get-metadata_1) in the Bitquery Playground.

```graphql
query MyQuery {
  EVM(network: bsc, dataset: realtime) {
    DEXTradeByTokens(
      limit: {count: 1}
      orderBy: {descending: Block_Time}
      where: {Trade: {Currency: {SmartContract: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}}, Dex: {ProtocolName: {is: "uniswap_v3"}}}}
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
