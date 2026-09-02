---
sidebar_position: 1
title: "Wallet Overlap with array_intersect"
description: "Find the wallets that traded every token in a set, in one request, using array_intersect on the Bitquery Trading Trades cube."
---

# Wallet Overlap with `array_intersect`

`array_intersect` answers one question well: **which entities appear against every member of a
set?** The common form is "which wallets traded all of these tokens" — a single request, no
client-side joins, and the result is exact.

## Trades only

`array_intersect` exists on all four Trading cubes, but wallet overlap needs `Trader_Address`,
and that field exists **only** in `Trading_Trade_StringFields`. The other three cubes have no
trader axis at all:

| Enum | Contains `Trader_Address`? |
| --- | --- |
| `Trading_Trade_StringFields` | **yes** — also the only enum with `TransactionHeader_Sender` / `_FeePayer` / `_To` / `_Hash` |
| `Trading_Pair_StringFields` | no |
| `Trading_Token_StringFields` | no |
| `Trading_Currency_StringFields` | no |

`side1` and `side2` are non-null enums, so naming a field the cube does not have is a schema
error rather than a silently wrong answer:

```
Argument "side1" has invalid value Trader_Address.
Expected type "Trading_Pair_StringFields"
```

## The query

Wallets that traded **both** WSOL and USDC on Solana in a window:

```graphql
{
  Trading {
    Trades(
      where: {
        Pair: {
          Market: { Network: { is: "Solana" } }
          Token: { Id: { in: [
            "bid:solana:So11111111111111111111111111111111111111112",
            "bid:solana:EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
          ] } }
        }
        Block: { Time: { since: "2026-09-01T12:00:00Z", till: "2026-09-01T12:01:00Z" } }
      }
      limit: { count: 1 }
    ) {
      overlap: array_intersect(
        side1: Trader_Address
        side2: Pair_Token_Id
        intersectWith: [
          "bid:solana:So11111111111111111111111111111111111111112",
          "bid:solana:EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
        ]
      )
      n: count
    }
  }
}
```

You get one row containing an array of the wallet addresses that traded **every** listed token.
The same shape works on Ethereum, BSC and Base — swap the network and the token ids.

**Verify it yourself**, rather than trusting the array: pull the raw trades for the same window,
bucket `Trader.Address` by `Pair.Token.Id`, and intersect the buckets in your client. The result
is set-equal.

## How it works

Understanding the mechanism explains every surprise below. For each value `v` in
`intersectWith`, the engine builds:

```sql
groupUniqArrayIf(if(side1 = v, side2, side1), side1 = v OR side2 = v)
```

— that is, **the other side of every row where `v` appears on either side** — and then
intersects those per-value sets.

Two consequences worth internalising:

- It is not "collect `side2` where `side1 = v`". A row matches when `v` is on **either** side,
  and the value contributed is whichever side `v` is not on.
- `side1` and `side2` are therefore **symmetric**: swapping them returns the same set. This
  follows from the SQL, not just from testing.

## Exact, and not truncated

The array is built with `groupUniqArray`, so it is an **exact** distinct set, and it is returned
whole in one array rather than paged.

:::tip Prefer `array_intersect` over `uniq` when the two disagree
`uniq()` switches to an approximate estimator above roughly 65,000 distinct values, so on large
windows `uniq(of: Trader_Address)` and a single-member `array_intersect` will differ slightly.
`array_intersect` is the exact side. If you need an exact distinct count on a large population,
take the array's length.
:::

## Gotchas

| Behaviour | What happens | What to do |
| --- | --- | --- |
| `where` excludes an `intersectWith` member | Silent empty array — populated row, `count` non-zero, HTTP 200, no error | Make the `where` clause span **every** member you intersect on |
| Empty or omitted `intersectWith` | Malformed SQL: `Code: 47. DB::Exception: Missing columns: 'AS'` | Always pass a non-empty list; the schema does not enforce it |
| `selectWhere` on the result | Every operator fails with `go-sqlbuilder: unsupported args when interpolating` | You **cannot** filter for "intersection is non-empty" server-side — filter in your client |
| `orderBy` on the alias | Sorts arrays **elementwise (lexicographic)**, not by length | Sort by length in your client |
| Element order | Not stable — reversing the `intersectWith` order returns the same set in a different order | Treat the result as a set and sort client-side |
| Used in a subscription | Absent from all four stream cubes | Query only — see [what does not survive streaming](/docs/subscriptions/what-does-not-survive-streaming/) |

## Beyond wallets

`side1` / `side2` accept any string field, so the same operator answers other "appears against
every member" questions — for example which DEX venues quote every token in a basket, using
`Pair_Market_Name` and `Pair_Token_Symbol`.

## Related

- [Array Intersection (general reference)](/docs/graphql/capabilities/array-intersect/)
- [Crypto Trades API](/docs/trading/crypto-trades-api/trades-api/)
- [Traders API](/docs/trading/crypto-trades-api/traders-api/)
