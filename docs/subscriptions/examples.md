---
sidebar_position: 4
---

# Building with WebSockets: Code Samples in Python & JavaScript

This section provides examples of how to implement subscription queries in your code.

## Implementation Example: Using WebSocket Using Python

This example demonstrates how to use the `gql` library in Python to create a client that connects to a WebSocket endpoint, subscribes to a query, and prints the results. The script also uses the `asyncio` library to wait for results from the wss endpoint and all asynchronous operations.

```python
import asyncio

from gql import Client, gql
from gql.transport.websockets import WebsocketsTransport


async def main():
  transport = WebsocketsTransport(
      url=
      "wss://streaming.bitquery.io/graphql?token=ory_at_cap...",
      headers={"Sec-WebSocket-Protocol": "graphql-ws"})

  # Use use `/eap` instead of `/graphql` if you are using chains on EAP endpoint
  await transport.connect()
  print("connected")

  # # Close the connection
  try:

    async for result in transport.subscribe(
        gql("""
              subscription MyQuery {
                  EVM(network: eth) {
                      count: Blocks {
                          Block {
                              TxCount
                          }
                      }
                  }
              }
          """)):
      print(result)
  except:
    print("Transport is already connected!")
  await transport.close()


# Run the asyncio event loop
asyncio.run(main())


```

The `transport.connect()` function is used to establish a connection to the WebSocket server and start the subscription. Similarly, `transport.close()` is used to close the connection and stop the subscription.

## Implementation Example:Using WebSocket Using JavaScript

Open any online code editor and use this JavaScript code to use the websocket. Starting January you need to use OAuth to use the V2 APIs. Read more [here](/docs/authorisation/websocket.md)

```javascript
const { WebSocket } = require("ws");

const token = "ory_at";
//Use use `/eap` instead of `/graphql` if you are using chains on EAP endpoint
const bitqueryConnection = new WebSocket(
  "wss://streaming.bitquery.io/eap?token=" + token,
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

  // Handle connection acknowledgment (connection_ack)
  if (response.type === "connection_ack") {
    console.log("Connection acknowledged by server.");

    // Send subscription message after receiving connection_ack
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
  }

  // Handle received data
  if (response.type === "data") {
    console.log("Received data from Bitquery: ", response.payload.data);
  }

  // Handle keep-alive messages (ka)
  if (response.type === "ka") {
    console.log("Keep-alive message received.");
    // No action required; just acknowledgment that the connection is alive.
  }

  if (response.type === "error") {
    console.error("Error message received:", response.payload.errors);
  }
});

bitqueryConnection.on("close", () => {
  console.log("Disconnected from Bitquery.");
});

bitqueryConnection.on("error", (error) => {
  console.error("WebSocket Error:", error);
});
```

This script opens a WebSocket connection to the Streaming API, sends an initialization message (`connection_init`), starts a subscription with a query (`start`), handles incoming data (`data`), keep-alive messages (`ka`), and errors, and finally closes the connection gracefully.

**How the WebSocket Connection is Managed**:

- **Start Connection**:

  - The connection is initiated using the `bitqueryConnection.on("open", () => {...})` event handler. This event is triggered when the WebSocket connection is successfully established.
  - After the connection is opened, an initialization message (`connection_init`) is sent to the server. Once the server responds with a `connection_ack` message, a subscription request is sent containing a GraphQL query.

- **Subscription**:

  - The subscription message is sent only after receiving the `connection_ack` from the server, ensuring the connection is properly initialized. The subscription listens for new transfer events in the `Tron` blockchain.

- **Handling Incoming Messages**:

  - The `bitqueryConnection.on("message", (data) => {...})` handler processes all incoming messages.
    - **Data (`data`)**: When the server sends blockchain data, it is logged to the console.
    - **Keep-alive (`ka`)**: Keep-alive messages are logged but do not require any additional action. These messages are sent periodically by the server to ensure the connection remains active.
    - **Errors (`error`)**: If the server sends an error message, it is logged to the console, and appropriate action can be taken.

- **Stop Connection**:

  - The connection is closed by calling `bitqueryConnection.close()` when necessary. This code currently keeps the connection open indefinitely, allowing for continuous data streaming. The `close` event logs when the connection is terminated, either by the client or the server.

> To close a subscription, you have to close the websocket.

- **Error Handling**:

  - If any WebSocket errors occur during the connection, they are caught and logged using the `bitqueryConnection.on("error", (error) => {...})` event handler.
