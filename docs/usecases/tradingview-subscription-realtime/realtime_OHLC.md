---
sidebar_position: 3
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
const BITQUERY_ENDPOINT =
  "wss://streaming.bitquery.io/eap?token=" + config.authtoken;
```

### Subscription Query

[Run Stream on IDE](https://ide.bitquery.io/1-second-crypto-price-stream)
**We have used Solana as an example below, you can remove it and get data for all chains provided by the Price API**

```javascript
const subscriptionQuery = `
subscription {
  Trading {
    Tokens(
      where: {
        Token: {
          Network: {is: "Solana"},
          Address: {is: "6ft9XJZX7wYEH1aywspW5TiXDcshGc2W2SqBHN9SLAEJ"}
        },
        Interval: {Time: {Duration: {eq: 1}}}
      }
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
      }
    }
  }
}
`;
```

- This query subscribes to **pre-aggregated 1-second OHLC bars** for a token on the Solana network.
- It includes:

  - Block time (`Block.Time`)
  - OHLC prices (`Open`, `High`, `Low`, `Close`)
  - Trade volume (`Volume.Base`)

---

### Subscribing to the Stream

```javascript
export function subscribeToWebSocket(onRealtimeCallback) {
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

    onRealtimeCallback(bar); // Emit finalized 1-second OHLC bar
  };

  client.subscribe(
    { query: subscriptionQuery },
    { next: onNext, error: console.error }
  );
}
```

- **subscribeToWebSocket**:

  - Connects to Bitquery using `graphql-ws`.
  - On each received message, extracts the finalized OHLC bar and passes it to your `onRealtimeCallback`.

### Unsubscribing from the Stream

```javascript
export function unsubscribeFromWebSocket() {
  if (client) {
    client.dispose();
  }
}
```

- **unsubscribeFromWebSocket**: Terminates the WebSocket connection to stop receiving data.
