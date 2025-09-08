# Complete Guide to Building the Perfect OHLCV Data Using Bitquery APIs

In this guide, we will see how to get OHLCV (Open, High, Low, Close, Volume) candlestick data—or K-Line data—across different blockchain networks using Bitquery APIs. We’ll also explore how to filter out bot trades, outliers, and abnormally high or low prices to ensure accurate OHLC calculations.

## **Intervals in OHLC**

Bitquery’s OHLC APIs support multiple time intervals, including minutes, hours, days, weeks, and months. You can specify the desired interval in the response field, as shown in the example below:

```graphql
Block {
  Time(interval: {count: 1, in: minutes})
}
```

```
Block {
  Time(interval: {count: 1, in: hours})
}
```

```graphql
Block {
  Time(interval: {count: 1, in: days})
}
```

```
Block {
  Time(interval: {count: 1, in: weeks})
}
```

```
Block {
  Time(interval: {count: 1, in: months})
}
```

and so on.

## **OHLC on EVM Chains**

To fetch OHLC (Open, High, Low, Close) data for a specific token pair on EVM-compatible chains like Ethereum, you can use Bitquery’s `DEXTradesbyTokens`API. Supported networks include:

- **Ethereum** → `EVM(network: eth)`
- **BNB Chain** → `EVM(network: bsc)`
- **Polygon (Matic)** → `EVM(network: matic)`
- **Arbitrum** → `EVM(network: arbitrum)`
- **Base** → `EVM(network: base)`
- **Optimism** → `EVM(network: optimism)`

