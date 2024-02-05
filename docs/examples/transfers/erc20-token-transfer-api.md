---
sidebar_position: 1
---

# ERC20 Token Transfers API

One of the most common types of transfers on Ethereum are ERC20 transfers. Let's see an example to get the latest ERC20 transfers using our API. Today we are taking an example of USDT token transfers. The contract address for the USDT token is [0xdac17f958d2ee523a2206206994597c13d831ec7](https://explorer.bitquery.io/ethereum/token/0xdac17f958d2ee523a2206206994597c13d831ec7)


```graphql
{
  EVM(dataset: archive, network: eth) {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "0xdac17f958d2ee523a2206206994597c13d831ec7"}}}}
      limit: {count: 10}
      orderBy: {descending: Block_Time}
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


Open this query on IDE using this [link](https://graphql.bitquery.io/ide/UDST-Token-Transfers-on-Ethereum).

## Subscribe to the latest ERC20 token transfers

Using our GraphQL interface, you can also subscribe to the latest ERC20 token transfers using GraphQL subscriptions (Webhook). Let's see an example of how to subscribe to the latest WETH token ([0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2](https://explorer.bitquery.io/ethereum/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)) transfers.

```graphql
subscription {
  EVM(network: eth, trigger_on: head) {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}}}
      orderBy: {descending: Block_Time}
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

You can find the query [here](https://ide.bitquery.io/Sender-OR-Receiver-Transfer-Example-v2)

```
query MyQuery {
  EVM(dataset: archive, network: eth) {
    Transfers( where: {any: [{Transfer: {Sender: {is: "0x881d40237659c251811cec9c364ef91dc08d300c"}}}, 
 {Transfer: {Receiver: {is: "0x881d40237659c251811cec9c364ef91dc08d300c"}}}]}) {
      Transfer {
        Amount
        Sender
        Receiver
        Currency {
          Symbol
          Name
        }
      }
    }
  }
}

```
