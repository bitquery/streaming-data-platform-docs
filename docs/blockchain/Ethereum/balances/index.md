---
title: Balances API Documentation
description: Collection of Balance APIs on Ethereum organized by functionality.
slug: /blockchain/Ethereum/balances/
keywords:
  - Balance API
  - Ethereum Balance API
  - Balances API
  - Holders API
  - Token Holder API
  - Transaction Balance Tracker
  - Ethereum Balance Data
---

# Balances API Documentation

This section covers how to fetch balance-related data on Ethereum via **Bitquery GraphQL APIs** and **Streams**.

To get started, [signup](https://account.bitquery.io/user/account) with Bitquery and get your [Access Token](https://account.bitquery.io/user/api_v2/access_tokens) by following [these](https://docs.bitquery.io/docs/authorisation/how-to-generate/) steps.

If you need help getting balance data, reach out to [support](https://t.me/Bloxy_info).

## Modes Supported

- GraphQL API
- GraphQL Stream
- Kafka Stream

## Primary APIs

| API | Documentation | Description |
|-----|---------------|-------------|
| **Balances** | [Address Balance API](/docs/blockchain/Ethereum/balances/balance-api/) | Current and historical token balances for wallet addresses (`EVM.Balances`). |
| **Holders** | [Token Holders API](/docs/blockchain/Ethereum/token-holders/token-holder-api) | Top holders, holder counts, and holder activity (`EVM.Holders`). |
| **TransactionBalances** | [Transaction Balance Tracker](/docs/blockchain/Ethereum/balances/transaction-balance-tracker/) | Per-transaction balance updates with supply, market cap, reason codes, and streams (`EVM.TransactionBalances`). |

## What is the Balance API?

On Ethereum, use the **Balances** cube for address-level balances and the **Holders** cube for token holder lists and counts. Both support `dataset: combined` (realtime + archive) and `dataset: archive` (historical and inactive addresses).

See the [Address Balance API](/docs/blockchain/Ethereum/balances/balance-api/), [Token Holders API](/docs/blockchain/Ethereum/token-holders/token-holder-api), and [Transaction Balance Tracker](/docs/blockchain/Ethereum/balances/transaction-balance-tracker/) for queries and IDE examples.

The [Transaction Balance Tracker](/docs/blockchain/Ethereum/balances/transaction-balance-tracker/) section also covers validator, miner, MEV, gas, NFT, and self-destruct balance tracking.

## When to Use Which API or Stream?

| Use Case | API/Stream | Description |
|----------|------------|-------------|
| **Latest wallet balances** | [Balances API](/docs/blockchain/Ethereum/balances/balance-api/#balance-of-an-address) | Token balances for an address (`dataset: combined`; use `Amount(selectWhere: { gt: "0" })` for non-zero). |
| **Balance on a date** | [Balances API](/docs/blockchain/Ethereum/balances/balance-api/#balance-on-a-specific-date) | Point-in-time snapshot with `Block.Date.till` (`dataset: archive`). |
| **Wallet balance for one token on a date** | [Balances API](/docs/blockchain/Ethereum/balances/balance-api/#wallet-balance-for-a-specific-token-on-a-date) | `Block.Date`, `limit: 1`, `orderBy: Block_Date`. |
| **Balance history over time** | [Balances API](/docs/blockchain/Ethereum/balances/balance-api/#balance-history-by-date) | Snapshots ordered by `Block_Date`. |
| **Top token holders** | [Holders API](/docs/blockchain/Ethereum/token-holders/token-holder-api#top-holders-of-a-currency-current) | `orderBy: Balance_Amount`, `limit`. |
| **Token holder count** | [Holders API](/docs/blockchain/Ethereum/token-holders/token-holder-api#token-holder-count-for-an-erc-20-token) | `uniq(of: Holder_Address)` with `dataset: combined`. |
| **Holders above a threshold** | [Holders API](/docs/blockchain/Ethereum/token-holders/token-holder-api#holder-count-with-balance-above-a-threshold) | `uniq` with `if: { Balance: { Amount: { gt: "..." } } } }`. |
| **Token balance with supply and market cap** | [Transaction Balance Tracker](/docs/blockchain/Ethereum/balances/transaction-balance-tracker/) | `EVM.TransactionBalances` — post balance, supply, USD value per transaction. |
| **Real-time balance change streams** | [Transaction Balance Tracker](/docs/blockchain/Ethereum/balances/transaction-balance-tracker/) | Subscribe to balance updates with reason codes. |
| **Validator / miner / MEV balance tracking** | [Transaction Balance Tracker](/docs/blockchain/Ethereum/balances/transaction-balance-tracker/) | Specialized trackers for rewards and MEV. |
