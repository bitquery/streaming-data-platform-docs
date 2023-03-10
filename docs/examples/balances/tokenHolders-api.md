---
sidebar_position: 4
---

# Token Holders API

The Token Holders API provides information on the holders of a specific token on a supported blockchain. This API enables developers to retrieve a list of addresses that hold a particular token, as well as additional information about each holder.

## Top 10 Token Holders
Here's an example query to retrieve the top 10 balance updates for a specific token contract on the Binance Smart Chain network:

```graphql
query MyQuery {
  EVM(dataset: realtime, network: bsc) {
    BalanceUpdates(
      orderBy: {descending: BalanceUpdate_Amount}
      limit: {count: 10}
      where: {Currency: {SmartContract: {is: "0x3ee2200efb3400fabb9aacf31297cbdd1d435d47"}}, Block: {Date: {after: "2023-02-01"}}}
    ) {
      BalanceUpdate {
        Address
        Amount
      }
      Currency {
        Name
      }
    }
  }
}
```
In this query, you'll need to replace "0x3ee2200efb3400fabb9aacf31297cbdd1d435d47" with the contract address of the token you'd like to retrieve balance updates for.

**Parameters**
-   `dataset: realtime`: This parameter specifies that the real time dataset is being used.
-   `network: bsc`: This parameter specifies that the Binance Smart Chain (BSC) network is being queried.
-   `orderBy: {descending: BalanceUpdate_Amount}`: This parameter orders the results of the query by the `BalanceUpdate_Amount` field in descending order, meaning the highest balances will appear first.
-   `limit: {count: 10}`: This parameter limits the number of results returned to 10.
-   `where: {Currency: {SmartContract: {is: "0x3ee2200efb3400fabb9aacf31297cbdd1d435d47"}}, Block: {Date: {after: "2023-02-01"}}}`: This parameter filters the results of the query based on the smart contract address "0x3ee2200efb3400fabb9aacf31297cbdd1d435d47" and the block date after "2023-02-01". The `Currency` field specifies the currency to filter by, and the `SmartContract` field specifies the smart contract address to filter by. The `Block` field specifies the block to filter by, and the `Date` field specifies the date to filter by.

**Returned Data**
-   `BalanceUpdate { Address, Amount }`: This field specifies the address and amount of each balance update in the results.
-   `Currency { Name }`: This field specifies the currency in which the balance is expressed. In this case, the `Name` of the currency is retrieved.

Here's a sample of the response:

```

    "BalanceUpdates": [
      {
        "BalanceUpdate": {
          "Address": "0xba51d1ab95756ca4eab8737ecd450cd8f05384cf",
          "Amount": "980.473690002807400000"
        },
        "Currency": {
          "Name": "Cardano Token"
        }
      },
      {
        "BalanceUpdate": {
          "Address": "0x51aa28cf73e5e0abb32deea73ea6e3802beca058",
          "Amount": "97.149127271688019074"
        },
        "Currency": {
          "Name": "Cardano Token"
        }
      },
      {
        "BalanceUpdate": {
          "Address": "0xba51d1ab95756ca4eab8737ecd450cd8f05384cf",
          "Amount": "956.556105801253600000"
        },
        "Currency": {
          "Name": "Cardano Token"
        }
      }, 

```
You can find the graphql query [here](https://graphql.bitquery.io/ide/Top-10-Cardano-Wallets-on-BSC).
