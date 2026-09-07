---
sidebar_position: 2
title: "NFT Token Transfers API: ERC-721 and ERC-1155 Transfers on Ethereum"
sidebar_label: "NFT Token Transfers API"
description: "NFT transfers on Ethereum with Bitquery GraphQL: a collection's latest transfers from history, every NFT transfer as a stream, one wallet's activity, mints."
keywords:
  - NFT transfers API Ethereum
  - ERC-721 transfers GraphQL
  - ERC-1155 transfers API
  - NFT wallet activity Ethereum
  - CryptoKitties transfers
---

import FAQ from "@site/src/components/FAQ";

# NFT Token Transfers API: ERC-721 and ERC-1155 Transfers on Ethereum

NFT transfers on Ethereum live in the same `Transfers` cube as token transfers, marked by `Currency.Fungible: false` and carrying the token `Id`, the collection contract, sender, receiver and, for ERC-1155, the amount. That means one cube answers the collection question, the wallet question and the mint question, and the same filter runs as a query over history or as a live subscription. Every example runs in the [IDE](https://ide.bitquery.io) on a free account. The worked collection is CryptoKitties, `0x06012c8cf97bead5deae237070f9587f8e7a266d`, which still changes hands a few times a day, nine years after launch. For collection-level views such as token lists and holders see the [NFT collection API](/docs/blockchain/Ethereum/nft/nft-collection-api).

## Latest transfers of one collection

The `combined` dataset reaches history, so this works for a collection whether it moved a minute ago or a year ago. Saved query [here](https://ide.bitquery.io/Cryptokitties-Token-Transfers).

```graphql
{
  EVM(dataset: combined, network: eth) {
    Transfers(
      where: {
        Transfer: {
          Currency: { SmartContract: { is: "0x06012c8cf97bead5deae237070f9587f8e7a266d" } }
        }
      }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
        Number
      }
      Transfer {
        Id
        Sender
        Receiver
        Currency {
          Name
          Symbol
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

## Every NFT transfer on Ethereum, live

Drop the contract and keep `Fungible: false` to stream all ERC-721 and ERC-1155 transfers as blocks are indexed. Saved stream [here](https://ide.bitquery.io/ERC721-token-transfers).

```graphql
subscription {
  EVM(network: eth) {
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
          Symbol
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

Add the collection contract back into the filter to stream one collection; a quiet collection can then go hours between messages, so check it with the query above first.

## One wallet's NFT activity

An `any` block matches transfers where the wallet is the sender or the receiver. The example is a large BAYC holder.

```graphql
{
  EVM(dataset: combined, network: eth) {
    Transfers(
      where: {
        Transfer: { Currency: { Fungible: false } }
        any: [
          { Transfer: { Sender: { is: "0x29469395eaf6f95920e59f858042f0e28d98a20b" } } }
          { Transfer: { Receiver: { is: "0x29469395eaf6f95920e59f858042f0e28d98a20b" } } }
        ]
      }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Transfer {
        Id
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

## Mints

A mint is a transfer from the zero address; the receiver is the minter. For CryptoKitties a mint is a kitty being born.

```graphql
{
  EVM(dataset: combined, network: eth) {
    Transfers(
      where: {
        Transfer: {
          Currency: { SmartContract: { is: "0x06012c8cf97bead5deae237070f9587f8e7a266d" } }
          Sender: { is: "0x0000000000000000000000000000000000000000" }
        }
      }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Transfer {
        Id
        Receiver
      }
      Transaction {
        Hash
      }
    }
  }
}
```

## Fields worth knowing

- `Transfer.Id` is the token id; `Transfer.Amount` is 1 for ERC-721 and the quantity for ERC-1155.
- `Transfer.URI` is the metadata link when the contract exposes one; fetch it yourself for the image and attributes.
- `Currency.Fungible` is the ERC-721/1155 flag; `Currency.HasURI` says whether a URI exists.
- `dataset: combined` on the `EVM` root joins archive and realtime; without it a query reads the realtime window only.

<FAQ
  items={[
    { q: "How do I get NFT transfers on Ethereum?", a: "Query Transfers on EVM(network: eth) with Currency.Fungible false, plus the collection contract, a wallet or the zero address as sender for mints. Use dataset combined for history or a subscription for a live feed." },
    { q: "Does the same query cover ERC-1155?", a: "Yes. ERC-1155 transfers are rows in the same cube with the token Id and the Amount moved; ERC-721 rows carry an Amount of 1." },
    { q: "How do I stream every NFT transfer on Ethereum?", a: "Subscribe to Transfers with Currency.Fungible false and no other filter. Each message is a transfer as its block is indexed." },
    { q: "How do I see a wallet's NFT history?", a: "Use an any block with the wallet as Sender in one branch and Receiver in the other, together with Currency.Fungible false, on the combined dataset." },
    { q: "How do I find who minted an NFT?", a: "Filter the collection contract with Sender set to the zero address; the Receiver of that transfer is the minter and the transaction hash leads to the mint call." },
  ]}
/>

## Related pages

- [Ethereum NFT collection API](/docs/blockchain/Ethereum/nft/nft-collection-api)
- [Ethereum NFT API](/docs/blockchain/Ethereum/nft/nft-api)
- [Ethereum token transfers API](/docs/blockchain/Ethereum/transfers/erc20-token-transfer-api)
- [Transfers cube](/docs/cubes/transfers-cube)
