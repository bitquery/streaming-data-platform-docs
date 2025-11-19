---
sidebar_position: 1
---

# ERC20 Token Transfers API

One of the most common types of transfers on Ethereum are ERC20 transfers. Let's see an example to get the latest ERC20 transfers using our API. Today we are taking an example of USDT token transfers. The contract address for the USDT token is [0xdac17f958d2ee523a2206206994597c13d831ec7](https://explorer.bitquery.io/ethereum/token/0xdac17f958d2ee523a2206206994597c13d831ec7)

```graphql
{
  EVM(dataset: realtime, network: eth) {
    Transfers(
      where: {
        Transfer: {
          Currency: {
            SmartContract: { is: "0xdac17f958d2ee523a2206206994597c13d831ec7" }
          }
        }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Transfer {
        Amount
        Currency {
          Name
          Symbol
        }
        Receiver
        Sender
        Type
      }
    }
  }
}
```

Open this query on IDE using this [link](https://ide.bitquery.io/UDST-Token-Transfers-on-Ethereum_2).

## Subscribe to the latest ERC20 token transfers

Using our GraphQL interface, you can also subscribe to the latest ERC20 token transfers using GraphQL subscriptions (Webhook). Let's see an example of how to subscribe to the latest WETH token ([0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2](https://explorer.bitquery.io/ethereum/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)) transfers.

```graphql
subscription {
  EVM(network: eth, trigger_on: head) {
    Transfers(
      where: {
        Transfer: {
          Currency: {
            SmartContract: { is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" }
          }
        }
      }
      orderBy: { descending: Block_Time }
    ) {
      Transaction {
        Hash
      }
      Transfer {
        Amount
        Currency {
          Name
          Symbol
        }
        Receiver
        Sender
        Type
      }
    }
  }
}
```

Open this query on our GraphQL IDE using this [link](https://graphql.bitquery.io/ide/Subscribe-to-Latest-WETH-token-transfers).

## Sender or Receiver is a particular address

This query retrieves transfers where the sender or receiver is a particular address. To implement the OR logic, we utilize the `any` option and specify the two conditions within `[]` that should be combined using the OR operator. In this case we mention either the sender OR receiver should be `0x881d40237659c251811cec9c364ef91dc08d300c`.

You can find the query [here](https://ide.bitquery.io/Sender-OR-Receiver-Transfer-on-Ethereum)

```graphql

 query MyQuery {
  EVM(dataset: archive, network: eth) {
    Transfers(
      where: {any: [{Transfer: {Sender: {is: "0x881d40237659c251811cec9c364ef91dc08d300c"}}}, {Transfer: {Receiver: {is: "0x881d40237659c251811cec9c364ef91dc08d300c"}}}], Block: {Number: {eq: "23814227"}}}
      limit: {count: 100}
      orderBy: {descending: Block_Time}
    ) {
      Transfer {
        Amount
        Sender
        Receiver
        Currency {
          Symbol
          Name
        }
      }
      Transaction {
        Hash
        From
        To
        Index
      }
      Block {
        Number
        Time
      }
    }
  }
}

```

## Addresses that received or sent money from given list of of addresses

In this query we use `$addresses` which is a list of addresses to which funds have been sent/received.
An `any` filter is used to establish an OR condition, targeting two scenarios:

1.  Addresses that acted as senders but not as receivers.
2.  Addresses that acted as receivers but not as senders.

The query retrieves two subsets of addresses based on their roles in transfers:

- `Transfer_Sender`: A list of addresses that have sent funds.
- `Transfer_Receiver`: A list of addresses that have received funds.

It then applies the `array_intersect` function to find common addresses between these two subsets that has sent/received funds to **every** address in the list of `$addresses`.

You can run the query [here](https://ide.bitquery.io/array_intersect-example-for-2-addresses_2)

```graphql
query ($addresses: [String!]) {
  EVM(dataset: archive) {
    Transfers(
      where: {any: [{Transfer: {Sender: {in: $addresses}}}, {Transfer: {Receiver: {in: $addresses}}}], Block: {Date: {after: "2024-04-01"}}}
    ) {
      array_intersect(
        side1: Transfer_Sender
        side2: Transfer_Receiver
        intersectWith: $addresses
      )
    }
  }
}
{
  "addresses": ["0x21743a2efb926033f8c6e0c3554b13a0c669f63f","0x107f308d85d5481f5b729cfb1710532500e40217"]
}
```

## Top Transfers of a token

This query retrieves the top 10 transfers of the token `0xB8c77482e45F1F44dE1745F52C74426C631bDD52`. Try the query [here](https://ide.bitquery.io/Copy-of-top-transfers-of-a-token-on-Ethereum)

```graphql
query MyQuery {
  EVM(dataset: archive) {
    Transfers(
      where: {
        Transfer: {
          Currency: {
            SmartContract: { is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" }
          }
        }
        TransactionStatus: { Success: true }
        Block: { Date: { is: "2024-06-29" } }
      }
      orderBy: { descending: Block_Time }
      limit: { count: 10 }
    ) {
      Transfer {
        Amount
        AmountInUSD
        Currency {
          Name
          Symbol
          SmartContract
        }
        Success
        Sender
        Receiver
        Index
        Id
      }
      Transaction {
        To
        Hash
        Value
        Type
        GasPrice
        Gas
        From
        Cost
      }
      Log {
        Signature {
          Signature
          Name
        }
        SmartContract
      }
      Call {
        From
        To
        Value
        Signature {
          Name
        }
      }
      Block {
        Number
        Time
      }
    }
  }
}
```

## Earliest Transfer to a Wallet

This query retrieves the earliest transfer received by a specific wallet address. By using `limit: {count: 1}` and `Time(minimum:Block_Number)`, we can identify the first transfer to an address during the specified time period.

[Run Query](https://ide.bitquery.io/Copy-of-find-earliest-transfer-to-an-account)

```graphql

query MyQuery {
  EVM(network: eth, dataset: archive) {
    Transfers(
      limit: {count: 1}
      where: {Transfer: {Receiver: {is: "0xe37b87598134a2fc0Eda4d71a3a80ad28C751Ed7"}}}
    ) {
      Block {
        Time(minimum: Block_Number)
      }
      Transaction {
        From
        Hash
      }
      Transfer {
        Amount
        Currency {
          Native
        }
      }
    }
  }
}



```
