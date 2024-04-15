# Base Transfers API

In this section we'll have a look at some examples using the Base Transfers API.
This Base API is part of our Early Access Program (EAP), which is intended for evaluation purposes.
This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

# Subscribe to Recent Whale Transactions of a particular currency

The subscription query below fetches the whale transactions on the Base network. We have used USDC address `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`. You can find the query [here](https://ide.bitquery.io/Whale-transfers-of-USDC-on-base#)

```
subscription {
  EVM(network: base) {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"}}, Amount: {ge: "10000"}}}
    ) {
      Transaction {
        From
        Hash
      }
      Transfer {
        Amount
        Sender
        Receiver
        Currency {
          SmartContract
          Symbol
          Name
          Fungible
          Native
        }
        Id
      }
    }
  }
}



```
