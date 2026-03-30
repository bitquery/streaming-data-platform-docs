---
sidebar_position: 6
---


# Combined Database

When you query combined database, actually the query goes to the archive and real time databases separately
and then the results are joined together.

That's why this is the combination of features of these databases.

:::note
[Select Block](/docs/graphql/dataset/select-blocks/) attributes for combined database controls
how you can query the trunk or branch block updates **ONLY for real time database data part**.
:::

:::tip
Typically you should avoid using this type of query, as it is slower than real time and archive
and does not give full consistency of the data.
:::


Also Check [Archive](/docs/graphql/dataset/archive) and [RealTime](/docs/graphql/dataset/realtime) dataset.

## What is the difference between realtime, archive, and combined datasets?

**Realtime** holds a **rolling recent window** (roughly the last hours) with **low latency** and may include branch blocks. **Archive** holds **genesis-to-near-present** data with **trunk** consistency and **higher ingest delay**. **Combined** runs your query against **both** and **merges** results so one query can span recent + historical, but it is **slower** and can expose **different fields** than realtime-only (especially on Solana). Read [Realtime](/docs/graphql/dataset/realtime), [Archive](/docs/graphql/dataset/archive), and [Dataset options](/docs/graphql/dataset/options).

## Why does data from archive dataset not match combined dataset?

**Archive** and **realtime** are separate pipelines: block inclusion, **finality**, and **delay** differ. **Combined** **joins** the two, so row counts, last timestamps, and aggregates may not equal archive alone plus realtime alone.

## Why does dataset: combined return fewer fields than dataset: realtime on Solana?

On Solana, some projections (for example certain **`Trade.Side`** / account-level fields) are only populated in the **realtime** slice. **Combined** and **archive** historical aggregates may **omit** those columns, which triggers “columns not available” errors if you request them. Use fields documented for **archive/combined** (e.g. `DEXTradeByTokens` aggregates) or switch to **`dataset: realtime`** for debugging. See [Historical Solana aggregate data](/docs/blockchain/Solana/historical-aggregate-data/) and [Pump.fun combined-dataset note](/docs/blockchain/Solana/Pumpfun/Pump-Fun-API/#why-does-my-pumpfun-query-return-columns-not-available-in-combined-dataset).