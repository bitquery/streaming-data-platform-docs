---
sidebar_position: 3
---

# Sorting

Ordering can be applied to the results of the query, sorting the results in a way you define.

Use attribute `orderBy` to define the ascending / descending way the results to be sorted.

```
    Transactions(
      orderBy: {
        descending: Transaction_Value
      })
```

## Multiple Conditions

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

The example below shows how to sort transfers by their index within a block in ascending order,

```
{
  EVM(dataset: archive) {
    Transfers(
      limit: {count: 20}
      where: {Transfer: {Success: true, Sender: {is: "0x21a31ee1afc51d94c2efccaa2092ad1028285549"}}}
      orderBy: {ascendingByField: "Transaction_Index", descending: Block_Time}
    ) {
      amount: sum(of: Transfer_Amount)
      Block {
        Time
      }
      Transfer {
        Receiver
        Sender
      }
      Transaction {
        Hash
        Index
        Value
      }
    }
  }
}




```

`orderBy: {ascendingByField: "Transaction_Index", descending: "Block_Time"}` sorts the results first by the transaction index within a block in ascending order, ensuring that transactions are listed in the order they were executed. Secondly, it sorts by block time in descending order, prioritizing newer blocks.

## Sort by Metrics

If you use [metrics](/docs/graphql/metrics/) or [calculations](/docs/graphql/calculations) in the query, you can sort by them
using `descendingByField` and `ascendingByField` attributes.

You must write the name of the **metric** (`count`) or **alias** of the metric (`txCount`) as shown on this example:

```graphql
{
  EVM {
    Transactions(
      orderBy: { descendingByField: "txCount" }
      limit: { count: 10 }
    ) {
      Block {
        Number
      }
      txCount: count
    }
  }
}
```
