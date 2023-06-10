---
sidebar_position: 3
---

# NFT Transfer API

The NFT Transfer API provides access to diverse NFT transfer data on supported blockchains and have various use cases. For instance we can retrieve daily transfers, monitor top NFT transfers, track the latest transfers of specific NFTs, and subscribe to real-time transfers for instant updates etc.

## Daily NFT Transfers

Here's an example query that retrieves the daily NFT transfers, providing the quantity of transfers occurring on a day-to-day basis within a specified date range.

```graphql 
{
  EVM(dataset: combined, network: eth) {
    Transfers(
      orderBy: {ascending: Block_Date}
      where: {Block: {Date: {since: "2023-05-02", till: "2023-05-09"}}, Transfer: {Currency: {Fungible: false}}}
    ) {
      Block {
        Date
      }
      count
    }
  }
}
```

**Parameters**

-   `network` : Specifies the Ethereum network.
-   `dataset` : Indicates the [combined](/docs/graphql/dataset/combined) dataset to be used. 
-   `orderBy` : Orders the results in ascending order based on the Block_Date.
-   `where` : It filters the results based on the specified conditions. In this case, it selects transfers where currency is non-fungible and block date is between "2023-05-02" and "2023-05-09".

**Returned Data**

-  `count` : The count of NFT transfers that occurred within the specified date range.
-  `Block` : The `date` specifies the date of the block associated with each transfer.

You can find the graphql query [here](https://ide.bitquery.io/NFT-Token-Transfers-By-Date).

## Top Transferred NFT on Ethereum

This query fetches the most frequently transferred NFTs on the Ethereum Blockchain within the specified date range.

```graphql 
{
  EVM(dataset: combined network: eth){
    Transfers(
      orderBy: {descendingByField: "count"}
      limit: {offset: 10 count: 0}
      where: {
        Block: {Date: {since: "2023-05-02" till: "2023-05-09" }}
        Transfer: {Currency: {Fungible: false}}}
    ){
      Transfer {
        Currency {
          Symbol
          SmartContract
        }
      }
      count
      senders: uniq(of: Transfer_Sender method: approximate)
      receivers: uniq(of: Transfer_Receiver method: approximate)
      ids: uniq(of: Transfer_Id method: approximate)
    }
  }
}
```

You can find the graphql query [here](https://ide.bitquery.io/Top-transfered-NFT-tokens-in-network).

## Recent Transfers of an NFT

Using this query, we can retrieve the most recent transfers of an NFT, ordered by block time.  Includes details such as transfer amount, currency information, sender, receiver, transfer type, NFT ID, and more.
```graphql 
{
  EVM(dataset: archive, network: eth) {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "0xdba45c28b32f2750bdc3c25d6a0118d8e1c8ca80"}}}}
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
        Id
        URI
        Data
      }
    }
  }
}
```

You can find the graphql query [here](https://ide.bitquery.io/latest-nft-transfers).

## Latest NFT transfers Involving Specific User

This query retrieves the latest transfers of an NFT involving a specific user. The `sent` field retrieves transfers where the user is the sender, while the `recieved` field retrieves transfers where the user is the receiver. 
```graphql 
{
  EVM(dataset: archive, network: eth) {
    sent: Transfers(
      where: {Transfer: {Sender: {is: "0x415bdfed5a7c490e1a89332648d8eb339d4eea69"}}}
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
        Id
        URI
      }
    }
    recieved: Transfers(
      where: {Transfer: {Receiver: {is: "0x415bdfed5a7c490e1a89332648d8eb339d4eea69"}}}
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
        Id
        URI
      }
    }
  }
}

```

You can find the graphql query [here](https://ide.bitquery.io/latest-nft-transfers-by-a-user).

## Realtime NFT Transfer Subscriptions

Using Streaming APIs, you can subscribe to real-time changes on blockchains. We use a GraphQL subscription,which function similarly to WebSockets. Below example, shows how to subscribe to the latest transfers of the NFT token with the smart contract address `0xdba45c28b32f2750bdc3c25d6a0118d8e1c8ca80`.

```graphql 
subscription {
  EVM(network: eth, trigger_on: head) {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "0xdba45c28b32f2750bdc3c25d6a0118d8e1c8ca80"}}}}
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
        Id
        URI
        Data
      }
    }
  }
}
```

You can find the graphql query [here](https://ide.bitquery.io/Subscription-WebSocket---Latest-NFT-Transfers).