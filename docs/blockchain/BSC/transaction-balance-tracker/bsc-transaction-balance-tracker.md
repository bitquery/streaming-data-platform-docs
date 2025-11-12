---
sidebar_position: 1
---

# BSC Transaction Balance Tracker

The BSC Transaction Balance Tracker API provides real-time balance updates for all addresses involved in transactions on the BSC blockchain, including detailed information about the reason for each balance change.

<head>
<meta name="title" content="BSC Transaction Balance Tracker API & Streams"/>
<meta name="description" content="Learn how to get real-time balance updates for all addresses in BSC transactions with balance change reasons using Bitquery's Transaction Balance API."/>
<meta name="keywords" content="bsc transaction balance api, bsc balance streams, bsc balance api, balance change reason, transaction balance python api, bsc transaction balance, balance updates api, bsc network api, bsc web3 api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="BSC Transaction Balance Tracker API & Streams"
/>
<meta
  property="og:description"
  content="Learn how to get real-time balance updates for all addresses in BSC transactions with balance change reasons using Bitquery's Transaction Balance API."
/>

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="BSC Transaction Balance Tracker API & Streams" />
<meta property="twitter:description" content="Learn how to get real-time balance updates for all addresses in BSC transactions with balance change reasons using Bitquery's Transaction Balance API." />
</head>

## Subscribe to All Transaction Balances

This subscription provides real-time balance updates for all addresses involved in transactions on the BSC network.
Try the API [here](https://ide.bitquery.io/Subscribe-to-All-Transaction-Balances-bsc).

```graphql
subscription {
  EVM(network: bsc) {
    TransactionBalances {
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
      }
    }
  }
}
```

## Subscribe to Transaction Balances for a Specific Address

This subscription filters transaction balances for a specific address. Try the API [here](https://ide.bitquery.io/Subscribe-to-Transaction-Balances-for-a-Specific-Address-bsc).

```graphql
subscription {
  EVM(network: bsc) {
    TransactionBalances(
      where: { TokenBalance: { Address: { is: "0xYourAddressHere" } } }
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
      }
    }
  }
}
```

## Latest native balance of an address

This API gives you latest balance of a specific address (here in example `0x238a358808379702088667322f80ac48bad5e6c4`) for the native currency. Try it out [here](https://ide.bitquery.io/Latest-native-balance-of-an-address-bsc).

```graphql
{
  EVM(network: bsc) {
    TransactionBalances(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        TokenBalance: {
          Address: { is: "0x238a358808379702088667322f80ac48bad5e6c4" }
          Currency: { Native: true }
        }
      }
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
      }
    }
  }
}
```

## Latest balance of an address for a specific token

This API gives you latest balance of a specific address (here in example `0x238a358808379702088667322f80ac48bad5e6c4`) for a specific token (here we have taken example of USDC `0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48`). Try it out [here](https://ide.bitquery.io/Latest-balance-of-an-address-for-a-specific-token-bsc).

```graphql
{
  EVM(network: bsc) {
    TransactionBalances(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        TokenBalance: {
          Address: { is: "0x238a358808379702088667322f80ac48bad5e6c4" }
          Currency: {
            SmartContract: { is: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" }
          }
        }
      }
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
      }
    }
  }
}
```

## Latest liquidity of EVM Pool

This API gives you latest liquidity of a BSC Pool. Try it out [here](https://ide.bitquery.io/latest-liquidity-of-a-BSC-pool).

```graphql
{
  EVM(network: bsc) {
    TransactionBalances(
      limit: { count: 2 }
      limitBy: { by: TokenBalance_Currency_SmartContract, count: 1 }
      orderBy: { descendingByField: "TokenBalance_PostBalanceInUSD" }
      where: {
        TokenBalance: {
          Address: { is: "YourPoolAddress" }
        }
      }
    ) {
      TokenBalance {
        Currency {
          Symbol
          HasURI
          SmartContract
        }
        PostBalance(maximum: Block_Time)
        PostBalanceInUSD(maximum: Block_Time)
        Address
      }
    }
  }
}
```

## Latest Supply and Marketcap of a specific token on EVM

This API gives you latest Supply and Marketcap of a token on BSC. Try it out [here](https://ide.bitquery.io/Total-Supply-and-onchain-Marketcap-of-a-specific-token-bsc).

```graphql
{
  EVM(network: bsc) {
    TransactionBalances(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        TokenBalance: {
          Currency: {
            SmartContract: { is: "YourTokenAddress" }
          }
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
          HasURI
          SmartContract
        }
        TotalSupplyInUSD
        TotalSupply
      }
    }
  }
}
```