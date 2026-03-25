---
title: "Stablecoin Payments API"
description: "Comprehensive guide to Bitquery Stablecoin Payments API with real-time transfers, compliance checks, and multi-chain analytics."
keywords:
  [
    "Stablecoin Payments API",
    "real-time stablecoin transfers",
    "USDT API",
    "USDC API",
    "crypto compliance API",
    "multi-chain payments",
    "Bitquery API",
  ]
---

# Stablecoin Payments API

Stablecoins are becoming the backbone of **cross-border payments**, offering faster, cheaper, and more reliable transactions compared to traditional rails.

## Benefits of Stablecoin Payments

- **Instant Settlement** – no waiting days for clearing.
- **Lower Fees** – fewer intermediaries and reduced transaction costs.
- **Transparency** – payments are traceable in real time.
- **Liquidity & Automation** – smoother treasury management and payment flows.

High-speed networks like **Solana** and **Layer 2 chains (Arbitrum, Base)** make stablecoin payments even faster, cheaper, and more user-friendly.

## Challenges in Stablecoin Payments

Despite their advantages, stablecoin systems face critical challenges:

- **Global Scalability** – infrastructure must handle millions of transactions reliably.
- **Regulatory Compliance** – AML/KYC, fraud detection, and monitoring are mandatory.
- **Real-Time Visibility** – merchants need instant confirmation of payments.
- **Multi-Chain Complexity** – interoperability across multiple blockchains is essential.

## How Bitquery Powers Stablecoin Payments

Bitquery provides **data infrastructure** that makes stablecoin payments practical and scalable:

- **Real-Time Payment Detection**  
  Instantly identify incoming stablecoin transfers as they hit the blockchain.

- **Mempool Visibility**  
  See payments before they are confirmed, improving speed and user experience.

- **Multi-Chain Support**  
  Expand payments to multiple blockchains without rebuilding infrastructure.

- **Scalable APIs & Streams**  
  Serve thousands of merchants with reliable, production-grade infrastructure.

**👉 Bitquery’s Stablecoin APIs & Streams** deliver comprehensive real-time stablecoin transfer data.

## Stablecoin Payment API Examples

### 1. Listening to All USDT and USDC Payments on Solana

