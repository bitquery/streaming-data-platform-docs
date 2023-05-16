---
sidebar_position: 0
---

# Query Principles

You query the data using [GraphQL](https://graphql.org/) language. Basically it
defines simple rules how the schema is defined, and how to query the data using this schema.

## Schema

Schema defines what data you can query and which options (arguments) you can apply to the query.
Schema allows [IDE](/docs/ide/login) to create hints to build the query interactively.
[IDE](/docs/ide/login) also shows the schema on query builder and in Document section.
Only queries matching schema can be successfully executed.

Schema for blockchain data is pretty complicated, but for your queries you do not need to
see it full. You only need a portion of it related to your needs typically.

## Query vs Subscription

Query is used to query the data. When you need to get updated results, you must query the
endpoint again with the same or another query. 

Subscription is used to get data updates. You define a [subscription](subscription/subsciption), 
and after the new data appear, it will be delivered to you without any actions from your side.

This defines the cases, when to use one or another:

* use queries when you need data once, or the data not likely changed during its usage period
* use subscriptions for the "live" data, or when data may be changed while using it


Good news, that queries and [subscriptions](subscription/subsciption) use identical schemas, except some attributes of the top
element, to define the [dataset](dataset/options) usage. It allows your applications to 
switch between pull and push modes of operation with a minimal changes of the code
and queries.

Compare the code in [the first query](../start/first-query) and
[the first subscription](../start/getting-updates) to see the difference.

This section describes principles that applies to subscriptions
as well as to queries. We will show examples for queries, but remember that they applied to
[subscriptions](subscription/subsciption) as well.

## Query Elements

Consider the query:

```graphql
query {
  EVM(dataset: archive network: bsc) {
    Blocks(limit: {count: 10}) {
      Block {
        Date
      }
      count
    }
  }
}
```

### Dataset Element

Top element of the query is

```graphql
  EVM(dataset: archive network: bsc) {
```

which defines the type of schema used (```EVM```, Ethereum Virtual Machine). For different types of blockchains
we use different schema. 

```dataset: archive network: bsc``` is an attribute, defining how we query the [dataset](dataset/options).
In this case, we query just archive (delayed) data on BSC (Binance Smart Chain) network. 
Refer to the [dataset](dataset/options) documentation for possible options to apply on this level.

By selecting the top element ``` EVM ``` we completely define what we can query below this element.
Apparently, Bitcoin and Ethereum have different schema and data, so we can not query them exactly the same way.


### Cube Element

```Blocks(limit: {count: 10})``` is what we call "Cube", particulary because we
use [OLAP](https://wikipedia.org/wiki/OLAP) methodology, applying
[metrics](metrics). Cube defines what kind of facts we want to query, in this case
we interested in blocks. Cubes are generally different for different types of blockchains.


### Dimension Element

```graphql
Block {
        Date
      }
```

is the dimension part of the query. It defines the granularity of the data that we query.
This example queries the data per-date manner. If we would need to have it per block,
we would use:

```graphql
Block {
        Number
      }
```

Query can make many dimensions. Result will have granularity combined from all dimensions used.
Query for transactions by block date and transaction hash will group all result by 
block **date** __AND__ by transaction **hash**:

```graphql
      Block {
        Date
      }
      Transaction {
        Hash
      }
```



### Metric Element

```count``` is a [metric](metrics). It is optional, defines "what we want to measure".
If it is missing, the results will give all data with the selected dimensions.

Note that the presence of at least one [metric](metrics) changes the way how query operates.
Compare these two queries:

The following query returns as many entries as blocks we have, with the date for each block:

```graphql
Block {
        Date
      }
```

This return counts of blocks **per every date** (aggregated by all blocks) :

```graphql
Block {
        Date
      }
      count
```

Refer to the [metric](metrics) tutorial for more details how you can use them.



### Attributes

```limit: {count: 10}``` is an attribute, defining [limit](limits) on the data result size.

There are several types of attributes, described in the sections:

* [limits](limits)
* [ordering](sorting)
* [filters](filters)
* [calculations](calculations)


### Correctness

To be correctly executed, the query must conform with the following requirements:

1. query must conform the schema. When you build query in the [IDE](../ide/login), it will highlight all errors according to schema
2. query should not violate principles described above and some natural limitations of the database capabilities. For example, you can not fetch a million result in one query, you have to use offset and limits.
3. query should not consume more than available resources on the server. We use points to calculate consumed resources.

If query can not execute, the result contains the ```errors``` in the results

This screen shows the highlighted error in the query and the resulting response:

![IDE query error](/img/ide/query_error.png)