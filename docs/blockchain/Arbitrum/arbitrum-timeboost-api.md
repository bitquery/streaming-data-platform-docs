---
sidebar_position: 11
---

# Arbitrum TimeBoost API & Streams

Arbitrum sequencers traditionally ordered transactions on a first-come-first-serve (FCFS) basis. **TimeBoost** introduced an auction-driven priority lane that lets searchers bid for earlier inclusion. With Bitquery’s Stream you can subscribe to every call that interacts with the TimeBoost auction contract and correlate it with other Arbitrum insights described in our [Arbitrum Overview](./Overview.md).


## Real-time subscription

Use the following subscription in the Bitquery IDE to watch every TimeBoost auction interaction. The query filters on the auction contract address and surfaces both transaction context and decoded ABI arguments.

[Run this stream](https://ide.bitquery.io/Arbitrum-Timeboost-Auction-Transactions-in-Realtime)

```graphql
subscription {
  EVM(network: arbitrum) {
    Events(
      where: {
        Transaction: { To: { is: "0x5fcb496a31b7AE91e7c9078Ec662bd7A55cd3079" } }
      }
    ) {
      Block {
        Number
      }
      Call {
        CallPath
        InternalCalls
        Signature {
          Name
        }
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
      Arguments {
        Name
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
        }
      }
    }
  }
}
```
