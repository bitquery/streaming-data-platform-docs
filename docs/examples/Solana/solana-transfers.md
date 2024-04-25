# Solana Transfers API

In this section we'll have a look at some examples using the Solana Transfers API.

This Solana API is part of our Early Access Program (EAP), which is intended for evaluation purposes.

This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

<head>
<meta name="title" content="Solana Transfers API | Get SPL Token Transfers"/>
<meta name="description" content="Get all historical & realtime transfers details for an address or a contract, capturing internal transfers, external transfers and token transfers."/>
<meta name="keywords" content="Solana transfers api, Solana transfers python api, Solana transfers scan api, Solana transfers api docs, transfers crypto api, transfers blockchain api, Solana network api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Solana Transfers API | Get SPL Token Transfers"
/>
<meta
  property="og:description"
  content="Get all historical & realtime transfers for an address or a contract, capturing internal transfers, external transfers and token transfers."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Solana Transfers API | Get SPL Token Transfers" />
<meta property="twitter:description" content="Get all historical & realtime transfers for an address or a contract, capturing internal transfers, external transfers and token transfers." />
</head>

# SPL Token Transfers API

One of the most common types of transfers on Solana are SPL token transfers. Let's see an example to get the latest SPL token transfers using our API. Today we are taking an example of JUPITER token transfers. The contract address for the JUPITER token is `JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN`. You can find the query [here](https://ide.bitquery.io/SPL-transfers-websocket_1)

```
subscription {
  Solana {
    Transfers(
      where: {Transfer: {Currency: {MintAddress: {is: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN"}}}}
    ) {
      Transfer {
        Currency {
          MintAddress
          Symbol
          Name
          Fungible
          Native
        }
        Receiver {
          Address
        }
        Sender {
          Address
        }
        Amount
        AmountInUSD
      }
    }
  }
}



```

# Sender is a particular address

This websocket retrieves transfers where the sender is a particular address `2g9NLWUM6bPm9xq2FBsb3MT3F3G5HDraGqZQEVzcCWTc`. For this subscription query we use `where` keyword and in that we specify `{Transfer: {Sender: {Address: {is: "2g9NLWUM6bPm9xq2FBsb3MT3F3G5HDraGqZQEVzcCWTc"}}}}` to get the desired data. You can find the query [here](https://ide.bitquery.io/transfers-where-sender-is-the-specified-address_1)

```
subscription {
  Solana {
    Transfers(
      where: {Transfer: {Sender: {Address: {is: "2g9NLWUM6bPm9xq2FBsb3MT3F3G5HDraGqZQEVzcCWTc"}}}}
    ) {
      Transaction {
        Signature
      }
      Transfer {
        Amount
        AmountInUSD
        Sender {
          Address
        }
        Receiver {
          Address
        }
        Currency {
          Name
          Symbol
          MintAddress
        }
      }
    }
  }
}

```

# Subscribe to the latest NFT token transfers on Solana

Let's see an example of NFT token transfers using GraphQL Subscription (Webhook). In the following API, we will be subscribing to all NFT token transfers. You can run the query [here](https://ide.bitquery.io/Subscribe-to-the-latest-NFT-transfers-on-Solana)

```
subscription {
  Solana {
    Transfers(where: {Transfer: {Currency: {Fungible: false}}}) {
      Transfer {
        Amount
        AmountInUSD
        Currency {
          Name
          MintAddress
          Fungible
          Symbol
          Uri
        }
        Receiver {
          Address
        }
        Sender {
          Address
        }
      }
      Transaction {
        Signature
      }
    }
  }
}


```
