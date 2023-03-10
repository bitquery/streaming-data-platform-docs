---
sidebar_position: 2
---

#  Aliases

Aliases is a part of the GraphQL [standard](https://spec.graphql.org/draft/#sec-Field-Alias)
They become useful when you have the need to have two fields in the query **with the same name**.

Most probable you will come to the following problem with metrics:

```
      count(distinct: Block_GasUsed)
      count(distinct: Block_Date)
```

This query is not valid for GraphQL and will not execute.

Use aliases to make the query valid and also more readable:

```
      uniqueGasValues: count(distinct: Block_GasUsed)
      uniqueDates: count(distinct: Block_Date)
```

:::tip
Aliases can also be used in [sorting](../sorting)
:::
