---
title: "Address Labels API — Identify Crypto Wallets"
description: "Identify wallets and contracts with the Bitquery Address Labels API: exchange hot and cold wallets, deposit addresses, token contracts and clones, any chain."
keywords:
  - address labels API
  - wallet labels API
  - crypto address labels
  - blockchain address labels
  - identify crypto wallet owner
  - exchange wallet address API
  - CEX hot wallet address
  - CEX cold wallet address
  - exchange deposit address API
  - token contract labels
  - fake token detection
  - USDT blacklist API
  - USDC blacklist API
  - issuer blocked addresses
  - wallet entity attribution
  - address enrichment API
  - know your wallet
  - multichain address labels
  - Bitcoin address labels
  - Solana wallet labels
  - Tron address labels
  - Bitquery Metadata cube
---

import FAQ from "@site/src/components/FAQ";

# Address Labels API — Identify Crypto Wallets

The Address Labels API tells you **who is behind a blockchain address**: which exchange owns a
hot wallet, whether an address is a per-user deposit address, whether a contract is a token
(or a clone imitating one), and whether an address has been frozen by a stablecoin issuer.
One GraphQL query — `Metadata { Labels }` — answers this across EVM chains, Solana, Bitcoin,
and Tron.

|                |                                                                                          |
| -------------- | ---------------------------------------------------------------------------------------- |
| **Cube**       | `Metadata.Labels`                                                                          |
| **Endpoints**  | `https://streaming.bitquery.io/graphql` and `https://streaming.bitquery.io/eap`             |
| **Auth**       | [OAuth token](/docs/authorization/how-to-generate) as `Authorization: Bearer <token>`        |
| **Required**   | An `Address` filter on every query                                                          |
| **Batch size** | Up to **100 addresses** per query                                                           |
| **Streaming**  | Query-only — no subscription. Poll `RecordedAt` for new labels                              |

Most people use it as the second step of a two-query pattern: pull addresses from an activity
API such as [DEXTrades](/docs/cubes/dextrades) or [Transfers](/docs/cubes/transfers-cube),
then resolve those addresses to entities here — to enrich analytics, screen flows for exchange
or gambling exposure, or strip exchange and contract addresses out of "real user" metrics.

## Rules that matter

