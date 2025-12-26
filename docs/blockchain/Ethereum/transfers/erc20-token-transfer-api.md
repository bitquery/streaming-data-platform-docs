---
sidebar_position: 1
---

# ERC20 Token Transfers API

Track and analyze ERC20 token transfers across the Ethereum blockchain in real-time and historically. Monitor token movements, analyze transfer volumes, track wallet activity, and build comprehensive token transfer analytics using Bitquery's ERC20 Token Transfers API.

<head>
<meta name="title" content="ERC20 Token Transfers API | Track Ethereum Token Transfers"/>
<meta name="description" content="Get real-time and historical ERC20 token transfers on Ethereum. Track USDT, USDC, WETH transfers, monitor wallet activity, analyze transfer volumes, and build token analytics with Bitquery's GraphQL API."/>
<meta name="keywords" content="ERC20 token transfers, ERC20 transfer API, Ethereum token transfers, token transfer tracking, USDT transfers, USDC transfers, WETH transfers, token transfer analytics, ERC20 API, Ethereum transfers API, token flow analysis, wallet transfer tracking, ERC20 transfer history, token transfer monitoring"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:title" content="ERC20 Token Transfers API | Track Ethereum Token Transfers" />
<meta property="og:description" content="Get real-time and historical ERC20 token transfers on Ethereum. Track USDT, USDC, WETH transfers, monitor wallet activity, and analyze transfer volumes." />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="ERC20 Token Transfers API | Track Ethereum Token Transfers" />
<meta property="twitter:description" content="Get real-time and historical ERC20 token transfers on Ethereum. Track USDT, USDC, WETH transfers, monitor wallet activity, and analyze transfer volumes." />
</head>

## What are ERC20 Token Transfers?

ERC20 is the most widely adopted token standard on Ethereum, enabling fungible tokens that can be transferred between addresses. ERC20 token transfers represent the movement of tokens from one wallet to another, forming the foundation of DeFi, trading, and token-based applications.

Understanding ERC20 transfers is essential for:
- **Portfolio Tracking**: Monitor token movements in and out of wallets
- **Tax & Accounting**: Generate comprehensive transfer reports for crypto tax calculations, cost basis tracking, and token accounting reconciliation
- **Compliance & Auditing**: Track token flows for regulatory requirements
- **DeFi Analytics**: Analyze liquidity movements and protocol interactions
- **Token Analytics**: Understand token distribution and holder behavior
- **Security Monitoring**: Detect suspicious transfers and wallet activity

## 🔗 Related APIs

