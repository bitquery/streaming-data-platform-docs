---
sidebar_position: 4
---


# Realtime Database

Realtime is the default database ( if you omit the attribute, then it is used ). It contains data for maximum of the last 48 hours.
The main cases when it is used is for:

* subscriptions, where realtime dataset is a source of the new updates
* query the latest data available with minimum delay ( up to the current block )

Note that the last blocks in the realtime database are not finalized and may be not
later recorded to the archive data. [Select Block](select_blocks) attribute controls
how you can query the trunk or branch block updates  in realtime database.

:::tip
Realtime Database features:

* contains the latest data available ( up to the last second );
* includes all blocks, including trunk, branches. Some of these blocks can be removed when archived. Use [Select Block](select_blocks) attribute for better control;
* fast to query
:::