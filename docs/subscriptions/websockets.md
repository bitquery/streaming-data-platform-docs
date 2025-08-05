---
sidebar_position: 3
---

# Accessing Streaming Data via WebSocket

In the previous section, we learned how to get live data in Bitquery IDE by creating subscription queries. Now, let's take a closer look at how these live updates actually work and what happens behind the scenes to provide you with this real-time data.

Bitquery makes real-time data available using WebSockets. We use a specific WebSocket protocol called the "GraphQL WebSocket" to make sure you receive real-time updates. To get data in real-time for your application, you can connect to the following WebSocket endpoint:

```
wss://streaming.bitquery.io/graphql
```

Note for chains on the [EAP endpoint](https://streaming.bitquery.io/eap), the url is

```
wss://streaming.bitquery.io/eap
```

### Limits

You are charged for the number of subscriptions (aka streams) and not for the number of websockets. Read more on pricing for streams [here](https://docs.bitquery.io/docs/ide/points/#how-are-points-calculated-for-subscriptions)


### Data Handling

It's important to note that for committed blocks, data will come in portions (by block), and for the mempool, data will come by transactions (or set of transactions). You do not have control over the sequence in which this data will arrive. Therefore, ensure your application is designed to handle data in this manner.

**Websockets using Bitquery graphQL streams cannot send "close" messages, only way to end the subscription/stream is to close the websocket**


## Authorising Websockets

Read [here](https://docs.bitquery.io/docs/authorisation/websocket/) on how to use websockets with OAuth.

Here is the link to a Postman collection with samples demonstrating how to use the wss endpoint:

> [Postman Collection for Examples](https://www.postman.com/interstellar-eclipse-270749/workspace/bitquery)

Continue reading about how to create and use websockets in this [section](/docs/subscriptions/subscription.md)

## Supported Standards

GraphQL supports 2 standards to deliver the data updates:

- `graphql-transport-ws`
- `graphql-ws`

Essentially they are the same, differ only in details. Typically, you use some library,
which already implement one of these. we support both of them. We adhere to the standard logic for ping, pong, and disconnect actions.
We adhere to the standard logic for ping, pong, and disconnect actions. Once the socket is open, the server sends a 'ka' message if you're using graphql-ws. Alternatively, if you're using graphql-transport-ws, the server will send a 'pong' message. This process ensures that the connection remains active and healthy.

You can find examples of how to use it in your code [here](/docs/subscriptions/examples.md)
