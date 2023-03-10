---
sidebar_position: 2
---

# Trigger

The new data pushed to subscription on receiving the new block in the real time database assuming that the criteria,
defined in the query are met:

* ```trigger_on``` attribute matches the block
* conditions defined in the query matches this block
* data filtered by all provided conditions, are not empty

## trigger_on

```trigger_on``` attribute controls on which blocks the update of data is triggered for the subscription.
It has the following options:

* ```head``` - (default) **new** blocks on the trunk (with the highest tip) triggers data update
* ```all``` - **any** block triggers data update
* ```head_updates``` - **any** blocks on the trunk (with the highest tip) triggers data update
* ```branches_updates``` - **any** blocks on the branch (not with the highest tip) triggers data update

[Blockchain Reorg Tree](../dataset/select_blocks) describes how the tree is represented in the databases.

In most cases you just not specify this attribute, assuming head option is what you need. Other options are suitable
for event-driven applications:

:::tip
Use ```head_updates``` together with ```branches_updates``` when you need to accumulate all branches and the trunk
:::

:::tip
Use ```all``` if you need to handle re-orgs of the tree in your application
:::
