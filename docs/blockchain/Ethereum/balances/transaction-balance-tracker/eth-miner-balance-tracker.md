---
sidebar_position: 3
---

# Ethereum Miner Balance Tracker

The Ethereum Miner Balance Tracker API provides real-time balance updates for Ethereum miners, tracking their mining rewards, uncle block rewards, and transaction fee rewards.

<head>
<meta name="title" content="Ethereum Miner Balance Tracker API & Streams"/>
<meta name="description" content="Learn how to track Ethereum miner balances, mining rewards, and uncle block rewards using Bitquery's Miner Balance Tracker API."/>
<meta name="keywords" content="ethereum miner balance, mining rewards, miner balance tracker, ethereum mining api, uncle block rewards, transaction fee rewards, miner rewards api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Ethereum Miner Balance Tracker API & Streams"
/>
<meta
  property="og:description"
  content="Learn how to track Ethereum miner balances, mining rewards, and uncle block rewards using Bitquery's Miner Balance Tracker API."
/>

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Ethereum Miner Balance Tracker API & Streams" />
<meta property="twitter:description" content="Learn how to track Ethereum miner balances, mining rewards, and uncle block rewards using Bitquery's Miner Balance Tracker API." />
</head>

## Track Miner Balance Updates

Monitor balance changes for Ethereum miners, including block rewards, uncle block rewards, and transaction fee rewards. Try the API [here](https://ide.bitquery.io/Track-Miner-Balance-Updates).

```graphql
subscription {
  EVM(network: eth) {
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
Try the API [here](https://ide.bitquery.io/Track-Block-Mining-Rewards).

```graphql
subscription {
  EVM(network: eth) {
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
Try the API [here](https://ide.bitquery.io/Track-Uncle-Block-Rewards).

```graphql
subscription {
  EVM(network: eth) {
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
Try the API [here](https://ide.bitquery.io/Track-Transaction-Fee-Rewards).

```graphql
subscription {
  EVM(network: eth) {
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
Try the API [here](https://ide.bitquery.io/Filter-by-Miner-Address).

```graphql
subscription {
  EVM(network: eth) {
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

## Historical Miner Balance Data

Query historical miner balance data for analysis:
Try the API [here](https://ide.bitquery.io/Historical-Miner-Balance-Data).

```graphql
{
  EVM(dataset: archive, network: eth) {
    TransactionBalances(
      where: {
        TokenBalance: {
          Address: { is: "0xMinerAddressHere" }
          BalanceChangeReasonCode: { in: [1, 2, 5] }
        }
      }
      limit: { count: 1000 }
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
