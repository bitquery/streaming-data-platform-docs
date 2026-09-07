---
title: "Tron NFT API: TRC-721 Transfers, Holders and Collections"
description: "Query and stream TRC-721 NFT transfers on Tron with Bitquery GraphQL: latest transfers, one collection, mints and holders, live or from history."
keywords:
  - Tron NFT API
  - TRC-721 API
  - Tron NFT transfers
  - Tron NFT GraphQL
  - track NFT transfers Tron
---

import FAQ from "@site/src/components/FAQ";

# Tron NFT API: TRC-721 Transfers, Holders and Collections

NFTs on Tron are TRC-721 tokens, and Bitquery indexes every transfer of them in the `Tron.Transfers` cube with `Currency.Fungible` set to `false`. Each row carries the collection contract, the token id, the sender, the receiver and the transaction, so the same cube answers "what NFTs moved on Tron just now", "who received token 4711 of this collection" and "every transfer of one collection since it launched". Queries return the latest rows; changing `query` to `subscription` streams new transfers as they land. Every example runs in the [IDE](https://ide.bitquery.io) on a free account.

## Latest NFT transfers on Tron

The most recent NFT transfers across all collections. On Tron a large share of these rows are liquidity-position NFTs from DEXs such as SunSwap, which are TRC-721 tokens too.

```graphql
{
  Tron {
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

NFT activity on Tron is sparse: even the busiest collections, the SunSwap position NFTs, move a handful of times a day. So check a collection with the query form first, then leave the subscription running for the live feed. The example is the SunSwap V4 Positions NFT, `TC8xQzPHfn5KceZV6s6GmZkBCFWWUoPXs1`; the saved IDE stream [here](https://ide.bitquery.io/Websocket-for-tracking-Transfers-of-a-particular-NFT-websocket) uses another contract.

```graphql
{
  Tron {
    Transfers(
      where: {
        Transfer: {Currency: {Fungible: false, SmartContract: {is: "TC8xQzPHfn5KceZV6s6GmZkBCFWWUoPXs1"}}}
        Block: {Time: {since_relative: {hours_ago: 24}}}
      }
      limit: {count: 20}
      orderBy: {descending: Block_Time}
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
          Symbol
        }
      }
    }
  }
}
```

The same filter as a stream:

```graphql
subscription {
  Tron {
    Transfers(
      where: {Transfer: {Currency: {Fungible: false, SmartContract: {is: "TC8xQzPHfn5KceZV6s6GmZkBCFWWUoPXs1"}}}}
    ) {
      Block {
        Hash
        Number
        Time
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

## Useful filters

- One token: add `Id: { is: "4711" }` inside `Transfer`.
- Mints: `Sender: { is: "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb" }` (the Tron zero address) returns tokens created in the window.
- One wallet: `Receiver: { is: "T..." }` or `Sender: { is: "T..." }`.
- History: add `dataset: archive` or `combined` to the `Tron` root; without it the query reads the realtime window.

<FAQ
  items={[
    { q: "How do I get NFT transfers on Tron?", a: "Query Tron.Transfers with Currency.Fungible set to false. Each row has the collection contract, token id, sender, receiver and transaction; add limit and orderBy for the latest rows, or use a subscription to stream them." },
    { q: "How do I track one NFT collection on Tron?", a: "Filter Transfer.Currency.SmartContract on the collection's contract address, and Transfer.Id on a token id if you want one token. The subscription form pushes each new transfer of that collection." },
    { q: "How do I find who minted an NFT on Tron?", a: "Mints are transfers from the zero address, so filter Sender on T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb together with the collection contract; the Receiver is the minter." },
    { q: "Does the Tron NFT API cover history?", a: "Yes. Add dataset: archive or dataset: combined to the Tron root to reach past transfers; the realtime window alone holds only recent hours." },
  ]}
/>

## Related pages

- [Tron API hub](/docs/blockchain/Tron/)
- [Ethereum NFT collection API](/docs/blockchain/Ethereum/nft/nft-collection-api)
- [Optimism NFT API](/docs/blockchain/Optimism/optimism-nft)
- [Transfers cube](/docs/cubes/transfers-cube)
