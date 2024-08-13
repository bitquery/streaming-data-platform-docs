---
sidebar_position: 1
---

# BSC Balance Updates API

In thise section we will see how to monitor real-time balance changes across the BSC blockchain.

<head>
<meta name="title" content="BSC Balance Updates API"/>
<meta name="description" content="Learn how to get real time balance & balance updates of a BSC address using Bitquery's Balance Updates API."/>
<meta name="keywords" content="balance api, balance updates api, balance updates python api, BSC Balance python api, NFT balance api, Balance scan api, Balance api docs, BSC Balance crypto api, balance blockchain api,BSC network api, BSC web3 api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="BSC Balance Updates API"
/>
<meta
  property="og:description"
  content="Learn how to get historical & real time balance & balance updates of a BSC address using Bitquery's Balance Updates API."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="BSC Balance Updates API" />
<meta property="twitter:description" content="Learn how to get real time balance & balance updates of a BSC address using Bitquery's Balance Updates API." />
</head>

## Subscribe to Balance Updates of a Particular Wallet

The query will subscribe you to real-time updates for balance changes on the BSC blockchain, providing a continuous stream of data as new transactions are processed and recorded. Here we have used address `0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c`. You can find the query [here](https://ide.bitquery.io/get-real-time-balance-updates-of-an-address_1)

```
subscription {
  EVM(network: bsc) {
    BalanceUpdates(
      where: {BalanceUpdate: {Address: {is: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"}}}
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
