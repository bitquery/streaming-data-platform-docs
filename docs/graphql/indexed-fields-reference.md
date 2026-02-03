---
sidebar_position: 4
title: Indexed Fields Reference (where & orderBy)
description: Use indexed fields in where and orderBy for correct, fast queries. Reference of indexed fields per cube, dataset, and chain.
keywords:
  - indexed fields
  - where filter
  - orderBy
  - query performance
  - cube indexes
---

# Indexed Fields Reference for `where` and `orderBy`

Use **indexed fields** in your `where` filters and `orderBy` clauses. Filtering or sorting on non-indexed fields can lead to slow queries, timeouts.

This page lists the fields that are indexed for each cube, dataset, and chain type. Prefer these fields when building `where` and `orderBy` conditions.

:::tip Best practice
In `where`, filter on at least one indexed field (Index 1, 2, 3, or 4 where applicable). In `orderBy`, sort by an indexed field when possible.
:::

---

## EVM (Archive)

| Cube                 | Index 1                      | Index 2                | Index 3           | Index 4                         |
| -------------------- | ---------------------------- | ---------------------- | ----------------- | ------------------------------- |
| **BalanceUpdates**   | BalanceUpdate_Address        | Currency_SmartContract | Transaction_Hash  | —                               |
| **Blocks**           | Block_Hash                   | Block_Number           | —                 | —                               |
| **Calls**            | Call_From                    | Call_To                | Transaction_Hash  | —                               |
| **DEXTrades**        | Transaction_Hash             | —                      | —                 | —                               |
| **DEXTradeByTokens** | Trade_Currency_SmartContract | Trade_Side_Seller      | —                 | —                               |
| **Events**           | Call_To                      | Transaction_Hash       | —                 | —                               |
| **MinerRewards**     | Block_Coinbase               | Block_Number           | Block_Hash        | —                               |
| **TokenHolders**     | Currency_SmartContract       | —                      | —                 | —                               |
| **Transactions**     | Transaction_From             | Transaction_Hash       | Transaction_To    | —                               |
| **Transfers**        | Transaction_Hash             | Transfer_Sender        | Transfer_Receiver | Transfer_Currency_SmartContract |

---

## Tron (Archive)

| Cube                 | Index 1                      | Index 2                | Index 3           | Index 4                         |
| -------------------- | ---------------------------- | ---------------------- | ----------------- | ------------------------------- |
| **BalanceUpdates**   | BalanceUpdate_Address        | Currency_SmartContract | Transaction_Hash  | —                               |
| **Blocks**           | Block_Hash                   | Block_Number           | —                 | —                               |
| **Calls**            | Call_From                    | Call_To                | Transaction_Hash  | —                               |
| **DEXTrades**        | Transaction_Hash             | —                      | —                 | —                               |
| **DEXTradeByTokens** | Trade_Currency_SmartContract | Trade_Side_Seller      | —                 | —                               |
| **Events**           | Call_To                      | Transaction_Hash       | —                 | —                               |
| **Transactions**     | Transaction_Hash             | —                      | —                 | —                               |
| **Transfers**        | Transaction_Hash             | Transfer_Sender        | Transfer_Receiver | Transfer_Currency_SmartContract |

---

## Solana

### Solana Realtime

| Cube                 | Index 1                    | Index 2                     | Index 3               |
| -------------------- | -------------------------- | --------------------------- | --------------------- |
| **DEXPools**         | Pool_Market_MarketAddress  | —                           | —                     |
| **DEXTradeByTokens** | Trade_Currency_MintAddress | —                           | —                     |
| **Instructions**     | Transaction_Signer         | Instruction_Program_Address | —                     |
| **Transfers**        | Transfer_Receiver_Owner    | Transfer_Sender_Owner       | Transaction_Signature |

### Solana Archive

| Cube                 | Index 1                    | Index 2             | Index 3 |
| -------------------- | -------------------------- | ------------------- | ------- |
| **DEXTradeByTokens** | Trade_Currency_MintAddress | Trade_Account_Owner | —       |

---

## Trading (Realtime)

| Cube           | Index 1     | Index 2             | Index 3             |
| -------------- | ----------- | ------------------- | ------------------- |
| **Currencies** | Currency_Id | Interval_Time_Start | —                   |
| **Tokens**     | Token_Id    | Interval_Time_Start | —                   |
| **Pairs**      | Token_Id    | Currency_Id         | Interval_Time_Start |

---

## How to use this reference

1. **Identify your cube** — e.g. `EVM.Transactions`, `Solana.Transfers`, `Trading.Tokens`.
2. **Check chain and dataset** — EVM Archive, Tron Archive, Solana Realtime/Archive, or Trading Realtime.
3. **Use indexed fields in `where`** — Prefer filters on the indexed columns (Index 1, 2, 3, 4). Example: for `EVM(dataset: archive).Transactions`, filter on `Transaction_From`, `Transaction_Hash`, or `Transaction_To`.
4. **Use indexed fields in `orderBy`** — Sort by one of the indexed fields (e.g. `Block_Number`, `Transaction_Hash`) for predictable, fast ordering.

Using fields that are **not** in these tables for filtering or sorting may work in some cases but can cause poor performance or unexpected behavior. When in doubt, stick to the indexed fields listed above.
