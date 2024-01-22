---
sidebar_position: 5
---

# Creating the Candlestick Bars with Data from API

Create a file names getBars.js to override the default implementation. This part of the code, focuses on fetching candlestick bars using the Bitquery API, and providing placeholders for subscription logic for real-time data updates.

### Step-by-Step Guide

#### 1. Importing Dependencies and Constants

```javascript
import axios from "axios";
import * as Bitquery from "./components/callBitquery";

```

This section imports Axios for making HTTP requests and imports or requires the Bitquery module or file. It also sets the Bitquery API key as a constant. Remember to replace `"your key"` with the actual API key for Bitquery.

#### 2. Definition of `getBars` Function

```javascript
export const getBars = async (
  symbolInfo,
  resolution,
  periodParams,
  onHistoryCallback,
  onErrorCallback
) => {
  try {

    console.log("getBars called");

    // Set initial time for bars
    let time = new Date(periodParams.to * 1000);
    time.setUTCHours(0, 0, 0, 0);

    // Array to store retrieved bars
     const bars = new Array(15000);
    // ... (Continues below)
```

This function `getBars` is an asynchronous function that fetches historical bar data for a given symbol within a specified time range. It takes several parameters such as `symbolInfo`, `resolution`, and callback functions `onHistoryCallback` and `onErrorCallback`.

#### 3. Fetching Data Using Axios

```javascript
// ... (Continuing from the previous section)

// Fetch data based on periodParams using Axios
const response = await axios.post(
  Bitquery.endpoint,
  {
    query: Bitquery.TOKEN_DETAILS, // query for daily candles
    mode: "cors",
  },
  {
    headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer your_access_token_here",
        },
  }
);

console.log("response ", response);
// ... (Continues below)
```

This section utilizes Axios to make a POST request to the Streaming API using the specified endpoint (`Bitquery.endpoint`) and the `oAuth token` as a header for authentication. Read more [here](https://docs.bitquery.io/docs/ide/authorisation/).

#### 4. Processing and Formatting Data

```javascript
// ... (Continuing from the previous section)

    // Iterating through fetched data and processing bars
     for (let i = 15000; i > -1; i--) {
      const data = response.data.data.EVM.DEXTradeByTokens[i];
      
      if (data) {
        const open = Number(data.Trade.open.toFixed(18));
        const close = Number(data.Trade.close.toFixed(18));
        let high = Number(data.Trade.high.toFixed(18));
        let low = Number(data.Trade.low.toFixed(18));
        const resdate = new Date(data.Block.OHLC_interval);
       
        bars[i] = {
          time: resdate.getTime(),
          open: open,
          high: high,
          low: low,
          close: close,
          volume: Number(data.volume),
        };

      } 
      // if data not found for the timestamp, set the bar values to 0
      else {
        bars[i] = {
          time: time.getTime(),

          open: 0,
          high: 0,
          low: 0,
          close: 0,
          volume: 0,
        };
      }

      time.setUTCDate(time.getUTCDate() - 1);
    }

    if (bars.length === 0) {
      onHistoryCallback([], { noData: true });
    } else {
      onHistoryCallback(bars, { noData: false });
    }
  } catch (err) {
    console.error(err);
    onErrorCallback(err);
  }
```

This part processes the fetched data, extracts necessary information like open, high, low, close prices, volume, and time, then populates the `bars` array. It also handles cases where data might be missing for specific dates and invokes appropriate callbacks (`onHistoryCallback` and `onErrorCallback`).

#### 5. `subscribeBars` and `unsubscribeBars` Functions

```javascript
export const subscribeBars = (
  symbolInfo,
  resolution,
  onRealtimeCallback,
  subscriberUID,
  onResetCacheNeededCallback
) => {
  // Implement your subscription logic here
};

export const unsubscribeBars = (subscriberUID) => {
  // Implement your unsubscription logic here
};
```

These functions `subscribeBars` and `unsubscribeBars` are placeholders for implementing subscription and unsubscription logic . When you use the [websocket](https://docs.bitquery.io/docs/start/websocket/), implement these functions.

- Next, go to [Chart Setup Page](https://docs.bitquery.io/docs/usecases/tradingview-advanced-charts/advancedChart/) to start building
