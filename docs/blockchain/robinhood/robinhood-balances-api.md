---
title: "Robinhood Balances API — Wallet Portfolios & History"
description: "Query Robinhood wallet balances with Bitquery GraphQL: full portfolios, multi-address batches, wallet profiling, and balance history as of any date."
sidebar_position: 6
keywords:
  - Robinhood balances API
  - Robinhood wallet balance
  - Robinhood portfolio API
  - Robinhood balance history
  - eth_getBalance alternative
  - Bitquery Robinhood Balances
---
# Robinhood Balances API — Wallet Portfolios & History

Query **wallet balances on Robinhood** with Bitquery GraphQL. The `EVM.Balances` cube returns **computed balances with built-in aggregates** — amount, USD value, first/last change time, and update count — grouped by whatever dimensions you select: one wallet's full portfolio, a batch of wallets, or network-wide per-currency totals, all in single calls that would take thousands of `eth_getBalance` / `balanceOf` RPCs. For token-centric holder rankings and counts, use the dedicated [Token Holders API](/docs/blockchain/robinhood/robinhood-token-holders-api/).

Every query on this page was executed against the production endpoint before publishing.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::tip Related docs
- [Robinhood Token Holders API](/docs/blockchain/robinhood/robinhood-token-holders-api/)
- [Robinhood Token Supply API](/docs/blockchain/robinhood/robinhood-token-supply/)
- [Robinhood Transfers](/docs/blockchain/robinhood/robinhood-transfers/)
- [Robinhood Trades](/docs/blockchain/robinhood/robinhood-trades/) (for prices to value non-ETH holdings)
- [Robinhood Events API](/docs/blockchain/robinhood/robinhood-events-api/)
:::

