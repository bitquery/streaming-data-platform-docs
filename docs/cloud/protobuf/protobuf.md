---
sidebar_position: 3
---

# Protobuf Format

Object is encoded using [protobuf](https://protobuf.dev/) schema and compressed with
[lz4](https://github.com/lz4/lz4) utility.

[Protobuf](https://protobuf.dev/) schema is defined at the
[streaming_protobuf](https://github.com/bitquery/streaming_protobuf) project
according to the blockchain type.

Refer to the blockchain sections for the exact mapping of different types of the blockchain.

To decode the file content you have to:

1. de-compress the object using LZ4 library
2. decode the content using appropriate schema from [streaming_protobuf](https://github.com/bitquery/streaming_protobuf) project
