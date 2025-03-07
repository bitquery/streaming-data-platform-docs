---
sidebar_position: 2
---

# Events API

The Event API gives you access real-time blockchain event data. Events represent changes to the state of a blockchain, such as transactions, token transfers, or contract creations.

## Mempool Events on Ethereum

This query listens to real-time mempool events on the Ethereum (ETH) blockchain. The query is designed to capture details of transactions, logs, events, and arguments from the Ethereum Virtual Machine (EVM) before they are confirmed in a block.
You can run it [here](https://ide.bitquery.io/Mempool-event-stream)

```
subscription {
  EVM(network: eth, mempool: true) {
    Events {
      Call {
        CallPath
        InternalCalls
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
      Log {
        Signature {
          Name
        }
        SmartContract
      }
      Arguments {
        Name
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

## Recent Events

This query is used to retrieve recent events' data on the Binance Smart Chain (BSC) network. You can find the query [here](https://graphql.bitquery.io/ide/Recents-Events). The query returns details on each event include transaction details like hash, sender, call trace and event logs.

```graphql
query MyQuery {
  EVM(dataset: archive, network: bsc) {
    Events(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: { Block: { Date: { after: "2023-10-16" } } }
    ) {
      Block {
        Number
      }
      Call {
        CallPath
        InternalCalls
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
      Log {
        Signature {
          Signature
        }
        SmartContract
      }
    }
  }
}
```

**Parameters**

- `dataset`: This parameter specifies the dataset to use. In this case, the "combined" dataset is being used.
- `network`: This parameter specifies the network to query. In this case, the Binance Smart Chain (BSC) network is being queried.
- `limit`: This parameter limits the number of events to retrieve. In this case, a limit of 10 events is being requested.
- `orderBy`: This parameter specifies the field and order to sort the events by. In this case, events are sorted in descending order by the block time.
- `where`: This parameter specifies the conditions that events must meet to be included in the response. In this case, events are filtered to include only those that occurred after February 16th, 2023.

## Daily Stats on Calls

This query retrieves the date and number of unique event calls for the date.
You can find the query [here](https://graphql.bitquery.io/ide/Daily-Unique-Call-Count)

```graphql
query MyQuery {
  EVM(dataset: archive, network: bsc) {
    Events(
      where: { Block: { Date: { after: "2023-01-10" } } }
      orderBy: {
        descendingByField: "count(distinct: Call_Signature_Signature)"
      }
    ) {
      Block {
        Date
      }
      count_unique_calls: count(distinct: Call_Signature_Signature)
    }
  }
}
```

**Parameters**

- `dataset`: This parameter specifies the dataset to use. In this case, the "combined" dataset is being used.
- `network`: This parameter specifies the network to query. In this case, the Binance Smart Chain (BSC) network is being queried.
- `where`: Filters the results to only include blocks that occurred after a specific date.
- `orderBy`: Orders the results in descending order based on the number of unique event call signatures in each block.
- `descendingByField`: Specifies that we want to sort the results in descending order.

**Returned Data**

- `Date`: Returns the date
- `count_unique_calls`: Returns the number of unique event calls

### Track all AAVE V3 Events

The query below shows latest 10 events emitted by the AAVE V3 contract. The `Log` field in the results will contain information about the event, including its signature, smart contract address, and transaction hash. The `Arguments` field will contain the values of any arguments that were passed to the event.
You can find the query [here](https://ide.bitquery.io/All-aave-v3-events-latest)

```
{
  EVM(dataset: realtime, network: eth) {
    Events(
      orderBy: {descending: Block_Time}
      limit: {count: 10}
      where: {Transaction: {To: {is: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2"}}}
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
        From
      }
      Block {
        Date
        Number
        Hash
        Time
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Integer_Value_Arg {
            integer
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

## Staking and Rewards

To get Staking-related information, we will be using the "Staked" signature to filter the events and logs. Each event contains information about the block number, transaction details (sender, receiver, hash, and type), log signature, smart contract involved, and specific arguments related to the staking actions, such as user addresses and staked amounts.

You can find the query [here](https://ide.bitquery.io/Latest-Token-Stake-Events)

```
query MyQuery {
  EVM(dataset: archive, network: eth) {
    Events(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {Block: {Date: {after: "2023-11-16"}}, Log: {Signature: {Name: {is: "Staked"}}}}
    ) {
      Block {
        Number
      }
      Transaction {
        From
        To
        Type
        Hash
      }
      Log {
        Signature {
          Name
          SignatureHash
          Signature
        }
        SmartContract
      }
      Arguments {
        Name
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

## Subscribe to the Same Event Across Multiple Contracts

In the below query we listen for a specific event (Approval) across multiple smart contracts on the Ethereum (ETH) network. Run the query [here](https://ide.bitquery.io/Subscribe-to-the-Same-Event-Across-Multiple-Contracts)

```
subscription {
  EVM(network: eth) {
    Events(
      where: {Log: {Signature: {Name: {is: "Approval"}}, SmartContract: {in: ["0x943af17c37207c9d7a27d12cb5055542a0b7afa8","0x3b62021a8b9fc78106f964853dc375933ab71a06"]}}}
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
        From
        To
        ValueInUSD
        Value
        Type
      }
      Log {
        Signature {
          Name
        }
        SmartContract
      }
    }
  }
}


```

## Latest Liquidity Removal on Uniswap

This query retrieves the most recent liquidity removal events (Burn events) on Uniswap. It includes details about the transaction, block, log, and arguments. You can run the query [here](https://ide.bitquery.io/uniswap-v2-liquidity-removed)

```
{
  EVM(network: eth, dataset: combined) {
    Events(
      limit: {count: 100}
      where: {Transaction: {To: {is: "0x7a250d5630b4cf539739df2c5dacb4c659f2488d"}}, Log: {Signature: {Name: {in: ["Burn"]}}}}
    ) {
      Transaction {
        Hash
        From
        To
      }
      Block {
        Number
      }
      Log {
        Signature {
          Name
        }
        SmartContract
      }
      Transaction {
        From
        To
        Type
      }
      LogHeader {
        Address
        Index
      }
      Arguments {
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
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
        }
        Name
      }
    }
  }
}

```

## Subscribe to All Swap Events

This subscription provides information on the latest real-time swap events on Ethereum. You can run it [here](https://ide.bitquery.io/all-swap-events)

```
subscription {
  EVM(network: eth) {
    Events(where: {Log: {Signature: {Name: {in: ["swap", "Swap"]}}}}) {
      Log {
        SmartContract
        Signature {
          Name
        }
      }
      Transaction {
        From
        To
        ValueInUSD
        Value
        Type
      }
      Arguments {
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
        Name
      }
    }
  }
}
```

## Get All Chef Fun Swaps

Chefdotfun, similar to platforms like Pumpfun and Sunpump, is a token creation platform on the Ethereum network. This query retrieves the latest Chefdotfun swap transactions by filtering event logs related to the smart contract.
You can run the query [here](https://ide.bitquery.io/Latest-chefdog-swaps)

```
query MyQuery {
  EVM(dataset: combined, network: eth) {
    Events(
      where: {Log: {SmartContract: {is: "0x4ba1970f8d2dda96ebfbc466943fb0dfaab18c75"}, Signature: {Name: {in: ["swap","Swap"]}}}}
      orderBy: {descending: Block_Time}
      limit: {count: 100}
    ) {
      Log {
        SmartContract
        Signature {
          Name
        }
      }
      Transaction {
        From
        To
        ValueInUSD
        Value
        Type
      }
      Arguments {
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
        Name
      }
    }
  }
}

```
