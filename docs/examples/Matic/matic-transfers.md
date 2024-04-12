# Polygon (MATIC) Transfers API

In this section we'll have a look at some examples using the Matic Transfers API.
This Matic API is part of our Early Access Program (EAP), which is intended for evaluation purposes.
This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

# Subscribe to Recent Whale Transactions of a particular currency

The subscription query below fetches the whale transactions on the MATIC network. We have used USDC address `0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359`
You can find the query [here](https://ide.bitquery.io/Whale-transfers-of-USDC-on-matic)

```
subscription{
  EVM(network: matic) {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"}}, Amount: {ge: "10000"}}}
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
