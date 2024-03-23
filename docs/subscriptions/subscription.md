---
sidebar_position: 1
---

# What is a Subscription?

Subscription is defined by the subscription type of GraphQL request:

```graphql
subscription {
  eth: EVM(network: eth) {
  ...
  }
}
```

![Export code](/img/ide/ide_subscription.gif)

Almost any query can be converted to subscription just by replacing `query` type to `subscription`.

When creating queries for GraphQL subscriptions, here are some tips to consider:

1.  **Avoid Limiting Results:** In most cases, you should avoid limiting the results of your subscription query. This is because subscriptions are meant to stream data in real-time and limiting the results could cause you to miss out on new data. However, there might be scenarios where limiting results makes sense. For instance, if you want to query "the top 10 transactions by block", a limit would be appropriate.

2.  **Ordering Might Not Be Necessary:** Given that subscriptions are meant to provide real-time data, ordering might not be necessary or even meaningful since data is sent as it becomes available.

3.  **Test Your Queries:** Before deploying your application, make sure to thoroughly test your subscription queries to ensure they return the data you expect and can handle high volumes of data.

In addition, optimizing your queries can significantly enhance the performance of your subscriptions. For more insights on how to optimize your websocket queries, go [here](/docs/graphql/optimizing-graphql-queries.md).

Subscriptions are also priced using our point-based system. Read about it [here](/docs/ide/points.md)

## Creating Multiple Subscriptions in one Websocket

It is possible—and often more efficient—to manage multiple subscriptions over a single WebSocket connection. This approach allows you to bundle various subscriptions, such as DEX Trades, Transactions, Blocks, and Transfers, into a single Websocket stream. However, it's important to note that your top-level element must be only one.

```
subscription{
  EVM{
    Transfers{

    }
    Transactions{

    }
  }
}

```

### Example: Tracking USDT Transfers on Ethereum

In this query, we see how to run multiple queries with a single WebSocket.

This query will return two sets of transfer data for USDT on the Ethereum network: `transfers_above_10K` and `transfers_below_10K`. The `transfers_above_10K` data set includes all transfers with an amount greater than or equal to 10,000 USDT. The `transfers_below_10K` data set includes all transfers with an amount less than 10,000 USDT. Both data sets include the transaction hash, sender, receiver, and amount of each transfer.

You can run the query [here](https://ide.bitquery.io/USDT-transfers-of-different-amounts-mempool)

```
subscription ($token: String!, $minamount: String!, $mempool: Boolean, $network: evm_network!) {
  usdt: EVM(network: $network, mempool: $mempool) {
    transfers_above_10K: Transfers(
      where: {Transfer: {Amount: {ge: $minamount}, Currency: {SmartContract: {is: $token}}}}
    ) {
      Transaction {
        Hash
        From
        Gas
      }
      Receipt {
        GasUsed
      }
      Transfer {
        Sender
        Receiver
        Amount
      }
    }
    transfers_below_10K: Transfers(
      where: {Transfer: {Amount: {lt: $minamount}, Currency: {SmartContract: {is: $token}}}}
    ) {
      Transaction {
        Hash
        From
        Gas
      }
      Receipt {
        GasUsed
      }
      Transfer {
        Sender
        Receiver
        Amount
      }
    }
  }
}
{
  "token": "0xdac17f958d2ee523a2206206994597c13d831ec7",
  "minamount": "10000",
  "mempool": true,
  "network": "eth"
}
```
