# Stablecoin Price API

The Stablecoin API by Bitquery provides you the comprehensive set of APIs which can provide you realtime transfers, realtime trades, realtime price, holder distribution of stablecoins across chains with a single API call. We will use the new [Crypto Price APIs](https://docs.bitquery.io/docs/trading/price-index/introduction/)

## Stream Latest Stablecoin Price

[Run Stream](https://ide.bitquery.io/stablecoin-1-second-price-stream)

```
subscription {
  Trading {
    Tokens(
      where: {Interval: {Time: {Duration: {eq: 1}}}, Currency: {Id: {in: ["usdt", "usdc", "tusd", "usdd", "usds", "usd₮0", "usd1", "dai"]}}}
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

## 5 Minute Price Change Stablecoin API

[Run Query](https://ide.bitquery.io/5-minute-price-change-stablecoin-API)

```
{
  Trading {
    Tokens(
      limit: {count: 10}
      limitBy: {count: 1, by: Token_Id}
      orderBy: [{descending: Block_Time}, {descendingByField: "change"}]
      where: {Currency: {Id: {in: ["usdt", "usdc", "tusd", "usdd", "usds", "usd₮0", "usd1", "dai"]}}, Volume: {Usd: {gt: 100000}}, Interval: {Time: {Duration: {eq: 300}}}}
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
