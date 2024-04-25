# Optimism Transfers API

In this section we'll have a look at some examples using the Optimism Transfers API.

This Optimism API is part of our Early Access Program (EAP), which is intended for evaluation purposes.

This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

<head>
<meta name="title" content="Optimism Transfers API"/>
<meta name="description" content="Get all historical & realtime transfers details for an address or a contract, capturing internal transfers, external transfers and token transfers."/>
<meta name="keywords" content="optimism transfers api, optimism transfers python api, optimism transfers scan api, optimism transfers api docs, transfers crypto api, transfers blockchain api, optimism network api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Optimism Transfers API"
/>
<meta
  property="og:description"
  content="Get all historical & realtime transfers for an address or a contract, capturing internal transfers, external transfers and token transfers."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Optimism Transfers API" />
<meta property="twitter:description" content="Get all historical & realtime transfers for an address or a contract, capturing internal transfers, external transfers and token transfers." />
</head>

# Subscribe to Recent Whale Transactions of a particular currency

The subscription query below fetches the whale transactions on the Optimism network. We have used USDT address `0x94b008aA00579c1307B0EF2c499aD98a8ce58e58`
You can find the query [here](https://ide.bitquery.io/Whale-transfers-of-USDT-on-optimism)

```
subscription {
  EVM(network: optimism) {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58"}}, Amount: {ge: "10000"}}}
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

This websocket retrieves transfers where the sender is a particular address `0xEbe80f029b1c02862B9E8a70a7e5317C06F62Cae`. For this subscription query we use `where` keyword and in that we specify `{Transfer: {Sender: {is: "0xEbe80f029b1c02862B9E8a70a7e5317C06F62Cae"}}}` to get the desired data. You can find the query [here](https://ide.bitquery.io/Sender-is-a-particular-address)

```
subscription {
  EVM(network: optimism) {
    Transfers(
      where: {Transfer: {Sender: {is: "0xEbe80f029b1c02862B9E8a70a7e5317C06F62Cae"}}}
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

# Subscribe to the latest NFT token transfers on Optimism

Let's see an example of NFT token transfers using GraphQL Subscription (Webhook). In the following NFT Token Transfers API, we will be subscribing to all NFT token transfers on Optimism network. You can run the query [here](https://ide.bitquery.io/NFT-Token-Transfers-API_1)

```
subscription {
  EVM(network: optimism) {
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
