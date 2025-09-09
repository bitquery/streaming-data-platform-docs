---
sidebar_position: 5
---

# Getting Mempool Data

In the previous section, we saw how to write a subscription query. Now, let's examine the process of obtaining mempool data.
Before any information can be written on a block, it must first go through the mempool, which acts as a waiting room for transactions. All unconfirmed transactions are held here.

By using the following query format, you can access all information about broadcasted transactions, including events, trades, and balances:

```

query{
  EVM(mempool: true){

    }
}

```
And below format for subscriptions

```
subscription {
  EVM(mempool: true) {
  }
}
```

You can find Mempool API examples [here](/docs/blockchain/Ethereum/mempool/mempool-api/)
