---
sidebar_position: 4
---

# Realtime Database

Realtime is the default database (if you omit the attribute, then it is used).
The `realtime` database contains data from the past 8 hours approximately, but with a limitation. When querying `realtime` data using the Streaming APIs, you will only receive data that is not in the `archive` dataset. For example, if the latest block in the archive is 2 hours old, you will only receive data that is more recent than this block.

The main cases when it is used is for:

- subscriptions, where realtime dataset is a source of the new updates
- query the latest data available with minimum delay (up to the current block)

Note that the last blocks in the real time database are not finalized and may be not
later recorded to the archive data. [Select Block](/docs/graphql/dataset/select_blocks) attribute controls
how you can query the trunk or branch block updates in real time database.

:::tip
Realtime Database features:

- contains the latest data available (up to the last second);
- includes all blocks, including trunk, branches. Some of these blocks can be removed when archived. Use [Select Block](/docs/graphql/dataset/select_blocks) attribute for better control;
- fast to query
  :::

Also Check [Archive](/docs/graphql/dataset/archive) and [Combined](/docs/graphql/dataset/combined) dataset.
