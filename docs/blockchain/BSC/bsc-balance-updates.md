---
sidebar_position: 1
title: "BSC Balance API"
description: "BSC Balance API: fetch current and historical BNB Chain balances with Bitquery GraphQL balance queries. Scale further with Kafka or gRPC streams."
---

import FAQ from "@site/src/components/FAQ";

# BSC Balance API

:::caution Deprecated API
`EVM.BalanceUpdates` was deprecated as of **20 May 2026** and removed on **15 June 2026**. Use **`EVM.Balances`** (this page) instead.
:::

The **Balances** API returns current and historical token balances for an address on BSC. To return only non-zero balances, add `Amount(selectWhere: { gt: "0" })` on the `Balance` field (not in `where`). Use `dataset: combined` or `dataset: archive` as follows:

| Dataset        | When to use                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------- |
| **`combined`** | Latest balances. Queries **realtime and archive** databases and merges results.             |
| **`archive`**  | Historical snapshots with `Block.Date`, and balances for **addresses not recently active**. |

## Balance of an Address

Returns token balances for a wallet address. Use `Amount(selectWhere: { gt: "0" })` to exclude zero balances.

[Run in IDE](https://ide.bitquery.io/BSC-Balance-of-an-Address)

```graphql
query {
  EVM(network: bsc, dataset: combined) {
    Balances(
      where: {
        Balance: {
          Address: { is: "0xf9D48e42d0FEb477a0286B206eDbafefA3577F63" }
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

- `network: bsc`: BNB Smart Chain mainnet.
- `dataset: combined`: Merges realtime and archive data for the latest balance state.
- `Balance.Address`: Wallet address to query.

**Returned fields**

- `Currency.Symbol`, `Currency.SmartContract`: Token metadata.
- `Balance.Amount`, `Balance.AmountInUSD`: Token balance and USD value (use `selectWhere` to filter non-zero amounts).

## Balance on a Specific Date

Use `Block.Date.till` for a point-in-time snapshot. Use `dataset: archive` for historical dates and addresses not recently active.

[Run in IDE](https://ide.bitquery.io/BSC-Balances-by-Date)

```graphql
{
  EVM(network: bsc, dataset: combined) {
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

[Run in IDE](https://ide.bitquery.io/BSC-Balances-Specific-Token)

```graphql
query {
  EVM(network: bsc, dataset: combined) {
    Balances(
      where: {
        Balance: {
          Address: { is: "0xf9D48e42d0FEb477a0286B206eDbafefA3577F63" }
        }
        Currency: {
          SmartContract: { is: "0x55d398326f99059ff775485246999027b3197955" }
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

[Run in IDE](https://ide.bitquery.io/BSC-Balances-History)

```graphql
query {
  EVM(network: bsc, dataset: archive) {
    Balances(
      where: {
        Balance: {
          Address: { is: "0xf9D48e42d0FEb477a0286B206eDbafefA3577F63" }
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

[Run in IDE](https://ide.bitquery.io/BSC-Wallet-Balance-Token-at-Date)

```graphql
query {
  EVM(network: bsc, dataset: archive) {
    Balances(
      where: {
        Block: { Date: { till: "2026-05-05" } }
        Balance: {
          Address: { is: "0xf9D48e42d0FEb477a0286B206eDbafefA3577F63" }
        }
        Currency: {
          SmartContract: { is: "0x55d398326f99059ff775485246999027b3197955" }
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

## Top Holders of a Token

Use the **Holders** API (`EVM.Holders`) to get the top holders of a token. Use `dataset: combined` for the latest holder data.

[Run in IDE](https://ide.bitquery.io/BSC-Top-Holders)

```graphql
{
  EVM(network: bsc, dataset: combined) {
    Holders(
      where: {
        Currency: {
          SmartContract: { is: "0x55d398326f99059ff775485246999027b3197955" }
        }
      }
      orderBy: { descending: Balance_Amount }
      limit: { count: 10 }
    ) {
      Holder {
        Address
      }
      Balance {
        Amount(selectWhere: { gt: "0" })
      }
    }
  }
}
```

## Token Holder Count

Get the number of unique holders for a BEP-20 token using `uniq(of: Holder_Address)`.

[Run in IDE](https://ide.bitquery.io/BSC-Token-Holder-Count)

```graphql
query {
  EVM(network: bsc, dataset: combined) {
    Holders(
      where: {
        Currency: {
          SmartContract: { is: "0x55d398326f99059ff775485246999027b3197955" }
        }
      }
    ) {
      uniq(of: Holder_Address)
    }
  }
}
```

## Holder Count with Balance Above a Threshold

Count holders whose balance exceeds a minimum threshold. Use `if` condition on the aggregate.

[Run in IDE](https://ide.bitquery.io/BSC-Holders-Threshold)

```graphql
query {
  EVM(network: bsc, dataset: combined) {
    Holders(
      where: {
        Currency: {
          SmartContract: { is: "0x55d398326f99059ff775485246999027b3197955" }
        }
      }
    ) {
      uniq(of: Holder_Address, if: { Balance: { Amount: { gt: "1000" } } })
    }
  }
}
```

## Get Token Holdings and Holding Time of an Address

Get the token holdings of an address and calculate the holding time using `FirstChangeTime` and `LastChangeTime` from the `Holders` API.

[Run in IDE](https://ide.bitquery.io/BSC-Holdings-Holding-Time)

```graphql
query ($trader: String, $token: String) {
  EVM(network: bsc, dataset: combined) {
    Holders(
      where: {
        Holder: { Address: { is: $trader } }
        Currency: { SmartContract: { is: $token }, Fungible: true }
        Balance: { Amount: { gt: "0" } }
      }
    ) {
      Holder {
        Address
      }
      Balance {
        Amount
        FirstChangeTime
        LastChangeTime
      }
      Currency {
        Symbol
        Name
        SmartContract
        Decimals
      }
    }
  }
}
```

```json
{
  "trader": "0xc5C2653d38E241D62F96A4fB8f8497b6126F21dC",
  "token": "0x49d870B1d21D00c775DD03110Ef4c8FeF4Fd4444"
}
```

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

<FAQ
items={[
{ q: "How do I check a BSC wallet balance?", a: "Query EVM.Balances with network: bsc and the wallet address. Add a token contract filter for BEP-20 balances." },
{ q: "Can I track BSC balance changes over time?", a: "Use the Balances API with dataset: archive for historical snapshots, or subscribe to TransactionBalances for real-time balance changes." },
]}
/>
