---
sidebar_position: 3
---

# Base Miner Balance Tracker

The Base Miner Balance Tracker API provides real-time balance updates for Base miners, tracking their mining rewards, uncle block rewards, and transaction fee rewards.

<head>
<meta name="title" content="Base Miner Balance Tracker API & Streams"/>
<meta name="description" content="Learn how to track Base miner balances, mining rewards, and uncle block rewards using Bitquery's Miner Balance Tracker API."/>
<meta name="keywords" content="base miner balance, mining rewards, miner balance tracker, base mining api, uncle block rewards, transaction fee rewards, miner rewards api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Base Miner Balance Tracker API & Streams"
/>
<meta
  property="og:description"
  content="Learn how to track Base miner balances, mining rewards, and uncle block rewards using Bitquery's Miner Balance Tracker API."
/>

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Base Miner Balance Tracker API & Streams" />
<meta property="twitter:description" content="Learn how to track Base miner balances, mining rewards, and uncle block rewards using Bitquery's Miner Balance Tracker API." />
</head>

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
