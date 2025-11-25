---
sidebar_position: 2
---

# What is a Trigger?

The new data pushed to subscription on receiving the new block in the real time database assuming that the criteria,
defined in the query are met:

* ```trigger_on``` attribute matches the block
* conditions defined in the query matches this block
* data filtered by all provided conditions, are not empty

## trigger_on

```trigger_on``` attribute controls on which blocks the update of data is triggered for the subscription.
It has the following options:

* ```all``` - **any** block triggers data update
* ```head``` -  **new** blocks on the trunk (with the highest tip) triggers data update
* ```head_updates``` - **any** blocks on the trunk (with the highest tip) triggers data update
* ```branches_updates``` - **any** blocks on the branch (not with the highest tip) triggers data update

[Blockchain Reorg Tree](/docs/graphql/dataset/select-blocks/) describes how the tree is represented in the databases.

In most cases you just not specify this attribute, assuming all option is what you need. Other options are suitable
for event-driven applications:


## Filtering Out All Branch Blocks

Even with `trigger_on: head`, you might receive branch blocks. When a blockchain forks, the subscription cannot determine in real time whether the fork selected will become the longest chain (trunk) in the future. At the moment a fork occurs, the system may initially treat a branch block as the head, only to later discover it becomes part of a branch when a longer chain emerges.

If you need to completely filter out branch-related blocks and transactions, you can run two streams:

1. **Stream with `trigger_on: all`** - This captures all blocks (both trunk and branch)
2. **Stream with `trigger_on: branch_updates`** - This captures only branch blocks

By comparing these two streams, you can identify and filter out branch-related blocks and transactions. Any block or transaction that appears in the `branch_updates` stream should be excluded from your final dataset, ensuring you only process blocks that remain on the trunk chain.

:::tip
Use ```head_updates``` together with ```branches_updates``` when you need to accumulate all branches and the trunk
:::

:::tip
Use ```head``` if you need to listen only head blocks in your application. This can slightly delay the data however, as the new block 
may need the other block to wait to be detected that it is on the tree.
:::