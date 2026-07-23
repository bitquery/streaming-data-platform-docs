---
sidebar_position: 1
title: "EVM Token Supply API"
description: "EVM Token Supply API: stream Ethereum market cap, FDV, supply, and price using Bitquery Trading GraphQL APIs. Run it in the IDE, then ship in your app."
---
# EVM Token Supply API

Track real-time and historical token supply data across all EVM-compatible blockchains including Ethereum, BNB Chain (BSC), Base, Arbitrum, Polygon, and more using Bitquery's Token Supply API.

:::info Looking for Solana Token Supply?
Bitquery also provides comprehensive **[Solana Token Supply API](/docs/blockchain/Solana/token-supply-cube/)** with features including:
- Real-time token supply changes and market cap tracking
- Pump.fun and Moonshot token creation monitoring
- Token burn event tracking
- Top tokens by market cap queries

➡️ **[View Solana Token Supply Documentation](/docs/blockchain/Solana/token-supply-cube/)**
:::

## What is Token Supply?

Token supply refers to the total number of tokens that exist for a particular cryptocurrency or token. Understanding token supply is crucial for:

- **Market Cap Calculation**: Total Supply × Token Price = Market Capitalization
- **Inflation/Deflation Analysis**: Monitor minting and burning events
- **DeFi Protocol Analysis**: Track liquidity and TVL changes
- **Stablecoin Monitoring**: Verify backing and supply changes for USDT, USDC, DAI, etc.
- **Investment Research**: Evaluate tokenomics and supply dynamics

## How do I get the total supply or circulating supply of a token?

**Total supply on EVM:** Use Bitquery `EVM.TransactionBalances` (or streaming equivalents) and read `TokenBalance.TotalSupply` for the token contract, setting `network` to `eth`, `bsc`, `base`, or another supported chain. **Circulating supply** is not a single on-chain field: it is usually derived as total supply minus known treasury or locked wallets, or adjusted for burns—use mint/burn and transfer patterns from the same API family if you define it that way.

## 🔗 Related APIs

### EVM APIs

- **[EVM Balance Updates API](/docs/schema/evm/balances/)** - Track wallet balance changes
- **[EVM Token Holders API](/docs/schema/evm/token-holders/)** - Get top holders of any token
- **[EVM Transfers API](/docs/schema/evm/transfers/)** - Monitor token transfers
- **[EVM DEX Trades API](/docs/schema/evm/dextrades/)** - Track trading activity

### Solana APIs

- **[Solana Token Supply API](/docs/blockchain/Solana/token-supply-cube/)** - Track SPL token supply, market cap, and burn events
- **[Solana Balance Updates API](/docs/blockchain/Solana/solana-balance-updates/)** - Monitor Solana wallet balances
- **[Solana DEX Trades API](/docs/blockchain/Solana/solana-dextrades/)** - Track Solana DEX trading activity

---

## Real-Time Token Supply Stream (WebSocket)

### Latest Token Supply on BNB Chain

Subscribe to real-time token supply updates across all tokens on the BNB Chain (BSC). This WebSocket subscription provides continuous updates as token supplies change due to minting or burning.

