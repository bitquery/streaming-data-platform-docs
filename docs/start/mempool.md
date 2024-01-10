---
sidebar_position: 5
---

# Accessing Mempool Data

In the previous section, we explored the usage of websockets. Now, let's delve into the process of obtaining mempool data.
Before any information can be written on a block, it must first go through the mempool, which acts as a waiting room for transactions. All unconfirmed transactions are held here.
By using the following query format, you can access a wide range of mempool information, including events, trades, and balances:

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

You can find Mempool API examples [here](/docs/examples/mempool/mempool-api.md)
