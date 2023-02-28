---
sidebar_position: 2
---

# SmartContract Calls API


 This API helps retrieve information about smart contract transactions, including details about the contract function that was called, the input and output parameters, and more. With this data, you can build applications that interact with smart contracts, perform analytics on contract activity, and more.

 ##  Recent Smart Contract Calls

 ```
 query MyQuery {
  EVM(dataset: combined, network: bsc) {
    Calls(
      limit: {count: 10}
      orderBy: {descending: Block_Date}
      where: {Block: {Date: {after: "2023-02-27"}}}
    ) {
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
- `Calls`: This is a GraphQL method that retrieves data about smart contract calls on the specified blockchain network.

- `limit`: This parameter specifies the number of entries to return. In this example, we are setting the limit to 10, which means we will get the 10 most recent smart contract calls on the BSC network.

- `orderBy`: This parameter specifies how to order the result. In this example, we are ordering the result by the Block_Date field in descending order, which means that the most recent calls will be returned first.

- `where`: This parameter specifies a filter condition to apply to the result. In this example, we are filtering the result to only include calls made after February 27th, 2023, using the after operator.

- `Call`: This is a GraphQL field that retrieves data about the smart contract call itself, such as the log count and internal calls.

- `Transaction`: This is a GraphQL field that retrieves data about the transaction that initiated the smart contract call, such as the gas used, hash, sender and receiver addresses, type, and index.

- `Block`: This is a GraphQL field that retrieves data about the block in which the smart contract call was included, such as the date and time of the block.
