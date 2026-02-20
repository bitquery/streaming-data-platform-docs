---
sidebar_position: 9
---

# GraphQL query optimization for APIs

GraphQL is an open-source query language for APIs. It allows clients to define the required data structure, and the server responds with only that data. This allows for more efficient and flexible communication between the client and server, as well as enabling better performance and easier development of APIs.

GraphQL query optimization is a crucial aspect of utilizing V2 APIs to their full potential. By optimizing your queries, you can significantly reduce the amount of time and resources required to retrieve the data you need.

In this section, we will see how to optimize your V2 API queries.



### Understanding Datasets

Choosing the right dataset is critical for both correctness and performance. We offer three datasets with different guarantees and latency characteristics:

- **realtime**: Default if omitted. Contains the most recent data (roughly last ~8 hours) and is optimized for low-latency reads and subscriptions.
- **archive**: Full historical data from genesis
- **combined**: Executes the same query against both realtime and archive and merges results. Useful when you need a continuous view that spans “now” into history, but it’s slower.

Practical guidance:

Examples:

```graphql
# Latest trades with minimal delay
EVM(dataset: realtime, network: eth) { DEXTrades(limit: { count: 100 }) { Trade { ... } } }

# Historical holders snapshot
EVM(dataset: archive, network: eth) { TokenHolders(date: "2024-01-01") { uniq(of: Holder_Address) } }

# One-shot view spanning history and near-real-time
EVM(dataset: combined, network: bsc) { BalanceUpdates(limit: { count: 1000 }) { ... } }
```

### Understanding limits in GraphQL

