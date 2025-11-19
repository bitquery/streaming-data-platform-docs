---
sidebar_position: 4
---

# Ethereum MEV Balance Tracker

The Ethereum MEV (Maximal Extractable Value) Balance Tracker API provides real-time balance updates related to MEV activities, including transaction fee rewards, block builder rewards, and other MEV-related balance changes.

<head>
<meta name="title" content="Ethereum MEV Balance Tracker API & Streams"/>
<meta name="description" content="Learn how to track Ethereum MEV-related balance changes, transaction fee rewards, and block builder rewards using Bitquery's MEV Balance Tracker API."/>
<meta name="keywords" content="ethereum mev balance, mev tracker, mev balance api, transaction fee rewards, block builder rewards, mev extraction, ethereum mev api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Ethereum MEV Balance Tracker API & Streams"
/>
<meta
  property="og:description"
  content="Learn how to track Ethereum MEV-related balance changes, transaction fee rewards, and block builder rewards using Bitquery's MEV Balance Tracker API."
/>

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Ethereum MEV Balance Tracker API & Streams" />
<meta property="twitter:description" content="Learn how to track Ethereum MEV-related balance changes, transaction fee rewards, and block builder rewards using Bitquery's MEV Balance Tracker API." />
</head>

## Track MEV-Boost Relay Transaction Balances

Track balance changes for MEV-boost relay addresses to monitor their activity and rewards. This example uses the `BloXroute Max Profit` address.

[Run query](https://ide.bitquery.io/BloXroute-Max-Profit-Tx-Balance-Tracker)

```graphql
{
  EVM(network: eth) {
    TransactionBalances(
      where: {
        TokenBalance: {
          Address: { is: "0xF2f5C73fa04406b1995e397B55c24aB1f3eA726C" }
        }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
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
        PreBalanceInUSD
        PostBalanceInUSD
        Address
        BalanceChangeReasonCode
      }
      Transaction {
        Hash
        From
        To
        Value
        ValueInUSD
        GasPrice
        Index
      }
    }
  }
}
```

## Track MEV-Related Balance Updates

Monitor balance changes related to MEV activities, including transaction fee rewards and block builder rewards. Try the API [here](https://ide.bitquery.io/Track-MEV-Related-Balance-Updates).

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

**Balance Change Reason Code for MEV:**

- **Code 5**: `BalanceIncreaseRewardTransactionFee` - Transaction tip increasing block builder's balance (MEV-related)

## Track MEV Payout Transaction Balances with MEV Reward

This query focuses on a block builder address and returns the most recent payouts,
including the token metadata, pre/post balances, and USD valuations, so you can
quickly see how large each MEV reward was.

[Try the API](https://ide.bitquery.io/QuasarBuilder-MEV-Payout-Transaction-Balance)

```
{
  EVM(network: eth) {
    TransactionBalances(
      limit: {count: 10}
      where: {Transaction: {}, TokenBalance: {BalanceChangeReasonCode: {eq: 6}, Address: {is: "0x396343362be2a4da1ce0c1c210945346fb82aa49"}}}
      orderBy: {descending: Block_Time}
    ) {
      Block {
        Time
      }
      TokenBalance {
        Currency {
          Symbol
          HasURI
          SmartContract
        }
        PreBalance
        PostBalance
        Address
        BalanceChangeReasonCode
        TotalSupplyInUSD
        TotalSupply
        TokenOwnership {
          Owns
          Id
        }
        PostBalanceInUSD
      }
      Transaction {
        Hash
        MEV_reward: Value
        ValueInUSD
      }
    }
  }
}
```

## Track Block Builder Rewards

Monitor transaction fee rewards received by block builders (MEV extractors):
Try the API [here](https://ide.bitquery.io/Track-Block-Builder-Rewards).

```graphql
subscription {
  EVM(network: eth) {
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
Try the API [here](https://ide.bitquery.io/Filter-by-MEV-Bot-or-Builder-Address).

```graphql
subscription {
  EVM(network: eth) {
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
Try the API [here](https://ide.bitquery.io/Track-Large-MEV-Transactions).

```graphql
subscription {
  EVM(network: eth) {
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
Try the API [here](https://ide.bitquery.io/Aggregate-MEV-Rewards).

```graphql
{
  EVM(dataset: archive, network: eth) {
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
