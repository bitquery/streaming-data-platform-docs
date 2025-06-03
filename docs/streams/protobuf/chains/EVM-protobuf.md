# EVM Streams

This section provides details about Bitquery's EVM Streams via Kafka. The top-level Kafka section explains how we use Kafka Streams to deliver data.

You can find the schema [here](https://github.com/bitquery/streaming_protobuf/tree/main/evm).

EVM blockchains produce blocks at varying intervals depending on the network. Ethereum mainnet targets ~12 seconds per block, while other EVM chains may have different block times.

import VideoPlayer from "../../../../src/components/videoplayer.js";

## Structure of On-Chain Data

The EVM Protobuf Streams provide three main message types for different use cases:

- `BlockMessage`: Full blocks with detailed transaction traces
- `TokenBlockMessage`: Focused on token transfers with currency metadata
- `DexBlockMessage`: Specialized for DEX (Decentralized Exchange) trading activity

### Block-Level Data

Each block in the stream includes a `BlockHeader` with fields such as:

- `Hash`: The unique identifier of the block
- `ParentHash`: Hash of the previous block
- `Number`: Block number/height in the chain
- `GasLimit`: Maximum gas allowed in this block
- `GasUsed`: Actual gas consumed by transactions
- `Time`: Block timestamp
- `BaseFee`: Base fee per gas (EIP-1559)

The `BlockMessage` also includes:

- `Chain`: Information about the blockchain (ChainId, Config)
- `Uncles`: Uncle/ommer blocks (Ethereum PoW)
- `Transactions`: All transactions in the block
- `L1Header`: For Layer 2 chains, information about the corresponding L1 block

### Transaction-Level Data

Transactions include:

- `TransactionHeader`: Core transaction data
  - `Hash`: Transaction hash
  - `Gas`: Gas limit for this transaction
  - `Value`: Amount of native currency transferred
  - `Data`: Call data for contract interactions
  - `From`/`To`: Sender and recipient addresses
  - `GasPrice`, `GasFeeCap`, `GasTipCap`: Fee parameters
  - Special fields for EIP-4844 blob transactions
- `Signature`: Transaction signature (R, S, V values)
- `Receipt`: Execution results
  - `Status`: Success or failure
  - `GasUsed`: Actual gas consumed
  - `Logs`: Event logs emitted
- `Trace`: Detailed execution trace
  - `Calls`: Internal contract calls
  - `CaptureStates`: State modifications

### Token Data

The `TokenBlockMessage` stream provides information about token transfers:

- `TokenTransfer`: Records token movements with:

  - `Sender`: Address sending tokens
  - `Receiver`: Address receiving tokens
  - `Amount`: Amount of tokens transferred
  - `Id`: Token ID (for non-fungible tokens)
  - `Currency`: Detailed token information
  - `Success`: Whether the transfer succeeded

- `TokenInfo`: Metadata about each token:
  - `SmartContract`: Token contract address
  - `Name`: Token name
  - `Symbol`: Token symbol
  - `Decimals`: Token decimal places
  - `Fungible`: Whether token is fungible (ERC-20) or non-fungible (ERC-721/1155)

### DEX (Decentralized Exchange) Data

The `DexBlockMessage` stream specializes in DEX trading activity:

- `DexTrade`: Records of trades executed on DEXs

  - `Buy`/`Sell`: Both sides of the trade
  - `Dex`: Information about the exchange
  - `Success`: Whether the trade succeeded
  - `Fees`: Trading fees paid

- `DexInfo`: Details about the exchange:

  - `SmartContract`: Exchange contract address
  - `ProtocolName`: Name of the protocol (e.g., "Uniswap", "SushiSwap")
  - `ProtocolFamily`: Family of DEX protocols
  - `ProtocolVersion`: Version of the protocol
  - `Pair`: Trading pair information

- `TradeSide`: Details about each side of a trade:
  - `Buyer`/`Seller`: Addresses involved
  - `OrderId`: Identifier for the order
  - `Assets`: What was traded

### Layer 2 Support

EVM Protobuf Streams provide dedicated fields for Layer 2 chains:

- `L1Header`: Corresponding L1 block information
- Optimism-specific fields: `SequenceNumber`, `BatcherAddr`, `L1FeeOverhead`, etc.
- Arbitrum-specific fields: `GasL1` for L1 data costs

### Using This Stream in Python, JavaScript, and Go

Python, JavaScript, and Go code samples can be used with these streams by changing the topic to one of:

- `eth.transactions.proto` -> `ParsedAbiBlockMessage`
- `eth.tokens.proto` -> `TokenBlockMessage`
- `eth.dextrades.proto` -> `DexBlockMessage`
- `eth.raw.proto` (for raw block data) -> `BlockMessage`
- `eth.broadcasted.transactions.proto` (for broadcasted transactions) -> `ParsedAbiBlockMessage`
- `eth.broadcasted.tokens.proto` (for broadcasted token transfers) -> `TokenBlockMessage`
- `eth.broadcasted.dextrades.proto` (for broadcasted DEX trades) -> `DexBlockMessage`
- `eth.broadcasted.raw.proto` (for raw broadcasted block data) -> `BlockMessage`

The Python package [bitquery-pb2-kafka-package](https://pypi.org/project/bitquery-pb2-kafka-package/) includes all schema and is up to date so you don't have to manually install schema files.

## Video Tutorial to Track Deposits and Withdrawals for Exchange Wallets Using Kafka

<VideoPlayer url='https://youtu.be/XbE_9NAWJAs' />

## Video Tutorial to Get Latest Four Meme Trades Using Kafka

<VideoPlayer url='https://youtu.be/mR0JyfHG7AU' />
