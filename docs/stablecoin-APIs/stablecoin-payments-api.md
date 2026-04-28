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

Bitquery's Stablecoin Payments API exposes real-time and historical payment flows for USDT, USDC, FDUSD, EURC, DAI, TUSD, USDS, USD1, USDD and other major stablecoins across Solana, Ethereum, Tron, BSC, Base, Arbitrum, Polygon and more — through a single GraphQL endpoint. This page focuses on payment-oriented use cases (incoming/outgoing transfers, merchant detection, address monitoring, AML/compliance). For related capabilities, see the [Stablecoin Transfers API](https://docs.bitquery.io/docs/stablecoin-APIs/stablecoin-transfers-api), [Stablecoin Balance API](https://docs.bitquery.io/docs/stablecoin-APIs/stablecoin-balance-api), [Stablecoin Trades API](https://docs.bitquery.io/docs/stablecoin-APIs/stablecoin-trades-api), [Stablecoin Reserve API](https://docs.bitquery.io/docs/stablecoin-APIs/stablecoin-reserve-api) and [Stablecoin Price API](https://docs.bitquery.io/docs/stablecoin-APIs/stablecoin-price-api).

All examples below are runnable in the [Bitquery IDE](https://ide.bitquery.io). Streams are delivered over WebSocket / Kafka subscriptions; historical queries use the same schema over HTTP. For pre-built stablecoin dashboards (top tokens, flows, market activity), browse the [DEXrabbit Stablecoins dashboard](https://dexrabbit.bitquery.io/categories/stablecoins).

## Stablecoin Payment API Examples

### 1. Listening to All USDT and USDC Payments on Solana

This GraphQL stream provides **live USDT and USDC stablecoin transfers** on Solana.

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

### 2. Multi-Chain Stablecoin Payments

Listen to **stablecoin payments across all major blockchains**. The Mempool option lets you detect a payment *before* it is confirmed — useful for instant merchant UX.

| Blockchain | API | Stream | Mempool |
|------------|-----|--------|---------|
| **Tron** | [API](https://ide.bitquery.io/Latest-Tron-USDT-Transfers) | [Stream](https://ide.bitquery.io/Latest-Tron-USDT-Transfers-stream) | [Mempool](https://ide.bitquery.io/Latest-Tron-USDT-Transfers-stream-in-Mempool) |
| **Ethereum** | [API](https://ide.bitquery.io/Latest-USDTUSDC-Transfer-api-on-ethereum) | [Stream](https://ide.bitquery.io/Latest-USDTUSDC-Transfer-stream-on-ethereum) | [Mempool](https://ide.bitquery.io/Latest-USDTUSDC-Transfer-stream-on-ethereum-in-Mempool) |
| **BSC** | [API](https://ide.bitquery.io/Latest-USDTUSDC-Transfer-api-on-BSC_2) | [Stream](https://ide.bitquery.io/Latest-USDTUSDC-Transfer-Stream-on-BSC) | [Mempool](https://ide.bitquery.io/Latest-USDTUSDC-Transfer-Stream-on-BSC-on-Mempool) |
| **Base** | [API](https://ide.bitquery.io/Latest-USDTUSDC-Transfer-api-on-base) | [Stream](https://ide.bitquery.io/Latest-USDTUSDC-Transfer-stream-on-base) | Not Available |

Mempool feeds are produced by simulating transactions on top of the current block.

### 3. Listening to USDT Payments on Tron (stream)

This subscription streams **USDT** (`TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`) transfers on **Tron** — the highest-volume stablecoin payments network globally.

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

### 4. Stablecoin Payments For a Specific Address (Tron)

Listen to **USDT** sent or received by address `TUTQj7VJ1QjR3t2GJByvrP25yZNFcj38VJ`. This is the canonical "merchant/treasury wallet monitor" pattern — fan-out one subscription per wallet and route hits to your payments backend.

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

For the equivalent on Solana, see the [Stablecoin Transfers API → Stablecoin received and sent by an address](https://docs.bitquery.io/docs/stablecoin-APIs/stablecoin-transfers-api#stablecoin-recieved-and-sent-by-an-address).

### 5. Stablecoin Payments For a Specific Address (BSC)

Filter incoming **USDT and USDC** payments to a single BSC receiver across both stablecoin contracts in one subscription.

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

### 6. Stablecoin Payments Stream on Ethereum

A single-contract USDC payments stream on Ethereum mainnet. Swap the `SmartContract` for `0xdAC17F958D2ee523a2206206994597C13D831ec7` to get USDT, or extend with an `in: [...]` list to multiplex stablecoins.

🔗 [Stream Example](https://ide.bitquery.io/Stablecoin-Realtime-Payments-Stream-on-Eth-Mainnet)

```graphql
subscription {
  EVM(network: eth) {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"}}}}
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

For the full transfer schema (mint/burn detection, `Type`, dataset selection), see the [Stablecoin Transfers API](https://docs.bitquery.io/docs/stablecoin-APIs/stablecoin-transfers-api).

## Compliance & Risk Checks

For **AML/KYC and risk monitoring**, you can analyze a payment counterparty's full lifecycle on the asset — first/last activity dates, in/out counts, and current balance — in a single query.

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

To verify the live balance of a payer/payee on any chain, see the [Stablecoin Balance API](https://docs.bitquery.io/docs/stablecoin-APIs/stablecoin-balance-api) (Solana, Ethereum and Tron examples included).

### Confirming the Sender's Solvency Before Settlement

Before releasing goods or off-ramping a stablecoin payment, you may want to verify the sender actually held the asset at the moment of transfer. Use the [Stablecoin Balance API](https://docs.bitquery.io/docs/stablecoin-APIs/stablecoin-balance-api#stablecoin-balance-of-an-address) to fetch a wallet's current stablecoin balance per chain. For supply-side checks (e.g. confirming an issuer mint backed an inbound payment), use the [Stablecoin Reserve API](https://docs.bitquery.io/docs/stablecoin-APIs/stablecoin-reserve-api).

## Payment Analytics

### 1. First-Time Stablecoin Receivers

Identify addresses receiving stablecoins for the **first time** on a given date — useful for new-customer attribution and onboarding analytics.

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

Identify addresses that **last received USDT** on a specific date — useful for churn detection and dormant-wallet analysis.

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

Find **top holders of USDT on Ethereum**, including inflows, outflows, and full activity history. The [Stablecoin Balance API](https://docs.bitquery.io/docs/stablecoin-APIs/stablecoin-balance-api#get-top-100-holders-of-a-particular-stablecoin) covers the same pattern on Solana.

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

## Pricing Stablecoin Payments Accurately

For high-value or cross-border payments, even a 20–50 bps deviation from the peg materially changes settlement value. Use the [Stablecoin Price API](https://docs.bitquery.io/docs/stablecoin-APIs/stablecoin-price-api) to:

- [Stream the latest price](https://docs.bitquery.io/docs/stablecoin-APIs/stablecoin-price-api#stream-latest-stablecoin-price) of USDT/USDC/DAI/USDS at 1-second intervals.
- [Compare prices across chains](https://docs.bitquery.io/docs/stablecoin-APIs/stablecoin-price-api#check-arbitrage-of-a-stablecoin-across-chains) to mark the payment to its true on-chain rate.
- [Monitor peg health per DEX/market](https://docs.bitquery.io/docs/stablecoin-APIs/stablecoin-price-api#stablecoin-peg-health-api) to catch a depeg before it hits your treasury.

For depeg detection at the trade level (alerting when any trade prints outside `0.95–1.05`), see the [Stablecoin Trades API → Depeg tracking streams](https://docs.bitquery.io/docs/stablecoin-APIs/stablecoin-trades-api#stablecoin-depeg-tracking-stream-for-evm).

## Asset-Specific Guides

For deep-dives on a single asset (price + payments + trades + reserves + balances curated together), see [USDT API](https://docs.bitquery.io/docs/stablecoin-APIs/usdt-api).

## Why Use Bitquery for Stablecoin Payments?

- **Real-time streams (WebSocket & Kafka)** for instant detection.
- **Mempool visibility** on Tron, Ethereum and BSC for pre-confirmation UX.
- **Webhook support** to integrate with your payment systems.
- **Compliance-focused APIs** for AML/KYC and risk analysis.
- **Multi-chain coverage** across Solana, Ethereum, Tron, BSC, Base, Arbitrum, Polygon and more.

Bitquery enables **faster, compliant, and scalable stablecoin payment solutions** for businesses, fintechs, and governments.
