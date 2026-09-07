---
sidebar_position: 1
title: "BSC Transaction Balance Tracker: Balances Before and After a Transaction"
description: "Stream and query BNB Chain balance changes with Bitquery GraphQL: every address a transaction touched, one wallet's BNB and USDT, pool reserves and supply."
keywords:
  - BSC transaction balance tracker
  - BNB Chain balance changes API
  - BSC wallet balance stream
  - BSC pool reserves GraphQL
  - BSC token supply API
---

import FAQ from "@site/src/components/FAQ";

# BSC Transaction Balance Tracker: Balances Before and After a Transaction

The `TransactionBalances` cube records, for each transaction on BNB Chain, every address whose balance changed and the balance before and after, in BNB, BEP-20 tokens and NFTs. A wallet tracker, a fee monitor and a pool reserve feed all come from the same rows. Native rows carry a reason code that says why the balance moved: 10 for a transfer, 6 and 7 for gas bought and returned, 5 for the fee credited to the block producer, 12 and 13 for self-destructs, 0 when no specific reason applies. Every example runs in the [IDE](https://ide.bitquery.io) on a free account. The cube covers the recent realtime window only, so queries carry a `limit` and, for wide filters, a time window.

## Stream one address

BNB Chain produces so many balance rows that a stream over the whole network, one token or a broad reason code does not deliver in practice; filter on an address, or use the reason code 5 stream on the [MEV balance tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-mev-balance-tracker), which is keyed to one address. The example is a busy exchange wallet, so rows arrive within seconds; a quiet wallet streams only when it transacts. Saved stream [here](https://ide.bitquery.io/Subscribe-to-Transaction-Balances-for-a-Specific-Address-bsc).

```graphql
subscription {
  EVM(network: bsc) {
    TransactionBalances(
      where: { TokenBalance: { Address: { is: "0x238a358808379702088667322f80ac48bad5e6c4" } } }
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

## Latest BNB balance of an address

The newest native row for the address; `PostBalance` is the balance after that transaction. Saved query [here](https://ide.bitquery.io/latest-native-balance-of-an-address-bsc).

```graphql
{
  EVM(network: bsc) {
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

The same query with the token contract in place of the native flag. The example is USDT on BNB Chain, `0x55d398326f99059fF775485246999027B3197955`. Saved query [here](https://ide.bitquery.io/latest-balance-of-an-address-for-a-specific-token-bsc).

```graphql
{
  EVM(network: bsc) {
    TransactionBalances(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        TokenBalance: {
          Address: { is: "0x238a358808379702088667322f80ac48bad5e6c4" }
          Currency: {
            SmartContract: { is: "0x55d398326f99059fF775485246999027B3197955" }
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

A pool is an address like any other, so its token balances are its reserves. `limitBy` on the token contract keeps the newest row per token, and the time window keeps the query fast on a busy pool. The example is the PancakeSwap v3 WBNB/USDT pool. Saved query [here](https://ide.bitquery.io/latest-liquidity-of-a-bsc-pool).

```graphql
{
  EVM(network: bsc) {
    TransactionBalances(
      limit: { count: 2 }
      limitBy: { by: TokenBalance_Currency_SmartContract, count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        TokenBalance: { Address: { is: "0x36696169C63e42cd08ce11f5deeBbCeBae652050" } }
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

Token rows carry `TotalSupply` and `TotalSupplyInUSD` as of that transaction, so the newest row for a token gives its supply and on-chain market cap. The example is CAKE. Saved query [here](https://ide.bitquery.io/Total-Supply-and-onchain-Marketcap-of-a-specific-token-bsc).

```graphql
{
  EVM(network: bsc) {
    TransactionBalances(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        TokenBalance: {
          Currency: { SmartContract: { is: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82" } }
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

- **BNB:** `BalanceChangeReasonCode`, `PreBalance`, `PostBalance`, `PostBalanceInUSD`.
- **BEP-20:** `PostBalance`, `PostBalanceInUSD`, `TotalSupply`, `TotalSupplyInUSD`; no pre-balance or reason code.
- **NFTs:** `PostBalance` and `TokenOwnership`; no USD values.

<FAQ
  items={[
    { q: "What is the BSC transaction balance tracker?", a: "A cube that records, per transaction, every address whose balance changed with the balance before and after. It covers BNB, BEP-20 tokens and NFTs and can be queried or streamed with the same filters." },
    { q: "Which reason codes appear on BNB Chain?", a: "In live data: 0, 5, 6, 7, 10, 12 and 13. The mining codes 1 and 2 never appear because BNB Chain has validators, not miners; see the miner and MEV balance tracker pages for what block producers earn." },
    { q: "How do I get a wallet's current balance if it has been idle?", a: "TransactionBalances only has rows for addresses that transacted inside the realtime window. Use the Balances cube for a balance that does not depend on recent activity." },
    { q: "Can I read pool reserves from this cube?", a: "Yes. Filter on the pool address with a short time window and use limitBy on the token contract to get the newest balance per token; those are the reserves after the pool's latest transaction." },
  ]}
/>

## Related pages

- [BSC transaction balance tracker overview](/docs/blockchain/BSC/transaction-balance-tracker/)
- [BSC gas balance tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-gas-balance-tracker)
- [BSC MEV balance tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-mev-balance-tracker)
- [Balances and Holders cubes](/docs/cubes/balances-cube)
