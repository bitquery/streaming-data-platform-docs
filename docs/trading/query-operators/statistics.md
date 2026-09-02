---
sidebar_position: 5
title: "Trading Statistics and Concentration Metrics"
description: "Correlation, covariance, quantiles, entropy, Gini and Nakamoto on the Bitquery Trading cube — exact definitions, numerical limits, and which metrics are unsafe on price columns."
---

# Trading Statistics and Concentration Metrics

The Trading cubes carry a full statistical suite that runs server-side over the whole filtered
population — no pagination, one row back. It is powerful and it has sharp edges: several metrics
are **numerically unsafe on price columns**, and two of the most useful ones behave differently
from their textbook definitions.

Read the limits before building on them.

:::warning Query cubes only
None of these metrics exist on subscriptions. Streams offer only `average`, `sum`, `count` and
`uniq` — see [what does not survive streaming](/docs/subscriptions/what-does-not-survive-streaming/).
:::

## Do not use these on price columns

`dispersion`, `standard_deviation`, `skew` and `kurtosis` are computed with a **single-pass
Float32 sum of squares**. When the mean is large relative to the spread — which describes every
price column — they suffer catastrophic cancellation:

- results wrong by tens of percent,
- values that change between identical repeat calls,
- negative `kurtosis`,
- non-zero results for a **constant** sample.

They are correct and deterministic on small-magnitude columns such as trade amounts.

**For the variance of a price column, use `covariance(of: X, with: X)` instead.** It is the same
population variance, computed stably, and returns full Float64 precision where `dispersion`
returns about seven significant digits.

## Definitions as implemented

| Metric | What it actually computes |
| --- | --- |
| `covariance` | **Population** covariance (÷ n). `covariance(of: X, with: X)` = population variance |
| `dispersion`, `standard_deviation` | Population variance / SD, Float32-truncated — see the warning above |
| `correlation` | Pearson. Accuracy is relative-magnitude dependent |
| `rank_correlation` | Spearman — exact when neither sample has ties |
| `entropy` | Shannon entropy **in bits**, over exact repeated values (not binned) |
| `gini`, `theil_index` | Concentration over the values, 0 = even, 1 = fully concentrated |
| `nakamoto` | Count of **rows** — not distinct entities — that together reach `ratio` of the total |
| `quantile`, `median` | Approximate by default — see below |
| `uniq` | Exact to 65,536 distinct values, probabilistic above |

### `nakamoto` counts rows, and its ratio defaults to 0.51

Two things that surprise people. First, on `Trading.Trades` a "row" is a swap leg, so
`nakamoto(of: AmountsInUsd_Quote)` answers *how few individual trades make up the majority of
volume* — not how few wallets. To get an entity-level coefficient you need one row per entity,
which means grouping first.

Second, **`ratio` defaults to 0.51**, not 0.5. Pass it explicitly if you mean something else.

### `quantile` and `median` are approximate by default

Both use a reservoir sampler capped at 8,192 rows, so above that the same query returns a
different answer between runs. `level` defaults to `0.5`, and `median` is the same estimator as
default `quantile`.

```graphql
p99: quantile(of: Volume_Usd, level: 0.99, method: exact)
```

Below 8,192 rows the approximate result is deterministic but still not equal to exact, because
the sampler interpolates between order statistics.

### `uniq` is exact to 65,536, then two-sided

Above 2^16 distinct values `uniq` switches to a probabilistic estimator. The error is **two-sided**
— it can read high or low by well under a percent — and it is deterministic for a fixed dataset.

`uniq(method: exact)` and `count(distinct: <field>)` agree exactly, so `count(distinct:)` is the
reference, not an approximation.

## `rank_correlation` will abort your whole query

If **any** group in the result has a constant sample, `rank_correlation` fails the entire request
— not that group, the whole thing. One constant sample is enough even though the error message
mentions both. There is no `if:` workaround at group level.

It also runs 2–3× slower than `correlation` and is bounded by a **wall-clock gateway deadline**,
not a row cap: it starts timing out intermittently on very large windows (a retry often succeeds)
and fails consistently on the largest. Narrow the window rather than hunting for a row limit.

## Silent zeros

`correlation` returns **0** — not `null`, not an error — for a single-row group. And at full-cube
scale it returns 0 for every column pair, because extreme outliers blow up the Float32 sum of
squares. A correlation of exactly 0 is far more likely to mean "degenerate input" than "no
relationship". Always check the group's `count` alongside it.

## `if:` support

Most metrics accept `if:` for conditional statistics. **`gini`, `theil_index` and `nakamoto` do
not.** `entropy` does.

```graphql
buySkew: correlation(of: Amounts_Base, with: PriceInUsd, if: { Side: { is: "Buy" } })
```

## A concentration recipe

Pool concentration for a token — how few pools carry the volume — in one request:

```graphql
{
  Trading {
    Pairs(
      where: {
        Token: { Address: { is: "So11111111111111111111111111111111111111112" } }
        Market: { Network: { is: "Solana" } }
        Interval: { Time: { Duration: { eq: 3600 } } }
        Block: { Time: { since: "...", till: "..." } }
      }
      limit: { count: 1 }
    ) {
      pools:  count(distinct: Market_Address)
      n51:    nakamoto(of: Volume_Usd, ratio: 0.51)
      gini:   gini(of: Volume_Usd)
    }
  }
}
```

`n51` is the number of pools that together carry a majority of the volume; `gini` near 1 means
one venue dominates. This is the closest the Trading cube comes to a liquidity metric — it
carries no reserve or TVL data.

## Related

- [Statistics metrics (general reference)](/docs/graphql/metrics/statistics/)
- [Screeners with `selectWhere`](/docs/trading/query-operators/selectwhere-screeners/)
- [Conditions with `if`](/docs/graphql/metrics/if/)
