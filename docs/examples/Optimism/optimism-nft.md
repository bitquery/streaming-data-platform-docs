# Optimism NFT API

In this section we'll have a look at some examples using the Optimism NFT API.
This Optimism API is part of our Early Access Program (EAP), which is intended for evaluation purposes.
This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

## Track all transfers of an NFT

This query subscribes you to the real time transfers of a specific non-fungible token (NFT) on the Optimism network.
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
