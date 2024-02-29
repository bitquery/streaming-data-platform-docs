---
sidebar_position: 2
---

# Subscribing to Real-Time Data

After you have created and successfully run [your first query](/docs/start/first-query), it is time to
get updates on the new data coming.

It is just as easy as replacing "query" with "subscription" on the first line in the editor.
Here, we will edit the query to use the BSC network so that it will now read as:

```graphql
subscription RealTimeBlocks {
  EVM(network: bsc) {
    Blocks {
      Block {
        Number
      }
    }
  }
}
```

The run button now again becomes green. But now, when you press it, you will not 
immediately get results, as it will wait for a new block to be formed. In the BSC network, blocks typically come in 3-4 seconds. Hence, you will see this sequence after some time
on the result panel:

![IDE subscription execution](/img/ide/ide_subscription.gif)

> Query used: [Real Time Blocks Subscription | BSC](https://graphql.bitquery.io/ide/Real-Time-Blocks-Subscription--BSC)

To stop updates, press the run button again.


:::caution Resources usage

Please note that as long as data is being received, the box on the right will continue to populate, which has no text limit, so make sure you don't waste your resources!
:::

Read more about subscriptions and creating websockets [here](/docs/subscriptions/subscription.md)