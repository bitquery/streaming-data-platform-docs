---
title: "EVM Token Transfers API"
---

<head>
<meta name="title" content="EVM Token Transfers API"/>

<meta name="description" content="Get EVM token transfers with detailed infromation using the transfers API. Filter, sort, and analyze ERC-20 token flow easily."/>

<meta name="keywords" content="EVM token transfers, EVM token transfers per second, EVM token transfer analysis, ERC-20 token transfers, EVM token transaction data, EVM token transfer history, EVM token transfer API, EVM token transfer tracking, EVM token transfer monitoring, ERC-20 token transfer analytics"/>

<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />

<meta property="og:title" content="EVM Token Transfers API" />

<meta property="og:description" content="Get EVM token transfers with detailed infromation using the transfers API. Filter, sort, and analyze ERC-20 token flow easily."/>
</head>

To retrieve data on token and currency transfers using Bitquery, users can utilize the platform's GraphQL API. The Bitquery API allows users to construct custom queries to retrieve data on a wide range of blockchain events and transactions, including token transfers. You can find more examples [here](/docs/blockchain/Ethereum/transfers/erc20-token-transfer-api/)

```graphql
 Transfers(limit: {count: 10}, orderBy: {descending: Block_Time}) {
      Transfer {
        Amount
        Currency {
          Fungible
          Name
          ProtocolName
          Symbol
        }
        Data
        Id
        Receiver
        Sender
        Success
        Type
      }
    }
```

`Transfers`: The top level method that returns transfer information

- `Transfer`: Returns information on the token transfer.

  - `Amount`: Returns the amount of tokens transferred.
  - `Currency`: Returns information on the currency of the token transferred.

    - `Fungible`: Returns a Boolean value indicating whether the token is fungible.
    - `Name`: Returns the name of the token.
    - `ProtocolName`: Returns the name of the protocol on which the token is built.
    - `Symbol`: Returns the symbol used to represent the token.

  - `Data`: Returns any additional data associated with the token transfer.
  - `Id`: Returns the ID of the token transfer.
  - `Receiver`: Returns the address of the token receiver.
  - `Sender`: Returns the address of the token sender.
  - `Success`: Returns a Boolean value indicating whether the token transfer was successful.
  - `Type`: Returns the type of token transfer. e.g. call.
