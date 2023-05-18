---
sidebar_position: 4
---

#  Conditional Metrics

Metrics have ```if``` attribute to define the condition for metric execution.
This way you can calculate metrics, that only refer to the part of the dataset you request.

This expression returns count of blocks with the non-zero gas used:
```
count(distinct: Block_Number if: {Block: {GasUsed: {gt: "0"}}})
```

:::note
```if``` attribute is universally applied to all metrics ad have the same structure as
[filters](/docs/graphql/filters)
:::

:::tip
Use [Aliases](/docs/graphql/metrics/alias) to name these metrics
:::



