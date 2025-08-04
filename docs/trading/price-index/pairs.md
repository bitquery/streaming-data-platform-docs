# Pairs Cube

The Pairs cube provides trading data for a base token traded against a quote token on a particular DEX or protocol.

```
{
  Trading {
    Pairs(
      where: {Market: {Network: {is: "Solana"}, Address: {in: ["PAIR ADDRESS HERE"]}}, Interval: {Time: {Duration: {eq: 300}}}, Price: {IsQuotedInUsd: true}}
      orderBy: {descendingByField: "Block_Time"}
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
        IsQuotedInUsd #Are the values in USD or Native
      }
    }
  }
}


```

For an indepth breakdown of how quote and base are assigned, go [here](https://docs.bitquery.io/docs/trading/price-index/in-depth/).It is not a necessary read.

- `Volume.Base`:  
  Total amount of base token traded during the interval.
- `Volume.Quote`:  
  Total amount of quote token traded.
- `Volume.Usd`:  
  Total trade volume converted into USD, using known quote token prices (if available).
- `Volume.BaseQuotedInUsd`:  
  Portion of the `Volume.Base` that was traded against quote tokens with known USD prices. Used to accurately calculate average USD price.
- `Price.Ohlc.*`:  
  OHLC candles (Open, High, Low, Close) for the interval, computed using only trades with known USD values.
- `Price.IsQuotedInUsd`:  
   Boolean flag indicating if the price values are quoted in USD. If `false`, the price is in quote token terms.

A rough pseudo-code of how price is calculated:

```
if quoteInUsd {
  vol.AveragePrice.Price = vol.AveragePrice.Usd / vol.AveragePrice.BaseQuotedInUsd
} else {
  vol.AveragePrice.Price = vol.AveragePrice.Quote / vol.AveragePrice.Base
}
```
