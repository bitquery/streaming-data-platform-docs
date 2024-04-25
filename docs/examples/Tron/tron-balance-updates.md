---
sidebar_position: 1
---

# Tron Balance Updates API

<head>
<meta name="title" content="How to get Tron Balance Updates of an address"/>
<meta name="description" content="Learn how to get real time balance & balance updates of a Tron address using Bitquery's Tron Balance Updates API."/>
<meta name="keywords" content="balance api, balance updates api, balance updates python api, Tron Balance python api, NFT balance api, Balance scan api, Balance api docs, Tron Balance crypto api, balance blockchain api,Tron network api, Tron web3 api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="How to get Tron Balance & Balance Updates of an address"
/>
<meta
  property="og:description"
  content="Learn how to get historical & real time balance & balance updates of a Tron address using Bitquery's Tron Balance Updates API."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="How to get Tron Balance Updates of an address" />
<meta property="twitter:description" content="Learn how to get real time balance & balance updates of a Tron address using Bitquery's Tron Balance Updates API." />
</head>

In thise section we will see how to monitor real-time balance changes across the Tron blockchain

This Tron API is part of our Early Access Program (EAP), which is intended for evaluation purposes.This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

## Subscribe to Balance Updates of a Particular Wallet

The query will subscribe you to real-time updates for balance changes on the Tron blockchain, providing a continuous stream of data as new transactions are processed and recorded. Here we have used address `0xacD03D601e5bB1B275Bb94076fF46ED9D753435A`. You can find the query [here](https://ide.bitquery.io/Balance-Updates-of-a-particular-address-on-Tron)

```
subscription {
  Tron {
    BalanceUpdates(
      where: {BalanceUpdate: {Address: {is: "TDqSquXBgUCLYvYC4XZgrprLK589dkhSCf"}}}
    ) {
      Currency {
        Name
      }
      BalanceUpdate {
        Address
        Amount
        Type
      }
      Block {
        Time
      }
      Transaction {
        Hash
      }
    }
  }
}

```
