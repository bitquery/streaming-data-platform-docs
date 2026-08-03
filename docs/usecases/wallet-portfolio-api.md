---
title: "Wallet Portfolio API - What an Address Holds"
sidebar_label: "Wallet portfolio"
description: "Get every token a wallet holds with USD value, on EVM, Tron and Solana. Covers dormancy metadata, dated snapshots and the aggregation limits of the Balances cube."
keywords:
  - wallet portfolio API
  - what tokens does a wallet hold
  - address balance USD
  - crypto portfolio GraphQL
  - Balances cube
  - Solana wallet holdings
  - Tron wallet portfolio
  - token holder concentration
---

# Wallet portfolio API

"What does this address hold, and what is it worth?" On EVM and Tron that is one query against
the `Balances` cube. On Solana it takes a slightly different shape, because Solana has no
`Balances` cube.

For *realised profit and loss* on trades rather than current holdings, see
[Build your own crypto P&L calculator](/docs/usecases/p-l-product/overview/).

## EVM: every token an address holds

```graphql
query WalletPortfolio {
  EVM(network: eth) {
    Balances(
      where: { Balance: { Address: { is: "0x28c6c06298d514db089934071355e5743bf21d60" } } }
      orderBy: { descending: Balance_AmountInUSD }
      limit: { count: 50 }
    ) {
      Balance {
        Amount
        AmountInUSD
        LastChangeTime
        UpdateCount
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

One row per token, already valued. `Balances` reads from an aggregate-state table, so you are
not summing a history of changes to get here.

Switch `network` for other EVM chains, and use `Tron { Balances(...) }` for Tron with the same
shape.

:::caution `Balances` has no `sum`, so total portfolio value is client-side
The cube exposes only `count`, `uniq` and `calculate`. There is no `sum`, so this fails:

```graphql
Balances(where: {...}) { totalUsd: sum(of: Balance_AmountInUSD) }   # Cannot query field "sum"
```

Fetch the rows and add `AmountInUSD` in your own code. The `Holders` cube *does* support the
full aggregate set, including `sum` — see [holder concentration](#holder-concentration) below.
:::

### Filter out dust and zero balances

Non-zero filtering goes on the **field**, with `selectWhere`, not in the `where` block:

```graphql
query NonZeroHoldings {
  EVM(network: eth) {
    Balances(
      where: { Balance: { Address: { is: "0x28c6c06298d514db089934071355e5743bf21d60" } } }
      orderBy: { descending: Balance_AmountInUSD }
      limit: { count: 50 }
    ) {
      Balance {
        Amount(selectWhere: { gt: "0" })
        AmountInUSD
      }
      Currency {
        Symbol
      }
    }
  }
}
```

Putting `Amount: { gt: "0" }` inside `where` silently returns nothing useful. This trips people
up often enough to be worth stating twice.

To drop dust by value rather than by amount, apply `selectWhere` to `AmountInUSD` instead.

## Position age and dormancy

`Balances` carries three fields that turn a portfolio into an activity profile, and they cost
nothing extra:

| Field | What it tells you |
|---|---|
| `FirstChangeTime` | when the address first touched this token |
| `LastChangeTime` | when it last moved |
| `UpdateCount` | how many balance changes there have been |

```graphql
query DormantPositions {
  EVM(network: eth) {
    Balances(
      where: { Balance: { Address: { is: "0x28c6c06298d514db089934071355e5743bf21d60" } } }
      orderBy: { ascending: Balance_LastChangeTime }
      limit: { count: 25 }
    ) {
      Balance {
        AmountInUSD
        FirstChangeTime
        LastChangeTime
        UpdateCount
      }
      Currency {
        Symbol
      }
    }
  }
}
```

Ordering by `LastChangeTime` ascending puts the most dormant positions first. A high
`UpdateCount` with a recent `LastChangeTime` is an operational wallet; a single update years ago
is an abandoned or airdropped position.

## Solana

Solana has no `Balances` cube. Take the most recent balance update per mint instead, using
`limitBy` to collapse to one row per token:

```graphql
query SolanaWalletPortfolio {
  Solana {
    BalanceUpdates(
      where: {
        BalanceUpdate: {
          Account: { Owner: { is: "5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9" } }
        }
      }
      orderBy: { descending: Block_Time }
      limitBy: { by: BalanceUpdate_Currency_MintAddress, count: 1 }
      limit: { count: 50 }
    ) {
      BalanceUpdate {
        PostBalance
        PostBalanceInUSD
        Currency {
          Symbol
          MintAddress
          Decimals
        }
      }
    }
  }
}
```

`PostBalance` is the balance after the most recent change, so one row per mint gives you the
current portfolio. `limitBy` is doing the real work here — without it you get the full history
of every change.

:::note Solana's `BalanceUpdates` is not deprecated
`BalanceUpdates` and `TokenHolders` are deprecated on **EVM and Tron** in favour of `Balances`
and `Holders`. Solana is different: it has no `Balances` cube, and `Solana.BalanceUpdates` is
the current API there. See [Balances & Holders](/docs/cubes/balances-cube/).
:::

## A snapshot at a past date

`Holders` takes a `date` argument, which answers "who held this token on this day" and, filtered
to one address, "what did this wallet hold then".

```graphql
query HoldersOnDate {
  EVM(network: eth, dataset: archive) {
    Holders(
      date: "2026-07-01"
      where: {
        Currency: { SmartContract: { is: "0x6982508145454ce325ddbe47a25d4ec3d2311933" } }
      }
      orderBy: { descendingByField: "balance" }
      limit: { count: 25 }
    ) {
      Holder {
        Address
      }
      balance: sum(of: Balance_Amount)
    }
  }
}
```

:::caution Snapshot cost scales with the holder set
A dated snapshot of a token with millions of holders can exceed the request timeout. The query
above is fine on a token with a normal holder count, and the same query against a major
stablecoin may not return. Narrow with `limit`, or filter to the addresses you care about,
before widening.
:::

## Holder concentration

Unlike `Balances`, the `Holders` cube supports the full aggregate and statistics set, so
distribution metrics are computed server-side rather than by pulling every holder:

```graphql
query HolderConcentration {
  EVM(network: eth, dataset: archive) {
    Holders(
      date: "2026-07-01"
      where: {
        Currency: { SmartContract: { is: "0x6982508145454ce325ddbe47a25d4ec3d2311933" } }
      }
    ) {
      holders: count
      gini: gini(of: Balance_Amount)
      nakamoto: nakamoto(of: Balance_Amount)
      median: median(of: Balance_Amount)
      total: sum(of: Balance_Amount)
    }
  }
}
```

Reading the output:

- **`nakamoto`** is the smallest number of holders that together control more than half the
  supply. It is the single most legible concentration number you can publish.
- **`gini`** runs 0 (perfectly even) to 1 (one holder owns everything). Real tokens sit high, so
  compare tokens against each other rather than against an absolute threshold.
- **`median`** is often `0`, because most addresses in a large holder set carry dust. That is a
  property of the token, not a bug in the query, and it is why the mean is misleading here.

## Streaming a portfolio

You cannot subscribe to `Balances` or `Holders`. They are aggregate-state tables and never push
a message, even though the subscription is accepted.

Read the portfolio once, then keep it current from a stream that does fire: `Transfers` or
`TransactionBalances` on EVM, `Tron.Transfers` on Tron, `Solana.BalanceUpdates` on Solana. See
[which cubes support subscriptions](/docs/subscriptions/which-cubes-stream/).

## Related

- [Balances & Holders cubes](/docs/cubes/balances-cube/)
- [Build your own crypto P&L calculator](/docs/usecases/p-l-product/overview/)
- [Which cubes support subscriptions](/docs/subscriptions/which-cubes-stream/)
- [EVM Balance schema](/docs/schema/evm/balances/) · [EVM Token Holders schema](/docs/schema/evm/token-holders/)
