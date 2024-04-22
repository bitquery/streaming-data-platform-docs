---
sidebar_position: 2
---

<head>
<meta name="title" content="How to Get Polygon (MATIC) Decentralized Exchange Data with DEX Trades API"/>
<meta name="description" content="Get on-chain data of any Polygon (MATIC) based DEX through our DEX Trades API."/>
<meta name="keywords" content="Polygon (MATIC) DEX Trades api,Polygon (MATIC) DEX Trades python api,Polygon (MATIC) DEX Trades token api,Polygon (MATIC) Dex NFT api, DEX Trades scan api, DEX Trades api, DEX Trades api docs, DEX Trades crypto api, DEX Trades blockchain api,Polygon (MATIC) network api, Polygon (MATIC) web3 api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="How to Get Polygon (MATIC) Decentralized Exchange Data with DEX Trades API"
/>
<meta
  property="og:description"
  content="Get on-chain data of any Polygon (MATIC) based DEX through our DEX Trades API."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="How to Get Polygon (MATIC) Decentralized Exchange Data with DEX Trades API" />
<meta property="twitter:description" content="Get on-chain data of any Polygon (MATIC) based DEX through our DEX Trades API." />
</head>

# Polygon (MATIC) DEX Trades API

In this section we will see how to get Matic DEX trades information using our API.

This Matic API is part of our Early Access Program (EAP), which is intended for evaluation purposes. This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

## Subscribe to Latest Matic Trades

This subscription will return information about the most recent trades executed on Matic's DEX platforms.
You can find the query [here](https://ide.bitquery.io/Latest-trades-on-matic_4)

```
subscription {
  EVM(network: matic) {
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
        }
      }
    }
  }
}



```

## Subscribe to Latest Price of a Token in Real-time

This query provides real-time updates on price of AVAX `0x2C89bbc92BD86F8075d1DEcc58C7F4E0107f286b` in terms of WMATIC `0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270`, including details about the DEX, market, and order specifics. Find the query [here](https://ide.bitquery.io/Price-of-a-AVAX-in-terms-of-WMATIC-on-matic_2)

```
subscription {
  EVM(network: matic) {
    DEXTrades(
      where: {Trade: {Sell: {Currency: {SmartContract: {is: "0x2C89bbc92BD86F8075d1DEcc58C7F4E0107f286b"}}}, Buy: {Currency: {SmartContract: {is: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"}}}}}
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
          OrderId
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
          OrderId
        }
        Dex {
          ProtocolFamily
          ProtocolName
          SmartContract
          ProtocolVersion
        }
      }
    }
  }
}


```
