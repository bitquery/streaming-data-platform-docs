# Tutorial: How to Stream Moonshot Live Prices

In this tutorial, you will learn how to create a simple React application to stream live prices from the Moonshot protocol using WebSocket and Bitquery's [Moonshot APIs](https://docs.bitquery.io/docs/examples/Solana/Moonshot-API/).

You can find the complete repo [here](https://github.com/Divyn/streaming-moonshot-prices)

The final output would look something like this

![](/img/ApplicationExamples/moonshot.png)


### Prerequisites

-   Basic knowledge of React and JavaScript.
-   Node.js installed on your machine.
-   [Bitquery OAuth token.](https://docs.bitquery.io/docs/authorisation/how-to-generate/)


### Step 1: Setting Up the Project

First, create a new React project if you don’t have one already:

```
npx create-react-app moonshot-stream
cd moonshot-stream
```

### Step 2: Install Required Packages

Install the necessary dependencies for WebSocket support:

```
npm install reconnecting-websocket

```


### Step 3: Create the `useWebSocket` Hook

The `useWebSocket` hook will manage the WebSocket connection, handle reconnection attempts, and process the incoming data.



#### **1. `useWebSocket.js` - Custom WebSocket Hook**

This file contains a custom React hook named `useWebSocket`, which manages the WebSocket connection.

- **Step 1: Initialize State Variables**

  ```javascript
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  ```

  - `data`: Stores the incoming data from the WebSocket.
  - `error`: Stores any error messages that may occur during connection.
  - `isConnected`: Tracks whether the WebSocket is currently connected.
  - `retryCount`: Counts the number of reconnection attempts made.

- **Step 2: Define the `useEffect` Hook**

  ```javascript
  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new ReconnectingWebSocket(url, ["graphql-ws"], options);
  ```

  - `useEffect` is used to initiate the WebSocket connection when the component mounts or when the `retryCount` changes.
  - `connectWebSocket` function is defined inside the `useEffect` to handle the connection logic.

- **Step 3: Handle WebSocket Events**

  - **onopen Event**

    ```javascript
    ws.onopen = () => {
      setIsConnected(true);
      setRetryCount(0);
      ws.send(JSON.stringify({ type: "connection_init" }));
      
      setTimeout(() => {
        ws.send(
          JSON.stringify({
            type: "start",
            id: "1",
            payload: { query },
          })
        );
      }, 1000);
    };
    ```

    - `onopen`: Triggered when the WebSocket connection is established.
    - Sends an initial `connection_init` message.
    - Sends the GraphQL query after a short delay.

  - **onmessage Event**

    ```javascript
    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.type === "data") {
        setData(response.payload.data);
      }
    };
    ```

    - `onmessage`: Triggered when a message is received from the server.
    - Parses the JSON data and updates the `data` state with the payload.

  - **onclose Event**

    ```javascript
    ws.onclose = () => {
      setIsConnected(false);
      if (retryCount < maxRetries) {
        setRetryCount(retryCount + 1);
        setTimeout(connectWebSocket, 2000);
      } else {
        setError("Max retry attempts reached. Could not connect to Bitquery.");
      }
    };
    ```

    - `onclose`: Triggered when the WebSocket connection is closed.
    - Attempts to reconnect if the maximum retry count has not been reached.

  - **onerror Event**

    ```javascript
    ws.onerror = (event) => {
      console.error("WebSocket Error:", event);
      setError("WebSocket error occurred. See console for details.");
    };
    ```

    - `onerror`: Triggered when an error occurs with the WebSocket.
    - Logs the error to the console and updates the `error` state.

- **Step 4: Close Function**

  ```javascript
  return () => {
    ws.close();
  };
  ```

  - Ensures that the WebSocket connection is properly closed when the component unmounts.

- **Step 5: Return Values**

  ```javascript
  return { data, error, isConnected };
  ```

  - The hook returns the current state values (`data`, `error`, `isConnected`) to be used in the component.

---

### Step 4: `App.js` - Main Component

This file contains the main React component that uses the `useWebSocket` hook to display the data.

- **Step 1: Define the GraphQL Query**

  ```javascript
  const query = `
    subscription MyQuery {
      Solana {
        DEXTrades(
          where: {
            Trade: { Dex: { ProtocolFamily: { is: "Moonshot" } } }
            Transaction: { Result: { Success: true } }
          }
        ) {
          ...
        }
      }
    }
  `;
  ```

  - This query subscribes to real-time data from the Solana blockchain, filtering for DEX trades related to the "Moonshot" protocol.

- **Step 2: Define the WebSocket URL and Options**

  ```javascript
  const url = "wss://streaming.bitquery.io/eap?token=YOUR_TOKEN";
  const options = {
    maxReconnectionDelay: 10000,
    minReconnectionDelay: 1000,
    reconnectionDelayGrowFactor: 1.3,
    connectionTimeout: 5000,
    maxRetries: Infinity,
    debug: true,
  };
  ```

  - `url`: The WebSocket endpoint, including your Bitquery Token.
  - `options`: Configuration for the WebSocket connection, such as reconnection delays and retry limits.

- **Step 3: Use the `useWebSocket` Hook**

  ```javascript
  const { data, error, isConnected } = useWebSocket(url, options, query);
  ```

  - The hook is called with the `url`, `options`, and `query`, and returns the current connection status, any errors, and the received data.

- **Step 4: Render the Component**

  ```javascript
  return (
    <div>
      <h1>Bitquery WebSocket</h1>
      <p>Status: {isConnected ? "Connected" : "Disconnected"}</p>
      {error && <p>Error: {error}</p>}
      {data ? (
        <table>
          <tbody>
            <tr>
              <th>Protocol Family</th>
              <td>{data.Solana.DEXTrades[0].Trade.Dex.ProtocolFamily}</td>
            </tr>
            <tr>
              <th>Protocol Name</th>
              <td>{data.Solana.DEXTrades[0].Trade.Dex.ProtocolName}</td>
            </tr>
            <tr>
              <th>Buy Amount</th>
              <td>{data.Solana.DEXTrades[0].Trade.Buy.Amount}</td>
            </tr>
            <tr>
              <th>Buy Currency</th>
              <td>{data.Solana.DEXTrades[0].Trade.Buy.Currency.Symbol}</td>
            </tr>
            <tr>
              <th>Sell Amount</th>
              <td>{data.Solana.DEXTrades[0].Trade.Sell.Amount}</td>
            </tr>
            <tr>
              <th>Sell Currency</th>
              <td>{data.Solana.DEXTrades[0].Trade.Sell.Currency.Symbol}</td>
            </tr>
            <tr>
              <th>Transaction Signature</th>
              <td>{data.Solana.DEXTrades[0].Transaction.Signature}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
  ```

  - The component renders the connection status, any errors, and the data in a table format if available.
  - If the data is not yet available, it displays a "Loading data..." message.

