---
title: "BNB Chain NFT API"
description: "Track BNB Chain NFT trades, ownership, and metadata with Bitquery GraphQL queries, filters, and real-time streaming options."
---
# BSC NFT API

In this section we'll have a look at some examples using the BSC NFT API.

## Track Transfers of a specific NFT on BSC in Realtime

This query subscribes you to the real time non-fungible token (NFT) transfers of a specific nft contract on the BSC network.
You can find the query [here](https://ide.bitquery.io/Track-realtime-NFT-Transfers-of-a-specific-NFT-on-BSC-chain)

```graphql
subscription {
  EVM(network: bsc) {
    Transfers(
      where: {Transfer: {Currency: {Fungible: false, SmartContract: {is: "0x3d2c83bbbbfb54087d46b80585253077509c21ae"}}}}
    ) {
      Block {
        Hash
        Number
      }
      Transfer {
        Amount
        Currency {
          Name
          SmartContract
          Symbol
          Native
        }
        Sender
        Receiver
      }
    }
  }
}

```
