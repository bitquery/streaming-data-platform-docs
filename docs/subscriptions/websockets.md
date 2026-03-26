---
sidebar_position: 3
---

# Accessing Streaming Data via WebSocket

In the previous section, we learned how to get live data in Bitquery IDE by creating subscription queries. Now, let's take a closer look at how these live updates actually work and what happens behind the scenes to provide you with this real-time data.

Bitquery makes real-time data available using WebSockets. We use a specific WebSocket protocol called the "GraphQL WebSocket" to make sure you receive real-time updates. To get data in real-time for your application, you can connect to the following WebSocket endpoint:

```
wss://streaming.bitquery.io/graphql
```

For a **live DEX trades** subscription example (GraphQL document plus BSC/Solana links), see [How do I subscribe to live DEX trades using Bitquery WebSocket?](https://docs.bitquery.io/docs/subscriptions/examples#how-do-i-subscribe-to-live-dex-trades-using-bitquery-websocket).

### Limits

You are charged for the number of subscriptions (aka streams) and not for the number of websockets. Read more on pricing for streams [here](https://docs.bitquery.io/docs/ide/points/#how-are-points-calculated-for-subscriptions)


### Data Handling

It's important to note that for committed blocks, data will come in portions (by block), and for the mempool, data will come by transactions (or set of transactions). You do not have control over the sequence in which this data will arrive. Therefore, ensure your application is designed to handle data in this manner.

**Websockets using Bitquery graphQL streams cannot send "close" messages, only way to end the subscription/stream is to close the websocket**


## Authorising Websockets

Read [here](https://docs.bitquery.io/docs/authorisation/websocket/) on how to use websockets with OAuth.

Here is the link to a Postman collection with samples demonstrating how to use the wss endpoint:

> [Postman Collection for Examples](https://www.postman.com/interstellar-eclipse-270749/workspace/bitquery)

Continue reading about how to create and use websockets in this [section](https://docs.bitquery.io/docs/subscriptions/subscription/)

## Supported Standards

GraphQL supports 2 standards to deliver the data updates:

- `graphql-transport-ws`
- `graphql-ws`

Essentially they are the same, differ only in details. Typically, you use some library,
which already implement one of these. we support both of them. We adhere to the standard logic for ping, pong, and disconnect actions.
We adhere to the standard logic for ping, pong, and disconnect actions. Once the socket is open, the server sends a 'ka' message if you're using graphql-ws. Alternatively, if you're using graphql-transport-ws, the server will send a 'pong' message. This process ensures that the connection remains active and healthy.

You can find examples of how to use it in your code [here](https://docs.bitquery.io/docs/subscriptions/examples/)


## Why do I get a failed WebSocket connection error when converting query to subscription?

**How to Fix "Failed WebSocket Connection" When Converting a Query to a Subscription**

When switching from a regular GraphQL query to a WebSocket subscription in Bitquery, follow these steps:

1. **Change Operation Type**  
   - If your GraphQL starts with `query`, replace it with `subscription`.  
   - If it doesn’t have `query` written, simply add `subscription` before your operation.

   **Example:**
   ```graphql
   # Original Query
   query {
     EVM(network: bsc) { ... }
   }

   # Subscription Version
   subscription {
     EVM(network: bsc) { ... }
   }
   ```

2. **Test the Query**  
   - Make sure your query runs successfully as a query before converting to a subscription.  
   - If the query is not valid, the subscription will not work.

3. **WebSocket Endpoint**  
   - Use `wss://streaming.bitquery.io/graphql` for all streaming subscriptions.  
   - Do _not_ use the standard HTTP GraphQL API endpoint.

4. **Authentication**  
   - You must authenticate using OAuth or provide your Bitquery API token over the WebSocket connection.  
   - See [WebSocket authorisation guide](https://docs.bitquery.io/docs/authorisation/websocket/) for details.

5. **Subprotocol**  
   - Your WebSocket client must support either `graphql-ws` or `graphql-transport-ws` subprotocols.    
   - We support both standards. Refer to the [standards section above](#supported-standards) for client libraries and usage.

6. **Compatibility Caveats**  
   - Some fields or dataset combinations supported in queries are *not* yet available via streaming subscriptions.  
   - If you get “subscription not valid” errors, check [this guide](https://docs.bitquery.io/docs/subscriptions/subscription/) or Bitquery v2 query docs for compatibility information.

7. **Error Diagnosis**
    - _Connection failed_ errors usually indicate a transport or authentication problem.
    - _Parse errors_ and messages like “subscription not valid” are due to GraphQL or unsupported operation/spec.

If you continue having issues, please reach out for help in our Telegram community: [https://t.me/bloxy_info](https://t.me/bloxy_info)
