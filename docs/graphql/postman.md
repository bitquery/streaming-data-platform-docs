---
title: "Bitquery GraphQL in Postman"
description: "Bitquery GraphQL in Postman in Bitquery GraphQL with clear syntax, examples, and tips for fast blockchain queries and streams."
---
# Accessing Queries on Postman

You can run Bitquery queries in Postman. The public workspace has one collection per chain:

[Bitquery Postman Workspace](https://www.postman.com/interstellar-eclipse-270749/bitquery)

![Using the Bitquery GraphQL API in Postman](/img/postman.png)

Every request in the workspace was executed against the live API before publishing.

## Setup

1. [Generate an access token](/docs/authorization/how-to-generate/).
2. Open the collection for the chain you want and set the `ACCESS_TOKEN` variable to your `ory_at_...` token.

That is the only change you need to make — each collection ships with the right `BASE_URL` already set, and every request sends `Authorization: Bearer {{ACCESS_TOKEN}}`.

## Which endpoint a chain uses

| Endpoint | Chains |
| --- | --- |
| `https://streaming.bitquery.io/graphql` | Solana, Ethereum, BSC, Base, Arbitrum, Polygon, Optimism, Tron, Robinhood Chain, plus the Trading APIs, Perpetuals, Stablecoins, Prediction Markets and Cross-chain collections |
| `https://graphql.bitquery.io` | Bitcoin, Litecoin, Bitcoin Cash, Bitcoin SV, Dogecoin, Dash, Zcash, Ripple, Stellar, Cardano, Algorand |

Protocol-specific examples live inside their chain — Pump.fun, Raydium and Meteora are in the **Solana** collection.

## Subscriptions

The collections contain HTTP queries. For real-time streams use `wss://streaming.bitquery.io/graphql` and pass the token in the URL rather than a header — see [how to use a token](/docs/authorization/how-to-use/) and the [WebSocket guide](/docs/authorization/websocket/).

>Remember that a websocket can be opened only on desktop version of Postman
