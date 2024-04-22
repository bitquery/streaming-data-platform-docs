<head>
<meta name="title" content="Base Transfers API"/>
<meta name="description" content="Get all historical & realtime transfers details for an address or a contract, capturing internal transfers, external transfers and token transfers."/>
<meta name="keywords" content="Base transfers api, Base transfers python api, Base transfers scan api, Base transfers api docs, transfers crypto api, transfers blockchain api, Base network api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Base Transfers API"
/>
<meta
  property="og:description"
  content="Get all historical & realtime transfers for an address or a contract, capturing internal transfers, external transfers and token transfers."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Base Transfers API" />
<meta property="twitter:description" content="Get all historical & realtime transfers for an address or a contract, capturing internal transfers, external transfers and token transfers." />
</head>

# Base Chain Token Transfers API

In this section we'll have a look at some examples using the Base Transfers API.
This Base API is part of our Early Access Program (EAP), which is intended for evaluation purposes.
This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

# Subscribe to Recent Whale Transactions of a particular currency

The subscription query below fetches the whale transactions on the Base network. We have used USDC address `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`. You can find the query [here](https://ide.bitquery.io/Whale-transfers-of-USDC-on-base#)

```
subscription {
  EVM(network: base) {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"}}, Amount: {ge: "10000"}}}
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
