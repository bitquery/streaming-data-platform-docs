# Raydium CLMM API

In this section we will see how to get data on Raydium CLMM trades in real-time. According to the official docs available [here](https://docs.raydium.io/raydium/liquidity-providers/providing-concentrated-liquidity-clmm/intro-on-concentrated-liquidity), 

"Concentrated Liquidity Market Maker (CLMM) pools allow liquidity providers to select a specific price range at which liquidity is active for trades within a pool. "

This Solana API is part of our Early Access Program (EAP), which is intended for evaluation purposes.

This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

<head>
<meta name="title" content="Raydium CLMM API - Monitor Solana Liquidity Pools & Trading Activity"/>
<meta name="description" content="Access real-time data on Raydium's concentrated liquidity market maker (CLMM) on Solana. Use our API to track liquidity pools, trades, and more."/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Raydium CLMM API - Real-Time Solana Liquidity Pools & Trades"
/>
<meta
  property="og:description"
  content="Get up-to-date information on Raydium's CLMM on Solana. Use our API to monitor liquidity pools and trading activities."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Raydium CLMM API - Monitor Solana Liquidity Pools & Trading Activity" />
<meta property="twitter:description" content="Access real-time data on Raydium's CLMM on Solana. Use our API to track liquidity pools, trades, and more." />
</head>

## Subscribe to Realtime CLMM Trades

You can run the query [here](https://ide.bitquery.io/Raydium-CLMM-DEX-Trades)

```
subscription MyQuery {
  Solana {
    DEXTrades(
      where: {Instruction: {Program: {Address: {is: "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK"}}}, Transaction: {Result: {Success: true}}}
    ) {
      Instruction {
        Program {
          Method
        }
      }
      Trade {
        Buy {
          Amount
          Account {
            Address
          }
          Currency {
            Name
            Symbol
            MintAddress
            Decimals
            Fungible
            Uri
          }
        }
        Sell {
          Amount
          Account {
            Address
          }
          Currency {
            Name
            Symbol
            MintAddress
            Decimals
            Fungible
            Uri
          }
        }
      }
      Transaction {
        Signature
      }
    }
  }
}

```