---
sidebar_position: 4
---

#  Conditional Metrics

Metrics have ```where``` attribute to define the condition for metric execution.
This way you can calculate metrics, that only refer to the part of the dataset you request.

This expression returns count of blocks with the non-zero gas used:
```
count(distinct: Block_Number where: {Block: {GasUsed: {gt: "0"}}})
```

:::note
```where``` attribute is universally applied to all metrics ad have the same structure as
[filters](../filters)
:::

:::tip
Use [Aliases](alias) to name these metrics
:::



