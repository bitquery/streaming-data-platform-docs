# TRC20 API

In this section we'll have a look at some examples using the TCR20 API.

<head>
<meta name="keywords" content="TRC20 API, TRC20 real-time transfers, USDT TRC20 DEX trades, Tron mempool transfers, Tron balance updates API, Tron balance Python API, Tron blockchain API, Tron network API, Tron web3 API, Bitquery Tron API, TRC20 documentation, Tron crypto API"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta property="og:title" content="How to Get Real-Time TRC20 Information on Tron Network" />
<meta property="og:description" content="Learn how to retrieve historical and real-time USDT data on the Tron network using Bitquery's TRC20 API." />

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="How to Get Real-Time TRC20 Information on Tron Network" />
<meta property="twitter:description" content="Learn how to retrieve real-time USDT Tron information using Bitquery's TRC20 API." />
</head>

## Tether USD (USDT) Transfers in Realtime

To monitor USDT transfers on Tron in real-time, you can use the following query.
You can run the query [here](https://ide.bitquery.io/usdt-trc20-transfers_1)

```

subscription {
  Tron {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"}}}}
    ) {
      Transaction {
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
        AmountInUSD
      }
      Block {
        Number
      }
    }
  }
}

```

## USDT TRC20 DEX Trades in Realtime

This query retrieves real-time data on DEX trades involving USDT on the Tron network. It monitors trades where USDT is the bought currency, identified by the smart contract `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`. The subscription provides details about each trade, including the trade timestamp, protocol details, buyer and seller information, trade amounts, and order IDs.

```
subscription {
  Tron {
    DEXTrades(
      where: {Trade: {Buy: {Currency: {SmartContract: {is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"}}}}}
    ) {
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
          AmountInUSD
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
          AmountInUSD
          Amount
        }
      }
    }
  }
}


```

You can run the query [here](https://ide.bitquery.io/USDT-TRC20-DEX-Trades)

## TRC20 Mempool Transfers

This query retrieves real-time data on USDT transfers in the Tron network's mempool by filtering using the smart contract address `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`. The subscription provides details about each pending transfer, including the transaction hash, transfer amount, sender and receiver addresses, and the anticipated block number.

```
subscription {
  Tron(mempool: true) {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"}}}}
    ) {
      Transaction {
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
        AmountInUSD
      }
      Block {
        Number
      }
    }
  }
}

```
