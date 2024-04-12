---
sidebar_position: 1
---

# Matic Balance Updates API

In thise section we will see how to monitor real-time balance changes across the Matic blockchain

This Matic API is part of our Early Access Program (EAP), which is intended for evaluation purposes.This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

## Subscribe to Balance Updates of a Particular Wallet

The query will subscribe you to real-time updates for balance changes on the Matic blockchain, providing a continuous stream of data as new transactions are processed and recorded. Here we have used address `0x4c828be6a67130Cd0835cEDa850Baec062Dfd685`. You can find the query [here](https://ide.bitquery.io/Get-real-time-balance-updates#)

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
