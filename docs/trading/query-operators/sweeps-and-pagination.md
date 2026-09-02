---
sidebar_position: 6
title: "Whole-Population Sweeps and Pagination"
description: "limitBy returns one row per entity across the entire population, not a top-N. How to page a sweep correctly, and why offset without orderBy silently duplicates rows."
---

# Whole-Population Sweeps and Pagination

`limitBy` is the operator that turns a Trading query into a **sweep**: one row per entity across
the *entire* filtered population, not a top-N sample. It is how you get every token on a chain,
or every wallet that traded in a window, without a query per entity.

```graphql
limitBy: { by: Token_Id, count: 1 }
```

That returns one representative row for **every** distinct `Token_Id` the `where` clause admits.

## Paging a sweep

Page with the outer `limit`, and always sort:

```graphql
orderBy: { ascending: Token_Id }
limit:   { count: 25000, offset: 0 }     # then offset: 25000, 50000, …
```

An empty array is the only stop signal — there is no total count or `hasMore` flag.

:::danger `offset` without `orderBy` silently duplicates and drops rows
Pagination without a sort order is **incoherent**: successive pages return some rows twice and
miss others entirely, with no error. The effect is severe and gets worse as page size shrinks —
in testing, a substantial double-digit percentage of rows were duplicated across a full paging
run.

Adding `orderBy` on the `limitBy` key removes it almost entirely; a residual fraction of a
percent remains, which is live data arriving mid-run rather than a paging fault.
:::

## `limitBy.offset` and `limit.offset` are different

This catches people out, because the two look alike:

| | Skips | Filters? |
| --- | --- | --- |
| `limit: { offset: N }` | rows in the **final result set** | No |
| `limitBy: { offset: N }` | rows **within each group** | **Yes** — groups smaller than the offset disappear entirely |

So `limitBy: { by: Token_Id, count: 1, offset: 2 }` is not "skip two pages" — it is "only tokens
with at least three rows, and give me their third". That is occasionally exactly what you want,
and never what you want by accident.

## Which row does a sweep keep?

`orderBy` decides. Without it, the representative row for each group is **arbitrary and can
differ between identical requests**. If you are sweeping for "the latest row per token" or "the
largest trade per wallet", say so explicitly:

```graphql
orderBy: { descending: Block_Time }
limitBy: { by: Token_Id, count: 1 }
```

## Grouping by more than one field

`by` accepts a **list**, and groups by the tuple:

```graphql
limitBy: { by: [Token_Id, Pair_Market_Address], count: 1 }
```

`count` greater than 1 works too — `count: 3` gives the top three rows per key, ordered by your
`orderBy`.

## Exact distinct counts

A `limitBy` sweep is **exact**, which makes it a reference for cardinality. `uniq` is exact up to
a point and then switches to a probabilistic estimator: below roughly 35,000 distinct values the
two agree exactly, and above that the approximate count drifts by well under a percent in
**either** direction — it is not a systematic undercount.

For an exact count without materialising the rows, use `count(distinct: <field>)`.

## Cost

Deep offsets are cheap on **plain row pagination** — latency stays roughly flat as the offset
grows. They are **not** cheap on a `limitBy` sweep, because every group has to be materialised
before the offset is applied. Prefer narrowing the `where` clause over paging deep into a sweep.

## Related

- [Screeners with `selectWhere`](/docs/trading/query-operators/selectwhere-screeners/)
- [Argmax selectors](/docs/trading/query-operators/argmax-selectors/)
- [Filters and operators](/docs/trading/query-operators/filters-and-operators/)
