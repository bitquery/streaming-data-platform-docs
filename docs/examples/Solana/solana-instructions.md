---
sidebar_position: 3
---

<head>
<meta name="title" content="Solana Instructions API"/>
<meta name="description" content="Get data on instructions executed on the Solana blockchain including details like indices of preceding instructions signer, signature, balance updates, and program details etc."/>
<meta name="keywords" content="instructions api, instructions python api, instructions scan api, instructions api docs, DEX Trades crypto api, instructions blockchain api,solana network api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Solana Instructions API"
/>
<meta
  property="og:description"
  content="Get data on instructions executed on the Solana blockchain including details like indices of preceding instructions signer, signature, balance updates, and program details etc."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Solana Instructions API" />
<meta property="twitter:description" content="Get data on instructions executed on the Solana blockchain including details like indices of preceding instructions signer, signature, balance updates, and program details etc." />
</head>

# Solana Instructions API

This Solana API is part of our Early Access Program (EAP), which is intended for evaluation purposes.
This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

## Latest Solana Instructions

The subscription below fetches the latest instructions executed on the Solana blockchain including details like indices of preceding instructions signer, signature, balance updates, and program details

You can run the query [here](https://ide.bitquery.io/Latest-Solana-Instructions)

```
subscription {
  Solana(network: solana) {
    Instructions(limit: {count: 10}, orderBy: {descending: Block_Time}) {
      Transaction {
        Signer
        Signature
        Result {
          Success
          ErrorMessage
        }
        Index
      }
      Instruction {
        Logs
        BalanceUpdatesCount
        AncestorIndexes
        TokenBalanceUpdatesCount
        Program {
          Name
          Method
        }
      }
      Block {
        Time
        Hash
      }
    }
  }
}

```
