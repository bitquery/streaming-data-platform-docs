---
sidebar_position: 3
---

# Calculating Real-time OHLC

In this section, we will create a real-time subscription to DEX trade data from the Solana API using WebSocket, processes incoming trades, and calculates OHLC (Open, High, Low, Close) data for one-minute intervals. To learn more about streaming Solana data via subscriptions, go [here](https://docs.bitquery.io/docs/subscriptions/subscription/)

#### Imports and Constants

```javascript
import { createClient } from "graphql-ws";
```

- **createClient**: The `graphql-ws` library is used to create a WebSocket client for subscribing to real-time GraphQL data.

```javascript
let client;
let lastBar = null;
let dataBuffer = [];
const BUFFER_TIMEOUT = 60000; // 1 minute interval for OHLC calculation
const BITQUERY_ENDPOINT =
  "wss://streaming.bitquery.io/eap?token=ory_at_...";
```

- **client**: Stores the WebSocket client instance.
- **lastBar**: Stores the latest OHLC bar being calculated for the current minute.
- **dataBuffer**: Holds the finalized OHLC bars to be processed at regular intervals.
- **BUFFER_TIMEOUT**: Defines the time interval (one minute) for processing the buffer and calculating OHLC.
- **BITQUERY_ENDPOINT**: The WebSocket endpoint for Bitquery's real-time data API. The token is required for authentication.You can use the same token generated previously.

#### GraphQL Subscription Query

```javascript
const subscriptionQuery = `
subscription {
  Solana {
    DEXTrades(
      where: {Trade: {Buy: {Currency: {MintAddress: {is: "4Yx39Hkci49fdtyUGmrkDqTnVei9tmzPK9aac952xniv"}}}, Sell: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}}}
    ) {
      Trade {
        Buy {
          Price
        }
      }
      Block {
        Time
      }
    }
  }
}
`;
```

- **subscriptionQuery**: This GraphQL subscription listens to real-time DEX trades on the Solana blockchain between two specific tokens (identified by their mint addresses). It captures the price of the buy-side trades and the block time of each trade.

#### processBuffer Function

```javascript
function processBuffer(callback) {
  if (lastBar) {
    callback(lastBar);
    lastBar = null; // Reset after processing
  }
}
```

- **processBuffer**: This function processes the `lastBar` and sends it to the `callback` function (typically an update to the chart). After processing, it resets `lastBar` to prepare for the next minute's data.

#### subscribeToWebSocket Function

```javascript
export function subscribeToWebSocket(onRealtimeCallback) {
  client = createClient({
    url: BITQUERY_ENDPOINT
  });
```

- **subscribeToWebSocket**: This function creates a WebSocket client and subscribes to real-time trade data. The `onRealtimeCallback` is passed as an argument to handle the emission of finalized OHLC bars.

#### Handling Incoming Trades

```javascript
  const onNext = (data) => {
    const trade = data.data.Solana.DEXTrades[0];
    const tradeTime = new Date(trade.Block.Time).getTime();
    const price = parseFloat(trade.Trade.Buy.Price);

    // Round the time to the nearest minute
    const roundedTime = Math.floor(tradeTime / 60000) * 60000;
```

- **onNext**: This callback processes each trade received via the WebSocket. It extracts the trade's price and block time, rounding the time to the nearest minute to align trades within the same 1-minute interval for OHLC calculation.

#### Calculating OHLC for the Current Minute

```javascript
    // If it's a new minute, finalize the last bar and start a new one
    if (!lastBar || lastBar.time !== roundedTime) {
      if (lastBar) {
        dataBuffer.push(lastBar); // Push the finalized bar to the buffer
      }

      lastBar = {
        time: roundedTime,
        open: price,
        high: price,
        low: price,
        close: price,
        volume: 1, // Can modify to include volume data if available
      };
      console.log("lastBar", lastBar)
    } else {
      // Update the OHLC data for the current minute
      lastBar.high = Math.max(lastBar.high, price);
      lastBar.low = Math.min(lastBar.low, price);
      lastBar.close = price;
      lastBar.volume += 1; // Increment trade count (or add volume if applicable)
    }
  };
```

- **OHLC Calculation**:
  - If a new minute starts, the previous `lastBar` is pushed into the `dataBuffer`, and a new `lastBar` is created with the current trade's price as the open, high, low, and close values.
  - If the trade occurs within the same minute, the OHLC values are updated accordingly:
    - **high**: The highest price observed.
    - **low**: The lowest price observed.
    - **close**: The latest price.
    - **volume**: The number of trades (or volume, if available).

#### WebSocket Subscription

```javascript
client.subscribe(
  { query: subscriptionQuery },
  { next: onNext, error: console.error }
);
```

- **client.subscribe**: This initiates the subscription to the real-time data stream, using the `onNext` callback to process each incoming trade. Errors are logged using `console.error`.

#### Periodic Buffer Processing

```javascript
  // Process buffer every minute to emit the finalized OHLC bar
  setInterval(() => {
    if (dataBuffer.length > 0) {
      processBuffer(onRealtimeCallback);
      dataBuffer = lastBar ? [lastBar] : []; // Clear the buffer
    }
  }, BUFFER_TIMEOUT);
}

```

- **setInterval**: Every minute (`BUFFER_TIMEOUT`), the buffer is processed, and the finalized OHLC bars are emitted using the `onRealtimeCallback` function. After processing, the buffer is cleared to prepare for the next interval.

#### unsubscribeFromWebSocket Function

```javascript
export function unsubscribeFromWebSocket() {
  if (client) {
    client.dispose();
  }
}
```

- **unsubscribeFromWebSocket**: This function disposes of the WebSocket client, stopping the real-time data stream when no longer needed.

---

### Summary

The `websocketOHLC.js` file is responsible for:

- Subscribing to a WebSocket data stream for real-time Solana DEX trades using Bitquery's Solana API.
- Calculating OHLC (Open, High, Low, Close) values in 1-minute intervals.
- Buffering and emitting the finalized OHLC bars at the end of each minute.
- Handling WebSocket subscription and cleanup.


