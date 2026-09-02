---
sidebar_position: 2
title: "Chain-Scale Screeners with selectWhere"
description: "Filter on computed aggregates server-side with selectWhere — the HAVING clause of the Bitquery Trading cube — to build token and wallet screeners in one request."
---

# Chain-Scale Screeners with `selectWhere`

`selectWhere` is the Trading cube's `HAVING` clause: it filters on a **computed aggregate**
rather than on input rows. That is what makes a screener possible in one request — "every token
whose 24-hour volume exceeded $1M", "every wallet with more than 500 trades" — instead of
paginating the whole chain into your client and filtering there.

A one-day, all-network screener scans a few million one-minute rows covering a few hundred
thousand tokens and returns a few hundred survivors in **one to three seconds**.

```graphql
{
  Trading {
    Tokens(
      where: {
        Token: { Network: { is: "Solana" } }
        Interval: { Time: { Duration: { eq: 60 } } }
        Block: { Time: { since: "2026-09-01T00:00:00Z", till: "2026-09-02T00:00:00Z" } }
      }
      orderBy: { descendingByField: "vol" }
      limit: { count: 1000 }
    ) {
      Token { Id Symbol }
      vol: sum(of: Volume_Usd, selectWhere: { gt: "1000000" })
    }
  }
}
```

## Where it runs in the pipeline

```
where  →  GROUP BY  →  selectWhere (HAVING)  →  orderBy  →  limitBy  →  limit
```

This is ClickHouse's own clause order, and each position matters:

- **`selectWhere` binds the aggregate it is attached to**, and only that one. A sibling
  aggregate in the same selection set is unaffected — which is the test that actually
  distinguishes HAVING from WHERE. (A contradictory predicate returning zero rows proves
  nothing; a contradictory `where` does the same.)
- **HAVING runs before `limit`.** With N groups in the window and K qualifying, a small
  `limit: L` returns L **qualifying** rows. If the limit were applied first you would get
  roughly `L × K / N` — mostly non-qualifying rows. That cardinality argument is the proof.
- **`limitBy` runs after ordering**, so it slices an already-filtered, already-sorted result
  into a per-key top-N. It is not a pre-filter and does not make a screener cheaper.

:::caution `limitBy` is a per-key top-N only if you also supply `orderBy`
Without `orderBy`, `limitBy` returns an arbitrary N per key that varies between runs. The outer
`limit` is applied after `limitBy` and truncates the whole result.
:::

## The operator set depends on what you attach it to

| Attached to | Type | Operators |
| --- | --- | --- |
| An aggregate metric (`sum`, `count`, `median`, …) | `Metric_filter_String` / `_Float` | `gt` `ge` `lt` `le` `eq` `ne` |
| A **numeric** field-level selector | `OLAP_Float` | the same six |
| A **string** field-level selector | `OLAP_String` | the full 15-operator string set — `like`, `startsWith`, `includes`, … |
| A boolean leaf field | `Boolean` | a bare value: `selectWhere: true` |

There is **no `between`** anywhere. Multiple clauses AND together, both inside one `selectWhere`
object and across different metrics in the same selection set — so express a range with `ge` and
`le`:

```graphql
vol: sum(of: Volume_Usd, selectWhere: { ge: "10000" le: "1000000" })
```

## Literal types follow the metric's return type

`sum`, `count` and `uniq` return JSON strings and take **string** literals; every Float-returning
metric takes a **numeric** literal. Passing the wrong one is a clean schema error, not a silent
failure.

String literals are compared **numerically, not lexicographically** — `"100"` is greater than
`"20"`, and `{gt: "9", lt: "400"}` correctly admits `19.09` and `318.96`.

## The silent no-op — the most important rule on this page

A bare leaf field is a **GROUP BY dimension, not an aggregate**, so a `selectWhere` attached to
it has nothing to filter. It is accepted, does nothing, and returns plausible wrong rows with no
error.

```graphql
# WRONG — silently unfiltered
Volume { Usd(selectWhere: { gt: 1000 }) }

# RIGHT — maximum: makes it an aggregate
Volume { Usd(maximum: Volume_Usd, selectWhere: { gt: 1000 }) }
```

The rule: **the field must carry at least one of `maximum:`, `minimum:` or `if:`.**

:::warning `if:` alone satisfies the rule but returns an arbitrary representative
`if:` makes the field an aggregate, so the HAVING binds — but the value returned is an arbitrary
row's value, not a statistic. Use `maximum:` or `minimum:` to make a leaf field an aggregate;
use `if:` only alongside one of them.
:::

## Conditional HAVING

Combining `if:` and `selectWhere` on the same metric filters on a **slice** of the group — for
example wallets whose buy-side volume alone clears a threshold, or tokens active earlier in the
window but dormant in the last two hours:

```graphql
buys: sum(of: AmountsInUsd_Quote, if: { Side: { is: "Buy" } }, selectWhere: { gt: "50000" })
```

## What you cannot express

| Want | Status | Do instead |
| --- | --- | --- |
| HAVING on a **ratio** | `calculate` takes no `selectWhere` | Compute and **rank** the ratio server-side (see below); apply the final cut client-side |
| `in` / `notIn` | Absent from metric filters; present in `OLAP_String` but fails at runtime | Use `like` / `startsWith`, or put set membership in the cube's own `where:` |
| Filtering `array_intersect` | The argument exists and type-checks, then fails server-side | Known limitation — filter in your client |
| Any of this on a **stream** | `selectWhere` is absent from all four subscription cubes | Query only — see [what does not survive streaming](/docs/subscriptions/what-does-not-survive-streaming/) |

### Ranking by a ratio server-side

You cannot put a HAVING on a ratio, but you can compute and order by one:

```graphql
ratio: calculate(expression: "sum(of: Volume_Usd) / count")
n:     count(selectWhere: { gt: "100" })
```

`calculate` needs **at least one other aggregate in the same selection set** — alone, or beside a
bare leaf field, it returns a ClickHouse error (`Column ... is not under aggregate function and
not in GROUP BY`). Pair it with `orderBy` on its alias and a `selectWhere` floor on a separate
aggregate, and only the final ratio cut happens in your client.

## Reproducibility near a threshold

Aggregates built from floating-point sums — `sum`, and anything derived from it — vary in the
last few significant figures between identical runs over a frozen window, because summation order
across parallel shards is not fixed. A token sitting within about 0.01% of a **sum-based**
threshold can therefore move in and out of the result between runs.

`count`, `uniq` and `maximum:` / `minimum:` selectors are exactly stable. Prefer a count-based or
max-based threshold when a stable membership list matters.

## Related

- [Select by metric (general reference)](/docs/graphql/metrics/selectWhere/)
- [Conditions with `if`](/docs/graphql/metrics/if/)
- [Trading Data Overview](/docs/trading/trading-data-overview/)
