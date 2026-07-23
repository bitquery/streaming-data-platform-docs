---
sidebar_position: 6
title: "Arbitrum Transactions API"
description: "Arbitrum Transactions API: query and stream Arbitrum on-chain data with Bitquery GraphQL examples for developers. Works with WebSocket live subscriptions."
---
# Arbitrum Transactions API

In this section we'll have a look at some examples using the Arbitrum Transactions API.

## Latest Transactions

The query below retrieves the latest 10 transactions on the Arbitrum network.
You can find the query [here](https://ide.bitquery.io/Latest-Transactions_3)

```
{
  EVM(network: arbitrum, dataset: archive) {
    Transactions(
      limit: {count: 10, offset: 0}
      orderBy: {descending: Block_Time}
      where: {Block: {Date: {since: "2023-07-01", till: "2023-07-15"}}}
    ) {
      ChainId
      Block {
        Number
        Time
      }
      Transaction {
        To
        From
        Hash
        Value
      }
      Receipt {
        GasUsed
      }
      Fee {
        EffectiveGasPrice
        SenderFee
      }
    }
  }
}
```

## Latest Transactions From/To a Wallet

To retrieve the latest transactions from or to a specific wallet address we will be using the `any` filter which acts as the OR condition. This query fetches the 10 most recent transactions from/to the specified wallet address, ordered by the block time in descending order.

```
{
  EVM(network: arbitrum, dataset: archive) {
    Transactions(
      limit: {count: 10}
      where: {any: {Transaction: {From: {is: "0x16a92c43b270fbb1916501470f70c42cf6f00326"}, To: {is: "0x16a92c43b270fbb1916501470f70c42cf6f00326"}}}}
      orderBy: {descending: Block_Time}
    ) {
      ChainId
      Block {
        Number
        Time
      }
      Transaction {
        To
        From
        Hash
        Value
      }
      Receipt {
        GasUsed
      }
      Fee {
        EffectiveGasPrice
        SenderFee
      }
    }
  }
}

```

## Latest Blocks

The query below retrieves the latest 10 blocks on the Arbitrum network.
You can find the query [here](https://ide.bitquery.io/Latest-Arbitrum-blocks)

```
query MyQuery {
  EVM(network: arbitrum) {
    Blocks(limit: {count: 10}, orderBy: {descending: Block_Time}) {
      Block {
        BaseFee
        Coinbase
        Difficulty
        Time
        Root
      }
    }
  }
}

```
