---
sidebar_position: 2
---

# Solana DEX Pools API

In this section we will see how to get Solana DEX Pools information using our API.

This Solana API is part of our Early Access Program (EAP), which is intended for evaluation purposes. This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

<head>
<meta name="title" content="Solana DEX Pools API | Get Liquidity Data of the Pools"/>
<meta name="description" content="Get on-chain data of liquidity pools and trading pairs from any Solana based DEX like Raydium, Jupiter, Phoenix etc through our DEX Pools API."/>
<meta name="keywords" content="Solana DEX Pools api,Solana DEX Pools python api,Solana DEX Pools token api,Solana Dex NFT api, DEX Trades scan api, DEX Pools api, DEX Pools api docs, DEX Pools crypto api, DEX Pools blockchain api,solana network api, solana web3 api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Solana DEX Pools API | Get Liquidity Data of the Pools"
/>
<meta
  property="og:description"
  content="Get on-chain data of liquidity pools and trading pairs from any Solana based DEX like Raydium, Jupiter, Phoenix etc through our DEX Pools API."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Solana DEX Pools API | Get Liquidity Data of the Pools" />
<meta property="twitter:description" content="Get on-chain data of liquidity pools and trading pairs from any Solana based DEX like Raydium, Jupiter, Phoenix etc through our DEX Pools API." />
</head>

## Get Latest Liquidity of any Liquidity Pool

This query gets you the liquidity/balance of the Quote Currency `WSOL` and Base Currency `SOLANADOG` for this particular pool address `BDQnwNhTWc3wK4hhsnsEaBBMj3sD4idGzvuidVqUw1vL`. THe liquidity value of the currencies will be in `Quote{PostAmount}` and `Base{PostAmount}`.
You can find the query [here](https://ide.bitquery.io/Get-LP-Latest-liqudity_2)

```
query GetLatestLiquidityForPool {
  Solana {
    DexPools(
      where: {Pool: {Market: {MarketAddress: {is: "BDQnwNhTWc3wK4hhsnsEaBBMj3sD4idGzvuidVqUw1vL"}}}}
      orderBy: {descending: Block_Slot}
      limit:{count:1}
    ) {
      Pool {
        Market {
          MarketAddress
          BaseCurrency {
            MintAddress
            Symbol
            Name
          }
          QuoteCurrency {
            MintAddress
            Symbol
            Name
          }
        }
        Dex {
          ProtocolFamily
          ProtocolName
        }
        Quote {
          PostAmount
          PriceInUSD
          PostAmountInUSD
        }
        Base {
          PostAmount
        }
      }
    }
  }
}

```
## Subscribe to Latest Pumpfun Pools

In this query, you can subscribe to the latest liquidity data for pools related to the "Pump" protocol on Solana. This subscription provides real-time updates about the liquidity in pools under this protocol, including details about the base and quote currencies.

```
subscription {
  Solana {
    DexPools(
      where: {Pool: {Dex: {ProtocolName: {is: "pump"}}}}
    ) {
      Pool {
        Market {
          MarketAddress
          BaseCurrency {
            MintAddress
            Symbol
            Name
          }
          QuoteCurrency {
            MintAddress
            Symbol
            Name
          }
        }
        Dex {
          ProtocolFamily
          ProtocolName
        }
        Quote {
          PostAmount
          PriceInUSD
          PostAmountInUSD
        }
        Base {
          PostAmount
        }
      }
    }
  }
}

```
## Get Top Pools Based on Liquidity

This query retrieves the top liquidity pools on the Solana blockchain, sorted by their total liquidity (PostAmount). The query is filtered for pools that have been active since a specific time period. The results are limited to the top 10 pools based on their liquidity.


```
query GetTopPoolsByDex {
  Solana {
    DexPools(
      orderBy: {descending: Pool_Quote_PostAmount}
      where: {Block: {Time: {after: "2024-08-25T10:00:00Z"}}}
      limit: {count: 10}
    ) {
      Pool {
        Market {
          MarketAddress
          BaseCurrency {
            MintAddress
            Symbol
            Name
          }
          QuoteCurrency {
            MintAddress
            Symbol
            Name
          }
        }
        Dex {
          ProtocolName
          ProtocolFamily
        }
        Quote {
          PostAmount
          PostAmountInUSD
          PriceInUSD
        }
        Base {
          PostAmount
        }
      }
    }
  }
}


```

## Subscribe to Liquidity Removal from a Pool for a Token

This query allows you to subscribe to updates on liquidity removal from a specific pool on the Solana network. The subscription is filtered by a particular token, identified by the base currency name or smart contract. It returns information on the amount of liquidity removed and the remaining balance.


```
{
  Solana(network: solana) {
    DexPools(
      where: {Pool: {Base: {ChangeAmount: {lt: "0"}}, Market: {BaseCurrency: {Name: {is: "reddit dog"}}}}}
    ) {
      Pool {
        Market {
          MarketAddress
          BaseCurrency {
            MintAddress
            Symbol
            Name
          }
          QuoteCurrency {
            MintAddress
            Symbol
            Name
          }
        }
        Dex {
          ProtocolFamily
          ProtocolName
        }
        Quote {
          PostAmount
          PriceInUSD
          PostAmountInUSD
          ChangeAmount
        }
        Base {
          PostAmount
          ChangeAmount
        }
      }
    }
  }
}

```

Sample response:

```
"DexPools": [
      {
        "Pool": {
          "Base": {
            "ChangeAmount": "-376244.182137",
            "PostAmount": "3772354.489708"
          },
          "Dex": {
            "ProtocolFamily": "Meteora",
            "ProtocolName": "lb_clmm"
          },
          "Market": {
            "BaseCurrency": {
              "MintAddress": "7M9KJcPNC65ShLDmJmTNhVFcuY95Y1VMeYngKgt67D1t",
              "Name": "reddit dog",
              "Symbol": "r/snoofi"
            },
            "MarketAddress": "3D46aZhV4AKpK22V7yvxSMdFWSUpAHKsSqJMYPPzxukJ",
            "QuoteCurrency": {
              "MintAddress": "So11111111111111111111111111111111111111112",
              "Name": "Wrapped Solana",
              "Symbol": "WSOL"
            }
          },
          "Quote": {
            "ChangeAmount": "23.000000000",
            "PostAmount": "653.473238088",
            "PostAmountInUSD": "104870.58897286942",
            "PriceInUSD": 0.02779977047729333
          }
        }
      },
```