# Tron Mempool API

**Tron mempool** data is inherently **pre-confirmation and real-time**. These examples use **`Tron(mempool: true)`**. For trial subscriptions can be ran on the [Bitquery IDE](https://ide.bitquery.io), then integrated with systems using **WebSockets**, or at scale with [Kafka](/docs/streams/kafka-streaming-concepts/).

<head>
<meta name="title" content="Tron Mempool API - Real-time pending transactions on Tron"/>
<meta name="description" content="Get Mempool data through our powerful and highly scalabe Mempool API. 
Access all information about pricing history, Tron Mempool transactions, and Mempool trades."/>
<meta name="keywords" content="Real time Tron mempool, Stream Tron mempool, Tron mempool subscription, Tron pending transactions websocket, Tron Mempool API, Mempool trades API, Mempool api, Mempool python api, Mempool api docs, Mempool crypto api, Tron network api, Tron web3 api, Tron Kafka mempool"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Tron Mempool API - Real-time pending transactions on Tron"
/>
<meta
  property="og:description"
  content="Get Mempool data through our powerful and highly scalabe Mempool API. Access all information about pricing history, Mempool balances, and Mempool trades."
/>
<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Tron Mempool API - Real-time pending data" />
<meta property="twitter:description" content="Stream Tron mempool activity—subs, WebSockets, Kafka." />
</head>

## Latest Mempool Transfers

The below subscription provides real-time data on token transfers happening in the TRON mempool including the value of the transferred amount in USD.

You can find the query [here](https://ide.bitquery.io/Tron-mempool-transfers)

```
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

```
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

```
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

```
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
