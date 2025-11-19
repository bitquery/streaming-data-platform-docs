---
sidebar_position: 8
---

# Ethereum Token Balance API

The Ethereum Token Balance API provides real-time balance updates for ERC-20 fungible tokens on the Ethereum blockchain. Track token balances, total supply, market capitalization, and USD values for any address holding ERC-20 tokens.

:::note
For ERC-20 tokens, the following fields are available:

- **Available**: `PostBalance`, `PostBalanceInUSD`, `TotalSupply`, `TotalSupplyInUSD`
- **Not Provided**: `PreBalance`, `BalanceChangeReasonCode`, `TokenOwnership`
  :::

<head>
<meta name="title" content="Ethereum Token Balance API & Streams"/>
<meta name="description" content="Track ERC-20 token balances, total supply, and market capitalization using Bitquery's Token Balance API for Ethereum."/>
<meta name="keywords" content="ethereum token balance api, erc-20 balance api, token balance tracker, token supply api, token market cap api, ethereum token balance, token balance streams, erc20 balance api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Ethereum Token Balance API & Streams"
/>
<meta
  property="og:description"
  content="Track ERC-20 token balances, total supply, and market capitalization using Bitquery's Token Balance API for Ethereum."
/>

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Ethereum Token Balance API & Streams" />
<meta property="twitter:description" content="Track ERC-20 token balances, total supply, and market capitalization using Bitquery's Token Balance API for Ethereum." />
</head>

## Get Latest Token Balance for an Address