For full API documentation, refer to:  
[Get OHLC Data for a Particular Token Pair](https://docs.bitquery.io/docs/examples/dextrades/token-trades-apis/#get-ohlc-data-for-a-particular-token-pair).

### **Sample Query**

The following GraphQL query retrieves OHLCV data for an Ethereum token pair:

```graphql
query tradingViewPairs {
  EVM(network: eth) {
    DEXTradeByTokens(
      orderBy: { ascendingByField: "Block_Time" }
      where: {
        Trade: {
          Side: {
            Amount: { gt: "0" }
            Currency: {
              SmartContract: {
                is: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"
              }
            }
          }
          Currency: {
            SmartContract: { is: "0xdac17f958d2ee523a2206206994597c13d831ec7" }
          }
          PriceAsymmetry: { lt: 0.5 }
        }
      }
    ) {
      Block {
        Time(interval: { count: 5, in: minutes })
      }
      Trade {
        open: PriceInUSD(minimum: Block_Number)
        close: PriceInUSD(maximum: Block_Number)
        max: PriceInUSD(maximum: Trade_PriceInUSD)
        min: PriceInUSD(minimum: Trade_PriceInUSD)
      }
      volume: sum(of: Trade_Side_Amount)
    }
  }
}
```

## **OHLC on Non-EVM Chains**

Bitquery also supports non-EVM chains, such as **Solana** and **Tron**, enabling you to retrieve OHLC data for these networks.

## **OHLC on Solana**

For a detailed guide, visit:  
[Historical OHLC on Solana](https://docs.bitquery.io/docs/blockchain/Solana/historical-aggregate-data/#historical-ohlc-on-solana).

#### **Sample Query**

```graphql
{
  Solana(dataset: combined) {
    DEXTradeByTokens(
      orderBy: { descendingByField: "Block_Timefield" }
      where: {
        Trade: {
          Currency: {
            MintAddress: { is: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN" }
          }
          Side: {
            Currency: {
              MintAddress: { is: "So11111111111111111111111111111111111111112" }
            }
          }
          PriceAsymmetry: { lt: 0.1 }
        }
      }
      limit: { count: 10 }
    ) {
      Block {
        Timefield: Time(interval: { in: days, count: 1 })
      }
      volume: sum(of: Trade_Amount)
      Trade {
        high: Price(maximum: Trade_Price)
        low: Price(minimum: Trade_Price)
        open: Price(minimum: Block_Slot)
        close: Price(maximum: Block_Slot)
      }
      count
    }
  }
}
```

## **OHLC on Tron**

For details, visit:  
[OHLC Data on Tron](https://docs.bitquery.io/docs/examples/Tron/tron-dextrades/#get-ohlc-data-of-a-token-on-tron-network).

#### **Sample Query**

```graphql
query tradingViewPairs {
  Tron {
    DEXTradeByTokens(
      orderBy: { ascendingByField: "Block_Time" }
      where: {
        Trade: {
          Side: {
            Amount: { gt: "0" }
            Currency: {
              SmartContract: { is: "TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR" }
            }
          }
          Currency: {
            SmartContract: { is: "TJ9mxWPmQSJswqMakEehFWcAntg73odiAq" }
          }
          PriceAsymmetry: { lt: 0.1 }
        }
      }
    ) {
      Block {
        Time(interval: { count: 5, in: minutes })
      }
      Trade {
        open: PriceInUSD(minimum: Block_Number)
        close: PriceInUSD(maximum: Block_Number)
        max: PriceInUSD(maximum: Trade_PriceInUSD)
        min: PriceInUSD(minimum: Trade_PriceInUSD)
      }
      volume: sum(of: Trade_Side_Amount)
    }
  }
}
```

## Real-time OHLC

In EVM and non-EVM chains, you can also use `subscription` to get a token pair with a high or low value. 
[Run Stream ➤](https://ide.bitquery.io/seconds-oHLC-realtime-solana-example)

Take this query below for example;

```
subscription LatestTrades {
  Solana {
    DEXTradeByTokens(
      where: {
        Transaction: { Result: { Success: true } }
        Trade: { 
          Currency: { MintAddress: { is: "3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh" } }
          Side: { Currency: { MintAddress: { is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" } } }
        }
      }
    ) {
      min: quantile(of: Trade_PriceInUSD, level: 0.05)
      max: quantile(of: Trade_PriceInUSD, level: 0.95)
      volume: sum(of: Trade_Side_AmountInUSD)
      Trade {
        Market {
          MarketAddress
        }
        Dex {
          ProtocolName
          ProtocolFamily
        }
        close: PriceInUSD
        Side {
          Type
          Currency {
            Symbol
            MintAddress
            Name
          }
        }
      }
      Block {
        Time(interval: { count: 1, in: seconds })
      }
    }
  }
}


```

This GraphQL **subscription** query is fetching real-time **OHLC (Open, High, Low, Close)** data for Solana trades by continuously monitoring and streaming the latest trades.

**Calculating OHLC-Like Metrics**

- **`min`** → **5th percentile** price (`quantile(of: Trade_PriceInUSD, level: 0.05)`)
  - What is the price of the token for lowest 5% of the trades?
- **`max`** → **95th percentile** price (`quantile(of: Trade_PriceInUSD, level: 0.95)`)
  - What is the price of the token for top 5% of the trades?
- **`close`** → The latest trade price (`PriceInUSD`).
- **`volume`** → Total trade volume in USD (`sum(of: Trade_Side_AmountInUSD)`) over the interval.

4.  **Streaming the Data Continuously**:

    - Because this is a **subscription**, every time a new trade happens on Solana for this token pair, the latest price data is sent.
    - The latest **closing price (`close`)** is updated dynamically as new trades occur.

### **Why This Is "Real-Time" OHLC?**

- The query continuously **monitors** the latest **trades** on Solana.
- Each trade updates the **latest close price (`close`)**.
- The **high (`max`) and low (`min`)** prices adjust dynamically based on the last 50 trades.
- It provides **near real-time OHLC-like data** without waiting for the full candle interval.

### **Limitations**

- This is **not true OHLC** because:
  - It does not aggregate price data strictly by time intervals (e.g., every 5 min, 1h).
  - The **open price** (first trade of the interval) is missing.
  - It works based on a **rolling window of the latest trades**, not fixed time slots.

## **Filtering Abnormal Prices**

When fetching trade data from Bitquery APIs, you may encounter abnormal prices. These anomalies occur due to two primary reasons:

1. **Legitimate but unusual trades** – The data is correct (can be verified via an explorer like Etherscan), but bot activity may cause extreme price variations.
2. **Incorrect trade data in Bitquery’s database** – If you suspect incorrect data, report the issue by creating a support ticket.

For a complete guide, visit:  
[How to Filter Anomalous Prices](https://docs.bitquery.io/docs/usecases/how-to-filter-anomaly-prices/).

### **Methods to Filter Anomalous Trades**

#### **1. Using Price Asymmetry**

- Measures the USD value difference between traded tokens.
- To filter extreme trades, use:
  ```graphql
  { PriceAsymmetry: {lt: 0.1} }
  ```
  (This removes trades where the price difference exceeds 10%).
- Additionally, remove low-value trades:
  ```graphql
  { Trade: {AmountInUSD: {lt: "10"}} }
  ```

#### **2. Using Quantiles**

- Quantiles divide data into percentiles, helping detect outliers.
- Example:
  - **75th percentile (`level: 0.75`)** → 75% of values are below this.
  - **25th percentile (`level: 0.25`)** → 25% of values are below this.
- To filter extreme values, keep trades only between the **5th and 95th percentiles**.

For more details, check:  
[Quantile Documentation](https://docs.bitquery.io/docs/graphql/metrics/quantile/).

#### **3. Fetch All Trades and Filter Manually**

- Retrieve all trade data from Bitquery.
- Apply custom filters, such as:
  - Calculating the **5th and 95th percentiles** of trade prices.
  - Keeping only trades within this range.

## **Checking and Reporting Incorrect OHLC Data**

If your OHLC data differs significantly from other providers, you should:

- Check if **Price Asymmetry** and other filters (as discussed above) are applied.
- If there’s still a **huge discrepancy**, report the issue by creating a ticket at:  
  [Bitquery Support](https://support.bitquery.io).

### Example Scenario

For example if you check the OHLC for this token `J3TqbUgHurQGNxWtT88UQPcMNVmrL875pToQZdrkpump` again WSOL,

Take this query [https://ide.bitquery.io/quantile](https://ide.bitquery.io/quantile) which includes both OHLC using `maximum`, `minimum` and using `quantile` and removes small trades using `AmountinUSD >10` filter.

```
{
  Solana(dataset: combined) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Block_Timefield"}
      where: {Trade: {Currency: {MintAddress: {is: "J3TqbUgHurQGNxWtT88UQPcMNVmrL875pToQZdrkpump"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}, AmountInUSD: {gt: "10"}}}}
      limit: {count: 10}
    ) {
      Block {
        Timefield: Time(interval: {in: days, count: 1})
      }
      volume: sum(of: Trade_Side_AmountInUSD)
      min1: quantile(of: Trade_PriceInUSD, level: 0.05)
      max1: quantile(of: Trade_PriceInUSD, level: 0.95)
      close1: median(of: Trade_PriceInUSD)
      open1: median(of: Trade_PriceInUSD)
      Trade {
        Currency {
          Name
        }
        high: PriceInUSD(maximum: Trade_Price)
        low: PriceInUSD(minimum: Trade_Price)
        open: PriceInUSD(minimum: Block_Slot)
        close: PriceInUSD(maximum: Block_Slot)
        Side {
          Currency {
            Name
          }
        }
      }
      count
    }
  }
}

```

If you compare the results of the two, you see smoothening of spikes.

**Example 1 (March 2, 2025)**

- **Without quantile filtering:**

  - `high`: 0.00043009940205914187 (Very high)
  - `low`: 0.00034041182935594274

- **With quantile filtering:**
  - `max1`: 0.0004214320331811905 (Lower than raw high → filters extreme spike)
  - `min1`: 0.0003484918735921383 (Higher than raw low → removes low extremes)

_Effect:_ The high (`max1`) and low (`min1`) values are adjusted to remove extreme spikes.

**Example 2 (February 27, 2025)**

- **Without quantile filtering:**
  - `close`: 0.0003147996409415908
  - `high`: 0.00033683591504094873
  - `low`: 0.000254437945561626 (Low outlier)
  - `open`: 0.00030726648293986935
- **With quantile filtering:**
  - `close1`: 0.0003042437473777681
  - `max1`: 0.00032312784204259514
  - `min1`: 0.00028326141997240487 (Higher than raw low, outlier removed)
  - `open1`: 0.0003042437473777681

_Effect:_ The low (`min1`) is adjusted upwards, likely removing an extreme drop.

- Smoothing high price spikes (`max1` is lower than `high`)
- Removing sharp downward price drops (`min1` is higher than `low`)

## **Alternative: Calculating OHLC from Trades Without Aggregating in GraphQL Query**

### Limitations of the OHLC API

- The Solana OHLC API includes data starting from May 2024 to now only.
- While you can add filters as shown above to filter only valuable trades, it is not fool-proof and might not work with all tokens especially memecoins.

If you prefer not to use an aggregated GraphQL query, you can fetch raw trade data and manually compute OHLC values.

Complete guide to [using trades to calculate OHLC is available here](https://docs.bitquery.io/docs/usecases/solana-ohlc-calculator/)

## **Building TradingView Charts**

To visualize OHLCV data using **TradingView Advanced Chart Library**, refer to:

- [TradingView Advanced Charts Guide](https://docs.bitquery.io/docs/usecases/tradingview-advanced-charts/getting-started/)
- [TradingView Real-Time Subscription](https://docs.bitquery.io/docs/usecases/tradingview-subscription-realtime/getting-started/)
