# Tron Transactions API

In this section we'll have a look at some examples using the Tron Transactions API.

<head>
<meta name="title" content="Tron Transactions API"/>
<meta name="description" content="Retrieve comprehensive details of historical and realtime Tron transactions, including internal transactions, external transactions, and token transfers for any address or contract."/>
<meta name="keywords" content="Tron transactions api, Tron transactions python api, Tron transactions scan api, Tron transactions api docs, transactions crypto api, transactions blockchain api, Tron network api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Tron Transactions API"
/>
<meta
  property="og:description"
  content="Retrieve comprehensive details of historical and realtime Tron transactions, including internal transactions, external transactions, and token transfers for any address or contract."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Tron Transactions API" />
<meta property="twitter:description" content="Retrieve comprehensive details of historical and realtime Tron transactions, including internal transactions, external transactions, and token transfers for any address or contract." />
</head>

## Monitor Real-time Transactions by Wallet

The subscription query below fetches the transactions on the Tron network for the wallet address `TDqSquXBgUCLYvYC4XZgrprLK589dkhSCf`.

```
subscription {
  Tron {
    Transactions(
      where: {Transaction: {FeePayer: {is: "TDqSquXBgUCLYvYC4XZgrprLK589dkhSCf"}}}
    ) {
      Block {
        Hash
        Time
        Number
      }
      Contract {
        Address
      }
      ChainId
      Transaction {
        Fee
        Hash
        FeePayer
        Signatures
        Result {
          Success
          Status
          Message
        }
        Time
      }
    }
  }
}

```

You can run the query [here](https://ide.bitquery.io/monitor-TRX-address-transactions)
