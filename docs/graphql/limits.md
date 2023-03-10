---
sidebar_position: 4
---

# Limits

Results are limited by using attributes ```limit``` and ```limitBy```

## limit

```limit``` just does what is says: limits the results to pre-defined size.

:::note
if you do not specify ```limit```, some pre-defined system limit anyway will be applied, around
10,000 rows of data. This is another argument to use aggregation.
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