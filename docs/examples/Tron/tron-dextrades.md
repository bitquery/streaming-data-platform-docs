---
sidebar_position: 2
---

# Tron DEX Trades API

<head>
<meta name="title" content="How to Get Tron Decentralized Exchange Data with DEX Trades API"/>
<meta name="description" content="Get on-chain data of any Tron based DEX through our DEX Trades API."/>
<meta name="keywords" content="Tron DEX Trades api,Tron DEX Trades python api,Tron DEX Trades token api,Tron Dex NFT api, DEX Trades scan api, DEX Trades api, DEX Trades api docs, DEX Trades crypto api, DEX Trades blockchain api,Tron network api, Tron web3 api"/>
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

In this section we will see how to get Tron DEX trades information using our API.

This Tron API is part of our Early Access Program (EAP), which is intended for evaluation purposes. This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

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

This query provides real-time updates on price of WIN `TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7` in terms of USDT `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`, including details about the DEX, market, and order specifics. Find the query [here](https://ide.bitquery.io/Price-of-WIN-in-terms-of-USDT-on-Tron)

```
subscription {
  Tron {
    DEXTrades(
      where: {Trade: {Sell: {Currency: {SmartContract: {is: "TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7"}}}, Buy: {Currency: {SmartContract: {is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"}}}}}
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