In V2 APIs, it's crucial to note the implicit default limit applied when a specific limit isn't explicitly defined within a query. [By default, this limit restricts the number of records returned to 10,000](https://docs.bitquery.io/docs/start/errors/#limits). This safeguard is in place to prevent excessive resource consumption, ensuring the efficient processing of queries.

However, to tailor data retrieval according to specific needs, V2 APIs provide the flexibility to set custom limits using the 'limit' parameter.

This filter allows you to refine your query results, ensuring that only the necessary records are returned, reducing unnecessary point consumption risk.

Let's take an example, the below query retrieves information about calls on the BNB network. For each call, it retrieves the internal call and transaction information. The number of responses is restricted to 20 by the limit field.

```graphql
query CustomLimitQuery {
  EVM(dataset: realtime, network: bsc) {
    Calls(limit: { count: 20 }) {
      Call {
        LogCount

        InternalCalls
      }

      Transaction {
        Gas

        Hash

        From

        To

        Type

        Index
      }

      Block {
        Date
      }
    }
  }
}
```

### Understanding limitBy

In addition to the 'limit' parameter, V2 APIs also offer the 'limitBy' parameter, which allows you to set limits based on specific criteria. For example, you can set a limit on the number of records returned based on a certain attribute or field. This helps to further refine your queries and reduce unnecessary resource consumption.

Using the 'limitBy' parameter is particularly useful when dealing with large datasets, as it allows you to retrieve only the data that is relevant to your needs.

Below is an example query that retrieves information about limitBy. For each call, it retrieves the internal call and transaction information. The number of responses is limited to 10 by the 'limit' field.

```graphql
{
  EVM(dataset: realtime, network: eth) {
    DEXTrades(
      where: {
        Trade: {
          Buy: {
            Currency: {
              SmartContract: {
                is: "0x5283d291dbcf85356a21ba090e6db59121208b44"
              }
            }
          }
        }
      }

      limit: { count: 10 }

      limitBy: { by: Trade_Sell_Currency_SmartContract, count: 1 }
    ) {
      Trade {
        Dex {
          ProtocolName

          OwnerAddress

          ProtocolVersion

          Pair {
            SmartContract

            Name

            Symbol
          }
        }

        Buy {
          Currency {
            Name

            SmartContract
          }
        }

        Sell {
          Currency {
            Name

            SmartContract
          }
        }
      }
    }
  }
}
```

### Understanding Indexes

In each table, certain columns are used as indexes, you can use those columns to sort in `orderby` field to improve time to response.

A detailed list is available in this [Indexes](https://docs.bitquery.io/docs/graphql/indexed-fields-reference/) page.


### Sorting Queries in GraphQL

Sorting can be done by using the `order by` argument. This argument takes a list of fields to sort by, as well as the direction of the sorting (ascending or descending). For example, if you wanted to sort a list of users by their age in descending order, your GraphQL query looks like below.

```graphql
query ($network: evm_network, $till: String!, $token: String!, $limit: Int) {
  EVM(network: $network, dataset: archive) {
    TokenHolders(
      tokenSmartContract: $token

      date: $till

      orderBy: { descending: Balance_Amount }

      limit: { count: $limit }
    ) {
      Holder {
        Address
      }

      Balance {
        Amount
      }
    }

    Blocks(limit: { count: 1 }) {
      ChainId
    }
  }
}
```

### Sort by Metrics

Sorting by metrics in GraphQL can be achieved by using the `order by` argument along with specific metrics. This allows you to sort data based on certain criteria, such as popularity, rating, or relevance.

Metric-based sorting is a powerful feature in GraphQL that allows you to sort data based on a specific metric or criteria. Let me give you some examples to help explain how this works.

```graphql
{
  EVM(network: bsc, dataset: combined) {
    BalanceUpdates(
      limit: { count: 1000 }
      orderBy: { descendingByField: "balance" }
      where: {
        Currency: {
          SmartContract: { is: "0xc748673057861a797275cd8a068abb95a902e8de" }
        }
      }
    ) {
      BalanceUpdate {
        Address
      }
      balance: sum(of: BalanceUpdate_Amount)
    }
  }
}
```

In the above example, we use the SUM metric to sort the responses. We give an [alias](https://docs.bitquery.io/docs/graphql/metrics/alias/) to the sum field (Balance) and sort the responses from highest to lowest sum.

### Filtering data in GraphQL queries

Filtering data in GraphQL queries is done by using the `where` argument along with specific conditions. This allows you to retrieve only the data that meets certain criteria, such as a specific date range, a certain value, or a particular category. Filtering data is an important feature in GraphQL that allows you to narrow down the results of a query to only the relevant information you need. Let me give you an example to help illustrate how this works.

We will look at how to use filters, with the help of the below example.

```graphql
{
  EVM(dataset: combined, network: eth) {
    buyside: DEXTrades(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: {
        Trade: {
          Buy: {
            Currency: {
              SmartContract: {
                is: "0x5283d291dbcf85356a21ba090e6db59121208b44"
              }
            }
            Seller: { is: "0x1111111254eeb25477b68fb85ed929f73a960582" }
          }
        }
        Block: {
          Time: { till: "2023-03-05T05:15:23Z", since: "2023-03-03T01:00:00Z" }
        }
      }
    ) {
      Block {
        Number
        Time
      }
      Transaction {
        From
        To
        Hash
      }
      Trade {
        Buy {
          Amount
          Buyer
          Currency {
            Name
            Symbol
            SmartContract
          }
        }
        Sell {
          Amount
          Buyer
          Currency {
            Name
            SmartContract
            Symbol
          }
        }
      }
    }
  }
}
```

In the above GraphQL query, filtering is performed using the `where` argument in conjunction with conditions defined for the Trade and Block.

For the `Trade` filtering, two conditions need to be satisfied.

- The `Buy` property's `Currency` should have a `SmartContract` value of "0x5283d291dbcf85356a21ba090e6db59121208b44", and
- The `Seller` property should be "0x1111111254eeb25477b68fb85ed929f73a960582".

The `Block` filtering is based on the `Time` property.

The `Time` should fall within a certain range - specifically, from "2023-03-03T01:00:00Z" to "2023-03-05T05:15:23Z".

This combination of filters narrows down the results of `DEXTrades` to only include trades that meet all of the specified conditions within the given time frame.

This will return only the posts that meet this criteria, and will only include their title and content fields in the response.

#### Exploring Filter Types and Operators

Filters play a crucial role in data retrieval systems by narrowing down search results to specific data sets. In the realm of databases, a filter acts as a condition applied to a query, fetching only the records that meet that specific condition. A variety of filter types and operators are available, allowing you to customize your search queries and obtain more accurate results.

Some common filter types include:

1.  Text filters: These filters enable you to search for specific text or words within a given field.
2.  Numeric filters: These filters allow you to search for records based on numeric values within a specified range. Numeric filter types encompass:

- Equals: represented by `is` or `=`
- Not equals: represented by `NOT IN`
- Greater than: represented by `gt`
- Less than: represented by `lt`
- Greater than or equal to: represented by `ge`
- Less than or equal to: represented by `le`

These operators aid in filtering data based on numeric values.

3.  Date filters: These filters enable you to search for records based on specific dates or date ranges.
4.  Boolean filters: These filters facilitate the search for records based on true/false values.

For instance, consider the following query. Here, we utilize a string filter to narrow down the token contract to `0x23581767a106ae21c074b2276D25e5C3e136a68b` and a numeric filter with `ge` (greater than or equal to) 50, indicating a minimum balance requirement:

```graphql
{
  EVM(dataset: archive, network: eth) {
    greater_than_50: TokenHolders(
      date: "2023-10-23"

      tokenSmartContract: "0x23581767a106ae21c074b2276D25e5C3e136a68b"

      where: { Balance: { Amount: { ge: "50" } } }
    ) {
      uniq(of: Holder_Address)
    }

    greater_than_or_equal_to_50: TokenHolders(
      date: "2023-10-23"

      tokenSmartContract: "0x23581767a106ae21c074b2276D25e5C3e136a68b"

      where: { Balance: { Amount: { gt: "50" } } }
    ) {
      uniq(of: Holder_Address)
    }
  }
}
```

### Running the same query for multiple addresses

Let's say you have built a query that filters results using an address filter `{Address: {is: $token}`.
To run the same query for multiple addresses, you can change the filter to `{Address: {in: ["A","B","C"]}` where `A`, `B`, `C` are all representative of addresses.
