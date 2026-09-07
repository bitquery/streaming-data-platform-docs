---
sidebar_position: 7
title: "Ethereum NFT Collection API: Token List, Holders and Transfers"
sidebar_label: "Ethereum NFT Collection API"
description: "Token list, holders, latest transfers and mints for an Ethereum NFT collection with Bitquery GraphQL, worked on Bored Ape Yacht Club."
keywords:
  - NFT collection API
  - Ethereum NFT holders API
  - all NFTs in a collection
  - ERC-721 token list
  - NFT metadata URI API
  - Bored Ape holders
---

import FAQ from "@site/src/components/FAQ";

# Ethereum NFT Collection API: Token List, Holders and Transfers

An NFT collection is one contract, and two Bitquery cubes describe it. `Transfers` on the archive dataset holds every mint and transfer of every token id since the contract was deployed, which gives you the full token list with each token's metadata URI. `Holders` holds the current owners, ranked by how many tokens of the collection each address holds, without you aggregating transfers yourself. Both examples use the Bored Ape Yacht Club contract `0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d`; put any ERC-721 or ERC-1155 contract in its place. Every query runs in the [IDE](https://ide.bitquery.io) on a free account.

## All token ids in a collection

Group the collection's transfers by token id on the `archive` dataset. Each row is one token, `count` is how many times it has moved, and `offset` pages through the whole collection in id order. For the current owner of one token, take its latest transfer with `Id` in the filter: the `Receiver` is the owner. Saved query [here](https://ide.bitquery.io/Get-all-NFTs-for-a-collection).

```graphql
{
  EVM(dataset: archive, network: eth) {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"}}}}
      limit: {count: 1000, offset: 0}
      orderBy: {ascendingByField: "Transfer_Id"}
    ) {
      Transfer {
        Id
      }
      count
    }
  }
}
```

## Holders of a collection, ranked

The `Holders` cube returns current balances per address for the collection contract, so the top rows are the largest holders. Add `date: "YYYY-MM-DD"` to see the holder set on a past day.

```graphql
{
  EVM(network: eth) {
    Holders(
      limit: { count: 100 }
      orderBy: { descending: Balance_Amount }
      where: { Currency: { SmartContract: { is: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d" } } }
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

The older way, summing `BalanceUpdates` per address, is retired; the [Balances and Holders cubes](/docs/cubes/balances-cube) page maps each old query to its replacement.

## Transfer history and mints

Plain rows come from the same filter without the grouping. Add the zero address as `Sender` to keep only mints, `Id` for one token, or a `Block.Time` window for a period; the example lists the first BAYC mints from the collection's launch weeks on the archive dataset. Change `query` to `subscription` and drop the dataset argument to stream new transfers of the collection as they happen.

```graphql
{
  EVM(dataset: archive, network: eth) {
    Transfers(
      where: {
        Transfer: {
          Currency: { SmartContract: { is: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d" } }
          Sender: { is: "0x0000000000000000000000000000000000000000" }
        }
        Block: { Time: { since: "2021-04-01T00:00:00Z", till: "2021-05-31T00:00:00Z" } }
      }
      limit: { count: 20 }
      orderBy: { ascending: Block_Time }
    ) {
      Block {
        Time
      }
      Transfer {
        Id
        Receiver
        URI
      }
      Transaction {
        Hash
      }
    }
  }
}
```

<FAQ
  items={[
    { q: "How do I list every NFT in a collection?", a: "Group Transfers on the archive dataset by Transfer.Id with count, filtered by the collection contract, and page with limit and offset; each row is one token id. Plain transfer rows carry the URI for metadata." },
    { q: "How do I get the holders of an NFT collection on Ethereum?", a: "Query the Holders cube with the collection contract in Currency.SmartContract and sort by Balance_Amount. It returns current owners with their token counts; a date argument returns the owners on a past day." },
    { q: "Does this work for ERC-1155 collections?", a: "Yes. Transfers carry the token id and amount for ERC-1155 as well, and Holders returns per-address balances, which can be larger than one for the same id." },
    { q: "How do I get NFT metadata?", a: "The URI field on a transfer row is the token's metadata link, and Data holds on-chain metadata when the contract stores it. Fetch the URI yourself for the image and attributes." },
    { q: "Can I do the same on other EVM chains?", a: "Yes. Change EVM(network: eth) to bsc, base, arbitrum, optimism, matic or robinhood; the Transfers and Holders cubes have the same fields on every EVM chain." },
  ]}
/>

## Related pages

- [Ethereum NFT API](/docs/blockchain/Ethereum/nft/nft-api)
- [Balances and Holders cubes](/docs/cubes/balances-cube)
- [Transfers cube](/docs/cubes/transfers-cube)
- [Optimism NFT API](/docs/blockchain/Optimism/optimism-nft)
