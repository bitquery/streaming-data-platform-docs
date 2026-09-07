---
title: "Optimism NFT API: ERC-721 Transfers, Collections and Owners"
description: "Query and stream ERC-721 transfers on Optimism with Bitquery GraphQL: latest transfers, one collection or token id, mints, senders and receivers."
keywords:
  - Optimism NFT API
  - Optimism ERC-721 transfers
  - Optimism NFT GraphQL
  - track NFT transfers Optimism
  - Optimism NFT owners
---

import FAQ from "@site/src/components/FAQ";

# Optimism NFT API: ERC-721 Transfers, Collections and Owners

NFTs on Optimism are ERC-721 and ERC-1155 tokens, and Bitquery indexes every transfer of them in the `Transfers` cube under `EVM(network: optimism)` with `Currency.Fungible` set to `false`. Each row carries the collection contract, the token id, the sender, the receiver and the transaction, so one cube answers "what NFTs moved on Optimism just now", "who owns token 42 of this collection" and "every transfer of a collection since launch". Queries return the latest rows; changing `query` to `subscription` streams new transfers as they land. Every example runs in the [IDE](https://ide.bitquery.io) on a free account.

## Latest NFT transfers on Optimism

The most recent NFT transfers across all collections. Expect liquidity-position NFTs from DEXs such as Velodrome among them; they are ERC-721 tokens too.

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

## Transfers of one collection, as they happen

Filter on the collection contract. The example is the Velodrome Slipstream position NFT, a collection that moves every few seconds, so the stream shows rows at once; the saved IDE subscription [here](https://ide.bitquery.io/Transfers-of-a-particular-NFT#) uses another contract. A quiet collection can go hours between transfers, so test a filter as a query first with `limit` and `orderBy` added.

```graphql
subscription {
  EVM(network: optimism) {
    Transfers(
      where: {
        Transfer: {
          Currency: {
            Fungible: false
            SmartContract: { is: "0x416b433906b1b72fa758e166e239c43d68dc6f29" }
          }
        }
      }
    ) {
      Block {
        Hash
        Number
      }
      Transfer {
        Amount
        Currency {
          Name
          Symbol
          Native
        }
        Sender
        Receiver
      }
    }
  }
}
```

## Current owner of each token

The Holders cube does not carry per-collection balances for NFTs on Optimism, so read ownership from transfers instead: the receiver of a token's latest transfer is its current owner. `limitBy` on the token id keeps one row per token, newest first. Filter `Id` to check one token.

```graphql
{
  EVM(network: optimism) {
    Transfers(
      where: {
        Transfer: {
          Currency: { SmartContract: { is: "0x416b433906b1b72fa758e166e239c43d68dc6f29" } }
        }
      }
      orderBy: { descending: Block_Time }
      limitBy: { by: Transfer_Id, count: 1 }
      limit: { count: 20 }
    ) {
      Block {
        Time
      }
      Transfer {
        Id
        Receiver
        Sender
      }
    }
  }
}
```

## Useful filters

- One token: `Id: { is: "42" }` inside `Transfer`.
- Mints: `Sender: { is: "0x0000000000000000000000000000000000000000" }`.
- One wallet: `Receiver` or `Sender` set to the address.
- History: add `dataset: archive` or `combined` to the `EVM` root; without it the query reads the realtime window.

<FAQ
  items={[
    { q: "How do I get NFT transfers on Optimism?", a: "Query Transfers under EVM(network: optimism) with Currency.Fungible set to false. Each row has the collection contract, token id, sender, receiver and transaction; use limit and orderBy for the latest rows or a subscription to stream them." },
    { q: "How do I find who owns an Optimism NFT now?", a: "Take the latest transfer of that token id: the Receiver is the current owner. With limitBy on Transfer_Id the same query returns the current owner of every token that moved inside the window." },
    { q: "How do I find NFT mints on Optimism?", a: "Mints are transfers from the zero address, so add Sender is 0x0000000000000000000000000000000000000000 to the collection filter; the Receiver is the minter." },
    { q: "Does the same query work on other EVM chains?", a: "Yes. Change the network name to eth, bsc, base, arbitrum, matic or robinhood and the same Transfers and Holders queries run there." },
  ]}
/>

## Related pages

- [Optimism API hub](/docs/blockchain/Optimism/)
- [Optimism transfers API](/docs/blockchain/Optimism/optimism-transfers)
- [Ethereum NFT collection API](/docs/blockchain/Ethereum/nft/nft-collection-api)
- [Transfers cube](/docs/cubes/transfers-cube)
