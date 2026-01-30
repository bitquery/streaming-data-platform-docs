---
sidebar_position: 1
---

# Ethereum Transaction Balance Tracker

The Ethereum Transaction Balance Tracker API provides real-time balance updates for all addresses involved in transactions on the Ethereum blockchain, including detailed information about the reason for each balance change.

<head>
<meta name="title" content="Ethereum Transaction Balance Tracker API & Streams"/>
<meta name="description" content="Learn how to get real-time balance updates for all addresses in Ethereum transactions with balance change reasons using Bitquery's Transaction Balance API."/>
<meta name="keywords" content="ethereum transaction balance api, eth balance streams, ethereum balance api, balance change reason, transaction balance python api, ethereum transaction balance, balance updates api, ethereum network api, ethereum web3 api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Ethereum Transaction Balance Tracker API & Streams"
/>
<meta
  property="og:description"
  content="Learn how to get real-time balance updates for all addresses in Ethereum transactions with balance change reasons using Bitquery's Transaction Balance API."
/>

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Ethereum Transaction Balance Tracker API & Streams" />
<meta property="twitter:description" content="Learn how to get real-time balance updates for all addresses in Ethereum transactions with balance change reasons using Bitquery's Transaction Balance API." />
</head>

## Subscribe to All Transaction Balances

This subscription provides real-time balance updates for all addresses involved in transactions on the Ethereum network.
Try the API [here](https://ide.bitquery.io/Subscribe-to-All-Transaction-Balances).

```graphql
subscription {
  EVM(network: eth) {
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

This subscription filters transaction balances for a specific address. Try the API [here](https://ide.bitquery.io/Subscribe-to-Transaction-Balances-for-a-Specific-Address).

```graphql
subscription {
  EVM(network: eth) {
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

This API gives you latest balance of a specific address (here in example `0xd194daef0cd90675a3b823fcda248f76fccb49f3`) for the native currency. Try it out [here](https://ide.bitquery.io/Latest-native-balance-of-an-address).

```graphql
{
  EVM(network: eth) {
    TransactionBalances(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        TokenBalance: {
          Address: { is: "0xd194daef0cd90675a3b823fcda248f76fccb49f3" }
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

This API gives you latest balance of a specific address (here in example `0xd194daef0cd90675a3b823fcda248f76fccb49f3`) for a specific token (here we have taken example of USDC `0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48`). Try it out [here](https://ide.bitquery.io/Latest-balance-of-an-address-for-a-specific-token).

```graphql
{
  EVM(network: eth) {
    TransactionBalances(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        TokenBalance: {
          Address: { is: "0xd194daef0cd90675a3b823fcda248f76fccb49f3" }
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

This API provides the latest liquidity information for multiple EVM pools in one API call. The example shows results for two pool addresses using a query updated to support multiple addresses. You can try 500 as well,just put them as a list in `where` clause. Try it out [here](https://ide.bitquery.io/latest-liquidity-of-multiple-pools#).

```graphql
{
  EVM(network: base) {
    TransactionBalances(
      limitBy: { by: TokenBalance_Address, count: 2 }
      orderBy: { descendingByField: "TokenBalance_PostBalanceInUSD" }
      where: {
        TokenBalance: {
          Address: {
            in: [
              "0x3f0296BF652e19bca772EC3dF08b32732F93014A"
              "0x22AEe3699b6A0fEd71490C103Bd4E5f3309891D5"
            ]
          }
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

This API gives you latest Supply and Marketcap of a token on EVM (here as example we have taken BITGET Token `0x54D2252757e1672EEaD234D27B1270728fF90581` ). Try it out [here](https://ide.bitquery.io/Total-Supply-and-onchain-Marketcap-of-a-specific-token).

```graphql
{
  EVM(network: eth) {
    TransactionBalances(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        TokenBalance: {
          Currency: {
            SmartContract: { is: "0x54D2252757e1672EEaD234D27B1270728fF90581" }
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
