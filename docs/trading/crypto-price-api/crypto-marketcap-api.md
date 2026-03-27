# Crypto MarketCap API

The **Crypto MarketCap API** is part of the Crypto Price APIs: you can **query** USD **market capitalization** and related **supply** fields, or **stream** them in **real time** for many chains using GraphQL **subscriptions** or the **`trading.prices`** Kafka topic described in the [Crypto Price API introduction](/docs/trading/crypto-price-api/introduction). 

Those metrics are returned on the **`Supply`** object on **Currencies**, **Tokens**, and **Pairs** rows (`MarketCap`, `CirculatingSupply`, `TotalSupply`, and others). Field semantics are documented in the [Supply fields reference](/docs/trading/crypto-price-api/supply-fields). For intervals, cubes, and streaming setup, use the [Crypto Price API introduction](/docs/trading/crypto-price-api/introduction).



## MarketCap of a Coin

Set a **currency id** or token **address** and read **`Supply.MarketCap`** from the query below. See the [Supply fields reference](/docs/trading/crypto-price-api/supply-fields) for related supply fields. You can also stream this in real-time by adding the keyword "subscription" at the top.

[Run query ➤](https://ide.bitquery.io/pump-token-mcap-latest)

```graphql
{
  Trading {
    Tokens(
      where: {
        Currency: { Id: { is: "pump" } }
        Interval: { Time: { Duration: { eq: 1 } } }
      }
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
    ) {
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
      Price {
        IsQuotedInUsd
        Ohlc {
          Close
          High
          Low
          Open
        }
        Average {
          ExponentialMoving
          Mean
          SimpleMoving
          WeightedSimpleMoving
        }
      }
      Supply {
        TotalSupply
        MarketCap
        FullyDilutedValuationUsd
      }
    }
  }
}
```

## Top Coins by Market Cap on a Chain

 In this API, we fetch top tokens by MarketCap on Solana. Change Network fields to get top tokens for a different network or remove to get top tokens across all. We also add `Volume: {Usd: {gt: 1000}` filter to remove low-volume tokens.
 
 See the [Supply fields reference](/docs/trading/crypto-price-api/supply-fields) for related supply fields. 

You can also stream this in real-time by adding the keyword "subscription" at the top.

[Run query ➤](https://ide.bitquery.io/top-tokens-by-mcap-on-Solana-vol-gt-1000-USD)

```graphql
{
  Trading {
    Tokens(
      limit: {count: 50}
      limitBy: {count: 1, by: Token_Id}
      orderBy: {descending: Supply_MarketCap}
      where: {Interval: {Time: {Duration: {eq: 1}}}, Volume: {Usd: {gt: 1000}}, Token: {Network: {is: "Solana"}}}
    ) {
      Currency {
        Id
        Name
        Symbol
      }
      Price {
        Average {
          Mean(maximum: Block_Time)
        }
      }
      Volume {
        Base(maximum: Block_Time)
        Quote(maximum: Block_Time)
        Usd(maximum: Block_Time)
      }
      Token {
        Network
        Symbol
        Address
      }
      Supply {
        MarketCap(maximum: Block_Time)
        FullyDilutedValuationUsd(maximum: Block_Time)
        TotalSupply(maximum: Block_Time)
      }
    }
  }
}

```

## Total Supply of a Coin

Set a **currency id** on **Currencies** and read **`Supply.TotalSupply`** and related fields from the query below. See the [Supply fields reference](/docs/trading/crypto-price-api/supply-fields) for related supply fields. You can also stream this in real-time by adding the keyword "subscription" at the top.

```graphql
{
  Trading {
    Currencies(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        Currency: { Id: { is: "pump" } }
        Interval: { Time: { Duration: { eq: 60 } } }
      }
    ) {
      Currency {
        Id
        Name
        Symbol
      }
      Supply {
        TotalSupply
        CirculatingSupply
        MaxSupply
        MarketCap
        FullyDilutedValuationUsd
      }
    }
  }
}
```

## Market Cap Change 1h

Set **`Token: { Network: { is: "..." } }`** and a **1 hour** interval and read ranked **`change_mcap`** from the query below. See the [Supply fields reference](/docs/trading/crypto-price-api/supply-fields) for related supply fields and [expressions](/docs/graphql/capabilities/expression/) for `calculate`. You can also stream this in real-time by adding the keyword "subscription" at the top.

[Run query ➤](https://ide.bitquery.io/top-tokens-by-mcap-change-1h-on-Solana)

```graphql
{
  Trading {
    Tokens(
      limit: { count: 50 }
      orderBy: { descendingByField: "change_mcap" }
      where: {
        Interval: { Time: { Duration: { eq: 3600 } } }
        Token: { Network: { is: "Solana" } }
      }
    ) {
      Currency {
        Id
        Name
        Symbol
      }
      Token {
        Network
        Symbol
        Address
      }
      Supply {
        MarketCap
        FullyDilutedValuationUsd
        CirculatingSupply
        TotalSupply
        MaxSupply
      }
      change_mcap: calculate(
        expression: "($Price_Ohlc_Close-$Price_Ohlc_Open) * Supply_TotalSupply"
      )
      Price {
        Ohlc {
          Open
          Close
        }
      }
    }
  }
}
```
