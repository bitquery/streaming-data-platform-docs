# TRON Protobuf Streams

You can find the schema [here](https://github.com/bitquery/streaming_protobuf/tree/main/tron).

TRON produces blocks approximately every 3 seconds, offering high throughput for transactions and smart contracts.

## Structure of On-Chain Data

The TRON Protobuf Streams provide three main message types for different use cases:

- `BlockMessage`: Full blocks with detailed transaction information
- `TokenBlockMessage`: Focused on token transfers
- `DexBlockMessage`: Specialized for DEX (Decentralized Exchange) trading activity

### Block-Level Data

Each block in the stream includes a `BlockHeader` with fields such as:

- `Number`: Block height in the chain
- `Hash`: The unique identifier of the block
- `Timestamp`: When the block was produced
- `ParentHash`: Hash of the previous block
- `TxTrieRoot`: Merkle root of transactions
- `AccountStateRoot`: State root hash
- `TransactionsCount`: Number of transactions in this block

The `BlockMessage` also includes:

- `Chain`: Information about the blockchain
- `Witness`: Details about the block producer (Super Representative)
  - `Address`: The witness account address
  - `Id`: Witness identifier
  - `Signature`: Block signature

### Transaction-Level Data

Transactions include:

- `TransactionHeader`: Core transaction data

  - `Hash`: Transaction hash
  - `Fee`: Transaction fee
  - `Index`: Position in the block
  - `Expiration`: When the transaction expires
  - `FeeLimit`: Maximum fee allowed
  - `Signatures`: Transaction signatures
  - `FeePayer`: Account that pays the fee

- `Result`: Execution outcome

  - `Status`: Transaction status
  - `Success`: Whether transaction succeeded
  - `Message`: Error message if failed

- `Receipt`: Resource consumption details
  - `EnergyUsageTotal`: Total energy consumed
  - `EnergyFee`: Fee paid for energy
  - `NetUsage`: Bandwidth used
  - `NetFee`: Fee paid for bandwidth

### Contract Data

The `Contract` section contains detailed information about smart contract interactions:

- `Address`: Contract address
- `Type`: Contract type (e.g., "TransferContract", "TriggerSmartContract")
- `TypeUrl`: Protocol buffer type URL
- `Arguments`: Contract-specific arguments
- `InternalTransactions`: Sub-transactions created during execution

  - `CallerAddress`: Initiator address
  - `TransferToAddress`: Recipient address
  - `CallValues`: Assets transferred
  - `Note`: Additional information

- `Logs`: Event logs emitted by the contract
- `Trace`: Detailed execution trace (similar to EVM)
- `RewardWithdraw`: Information about reward distribution

### Token Data

The `TokenBlockMessage` stream provides information about token transfers:

- `TokenTransfer`: Records token movements with:
  - `Sender`: Address sending tokens
  - `Receiver`: Address receiving tokens
  - `Amount`: Amount of tokens transferred
  - `Currency`: Detailed token information
  - `Success`: Whether the transfer succeeded

TRON supports multiple token standards:

- TRC10: Native TRON tokens identified by TokenId
- TRC20: Similar to ERC20 on Ethereum
- TRC721/TRC1155: Non-fungible tokens

### DEX (Decentralized Exchange) Data

The `DexBlockMessage` stream is specialized for DEX trading activity:

- `DexTrade`: Records of trades executed on DEXs
  - `Buy`/`Sell`: Both sides of the trade
  - `Dex`: Information about the exchange
  - `Success`: Whether the trade succeeded
  - `Fees`: Trading fees paid

### TRON-Specific Features

TRON has several unique features compared to other blockchain protocols:

- **Energy and Bandwidth Model**: Instead of a simple gas model, TRON uses Energy for smart contract execution and Bandwidth (Net) for transaction size
- **Witness System**: Block producers are called Witnesses or Super Representatives
- **Contract Types**: TRON has predefined contract types for common operations
- **TRC10 Tokens**: Native token support without smart contracts, referenced by TokenId
- **Resource Delegation**: Users can delegate resources to each other

### Using This Stream in Python, JavaScript, and Go

Python, JavaScript, and Go code samples can be used with these streams by changing the topic to one of:

- `tron.raw.proto` (for raw block data)
- `tron.transactions.proto`
- `tron.tokens.proto`
- `tron.dextrades.proto`
- `tron.broadcasted.raw.proto` (for raw broadcasted block data)
- `tron.broadcasted.transactions.proto` (for broadcasted transactions)
- `tron.broadcasted.tokens.proto` (for broadcasted token transfers)
- `tron.broadcasted.dextrades.proto` (for broadcasted DEX trades)

The Python package [bitquery-pb2-kafka-package](https://pypi.org/project/bitquery-pb2-kafka-package/) includes all schema and is up to date so you don't have to manually install schema files.
