# Tron Mempool API

In this section we'll have a look at some examples using the Tron Mempool API.

<head>
<meta name="title" content="Tron Mempool API - The Ultimate Solution to get your Mempool data"/>
<meta name="description" content="Get Mempool data through our powerful and highly scalabe Mempool API. Access all information about pricing history, Tron Mempool transactions, and Mempool trades."/>
<meta name="keywords" content="Tron Mempool API, Mempool trades API, Mempool api, Mempool pricing history api, Mempool python api, rarible api, opensea api, Mempool api docs, Mempool crypto api,Tron network api, Tron web3 api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Tron Mempool API - The Ultimate Solution to get your Mempool data"
/>
<meta
  property="og:description"
  content="Get Mempool data through our powerful and highly scalabe Mempool API. Access all information about pricing history, Mempool balances, and Mempool trades."
/>
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
