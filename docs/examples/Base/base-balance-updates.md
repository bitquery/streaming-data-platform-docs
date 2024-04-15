---
sidebar_position: 1
---

# Base Balance Updates API

In thise section we will see how to monitor real-time balance changes across the Base blockchain

This Base API is part of our Early Access Program (EAP), which is intended for evaluation purposes.This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

## Subscribe to Balance Updates of a Particular Wallet

The query will subscribe you to real-time updates for balance changes on the Base blockchain, providing a continuous stream of data as new transactions are processed and recorded. Here we have used address `0x4200000000000000000000000000000000000006`. You can find the query [here](https://ide.bitquery.io/Get-real-time-balance-updates_1#)

```
subscription {
  EVM(network: base) {
    BalanceUpdates(
      where: {BalanceUpdate: {Address: {is: "0x4200000000000000000000000000000000000006"}}}
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
