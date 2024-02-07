---
sidebar_position: 2
---

# NFT Token Transfers API

Let's see how to get the latest NFT token transfers. We are taking Cryptokitties(CK) token example in the following query. The token address for Cryptokitties(CK) token is [0x06012c8cf97bead5deae237070f9587f8e7a266d](https://explorer.bitquery.io/ethereum/token/0x06012c8cf97bead5deae237070f9587f8e7a266d)

```graphql
{
  EVM(dataset: combined, network: eth) {
    Transfers(
      where: {
        Transfer: {
          Currency: {
            SmartContract: { is: "0x06012c8cf97BEaD5deAe237070F9587f8E7A266d" }
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
        Id
        URI
        Data
      }
    }
  }
}
```

Here is the [link](https://graphql.bitquery.io/ide/Cryptokitties-Token-Transfers) to the query on IDE.

## Subscribe to the latest NFT token transfers

Let's see an example of NFT token transfers using GraphQL Subscription (Webhook). In the following API, we will be subscribing to Axie Infinity (AXS) token transfers.

```graphql
subscription {
  EVM(network: eth, trigger_on: head) {
    Transfers(
      where: {
        Transfer: {
          Currency: {
            SmartContract: { is: "0xf5b0a3efb8e8e4c201e2a935f110eaaf3ffecb8d" }
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
        Id
        URI
      }
    }
  }
}
```

You can open this API on our GraphQL IDE using this [link](https://graphql.bitquery.io/ide/Subscribe-to-latest-Axie-infinity-token-transfers_1).

## Addresses that transfer NFTs to/from a list of addresses

The below query helps you track addresses that have transferred NFTs to or from a specified list of addresses.

1.  The `any` filter is used to establish an OR condition, targeting two scenarios:

    - Addresses that acted as senders but not as receivers.
    - Addresses that acted as receivers but not as senders.

2.  The `Transfer: {Currency: {Fungible: false}}` filter is used to specify that we are getting NFT transfers only.
3.  **Transfer_Sender and Transfer_Receiver**: The query retrieves two subsets of addresses based on their roles in transfers:

    - `Transfer_Sender`: A list of addresses that have sent NFTs.
    - `Transfer_Receiver`: A list of addresses that have received NFTs.

4.  **array_intersect Function**: This function is used to find common addresses between the sender and receiver subsets that have sent or received funds to **every** address in the list of `$addresses`.

Read more about using `array_intersect` [here](/docs/graphql/capabilities/array-intersect)

You can find the query [here](https://ide.bitquery.io/array_intersect-example-for-NFT).

```
query ($addresses: [String!]) {
  EVM(dataset: archive) {
    Transfers(
      where: {any: [{Transfer: {Sender: {in: $addresses}, Receiver: {notIn: $addresses}}}, {Transfer: {Receiver: {in: $addresses}, Sender: {notIn: $addresses}}}], Transfer: {Currency: {Fungible: false}}}
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
  "addresses": ["0x7f268357a8c2552623316e2562d90e642bb538e5"]
}
```
