---
sidebar_position: 2
title: "Query Fact Records: Return Raw Rows from a Bitquery Cube"
sidebar_label: "Query Fact Records"
description: "The simplest Bitquery query returns raw rows from a cube, such as the latest transactions with cost. When it fits, how to bound it, and when to aggregate."
keywords:
  - Bitquery fact records
  - raw rows GraphQL
  - latest transactions query
  - Bitquery query limits
  - GraphQL filters Bitquery
---

import FAQ from "@site/src/components/FAQ";

# Query Fact Records: Return Raw Rows from a Bitquery Cube

A fact record query asks a cube for rows as they are, no aggregation: name the fields you want and the cube returns matching records subject to your [filters](/docs/graphql/filters), [sorting](/docs/graphql/sorting) and [limits](/docs/graphql/limits). It is the right shape for "the last 100 transactions", "transfers of this wallet today" or "every trade of this token in the last hour". It is the wrong shape for "all transfers ever": fact tables hold billions of rows and no limit and offset walk gets you the whole set. For totals and rankings, use [aggregated metrics](/docs/graphql/capabilities/aggregated_metrics) on the same cube instead.

## Two rules that keep it fast

1. Filter tightly. An address, a token contract and a time window let the engine read a small slice; a bare cube scan does not. Time filters matter most, and on `archive` they are close to mandatory.
2. Order and limit. `orderBy` on an indexed field with a small `limit` returns the latest rows quickly. Sorting a huge unfiltered set is what times out.

## Example: the latest transactions and what they cost

The 100 newest BNB Chain transactions in block order, with the cost of each. Saved query [here](https://ide.bitquery.io/Last-transactions-with-cost).

```graphql
query {
  EVM(dataset: realtime network: bsc) {
    Transactions(limit: {count: 100}
    orderBy: [{descending: Block_Number} {descending: Transaction_Index}]) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
        Cost
      }
    }
  }
}
```

Sorting by block number and then transaction index gives a stable order inside a block, which plain `Block_Time` cannot, since every transaction in a block shares the same time.

## Turning it into other shapes

- **One wallet:** add `where: { Transaction: { From: { is: "0x..." } } }`.
- **A window:** add `Block: { Time: { since_relative: { hours_ago: 1 } } }` inside `where`.
- **A live feed:** change `query` to `subscription` and drop `limit` and `orderBy`; new rows arrive as they are indexed.
- **A total:** replace the selection with `count` and `sum(of: Transaction_Cost)`; see [aggregated metrics](/docs/graphql/capabilities/aggregated_metrics).

<FAQ
  items={[
    { q: "What is a fact record query in Bitquery?", a: "A query that returns raw rows from a cube, such as individual transactions, transfers or trades, with the fields you select. Filters, sorting and limits shape the result; nothing is aggregated." },
    { q: "Can I download a whole cube with limit and offset?", a: "No. Fact tables hold billions of rows and offset pagination cannot cover them. Bound the query by time, address or token, or use cloud datasets for bulk history." },
    { q: "Why does my fact query time out?", a: "Usually no time filter, an unindexed filter field, or a sort over a very wide set. Add a time window, filter on indexed fields, and keep the limit small; the indexed fields reference lists what sorts fast." },
    { q: "How do I get the same rows in real time?", a: "Change query to subscription and remove limit and orderBy. The cube pushes each new matching row over WebSocket." },
  ]}
/>

## Related pages

- [Query filters](/docs/graphql/filters)
- [Query limits](/docs/graphql/limits)
- [Indexed fields reference](/docs/graphql/indexed-fields-reference)
- [Aggregated metrics](/docs/graphql/capabilities/aggregated_metrics)
- [GraphQL query capabilities](/docs/category/capabilities)
