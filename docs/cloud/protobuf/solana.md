---
sidebar_position: 5
---

# Solana Data Buckets

Data buckets are created per-blockchain with the following names:

* ```streaming-solana``` for Solana Mainnet

Buckets contain the files with path

```
<SOLANA_CHAIN>.blocks.s3/<FOLDER>/<BLOCK>_<BLOCK_HASH>_<CONTENT_HASH>.block.lz4
```

where:

* ```<SOLANA_CHAIN>``` is the name of the chain ( same as in bucket name, 'solana' )
* ```<FOLDER>``` is the folder of block slot, rounded to 1000, padded with zeroes up to 12 digites, e.g. 000000001000
* ```<BLOCK>``` is the block slot, padded with zeroes up to 12 digites, e.g. 000000001234
* ```<BLOCK_HASH>``` block hash, hex, 0x prefixed
* ```<CONTENT_HASH>``` content hash

The content is Protobuf encoded and LZ4 compressed file of the raw block from the blockchain node, with all traces.

Schema for Protobuf is **BlockMessage** of [block_message.proto](https://github.com/bitquery/streaming_protobuf/blob/main/solana/block_message.proto)


