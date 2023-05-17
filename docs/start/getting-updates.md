---
sidebar_position: 2
---

# Real-Time Subscription

After you created and successfully run [your first query](/docs/start/first-query), it is time to
get updates on the new data coming.

It is just as easy as replace "query" with "subscription" on the first line in editor,
here we will edit a little the query to use the BSC network, so it will read now as:

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

The run button now again becomes green. But now when you press it, you will not 
immediately get results, as it will wait for the new block to come. In BSC network
blocks typically come in 3-4 seconds, so you will see this sequence after some time
on the result panel:

![IDE subscription execution](/img/ide/ide_subscription.gif)

> Query used: [Real Time Blocks Subscription | BSC](https://graphql.bitquery.io/ide/Real-Time-Blocks-Subscription--BSC)

To stop updates, press the run button again.


:::caution Resources usage

Please note that as long as data is being received, the box on the right will continue to populate, which has no text limit, so make sure you don't waste your resources!
:::