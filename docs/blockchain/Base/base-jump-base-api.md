---
sidebar_position: 7
title: "Base Jump API: Trace a Launchpad Token on Base from Mint to First Trades"
sidebar_label: "Base Jump API"
description: "Base Jump is no longer active on-chain. Its token is a worked example of tracing any Base launchpad with Bitquery GraphQL: the contract, launch trades, methods."
keywords:
  - Base Jump API
  - Base launchpad API
  - trace launchpad token Base
  - Base token launch trades
  - Base Calls cube
---

import FAQ from "@site/src/components/FAQ";

# Base Jump API: Trace a Launchpad Token on Base from Mint to First Trades

Base Jump was a token launchpad on Base. Its contract, `0x31C0282Fa6D0A82aD22ab63BbaCd87F62B2a9bfD`, receives no calls in the current realtime window, and the token the original guide used, SIBU at `0xEfC79f30b56f36bc49Bf47e8Dccf969fFF214EeD`, was minted, distributed and traded within a few minutes on 28 October 2024 and has not moved since. The launch still makes a clean worked example, because the steps are the same for any launchpad on Base: find the launchpad contract from the token's first transfers, pull the launch trades, and read the contract's methods while it is live. Every query runs in the [IDE](https://ide.bitquery.io) on a free account. For launchpads active on Base today see the [Clanker](/docs/blockchain/Base/base-clanker-api), [Zora](/docs/blockchain/Base/base-zora-api), [Bankr](/docs/blockchain/Base/base-bankr-api) and [APE Store](/docs/blockchain/Base/apestore-base-api) pages.

One coverage fact shapes the page. On Base the `Transfers` and `DEXTradeByTokens` cubes reach years back on the `combined` dataset, while `Calls` and `Events` cover the realtime window only. So the mint and the trades of a 2024 launch are still queryable, but method-level analysis of a contract only works while it is active.

## Step 1: find the launchpad contract from the token

The first transfers of a token show where it was minted and who distributed it. The `Transaction.To` on those rows is the contract the deployer called. For SIBU the mint from the zero address went to the Base Jump contract, which then sent the supply on in the same transaction. Saved query [here](https://ide.bitquery.io/base-jump-token-event).

```graphql
{
  EVM(network: base, dataset: combined) {
    Transfers(
      where: {
        Transfer: {
          Currency: { SmartContract: { is: "0xEfC79f30b56f36bc49Bf47e8Dccf969fFF214EeD" } }
        }
      }
      limit: { count: 10 }
      orderBy: { ascending: Block_Time }
    ) {
      Block {
        Time
      }
      Transfer {
        Sender
        Receiver
        Amount
        Currency {
          Symbol
          Name
        }
      }
      Transaction {
        Hash
        From
        To
      }
    }
  }
}
```

## Step 2: pull the launch trades

`DEXTradeByTokens` on the `combined` dataset returns every trade of the token with the venue and the other side. For SIBU that is a short burst of Uniswap v3 trades against WETH. Saved query [here](https://ide.bitquery.io/base-jump-buys).

```graphql
{
  EVM(network: base, dataset: combined) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: { SmartContract: { is: "0xEfC79f30b56f36bc49Bf47e8Dccf969fFF214EeD" } }
        }
      }
      limit: { count: 50 }
      orderBy: { ascending: Block_Time }
    ) {
      Block {
        Time
      }
      Trade {
        Dex {
          ProtocolName
        }
        Amount
        Side {
          Amount
          Currency {
            Symbol
          }
        }
      }
      Transaction {
        Hash
        From
      }
    }
  }
}
```

Replace the selection with `count`, `uniq(of: Transaction_From)` and `Block { first: Time(minimum: Block_Time) last: Time(maximum: Block_Time) }` to size a launch in one row: trades, distinct traders, first and last trade.

## Step 3: read a live contract's methods

For a launchpad that is active, group the `Calls` into its contract by signature to see what it exposes and which methods carry the volume. The example is the Clanker contract that emits `TokenCreated` on Base; put the Base Jump contract in its place and the result is empty, which is how you confirm a launchpad has gone quiet. Saved query [here](https://ide.bitquery.io/methods-for-base-jump).

```graphql
{
  EVM(network: base) {
    Calls(
      where: {
        Transaction: { To: { is: "0x375C15db32D28cEcdcAB5C03Ab889bf15cbD2c5E" } }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      orderBy: { descendingByField: "count" }
      limit: { count: 20 }
    ) {
      Call {
        Signature {
          Name
          Signature
        }
      }
      count
    }
  }
}
```

From there, filter `Calls` on one signature name and select `Arguments` to decode the parameters of each call; the [Clanker page](/docs/blockchain/Base/base-clanker-api) shows that shape for token creation events.

<FAQ
  items={[
    { q: "Is the Base Jump launchpad still active?", a: "Not on-chain. Its contract receives no calls in the realtime window, and the example token's only activity was on its launch day in October 2024. The queries here work as a pattern for any Base launchpad." },
    { q: "How do I find which launchpad deployed a token on Base?", a: "Query the token's earliest Transfers on the combined dataset. The mint comes from the zero address, and Transaction.To on that row is the contract the deployer called, which is the launchpad or its factory." },
    { q: "Why does a Calls query for a 2024 contract return nothing on Base?", a: "Calls and Events on Base cover the realtime window only. Transfers and DEXTradeByTokens reach history on the combined dataset, so use those cubes for anything older than the window." },
    { q: "Which Base launchpads have current guides?", a: "Clanker, Zora, Bankr and APE Store each have a page with live queries for token creation, trades and traders." },
  ]}
/>

## Related pages

- [Base API hub](/docs/blockchain/Base/)
- [Base Clanker API](/docs/blockchain/Base/base-clanker-api)
- [Base DEX trades API](/docs/blockchain/Base/base-dextrades)
- [Base transfers API](/docs/blockchain/Base/base-transfers)
