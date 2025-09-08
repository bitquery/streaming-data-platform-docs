# Currency Cube

The Currency Cube provides a unified, chain-agnostic price for an asset in USD, such as Bitcoin by aggregating prices and volumes from all its representations (e.g., WBTC, cbBTC, and other bridged or wrapped forms) across all supported chains. This multi-chain cryptocurrency price data approach ensures consistent pricing across different blockchain implementations.

### How OHLC is Calculated

The OHLC values (Open, High, Low, Close) are determined across all chains and token representations of an asset for the selected interval (e.g., 60 seconds):

- Open: The earliest price recorded in the interval, from any chain.
- High: The highest price observed in the interval, from any chain.
- Low: The lowest price observed in the interval, from any chain.
- Close: The most recent/latest price recorded in the interval, from any chain.

```
{
  Trading {
    Currencies(
      where: {
        Currency: { Id: { is: "bid:bitcoin" } },
        Interval: { Time: { Duration: { eq: 60 } } }
      },
      limit: { count: 1 },
      orderBy: { descending: Block_Time }
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
        BaseAttributedToUsd
        Quote
        Usd
      }
      Price {
        IsQuotedInUsd #The price is shown in USD (`IsQuotedInUsd: true` by default).
        Ohlc {
          Open    # Earliest price across chains in the interval
          High    # Highest price across chains in the interval
          Low     # Lowest price across chains in the interval
          Close   # Latest price across chains in the interval
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
