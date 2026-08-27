---
sidebar_position: 4
title: "Realtime Database"
description: "Realtime Database in Bitquery GraphQL with clear syntax, examples, and tips for fast blockchain queries and streams. See examples in the Bitquery IDE."
---
# Realtime Database

Realtime is the default database (if you omit the attribute, then it is used).

**How much data `realtime` holds depends on the cube, not on one fixed number.**
It is roughly 12 hours on Solana `DEXTrades`, about 7 days on Solana
`DEXTradeByTokens`, a few days on the EVM transfer and DEX cubes, and about 30
days on the `Trading` cubes. The
[Data Coverage & Retention matrix](/docs/graphql/data-coverage-retention/) is the
source of truth per chain and per cube.

There is also a limitation on the streaming side: when querying `realtime` you
only receive data that is not already in the `archive` dataset. If the latest
block in the archive is 2 hours old, you only receive data more recent than that
block.

:::caution Realtime does not error when you ask for more than it holds
Querying a date range wider than the retention window returns **fewer rows, not
an error** — a chart simply starts late. If a result looks short, check the
retention matrix before assuming the data is missing, and switch to
[`archive`](/docs/graphql/dataset/archive/) or
[`combined`](/docs/graphql/dataset/combined/) for history.
:::

The main cases when it is used is for:

- subscriptions, where realtime dataset is a source of the new updates
- query the latest data available with minimum delay (up to the current block)

Note that the last blocks in the real time database are not finalized and may be not
later recorded to the archive data. [Select Block](/docs/graphql/dataset/select-blocks/) attribute controls
how you can query the trunk or branch block updates in real time database.

:::tip
Realtime Database features:

- contains the latest data available (up to the last second);
- includes all blocks, including trunk, branches. Some of these blocks can be removed when archived. Use [Select Block](/docs/graphql/dataset/select-blocks/) attribute for better control;
- fast to query
  :::

Also Check [Archive](/docs/graphql/dataset/archive) and [Combined](/docs/graphql/dataset/combined) dataset.
