# Relative Time Filters

Bitquery's GraphQL API now supports **relative time filtering**. This filtering option simplify querying time-dependent blockchain data without manually calculating or formatting exact UTC timestamps.

---

## Why Use Relative Time?

Traditionally, time-based filters required exact `UTC timestamp` as shown below, which could make the development experience tedious as the user is required to add logic to update the `timestamp` again and again.

```graphql
Block: { Time: { after: "2025-08-01T00:00:00" } }
```

With relative filters, you can write queries in a simpler way, improving readability and flexibility, thus imporoving the development experience.

```graphql
Block: { Time: { after_relative: { hours_ago: 1 } } }
```

## Supported Relative Time Filters

The list of supported relative time filters is given below.

| Operator          | Description                            |
| ----------------- | -------------------------------------- |
| `after_relative`  | Time **after** a given relative point  |
| `before_relative` | Time **before** a given relative point |
| `since_relative`  | Alias for `after_relative`             |
| `till_relative`   | Alias for `before_relative`            |
| `is_relative`     | Exact match to a relative point (rare) |

## Supported Time Units

The list of supported time units are given below.

| Unit           | Description                                                                 |
|----------------|-----------------------------------------------------------------------------|
| `seconds_ago`  | Refers to a number of seconds before the current time                      |
| `minutes_ago`  | Refers to a number of minutes before the current time                      |
| `hours_ago`    | Refers to a number of hours before the current time                        |
| `days_ago`     | Refers to a number of days before the current time                         |
| `weeks_ago`    | Refers to a number of weeks before the current time                        |
| `years_ago`    | Refers to a number of years before the current time                        |

## Examples

### Last Hour Trades

The following examples uses the `after_relative` filter to get Solana DEX Trades for the last `1 hour`. You can checkout from the results that the oldest trades returned occured an hour ago(UTC Time).

```graphql
{
  Solana {
    DEXTrades(
      where: {Block: {Time: {after_relative: {hours_ago: 1}}}}
      orderBy: {ascending: Block_Time}
    ) {
      Trade {
        Buy {
          AmountInUSD
        }
      }
      Block {
        Time
      }
    }
  }
}
```

### Using Multiple Time Units Together

You can use multiple time units together as shown in the example below.

```graphql
{
  Solana {
    DEXTrades(
      where: {Block: {Time: {after_relative: {hours_ago: 1, minutes_ago: 30, seconds_ago: 30}}}}
      orderBy: {ascending: Block_Time}
    ) {
      Trade {
        Buy {
          AmountInUSD
        }
      }
      Block {
        Time
      }
    }
  }
}
```