**On this page:** [Concepts](#datasets-grouping-and-selectwhere) · [Portfolio](#all-token-balances-of-an-address-portfolio) · [As-of-date](#balance-as-of-a-date-time-travel) · [Single token](#native-eth-and-single-token-balances) · [Multi-address](#balances-for-multiple-addresses) · [Wallet profile](#wallet-profile-first-seen-last-active-update-count) · [Currency totals](#network-wide-per-currency-totals) · [FAQ](#faq)

---

## Why query balances here instead of an RPC loop

| | Node RPC (`eth_getBalance` / `balanceOf` calls) | Bitquery Balances |
| --- | --- | --- |
| Whole portfolio | One call **per token** you already know about | One call returns every token the wallet holds |
| Token holders | Impossible without indexing all transfers yourself | One sortable query on the [Holders API](/docs/blockchain/robinhood/robinhood-token-holders-api/) |
| History | Archive node + block-pinned calls | `Block.Date.till` gives the balance as of any date |
| Extras | — | USD value, first/last change time, update count |

---

## Datasets, grouping, and selectWhere

- Use **`dataset: combined`** — balances are computed from history, and combined guarantees the full picture.
- **Grouping follows your selection.** Filter/select `Balance.Address` to get per-wallet rows; select only `Currency` to get network-wide per-currency totals; select both for wallet × token rows.
- **`selectWhere` filters aggregated results** (like SQL `HAVING`): `Amount(selectWhere: { gt: "0" })` drops zero/dust rows after the balance is computed. Amount thresholds are strings.
- **`AmountInUSD` is populated for native ETH; token rows generally return `0`.** USDG is a dollar stablecoin, so its `Amount` is effectively USD; value other tokens by joining prices from the [Trades API](/docs/blockchain/robinhood/robinhood-trades/).

---

## All token balances of an address (portfolio)

Everything a wallet holds in one call. The `selectWhere` keeps only non-zero rows.

```graphql
{
  EVM(network: robinhood, dataset: combined) {
    Balances(
      where: { Balance: { Address: { is: "0x9c0489b89ae473de6edcb159f21c3019ba730282" } } }
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

---

## Balance as of a date (time travel)

Add `Block.Date.till` to compute the same portfolio **as of any date** — audits, tax snapshots, "what did this whale hold before the launch". A date before the wallet's first activity returns no rows.

```graphql
{
  EVM(network: robinhood, dataset: combined) {
    Balances(
      where: {
        Block: { Date: { till: "2026-07-20" } }
        Balance: { Address: { is: "0x9c0489b89ae473de6edcb159f21c3019ba730282" } }
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

---

## Native ETH and single-token balances

Filter `Currency.Native: true` for the ETH balance, or pin one contract for a single token — with the change-history aggregates included.

```graphql
{
  EVM(network: robinhood, dataset: combined) {
    Balances(
      where: {
        Balance: { Address: { is: "0x9c0489b89ae473de6edcb159f21c3019ba730282" } }
        Currency: { Native: true }
      }
    ) {
      Currency {
        Symbol
        Native
      }
      Balance {
        Amount
        AmountInUSD
      }
    }
  }
}
```

```graphql
{
  EVM(network: robinhood, dataset: combined) {
    Balances(
      where: {
        Balance: { Address: { is: "0x9c0489b89ae473de6edcb159f21c3019ba730282" } }
        Currency: { SmartContract: { is: "0x0bd7d308f8e1639fab988df18a8011f41eacad73" } }
      }
    ) {
      Currency {
        Symbol
        SmartContract
      }
      Balance {
        Amount
        AmountInUSD
        FirstChangeTime
        LastChangeTime
        UpdateCount
      }
    }
  }
}
```

---

## Balances for multiple addresses

Batch a watchlist with `Address.in` — one row per address (per selected currency).

```graphql
{
  EVM(network: robinhood, dataset: combined) {
    Balances(
      where: {
        Balance: {
          Address: {
            in: [
              "0x9c0489b89ae473de6edcb159f21c3019ba730282"
              "0xcaf681a66d020601342297493863e78c959e5cb2"
            ]
          }
        }
        Currency: { Native: true }
      }
    ) {
      Balance {
        Address
        Amount
        AmountInUSD
      }
    }
  }
}
```

---

## Token holders

Holder rankings, counts, whale floors, distribution stats, and dormancy screens have a dedicated cube and page — see the **[Robinhood Token Holders API](/docs/blockchain/robinhood/robinhood-token-holders-api/)**.

---

## Wallet profile: first seen, last active, update count

The built-in aggregates turn balances into a wallet profiler: `FirstChangeTime` (when the wallet first touched each asset), `LastChangeTime` (most recent activity), and `UpdateCount` (how many balance changes) — age, dormancy, and activity signals with no extra indexing.

```graphql
{
  EVM(network: robinhood, dataset: combined) {
    Balances(
      where: { Balance: { Address: { is: "0x9c0489b89ae473de6edcb159f21c3019ba730282" } } }
    ) {
      Currency {
        Symbol
        SmartContract
      }
      Balance {
        Amount(selectWhere: { gt: "0" })
        FirstChangeTime
        LastChangeTime
        UpdateCount
      }
    }
  }
}
```

---

## Network-wide per-currency totals

With no address dimension, rows group per currency: `Amount` becomes the **total held across all addresses**, with network-level change stats — the full field set of the cube on display.

```graphql
{
  EVM(network: robinhood, dataset: combined) {
    Balances(limit: { count: 10 }) {
      Currency {
        Decimals
        Symbol
        SmartContract
        DelegatedTo
        Fungible
        HasURI
        Name
        Native
        ProtocolName
      }
      Balance {
        Amount(selectWhere: { gt: "0" })
        AmountInUSD
        FirstChangeTime
        LastChangeTime
        UpdateCount
      }
    }
  }
}
```

---

:::tip Continuous balance data via Kafka
Need balance changes as a continuous feed? Bitquery delivers Robinhood token data as **Kafka streams** (protobuf topic `robinhood.tokens.proto`) with consumer-group scaling and replay. See [Kafka Streaming Concepts](/docs/streams/kafka-streaming-concepts/).
:::

---

## Use-case patterns

| Goal | Approach |
| --- | --- |
| Wallet / portfolio page | [Portfolio query](#all-token-balances-of-an-address-portfolio); poll on an interval for live UX |
| Tax / audit snapshots | [Balance as of a date](#balance-as-of-a-date-time-travel) with `Block.Date.till` |
| Token distribution, rich lists & whales | [Token Holders API](/docs/blockchain/robinhood/robinhood-token-holders-api/) rankings, counts, and balance floors |
| Wallet profiling (age, dormancy) | [First/last change + update count](#wallet-profile-first-seen-last-active-update-count) |
| Exchange / custody monitoring | [Multi-address batch](#balances-for-multiple-addresses) on a polling schedule |
| Supply-side view | [Per-currency totals](#network-wide-per-currency-totals), or the [Token Supply API](/docs/blockchain/robinhood/robinhood-token-supply/) |

---

## Tips

1. Always use **`dataset: combined`** for balance queries — balances are computed from full history.
2. Remember grouping follows selection: add or drop `Balance.Address` / `Currency` fields to pivot between wallet, token, and network views.
3. Use `selectWhere` (post-aggregation) for balance thresholds; regular `where` filters raw rows before aggregation.
4. `AmountInUSD` is native-ETH-only in practice — USDG's `Amount` ≈ dollars; price other tokens via the [Trades API](/docs/blockchain/robinhood/robinhood-trades/).
5. For holder rankings and counts, use the dedicated [Token Holders API](/docs/blockchain/robinhood/robinhood-token-holders-api/) — its `Holders` cube is built for the token-centric view.
6. An as-of-date query before a wallet's first activity returns no rows — that's the correct answer, not an error.

---

## FAQ

### How do I get all token balances of a Robinhood address?

Query `EVM.Balances` on `dataset: combined` filtered by `Balance.Address`, selecting `Currency` and `Balance.Amount` — one call returns the full portfolio. Add `Amount(selectWhere: {gt: "0"})` to hide dust and emptied positions.

### How do I get the balance at a past date?

Add `Block: { Date: { till: "YYYY-MM-DD" } }` to any balance query — the cube recomputes balances as of that date. See [time travel](#balance-as-of-a-date-time-travel).

### How do I list the top holders of a token?

Use the dedicated [Token Holders API](/docs/blockchain/robinhood/robinhood-token-holders-api/) — its `Holders` cube returns sortable holder rankings, holder counts, distribution stats, and dormancy screens.

### Why is AmountInUSD 0 for my token balances?

USD enrichment covers native ETH; token rows generally return `0`. USDG is a dollar stablecoin (read `Amount` as USD), and other tokens can be valued by joining prices from the [Trades API](/docs/blockchain/robinhood/robinhood-trades/).

### Can I stream balances in real time?

`Balances` is a query cube — poll it on your interval for live UX. For continuous balance-change feeds at firehose scale, Bitquery delivers Robinhood token data over [Kafka streams](/docs/streams/kafka-streaming-concepts/).

### Is this a replacement for eth_getBalance?

For anything beyond a single known token it's strictly stronger: whole portfolios, holder lists, holder counts, historical as-of-date balances, and change aggregates come from single queries instead of RPC loops over an archive node.
