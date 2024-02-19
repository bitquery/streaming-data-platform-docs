---
sidebar_position: 4
---

# Examples

This section provides examples of how to implement subscription queries in your code.

## Example of Multiple Queries with one Websocket

In this query, we see how to run multiple queries with a single WebSocket. It's important to note that your top-level element must be only one.

This query will return two sets of transfer data for USDT on the Ethereum network: `transfers_above_10K` and `transfers_below_10K`. The `transfers_above_10K` data set includes all transfers with an amount greater than or equal to 10,000 USDT. The `transfers_below_10K` data set includes all transfers with an amount less than 10,000 USDT. Both data sets include the transaction hash, sender, receiver, and amount of each transfer.

You can run the query [here](https://ide.bitquery.io/USDT-transfers-of-different-amounts-mempool)

```
subscription ($token: String!, $minamount: String!, $mempool: Boolean, $network: evm_network!) {
  usdt: EVM(network: $network, mempool: $mempool) {
    transfers_above_10K: Transfers(
      where: {Transfer: {Amount: {ge: $minamount}, Currency: {SmartContract: {is: $token}}}}
    ) {
      Transaction {
        Hash
        From
        Gas
      }
      Receipt {
        GasUsed
      }
      Transfer {
        Sender
        Receiver
        Amount
      }
    }
    transfers_below_10K: Transfers(
      where: {Transfer: {Amount: {lt: $minamount}, Currency: {SmartContract: {is: $token}}}}
    ) {
      Transaction {
        Hash
        From
        Gas
      }
      Receipt {
        GasUsed
      }
      Transfer {
        Sender
        Receiver
        Amount
      }
    }
  }
}
{
  "token": "0xdac17f958d2ee523a2206206994597c13d831ec7",
  "minamount": "10000",
  "mempool": true,
  "network": "eth"
}
```

## Implementation Example: Using WebSocket Using Python

In this example, we'll use the python_graphql_client library to create a GraphQL client that connects to a WebSocket endpoint. This client will subscribe to a query and print the results.

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

## Implementation Example:Using WebSocket Using JavaScript

Open any online code editor and use this JavaScript code to use the websocket. Starting January you need to use OAuth to use the V2 APIs. Read more [here](/docs/start/authorisation/websocket.md)

```javascript
const { WebSocket, WebSocketServer } = require("ws");

const BITQUERY_WS_URL = "wss://streaming.bitquery.io/graphql";

const bitqueryConnection = new WebSocket(
  "wss://streaming.bitquery.io/graphql?token=ory*at*..",
  ["graphql-ws"],
  {
    headers: {
      "Sec-WebSocket-Protocol": "graphql-ws",
      "Content-Type": "application/json",
    },
  }
);

const lps = ["0xc74b026fab49d2380ffc6f53908c2ae6d14aa3b6"];

bitqueryConnection.on("open", () => {
  console.log("Connected to Bitquery.");

  // Send initialization message
  const initMessage = JSON.stringify({ type: "connection_init" });
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
      },
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

bitqueryConnection.on("error", (error) => {
  console.error("WebSocket Error:", error);
});
```
