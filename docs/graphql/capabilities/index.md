---
title: "GraphQL Query Capabilities: Filters, Windows, Aggregates, Joins"
description: "What a Bitquery GraphQL query can do: filters, relative time windows, sorting, limits, aggregates, calculations, joins, JSON argument filters and subscriptions."
slug: /category/capabilities
sidebar_label: "Capabilities"
keywords:
  - Bitquery GraphQL filters
  - GraphQL aggregates blockchain
  - relative time filter GraphQL
  - GraphQL joins Bitquery
  - GraphQL calculations expressions
  - subscription aggregates
---

import FAQ from "@site/src/components/FAQ";

# GraphQL Query Capabilities: Filters, Windows, Aggregates, Joins

A Bitquery query is a GraphQL selection on a cube with four kinds of building blocks. Filters in `where` narrow rows by address, token, amount, date or a relative window such as the last 30 minutes. `orderBy` and `limit` shape the result, including sorting by an aggregate you define. Metrics such as `count`, `sum`, `uniq`, `quantile` and `calculate` turn rows into numbers, with `if` conditions so one query returns buys and sells side by side. Joins, array intersection and JSON argument filters reach across cubes and into decoded contract data. All of it runs as a query or a subscription, and the same syntax works on every chain.

## Pick the capability

| You want to | Read |
|---|---|
| Filter by address, token, amount, block or transaction fields | [Query filters](/docs/graphql/filters) |
| Filter by a date range | [Date and time filters](/docs/graphql/datetime) |
| Filter by "the last N minutes" with no date to update | [Relative time filters](/docs/graphql/capabilities/relative-time) |
| Sort by a field or by an aggregate | [Sorting results](/docs/graphql/sorting) |
| Know the row and time limits a query can hit | [Query limits](/docs/graphql/limits) |
| Sum, count, distinct, quantile, min and max over rows | [Aggregated metrics](/docs/graphql/capabilities/aggregated_metrics) |
| Compute a new number from other fields or aggregates | [Calculations and expressions](/docs/graphql/calculations) and [Expressions](/docs/graphql/capabilities/expression) |
| Return the rows themselves, not aggregates | [Fact records](/docs/graphql/capabilities/query_fact_records) |
| Stream rows or aggregates over WebSocket | [Subscription on facts](/docs/graphql/capabilities/subscription_facts) and [Subscription on aggregates](/docs/graphql/capabilities/subscription_aggregates) |
| Combine two cubes in one call | [Joins](/docs/graphql/capabilities/joins) |
| Match rows whose array field overlaps a list | [Array intersection](/docs/graphql/capabilities/array-intersect) |
| Filter on decoded contract arguments | [Filtering JSON arguments](/docs/graphql/capabilities/json-filtering) |
| Use a combined dataset that stitches archive and realtime | [Combined dataset](/docs/graphql/combined) |
| Know which fields are indexed for fast filters and sorts | [Indexed fields reference](/docs/graphql/indexed-fields-reference) |
| Make a slow query fast | [Optimizing queries](/docs/graphql/optimizing-graphql-queries) |
| Drop wash trades and bad prices | [Filtering abnormal prices](/docs/usecases/how-to-filter-anomaly-prices) |
| Call the API from Postman | [GraphQL in Postman](/docs/graphql/postman) |
| Understand the schema shape first | [Query principles](/docs/graphql/query) |

## Several capabilities in one query

Relative time window, a success filter, two aggregated prices with aliases, a calculation over them and a sort by an aggregate: price change of WSOL against USDC per DEX over the last 30 minutes. Run it in the [Bitquery IDE](https://ide.bitquery.io) on a free account.

```graphql
{
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: { MintAddress: { is: "So11111111111111111111111111111111111111112" } }
          Side: { Currency: { MintAddress: { is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" } } }
        }
        Block: { Time: { since_relative: { minutes_ago: 30 } } }
        Transaction: { Result: { Success: true } }
      }
      orderBy: { descendingByField: "trades" }
      limit: { count: 3 }
    ) {
      Trade {
        Dex {
          ProtocolName
        }
        first: PriceInUSD(minimum: Block_Time)
        last: PriceInUSD(maximum: Block_Time)
      }
      trades: count
      change_pct: calculate(expression: "($Trade_last - $Trade_first) / $Trade_first * 100")
    }
  }
}
```

Aliases inside `Trade` are referenced in `calculate` as `$Trade_<alias>`. The same shape works on `EVM(network: eth)` with `SmartContract` instead of `MintAddress`.

<FAQ
  items={[
    { q: "Can I filter by a rolling time window instead of fixed dates?", a: "Yes. since_relative and till_relative (and after_relative inside metric conditions) take minutes_ago, hours_ago or days_ago, so the window rolls forward every time the query runs. Fixed dates use since and till on Block.Time or Block.Date." },
    { q: "Can a single query return buys and sells separately?", a: "Yes. Any metric takes an if condition, so sum(of: Trade_Side_AmountInUSD, if: {Trade: {Side: {Type: {is: buy}}}}) and the same with sell sit side by side in one row, and calculate can combine them." },
    { q: "Do aggregates work in subscriptions?", a: "Yes, on the chain-level cubes: a subscription on aggregated metrics recomputes them as new rows arrive. Some features of the Trading cubes do not survive the conversion; the subscriptions section lists them." },
    { q: "How do I join two cubes?", a: "With the joins capability: a selection inside one cube can pull matching rows from another, such as the transfers behind a trade or the balances of the traders you just found. The joins page has the syntax and the limits." },
    { q: "Why is my query slow or rejected?", a: "Usually an unindexed filter, no time bound or a very wide window. Filter on indexed fields, bound the time, keep limit modest and read the optimizing guide; the limits page says what the API refuses outright." },
  ]}
/>

## Related pages

- [Building GraphQL queries](/docs/category/building-queries)
- [Understanding cubes](/docs/category/understanding-cubes)
- [GraphQL metrics overview](/docs/graphql/metrics/metrics)
- [Dataset options](/docs/graphql/dataset/options)
