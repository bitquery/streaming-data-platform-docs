# Price API - Introduction

Starting July 2025, we have introduced separate chain-agnostic price APIs and Streams via graphQL and Kafka. They allow you to stream and query price, OHLC, statistics for all tokens on Bitcoin,EVM, Solana, Tron chains.

![](/img/trade_api/api.png)

> Note: All queries can be converted to a graphQL stream by changing the keyword `query` to `subscription`

## Currencies

Currencies are representation of all tokens on different chains. For example, take the case of Bitcoin, while it is a native token on Bitcoin chain, it is also traded on EVM chains as WBTC ( wrapped BTC). Now all these representations of BTC are represented as a single currency.

```

{
  Trading {
    Currencies(
      limit: {count: 1}
      orderBy: {descending: Block_Time}
      where: {Currency: {Id: {is: "bid:bitcoin"}}}
    ) {
      Volume {
        Usd
        Quote
        BaseQuotedInUsd
        Base
      }
      Price {
        Ohlc {
          Open
          Low
          High
          Close
        }
        IsQuotedInUsd
        Average {
          Mean
          WeightedSimpleMoving
          SimpleMoving
          ExponentialMoving

        }
      }
      Currency {
        Symbol
        Name
        Id
      }
      Block {
        Timestamp
      }
      Interval {
        Time {
          Duration
          Start
          End
        }

      }
    }
  }
}

```

### How the above query work?

It takes amounts and prices from all chains that use BTC and wrapped versions (including bridged versions) and presents an aggregated view. The OHLC, mean and other values represent a stable BTC picture.

## Tokens

Let's say you don't want a chain agnostic view, but want to focus on aparticular chain. How to stream or query prices for it? This is where tokens come in.

```
{
  Trading {
    Tokens(
      where: {Token: {Address: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}, Network: {is: "solana"}}, Interval: {Time: {Duration: {eq: 1}}}}
      limit: {count: 1}
      orderBy: {descending: Block_Time}
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
We filter for specific tokens using the token `Address` and `Network`. If you need to stream all token prices on say Solana, simply set `Network` to `solana`.
```
subscription {
  Trading {
    Tokens(where: {Token: {Network: {is: "solana"}}}) {
      Token {
        Address
        Id
        IsNative
        Name
        Network
        Name
        Symbol
        TokenId
        Network
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

## Pairs