You can run this query [here](https://ide.bitquery.io/latest-token-supply-on-BSC-chain).

```graphql
subscription {
  EVM(network: bsc) {
    TransactionBalances(
      limitBy: { by: TokenBalance_Currency_SmartContract, count: 1 }
      where: {
        TokenBalance: { Currency: { SmartContract: { not: "0x" } } }
      }
    ) {
      TokenBalance {
        TotalSupply
        Currency {
          Name
          Symbol
          SmartContract
        }
      }
    }
  }
}
```

**Key Parameters:**

- `limitBy: { by: TokenBalance_Currency_SmartContract, count: 1 }` - Returns only the latest supply for each unique token
- `SmartContract: { not: "0x" }` - Excludes native currency (BNB) to focus on ERC-20 tokens

:::tip Multi-Chain Support
Change the `network` parameter to query other EVM chains:

- `eth` - Ethereum
- `bsc` - BNB Chain
- `base` - Base
- `arbitrum` - Arbitrum
- `matic` - Polygon
- `optimism` - Optimism

:::

---

## Token Supply Queries (GraphQL)

### Latest Token Supply of Specific Tokens on Ethereum

Get the current total supply for specific tokens like USDC and USDT on Ethereum or any EVM network. This is ideal for stablecoin tracking and portfolio applications.

You can run this query [here](https://ide.bitquery.io/latest-token-supply-on-USDT-and-USDC-on-ethereum-chain).

```graphql
{
  EVM(network: eth) {
    TransactionBalances(
      orderBy: { descending: Block_Time }
      limitBy: { by: TokenBalance_Currency_SmartContract, count: 1 }
      where: {
        TokenBalance: {
          Currency: {
            SmartContract: {
              in: [
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
                "0xdac17f958d2ee523a2206206994597c13d831ec7"
              ]
            }
          }
        }
      }
    ) {
      TokenBalance {
        TotalSupply
        Currency {
          Name
          Symbol
          SmartContract
        }
      }
    }
  }
}
```

**Common Token Addresses (Ethereum):**

| Token | Contract Address                             |
| ----- | -------------------------------------------- |
| USDT  | `0xdac17f958d2ee523a2206206994597c13d831ec7` |
| USDC  | `0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48` |
| DAI   | `0x6b175474e89094c44da98b954eedeac495271d0f` |
| WETH  | `0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2` |
| LINK  | `0x514910771af9ca656af840dff83e8264ecf986ca` |

---

### Latest Token Supply of All Active Tokens on Base

Retrieve the latest total supply for all active tokens on the Base blockchain. This query is useful for market analytics, portfolio trackers, and DeFi dashboards.

You can run this query [here](https://ide.bitquery.io/latest-token-supply-of-all-active-tokens-on-base-chain).

```graphql
{
  EVM(network: base) {
    TransactionBalances(
      orderBy: { descending: Block_Time }
      limitBy: { by: TokenBalance_Currency_SmartContract, count: 1 }
      where: { TokenBalance: { Currency: { SmartContract: { not: "0x" } } } }
    ) {
      TokenBalance {
        TotalSupply
        Currency {
          Name
          Symbol
          SmartContract
        }
      }
    }
  }
}
```

---

## Use Cases

### 1. Stablecoin Supply Monitoring

Track stablecoin supplies to monitor market dynamics and potential de-pegging risks:

- Monitor USDT, USDC, DAI supply changes in real-time
- Detect large minting or burning events
- Compare supply across different chains

### 2. Market Cap Calculation

Calculate accurate market capitalization by combining supply data with price feeds:

```
Market Cap = Total Supply × Current Price
```

### 3. Token Inflation Analysis

Analyze token inflation rates by comparing supply changes over time:

- Track new token emissions
- Monitor burning mechanisms
- Calculate inflation/deflation rates

### 4. DeFi Protocol Analytics

Monitor supply changes for DeFi governance tokens and LP tokens to understand protocol health and user activity.

### 5. Compliance & Auditing

Maintain audit trails of supply changes for regulatory compliance and financial reporting.

---

## API Response Fields

| Field                                 | Description                              |
| ------------------------------------- | ---------------------------------------- |
| `TokenBalance.TotalSupply`            | Current total supply of the token        |
| `TokenBalance.Currency.Name`          | Token name (e.g., "USD Coin")            |
| `TokenBalance.Currency.Symbol`        | Token symbol (e.g., "USDC")              |
| `TokenBalance.Currency.SmartContract` | Token contract address                   |
| `TokenBalance.Currency.Decimals`      | Number of decimal places                 |
| `Block.Number`                        | Block number of the supply update        |
| `Block.Time`                          | Timestamp of the supply update           |

---

## Supported Networks

| Network  | Parameter   | Description         |
| -------- | ----------- | ------------------- |
| Ethereum | `eth`       | Ethereum Mainnet    |
| BNB Chain| `bsc`       | BNB Smart Chain     |
| Base     | `base`      | Base L2             |
| Arbitrum | `arbitrum`  | Arbitrum One        |
| Polygon  | `matic`     | Polygon PoS         |
| Optimism | `optimism`  | Optimism L2         |
| Robinhood| `robinhood` | Robinhood network   |

---

## Best Practices

1. **Use `limitBy` for Latest Data**: Always use `limitBy: { by: TokenBalance_Currency_SmartContract, count: 1 }` to get only the most recent supply for each token.

2. **Filter by Smart Contract**: When querying specific tokens, use the `SmartContract: { is: "..." }` filter to improve query performance.

3. **Use Archive Dataset for History**: For historical queries, specify `dataset: archive` to access complete blockchain history.

4. **Handle Decimals Properly**: Remember to divide `TotalSupply` by `10^Decimals` to get the human-readable supply value.

---

## Getting Started

1. **Get API Access**: Sign up at [Bitquery](https://bitquery.io/) to get your API key
2. **Try in IDE**: Test queries in the [Bitquery IDE](https://ide.bitquery.io/)
3. **Integrate**: Use the GraphQL endpoint in your application

For more information on authentication and API usage, see our [Getting Started Guide](/docs/start/first-query/).

