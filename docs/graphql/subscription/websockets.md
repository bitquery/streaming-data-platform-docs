---
sidebar_position: 3
---

# Web Sockets

GraphQL supports 2 standards to deliver the data updates:

* ```graphql-transport-ws```
* ```graphql-ws``` 

Essentially they are the same, differ only in details. Typically, you use some library, 
which already implement one of these. we support both of them. We adhere to the standard logic for ping, pong, and disconnect actions.
We adhere to the standard logic for ping, pong, and disconnect actions. Once the socket is open, the server sends a 'ka' message if you're using graphql-ws. Alternatively, if you're using graphql-transport-ws, the server will send a 'pong' message. This process ensures that the connection remains active and healthy.