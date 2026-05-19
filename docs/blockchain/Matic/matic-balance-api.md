---
sidebar_position: 1
---

# Polygon (MATIC) Address Balance API

:::caution Deprecated APIs
On EVM, **`BalanceUpdates`** and **`TokenHolders`** are deprecated as of **20 May 2026** and will be removed on **15 June 2026**. Use **`EVM.Balances`** (this page) and **[Token Holders API](/docs/blockchain/Ethereum/token-holders/token-holder-api)** (`EVM.Holders`) instead.
:::

The **Balances** API returns current and historical token balances for an address on Polygon (MATIC). To return only non-zero balances, add `Amount(selectWhere: { gt: "0" })` on the `Balance` field (not in `where`). Use `dataset: combined` or `dataset: archive` as follows:

| Dataset | When to use |
|---------|-------------|
| **`combined`** | Latest balances. Queries **realtime and archive** databases and merges results. |
| **`archive`** | Historical snapshots with `Block.Date`, and balances for **addresses not recently active**. |

Examples: [All Token Balances](#balance-of-an-address) · [Native MATIC](#native-matic-balance) · [Balance On A Date](#balance-on-a-specific-date) · [Specific Token](#balance-for-a-specific-token)

## Balance Of An Address

Returns token balances for a wallet address. Use `Amount(selectWhere: { gt: "0" })` to exclude zero balances.

[Run in IDE](https://ide.bitquery.io/matic-balances-address)

```graphql
query {
  EVM(network: matic, dataset: combined) {
    Balances(
      where: {
        Balance: {
          Address: {
            is: "0x4c569c1e541A19132AC893748E0ad54C7c989FF4"
          }
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
          Address: {
            is: "0x4c569c1e541A19132AC893748E0ad54C7c989FF4"
          }
        }
        Currency: {
          Native: true
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

**Parameters**

- `network: matic`: Polygon mainnet.
- `dataset: combined`: Merges realtime and archive data for the latest balance state.
- `Balance.Address`: Wallet address to query.
- `Currency.Native: true`: Native MATIC only (see [Native MATIC Balance](#native-matic-balance)).

**Returned fields**

- `Currency.Symbol`, `Currency.SmartContract`: Token metadata.
- `Balance.Amount`, `Balance.AmountInUSD`: Token balance and USD value (use `selectWhere` to filter non-zero amounts).

:::warning Important: Rebasing Token Limitations
**Rebasing tokens are not supported for accurate balance calculations.**

Rebasing tokens automatically adjust their total supply and individual balances through mechanisms other than traditional transfer transactions. This means:

- **Balance calculations may be inaccurate** — Our balance tracking doesn't capture rebasing adjustments
- **Balance updates may be missing** — Individual holder balances change without visible transactions
- **Historical balance data will be incorrect** — Past balances don't reflect rebasing adjustments

**Before calculating balances for any token, verify it's not a rebasing token** by checking the token's official documentation and smart contract.

**Supported chains:** This limitation applies to all EVM chains (Ethereum, Polygon, Arbitrum, BSC, Base, etc.)
:::

## Balance On A Specific Date

Use `Block.Date.till` for a point-in-time snapshot. Use `dataset: archive` for historical dates and addresses not recently active.

[Run in IDE](https://ide.bitquery.io/matic-balances-by-date)

```graphql
query {
  EVM(network: matic, dataset: archive) {
    Balances(
      where: {
        Block: {
          Date: {
            till: "2026-05-01"
          }
        }
        Balance: {
          Address: {
            is: "0x4c569c1e541A19132AC893748E0ad54C7c989FF4"
          }
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

## Balance For A Specific Token

Add a `Currency.SmartContract` filter. Always use the contract address, not the token name. Use `0x` for native MATIC on Polygon, or the ERC-20 contract address for a token.

[Run in IDE](https://ide.bitquery.io/matic-balances-specific-token)

```graphql
query {
  EVM(network: matic, dataset: combined) {
    Balances(
      where: {
        Balance: {
          Address: {
            is: "0x4c569c1e541A19132AC893748E0ad54C7c989FF4"
          }
        }
        Currency: {
          SmartContract: {
            is: "0x"
          }
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

## Balance History By Date

Returns balance snapshots over time for an address. Use `dataset: archive`. Order by `Block_Date` descending and use `limit` to paginate. Add `Currency.SmartContract` under `Currency` to filter by a specific token.

[Run in IDE](https://ide.bitquery.io/matic-balances-history)

```graphql
query {
  EVM(network: matic, dataset: archive) {
    Balances(
      where: {
        Balance: {
          Address: {
            is: "0x4c569c1e541A19132AC893748E0ad54C7c989FF4"
          }
        }
        Currency: {}
      }
      orderBy: {
        descending: Block_Date
      }
      limit: {
        count: 100
      }
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

## Wallet Balance For A Specific Token On A Date

Get a wallet's balance for a specific token with `Balance.Address` and `Currency.SmartContract`. This example uses native MATIC (`SmartContract: "0x"`) with `dataset: combined`. For a balance on a calendar date, use [Balance On A Specific Date](#balance-on-a-specific-date) with `dataset: archive` and `Block.Date.till`.

[Run in IDE](https://ide.bitquery.io/matic-wallet-balance-token-at-date)

```graphql
query {
  EVM(network: matic, dataset: combined) {
    Balances(
      where: {
        Balance: {
          Address: {
            is: "0x4c569c1e541A19132AC893748E0ad54C7c989FF4"
          }
        }
        Currency: {
          SmartContract: {
            is: "0x"
          }
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

## How Do I Get The Balance Of A Wallet For A Specific Token?

Use `EVM.Balances` with `Balance.Address` and `Currency.SmartContract`. For the latest balance, use `dataset: combined`. For a balance on a specific date, see [Balance On A Specific Date](#balance-on-a-specific-date).
