---
sidebar_position: 2
---

# Ethereum Validator Balance Tracker

The Ethereum Validator Balance Tracker API provides real-time balance updates for Ethereum validators, tracking their staking rewards, withdrawals, and balance changes.

<head>
<meta name="title" content="Ethereum Validator Balance Tracker API & Streams"/>
<meta name="description" content="Learn how to track Ethereum validator balances, staking rewards, and withdrawals using Bitquery's Validator Balance Tracker API."/>
<meta name="keywords" content="ethereum validator balance, validator staking rewards, ethereum validator api, validator balance tracker, ethereum beacon chain, validator withdrawals, staking rewards api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Ethereum Validator Balance Tracker API & Streams"
/>
<meta
  property="og:description"
  content="Learn how to track Ethereum validator balances, staking rewards, and withdrawals using Bitquery's Validator Balance Tracker API."
/>

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Ethereum Validator Balance Tracker API & Streams" />
<meta property="twitter:description" content="Learn how to track Ethereum validator balances, staking rewards, and withdrawals using Bitquery's Validator Balance Tracker API." />
</head>

## Track Validator Balance Updates

Monitor balance changes for Ethereum validators, including staking rewards and withdrawals from the beacon chain.

```graphql
subscription {
  EVM(network: eth) {
    TransactionBalances(
      where: {
        TokenBalance: {
          BalanceChangeReasonCode: { eq: 3 }
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

**Note:** BalanceChangeReasonCode 3 corresponds to `BalanceIncreaseWithdrawal` - ETH withdrawn from the beacon chain.

## Track Validator Rewards

Track validator rewards and balance increases from staking activities.

```graphql
subscription {
  EVM(network: eth) {
    TransactionBalances(
      where: {
        TokenBalance: {
          BalanceChangeReasonCode: { in: [2, 5] }
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

**Balance Change Reason Codes for Validators:**

- **Code 2**: `BalanceIncreaseRewardMineBlock` - Reward for mining a block
- **Code 3**: `BalanceIncreaseWithdrawal` - ETH withdrawn from the beacon chain
- **Code 5**: `BalanceIncreaseRewardTransactionFee` - Transaction tip increasing block builder's balance

## Filter by Validator Address

Track balance changes for a specific validator address:

```graphql
subscription {
  EVM(network: eth) {
    TransactionBalances(
      where: {
        TokenBalance: {
          Address: { is: "0xValidatorAddressHere" }
          BalanceChangeReasonCode: { in: [2, 3, 5] }
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


