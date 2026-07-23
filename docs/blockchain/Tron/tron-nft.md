---
title: "Tron NFT API"
description: "Get NFT data through our powerful and highly scalabe NFT API. Access all information about pricing history, NFT balances, and NFT trades"
---
# Tron NFT API

In this section we'll have a look at some examples using the Tron NFT API.

## Track transfers of an NFT in Realtime on Tron

This query subscribes you to the real time transfers of a specific non-fungible token (NFT) on the Tron network.
You can find the query [here](https://ide.bitquery.io/Websocket-for-tracking-Transfers-of-a-particular-NFT-websocket)

```
subscription{
  Tron {
    Transfers(
      where: {Transfer: {Currency: {Fungible: false, SmartContract: {is: "TGhdjyV179zisuVX9M1KYw1iVDawwyRfv2"}}}}
    ) {
      Block {
        Hash
        Number
        Time
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
