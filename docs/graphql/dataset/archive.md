---
sidebar_position: 5
---

# Archive Database

Archive database contains the data with the **delay from tens of minutes to several hours**,
depending on the blockchain. It contains the data from the first (genesis).

You need to query it when you need:

* statistics, where the latest data does not contribute much value
* all the blocks including the blockchain
* aggregated queries, like balances, counts, volumes

:::tip
Archive Database features:

* includes all blocks from the genesis (first one)
* has a strong consistency of the data
* only trunk blocks included
* has significant delay of data (from tens of minutes to hours)
* queries need to be optimized, as the archive size quite significant

:::


Also Check [Combined](/docs/graphql/dataset/combined) and [RealTime](/docs/graphql/dataset/realtime) dataset.

## Does Bitquery have data for all historical blocks since genesis? {#does-bitquery-have-data-for-all-historical-blocks-since-genesis}

For **EVM chains** queried as **`EVM { dataset: archive }`**, the **archive** slice is built to cover **from genesis (block one) forward**, subject to **operational coverage** and **maintenance**—not every field or subgraph may exist for the entire history. **Solana V2** has **different rules**: many **aggregates** start at a **documented cutoff** (see [Historical Solana Data](/docs/blockchain/Solana/historical-aggregate-data/)), and **genesis-era** analytics may require **[V1 APIs](https://docs.bitquery.io/v1/)**. Use **archive** for deep history, **realtime** for the freshest window, and **combined** to span both ([combined dataset](/docs/graphql/dataset/combined)).

## How far back does Bitquery historical data go?

For chains exposed as **`EVM { dataset: archive }`** (and similar), archive indexing is intended to reach back toward **genesis** for that network, subject to **coverage** and **maintenance**. **Solana V2** historical **aggregates** (e.g. `DEXTradeByTokens`) start from a **documented cutoff** (see [Historical Solana Data](/docs/blockchain/Solana/historical-aggregate-data/)). **Transfers or analytics from Solana genesis** often require **[V1 APIs](https://docs.bitquery.io/v1/docs/category/examples)**.