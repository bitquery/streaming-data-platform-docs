---
title: "Crypto Currency Price API"
description: "Query currency-level crypto prices and conversions with Bitquery Trading APIs, including GraphQL examples and streaming options."
---
# Currency Cube

The Currency Cube provides a unified, chain-agnostic price for an asset in USD, such as Bitcoin by aggregating prices and volumes from all its representations (e.g., WBTC, cbBTC, and other bridged or wrapped forms) across all supported chains. This multi-chain cryptocurrency price data approach ensures consistent pricing across different blockchain implementations.

:::note Use this for cross-chain assets, not for a single token
Currency prices aggregate **across chains and token representations**, so use this cube when you want one global number for an asset like BTC or ETH. For the price of a **specific token on a specific market**, use the [Pairs cube with `Ranking: { Position: { eq: 1 } }`](/docs/trading/crypto-price-api/pairs#most-accurate-token-price). Note that `Ranking` is **not** available on `Currencies` — it exists on `Trades`, `Pairs`, and `Tokens` only.
:::

### How OHLC is Calculated

The OHLC values (Open, High, Low, Close) describe a **single computed cross-chain index
series** for the asset over the selected interval (e.g., 60 seconds). Within each interval the
cube tracks the decay-weighted, volume-weighted blend of the asset's token representations —
see [Price Index Algorithm](/docs/trading/crypto-price-api/price-index-algorithm) — and records
that blend's open, high, low and close:

- Open: the index value at the start of the interval.
- High: the highest value **the index** reached during the interval.
- Low: the lowest value **the index** reached during the interval.
- Close: the index value at the end of the interval.

:::caution The index is not a min/max envelope across chains
`High` and `Low` are **not** the maximum and minimum of the per-chain prices. Because the index
is a volume-weighted blend, an extreme print on a single chain — especially a thin one — is
damped and may never reach the currency candle at all. A single representation can print far
outside the currency's High/Low band without moving it.

Individual chain representations can therefore sit **outside** the currency's High/Low band.
If you are monitoring a depeg or a single-venue dislocation, query the constituents through
[`Tokens`](/docs/trading/crypto-price-api/tokens) filtered on `Currency.Id` rather than relying
on the currency candle to surface it.
:::

**Volume.Quote vs Volume.Usd**: For USD-based pricing, `Volume.Quote` is the sum of quote token amounts (not USD). Use `Volume.Usd` for USD totals. See [Price Index Algorithm](/docs/trading/crypto-price-api/price-index-algorithm) for details.

```graphql
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
        Quote   # Sum of quote token amounts (not USD); use Usd for USD totals (March 11 2026: see Price Index Algorithm)
        Usd
      }
      Supply {
        TotalSupply
        FullyDilutedValuationUsd
        MarketCap
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

### Supply

- **`Supply`**: Currency-level supply and USD valuation metrics for the asset (aligned with the same `Supply` fields on Tokens and Pairs). See [Supply fields reference](/docs/trading/crypto-price-api/supply-fields) for definitions of each subfield.

