---
title: "Solana Shred Streams"
description: "This section provides details about Bitquery's Solana Shred Streams via Kafka. The top-level Kafka section explains how we use Kafka Streams to deliver data."
---
# Solana Shred Streams

This section provides details about Bitquery's Solana Shred Streams via Kafka. The top-level Kafka section explains how we use Kafka Streams to deliver data.

You can find the schema [here](https://github.com/bitquery/streaming_protobuf/tree/main/solana).

Remember that Solana blocks are produced with a target block time of 400ms, in practice resulting in high throughput of approximately 4,000 transactions per second while achieving a theoretical maximum of 65,000 transactions per second (TPS).

import VideoPlayer from "../../../../src/components/videoplayer.js";

## Structure of On-Chain Data

The Solana Protobuf Streams provide three main message types for different use cases:

- `BlockMessage`: Basic blocks, transactions, and rewards
- `TokenBlockMessage`: Focused on token transfers and currency metadata
- `DexParsedBlockMessage`: Specialized for DEX (Decentralized Exchange) activity

### Block-Level Data

Each block in the stream includes a `BlockHeader` with fields such as:

- `Slot`: The slot number for this block
- `Hash`: The unique identifier of the block
- `ParentSlot`: The previous slot in the chain
- `Height`: The block height
- `Timestamp`: The Unix timestamp when this block was produced
- `ParentHash`: The hash of the parent block

### Transaction-Level Data

Transactions across all stream types share common elements:

- `Signature`: The transaction's unique signature
- `Status`: The execution status (Success/Error)
- `Header`: Transaction metadata including fees and signers
- `FeeInUsd`: Equivalent transaction fee in US dollars
- `Index`: Position within the block

Transactions contain various types of instructions, which are the core of Solana's execution model:

- `ProgramAccountIndex`: The program being called
- `Data`: Encoded instruction data
- `AccountIndexes`: Accounts referenced by this instruction
- `BalanceUpdates`: SOL balance changes from this instruction

### Token Data

The `TokenBlockMessage` stream provides detailed information about token transfers and balances:

- `Transfer`: Records token movements with:

  - `Amount`: Number of tokens transferred
  - `Sender`: Source account
  - `Receiver`: Destination account
  - `Authority`: Account authorizing the transfer
  - `Currency`: Detailed token information

- `Currency`: Rich metadata for each token, including:
  - `Name`, `Symbol`, `Decimals`
  - `MintAddress`: Token's mint account
  - `MetadataAddress`: Metadata program account
  - `TokenCreators`: Original creators of the token
  - NFT properties like `SellerFeeBasisPoints` and `TokenStandard`

The `solana.tokens.proto` topic uses this message type to share details of:

#### Account Addresses

- These are listed under the "Accounts" section of the transaction header.

#### Balance Updates

- These are listed under "BalanceUpdates", with each update linked to an account using the `AccountIndex`.
- Each balance update has:

  - **PreBalance:** The balance of the account before the transaction.
  - **PostBalance:** The balance of the account after the transaction.
  - **Currency Details:** Information about the currency type (e.g., Solana (SOL), Wrapped Solana (WSOL)).

#### Balance Updates After Each Instruction

- These updates are shown under the "BalanceUpdates" section within each instruction of the transaction.
- These updates reflect the immediate effect of an instruction on the balance of the involved wallets.
- For example, if an instruction transfers a certain amount from one wallet to another, the balance update directly after this instruction will reflect the new balances for both wallets.

#### Balance Updates After the Entire Transaction

- These updates are shown under the "BalanceUpdates" section at the transaction level.
- They show the final state of the balances after all instructions in that transaction have been executed.
- This is essentially the final balance state of all wallets involved in that transaction.

### DEX (Decentralized Exchange) Data

The `DexParsedBlockMessage` stream is specialized for decentralized exchange activity. Each transaction in this stream contains `Trades`, `OrderEvents`, and `PoolEvents` arrays, along with transaction-level balance summaries.

#### DexInfo

Details about the exchange program:

- `ProgramAddress`: Address of the DEX program
- `ProtocolName`: Name of the DEX (e.g., "cp_amm", "pump_amm")
- `ProtocolFamily`: Family of DEX protocols (e.g., "Meteora", "Pumpswap", "Raydium")

#### DexTradeEvent

Records of trades executed on DEXs, including full instruction-level data:

- `InstructionIndex`: Position of the instruction within the transaction
- `Dex`: The `DexInfo` for this trade
- `Market`: The trading pair information
  - `MarketAddress`: Pool/market address
  - `BaseCurrency` / `QuoteCurrency`: Detailed currency metadata for both sides of the pair (Name, Symbol, Decimals, MintAddress, MetadataAddress, TokenStandard, Uri, etc.)
- `Buy` / `Sell`: Both sides of the trade, each containing:
  - `Amount`: Raw token amount (in the token's smallest unit)
  - `AmountInUsd`: USD value of the trade side
  - `Currency`: Detailed token metadata (Name, Symbol, Decimals, MintAddress, MetadataAddress, TokenStandard, etc.)
  - `Account`: The token account involved (Address, IsSigner, IsWritable) with an optional `Token` sub-object containing `Mint`, `Owner`, `Decimals`, `ProgramId`, and `Supply`
  - `Order`: Linked DEX order information when the trade fills a specific limit order (see `DexOrder` below)
- `Fee`: DEX trading fee in the quote currency's smallest unit
- `Royalty`: Creator royalties paid (in the quote currency's smallest unit)
- `Instruction`: Full `ParsedIdlInstruction` containing:
  - `Program`: Parsed IDL program info (Address, Name, Method, Signature, Arguments with Name/Type/Json, and the full IDL JSON)
  - `AccountNames`: Ordered list of account names from the IDL
  - `Accounts`: Account details with token sub-objects (Mint, Owner, Decimals, ProgramId, Supply)
  - `Logs`: Program logs emitted during execution
  - `BalanceUpdates`: Native SOL balance changes caused by this instruction (with `AccountIndex`, `PreBalance`, `PostBalance`)
  - `TokenBalanceUpdates`: SPL token balance changes caused by this instruction (with `AccountIndex`, `PreBalance`, `PostBalance`)
  - `AncestorIndexes`, `CallerIndex`, `ExternalSeqNumber`, `InternalSeqNumber`, `Depth`: Instruction hierarchy and sequencing metadata
  - `Data`: Raw encoded instruction data

#### DexOrderEvent

Records of DEX order lifecycle events (open, update, cancel). Each event contains:

- `InstructionIndex`: Position of the instruction within the transaction
- `Type`: Order event type — `OPEN`, `UPDATE`, or `CANCEL`
- `Dex`: The `DexInfo` for this order
- `Market`: The trading pair information
- `Order`: The `DexOrder` details:
  - `OrderId`: Unique identifier for the order
  - `BuySide`: Whether this is a buy (true) or sell (false) order
  - `LimitPrice`: Limit price set for the order
  - `LimitAmount`: Amount of tokens in the order
  - `LimitPriceInUsd` / `LimitAmountInUsd`: USD equivalents
  - `Account`: Token account for the order
  - `Owner`: Wallet that owns the order
  - `Payer`: Fee payer for the order transaction
  - `Mint`: Token mint address
- `Instruction`: Full `ParsedIdlInstruction` (same structure as in `DexTradeEvent`)

#### PoolLiquidityChangeEvent

Records changes to liquidity pools (adds, removes, swaps that change pool reserves):

- `InstructionIndex`: Position of the instruction within the transaction
- `Dex`: The `DexInfo` for this pool
- `Market`: The trading pair information
- `BaseCurrency` / `QuoteCurrency`: Each side contains:
  - `ChangeAmount`: Amount added (positive) or removed (negative)
  - `PostAmount`: Pool balance after the change
  - `ChangeAmountInUsd` / `PostAmountInUsd`: USD equivalents
- `Instruction`: Full `ParsedIdlInstruction` (same structure as in `DexTradeEvent`)

#### Transaction-Level Balance Summaries

In addition to per-event balance updates, each `ParsedDexTransaction` includes aggregate balance summaries:

- `TotalBalanceUpdates`: Aggregate native SOL (lamports) balance changes across all instructions in the transaction
- `TotalTokenBalanceUpdates`: Aggregate SPL/Token-2022 token balance changes across all instructions in the transaction
- `FeeInUsd`: USD value of the total transaction fee

### Using This Stream in Python, JavaScript, and Go

Python, JavaScript, and Go code samples can be used with these streams by changing the topic to one of:

The below is the topic -> message mapping :

- `solana.transactions.proto` -> `ParsedIdlBlockMessage`
- `solana.tokens.proto` -> `TokenBlockMessage`
- `solana.dextrades.proto` -> `DexParsedBlockMessage`

The Python package [bitquery-pb2-kafka-package](https://pypi.org/project/bitquery-pb2-kafka-package/) includes all schema and is up to date so you don't have to manually install schema files.

## Video Tutorial to Get Low Latency Solana Data via Kafka

<VideoPlayer url='https://youtu.be/8Qo3NNC1zec' />

## Video Tutorial to Get Real-time PumpSwap Trades via Bitquery Kafka Streams

<VideoPlayer url='https://youtu.be/UlqZ8DgzNLc' />
