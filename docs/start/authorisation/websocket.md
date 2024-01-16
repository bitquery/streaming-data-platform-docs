---
sidebar_position: 3
---

# Authenticating Websockets

When it comes to authenticating websockets, a different approach is required. The token can be included in the following manner:

 `wss://streaming.bitquery.io/graphql?token=ory*at*..` with the token attached and include only two headers:

```
Sec-WebSocket-Protocol: graphql-ws
Content-Type: application/json

```

Refer this [this](https://www.postman.com/spacecraft-geologist-86385692/workspace/bitquery/ws-raw-request/659811c95188ca95c7b9e569) link for postman example of how to use OAuth with websockets.