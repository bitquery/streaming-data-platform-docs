---
sidebar_position: 6
title: "Combined Database"
description: "Combined Database in Bitquery GraphQL with clear syntax, examples, and tips for fast blockchain queries and streams. See examples in the Bitquery IDE."
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


## Why do some filters error out on dataset: combined or archive?

On Solana, `DEXTradeByTokens` on **archive** and **combined** is served from pre-aggregated tables that do
not carry USD-denominated columns. Using `Trade.PriceAsymmetry`, `Trade.AmountInUSD`,
`Trade.Side.AmountInUSD`, or `Trade.PriceInUSD` inside `where:` fails with
`no table can query DEXTradeByToken` or `database schema not defined for archive cube`. The failure is a
hard error, not a silently dropped filter. The same fields still work as **output measures** — for example
`sum(of: Trade_Side_AmountInUSD)` and `quantile(of: Trade_PriceInUSD)` return correct values on archive.
Native-unit equivalents (`Trade.Amount`, `Trade.Side.Amount`, `Trade.Price`) filter normally. See
[Filter limitations on aggregate datasets](/docs/blockchain/Solana/historical-aggregate-data/#filter-limitations-on-aggregate-datasets).
