---
title: Balances API Documentation
description: Collection of Balance APIs on Ethereum organized by functionality.
slug: /blockchain/Ethereum/balances/
keywords:
  - Balance API
  - Ethereum Balance API
  - Token Holder API
  - Transaction Balance Tracker
  - Validator Balance Tracker
  - Miner Balance Tracker
  - MEV Balance Tracker
  - Balance Updates API
  - Ethereum Balance Data
---

This section covers how to fetch balance-related data via **Bitquery APIs** and **Streams**.

To get started, [signup](https://account.bitquery.io/user/account) with Bitquery and get your [Access Token](https://account.bitquery.io/user/api_v2/access_tokens) by following [these](https://docs.bitquery.io/docs/authorisation/how-to-generate/) steps. 

If you need help getting balance data, reach out to [support](https://t.me/Bloxy_info)


## Modes Supported
- GraphQL API
- GraphQL Stream
- Kafka Stream

## What is Balance API?

Bitquery Balance APIs help you fetch on-chain balance data for Ethereum that includes:
- **Address Balances** - Current and historical balances for addresses
- **Token Holder Data** - Information about token holders and their holdings
- **Transaction Balance Tracking** - Track balance changes in transactions
- **Validator Balance Tracking** - Monitor validator balances
- **Miner Balance Tracking** - Track miner rewards and balances
- **MEV Balance Tracking** - Monitor MEV-related balance changes

## When to Use Which API or Stream?

| Use Case | API/Stream | Description |
|----------|------------|-------------|
| **Latest wallet balance** | BalanceUpdates cube with `sum` | When you need the latest wallet balance, use the BalanceUpdates cube with the `sum` function. See the [Address Balance History API](https://docs.bitquery.io/docs/blockchain/Ethereum/balances/balance-api/) for details. |
| **Token balance monitoring** | TransactionBalance API | When you need to monitor the latest token balance for a wallet along with supply and market cap data, use the TransactionBalance API. |
| **Top token holders** | Token Holder API or sum of Balance Updates | When you need to find the top holders of a token, use the Token Holder API or sum of Balance Updates. |
| **Use case specific transaction balance monitoring** | Transaction Balance Tracker APIs | When you need use case-specific transaction balance monitoring (e.g., validator, miner, or MEV tracking), use the Transaction Balance Tracker APIs. |