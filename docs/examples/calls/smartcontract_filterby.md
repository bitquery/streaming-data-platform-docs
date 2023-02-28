---
sidebar_position: 1
---

# SmartContract API

## Smart Contract Calls by Method Signature



This query retrieves the 10 most recent smart contract calls that match a specific function signature (harvest()) on the Binance Smart Chain (BSC) network. It also includes transaction and block data associated with each call. 
You can find the GraphQL query [here](https://graphql.bitquery.io/ide/Calls-by-Method-Signature)

**Parameters**
- `EVM(dataset: combined, network: bsc)`: This parameter specifies the blockchain network and dataset to query. In this case, we are querying the Binance Smart Chain network with the combined dataset.
- `Calls`: This parameter retrieves the list of smart contract calls that match the specified conditions.
- `limit`: {count: 10}: This parameter limits the number of results returned to 10.
- `orderBy`: {descending: Block_Date}: This parameter orders the results in descending order based on the block date of the calls.
- `where`: {Call: {Signature: {Signature: {is: "harvest()"}}}, Block: {Date: {after: "2023-01-01"}}}: This parameter specifies the conditions to filter the smart contract calls. In this case, we filter calls based on the function signature harvest() and a block date after January 1, 2023.

```
query MyQuery {
  EVM(dataset: combined, network: bsc) {
    Calls(
      limit: {count: 10}
      orderBy: {descending: Block_Date}
      where: {Call: {Signature: {Signature: {is: "harvest()"}}}, Block: {Date: {after: "2023-01-01"}}}
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

**Returned Data**

The query returns the following data for each smart contract call:

- `Call.LogCount`: The number of log entries emitted by the call.
- `Call.InternalCalls`: The list of internal calls made by the call.
- `Transaction.Gas`: The amount of gas used by the transaction.
- `Transaction.Hash`: The hash of the transaction.
- `Transaction.From`: The address of the sender of the transaction.
- `Transaction.To`: The address of the receiver of the transaction.
- `Transaction.Type`: The type of the transaction (e.g., contract creation or message call).
- `Transaction.Index`: The index of the transaction within the block.
- `Block.Date`: The date and time when the block was added to the blockchain.

## Smart Contract Calls by Opcode
