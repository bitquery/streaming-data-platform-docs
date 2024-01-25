---
sidebar_position: 2
---

---
title: "Blockchain Address Balance History API"
---

<head>
<meta name="title" content="EVM Balance Updates API - Ethereum Address Balance History"/>

<meta name="description" content="Address balance api, balance history, and other balance related details, such as the USDT token balance, using Bitquery's address query. Discover crypto balance, blockchain balance, and more using our GraphQL APIs."/>

<meta name="keywords" content="Token Balance, ERC20, USDT Balance, USDC Balance, ETH Balance, Ethereum, Ethereum Address"/>

<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />

<meta property="og:title" content="EVM Balance Updates API - Ethereum Address Balance History" />

<meta property="og:description" content="Address balance api, balance history, and other balance related details, such as the USDT token balance, using Bitquery's address query. Discover crypto balance, blockchain balance, and more using our GraphQL APIs" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />

<meta property="twitter:title" content="EVM Balance Updates API" />

<meta property="twitter:description" content="Address balance api, balance history, and other balance related details, such as the USDT token balance, using Bitquery's address query. Discover crypto balance, blockchain balance, and more using our GraphQL APIs" />
</head>



# BalanceUpdates API


The BalanceUpdates API provides information on the balance updates of a specific address for a particular token on a supported blockchain. This API enables developers to retrieve a list of balance updates for a particular token and address, as well as additional information about each balance update.

You can use BalanceUpdates API to get latest balance for an address.

## Balance of an address

Open the query on GraphQL IDE using this [link](https://ide.bitquery.io/balance-of-a-wallet_1).

```graphql 
query MyQuery {
  EVM(dataset: archive, network: eth) {
    BalanceUpdates(
      where: {BalanceUpdate: {Address: {is: "0xcf1DC766Fc2c62bef0b67A8De666c8e67aCf35f6"}}}
      orderBy: {descendingByField: "balance"}
    ) {
      Currency {
        Name
      }
      balance: sum(of: BalanceUpdate_Amount, selectWhere: {gt: "0"})
      BalanceUpdate {
        Address
      }
    }
  }
}


```

**Parameters**
-   `dataset: archive`: This parameter specifies that the [combined](/docs/graphql/dataset/combined) dataset is being used.
-   `network: eth`: This parameter specifies that the Ethereum network is being queried.
-   `where: {BalanceUpdate: {Address: {is: "0xcf1DC766Fc2c62bef0b67A8De666c8e67aCf35f6"}}}`: This parameter filters the results of the query based on the Ethereum address "0xcf1DC766Fc2c62bef0b67A8De666c8e67aCf35f6".

**Returned Data**
-   `Currency { Name }`: This field specifies the currency in which the balance is expressed. In this case, the `Name` of the currency is retrieved.
-   `balance: sum(of: BalanceUpdate_Amount)`: This field retrieves the total balance of the specified Ethereum address, broken down by currency. The `sum` function is used to calculate the total amount, and the `of` parameter specifies the field to sum, which is `BalanceUpdate_Amount`. The alias `balance` is used to rename the field to `balance` for readability.

## Balance for an address for a specific currency

You can also get a balance for a specific currency for a given address just by adding Currency Filer. As you know, names on blockchains are not unique; however, addresses are. Therefore, while mentioning currencies, always use their currency address. Open the query on GraphQL IDE using this [link](https://graphql.bitquery.io/ide/Balance-for-an-address-for-an-specific-currency_1).

```graphql
query MyQuery {
  EVM(dataset: archive, network: eth) {
    BalanceUpdates(
      where: {BalanceUpdate: {Address: {is: "0x3416cf6c708da44db2624d63ea0aaef7113527c6"}}, Currency: {SmartContract: {is: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"}}}
    ) {
      Currency {
        Name
        SmartContract
      }
      balance: sum(of: BalanceUpdate_Amount)
    }
  }
}

```
**Parameters**
-   `dataset: archive`: This parameter specifies that the [combined](/docs/graphql/dataset/combined) dataset is being used.
-   `network: eth`: This parameter specifies that the Ethereum network is being queried.
-   `where: {BalanceUpdate: {Address: {is: "0x3416cf6c708da44db2624d63ea0aaef7113527c6"}}, Currency: {SmartContract: {is: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"}}}`: This parameter filters the results of the query based on the Ethereum address "0x3416cf6c708da44db2624d63ea0aaef7113527c6" and the smart contract address "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48". The `Currency` field specifies the currency to filter by, and the `SmartContract` field specifies the smart contract address to filter by.

**Returned Data**
-   `Currency { Name, SmartContract }`: This field specifies the currency in which the balance is expressed. In this case, the `Name` and `SmartContract` of the currency are retrieved.
-   `balance: sum(of: BalanceUpdate_Amount)`: This field retrieves the total balance of the specified Ethereum address, broken down by currency. The `sum` function is used to calculate the total amount, and the `of` parameter specifies the field to sum, which is `BalanceUpdate_Amount`. The alias `balance` is used to rename the field to `balance` for readability



## Balance updates of an address

Here's the query to retrieve the balance updates for a particular address for a specific token on the Ethereum Mainnet blockchain:

``` graphql
query MyQuery {
  EVM(dataset: archive, network: eth) {
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

```json
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
