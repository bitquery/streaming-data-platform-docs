---
sidebar_position: 7
---

# Date and Time

## Format

For both date and time we use only UTC timezone.

Time has a standard representation in Graphql.
The DateTime scalar type represents a DateTime. The DateTime is serialized as an RFC 3339 quoted string

## Interval

In case when you need to aggregate data over the period of time,
you use the interval argument for the date or time field.

Example is OHLC query over [DEX trade](/docs/evm/dextrades):

```graphql
Time(interval: {in: minutes count: 10})
```

Same interval can be applied to Date:
```graphql
Date(interval: {in: months count: 12})
```

## Offset

Sometimes the start of interval should be shifted from the rounding start.
In this case use offset:

```graphql
Time(interval: {in: minutes count: 10 offset: 1})
```

Will count 1,11,21 and so on minutes.