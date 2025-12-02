---
sidebar_position: 4
---

# Base MEV Balance Tracker

The Base MEV (Maximal Extractable Value) Balance Tracker API provides real-time balance updates related to MEV activities, including transaction fee rewards, block builder rewards, and other MEV-related balance changes.

<head>
<meta name="title" content="Base MEV Balance Tracker API & Streams"/>
<meta name="description" content="Learn how to track Base MEV-related balance changes, transaction fee rewards, and block builder rewards using Bitquery's MEV Balance Tracker API."/>
<meta name="keywords" content="base mev balance, mev tracker, mev balance api, transaction fee rewards, block builder rewards, mev extraction, base mev api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Base MEV Balance Tracker API & Streams"
/>
<meta
  property="og:description"
  content="Learn how to track Base MEV-related balance changes, transaction fee rewards, and block builder rewards using Bitquery's MEV Balance Tracker API."
/>

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Base MEV Balance Tracker API & Streams" />
<meta property="twitter:description" content="Learn how to track Base MEV-related balance changes, transaction fee rewards, and block builder rewards using Bitquery's MEV Balance Tracker API." />
</head>

## Track MEV-Related Balance Updates

Monitor balance changes related to MEV activities, including transaction fee rewards and block builder rewards. Try the API [here](https://ide.bitquery.io/Track-MEV-Related-Balance-Updates-base).

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

**Balance Change Reason Code for MEV:**

- **Code 5**: `BalanceIncreaseRewardTransactionFee` - Transaction tip increasing block builder's balance (MEV-related)

## Track Block Builder Rewards

Monitor transaction fee rewards received by block builders (MEV extractors):
Try the API [here](https://ide.bitquery.io/Track-Block-Builder-Rewards-base).

```graphql
subscription {
  EVM(network: base) {
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
Try the API [here](https://ide.bitquery.io/Filter-by-MEV-Bot-or-Builder-Address-base).

```graphql
subscription {
  EVM(network: base) {
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
Try the API [here](https://ide.bitquery.io/Track-Large-MEV-Transactions-base).

```graphql
subscription {
  EVM(network: base) {
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
