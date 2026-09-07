---
title: "BSC Transaction Balance Tracker API: Balance Changes With a Reason Code"
sidebar_label: "Overview"
description: "How the BNB Chain balance tracker works: one row per balance change with pre and post balance and a reason code, which codes occur, and the tracker pages."
slug: /blockchain/BSC/transaction-balance-tracker/
keywords:
  - BSC Transaction Balance Tracker
  - BSC Balance API
  - Transaction Balance API
  - Balance Change Reason Codes
  - BNB Chain balance stream
  - MEV Balance Tracker
  - Self-Destruct Balance API
---

import FAQ from "@site/src/components/FAQ";

# BSC Transaction Balance Tracker API: Balance Changes With a Reason Code

The `TransactionBalances` cube under `EVM(network: bsc)` writes one row for every balance that a transaction changes: the address, the currency, the balance before and after, the USD value, and for BNB a reason code that says why it moved. A transfer, a gas charge, a gas refund, a fee credit to the block producer and a self-destruct each carry their own code, so one filter separates them without decoding calls. The same rows serve as a live stream and as a query over the recent realtime window; the cube has no archive dataset, so keep what you need by recording the stream. Every example on the tracker pages runs in the [IDE](https://ide.bitquery.io) on a free account.

## The reason codes that occur on BNB Chain

Native BNB rows carry one of these in live data. The rest of the schema, listed further down, belongs to other chains' history and returns nothing here.

| Code | Name | What it marks | Page |
|---|---|---|---|
| 10 | BalanceChangeTransfer | BNB moved by a transaction or an internal call | [Transaction tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-transaction-balance-tracker) |
| 6 | BalanceDecreaseGasBuy | Gas limit charged to the sender before execution | [Gas tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-gas-balance-tracker) |
| 7 | BalanceIncreaseGasReturn | Unused gas refunded after execution | [Gas tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-gas-balance-tracker) |
| 5 | BalanceIncreaseRewardTransactionFee | Fee for used gas credited to the fee holder, then deposited to the ValidatorSet contract per block | [MEV tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-mev-balance-tracker), [Miner tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-miner-balance-tracker) |
| 12, 13 | BalanceIncreaseSelfdestruct, BalanceDecreaseSelfdestruct | Recipient and contract of a `selfdestruct` | [Self-destruct tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-self-destruct-balance-api) |
| 0 | BalanceChangeUnspecified | Everything without a more specific reason, and every token row | [Transaction tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-transaction-balance-tracker) |

Codes 1 and 2, the mining rewards, never appear because BNB Chain has validators, not miners; code 3, consensus-layer withdrawals, never appears because withdrawals are not transactions; code 14 has no live occurrences. The [miner tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-miner-balance-tracker) shows the count query that proves it and what block producers earn instead.

## The tracker pages

- [BSC transaction balance tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-transaction-balance-tracker): stream one address, latest BNB or BEP-20 balance of a wallet, pool reserves, token supply and market cap.
- [BSC gas balance tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-gas-balance-tracker): gas bought and refunded per transaction for an address, the busiest gas payers, a live gas stream.
- [BSC MEV balance tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-mev-balance-tracker): every priority fee as it is paid, the largest tips, one bot's spending, fee income per block.
- [BSC miner balance tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-miner-balance-tracker): what block producers earn on a chain without miners, per block and per validator.
- [BSC validator balance tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-validator-balance-tracker): the staking side of validator balances.
- [BSC self-destruct balance tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-self-destruct-balance-api): contracts that destroy themselves and the addresses that collect their BNB.
- [BSC transfer balance tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-transfer-balance-tracker): balance changes caused by transfers.

## One row, three shapes

The fields a row carries depend on the currency.

- **BNB:** `BalanceChangeReasonCode`, `PreBalance`, `PostBalance`, `PostBalanceInUSD`.
- **BEP-20 tokens:** `PostBalance`, `PostBalanceInUSD`, `TotalSupply`, `TotalSupplyInUSD`; no pre-balance and no reason code.
- **NFTs:** `PostBalance` and `TokenOwnership`; no USD values.

## The smallest useful query

The newest balance changes of one address, any currency, which is the shape most of the tracker pages build on.

```graphql
{
  EVM(network: bsc) {
    TransactionBalances(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: { TokenBalance: { Address: { is: "0x238a358808379702088667322f80ac48bad5e6c4" } } }
    ) {
      Block {
        Time
      }
      TokenBalance {
        BalanceChangeReasonCode
        PreBalance
        PostBalance
        PostBalanceInUSD
        Currency {
          Symbol
          Native
        }
      }
      Transaction {
        Hash
      }
    }
  }
}
```

Change `query` to `subscription` and drop `limit` and `orderBy` to follow the address live. Kafka carries the same rows on the `bsc.tokens.proto` topic; see the [Kafka streams hub](/docs/category/kafka-streams).

## The full code list {#balance-change-reason-codes}

Defined for every EVM chain the cube serves; only the codes in the first table occur on BNB Chain.

| Code | Reason | Description |
|---|---|---|
| 0 | BalanceChangeUnspecified | No specific reason recorded |
| 1 | BalanceIncreaseRewardMineUncle | Uncle block reward (proof-of-work chains) |
| 2 | BalanceIncreaseRewardMineBlock | Block mining reward (proof-of-work chains) |
| 3 | BalanceIncreaseWithdrawal | Consensus-layer validator withdrawal |
| 4 | BalanceIncreaseGenesisBalance | Balance allocated at genesis |
| 5 | BalanceIncreaseRewardTransactionFee | Fee for used gas credited to the block producer |
| 6 | BalanceDecreaseGasBuy | Gas limit charged before execution |
| 7 | BalanceIncreaseGasReturn | Unused gas refunded after execution |
| 8 | BalanceIncreaseDaoContract | DAO refund contract credit (Ethereum, 2016) |
| 9 | BalanceDecreaseDaoAccount | DAO account debit (Ethereum, 2016) |
| 10 | BalanceChangeTransfer | Value moved by a call |
| 11 | BalanceChangeTouchAccount | Zero-value transfer that creates an account |
| 12 | BalanceIncreaseSelfdestruct | Recipient of a self-destructed contract's balance |
| 13 | BalanceDecreaseSelfdestruct | Contract emptied by self-destruct |
| 14 | BalanceDecreaseSelfdestructBurn | Value sent to an account already destroyed in the same transaction |
| 15 | BalanceChangeRevert | Balance restored after a failed call |

<FAQ
  items={[
    { q: "What is the BSC transaction balance tracker?", a: "A cube that records every balance a transaction changes on BNB Chain, with the balance before and after and, for BNB, a reason code. It answers who paid, who received, how much gas was charged and refunded, and where fees went, in one query or stream." },
    { q: "Which reason codes actually occur on BNB Chain?", a: "0, 5, 6, 7, 10, 12 and 13. Mining codes 1 and 2 and withdrawal code 3 never appear, and code 14 has no live occurrences." },
    { q: "Do token balances carry a reason code?", a: "No. Reason codes are for BNB only. BEP-20 rows carry the post balance, its USD value and the token's total supply; NFT rows carry the post balance and ownership." },
    { q: "How far back does the balance tracker go?", a: "The recent realtime window only; there is no archive dataset for this cube. Stream the rows you need, over WebSocket or the Kafka topic, and store them." },
    { q: "How does it differ from the Balances cube?", a: "Balances gives the current balance of an address whether or not it transacted recently. TransactionBalances gives the history of changes with reasons, but only for addresses that transacted inside the window." },
  ]}
/>
