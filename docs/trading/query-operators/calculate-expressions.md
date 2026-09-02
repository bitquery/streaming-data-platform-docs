---
sidebar_position: 7
title: "Derived Values with calculate()"
description: "calculate(expression:) evaluates an expression server-side on the Bitquery Trading cube — the $ reference rule, when it forces a GROUP BY, and the coercion and non-finite traps."
---

# Derived Values with `calculate()`

`calculate(expression: "...")` computes a derived value server-side, so ratios, differences and
percentages come back with the row instead of being assembled in your client.

```graphql
buys:  count(if: { Side: { is: "Buy" } })
all:   count
ratio: calculate(expression: "$buys / $all")
```

## `$name` refers to a response key

Inside an expression, `$name` refers to **a key in the same selection set** — the explicit alias
when you give one, otherwise the field's own path with nested levels joined by underscore:

| Selection | Reference |
| --- | --- |
| `all: count` | `$all` |
| `Amounts { Base }` | `$Amounts_Base` |
| `q: Amounts { Base }` | `$q_Base` |

It reaches native fields, native metrics and other `calculate` results alike. **The `$` is
required** — a bare `buys / all` is passed through as raw column names and fails.

References are **order-independent** (a forward reference is fine) and chain to any depth. They
compile to SQL aliases, so a self-reference fails with `Code: 47 MISSING_COLUMNS` and a mutual
reference with `Code: 174 CYCLIC_ALIASES`.

## When your query becomes aggregated

**`calculate` never triggers a GROUP BY on its own.** What matters is whether a *native* metric
(`count`, `sum`, `uniq`, `average`, …) is present:

- **No native metric** — the query stays in row mode. A bare column reference such as
  `"Amounts_Base"` evaluates per row and works fine.
- **A native metric is present** — the API groups by the selected dimensions. Any bare column in
  your expression must now be one of those selected dimensions, or ClickHouse raises
  `Code: 215 NOT_AN_AGGREGATE`.

:::caution The error names the wrong field
`Code: 215` names the **dimension**, not your expression — for example
`Column 'Price' is not under aggregate function and not in GROUP BY`. The fix is usually to add a
native metric, or to select the column your expression references.
:::

An aggregate expression on its own is fine — `calculate(expression: "sum(Amounts_Base)")` with
nothing else selected returns one row. It only needs a companion native metric once you also
select a dimension.

## What you can write

The expression is evaluated by ClickHouse, so the standard function library is available:
arithmetic (`+ - * / %`), `pow`, `sqrt`, `abs`, `log`, `round`, `greatest`, `least`, conditionals
(`if`, `multiIf`), aggregates (`sum`, `count`, `avg`, `min`, `max`, `uniqExact`, `argMax`,
`sumIf`, `countIf`, `quantile(0.5)(...)`) and window forms such as `row_number() OVER ()`.

```graphql
buyShare: calculate(expression: "countIf(Side = 'Buy') / count()")
```

Use **single quotes** for SQL string literals — the expression is a GraphQL string, so a double
quote must be escaped. Commas, nested parentheses, newlines and SQL comments are all fine.

## Ranking by a derived value

`orderBy` accepts a `calculate` alias, and it composes with `limitBy` — this is the
rank-by-derived-ratio pattern:

```graphql
orderBy: { descendingByField: "buyShare" }
limitBy: { by: Pair_Token_Address, count: 1 }
```

`calculate` itself takes **no `selectWhere` and no `if:`** — `expression` is its only argument.
To gate a ranked ratio, put a `selectWhere` floor on a sibling aggregate (for example
`count(selectWhere: { ge: "100" })`) and apply the final cut on the ratio in your client.

## Traps

| Trap | Behaviour |
| --- | --- |
| **Everything coerces to Float** | The expression is wrapped in `toFloat64(...)` and the field's type is `Float`. A string-producing expression fails with `Code: 6` unless the string parses as a number — `toString(42)` works, `concat('a','b')` does not |
| **`^` is not exponentiation** | `2^3` fails with `Code: 62`. Use `pow(2,3)` |
| **The ternary `? :` is unusable** | `?` collides with the SQL builder's placeholder — `not enough args when interpolating`. Use `if(cond, a, b)` |
| **Booleans and dates flatten** | `Bool` → `1`/`0`, `DateTime` → unix seconds, `Date` → days since epoch |

:::danger Infinity, NaN and NULL are silently returned as `0`
A divide-by-zero ratio comes back as `0`, indistinguishable from a genuine zero — and under
`ascendingByField` those rows sort **first**.

The values really are non-finite inside ClickHouse (`isInfinite(count()/0)` returns `1`), so guard
the denominator yourself:

```graphql
safe: calculate(expression: "$numerator / nullIf($denominator, 0)")
```
:::

## In subscriptions

The grammar is much narrower on a stream: **arithmetic only**. Every function call — `round()`,
`floor()`, `abs()` — returns `null`, and a single unsigiled reference makes the whole expression
`null` with no error. See
[what does not survive streaming](/docs/subscriptions/what-does-not-survive-streaming/).

## Related

- [Expressions (general reference)](/docs/graphql/capabilities/expression/)
- [Screeners with `selectWhere`](/docs/trading/query-operators/selectwhere-screeners/)
- [Statistics](/docs/trading/query-operators/statistics/)
