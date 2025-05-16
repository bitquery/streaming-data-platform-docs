---
sidebar_position: 7
---

import VideoPlayer from "../../../src/components/videoplayer.js";

# Matic Uniswap API

This section provides you with a set of queries that provides an insight about the Uniswap DEX on MATIC.

<head>
  <meta name="title" content="Matic Uniswap API - Matic - Tokens, Trades, Live Prices"/>
  <meta name="description" content="Get on-chain data of any Uniswap based token through our Uniswap API."/>
  <meta name="keywords" content="Uniswap API,Uniswap on-chain data API,Uniswap token data API,Matic blockchain API,Uniswap DEX data API,Uniswap API documentation,Uniswap crypto API,Uniswap web3 API,DEX Trades,Matic,MATIC, Uniswap,Uniswap memecoins,Matic DEX,Uniswap DEX,token trading,blockchain data,crypto trading"/>
  <meta name="robots" content="index, follow"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="language" content="English"/>

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Matic Uniswap API - Matic - Tokens, Trades, Live Prices"
/>
<meta
  property="og:description"
  content="Get on-chain data of any Uniswap Matic token through our Uniswap API."
/>

  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="Uniswap API - Matic - Tokens, Trades, Live Prices"/>
  <meta property="twitter:description" content="Get on-chain data of any Uniswap Matic token through our Uniswap API."/>
</head>

## Get Latest Trades on Uniswap v3

Below query will subscribe you to the latest DEX Trades on MATIC Uniswap v3. Try out the API [here](https://ide.bitquery.io/uniswap-v3-trades-matic)

```graphql
query MyQuery {
  EVM(dataset: realtime, network: matic) {
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

This query will fetch you top traders of a token for the selected network. You can test the query [here](https://ide.bitquery.io/top-traders-of-a-token-on-uniswapv3-matic).

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
  "network": "matic",
  "token": "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"
}
```

## OHLC in USD of a Token

This query retrieves the Open, High, Low, and Close (OHLC) prices in USD for a specific token traded on Uniswap v3 over a defined time period and interval. You can try out the API [here](https://ide.bitquery.io/OHLCV-on-MATIC-uniswap-v3#) on Bitquery IDE.

```graphql
{
  EVM(network: bsc, dataset: realtime) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Block_testfield"}
      where: {Trade: {Currency: {SmartContract: {is: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"}}, PriceAsymmetry: {lt: 0.1}, Dex: {ProtocolName: {is: "uniswap_v3"}}, Side: {Currency: {SmartContract: {is: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359"}}, Type: {is: buy}}}}
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

This query fetches you the traded volume, buy volume and sell volume of a token `0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270`. Try out the API [here](https://ide.bitquery.io/trade_volume_matic_uniswapv3).

```graphql
query MyQuery {
  EVM(network: matic) {
    DEXTradeByTokens(
      where: {Trade: {Currency: {SmartContract: {is: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"}}}, TransactionStatus: {Success: true}, Block: {Time: {since: "2025-02-12T00:00:00Z"}}}
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

This query will fetch you the top bought tokens on uniswap v3. Try out the query [here](https://ide.bitquery.io/top-bought-tokens-on-matic-uniswap-v3_4).

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
  "network": "matic"
}
```

## Get top sold tokens on uniswap v3

This query will fetch you the top bought tokens on uniswap v3. Try out the query [here](https://ide.bitquery.io/top-sold-tokens-on-matic-uniswap-v3).

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
  "network": "matic"
}
```