# Price Asymmetry

In this section, we will see how to use the `PriceAsymmetry` metric to filter results based on Price. This metric currently is part of our Early Access Program (EAP), which is intended for evaluation purposes.This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

## How to use PriceAsymmetry to filter anomalies and outliers in Trades ?

The PriceAsymmetry metric is being used to filter outliers of anomalies. This means that trades that have a price asymmetry for example 0.1 will be excluded from the results. This helps to ensure that the results are more accurate and reliable, as it removes any trades that may have been caused by anomalies. The price Asymmetry value can only lie between 0 and 1.

PriceAsymmetry measures how close the trade’s prices are to each other. If the price asymmetry is less than 0.01, then the difference between the prices is less than 1%. However, the value of 0.01 might be too small and could omit a lot of trades. To improve your anomaly filtering mechanism, , add another filter like `Trade_PriceInUSD: {gt: 100}` filter to only include trades with a trade amount of more than 100 USD.

This metric operates consistently across various datasets, including archive, subscriptions and mempool. For live data streams or mempool transactions, the latest available prices from both sides of the trade are used as benchmarks.

Use the PriceAsymmetry metric to filter the response. By comparing two values derived from market data, it effectively identifies and exclude trades outside the specified range.

Here's an example [query on ethereum trades](https://ide.bitquery.io/Price-based-on-DEX-trades-in-USD).

```
subscription {
  EVM {
    DEXTradeByTokens(
      where: {
      Trade: {
        Currency: {
          Symbol: {
            is: "WETH"
          }
        }
        PriceAsymmetry: {
          le: 0.1
        }
      }

    }

    ) {
      Block {
        Time
      }
      median(of: Trade_PriceInUSD)
    }
  }
}
```
Similarly, below is an example on solana trades.


```
subscription {
  Solana {
    DEXTradeByTokens(
      where: {Trade: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}, Side: {Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}}, PriceAsymmetry: {lt: 0.9}}}
    ) {
      Block {
        Time
      }
      Trade {
        Price
      }
    }
  }
}


```