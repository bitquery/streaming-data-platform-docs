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


Another way to sort on multiple condition is following 

```
{
  EVM {
    Events(
      orderBy: [{ascending: Transaction_Index},
        {ascending: Call_Index}, 
        {ascending: Log_Index}]
    ) {
      Transaction {
        Index
      }
      Call {
        Index
      }
      Log {
        Index
        Signature {
          Signature
        }
      }
    }
  }
}
```



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
## How do I get the most recent entry only from a Bitquery query?

To fetch only the most recent entry (such as the latest trade, event, or transaction), use the `orderBy` argument to sort results by `Block_Time` in descending order (`{descending: Block_Time}`). To guarantee correct chronological ordering and resolve ties between events occurring in the same block, add secondary sort fields such as `Transaction_Index` or even lower levels like `Instruction_Index` and `Trade_Index` if available. This approach ensures your query will always return the latest entry—even in high-throughput chains or when multiple events share the same block time.

Recommended ordering for the latest record:
- First, sort by `Block_Time`—`{descending: Block_Time}`—to prioritize the newest blocks first.
- Next, add `Transaction_Index`—`{descending: Transaction_Index}`—for precise ordering within a block.
- Then, add `Instruction_Index` and/or `Trade_Index`—`{descending: Instruction_Index}`, `{descending: Trade_Index}`—to resolve ordering among instructions or trades that occur within the same transaction.

This multi-level ordering creates a stable, deterministic way to get the most recent record, or to paginate results with full reliability.

**Example: Get the latest trade on Solana (DEXTradeByTokens cube)**
```graphql
{
  Solana {
    DEXTradeByTokens(
      orderBy: [
        {descending: Block_Time},
        {descending: Transaction_Index},
        {descending: Instruction_Index},
        {descending: Trade_Index}
      ]
      limit: {count: 1}
    ) {
      Transaction {
        Signature
      }
    }
  }
}
```
In this example, the query returns exactly one result (the most recent trade), sorted by block time, transaction index, instruction index, and trade index—all in descending order to ensure true "latest" ordering.
## What does the desc option do in a Bitquery query?

**API V2** uses **`orderBy: { descending: … }`** or **`ascending`**, not a standalone **`desc`** option on the root query. **API V1** examples often used **`options: { desc: [ ... ], limit, offset }`**. For migration and side‑by‑side examples, see [Migrate Bitquery API V1 to V2](https://docs.bitquery.io/docs/API-Blog/migrate-v1-v2/).
