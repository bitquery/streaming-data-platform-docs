---
sidebar_position: 2
---

# Events API

The Event API gives you access real-time blockchain event data. Events represent changes to the state of a blockchain, such as transactions, token transfers, or contract creations.

## Recent Events
 
 This query is used to retrieve recent events' data from the Ethereum Virtual Machine (EVM) on the Binance Smart Chain (BSC) network. You can find the query [here](https://graphql.bitquery.io/ide/Recents-Events).

```graphql
query MyQuery {
  EVM(dataset: combined, network: bsc) {
    Events(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {Block: {Date: {after: "2023-02-16"}}}
    ) {
      Block {
        Number
      }
      
      Call {
        CallPath
        InternalCalls
      }
      Topics {
        Hash
      }
      Receipt {
        CumulativeGasUsed
      }
      Transaction {
        From
        To
        Type
      }
    }
  }
}
```

 **Parameters**
-   `dataset`: This parameter specifies the dataset to use. In this case, the "combined" dataset is being used.
-   `network`: This parameter specifies the network to query. In this case, the Binance Smart Chain (BSC) network is being queried.
-   `limit`: This parameter limits the number of events to retrieve. In this case, a limit of 10 events is being requested.
-   `orderBy`: This parameter specifies the field and order to sort the events by. In this case, events are sorted in descending order by the block time.
-   `where`: This parameter specifies the conditions that events must meet to be included in the response. In this case, events are filtered to include only those that occurred after February 16th, 2023.


**Returned Data**
-   `dataset`: This parameter specifies the dataset to use. In this case, the "combined" dataset is being used.
-   `network`: This parameter specifies the network to query. In this case, the Binance Smart Chain (BSC) network is being queried.
-   `limit`: This parameter limits the number of events to retrieve. In this case, a limit of 10 events is being requested.
-   `orderBy`: This parameter specifies the field and order to sort the events by. In this case, events are sorted in descending order by the block time.
-   `where`: This parameter specifies the conditions that events must meet to be included in the response. In this case, events are filtered to include only those that occurred after February 16th, 2023.


## Daily Stats on Calls
This query retrieves the date and number of unique event calls for the date. 
You can find the query [here](https://graphql.bitquery.io/ide/Daily-Unique-Call-Count)

```graphql
query MyQuery {
  EVM(dataset: combined, network: bsc) {
    Events(
      where: {Block: {Date: {after: "2023-01-10"}}}
      orderBy: {descendingByField: "count(distinct: Call_Signature_Signature)"}
    ) {
      Block {
        Date
      }
      count_unique_calls: count(distinct: Call_Signature_Signature)
    }
  }
}


```

**Parameters**
-   `dataset`: This parameter specifies the dataset to use. In this case, the "combined" dataset is being used.
-   `network`: This parameter specifies the network to query. In this case, the Binance Smart Chain (BSC) network is being queried.
- `where`: Filters the results to only include blocks that occurred after a specific date. 
 - `orderBy`: Orders the results in descending order based on the number of unique event call signatures in  each block. 
- `descendingByField`: Specifies that we want to sort the results in descending order.


**Returned Data**
 - `Date`: Returns the date
 - `count_unique_calls`: Returns the number of unique event calls

