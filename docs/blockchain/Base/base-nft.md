---
title: "Base NFT Trades and Metadata API"
description: "Base NFT API: track Base NFT trades, ownership, and metadata with Bitquery GraphQL and streams. Includes filters and field selection tips."
---
# Base Chain NFT API

In this section we'll have a look at some examples on how to get NFT information on Base using the NFT API.

## Track transfers of an NFT

This query subscribes you to the real time transfers of a specific non-fungible token (NFT) on the Base network.
You can find the query [here](https://ide.bitquery.io/Transfers-of-a-particular-NFT_1#)

```
subscription {
  EVM(network: base) {
    Transfers(
      where: {
        Transfer: {
          Currency: {
            Fungible: false
            SmartContract: { is: "0x1195Cf65f83B3A5768F3C496D3A05AD6412c64B7" }
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
