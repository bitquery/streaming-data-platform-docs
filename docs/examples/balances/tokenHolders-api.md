---
sidebar_position: 4
---

# Token Holders API

The Token Holders API provides information on the holders of a specific token on a supported blockchain. This API enables developers to retrieve a list of addresses that hold a particular token, as well as additional information about each holder.

## Top 10 Token Holders
Here's an example query to retrieve the top 10 balance updates for a specific token contract on the Ethereum network:

```graphql
query MyQuery {
  EVM(dataset: combined, network: eth) {
    BalanceUpdates(
      orderBy: {descendingByField: "Balance"}
      limit: {count: 10}
      where: {Currency: {SmartContract: {is: "0x5Af0D9827E0c53E4799BB226655A1de152A425a5"}}, Block: {Date: {after: "2023-02-01"}}}
    ) {
      BalanceUpdate {
        Address
      }
      Balance: sum(of: BalanceUpdate_Amount, selectWhere: {gt: "0"})
    }
  }
}

```
In this query, you'll need to replace "0x5Af0D9827E0c53E4799BB226655A1de152A425a5" with the contract address of the token you'd like to retrieve balance updates for.

**Parameters**
-   `dataset: combined`: This parameter specifies that the dataset has both realtime and archive data
-   `network: eth`: This parameter specifies that the Ethereum network is being queried.
-   `orderBy: {descendingByField: "Balance"}`: This parameter orders the results of the query by the `Balance` field in descending order, meaning the highest balances will appear first.
-   `limit: {count: 10}`: This parameter limits the number of results returned to 10.
-   `where: {Currency: {SmartContract: {is: "0x5Af0D9827E0c53E4799BB226655A1de152A425a5"}}, Block: {Date: {after: "2023-02-01"}}}`: This parameter filters the results of the query based on the smart contract address "0x3ee2200efb3400fabb9aacf31297cbdd1d435d47" and the block date after "2023-02-01". The `Currency` field specifies the currency to filter by, and the `SmartContract` field specifies the smart contract address to filter by. The `Block` field specifies the block to filter by, and the `Date` field specifies the date to filter by.

**Returned Data**
-   `Balance: sum(of: BalanceUpdate_Amount)`: This field specifies the address and the balance amount in the results.
-   `Currency { Name }`: This field specifies the currency in which the balance is expressed. In this case, the `Name` of the currency is retrieved.

Here's a sample of the response:

```
 "BalanceUpdates": [
      {
        "Balance": "431",
        "BalanceUpdate": {
          "Address": "0x29469395eaf6f95920e59f858042f0e28d98a20b"
        }
      },
      {
        "Balance": "140",
        "BalanceUpdate": {
          "Address": "0x398d282487b44b6e53ce0aebca3cb60c3b6325e9"
        }
      },
```
You can find the graphql query [here](https://ide.bitquery.io/top-MILADY-MAKER-NFT-holders).