1. **The `Address` filter is mandatory.** Every query must pin `Address` with `is` or `in`. There is no way to list all addresses carrying a label. Without it you get: `"Labels query requires a Address filter in the where clause"`.
2. **Up to 100 addresses per query.** Split larger lists into batches of 100.
3. **Matching is exact and case-sensitive.** Pass EVM addresses in **lowercase** — a checksummed `0xAbC…` returns zero rows. Bitcoin, Solana, and Tron addresses are case-sensitive by nature, so pass them exactly as they appear on-chain.
4. **Labels are append-only records.** An address returns one row per chain, per label, per recording pass, so the same label recurs with different `RecordedAt` values. Fold that into a current view with `limitBy` — [shown below](#how-to-get-only-the-current-labels).

## How to look up labels for one address

```graphql
{
  Metadata {
    Labels(
      where: {Address: {in: ["0x18e296053cbdf986196903e889b7dca7a73882f6"]}}
    ) {
      Address
      Chain
      Label {
        Type
        Value
      }
      RecordedAt
    }
  }
}
```

The response identifies the address as a Bybit hot wallet on every chain where it is labeled
(abridged — the full response also repeats labels recorded on earlier passes):

```json
{
  "Metadata": {
    "Labels": [
      {
        "Address": "0x18e296053cbdf986196903e889b7dca7a73882f6",
        "Chain": "ethereum",
        "Label": { "Type": "cex-hot-wallet", "Value": "bybit-hot-1" },
        "RecordedAt": "2026-07-31T13:11:13Z"
      },
      {
        "Address": "0x18e296053cbdf986196903e889b7dca7a73882f6",
        "Chain": "bsc",
        "Label": { "Type": "cex-hot-wallet", "Value": "bybit-hot" },
        "RecordedAt": "2026-07-31T13:11:26Z"
      }
    ]
  }
}
```

## How to get only the current labels

Because records accumulate, most applications want the **latest record per address, chain, and
label type**. `limitBy` plus a `RecordedAt` sort does exactly that, and this is the shape you
should reach for by default:

```graphql
{
  Metadata {
    Labels(
      where: {Address: {is: "0x18e296053cbdf986196903e889b7dca7a73882f6"}}
      limitBy: {by: [Address, Chain, Label_Type], count: 1}
      orderBy: {descending: RecordedAt}
    ) {
      Address
      Chain
      Label {
        Type
        Value
      }
      RecordedAt
    }
  }
}
```

This returns one clean row per chain instead of the wallet's full recording history. Note the
nested field is addressed as `Label_Type` in `limitBy` and `orderBy` — the groupable and
sortable names are `Address`, `Chain`, `Label_Type`, `Label_Value`, and `RecordedAt`.

Keep `Label_Type` in the `limitBy` key unless you deliberately want one row per address: an
address can legitimately carry several different labels, since a token contract is often
tagged both `token-contract` and `contract`.

## How to label up to 100 addresses at once

Pass the list as a variable. This is the shape to use when enriching the output of another
query — top traders, transfer counterparties, or token holders:

```graphql
query ($addresses: [String!]) {
  Metadata {
    Labels(
      where: {Address: {in: $addresses}}
      limitBy: {by: [Address, Chain, Label_Type], count: 1}
      orderBy: {descending: RecordedAt}
    ) {
      Address
      Chain
      Label {
        Type
        Value
      }
      RecordedAt
    }
  }
}
```

```json
{
  "addresses": [
    "0x18e296053cbdf986196903e889b7dca7a73882f6",
    "0x28c6c06298d514db089934071355e5743bf21d60"
  ]
}
```

Addresses with no labels are simply absent from the response — no error and no placeholder
row. Anything missing is "unlabeled so far", which in wallet analytics usually means an
ordinary user wallet.

## How to check if an address is an exchange wallet

Combine a batch with a `Label.Type` filter to keep only exchange-owned addresses:

```graphql
{
  Metadata {
    Labels(
      where: {
        Address: {in: [
          "0x28c6c06298d514db089934071355e5743bf21d60",
          "0x18e296053cbdf986196903e889b7dca7a73882f6",
          "0x7a250d5630b4cf539739df2c5dacb4c659f2488d"
        ]}
        Label: {Type: {in: ["cex-hot-wallet", "cex-cold-wallet", "cex-deposit-address"]}}
        Chain: {is: "ethereum"}
      }
      limitBy: {by: [Address, Label_Type], count: 1}
      orderBy: {descending: RecordedAt}
    ) {
      Address
      Label {
        Type
        Value
      }
      RecordedAt
    }
  }
}
```

Only the Binance and Bybit hot wallets come back. The Uniswap router drops out because its
labels (`contract: uniswap`) don't match the requested types — which is exactly how you
separate exchange addresses from protocol contracts in a mixed list.

## How to screen for issuer-blocked (frozen) addresses

Stablecoin issuers freeze addresses on their own contracts. `issuer-blocked-usdt` and
`issuer-blocked-usdc` capture those, so a `startsWith` filter screens for both at once:

```graphql
{
  Metadata {
    Labels(
      where: {
        Address: {in: [
          "0x098b716b8aaf21512996dc57eb0615e2383e2f96",
          "0x28c6c06298d514db089934071355e5743bf21d60"
        ]}
        Label: {Type: {startsWith: "issuer-blocked"}}
      }
      limitBy: {by: [Address, Label_Type], count: 1}
      orderBy: {descending: RecordedAt}
    ) {
      Address
      Chain
      Label {
        Type
        Value
      }
    }
  }
}
```

## How to label Bitcoin, Tron, and Solana addresses

Address formats mix freely in one batch — each row's `Chain` tells you where the label
applies:

```graphql
{
  Metadata {
    Labels(
      where: {Address: {in: [
        "34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo",
        "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
        "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"
      ]}}
      limitBy: {by: [Address, Chain, Label_Type], count: 1}
      orderBy: {descending: RecordedAt}
    ) {
      Address
      Chain
      Label {
        Type
        Value
      }
    }
  }
}
```

This resolves a Binance Bitcoin cold wallet (`Chain: "bitcoin"`), the USDT contract on Tron
(`Chain: "tron"`), and a Binance cold wallet on Solana (`Chain: "solana"`).

## How to watch for newly added labels

The cube has no subscription, so poll the addresses you track with a `RecordedAt` window and
keep the high-water mark on your side:

```graphql
{
  Metadata {
    Labels(
      where: {
        Address: {is: "0x18e296053cbdf986196903e889b7dca7a73882f6"}
        RecordedAt: {since: "2026-07-15T00:00:00Z"}
      }
    ) {
      Chain
      Label {
        Type
        Value
      }
      RecordedAt
    }
  }
}
```

## How to aggregate labels

The cube supports the standard [metrics](/docs/graphql/calculations) `count` and `uniq`, and
the dimensions you select become the grouping key. This counts label records and distinct
labeled addresses per chain:

```graphql
{
  Metadata {
    Labels(
      where: {Address: {in: [
        "0x18e296053cbdf986196903e889b7dca7a73882f6",
        "0x28c6c06298d514db089934071355e5743bf21d60",
        "0xdac17f958d2ee523a2206206994597c13d831ec7"
      ]}}
    ) {
      Chain
      count
      uniq(of: Address)
    }
  }
}
```

## Filters

Full [filter](/docs/graphql/filters) support applies on top of the mandatory `Address`:

| Filter | Operators | Notes |
| --- | --- | --- |
| `Address` | `is`, `in` **only** | Mandatory, max 100 in `in`. No negation — you cannot exclude addresses server-side. |
| `Chain` | `is`, `in`, `not`, `notIn`, `like`, `includes`, `startsWith`, … | Exact chain slugs — see the table below. |
| `Label: {Type: …}` | full string set | e.g. `{is: "cex-hot-wallet"}` |
| `Label: {Value: …}` | full string set | e.g. `{startsWith: "binance"}` |
| `RecordedAt` | `since`, `till`, `after`, `before`, `is`, plus `_relative` variants | Standard [DateTime filters](/docs/graphql/datetime). |
| `any` | list of sub-filters | OR-combinator across conditions. |

## Response fields

| Field | Type | Meaning |
| --- | --- | --- |
| `Address` | String | The queried address, exactly as stored (EVM addresses lowercase). |
| `Chain` | String | Chain this label applies to — one address maps to many chains. |
| `Label.Type` | String | Label category — see below. |
| `Label.Value` | String | Entity slug within the category, e.g. `binance-hot-1`, `bybit-hot`, `wavax`, `banned-by-usdt`. Numbered suffixes distinguish instances of the same entity. |
| `RecordedAt` | DateTime | When the labeling pipeline wrote this record. Re-confirmation appends a new record rather than updating the old one. |

### Supported chains

`Chain` values are plain slugs and the set grows as coverage expands. Verified live:

| Ecosystem | `Chain` values |
| --- | --- |
| EVM | `ethereum`, `bsc`, `polygon`, `arbitrum`, `base`, `avalanche-c`, `fantom`, `ethpow` |
| Non-EVM | `bitcoin`, `tron`, `solana` |

If you're unsure what a chain is called, query a known address from it without a `Chain`
filter and read the slug off the response.

### Label types

`Label.Type` is an **open taxonomy** — new categories appear as the pipeline learns new entity
classes, so handle unknown types gracefully. The common ones:

| `Label.Type` | Meaning | Example `Value` |
| --- | --- | --- |
| `cex-hot-wallet` | Exchange-operated hot wallet | `binance-hot-1`, `bybit-hot` |
| `cex-cold-wallet` | Exchange cold storage | `binance-cold` |
| `cex-deposit-address` | Per-user deposit address swept to an exchange | `coinex-deposit` |
| `token-contract` | A token's contract or mint address | `usdt`, `wavax`, `wbnb` |
| `token-clone` | Contract imitating a well-known token | `clone-wmatic-2` |
| `contract` | General smart-contract tag | `uniswap`, `bridge`, `stablecoin` |
| `gambling` | Gambling operator wallet | `stake-com-hot` |
| `issuer-blocked-usdt` | Frozen or blacklisted by Tether | `banned-by-usdt` |
| `issuer-blocked-usdc` | Frozen or blacklisted by Circle | `banned-by-usdc` |

## Limits and common errors

- **Missing `Address` filter** — fails with `"Labels query requires a Address filter in the where clause"`. A `Chain` or `Label` filter alone does not satisfy it.
- **Wrong casing** — a checksummed EVM address silently returns zero rows. Lowercase before querying.
- **No negation on `Address`** — `not`/`notIn` aren't part of the `Address` filter. Exclusion belongs client-side, or in `Chain`/`Label` filters, which do support it.
- **Subscriptions** — `subscription { Metadata { … } }` is rejected; the cube exists only under `query`.
- **Empty result is not an error** — unlabeled addresses, and an empty `in: []`, return an empty list.
- **[`limit` / `limitBy`](/docs/graphql/limits) and [`orderBy`](/docs/graphql/sorting)** behave as on every other cube.

## Pick the right query

| You need | Use |
| --- | --- |
| Who is behind one address | `Address: {is: …}` |
| Enrich a list of ≤100 addresses | `Address: {in: …}` with `limitBy: {by: [Address, Chain, Label_Type], count: 1}` |
| Exchange-wallet screening | `Label: {Type: {in: ["cex-hot-wallet", "cex-cold-wallet", "cex-deposit-address"]}}` |
| Fake-token checks | `Label: {Type: {is: "token-clone"}}` |
| Sanctions and issuer-freeze screening | `Label: {Type: {startsWith: "issuer-blocked"}}` |
| Newly labeled addresses | Poll with `RecordedAt: {since: …}` |

<FAQ
  items={[
    { q: "What is the Bitquery Address Labels API?", a: "It is the Metadata.Labels cube in Bitquery's GraphQL API. It maps a blockchain address to the real-world entity behind it — exchange hot and cold wallets, per-user deposit addresses, token contracts and clones, gambling operators, and addresses frozen by stablecoin issuers — across EVM chains, Solana, Bitcoin and Tron." },
    { q: "Is the Address filter required?", a: "Yes. Every Labels query must pin the Address field with is or in. Without it the API returns the error 'Labels query requires a Address filter in the where clause'. A Chain or Label filter alone does not satisfy the requirement." },
    { q: "How many addresses can I look up in one query?", a: "Up to 100 addresses per query in the Address in list. To enrich a larger set, split it into batches of 100 and issue one query per batch." },
    { q: "Can I list every address that has a given label?", a: "No. Because the Address filter is mandatory, the API answers 'what labels does this address have' rather than 'which addresses have this label'. You supply the candidate addresses, then filter them by label type or value." },
    { q: "Why does my address return no labels?", a: "Either the address genuinely has no label yet, or the casing is wrong. Matching is exact and case-sensitive, so EVM addresses must be lowercase — a checksummed address returns zero rows. Unlabeled addresses are simply absent from the response rather than returning an error." },
    { q: "Why does one address return multiple rows with the same label?", a: "Labels are append-only records. Each time the pipeline re-confirms a label it appends a new row with a fresh RecordedAt timestamp, and an address can also be labeled on several chains. Use limitBy with the key Address, Chain, Label_Type and count 1, ordered by descending RecordedAt, to get one current row per label." },
    { q: "Can I subscribe to label updates in real time?", a: "No. The Metadata cube is query-only and does not exist under the GraphQL subscription root, so labels cannot be streamed. To pick up new labels, poll the addresses you track with a RecordedAt since filter and keep the high-water mark on your side." },
    { q: "Which blockchains have address labels?", a: "Verified chains include Ethereum, BSC, Polygon, Arbitrum, Base, Avalanche C-Chain, Fantom and EthereumPoW on the EVM side, plus Bitcoin, Tron and Solana. The set grows as label coverage expands, and a single address can carry different labels on different chains." },
  ]}
/>

## Related

- [DEXTrades cube](/docs/cubes/dextrades) — trade activity whose maker and taker addresses you can label
- [Transfers cube](/docs/cubes/transfers-cube) — transfer counterparties to enrich
- [Balances & Holders cubes](/docs/cubes/balances-cube) — what the addresses you identified actually hold
- [Filtering](/docs/graphql/filters), [Sorting](/docs/graphql/sorting), [Limits](/docs/graphql/limits) — the query mechanics used above
