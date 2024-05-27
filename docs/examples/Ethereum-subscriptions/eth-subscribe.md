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

## eth_subscribe("logs")

You can subscribe to all incoming logs filtered by any of the fields including method signature, tx value,sender , receiver and so on. In the below example we are tracking only logs where the method name is `transfer`. You can run it [here](https://ide.bitquery.io/eth_subscribelogs)

```
subscription {
  EVM(mempool: true) {
    Events(where: {Log: {Signature: {Name: {is: "Transfer"}}}}) {
      Log {
        SmartContract
        Signature {
          Name
          Signature
        }
      }
      Block {
        Number
        Hash
        Time
      }
      Transaction {
        Hash
        From
        ValueInUSD
        Value
        To
        Type
      }
      LogHeader {
        Data
        Address
        Index
        Removed
      }
    }
  }
}


```

## eth_subscribe("newBlockHeaders")

You can subscribe to new blocks as they arrive in real-time. This includes information about the new block, such as its block number, hash,transaction count and timestamp.

```
subscription {
  EVM {
    Blocks {
      Block {
        Number
        ParentHash
        Hash
        TxCount
        Time
      }
    }
  }
}

```
