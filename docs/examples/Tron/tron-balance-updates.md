---
sidebar_position: 1
---

# Tron Balance & Balance Updates API

In thise section we will see how to monitor real-time balance changes across the Tron blockchain

<head>
<meta name="title" content="How to get Tron Balance Updates of an address"/>
<meta name="description" content="Learn how to get real time balance & balance updates of a Tron address using Bitquery's Tron Balance Updates API."/>
<meta name="keywords" content="balance api, balance updates api, balance updates python api, Tron Balance python api, NFT balance api, Balance scan api, Balance api docs, Tron Balance crypto api, balance blockchain api,Tron network api, Tron web3 api, tronscan api"/>
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

## Balance of an Address on Tron

[Run Query ➤](https://ide.bitquery.io/balance-of-an-address-on-tron)

```
{
  Tron(dataset: combined, aggregates: yes) {
    BalanceUpdates(
      where: {BalanceUpdate: {Address: {is: "TDqSquXBgUCLYvYC4XZgrprLK589dkhSCf"}}}
      orderBy: {descendingByField: "balance"}
    ) {
      Currency {
        Name
      }
      balance: sum(of: BalanceUpdate_Amount, selectWhere: {gt: "0"})
    }
  }
}

```

## Top Token Holders of a token

This query fetches you the top 10 token holders of the token `TXL6rJbvmjD46zeN1JssfgxvSo99qC8MRT`. Check out the query [here](https://ide.bitquery.io/top-token-holders_2).

```
query MyQuery {
  Tron(dataset: combined) {
    BalanceUpdates(
      limit: {count: 10}
      orderBy: {descendingByField: "balance"}
      where: {Currency: {SmartContract: {is: "TXL6rJbvmjD46zeN1JssfgxvSo99qC8MRT"}}}
    ) {
      balance: sum(of: BalanceUpdate_Amount, selectWhere: {gt: "0"})
      BalanceUpdate {
        Address
      }
    }
  }
}

```
