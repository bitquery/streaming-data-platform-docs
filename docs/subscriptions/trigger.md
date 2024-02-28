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

[Blockchain Reorg Tree](/docs/graphql/dataset/select_blocks) describes how the tree is represented in the databases.

In most cases you just not specify this attribute, assuming all option is what you need. Other options are suitable
for event-driven applications:

:::tip
Use ```head_updates``` together with ```branches_updates``` when you need to accumulate all branches and the trunk
:::

:::tip
Use ```head``` if you need to listen only head blocks in your application. This can slightly delay the data however, as the new block 
may need the other block to wait to be detected that it is on the tree.
:::
