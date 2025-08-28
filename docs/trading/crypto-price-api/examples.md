# Quick Start Examples

## OHLC Stream on a Chain

Mention the chain/network using the `Token: {Network}` filter.  
Available values: `Ethereum`, `Solana`, `Base`, `Optimism`, `Opbnb`, `Matic`, `Arbitrum`, `Binance Smart Chain`, `Tron`.

The available duration intervals are listed [here](https://docs.bitquery.io/docs/trading/price-index/introduction/#understanding-intervals).

In Tokens cube, only `IsQuotedInUsd:true` is supported so you will see OHLC and Price values in USD only.

[Run Stream ➤](https://ide.bitquery.io/Aggregated-Price-of-all-tokens-in-real-time-on-one-chain)

```graphql
subscription {
  Trading {
    Tokens(
      where: {
        Token: { Network: { is: "Solana" } }
        Interval: { Time: { Duration: { eq: 60 } } }
      }
    ) {
      Token {
        Address
        Id
        IsNative
        Name
        Network
        Name
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
        Base
        Quote
        Usd
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
    }
  }
}
```

## OHLC of a Token Pair Across Chains

This subscription fetches real-time OHLC (Open, High, Low, Close) price data for a token pair across different blockchains.  
For **native tokens**, you only need to specify their ID (e.g., `bid:eth` for ETH).

Here we have selected the filter `Price: {IsQuotedInUsd: false}`, this means that any price values such as OHLC or Average indicators will be in terms of quote currency instead of USD. If you want them in USD, change the filter to `Price: {IsQuotedInUsd: true}`.

[Run Stream ➤](https://ide.bitquery.io/Token-OHLC-Stream-1-second-Multi-Chains_1)

```graphql
subscription {
  Trading {
    Pairs(
      where: {
        Price: { IsQuotedInUsd: false }
        Interval: { Time: { Duration: { eq: 1 } } }
        Currency: { Id: { is: "bid:eth" } }
        QuoteCurrency: { Id: { is: "usdc" } }
      }
    ) {
      Token {
        Id
        Symbol
        Address
        NetworkBid
        Network
        Name
      }
      QuoteToken {
        Id
        Symbol
        Address
        Name
        NetworkBid
      }
      Interval {
        Time {
          Start
          End
          Duration
        }
      }
      Volume {
        Usd
        Quote
        Base
      }
      Price {
        IsQuotedInUsd
        Ohlc {
          Open
          High
          Low
          Close
        }
        Average {
          Estimate
          ExponentialMoving
          Mean
          SimpleMoving
          WeightedSimpleMoving
        }
      }
    }
  }
}
```

## Find Price Arbitrage Opportunity of Pair Across Chains

Here we have selected the filter `Price: {IsQuotedInUsd: true}`, this means that any price values such as OHLC or Average indicators will be in USD. If you want them in quote currency, change the filter to `Price: {IsQuotedInUsd: false}`.

[Run Stream ➤](https://ide.bitquery.io/Find-arbitrage-opportunity-with-same-token-across-chains_1)

```graphql
query {
  Trading {
    Pairs(
      where: {
        Price: { IsQuotedInUsd: true }
        Currency: { Id: { is: "bid:bitcoin" } }
        QuoteCurrency: { Id: { is: "usdt" } }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      limitBy: { by: Market_Address, count: 1 }
    ) {
      Currency {
        Id
        Name
        Symbol
      }
      QuoteCurrency {
        Id
        Name
        Symbol
      }
      Market {
        Name
        NetworkBid
        Network
        Address
      }
      Price {
        IsQuotedInUsd
        Average {
          Mean
          Estimate
          SimpleMoving
          ExponentialMoving
          WeightedSimpleMoving
        }
      }
      QuoteToken {
        Symbol
        Name
        Id
        NetworkBid
        Network
        Did
        Address
      }
      Token {
        Symbol
        Name
        Id
        NetworkBid
        Network
        Did
        Address
      }
    }
  }
}
```

## 5 Minute Price Change API

Here we have selected the filter `Price: {IsQuotedInUsd: true}`, this means that any price values such as OHLC or Average indicators will be in USD. If you want them in quote currency, change the filter to `Price: {IsQuotedInUsd: false}`.

This stream uses [expressions](http://docs.bitquery.io/docs/graphql/capabilities/expression/)

[Run Stream ➤](https://ide.bitquery.io/5-minute-price-change-api_2)

```graphql
{
  Trading {
    Tokens(
      limit: { count: 10 }
      orderBy: { descendingByField: "change" }
      where: {
        Price: { IsQuotedInUsd: true }
        Volume: { Usd: { gt: 100000 } }
        Interval: { Time: { Duration: { eq: 300 } } }
      }
    ) {
      Token {
        Address
        Did
        Id
        IsNative
        Name
        Network
        Name
        Symbol
        TokenId
      }
      Currency {
        Symbol
        Id
        Name
      }
      Interval {
        VolumeBased
        Time {
          Start
          End
          Duration
        }
      }
      Volume {
        Base
        BaseAttributedToUsd
        Quote
        Usd
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
          Estimate
          ExponentialMoving
          Mean
          SimpleMoving
          WeightedSimpleMoving
        }
      }
      diff: calculate(expression: "Price_Ohlc_Close - Price_Ohlc_Open")
      change: calculate(expression: "round(($diff / Price_Ohlc_Open), 3) * 100")
    }
  }
}
```

## 5 Minute Price Change Stream on Solana

Here we have selected the filter `Price: {IsQuotedInUsd: true}`, this means that any price values such as OHLC or Average indicators will be in USD. If you want them in quote currency, change the filter to `Price: {IsQuotedInUsd: false}`.

This stream uses [expressions](http://docs.bitquery.io/docs/graphql/capabilities/expression/)

[Run Stream ➤](https://ide.bitquery.io/5-minute-price-change-api-on-solana_1)

```graphql
{
  Trading {
    Tokens(
      limit: { count: 10 }
      limitBy: { count: 1, by: Token_Id }
      orderBy: [{ descending: Block_Time }, { descendingByField: "change" }]
      where: {
        Price: { IsQuotedInUsd: true }
        Token: { Network: { is: "Solana" } }
        Volume: { Usd: { gt: 100000 } }
        Interval: { Time: { Duration: { eq: 300 } } }
      }
    ) {
      Token {
        Address
        Did
        Id
        IsNative
        Name
        Network
        Name
        Symbol
        TokenId
      }
      Currency {
        Symbol
        Id
        Name
      }
      Interval {
        VolumeBased
        Time {
          Start
          End
          Duration
        }
      }
      Volume {
        Base
        BaseAttributedToUsd
        Quote
        Usd
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
          Estimate
          ExponentialMoving
          Mean
          SimpleMoving
          WeightedSimpleMoving
        }
      }
      diff: calculate(expression: "Price_Ohlc_Close - Price_Ohlc_Open")
      change: calculate(expression: "round(($diff / Price_Ohlc_Open), 3) * 100")
    }
  }
}
```

## Volume-Based Bitcoin Price Stream

Here we have selected the filter `Price: {IsQuotedInUsd: true}`, this means that any price values such as OHLC or Average indicators will be in USD. If you want them in quote currency, change the filter to `Price: {IsQuotedInUsd: false}`.

[Run Stream ➤](https://ide.bitquery.io/5-minute-price-change-api-on-solana_5)

```graphql
{
  Trading {
    Tokens(
      limit: { count: 10 }
      limitBy: { count: 1, by: Token_Id }
      orderBy: [{ descending: Block_Time }, { descendingByField: "change" }]
      where: {
        Price: { IsQuotedInUsd: true }
        Token: { Network: { is: "Solana" } }
        Volume: { Usd: { gt: 100000 } }
        Interval: { Time: { Duration: { eq: 300 } } }
      }
    ) {
      Token {
        Address
        Did
        Id
        IsNative
        Name
        Network
        Name
        Symbol
        TokenId
      }
      Currency {
        Symbol
        Id
        Name
      }
      Interval {
        VolumeBased
        Time {
          Start
          End
        }
      }
      Volume {
        Base
        BaseAttributedToUsd
        Quote
        Usd
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
          Estimate
          ExponentialMoving
          Mean
          SimpleMoving
          WeightedSimpleMoving
        }
      }
      diff: calculate(expression: "Price_Ohlc_Close - Price_Ohlc_Open")
      change: calculate(expression: "round(($diff / Price_Ohlc_Open), 3) * 100")
    }
  }
}
```

## PumpAMM 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders

Here we have selected the filter `Price: {IsQuotedInUsd: true}`, this means that any price values such as OHLC or Average indicators will be in USD. If you want them in quote currency, change the filter to `Price: {IsQuotedInUsd: false}`.

[Run Stream ➤](https://ide.bitquery.io/PumpAMM-1-second-price-stream-with-OHLC)

```
subscription {
  Trading {
    Pairs(
      where: {Interval: {Time: {Duration: {eq: 1}}}, Price: {IsQuotedInUsd: true}, Market: {Network: {is: "Solana"}, Program: {is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"}}}
    ) {
      Market {
        Protocol
        Program
        Network
        Name
        Address
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
        Base
        Quote
        Usd
      }
      Price {
        Ohlc {
          Close
          High
          Low
          Open
        }
        IsQuotedInUsd
      }
    }
  }
}

```
