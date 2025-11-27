---
title: "x402 Data API"
description: "Complete guide to x402 API: Query x402 payment transactions, monitor server payments in real-time, and analyze payment analytics. Learn how to use GraphQL APIs to track x402 protocol payments, server activity, and user transactions across multiple blockchain networks."
keywords:
  - x402 API
  - x402 GraphQL API
  - how to query x402
  - x402 data API
  - x402 payment API
  - x402 server API
  - query x402 payments
  - x402 trading API
  - x402 analytics API
  - get x402 data
  - x402 blockchain API
  - Base network API
  - GraphQL blockchain API
  - cryptocurrency payment protocol
  - decentralized API payments
  - real-time payment data
  - smart contract payments
  - payment analytics API
---

<head>
  <meta name="title" content="x402 Data API" />
  <meta name="description" content="Track x402 protocol payments, monitor server activity in real-time, and analyze payment analytics across multiple blockchain networks using Bitquery's GraphQL API. Learn how to query x402 payment transactions, server payments, and user analytics." />
  <meta name="keywords" content="x402 API, x402 GraphQL API, x402 payment API, x402 server API, blockchain payment API, x402 analytics, x402 payment tracking, x402 Bazaar, decentralized API payments, pay-per-use API, x402 protocol, multi-chain payment protocol, GraphQL payment queries, x402 server monitoring, real-time payment data" />
  <meta name="robots" content="index, follow" />
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="language" content="English" />

  <meta property="og:type" content="website" />
  <meta property="og:title" content="x402 Data API" />
  <meta property="og:description" content="Use Bitquery's GraphQL API to track x402 protocol payments, monitor server activity in real-time, and analyze payment analytics across multiple blockchain networks. Complete guide to x402 payment queries." />

  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:title" content="x402 Data API - Query x402 Payment Transactions & Server Analytics" />
  <meta property="twitter:description" content="Track x402 protocol payments and server analytics across multiple blockchain networks using Bitquery's GraphQL API. Real-time payment monitoring and analytics queries." />
</head>

# x402 Data API Docs - How to Query x402 Payment Data

Learn how to query x402 payment data using GraphQL APIs. This comprehensive guide shows you how to access payment transactions, monitor server activity in real-time, and analyze payment analytics across multiple blockchain networks. The examples in this guide use Base network, but x402 protocol supports multiple chains.

## What is x402 API?

