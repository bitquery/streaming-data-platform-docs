---
title: Ethereum Transaction Balance Tracker API
description: Access comprehensive Ethereum Transaction Balance Tracker APIs for real-time balance updates, validator tracking, miner rewards, MEV analysis, and self-destruct monitoring. GraphQL API with subscriptions.
slug: /blockchain/Ethereum/balances/transaction-balance-tracker/
keywords:
  - Ethereum Transaction Balance Tracker
  - Ethereum Balance API
  - Transaction Balance API
  - Validator Balance Tracker
  - Miner Balance Tracker
  - MEV Balance Tracker
  - Self-Destruct Balance API
  - Ethereum Balance Streams
  - Balance Change Reason Codes
  - Real-time Balance Updates
  - Ethereum Token Balance API
  - Ethereum NFT Balance API
---

# Ethereum Transaction Balance Tracker API - Complete Guide

## What is Transaction Balance Tracker?

The **Ethereum Transaction Balance Tracker API** provides real-time balance updates for all addresses involved in transactions on the Ethereum blockchain. Unlike traditional balance APIs that only show current balances, our Transaction Balance Tracker captures every balance change with detailed information about the reason for each change, making it perfect for building comprehensive transaction monitoring, portfolio tracking, and blockchain analytics applications.

Our Transaction Balance Tracker APIs track balance changes across different scenarios including regular transactions, validator rewards, miner rewards, MEV activities, and contract self-destruct events. Each balance change is enriched with reason codes, pre/post balances, USD values, and transaction context.

## Key Features

- **Real-time Balance Updates**: Stream balance changes as they happen via GraphQL subscriptions
- **Balance Change Reason Codes**: Understand why each balance changed (transfers, rewards, gas, self-destruct, etc.)
- **Comprehensive Coverage**: Track native ETH, ERC-20 tokens, ERC-721, and ERC-1155 NFTs
- **Historical Data**: Access complete historical balance change data since Ethereum genesis
- **USD Values**: Get balance values in USD for portfolio tracking and analytics
- **Multiple Use Cases**: Monitor validators, miners, MEV bots, self-destruct events, and more

## Getting Started

New to Transaction Balance Tracker? Here's how to get started:

