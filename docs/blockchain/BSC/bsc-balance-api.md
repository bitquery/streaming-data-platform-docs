---
sidebar_position: 1
---

# BSC Address Balance API

:::caution Deprecated APIs
On EVM, **`BalanceUpdates`** and **`TokenHolders`** are deprecated as of **20 May 2026** and will be removed on **15 June 2026**. Use **`EVM.Balances`** (this page) and **[Token Holders API](/docs/blockchain/Ethereum/token-holders/token-holder-api)** (`EVM.Holders`) instead.
:::

The **Balances** API returns current and historical token balances for an address on BNB Smart Chain (BSC). To return only non-zero balances, add `Amount(selectWhere: { gt: "0" })` on the `Balance` field (not in `where`). Use `dataset: combined` or `dataset: archive` as follows:

| Dataset        | When to use                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------- |
| **`combined`** | Latest balances. Queries **realtime and archive** databases and merges results.             |
| **`archive`**  | Historical snapshots with `Block.Date`, and balances for **addresses not recently active**. |

Examples: [All Token Balances](#balance-of-an-address) · [Native BNB](#native-bnb-balance) · [Balance On A Date](#balance-on-a-specific-date) · [Specific Token](#balance-for-a-specific-token)

## Balance Of An Address

Returns token balances for a wallet address. Use `Amount(selectWhere: { gt: "0" })` to exclude zero balances.

[Run in IDE](https://ide.bitquery.io/bsc-balances-address)

```graphql
query {
  EVM(network: bsc, dataset: combined) {
    Balances(
      where: {
        Balance: {
          Address: { is: "0x6C341938bB75dDe823FAAfe7f446925c66E6270c" }
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

## Native BNB Balance

Returns the native BNB balance for a wallet (not BEP-20 tokens). Filter with `Currency: { Native: true }`.

[Run in IDE](https://ide.bitquery.io/bsc-native-balances-address)

```graphql
query {
  EVM(network: bsc, dataset: combined) {
    Balances(
      where: {
        Balance: {
          Address: { is: "0x6C341938bB75dDe823FAAfe7f446925c66E6270c" }
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

- `network: bsc`: BNB Smart Chain.
- `dataset: combined`: Merges realtime and archive data for the latest balance state.
- `Balance.Address`: Wallet address to query.
- `Currency.Native: true`: Native BNB only (see [Native BNB Balance](#native-bnb-balance)). For BEP-20 tokens, use `Currency.SmartContract` instead.

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

[Run in IDE](https://ide.bitquery.io/bsc-balances-by-date)

```graphql
query {
  EVM(network: bsc, dataset: archive) {
    Balances(
      where: {
        Block: { Date: { till: "2026-05-01" } }
        Balance: {
          Address: { is: "0x6C341938bB75dDe823FAAfe7f446925c66E6270c" }
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

Add a `Currency.SmartContract` filter for BEP-20 tokens (not native BNB). Always use the contract address, not the token name. The example below uses token `0x54261774905f3e6E9718f2ABb10ed6555cae308a` — use `Currency: { Native: true }` only for native BNB.

[Run in IDE](https://ide.bitquery.io/bsc-balances-specific-token)

```graphql
query {
  EVM(network: bsc, dataset: combined) {
    Balances(
      where: {
        Balance: {
          Address: { is: "0x6C341938bB75dDe823FAAfe7f446925c66E6270c" }
        }
        Currency: {
          SmartContract: { is: "0x54261774905f3e6E9718f2ABb10ed6555cae308a" }
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

[Run in IDE](https://ide.bitquery.io/bsc-balances-history)

```graphql
query {
  EVM(network: bsc, dataset: archive) {
    Balances(
      where: {
        Balance: {
          Address: { is: "0x6C341938bB75dDe823FAAfe7f446925c66E6270c" }
        }
        Currency: {
          SmartContract: { is: "0x54261774905f3e6E9718f2ABb10ed6555cae308a" }
        }
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

## Wallet Balance For A Specific Token On A Date

Get a wallet's balance for a specific token with `Balance.Address` and `Currency.SmartContract`. This example uses BEP-20 token `0x54261774905f3e6E9718f2ABb10ed6555cae308a` with `dataset: combined`. For a balance on a calendar date, use [Balance On A Specific Date](#balance-on-a-specific-date) with `dataset: archive` and `Block.Date.till`.

[Run in IDE](https://ide.bitquery.io/bsc-wallet-balance-token-at-date)

```graphql
query {
  EVM(network: bsc, dataset: combined) {
    Balances(
      where: {
        Balance: {
          Address: { is: "0x6C341938bB75dDe823FAAfe7f446925c66E6270c" }
        }
        Currency: {
          SmartContract: { is: "0x54261774905f3e6E9718f2ABb10ed6555cae308a" }
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
