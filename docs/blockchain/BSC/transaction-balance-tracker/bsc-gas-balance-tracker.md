---
sidebar_position: 6
title: "BSC Gas Balance Tracker: Gas Bought, Refunded and Collected on BNB Chain"
sidebar_label: "BSC Gas Balance Tracker"
description: "Gas on BNB Chain from balance changes with Bitquery GraphQL: gas bought and refunded per transaction for an address, the busiest payers, and a stream."
keywords:
  - BSC gas balance tracker
  - BNB Chain gas fees API
  - balance change reason code 6
  - gas refund BSC
  - BNB gas spend per address
---

import FAQ from "@site/src/components/FAQ";

# BSC Gas Balance Tracker: Gas Bought, Refunded and Collected on BNB Chain

BNB Chain reports gas the way Ethereum does, in three balance changes per transaction: the sender's BNB drops by the gas limit times the gas price before execution, reason code 6; whatever gas was not used comes back after execution, reason code 7; and the fee for the gas that was used is credited to the block producer, reason code 5. The `TransactionBalances` cube records all three with the balance before and after, so the gas an address paid is the code 6 debit minus the code 7 refund, transaction by transaction. Every example runs in the [IDE](https://ide.bitquery.io) on a free account; the cube holds the recent realtime window only. The example address is a bot that sends transactions every few seconds, `0x10168749958f03a7c95432bd934058c77be787b0`; swap in any sender.

## Gas bought per transaction for one address

