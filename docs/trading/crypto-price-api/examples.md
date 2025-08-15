
# Quick Start Examples

## OHLC Stream on a Chain

Mention the chain/network using the `Token: {Network}` filter.  
Available values: `Ethereum`, `Solana`, `Base`, `Optimism`, `Opbnb`, `Matic`, `Arbitrum`, `Binance Smart Chain`, `Tron`.

The available duration intervals are listed [here](https://docs.bitquery.io/docs/trading/price-index/introduction/#understanding-intervals).

[Run Stream ➤](https://ide.bitquery.io/Aggregated-Price-of-all-tokens-in-real-time-on-one-chain_1)

```graphql
subscription {
  Trading {
    Tokens(
      where: {Token: {Network: {is: "Solana"}}, Interval: {Time: {Duration: {eq: 60}}}}
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

[Run Stream ➤](https://ide.bitquery.io/Token-OHLC-Stream-1-second-Multi-Chains)

```graphql
subscription {
  Trading {
    Pairs(
      where: {Price: {}, Interval: {Time: {Duration: {eq: 1}}}, Currency: {Id: {is: "bid:eth"}}, QuoteCurrency: {Id: {is: "usdc"}}}
    ) {
      Token {
        Id
        Symbol
      }
      QuoteToken {
        Id
        Symbol
      }
      Interval {
        Time {
          Start
        }
      }
      Volume {
        Usd
        Quote
        Base
      }
      Price {
        Ohlc {
          Open
          High
          Low
          Close
        }
      }
      QuoteCurrency {
        Id
      }
    }
  }
}


```



## Find Price Arbitrage Opportunity of Pair Across Chains

[Run Stream ➤](https://ide.bitquery.io/Find-arbitrage-opportunity-with-same-token-across-chains)

```graphql
{
  Trading {
    Pairs(
      where: {
        Currency: {Id: {is: "bid:bitcoin"}}
        QuoteCurrency: {Id: {is: "usdt"}}
      }
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      limitBy: {by: Market_Address, count: 1}
    ) {
      Currency {
        Name
        Id
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
        }
      }
      QuoteCurrency {
        Id
        Symbol
        Name
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
        Name
        Id
        NetworkBid
      }
    }
  }
}

```


## 5 Minute Price Change API

This stream uses [expressions](http://docs.bitquery.io/docs/graphql/capabilities/expression/)

[Run Stream ➤](http://ide.bitquery.io/5-minute-price-change-api)

```graphql
{
  Trading {
    Tokens(
      limit: {count: 10}
      orderBy: {descendingByField: "change"}
      where: {
        Volume: {Usd: {gt: 100000}}
        Interval: {Time: {Duration: {eq: 300}}}
      }
    ) {
      Token {
        Address
        Did
        Id
        IsNative
        Name
        Network
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
        BaseQuotedInUsd
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

This stream uses [expressions](http://docs.bitquery.io/docs/graphql/capabilities/expression/)

[Run Stream ➤](https://ide.bitquery.io/5-minute-price-change-api-on-solana)

```graphql
{
  Trading {
    Tokens(
      limit: {count: 10}
      limitBy: {count: 1 by: Token_Id}
      orderBy: [{descending: Block_Time}, {descendingByField: "change"}]
      where: {
        Token: {Network: {is: "Solana"}}
        Volume: {Usd: {gt: 100000}}
        Interval: {Time: {Duration: {eq: 300}}}
      }
    ) {
      Token {
        Address
        Did
        Id
        IsNative
        Name
        Network
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
        BaseQuotedInUsd
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

[Run Stream ➤](https://ide.bitquery.io/5-minute-price-change-api-on-solana)

```graphql
subscription {
  Trading {
    Currencies(
      where: {
        Interval: {
          VolumeBased: true
          TargetVolume: {eq: 1000000}
        }
        Currency: {Id: {is: "bid:bitcoin"}}
      }
    ) {
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
        BaseQuotedInUsd
        Quote
        Usd
      }
      Price {
        IsQuotedInUsd
        Average {
          Mean
        }
      }
    }
  }
}

```

## PumpAMM 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders

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

