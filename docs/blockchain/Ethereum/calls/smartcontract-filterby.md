---
sidebar_position: 1
---

# SmartContract API

## Smart Contract Calls by Method Signature



This query retrieves the 10 most recent smart contract calls that match a specific function signature (harvest()) on the Binance Smart Chain (BSC) network. It also includes transaction and block data associated with each call. 
You can find the GraphQL query [here](https://graphql.bitquery.io/ide/Calls-by-Method-Signature)


```
query MyQuery {
  EVM(dataset: archive, network: bsc) {
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

**Parameters**
- `EVM(dataset: archive, network: bsc)`: This parameter specifies the blockchain network and dataset to query. In this case, we are querying the Binance Smart Chain network with the [combined](/docs/graphql/dataset/combined) dataset.
- `Calls`: This parameter retrieves the list of smart contract calls that match the specified conditions.
- `limit`: {count: 10}: This parameter limits the number of results returned to 10.
- `orderBy`: {descending: Block_Date}: This parameter orders the results in descending order based on the block date of the calls.
- `where: {Call: {Signature: {Signature: {is: "harvest()"}}}, Block: {Date: {after: "2023-01-01"}}}:` This parameter specifies the conditions to filter the smart contract calls. In this case, we filter calls based on the function signature harvest() and a block date after January 1, 2023.

**Returned Data**

The query returns the following data for each smart contract call:

- `Call.LogCount`: The number of log entries emitted by the call.
- `Call.InternalCalls`: The list of internal calls made by the call.
- `Gas`: The amount of gas used by the transaction.
- `Hash`: The hash of the transaction.
- `From`: The address of the sender of the transaction.
- `To`: The address of the receiver of the transaction.
- `Type`: The type of the transaction (e.g., contract creation or message call).
- `Index`: The index of the transaction within the block.
- `Block.Date`: The date and time when the block was added to the blockchain.

## Smart Contract Calls by Opcode


This GraphQL query retrieves information about the latest STATICCALL EVM (Ethereum Virtual Machine) calls on the Binance Smart Chain network.
You can find the GraphQL query [here](https://graphql.bitquery.io/ide/Smart-Contract-Calls-by-Opcode)

```
query MyQuery {
  EVM(dataset: archive, network: bsc) {
    Calls(
      limit: {count: 10}
      orderBy: {descending: Block_Date}
      where: {Block: {Date: {after: "2023-01-01"}}, Call: {Opcode: {Name: {is: "STATICCALL"}}}}
    ) {
      Call {
        LogCount
        InternalCalls
        Opcode {
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
    }
  }
}
```

**Parameters**

- `dataset` parameter specifies the dataset to be queried, which is set to combined.
- `network` parameter specifies the network to be queried, which is set to bsc.
- `limit` parameter is used to limit the number of results returned and is set to 10.
- `orderBy` parameter is used to sort the results by the Block_Date field in descending order.
- `where` parameter is used to filter the results based on certain conditions. In this case, the where parameter filters the results to include only STATICCALL calls made after January 1st, 2023.


**Returned Data**

- `Call`: Returns information about the STATICCALL call, including the number of logs generated, internal calls made, and the name of the opcode used.
- `Transaction`: Returns information about the transaction that contains the STATICCALL call, including the gas used, transaction hash, sender address, recipient address, transaction type, and transaction index.
- `Block`: Returns the date of the block in which the STATICCALL call was made.

## Smart Contract Calls by Arguments


The Array-like structure of [Arguments and Returns](https://docs.bitquery.io/docs/schema/evm/arguments/) in Smart Contract Calls allows us to insert specific filters, enabling us to effectively narrow down our search. Further we can better understand the details of smart contract interactions in specific contexts.

**Example 1**

This [query](https://ide.bitquery.io/smart_contract_argument_transfer) demonstrates how we can trace transfer calls to a particular token contract, Matic Token in this case, that are being transferred to a specified wallet address. This is useful for monitoring the inflow of a specific token to a certain wallet.

```
query MyQuery {
  EVM(dataset: archive, network: eth) {
    Calls(
      where: {Call: {Signature: {Name: {is: "transfer"}}, To: {is: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0"}}, Arguments: {includes: {Index: {eq: 0}, Name: {is: "to"}, Type: {is: "address"}, Value: {Address: {is: "0xB53E1f6322629b9435E95AeC13eC34aF9C8fB8bA"}}}}}
      limit: {count: 10}
    ) {
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
        }
      }
      Returns {
        Type
        Value {
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
        }
      }
    }
  }
}
```

**Parameters**

- `dataset` : parameter specifies the combined dataset and `network` parameter specifies the network.
- `where`  : parameter sets filters on the function calls and arguments. The 'Signature' filter specifies "transfer" function calls made to Matic's token contract. The 'includes' filter under Arguments targets the recipient of the transfer (argument with index 0) with a specific wallet address.

**Returned Data**

The response includes the first 10 matching calls along with the arguments details and the return values for each call. 

As usual, you can adjust the filter values and arguments based on your specific use case.

**Example 2**

Let's consider a scenario where we're interested in tracking large liquidity additions to a specific Uniswap pair, like the ETH/USDT pair.

By [this](https://ide.bitquery.io/addLiquidityETH_function) query, We can track calls to the function ` addLiquidityETH ` which is a common function used in Uniswap for adding liquidity to a pool.

```
query MyQuery {
  EVM(dataset: archive, network: eth) {
    Calls(
      where: {Transaction: {Hash: {is: "0x60ce9acd0053f20092e7871868afe5187c95ff6d7750ad65a8d4ff99a052c357"}}, Call: {Signature: {Name: {is: "addLiquidityETH"}}}, Arguments: {length: {eq: 6}, includes: [{Index: {eq: 0}, Value: {Address: {is: "0x9cbc0be914e480beee4014e190fdbfc48ed5a4a8"}}}, {Index: {eq: 3}, Value: {BigInteger: {ge: "1000000000000000000"}}}, {Index: {eq: 5}, Value: {BigInteger: {ge: "1690878863"}}}]}}
      limit: {count: 10}
    ) {
      Arguments {
        Index
        Name
        Type
        Path {
          Name
          Index
          Type
        }
        Name
        Value {
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
        }
      }
      Call {
        Signature {
          Name
          Signature
        }
      }
    }
  }
}
```

**Parameters**

- `dataset` : parameter specifies the combined dataset and `network` parameter specifies the network
- `where` : parameter mentions the filters on the Call and Arguments. The 'Signature' filter specifies that we want function calls where the function name is "addLiquidityETH".The 'includes' filter under Arguments specifies that we want the first argument (Index 0) to be the specific token contract address, the third argument (Index 3) 'uint256' value greater than or equal to 1000000000000000000, and the last argument (Index 5) to be a deadline timestamp that is greater than or equal to "1690878863".

**Returned Data**

The response will contain the first 10 calls that match these filter conditions, along with the details of the arguments and the function signature of each call. 