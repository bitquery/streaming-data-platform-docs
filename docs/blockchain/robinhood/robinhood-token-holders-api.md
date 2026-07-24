---
title: "Robinhood Token Holders API — Rankings, Counts & Distribution"
description: "Query Robinhood token holders with Bitquery GraphQL: top-holder rankings, holder counts, distribution stats, whale floors, dormancy screens, and stock-token holders."
sidebar_position: 7
keywords:
  - Robinhood token holders API
  - Robinhood top holders
  - Robinhood holder count
  - Robinhood token distribution
  - Robinhood richest wallets
  - Robinhood whale holders
  - Robinhood NVDA holders
  - Robinhood airdrop snapshot
  - Robinhood dormant holders
  - Bitquery Robinhood Holders
---
# Robinhood Token Holders API — Rankings, Counts & Distribution

Query **token holders on Robinhood** with Bitquery's dedicated `EVM.Holders` cube — the token-centric view: who holds a token, ranked by balance, with per-holder change history (`FirstChangeTime`, `LastChangeTime`, `UpdateCount`) built in. One query replaces the transfer-indexing pipeline you would otherwise need, and it powers holder leaderboards, holder counts, distribution stats, whale floors, dormancy screens, and airdrop snapshots.

For the wallet-centric view — one address's full portfolio — use the [Robinhood Balances API](/docs/blockchain/robinhood/robinhood-balances-api/) instead. Every query on this page was executed against the production endpoint before publishing.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::tip Related docs
- [Robinhood Balances API](/docs/blockchain/robinhood/robinhood-balances-api/)
- [Robinhood Token Supply API](/docs/blockchain/robinhood/robinhood-token-supply/)
- [Robinhood Transfers](/docs/blockchain/robinhood/robinhood-transfers/) (live movement between holders)
- [Robinhood Trades](/docs/blockchain/robinhood/robinhood-trades/) (prices to value holdings)
:::

