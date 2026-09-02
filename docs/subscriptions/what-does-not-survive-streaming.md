---
sidebar_position: 6
title: "What Does Not Survive Streaming"
description: "Query features that are unavailable or silently degraded in Bitquery GraphQL subscriptions, including selectWhere, if, statistical metrics, intervals and calculate expressions."
---

# What Does Not Survive Streaming

Most queries convert to a subscription by replacing `query` with `subscription`. **Trading cube
queries are the exception.** Subscriptions are served by a separate, reduced type tree
(`Trading_<X>_Stream_Cube`), so a query that works over HTTP can fail — or worse, silently
return `null` — as a stream.

The five rules below are what actually differs.

## 1. `selectWhere` and `if` do not exist on the stream

`selectWhere` is absent from **280** field positions across the four Trading cubes, and `if`
from **264**. Both produce a hard schema error in a subscription rather than being ignored.

The practical consequence: **live threshold alerting is not expressible on a Trading stream.**
You cannot say "notify me when a wallet's buy volume crosses $1M" in the subscription itself.
Stream the rows and apply the threshold in your client, or poll a query on an interval.

## 2. Eighteen statistical metrics are query-only

Streams keep `average`, `calculate`, `count`, `sum` and `uniq`. Everything else in the metric
family — `correlation`, `covariance`, `rank_correlation`, `contingency`, `cramers`,
`cramers_bias_corrected`, `theils_corrected`, `nakamoto`, `gini`, `theil_index`, `entropy`,
`quantile`, `median`, `skew`, `kurtosis`, `dispersion` and the rest — is unavailable.

## 3. `interval:` is accepted and is a silent no-op

The field-level `interval:` argument is accepted by the subscription schema and has **no
effect**. It does not error, so a stream that looks like it is emitting 4-hour buckets is
emitting whatever the underlying grain is. Do the bucketing client-side.

## 4. `calculate` needs a `$` on every field reference, and has no functions

In a subscription, every field reference inside an expression must carry the `$` sigil. A single
unsigiled token makes the whole expression return `null` — silently. A mixed expression fails
just as completely as a fully bare one:

```graphql
# null — bare names
calculate(expression: "Price_Ohlc_Close - Price_Ohlc_Open")

# null — one bare term is enough to poison it
calculate(expression: "$Price_Ohlc_Close - Price_Ohlc_Open")

# works
calculate(expression: "$Price_Ohlc_Close - $Price_Ohlc_Open")
```

Subscriptions also support **arithmetic operators only**. Function calls — `round()`, `floor()`,
`abs()`, `plus()`, `greatest()` — return `null` in a stream while working normally in a query.
Drop them from the expression and round in your client.

Aliased results can still be referenced and chained: `diff: calculate(...)` then
`change: calculate(expression: "$diff / $Price_Ohlc_Open * 100")`.

Queries are unaffected by all of this — bare names and functions both work there.

## 5. The Trading subscription root takes no arguments

`RootSubscription.Trading` accepts no arguments, so `dataset:` and `aggregates:` are unavailable.
`trigger_on` and mempool subscriptions are likewise not part of the Trading stream surface.

## Before you convert a query

1. Remove `selectWhere` and `if`.
2. Replace any statistical metric outside `average` / `calculate` / `count` / `sum` / `uniq`.
3. Drop `interval:` and bucket client-side.
4. Add `$` to every field reference inside `calculate`, and remove function calls.
5. Check the result for `null` computed fields before trusting the stream.

## Related

- [Subscriptions](/docs/subscriptions/subscription/)
- [Which cubes stream](/docs/subscriptions/which-cubes-stream/)
- [Expressions](/docs/graphql/capabilities/expression/)
- [Select by metric (`selectWhere`)](/docs/graphql/metrics/selectWhere/)
