---
sidebar_position: 10
title: "API Schema Overview"
description: "API Schema Overview: Bitquery EVM GraphQL schema reference with fields, filters, relationships, and query patterns. Great for bots, dashboards, and alerts."
---
# API Schema Overview

This section documents the Bitquery GraphQL **schema** — the fields, filters, and relationships you use to build queries — for both EVM and non-EVM chains.

## How the schema is organized

Bitquery models blockchain data as **cubes** — typed collections like `Transfers`, `DEXTrades`, `Balances`, `Events`, and `Calls`. Each cube exposes:

- **Dimensions** — the fields you select and group by (addresses, tokens, block time, amounts).
- **Filters** — the `where` conditions that narrow results (see [filters](/docs/graphql/filters/)).
- **Metrics** — aggregations like `sum`, `count`, and `uniq` (see [metrics](/docs/graphql/metrics/metrics/)).

EVM chains (Ethereum, BSC, Base, Arbitrum, …) share one cube shape under the `EVM(...)` root; non-EVM chains (Solana, Tron, Bitcoin) have parallel cubes under their own roots.

## Browse the schema in the IDE

The fastest way to explore fields is the schema explorer in the [Bitquery IDE](https://ide.bitquery.io/) — the left panel lists every cube and field for the selected endpoint, with inline types and descriptions.

## Which dataset a field comes from

Field availability and history depth depend on the **dataset** (`realtime`, `archive`, `combined`) and the chain — see the [Data Coverage & Retention matrix](/docs/graphql/data-coverage-retention/) before assuming a field has deep history.

## Next steps

- [Understanding cubes](/docs/category/understanding-cubes/)
- [Building queries](/docs/graphql/query/)
- [Data Coverage & Retention](/docs/graphql/data-coverage-retention/)
