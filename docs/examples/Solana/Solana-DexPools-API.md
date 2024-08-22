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
