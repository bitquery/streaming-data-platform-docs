---
title: "Optimism NFT API"
description: "Get NFT data through our powerful and highly scalabe NFT API. Access all information about pricing history, NFT balances, and NFT trades"
---
# Optimism NFT API

In this section we'll have a look at some examples using the Optimism NFT data API.

## Track transfers of an NFT in Realtime on Optimism

This query subscribes you to the real time transfers of a specific non-fungible token (NFT) on the Optimism blockchain.

You can find the query [here](https://ide.bitquery.io/Transfers-of-a-particular-NFT#)

```
subscription {
  EVM(network: optimism) {
    Transfers(
      where: {
        Transfer: {
          Currency: {
            Fungible: false
            SmartContract: { is: "0x57aDd45EA2818fb327C740d123B366955E27d321" }
          }
        }
      }
    ) {
      Block {
        Hash
        Number
      }
      Transfer {
        Amount
        Currency {
          Name
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
