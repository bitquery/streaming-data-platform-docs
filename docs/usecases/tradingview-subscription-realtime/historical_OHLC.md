---
sidebar_position: 2
---

# Getting Historical Data

In this section, we will write the code to get historical OHLC data to populate chart with candlesticks upto current timestamp. Create a new file called `histOHLC.js` and add the following code. Each part of the code is explained below.

### Imports

```javascript
import axios from "axios";
```

- **axios**: Axios is used to make HTTP requests to the Bitquery API to fetch the required trading data.

### API Endpoint and Query

```javascript
const endpoint = "https://streaming.bitquery.io/eap";
```

- **endpoint**: This is the API endpoint for Bitquery's event and analytics platform, which streams DEX trade data for the Solana blockchain.

```javascript
const TOKEN_DETAILS = `
{
  Solana {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Block_Timefield"}
      where: {Trade: {Currency: {MintAddress: {is: "4Yx39Hkci49fdtyUGmrkDqTnVei9tmzPK9aac952xniv"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}}}
      limit: {count: 1000}
    ) {
      Block {
        Timefield: Time(interval: {in: minutes, count: 1})
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
`;
```

- **TOKEN_DETAILS**: This GraphQL query is designed to fetch DEX trade data for a specific token pair on the Solana blockchain. It queries data such as the block time, trade volume, and OHLC prices for trades between:

  - Token with mint address `4Yx39Hkci49fdtyUGmrkDqTnVei9tmzPK9aac952xniv` (the base token, in this case it is BCAT).
  - Token with mint address `So11111111111111111111111111111111111111112` (the quote token).

- The query is limited to one thousand trades and orders the results by the `Block_Timefield` in descending order.

### fetchHistoricalData Function

```javascript
export async function fetchHistoricalData(from) {
  const requiredBars = 360; // Hardcoding the value
```

- **fetchHistoricalData**: This function fetches historical OHLC data starting from the `from` timestamp, and is designed to return a minimum of three hundred sixty 1-minute bars.
- **requiredBars**: The number of bars (data points) required for the chart is hardcoded to three hundred sixty.

### API Request

```javascript
  try {
    const response = await axios.post(
      endpoint,
      { query: TOKEN_DETAILS },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer ory_at_...",
        },
      }
    );
    console.log("API called");
```

- **axios.post**: The `axios` library is used to send a POST request to the `endpoint`. It sends the GraphQL query defined in `TOKEN_DETAILS` to fetch the historical OHLC data.
- **Authorization**: The request includes an authorization token to access the Bitquery API. Ensure to replace this token with your own. More details on how to generate a token is available [here](https://docs.bitquery.io/docs/authorisation/how-to-generate/)

### Data Processing

```javascript
const trades = response.data.data.Solana.DEXTradeByTokens;

// Preprocess the bars data
let bars = trades.map((trade) => {
  // Parse and convert Block Timefield to Unix timestamp in milliseconds
  const blockTime = new Date(trade.Block.Timefield).getTime();

  return {
    time: blockTime, // Time in Unix timestamp (milliseconds)
    open: trade.Trade.open || 0,
    high: trade.Trade.high || 0,
    low: trade.Trade.low || 0,
    close: trade.Trade.close || 0,
    volume: trade.volume || 0,
    count: trade.count || 0, // Trade count for additional info
  };
});
```

- **Preprocessing the Data**: The raw data returned by the API is processed into an array of bar objects, where each bar contains the following properties:
  - **time**: The block timestamp in Unix format (milliseconds).
  - **open**: The opening price of the trade (minimum slot number).
  - **high**: The highest price of the trade.
  - **low**: The lowest price of the trade.
  - **close**: The closing price of the trade (maximum slot number).
  - **volume**: The total traded volume for that time period.
  - **count**: The number of trades that occurred during that period.

### Sorting the Data

```javascript
// Sort bars in ascending order by time (since the API returned descending order)
bars.sort((a, b) => a.time - b.time);
```

- The bars are sorted in ascending order based on the `time` field, as the API returns data in descending order by default.

### Handling Missing Bars

```javascript
// Fill in missing bars if needed to reach 300 bars
if (bars.length < requiredBars) {
  const earliestTime = bars[0]?.time || from;
  const missingBarsCount = requiredBars - bars.length;

  // Generate missing bars before the earliest returned bar
  for (let i = 1; i <= missingBarsCount; i++) {
    bars.unshift({
      time: earliestTime - i * 60000, // Assuming 1-minute bars (60000 ms)
      open: 0,
      high: 0,
      low: 0,
      close: 0,
      volume: 0,
      count: 0,
    });
  }
}
```

- **Filling in Missing Bars**: If fewer than the required three hundred sixty bars are returned, the function fills in the missing bars by creating new bars with zero values (open, high, low, close, volume, count) for each missing minute, starting from the earliest available bar.

### Return the Processed Data

```javascript
    return bars;
  } catch (err) {
    console.error("Error fetching historical data:", err);
    throw err;
  }
}
```

- Finally, the function returns the array of processed OHLC bars, or logs an error if the API request fails.

