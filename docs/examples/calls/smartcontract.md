---
sidebar_position: 2
---

# SmartContract Calls API


 This API helps retrieve information about smart contract transactions, including details about the contract function that was called, the input and output parameters, and more. With this data, you can build applications that interact with smart contracts, perform analytics on contract activity, and more.

 ##  Recent Smart Contract Calls

 ```graphql
query MyQuery {
  EVM(dataset: archive, network: bsc) {
    Calls(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {Block: {Date: {after: "2024-07-12"}}}
    ) {
      Call {
        LogCount
        InternalCalls
        Signature {
          Name
        }
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
      Arguments {
        Value {
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
        }
        Name
      }
    }
  }
}

```

**Parameters**

- `Calls`: This is a GraphQL method that retrieves data about smart contract calls on the specified blockchain network.

- `limit`: This parameter specifies the number of entries to return. In this example, we are setting the limit to 10, which means we will get the 10 most recent smart contract calls on the BSC network.

- `orderBy`: This parameter specifies how to order the result. In this example, we are ordering the result by the Block_Date field in descending order, which means that the most recent calls will be returned first.

- `where`: This parameter specifies a filter condition to apply to the result. In this example, we are filtering the result to only include calls made after February 27th, 2023, using the after operator.

**Returned Data**

- `Call`: This is a GraphQL field that retrieves data about the smart contract call itself, such as the log count and internal calls.

- `Transaction`: This is a GraphQL field that retrieves data about the transaction that initiated the smart contract call, such as the gas used, hash, sender and receiver addresses, type, and index.

- `Block`: This is a GraphQL field that retrieves data about the block in which the smart contract call was included, such as the date and time of the block.


## Recent Smart Contract Creation Calls

This GraphQL query fetches data from the EVM (Ethereum Virtual Machine) dataset in the "eth" network about the 10 most recent calls made in Ethereum that were created after February 1st, 2023, that were contract creation calls.

```
query MyQuery {
  EVM(dataset: combined, network: eth) {
    Calls(
      limit: {count: 10}
      orderBy: {descending: Block_Date}
      where: {Block: {Date: {after: "2023-02-01"}}, Call: {Create: true}}
    ) {
      Call {
        LogCount
        InternalCalls
        Create
        EnterIndex
        ExitIndex
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

**Parameters**

- `network` argument is set to eth, which specifies that only data from the Ethereum network should be included.
- `Calls` field specifies that information about calls should be retrieved.
- `limit` argument is set to {count: 10}, which specifies that only the 10 most recent calls should be returned.
- `orderBy` argument is set to {descending: Block_Date}, which specifies that the calls should be ordered in descending order based on their associated block date.
- `where` argument is used to filter the results based on certain criteria:
- `Block` object is used to filter based on the associated block.
- `Date` field within the Block object is filtered using the after operator to only include blocks created after February 1st, 2023.
- `Call` object is used to filter based on the call itself.
- `Create` field within the Call object is filtered to only include calls that were contract creation calls (i.e., with a true value).

**Returned Data**

- `LogCount`: The number of logs associated with the call.
- `InternalCalls`: The number of internal calls made within the call.
- `Create`: A boolean value indicating whether the call was a contract creation call (i.e., with a value of true).
- `EnterIndex`: The index of the call in the list of calls made within the associated transaction.
- `ExitIndex`: The index of the call in the list of calls made within the associated transaction.