1. **[Create a free account](https://ide.bitquery.io/)** - Get instant access to our GraphQL IDE
2. **[Generate your API key](https://docs.bitquery.io/docs/authorisation/how-to-generate/)** - Required for API access
3. **[Run your first query](https://docs.bitquery.io/docs/start/first-query/)** - Learn the basics in 5 minutes
4. **[Explore examples](#ethereum-transaction-balance-tracker-apis)** - Copy-paste ready queries below

Need help crafting a query or subscription? Message us on [support](https://t.me/Bloxy_info).

## How is it different from regular Balance APIs?

- Real-time streaming of all balance changes
- Pre/post balance values for every change
- Balance change reason codes explain why balance changed
- Track all addresses in transactions automatically
- Historical data with complete change history
- Support for native currency, tokens, and NFTs

## Real-time Data & Streaming

Get live Ethereum balance updates through our streaming solutions:

- **GraphQL Subscriptions**: Convert any query to a live stream by changing `query` to `subscription`
- **Kafka Streaming**: High-throughput streaming for enterprise applications

See examples and code snippets [here](https://docs.bitquery.io/docs/subscriptions/websockets/) for GraphQL subscription implementation, and learn about [Kafka streaming](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/) for high-volume use cases.

## Ethereum Transaction Balance Tracker APIs

### [Ethereum Transaction Balance Tracker](https://docs.bitquery.io/docs/blockchain/Ethereum/balances/transaction-balance-tracker/eth-transaction-balance-tracker)

The core Transaction Balance Tracker API provides real-time balance updates for all addresses involved in transactions on the Ethereum network, including detailed information about the reason for each balance change. Track native ETH, ERC-20 tokens, and NFTs with pre/post balances, USD values, and balance change reason codes.

**Key Features:**

- Subscribe to all transaction balances in real-time
- Filter by specific addresses or tokens
- Get balance change reason codes for native currency
- Track ERC-20, ERC-721, and ERC-1155 tokens
- Access pre and post balance values

### [Ethereum Transaction Balance Tracker](https://docs.bitquery.io/docs/blockchain/Ethereum/balances/transaction-balance-tracker/eth-transfer-balance-tracker)

Transfer Balance Tracker API provides real-time balance updates for all addresses involved in transfer of Native Currency on the Ethereum network.

**Key Features:**

- Subscribe to all transfer balances in real-time
- Filter by specific addresses
- Access pre and post balance values

### [Ethereum Validator Balance Tracker](https://docs.bitquery.io/docs/blockchain/Ethereum/balances/transaction-balance-tracker/eth-validator-balance-tracker)

Track Ethereum validator balances, staking rewards, and withdrawals from the beacon chain. Monitor validator activity including block rewards, withdrawal events, and transaction fee rewards.

**Key Features:**

- Track validator staking rewards (Code 2)
- Monitor beacon chain withdrawals (Code 3)
- Track transaction fee rewards (Code 5)
- Filter by specific validator addresses
- Real-time validator balance updates

### [Ethereum Gas Balance Tracker](https://docs.bitquery.io/docs/blockchain/Ethereum/balances/transaction-balance-tracker/eth-gas-balance-tracker)

Track Ethereum balance changes for gas burn, unused gas returned for unused gas at the end of execution, and transaction tips.

**Key Features:**

- Track transaction tips (Code 5)
- Track gas burnt (Code 6)
- Track gas returned for unused gas at the end of execution (Code 7)

### [Ethereum Miner Balance Tracker](https://docs.bitquery.io/docs/blockchain/Ethereum/balances/transaction-balance-tracker/eth-miner-balance-tracker)

Monitor Ethereum miner balances, mining rewards, uncle block rewards, and transaction fee rewards. Track historical and real-time mining activity across the Ethereum network.

**Key Features:**

- Track block mining rewards (Code 2)
- Monitor uncle block rewards (Code 1)
- Track transaction fee rewards (Code 5)
- Filter by specific miner addresses
- Historical mining reward data

### [Ethereum MEV Balance Tracker](https://docs.bitquery.io/docs/blockchain/Ethereum/balances/transaction-balance-tracker/eth-mev-balance-tracker)

Track MEV (Maximal Extractable Value) related balance changes including transaction fee rewards, block builder rewards, and other MEV extraction activities. Monitor MEV bots and block builders in real-time.

**Key Features:**

- Track transaction fee rewards (Code 5)
- Monitor block builder rewards
- Filter by MEV bot or builder addresses
- Track large MEV transactions
- Aggregate MEV reward statistics

### [Ethereum Self-Destruct Balance Tracker](https://docs.bitquery.io/docs/blockchain/Ethereum/balances/transaction-balance-tracker/eth-self-destruct-balance-api)

Monitor contract self-destruct events, ephemeral contracts (like MEV bots), and security incidents. Track contracts that self-destruct and addresses that receive funds from self-destructed contracts.

**Key Features:**

- Track contract self-destruct events (Codes 12, 13, 14)
- Monitor ephemeral MEV contracts
- Track MEV builder payments
- Security incident monitoring
- Aggregate self-destruct statistics

### [Ethereum Token Balance API](https://docs.bitquery.io/docs/blockchain/Ethereum/balances/transaction-balance-tracker/token-balance-api)

Track ERC-20 fungible token balances, total supply, and market capitalization for any address on Ethereum. Monitor token holdings, portfolio values, and token balance changes in real-time.

**Key Features:**

- Get latest token balance for an address
- Retrieve all token balances for an address
- Track token balance history over time
- Get token total supply and market cap
- Filter tokens by minimum balance threshold
- Stream token balance updates in real-time
- Monitor token balance changes by transaction

### [Ethereum NFT Balance API](https://docs.bitquery.io/docs/blockchain/Ethereum/balances/transaction-balance-tracker/nft-balance-api)

Track ERC-721 and ERC-1155 non-fungible token balances, ownership, and token IDs for any address on Ethereum. Monitor NFT collections, ownership changes, and specific token ownership in real-time.

**Key Features:**

- Get latest NFT balance for an address
- Retrieve all NFT collections for an address
- Get NFT owner for specific token ID
- Track NFT ownership history
- Get NFT balances for multiple addresses
- Stream NFT balance updates in real-time
- Monitor NFT balance changes by collection

## Balance Change Reason Codes

The Transaction Balance Tracker API uses numeric codes to indicate why a balance changed. These codes are only available for native currency (ETH) transactions, not for fungible tokens or NFTs.

| **Code** | **Reason**                          | **Description**                                                            |
| -------- | ----------------------------------- | -------------------------------------------------------------------------- |
| 0        | BalanceChangeUnspecified            | Unspecified balance change reason                                          |
| 1        | BalanceIncreaseRewardMineUncle      | Reward for mining an uncle block                                           |
| 2        | BalanceIncreaseRewardMineBlock      | Reward for mining a block                                                  |
| 3        | BalanceIncreaseWithdrawal           | ETH withdrawn from the beacon chain                                        |
| 4        | BalanceIncreaseGenesisBalance       | ETH allocated at the genesis block                                         |
| 5        | BalanceIncreaseRewardTransactionFee | Transaction tip increasing block builder's balance                         |
| 6        | BalanceDecreaseGasBuy               | ETH spent to purchase gas for transaction execution                        |
| 7        | BalanceIncreaseGasReturn            | ETH returned for unused gas at the end of execution                        |
| 8        | BalanceIncreaseDaoContract          | ETH sent to the DAO refund contract                                        |
| 9        | BalanceDecreaseDaoAccount           | ETH taken from a DAO account to be moved to the refund contract            |
| 10       | BalanceChangeTransfer               | ETH transferred via a call                                                 |
| 11       | BalanceChangeTouchAccount           | Transfer of zero value to touch-create an account                          |
| 12       | BalanceIncreaseSelfdestruct         | Balance added to the recipient as indicated by a self-destructing account  |
| 13       | BalanceDecreaseSelfdestruct         | Balance deducted from a contract due to self-destruct                      |
| 14       | BalanceDecreaseSelfdestructBurn     | ETH sent to an already self-destructed account within the same transaction |
| 15       | BalanceChangeRevert                 | Balance reverted back to a previous value due to call failure              |

## Field Availability by Currency Type

The availability of fields in the `TokenBalance` object depends on the type of currency being tracked:

### Native Currency (ETH)

- **Available**: `BalanceChangeReasonCode`, `PreBalance`, `PostBalance`, `PostBalanceInUSD`
- **Not Provided**: `TotalSupply`, `TokenOwnership`

### Fungible Tokens (ERC-20)

- **Available**: `PostBalance`, `PostBalanceInUSD`, `TotalSupply`, `TotalSupplyInUSD`
- **Not Provided**: `PreBalance`, `BalanceChangeReasonCode`, `TokenOwnership`

### NFTs (ERC-721 / ERC-1155)

- **Available**: `PostBalance`, `TokenOwnership`
- **Not Provided**: `PreBalance`, `BalanceChangeReasonCode`, `TotalSupply`, `TotalSupplyInUSD`, `PostBalanceInUSD`
