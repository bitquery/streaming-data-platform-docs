---
sidebar_position: 4
---

# EVM Data Buckets

Data buckets are created per-blockchain with the following names:

* ```streaming-eth``` for Ethereum Mainnet
* ```streaming-bsc``` for Binance Smart Chain Mainnet
* ```streaming-matic``` for Matic (Polygon) Mainnet
* ```streaming-arbitrum``` for Arbitrum Mainnet
* ```streaming-optimism``` for Optimism Mainnet
* ```streaming-opbnb``` for Binance OpBNB Mainnet
* ```streaming-base``` for Base Mainnet

Buckets contain the files with path

```
<EVM_CHAIN>.blocks.s3/<FOLDER>/<BLOCK>_<BLOCK_HASH>_<CONTENT_HASH>.block.lz4
```

where:

* ```<EVM_CHAIN>``` is the name of the chain ( same as in bucket name )
* ```<FOLDER>``` is the folder of block number, rounded to 1000, padded with zeroes up to 12 digites, e.g. 000000001000
* ```<BLOCK>``` is the block number, padded with zeroes up to 12 digites, e.g. 000000001234
* ```<BLOCK_HASH>``` block hash, hex, 0x prefixed
* ```<CONTENT_HASH>``` content hash

The content is Protobuf encoded and LZ4 compressed file of the raw block from the blockchain node, with all traces.

Schema for Protobuf is **BlockMessage** of [block_message.proto](https://github.com/bitquery/streaming_protobuf/blob/main/evm/block_message.proto)

