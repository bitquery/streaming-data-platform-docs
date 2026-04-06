---
sidebar_position: 4
---

# Fetching Real-time OHLC

We now use the new [Price Index Streams](https://docs.bitquery.io/docs/trading/price-index/examples/#ohlc-stream-on-a-chain) to fetch **pre-aggregated OHLC data** directly from Bitquery's GraphQL WebSocket API. This removes the need to manually calculate candlesticks from raw trade data.

To learn more about streaming data via graphQL, visit [Bitquery subscriptions](https://docs.bitquery.io/docs/subscriptions/subscription/).

### Imports and Configuration

```javascript
import { createClient } from "graphql-ws";
import config from "./configs.json";
```

- **createClient**: From the `graphql-ws` library, used to subscribe to GraphQL streams.
- **config**: A local file storing your Bitquery API token.

```javascript
let client;
/** Last emitted bar time and close — used to stitch new candles to the previous close. */
let lastEmittedBarTime = null;
let lastEmittedClose = null;

const BITQUERY_ENDPOINT =
  "wss://streaming.bitquery.io/eap?token=" + config.authtoken;
```

### Subscription Query

[Run Stream on IDE](https://ide.bitquery.io/1-second-crypto-price-stream)
**We have used Solana as an example below, you can remove it and get data for all chains provided by the Price API**

```javascript
const subscriptionQuery = `
subscription{
  Trading {
    Tokens(
      where: {Token: {Network: {is: "Solana"}, Address: {is: "6ft9XJZX7wYEH1aywspW5TiXDcshGc2W2SqBHN9SLAEJ"}}, Interval: {Time: {Duration: {eq: 1}}}}
    ) {
      Block {
        Time
      }
      Price {
        Ohlc {
          Open
          High
          Low
          Close
        }
      }
      Volume {
        Base
        Quote
      }
      Supply {
        TotalSupply
        MarketCap
        FullyDilutedValuationUsd
      }
    }
  }
}

`;
```

- This query subscribes to **pre-aggregated 1-second OHLC bars** for a token on the Solana network (interval duration `1` in the `where` clause).
- It requests:

  - **Block** — `Time` (bar timestamp)
  - **Price.Ohlc** — `Open`, `High`, `Low`, `Close`
  - **Volume** — `Base`, `Quote`
  - **Supply** — `TotalSupply`, `MarketCap`, `FullyDilutedValuationUsd`

---

### Subscribing to the Stream

Keep the **last emitted bar’s time and close** in module-level variables. When the stream moves to a **new** candle (timestamp changes), set the new bar’s **open** to **last candle’s close** and widen **high** / **low** to include that price—same idea as [historical bar continuity](/docs/usecases/tradingview-subscription-realtime/bar-continuity/), but applied live as bars arrive.

```javascript
export function subscribeToWebSocket(onRealtimeCallback) {
  lastEmittedBarTime = null;
  lastEmittedClose = null;

  client = createClient({ url: BITQUERY_ENDPOINT });

  const onNext = (data) => {
    const tokenData = data.data?.Trading?.Tokens?.[0];
    if (!tokenData) return;

    const bar = {
      time: new Date(tokenData.Block.Time).getTime(),
      open: tokenData.Price.Ohlc.Open,
      high: tokenData.Price.Ohlc.High,
      low: tokenData.Price.Ohlc.Low,
      close: tokenData.Price.Ohlc.Close,
      volume: tokenData.Volume.Base,
    };

    const isNewCandle =
      lastEmittedBarTime !== null && bar.time !== lastEmittedBarTime;
    if (isNewCandle && lastEmittedClose != null) {
      bar.open = lastEmittedClose;
      bar.high = Math.max(bar.high, lastEmittedClose);
      bar.low = Math.min(bar.low, lastEmittedClose);
    }

    lastEmittedBarTime = bar.time;
    lastEmittedClose = bar.close;

    onRealtimeCallback(bar);
  };

  client.subscribe(
    { query: subscriptionQuery },
    { next: onNext, error: console.error }
  );
}
```

- **subscribeToWebSocket**:

  - Connects to Bitquery using `graphql-ws`.
  - On each message, normalizes the bar for continuity when the interval rolls forward, then passes it to `onRealtimeCallback`.

### Unsubscribing from the Stream

```javascript
export function unsubscribeFromWebSocket() {
  if (client) {
    client.dispose();
  }
  lastEmittedBarTime = null;
  lastEmittedClose = null;
}
```

- **unsubscribeFromWebSocket**: Terminates the WebSocket connection and clears continuity state so a later reconnect does not stitch against stale closes.
