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
      Supply {
        MarketCap
        FullyDilutedValuationUsd
        CirculatingSupply
        TotalSupply
        MaxSupply
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

- `Volume.Base`:  
  Total amount of base token traded during the interval.
- `Volume.Quote`:  
  Sum of **quote token** amounts traded (e.g. USDT, USDC). For USD-base pairs this is not USD—it is the total in quote token units. For USD amounts use `Volume.Usd`. (As of March 11 2026, see [Price Index Algorithm](/docs/trading/crypto-price-api/price-index-algorithm) for details.)
- `Volume.Usd`:  
  Total trade volume in USD. Use this when you need USD amounts.
- `Volume.BaseAttributedToUsd`:  
  Portion of the `Volume.Base` that was traded against quote tokens with known USD prices. Used to accurately calculate average USD price.
- `Price.Ohlc.*`:  
  OHLC candles (Open, High, Low, Close) for the interval, computed using only trades with known USD values.
- `Price.IsQuotedInUsd`:  
   Boolean flag indicating if the price values are quoted in USD. If `false`, the price is in quote token terms.
- **`Supply`**: Currency-level metrics for the asset (not pair- or pool-specific).

A rough pseudo-code of how price is calculated:

```
if quoteInUsd {
  vol.AveragePrice.Price = vol.AveragePrice.Usd / vol.AveragePrice.BaseAttributedToUsd
} else {
  vol.AveragePrice.Price = vol.AveragePrice.Quote / vol.AveragePrice.Base
}
```

For an in-depth breakdown of how quote and base are assigned, see [Breaking Down Price Streams in Detail](/docs/trading/crypto-price-api/in-depth). It is not necessary for basic use.