This GraphQL stream provides **live USDT and USDC stablecoin transfers** on Solana:  
🔗 [Stream Example](https://ide.bitquery.io/USDT-and-USDC-token-Transfers-stream-on-solana)  
🔗 [API Example](https://ide.bitquery.io/USDT-and-USDC-token-Transfers-api-on-solana)

```graphql
subscription {
  Solana {
    Transfers(
      where: {
        Transfer: {
          Currency: {
            MintAddress: {
              in: [
                "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
                "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
              ]
            }
          }
        }
      }
    ) {
      Transfer {
        Amount
        AmountInUSD
        Sender {
          Address
          Owner
        }
        Receiver {
          Address
          Owner
        }
        Currency {
          Symbol
          Name
          MintAddress
        }
      }
      Instruction {
        Program {
          Method
        }
      }
      Block {
        Time
        Height
        Slot
      }
      Transaction {
        Signature
        Signer
        Fee
        FeeInUSD
        FeePayer
      }
    }
  }
}
```

### 2. Multi-Chain Stablecoin Transfers

You can listen to **stablecoin transfers across various blockchains**:

| Blockchain | API | Stream | Mempool |
|------------|-----|--------|---------|
| **Tron** | [API](https://ide.bitquery.io/Latest-Tron-USDT-Transfers) | [Stream](https://ide.bitquery.io/Latest-Tron-USDT-Transfers-stream) | [Mempool](https://ide.bitquery.io/Latest-Tron-USDT-Transfers-stream-in-Mempool) |
| **Ethereum** | [API](https://ide.bitquery.io/Latest-USDTUSDC-Transfer-api-on-ethereum) | [Stream](https://ide.bitquery.io/Latest-USDTUSDC-Transfer-stream-on-ethereum) | [Mempool](https://ide.bitquery.io/Latest-USDTUSDC-Transfer-stream-on-ethereum-in-Mempool) |
| **BSC** | [API](https://ide.bitquery.io/Latest-USDTUSDC-Transfer-api-on-BSC_2) | [Stream](https://ide.bitquery.io/Latest-USDTUSDC-Transfer-Stream-on-BSC) | [Mempool](https://ide.bitquery.io/Latest-USDTUSDC-Transfer-Stream-on-BSC-on-Mempool) |
| **Base** | [API](https://ide.bitquery.io/Latest-USDTUSDC-Transfer-api-on-base) | [Stream](https://ide.bitquery.io/Latest-USDTUSDC-Transfer-stream-on-base) | Not Available |

We simulate transaction on top of current block to provide Mempool simulated Transactions.

### 3. Listening to USDT payments on Tron (stream)

This subscription streams **USDT** (`TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`) transfers on **Tron**.  
🔗 [Stream Example](https://ide.bitquery.io/Listening-to-All-USDT-and-USDC-Payments-on-Solana---stream)

```graphql
subscription {
  Tron(network: tron) {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"}}}}
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
      }
    }
  }
}
```

### 4. Listening to stablecoin transfers for specific addresses on Tron (stream)

Listen to **USDT** sent or received by address `TUTQj7VJ1QjR3t2GJByvrP25yZNFcj38VJ`.  
🔗 [Stream Example](https://ide.bitquery.io/Listening-to-stablecoin-Transfers-for-Specific-Addresse-on-tron)

```graphql
subscription {
  Tron {
    Transfers(
      where: {any: [{Transfer: {Sender: {is: "TUTQj7VJ1QjR3t2GJByvrP25yZNFcj38VJ"}}}, {Transfer: {Receiver: {is: "TUTQj7VJ1QjR3t2GJByvrP25yZNFcj38VJ"}}}], Transfer: {Currency: {SmartContract: {is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"}}}}
    ) {
      Transaction {
        Hash
      }
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
      }
    }
  }
}
```

### 5. Listening to Transfers for Specific Addresses (BSC Example)

🔗 [Example Query](https://ide.bitquery.io/USDT-and-USDC-transfers-on-bnb-chain)

```graphql
subscription {
  EVM(network: bsc) {
    Transfers(
      where: {
        Transfer: {
          Receiver: { in: ["0x443fa7bbf35c09ee0ebb5e15f1ea3f0704b89d04"] }
          Currency: {
            SmartContract: {
              in: [
                "0x55d398326f99059ff775485246999027b3197955"
                "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d"
              ]
            }
          }
        }
      }
    ) {
      Block {
        Time
        Number
      }
      Transfer {
        Sender
        Receiver
        Amount
        AmountInUSD
        Currency {
          Name
          Symbol
          SmartContract
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

### 6. Compliance & Risk Checks

For **AML/KYC and risk monitoring**, you can analyze payment addresses.  
🔗 [Example API](https://ide.bitquery.io/stats-for-an-adddress)

```graphql
{
  EVM(dataset: archive, network: eth) {
    TokenHolders(
      date: "2025-08-25"
      tokenSmartContract: "0xdac17f958d2ee523a2206206994597c13d831ec7"
      where: {
        Holder: {
          Address: { is: "0x72187db55473b693ded367983212fe2db3768829" }
        }
      }
    ) {
      Holder {
        Address
      }
      BalanceUpdate {
        InCount
        OutCount
        Count
        InAmount
        OutAmount
        FirstDate
        LastDate
      }
      Balance {
        Amount
      }
    }
  }
}
```

## Stablecoin Analytics with Bitquery APIs

### 1. First-Time Stablecoin Receivers

Identify addresses receiving stablecoins for the **first time**.  
🔗 [Query Example](https://ide.bitquery.io/first-time-UDST-received-by-addresses-on-a-given-date)

```graphql
{
  EVM(dataset: archive, network: eth) {
    TokenHolders(
      limit: { count: 1000 }
      date: "2025-08-25"
      tokenSmartContract: "0xdac17f958d2ee523a2206206994597c13d831ec7"
      where: { BalanceUpdate: { FirstDate: { is: "2025-08-25" } } }
    ) {
      Holder {
        Address
      }
    }
  }
}
```

### 2. Last-Time Stablecoin Receivers

Identify addresses that **last received USDT** on a specific date.  
🔗 [Query Example](https://ide.bitquery.io/Address-which-received-USDT-on-a-given-date-last-time)

```graphql
{
  EVM(dataset: archive, network: eth) {
    TokenHolders(
      orderBy: { descending: Balance_Amount }
      limit: { count: 1000 }
      date: "2025-08-25"
      tokenSmartContract: "0xdac17f958d2ee523a2206206994597c13d831ec7"
      where: { BalanceUpdate: { LastDate: { is: "2021-01-01" } } }
    ) {
      Holder {
        Address
      }
      BalanceUpdate {
        FirstDate
        LastDate
      }
      Balance {
        Amount
      }
    }
  }
}
```

### 3. Top Stablecoin Holders

Find **top holders of USDT on Ethereum**, including inflows, outflows, and activity history.  
🔗 [Query Example](https://ide.bitquery.io/Top-holders-of-usdt-on-specific-date)

```graphql
{
  EVM(dataset: archive, network: eth) {
    TokenHolders(
      orderBy: [{ descending: Balance_Amount }]
      limit: { count: 100 }
      date: "2025-08-25"
      tokenSmartContract: "0xdac17f958d2ee523a2206206994597c13d831ec7"
    ) {
      Holder {
        Address
      }
      BalanceUpdate {
        InCount
        OutCount
        Count
        InAmount
        OutAmount
        FirstDate
        LastDate
      }
      Balance {
        Amount
      }
    }
  }
}
```

## Why Use Bitquery for Stablecoin Payments?

- **Real-time streams (WebSocket & Kafka)** for instant detection.
- **Webhook support** to integrate with your payment systems.
- **Compliance-focused APIs** for AML/KYC and risk analysis.
- **Multi-chain coverage** across Solana, Ethereum, Tron, BSC, Base, Arbitrum, and more.

Bitquery enables **faster, compliant, and scalable stablecoin payment solutions** for businesses, fintechs, and governments.
