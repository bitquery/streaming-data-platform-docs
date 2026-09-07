---
sidebar_position: 8
title: "Ethereum Token Balance API: ERC-20 Balances, Supply and Market Cap"
sidebar_label: "Ethereum Token Balance API"
description: "ERC-20 balances on Ethereum with Bitquery GraphQL: one token for a wallet, every token a wallet holds, several wallets, history, supply and market cap."
keywords:
  - Ethereum token balance API
  - ERC-20 balance GraphQL
  - wallet token balances Ethereum
  - token total supply API
  - TransactionBalances ERC-20
---

import FAQ from "@site/src/components/FAQ";

# Ethereum Token Balance API: ERC-20 Balances, Supply and Market Cap

Every transaction that moves an ERC-20 token writes one row per affected address into the `TransactionBalances` cube, with the balance after the transaction, its USD value, and the token's total supply and on-chain market cap at that moment. That makes the cube a balance API for any wallet that has been active recently: the newest row for a wallet and a token is its current balance. Token rows carry no reason code and no pre-balance; those belong to native ETH rows, covered on the [transaction balance tracker](/docs/blockchain/Ethereum/balances/transaction-balance-tracker/eth-transaction-balance-tracker). The cube holds the recent realtime window only, so a wallet that has not moved a token inside it has no row; for those use the [Balances cube](/docs/cubes/balances-cube), which does not depend on recent activity. Every example runs in the [IDE](https://ide.bitquery.io) on a free account. The worked wallet is a busy one that moves stablecoins and meme tokens all day, `0x9642b23Ed1E01Df1092B92641051881a322F5D4E`, and the worked token is USDT, `0xdac17f958d2ee523a2206206994597c13d831ec7`.

## Balance of one token for one wallet

Filter on the wallet and the token contract and take the newest row. Saved query [here](https://ide.bitquery.io/Get-Latest-Token-Balance-for-an-Address).

```graphql
{
  EVM(network: eth) {
    TransactionBalances(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        TokenBalance: {
          Address: { is: "0x9642b23Ed1E01Df1092B92641051881a322F5D4E" }
          Currency: { SmartContract: { is: "0xdac17f958d2ee523a2206206994597c13d831ec7" } }
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
          SmartContract
          Decimals
        }
      }
      Transaction {
        Hash
      }
    }
  }
}
```

## Every token a wallet holds

`limitBy` on the token contract keeps the newest row per token, so one query returns the wallet's current balance in every token it moved inside the window, largest USD value first once you sort the rows. Saved query [here](https://ide.bitquery.io/Get-All-Token-Balances-for-an-Address).

```graphql
{
  EVM(network: eth) {
    TransactionBalances(
      limit: { count: 50 }
      limitBy: { by: TokenBalance_Currency_SmartContract, count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        TokenBalance: {
          Address: { is: "0x9642b23Ed1E01Df1092B92641051881a322F5D4E" }
          Currency: { Native: false, Fungible: true }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
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
          SmartContract
        }
      }
    }
  }
}
```

Add `PostBalanceInUSD: { gt: "1000000" }` inside `TokenBalance` to keep only positions worth more than a million dollars, which is the saved [minimum balance](https://ide.bitquery.io/Filter-Tokens-by-Minimum-Balance) query.

## Several wallets at once

`in` takes a list of addresses; with the token fixed and `limitBy` on the address, the result is the latest USDT balance of each wallet in one call. Saved query [here](https://ide.bitquery.io/Get-Token-Balances-for-Multiple-Addresses).

```graphql
{
  EVM(network: eth) {
    TransactionBalances(
      limitBy: { by: TokenBalance_Address, count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        TokenBalance: {
          Address: {
            in: [
              "0x9642b23Ed1E01Df1092B92641051881a322F5D4E"
              "0xf977814e90da44bfa03b6295a0616a897441acec"
            ]
          }
          Currency: { SmartContract: { is: "0xdac17f958d2ee523a2206206994597c13d831ec7" } }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      Block {
        Time
      }
      TokenBalance {
        Address
        PostBalance
        PostBalanceInUSD
      }
    }
  }
}
```

## Balance history of one token

Every row for the wallet and token, newest first, is the balance after each transaction that touched it. Saved query [here](https://ide.bitquery.io/Get-Token-Balance-History).

```graphql
{
  EVM(network: eth) {
    TransactionBalances(
      limit: { count: 100 }
      orderBy: { descending: Block_Time }
      where: {
        TokenBalance: {
          Address: { is: "0x9642b23Ed1E01Df1092B92641051881a322F5D4E" }
          Currency: { SmartContract: { is: "0xdac17f958d2ee523a2206206994597c13d831ec7" } }
        }
      }
    ) {
      Block {
        Time
        Number
      }
      TokenBalance {
        PostBalance
        PostBalanceInUSD
      }
      Transaction {
        Hash
      }
    }
  }
}
```

## Total supply and market cap of a token

Token rows carry `TotalSupply` and `TotalSupplyInUSD` as of that transaction, so the newest row for a token, from any wallet, is its current supply and on-chain market cap. Saved query [here](https://ide.bitquery.io/Get-Token-Total-Supply-and-Market-Cap).

```graphql
{
  EVM(network: eth) {
    TransactionBalances(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        TokenBalance: {
          Currency: { SmartContract: { is: "0xdac17f958d2ee523a2206206994597c13d831ec7" } }
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

## Stream balance changes of a token

The token filter as a subscription delivers a row for every address whose USDT balance changes, as each transaction is indexed. Add the wallet to the filter to follow one holder. Saved stream [here](https://ide.bitquery.io/Track-Token-Balance-Changes-by-Transaction).

```graphql
subscription {
  EVM(network: eth) {
    TransactionBalances(
      where: {
        TokenBalance: {
          Currency: { SmartContract: { is: "0xdac17f958d2ee523a2206206994597c13d831ec7" } }
        }
      }
    ) {
      Block {
        Time
      }
      TokenBalance {
        Address
        PostBalance
        PostBalanceInUSD
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

<FAQ
  items={[
    { q: "How do I get an ERC-20 balance for a wallet on Ethereum?", a: "Query TransactionBalances with the wallet in TokenBalance.Address and the token contract in Currency.SmartContract, ordered by Block_Time descending with limit 1. PostBalance is the balance after the wallet's latest transaction in that token." },
    { q: "What if the wallet has not moved the token recently?", a: "Then it has no row in the realtime window. Use the Balances cube, which returns the current balance of any address without depending on recent activity." },
    { q: "Do token rows have a reason code or a pre-balance?", a: "No. Reason codes and PreBalance exist for native ETH rows only. Token rows carry PostBalance, its USD value and the token's total supply." },
    { q: "How do I get a token's total supply and market cap?", a: "Take the newest TransactionBalances row for the token contract, from any address; TotalSupply and TotalSupplyInUSD on it are the supply and on-chain market cap at that transaction." },
    { q: "Can I list every token a wallet holds?", a: "Within the realtime window, yes: filter the wallet, keep the newest row per token with limitBy on the token contract, and sort by PostBalanceInUSD. For a full holdings list use the Balances cube." },
  ]}
/>

## Related pages

- [Ethereum transaction balance tracker](/docs/blockchain/Ethereum/balances/transaction-balance-tracker/eth-transaction-balance-tracker)
- [Ethereum NFT balance API](/docs/blockchain/Ethereum/balances/transaction-balance-tracker/nft-balance-api)
- [Balances and Holders cubes](/docs/cubes/balances-cube)
- [Ethereum token market cap API](/docs/blockchain/Ethereum/token-supply/ethereum-token-marketcap-api)
