---
title: Algorand Address API - Get ALGO Balances & Smart Contract Bytecode
sidebar_label: Algorand Address API
description: Query Algorand address balances for ALGO, look up multiple addresses in one request, and retrieve smart contract bytecode and source via Bitquery GraphQL.
keywords:
  - Algorand address API
  - Algorand balance API
  - ALGO wallet balance
  - Algorand smart contract bytecode
  - Algorand GraphQL
  - Bitquery Algorand
---

# Algorand Address API

The Address API gives you native ALGO balances for one or many accounts, plus smart contract details — bytecode and source — for application addresses. Use it for wallet dashboards, treasury monitoring, and inspecting on-chain program code without running your own indexer.

:::info Endpoint
Algorand GraphQL queries are served at `https://graphql.bitquery.io`.
:::

## Get ALGO balance for a single address

Returns the native ALGO balance for one account. Replace the address with your target wallet or contract.

```graphql
{
  algorand(network: algorand) {
    address(
      address: {is: "ADDRESS_HERE"}
    ) {
      address {
        address
      }
      balance
    }
  }
}
```

Add a `date` filter to reconstruct balance context at a point in time, or use the `in` operator shown below for batch lookups.

## Get ALGO balances for multiple addresses

Pull balances for several addresses in a single request. Handy for portfolio views and treasury snapshots.

```graphql
{
  algorand(network: algorand) {
    address(address: {in: ["ADDRESS_ONE", "ADDRESS_TWO", "ADDRESS_THREE"]}) {
      address {
        address
      }
      balance
    }
  }
}
```

## Get smart contract bytecode and source

Returns the bytecode and source of an Algorand application address. Add the `balance` field to the `smartContract` block if you also need the contract's ALGO holdings.

```graphql
{
  algorand(network: algorand) {
    address(address: {is: "SMART_CONTRACT_ADDRESS"}) {
      smartContract {
        address {
          address
        }
        bytecode
        source
      }
    }
  }
}
```

## Related resources

- [Algorand Transfers API](https://docs.bitquery.io/docs/blockchain/Algorand/algorand-transfers-api) — ALGO and ASA transfer history per address
- [Algorand Coinpath API](https://docs.bitquery.io/docs/blockchain/Algorand/algorand-coinpath-api) — multi-hop fund flow tracing
