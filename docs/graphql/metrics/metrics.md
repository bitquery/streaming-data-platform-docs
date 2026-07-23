---
sidebar_position: 1
title: "Using Metrics"
description: "Use the Bitquery GraphQL Using Metrics metric in queries and aggregations."
---
#  Using Metrics

Use metrics if you want to:

* calculate some statistics over the results
* aggregate the results in a smaller set

Adding metrics make the query aggregate query, and it will return
results, grouped by dimensions. Look [Query Aggregated Metrics](/docs/graphql/capabilities/aggregated_metrics/)
for details.

:::tip
Consider using metrics in every query to the [archive database](/docs/graphql/dataset/archive/)
:::

:::note
Metrics can be also used in subscriptions, refer to [Subscription on Aggregated Metrics](/docs/graphql/capabilities/subscription_aggregates/) for details.
:::

