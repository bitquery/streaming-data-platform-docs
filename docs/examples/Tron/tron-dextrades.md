---
sidebar_position: 2
---

# Tron DEX Trades API

In this section we will see how to get Tron DEX trades information using our API.

This Tron API is part of our Early Access Program (EAP), which is intended for evaluation purposes.
This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

<head>
<meta name="title" content="How to Get Tron Decentralized Exchange Data with DEX Trades API"/>
<meta name="description" content="Get on-chain data of any Tron based DEX through our DEX Trades API."/>
<meta name="keywords" content="Tron DEX Trades api,Tron DEX Trades python api,Tron DEX Trades token api,Tron Dex NFT api, DEX Trades scan api, DEX Trades api, DEX Trades api docs, DEX Trades crypto api, DEX Trades blockchain api,Tron network api, Tron web3 api, tronscan api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="How to Get Tron Decentralized Exchange Data with DEX Trades API"
/>
<meta
  property="og:description"
  content="Get on-chain data of any Tron based DEX through our DEX Trades API."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="How to Get Tron Decentralized Exchange Data with DEX Trades API" />
<meta property="twitter:description" content="Get on-chain data of any Tron based DEX through our DEX Trades API." />
</head>

## Subscribe to Latest Tron Trades

This subscription will return information about the most recent trades executed on Tron's DEX platforms.
You can find the query [here](https://ide.bitquery.io/Latest-trades-on-Tron)

```
subscription {
  Tron {
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
            Fungible
            Decimals
            Name
            Native
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

This query provides real-time updates on price of token `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t` in terms of USDT `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`, including details about the DEX. Find the query [here](https://ide.bitquery.io/Track-price-of-a-tron-token-in-realtime)

```
subscription MyQuery {
  Tron {
    DEXTradeByTokens(
      where: {Trade: {Currency: {SmartContract: {is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"}}}, TransactionStatus: {Success: true}}
    ) {
      Block {
        Time
      }
      Trade {
        Amount
        AmountInUSD
        Buyer
        Price
        PriceInUSD
        Seller
        Currency {
          Symbol
          SmartContract
          Name
        }
        Dex {
          SmartContract
          ProtocolName
          ProtocolFamily
        }
        Side {
          Amount
          AmountInUSD
          Buyer
          Seller
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
