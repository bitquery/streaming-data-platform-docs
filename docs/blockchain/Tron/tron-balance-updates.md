---
sidebar_position: 1
title: "Tron Address Balance API"
description: "Bitquery blockchain API docs: Tron Address Balance API."
---

import FAQ from "@site/src/components/FAQ";

# Tron Address Balance API

:::caution Deprecated API
`Tron.BalanceUpdates` was deprecated as of **18 June 2026** and removed on **18 July 2026**. Use **`Tron.Balances`** (this page) instead.
:::

The **Balances** API returns current and historical token balances for an address on Tron. To return only non-zero balances, add `Amount(selectWhere: { gt: "0" })` on the `Balance` field (not in `where`). Use `dataset: combined` or `dataset: archive` as follows:

| Dataset        | When to use                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------- |
| **`combined`** | Latest balances. Queries **realtime and archive** databases and merges results.             |
| **`archive`**  | Historical snapshots with `Block.Date`, and balances for **addresses not recently active**. |

<head>
<meta name="title" content="How to get Tron Balance Updates of an address"/>
<meta name="description" content="Learn how to get real time balance & balance updates of a Tron address using Bitquery's Tron Balance Updates API."/>
<meta name="keywords" content="balance api, balance updates api, balance updates python api, Tron Balance python api, NFT balance api, Balance scan api, Balance api docs, Tron Balance crypto api, balance blockchain api,Tron network api, Tron web3 api, tronscan api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="How to get Tron Balance & Balance Updates of an address"
/>
<meta
  property="og:description"
  content="Learn how to get historical & real time balance & balance updates of a Tron address using Bitquery's Tron Balance Updates API."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="How to get Tron Balance Updates of an address" />
<meta property="twitter:description" content="Learn how to get real time balance & balance updates of a Tron address using Bitquery's Tron Balance Updates API." />
</head>

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

```
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

Use `Block.Date.till` for a point-in-time snapshot. Use `dataset: archive` for historical dates and addresses not recently active.

[Run in IDE](https://ide.bitquery.io/tron-historical-balance_4)

```graphql
query {
  Tron(dataset: archive) {
    Balances(
      where: {
        Balance: {
          Address: { is: "TDqSquXBgUCLYvYC4XZgrprLK589dkhSCf" }
        }
        Block: { Date: { till: "2025-06-01" } }
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
      }
    }
  }
}
```

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

## Wallet Balance for a Specific Token on a Date

Use `dataset: archive`, `Block.Date.till`, `orderBy: { descending: Block_Date }`, and `limit: { count: 1 }` to get the balance as of that date.

[Run in IDE](https://ide.bitquery.io/historical-balance-of-a-token-on-a-date)

```graphql
query {
  Tron(dataset: archive) {
    Balances(
      where: {
        Block: { Date: { till: "2025-06-01" } }
        Balance: {
          Address: { is: "TDqSquXBgUCLYvYC4XZgrprLK589dkhSCf" }
        }
        Currency: {
          SmartContract: { is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t" }
        }
      }
      limit: { count: 1 }
      orderBy: { descending: Block_Date }
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

## Deprecated: BalanceUpdates Queries

The examples below use the deprecated **`Tron.BalanceUpdates`** API. Migrate to **`Tron.Balances`** and **`Tron.Holders`** (sections above) — **`Tron.BalanceUpdates`** is no longer available.

### Balance of an Address on Tron

[Run Query ➤](https://ide.bitquery.io/balance-of-an-address-on-tron)

```
{
  Tron(dataset: combined, aggregates: yes) {
    BalanceUpdates(
      where: {BalanceUpdate: {Address: {is: "TDqSquXBgUCLYvYC4XZgrprLK589dkhSCf"}}}
      orderBy: {descendingByField: "balance"}
    ) {
      Currency {
        Name
      }
      balance: sum(of: BalanceUpdate_Amount, selectWhere: {gt: "0"})
    }
  }
}

```

### Total Holder Count of a Tron Token

Count the **total number of unique addresses holding a Tron TRC20 token** with a positive balance. A foundational metric for token-health dashboards.

Run the query [here](https://ide.bitquery.io/tron-token-holder-count).

```graphql
query TokenHolderCount {
  Tron(dataset: combined, aggregates: yes) {
    BalanceUpdates(
      where: {
        Currency: { SmartContract: { is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t" } }
      }
    ) {
      Currency {
        Name
        Symbol
        SmartContract
      }
      holders: uniq(
        of: BalanceUpdate_Address
        selectWhere: { gt: "0" }
      )
    }
  }
}
```

### Historical Balance of a Tron Address at a Specific Time

Reconstruct the **balance of a wallet as of a past block time** — useful for audits, airdrop snapshot eligibility, retroactive analytics, and tax tooling.

Try the query [here](https://ide.bitquery.io/tron-historical-balance).

```graphql
query HistoricalBalanceTron($address: String, $until: DateTime) {
  Tron(dataset: combined, aggregates: yes) {
    BalanceUpdates(
      where: {
        BalanceUpdate: { Address: { is: $address } }
        Block: { Time: { till: $until } }
      }
      orderBy: { descendingByField: "balance" }
    ) {
      Currency {
        Name
        Symbol
        SmartContract
      }
      balance: sum(of: BalanceUpdate_Amount, selectWhere: { gt: "0" })
    }
  }
}
{
  "address": "TDqSquXBgUCLYvYC4XZgrprLK589dkhSCf",
  "until": "2025-06-01T00:00:00Z"
}
```

### Full Multi-Token Portfolio of a Tron Wallet

Return the **complete TRC10 + TRC20 portfolio** of any Tron address with USD valuation — the building block of Tron portfolio trackers and wallet UIs.

Run the query [here](https://ide.bitquery.io/tron-wallet-portfolio).

```graphql
query TronWalletPortfolio($address: String) {
  Tron(dataset: combined, aggregates: yes) {
    BalanceUpdates(
      where: { BalanceUpdate: { Address: { is: $address } } }
      orderBy: { descendingByField: "balance_usd" }
    ) {
      Currency {
        Name
        Symbol
        SmartContract
        Native
      }
      balance: sum(of: BalanceUpdate_Amount, selectWhere: { gt: "0" })
      balance_usd: sum(of: BalanceUpdate_AmountInUSD, selectWhere: { gt: "0" })
    }
  }
}
{
  "address": "TFXttAWURRrXrd9JvFPVLEh1esJK8NHxn7"
}
```

### Top Token Holders of a token

This query fetches you the top 10 token holders of the token `TXL6rJbvmjD46zeN1JssfgxvSo99qC8MRT`. Check out the query [here](https://ide.bitquery.io/top-token-holders_2).

```
query MyQuery {
  Tron(dataset: combined) {
    BalanceUpdates(
      limit: {count: 10}
      orderBy: {descendingByField: "balance"}
      where: {Currency: {SmartContract: {is: "TXL6rJbvmjD46zeN1JssfgxvSo99qC8MRT"}}}
    ) {
      balance: sum(of: BalanceUpdate_Amount, selectWhere: {gt: "0"})
      BalanceUpdate {
        Address
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
