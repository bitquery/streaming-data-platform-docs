---
sidebar_position: 2
---

# Address Balance API

:::caution Deprecated API
`EVM.BalanceUpdates` is deprecated as of **20 May 2026** and will be removed on **15 June 2026**. Use **`EVM.Balances`** (this page) instead.
:::

The **Balances** API returns current and historical token balances for an address on Ethereum. To return only non-zero balances, add `Amount(selectWhere: { gt: "0" })` on the `Balance` field (not in `where`). Use `dataset: combined` or `dataset: archive` as follows:

| Dataset        | When to use                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------- |
| **`combined`** | Latest balances. Queries **realtime and archive** databases and merges results.             |
| **`archive`**  | Historical snapshots with `Block.Date`, and balances for **addresses not recently active**. |

## Balance of an Address

Returns token balances for a wallet address. Use `Amount(selectWhere: { gt: "0" })` to exclude zero balances.

[Run in IDE](https://ide.bitquery.io/Ethereum-Balance-of-an-Address)

```graphql
query {
  EVM(network: eth, dataset: combined) {
    Balances(
      where: {
        Balance: {
          Address: { is: "0x76147fd7891731e01f35cc18f87ae8e95bf06869" }
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

- `network: eth`: Ethereum mainnet.
- `dataset: combined`: Merges realtime and archive data for the latest balance state.
- `Balance.Address`: Wallet address to query.

**Returned fields**

- `Currency.Symbol`, `Currency.SmartContract`: Token metadata.
- `Balance.Amount`, `Balance.AmountInUSD`: Token balance and USD value (use `selectWhere` to filter non-zero amounts).

## Balance on a Specific Date

Use `Block.Date.till` for a point-in-time snapshot. Use `dataset: archive` for historical dates and addresses not recently active.

[Run in IDE](https://ide.bitquery.io/ethereum-balances-address-by-date)

```graphql
{
  EVM(network: eth, dataset: combined) {
    Balances(
      where: {
        Balance: {
          Address: { is: "0xf9D48e42d0FEb477a0286B206eDbafefA3577F63" }
        }
        Block: { Date: { till: "2026-04-01" } }
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
    }
  }
}
```

## Balance for a Specific Token

Add a `Currency.SmartContract` filter. Always use the contract address, not the token name.

[Run in IDE](https://ide.bitquery.io/ethereum-balances-specific-token)

```graphql
query {
  EVM(network: eth, dataset: combined) {
    Balances(
      where: {
        Balance: {
          Address: { is: "0x3416cf6c708da44db2624d63ea0aaef7113527c6" }
        }
        Currency: {
          SmartContract: { is: "0x54D2252757e1672EEaD234D27B1270728fF90581" }
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

## Balance History by Date

Returns balance snapshots over time for an address. Use `dataset: archive`. Order by `Block_Date` descending and use `limit` to paginate. Add `Currency.SmartContract` under `Currency` to filter by a specific token.

[Run in IDE](https://ide.bitquery.io/ethereum-balances-history)

```graphql
query {
  EVM(network: eth, dataset: archive) {
    Balances(
      where: {
        Balance: {
          Address: { is: "0x5646c5b4845e565706ef107f62887145a51a3127" }
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

Use `dataset: archive`, `Block.Date.till`, `orderBy: { descending: Block_Date }`, and `limit: { count: 1 }` to get the balance as of that date.

[Run in IDE](https://ide.bitquery.io/ethereum-wallet-balance-token-at-date)

```graphql
query {
  EVM(network: eth, dataset: archive) {
    Balances(
      where: {
        Block: { Date: { till: "2026-05-05" } }
        Balance: {
          Address: { is: "0xA46320Aa0b4877b9a46a07B4F3DB93719bd422dE" }
        }
        Currency: {
          SmartContract: { is: "0x54D2252757e1672EEaD234D27B1270728fF90581" }
        }
      }
      limit: { count: 1 }
      orderBy: { descending: Block_Date }
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
