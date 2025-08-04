# Currency Cube

The Currency Cube provides a unified, chain-agnostic price for an asset, such as Bitcoin by aggregating prices and volumes from all its representations (e.g., WBTC, cbBTC, and other bridged or wrapped forms) across all supported chains.

### Key Points:

- The price is shown in USD (`IsQuotedInUsd: true` by default).
- Price is weighted by the trade volume (in USD) of each token representation across chains.
- This means: variants with higher trading volume have a greater impact on the final aggregated price.

### How Price is Calculated

The aggregated price is computed using a volume-weighted formula:

```
Aggregated Price = (Σ (Price_i × Volume_i)) / Σ Volume_i

```

Where:

- `Price_i` is the price of a variant (e.g., WBTC on Ethereum),
- `Volume_i` is its trading volume in USD.

The price in Currency cube reflects real trading activity, giving more influence to markets with deeper liquidity.

```
{
  Trading {
    Currencies(
      where: {Currency: {Id: {is: "bid:bitcoin"}}, Interval: {Time: {Duration: {eq: 60}}}}
      limit: {count: 1}
      orderBy: {descending: Block_Time}
    ) {
      Currency {
        Id
        Name
        Symbol
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
