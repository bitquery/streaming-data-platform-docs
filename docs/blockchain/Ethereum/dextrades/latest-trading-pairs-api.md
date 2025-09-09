---
sidebar_position: 4
---

# Getting Latest Pairs

## Latest Trading Pairs for a DEX

Let's see how we can get latest trading pairs created on DEXs. In this example we use Smart Contract Events to track PoolCreated event for [Uniswap v3 factory contract](https://explorer.bitquery.io/ethereum/smart_contract/0x1f98431c8ad98523631ae4a59f267346ea31f984/events). Because whenever a new pool gets created Uniswap v3 factory contract emits a PoolCreated event with the details of the pool. 

```graphql
{
  EVM(dataset: realtime, network: eth) {
    Events(
      orderBy: {descending: Block_Number}
      limit: {count: 10}
      where: {Log: {SmartContract: {is: "0x1f98431c8ad98523631ae4a59f267346ea31f984"}, Signature: {Name: {is: "PoolCreated"}}}}
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
        Name
        Value {
          __typename
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
        }
      }
    }
  }
}


```

Open this query on our GraphQL IDE using this [link](https://ide.bitquery.io/uniswap-v3-pairs).

## Subscribe to the Latest Pairs for Uniswap V3

You can use our GraphQL Subscription (Webhook) to subscribe to these events in case you don't want to call our APIs periodically.

```graphql
subscription {
  EVM {
    Events(
      where: {Log: {SmartContract: {is: "0x1f98431c8ad98523631ae4a59f267346ea31f984"}, Signature: {Name: {is: "PoolCreated"}}}}
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
        Name
        Value {
          __typename
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
        }
      }
    }
  }
}

```

Open this query on our GraphQL IDE using this [link](https://ide.bitquery.io/uniswap-v3-pairs-websocket)
