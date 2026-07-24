---
title: "Tron Mempool API"
description: "Tron Mempool API: watch Tron pending transactions before confirmation with Bitquery GraphQL subscriptions. Built for traders and analytics teams."
---
# Tron Mempool API

In this section we'll have a look at some examples using the Tron Mempool API.

## Latest Mempool Transfers

The below subscription provides real-time data on token transfers happening in the TRON mempool including the value of the transferred amount in USD.

You can find the query [here](https://ide.bitquery.io/Tron-mempool-transfers)

```graphql
subscription {
  Tron(mempool: true) {
    Transfers {
      Transfer {
        Sender
        Receiver
        Amount
        AmountInUSD
        Currency {
          Symbol
        }
      }
    }
  }
}

```

## Latest Mempool DEX Trades

The below subscription provides provides real-time data on decentralized exchange (DEX) trades happening in the TRON mempool including details of buyer,seller, protocol information and the amount with USD values.

```graphql
subscription {
  Tron(mempool: true) {
    DEXTrades {
      Block {
        Time
      }
      Trade {
        Dex {
          ProtocolName
          ProtocolFamily
          SmartContract
        }
        Buy {
          Amount
          Buyer
          Seller
          Currency {
            Decimals
            Fungible
            HasURI
            Name
            ProtocolName
            SmartContract
            Symbol
          }
          OrderId
        }
        Sell {
          Buyer
          Seller
          Currency {
            Fungible
            Decimals
            Name
            Native
            SmartContract
            Symbol
          }
        }
      }
    }
  }
}

```

## Latest Mempool Transactions

The below subscription provides data on all transactions happening in the TRON mempool including Witness information.

```graphql
subscription {
  Tron(mempool: true) {
    Transactions {
      Block {
        Time
        Number
        Hash
      }
      Contract {
        Type
        Address
        TypeUrl
      }
      Transaction {
        Hash
        Signatures
        Result {
          Success
        }
      }
      Witness {
        Address
        Signature
        Id
      }
    }
  }
}

```

## Latest NFT Mempool Transfers

The below subscription provides data on non-fungible token (NFT) transfers happening in the TRON mempool.

```graphql
subscription {
  Tron(mempool: true) {
    Transfers(where: {Transfer: {Currency: {Fungible: false}}}) {
      Block {
        Hash
        Number
        Time
      }
      Transfer {
        Amount
        Currency {
          Name
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
