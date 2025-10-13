---
title: "Uniswap V3 Position API - Track Liquidity Positions"
description: "Track Uniswap V3 NFT positions, monitor liquidity changes, position creation, and position management using Bitquery's Position API."
---

# Uniswap V3 Position API - Track Liquidity Positions

Uniswap V3 introduced NFT-based liquidity positions, where each position is represented as an ERC-721 NFT. Bitquery's Position API allows you to track position creation, liquidity additions, removals, burns, and query position details in real-time.

The Uniswap V3 NonfungiblePositionManager contract (`0xC36442b4a4522E871399CD717aBDD847Ab11FE88`) handles all position-related operations:
- **Mint**: Creates new positions and returns a token ID
- **Burn**: Closes positions (requires NFT ID)
- **IncreaseLiquidity/DecreaseLiquidity**: Modifies existing positions (requires NFT ID)
- **Positions**: Queries position details by token ID

<Head>
  <meta name="title" content="Uniswap V3 Position NFT API - Track Liquidity Positions on Ethereum" />
  <meta name="description" content="Monitor Uniswap V3 NFT positions, track liquidity providers, position creation, and position management using Bitquery's real-time Position API." />
  <meta name="keywords" content="Uniswap V3 API,Uniswap positions API,Uniswap NFT positions,Uniswap liquidity API,Ethereum liquidity positions,DeFi position tracking,Uniswap V3 liquidity provider,NFT position API,Bitquery API,Uniswap position management,liquidity provider analytics,Uniswap V3 positions tracking,DeFi analytics API" />
  <meta name="robots" content="index, follow" />
  <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="language" content="English" />

  <meta property="og:type" content="website" />
  <meta
    property="og:title"
    content="Uniswap V3 Position NFT API - Track Liquidity Positions"
  />
  <meta
    property="og:description"
    content="Track Uniswap V3 NFT positions, liquidity changes, and position analytics with Bitquery's real-time API."
  />

  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:title" content="Uniswap V3 Position NFT API - Liquidity Position Tracking" />
  <meta property="twitter:description" content="Monitor Uniswap V3 positions, track liquidity providers, and analyze position changes in real-time." />
</Head>


## Table of Contents

