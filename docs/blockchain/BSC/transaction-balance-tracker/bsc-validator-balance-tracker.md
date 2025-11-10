---
sidebar_position: 2
---

# BSC Validator Balance Tracker

The BSC Validator Balance Tracker API provides real-time balance updates for BSC validators, tracking their staking rewards, withdrawals, and balance changes.

<head>
<meta name="title" content="BSC Validator Balance Tracker API & Streams"/>
<meta name="description" content="Learn how to track BSC validator balances, staking rewards, and withdrawals using Bitquery's Validator Balance Tracker API."/>
<meta name="keywords" content="bsc validator balance, validator staking rewards, bsc validator api, validator balance tracker, bsc beacon chain, validator withdrawals, staking rewards api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="BSC Validator Balance Tracker API & Streams"
/>
<meta
  property="og:description"
  content="Learn how to track BSC validator balances, staking rewards, and withdrawals using Bitquery's Validator Balance Tracker API."
/>

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="BSC Validator Balance Tracker API & Streams" />
<meta property="twitter:description" content="Learn how to track BSC validator balances, staking rewards, and withdrawals using Bitquery's Validator Balance Tracker API." />
</head>

## Track Validator Balance Updates

Monitor balance changes for BSC validators, including staking rewards and withdrawals from the beacon chain.
Try the API [here](https://ide.bitquery.io/Track-Validator-Balance-Updates-bsc).

```graphql
subscription {
  EVM(network: bsc) {
    TransactionBalances(
      where: { TokenBalance: { BalanceChangeReasonCode: { eq: 3 } } }
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
Try the API [here](https://ide.bitquery.io/Track-Validator-Rewards-bsc).

```graphql
subscription {
  EVM(network: bsc) {
    TransactionBalances(
      where: { TokenBalance: { BalanceChangeReasonCode: { in: [2, 5] } } }
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
Try the API [here](https://ide.bitquery.io/Filter-by-Validator-Address-bsc).

```graphql
subscription {
  EVM(network: bsc) {
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

## Top Validators by Total Tips earned in last 24 hrs

Ranks validators by cumulative priority fees (reason code 5) received in the last 24 hours. Test the query [here](https://ide.bitquery.io/top-validators-by-total-tips-in-last-24-hrs-bsc).

```graphql
query MyQuery {
  EVM(network: bsc, dataset: realtime) {
    TransactionBalances(
      limit: { count: 10 }
      orderBy: { descendingByField: "Total_tip_native" }
      where: {
        TokenBalance: { BalanceChangeReasonCode: { eq: 5 } }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      TokenBalance {
        Address
        BalanceChangeReasonCode
        Currency {
          Name
          Symbol
          SmartContract
        }
      }
      Post: sum(of: TokenBalance_PostBalance)
      Post_USD: sum(of: TokenBalance_PostBalanceInUSD)
      Pre: sum(of: TokenBalance_PreBalance)
      Pre_USD: sum(of: TokenBalance_PreBalanceInUSD)
      Total_tip_native: calculate(expression: "$Post - $Pre")
      Total_tip_usd: calculate(expression: "$Post_USD - $Pre_USD")
      number_of_tips: count
    }
  }
}
```

## Total Tips earned by a Validator in last 24 hrs

Returns the total priority fees (native and USD) earned by a specific validator over the last 24 hours. Test the query [here](https://ide.bitquery.io/total-tips-received-by-a-validator-in-last-24-hrs-bsc).

```graphql
query MyQuery {
  EVM(network: bsc, dataset: realtime) {
    TransactionBalances(
      where: {
        TokenBalance: {
          BalanceChangeReasonCode: { eq: 5 }
          Address: { is: "0xValidatorAddressHere" }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      TokenBalance {
        Address
        BalanceChangeReasonCode
        Currency {
          Name
          Symbol
          SmartContract
        }
      }
      Post: sum(of: TokenBalance_PostBalance)
      Post_USD: sum(of: TokenBalance_PostBalanceInUSD)
      Pre: sum(of: TokenBalance_PreBalance)
      Pre_USD: sum(of: TokenBalance_PreBalanceInUSD)
      Total_tip_native: calculate(expression: "$Post - $Pre")
      Total_tip_usd: calculate(expression: "$Post_USD - $Pre_USD")
      number_of_tips: count
    }
  }
}
```

## Avg Tip in last 10 Blocks

Calculates the average tip for each of the last 10 blocks. Test the query [here](https://ide.bitquery.io/last-10-blocks-avg-tip-in-native-bnb).

```graphql
query MyQuery {
  EVM(network: bsc, dataset: realtime) {
    TransactionBalances(
      limit: { count: 10 }
      orderBy: { descending: Block_Number }
      where: { TokenBalance: { BalanceChangeReasonCode: { eq: 5 } } }
    ) {
      Block {
        Number
      }
      TokenBalance {
        BalanceChangeReasonCode
        Currency {
          Name
          Symbol
          SmartContract
        }
      }
      Post: sum(of: TokenBalance_PostBalance)
      Post_USD: sum(of: TokenBalance_PostBalanceInUSD)
      Pre: sum(of: TokenBalance_PreBalance)
      Pre_USD: sum(of: TokenBalance_PreBalanceInUSD)
      Total_tip_native: calculate(expression: "$Post - $Pre")
      Total_tip_usd: calculate(expression: "$Post_USD - $Pre_USD")
      number_of_tips: count
      avg_tip_in_this_block: calculate(
        expression: "$Total_tip_native / $number_of_tips"
      )
      avg_tip_usd_in_this_block: calculate(
        expression: "$Total_tip_usd / $number_of_tips"
      )
    }
  }
}
```

## Avg Tip given in terms of Avg Gas Fees in last 10 blocks

Compares average user tip to average total gas fee per block across the last 10 blocks. Test the query [here](https://ide.bitquery.io/Average-Tip-in-terms-of-avg-gas-Fee-bsc).

```graphql
query MyQuery {
  EVM(network: bsc, dataset: realtime) {
    TransactionBalances(
      limit: { count: 10 }
      orderBy: { descending: Block_Number }
      where: {
        TokenBalance: { BalanceChangeReasonCode: { eq: 5 } }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      Block {
        Number
      }
      TokenBalance {
        BalanceChangeReasonCode
        Currency {
          Name
          Symbol
          SmartContract
        }
      }
      avg_gasfees_in_this_block: average(of: Fee_SenderFee)
      Post: sum(of: TokenBalance_PostBalance)
      Post_USD: sum(of: TokenBalance_PostBalanceInUSD)
      Pre: sum(of: TokenBalance_PreBalance)
      Pre_USD: sum(of: TokenBalance_PreBalanceInUSD)
      Total_tip_native: calculate(expression: "$Post - $Pre")
      Total_tip_usd: calculate(expression: "$Post_USD - $Pre_USD")
      number_of_tips: count
      avg_tip_in_this_block: calculate(
        expression: "$Total_tip_native / $number_of_tips"
      )
      avg_tip_usd_in_this_block: calculate(
        expression: "$Total_tip_usd / $number_of_tips"
      )
      tip_in_terms_of_gasfees: calculate(
        expression: "( $avg_gasfees_in_this_block - $avg_tip_in_this_block ) / $avg_gasfees_in_this_block"
      )
    }
  }
}
```
