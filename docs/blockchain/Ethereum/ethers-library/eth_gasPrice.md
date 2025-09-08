# eth_gasPrice

In this section, we will build a data stream that returns the gas fee of the latest transaction in WEI. Unlike any JSON RPC method like eht_gasPrice that returns the hexadecimal equivalent of an integer representing the current gas price in WEI, this returns the integer value itself.

<head>
  <meta name="title" content="eth_gasPrice API - Ethereum - Current Gas Price Data"/>
  <meta name="description" content="Get the current gas price on the Ethereum network using the eth_gasPrice API."/>
  <meta name="keywords" content="eth_gasPrice API,Ethereum gas price API,Ethereum gas fee API,eth_gasPrice documentation,current gas price,transaction cost,blockchain API,Ethereum web3 API,gas price data"/>
  <meta name="robots" content="index, follow"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="language" content="English"/>

  <meta property="og:type" content="website" />
  <meta
    property="og:title"
    content="How to Retrieve Current Ethereum Gas Prices with eth_gasPrice API"
  />
  <meta
    property="og:description"
    content="Get the current gas price on the Ethereum network using the eth_gasPrice API."
  />

  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="How to Retrieve Current Ethereum Gas Prices with eth_gasPrice API"/>
  <meta property="twitter:description" content="Get the current gas price on the Ethereum network using the eth_gasPrice API."/>
</head>

[This](https://ide.bitquery.io/eth_gasPrice_1) is the stream that returns the current gas price in `WEI`.

``` graphql

subscription {
  EVM {
    Transactions {
      Transaction {
        Gas
      }
      ChainId
    }
  }
}

```

The above stream returns the following response.

``` json

{
    "EVM": {
        "Transactions": [
        {
            "ChainId": "1",
            "Transaction": {
                "Gas": "100000"
            }
        },
        ]
    }
}

```