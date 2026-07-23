---
title: "BSC Transfers API"
description: "Bitquery blockchain API docs: BSC Transfers API."
---

# BSC Transfers API

In this section we'll have a look at some examples using the BSC Transfers API.

<head>
<meta name="title" content="BSC Transfers API"/>
<meta name="description" content="Get all historical & realtime transfers details for an address or a contract, capturing internal transfers, external transfers and token transfers."/>
<meta name="keywords" content="BSC transfers api, BSC transfers python api, BSC transfers scan api, BSC transfers api docs, transfers crypto api, transfers blockchain api, BSC network api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="BSC Transfers API"
/>
<meta
  property="og:description"
  content="Get all historical & realtime transfers for an address or a contract, capturing internal transfers, external transfers and token transfers."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="BSC Transfers API" />
<meta property="twitter:description" content="Get all historical & realtime transfers for an address or a contract, capturing internal transfers, external transfers and token transfers." />
</head>

## Subscribe to Recent Whale Transactions of a particular currency

The subscription query below fetches the whale transactions on the BSC network. We have used WBNB address `0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c`. You can find the query [here](https://ide.bitquery.io/Whale-transfers-of-USDC-on-BSC)

```
subscription{
  EVM(network: bsc) {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"}}, Amount: {ge: "10000"}}}
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

## Sender is a particular address

This websocket retrieves transfers where the sender is a particular address `0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c`. For this subscription query we use `where` keyword and in that we specify `{Transfer: {Sender: {is: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"}}}` to get the desired data. You can find the query [here](https://ide.bitquery.io/Transfers-where-sender-is-a-particular-address)

```
subscription {
  EVM(network: bsc) {
    Transfers(
      where: {Transfer: {Sender: {is: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"}}}
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

## Transactions From/To An Address with Transfer Details

[Run Query](https://ide.bitquery.io/Sender-OR-Receiver-Transfer-Example-BSC)

```
query MyQuery {
  EVM(dataset: archive, network: bsc) {
    Transfers(
      where: {any: [{Transaction: {From: {is: "0x2b9dfb290ad7b54a5b86da25c3a629bfc7152167"}}}, {Transaction: {To: {is: "0x2b9dfb290ad7b54a5b86da25c3a629bfc7152167"}}}], Transfer: {}, Block: {Date: {since: "2025-08-10", till: "2025-08-29"}}}
      limit: {count: 10000}
      orderBy: {descending: Block_Time}
    ) {
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Currency {
          Symbol
          Name
        }
        Index
      }
      Transaction {
        Hash
      }
      Block {
        Number
        Time
      }
    }
  }
}

```

## Subscribe to the latest NFT token transfers on BSC

Let's see an example of NFT token transfers using GraphQL Subscription (Webhook). In the following NFT Token Transfers API, we will be subscribing to all NFT token transfers on BSC network. You can run the query [here](https://ide.bitquery.io/Track-realtime-NFT-Transfers-on-BSC-chain)

```
subscription {
  EVM(network: bsc) {
    Transfers(
      where: {
        Transfer: {
          Currency: {
            Fungible: false
          }
        }
      }
    ) {
      Block {
        Hash
        Number
      }
      Transfer {
        Amount
        Currency {
          Name
          SmartContract
          Symbol
          Native
        }
        Sender
        Receiver
      }
    }
  }
}


```

## Check if an address ever interacted with predict.fun (USDT → protocol receivers)

Predict.fun flows on BSC often show up as USDT (`0x55d398326f99059fF775485246999027B3197955`) transfers **from** the user's wallet **to** one of the protocol contract addresses listed below. `limit: { count: 1 }` is enough for a historic “has this wallet interacted?” probe.

**Try it:** [IDE — predict.fun interaction check](https://ide.bitquery.io/check-if-an-address-interacted-with-predictfun-ever)

```graphql
query ($address: String) {
  EVM(dataset: realtime, network: bsc) {
    Transfers(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        Transfer: {
          Currency: {
            SmartContract: { is: "0x55d398326f99059ff775485246999027b3197955" }
          }
          Sender: { is: $address }
          Receiver: {
            in: [
              "0x8BC070BEdAB741406F4B1Eb65A72bee27894B689"
              "0x6bEb5a40C032AFc305961162d8204CDA16DECFa5"
              "0x365fb81bd4A24D6303cd2F19c349dE6894D8d58A"
              "0x8A289d458f5a134bA40015085a8F50Ffb681B41d"
              "0xF1f8F5C641F20C48526269EF7DFF19172Efa9783"
              "0xFbC2259aBB3F01c019ECE1d0200Ee673BB7BA34F"
              "0xF2311C668aAA8dEc48D5da577d3018eb94b3132F"
              "0xD172f3FBabe763Ee8E52D8b32421574236dA6057"
            ]
          }
        }
      }
    ) {
      Block {
        Time
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
  "address": "0x75b976434245E1Fc037f9c7645C5aCdDdA6b00A4"
}
```

## Deterministic Pagination for Backfilling Transfers

When backfilling BSC transfer data or building a historical index, use deterministic pagination to guarantee no records are missed or duplicated.

**Try it live:** [Deterministic Transfer API](https://ide.bitquery.io/Reliable-transfer-api)

```graphql
{
  EVM(dataset: combined, network: bsc) {
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

## Why does my wallet inflow/outflow query miss some transactions on BSC? {#why-does-my-wallet-inflowoutflow-query-miss-some-transactions-on-bsc}

Bitquery indexes all transactions from the blockchain. If you're missing inflow/outflow records in your query, first verify you're using the correct dataset—either `realtime` or `combined`—based on your needs. If your query still appears to miss transactions, please report the issue to the Bitquery team via [Telegram](https://t.me/bloxy_info).