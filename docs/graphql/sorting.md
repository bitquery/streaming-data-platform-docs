---
sidebar_position: 3
---

# Sorting

Ordering can be applied to the results of the query, sorting the results in a way you define.

Use attribute ```orderBy``` to define the ascending / descending way the results to be sorted.

```
    Transactions(
      orderBy: {
        descending: Transaction_Value
      }
```

If multiple sorting conditions are used, they applied in the order you define them:

```
      orderBy: {
        descending: Transaction_Value
        ascending: Block_Number
      }
```

First results will be sorted by Transaction_Value and after that by Block_Number.

:::note
this is not the same as:
```
      orderBy: {
        ascending: Block_Number
        descending: Transaction_Value
      }
```
:::

## Sort by Metrics

If you use [metrics](metrics/) or [calculations](calculations) in the query, you can sort by them
using ```descendingByField``` and ```ascendingByField``` attributes.

You must write the name of the **metric** (```count```) or **alias** of the metric (```txCount```) as shown on this example:

```graphql
{
  EVM {
    Transactions(
      orderBy: {
        descendingByField: "txCount"
      }
      limit: {count: 10}
    ) {
      Block {
        Number
      }
      txCount: count
    }
  }
}
```

