---
sidebar_position: 1
title: "Polygon (MATIC) Address Balance API"
description: "Polygon (MATIC) Address Balance API: fetch current and historical Polygon balances with Bitquery GraphQL balance queries."
---
# Polygon (MATIC) Address Balance API

:::caution Deprecated APIs
On EVM, **`BalanceUpdates`** and **`TokenHolders`** were deprecated as of **20 May 2026** and removed on **15 June 2026**. Use **`EVM.Balances`** (this page) and **[Token Holders API](/docs/blockchain/Ethereum/token-holders/token-holder-api)** (`EVM.Holders`) instead.
:::

The **Balances** API returns current and historical token balances for an address on Polygon (MATIC). To return only non-zero balances, add `Amount(selectWhere: { gt: "0" })` on the `Balance` field (not in `where`). Use `dataset: combined` or `dataset: archive` as follows:

| Dataset        | When to use                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------- |
| **`combined`** | Latest balances. Queries **realtime and archive** databases and merges results.             |
| **`archive`**  | Historical snapshots with `Block.Date`, and balances for **addresses not recently active**. |

Examples: [All Token Balances](#balance-of-an-address) · [Native MATIC](#native-matic-balance) · [Balance on a Date](#balance-on-a-specific-date) · [Specific Token](#balance-for-a-specific-token)

## Balance of an Address

Returns token balances for a wallet address. Use `Amount(selectWhere: { gt: "0" })` to exclude zero balances.

[Run in IDE](https://ide.bitquery.io/matic-balances-address)

```graphql
query {
  EVM(network: matic, dataset: combined) {
    Balances(
      where: {
        Balance: {
          Address: { is: "0x4c569c1e541A19132AC893748E0ad54C7c989FF4" }
        }
      }
    ) {
      Currency {
        Symbol
        SmartContract
      }
      Balance {
        Amount(selectWhere: { gt: "0" })
        AmountInUSD
        Address
      }
    }
  }
}
```

## Native MATIC Balance

Returns the native MATIC balance for a wallet (not ERC-20 tokens). Filter with `Currency: { Native: true }` instead of a token contract address.

[Run in IDE](https://ide.bitquery.io/matic-native-balances-address)

```graphql
query {
  EVM(network: matic, dataset: combined) {
    Balances(
      where: {
        Balance: {
          Address: { is: "0x4c569c1e541A19132AC893748E0ad54C7c989FF4" }
        }
        Currency: { Native: true }
      }
    ) {
      Currency {
        Symbol
        SmartContract
      }
      Balance {
        Amount(selectWhere: { gt: "0" })
        AmountInUSD
        Address
      }
    }
  }
}
```

**Parameters**

- `network: matic`: Polygon mainnet.
- `dataset: combined`: Merges realtime and archive data for the latest balance state.
- `Balance.Address`: Wallet address to query.
- `Currency.Native: true`: Native MATIC only (see [Native MATIC Balance](#native-matic-balance)).

**Returned fields**

- `Currency.Symbol`, `Currency.SmartContract`: Token metadata.
- `Balance.Amount`, `Balance.AmountInUSD`: Token balance and USD value (use `selectWhere` to filter non-zero amounts).

## Balance on a Specific Date

Use `Block.Date.till` for a point-in-time snapshot. Use `dataset: archive` for historical dates and addresses not recently active.

[Run in IDE](https://ide.bitquery.io/matic-balances-by-date)

```graphql
query {
  EVM(network: matic, dataset: archive) {
    Balances(
      where: {
        Block: { Date: { till: "2026-05-01" } }
        Balance: {
          Address: { is: "0x4c569c1e541A19132AC893748E0ad54C7c989FF4" }
        }
      }
    ) {
      Currency {
        Symbol
        SmartContract
      }
      Balance {
        Amount(selectWhere: { gt: "0" })
        AmountInUSD
        Address
      }
    }
  }
}
```

## Balance for a Specific Token

Add a `Currency.SmartContract` filter. Always use the contract address, not the token name. Use `0x` for native MATIC on Polygon, or the ERC-20 contract address for a token.

[Run in IDE](https://ide.bitquery.io/matic-balances-specific-token)

```graphql
query {
  EVM(network: matic, dataset: combined) {
    Balances(
      where: {
        Balance: {
          Address: { is: "0x4c569c1e541A19132AC893748E0ad54C7c989FF4" }
        }
        Currency: { SmartContract: { is: "0x" } }
      }
    ) {
      Currency {
        Symbol
        SmartContract
      }
      Balance {
        Amount(selectWhere: { gt: "0" })
        AmountInUSD
        Address
      }
    }
  }
}
```

## Token Holder Snapshot

The number of unique holders, token supply, and Gini coefficient for the balance amount before a specific timestamp
can be derived using the query below. These stats provide a useful holder snapshot for any given time.

[Run in IDE](https://ide.bitquery.io/token-holder-snapshot-matic)

<details>
  <summary>Click to expand GraphQL query</summary>
```graphql
query MyQuery($network: evm_network!, $address: String!) {
  EVM(network: $network, dataset: archive) {
    Holders(
      where: {
        Currency: {SmartContract: {is: $address}}, 
        Balance: {
          Amount: {gt: "0"}, 
          LastChangeTime: {till: "2026-05-20T00:00:00Z"}
        },
        Holder: {Address: {not: "0x"}}}
    ) {
      Balance {
        LastChangeTime(maximum: Balance_LastChangeTime)
      }
      holders: uniq(of: Holder_Address)
      supply: sum(of: Balance_Amount)
      gini(of: Balance_Amount)
    }
  }
}
```

```json
{
  "network": "matic",
  "address": "0x99a57e6c8558bc6689f894e068733adf83c19725"
}
```
</details>

## Balance History by Date

Returns balance snapshots over time for an address. Use `dataset: archive`. Order by `Block_Date` descending and use `limit` to paginate. Add `Currency.SmartContract` under `Currency` to filter by a specific token.

[Run in IDE](https://ide.bitquery.io/matic-balances-history)

```graphql
query {
  EVM(network: matic, dataset: archive) {
    Balances(
      where: {
        Balance: {
          Address: { is: "0x4c569c1e541A19132AC893748E0ad54C7c989FF4" }
        }
        Currency: {}
      }
      orderBy: { descending: Block_Date }
      limit: { count: 100 }
    ) {
      Currency {
        Symbol
        SmartContract
      }
      Balance {
        Amount(selectWhere: { gt: "0" })
        AmountInUSD
      }
      Block {
        Date
      }
    }
  }
}
```

## Wallet Balance for a Specific Token on a Date

Get a wallet's balance for a specific token with `Balance.Address` and `Currency.SmartContract`. This example uses native MATIC (`SmartContract: "0x"`) with `dataset: combined`. For a balance on a calendar date, use [Balance on a Specific Date](#balance-on-a-specific-date) with `dataset: archive` and `Block.Date.till`.

[Run in IDE](https://ide.bitquery.io/matic-wallet-balance-token-at-date)

```graphql
query {
  EVM(network: matic, dataset: combined) {
    Balances(
      where: {
        Balance: {
          Address: { is: "0x4c569c1e541A19132AC893748E0ad54C7c989FF4" }
        }
        Currency: { SmartContract: { is: "0x" } }
      }
    ) {
      Currency {
        Symbol
        SmartContract
      }
      Balance {
        Amount(selectWhere: { gt: "0" })
        AmountInUSD
        Address
      }
    }
  }
}
```
