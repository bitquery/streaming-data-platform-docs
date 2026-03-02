---
sidebar_position: 4
---

# Limits

Results are limited by using attributes ```limit``` and ```limitBy```

## limit

```limit``` just does what is says: limits the results to pre-defined size.

:::note
If you do not specify `limit`, a system default is applied. **GraphQL v2** uses a default of **25,000** rows per query result. You can override this by setting `limit` explicitly in your query filters. This is another argument to use aggregation when you need larger result sets.
:::

```limit``` attribute has a structure:

* ```count``` is the maximum count of results returned
* ```offset``` is the offset (0-based) of the results (default is 0)

:::danger
do not use ```offset``` for pagination of the result, unless you sure that the results are not 
modified or added between the queries and also have strong ordering
:::


## limitBy

```limitBy``` limits the result size for every value of the supplied attribute

The following query returns just top 2 blocks by transaction count, **per every day**

```graphql
{
  EVM (dataset: archive){
    Transactions(
      where: {Block: {Date: {after: "2022-11-11"}}}
      orderBy: {
        descendingByField: "txCount"
      }
      limitBy: {count: 2 by: Block_Date}
    ) {
      Block {
        Date
        Number
      }
      txCount: count
    }
  }
}
```

```limitBy: {count: 2 by: Block_Date}``` here says: _"take just 2 records for every ```Block_Date``` the result has"_.

:::tip
```limitBy``` is a good tool to do data sampling
:::