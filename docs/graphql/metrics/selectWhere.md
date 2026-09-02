---
sidebar_position: 5
title: "Select Rows by GraphQL Metric"
description: "Select By Metric in Bitquery GraphQL with clear syntax, examples, and tips for fast blockchain queries and streams. Keep queries fast with indexed filters."
---
#  Select By Metric

A metric value can be used to filter the result with the ```selectWhere``` attribute,
which defines a condition applied to the **computed metric** rather than to the input rows.
It is the GraphQL equivalent of SQL's `HAVING`.

This expression filters balances to positive values only:
```
sum(of: BalanceUpdate_Amount selectWhere: {gt: "0"})
```

## Where it applies in the pipeline

`selectWhere` runs **after** aggregation and **before** ordering and limiting, so a filtered
result is complete rather than a filtered page:

```
where  →  GROUP BY  →  selectWhere (HAVING)  →  orderBy  →  limitBy  →  limit
```

This matches ClickHouse's own clause order, and it determines what `limitBy` means: `limitBy`
takes the top N per key **from the rows that already passed `selectWhere`**. A key with fewer
than N survivors simply returns fewer rows — it is not padded with rows that are then filtered
away.

## Operators

The operator set depends on **what you attach `selectWhere` to** — there are four shapes:

| Attached to | Type | Operators |
| --- | --- | --- |
| An aggregate metric (`sum`, `count`, `median`, …) | `Metric_filter_String` / `_Float` | `gt` `ge` `lt` `le` `eq` `ne` |
| A **numeric** field-level selector | `OLAP_Float` | the same six |
| A **string** field-level selector | `OLAP_String` | the full 15-operator string set — `like`, `startsWith`, `includes`, `not`, … |
| A boolean leaf field | `Boolean` | a bare value: `selectWhere: true` |

There is **no `between`** on any of them. Multiple clauses in one `selectWhere` are combined
with AND, so express a range with `ge` and `le` together:

```
sum(of: Volume_Usd selectWhere: {ge: "10000" le: "1000000"})
```

`in` and `notIn` are absent from the metric filters. They appear in the `OLAP_String` schema but
**fail at runtime**, so use `like` / `startsWith` instead, or move set membership into the cube's
own `where:` clause where `in` is supported normally.

## Literal types

The literal type matches the **metric's own return type**. `sum`, `count` and `uniq` return JSON
strings and therefore take string literals; every Float-returning metric takes a numeric literal.
Passing the wrong one is a clean schema error, not a silent failure.

String literals are compared **numerically, not lexicographically** — `"100"` is greater than
`"20"`.

:::note
You can combine this attribute with other attributes, including conditions in ```if```.
Combining `if` and `selectWhere` on the same metric gives a conditional HAVING — for
example, filtering to wallets whose **buy-side** volume alone exceeds a threshold.
:::

:::caution Not available on every field, and not on streams
On a bare field that has no selector argument, `selectWhere` is accepted and is a
**silent no-op** — it neither filters nor errors. Attach it to a metric.

`selectWhere` is **not available in subscriptions**. See
[what does not survive streaming](/docs/subscriptions/what-does-not-survive-streaming/).
:::

