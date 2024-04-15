# Optimism Transfers API

In this section we'll have a look at some examples using the Optimism Transfers API.
This Optimism API is part of our Early Access Program (EAP), which is intended for evaluation purposes.
This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

# Subscribe to Recent Whale Transactions of a particular currency

The subscription query below fetches the whale transactions on the Optimism network. We have used USDT address `0x94b008aA00579c1307B0EF2c499aD98a8ce58e58`
You can find the query [here](https://ide.bitquery.io/Whale-transfers-of-USDC-on-optimism#)

```
subscription {
  EVM(network: optimism) {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58"}}, Amount: {ge: "10000"}}}
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
