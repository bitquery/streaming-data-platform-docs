---
sidebar_position: 4
---

# Pair Creation APIs

## Pair Creation Time for a Specific Pair

Let's see how we can get pair creation time for a specific pair. We will use Events API for this. Filter for `PairCreated` event and also put one more filter, for which pair address you want the creation time. We have used `0x5c6919B79FAC1C3555675ae59A9ac2484f3972F5` pair address in our example.

Open this query on our GraphQL IDE using this [link](https://ide.bitquery.io/when-a-pair-was-created-for-EVM).

```graphql
query MyQuery {
  EVM(network: eth, dataset: combined) {
    Events(
      where: {
        Log: { Signature: { Name: { is: "PairCreated" } } }
        TransactionStatus: { Success: true }
        Arguments: {
          includes: {
            Value: {
              Address: { is: "0x5c6919B79FAC1C3555675ae59A9ac2484f3972F5" }
            }
          }
        }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
    }
  }
}
```

## Track newly created pairs on uniswap v3

You can track newly created pairs on uniswap v3.

Open this query on our GraphQL IDE using this [link](https://ide.bitquery.io/Latest-pools-created-Uniswap-v3_9).

```graphql
subscription {
  EVM(network: eth) {
    Events(
      orderBy: { descending: Block_Number }
      limit: { count: 10 }
      where: {
        Log: {
          SmartContract: { is: "0x1f98431c8ad98523631ae4a59f267346ea31f984" }
          Signature: { Name: { is: "PoolCreated" } }
        }
      }
    ) {
      Log {
        Signature {
          Name
          Parsed
          Signature
        }
        SmartContract
      }
      Transaction {
        Hash
      }
      Block {
        Date
        Number
      }
      Arguments {
        Type
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
