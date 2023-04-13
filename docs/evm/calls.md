---
sidebar_position: 6
---

# Smart Contract Calls

Calls API provides details about smart contract calls, arguments, callers, etc.

This api gives detailed information about the smart contract calls, including raw data, and supports [Opcodes](https://github.com/crytic/evm-opcodes).

The API allows different filters to query the Smart contract calls details from different dimensions. 
You can find more examples [here](../examples/calls/smartcontract)

Here's a sample query to get started.


```graphql
{
  EVM(dataset: combined, network: eth) {
    Calls(
      limit: {count: 1}
      where: {Call: {Signature: {Name: {is: "swap"}}, From: {is: "0x000000000000084e91743124a982076c59f10084"}}}
    ) {
      Call {
        From
        To
        CallPath
        CallerIndex
        Create
        Delegated
        Depth
        EnterIndex
        Error
        ExitIndex
        Gas
        GasUsed
        Index
        Input
        InternalCalls
        LogCount
        Opcode {
          Code
          Name
        }
        Output
        Reverted
        SelfDestruct
        Signature {
          Abi
          Name
          Parsed
          Signature
          SignatureHash
          SignatureType
        }
        Success
      }
      Arguments {
        Type {
          Name
          Type
        }
        Value {
          String
        }
      }
    }
  }
}

```

Calls contain the arguments and return values as arrays, refer to [arguments](./arguments) for data structure.

