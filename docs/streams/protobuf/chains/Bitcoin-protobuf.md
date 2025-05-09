# Bitcoin Protobuf Streams

You can find the schema [here](https://github.com/bitquery/streaming_protobuf/tree/main/utxo).

Remember that Bitcoin blocks are produced with an average gap of 10 minutes per block.

## Structure of On-Chain Data

### Block-Level Data

Each block in the stream includes a `Header` with fields such as `Hash`, `Height`, `Time`, `MerkleRoot`, `Nonce`, and `Bits`. These fields correspond directly to the components of a standard Bitcoin block header.

### Transaction-Level Data

Transactions are represented with their own `Header`, `Inputs`, and `Outputs`.

- **Inputs** reference previous transaction outputs (UTXOs).
- **Outputs** specify recipient addresses and amounts.

### Script and Address Details

The stream provides detailed script information, including `ScriptPubKey` and `ScriptSig`, along with address representations. The meaning of these opcodes can be found in the official [Bitcoin Developer Documentation](https://developer.bitcoin.org/reference/transactions.html#opcodes).

### Using This Stream in Python, JavaScript, and Go

The same Python, JavaScript, and Go code samples can be used with this stream by simply changing the topic to `btc.transactions.proto` and using the `ParsedBlockMessage` schema, which can be found in the [Parsed Block Message Schema](https://github.com/bitquery/streaming_protobuf/blob/main/utxo/parsed_block_message.proto).
