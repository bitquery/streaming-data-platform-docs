---
sidebar_position: 1
description: "Real-time Tron wallet balance updates via GraphQL subscriptions—IDE, WebSockets, Kafka."
---

# Tron Balance & Balance Updates API

In this section we will see how to monitor real-time balance changes across the Tron blockchain

<head>
<meta name="title" content="How to get Tron Balance Updates of an address (real-time streams)"/>
<meta name="description" content="Stream real-time Tron balance updates per wallet with Bitquery V2—GraphQL subscriptions, WebSockets, Kafka."/>
<meta name="keywords" content="Real time Tron balance updates, Stream Tron balance, Tron balance subscription, Tron balance websocket, balance api, balance updates api, balance updates python api, Tron Balance python api, NFT balance api, Balance scan api, Balance api docs, Tron Balance crypto api, balance blockchain api, Tron network api, Tron web3 api, tronscan api, Tron Kafka balance"/>
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
  content="Live Tron balance update streams—wallet subs in IDE, WebSockets, Kafka."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="How to get Tron Balance Updates of an address" />
<meta property="twitter:description" content="Real-time Tron balance updates API—streaming-first." />
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

## Total Holder Count of a Tron Token

Count the **total number of unique addresses holding a Tron TRC20 token** with a positive balance. A foundational metric for token-health dashboards.

Run the query [here](https://ide.bitquery.io/tron-token-holder-count).

```graphql
query TokenHolderCount {
  Tron(dataset: combined, aggregates: yes) {
    BalanceUpdates(
      where: {
        Currency: { SmartContract: { is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t" } }
      }
    ) {
      Currency {
        Name
        Symbol
        SmartContract
      }
      holders: uniq(
        of: BalanceUpdate_Address
        selectWhere: { gt: "0" }
      )
    }
  }
}
```

## Historical Balance of a Tron Address at a Specific Time

Reconstruct the **balance of a wallet as of a past block time** — useful for audits, airdrop snapshot eligibility, retroactive analytics, and tax tooling.

Try the query [here](https://ide.bitquery.io/tron-historical-balance).

```graphql
query HistoricalBalanceTron($address: String, $until: DateTime) {
  Tron(dataset: combined, aggregates: yes) {
    BalanceUpdates(
      where: {
        BalanceUpdate: { Address: { is: $address } }
        Block: { Time: { till: $until } }
      }
      orderBy: { descendingByField: "balance" }
    ) {
      Currency {
        Name
        Symbol
        SmartContract
      }
      balance: sum(of: BalanceUpdate_Amount, selectWhere: { gt: "0" })
    }
  }
}
{
  "address": "TDqSquXBgUCLYvYC4XZgrprLK589dkhSCf",
  "until": "2025-06-01T00:00:00Z"
}
```

## Full Multi-Token Portfolio of a Tron Wallet

Return the **complete TRC10 + TRC20 portfolio** of any Tron address with USD valuation — the building block of Tron portfolio trackers and wallet UIs.

Run the query [here](https://ide.bitquery.io/tron-wallet-portfolio).

```graphql
query TronWalletPortfolio($address: String) {
  Tron(dataset: combined, aggregates: yes) {
    BalanceUpdates(
      where: { BalanceUpdate: { Address: { is: $address } } }
      orderBy: { descendingByField: "balance_usd" }
    ) {
      Currency {
        Name
        Symbol
        SmartContract
        Native
      }
      balance: sum(of: BalanceUpdate_Amount, selectWhere: { gt: "0" })
      balance_usd: sum(of: BalanceUpdate_AmountInUSD, selectWhere: { gt: "0" })
    }
  }
}
{
  "address": "TFXttAWURRrXrd9JvFPVLEh1esJK8NHxn7"
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
