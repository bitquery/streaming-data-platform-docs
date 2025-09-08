# How to Filter Abnormal Prices

You might see abnormal prices when you fetch data from Bitquery APIs. There can be two possibilities as to why these abnormal prices associated with trades are appearing in your API response.

- In the first case, the trade is correct (check this from any other explorer eg. Etherscan) but anomalous i.e. both tokens’ amounts in USDs are not near to equal (bots are generally responsible for this), we calculate the price using Amount in USD of both the tokens involved and that results in abnormal price.

- In the second case, the Bitquery DB itself has incorrect trade data, then create a ticket [here](http://support.bitquery.io).

In the first case, we are going to see 3 different methods to filter anomaly trades. Anomaly trades are the trades that result in abnormally high or low prices in USD. Bitquery provides raw trade data and does not omit any trades that are happening over the network. But this also results in some issues for the Bitquery data consumers if they are trying to build something around the Price of tokens, such as trying to get All time high price or building OHLC/K-line charts. For pre-filtered, clean price data, consider using our [Crypto Price API](https://docs.bitquery.io/docs/trading/crypto-price-api/introduction/).

3 ways to omit these types of anomaly trades:

## 1. Using PriceAsymmetry

Price Asymmetry represents the difference in TradeAmount in USD of main currency and side currency. We want to include the optimal trades which have approximately the same Amounts in USD on both sides. We generally use priceAsymmetry: {lt: 0.1}
   as a filter in our APIs as this will filter out trades with more than 10% difference in their trade amounts.
   Also, filter out low AmountinUSD trades from this, say `{Trade: {AmountInUSD: {lt: "10"}}}`

Read more about Price Asymmetry [here](https://docs.bitquery.io/docs/graphql/metrics/priceAsymmetry/).

Here's an example [query on ethereum trades](https://ide.bitquery.io/Price-based-on-DEX-trades-in-USD).

```graphql
subscription {
  EVM {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: { Symbol: { is: "WETH" } }
          PriceAsymmetry: { le: 0.1 }
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
## 2. Using Quantile

Bitquery APIs have the quantile metric, that can be used to provide insights into gas consumption, transaction amounts, or any other measurable field.

Quantiles are useful in understanding the distribution of numerical data by dividing it into intervals.

For example, the median represents the middle point of the data. Half of the responses had amounts lower than the median, and half had amounts higher.

The level: 0.75 represents the 75th percentile and it shows that 75% of the responses had values lower than this, while level: 0.25 represents the 25th percentile and it shows that 25% of the values were lower.

Read more about quantile [here](https://docs.bitquery.io/docs/graphql/metrics/quantile/).

We can also remove anomaly trades using the quantile metric. Also add one more filter to remove low AmountinUSD trades from this, say `{Trade: {AmountInUSD: {lt: "10"}}}`

**Strategy**: Remove extreme trades using quantile
Find out `quantile(of: Transfer_AmountInUSD, level: 0.05)` & `quantile(of: Transfer_AmountInUSD, level: 0.95)`

This is just an example that gives the 5th percentile and 95th percentile of Trade Price in USD, each token can have a different distribution of anomaly trades so try different levels. And then when you have figured out what is the optimum level, then remove the trades and get your desired data from the subset trades.

**Usage Example**: Calculate All Time High Price using quantile
Use `quantile(of: Trade_PriceInUSD, level: 0.85)` and `Side: {AmountInUSD: {gt: "10"}}`. Choose the appropriate `level` value, it might be the case that the last 5 percentile trades are too extreme i.e. anomalous in Trade PriceinUSDs so we are skipping that and just getting the 85th percentile Price in USD.

```graphql
query AllTimeHighTokenPriceQuery(
  $tokenAddress: String!
  $startTime: DateTime!
) {
  EVM(dataset: archive, network: eth) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: { SmartContract: { is: $tokenAddress } }
          Side: { AmountInUSD: { gt: "10" } }
        }
        Block: { Time: { since: $startTime } }
      }
      limit: { count: 1 }
    ) {
      quantile(of: Trade_PriceInUSD, level: 0.85)
      Trade {
        PriceInUSD
        Amount
        AmountInUSD
        Currency {
          Name
        }
        Side {
          Amount
          AmountInUSD
          Currency {
            Name
          }
        }
      }
      Transaction {
        Hash
      }
    }
  }
}
```

## 3. Get all trades and filter on your end
Get all the trades from Bitquery API and then filter trades using your own custom logic so that you can remove the anomaly trades with abnormal prices.

One such example we have shown [here](https://docs.bitquery.io/docs/usecases/solana-ohlc-calculator/) where custom logic is a very basic one, fetching quantile values of Trade USD Price with level: 0.05 and level: 0.95 and then only fetching trades between these 2 Trade Prices and thus removing extremes.

## Conclusion

Whenever you see abnormal trades with extremely high trade Prices in the API response, first try to get the transaction hash of it and check with another explorer whether the trade amounts are correct or not. If they are correct then apply above mentioned methods to omit these trades. And after clarifying you found that Bitquery gave the wrong Trade data, then create a ticket [here](http://support.bitquery.io)
