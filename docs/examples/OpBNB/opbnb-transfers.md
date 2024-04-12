# OpBNB Transfers API

In this section we'll have a look at some examples using the OpBNB Transfers API.
This OpBNB API is part of our Early Access Program (EAP), which is intended for evaluation purposes.
This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

# Subscribe to Recent Whale Transactions of a particular currency

The subscription query below fetches the whale transactions on the OpBNB network. We have used USDT address `0x9e5AAC1Ba1a2e6aEd6b32689DFcF62A509Ca96f3`
You can find the query [here](https://ide.bitquery.io/Whale-transfers-of-USDT-on-opBNB_2)

```
subscription{
  EVM(network: opbnb) {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "0x9e5AAC1Ba1a2e6aEd6b32689DFcF62A509Ca96f3"}}, Amount: {ge: "10000"}}}
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
