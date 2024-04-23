---
sidebar_position: 1
---
# Polygon (MATIC) Balance Updates API

<head>
<meta name="title" content="How to get Polygon (MATIC) Balance Updates of an address"/>
<meta name="description" content="Learn how to get real time balance & balance updates of a Polygon (MATIC) address using Bitquery's Balance Updates API."/>
<meta name="keywords" content="balance api, balance updates api, balance updates python api, Polygon (MATIC) Balance python api, NFT balance api, Balance scan api, Balance api docs, Polygon (MATIC) Balance crypto api, balance blockchain api,Polygon (MATIC) network api, Polygon (MATIC) web3 api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="How to get Polygon (MATIC) Balance & Balance Updates of an address"
/>
<meta
  property="og:description"
  content="Learn how to get historical & real time balance & balance updates of a Polygon (MATIC) address using Bitquery's Balance Updates API."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="How to get Polygon (MATIC) Balance Updates of an address" />
<meta property="twitter:description" content="Learn how to get real time balance & balance updates of a Polygon (MATIC) address using Bitquery's Balance Updates API." />
</head>



In thise section we will see how to monitor real-time balance changes across the Polygon (MATIC) blockchain

This Polygon (MATIC) API is part of our Early Access Program (EAP), which is intended for evaluation purposes.This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

## Subscribe to Balance Updates of a Particular Wallet

The query will subscribe you to real-time updates for balance changes on the Polygon (MATIC) blockchain, providing a continuous stream of data as new transactions are processed and recorded. Here we have used address `0x4c828be6a67130Cd0835cEDa850Baec062Dfd685`. You can find the query [here](https://ide.bitquery.io/Get-real-time-balance-updates#)

```
subscription {
  EVM(network: matic) {
    BalanceUpdates(
      where: {BalanceUpdate: {Address: {is: "0x4c828be6a67130Cd0835cEDa850Baec062Dfd685"}}}
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
    }
  }
}


```
