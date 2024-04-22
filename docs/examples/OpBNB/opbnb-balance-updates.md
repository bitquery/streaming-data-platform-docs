---
sidebar_position: 1
---

<head>
<meta name="title" content="How to get OpBNB Balance Updates of an address"/>
<meta name="description" content="Learn how to get real time balance & balance updates of a OpBNB address using Bitquery's OpBNB Balance Updates API."/>
<meta name="keywords" content="balance api, balance updates api, balance updates python api, OpBNB Balance python api, NFT balance api, Balance scan api, Balance api docs, OpBNB Balance crypto api, balance blockchain api,OpBNB network api, OpBNB web3 api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="How to get OpBNB Balance & Balance Updates of an address"
/>
<meta
  property="og:description"
  content="Learn how to get historical & real time balance & balance updates of a OpBNB address using Bitquery's OpBNB Balance Updates API."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="How to get OpBNB Balance Updates of an address" />
<meta property="twitter:description" content="Learn how to get real time balance & balance updates of a OpBNB address using Bitquery's OpBNB Balance Updates API." />
</head>

# OpBNB Balance Updates API

In thise section we will see how to monitor real-time balance changes across the OpBNB network.

This OpBNB API is part of our Early Access Program (EAP), which is intended for evaluation purposes.This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

## Get Balance Updates of a Particular Address

The query will subscribe you to real-time updates for balance changes on the OpBNB blockchain, providing a continuous stream of data as new transactions are processed and recorded. Here we have used address `0x4200000000000000000000000000000000000006`
You can find the query [here](https://ide.bitquery.io/Get-real-time-balance-updates-on-opBNB)

```
subscription {
  EVM(network: opbnb) {
    BalanceUpdates(
      where: {BalanceUpdate: {Address: {is: "0x4200000000000000000000000000000000000006"}}}
    ) {
      Currency {
        Name
        Symbol
        SmartContract
      }
      BalanceUpdate {
        Address
        Amount
        Type
      }
    }
  }
}

```
