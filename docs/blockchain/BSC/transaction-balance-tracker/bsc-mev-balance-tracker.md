---
sidebar_position: 4
title: "BSC MEV Balance Tracker"
description: "BSC MEV Balance Tracker: stream BNB Chain balance changes with reason codes using Bitquery GraphQL subscriptions. Keep queries fast with indexed filters."
---
# BSC MEV Balance Tracker

The BSC MEV (Maximal Extractable Value) Balance Tracker API provides real-time balance updates related to MEV activities, including transaction fee rewards, block builder rewards, and other MEV-related balance changes.

## Track MEV-Related Balance Updates

Monitor balance changes related to MEV activities, including transaction fee rewards and block builder rewards. Try the API [here](https://ide.bitquery.io/Track-MEV-Related-Balance-Updates-bsc).

```graphql
subscription {
  EVM(network: bsc) {
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

**Balance Change Reason Code for MEV:**

- **Code 5**: `BalanceIncreaseRewardTransactionFee` - Transaction tip increasing block builder's balance (MEV-related)

## Track Block Builder Rewards

Monitor transaction fee rewards received by block builders (MEV extractors):
Try the API [here](https://ide.bitquery.io/Track-Block-Builder-Rewards-bsc).

```graphql
subscription {
  EVM(network: bsc) {
    TransactionBalances(
      where: {
        TokenBalance: { BalanceChangeReasonCode: { eq: 5 } }
        Block: { Number: { gt: "0" } }
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
        GasPrice
      }
    }
  }
}
```

## Filter by MEV Bot or Builder Address

Track balance changes for specific MEV bots or block builders:
Try the API [here](https://ide.bitquery.io/Filter-by-MEV-Bot-or-Builder-Address-bsc).

```graphql
subscription {
  EVM(network: bsc) {
    TransactionBalances(
      where: {
        TokenBalance: {
          Address: { is: "0xMEVBotOrBuilderAddressHere" }
          BalanceChangeReasonCode: { eq: 5 }
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

        GasPrice
      }
    }
  }
}
```

## Track Large MEV Transactions

Monitor large transaction fee rewards that may indicate significant MEV extraction:
Try the API [here](https://ide.bitquery.io/Track-Large-MEV-Transactions-bsc).

```graphql
subscription {
  EVM(network: bsc) {
    TransactionBalances(
      where: {
        TokenBalance: {
          BalanceChangeReasonCode: { eq: 5 }
          PostBalanceInUSD: { gt: "1000" }
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

        GasPrice
      }
    }
  }
}
```

## Aggregate MEV Rewards

Calculate total MEV rewards for a specific address or time period:
Try the API [here](https://ide.bitquery.io/Aggregate-MEV-Rewards-bsc).

```graphql
{
  EVM(dataset: realtime, network: bsc) {
    TransactionBalances(
      where: {
        TokenBalance: {
          Address: { is: "0xMEVBotOrBuilderAddressHere" }
          BalanceChangeReasonCode: { eq: 5 }
        }
      }
    ) {
      TokenBalance {
        Currency {
          Symbol
        }
        totalRewards: sum(of: TokenBalance_PostBalanceInUSD)
        totalRewardsETH: sum(of: TokenBalance_PostBalance)
        rewardCount: count
      }
    }
  }
}
```
