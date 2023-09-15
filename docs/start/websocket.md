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