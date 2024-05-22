# eth_subscribe alternatives

Ethereum Subscription API allows developers to build websockets that receive real-time notifications about the Ethereum blockchain. In this section we will see how to create subscription for each eth_subscribe JSON RPC method and how to customize it to get data we need.

## eth_subscribe(“pendingTransactions”)


To subscribe to incoming pending transactions, use the below subscription. You can run it [here](https://ide.bitquery.io/eth_subscribependingTransactions)

```
subscription {
  EVM(mempool: true) {
    Transactions {
      Transaction {
        CostInUSD
        Cost
        Data
        From
        Hash
        To
        Type
        ValueInUSD
        Value
        Time
        Index
        Gas
      }
      TransactionStatus {
        FaultError
        EndError
        Success
      }
    }
  }
}

```




## eth_subscribe(“newBlockHeaders”)

To subscribe to incoming block headers use the below query. 

```

```




## eth_subscribe(logs)


## eth_subscibe("syncing")


