# Reconnect Automatically After Disconnect

When using Bitquery GraphQL streams via WebSocket, you need to implement reconnect logic if you don't receive any data or a 'ka' message for, say, 10 seconds.
**Bitquery's WebSocket server doesn’t allow mid-connection retries or re-inits, so once "ka" or data stops, you must fully close and re-establish the WebSocket connection**

This is how it would look with below sample implemention of a silent disconnect-reconnect scenario.

![](/img/ApplicationExamples/disconnect.png)

## Sample Implementation in JavaScript

```js
const { WebSocket } = require("ws");
const config = require("./config.json");
let isReconnecting = false;

let bitqueryConnection;
let lastMessageTime = Date.now();
const INACTIVITY_TIMEOUT_MS = 5000;
let inactivityInterval;
const GRAPHQL_SUBSCRIPTION_ID = "1";

const subscriptionQuery = `
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
`;

function connectToBitquery() {
  console.log("Connecting to Bitquery...");
  const wsUrl = `wss://streaming.bitquery.io/eap?token=${config.oauthtoken}`;
  bitqueryConnection = new WebSocket(wsUrl, ["graphql-ws"]);

  bitqueryConnection.on("open", () => {
    console.log(
      "Connected to Bitquery WebSocket",
      bitqueryConnection.readyState
    );

    // Send connection_init ONLY after socket is open
    bitqueryConnection.send(JSON.stringify({ type: "connection_init" }));

    lastMessageTime = Date.now();
    startInactivityTimer();
  });

  bitqueryConnection.on("message", (data) => {
    lastMessageTime = Date.now();

    let response;
    try {
      response = JSON.parse(data);
    } catch (err) {
      console.error("Invalid JSON from server:", data);
      return;
    }

    switch (response.type) {
      case "connection_ack":
        console.log("Connection acknowledged.");

        // Send subscription only now (socket is open + server ack)
        sendSubscription();
        break;

      case "data":
        // console.log("Received data:", response.payload.data);
        break;

      case "ka":
        console.log("Keep-alive received.");
        break;

      case "error":
        console.error("Error from server:", response.payload.errors);
        break;

      default:
        console.warn("Unknown message type:", response);
    }
  });

  bitqueryConnection.on("close", () => {
    // Send complete message to properly terminate subscription before closing
    if (bitqueryConnection.readyState === WebSocket.OPEN) {
      const completeMessage = {
        type: "complete",
        id: GRAPHQL_SUBSCRIPTION_ID
      };
      bitqueryConnection.send(JSON.stringify(completeMessage));
      console.log("Complete message sent for subscription termination.");
    }
    
    console.warn("WebSocket closed. Reconnecting...");
    reconnect();
  });

  bitqueryConnection.on("error", (error) => {
    console.error("WebSocket error:", error.message);
    reconnect();
  });
}

function sendSubscription() {
  if (bitqueryConnection.readyState !== WebSocket.OPEN) {
    console.warn("Cannot send subscription, socket not open.");
    return;
  }

  const subscriptionMessage = {
    type: "start",
    id: GRAPHQL_SUBSCRIPTION_ID,
    payload: { query: subscriptionQuery },
  };

  bitqueryConnection.send(JSON.stringify(subscriptionMessage));
  console.log("Subscription message sent.");
}

function startInactivityTimer() {
  clearInterval(inactivityInterval);
  inactivityInterval = setInterval(() => {
    if (Date.now() - lastMessageTime > INACTIVITY_TIMEOUT_MS) {
      console.warn("No message received for 5s. Closing and reconnecting...");
      reconnect();
    }
  }, 5000);
}

function reconnect() {
  if (isReconnecting) return; // Prevent multiple calls
  isReconnecting = true;

  clearInterval(inactivityInterval);

  if (bitqueryConnection) {
    try {
      // Send complete message to properly terminate subscription before closing
      if (bitqueryConnection.readyState === WebSocket.OPEN) {
        const completeMessage = {
          type: "complete",
          id: GRAPHQL_SUBSCRIPTION_ID
        };
        bitqueryConnection.send(JSON.stringify(completeMessage));
        console.log("Complete message sent before reconnection.");
      }
      bitqueryConnection.close(1000, "Reconnecting due to inactivity");
    } catch (e) {
      console.error("Error closing connection:", e.message);
    }
  }

  console.warn(" Reconnecting in 3 seconds...");
  setTimeout(() => {
    isReconnecting = false;
    connectToBitquery();
  }, 3000); // wait before retrying
}

connectToBitquery();
```

Consider implementing an exponential backoff logic (e.g., retry at 3s, 6s, 12s, up to a max) to avoid sending repeated subscription requests.
