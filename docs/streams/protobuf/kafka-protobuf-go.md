---
sidebar_position: 1
---

# Go Example to Use Kafka Protobuf Streams for Real-time Data

This guide walks through the implementation of a Kafka consumer in Go to subscribe to a Kafka topic and process [onchain data streams from Bitquery](https://bitquery.io/products/streaming) in real-time. The consumer connects to the Kafka brokers securely using SSL and handles incoming messages in **Protobuf** format.

The schema is available [here](https://github.com/bitquery/streaming_protobuf/tree/main/solana).

The complete code is available [here](https://github.com/bitquery/stream_protobuf_example).

