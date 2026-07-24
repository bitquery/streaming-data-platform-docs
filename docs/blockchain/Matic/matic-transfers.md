---
title: "Polygon (MATIC) Transfers API"
description: "Polygon (MATIC) Transfers API: monitor Polygon native and token transfers in real time with Bitquery GraphQL APIs. Works with WebSocket live subscriptions."
---
# Polygon (MATIC) Transfers API

In this section we'll have a look at some examples using the Polygon (MATIC) Transfers API.

# Subscribe to Recent Whale Transactions of a particular currency

The subscription query below fetches the whale transactions on the MATIC network. We have used USDC address `0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359`. You can find the query [here](https://ide.bitquery.io/Whale-transfers-of-USDC-on-matic)

```graphql
subscription{
  EVM(network: matic) {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"}}, Amount: {ge: "10000"}}}
    ) {
      Transaction {
        From
        Hash
      }
      Transfer {
        Amount
        Sender
        Receiver
        Currency {
          SmartContract
          Symbol
          Name
          Fungible
          Native
        }
        Id
      }
    }
  }
}

```

# Sender is a particular address

This websocket retrieves transfers where the sender is a particular address `0x1A8f43e01B78979EB4Ef7feBEC60F32c9A72f58E`. For this subscription query we use `where` keyword and in that we specify `{Transfer: {Sender: {is: "0x1A8f43e01B78979EB4Ef7feBEC60F32c9A72f58E"}}}` to get the desired data. You can find the query [here](https://ide.bitquery.io/Sender-is-a-particular-address_2)

```graphql
subscription {
  EVM(network: matic) {
    Transfers(
      where: {Transfer: {Sender: {is: "0x1A8f43e01B78979EB4Ef7feBEC60F32c9A72f58E"}}}
    ) {
      Transfer {
        Amount
        AmountInUSD
        Currency {
          Name
          SmartContract
          Native
          Symbol
          Fungible
        }
        Receiver
        Sender
      }
      Transaction {
        Hash
      }
    }
  }
}

```

# Subscribe to the latest NFT token transfers on Polygon (MATIC)

Let's see an example of NFT token transfers using GraphQL Subscription (Webhook). In the following NFT Token Transfers API, we will be subscribing to all NFT token transfers on Polygon (MATIC) network. You can run the query [here](https://ide.bitquery.io/NFT-Token-Transfers-API_3)

```graphql
subscription {
  EVM(network: matic) {
    Transfers(where: {Transfer: {Currency: {Fungible: false}}}) {
      Transfer {
        Amount
        AmountInUSD
        Currency {
          Name
          SmartContract
          Symbol
          Fungible
          HasURI
          Decimals
        }
        URI
        Sender
        Receiver
      }
      Transaction {
        Hash
      }
    }
  }
}

```

# Check if an address ever interacted with Polymarket (CTF collateral transfer)

Polymarket on Polygon routes outcome collateral through the **conditional tokens** USDC denomination at `0x4d97dCd97eC945f40cF65F87097ACe5EA0476045`. A lightweight check for **any historic interaction** is: has this wallet **received** at least one transfer of that token? (`limit: { count: 1 }` — empty result means no matching receipt found in the indexed data.)

This is cheaper than scanning all `PredictionTrades` when you only need a yes/no signal. Narrow the pattern (e.g. also filter by counterparties) if you need stronger guarantees.

**Try it:** [IDE — Polymarket interaction check](https://ide.bitquery.io/check-if-an-address-interacted-with-polymarket-ever)

```graphql
query ($address: String) {
  EVM(dataset: combined, network: matic) {
    Transfers(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        Transfer: {
          Currency: {
            SmartContract: { is: "0x4d97DCd97eC945f40cF65F87097ACe5EA0476045" }
          }
          Receiver: { is: $address }
        }
      }
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
      }
      Transfer {
        Sender
        Receiver
        Amount
      }
    }
  }
}
```

**Variables:**

```json
{
  "address": "0x0c79f21ec570f5cc0d52d1bc640845faef430ad2"
}
```

## Deterministic Pagination for Backfilling Transfers

When backfilling Polygon transfer data or building a historical index, use deterministic pagination to guarantee no records are missed or duplicated.

**Try it live:** [Deterministic Transfer API](https://ide.bitquery.io/Reliable-transfer-api)

```graphql
{
  EVM(dataset: combined, network: matic) {
    Transfers(
      where: { Transfer: { Success: true } }
      orderBy: {
        ascending: [
          Block_Number,
          Transaction_Index,
          Call_Index,
          Log_Index,
          Transfer_Index,
          Transfer_Type
        ]
      }
      limit: { count: 10, offset: 0 }
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
        From
        Index
      }
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Index
        Currency {
          Symbol
          Name
          SmartContract
          Decimals
          Native
        }
      }
      Call {
        Index
      }
      Log {
        LogAfterCallIndex
        Index
      }
      Transfer {
        Type
      }
    }
  }
}
```

The composite `orderBy` across `Block_Number`, `Transaction_Index`, `Call_Index`, `Log_Index`, `Transfer_Index`, and `Transfer_Type` uniquely positions every transfer, making offset-based pagination safe for backfilling. Increment `offset` by the `count` value on each request. You can pull up to **25,000 records in a single request** by setting `count: 25000`.
