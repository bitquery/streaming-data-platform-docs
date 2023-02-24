---
sidebar_position: 2
---


# Query Fact Records

This is the simplest type of query. You just define the attributes which you need in the results,
and you get all records directly from the database matching [limits](limits), [ordering](ordering)
and [filters](filters).

Note that fact tables are typically long beasts, and querying the complete content of them not possible at all.
So in reality you can query only a small portion of data, and there is no good way to get the complete
dataset just by querying the fact tables, even using [limits](limits) and offsets.

This type of query is useful in the following cases:

1.  query some specific sub-set of the data, with the very well-defined filters. For example, the last token transfers of specific address for today. The more precise filter you define, the better it will run. Date or time filters are essential in this case.
2.  define ordering and query just the last records. This type of query should also take care about date / time filtering especially if you query archive data.

[Query example ](https://graphql.bitquery.io/ide/Last-transactions-with-cost) to get the last transactions in the blockchain with the cost of them:


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