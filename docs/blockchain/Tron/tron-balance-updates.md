---
sidebar_position: 1
title: "Tron Address Balance API"
description: "Tron Address Balance API: fetch current and historical Tron balances with Bitquery GraphQL balance queries. Run it in the IDE, then ship in your app."
---
import FAQ from "@site/src/components/FAQ";

# Tron Address Balance API

:::danger Sunsetting 10 August 2026 — migrate now
`Tron.BalanceUpdates` is **scheduled to sunset on 10 August 2026**. It still returns live data today, so existing queries have not broken yet — but they will stop working on that date.

Move to **`Tron.Balances`** and **`Tron.Holders`** (documented on this page). They read from aggregate-state tables and return the current balance directly, so you no longer sum deltas yourself. The same sunset applies to `EVM.BalanceUpdates` and `EVM.TokenHolders`.

See the [migration mapping](/docs/cubes/balances-cube/) for the query-by-query equivalents.
:::

The **Balances** API returns current and historical token balances for an address on Tron. To return only non-zero balances, add `Amount(selectWhere: { gt: "0" })` on the `Balance` field (not in `where`). Use `dataset: combined` or `dataset: archive` as follows:

| Dataset        | When to use                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------- |
| **`combined`** | Latest balances. Queries **realtime and archive** databases and merges results.             |
| **`archive`**  | Historical snapshots with `Block.Date`, and balances for **addresses not recently active**. |

## Portfolio of a Tron Wallet

Returns balances for all the currecies owned by a wallet address. Use `Amount(selectWhere: { gt: "0" })` to exclude zero balances and `dataset: combined` for the latest balances.

[Run in IDE](https://ide.bitquery.io/TronWalletPortfolio-Tron)

```graphql
query TronWalletPortfolio($address: String) {
  Tron(dataset: combined) {
    Balances(
      where: {
        Balance: { Address: { is: $address } }
      }
      orderBy: { descending: Balance_AmountInUSD }
    ) {
      Currency {
        Name
        Symbol
        SmartContract
        Native
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

**Variables**

```json
{
  "address": "TFXttAWURRrXrd9JvFPVLEh1esJK8NHxn7"
}
```

**Parameters**

- `dataset: combined`: Merges realtime and archive data for the latest balance state.
- `Balance.Address`: Wallet address to query.

**Returned fields**

- `Currency.Name`, `Currency.Symbol`, `Currency.SmartContract`: Token metadata.
- `Balance.Amount`, `Balance.AmountInUSD`: Token balance and USD value (use `selectWhere` to filter non-zero amounts).

## Native TRX Balance

Returns the native TRX balance for a wallet (not TRC10 or TRC20 tokens). Filter with `Currency: { Native: true }` instead of a token contract address.

[Run in IDE](https://ide.bitquery.io/Tron-Balances-for-Native-currency)

```graphql
query {
  Tron(dataset: combined) {
    Balances(
      where: {
        Balance: {
          Address: { is: "TDqSquXBgUCLYvYC4XZgrprLK589dkhSCf" }
        }
        Currency: { Native: true }
      }
    ) {
      Currency {
        Name
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

## Balance on a Specific Date

Use `Block.Date.till` as the "as of" cutoff (inclusive) — the cube returns the end-of-day balance on that date. Do **not** select `Block` fields in the output, or the result splits into one row per active day instead of a single cumulative balance.

Unlike summing Transfers, this includes mints, burns, and genesis supply. For example, the Tether treasury below shows `9.9` USDT on 2019-04-16: the 10 USDT initial supply was written in the contract constructor with no transfer record, minus a 0.1 USDT outgoing transfer the same day.

[Run in IDE](https://ide.bitquery.io/tron-usdt-balance-at-date)

```graphql
query TronUSDTBalanceAtDate {
  Tron(dataset: combined) {
    Balances(
      where: {
        Balance: { Address: { in: ["THPvaUhoh2Qn2y9THCZML3H815hhFhn5YC"] } }
        Block: { Date: { till: "2019-04-16" } }
        Currency: { SmartContract: { in: ["TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"] } }
      }
    ) {
      Balance { Address Amount }
    }
  }
}
```

Remove the `Currency` filter to get the balance of every token the address held as of that date.

## Balance for a Specific Token

Add a `Currency.SmartContract` filter. Always use the contract address, not the token name.

[Run in IDE](https://ide.bitquery.io/tron-token-balance)

```graphql
query {
  Tron(dataset: combined) {
    Balances(
      where: {
        Balance: {
          Address: { is: "TUTQj7VJ1QjR3t2GJByvrP25yZNFcj38VJ" }
        }
        Currency: {
          SmartContract: { is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t" }
        }
      }
    ) {
      Currency {
        Name
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

[Run in IDE](https://ide.bitquery.io/tron-balances-by-date)

```graphql
query {
  Tron(dataset: archive) {
    Balances(
      where: {
        Balance: {
          Address: { is: "TDqSquXBgUCLYvYC4XZgrprLK589dkhSCf" }
        }
        Currency: {}
      }
      orderBy: { descending: Block_Date }
      limit: { count: 100 }
    ) {
      Currency {
        Name
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

## Total Holder Count of a Tron Token

Count the total number of unique addresses holding a Tron TRC20 token with a positive balance. Use the **Holders** API instead of the deprecated `BalanceUpdates` aggregates.

[Run in IDE](https://ide.bitquery.io/token-holders-count-tron)

```graphql
query TokenHolderCount {
  Tron(dataset: combined) {
    Holders(
      where: {
        Currency: { SmartContract: { is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t" } }
        Balance: { Amount: { gt: "0" } }
      }
    ) {
      Currency {
        Name
        Symbol
        SmartContract
      }
      holders: uniq(of: Holder_Address)
    }
  }
}
```

## Top Token Holders of a Token

Returns the top holders of a token ranked by current balance. Use the **Holders** API with `orderBy` and `limit`.

[Run in IDE](https://ide.bitquery.io/top-token-holders-of-a-token)

```graphql
query TopTokenHolders {
  Tron(dataset: combined) {
    Holders(
      where: {
        Currency: { SmartContract: { is: "TXL6rJbvmjD46zeN1JssfgxvSo99qC8MRT" } }
        Balance: { Amount: { gt: "0" } }
      }
      orderBy: { descending: Balance_Amount }
      limit: { count: 10 }
    ) {
      Holder {
        Address
      }
      Currency {
        Name
        Symbol
        SmartContract
      }
      Balance {
        Amount(selectWhere: { gt: "0" })
      }
    }
  }
}
```

<FAQ
  items={[
    { q: "How do I check a Tron wallet balance?", a: "Query Tron.Balances with the wallet address. Add a Currency.SmartContract filter for TRC20 balances, or Currency.Native: true for TRX." },
    { q: "Can I track balance changes over time?", a: "Use historical balance queries with Block.Date and dataset: archive, documented on this page." },
  ]}
/>
