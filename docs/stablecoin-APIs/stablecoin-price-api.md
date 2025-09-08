# Stablecoin Price API

While stablecoins are designed to maintain a stable value (typically pegged to USD, EUR, or other assets), they can deviate slightly from their target price (e.g., $0.998 or $1.02 for USD-pegged stablecoins). For developers, traders, and businesses processing large volumes of stablecoin payments, even these small deviations can translate to significant financial impact at scale.

Bitquery's Stablecoin API provides comprehensive real-time data including transfers, trades, prices, and holder distribution across multiple blockchain networks—all accessible through a single API call.

Track minute price changes, fetch blended average prices, and identify arbitrage opportunities across different platforms with precision and ease.

This is built on the extensive [Crypto Price APIs](https://docs.bitquery.io/docs/trading/crypto-price-api/introduction/)

Need help implementing stablecoin price APIs? Contact our support team or join our community discussion on [@Bloxy_info](https://t.me/bloxy_info).

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

## Check Arbitrage of a Stablecoin Across Chains

This query compares USDT prices across different blockchain networks in real-time. It fetches the latest price data for USDT from different networks, showing you where the same stablecoin trades at different prices.

**What this tells traders:**

- **Price discrepancies**: See which networks have USDT trading above or below $1.00
- **Volume context**: Understand trading volume on each network to assess liquidity
- **Timing**: Get 1-second interval data to catch fleeting arbitrage windows
- **Network comparison**: Compare prices across Ethereum, BSC, Polygon, and other major networks

[Run Query](https://ide.bitquery.io/usdt-latest-price-arbitrage)

```
{
  Trading {
    Tokens(
      where: {Interval: {Time: {Duration: {eq: 1}}}, Currency: {Id: {is: "usdt"}}}
      limit: {count: 100}
      limitBy: {by: Token_Network, count: 1}
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
