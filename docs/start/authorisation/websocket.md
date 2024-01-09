---
sidebar_position: 3
---

# Authenticating Websockets

When it comes to authenticating websockets, a different approach is required. The token can be included in two ways.

The first option is to use `wss://streaming.bitquery.io/graphql`  and include the token with the following headers:

```
Authorization: Bearer ory_...
Sec-WebSocket-Protocol: graphql-ws
Content-Type: application/json
```

Alternatively, you can use `wss://streaming.bitquery.io/graphql?token=ory*at*..` with the token attached and include only two headers:

```
Sec-WebSocket-Protocol: graphql-ws
Content-Type: application/json

```

Refer this [link](https://www.postman.com/spacecraft-geologist-86385692/workspace/bitquery/ws-raw-request/6598115e15ac68cb199a7baa) and [this](https://www.postman.com/spacecraft-geologist-86385692/workspace/bitquery/ws-raw-request/659811c95188ca95c7b9e569) link for postman examples of the both approaches.