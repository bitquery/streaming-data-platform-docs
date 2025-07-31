# Tokens Cube

### Fields in the Schema

```graphql
subscription {
  Trading {
    Tokens(where: { Interval: { Time: { Duration: { eq: 60 } } } }) {
      Token {
        Address
        Id
        IsNative
        Name
        Network
        Symbol
        TokenId
      }
      Block {
        Date
        Time
        Timestamp
      }
      Interval {
        Time {
          Start
          Duration
          End
        }
      }
      Volume {
        Base # Volume of the token itself
        Quote # Volume of all tokens it traded against
        Usd # Combined USD volume across all trades
      }
      Price {
        IsQuotedInUsd # Whether price values are in USD (true/false)
        Ohlc {
          Open
          High
          Low
          Close
        }
        Average {
          Mean
          SimpleMoving
          WeightedSimpleMoving
          ExponentialMoving
        }
      }
      Currency {
        Name
        Symbol
        Id
      }
    }
  }
}
```

### Key Points to Understand:

- **What is the Tokens Cube?**  
  The **Tokens** cube provides chain-specific, aggregated price and volume data for individual tokens. This includes OHLC values, moving averages, and volume across **all pairs** the token is traded with.
- **Volume Section Explained:**

  - `Base`: Volume of the token itself (the token in question) for all pairs.
  - `Usd`: Total base volume converted to USD.

> Please ignore the other fields, they're for internal reference and will be removed later.

- **IsQuotedInUsd**:  
  A boolean indicating whether the OHLC and average prices are expressed in USD (`true`) or in the quote token's value (`false`).
- **Clarification on "Quote":**  
  The **Tokens** cube **does not show the specific quote tokens** used in each trade. Instead, it aggregates across all pairs the token is involved in—regardless of which token acted as the quote in those trades.
- If you need **pair-level granularity** (i.e., to know exactly which token was the quote in a specific pair), use the **Pairs Cube** instead.
