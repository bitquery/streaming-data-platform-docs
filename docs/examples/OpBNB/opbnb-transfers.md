# OpBNB Transfers API

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



In this section we'll have a look at some examples using the OpBNB Transfers API.
This OpBNB API is part of our Early Access Program (EAP), which is intended for evaluation purposes.
This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

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
