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

When creating queries for GraphQL subscriptions, here are some tips to consider:

1.  **Avoid Limiting Results:** In most cases, you should avoid limiting the results of your subscription query. This is because subscriptions are meant to stream data in real-time and limiting the results could cause you to miss out on new data. However, there might be scenarios where limiting results makes sense. For instance, if you want to query "the top 10 transactions by block", a limit would be appropriate.

2.  **Ordering Might Not Be Necessary:** Given that subscriptions are meant to provide real-time data, ordering might not be necessary or even meaningful since data is sent as it becomes available.

3.  **Test Your Queries:** Before deploying your application, make sure to thoroughly test your subscription queries to ensure they return the data you expect and can handle high volumes of data.

In addition, optimizing your queries can significantly enhance the performance of your subscriptions. For more insights on how to optimize your websocket queries, go [here](/docs/graphql/optimizing-graphql-queries.md).
