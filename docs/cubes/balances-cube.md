---
title: "Balances & Holders Cubes"
description: "Query current token and native balances per address with the Balances cube, and rank a token's holders with the Holders cube, on EVM chains and Tron."
keywords:
  - Balances cube
  - Holders cube
  - EVM Balances API
  - token holders API
  - current balance GraphQL
---
# Balances & Holders Cubes

Two cubes answer balance questions, and picking the right one matters more than the fields you select:

| Cube | Question it answers | Shape |
| --- | --- | --- |
| **`Balances`** | *What does this address hold?* | Current balance per address, live — no snapshot date |
| **`Holders`** | *Who holds this token?* | A token's holders ranked by balance, as a dated snapshot |

Both supersede the older `BalanceUpdates` approach of summing deltas yourself. They read from aggregate-state tables (`balances_by_address` / `balances_by_currency`), so they return the current state directly instead of replaying every change.

:::note Availability
`Balances` and `Holders` exist on **EVM networks** (`EVM(network: …)`) and **Tron** (`Tron`).

They do **not** exist on Solana. Solana balance changes are queried with [`Solana.BalanceUpdates`](/docs/blockchain/Solana/solana-balance-updates) and `Solana.InstructionBalanceUpdates`, which are the current APIs there — not deprecated.
:::

## Balances — what an address holds

`Balances` returns one row per address/currency pair with the current amount.

`Balance` fields: `Address`, `Amount`, `AmountInUSD`, `UpdateCount`, `FirstChangeTime`, `LastChangeTime`.

Its `where` filter accepts **`Balance.Address`** plus `Currency` and `Block`. Note there is **no amount filter** on `Balances` — see [Holders](#holders) if you need to filter or rank by balance size.

### Token balance for one or more addresses

```graphql
query TokenBalances($addresses: [String!], $token: String!) {
  EVM(network: eth, dataset: combined) {
    Balances(
      where: {
        Balance: { Address: { in: $addresses } }
        Currency: { SmartContract: { is: $token } }
      }
      orderBy: { descending: Balance_Amount }
    ) {
      Balance {
        Address
        Amount
        AmountInUSD
        UpdateCount
        LastChangeTime
      }
      Currency {
        Symbol
        Name
        SmartContract
      }
    }
  }
}
```

```json
{
  "addresses": [
    "0x28C6c06298d514Db089934071355E5743bf21d60",
    "0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549"
  ],
  "token": "0xdac17f958d2ee523a2206206994597c13d831ec7"
}
```

To exclude zero balances, apply the filter on the field rather than in `where`:
`Amount(selectWhere: { gt: "0" })`.

### Native balance

Filter on `Currency: { Native: true }` to get the chain's native asset instead of a token:

```graphql
{
  EVM(network: eth, dataset: combined) {
    Balances(
      where: {
        Balance: { Address: { is: "0x28C6c06298d514Db089934071355E5743bf21d60" } }
        Currency: { Native: true }
      }
    ) {
      Balance {
        Address
        Amount
        AmountInUSD
      }
      Currency {
        Symbol
        Native
      }
    }
  }
}
```

The same query works on Tron by swapping the selector for `Tron` and using a Tron address.

### Classifying an address from its balance metadata

`UpdateCount` with `LastChangeTime` separates wallet types without any labelling data:

- **Very high `UpdateCount`, `LastChangeTime` seconds ago** — exchange hot wallet or payment processor; the balance churns continuously.
- **Single-digit `UpdateCount` on a large balance** — cold storage, treasury or custody. Funded once, rarely touched.

:::caution `FirstChangeTime` is not the address's first-ever activity
`FirstChangeTime` reflects the earliest change **within the balances table's retention window**, not the first time the address ever moved funds. For true first-activity, query [Transfers](/docs/cubes/transfers-cube) with an ascending time order instead.
:::

## Holders — who holds a token {#holders}

`Holders` lists a token's holders, ranked. It takes a **`date`** argument for the snapshot day, and unlike `Balances` it **does** accept a balance filter — which is what makes large tokens tractable.

```graphql
query TokenHolders($token: String!, $floor: String!, $date: String!) {
  EVM(network: eth) {
    Holders(
      limit: { count: 100 }
      orderBy: { descending: Balance_Amount }
      date: $date
      where: {
        Currency: { SmartContract: { is: $token } }
        Balance: { Amount: { ge: $floor } }
      }
    ) {
      Holder {
        Address
      }
      Balance {
        Amount
      }
      Currency {
        Symbol
        Name
      }
    }
  }
}
```

```json
{
  "token": "0x514910771AF9Ca656af840dff83E8264EcF986CA",
  "floor": "1000000",
  "date": "2026-07-29"
}
```

:::caution Set a balance floor on large tokens
An unbounded top-N ranking across every holder of a very large token **times out server-side** — this is a dataset-size limit, not a syntax error. Ethereum USDT times out even with a 50,000,000 floor; Tron USDT behaves the same way.

The fix is a `Balance: { Amount: { ge: … } }` floor high enough to shrink the working set. For a *complete* holder distribution rather than the top of it, use [Bitquery Cloud exports](/docs/cloud/) or [Kafka streams](/docs/streams/protobuf/kafka-protobuf-python) rather than a synchronous GraphQL query.
:::

## Choosing a dataset

| Dataset | When to use |
| --- | --- |
| **`combined`** | Latest balances. Queries realtime and archive and merges the results. |
| **`archive`** | Historical snapshots, and balances for addresses that have not been active recently. |
| **`realtime`** | Recent state only. Some aggregates are unavailable here — if you see *"no table can query … consider use archive dataset"*, switch to `combined` or `archive`. |

## Migrating from `BalanceUpdates`

If you previously summed balance deltas, the translation is mechanical:

| Old (`BalanceUpdates`) | New |
| --- | --- |
| `BalanceUpdates(where: {BalanceUpdate: {Address: {is: …}}})` | `Balances(where: {Balance: {Address: {is: …}}})` |
| `balance: sum(of: BalanceUpdate_Amount, selectWhere: {gt: "0"})` | `Balance { Amount(selectWhere: {gt: "0"}) }` |
| `BalanceUpdate { Address }` | `Balance { Address }` |
| `BalanceUpdate { AmountInUSD }` | `Balance { AmountInUSD }` |
| Top holders via `sum` + `orderBy: {descendingByField: "balance"}` | `Holders(date: …, orderBy: {descending: Balance_Amount})` |

The important conceptual change: **you no longer aggregate.** `Balances` already holds the summed state, so a `sum(of: …)` over balance updates becomes a plain field read.

What `Balances` does *not* carry is the **reason** for a change. `BalanceUpdates` exposes `Type` (`transfer`, `fee`, `block_reward`, …), which is why the [Balance Updates cube](/docs/cubes/balance-updates-cube) remains the right tool for attributing *why* a balance moved, and for per-change history.

## Related

- [Balance Updates cube](/docs/cubes/balance-updates-cube) — per-change history and change attribution
- [Transfers cube](/docs/cubes/transfers-cube) — the transfers that drive most balance changes
- [Token Holders API (Ethereum)](/docs/blockchain/Ethereum/token-holders/token-holder-api) — worked `EVM.Holders` examples
- [TRC20 USDT API](/docs/blockchain/Tron/usdt-trc20-api) — `Tron.Balances` and `Tron.Holders` in practice
