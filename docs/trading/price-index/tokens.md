# Tokens Cube

```
subscription{
  Trading {
    Tokens(
      where: {Token: {Network: {is: "Binance Smart Chain"}}, Interval: {Time: {Duration: {eq: 60}}}}
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
      Currency {
        Name
        Symbol
        Id
      }
    }
  }
}

```