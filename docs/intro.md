---
sidebar_position: 1
---

# Introduction

Bitquery data platform gives access to the blockchain data in a different ways.
Depending on your usage preferences or application you are building, you may find
one or more methods more appropriate.


## GraphQL Query API

Get started use the API in a minute by building **[your first query](docs/start/first-query.md)**.

You can query archive, real-time data in different slices using metrics you select.
After the query is built you can save it and embed it in your application using pre-cooked 
code samples in any popular programming language.

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
## Integrated Development Environment

Integrated Development Environment ( **[IDE](https://grapqhl.bitquery.io)** ) helps you to manage your query,
share them with other developers and generate a code to use the queries in your applications.

![IDE screen](/img/ide_screen.png)

## Subscription WebSocket API

Subscription WebSocket API is an extension of GraphQL API. It allows to subscribe on the updates
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
to the parsed protocols as DEX ( decentralized exchanges ) or NFT ( non-fungible tokens ).

![AWS S3 bucket](/img/aws_s3_bucket.png)