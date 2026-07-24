---
title: "Polygon (MATIC) NFT API"
description: "Polygon (MATIC) NFT API: track Polygon NFT trades, ownership, and metadata with Bitquery GraphQL and streams. Keep queries fast with indexed filters."
---
# Polygon (MATIC) NFT API

In this section we'll have a look at some examples using the Matic NFT API.

## Track transfers of an NFT in Realtime

This query subscribes you to the real time transfers of a specific non-fungible token (NFT) on the Matic network.
You can find the query [here](https://ide.bitquery.io/Real-time-transfer-websocket-for-NFT-token-on-matic)

```graphql
subscription {
  EVM(network: matic) {
    Transfers(
      where: {
        Transfer: {
          Currency: {
            Fungible: false
            SmartContract: { is: "0x4d544035500D7aC1B42329c70eb58E77f8249f0F" }
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
