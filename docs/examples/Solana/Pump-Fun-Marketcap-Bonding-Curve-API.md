# Pump Fun Marketcap & Bonding Curve API

In this document, we will explore examples to get marketcap, bonding curve progress and whether the token migrated to Raydium or not yet. We have the fully exhaustive Pump Fun API documentation [here](https://docs.bitquery.io/docs/examples/Solana/Pump-Fun-API/). Additionally, we have the Moonshot API available, and you can access its documentation [here](https://docs.bitquery.io/docs/examples/Solana/Moonshot-API/).

<head>
  <meta name="title" content="Pump Fun API - Solana - Tokens, Trades, Live Prices"/>
  <meta name="description" content="Get Bonding Curve Data of any Pump.fun based token through our Pump.fun API."/>
  <meta name="keywords" content="Pump.fun API,Pump.fun on-chain data API,Pump.fun token data API,Pump.fun blockchain API,Pump.fun DEX data API,Pump.fun API documentation,Pump.fun crypto API,Pump.fun web3 API,DEX Trades,Solana,Blast,Pump.fun memecoins,Solana DEX,Blast DEX,token trading,blockchain data,crypto trading"/>
  <meta name="robots" content="index, follow"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="language" content="English"/>

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="How to Get Pump.fun Bonding Curve Data with Pump.fun API"
/>
<meta
  property="og:description"
  content="Get on-chain data of any Pump.fun based token through our Pump.fun API."
/>

  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="How to Get Pump.fun Bonding Curve Data with Pump.fun API"/>
  <meta property="twitter:description" content="Get on-chain data of any Pump.fun based token through our Pump.fun API."/>
</head>

## Get Latest Marketcap of a PumpFun Token

You can get the marketcap of a pump fun token by this formulae `marketcap = 1000000000 * Latest USD Price` because all the pump fun tokens have 1 Billion supply.

You can get the latest USD price of the desired token (here I have used this token `9qzvgUMrrL5Xyadk2gyWxCWgTds8crkwGwgfjeN5JYLS`) from the below query and multiply it with 1 Billion and you will get the latest marketcap of the specified token. You can test the query [here]().

```graphql
query MyQuery {
  Solana {
    DEXTradeByTokens(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        Trade: {
          Currency: {
            MintAddress: { is: "9qzvgUMrrL5Xyadk2gyWxCWgTds8crkwGwgfjeN5JYLS" }
          }
          Dex: {
            ProgramAddress: {
              is: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
            }
          }
        }
        Transaction: { Result: { Success: true } }
      }
    ) {
      Trade {
        Currency {
          Name
          MintAddress
          Symbol
        }
        Amount
        AmountInUSD
        Price
        PriceInUSD
      }
    }
  }
}
```

## Check if the Pump Fun Token has migrated to Raydium

You can be sure that a pump Fun Token has migrated to Raydium if it is being traded on Raydium DEX also. So this below query will check on which DEXes a particular token is getting traded. And if you only see `PumpFun` as the DEX Protocol Family that means it hasn't completed its bonding curve yet.
You can find the saved query [here](https://ide.bitquery.io/PumpFUn-Token-migrated-to-Raydum-or-not).

```graphql
query MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {
        Transaction: { Result: { Success: true } }
        Trade: {
          Currency: {
            MintAddress: { is: "74cWLXXDfQmwxBNPbgYu5mZ6javKDAdptgtYF5Rn41rY" }
          }
        }
      }
    ) {
      Trade {
        Dex {
          ProtocolName
          ProtocolFamily
          ProgramAddress
        }
      }
      count
    }
  }
}
```

## Bonding Curve Progress API

You can get the Bonding Curve Progress by this formulae, `BondingCurveProgress = 100 - ((leftTokens*100)/(initialRealTokenReserves))` where `initialRealTokenReserves = totalSupply - reservedTokens`, totalSupply is `1000000000` of a pump fun token and reservedTokens is `206900000`. So initialRealTokenReserves is `793100000`. We also need leftTokens to calculate bonding curve progress, it can be calculated like this `leftTokens = realTokenReserves - reservedTokens`. Here `realTokenReserves` is balance of the Token at the market address.

TLDR (or not able to understand) then just apply this formulae `bondingCurveProgress= 100 - (((balance - 206900000)*100)/793100000)`. You can get the balance using this below query. You can run and test the saved query [here](https://ide.bitquery.io/Get-balance-of-a-pair-address).

```graphql
query GetLatestLiquidityForPool {
  Solana {
    DexPools(
      where: {
        Pool: {
          Market: {
            BaseCurrency: {
              MintAddress: {
                is: "Eh81Ci2S8ty5M4z9Z3pqHmJmkorvf9XJiJLGksF6pump"
              }
            }
          }
          Dex: {
            ProgramAddress: {
              is: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
            }
          }
        }
      }
      orderBy: { descending: Block_Slot }
      limit: { count: 1 }
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
