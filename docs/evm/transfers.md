---
sidebar_position: 8
---

# Token and Currency Transfers

To retrieve data on token and currency transfers using Bitquery, users can utilize the platform's GraphQL API. The Bitquery API allows users to construct custom queries to retrieve data on a wide range of blockchain events and transactions, including token transfers. You can find more examples [here](../examples/transfers/erc20-token-transfer-api)

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

`Transfers`: The top level method that returns tranfer information

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
  - `Type`: Returns the type of token transfer. e.g call.
