---
sidebar_position: 1
---

# Arbitrum API Documentation

Bitquery API offers access to indexed data from the Arbitrum blockchain via GraphQL API and GraphQl Subscriptions for developers.

The Arbitrum Explorer [explorer](https://explorer.bitquery.io/arbitrum) is a visual way to view Arbitrum data easily.

![chains](/img/ide/arbitrum.png)

This is the basic structure of a query:

```
query {
 EVM(network: arbitrum){
    __typename
  }
}
```

Let's dive in and explore the Arbitrum data available through Bitquery API.
