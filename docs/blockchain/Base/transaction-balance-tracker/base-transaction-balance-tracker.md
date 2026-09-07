---
sidebar_position: 1
title: "Base Transaction Balance Tracker: Balances Before and After a Transaction"
sidebar_label: "Base Transaction Balance Tracker"
description: "Stream and query Base balance changes with Bitquery GraphQL: every address a transaction touched, one wallet's ETH and USDC, pool reserves and token supply."
keywords:
  - Base transaction balance tracker
  - Base balance changes API
  - Base wallet balance stream
  - Base pool reserves GraphQL
  - Base token supply API
---

import FAQ from "@site/src/components/FAQ";

# Base Transaction Balance Tracker: Balances Before and After a Transaction

The `TransactionBalances` cube records, for each transaction on Base, every address whose balance changed and the balance before and after, in ETH, ERC-20 tokens and NFTs. A wallet tracker, a fee monitor and a pool reserve feed all come from the same rows. Native rows carry a reason code; on Base that is 0 for ordinary changes and 5 for fee credits to the fee vaults, and no other code appears. Every example runs in the [IDE](https://ide.bitquery.io) on a free account. The cube covers the recent realtime window only, so queries carry a `limit` and, for wide filters, a time window.

## Stream one address

Base produces too many balance rows for an unfiltered stream to be practical, so subscribe with a filter: an address, as here, or a reason code, as on the [gas balance tracker](/docs/blockchain/Base/transaction-balance-tracker/base-gas-balance-tracker). The example is the Uniswap v4 PoolManager, whose token balances change on every swap, so rows arrive within seconds; a wallet streams only when it transacts. Saved stream [here](https://ide.bitquery.io/Subscribe-to-Transaction-Balances-for-a-Specific-Address-base).

```graphql
subscription {
  EVM(network: base) {
    TransactionBalances(
      where: { TokenBalance: { Address: { is: "0x498581ff718922c3f8e6a244956af099b2652b2b" } } }
    ) {
      Block {
        Number
        Time
      }
      TokenBalance {
        BalanceChangeReasonCode
        PreBalance
        PostBalance
        PostBalanceInUSD
        Currency {
          Symbol
          SmartContract
          Native
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

## Latest ETH balance of an address

The newest native row for the address; `PostBalance` is the balance after that transaction. Saved query [here](https://ide.bitquery.io/latest-native-balance-of-an-address-base).

```graphql
{
  EVM(network: base) {
    TransactionBalances(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        TokenBalance: {
          Address: { is: "0x238a358808379702088667322f80ac48bad5e6c4" }
          Currency: { Native: true }
        }
      }
    ) {
      Block {
        Time
      }
      TokenBalance {
        PostBalance
        PostBalanceInUSD
        BalanceChangeReasonCode
      }
      Transaction {
        Hash
      }
    }
  }
}
```

## Latest balance of an address in one token

The same query with the token contract in place of the native flag. The example is USDC on Base, `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`. Saved query [here](https://ide.bitquery.io/latest-balance-of-an-address-for-a-specific-token-base).

```graphql
{
  EVM(network: base) {
    TransactionBalances(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        TokenBalance: {
          Address: { is: "0x238a358808379702088667322f80ac48bad5e6c4" }
          Currency: {
            SmartContract: { is: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" }
          }
        }
      }
    ) {
      Block {
        Time
      }
      TokenBalance {
        PostBalance
        PostBalanceInUSD
        Currency {
          Symbol
          Name
        }
      }
      Transaction {
        Hash
      }
    }
  }
}
```

An address that has not moved the token inside the realtime window has no row here; use the [Balances cube](/docs/cubes/balances-cube) for a balance that does not depend on recent activity.

## Latest reserves of a pool

A pool is an address like any other, so its token balances are its reserves. `limitBy` on the token contract keeps the newest row per token. The example is the Uniswap v3 WETH/USDC 0.05% pool. Saved query [here](https://ide.bitquery.io/latest-liquidity-of-a-base-pool).

```graphql
{
  EVM(network: base) {
    TransactionBalances(
      limit: { count: 2 }
      limitBy: { by: TokenBalance_Currency_SmartContract, count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        TokenBalance: { Address: { is: "0xd0b53D9277642d899DF5C87A3966A349A798F224" } }
        Block: { Time: { since_relative: { hours_ago: 1 } } }
      }
    ) {
      Block {
        Time
      }
      TokenBalance {
        Currency {
          Symbol
          SmartContract
        }
        PostBalance
        PostBalanceInUSD
      }
    }
  }
}
```

## Latest supply and market cap of a token

Token rows carry `TotalSupply` and `TotalSupplyInUSD` as of that transaction, so the newest row for a token gives its supply and on-chain market cap. The example is AERO. Saved query [here](https://ide.bitquery.io/Total-Supply-and-onchain-Marketcap-of-a-specific-token-base).

```graphql
{
  EVM(network: base) {
    TransactionBalances(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        TokenBalance: {
          Currency: { SmartContract: { is: "0x940181a94A35A4569E4529A3CDfB74e38FD98631" } }
        }
      }
    ) {
      Block {
        Time
      }
      TokenBalance {
        Currency {
          Symbol
          Name
        }
        TotalSupply
        TotalSupplyInUSD
      }
    }
  }
}
```

## Which fields each currency type carries

- **ETH:** `BalanceChangeReasonCode`, `PreBalance`, `PostBalance`, `PostBalanceInUSD`.
- **ERC-20:** `PostBalance`, `PostBalanceInUSD`, `TotalSupply`, `TotalSupplyInUSD`; no pre-balance or reason code.
- **NFTs:** `PostBalance` and `TokenOwnership`; no USD values.

<FAQ
  items={[
    { q: "What is the Base transaction balance tracker?", a: "A cube that records, per transaction, every address whose balance changed with the balance before and after. It covers ETH, ERC-20 tokens and NFTs and can be queried or streamed with the same filters." },
    { q: "Which reason codes appear on Base?", a: "Only 0 and 5. Code 0 marks ordinary changes, including the sender's gas, and code 5 marks fee credits to the sequencer, base fee and L1 fee vaults. The gas codes used on Ethereum do not appear." },
    { q: "How do I get a wallet's current balance if it has been idle?", a: "TransactionBalances only has rows for addresses that transacted inside the realtime window. Use the Balances cube for a balance that does not depend on recent activity." },
    { q: "Can I read pool reserves from this cube?", a: "Yes. Filter on the pool address and use limitBy on the token contract to get the newest balance per token; those are the pool's reserves after its latest transaction." },
  ]}
/>

## Related pages

- [Base transaction balance tracker overview](/docs/blockchain/Base/transaction-balance-tracker/)
- [Base gas balance tracker](/docs/blockchain/Base/transaction-balance-tracker/base-gas-balance-tracker)
- [Base transfers API](/docs/blockchain/Base/base-transfers)
- [Balances and Holders cubes](/docs/cubes/balances-cube)
