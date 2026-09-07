---
title: "Building GraphQL Queries on Bitquery: From First Query to Aggregates"
description: "From a first Bitquery GraphQL query to filters, datasets, metrics and the schema reference: what each guide covers and the order to read them in."
slug: /category/building-queries
sidebar_label: "Building Queries"
keywords:
  - Bitquery GraphQL tutorial
  - how to query blockchain data GraphQL
  - Bitquery query examples
  - GraphQL dataset archive realtime
  - Bitquery metrics
  - EVM schema reference
---

import FAQ from "@site/src/components/FAQ";

# Building GraphQL Queries on Bitquery: From First Query to Aggregates

Every Bitquery query has the same shape: a root for the chain or the Trading family, a cube for the kind of fact, a `where` filter, an `orderBy`, a `limit`, and a selection of fields or metrics. Learn that shape once and it carries across every chain and cube. This section takes you from a first query to aggregates and history in four steps: query principles and filters, datasets that decide how far back you reach, metrics that turn rows into numbers, and the schema reference for field names. Everything runs in the [Bitquery IDE](https://ide.bitquery.io) on a free account.

## Read in this order

| Step | Guide | What you get |
|---|---|---|
| 1 | [Query principles](/docs/graphql/query) | The root, cube, filter and selection structure |
| 2 | [Query filters](/docs/graphql/filters), [date and time filters](/docs/graphql/datetime), [relative time](/docs/graphql/capabilities/relative-time) | Narrowing rows by address, token, amount and time |
| 3 | [Dataset options](/docs/graphql/dataset/options), [realtime](/docs/graphql/dataset/realtime), [archive](/docs/graphql/dataset/archive), [combined](/docs/graphql/dataset/combined) | How far back a query can reach and how fresh it is |
| 4 | [Metrics overview](/docs/graphql/metrics/metrics), [count](/docs/graphql/metrics/count), [sum](/docs/graphql/metrics/sum), [uniq](/docs/graphql/metrics/uniq), [quantile](/docs/graphql/metrics/quantile), [conditional metrics](/docs/graphql/metrics/if) | Aggregates, conditions and statistics |
| 5 | [Sorting](/docs/graphql/sorting), [limits](/docs/graphql/limits), [indexed fields](/docs/graphql/indexed-fields-reference), [optimizing queries](/docs/graphql/optimizing-graphql-queries) | Fast, well-formed queries |
| 6 | [EVM schema reference](/docs/schema/evm/dextrades) | Exact field names per cube |

The [data coverage and retention](/docs/graphql/data-coverage-retention) page answers "how far back does the data go" per cube and chain, and the [capabilities](/docs/category/capabilities) section covers joins, calculations, JSON filters and subscriptions.

## A first query

The five most recent transfers on Ethereum: one root, one cube, an order and a limit.

```graphql
{
  EVM(network: eth) {
    Transfers(limit: { count: 5 }, orderBy: { descending: Block_Time }) {
      Block {
        Time
      }
      Transfer {
        Amount
        Currency {
          Symbol
        }
        Sender
        Receiver
      }
    }
  }
}
```

From here, add a `where` to pick one token or one wallet, replace the field list with `count` and `sum(of: Transfer_Amount)` to aggregate, add `dataset: archive` to the root to reach history, or change `query` to `subscription` to stream new transfers.

## The four groups in this section

- **Capabilities** (20 pages): filters, time windows, sorting, limits, aggregates, calculations, joins, array and JSON filters, subscriptions, Postman. [Open the capabilities hub](/docs/category/capabilities).
- **Dataset** (8 pages): [options](/docs/graphql/dataset/options), [realtime](/docs/graphql/dataset/realtime), [archive](/docs/graphql/dataset/archive), [combined](/docs/graphql/dataset/combined), [database selection](/docs/graphql/dataset/database), [network selection](/docs/graphql/dataset/network), [reorg handling](/docs/graphql/dataset/select-blocks), [early access program](/docs/graphql/dataset/EAP).
- **Metrics** (11 pages): [overview](/docs/graphql/metrics/metrics), [alias](/docs/graphql/metrics/alias), [count](/docs/graphql/metrics/count), [distinct](/docs/graphql/metrics/distinct), [if](/docs/graphql/metrics/if), [priceAsymmetry](/docs/graphql/metrics/priceAsymmetry), [selectWhere](/docs/graphql/metrics/selectWhere), [statistics](/docs/graphql/metrics/statistics), [sum](/docs/graphql/metrics/sum), [uniq](/docs/graphql/metrics/uniq), [quantile](/docs/graphql/metrics/quantile).
- **Schema reference** (11 pages): [blocks](/docs/schema/evm/blocks), [miner rewards](/docs/schema/evm/miners), [uncles](/docs/schema/evm/uncles), [balances](/docs/schema/evm/balances), [token holders](/docs/schema/evm/token-holders), [transfers](/docs/schema/evm/transfers), [transactions](/docs/schema/evm/transactions), [events](/docs/schema/evm/events), [DEX trades](/docs/schema/evm/dextrades), [calls](/docs/schema/evm/calls), [arguments and returns](/docs/schema/evm/arguments).

<FAQ
  items={[
    { q: "What does a Bitquery GraphQL query look like?", a: "A root such as EVM(network: eth), Solana or Trading, then a cube such as Transfers or DEXTrades, then where, orderBy and limit arguments, then the fields or metrics you want back. The same shape works on every chain." },
    { q: "How do I query historical data?", a: "Add dataset: archive or dataset: combined to the chain root. Without it a query uses the realtime window, which is short. The data coverage page lists how far back each cube reaches." },
    { q: "How do I count or sum instead of listing rows?", a: "Replace fields with metrics: count, sum(of: ...), uniq(of: ...), quantile and others. Metrics accept an if condition and can be sorted with orderBy descendingByField on an alias." },
    { q: "Where do I find the exact field names?", a: "In the schema reference pages for each EVM cube and in the builder-terms pages for EVM and Solana, or in the IDE, which autocompletes fields as you type." },
    { q: "Do I need an API key to try queries?", a: "Not in the IDE: a free account runs every example. To call the API from code, create an access token at account.bitquery.io." },
  ]}
/>

## Related pages

- [GraphQL query capabilities](/docs/category/capabilities)
- [Understanding cubes](/docs/category/understanding-cubes)
- [How to generate an access token](/docs/authorization/how-to-generate/)
- [Data coverage and retention](/docs/graphql/data-coverage-retention)