The x402 API provides programmatic access to x402 protocol payment data through [GraphQL queries](https://docs.bitquery.io/docs/graphql/query). You can query payment transactions, track server activity, monitor real-time payments, and analyze payment analytics directly from the blockchain using [Bitquery's streaming data platform](https://docs.bitquery.io/docs/intro).

## x402 Overview

x402 is a decentralized payment protocol that enables pay-per-use API access on blockchain networks. It allows developers to monetize APIs and services by accepting cryptocurrency payments directly, eliminating the need for traditional subscription models or credit card processing. The protocol operates on multiple blockchain networks (including Base) and uses smart contracts to facilitate automatic payment verification and settlement between clients, servers, and facilitators.

## How x402 Works?

x402 operates on a three-party architecture consisting of clients (API consumers), servers (API providers), and facilitators (payment processors). When a client wants to use a paid API service, they initiate a payment transaction on the blockchain. The facilitator validates the payment and notifies the server, which then processes the API request. The server verifies the payment payload embedded in the request headers before delivering the service. This creates a trustless system where payments are verified on-chain before service delivery, ensuring both parties fulfill their obligations without requiring intermediaries. All payment transactions are recorded on the blockchain and can be queried using [GraphQL transfer queries](https://docs.bitquery.io/docs/blockchain/Ethereum/transfers/erc20-token-transfer-api) for the respective network.

## Various Actors in x402

The x402 ecosystem consists of three main actors:

1. **Clients**: Users or applications that consume paid API services. They initiate [payment transactions](https://docs.bitquery.io/docs/blockchain/Ethereum/transactions/transaction-api) and include payment payloads in their API requests.

2. **Servers**: API providers who offer services for payment. They verify payment payloads and deliver services after confirming valid payments on-chain. Server addresses can be tracked using [transfer queries](https://docs.bitquery.io/docs/blockchain/Ethereum/transfers/erc20-token-transfer-api).

3. **Facilitators**: Payment processors that validate transactions, monitor the blockchain for payments, and notify servers when valid payments are detected. They help bridge the gap between on-chain payments and off-chain service delivery.

## x402 Bazaar - Discover Services and Endpoints

The x402 Bazaar is a discovery service that allows you to find available x402-compatible APIs and services. You can query the Bazaar API to discover resources, view service metadata, check pricing, and understand API requirements.

### Discovery API Endpoint

The x402 Bazaar discovery endpoint is available at:

```
https://api.cdp.coinbase.com/platform/v2/x402/discovery/resources
```

This endpoint returns a paginated list of available x402 services with detailed information about each resource, including payment requirements, API schemas, performance metrics, and reliability scores.

### Example API Response

When you query the x402 Bazaar discovery endpoint, you receive detailed information about each available service. Here's an example response structure:

```json
{
  "accepts": [
    {
      "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      "description": "Payment for token analysis service ($0.01)",
      "extra": {
        "name": "USD Coin",
        "version": "2"
      },
      "maxAmountRequired": "10000",
      "maxTimeoutSeconds": 300,
      "mimeType": "application/json",
      "network": "base",
      "outputSchema": {
        "input": {
          "bodyFields": {
            "chain": {
              "default": "bsc",
              "description": "Blockchain name (bsc, solana, ethereum, etc.)",
              "required": false,
              "type": "string"
            },
            "language": {
              "default": "English",
              "description": "Output language (English, Chinese, Korean, etc.)",
              "required": false,
              "type": "string"
            },
            "token": {
              "description": "Token address or symbol (e.g. BTC, ETH, SOL, etc.)",
              "required": true,
              "type": "string"
            }
          },
          "bodyType": "json",
          "headerFields": {
            "X-PAYMENT": {
              "description": "Base64-encoded JSON PaymentPayload; automatically filled by x402scan",
              "required": false,
              "type": "string"
            }
          },
          "method": "POST",
          "type": "http"
        },
        "output": {
          "analysis": "object",
          "chain": "string",
          "created_at": "string",
          "language": "string",
          "status": "string",
          "token": "string",
          "workflow_run_id": "string|null"
        }
      },
      "payTo": "0x83240485b70e5c820e5f180533fc6156470cfd0e",
      "resource": "https://x402.lucyos.ai/x402/tools/analyze_token",
      "scheme": "exact"
    }
  ],
  "lastUpdated": "2025-11-27T12:57:44.059Z",
  "metadata": {
    "confidence": {
      "overallScore": 0.75,
      "performanceScore": 0.32,
      "recencyScore": 1,
      "reliabilityScore": 0.98,
      "volumeScore": 0.8
    },
    "errorAnalysis": {
      "abandonedFlows": 18,
      "apiErrors": 0,
      "delayedSettlements": 0,
      "facilitatorErrors": 0,
      "requestErrors": 0
    },
    "paymentAnalytics": {
      "averageDailyTransactions": 139,
      "base:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913": 9730000,
      "totalTransactions": 973,
      "totalUniqueUsers": 942,
      "transactions24h": 973,
      "transactionsMonth": 973,
      "transactionsWeek": 973
    },
    "performance": {
      "avgLatencyMs": 2525,
      "maxLatencyMs": 18221,
      "minLatencyMs": 1076,
      "recentAvgLatencyMs": 2359
    },
    "reliability": {
      "apiSuccessRate": 0.98,
      "successfulSettlements": 973,
      "totalRequests": 991
    }
  },
  "resource": "https://x402.lucyos.ai/x402/tools/analyze_token",
  "type": "http",
  "x402Version": 1
}
```

### Understanding the Response Structure

The response contains several key sections:

- **`accepts`**: Array of payment configurations, including the asset (token), payment amount, network, and API endpoint details
- **`payTo`**: The server's wallet address that receives payments
- **`resource`**: The actual API endpoint URL
- **`outputSchema`**: Defines the API's input requirements and expected output format
- **`metadata`**: Contains performance metrics, reliability scores, payment analytics, and error analysis
- **`confidence`**: Overall quality scores based on performance, recency, reliability, and transaction volume

## Payment Payload and Verification

The x402 protocol uses a payment payload system to verify payments between clients and servers. When a client makes a payment, they include a Base64-encoded JSON payment payload in the `X-PAYMENT` header of their API request.

### Payment Payload Structure

The payment payload typically contains:
- Transaction hash of the payment
- Payment amount
- Recipient address (server)
- Timestamp
- Nonce or unique identifier

### Verification Process

1. **Client Side**: The client initiates a [payment transaction](https://docs.bitquery.io/docs/blockchain/Ethereum/transactions/transaction-api) on the supported blockchain network, sending supported tokens (such as USDC) to the server's address. The client then encodes the payment details into a Base64 JSON payload.

2. **Server Side**: The server receives the API request with the `X-PAYMENT` header. It decodes the payload and verifies the payment by checking:
   - The transaction exists on-chain (verifiable through [transaction queries](https://docs.bitquery.io/docs/blockchain/Ethereum/transactions/transaction-api))
   - The payment amount matches the required fee
   - The recipient address matches the server's address
   - The transaction is confirmed and not a double-spend

3. **Facilitator Role**: Facilitators monitor the blockchain for payment transactions using [real-time subscriptions](https://docs.bitquery.io/docs/subscriptions/). When they detect a valid payment to a registered server, they notify the server, enabling faster service delivery without waiting for full blockchain confirmation.

This architecture ensures that servers only deliver services after verifying valid on-chain payments, creating a trustless pay-per-use system.

## x402 Data API Queries

The following queries demonstrate how to query x402 payment data using [Bitquery's GraphQL API](https://docs.bitquery.io/docs/graphql/query). These queries help you monitor payments, track server activity, and analyze payment analytics. For more information on building queries, see our [GraphQL query guide](https://docs.bitquery.io/docs/graphql/query) and [filtering documentation](https://docs.bitquery.io/docs/graphql/filters).

:::note Multi-Chain Support
x402 protocol supports multiple blockchain networks. The examples below use Base network, but you can adapt these queries for other supported chains by changing the `network` parameter.
:::

### Example x402 Server

For the following examples, we'll use this x402 server address:

**Server Address**: `0x83240485b70e5c820e5f180533fc6156470cfd0e`

This server provides token analysis services and accepts USDC payments. The examples below use Base network, but the same query structure applies to other supported chains.

## Listening to Latest Payments to a Specific Server

This query retrieves the most recent payments made to a specific x402 server. It's useful for monitoring server activity and tracking payment transactions.

You can run this query [here](https://ide.bitquery.io/Latest-payment-to-specific-x402-server).

```graphql
query MyQuery {
  EVM(dataset: realtime, network: base) {
    Transfers(
      where: {Transfer: {Receiver: {in: ["0x83240485b70e5c820e5f180533fc6156470cfd0e"]}}}
      orderBy: {descending: Block_Number}
      limit: {count: 100}
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
        }
      }
    }
  }
}
```

### Query Explanation

- **`dataset: realtime`**: Queries the most recent blockchain data. Learn more about [dataset options](https://docs.bitquery.io/docs/graphql/dataset/options)
- **`network: base`**: Specifies the network (Base in this example). Change this to query other supported chains (e.g., `network: ethereum`, `network: bsc`). See [supported networks](https://docs.bitquery.io/docs/blockchain/introduction)
- **`Receiver: {in: [...]}`**: Filters transfers to the specific server address using [GraphQL filters](https://docs.bitquery.io/docs/graphql/filters)
- **`orderBy: {descending: Block_Number}`**: Returns the most recent payments first. See [sorting documentation](https://docs.bitquery.io/docs/graphql/sorting)
- **`limit: {count: 100}`**: Retrieves up to 100 payment transactions. Check [query limits](https://docs.bitquery.io/docs/graphql/limits)

## Real-Time Payment Monitoring with GraphQL WebSockets

You can monitor payments to a specific x402 server in real-time using GraphQL WebSocket subscriptions. This enables live tracking of payment activity without polling.

You can run this subscription [here](https://ide.bitquery.io/Monitoring-the-latest-payment-to-the-specific-X402-server).

```graphql
subscription {
  EVM(network: base) {
    Transfers(
      where: {Transfer: {Receiver: {in: ["0x83240485b70e5c820e5f180533fc6156470cfd0e"]}}}
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
        }
      }
    }
  }
}
```

### Subscription Explanation

- **`subscription`**: Uses [GraphQL subscription](https://docs.bitquery.io/docs/subscriptions/subscription) for real-time updates
- **`EVM(network: base)`**: Monitors the specified network (Base in this example). Change the network parameter to monitor other supported chains
- **`Transfers`**: Listens for new transfer events matching the filter
- The subscription will automatically push new payment transactions as they occur on-chain. Learn more about [real-time subscriptions](https://docs.bitquery.io/docs/subscriptions/)

## Payment Analytics for Specific x402 Server

This query provides comprehensive payment analytics for a specific x402 server, including total volume, unique users, transaction counts, and time-based breakdowns.

You can run this query [here](https://ide.bitquery.io/Payment-analytics-related-specific-x402-server).

```graphql
query MyQuery {
  EVM(dataset: combined, network: base) {
    Transfers(
      where: {
        Block: {Time: {since_relative: {days_ago: 7}}}
        Transfer: {
          Currency: {SmartContract: {is: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"}}
          Receiver: {in: ["0x83240485b70e5c820e5f180533fc6156470cfd0e"]}
        }
      }
    ) {
      Transfer {
        Receiver
      }
      amount7days: sum(of: Transfer_Amount)
      amountInUSD7days: sum(of: Transfer_AmountInUSD)
      totalUniqueUsers7days: count(distinct: Transfer_Sender)
      totalTransactions7days: count(distinct: Transaction_Hash)
      transactions24h: count(
        distinct: Transaction_Hash
        if: {Block: {Time: {since_relative: {hours_ago: 24}}}}
      )
    }
  }
}
```

### Query Explanation

- **`dataset: combined`**: Queries both historical and real-time data. See [dataset options](https://docs.bitquery.io/docs/graphql/dataset/options)
- **`since_relative: {days_ago: 7}`**: Analyzes the last 7 days of payments using [datetime filters](https://docs.bitquery.io/docs/graphql/datetime)
- **`Currency: {SmartContract: {is: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"}}`**: Filters for USDC payments (this is the USDC contract address on Base; use the appropriate contract address for other networks). Learn about [token transfer queries](https://docs.bitquery.io/docs/blockchain/Ethereum/transfers/erc20-token-transfer-api)
- **`sum(of: Transfer_Amount)`**: Calculates total payment volume using [GraphQL metrics](https://docs.bitquery.io/docs/graphql/metrics)
- **`sum(of: Transfer_AmountInUSD)`**: Calculates total volume in USD
- **`count(distinct: Transfer_Sender)`**: Counts unique users who made payments
- **`count(distinct: Transaction_Hash)`**: Counts total payment transactions
- **`transactions24h`**: Conditional count for transactions in the last 24 hours using [conditional metrics](https://docs.bitquery.io/docs/graphql/metrics)

### Analytics Metrics Returned

- **`amount7days`**: Total payment amount received in the last 7 days
- **`amountInUSD7days`**: Total payment amount in USD equivalent
- **`totalUniqueUsers7days`**: Number of unique users who made payments
- **`totalTransactions7days`**: Total number of payment transactions
- **`transactions24h`**: Number of transactions in the last 24 hours

## Additional Use Cases

### Monitor Multiple x402 Servers

You can monitor payments to multiple x402 servers by adding more addresses to the `in` array:

```graphql
where: {
  Transfer: {
    Receiver: {
      in: [
        "0x83240485b70e5c820e5f180533fc6156470cfd0e",
        "0x45A33aC6DB4455460b364A1fc1aE8C489Bc644A7"
      ]
    }
  }
}
```

### Filter by Payment Amount

To filter payments by minimum amount:

```graphql
where: {
  Transfer: {
    Receiver: {in: ["0x83240485b70e5c820e5f180533fc6156470cfd0e"]}
    Amount: {gt: "10000"}  // Minimum 0.01 USDC (6 decimals)
  }
}
```

### Time-Based Analysis

Analyze payments over different time periods:

```graphql
where: {
  Block: {
    Time: {
      since: "2024-01-01T00:00:00Z"
      till: "2024-12-31T23:59:59Z"
    }
  }
}
```

## Related Documentation

- [Blockchain Networks](https://docs.bitquery.io/docs/blockchain/introduction) - Overview of supported blockchain networks
- [Base Network Documentation](https://docs.bitquery.io/docs/blockchain/Base/) - Complete guide to querying Base blockchain data
- [Ethereum Network Documentation](https://docs.bitquery.io/docs/blockchain/Ethereum/) - Query Ethereum blockchain data
- [BSC Network Documentation](https://docs.bitquery.io/docs/blockchain/BSC/) - Query BSC blockchain data
- [GraphQL Query Guide](https://docs.bitquery.io/docs/graphql/query) - Learn how to build GraphQL queries
- [Real-time Subscriptions](https://docs.bitquery.io/docs/subscriptions/) - Monitor blockchain data in real-time
- [Transfer API Documentation](https://docs.bitquery.io/docs/blockchain/Ethereum/transfers/erc20-token-transfer-api) - Query ERC-20 token transfers
- [GraphQL Filters](https://docs.bitquery.io/docs/graphql/filters) - Advanced filtering techniques
- [GraphQL Metrics](https://docs.bitquery.io/docs/graphql/metrics) - Aggregation and calculation functions
- [Datetime Queries](https://docs.bitquery.io/docs/graphql/datetime) - Time-based filtering and analysis
- [Getting Started Guide](https://docs.bitquery.io/docs/start/first-query) - Build your first query
- [WebSocket Subscriptions](https://docs.bitquery.io/docs/subscriptions/websocket) - Real-time data streaming

