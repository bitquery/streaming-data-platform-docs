---
sidebar_position: 1
image: "/img/heroImage4.png"
---

# Overview

Bitquery 's infrastructure provides you access to historical and real-time blockchain data through various interfaces such as GraphQL APIs.


## GraphQL Query API

Get started with our APIs in a minute by building **[your first query](start/first-query)**.

You can query [archive](graphql/dataset/archive), [real-time](graphql/dataset/realtime) or [combined](graphql/dataset/combined) dataset based on your requirements.

After the query is built you can [save](ide/private) it and embed it in your application using [pre-cooked code snippet](ide/code) in any popular programming language.

```graphql
query {
  EVM(dataset: archive network: bsc) {
    Transactions {
      Block {
        Date
      }
      count
    }
  }
}
```
## Integrated Development Environment (IDE)

Integrated Development Environment (**[IDE](https://graphql.bitquery.io/ide?endpoint=https://streaming.bitquery.io/graphql)**) helps you to manage your query,
share them with other developers and generate a code to use the queries in your applications.

![IDE screen](/img/ide/screen.png)

## GraphQL Subscription (WebSocket) API

Subscription (WebSocket) is an extension of GraphQL API. It allows to subscribe on the updates
in the data in real-time and receive the new data changes using WebSocket protocol.

Protocols subscriptions-transport-ws and graphql-transport-ws are supported.

```graphql
subscription {
  EVM(trigger_on: head) {
    Transactions {
      Block {
        Hash
        Number
        Date
      }
      count
    }
  }
}
```

## Cloud Data Storage

If you build your applications in cloud or you need raw data for deep investigations or even 
machine learning algorithms, use the cloud data storage.

It contains optimized data for applications on different levels - from the raw data from blockchain nodes
to the parsed protocols as DEX (decentralized exchanges) or NFT (non-fungible tokens).

![AWS S3 bucket](/img/aws/s3_bucket.png)



## SQL Like Interface

We also provide SQL like interface on our Enterprise plan, if you want to explore that, please send us email at [hello@bitquery.io](mailto:hello@bitquery.io)


## Bitquery Support Channels

We highly encourage you to dig into our docs first; however, you can contact us on the following platforms if you still have any queries.

1. [Telegram](https://t.me/bloxy_info) & [Discord](https://discord.gg/EEBVTQnb2E) - For quick questions and doubts
2. [Community Forum](https://community.bitquery.io/) - For how to questions, features requests that can also help wider community
3. [Support Desk](https://support.bitquery.io/hc/en-us/requests/new) - For data problems, bugs 
