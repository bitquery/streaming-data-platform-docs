# BSC Transfers API

In this section we'll have a look at some examples using the BSC Transfers API.

<head>
<meta name="title" content="BSC Transfers API"/>
<meta name="description" content="Get all historical & realtime transfers details for an address or a contract, capturing internal transfers, external transfers and token transfers."/>
<meta name="keywords" content="BSC transfers api, BSC transfers python api, BSC transfers scan api, BSC transfers api docs, transfers crypto api, transfers blockchain api, BSC network api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="BSC Transfers API"
/>
<meta
  property="og:description"
  content="Get all historical & realtime transfers for an address or a contract, capturing internal transfers, external transfers and token transfers."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="BSC Transfers API" />
<meta property="twitter:description" content="Get all historical & realtime transfers for an address or a contract, capturing internal transfers, external transfers and token transfers." />
</head>

# Subscribe to Recent Whale Transactions of a particular currency

The subscription query below fetches the whale transactions on the BSC network. We have used WBNB address `0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c`. You can find the query [here](https://ide.bitquery.io/Whale-transfers-of-USDC-on-BSC)

```
subscription{
  EVM(network: bsc) {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"}}, Amount: {ge: "10000"}}}
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

This websocket retrieves transfers where the sender is a particular address `0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c`. For this subscription query we use `where` keyword and in that we specify `{Transfer: {Sender: {is: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"}}}` to get the desired data. You can find the query [here](https://ide.bitquery.io/Transfers-where-sender-is-a-particular-address)

```
subscription {
  EVM(network: bsc) {
    Transfers(
      where: {Transfer: {Sender: {is: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"}}}
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

# Subscribe to the latest NFT token transfers on BSC

Let's see an example of NFT token transfers using GraphQL Subscription (Webhook). In the following NFT Token Transfers API, we will be subscribing to all NFT token transfers on BSC network. You can run the query [here](https://ide.bitquery.io/Track-realtime-NFT-Transfers-on-BSC-chain)

```
subscription {
  EVM(network: bsc) {
    Transfers(
      where: {
        Transfer: {
          Currency: {
            Fungible: false
          }
        }
      }
    ) {
      Block {
        Hash
        Number
      }
      Transfer {
        Amount
        Currency {
          Name
          SmartContract
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
