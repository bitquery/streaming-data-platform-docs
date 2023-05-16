---
sidebar_position: 1
---

# Buckets

S3 buckets are named after the blockchain name with ```streaming-``` prefix:

* ```streaming-eth``` for Ethereum Mainnet
* ```streaming-bsc``` for Binance Smart Chain Mainnet
* ```streaming-solana``` for Solana Mainnet

:::note
For public access the [Demo buckets](/docs/cloud/s3/demo) are available.
:::

The bucket contain the top level folder by the name of the data stream.
The stream is a sequence of [messages](/docs/cloud/s3/messages) with the same [data schema](/docs/cloud/protobuf/protobuf).

This is example of the stream folders in the ```streaming-eth``` bucket:

![AWS S3 bucket](/img/aws/s3_bucket.png)

Mapping between the stream and protobuf data format defined in the [data schema](/docs/cloud/protobuf/protobuf).


