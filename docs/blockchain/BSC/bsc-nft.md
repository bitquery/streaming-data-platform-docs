---
title: "BSC NFT API"
description: "Get NFT data through our powerful and highly scalabe NFT API. Access all information about pricing history, NFT balances, and NFT trades"
---
# BSC NFT API

In this section we'll have a look at some examples using the BSC NFT API.

## Track Transfers of a specific NFT on BSC in Realtime

This query subscribes you to the real time non-fungible token (NFT) transfers of a specific nft contract on the BSC network.
You can find the query [here](https://ide.bitquery.io/Track-realtime-NFT-Transfers-of-a-specific-NFT-on-BSC-chain)

```
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
