---
sidebar_position: 6
---

# Smart Contract Calls

Calls API provide details about smart contracts call, arguments etc. 

This api gives detailed information about the smart contract calls including raw data and It also support [Opcodes](https://github.com/crytic/evm-opcodes).

Let's see an example.

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

You can see more example of BalanceUpdates api in [here](docs/examples/balances/balance-api.md) and [here](docs/examples/nft/nft-api.md)