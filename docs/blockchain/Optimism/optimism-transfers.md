---
title: "Optimism Transfers API: Token and ETH Transfers, Whale Alerts, Backfills"
description: "Query and stream Optimism token and ETH transfers with Bitquery GraphQL: large USDT moves, one wallet, NFT transfers and gap-free backfills."
keywords:
  - Optimism transfers API
  - Optimism token transfers GraphQL
  - Optimism whale alerts
  - Optimism wallet transfers
  - backfill Optimism transfers
---

import FAQ from "@site/src/components/FAQ";

# Optimism Transfers API: Token and ETH Transfers, Whale Alerts, Backfills

Every ERC-20, ERC-721, ERC-1155 and native ETH transfer on Optimism lands in the `Transfers` cube under `EVM(network: optimism)`, with sender, receiver, amount, USD value where a price exists, the token's contract and symbol, and the transaction that carried it. The same filters run as a query for the latest rows or as a subscription for a live feed, and `dataset: combined` on the root reaches history. Every example runs in the [IDE](https://ide.bitquery.io) on a free account.

## Large transfers of one token

USDT on Optimism, transfers of 10,000 or more in the last day. Saved as a live stream [here](https://ide.bitquery.io/Whale-transfers-of-USDT-on-optimism); the query form below is the same filter with a window and a limit.

```graphql
{
  EVM(network: optimism) {
    Transfers(
      where: {
        Transfer: {
          Currency: { SmartContract: { is: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58" } }
          Amount: { ge: "10000" }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Currency {
          Symbol
          Name
          SmartContract
        }
      }
      Transaction {
        Hash
      }
    }
  }
}
```

For an alert, change `query` to `subscription` and drop `Block`, `limit` and `orderBy`; each qualifying transfer arrives as it is indexed.

## Transfers of one wallet

Filter `Sender` or `Receiver`, or both with an `any` block, on the address. Saved stream [here](https://ide.bitquery.io/Sender-is-a-particular-address); a wallet that is idle streams nothing, so run the query form with `dataset: combined` first to see what it has done.

```graphql
{
  EVM(network: optimism, dataset: combined) {
    Transfers(
      where: { Transfer: { Sender: { is: "0xEbe80f029b1c02862B9E8a70a7e5317C06F62Cae" } } }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Transfer {
        Amount
        AmountInUSD
        Currency {
          Name
          SmartContract
          Native
          Symbol
        }
        Receiver
        Sender
      }
      Transaction {
        Hash
      }
    }
  }
}
```

## NFT transfers

`Currency.Fungible: false` keeps ERC-721 and ERC-1155 rows only; `Id` is the token id and `URI` the metadata link. Saved stream [here](https://ide.bitquery.io/NFT-Token-Transfers-API_1); the [Optimism NFT API](/docs/blockchain/Optimism/optimism-nft) page covers collections and holders.

```graphql
{
  EVM(network: optimism) {
    Transfers(
      where: { Transfer: { Currency: { Fungible: false } } }
      limit: { count: 5 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Transfer {
        Currency {
          Name
          Symbol
          SmartContract
        }
        Id
        Sender
        Receiver
      }
    }
  }
}
```

## Deterministic pagination for backfilling

To load transfers into your own index without gaps or repeats, page in a fixed order. The composite `orderBy` over block number, transaction index, call index, log index, transfer index and type positions every transfer uniquely; move `offset` by `count` on each request. A single request can return up to 25,000 rows. This ordering runs on the realtime window; on the `archive` dataset, order by `Block_Number` and page through one block range at a time instead. Saved [here](https://ide.bitquery.io/Reliable-transfer-api).

```graphql
{
  EVM(network: optimism) {
    Transfers(
      where: { Transfer: { Success: true } }
      orderBy: {
        ascending: [
          Block_Number,
          Transaction_Index,
          Call_Index,
          Log_Index,
          Transfer_Index,
          Transfer_Type
        ]
      }
      limit: { count: 10, offset: 0 }
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
        From
        Index
      }
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Index
        Currency {
          Symbol
          Name
          SmartContract
          Decimals
          Native
        }
      }
      Call {
        Index
      }
      Log {
        LogAfterCallIndex
        Index
      }
      Transfer {
        Type
      }
    }
  }
}
```

Bound each pass with `Block: { Number: { ge: ..., le: ... } }` so the offset stays small per range.

<FAQ
  items={[
    { q: "How do I get token transfers on Optimism?", a: "Query Transfers under EVM(network: optimism) with a filter on the token contract, the sender or the receiver. Each row has amount, USD value, both addresses, the token and the transaction hash; a subscription streams new rows." },
    { q: "How do I set up a whale alert on Optimism?", a: "Filter Transfer.Amount with ge on the threshold and Currency.SmartContract on the token, then run it as a subscription. Each transfer above the threshold arrives as it is indexed." },
    { q: "Does the Transfers cube include native ETH transfers?", a: "Yes. Native transfers carry Currency.Native true and Symbol ETH; internal transfers made by contracts are included as well." },
    { q: "How do I backfill all transfers without gaps?", a: "Page in a fixed order with limit and offset: the composite orderBy over block, transaction, call, log, transfer index and type on the realtime window, or Block_Number with a block range per pass on the archive dataset." },
    { q: "How far back does Optimism transfer data go?", a: "The realtime window holds recent hours; dataset: archive or combined reaches back to when Bitquery began indexing Optimism. The data coverage page lists the depth per cube." },
  ]}
/>

## Related pages

- [Optimism API hub](/docs/blockchain/Optimism/)
- [Optimism NFT API](/docs/blockchain/Optimism/optimism-nft)
- [Transfers cube](/docs/cubes/transfers-cube)
- [Data coverage and retention](/docs/graphql/data-coverage-retention)
