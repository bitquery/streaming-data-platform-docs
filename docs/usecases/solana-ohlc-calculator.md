# Build OHLC Values using DEX Trades Data

This script calculates **OHLC (Open, High, Low, Close)** data for a particular Token Pair Solana-based trades by leveraging percentile filtering thus removing anomaly or bot trades. It fetches trading data from the Bitquery API and processes it to compute the OHLC values for a specific trading pair. For pre-aggregated OHLC data, see our [Crypto Price API](https://docs.bitquery.io/docs/trading/crypto-price-api/introduction/).

The sole motive of this tutorial is to guide you how an OHLC is calculated and Bot trades or anomaly trades are filtered out. We have shown one of the by using `quantile`, you can devise your own strategy to use different filters or logics to omit these anomaly trades.

import VideoPlayer from "../../src/components/videoplayer.js";

## Tutorial Video

<VideoPlayer url="https://www.youtube.com/watch?v=IrOXHwQ0HUk" />

## Features

- Fetches the 5th and 95th percentiles of trade prices for a specific Solana trading pair.
- Filters trades within the percentile price range.
- Computes and displays **OHLC** data:
  - **Open**: The first trade's price.
  - **High**: The highest trade price.
  - **Low**: The lowest trade price.
  - **Close**: The last trade's price.

## Prerequisites

Make sure you have the following before starting:

1. **Node.js** installed on your system.
2. A **Bitquery API token** to fetch data from the APIs
   You can get your API token from Bitquery using these steps [here](https://docs.bitquery.io/docs/authorisation/how-to-generate/).
3. Information about the Solana trading pair you want to analyze:
   - **Main Currency Address**: The mint address of the main currency.
   - **Side Currency Address**: The mint address of the side currency.
   - **Market Pair Address**: The address of the trading pair.

## Installation

1. Clone this repository and navigate to the project directory:
   ```bash
   git clone https://github.com/Akshat-cs/OHLC-Calculator-Solana.git
   ```
2. Install the required dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your Bitquery API Token, check the steps to get it [here](https://docs.bitquery.io/docs/authorisation/how-to-generate/):

```
AUTH_TOKEN = <YourBitqueryApiToken>
```

## Configuration

Before running the script, update the following constants in the code (`index.js`) to match your Solana trading pair details:

```javascript
const MAIN_CURRENCY_ADDRESS = "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump";
const SIDE_CURRENCY_ADDRESS = "So11111111111111111111111111111111111111112";
const PAIR_ADDRESS = "Bzc9NZfMqkXR6fz1DBph7BDf9BroyEf6pnzESP7v5iiw";
```

## Usage

To calculate OHLC values, run the script:

```bash
node index.js
```

## Script Workflow

1. Fetches the 5th and 95th percentiles of trade prices for the past hour using the Bitquery API.
2. Retrieves trades that fall within the calculated percentile price range.
3. Computes the **OHLC** data based on the filtered trades:
   - **Open**: The price of the earliest trade.
   - **High**: The highest trade price.
   - **Low**: The lowest trade price.
   - **Close**: The price of the latest trade.
4. Displays the OHLC values in the console.

## Code Overview

### 1. Fetching Percentiles

The `fetchPercentiles` function retrieves the 5th and 95th percentiles for the specified trading pair using the Bitquery API.

```javascript
async function fetchPercentiles() {
  const timestamp1Hago = getTimestamp(60);

  const percentileData = JSON.stringify({
    query: `query ($mainCurrencyAddress: String , $sideCurrencyAddress: String, $pairAddress: String, $timestamp1Hago: DateTime ) {
      Solana {
        DEXTradeByTokens(
          where: {Trade: {Currency: {MintAddress: {is: $mainCurrencyAddress}}, Side: {Currency: {MintAddress: {is: $sideCurrencyAddress}}}, Market: {MarketAddress: {is: $pairAddress}}}, Transaction: {Result: {Success: true}}, Block: {Time: {since: $timestamp1Hago}}}
        ) {
          percentile5th: quantile(of: Trade_PriceInUSD, level: 0.05)
          percentile95th: quantile(of: Trade_PriceInUSD, level: 0.95)
        }
      }
    }`,
    variables: JSON.stringify({
      mainCurrencyAddress: MAIN_CURRENCY_ADDRESS,
      sideCurrencyAddress: SIDE_CURRENCY_ADDRESS,
      pairAddress: PAIR_ADDRESS,
      timestamp1Hago,
    }),
  });

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: API_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
    data: percentileData,
  };

  try {
    const response = await axios.request(config);
    return response.data.data.Solana.DEXTradeByTokens[0];
  } catch (error) {
    console.error("Error fetching percentiles:", error);
    throw error;
  }
}
```

### 2. Fetching Trades and Computing OHLC

The `fetchTradesAndComputeOHLC` function retrieves trades within the specified percentile price range and calculates the **OHLC** values:

- **Open**: The price of the earliest trade.
- **High**: The highest trade price.
- **Low**: The lowest trade price.
- **Close**: The price of the latest trade.

```javascript
async function fetchTradesAndComputeOHLC(lowerBoundPrice, upperBoundPrice) {
  const timestamp1Hago = getTimestamp(60);

  const tradeData = JSON.stringify({
    query: `query ($mainCurrencyAddress: String , $sideCurrencyAddress: String, $pairAddress: String, $lowerBoundPrice: Float, $upperBoundPrice: Float, $timestamp1Hago: DateTime ) {
      Solana {
        DEXTradeByTokens(
          orderBy: {descending: Block_Time}
          where: {Trade: {Currency: {MintAddress: {is: $mainCurrencyAddress}}, Side: {Currency: {MintAddress: {is: $sideCurrencyAddress}}}, Market: {MarketAddress: {is: $pairAddress}}, PriceInUSD: {ge: $lowerBoundPrice, le: $upperBoundPrice}}, Transaction: {Result: {Success: true}}, Block: {Time: {since: $timestamp1Hago}}}
        ) {
          Block {
            Time
            Slot
          }
          Trade {
            Price
            PriceInUSD
          }
        }
      }
    }`,
    variables: JSON.stringify({
      mainCurrencyAddress: MAIN_CURRENCY_ADDRESS,
      sideCurrencyAddress: SIDE_CURRENCY_ADDRESS,
      pairAddress: PAIR_ADDRESS,
      lowerBoundPrice,
      upperBoundPrice,
      timestamp1Hago,
    }),
  });

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: API_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
    data: tradeData,
  };

  try {
    const response = await axios.request(config);
    const trades = response.data.data.Solana.DEXTradeByTokens;

    if (trades.length === 0) {
      console.log("No trades found.");
      return;
    }

    // Compute OHLC
    const ohlc = {
      open: trades[trades.length - 1].Trade.Price,
      high: Math.max(...trades.map((t) => t.Trade.Price)),
      low: Math.min(...trades.map((t) => t.Trade.Price)),
      close: trades[0].Trade.Price,
    };

    console.log("OHLC:", ohlc);
  } catch (error) {
    console.error("Error fetching trades:", error);
  }
}
```

This function ensures the OHLC values are accurately calculated based on filtered trade data within the provided range.

### 3. Main Execution

The `main` function orchestrates the entire process by:

1. Fetching the 5th and 95th percentiles for the specified trading pair.
2. Using these percentiles to filter trades within the range.
3. Computing and displaying the **OHLC** data.

```javascript
// Main Function
(async function main() {
  try {
    const percentiles = await fetchPercentiles();
    await fetchTradesAndComputeOHLC(
      percentiles.percentile5th,
      percentiles.percentile95th
    );
  } catch (error) {
    console.error("Error in main function:", error);
  }
})();
```

This function acts as the entry point for the script, coordinating the percentile fetching and OHLC calculation in a seamless workflow.
