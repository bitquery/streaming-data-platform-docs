---
sidebar_position: 2
---

# Optimism DEX Trades API


If you were using Optimism RPC till now to get data, forget about it.

Our Optimism real time streams are perfect alternative for Optimism web3 subscribe.

In this section we will see how to get Optimism DEX trades information using our GraphQL APIs.

This Optimism API is part of our Early Access Program (EAP), which is intended for evaluation purposes. This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

<head>
<meta name="title" content="How to Get Optimism Decentralized Exchange Data with Optimism DEX Trades API"/>
<meta name="description" content="Get on-chain data of any Optimism based DEX through our DEX Trades API."/>
<meta name="keywords" content="Optimism DEX Trades api,Optimism DEX Trades python api,Optimism DEX Trades token api,Optimism Dex NFT api, DEX Trades scan api, DEX Trades api, DEX Trades api docs, DEX Trades crypto api, DEX Trades blockchain api,Optimism network api, Optimism web3 api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="How to Get Optimism Decentralized Exchange Data with Optimism DEX Trades API"
/>
<meta
  property="og:description"
  content="Get on-chain data of any Optimism based DEX through our DEX Trades API."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="How to Get Optimism Decentralized Exchange Data with Optimism DEX Trades API" />
<meta property="twitter:description" content="Get on-chain data of any Optimism based DEX through our DEX Trades API." />
</head>



## Subscribe to Latest Optimism Trades

This subscription will return information about the most recent trades executed on Optimism's DEX platforms.
You can find the query [here](https://ide.bitquery.io/Realtime-optimism-dex-trades-websocket)

```
subscription {
  EVM(network: optimism) {
    DEXTrades {
      Block {
        Time
      }
      Trade {
        Dex {
          ProtocolName
          ProtocolFamily
          SmartContract
        }
        Buy {
          Amount
          Buyer
          Seller
          Currency {
            Decimals
            Fungible
            HasURI
            Name
            ProtocolName
            SmartContract
            Symbol
          }
          OrderId
        }
        Sell {
          Buyer
          Seller
          Currency {
            Decimals
            Fungible
            HasURI
            Name
            ProtocolName
            SmartContract
            Symbol
          }
        }
      }
    }
  }
}


```

## Subscribe to Latest Price of a Token in Real-time

This query provides real-time updates on price of WETH `0x4200000000000000000000000000000000000006` in terms of USDC `0x7f5c764cbc14f9669b88837ca1490cca17c31607`, including details about the DEX, market, and order specifics. Find the query [here](https://ide.bitquery.io/Price-of-WETH-in-terms-of-USDC-on-Optimism#)

```
subscription {
  EVM(network: optimism) {
    DEXTrades(
      where: {Trade: {Sell: {Currency: {SmartContract: {is: "0x4200000000000000000000000000000000000006"}}}, Buy: {Currency: {SmartContract: {is: "0x7f5c764cbc14f9669b88837ca1490cca17c31607"}}}}}
    ) {
      Block {
        Time
      }
      Trade {
        Buy {
          Amount
          Buyer
          Seller
          Price_in_terms_of_sell_currency: Price
          Currency {
            Name
            Symbol
            SmartContract
          }
        }
        Sell {
          Amount
          Buyer
          Seller
          Price_in_terms_of_buy_currency: Price
          Currency {
            Symbol
            SmartContract
            Name
          }
        }
      }
    }
  }
}

```

## Latest USD Price of a Token

The below query retrieves the USD price of a token on Optimism by setting `SmartContract: {is: "0x68f180fcCe6836688e9084f035309E29Bf0A2095"}` . Check the field `PriceInUSD` for the USD value. You can access the query [here](https://ide.bitquery.io/Get-latest-price-of-WBTC-in-USD-on-optimism#).

```
subscription {
  EVM(network: optimism) {
    DEXTradeByTokens(
      where: {Trade: {Currency: {SmartContract: {is: "0x68f180fcCe6836688e9084f035309E29Bf0A2095"}}}}
    ) {
      Transaction {
        Hash
      }
      Trade {
        Buyer
        AmountInUSD
        Amount
        Price
        PriceInUSD
        Seller
        Currency {
          Name
          Symbol
          SmartContract
        }
        Dex {
          ProtocolFamily
          SmartContract
          ProtocolName
        }
        Side {
          Amount
          AmountInUSD
          Buyer
          Seller
          Currency {
            Name
            SmartContract
            Symbol
          }
        }
      }
    }
  }
}



```
