# OpBNB Transfers API

In this section we'll have a look at some examples using the OpBNB Transfers API.

This OpBNB API is part of our Early Access Program (EAP), which is intended for evaluation purposes.

This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

<head>
<meta name="title" content="OpBNB Transfers API"/>
<meta name="description" content="Get all historical & realtime transfers details for an address or a contract, capturing internal transfers, external transfers and token transfers."/>
<meta name="keywords" content="OpBNB transfers api, OpBNB transfers python api, OpBNB transfers scan api, OpBNB transfers api docs, transfers crypto api, transfers blockchain api, OpBNB network api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="OpBNB Transfers API"
/>
<meta
  property="og:description"
  content="Get all historical & realtime transfers for an address or a contract, capturing internal transfers, external transfers and token transfers."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="OpBNB Transfers API" />
<meta property="twitter:description" content="Get all historical & realtime transfers for an address or a contract, capturing internal transfers, external transfers and token transfers." />
</head>

# Subscribe to Recent Whale Transactions of a particular currency

The subscription query below fetches the whale transactions on the OpBNB network. We have used USDT address `0x9e5AAC1Ba1a2e6aEd6b32689DFcF62A509Ca96f3`. You can find the query [here](https://ide.bitquery.io/Whale-transfers-of-USDT-on-opBNB_2)

```
subscription{
  EVM(network: opbnb) {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "0x9e5AAC1Ba1a2e6aEd6b32689DFcF62A509Ca96f3"}}, Amount: {ge: "10000"}}}
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

This websocket retrieves transfers where the sender is a particular address `0xc4f981189558682F15F60513158B699354B30204`. For this subscription query we use `where` keyword and in that we specify `{Transfer: {Sender: {is: "0xc4f981189558682F15F60513158B699354B30204"}}}` to get the desired data. You can find the query [here](https://ide.bitquery.io/Sender-is-a-particular-address_1)

```
subscription {
  EVM(network: opbnb) {
    Transfers(
      where: {Transfer: {Sender: {is: "0xc4f981189558682F15F60513158B699354B30204"}}}
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

# Subscribe to the latest NFT token transfers on OpBNB

Let's see an example of NFT token transfers using GraphQL Subscription (Webhook). In the following NFT Token Transfers API, we will be subscribing to all NFT token transfers on OpBNB network. You can run the query [here](https://ide.bitquery.io/NFT-Token-Transfers-API_2)

```
subscription {
  EVM(network: opbnb) {
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
