# Tron Transfers API

In this section we'll have a look at some examples using the Tron Transfers API.

This Tron API is part of our Early Access Program (EAP), which is intended for evaluation purposes.

This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

<head>
<meta name="title" content="Tron Transfers API"/>
<meta name="description" content="Get all historical & realtime transfers details for an address or a contract, capturing internal transfers, external transfers and token transfers."/>
<meta name="keywords" content="Tron transfers api, Tron transfers python api, Tron transfers scan api, Tron transfers api docs, transfers crypto api, transfers blockchain api, Tron network api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Tron Transfers API"
/>
<meta
  property="og:description"
  content="Get all historical & realtime transfers for an address or a contract, capturing internal transfers, external transfers and token transfers."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Tron Transfers API" />
<meta property="twitter:description" content="Get all historical & realtime transfers for an address or a contract, capturing internal transfers, external transfers and token transfers." />
</head>

# Subscribe to Recent Whale Transactions of a particular currency

The subscription query below fetches the whale transactions on the Tron network. We have used USDT address `TThzxNRLrW2Brp9DcTQU8i4Wd9udCWEdZ3`. You can find the query [here](https://ide.bitquery.io/Whale-transfers-of-USDT-on-Tron)

```
subscription{
  Tron {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "TThzxNRLrW2Brp9DcTQU8i4Wd9udCWEdZ3"}}, Amount: {ge: "10000"}}}
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
      }
    }
  }
}


```

# Sender is a particular address

This websocket retrieves transfers where the sender is a particular address `TDqSquXBgUCLYvYC4XZgrprLK589dkhSCf`. For this subscription query we use `where` keyword and in that we specify `{Transfer: {Sender: {is: "TDqSquXBgUCLYvYC4XZgrprLK589dkhSCf"}}}` to get the desired data. You can find the query [here](https://ide.bitquery.io/Sender-is-particular-address)

```
subscription {
   Tron {
    Transfers(
      where: {Transfer: {Sender: {is: "TDqSquXBgUCLYvYC4XZgrprLK589dkhSCf"}}}
    ) {
      Transfer {
        Amount
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

# Subscribe to the latest NFT token transfers on Tron

Let's see an example of NFT token transfers using GraphQL Subscription (Webhook). In the following NFT Token Transfers API, we will be subscribing to all NFT token transfers on Tron network. You can run the query [here](https://ide.bitquery.io/NFT-Token-Transfers-API_5)

```
subscription {
  Tron {
    Transfers(where: {Transfer: {Currency: {Fungible: false}}}) {
      Transfer {
        Amount
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
