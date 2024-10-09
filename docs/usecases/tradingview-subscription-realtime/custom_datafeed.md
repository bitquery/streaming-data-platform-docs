---
sidebar_position: 4
---

# Custom DataFeed Setup

In this section, we will create a custom DataFeed for TradingView's Advanced Charting Library, integrating historical OHLC data and real-time data subscription. We will use three main files:

- `getBars.js`: Handles fetching historical data and subscribing to real-time updates.
- `resolveSymbol.js`: Provides symbol resolution for the chart.
- `onReady.js`: Supplies configuration details like supported resolutions.
  
Finally, we will integrate everything into `customDatafeed.js`.

---

### 1. `getBars.js`

The `getBars.js` file is responsible for fetching historical data and subscribing to real-time data streams via WebSocket.

```javascript
import { fetchHistoricalData } from "./histOHLC";
import { subscribeToWebSocket } from "./webSocketOHLC";

// Fetch historical data bars
export const getBars = async (
  symbolInfo,
  resolution,
  periodParams, // compulsorily needed by TradingView
  onHistoryCallback,
  onErrorCallback
) => {
  try {
    console.log(
      "[getBars]: Fetching bars for",
      symbolInfo,
      resolution,
      periodParams.from,
      periodParams.to
    );

    // Fetch historical data
    const bars = await fetchHistoricalData();

    // Pass bars to the chart if data is available
    if (bars.length > 0) {
      onHistoryCallback(bars, { noData: false });
    } else {
      onHistoryCallback([], { noData: true });
    }
  } catch (err) {
    console.error("[getBars] Error fetching data:", err);
    onErrorCallback(err);
  }
};

// Subscribe to real-time data using WebSocket
export const subscribeBars = (
  symbolInfo,
  resolution,
  onRealtimeCallback,
  subscriberUID,
  onResetCacheNeededCallback
) => {
  subscribeToWebSocket(onRealtimeCallback);
};

// Unsubscribe from real-time data
export const unsubscribeBars = (subscriberUID) => {
  delete this.subscribers[subscriberUID];
};
```

- **getBars**: This function fetches historical OHLC data using `fetchHistoricalData()` and provides it to TradingView. It handles the `periodParams` provided by TradingView, which indicates the required time range.
- **subscribeBars**: Subscribes to a WebSocket data feed using `subscribeToWebSocket()` for real-time trade data, emitting bars as new trades come in.
- **unsubscribeBars**: Unsubscribes from the real-time WebSocket data feed, stopping the stream of new bars.

---

### 2. `resolveSymbol.js`

The `resolveSymbol.js` file defines how a symbol (like a token pair) is resolved. TradingView needs to resolve symbols before fetching data for them.

```javascript
export const resolveSymbol = (
  symbolName,
  onSymbolResolvedCallback,
  onResolveErrorCallback,
  extension
) => {
  // Hardcode or query token symbol 
  const tokenSymbol = "BCAT";
  
  if (!tokenSymbol) {
    onResolveErrorCallback();
  } else {
    const symbolInfo = {
      ticker: tokenSymbol,
      name: `${tokenSymbol}/WSOL`,
      session: "24x7",
      timezone: "Etc/UTC",
      minmov: 1,
      pricescale: 1000,
      has_intraday: true,
      intraday_multipliers: ["1", "5", "15", "30", "60"],
      has_empty_bars: false,
      has_weekly_and_monthly: false,
      supported_resolutions: ["1", "5", "15", "30", "60", "1D", "1W", "1M"],
      supported_intervals: ["1", "5", "15", "30", "60", "1D", "1W", "1M"],
      countBack: 30,
      volume_precision: 2,
      visible_plots_set: 'ohlcv',
    };
    onSymbolResolvedCallback(symbolInfo);
  }
};
```

- **resolveSymbol**: Resolves a symbol (like a token's ticker) for TradingView. It provides metadata like the symbol's name, supported time intervals, and price scale. In this case, the symbol is hardcoded as `BCAT`, but it can be dynamic based on the query or user input.

---

### 3. `onReady.js`

The `onReady.js` file provides the configuration data that TradingView needs when it initializes the chart, such as supported time resolutions.

```javascript
const configurationData = {
  supported_resolutions: ['1', '5', '15', '30', '60', '1D', '1W', '1M'],
  // ... other configuration data
};

export const onReady = (callback) => {
  setTimeout(() => callback(configurationData), 0);
};
```

- **onReady**: This function provides the configuration of the charting library, including the supported time intervals for the chart (1 minute, 5 minutes, etc.). It’s called when the chart is first initialized.

---

### 4. `customDatafeed.js`

This file ties everything together, providing the custom DataFeed object that TradingView requires to interface with the charting library.

```javascript
import { resolveSymbol } from './resolveSymbol';
import { getBars, subscribeBars, unsubscribeBars } from './getBars';
import { onReady } from './onReady';

// Datafeed object for TradingView
const Datafeed = {
  onReady,
  resolveSymbol,
  getBars,
  subscribeBars, 
  unsubscribeBars,
};

export default Datafeed;
```

- **Datafeed**: This object integrates the `onReady`, `resolveSymbol`, `getBars`, `subscribeBars`, and `unsubscribeBars` functions into a complete custom DataFeed that TradingView uses to fetch historical and real-time OHLC data.

---

### How It Works

1. **Resolving the Symbol**: The chart resolves the symbol via `resolveSymbol.js`, which provides metadata about the token pair (e.g., POPCAT/WSOL).
   
2. **Fetching Historical Data**: When the chart requests historical data, `getBars.js` fetches the data via the `fetchHistoricalData` method and returns it to TradingView.

3. **Subscribing to Real-Time Data**: The chart subscribes to real-time updates via WebSocket using `subscribeBars` in `getBars.js`. New bars are emitted as trades occur.

4. **Configuration**: `onReady.js` provides configuration data like supported time intervals to TradingView.

5. **Unsubscribing**: When real-time updates are no longer needed, `unsubscribeBars` stops the WebSocket feed.

