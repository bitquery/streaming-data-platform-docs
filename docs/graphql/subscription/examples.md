---
sidebar_position: 4
---
# Examples

This section provides practical examples of how to implement subscription queries in your code.


## Example: Using WebSocket Using Python

Here is an example which uses GrapqhQL WebSocket Using Python and `python_graphql_client`:

```python
from python_graphql_client import GraphqlClient
import asyncio

ws = GraphqlClient(
    endpoint=
    "wss://streaming.bitquery.io/graphql?token=ory_at_QkA....",
    headers={
        "Sec-WebSocket-Protocol": "graphql-ws",
        "Content-Type": "application/json"
    })

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

Open any online code editor and use this JavaScript code to use the websocket. Starting January you need to use OAuth to use the V2 APIs. Read more [here](/docs/start/authorisation/websocket.md)


```javascript
const { WebSocket, WebSocketServer } = require("ws");


const BITQUERY_WS_URL = "wss://streaming.bitquery.io/graphql";

const bitqueryConnection = new WebSocket("wss://streaming.bitquery.io/graphql?token=ory*at*..", ["graphql-ws"], {
  headers: {
    "Sec-WebSocket-Protocol": "graphql-ws",
    "Content-Type": "application/json"
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