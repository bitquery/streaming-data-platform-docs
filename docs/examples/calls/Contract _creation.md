---
sidebar_position: 1
---

# Smart Contract Creation

Smart contract creators can use these queries to track the deployment of their own smart contracts and to monitor the deployment of new smart contracts by others.

## Subscription to track new smart contract creation in real-time

This subscription will return information on each new smart contract created on Ethereum. You can create a [websocket](https://docs.bitquery.io/docs/start/websocket/) to monitor the same in real-time.

```
subscription {
  eth_creates: EVM(network: eth) {
    creates: Calls(
      where: {
        Call: { Create: true }}) {
      Block {
        Time
      }
      Transaction{
        Hash
        From
      }
      Call {
        Input
        To
        Output
      }

    }
  }
}

```

This subscription has information on

- The block time in which the smart contract was created
- The transaction hash that created the smart contract
- The address of the sender of the transaction that created the smart contract
- The address of the newly created smart contract
- The input data for the transaction that created the smart contract
- The output data from the transaction that created the smart contract

## Track new smart contract creation since a specific date

This query below, will return the number of new smart contracts created on the Ethereum and Binance Smart Chain networks since a particular date. It will also return the date of each day on which new smart contracts were created.
You can find the query [here](https://ide.bitquery.io/ETHBSC-SC-creates-count-over-date)

```
query {
  eth_creates: EVM(dataset: combined network: eth) {
    creates: Calls(
      where: {
        Block: {Date: {after: "2023-06-01"}}
        Call: { Create: true }}) {
      count
      Block {
        Date
      }
    }
  }
  bsc_creates: EVM(dataset: combined network: bsc) {
    creates: Calls(
      where: {
        Block: {Date: {after: "2023-06-01"}}
        Call: { Create: true }}) {
      count
      Block {
        Date
      }
    }
  }
}

```