**On this page:** [Concepts](#cube-concepts) · [Top holders](#top-holders-of-a-token) · [Holder count](#holder-count-of-a-token) · [Whale floors](#holders-above-a-balance-floor) · [Distribution](#holder-distribution-statistics) · [Dormant holders](#dormant-holders-diamond-hands) · [Stock tokens](#tokenized-stock-holders-nvda) · [ETH rich list](#native-eth-rich-list) · [Pagination](#paginating-full-holder-snapshots) · [FAQ](#faq)

---

## Cube concepts

- **Rows are (holder, token) pairs**: `Holder.Address` plus a `Balance` with `Amount`, `FirstChangeTime`, `LastChangeTime`, and `UpdateCount`. Select `Currency` fields when you query across tokens.
- Use **`dataset: archive`** — holder tables are computed from full history.
- **No USD field on this cube** — threshold and rank by token `Amount` (USDG ≈ dollars); join prices from the [Trades API](/docs/blockchain/robinhood/robinhood-trades/) to value holdings.
- **`Balance.LastChangeTime.till` filters by inactivity, not history**: a **future** date includes every holder (the current snapshot); a **past** date returns only wallets whose balance hasn't changed since then — with their frozen balances — which makes it a dormancy screen, not time travel.
- A plain `count` includes **everyone who ever held** (including now-zero balances). Add `Balance: { Amount: { gt: "0" } }` for **current** holders — the two numbers differ a lot on active tokens.
- The cube also accepts `Holder.Address` filters for wallet-side lookups, but portfolios are better served by the [Balances API](/docs/blockchain/robinhood/robinhood-balances-api/).

---

## Top holders of a token

The holder leaderboard — ranked by balance, with each holder's history stats. Example: USDG. The future-dated `LastChangeTime.till` explicitly includes all holders (see [concepts](#cube-concepts)); tighten it to screen for dormancy.

```graphql
{
  EVM(dataset: archive, network: robinhood) {
    Holders(
      where: {
        Currency: { SmartContract: { is: "0x5fc5360d0400a0fd4f2af552add042d716f1d168" } }
        Balance: { LastChangeTime: { till: "2026-07-31T11:59:59Z" } }
      }
      limit: { count: 100 }
      orderBy: { descending: Balance_Amount }
    ) {
      Holder {
        Address
      }
      Balance {
        Amount
        FirstChangeTime
        LastChangeTime
        UpdateCount
      }
    }
  }
}
```

---

## Holder count of a token

One number per question: how many wallets **currently** hold the token (with the `gt: "0"` filter), or how many **ever** held it (without).

```graphql
{
  EVM(dataset: archive, network: robinhood) {
    Holders(
      where: {
        Currency: { SmartContract: { is: "0x5fc5360d0400a0fd4f2af552add042d716f1d168" } }
        Balance: { Amount: { gt: "0" } }
      }
    ) {
      holders: count
    }
  }
}
```

Drop the `Balance` filter to count all-time holders instead.

---

## Holders above a balance floor

**Whale lists and eligibility checks:** a regular `where` filter on `Balance.Amount` keeps only holders above a threshold — for USDG, the floor is effectively in dollars.

```graphql
{
  EVM(dataset: archive, network: robinhood) {
    Holders(
      where: {
        Currency: { SmartContract: { is: "0x5fc5360d0400a0fd4f2af552add042d716f1d168" } }
        Balance: { Amount: { ge: "100000" } }
      }
      limit: { count: 10 }
      orderBy: { descending: Balance_Amount }
    ) {
      Holder {
        Address
      }
      Balance {
        Amount
      }
    }
  }
}
```

---

## Holder distribution statistics

Concentration analysis in one aggregate call: current holder count, total held, and the mean / median / 99th-percentile holder size. Expect a long tail — the median holder is typically far below the mean.

```graphql
{
  EVM(dataset: archive, network: robinhood) {
    Holders(
      where: {
        Currency: { SmartContract: { is: "0x5fc5360d0400a0fd4f2af552add042d716f1d168" } }
        Balance: { Amount: { gt: "0" } }
      }
    ) {
      holders: count
      total: sum(of: Balance_Amount)
      avg: average(of: Balance_Amount)
      med: median(of: Balance_Amount)
      p99: quantile(of: Balance_Amount, level: 0.99)
    }
  }
}
```

`standard_deviation` and other `quantile` levels are available for deeper concentration metrics (top-N share is easiest computed client-side from the [top holders](#top-holders-of-a-token) list against `total`).

---

## Dormant holders (diamond hands)

Set `LastChangeTime.till` to a **past** date to keep only wallets whose balance hasn't moved since then — their `Amount` is the balance frozen at their last change. Combine with `FirstChangeTime` and `UpdateCount` to separate long-term holders from one-touch airdrop recipients.

```graphql
{
  EVM(dataset: archive, network: robinhood) {
    Holders(
      where: {
        Currency: { SmartContract: { is: "0x5fc5360d0400a0fd4f2af552add042d716f1d168" } }
        Balance: { LastChangeTime: { till: "2026-07-01T00:00:00Z" }, Amount: { gt: "0" } }
      }
      limit: { count: 10 }
      orderBy: { descending: Balance_Amount }
    ) {
      Holder {
        Address
      }
      Balance {
        Amount
        FirstChangeTime
        LastChangeTime
        UpdateCount
      }
    }
  }
}
```

---

## Tokenized stock holders (NVDA)

Robinhood's tokenized equities are ordinary ERC-20s, so holder analytics work unchanged — `Amount` reads as the tokenized share count. Example: NVIDIA; swap in AAPL (`0xaf3d76f1834a1d425780943c99ea8a608f8a93f9`) or any other stock token.

```graphql
{
  EVM(dataset: archive, network: robinhood) {
    Holders(
      where: { Currency: { SmartContract: { is: "0xd0601ce157db5bdc3162bbac2a2c8af5320d9eec" } } }
      limit: { count: 10 }
      orderBy: { descending: Balance_Amount }
    ) {
      Holder {
        Address
      }
      Balance {
        Amount
        FirstChangeTime
        LastChangeTime
        UpdateCount
      }
    }
  }
}
```

---

## Native ETH rich list

Filter `Currency.Native: true` for the chain's largest ETH holders. **Contracts appear as holders** — the WETH contract naturally tops the list since it custodies wrapped ETH; filter or label known contracts for a people-only ranking.

```graphql
{
  EVM(dataset: archive, network: robinhood) {
    Holders(
      where: { Currency: { Native: true } }
      limit: { count: 10 }
      orderBy: { descending: Balance_Amount }
    ) {
      Holder {
        Address
      }
      Balance {
        Amount
      }
    }
  }
}
```

---

## Paginating full holder snapshots

**Airdrop snapshots and exports:** page through the complete holder set with `limit.offset`, keeping the same `orderBy` so pages don't overlap.

```graphql
{
  EVM(dataset: archive, network: robinhood) {
    Holders(
      where: { Currency: { SmartContract: { is: "0x5fc5360d0400a0fd4f2af552add042d716f1d168" } } }
      limit: { count: 5, offset: 5 }
      orderBy: { descending: Balance_Amount }
    ) {
      Holder {
        Address
      }
      Balance {
        Amount
      }
    }
  }
}
```

For very large one-off snapshots, Bitquery can also provide [data exports](https://bitquery.io/forms/api).

---

## Use-case patterns

| Goal | Approach |
| --- | --- |
| Holder leaderboard page | [Top holders](#top-holders-of-a-token), refreshed on your interval |
| Distribution / concentration dashboards | [Holder count](#holder-count-of-a-token) + [distribution stats](#holder-distribution-statistics); top-N share client-side |
| Airdrop eligibility & snapshots | [Balance floors](#holders-above-a-balance-floor) + [offset pagination](#paginating-full-holder-snapshots) |
| Diamond-hands / dormancy analysis | [`LastChangeTime` screens](#dormant-holders-diamond-hands) with `FirstChangeTime` / `UpdateCount` |
| Stock-token cap tables | [Tokenized stock holders](#tokenized-stock-holders-nvda) |
| Live movement between holders | Stream the token on the [Transfers API](/docs/blockchain/robinhood/robinhood-transfers/) |

---

## Tips

1. Use `dataset: archive` and always keep a `limit` — popular tokens have very large holder sets.
2. Add `Balance: { Amount: { gt: "0" } }` whenever you mean **current** holders; plain counts include every wallet that ever held.
3. There is no USD field on this cube — rank and threshold in token units (USDG ≈ dollars) and join prices from the [Trades API](/docs/blockchain/robinhood/robinhood-trades/) for valuations.
4. `LastChangeTime.till` in the future = full current snapshot; in the past = dormancy screen with frozen balances. It is not an as-of-date balance calculator — for historical *balances* use the [Balances API's date filter](/docs/blockchain/robinhood/robinhood-balances-api/).
5. Contracts are holders too (WETH tops native rankings by design) — maintain a label list to exclude them from people-only rankings.
6. `UpdateCount` separates active traders (high) from set-and-forget holders (low) at a glance.

---

## FAQ

### How do I get the top holders of a Robinhood token?

Query `EVM.Holders` on `dataset: archive`, filter `Currency.SmartContract`, and order by `Balance_Amount` descending — see [Top holders](#top-holders-of-a-token). Each row includes the holder's first/last change time and update count.

### How do I get a token's holder count?

Run the [holder-count query](#holder-count-of-a-token) with `Balance: { Amount: { gt: "0" } }` for current holders, or without it for all-time holders.

### Can I take an airdrop snapshot of all holders?

Yes — page through the full holder set with `limit: { count, offset }` under a stable `orderBy`, optionally with a [balance floor](#holders-above-a-balance-floor) for eligibility. For very large snapshots, ask about data exports.

### How do I find dormant or diamond-hand holders?

Set `Balance.LastChangeTime.till` to a past date — only wallets untouched since then return, with their frozen balances. See [Dormant holders](#dormant-holders-diamond-hands).

### Why is there no USD value on holder rows?

The Holders cube reports token amounts only. Use token-unit thresholds (USDG ≈ dollars), or multiply amounts by a price from the [Trades API](/docs/blockchain/robinhood/robinhood-trades/).

### Should I use Holders or Balances?

`Holders` is token-centric (one token → many wallets): rankings, counts, distribution. [`Balances`](/docs/blockchain/robinhood/robinhood-balances-api/) is wallet-centric (one wallet → many tokens): portfolios, multi-address batches, and as-of-date balance history.
