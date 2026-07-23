---
title: "Tron Transactions API"
description: "Tron Transactions API: query and stream Tron on-chain data with Bitquery GraphQL examples for developers. Scale further with Kafka or gRPC streams."
---
# Tron Transactions API

In this section we'll have a look at some examples using the Tron Transactions API.

## Monitor Real-time Transactions by Wallet

The subscription query below fetches the transactions on the Tron network for the wallet address `TDqSquXBgUCLYvYC4XZgrprLK589dkhSCf`.

```
subscription {
  Tron {
    Transactions(
      where: {Transaction: {FeePayer: {is: "TDqSquXBgUCLYvYC4XZgrprLK589dkhSCf"}}}
    ) {
      Block {
        Hash
        Time
        Number
      }
      Contract {
        Address
      }
      ChainId
      Transaction {
        Fee
        Hash
        FeePayer
        Signatures
        Result {
          Success
          Status
          Message
        }
        Time
      }
    }
  }
}

```

You can run the query [here](https://ide.bitquery.io/monitor-TRX-address-transactions)

## Failed Transactions on Tron (Reverts & Out-of-Energy Errors)

List **failed transactions** for a Tron wallet with the failure message — invaluable for debugging dApps, monitoring bot health, and tracking contract reverts.

You can run the query [here](https://ide.bitquery.io/failed-tron-transactions).

```graphql
query FailedTronTransactions($address: String, $since: DateTime) {
  Tron {
    Transactions(
      where: {
        Transaction: {
          FeePayer: { is: $address }
          Result: { Success: false }
        }
        Block: { Time: { since: $since } }
      }
      orderBy: { descending: Block_Time }
      limit: { count: 50 }
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
        Fee
        FeePayer
        Result {
          Success
          Status
          Message
        }
      }
    }
  }
}
{
  "address": "TDqSquXBgUCLYvYC4XZgrprLK589dkhSCf",
  "since": "2025-01-01T00:00:00Z"
}
```

## Top Tron Wallets by Fees Paid (24h)

Rank wallets by **TRX fees paid in the last 24 hours** — a popular leaderboard for spotting active bots, MEV searchers, and high-volume traders on Tron.

Try the query [here](https://ide.bitquery.io/tron-top-fee-payers-24h).

```graphql
query TopTronFeePayers24h {
  Tron {
    Transactions(
      where: {
        Block: { Time: { since_relative: { hours_ago: 24 } } }
        Transaction: { Result: { Success: true } }
      }
      orderBy: { descendingByField: "fees" }
      limit: { count: 100 }
    ) {
      Transaction {
        FeePayer
      }
      fees: sum(of: Transaction_Fee)
      txs: count
    }
  }
}
```
