---
title: Flap.sh API - BSC Launchpad Token Analytics and Trading Data
description: Comprehensive guide to Flap.sh launchpad API on BNB Smart Chain. Track token creation, monitor trades, analyze OHLCV data, and stream real-time prices for Flap.sh tokens using Bitquery GraphQL APIs.
keywords:
  - Flap.sh API
  - Flap.sh launchpad
  - BSC launchpad API
  - Flap.sh token analytics
  - Flap.sh token creation
  - Flap.sh trades
  - Flap.sh OHLCV
  - BSC token launchpad
  - Tax token v1
  - Tax token v2
  - Vanity token
  - Flap.sh portal contract
  - Flap.sh launchpad contract
  - BSC token tracking
  - Flap.sh real-time data
  - Flap.sh streaming
  - BSC DEX analytics
  - Token launch analytics
  - Launchpad monitoring
sidebar_position: 1
---

# Flap.sh API

Flap.sh is a token launchpad platform on BNB Smart Chain (BSC) that enables users to create and launch new tokens with unique features including tax tokens and vanity addresses. This comprehensive guide covers how to track, analyze, and monitor Flap.sh tokens using Bitquery's GraphQL APIs.

## Overview

Flap.sh provides a decentralized token launchpad where users can create tokens with customizable features. The platform supports standard tokens and tax tokens (v1 and v2), each with distinct contract addresses and token suffix patterns.

### Key Features

- **Token Creation Tracking** – Monitor new token launches in real-time
- **Tax Token Support** – Track both standard and tax-enabled tokens
- **Vanity Addresses** – Tokens with custom suffixes (8888 for standard, 7777 for tax)
- **Trading Analytics** – Comprehensive DEX trade data and OHLCV analysis
- **Real-Time Streaming** – Live price and trade updates via GraphQL subscriptions

## Contract Addresses

### Core Contracts

| Contract Type | Address | Description |
|---------------|---------|-------------|
| **Launchpad Contract** | `0x1de460f363AF910f51726DEf188F9004276Bf4bc` | Main launchpad contract for token creation |
| **Portal Contract** | `0xe2cE6ab80874Fa9Fa2aAE65D277Dd6B8e65C9De0` | Portal contract for token management and events |

### Token Contract Templates

| Token Type | Contract Address | Suffix Pattern |
|------------|------------------|----------------|
| **Tax Token V1** | `0x29e6383F0ce68507b5A72a53c2B118a118332aA8` | `7777` |
| **Tax Token V2** | `0xae562c6A05b798499507c6276C6Ed796027807BA` | `7777` |
| **Standard Token** | Various | `8888` |

### Documentation Resources

