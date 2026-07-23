---
sidebar_position: 3
title: "Base Miner Balance Tracker"
description: "Base Miner Balance Tracker: stream Base balance changes with reason codes using Bitquery GraphQL subscriptions. Copy GraphQL snippets for production apps."
---
# Base Miner Balance Tracker

The Base Miner Balance Tracker API provides real-time balance updates for Base miners, tracking their mining rewards, uncle block rewards, and transaction fee rewards.

## Track Miner Balance Updates

Monitor balance changes for Base miners, including block rewards, uncle block rewards, and transaction fee rewards. Try the API [here](https://ide.bitquery.io/Track-Miner-Balance-Updates-base).

```graphql
subscription {
  EVM(network: base) {
    TransactionBalances(
      where: { TokenBalance: { BalanceChangeReasonCode: { in: [1, 2, 5] } } }
    ) {
      Block {
        Time
        Number
      }
      TokenBalance {
        Currency {
          Symbol
        }
        PreBalance
        PostBalance
        Address
        BalanceChangeReasonCode
        PostBalanceInUSD
      }
      Transaction {
        Hash
      }
    }
  }
}
```

**Balance Change Reason Codes for Miners:**

- **Code 1**: `BalanceIncreaseRewardMineUncle` - Reward for mining an uncle block
- **Code 2**: `BalanceIncreaseRewardMineBlock` - Reward for mining a block
- **Code 5**: `BalanceIncreaseRewardTransactionFee` - Transaction tip increasing block builder's balance

## Track Block Mining Rewards

Track rewards received by miners for successfully mining blocks:
Try the API [here](https://ide.bitquery.io/Track-Block-Mining-Rewards-base).

```graphql
subscription {
  EVM(network: base) {
    TransactionBalances(
      where: { TokenBalance: { BalanceChangeReasonCode: { eq: 2 } } }
    ) {
      Block {
        Time
        Number
      }
      TokenBalance {
        Currency {
          Symbol
        }
        PreBalance
        PostBalance
        Address
        BalanceChangeReasonCode
        PostBalanceInUSD
      }
      Transaction {
        Hash
      }
    }
  }
}
```

## Track Uncle Block Rewards

Monitor rewards for mining uncle blocks:
Try the API [here](https://ide.bitquery.io/Track-Uncle-Block-Rewards-base).

```graphql
subscription {
  EVM(network: base) {
    TransactionBalances(
      where: { TokenBalance: { BalanceChangeReasonCode: { eq: 1 } } }
    ) {
      Block {
        Time
        Number
      }
      TokenBalance {
        Currency {
          Symbol
        }
        PreBalance
        PostBalance
        Address
        BalanceChangeReasonCode
        PostBalanceInUSD
      }
      Transaction {
        Hash
      }
    }
  }
}
```

## Track Transaction Fee Rewards

Monitor transaction fee rewards received by miners:
Try the API [here](https://ide.bitquery.io/Track-Transaction-Fee-Rewards-base).

```graphql
subscription {
  EVM(network: base) {
    TransactionBalances(
      where: { TokenBalance: { BalanceChangeReasonCode: { eq: 5 } } }
    ) {
      Block {
        Time
        Number
      }
      TokenBalance {
        Currency {
          Symbol
        }
        PreBalance
        PostBalance
        Address
        BalanceChangeReasonCode
        PostBalanceInUSD
      }
      Transaction {
        Hash
      }
    }
  }
}
```

## Filter by Miner Address

Track balance changes for a specific miner address:
Try the API [here](https://ide.bitquery.io/Filter-by-Miner-Address-base).

```graphql
subscription {
  EVM(network: base) {
    TransactionBalances(
      where: {
        TokenBalance: {
          Address: { is: "0xMinerAddressHere" }
          BalanceChangeReasonCode: { in: [1, 2, 5] }
        }
      }
    ) {
      Block {
        Time
        Number
      }
      TokenBalance {
        Currency {
          Symbol
        }
        PreBalance
        PostBalance
        Address
        BalanceChangeReasonCode
        PostBalanceInUSD
      }
      Transaction {
        Hash
      }
    }
  }
}
```
