---
sidebar_position: 5
title: "Base Self-Destruct Balance Tracker: Why Base Shows None, and What to Watch"
sidebar_label: "Base Self-Destruct Balance Tracker"
description: "Self-destruct codes never fire on Base and live data shows no SELFDESTRUCT calls, because the opcode only deletes same-transaction contracts. Proof queries."
keywords:
  - Base self-destruct tracker
  - selfdestruct on Base
  - EIP-6780 Base
  - balance change reason code 13
  - Base contract destruction
---

import FAQ from "@site/src/components/FAQ";

# Base Self-Destruct Balance Tracker: Why Base Shows None, and What to Watch

The balance schema has three reason codes for `selfdestruct`: 13 for the contract whose balance empties, 12 for the address that receives it, and 14 for value sent to an account already destroyed in the same transaction. On Base none of them fire. Since the Cancun rules reached the OP Stack, `SELFDESTRUCT` only deletes a contract created in the same transaction; in every other case it just moves the balance, and Base's balance cube reports every native movement as reason code 0 or, for fees, code 5. On top of that, live Base data shows no `SELFDESTRUCT` calls at all in the `Calls` cube over a day. This page gives you the two queries that prove it, so an empty result is a fact rather than a bug, and the queries that catch the patterns people are usually looking for. Every example runs in the [IDE](https://ide.bitquery.io) on a free account.

## Confirm it: the codes are empty

A count over the last day. Change the network to `bsc` and the same query returns a few hundred rows, which is the quickest way to see that the schema is shared and the behaviour is the chain's. Saved query [here](https://ide.bitquery.io/Aggregate-Self-Destruct-Statistics-base).

```graphql
{
  EVM(network: base) {
    TransactionBalances(
      where: {
        TokenBalance: { BalanceChangeReasonCode: { in: [12, 13, 14] } }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      count
    }
  }
}
```

## Confirm it: no SELFDESTRUCT calls

The `Calls` cube keeps the opcode of every internal call, so it would show a destruction even for a contract that held nothing. Saved query [here](https://ide.bitquery.io/Track-recent-ephemeral-contract-patterns-base).

```graphql
{
  EVM(network: base) {
    Calls(
      where: {
        Call: { Opcode: { Name: { is: "SELFDESTRUCT" } } }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Call {
        From
        To
        Value
      }
      Transaction {
        Hash
        From
      }
    }
  }
}
```

Leave this one running as a subscription if you want to be told the moment a destruction does happen: drop `limit`, `orderBy` and the time filter and change `query` to `subscription`.

## What people are usually looking for on Base

- **Short-lived helper contracts.** On BNB Chain and Ethereum, MEV bots destroy their helpers; on Base they simply leave them. Find them with the `Calls` cube: filter `Call.Opcode.Name` on `CREATE` or `CREATE2` and group by `Transaction.From` to see who deploys contracts in bulk, then query the [transaction balance tracker](/docs/blockchain/Base/transaction-balance-tracker/base-transaction-balance-tracker) for the balances those contracts hold.
- **A contract being emptied.** Filter `TransactionBalances` on the contract as `TokenBalance.Address` with `Currency: { Native: true }`; a code 0 row whose `PostBalance` is zero is the sweep.
- **Fees and sequencer income.** Reason code 5 rows on the fee vaults, covered on the [Base gas balance tracker](/docs/blockchain/Base/transaction-balance-tracker/base-gas-balance-tracker).

## The self-destruct queries, ready for other chains

Both blocks below run unchanged on `bsc` and `eth`, where the codes do fire. Code 13 rows are the contracts that emptied, code 12 rows the recipients. Saved stream [here](https://ide.bitquery.io/All-Self-Destruct-Event-Balances-Stream-base).

```graphql
subscription {
  EVM(network: bsc) {
    TransactionBalances(
      where: { TokenBalance: { BalanceChangeReasonCode: { in: [12, 13] } } }
    ) {
      Block {
        Time
        Number
      }
      TokenBalance {
        Address
        BalanceChangeReasonCode
        PreBalance
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

The [BSC self-destruct balance tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-self-destruct-balance-api) walks through the full set on a chain where the pattern is live.

<FAQ
  items={[
    { q: "Does Base have self-destruct balance data?", a: "The codes exist in the schema but return no rows on Base, and the Calls cube shows no SELFDESTRUCT opcode in live data. Native balance movements on Base are reported as reason code 0, fees as code 5." },
    { q: "Why did selfdestruct stop showing up?", a: "Under the Cancun rules the OP Stack adopted, SELFDESTRUCT only deletes a contract created in the same transaction and otherwise just transfers the balance. Contracts on Base do not use it in practice." },
    { q: "How do I check whether a contract on Base was destroyed?", a: "Query Calls with Call.Opcode.Name SELFDESTRUCT and the contract as Call.From. No row means no destruction; a contract that still answers calls was never destroyed." },
    { q: "Where do the self-destruct examples work?", a: "On BNB Chain and Ethereum. Run the queries on this page with network bsc or eth and reason codes 12 and 13 return rows within the realtime window." },
  ]}
/>

## Related pages

- [Base transaction balance tracker](/docs/blockchain/Base/transaction-balance-tracker/base-transaction-balance-tracker)
- [Base gas balance tracker](/docs/blockchain/Base/transaction-balance-tracker/base-gas-balance-tracker)
- [BSC self-destruct balance tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-self-destruct-balance-api)
- [Balance change reason codes](/docs/blockchain/Base/transaction-balance-tracker/#balance-change-reason-codes)
