# Polymarket Trade APIs

This comprehensive guide covers Polymarket trading APIs using Bitquery's DEXTradeByTokens cube. Access real-time and historical trade data, streaming updates, and market analytics for Polymarket's prediction markets on Polygon (Matic) network.

## Overview

Polymarket is a decentralized prediction market platform built on Polygon. The DEXTradeByTokens API provides structured trade data from Polymarket's Conditional Token Framework (CTF) exchange, making it easy to track market movements, analyze trading patterns, and build trading applications.

### Key Features
- **Real-time streaming** of live trades via GraphQL subscriptions
- **Historical trade data** with flexible filtering and pagination
- **Multi-asset support** for all Polymarket prediction markets
- **USD pricing** and volume calculations
- **Order book insights** through position IDs and order tracking

## Prerequisites

- Bitquery API access (get your API key at [bitquery.io](https://bitquery.io))
- Basic understanding of GraphQL
- Familiarity with Polymarket's market structure (condition IDs, position tokens)

## Supported Assets

Polymarket trades use these primary ERC-20 tokens on Polygon:

| Token | Contract Address | Symbol |
|-------|------------------|--------|
| USDC | `0x2791bca1f2de4661ed88a30c99a7a9449aa84174` | USDC |
| USDT | `0x3c499c542cef5e3811e1192ce70d8cc03d5c3359` | USDT |
| DAI | `0xc2132d05d31c914a87c6611c10748aeb04b58e8f` | DAI |
| WETH | `0x7ceb23fd6bc0add59e62ac25578270cff1b9f619` | WETH |
| WMATIC | `0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270` | WMATIC |

## Real-Time Trade Streaming

Subscribe to live Polymarket trades as they happen. This subscription provides real-time updates for all market activity.

**Try it live:** [Polymarket Trades Stream](https://ide.bitquery.io/polymarket-trades-stream)

```graphql
subscription {
  EVM(network: matic) {
    DEXTradeByTokens(
      where: {
        TransactionStatus: { Success: true }
        Trade: {
          Side: {
            Currency: {
              SmartContract: {
                in: [
                  "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",  # USDC
                  "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",  # USDT
                  "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",  # DAI
                  "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",   # WETH
                  "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"   # WMATIC
                ]
              }
            }
          }
          Dex: { ProtocolName: { is: "polymarket" } }
        }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Trade {
        Dex {
          OwnerAddress
          ProtocolFamily
          ProtocolName
        }
        AmountInUSD
        Amount
        PriceInUSD
        Side {
          Type
          Amount
          AmountInUSD
          Currency {
            Symbol
            SmartContract
            Name
          }
          Ids
          OrderId
        }
        Currency {
          Symbol
          SmartContract
          Name
        }
        Ids
        OrderId
      }
    }
  }
}
```

### Response Fields

- **`Block.Time`**: Timestamp of the trade
- **`Transaction.Hash`**: Blockchain transaction hash
- **`Trade.AmountInUSD`**: Total trade value in USD
- **`Trade.PriceInUSD`**: Price per unit in USD
- **`Trade.Side`**: Buy/sell side information
- **`Trade.Ids`**: Position token IDs (represents Yes/No outcomes)
- **`Trade.OrderId`**: Unique order identifier

## Historical Trade Queries

### Get Latest Trades

Retrieve the most recent Polymarket trades with pagination.

**Try it live:** [Polymarket Trades API](https://ide.bitquery.io/polymarket-trades-api)

```graphql
{
  EVM(network: matic) {
    DEXTradeByTokens(
      orderBy: { descending: Block_Time }
      limit: { count: 100 }
      where: {
        TransactionStatus: { Success: true }
        Trade: {
          Side: {
            Currency: {
              SmartContract: {
                in: [
                  "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",  # USDC
                  "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",  # USDT
                  "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",  # DAI
                  "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",   # WETH
                  "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"   # WMATIC
                ]
              }
            }
          }
          Dex: { ProtocolName: { is: "polymarket" } }
        }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Trade {
        Dex {
          OwnerAddress
          ProtocolFamily
          ProtocolName
        }
        AmountInUSD
        Amount
        PriceInUSD
        Side {
          Type
          Amount
          AmountInUSD
          Currency {
            Symbol
            SmartContract
            Name
          }
          Ids
          OrderId
        }
        Currency {
          Symbol
          SmartContract
          Name
        }
        Ids
        OrderId
      }
    }
  }
}
```

### Filter by Time Range

```graphql
{
  EVM(network: matic) {
    DEXTradeByTokens(
      orderBy: { descending: Block_Time }
      limit: { count: 100 }
      where: {
        TransactionStatus: { Success: true }
        Block: {
          Time: {
            since: "2024-01-01T00:00:00Z"
            till: "2024-01-31T23:59:59Z"
          }
        }
        Trade: {
          Dex: { ProtocolName: { is: "polymarket" } }
          # Add other filters as needed
        }
      }
    ) {
      # ... same fields as above
    }
  }
}
```

## Specific Asset Trading

### Trades for Specific Market/Condition

Filter trades by specific position token IDs to track activity for particular prediction markets.

**Try it live:** [Polymarket Trades for Specific Asset](https://ide.bitquery.io/polymarket-trades-api-for-specific-asset-id_1)

```graphql
{
  EVM(network: matic) {
    DEXTradeByTokens(
      orderBy: { descending: Block_Time }
      limit: { count: 100 }
      where: {
        TransactionStatus: { Success: true }
        Trade: {
          Ids: {
            includes: {
              in: ["56913537276977443440562201098597093132803911231987825986901262729097468643752"]
            }
          }
          Side: {
            Currency: {
              SmartContract: {
                in: [
                  "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
                  "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
                  "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
                  "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
                  "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"
                ]
              }
            }
          }
          Dex: { ProtocolName: { is: "polymarket" } }
        }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Trade {
        Dex {
          OwnerAddress
          ProtocolFamily
          ProtocolName
        }
        AmountInUSD
        Amount
        PriceInUSD
        Side {
          Type
          Amount
          AmountInUSD
          Currency {
            Symbol
            SmartContract
            Name
          }
          Ids
          OrderId
        }
        Currency {
          Symbol
          SmartContract
          Name
        }
        Ids
        OrderId
      }
    }
  }
}
```

### Finding Position Token IDs

To get trades for specific markets, you need the position token IDs. You can find these by:

1. **Using the CTF Exchange API** to query `TokenRegistered` events
2. **Using the Main Contract API** to query `ConditionPreparation` events
3. **Checking Polymarket's market data** for condition IDs, then deriving position tokens

Example: Convert condition ID to position token IDs using this formula:
- Position 0 (NO): `keccak256(abi.encodePacked(conditionId, 0))`
- Position 1 (YES): `keccak256(abi.encodePacked(conditionId, 1))`

## Advanced Filtering

### Filter by Trade Size

```graphql
{
  EVM(network: matic) {
    DEXTradeByTokens(
      where: {
        Trade: {
          AmountInUSD: { ge: "100" }  # Trades over $100
          Dex: { ProtocolName: { is: "polymarket" } }
        }
      }
    ) {
      # ... fields
    }
  }
}
```

### Filter by Order Side

```graphql
{
  EVM(network: matic) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Side: { Type: { is: "BUY" } }  # Only buy orders
          Dex: { ProtocolName: { is: "polymarket" } }
        }
      }
    ) {
      # ... fields
    }
  }
}
```

## Aggregation and Analytics

### Volume by Hour

```graphql
{
  EVM(network: matic, date: "2024-01-15") {
    DEXTradeByTokens(
      where: { Trade: { Dex: { ProtocolName: { is: "polymarket" } } } }
    ) {
      Block {
        Time(interval: { count: 1, in: hours })
      }
      sum(of: Trade_AmountInUSD)
      count
    }
  }
}
```

### Top Markets by Volume

```graphql
{
  EVM(network: matic) {
    DEXTradeByTokens(
      orderBy: { descending: sum_of_Trade_AmountInUSD }
      limit: { count: 10 }
      where: {
        Block: { Time: { since: "2024-01-01" } }
        Trade: { Dex: { ProtocolName: { is: "polymarket" } } }
      }
    ) {
      Trade {
        Ids
      }
      sum(of: Trade_AmountInUSD)
      count
    }
  }
}
```

## Use Cases

### Trading Bot Development
- Monitor real-time price movements
- Track order book changes
- Execute automated trading strategies

### Market Analysis
- Analyze trading volume patterns
- Track market sentiment through position token ratios
- Calculate price volatility

### Portfolio Tracking
- Monitor positions across multiple markets
- Calculate P&L in real-time
- Track market exposure

### Risk Management
- Set up alerts for large trades
- Monitor liquidation events
- Track market manipulation attempts

## Best Practices

1. **Use Streaming for Real-time Apps**: Subscriptions provide immediate updates without polling
2. **Implement Rate Limiting**: Respect API limits and implement exponential backoff
3. **Cache Frequently Used Data**: Store market metadata locally to reduce API calls
4. **Handle Reorgs**: Account for blockchain reorganizations in your application logic
5. **Validate Data**: Always verify trade data against on-chain transactions

## Related Documentation

- [Polymarket CTF Exchange API](./polymarket-ctf-exchange.md)
- [Polymarket Market Data API](./get-market-data.md)
- [UMA Adapter Contract API](./uma-adapter-contract.md)
- [DEXTradeByTokens Schema Reference](../../graphql-reference/objects/DEXTradeByTokens.mdx)

## Support

For questions or issues:
- [Bitquery Documentation](https://docs.bitquery.io)
- [Polymarket Documentation](https://docs.polymarket.com)
- [Bitquery IDE](https://ide.bitquery.io)
