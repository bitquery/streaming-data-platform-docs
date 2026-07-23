---
sidebar_position: 4
title: "Optimism Address Balance API"
description: "Optimism Address Balance API: fetch current and historical Optimism balances with Bitquery GraphQL balance queries. Great for bots, dashboards, and alerts."
---
# Optimism Address Balance API

:::caution Deprecated APIs
On EVM, **`BalanceUpdates`** and **`TokenHolders`** were deprecated as of **20 May 2026** and removed on **15 June 2026**. Use **`EVM.Balances`** (this page) and **[Token Holders API](/docs/blockchain/Ethereum/token-holders/token-holder-api)** (`EVM.Holders`) instead.
:::

The **Balances** API returns current and historical token balances for an address on Optimism. To return only non-zero balances, add `Amount(selectWhere: { gt: "0" })` on the `Balance` field (not in `where`). Use `dataset: combined` or `dataset: archive` as follows:

| Dataset        | When to use                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------- |
| **`combined`** | Latest balances. Queries **realtime and archive** databases and merges results.             |
| **`archive`**  | Historical snapshots with `Block.Date`, and balances for **addresses not recently active**. |

Examples: [All Token Balances](#balance-of-an-address) · [Native ETH (Optimism)](#native-eth-optimism-balance) · [Balance on a Date](#balance-on-a-specific-date) · [Specific Token](#balance-for-a-specific-token) · [Holder Snapshot](#token-holder-snapshot)

## Balance of an Address

Returns token balances for a wallet address. Use `Amount(selectWhere: { gt: "0" })` to exclude zero balances.

[Run in IDE](https://ide.bitquery.io/Optimism-Balance-of-an-Address)

```graphql
query {
  EVM(network: optimism, dataset: combined) {
    Balances(
      where: {
        Balance: {
          Address: { is: "0xacD03D601e5bB1B275Bb94076fF46ED9D753435A" }
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

## Native ETH (Optimism) Balance

Returns the native ETH balance for a wallet on Optimism (not ERC-20 tokens). Filter with `Currency: { Native: true }` instead of a token contract address.

[Run in IDE](https://ide.bitquery.io/optimism-native-balances-address)

```graphql
query {
  EVM(network: optimism, dataset: combined) {
    Balances(
      where: {
        Balance: {
          Address: { is: "0xacD03D601e5bB1B275Bb94076fF46ED9D753435A" }
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

- `network: optimism`: Optimism mainnet.
- `dataset: combined`: Merges realtime and archive data for the latest balance state.
- `Balance.Address`: Wallet address to query.
- `Currency.Native: true`: Native ETH on Optimism only (see [Native ETH (Optimism) Balance](#native-eth-optimism-balance)).

**Returned fields**

- `Currency.Symbol`, `Currency.SmartContract`: Token metadata.
- `Balance.Amount`, `Balance.AmountInUSD`: Token balance and USD value (use `selectWhere` to filter non-zero amounts).

## Balance on a Specific Date

Use `Block.Date.till` for a point-in-time snapshot. Use `dataset: archive` for historical dates and addresses not recently active.

[Run in IDE](https://ide.bitquery.io/optimism-balances-by-date)

```graphql
query {
  EVM(network: optimism, dataset: archive) {
    Balances(
      where: {
        Block: { Date: { till: "2026-05-01" } }
        Balance: {
          Address: { is: "0xacD03D601e5bB1B275Bb94076fF46ED9D753435A" }
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

Add a `Currency.SmartContract` filter. Always use the contract address, not the token name. Use `0x` for native ETH on Optimism, or the ERC-20 contract address for a token.

[Run in IDE](https://ide.bitquery.io/optimism-balances-specific-token)

```graphql
query {
  EVM(network: optimism, dataset: combined) {
    Balances(
      where: {
        Balance: {
          Address: { is: "0xacD03D601e5bB1B275Bb94076fF46ED9D753435A" }
        }
        Currency: { SmartContract: { is: "0x23ee2343b892b1bb63503a4fabc840e0e2c6810f" } }
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

[Run in IDE](https://ide.bitquery.io/token-holder-snapshot-optimism)

<details>
  <summary>Click to expand GraphQL query</summary>
```graphql
query {
  EVM(network: optimism, dataset: archive) {
    Holders(
      where: {
        Currency: { SmartContract: { is: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58" } }
        Balance: {
          Amount: { gt: "0" }
          LastChangeTime: { till: "2026-05-20T00:00:00Z" }
        }
        Holder: { Address: { not: "0x" } }
      }
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
</details>

## Balance History by Date

Returns balance snapshots over time for an address. Use `dataset: archive`. Order by `Block_Date` descending and use `limit` to paginate. Add `Currency.SmartContract` under `Currency` to filter by a specific token.

[Run in IDE](https://ide.bitquery.io/optimism-balances-history-address)

```graphql
query {
  EVM(network: optimism, dataset: archive) {
    Balances(
      where: {
        Balance: {
          Address: { is: "0xacD03D601e5bB1B275Bb94076fF46ED9D753435A" }
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
