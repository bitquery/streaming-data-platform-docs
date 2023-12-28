---
sidebar_position: 4
---
# Accessing Streaming Data via WebSocket

In the previous section, we learned how to get live data in Bitquery IDE by creating subscription queries. Now, let's take a closer look at how these live updates actually work and what happens behind the scenes to provide you with this real-time data.

Bitquery makes real-time data available using WebSockets. We use a specific WebSocket protocol called the "GraphQL WebSocket" to make sure you receive real-time updates. To get data in real-time for your application, you can connect to the following WebSocket endpoint:

```
wss://streaming.bitquery.io/graphql
```

## What Is the Difference Between WebSocket and GraphQL WebSocket?

WebSocket provides a general-purpose protocol for real-time bidirectional communication over a single, long-lived connection. However, one drawback is that developers must implement their own messaging and data structure when using WebSocket.

On the other hand, GraphQL WebSocket standardizes communication over WebSocket as defined by the GraphQL specifications. GraphQL WebSocket is a specific protocol and implementation designed to enable real-time communication for GraphQL APIs. 

Here is the link to a Postman collection with samples demonstrating how to use the wss endpoint:

> [Postman Collection for Examples](https://www.postman.com/spacecraft-geologist-86385692/workspace/bitquery/collection/645e69d97aa179eb6799e1d6)


## Example: Using WebSocket Using Python

Here is an example which uses GrapqhQL WebSocket Using Python and `python_graphql_client`:

```python
from python_graphql_client import GraphqlClient
import asyncio

ws = GraphqlClient(endpoint="wss://streaming.bitquery.io/graphql")

query = """
subscription MyQuery {
  EVM(network: eth) {
    count: Blocks {
      Block {
        TxCount
      }
    }
    hash: Blocks {
      Block{
        TxHash
      }
    }
  }
}
"""

asyncio.run(ws.subscribe(query=query, handle=print))
```


## Example: Using WebSocket Using JavaScript

Open any online code editor and use this JavaScript code to use the websocket. Starting January you need to use OAuth to use the V2 APIs. Read more [here](/docs/ide/authorisation/simple.md)


```
const { WebSocket, WebSocketServer } = require("ws");


const BQ_API_KEY = 'keyy';
const BITQUERY_WS_URL = "wss://streaming.bitquery.io/graphql";

const bitqueryConnection = new WebSocket(BITQUERY_WS_URL, ["graphql-ws"], {
  headers: {
    "X-API-KEY": `Bearer ${BQ_API_KEY}`
  }
});

const lps = ["0xc74b026fab49d2380ffc6f53908c2ae6d14aa3b6"];

bitqueryConnection.on("open", () => {
  console.log("Connected to Bitquery.");

  // Send initialization message
  const initMessage = JSON.stringify({ type: 'connection_init' });
  bitqueryConnection.send(initMessage);

  // After initialization, send the actual subscription message
  setTimeout(() => {
    const message = JSON.stringify({
      type: "start",
      id: "1",
      payload: {
        query: `
                subscription RealTimeLP($lps: [String!]) {
                    EVM(network: eth) {
                        BalanceUpdates(
                            where: {
                                BalanceUpdate: { Address: { in: $lps } },
                                Currency: { SmartContract: { is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" }}
                            }
                        ) {
                            balance: sum(of: BalanceUpdate_Amount)
                            Address: BalanceUpdate {
                                Address
                            }
                        }
                    }
                }
                `,
        variables: { lps },
      }
    });

    bitqueryConnection.send(message);
  }, 1000);
});

bitqueryConnection.on("message", (data) => {
  const response = JSON.parse(data);
  if (response.type === "data") {
    // Broadcast the data to all connected clients of your local server
    console.log("Received data from Bitquery: ", response.payload.data);
  }
});

bitqueryConnection.on("close", () => {
  console.log("Disconnected from Bitquery.");
});

bitqueryConnection.on('error', (error) => {
  console.error('WebSocket Error:', error);
});
```