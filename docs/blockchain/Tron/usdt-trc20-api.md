---
title: "TRC20 API"
description: "Bitquery blockchain API docs: TRC20 API."
---

# TRC20 API

In this section we'll have a look at some examples using the TCR20 API.

<head>
<meta name="keywords" content="TRC20 API, TRC20 real-time transfers, USDT TRC20 DEX trades, Tron mempool transfers, Tron balance updates API, Tron balance Python API, Tron blockchain API, Tron network API, Tron web3 API, Bitquery Tron API, TRC20 documentation, Tron crypto API"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta property="og:title" content="How to Get Real-Time TRC20 Information on Tron Network" />
<meta property="og:description" content="Learn how to retrieve historical and real-time USDT data on the Tron network using Bitquery's TRC20 API." />

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="How to Get Real-Time TRC20 Information on Tron Network" />
<meta property="twitter:description" content="Learn how to retrieve real-time USDT Tron information using Bitquery's TRC20 API." />
</head>

## Tether USD (USDT) Transfers in Realtime

To monitor USDT transfers on Tron in real-time, you can use the following query.
You can run the query [here](https://ide.bitquery.io/usdt-trc20-transfers_1)

```

subscription {
  Tron {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"}}}}
    ) {
      Transaction {
        Hash
      }
      Transfer {
        Amount
        Sender
        Receiver
        Currency {
          SmartContract
          Symbol
          Name
          Fungible
          Native
        }
        Id
        AmountInUSD
      }
      Block {
        Number
      }
    }
  }
}

```

## USDT TRC20 DEX Trades in Realtime

This query retrieves real-time data on DEX trades involving USDT on the Tron network. It monitors trades where USDT is the bought currency, identified by the smart contract `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`. The subscription provides details about each trade, including the trade timestamp, protocol details, buyer and seller information, trade amounts, and order IDs.

```
subscription {
  Tron {
    DEXTrades(
      where: {Trade: {Buy: {Currency: {SmartContract: {is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"}}}}}
    ) {
      Block {
        Time
      }
      Trade {
        Dex {
          ProtocolName
          ProtocolFamily
          SmartContract
        }
        Buy {
          Amount
          Buyer
          Seller
          Currency {
            Decimals
            Fungible
            HasURI
            Name
            ProtocolName
            SmartContract
            Symbol
          }
          OrderId
          AmountInUSD
        }
        Sell {
          Buyer
          Seller
          Currency {
            Fungible
            Decimals
            Name
            Native
            SmartContract
            Symbol
          }
          AmountInUSD
          Amount
        }
      }
    }
  }
}


```

You can run the query [here](https://ide.bitquery.io/USDT-TRC20-DEX-Trades)

## Top 100 USDT TRC20 Holders on Tron

The most-asked USDT question on Tron: **who holds the most USDT?** This query returns the **top 100 holders of USDT (TRC20)** ranked by current balance, using the canonical contract `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`.

Try the query [here](https://ide.bitquery.io/top-100-usdt-trc20-holders).

```graphql
query Top100USDTHolders {
  Tron(dataset: combined) {
    BalanceUpdates(
      limit: { count: 100 }
      orderBy: { descendingByField: "balance" }
      where: {
        Currency: { SmartContract: { is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t" } }
      }
    ) {
      BalanceUpdate {
        Address
      }
      Currency {
        Name
        Symbol
        SmartContract
      }
      balance: sum(of: BalanceUpdate_Amount, selectWhere: { gt: "0" })
    }
  }
}
```

## Daily USDT TRC20 Transfer Volume on Tron

Get the **daily USDT TRC20 transfer volume**, transfer count, and unique-address count on the Tron network. Useful for stablecoin reports, market analytics, and macro on-chain dashboards.

Run the query [here](https://ide.bitquery.io/daily-usdt-trc20-volume).

```graphql
query DailyUSDTVolumeTron($since: DateTime) {
  Tron {
    Transfers(
      where: {
        Transfer: { Currency: { SmartContract: { is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t" } } }
        Block: { Time: { since: $since } }
        TransactionStatus: { Success: true }
      }
      orderBy: { ascendingByField: "Block_Date" }
    ) {
      Block {
        Date(interval: { count: 1, in: days })
      }
      transfers: count
      senders: uniq(of: Transfer_Sender)
      receivers: uniq(of: Transfer_Receiver)
      volume_usdt: sum(of: Transfer_Amount)
      volume_usd: sum(of: Transfer_AmountInUSD)
    }
  }
}
{
  "since": "2025-01-01T00:00:00Z"
}
```

## USDT TRC20 Supply Distribution (Holder Buckets)

Bucket USDT TRC20 holders by balance size to visualize **supply concentration** — a popular framing in stablecoin research and Tron ecosystem reports.

Try the query [here](https://ide.bitquery.io/usdt-trc20-supply-distribution).

```graphql
query USDTHolderBuckets {
  Tron(dataset: combined) {
    BalanceUpdates(
      where: {
        Currency: { SmartContract: { is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t" } }
      }
      orderBy: { descendingByField: "balance" }
    ) {
      BalanceUpdate {
        Address
      }
      balance: sum(of: BalanceUpdate_Amount, selectWhere: { gt: "0" })
      whale: count(selectWhere: { ge: "1000000" })
      large: count(selectWhere: { ge: "100000", lt: "1000000" })
      medium: count(selectWhere: { ge: "10000", lt: "100000" })
      retail: count(selectWhere: { ge: "1", lt: "10000" })
    }
  }
}
```

## TRC20 Mempool Transfers

This query retrieves real-time data on USDT transfers in the Tron network's mempool by filtering using the smart contract address `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`. The subscription provides details about each pending transfer, including the transaction hash, transfer amount, sender and receiver addresses, and the anticipated block number.

```
subscription {
  Tron(mempool: true) {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"}}}}
    ) {
      Transaction {
        Hash
      }
      Transfer {
        Amount
        Sender
        Receiver
        Currency {
          SmartContract
          Symbol
          Name
          Fungible
          Native
        }
        Id
        AmountInUSD
      }
      Block {
        Number
      }
    }
  }
}

```
