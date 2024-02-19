---
sidebar_position: 1
---

# Subscription

Subscription is defined by the subscription type of GraphQL request:

```graphql
subscription {
  eth: EVM(network: eth) {
  ...
  }
}
```

Almost any query can be converted to subscription just by replacing `query` type to `subscription`.

Keep in mind, there are limits applied to the number of subscriptions a user can have active at one time. Currently, this limit is set at 8 per user; however, these limits are subject to change in the future. For the most up-to-date information on pricing and limits, please refer to the [pricing page on our website](https://bitquery.io/pricing).

In addition, optimizing your queries can significantly enhance the performance of your subscriptions. For more insights on how to optimize your websocket queries, go [here](/docs/graphql/optimizing-graphql-queries.md).
