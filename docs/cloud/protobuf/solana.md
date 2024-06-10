---
sidebar_position: 5
---

# Solana Streams

The mapping between Solana streams of messages and protobuf schemas:

* ```BLOCKCHAIN.blocks.s3``` -> **BlockMessage** of [block_message.proto](https://github.com/bitquery/streaming_protobuf/blob/main/solana/block_message.proto)

where ```BLOCKCHAIN``` stands for the short blockchain name:

* ```solana``` for Solana Mainnet

(more chains may be added in the future)
