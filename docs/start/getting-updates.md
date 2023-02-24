---
sidebar_position: 2
---

# Real-Time Subscription

After you created and successfully run [your first query](first-query), it is time to
get updates on the new data coming.

It is just as easy as replace "query" with "subscription" on the first line in editor,
so it will read now as:

```graphql
subscription {
	EVM {
    Blocks {
      Block {
        Number
        Time
      }
    }
  }
}
```

The run button now again becomes green. But now when you press it, you will not 
immedeately get results, as it will wait for the new block to come. In ETH network
blocks typically come in 7-10 seconds, so you will see this sequence after some time
on the result panel:

![IDE subscription execution](/img/ide/subscription_execution.png)

To stop updates, press the run button again.
