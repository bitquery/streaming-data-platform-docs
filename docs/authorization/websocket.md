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

## Example: connecting with graphql-ws (JavaScript)

Pass the OAuth token in the connection URL and use the `graphql-ws` subprotocol:

```javascript
import { createClient } from "graphql-ws";

const client = createClient({
  url: "wss://streaming.bitquery.io/graphql?token=ory_at_YOUR_TOKEN",
  // Bitquery expects the token in the URL (not an Authorization header) for WebSockets.
});
```

- Generate the token in [Account → API Access Tokens](https://account.bitquery.io/user/api_v2/access_tokens); see [how to generate a token](/docs/authorization/how-to-generate/).
- Revoking a token does **not** close an already-open socket — terminate running subscriptions from the account panel.

## Next steps

- [WebSocket subscriptions](/docs/subscriptions/websockets/)
- [Rate limits & concurrency](/docs/plans/rate-limits/)
