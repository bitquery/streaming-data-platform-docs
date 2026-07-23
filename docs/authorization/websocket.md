---
sidebar_position: 3
title: "Authenticate Bitquery WebSockets"
description: "Authenticate Bitquery WebSockets in Bitquery docs with practical setup steps, examples, and guidance for secure API access."
---
# Authenticating Websockets

When it comes to authenticating websockets the token can be included only in the following manner:

 `wss://streaming.bitquery.io/graphql?token=ory*at*..` with the token attached to the URL. The request should include only two headers:

```
Sec-WebSocket-Protocol: graphql-ws
Content-Type: application/json

```

Refer this [this](https://www.postman.com/interstellar-eclipse-270749/workspace/bitquery/ws-raw-request/659811c95188ca95c7b9e569?action=share&creator=27392958&ctx=documentation) link for postman example of how to use OAuth with websockets.
