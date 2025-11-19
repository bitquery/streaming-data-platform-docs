---
sidebar_position: 9
---

# Ethereum NFT Balance API

The Ethereum NFT Balance API provides real-time balance updates for ERC-721 and ERC-1155 non-fungible tokens on the Ethereum blockchain. Track NFT ownership, token IDs, and ownership status for any address holding NFTs.

:::note
For NFTs (ERC-721 / ERC-1155), the following fields are available:

- **Available**: `PostBalance`, `TokenOwnership`
- **Not Provided**: `PreBalance`, `BalanceChangeReasonCode`, `TotalSupply`, `TotalSupplyInUSD`, `PostBalanceInUSD`
  :::

<head>
<meta name="title" content="Ethereum NFT Balance API & Streams"/>
<meta name="description" content="Track NFT balances, ownership, and token IDs using Bitquery's NFT Balance API for Ethereum ERC-721 and ERC-1155 tokens."/>
<meta name="keywords" content="ethereum nft balance api, erc-721 balance api, erc-1155 balance api, nft ownership api, nft balance tracker, nft token id api, ethereum nft balance, nft balance streams"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Ethereum NFT Balance API & Streams"
/>
<meta
  property="og:description"
  content="Track NFT balances, ownership, and token IDs using Bitquery's NFT Balance API for Ethereum ERC-721 and ERC-1155 tokens."
/>

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Ethereum NFT Balance API & Streams" />
<meta property="twitter:description" content="Track NFT balances, ownership, and token IDs using Bitquery's NFT Balance API for Ethereum ERC-721 and ERC-1155 tokens." />
</head>

## Get Latest NFT Balance for an Address

Get the latest NFT balance for a specific address and NFT collection. This query returns the current NFT count and ownership information.
Try the API [here](https://ide.bitquery.io/Get-Latest-NFT-Balance-for-an-Address).

```graphql
{
  EVM(network: eth) {
    TransactionBalances(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        TokenBalance: {
          Address: { is: "0x2906bF2d33bAd2041B31bd22a728724e23F6e764" }
          Currency: {
            SmartContract: { is: "0xbe9371326F91345777b04394448c23E2BFEaa826" }
            Fungible: false
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
          HasURI
        }
        PostBalance
        Address
        TokenOwnership {
          Owns
          Id
        }
      }
      Transaction {
        Hash
      }
    }
  }
}
```

## Stream NFT Balance Updates in Real Time

Subscribe to real-time NFT balance updates for a specific address and collection. This subscription will notify you whenever NFT ownership changes.
Try the API [here](https://ide.bitquery.io/Stream-NFT-Balance-Updates-in-Real-Time).

```graphql
subscription {
  EVM(network: eth) {
    TransactionBalances(
      where: {
        TokenBalance: {
          Address: { is: "0x2906bF2d33bAd2041B31bd22a728724e23F6e764" }
          Currency: {
            SmartContract: { is: "0xbe9371326F91345777b04394448c23E2BFEaa826" }
            Fungible: false
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
          HasURI
        }
        PostBalance
        Address
        TokenOwnership {
          Owns
          Id
        }
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

## Get All NFT Collections for an Address

Retrieve all NFT collections held by a specific address. This query returns balances for all NFT collections the address owns.
Try the API [here](https://ide.bitquery.io/Get-All-NFT-Collections-for-an-Address_1).

```graphql
{
  EVM(network: eth) {
    TransactionBalances(
      orderBy: { descendingByField: "TokenBalance_PostBalanceInUSD_maximum" }
      where: {
        TokenBalance: {
          Address: { is: "0x2906bF2d33bAd2041B31bd22a728724e23F6e764" }
          Currency: { Fungible: false }
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
        PostBalance(maximum: Block_Time, selectWhere: { ne: "0" })
        PostBalanceInUSD(maximum: Block_Time)
        Address
      }
    }
  }
}
```

## Get NFT Balances for Multiple Addresses

Get NFT balances for multiple addresses in a single query. Useful for portfolio tracking or wallet monitoring applications.
Try the API [here](https://ide.bitquery.io/Get-NFT-Balances-for-Multiple-Addresses_1).

```graphql
{
  EVM(network: eth) {
    TransactionBalances(
      orderBy: { descendingByField: "TokenBalance_PostBalanceInUSD_maximum" }
      where: {
        TokenBalance: {
          Address: {
            in: [
              "0x2906bF2d33bAd2041B31bd22a728724e23F6e764"
              "0x3c6559E241f6A2e15a98f3270bc66447e0B6222b"
            ]
          }
          Currency: { Fungible: false }
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
        PostBalance(maximum: Block_Time, selectWhere: { ne: "0" })
        PostBalanceInUSD(maximum: Block_Time)
        Address
      }
    }
  }
}
```

## Get NFT Ownership History

Retrieve the NFT ownership history of a specific NFT over a specific time period. This helps track NFT transfers and ownership changes.
Try the API [here](https://ide.bitquery.io/Get-NFT-Ownership-History_2).

```graphql
{
  EVM(network: eth) {
    TransactionBalances(
      orderBy: { descending: Block_Time }
      where: {
        TokenBalance: {
          PostBalance: { eq: "1" }
          Currency: {
            SmartContract: { is: "0xbe9371326F91345777b04394448c23E2BFEaa826" }
            Fungible: false
          }
          TokenOwnership: { Id: { eq: "24010" } }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      Block {
        Time
        Number
        Hash
      }
      TokenBalance {
        Currency {
          Symbol
          Name
          SmartContract
          HasURI
        }
        PostBalance
        Address
        TokenOwnership {
          Owns
          Id
        }
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

## Track specific NFT Balance Changes

Monitor NFT transfers for a specific collection across all transactions. This helps track NFT movements and ownership changes.
Try the API [here](https://ide.bitquery.io/Track-specific-NFTs-Balance-Changes).

```graphql
subscription {
  EVM(network: eth) {
    TransactionBalances(
      where: {
        TokenBalance: {
          Currency: {
            SmartContract: { is: "0xbe9371326F91345777b04394448c23E2BFEaa826" }
            Fungible: false
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
          HasURI
        }
        PostBalance
        Address
        TokenOwnership {
          Owns
          Id
        }
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

## Get NFT Owner for Specific Token ID

Check the current owner of a specific NFT token ID. This query returns ownership information for a particular token. `0xF9c362CDD6EeBa080dd87845E88512AA0A18c615` is the NFT Contract address and `3042` is the NFT Token ID.
Try the API [here](https://ide.bitquery.io/Get-NFT-Owner-for-Specific-Token-ID).

```graphql
{
  EVM(network: eth) {
    TransactionBalances(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        TokenBalance: {
          PostBalance: { eq: "1" }
          Currency: {
            SmartContract: { is: "0xF9c362CDD6EeBa080dd87845E88512AA0A18c615" }
            Fungible: false
          }
          TokenOwnership: { Id: { eq: "3042" } }
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
          HasURI
        }
        PostBalance
        Address
        TokenOwnership {
          Owns
          Id
        }
      }
      Transaction {
        Hash
      }
    }
  }
}
```
