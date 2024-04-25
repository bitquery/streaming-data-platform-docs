---
sidebar_position: 2
---

# Base Chain DEX Trades API

<head>
<meta name="title" content="How to Get Base Decentralized Exchange Data with Base DEX Trades API"/>
<meta name="description" content="Get on-chain data of any Base based DEX through our DEX Trades API."/>
<meta name="keywords" content="Base DEX Trades api,Base DEX Trades python api,Base DEX Trades token api,Base Dex NFT api, DEX Trades scan api, DEX Trades api, DEX Trades api docs, DEX Trades crypto api, DEX Trades blockchain api,Base network api, Base web3 api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="How to Get Base Decentralized Exchange Data with Base DEX Trades API"
/>
<meta
  property="og:description"
  content="Get on-chain data of any Base based DEX through our DEX Trades API."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="How to Get Base Decentralized Exchange Data with Base DEX Trades API" />
<meta property="twitter:description" content="Get on-chain data of any Base based DEX through our DEX Trades API." />
</head>

In this section we will see how to get Base DEX trades information using our API.

This Base API is part of our Early Access Program (EAP), which is intended for evaluation purposes. This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

## Subscribe to Latest Base Trades

This subscription will return information about the most recent trades executed on Base's DEX platforms.
You can find the query [here](https://ide.bitquery.io/Realtime-base-dex-trades-websocket)

```
subscription {
  EVM(network: base) {
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

This query provides real-time updates on price of USDC `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` in terms of DAI `0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb`, including details about the DEX, market, and order specifics. Find the query [here](https://ide.bitquery.io/Price-of-USDC-in-terms-of-DAI-on-Base-network#)

```
subscription {
  EVM(network: base) {
    DEXTrades(
      where: {Trade: {Sell: {Currency: {SmartContract: {is: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"}}}, Buy: {Currency: {SmartContract: {is: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb"}}}}}
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

The below query retrieves the USD price of a token on Base chain by setting `SmartContract: {is: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb"}` . Check the field `PriceInUSD` for the USD value. You can access the query [here](https://ide.bitquery.io/Get-latest-price-of-DAI-in-USD-on-Base#).

```
subscription {
  EVM(network: base) {
    DEXTradeByTokens(
      where: {Trade: {Currency: {SmartContract: {is: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb"}}}}
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
