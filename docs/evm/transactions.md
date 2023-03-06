---
sidebar_position: 5
---

# Transactions

The Transactions API provides detailed information on transactions including call count, gas, hash, type, and sender and recipient addresses etc. Here's a sample query to get started. You can see more examples [here](/docs/category/transfers)



    query MyQuery {
      EVM(dataset: realtime, network: bsc) {
        Transactions(
          limit: {count: 10}
          orderBy: {descending: Block_Time}
          where: {Block: {Date: {after: "2023-02-05"}}}
        ) {
          Transaction {
            CallCount
            Gas
            Hash
            Type
            To
            From
          }
          Block {
            Date
          }
          TransactionStatus {
            Success
            FaultError
            EndError
          }
        }
      }
    }

### Parameters:

-   `limit`: Limits the number of transactions returned in the query. In this case, it is set to 10.
-   `orderBy`: Specifies the field to order the results by. In this case, it is ordered in descending order based on block time.
-   `where`: Filters the results based on specific criteria. In this case, it returns transactions that occurred after February 5, 2023.

### Returns:

-   `Transaction`: Contains information about the transaction, including call count, gas, hash, type, and sender and recipient addresses.
-   `Block`: Contains information about the block that the transaction was included in, including the date of the block.
-   `TransactionStatus`: Contains information about the transaction status, including whether it was successful, and if there were any errors.
