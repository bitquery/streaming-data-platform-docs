# Tron SunSwap API

<head>
  <meta name="title" content="SunSwap API - Tron Network - Token Data, Trades, Live Prices"/>
  <meta name="description" content="Access on-chain data for any SunSwap-based token with the SunSwap API, including trades, prices, and token information on the Tron network."/>
  <meta name="keywords" content="SunSwap API, SunSwap on-chain data, SunSwap token API, Tron DEX API, SunSwap trading API, blockchain data API, SunSwap documentation, crypto trading, decentralized exchange, token trading, Tron network, Tron blockchain, SunSwap token prices, web3 API"/>
  <meta name="robots" content="index, follow"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="language" content="English"/>

  <meta property="og:type" content="website" />
  <meta property="og:title" content="Access SunSwap On-Chain Data with the SunSwap API" />
  <meta property="og:description" content="Get on-chain data, including trades and token prices, for any SunSwap-based token on the Tron network using the SunSwap API." />

  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="Access SunSwap On-Chain Data with the SunSwap API"/>
  <meta property="twitter:description" content="Retrieve token data, trades, and prices for SunSwap tokens on the Tron network using the SunSwap API."/>
</head>

## Latest Trades on Sunswap

To fetch the most recent trades on SunSwap, you can filter the trades by using the SunSwap router address `TKzxdSv2FZKQrEqkKVgp5DcwEXBEKMg2Ax`. This query will return the latest 100 trades most recent first.

The query retrieves details about each trade, including the amounts and prices of tokens bought and sold, as well as information about the trading pair.
You can find the query [here](https://ide.bitquery.io/sunswap-v2-latest-Trades)

```
query MyQuery {
  Tron(dataset: realtime, network: tron) {
    DEXTrades(
      where: {Contract: {Address: {is: "TKzxdSv2FZKQrEqkKVgp5DcwEXBEKMg2Ax"}}}
      limit: {count: 100}
      orderBy: {descending: Block_Time}
    ) {
      Trade {
        Buy {
          Amount
          Currency {
            Name
            SmartContract
          }
          Buyer
          Price
        }
        Dex {
          ProtocolName
          Pair {
            SmartContract
            Name
          }
        }
        Sell {
          Amount
          Price
          Currency {
            Name
          }
        }
      }
    }
  }
}


```


## Latest Trades of a Token on Sunswap

You can run the query [here](https://ide.bitquery.io/sunswap-latest-Trades-of-token)
```
query MyQuery {
  Tron(dataset: realtime, network: tron) {
    DEXTrades(
      where: {Contract: {Address: {is: "TKzxdSv2FZKQrEqkKVgp5DcwEXBEKMg2Ax"}},
        any:[ {Trade: {Buy: {Currency: {SmartContract: {is: "TM3k1FoDYhn3Yadaeqb5aCyvWo7ZbHWjng"}}}}},{Trade: {Sell: {Currency: {SmartContract: {is: "TM3k1FoDYhn3Yadaeqb5aCyvWo7ZbHWjng"}}}}}]}
      limit: {count: 100}
      orderBy: {descending: Block_Time}
    ) {
      Trade {
        Buy {
          Amount
          Currency {
            Name
            SmartContract
          }
          Buyer
          Price
        }
        Dex {
          ProtocolName
          Pair {
            SmartContract
            Name
          }
        }
        Sell {
          Amount
          Price
          Currency {
            Name
            SmartContract
          }
        }
      }
    }
  }
}

```
