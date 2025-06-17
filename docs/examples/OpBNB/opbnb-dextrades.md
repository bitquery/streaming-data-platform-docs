---
sidebar_position: 2
---

# OpBNB DEX Trades API

In this section we will see how to get OpBNB DEX trades information using our API.

<head>
<meta name="title" content="How to Get OpBNB Decentralized Exchange Data with DEX Trades API"/>
<meta name="description" content="Get on-chain data of any OpBNB based DEX through our DEX Trades API."/>
<meta name="keywords" content="OpBNB DEX Trades api,OpBNB DEX Trades python api,OpBNB DEX Trades token api,OpBNB Dex NFT api, DEX Trades scan api, DEX Trades api, DEX Trades api docs, DEX Trades crypto api, DEX Trades blockchain api,OpBNB network api, OpBNB web3 api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="How to Get OpBNB Decentralized Exchange Data with DEX Trades API"
/>
<meta
  property="og:description"
  content="Get on-chain data of any OpBNB based DEX through our DEX Trades API."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="How to Get OpBNB Decentralized Exchange Data with DEX Trades API" />
<meta property="twitter:description" content="Get on-chain data of any OpBNB based DEX through our DEX Trades API." />
</head>

## Subscribe to Latest OpBNB Trades

This subscription will return information about the most recent trades executed on OpBNB's DEX platforms.
You can find the query [here](https://ide.bitquery.io/Realtime-opbnb-dex-trades-websocket)

```
subscription {
  EVM(network: opbnb) {
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

## Get Latest Price of a Token in Real-time

This query provides real-time updates on price of WBNB `0x4200000000000000000000000000000000000006` in terms of USDT `0x9e5AAC1Ba1a2e6aEd6b32689DFcF62A509Ca96f3`, including details about the DEX, market, and order specifics. Find the query [here](https://ide.bitquery.io/Price-of-WBNB-in-terms-of-USDT-on-opBNB)

```
subscription {
  EVM(network: opbnb) {
    DEXTrades(
      where: {Trade: {Sell: {Currency: {SmartContract: {is: "0x4200000000000000000000000000000000000006"}}}, Buy: {Currency: {SmartContract: {is: "0x9e5AAC1Ba1a2e6aEd6b32689DFcF62A509Ca96f3"}}}}}
    ) {
      Block {
        Time
      }
      Trade {
        Buy {
          Amount
          Buyer
          Seller
          Price_in_terms_of_buy_currency: Price
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

The below query retrieves the USD price of a token on OpBNB by setting `SmartContract: {is: "0x9e5AAC1Ba1a2e6aEd6b32689DFcF62A509Ca96f3"}` . Check the field `PriceInUSD` for the USD value. You can access the query [here](https://ide.bitquery.io/Latest-price-of-a-USDT-in-USD-on-opBNB#).

```
subscription {
  EVM(network: opbnb) {
    DEXTradeByTokens(
      where: {Trade: {Currency: {SmartContract: {is: "0x9e5AAC1Ba1a2e6aEd6b32689DFcF62A509Ca96f3"}}}}
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
