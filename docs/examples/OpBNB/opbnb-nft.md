# OpBNB NFT API

In this section we'll have a look at some examples using the OpBNB NFT API.
This OpBNB API is part of our Early Access Program (EAP), which is intended for evaluation purposes.
This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

## Track all transfers of an NFT

This query subscribes you to the real time transfers of a specific non-fungible token (NFT) on the Matic network.
You can find the query [here](https://ide.bitquery.io/Real-time-transfer-websocket-for-NFT-token_1)

```
subscription {
  EVM(network: opbnb) {
    Transfers(
      where: {
        Transfer: {
          Currency: {
            Fungible: false
            SmartContract: { is: "0x4083D2D748fC47fA15596D07baAC7B3Eb7022348" }
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