- **Official Flap.sh Docs**: [https://docs.flap.sh/flap/](https://docs.flap.sh/flap/)
- **Deployed Contract Addresses**: [https://docs.flap.sh/flap/developers/deployed-contract-addresses](https://docs.flap.sh/flap/developers/deployed-contract-addresses)
- **ABI Information**: Available on the deployed contract addresses page

## Token Creation Tracking

### New Flap.sh Tokens Created Using Transfers API

Track newly created Flap.sh tokens by monitoring transfers from the zero address with token addresses ending in the vanity suffix.

**Try it live:** [Latest Flap.sh Token Created](https://ide.bitquery.io/New-Flapsh-Tokens-Created-Using-Transfers-API)

```graphql
{
  EVM(network: bsc) {
    Transfers(
      where: {TransactionStatus: {Success: true}, 
        any: [{Transfer: {Currency: {SmartContract: {endsWith: "7777"}}}}
        {Transfer: {Currency: {SmartContract: {endsWith: "8888"}}}}
        ],
        Transfer: {Sender: {is: "0x0000000000000000000000000000000000000000"}}}
      limit: {count: 100}
      orderBy: {descending: Block_Time}
    ) {
      Transaction {
        Hash
      }
      Transfer {
        Amount
        Sender
        Receiver
        Currency {
          Symbol
          Name
          SmartContract
        }
      }
      Block {
        Time
        Number
      }
    }
  }
}
```

**Note:** For standard tokens, change the suffix from `"7777"` to `"8888"` in the query.

### Token Creation Using Events API

Monitor token creation events directly from the Flap.sh portal contract for more detailed information.

**Try it live:** [Latest Flap.sh Token Created Using Events](https://ide.bitquery.io/Latest-flapsh-token-created-using-events-data_1)

```graphql
{
  EVM(dataset: realtime, network: bsc) {
    Events(
      orderBy: { descending: Block_Time }
      where: {
        LogHeader: {
          Address: { is: "0xe2ce6ab80874fa9fa2aae65d277dd6b8e65c9de0" }
        }
        Log: {
          SmartContract: {
            in: ["0xdda462c04e09abec8b90c879f039762552011d5a"]
          }
          Signature: {
            Name: {
              in: [
                "TokenCreated",
                "TokenCurveSetV2",
                "TokenDexSupplyThreshSet",
                "TokenVersionSet",
                "TokenQuoteSet",
                "TokenMigratorSet",
                "TokenDexPreferenceSet",
                "FlapTokenTaxSet"
              ]
            }
          }
        }
      }
    ) {
      Block {
        Number
        Time
      }
      Transaction {
        Hash
        From
        To
        Type
      }
      Arguments {
        Name
        Type
        Value {
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
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
        }
      }
      LogHeader {
        Address
      }
      Log {
        Signature {
          Name
          Signature
        }
        SmartContract
      }
    }
  }
}
```

### Specific Token Creation Details

Get detailed information about a specific token's creation and configuration events within a time range.

**Try it live:** [Getting Details of Specific Flap.sh Token Creation](https://ide.bitquery.io/Getting-details-of-specific-flapsh-token-creation-using-the-events-api_4)

```graphql
{
  EVM(dataset: combined, network: bsc) {
    Events(
      where: {
        Block: { Date: { since_relative: { days_ago: 5 } } }
        LogHeader: {
          Address: { is: "0xe2ce6ab80874fa9fa2aae65d277dd6b8e65c9de0" }
        }
        Log: {
          SmartContract: {
            in: ["0xdda462c04e09abec8b90c879f039762552011d5a"]
          }
          Signature: {
            Name: {
              in: [
                "TokenCreated",
                "TokenCurveSetV2",
                "TokenDexSupplyThreshSet",
                "TokenVersionSet",
                "TokenQuoteSet",
                "TokenMigratorSet",
                "TokenDexPreferenceSet",
                "FlapTokenTaxSet"
              ]
            }
          }
        }
        Arguments: {
          includes: {
            Name: { is: "token" }
            Value: {
              Address: { is: "0x7e39a0fff2c6860d30bdd8e1133665b0a4b47777" }
            }
          }
        }
      }
    ) {
      Block {
        Number
        Time
      }
      Transaction {
        Hash
        From
        To
        Type
      }
      Arguments {
        Name
        Type
        Value {
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
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
        }
      }
      Log {
        Signature {
          Name
          Signature
        }
      }
    }
  }
}
```

### Token Tax Details

Retrieve tax configuration details for specific Flap.sh tokens.

**Try it live:** [Getting Flap.sh Token Tax Details](https://ide.bitquery.io/Getting-Flapsh-token-tax-details-using-events-api_1)

```graphql
{
  EVM(dataset: combined, network: bsc) {
    Events(
      where: {
        Block: { Date: { since_relative: { days_ago: 5 } } }
        LogHeader: {
          Address: { is: "0xe2ce6ab80874fa9fa2aae65d277dd6b8e65c9de0" }
        }
        Log: {
          SmartContract: {
            in: ["0xdda462c04e09abec8b90c879f039762552011d5a"]
          }
          Signature: {
            Name: {
              in: [
                "TokenCreated",
                "TokenCurveSetV2",
                "TokenDexSupplyThreshSet",
                "TokenVersionSet",
                "TokenQuoteSet",
                "TokenMigratorSet",
                "TokenDexPreferenceSet",
                "FlapTokenTaxSet"
              ]
            }
          }
        }
        Arguments: {
          includes: {
            Name: { is: "token" }
            Value: {
              Address: { is: "0x7e39a0fff2c6860d30bdd8e1133665b0a4b47777" }
            }
          }
        }
        Transaction: {
          Hash: {
            is: "0x89491e82ed4a8b12408924992cb0c2359e443aed4e6c18eed87b0e7356f49cf9"
          }
        }
      }
    ) {
      Block {
        Number
        Time
      }
      Transaction {
        Hash
        From
        To
      }
      Arguments {
        Name
        Type
        Value {
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
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
        }
      }
      Log {
        Signature {
          Name
          Signature
        }
      }
    }
  }
}
```

## Trading Analytics

### Latest Flap.sh Trades

Monitor all recent trades across Flap.sh tokens using the DEXTrades API.

**Try it live:** [Latest Flap.sh Trades Using DEXTrades API](https://ide.bitquery.io/Latest-Flapsh-trades-using-DEXTrades-API)

```graphql
{
  EVM(dataset: realtime, network: bsc) {
    DEXTrades(
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
      where: {
        TransactionStatus: { Success: true }
        Trade: {
          Dex: {
            SmartContract: { is: "0xe2ce6ab80874fa9fa2aae65d277dd6b8e65c9de0" }
          }
        }
      }
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
        From
        To
        Gas
        Cost
        CostInUSD
      }
      Trade {
        Buy {
          Amount
          AmountInUSD
          Buyer
          Seller
          Currency {
            Decimals
            Name
            Symbol
            SmartContract
          }
          Price
          PriceInUSD
        }
        Sell {
          Amount
          AmountInUSD
          Buyer
          Seller
          Currency {
            Name
            Symbol
            SmartContract
          }
          Price
          PriceInUSD
        }
        Dex {
          ProtocolName
          SmartContract
          OwnerAddress
        }
      }
    }
  }
}
```

### Trades for Specific Token

Get trading activity for a specific Flap.sh token using DEXTradeByTokens API.

**Try it live:** [Latest Flap.sh Trades for a Specific Token](https://ide.bitquery.io/Latest-Flapsh-trades-for-a-specific-token)

```graphql
{
  EVM(dataset: realtime, network: bsc) {
    DEXTradeByTokens(
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
      where: {
        TransactionStatus: { Success: true }
        Trade: {
          Side: {
            Currency: {
              SmartContract: { is: "0x2fd5b2deae6002d924e3ff8b0f438dfac3a97777" }
            }
          }
          Dex: {
            SmartContract: { is: "0xe2ce6ab80874fa9fa2aae65d277dd6b8e65c9de0" }
          }
        }
      }
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
        From
        To
      }
      Trade {
        Amount
        AmountInUSD
        Price
        PriceInUSD
        Buyer
        Seller
        Sender
        Currency {
          Name
          Symbol
          SmartContract
        }
        Side {
          Amount
          AmountInUSD
          Type
          Currency {
            Name
            Symbol
            SmartContract
          }
        }
        Dex {
          ProtocolName
          ProtocolFamily
        }
        Fees {
          Amount
          AmountInUSD
          Payer
          Recipient
        }
      }
    }
  }
}
```

## Price and OHLCV Data

### OHLCV Data in USD

Get OHLCV (Open, High, Low, Close, Volume) data for Flap.sh tokens quoted in USD.

**Try it live:** [OHLCV Data for Specific Flap.sh Token in USD](https://ide.bitquery.io/OHLCV-data-for-specific-Flapsh-token-in-USD)

```graphql
{
  Trading {
    Tokens(
      where: {
        Token: {
          Id: { is: "bid:bsc:0x2fd5b2deae6002d924e3ff8b0f438dfac3a97777" }
        }
        Interval: {
          Time: { Duration: { eq: 1 } }
        }
      }
      limit: { count: 100 }
      orderBy: { descending: Block_Time }
    ) {
      Token {
        Address
        Id
        Name
        Symbol
        Network
      }
      Block {
        Date
        Time
        Timestamp
      }
      Interval {
        Time {
          Start
          Duration
          End
        }
      }
      Volume {
        Base
        Quote
        Usd
      }
      Price {
        IsQuotedInUsd
        Ohlc {
          Open
          High
          Low
          Close
        }
        Average {
          Mean
          SimpleMoving
          ExponentialMoving
          WeightedSimpleMoving
        }
      }
    }
  }
}
```

### OHLCV Data Against BNB

Get OHLCV data for Flap.sh tokens paired with BNB.

**Try it live:** [OHLCV Data for Specific Flap.sh Token Against BNB](https://ide.bitquery.io/OHLCV-data-for-specific-Flapsh-token-against-BNB)

```graphql
{
  Trading {
    Pairs(
      where: {
        Token: {
          Id: { is: "bid:bsc:0x2fd5b2deae6002d924e3ff8b0f438dfac3a97777" }
        }
        Interval: {
          Time: { Duration: { eq: 1 } }
        }
      }
      limit: { count: 100 }
      orderBy: { descending: Block_Time }
    ) {
      Token {
        Address
        Id
        Name
        Symbol
        Network
      }
      QuoteToken {
        Address
        Id
        Name
        Symbol
        Network
      }
      Market {
        Program
        Name
      }
      Block {
        Date
        Time
        Timestamp
      }
      Interval {
        Time {
          Start
          Duration
          End
        }
      }
      Volume {
        Base
        Quote
        Usd
      }
      Price {
        IsQuotedInUsd
        Ohlc {
          Open
          High
          Low
          Close
        }
        Average {
          Mean
          SimpleMoving
          ExponentialMoving
          WeightedSimpleMoving
        }
      }
    }
  }
}
```

## Real-Time Streaming

### Stream Latest Prices for Flap.sh Tokens

Subscribe to real-time price updates for all Flap.sh tokens.

**Try it live:** [Stream for Latest Prices for Flap.sh Tokens](https://ide.bitquery.io/Stream-for-latest-prices-for-Flapsh-tokens)

```graphql
subscription {
  Trading {
    Pairs(
      where: {
        Market: {
          Id: { is: "bid:bsc:0xe2ce6ab80874fa9fa2aae65d277dd6b8e65c9de0" }
        }
        Interval: {
          Time: { Duration: { eq: 1 } }
        }
      }
    ) {
      Token {
        Address
        Id
        Name
        Symbol
        Network
      }
      QuoteToken {
        Address
        Id
        Name
        Symbol
        Network
      }
      Market {
        Program
        Name
      }
      Block {
        Date
        Time
        Timestamp
      }
      Interval {
        Time {
          Start
          Duration
          End
        }
      }
      Volume {
        Base
        Quote
        Usd
      }
      Price {
        IsQuotedInUsd
        Ohlc {
          Open
          High
          Low
          Close
        }
        Average {
          Mean
          SimpleMoving
          ExponentialMoving
          WeightedSimpleMoving
        }
      }
    }
  }
}
```

## Token Types and Suffixes

### Understanding Flap.sh Token Types

Flap.sh supports multiple token types with distinct characteristics:

#### Standard Tokens
- **Suffix Pattern**: `8888`
- **Description**: Standard ERC-20 compatible tokens without tax mechanisms
- **Use Case**: Traditional token launches with no transfer fees

#### Tax Tokens
- **Suffix Pattern**: `7777`
- **Versions**: 
  - **Tax Token V1**: Contract `0x29e6383F0ce68507b5A72a53c2B118a118332aA8`
  - **Tax Token V2**: Contract `0xae562c6A05b798499507c6276C6Ed796027807BA`
- **Description**: Tokens with built-in transfer tax mechanisms
- **Use Case**: Revenue-generating tokens with automatic fee collection

### Identifying Token Types

You can identify Flap.sh tokens by checking the last 4 characters of their contract address:
- Tokens ending in `8888` are standard tokens
- Tokens ending in `7777` are tax tokens

## Use Cases

### Token Launch Monitoring
- Track new token launches in real-time
- Monitor token creation events and configurations
- Analyze launch patterns and trends

### Trading Analytics
- Monitor trading volume and liquidity
- Track price movements and volatility
- Analyze trader behavior and patterns

### Tax Token Analysis
- Monitor tax token performance
- Compare tax token vs standard token metrics
- Analyze fee collection and distribution

### Portfolio Tracking
- Track holdings across multiple Flap.sh tokens
- Monitor portfolio performance in real-time
- Calculate P&L for Flap.sh token investments

### Arbitrage Detection
- Identify price discrepancies across markets
- Monitor cross-DEX arbitrage opportunities
- Track flash loan usage on Flap.sh tokens

## Best Practices

1. **Use Real-Time Dataset for Live Data**: Use `dataset: realtime` for current token creation and trading activity
2. **Use Combined Dataset for Historical Analysis**: Use `dataset: combined` for comprehensive historical data
3. **Filter by Token Type**: Use suffix patterns (`7777` or `8888`) to filter by token type
4. **Monitor Portal Contract Events**: Track portal contract events for detailed token configuration changes
5. **Implement Rate Limiting**: Respect API limits when building applications
6. **Cache Frequently Used Data**: Store token metadata locally to reduce API calls

## Related Documentation

- [BSC Blockchain API](https://docs.bitquery.io/docs/blockchain/BSC/index) – BNB Smart Chain documentation
- [DEX Trades API](https://docs.bitquery.io/docs/evm/dextrades) – DEX trading data documentation
- [Events API](https://docs.bitquery.io/docs/evm/events) – Smart contract events documentation
- [Transfers API](https://docs.bitquery.io/docs/evm/transfers) – Token transfer tracking
- [Trading APIs](https://docs.bitquery.io/docs/trading/crypto-price-api/introduction) – Price and OHLCV data
- [GraphQL Subscriptions](https://docs.bitquery.io/docs/subscriptions/subscription) – Real-time data streaming

## Support

For questions or issues:
- [Bitquery Documentation](https://docs.bitquery.io)
- [Flap.sh Official Documentation](https://docs.flap.sh/flap/)
- [Bitquery IDE](https://ide.bitquery.io)