---
sidebar_position: 4
title: "Trading Filters and Operators Reference"
description: "The complete where-clause surface of the Bitquery Trading cubes: operator sets per scalar type, the any combinator, per-cube filter branches, and the traps that return silently wrong results."
---

# Trading Filters and Operators Reference

Every `where` clause on a Trading cube is built from a small, regular set of leaf filter types.
This page is the reference for which operators exist, which branches each cube exposes, and the
handful of places where a filter returns something other than what it looks like.

## Operator sets by leaf type

There is no single operator vocabulary — it depends on the column's type.

| Leaf type | Operators | Value |
| --- | --- | --- |
| `OLAP_String` | `is` `not` `in` `notIn` `like` `notLike` `likeCaseInsensitive` `notLikeCaseInsensitive` `includes` `notIncludes` `includesCaseInsensitive` `notIncludesCaseInsensitive` `startsWith` `startsWithCaseInsensitive` `endsWith` | String |
| `OLAP_Float` | `eq` `ne` `ge` `le` `gt` `lt` — **no `in` / `notIn`** | Float |
| `OLAP_Integer` | `eq` `ne` `in` `notIn` `ge` `le` `gt` `lt` | Int |
| `OLAP_BigInteger` | `eq` `ne` `in` `notIn` `ge` `le` `gt` `lt` | **String** of decimal digits |
| `OLAP_DateTime` | `is` `not` `in` `notIn` `since` `till` `after` `before`, plus `_relative` variants | `DateTime` |
| `OLAP_Date` | the same set | `YYYY-MM-DD` string |
| `Boolean` | none — pass a bare `true` / `false` | Boolean |

The three biggest surprises here: **`OLAP_Float` has no `in`**, `OLAP_BigInteger` takes its value
as a **string**, and boolean fields take a bare value rather than an operator object.

### Relative time

`_relative` variants (`since_relative`, `before_relative`, …) take `seconds_ago`, `minutes_ago`,
`hours_ago`, `days_ago`, `weeks_ago`, `months_ago`, `years_ago`, and a `round: { count, offset, in }`
for snapping to a boundary.

:::note Relative windows move between runs
A relative window advances every second, so two identical requests cover different data. When
comparing results or testing determinism, use explicit `since` / `till`.
:::

## `any` is the only boolean combinator

```graphql
where: { any: [ { ... }, { ... } ] }    # OR
```

There is **no `all`, `or`, `and` or `not`**. Sibling keys at any level are AND-ed together —
including a sibling of `any`. And `any` **cannot nest**: its element type is the cube filter
minus its own `any` field.

## Which branches each cube exposes

| Branch | Trades | Pairs | Tokens | Currencies |
| --- | :-: | :-: | :-: | :-: |
| `Block` · `Price` · `Supply` · `any` | ✅ | ✅ | ✅ | ✅ |
| `Currency` | — | ✅ | ✅ | ✅ |
| `Interval` · `Volume` | — | ✅ | ✅ | ✅ |
| `Token` | — | ✅ | ✅ | — |
| `Ranking` | ✅ | ✅ | ✅ | — |
| `Market` · `Pool` · `QuoteCurrency` · `QuoteToken` | — | ✅ | — | — |
| `Amounts` · `AmountsInUsd` · `PriceInUsd` · `Side` · `Trader` · `TransactionHeader` · `Pair` | ✅ | — | — | — |

:::warning Where-clauses are not interchangeable between cubes
`Pair` is unknown on Pairs (use top-level `Token` / `QuoteToken` / `Market` / `Pool`); `Interval`
is unknown on Trades; `Market` / `Pool` / `QuoteToken` are unknown on Tokens. Copying a clause
from one cube to another is the most common cause of `Argument "where" has invalid value`.

The network filter differs too: `Pair.Market.Network` on Trades, `Market.Network` on Pairs,
`Token.Network` on Tokens.
:::

`Price` exists on all four but has **different shapes**: on Trades it is a bare `OLAP_Float` (the
trade price); on the other three it is an object with `Ohlc.*`, `Average.*` and `IsQuotedInUsd`.

## `Currency` is not `Token`

`Token` is the per-network contract instance. `Currency` is the **cross-chain asset**, so one
predicate spans every chain the asset trades on.

The practical consequence catches people out: a wrapped token's `Currency` is the underlying
native asset. For WSOL, `Currency` is `{ Id: "bid:solana", Symbol: "SOL" }` — so
`Currency: { Symbol: { is: "WSOL" } }` matches **nothing**, while `Token: { Symbol: { is: "WSOL" } }`
works. Native assets carry `Currency.Id = "bid:<chain>"`, whereas `QuoteCurrency.Id` uses a plain
slug (`"usdc"`), not the `bid:` form.

## Filtering to a single DEX or protocol

On `Trading.Trades`, filter the market rather than the token:

```graphql
where: { Pair: { Market: { ProtocolFamily: { is: "..." } } } }
```

`Market.Protocol`, `Market.Program` and `Market.Name` work the same way. Values are
**case-sensitive** and use each protocol's own canonical spelling.

## Traps

| Trap | What happens | Do instead |
| --- | --- | --- |
| **Bare `{ count }` on Trades filtered by `Pair.Token.Address` or `Pair.Pool.Address`** | Returns a **wildly inflated** count — an order of magnitude high. Adding any dimension or a second aggregate returns the correct figure. | Filter on `Token.Id` instead, or always project a dimension alongside `count` |
| Checksummed EVM address | Returns 0 rows, no error | Addresses are stored **lowercase**; `is` / `in` are exact-match |
| Wrong `Network` spelling | Returns 0 rows, no error | Case-sensitive display names — Polygon is `"Matic"`, BSC is `"Binance Smart Chain"` |
| `Token.TokenId` / `Token.Did` | Filterable but empty on rows, so any predicate matches nothing | Use `Token.Id` (`bid:<chain>:<address>`) or `Token.Address` |
| Bare address in `Token.Id` | Returns 0 rows silently | `Token.Id` is chain-qualified; use `Token.Address` for a raw address |
| `Interval.VolumeBased` / `TargetVolume` | Parse fine, match nothing | See [Volume-Based Aggregation](/docs/trading/crypto-price-api/crypto-ohlc-candle-k-line-api#volume-based-aggregation) |

## Discovering the full leaf set

The leaf paths per cube number in the dozens and change as fields are added. Introspect rather
than working from a static list:

```graphql
{ __type(name: "Trading_Trade_Filter") {
    inputFields { name type { name kind ofType { name kind ofType { name } } } } } }
```

Swap in `Trading_Pair_Filter`, `Trading_Token_Filter` or `Trading_Currency_Filter`.

## Related

- [Screeners with `selectWhere`](/docs/trading/query-operators/selectwhere-screeners/)
- [Argmax selectors](/docs/trading/query-operators/argmax-selectors/)
- [Trading Data Overview](/docs/trading/trading-data-overview/)
