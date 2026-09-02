---
sidebar_position: 3
title: "Argmax Selectors: maximum and minimum"
description: "Field(maximum: Key) returns a field's value on the row where Key is maximal — the argmax primitive behind first-value, last-value and peak queries on the Bitquery Trading cube."
---

# Argmax Selectors: `maximum:` and `minimum:`

`Field(maximum: Key)` returns **the value of `Field` on the row where `Key` is maximal**. It
compiles to ClickHouse `argMax(Field, Key)`; `minimum:` is `argMin`. This is the primitive behind
almost every "first", "last" and "at the peak" question:

```graphql
Price { Ohlc {
  Open(minimum: Interval_Time_Start)    # first value in the window
  Close(maximum: Interval_Time_Start)   # last value in the window
} }
```

:::caution It returns the field, not the key
`Number(maximum: Block_GasUsed)` returns the block **number** of the highest-gas block — not the
gas figure. Reading it as "the maximum of the argument" is the single most common mistake.
:::

## Where it works

Every **non-aggregate leaf path** in a Trading cube accepts both `maximum:` and `minimum:`. Only
the 23 aggregate functions (`sum`, `count`, `uniq`, `median`, `calculate`, `correlation`,
`gini`, …) do not. That gives a large surface on every cube — on the order of 30 to 60 paths
each, across `Trading.Trades`, `Trading.Pairs`, `Trading.Tokens` and `Trading.Currencies`.

**You can argmax *into* a string, but never *by* one.** The key must be a comparable column, so
`side`-style string columns are rejected at GraphQL validation rather than failing at runtime.
`Block_Date` and `Block_Timestamp` are string-typed but comparable, so they *are* valid keys.

```graphql
# valid — the value is a string, the key is numeric
TransactionHeader { Hash(maximum: Amounts_Base) }
```

`calculate` cannot substitute here: its column is typed `Float64`, so
`calculate(expression: "argMax(TransactionHeader_Hash, Amounts_Base)")` fails. Use the
field-level selector.

## Row coherence — the rule that makes this useful

**All selectors sharing one key resolve to the same underlying row.** So this returns a genuine,
internally consistent snapshot of the largest trade:

```graphql
Trader { Address(maximum: AmountsInUsd_Quote) }
Pair { Pool { Address(maximum: AmountsInUsd_Quote) } }
TransactionHeader { Hash(maximum: AmountsInUsd_Quote) }
```

:::danger Mixing keys silently fabricates a row
Selectors keyed on **different** columns come from **different rows**. Combining them produces a
composite that never existed on chain — no error, no warning:

```graphql
# these two are from different rows
Open(minimum: Block_Time)
Trader { Address(maximum: AmountsInUsd_Quote) }
```

That is fine when you intend it (an OHLC bar is built exactly this way). It is a bug when you
meant "one row".
:::

## Ties are resolved non-deterministically

When several rows tie on the key, the winner varies between identical runs — even over a frozen
window. The choice is made **once per response**, so fields sharing that key stay coherent with
each other; it is *which* tied row you get that moves.

`Block_Time` is second-resolution and ties readily on busy pools. Break ties with a second,
finer key — `Block_Timestamp` is nanosecond-resolution — or accept that any tied row is
representative.

## Making it per-group

Argmax becomes per-group when you **select a dimension**, which introduces the GROUP BY:

```graphql
Token { Id }                                   # <- this makes it per-token
peak: Price { Ohlc { High(maximum: Price_Ohlc_High) } }
```

`limitBy` is orthogonal — it caps how many result rows survive per key and composes fine with
argmax, but it is **not** what makes the argmax per-group. Select `limitBy` with no dimension and
you get one global argmax.

## Combining with other arguments

- **`if:`** turns the selector into `argMaxIf`, and takes the full cube filter type — any
  `where`-shape the cube accepts.
- **`selectWhere:`** applies HAVING semantics to the argmax result: groups whose result fails the
  predicate are dropped **before** ordering and limiting, so lower-ranked groups get pulled into
  the limit window. The predicate is `Metric_filter_Float` for numeric paths and
  `Metric_filter_String` for string paths.

## Two footguns

:::warning `maximum:` and `minimum:` on one field — only the first applies
Supplying both on a single field occurrence is **silently accepted**, and only the first-listed
argument takes effect. The other is dropped with no error.

To get both ends of a range, use two aliased selections:

```graphql
first: Price { Ohlc { Open(minimum: Block_Time) } }
last:  Price { Ohlc { Close(maximum: Block_Time) } }
```
:::

:::warning An empty set returns type-zeros, not an empty result
If an `if:` filter matches nothing, the cube still emits a row and the selector returns a
type-zero — `0`, or `""`. That is **indistinguishable from a genuine zero**. Pair the selector
with `count(if: <the same filter>)` to tell the two apart.
:::

## Related

- [Calculations and Expressions](/docs/graphql/calculations/)
- [Conditions with `if`](/docs/graphql/metrics/if/)
- [Screeners with `selectWhere`](/docs/trading/query-operators/selectwhere-screeners/)
- [OHLC candles](/docs/trading/crypto-price-api/crypto-ohlc-candle-k-line-api/)
