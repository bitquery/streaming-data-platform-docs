---
sidebar_position: 1
---

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
