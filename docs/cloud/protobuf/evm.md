---
sidebar_position: 4
---

# EVM Streams

The mapping between EVM streams of messages and protobuf schemas:

* ```BLOCKCHAIN.blocks.s3``` -> **BlockMessage** of [block_message.proto](https://github.com/bitquery/streaming_protobuf/blob/main/evm/block_message.proto) 
* ```BLOCKCHAIN.dextrades.s3``` -> **DexBlockMessage** of [dex_block_message.proto](https://github.com/bitquery/streaming_protobuf/blob/main/evm/dex_block_message.proto)
* ```BLOCKCHAIN.transactions.s3``` -> **ParsedAbiBlockMessage** of [parsed_abi_block_message.proto](https://github.com/bitquery/streaming_protobuf/blob/main/evm/parsed_abi_block_message.proto)
* ```BLOCKCHAIN.tokens.s3``` -> **TokenBlockMessage** of [token_block_message.proto](https://github.com/bitquery/streaming_protobuf/blob/main/evm/token_block_message.proto)

where ```BLOCKCHAIN``` stands for the short blockchain name:

* ```eth``` for Ethereum Mainnet
* ```bsc``` for Binance Smart Chain Mainnet

( more chains may be added in the future )