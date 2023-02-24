---
sidebar_position: 3
---

# Query Aggregated Metrics

This is the most effective query.
If you consider to query the large dataset in one query, you have to use aggregation. To use aggregation in
GraphQL, you define one or several [metrics](metrics).

This type of query is useful in the following cases:

1. query data in some specific buckets or intervals. Example is a candlestick market diagram by specific time intervals
2. get statistics over a large amount of data, for example total number of transactions or transfer volume
3. query integral information about some object, for example, an address

[Example](https://graphql.bitquery.io/ide/Maximum-amounts-of-ETH-transfer-by-date) of query to get maximum ethereum transfer amount by date:

```graphql
query {
  EVM(dataset: archive network: eth) {
    Transfers(where: {
      Block: {Date: {after: "2022-02-20"}}
      Transfer: {Currency: {Native: true}}}) {
      Block {
        Date
      }
      Transfer {
        Amount(maximum: Transfer_Amount)
      }
    }
  }
}
```

```maximum: Transfer_Amount``` calculates maximum amount of transfer in the scope of
defined dimensions, namely ```Date```.