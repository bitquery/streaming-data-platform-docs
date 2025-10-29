---
sidebar_position: 4
---

# Building with WebSockets: Code Samples in Python & JavaScript

This section provides examples of how to implement subscription queries in your code.
**Remember: You need to implement logic to handle silent disconnect( when no data or keep-alive is received for say X seconds) in your code. Sample [here](https://docs.bitquery.io/docs/subscriptions/silent-disconnect-reconnect/)**.

## Implementation Example: Using WebSocket Using Python

This example demonstrates how to use the `gql` library in Python to create a client that connects to a WebSocket endpoint, subscribes to a query, and prints the results. The script also uses the `asyncio` library to wait for results from the wss endpoint and all asynchronous operations.

```python
import asyncio

from gql import Client, gql
from gql.transport.websockets import WebsocketsTransport


async def main():
    transport = WebsocketsTransport(
        url="wss://streaming.bitquery.io/graphql?token=ory_at_...",
        headers={"Sec-WebSocket-Protocol": "graphql-ws"})

    await transport.connect()
    print("Connected")

    # Define the subscription query
    query = gql("""
        subscription MyQuery {
            EVM(network: eth) {
                count: Blocks {
                    Block {
                        TxCount
                    }
                }
            }
        }
    """)

    async def subscribe_and_print():
        try:
            async for result in transport.subscribe(query):
                print(result)
        except asyncio.CancelledError:
            print("Subscription cancelled.")

    # Run the subscription and stop after 100 seconds
    try:
        await asyncio.wait_for(subscribe_and_print(), timeout=100)
    except asyncio.TimeoutError:
        print("Stopping subscription after 100 seconds.")

    # Close the connection
    await transport.close()
    print("Transport closed")


# Run the asyncio event loop
asyncio.run(main())


```

The `transport.connect()` function is used to establish a connection to the WebSocket server and start the subscription. Similarly, `transport.close()` is used to close the connection and stop the subscription after 100 seconds.

## Implementation Example:Using WebSocket Using JavaScript

Open any online code editor and use this JavaScript code to use the websocket. Starting January you need to use OAuth to use the V2 APIs. Read more [here](/docs/authorisation/websocket.md)

```javascript
const { WebSocket } = require("ws");
const config = require("./config.json"); //store OAuth token

const bitqueryConnection = new WebSocket(
  "wss://streaming.bitquery.io/graphql?token=" + config.oauthtoken,
  ["graphql-ws"]
);

bitqueryConnection.on("open", () => {
  console.log("Connected to Bitquery.");

  // Send initialization message (connection_init)
  const initMessage = JSON.stringify({ type: "connection_init" });
  bitqueryConnection.send(initMessage);
});

bitqueryConnection.on("message", (data) => {
  const response = JSON.parse(data);

  switch (response.type) {
    case "connection_ack":
      console.log("Connection acknowledged by server.");

      // Send subscription message
      const subscriptionMessage = JSON.stringify({
        type: "start",
        id: "1",
        payload: {
          query: `
            subscription {
              Tron(mempool: true) {
                Transfers {
                  Transfer {
                    Sender
                    Receiver
                    Amount
                    AmountInUSD
                    Currency {
                      Symbol
                    }
                  }
                }
              }
            }
          `,
        },
      });

      bitqueryConnection.send(subscriptionMessage);
      console.log("Subscription message sent.");

      // Automatically close the connection after 10 seconds
      setTimeout(() => {
        console.log("Closing WebSocket connection after 10 seconds.");
        
        // Send complete message to properly terminate subscription before closing
        if (bitqueryConnection.readyState === WebSocket.OPEN) {
          const completeMessage = {
            type: "complete",
            id: "1"
          };
          bitqueryConnection.send(JSON.stringify(completeMessage));
          console.log("Complete message sent for subscription termination.");
        }
        
        bitqueryConnection.close();
      }, 10000);
      break;

    case "data":
      console.log("Received data from Bitquery:", response.payload.data);
      break;

    case "ka":
      console.log("Keep-alive message received.");
      break;

    case "error":
      console.error("Error message received:", response.payload.errors);
      break;

    default:
      console.warn("Unhandled message type:", response.type);
  }
});

bitqueryConnection.on("close", () => {
  // Send complete message to properly terminate subscription before closing
  if (bitqueryConnection.readyState === WebSocket.OPEN) {
    const completeMessage = {
      type: "complete",
      id: "1"
    };
    bitqueryConnection.send(JSON.stringify(completeMessage));
    console.log("Complete message sent for subscription termination.");
  }
  
  console.log("Disconnected from Bitquery.");
});

bitqueryConnection.on("error", (error) => {
  console.error("WebSocket Error:", error);
});
```

### How the WebSocket Connection is Managed:

- **Start Connection**:

  - The connection is initiated using `bitqueryConnection.on("open")`.
  - After the WebSocket is open, the client sends a `connection_init` message.
  - Once the server responds with `connection_ack`, a GraphQL subscription is sent.

- **Subscription**:

  - The client subscribes to real-time onchain data (in this example, `Tron` mempool transfers).
  - The server streams data to the client as events occur.

- **Handling Incoming Messages**:

  - **`data`**: Actual blockchain event data, logged to the console.
  - **`ka` (Keep-alive)**: Indicates the connection is still active.
  - **`error`**: Any server-side errors are printed.

- **Stop Connection**:

  - The WebSocket is closed using `bitqueryConnection.close()` after 10 seconds.
  - This cleanly ends the subscription and triggers the `close` event.

- **Error Handling**:

  - If any WebSocket-level error occurs, it is logged in the `error` handler.
  - Bitquery graphQL subscription does not acknowledge `stop` messages, so closing the WebSocket is the correct way to end a subscription.
