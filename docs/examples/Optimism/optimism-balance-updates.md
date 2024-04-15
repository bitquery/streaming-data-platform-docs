---
sidebar_position: 1
---

# Optimism Balance Updates API

In thise section we will see how to monitor real-time balance changes across the Optimism blockchain

This Optimism API is part of our Early Access Program (EAP), which is intended for evaluation purposes.This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

## Subscribe to Balance Updates of a Particular Wallet

The query will subscribe you to real-time updates for balance changes on the Optimism blockchain, providing a continuous stream of data as new transactions are processed and recorded. Here we have used address `0xacD03D601e5bB1B275Bb94076fF46ED9D753435A`. You can find the query [here](https://ide.bitquery.io/Get-real-time-balance-updates-on-optimism_1#)

```
subscription {
  EVM(network: optimism) {
    BalanceUpdates(
      where: {BalanceUpdate: {Address: {is: "0xacD03D601e5bB1B275Bb94076fF46ED9D753435A"}}}
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