Code 6 rows for the sender over the last hour; the time window keeps the scan small on a chain this busy. `gasBought` is the balance before minus the balance after, which equals `Gas` times `GasPrice` on the transaction. `calculate` only sees fields that are selected, so keep both balances in the query. Saved query [here](https://ide.bitquery.io/Latest-balance-and-gas-fee-paid-for-an-address-bsc).

```graphql
{
  EVM(network: bsc) {
    TransactionBalances(
      where: {
        TokenBalance: {
          BalanceChangeReasonCode: { eq: 6 }
          Address: { is: "0x10168749958f03a7c95432bd934058c77be787b0" }
        }
        Block: { Time: { since_relative: { hours_ago: 1 } } }
      }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
        Number
      }
      TokenBalance {
        PreBalance
        PostBalance
        PostBalanceInUSD
      }
      Transaction {
        Hash
        Gas
        GasPrice
      }
      gasBought: calculate(
        expression: "$TokenBalance_PreBalance - $TokenBalance_PostBalance"
      )
    }
  }
}
```

## Gas refunded to the same address

Code 7 rows are the unused gas coming back; a transaction that used its whole gas limit has none. Subtract this from the code 6 debit of the same hash to get the gas the transaction really cost. Saved query [here](https://ide.bitquery.io/Latest-balance-after-unused-gas-fee-returned--for-an-address-bsc).

```graphql
{
  EVM(network: bsc) {
    TransactionBalances(
      where: {
        TokenBalance: {
          BalanceChangeReasonCode: { eq: 7 }
          Address: { is: "0x10168749958f03a7c95432bd934058c77be787b0" }
        }
        Block: { Time: { since_relative: { hours_ago: 1 } } }
      }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      TokenBalance {
        PreBalance
        PostBalance
      }
      Transaction {
        Hash
      }
      refund: calculate(
        expression: "$TokenBalance_PostBalance - $TokenBalance_PreBalance"
      )
    }
  }
}
```

## The busiest gas payers right now

Group code 6 rows by address over a short window and count them. The top of the list is bots and exchange hot wallets. Saved query [here](https://ide.bitquery.io/top-gas-fee-collectors-bsc).

```graphql
{
  EVM(network: bsc) {
    TransactionBalances(
      where: {
        TokenBalance: { BalanceChangeReasonCode: { eq: 6 } }
        Block: { Time: { since_relative: { minutes_ago: 10 } } }
      }
      orderBy: { descendingByField: "transactions" }
      limit: { count: 20 }
    ) {
      TokenBalance {
        Address
      }
      transactions: count
    }
  }
}
```

## Several addresses at once

`in` takes a list, and `limitBy` on the address keeps the newest row per address, so one query returns the latest gas debit of every wallet you watch. Saved query [here](https://ide.bitquery.io/Latest-balance-and-gas-fee-paid-for-multiple-addresses-bsc).

```graphql
{
  EVM(network: bsc) {
    TransactionBalances(
      where: {
        TokenBalance: {
          BalanceChangeReasonCode: { eq: 6 }
          Address: {
            in: [
              "0x10168749958f03a7c95432bd934058c77be787b0"
              "0x42d73da3daca18374ee1ab8d700351350a3b0064"
            ]
          }
        }
        Block: { Time: { since_relative: { hours_ago: 1 } } }
      }
      limitBy: { by: TokenBalance_Address, count: 1 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      TokenBalance {
        Address
        PreBalance
        PostBalance
      }
      Transaction {
        Hash
        Gas
        GasPrice
      }
      gasBought: calculate(
        expression: "$TokenBalance_PreBalance - $TokenBalance_PostBalance"
      )
    }
  }
}
```

## Stream the gas one address pays

The code 6 filter as a subscription delivers a message for every transaction the address sends, as it is indexed. Saved stream [here](https://ide.bitquery.io/Monitor-balance-and-gas-fee-paid-for-an-address-using-stream-bsc).

```graphql
subscription {
  EVM(network: bsc) {
    TransactionBalances(
      where: {
        TokenBalance: {
          BalanceChangeReasonCode: { eq: 6 }
          Address: { is: "0x10168749958f03a7c95432bd934058c77be787b0" }
        }
      }
    ) {
      Block {
        Time
      }
      TokenBalance {
        PreBalance
        PostBalance
      }
      Transaction {
        Hash
        GasPrice
      }
      gasBought: calculate(
        expression: "$TokenBalance_PreBalance - $TokenBalance_PostBalance"
      )
    }
  }
}
```

## Where the fees go

The fee for used gas is credited with reason code 5 to BNB Chain's fee holder, `0xfffffffffffffffffffffffffffffffffffffffe`, and moved to the ValidatorSet contract at the end of each block. The [BSC MEV balance tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-mev-balance-tracker) streams those credits and shows fee income per block and per validator.

<FAQ
  items={[
    { q: "How do I get the gas an address paid on BNB Chain?", a: "Take its reason code 6 rows: PreBalance minus PostBalance is the gas bought for that transaction. Subtract the code 7 refund of the same hash for the amount finally spent." },
    { q: "Why are there two balance changes for gas in one transaction?", a: "The gas limit is charged before execution (code 6) and the unused part is returned after it (code 7). The difference is the gas actually used times the gas price." },
    { q: "Can I see who pays the most gas on BSC?", a: "Group reason code 6 rows by TokenBalance.Address over a window and count. Sorting by count gives the busiest senders; bots and exchange wallets lead." },
    { q: "Does Base use the same codes?", a: "No. Base folds gas into the sender's code 0 balance change and credits fees to its fee vaults with code 5; see the Base gas balance tracker." },
    { q: "How far back does this data go?", a: "TransactionBalances holds the recent realtime window only. For older gas costs use the Transactions cube, which carries gas and cost per transaction on the archive dataset." },
  ]}
/>

## Related pages

- [BSC transaction balance tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-transaction-balance-tracker)
- [BSC MEV balance tracker](/docs/blockchain/BSC/transaction-balance-tracker/bsc-mev-balance-tracker)
- [Base gas balance tracker](/docs/blockchain/Base/transaction-balance-tracker/base-gas-balance-tracker)
- [Balance change reason codes](/docs/blockchain/BSC/transaction-balance-tracker/#balance-change-reason-codes)