### 1. Position Creation & Tracking
- [Recent Position NFT Mints ➤](#recent-position-nft-mints)

### 2. Position Management
- [Burn Position Events ➤](#burn-position-events)
- [Increase & Decrease Liquidity Events ➤](#increase--decrease-liquidity-events)

### 3. Position Queries
- [Get Position Details by Token ID ➤](#get-position-details-by-token-id)

---

## Position Creation & Tracking

### Recent Position NFT Mints

Track recently created Uniswap V3 positions. When users create a new position, the `mint` function is called and returns a unique NFT token ID representing the position.

[Run Query ➤](https://ide.bitquery.io/recent-uniswap-position-NFTs-mint_1)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query RecentPositionsRealtime {
  EVM(network: eth) {
    Calls(
      where: {
        Call: {
          Signature: { Name: { is: "mint" } }
          To: { is: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88" }
        }
      }
      limit: { count: 100 }
      orderBy: { descending: Block_Number }
    ) {
      Arguments {
        Index
        Name
        Type
        Path {
          Name
          Index
        }
        Value {
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
        }
      }
      Call {
        Signature {
          Name
        }
        To
        Value
        ValueInUSD
        From
      }
      Transaction {
        position_creator: From
        To
        Hash
        ValueInUSD
        Value
        Time
      }
      Block {
        Number
        Time
      }
      Returns {
        Value {
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
        }
        Type
        Name
      }
    }
  }
}
```

</details>

---

## Position Management

### Burn Position Events

Track when liquidity providers close their positions. The `burn` function permanently removes the position NFT.

[Run Query ➤](https://ide.bitquery.io/Uniswap-v3-weth-usdt-burn-calls-only)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query LiquidityBurnEvents {
  EVM(dataset: archive, network: eth) {
    Calls(
      where: {
        Call: {
          Signature: { Name: { is: "burn" } }
          To: { is: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88" }
        }
        Block: { Date: { after: "2025-09-20", before: "2025-09-22" } }
      }
      limit: { count: 10 }
    ) {
      Arguments {
        Index
        Name
        Type
        Path {
          Name
          Index
        }
        Value {
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
        }
      }
      Call {
        Signature {
          Name
        }
        To
        Value
        ValueInUSD
        From
      }
      Transaction {
        From
        To
        Hash
        ValueInUSD
        Value
        Time
      }
      Block {
        Number
        Time
      }
    }
  }
}
```

</details>

### Increase & Decrease Liquidity Events

Monitor when liquidity providers add or remove liquidity from existing positions. These operations modify the liquidity amount without creating or destroying the NFT.

[Run Query ➤](https://ide.bitquery.io/uniswap-v3-weth-usdt-increase-decrease)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query LiquidityChangeEvents {
  EVM(dataset: archive, network: eth) {
    Calls(
      where: {
        Call: {
          Signature: { Name: { in: ["increaseLiquidity", "decreaseLiquidity"] } }
          To: { is: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88" }
        }
        Block: { Date: { after: "2025-09-20", before: "2025-09-22" } }
      }
      limit: { count: 10 }
    ) {
      Arguments {
        Index
        Name
        Type
        Path {
          Name
          Index
        }
        Value {
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
        }
      }
      Call {
        Signature {
          Name
        }
        To
        Value
        ValueInUSD
        From
      }
      Transaction {
        From
        To
        Hash
        ValueInUSD
        Value
        Time
      }
      Block {
        Number
        Time
      }
    }
  }
}
```

</details>

---

## Position Queries

### Get Position Details by Token ID

Query detailed information about a specific position using its NFT token ID. This returns the position's configuration including tick range, liquidity, tokens owed, and more.

[Run Query ➤](https://ide.bitquery.io/uniswap-v3-weth-usdt-positions-of-tokenid-with-returns)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query PositionDetailsByTokenId {
  EVM(dataset: archive, network: eth) {
    Calls(
      where: {
        Call: {
          Signature: { Name: { is: "positions" } }
          To: { is: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88" }
        }
        Block: { Date: { after: "2025-09-20", before: "2025-09-22" } }
        Arguments: { includes: { Value: { BigInteger: { eq: "783837" } } } }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Number }
    ) {
      Arguments {
        Index
        Name
        Type
        Path {
          Name
          Index
        }
        Value {
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
        }
      }
      Call {
        Signature {
          Name
        }
        To
        Value
        ValueInUSD
        From
      }
      Transaction {
        From
        To
        Hash
        ValueInUSD
        Value
        Time
      }
      Block {
        Number
        Time
      }
      Returns {
        Value {
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
        }
        Type
        Name
      }
    }
  }
}
```

</details>

---

## Key Concepts

### Understanding Uniswap V3 Positions

1. **Position NFTs**: Each liquidity position is a unique ERC-721 NFT with a token ID
2. **Token ID**: Returned from `mint` calls, required for all subsequent operations
3. **Tick Range**: Positions are defined by upper and lower tick bounds
4. **Liquidity**: Amount of liquidity provided within the tick range
5. **Fees**: Uncollected fees accumulate and can be collected separately

### Position Lifecycle

1. **Creation** (`mint`): User creates position → receives NFT token ID
2. **Management**:
   - `increaseLiquidity`: Add more liquidity to existing position
   - `decreaseLiquidity`: Remove liquidity from existing position
   - `collect`: Collect accumulated fees
3. **Closure** (`burn`): Remove all liquidity and destroy NFT

### Calculating Price Bands from Position Ticks

Uniswap V3 positions are defined by tick ranges, which represent the price boundaries where liquidity is active. You can calculate the actual price band from the tick values returned in the position arguments.

**Formula:**

```
price_lower = 1.0001 ** tick_lower
price_upper = 1.0001 ** tick_upper
```

**Where:**
- `tick_lower`: The lower tick boundary (available in Arguments)
- `tick_upper`: The upper tick boundary (available in Arguments)
- `1.0001`: The base multiplier used by Uniswap V3

**Example:**

If a position has:
- `tick_lower = -100`
- `tick_upper = 100`

Then:
- `price_lower = 1.0001 ** (-100) ≈ 0.990`
- `price_upper = 1.0001 ** 100 ≈ 1.010`

**Note:** The tick values are returned in the `Arguments` field when querying position data using the `positions`, `mint`, `increaseLiquidity`, or `decreaseLiquidity` functions.

### NonfungiblePositionManager Contract

- **Address**: `0xC36442b4a4522E871399CD717aBDD847Ab11FE88` (Ethereum Mainnet)
- **Purpose**: Manages all Uniswap V3 liquidity positions as NFTs
- **Key Functions**: `mint`, `burn`, `increaseLiquidity`, `decreaseLiquidity`, `positions`, `collect`



