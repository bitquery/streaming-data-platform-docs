# MATIC NFT API

In this section we'll have a look at some examples using the Matic NFT API.
This Matic API is part of our Early Access Program (EAP), which is intended for evaluation purposes.
This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

## Track all transfers of an NFT

This query subscribes you to the real time transfers of a specific non-fungible token (NFT) on the Matic network.
You can find the query [here](https://ide.bitquery.io/Real-time-transfer-websocket-for-NFT-token-on-matic)

```
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
