---
title: Algorand Arguments API - Parsed Smart Contract Call & Event Arguments
sidebar_label: Algorand Arguments API
description: Query parsed argument names, types, and values from Algorand smart contract calls and events. Filter by contract address, transaction type, or argument value via Bitquery GraphQL.
keywords:
  - Algorand arguments API
  - Algorand smart contract arguments
  - Algorand app call arguments
  - Algorand GraphQL
  - Algorand event arguments
  - Bitquery Algorand
---

# Algorand Arguments API

When Bitquery parses an Algorand smart contract call or event, the Arguments API exposes each argument's index, type, and value alongside transaction and block context. Use it to inspect app call payloads, filter calls by specific argument values, or build dashboards around on-chain program activity.

:::info Endpoint
Algorand GraphQL queries are served at `https://graphql.bitquery.io`.
:::

## List recent smart contract arguments

Returns the 10 most recent parsed arguments across Algorand, with transaction hash, sender, transaction type, and block timestamp. Each row includes the argument index and decoded value.

```graphql
{
  algorand(network: algorand) {
    arguments(options: {limit: 10, desc: "block.timestamp.iso8601"}) {
      argindex
      block {
        timestamp {
          iso8601
        }
      }
      firstRound
      genesisId
      lastRound
      note
      transaction {
        hash
      }
      txSender {
        address
        annotation
      }
      txType
      value
    }
  }
}
```

## Filter arguments by smart contract address

Narrow results to a specific application. You can also filter by `txType`, `txHash`, `argindex`, or `value` depending on what you're looking for.

```graphql
{
  algorand(network: algorand) {
    arguments(
      smartContractAddress: {is: "2TUBOBZ7CP7EZXFOWULEG5HE6WJ34TT7SBZ5AMHGR222O7RZNBK3I4BUMY"}
      options: {limit: 10, desc: "block.timestamp.iso8601"}
    ) {
      argindex
      value
      txType
      transaction {
        hash
      }
      txSender {
        address
      }
      smartContract {
        address {
          address
        }
      }
    }
  }
}
```

## Related resources

- [Algorand Smart Contract Calls API](https://docs.bitquery.io/docs/blockchain/Algorand/algorand-smart-contract-calls-api) — call counts and transaction-type filters
- [Algorand Transactions API](https://docs.bitquery.io/docs/blockchain/Algorand/algorand-transactions-api) — full transaction details and hash lookups
