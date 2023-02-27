---
sidebar_position: 2
---

# BalanceUpdates API


The BalanceUpdates API provides information on the balance updates of a specific address for a particular token on a supported blockchain. This API enables developers to retrieve a list of balance updates for a particular token and address, as well as additional information about each balance update.

Here's the query to retrieve the balance updates for a particular address for a specific token on the Ethereum Mainnet blockchain:

```
query MyQuery {
  EVM(dataset: realtime, network: eth) {
    BalanceUpdates(
      where: {BalanceUpdate: {Address: {is: "0x3416cf6c708da44db2624d63ea0aaef7113527c6"}}, Block: {Date: {after: "2023-02-15"}}}
      orderBy: {descending: BalanceUpdate_Amount}
    ) {
      Currency {
        Name
      }
      Block {
        Date
      }
      BalanceUpdate {
        Amount
        Type
      }
    }
  }
}
```

In this query, replace 0x3416cf6c708da44db2624d63ea0aaef7113527c6 with the address for which you want to retrieve balance updates, and adjust the date and other parameters to fit your specific needs. The GraphQL link is [here](https://graphql.bitquery.io/ide/Balance-Update-in-a-wallet).


-  `Name`: The name of the token.
-  `Date`: The timestamp of the update.
- `Amount`: The amount of the token involved in the balance update.
- `Type`: The type of the balance update 

Here's an example response for the query:

```
"BalanceUpdates": [
      {
        "BalanceUpdate": {
          "Amount": "9901.287338",
          "Type": "transfer"
        },
        "Block": {
          "Date": "2023-02-27"
        },
        "Currency": {
          "Name": "Tether USD"
        }
      },
      {
        "BalanceUpdate": {
          "Amount": "989.010990",
          "Type": "transfer"
        },
        "Block": {
          "Date": "2023-02-27"
        },
        "Currency": {
          "Name": "Tether USD"
        }
      },

```