Get the latest balance of a specific ERC-20 token for a given address. This query returns the current token balance, USD value, and token information.
Try the API [here](https://ide.bitquery.io/Get-Latest-Token-Balance-for-an-Address).

```graphql
{
  EVM(network: eth) {
    TransactionBalances(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        TokenBalance: {
          Address: { is: "0x9642b23Ed1E01Df1092B92641051881a322F5D4E" }
          Currency: {
            SmartContract: { is: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" }
            Fungible: true
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
          Name
          SmartContract
          Decimals
        }
        PostBalance
        PostBalanceInUSD
        Address
        TotalSupply
        TotalSupplyInUSD
      }
      Transaction {
        Hash
      }
    }
  }
}
```

## Stream Token Balance Updates in Real Time

Subscribe to real-time token balance updates for a specific address and token. This subscription will notify you whenever the token balance changes.
Try the API [here](https://ide.bitquery.io/Stream-Token-Balance-Updates-in-Real-Time).

```graphql
subscription {
  EVM(network: eth) {
    TransactionBalances(
      where: {
        TokenBalance: {
          Address: { is: "0x9642b23Ed1E01Df1092B92641051881a322F5D4E" }
          Currency: {
            SmartContract: { is: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" }
            Fungible: true
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
          Name
          SmartContract
          Decimals
        }
        PostBalance
        PostBalanceInUSD
        Address
        TotalSupply
        TotalSupplyInUSD
      }
      Transaction {
        Hash
        From
        To
      }
    }
  }
}
```

## Get All Token Balances for an Address

Retrieve all ERC-20 token balances held by a specific address. This query returns balances for all tokens the address holds.
Try the API [here](https://ide.bitquery.io/Get-All-Token-Balances-for-an-Address).

```graphql
{
  EVM(network: eth) {
    TransactionBalances(
      orderBy: { descendingByField: "TokenBalance_PostBalanceInUSD_maximum" }
      where: {
        TokenBalance: {
          Address: { is: "0x9642b23ed1e01df1092b92641051881a322f5d4e" }
          Currency: { Fungible: true }
        }
      }
    ) {
      TokenBalance {
        Address
        Currency {
          Symbol
          Name
          SmartContract
          Decimals
        }
        PostBalance(maximum: Block_Time)
        PostBalanceInUSD(maximum: Block_Time)
      }
    }
  }
}
```

## Get Token Balances for Multiple Addresses

Get token balances for multiple addresses in a single query. Useful for portfolio tracking or wallet monitoring applications.
Try the API [here](https://ide.bitquery.io/Get-Token-Balances-for-Multiple-Addresses).

```graphql
{
  EVM(network: eth) {
    TransactionBalances(
      orderBy: { descendingByField: "TokenBalance_PostBalanceInUSD_maximum" }
      where: {
        TokenBalance: {
          Address: {
            in: [
              "0x9642b23ed1e01df1092b92641051881a322f5d4e"
              "0x0162Cd2BA40E23378Bf0FD41f919E1be075f025F"
            ]
          }
          Currency: {
            SmartContract: { is: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" }
            Fungible: true
          }
        }
      }
    ) {
      TokenBalance {
        Address
        Currency {
          Symbol
          Name
          SmartContract
          Decimals
        }
        PostBalance(maximum: Block_Time)
        PostBalanceInUSD(maximum: Block_Time)
      }
    }
  }
}
```

## Get Token Balance History

Retrieve the token balance history for an address over a specific time period. This is useful for tracking balance changes over time.
Try the API [here](https://ide.bitquery.io/Get-Token-Balance-History).

```graphql
{
  EVM(network: eth) {
    TransactionBalances(
      limit: { count: 1000 }
      orderBy: { descending: Block_Time }
      where: {
        TokenBalance: {
          Address: { is: "0x9642b23Ed1E01Df1092B92641051881a322F5D4E" }
          Currency: {
            SmartContract: { is: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" }
            Fungible: true
          }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      Block {
        Time
        Number
      }
      TokenBalance {
        Currency {
          Symbol
          Name
          SmartContract
        }
        PostBalance
        PostBalanceInUSD
        Address
        TotalSupply
        TotalSupplyInUSD
      }
      Transaction {
        Hash
        From
        To
      }
    }
  }
}
```

## Get Token Total Supply and Market Cap

Retrieve the total supply and market capitalization of a specific ERC-20 token. This query provides on-chain market cap data.
Try the API [here](https://ide.bitquery.io/Get-Token-Total-Supply-and-Market-Cap#).

```graphql
{
  EVM(network: eth) {
    TransactionBalances(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        TokenBalance: {
          Currency: {
            SmartContract: { is: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" }
            Fungible: true
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
          Name
          SmartContract
          Decimals
        }
        TotalSupply
        TotalSupplyInUSD
      }
    }
  }
}
```

## Filter Tokens by Minimum Balance

Get all tokens held by an address that have a minimum balance threshold. Useful for filtering out dust or small balances. Here in this example we are getting only those tokens from this address which amount to more than 10 million.
Try the API [here](https://ide.bitquery.io/Filter-Tokens-by-Minimum-Balance).

```graphql
{
  EVM(network: eth) {
    TransactionBalances(
      orderBy: { descendingByField: "TokenBalance_PostBalanceInUSD_maximum" }
      where: {
        TokenBalance: {
          Address: { is: "0x9642b23ed1e01df1092b92641051881a322f5d4e" }
          Currency: { Fungible: true }
        }
      }
    ) {
      TokenBalance {
        Address
        Currency {
          Symbol
          Name
          SmartContract
          Decimals
        }
        PostBalance(maximum: Block_Time)
        PostBalanceInUSD(maximum: Block_Time, selectWhere: { ge: "10000000" })
      }
    }
  }
}
```

## Track Token Balance Changes by Transaction

Monitor token balance changes for a specific token across all transactions. This helps track token movements and transfers.
Try the API [here](https://ide.bitquery.io/Track-Token-Balance-Changes-by-Transaction#).

```graphql
subscription {
  EVM(network: eth) {
    TransactionBalances(
      where: {
        TokenBalance: {
          Currency: {
            SmartContract: { is: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" }
            Fungible: true
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
          Name
          SmartContract
        }
        PostBalance
        PostBalanceInUSD
        Address
        TotalSupply
        TotalSupplyInUSD
      }
      Transaction {
        Hash
        From
        To
      }
    }
  }
}
```
