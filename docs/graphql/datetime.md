---
sidebar_position: 7
---

# Date and Time

## Format

We use the UTC timezone for both date and time. In Graphql, time is represented as a `DateTime` scalar type in the RFC 3339 quoted string format.

## Interval

When aggregating data over time, use the interval argument for `Date` and `Time` fields. For example, in an OHLC query for [DEX trade](/docs/schema/evm/dextrades):

```graphql
Time(interval: {in: minutes, count: 10})
```

You can apply the same interval to `Date`:
```graphql
Date(interval: {in: months, count: 12})
```

:::note

Maintain consistency by using order or orderBy when filtering data with `Time` or `Date`. If you create intervals using `Time`, use `Block_Time`, and for `Date`, use `Block_Date`.

:::

## Offset

To shift the starting point of an interval, use the `offset` parameter:

```graphql
Time(interval: {in: minutes count: 10 offset: 1})
```

This configuration will count intervals starting at 1, 11, 21, and so on in minutes.