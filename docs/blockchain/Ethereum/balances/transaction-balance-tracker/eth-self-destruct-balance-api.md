---
sidebar_position: 5
---

# Ethereum Self-Destruct Balance Tracker

The Ethereum Self-Destruct Balance Tracker API provides real-time balance updates for contracts that self-destruct and addresses that receive funds from self-destructed contracts. This API helps you monitor contract destruction events, track ephemeral contracts (like MEV bots), and analyze security incidents.

<head>
<meta name="title" content="Ethereum Self-Destruct Balance Tracker API & Streams"/>
<meta name="description" content="Learn how to track Ethereum contract self-destruct events, ephemeral contracts, and security incidents using Bitquery's Self-Destruct Balance Tracker API."/>
<meta name="keywords" content="ethereum self-destruct, selfdestruct balance api, contract destruction tracker, ephemeral contracts, mev self-destruct, parity multisig, contract kill tracker, ethereum balance api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Ethereum Self-Destruct Balance Tracker API & Streams"
/>
<meta
  property="og:description"
  content="Learn how to track Ethereum contract self-destruct events, ephemeral contracts, and security incidents using Bitquery's Self-Destruct Balance Tracker API."
/>

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Ethereum Self-Destruct Balance Tracker API & Streams" />
<meta property="twitter:description" content="Learn how to track Ethereum contract self-destruct events, ephemeral contracts, and security incidents using Bitquery's Self-Destruct Balance Tracker API." />
</head>

## What is Self-Destruct?

The `selfdestruct` opcode allows a smart contract to permanently remove its bytecode from the blockchain and send its remaining ETH balance to a specified recipient address. Once a contract self-destructs, it can no longer execute code or receive transactions.

### Common Use Cases

- **MEV Builder Payments**: Ephemeral contracts created to pay MEV builders/block builders (e.g., `quasarbuilder.eth`) as part of the Proposer-Builder Separation (PBS) infrastructure, then immediately self-destructed
- **Ephemeral MEV/Arbitrage Executors**: Contracts created and destroyed within the same transaction to execute atomic profit extraction
- **Security Incidents**: Malicious actors destroying contracts
- **Emergency Shutdowns**: Contract owners destroying contracts to reclaim funds or retire functionality
- **Upgrade Patterns**: Destroying old contract versions during upgrades
- **Paymasters/Relayers**: Short-lived helper contracts that clean up after sponsoring gas

## Balance Change Reason Codes

The API tracks self-destruct events using specific balance change reason codes:

- **Code 12**: `BalanceIncreaseSelfdestruct` - Balance added to the recipient as indicated by a self-destructing account
- **Code 13**: `BalanceDecreaseSelfdestruct` - Balance deducted from a contract due to self-destruct
- **Code 14**: `BalanceDecreaseSelfdestructBurn` - ETH sent to an already self-destructed account within the same transaction

## Track All Self-Destruct Event Balances

