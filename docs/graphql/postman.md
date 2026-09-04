---
title: "Bitquery GraphQL in Postman"
description: "Bitquery GraphQL in Postman in Bitquery GraphQL with clear syntax, examples, and tips for fast blockchain queries and streams."
---
# Accessing Queries on Postman

You can run the queries and subscriptions on Postman as well. Below is the link to the collection:

[Postman Collection for Examples](https://www.postman.com/interstellar-eclipse-270749/workspace/bitquery)

![Using the Bitquery GraphQL API in Postman](/img/postman.png)

The **Streaming API / v2** collection covers every supported chain — Solana, Ethereum, BSC, Base, Arbitrum, Polygon, Optimism, Tron, Bitcoin, Cardano, Algorand, Robinhood Chain — plus cross-chain Trading APIs, Perpetuals (Hyperliquid and Solana perps), Stablecoins and Prediction Markets. Examples are grouped into folders by chain and category.

## Setup

1. [Generate an access token](/docs/authorization/how-to-generate/).
2. Set the collection variable `ACCESS_TOKEN` to your `ory_at_...` token.
3. `BASE_URL` is already set to `https://streaming.bitquery.io/graphql`.

Every request sends the token as `Authorization: Bearer {{ACCESS_TOKEN}}`.

Remember that the token must be passed differently for a `query` vs a `subscription`. You can read more about it [here](/docs/authorization/how-to-use/)

>Remember that a websocket can be opened only on desktop version of Postman
