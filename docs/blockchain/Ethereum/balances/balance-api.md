---
sidebar_position: 2
---

# Address Balance API

:::caution Deprecated API
`EVM.BalanceUpdates` is deprecated as of **20 May 2026** and will be removed on **15 June 2026**. Use **`EVM.Balances`** (this page) instead.
:::

The **Balances** API returns current and historical token balances for an address on Ethereum. To return only non-zero balances, add `Amount(selectWhere: { gt: "0" })` on the `Balance` field (not in `where`). Use `dataset: combined` or `dataset: archive` as follows:

| Dataset | When to use |
|---------|-------------|
| **`combined`** | Latest balances. Queries **realtime and archive** databases and merges results. |
| **`archive`** | Historical snapshots with `Block.Date`, and balances for **addresses not recently active**. |

## Balance of an address

Returns token balances for a wallet address. Use `Amount(selectWhere: { gt: "0" })` to exclude zero balances.

[Run in IDE](https://ide.bitquery.io/ethereum-balances-address)

```graphql
query {
  EVM(network: eth, dataset: combined) {
    Balances(
      where: {
        Balance: {
          Address: {
            is: "0x76147fd7891731e01f35cc18f87ae8e95bf06869"
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

**Parameters**

- `network: eth`: Ethereum mainnet.
- `dataset: combined`: Merges realtime and archive data for the latest balance state.
- `Balance.Address`: Wallet address to query.

**Returned fields**

- `Currency.Symbol`, `Currency.SmartContract`: Token metadata.
- `Balance.Amount`, `Balance.AmountInUSD`: Token balance and USD value (use `selectWhere` to filter non-zero amounts).

:::warning Important: Rebasing Token Limitations
**Rebasing tokens are not supported for accurate balance calculations.**

Rebasing tokens (like Mountain Protocol's USDM) automatically adjust their total supply and individual balances through mechanisms other than traditional transfer transactions. This means:

- **Balance calculations may be inaccurate** - Our balance tracking doesn't capture rebasing adjustments
- **Balance updates may be missing** - Individual holder balances change without visible transactions
- **Historical balance data will be incorrect** - Past balances don't reflect rebasing adjustments

**Before calculating balances for any token, verify it's not a rebasing token by:**

1. Checking the token's official documentation
2. Looking for rebasing mechanisms in the smart contract
3. Consulting token issuer resources

**Example of rebasing token:** Mountain Protocol USDM (`0x59d9356e565ab3a36dd77763fc0d87feaf85508c` on Arbitrum) - [Documentation](https://docs.mountainprotocol.com/legacy-docs/usdm-token)

**Supported chains:** This limitation applies to all EVM chains (Ethereum, Arbitrum, BSC, Base, etc.)
:::

## Balance on a specific date

Use `Block.Date.till` for a point-in-time snapshot. Use `dataset: archive` for historical dates and addresses not recently active.

[Run in IDE](https://ide.bitquery.io/ethereum-balances-by-date)

```graphql
query {
  EVM(network: eth, dataset: archive) {
    Balances(
      where: {
        Block: {
          Date: {
            till: "2026-05-01"
          }
        }
        Balance: {
          Address: {
            is: "0x76147fd7891731e01f35cc18f87ae8e95bf06869"
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

## Balance for a specific token

Add a `Currency.SmartContract` filter. Always use the contract address, not the token name.

[Run in IDE](https://ide.bitquery.io/ethereum-balances-specific-token)

```graphql
query {
  EVM(network: eth, dataset: combined) {
    Balances(
      where: {
        Balance: {
          Address: {
            is: "0x3416cf6c708da44db2624d63ea0aaef7113527c6"
          }
        }
        Currency: {
          SmartContract: {
            is: "0x54D2252757e1672EEaD234D27B1270728fF90581"
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

## Balance history by date

Returns balance snapshots over time for an address. Use `dataset: archive`. Order by `Block_Date` descending and use `limit` to paginate. Add `Currency.SmartContract` under `Currency` to filter by a specific token.

[Run in IDE](https://ide.bitquery.io/ethereum-balances-history)

```graphql
query {
  EVM(network: eth, dataset: archive) {
    Balances(
      where: {
        Balance: {
          Address: {
            is: "0x5646c5b4845e565706ef107f62887145a51a3127"
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

## Wallet balance for a specific token on a date

Use `dataset: archive`, `Block.Date.till`, `orderBy: { descending: Block_Date }`, and `limit: { count: 1 }` to get the balance as of that date.

[Run in IDE](https://ide.bitquery.io/ethereum-wallet-balance-token-at-date)

```graphql
query {
  EVM(network: eth, dataset: archive) {
    Balances(
      where: {
        Block: {
          Date: {
            till: "2026-05-05"
          }
        }
        Balance: {
          Address: {
            is: "0xA46320Aa0b4877b9a46a07B4F3DB93719bd422dE"
          }
        }
        Currency: {
          SmartContract: {
            is: "0x54D2252757e1672EEaD234D27B1270728fF90581"
          }
        }
      }
      limit: {
        count: 1
      }
      orderBy: {
        descending: Block_Date
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

## How do I get the balance of a wallet for a specific token?

Use `EVM.Balances` with `Balance.Address` and `Currency.SmartContract`. For the latest balance, use `dataset: combined`. For a balance on a specific date, see [Wallet balance for a specific token on a date](#wallet-balance-for-a-specific-token-on-a-date). For holder distribution and top holders, see the [Token Holders API](https://docs.bitquery.io/docs/blockchain/Ethereum/token-holders/token-holder-api).
