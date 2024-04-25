# Polygon (MATIC) Transfers API

<head>
<meta name="title" content="Polygon (MATIC) Transfers API"/>
<meta name="description" content="Get all historical & realtime transfers details for an address or a contract, capturing internal transfers, external transfers and token transfers."/>
<meta name="keywords" content="Polygon (MATIC) transfers api, Polygon (MATIC) transfers python api, Polygon (MATIC) transfers scan api, Polygon (MATIC) transfers api docs, transfers crypto api, transfers blockchain api, Polygon (MATIC) network api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Polygon (MATIC) Transfers API"
/>
<meta
  property="og:description"
  content="Get all historical & realtime transfers for an address or a contract, capturing internal transfers, external transfers and token transfers."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Polygon (MATIC) Transfers API" />
<meta property="twitter:description" content="Get all historical & realtime transfers for an address or a contract, capturing internal transfers, external transfers and token transfers." />
</head>

In this section we'll have a look at some examples using the Polygon (MATIC) Transfers API.
This Matic API is part of our Early Access Program (EAP), which is intended for evaluation purposes.
This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

# Subscribe to Recent Whale Transactions of a particular currency

The subscription query below fetches the whale transactions on the MATIC network. We have used USDC address `0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359`. You can find the query [here](https://ide.bitquery.io/Whale-transfers-of-USDC-on-matic)

```
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

```
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

```
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
