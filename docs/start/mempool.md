---
sidebar_position: 5
---

# Accessing Mempool Data

In the previous section, we explored the usage of websockets. Now, let's delve into the process of obtaining mempool data. By using the following query format, you can access a wide range of mempool information, including events, trades, and balances:

```
subscription {
  EVM(mempool: true) {
  }
}
```

You can find Mempool API examples [here](/docs/examples/mempool/mempool-api.md)