### Ethereum APIs
- **[Ethereum Balance API](https://docs.bitquery.io/docs/blockchain/Ethereum/balances/balance-api)** - Get wallet balances for ERC20, ERC721, and ERC1155 tokens
- **[Ethereum Transaction Balance Tracker](https://docs.bitquery.io/docs/blockchain/Ethereum/balances/transaction-balance-tracker/)** - Track real-time balance changes with reason codes
- **[Ethereum Token Holders API](https://docs.bitquery.io/docs/blockchain/Ethereum/token-holders/token-holder-api)** - Get top token holders and distribution data
- **[Ethereum Token Supply API](https://docs.bitquery.io/docs/blockchain/Ethereum/token-supply/evm-token-supply)** - Track total supply and supply changes
- **[Ethereum DEX Trades API](https://docs.bitquery.io/docs/blockchain/Ethereum/dextrades/dex-api)** - Monitor DEX trading activity
- **[Ethereum Transactions API](https://docs.bitquery.io/docs/blockchain/Ethereum/transactions/transaction-api)** - Get comprehensive transaction data
- **[Ethereum Events API](https://docs.bitquery.io/docs/blockchain/Ethereum/events/events-api)** - Query smart contract events

### EVM APIs
- **[EVM Transfers API](https://docs.bitquery.io/docs/evm/transfers)** - General EVM token transfers documentation
- **[EVM Balance Updates API](https://docs.bitquery.io/docs/evm/balances)** - Track balance changes across EVM chains
- **[EVM DEX Trades API](https://docs.bitquery.io/docs/evm/dextrades)** - DEX trading data across EVM chains

### NFT & Other Token Standards
- **[NFT Transfer API](https://docs.bitquery.io/docs/blockchain/Ethereum/transfers/nft-token-transfer-api)** - Track ERC721 and ERC1155 NFT transfers
- **[RWA Token API](https://docs.bitquery.io/docs/blockchain/Ethereum/transfers/rwa-api)** - Real World Asset token transfers

### Solana APIs
- **[Solana Transfers API](https://docs.bitquery.io/docs/blockchain/Solana/solana-transfers/)** - Track SPL token transfers and SOL transfers on Solana
- **[Solana Balance Updates API](https://docs.bitquery.io/docs/blockchain/Solana/solana-balance-updates/)** - Monitor Solana wallet balance changes
- **[Solana DEX Trades API](https://docs.bitquery.io/docs/blockchain/Solana/solana-dextrades/)** - Track Solana DEX trading activity

---

## 📋 Table of Contents

- **Get Latest ERC20 Token Transfers** - Query recent token transfers
- **Subscribe to Real-Time Transfers** - WebSocket subscriptions for live data
- **Filter by Sender or Receiver** - Query transfers involving specific addresses
- **Transfer Volume Analysis** - Calculate sent and received volumes
- **Top Transfers** - Get largest token transfers
- **Earliest Transfer Tracking** - Find first transfers to addresses
- **Use Cases** - Common applications and examples
- **API Response Fields** - Complete field reference

---

## Get Latest ERC20 Token Transfers

Query the most recent ERC20 token transfers for any token on Ethereum. This example retrieves the latest USDT (Tether) token transfers. The contract address for USDT is [0xdac17f958d2ee523a2206206994597c13d831ec7](https://explorer.bitquery.io/ethereum/token/0xdac17f958d2ee523a2206206994597c13d831ec7).

You can run this query [here](https://ide.bitquery.io/UDST-Token-Transfers-on-Ethereum_2).

```graphql
{
  EVM(dataset: realtime, network: eth) {
    Transfers(
      where: {
        Transfer: {
          Currency: {
            SmartContract: { is: "0xdac17f958d2ee523a2206206994597c13d831ec7" }
          }
        }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Transfer {
        Amount
        Currency {
          Name
          Symbol
        }
        Receiver
        Sender
        Type
      }
    }
  }
}
```

**Common ERC20 Token Addresses (Ethereum):**

| Token | Contract Address                             | Symbol |
| ----- | -------------------------------------------- | ------ |
| USDT  | `0xdac17f958d2ee523a2206206994597c13d831ec7` | USDT   |
| USDC  | `0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48` | USDC   |
| WETH  | `0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2` | WETH   |
| DAI   | `0x6b175474e89094c44da98b954eedeac495271d0f` | DAI    |
| LINK  | `0x514910771af9ca656af840dff83e8264ecf986ca` | LINK   |

---

## Query Multiple Tokens in a Single Query

Query transfers for multiple ERC20 tokens simultaneously using the `in` operator. This is useful for monitoring multiple tokens at once, building portfolio trackers that track several tokens, or analyzing transfers across a token basket.

The example below queries transfers for USDT, USDC, WETH, and native ETH (`0x` represents native ETH) in a single request:

```graphql
{
  EVM(dataset: realtime, network: eth) {
    Transfers(
      where: {
        Transfer: {
          Currency: {
            SmartContract: {
              in: [
                "0xdac17f958d2ee523a2206206994597c13d831ec7"
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
                "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
                "0x"
              ]
            }
          }
        }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Transfer {
        Amount
        Currency {
          Name
          Symbol
        }
        Receiver
        Sender
        Type
      }
    }
  }
}
```

**Use Cases:**
- Monitor multiple stablecoins simultaneously (USDT, USDC, DAI)
- Track transfers for a portfolio of tokens
- Analyze token movements across a token basket
- Build multi-token dashboards and analytics

:::tip Multi-Chain Support
**Query Any EVM Network**: Change the `network` parameter to query token transfers on other EVM-compatible blockchains:

- `eth` - Ethereum Mainnet
- `bsc` - BNB Smart Chain (BSC)
- `base` - Base L2
- `arbitrum` - Arbitrum One
- `matic` - Polygon PoS
- `optimism` - Optimism L2

**Example for BSC:**
```graphql
{
  EVM(dataset: realtime, network: bsc) {
    Transfers(
      where: {
        Transfer: {
          Currency: {
            SmartContract: {
              in: ["0x55d398326f99059fF775485246999027B3197955"] // USDT on BSC
            }
          }
        }
      }
      limit: { count: 10 }
    ) {
      Transfer {
        Amount
        Currency { Name Symbol }
        Sender
        Receiver
      }
    }
  }
}
```

**Solana Token Transfers**: For SPL token transfers on Solana, see our **[Solana Transfers API](https://docs.bitquery.io/docs/blockchain/Solana/solana-transfers/)** documentation.
:::

---

## Subscribe to Real-Time ERC20 Token Transfers

Monitor ERC20 token transfers in real-time using GraphQL subscriptions. This is ideal for building live dashboards, alert systems, and real-time analytics applications.

This example subscribes to WETH (Wrapped Ethereum) token transfers. The contract address is [0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2](https://explorer.bitquery.io/ethereum/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2).

You can test this subscription [here](https://graphql.bitquery.io/ide/Subscribe-to-Latest-WETH-token-transfers).

```graphql
subscription {
  EVM(network: eth, trigger_on: head) {
    Transfers(
      where: {
        Transfer: {
          Currency: {
            SmartContract: { is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" }
          }
        }
      }
      orderBy: { descending: Block_Time }
    ) {
      Transaction {
        Hash
      }
      Transfer {
        Amount
        Currency {
          Name
          Symbol
        }
        Receiver
        Sender
        Type
      }
    }
  }
}
```

:::tip Real-Time Monitoring
For more information on setting up real-time subscriptions, see our [GraphQL Subscriptions documentation](https://docs.bitquery.io/docs/subscriptions/subscription).
:::

---

## Filter by Sender or Receiver

Query transfers where a specific address is either the sender or receiver. This uses the `any` filter to implement OR logic, allowing you to find all transfers involving a particular address regardless of direction.

You can find the query [here](https://ide.bitquery.io/Sender-OR-Receiver-Transfer-on-Ethereum).

```graphql
query MyQuery {
  EVM(dataset: archive, network: eth) {
    Transfers(
      where: {
        any: [
          {
            Transfer: {
              Sender: { is: "0x881d40237659c251811cec9c364ef91dc08d300c" }
            }
          }
          {
            Transfer: {
              Receiver: { is: "0x881d40237659c251811cec9c364ef91dc08d300c" }
            }
          }
        ]
        Block: { Number: { eq: "23814227" } }
      }
      limit: { count: 100 }
      orderBy: { descending: Block_Time }
    ) {
      Transfer {
        Amount
        Sender
        Receiver
        Currency {
          Symbol
          Name
        }
      }
      Transaction {
        Hash
        From
        To
        Index
      }
      Block {
        Number
        Time
      }
    }
  }
}
```

---

## Addresses That Sent or Received from Multiple Addresses

Find addresses that have interacted with multiple addresses from a given list. This query uses the `array_intersect` function to identify addresses that have sent or received funds to/from every address in your list.

You can run the query [here](https://ide.bitquery.io/array_intersect-example-for-2-addresses_2).

```graphql
query ($addresses: [String!]) {
  EVM(dataset: archive) {
    Transfers(
      where: {
        any: [
          { Transfer: { Sender: { in: $addresses } } }
          { Transfer: { Receiver: { in: $addresses } } }
        ]
        Block: { Date: { after: "2024-04-01" } }
      }
    ) {
      array_intersect(
        side1: Transfer_Sender
        side2: Transfer_Receiver
        intersectWith: $addresses
      )
    }
  }
}
```

**Variables:**
```json
{
  "addresses": [
    "0x21743a2efb926033f8c6e0c3554b13a0c669f63f",
    "0x107f308d85d5481f5b729cfb1710532500e40217"
  ]
}
```

:::note Array Intersect Function
Learn more about the `array_intersect` function in our [Array Intersect documentation](https://docs.bitquery.io/docs/graphql/capabilities/array-intersect).
:::

---

## Transfer Volume Analysis (Sent and Received)

Calculate the total amount of tokens sent and received by a specific address for a particular token over a time period. This is essential for portfolio analysis, tax reporting, and wallet analytics.

You can run this query [here](https://ide.bitquery.io/transfer-volume).

```graphql
query MyQuery($address: String, $token: String) {
  EVM {
    Transfers(
      where: {
        Block: { Time: { since_relative: { years_ago: 1 } } }
        Transfer: {
          Currency: { SmartContract: { is: $token } }
          any: [
            { Transfer: { Sender: { is: $address } } }
            { Transfer: { Receiver: { is: $address } } }
          ]
        }
      }
    ) {
      Sent: sum(
        of: Transfer_Amount
        if: { Transfer: { Sender: { is: $address } } }
      )
      Received: sum(
        of: Transfer_Amount
        if: { Transfer: { Receiver: { is: $address } } }
      )
    }
  }
}
```

**Variables:**
```json
{
  "address": "0x782c362fbf71f939445e6902a064f7e9384f47e2",
  "token": "0x"
}
```

:::note Native ETH Transfers
Use `"0x"` as the token address to query native ETH transfers. For ERC20 tokens, use the token's contract address.
:::

---

## Top Transfers of a Token

Retrieve the largest token transfers for any ERC20 token. This is useful for identifying whale movements, large transactions, and significant token flows.

Try the query [here](https://ide.bitquery.io/Copy-of-top-transfers-of-a-token-on-Ethereum).

```graphql
query MyQuery {
  EVM(dataset: archive) {
    Transfers(
      where: {
        Transfer: {
          Currency: {
            SmartContract: { is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" }
          }
        }
        TransactionStatus: { Success: true }
        Block: { Date: { is: "2024-06-29" } }
      }
      orderBy: { descending: Block_Time }
      limit: { count: 10 }
    ) {
      Transfer {
        Amount
        AmountInUSD
        Currency {
          Name
          Symbol
          SmartContract
        }
        Success
        Sender
        Receiver
        Index
        Id
      }
      Transaction {
        To
        Hash
        Value
        Type
        GasPrice
        Gas
        From
        Cost
      }
      Log {
        Signature {
          Signature
          Name
        }
        SmartContract
      }
      Call {
        From
        To
        Value
        Signature {
          Name
        }
      }
      Block {
        Number
        Time
      }
    }
  }
}
```

---

## Earliest Transfer to a Wallet

Find the first transfer ever received by a specific wallet address. This is useful for wallet age analysis, first transaction tracking, and onboarding analytics.

[Run Query](https://ide.bitquery.io/Copy-of-find-earliest-transfer-to-an-account).

```graphql
query MyQuery {
  EVM(network: eth, dataset: archive) {
    Transfers(
      limit: { count: 1 }
      where: {
        Transfer: {
          Receiver: { is: "0xe37b87598134a2fc0Eda4d71a3a80ad28C751Ed7" }
        }
      }
    ) {
      Block {
        Time(minimum: Block_Number)
      }
      Transaction {
        From
        Hash
      }
      Transfer {
        Amount
        Currency {
          Native
        }
      }
    }
  }
}
```

---

## Use Cases

### 1. Portfolio Tracking & Analytics

Track all token transfers for a wallet to build comprehensive portfolio dashboards:
- Monitor incoming and outgoing transfers
- Calculate total sent/received volumes
- Track transfer history over time
- Build transaction timelines

**Related APIs:**
- [Ethereum Balance API](https://docs.bitquery.io/docs/blockchain/Ethereum/balances/balance-api) - Get current wallet balances
- [Transaction Balance Tracker](https://docs.bitquery.io/docs/blockchain/Ethereum/balances/transaction-balance-tracker/) - Real-time balance updates

### 2. Tax & Accounting

Generate comprehensive transfer reports for tax calculations, accounting reconciliation, and financial reporting:

**Tax Use Cases:**
- Calculate capital gains/losses from token transfers
- Track cost basis for tax reporting (FIFO, LIFO, or specific identification)
- Generate Form 8949 compatible reports
- Calculate realized gains/losses by token and date
- Export transfer history for tax software integration

**Accounting Use Cases:**
- Reconcile token movements with accounting records
- Track transfer volumes by token and time period
- Generate audit trails for financial statements
- Calculate token balances from transfer history
- Export CSV/JSON reports for accounting systems

**Key Features:**
- Export all transfers for a wallet with timestamps
- Calculate transfer volumes by token
- Track transfer dates and USD values
- Generate comprehensive CSV/JSON reports
- Filter transfers by date ranges for tax periods

### 3. DeFi Protocol Analytics

Analyze token flows in and out of DeFi protocols:
- Monitor liquidity movements
- Track protocol token distributions
- Analyze user deposit/withdrawal patterns
- Measure protocol adoption

**Related APIs:**
- [Ethereum DEX Trades API](https://docs.bitquery.io/docs/blockchain/Ethereum/dextrades/dex-api) - Track DEX trading activity
- [Ethereum Events API](https://docs.bitquery.io/docs/blockchain/Ethereum/events/events-api) - Monitor smart contract events

### 4. Token Distribution Analysis

Understand how tokens are distributed across addresses:
- Track token holder changes
- Analyze concentration metrics
- Monitor whale movements
- Identify distribution patterns

**Related APIs:**
- [Token Holders API](https://docs.bitquery.io/docs/blockchain/Ethereum/token-holders/token-holder-api) - Get top holders
- [Token Supply API](https://docs.bitquery.io/docs/blockchain/Ethereum/token-supply/evm-token-supply) - Track supply changes

### 5. Security & Fraud Detection

Monitor transfers for suspicious activity:
- Detect large unexpected transfers
- Track transfers to known scam addresses
- Monitor wallet activity patterns
- Set up real-time alerts

### 6. Wallet Analytics

Build comprehensive wallet analysis tools:
- Calculate wallet age (earliest transfer)
- Track transfer frequency
- Analyze token diversity
- Monitor wallet activity levels

---

## API Response Fields

| Field                          | Description                                    |
| ------------------------------ | ---------------------------------------------- |
| `Transfer.Amount`              | Amount of tokens transferred                   |
| `Transfer.AmountInUSD`        | Transfer amount in USD (if available)         |
| `Transfer.Sender`              | Address that sent the tokens                   |
| `Transfer.Receiver`            | Address that received the tokens              |
| `Transfer.Currency.Name`       | Token name (e.g., "Tether USD")                |
| `Transfer.Currency.Symbol`     | Token symbol (e.g., "USDT")                   |
| `Transfer.Currency.SmartContract` | Token contract address                      |
| `Transfer.Success`             | Whether the transfer was successful            |
| `Transfer.Type`                | Type of transfer (e.g., "call")                |
| `Transaction.Hash`             | Transaction hash                               |
| `Transaction.From`             | Transaction sender address                    |
| `Transaction.To`               | Transaction recipient address                 |
| `Block.Number`                 | Block number                                   |
| `Block.Time`                   | Block timestamp                                |

---

## Best Practices

1. **Use Appropriate Datasets**: 
   - `realtime` for recent data (last 8 hours)
   - `archive` for historical data
   - `combined` for comprehensive queries

2. **Filter by Token Contract**: Always filter by `SmartContract` address when querying specific tokens to improve performance.

3. **Use Limit and OrderBy**: Always specify `limit` and `orderBy` to control result size and ordering.

4. **Handle Large Result Sets**: For large queries, use pagination or time-based filters to avoid timeouts.

5. **Subscribe for Real-Time Data**: Use GraphQL subscriptions for live monitoring instead of polling.

6. **Combine with Other APIs**: Enhance transfer data with balance, transaction, and event APIs for comprehensive analytics.

---

## Getting Started

1. **Get API Access**: Sign up at [Bitquery](https://bitquery.io/) to get your API key
2. **Try in IDE**: Test queries in the [Bitquery IDE](https://ide.bitquery.io/)
3. **Read Documentation**: Explore our [Getting Started Guide](https://docs.bitquery.io/docs/start/first-query/)
4. **Check Examples**: See more examples in [Starter Queries](https://docs.bitquery.io/docs/start/starter-queries)

For more information on authentication and API usage, see our [Authorization Guide](https://docs.bitquery.io/docs/authorisation/how-to-use).
