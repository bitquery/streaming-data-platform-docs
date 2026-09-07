---
title: "Polygon Transfers API: Token and POL Transfers, Whale Alerts, Backfills"
sidebar_label: "Polygon Transfers API"
description: "Polygon transfers with Bitquery GraphQL: large USDC moves, one wallet's history and live activity, NFT transfers, a Polymarket check, gap-free backfills."
keywords:
  - Polygon transfers API
  - Polygon token transfers GraphQL
  - Polygon whale alerts
  - Polymarket address check
  - POL transfers API
---

import FAQ from "@site/src/components/FAQ";

# Polygon Transfers API: Token and POL Transfers, Whale Alerts, Backfills

Every ERC-20, ERC-721, ERC-1155 and native POL transfer on Polygon is a row in the `Transfers` cube under `EVM(network: matic)`, with sender, receiver, amount, USD value where a price exists, the token, and the transaction. Polygon's volume has its own shape: stablecoin flows, Polymarket's conditional tokens, which are ERC-1155 and show up as NFT transfers, and bridge and distributor contracts that send tens of thousands of transfers an hour. The examples below pick from that. The same filters run as a query for the latest rows or as a subscription for a live feed, and `dataset: combined` on the root reaches history. Every example runs in the [IDE](https://ide.bitquery.io) on a free account.

## Large USDC transfers

Native USDC on Polygon is `0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359`. The query form lists transfers of 10,000 or more in the last day; change `query` to `subscription` and drop `Block`, `limit` and `orderBy` for an alert. Saved stream [here](https://ide.bitquery.io/Whale-transfers-of-USDC-on-matic).

```graphql
{
  EVM(network: matic) {
    Transfers(
      where: {
        Transfer: {
          Currency: { SmartContract: { is: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359" } }
          Amount: { ge: "10000" }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      limit: { count: 20 }
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
        }
      }
      Transaction {
        Hash
      }
    }
  }
}
```

## Transfers sent by one wallet

On the `combined` dataset the query shows a wallet's history even if it has been idle for months. Saved query [here](https://ide.bitquery.io/Sender-is-a-particular-address_2).

```graphql
{
  EVM(network: matic, dataset: combined) {
    Transfers(
      where: { Transfer: { Sender: { is: "0x1A8f43e01B78979EB4Ef7feBEC60F32c9A72f58E" } } }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Transfer {
        Amount
        AmountInUSD
        Currency {
          Symbol
          SmartContract
          Native
        }
        Receiver
      }
      Transaction {
        Hash
      }
    }
  }
}
```

As a stream, pick an address that moves. The one below is a distributor contract that sends thousands of transfers an hour, so messages arrive at once; a personal wallet streams only when it transacts.

```graphql
subscription {
  EVM(network: matic) {
    Transfers(
      where: { Transfer: { Sender: { is: "0xe111180000d2663c0091e4f400237545b87b996b" } } }
    ) {
      Block {
        Time
      }
      Transfer {
        Amount
        Currency {
          Symbol
          SmartContract
        }
        Receiver
      }
      Transaction {
        Hash
      }
    }
  }
}
```

## NFT transfers, including Polymarket positions

`Currency.Fungible: false` keeps ERC-721 and ERC-1155 rows. On Polygon most of them are Polymarket outcome tokens, ERC-1155 positions minted and moved by the conditional tokens contract. Saved stream [here](https://ide.bitquery.io/NFT-Token-Transfers-API_3).

```graphql
subscription {
  EVM(network: matic) {
    Transfers(where: { Transfer: { Currency: { Fungible: false } } }) {
      Block {
        Time
      }
      Transfer {
        Id
        Amount
        Sender
        Receiver
        Currency {
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

## Has an address ever used Polymarket

Polymarket settles positions through the conditional tokens contract, `0x4d97dCd97eC945f40cF65F87097ACe5EA0476045`. One received transfer of its tokens is enough for a yes, which is cheaper than scanning prediction trades when a yes or no is all you need. Saved query [here](https://ide.bitquery.io/check-if-an-address-interacted-with-polymarket-ever).

```graphql
{
  EVM(dataset: combined, network: matic) {
    Transfers(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        Transfer: {
          Receiver: { is: "0x0c79f21ec570f5cc0d52d1bc640845faef430ad2" }
          Currency: { SmartContract: { is: "0x4d97dCd97eC945f40cF65F87097ACe5EA0476045" } }
        }
      }
    ) {
      Block {
        Time
      }
      Transfer {
        Id
        Amount
      }
      Transaction {
        Hash
      }
    }
  }
}
```

## Deterministic pagination for backfilling

To load transfers into your own index without gaps or repeats, page in a fixed order: the composite `orderBy` positions every transfer uniquely, and `offset` moves by `count` on each request, up to 25,000 rows per call. This ordering runs on the realtime window; on the `archive` dataset order by `Block_Number` and page one block range at a time. Saved query [here](https://ide.bitquery.io/Reliable-transfer-api).

```graphql
{
  EVM(network: matic) {
    Transfers(
      where: { Transfer: { Success: true } }
      orderBy: {
        ascending: [
          Block_Number
          Transaction_Index
          Call_Index
          Log_Index
          Transfer_Index
          Transfer_Type
        ]
      }
      limit: { count: 100, offset: 0 }
    ) {
      Block {
        Number
        Time
      }
      Transaction {
        Hash
        Index
      }
      Transfer {
        Amount
        Sender
        Receiver
        Index
        Type
        Currency {
          Symbol
          SmartContract
          Native
        }
      }
      Call {
        Index
      }
      Log {
        Index
      }
    }
  }
}
```

<FAQ
  items={[
    { q: "How do I get token transfers on Polygon?", a: "Query Transfers under EVM(network: matic) with a filter on the token contract, the sender or the receiver. Each row has the amount, USD value, both addresses, the token and the transaction; a subscription streams new rows." },
    { q: "Which USDC address should I use on Polygon?", a: "Native USDC is 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359. The older bridged USDC.e is a different contract; filter on both if you want either." },
    { q: "Why do Polymarket positions appear as NFT transfers?", a: "Polymarket outcome tokens are ERC-1155 positions on the conditional tokens contract, and ERC-1155 rows carry Currency.Fungible false with the position id in Transfer.Id." },
    { q: "How do I check whether a wallet used Polymarket?", a: "Query one transfer of the conditional tokens contract received by the wallet on the combined dataset. A row means it has held a position; no row means it never received one." },
    { q: "How do I backfill Polygon transfers without gaps?", a: "Page with the composite orderBy over block, transaction, call, log, transfer index and type on the realtime window, or by Block_Number in block ranges on the archive dataset." },
  ]}
/>

## Related pages

- [Polygon API hub](/docs/blockchain/Matic/)
- [Polygon DEX trades API](/docs/blockchain/Matic/matic-dextrades)
- [Polygon NFT API](/docs/blockchain/Matic/matic-nft)
- [Transfers cube](/docs/cubes/transfers-cube)
