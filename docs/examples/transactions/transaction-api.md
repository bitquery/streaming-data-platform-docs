---
sidebar_position: 1
---

# Transaction API

The Transaction API provides access to transaction data on the blockchain. Transactions are the fundamental unit of account on a blockchain and represent the transfer of value from one address to another.

The Transaction API allows users to query for transaction data by specifying filters such as transaction hash, sender or receiver address, gas price, and more. The API also provides information about the block that the transaction was included in, including block number and block timestamp.

## Latest Transactions

This query is using the Transactions API to retrieve transaction data from the Binance Smart Chain (BSC) blockchain network in real-time.
You can find the query [here](https://graphql.bitquery.io/ide/Last-transactions-with-cost)

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


**Parameters:**

-   `dataset`: The data source to be used by the query (in this case, "realtime")
-   `network`: The blockchain network to be queried (in this case, "bsc")
-   `limit`: Limits the number of returned results to 100.
-   `orderBy`: Sorts the results by two fields, in descending order: `Block_Number` and `Transaction_Index`.

**Results:**

-   `Block`: The block information of each transaction, including the block number and timestamp.
-   `Transaction`: The transaction hash and cost (gas used multiplied by the gas price