Monitor all contract self-destruct event balances in real-time using this GraphQL subscription. [Run Stream](https://ide.bitquery.io/All-Self-Destruct-Event-Balances-Stream)

You can also run this as a query by replacing the word `subscription` with `query`

```graphql
subscription {
  EVM(network: eth) {
    TransactionBalances(
      where: { TokenBalance: { BalanceChangeReasonCode: { in: [12, 13, 14] } } }
    ) {
      Block {
        Time
        Number
      }
      TokenBalance {
        Currency {
          Symbol
        }
        PreBalance
        PostBalance
        Address
        BalanceChangeReasonCode
        PostBalanceInUSD
      }
      Transaction {
        Hash
      }
    }
  }
}
```

## Track Contract Self-Destruct Balance Decrease

Monitor contract balance decrease when contracts are self-destructing.
[Run Query](https://ide.bitquery.io/Self-Destruct-Balance-Decrease-API)

```graphql
{
  EVM(network: eth) {
    TransactionBalances(
      where: { TokenBalance: { BalanceChangeReasonCode: { eq: 13 } } }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
        Number
      }
      TokenBalance {
        Currency {
          Symbol
          SmartContract
        }
        PreBalance
        PostBalance
        Address
        BalanceChangeReasonCode
        PostBalanceInUSD
      }
      Transaction {
        Hash
      }
    }
  }
}
```

## Track Recipients of Self-Destructed Fund Balances

Monitor contract balance increase when contracts are self-destructing.
[Run query](https://ide.bitquery.io/Self-Destruct-Balance-Increase-API)

```graphql
{
  EVM(network: eth) {
    TransactionBalances(
      where: { TokenBalance: { BalanceChangeReasonCode: { eq: 12 } } }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
        Number
      }
      TokenBalance {
        Currency {
          Symbol
          SmartContract
        }
        PreBalance
        PostBalance
        Address
        BalanceChangeReasonCode
        PostBalanceInUSD
      }
      Transaction {
        Hash
      }
    }
  }
}
```

## Track Self-Destruct Balance Changes for Specific Address

Monitor self-destruct balance changes for a specific contract address using this GraphQL query:

```graphql
subscription {
  EVM(network: eth) {
    TransactionBalances(
      where: {
        TokenBalance: {
          Address: { is: "0x863DF6BFa4469f3ead0bE8f9F2AAE51c91A907b4" }
          BalanceChangeReasonCode: { in: [12, 13, 14] }
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
          SmartContract
        }
        PreBalance
        PostBalance
        Address
        BalanceChangeReasonCode
        PostBalanceInUSD
      }
      Transaction {
        Hash
      }
    }
  }
}
```

## Track Large Self-Destruct Transaction Balances

Monitor significant self-destruct balance changes (e.g., > $1000 USD) using this subscription:

```graphql
subscription {
  EVM(network: eth) {
    TransactionBalances(
      where: {
        TokenBalance: {
          BalanceChangeReasonCode: { in: [12, 13] }
          PostBalanceInUSD: { gt: "1000" }
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
          SmartContract
        }
        PreBalance
        PostBalance
        Address
        BalanceChangeReasonCode
        PostBalanceInUSD
      }
      Transaction {
        Hash
      }
    }
  }
}
```

## Track Ephemeral MEV Contract Balance Changes

Monitor balance changes for short-lived contracts that are created and destroyed in the same transaction (typical pattern for MEV bots) using this subscription:

```graphql
subscription {
  EVM(network: eth) {
    TransactionBalances(
      where: { TokenBalance: { BalanceChangeReasonCode: { eq: 13 } } }
    ) {
      Block {
        Time
        Number
      }
      TokenBalance {
        Currency {
          Symbol
          SmartContract
        }
        PreBalance
        PostBalance
        Address
        BalanceChangeReasonCode
        PostBalanceInUSD
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

## Aggregate Self-Destruct Statistics

Calculate total ETH destroyed or received from self-destructs using aggregation functions:

```graphql
{
  EVM(dataset: realtime, network: eth) {
    TransactionBalances(
      where: { TokenBalance: { BalanceChangeReasonCode: { in: [12, 13] } } }
    ) {
      TokenBalance {
        Currency {
          Symbol
          SmartContract
        }
      }
      totalDestroyed: sum(of: TokenBalance_PostBalance)
      destructCount: count
    }
  }
}
```

## Self-Destruct Usecase Examples

### 1. MEV Builder Payment (Ephemeral Executor)

A common pattern in the MEV ecosystem involves **ephemeral contracts** that are created to pay MEV builders/block builders, then immediately self-destruct. This pattern is part of the **Proposer-Builder Separation (PBS)** infrastructure.

Contrack Flow: Deploy → Transfer to MEV builder → Self-destruct

**What's happening:**

1. A searcher/bundler deploys a temporary helper contract
2. The contract holds the exact ETH amount owed as a fee/bribe to the MEV builder
3. The contract transfers ETH to the builder
4. The contract immediately self-destructs, cleaning up and leaving minimal trace

**Why this pattern:**

- **Ephemeral by design** - avoids leaving identifiable payment trails per bundle
- **Safety** - one-use contract prevents reuse or exploitation
- **Gas efficiency** - minimal runtime deployment is cheaper than maintaining reusable state
- **Privacy** - prevents tracking of bundle logic across blocks

**API Subscription: Track payments to known MEV builders:**

```graphql
subscription {
  EVM(network: eth) {
    TransactionBalances(
      where: {
        TokenBalance: {
          BalanceChangeReasonCode: { eq: 12 }
          Address: {
            in: [
              "0x396343362be2A4dA1cE0C1C210945346fb82Aa49"
              # Add other known MEV builder addresses
            ]
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
        }
        PreBalance
        PostBalance
        Address
        BalanceChangeReasonCode
        PostBalanceInUSD
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

### 3. Ephemeral MEV/Arbitrage Contracts

Many MEV bots and arbitrage executors create contracts that are destroyed within the same transaction. These short-lived contracts are used for:

- Atomic multi-swap execution
- Flash loan arbitrage
- Obfuscation of execution patterns
- Cleanup of bytecode footprint

**API Query: Track recent ephemeral contract patterns:**

```graphql
{
  EVM(dataset: archive, network: eth) {
    TransactionBalances(
      where: {
        TokenBalance: { BalanceChangeReasonCode: { eq: 13 } }
      }
      limit: { count: 100 }
      orderBy: { descendingByField: "Block_Time" }
    ) {
      Block {
        Time
        Number
      }
      TokenBalance {
        Currency {
          Symbol
        }
        PreBalance
        PostBalance
        Address
        BalanceChangeReasonCode
        PostBalanceInUSD
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

## API Use Cases

### Security Monitoring - Track Malicious Self-Destructs

Track self-destruct events to identify potential security incidents or malicious contract destruction:

```graphql
subscription {
  EVM(network: eth) {
    TransactionBalances(
      where: {
        TokenBalance: {
          BalanceChangeReasonCode: { eq: 13 }
          PostBalanceInUSD: { gt: "10000" }
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
        }
        PreBalance
        PostBalance
        Address
        BalanceChangeReasonCode
        PostBalanceInUSD
      }
      Transaction {
        Hash
        From
      }
    }
  }
}
```

## Notes

- **Balance Change Reason Codes 12, 13, and 14** are only available for native currency (ETH) transactions, not for fungible tokens or NFTs
- Code 12 indicates funds **received** from a self-destructed contract
- Code 13 indicates funds **destroyed** from a self-destructing contract
- Code 14 indicates ETH sent to an already self-destructed account within the same transaction
- Self-destructed contracts cannot be recovered or interacted with after destruction
- The `PreBalance` field shows the balance before the self-destruct, and `PostBalance` shows the balance after (typically 0 for the destroyed contract)
