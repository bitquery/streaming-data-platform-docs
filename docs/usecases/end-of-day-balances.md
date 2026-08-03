---
title: "End of Day Balances - Historical Balance Snapshots"
sidebar_label: "End-of-day balances"
description: "Get an address's token balance as of a past date on EVM, Tron and Solana, for accounting, tax reporting and reconciliation."
keywords:
  - end of day balance
  - historical balance API
  - balance as of date
  - token balance snapshot
  - crypto accounting API
  - point in time balance
  - Holders date snapshot
---

# End-of-day balances

Accounting, tax reporting and reconciliation all need the same thing: what an address held at
the close of a given day, not what it holds now. This page covers that on EVM, Tron and Solana.

For current holdings instead, see the [wallet portfolio recipe](/docs/usecases/wallet-portfolio-api/).

## EVM and Tron

The `Holders` cube takes a `date` argument and returns the holder set as of that date. Filter it
to a single address and you have that address's end-of-day balance.

```graphql
query EndOfDayBalance {
  EVM(network: eth, dataset: archive) {
    Holders(
      date: "2026-07-01"
      where: {
        Currency: { SmartContract: { is: "0xdac17f958d2ee523a2206206994597c13d831ec7" } }
        Holder: { Address: { is: "0x28c6c06298d514db089934071355e5743bf21d60" } }
      }
    ) {
      Holder {
        Address
      }
      balance: sum(of: Balance_Amount)
    }
  }
}
```

Run it across consecutive dates and you get a genuine daily series, not a running total:

| Date | USDT balance |
|---|---:|
| 2026-06-28 | 520,591,652.30 |
| 2026-06-29 | 638,001,909.50 |
| 2026-06-30 | 561,901,590.46 |
| 2026-07-01 | 819,349,860.88 |
| 2026-07-02 | 550,887,384.37 |

(An exchange hot wallet, so the swings are real activity rather than an artefact.)

`date` is a single scalar, so a range means one request per day. Issue them in parallel and
assemble the series client-side.

The same query shape works on Tron with `Tron { Holders(...) }`.

:::caution Use `dataset: archive` for past dates
The default realtime dataset only carries a recent window, so an older `date` comes back empty
and looks like the address held nothing. Empty results here almost always mean the wrong
dataset rather than a zero balance.
:::

### The same series from `Balances`

`Balances` carries **daily aggregates**, one row per address per day, exposed as `Block.Date`.
That makes it the more natural source for a series, because a single query returns every day at
once instead of one request per date:

```graphql
query DailyBalanceSeries {
  EVM(network: eth, dataset: archive) {
    Balances(
      where: {
        Balance: { Address: { is: "0x28c6c06298d514db089934071355e5743bf21d60" } }
        Currency: { SmartContract: { is: "0xdac17f958d2ee523a2206206994597c13d831ec7" } }
      }
      orderBy: { descending: Block_Date }
      limit: { count: 30 }
    ) {
      Block {
        Date
      }
      Balance {
        Amount
        AmountInUSD
      }
    }
  }
}
```

For a single past date, add `Block: { Date: { till: "2026-07-01" } }` and keep the descending
order — the first row is that day's closing balance.

:::caution Always order by `Block_Date`
Without `orderBy: { descending: Block_Date }` you get an arbitrary day's row, not the latest or
the one you filtered to. The query still succeeds, so the mistake is silent — it looks like a
current balance and is not.

With the ordering, `Balances` and `Holders(date: …)` agree exactly. Both return
`819349860.876615` for the wallet and date above.
:::

## Solana

Solana has no `Holders` cube, so take the last balance update at or before the cutoff. `limitBy`
collapses to one row per mint:

```graphql
query SolanaEndOfDayBalance {
  Solana {
    BalanceUpdates(
      where: {
        BalanceUpdate: {
          Account: { Owner: { is: "5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9" } }
        }
        Block: { Time: { till: "2026-08-02T23:59:59Z" } }
      }
      orderBy: { descending: Block_Time }
      limitBy: { by: BalanceUpdate_Currency_MintAddress, count: 1 }
      limit: { count: 50 }
    ) {
      Block {
        Time
      }
      BalanceUpdate {
        PostBalance
        PostBalanceInUSD
        Currency {
          Symbol
          MintAddress
        }
      }
    }
  }
}
```

Three parts do the work, and dropping any one of them gives a wrong answer:

- `Block: { Time: { till: ... } }` sets the cutoff.
- `orderBy: { descending: Block_Time }` puts the most recent update first.
- `limitBy` on the mint keeps exactly one row per token.

`PostBalance` is the balance immediately after that update, which is the balance the address
carried into the next day. The returned `Block.Time` tells you how stale the figure is: a token
last touched weeks before the cutoff still reports its correct balance, just with an older
timestamp.

## Reconciliation notes

- **Set your day boundary explicitly.** `till: "2026-08-02T23:59:59Z"` is UTC. If your books
  close in another timezone, convert before querying rather than after.
- **A missing row is not a zero balance.** On Solana, an address that never held a token has no
  balance update for it at all. Treat absent and zero as different cases.
- **Large tokens can time out.** A dated `Holders` query filtered to one address is cheap, but
  the same query without an address filter on a token with millions of holders may exceed the
  request timeout. Always include the address filter when you want one balance.
- **Cross-check one date against a block explorer** before trusting a whole series. It is the
  fastest way to catch a timezone or dataset mistake.

## Related

- [Wallet portfolio](/docs/usecases/wallet-portfolio-api/) — current holdings
- [Balances & Holders cubes](/docs/cubes/balances-cube/)
- [Build your own crypto P&L calculator](/docs/usecases/p-l-product/overview/)
