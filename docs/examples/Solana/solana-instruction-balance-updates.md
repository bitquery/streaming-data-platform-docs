---
sidebar_position: 3
---

# Solana Instructions Balance Updates API

This Solana API is part of our Early Access Program (EAP), which is intended for evaluation purposes.

This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

<head>
<meta name="title" content="Solana Instructions Balance Updates API | Get decoded Instructions Balance Updates data"/>
<meta name="description" content="Get real time balance & balance updates of a Solana address associated with instruction invocation using Bitquery's Solana Instruction Balance Updates API."/>
<meta name="keywords" content="Instructions Balance Updates api, Instructions Balance Updates python api, Instructions Balance Updates scan api, Instructions Balance Updates api docs, DEX Trades crypto api, Instructions Balance Updates blockchain api,solana network api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Solana Instructions Balance Updates API | Get decoded Instructions Balance Updates data"
/>
<meta
  property="og:description"
  content="Get real time balance & balance updates of a Solana address associated with instruction invocation using Bitquery's Solana Instruction Balance Updates API."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Solana Instructions Balance Updates API | Get decoded Instructions Balance Updates data" />
<meta property="twitter:description" content="Get real time balance & balance updates of a Solana address associated with instruction invocation using Bitquery's Solana Instruction Balance Updates API." />
</head>

## Latest Solana Instructions Balance Updates

The query below gives you balance update associated with a instruction invocation.

You can run the query [here](https://ide.bitquery.io/balance-updates)

```
query {
  Solana(dataset: realtime) {
    InstructionBalanceUpdates(limit: {count: 10}) {
      BalanceUpdate {
        Amount
        Currency {
          MintAddress
          Name
        }
        PreBalance
        PostBalance
      }
    }
  }
}
```
