---
sidebar_position: 7
---

# NFT Collection API

## Get All NFTs in a Collection

Here is a query that retrieves all the NFTs in a Collection.

```graphql 
{
  EVM(dataset: archive, network: eth) {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"}}}}
      limitBy: {by: Transfer_Id, count: 1}
      limit: {count: 1000, offset: 0}
      orderBy: {descending: Transfer_Id}
    ) {
      Transfer {
        Currency {
          SmartContract
          Name
        }
        Id
        URI
        Data
      }
    }
  }
}

```
You can find the graphql query [here](https://ide.bitquery.io/Get-all-NFTs-for-a-collection).


## Get All Token Holders of a Collection 

This query retrieves the token holders of a collection. We use the BalanceUpdates method to query all the addresses that had added the NFT whose SmartContract is mentioned in the query. To get more wallets, increase the count.

```graphql 
{
  EVM(dataset: archive, network: eth) {
    BalanceUpdates(
      where: {Currency: {SmartContract: {is: "0x23581767a106ae21c074b2276d25e5c3e136a68b"}}}
      limitBy: {by: BalanceUpdate_Address, count: 1}
      limit: {count: 1000}
      orderBy: {descendingByField: "sum"}
    ) {
      sum(of: BalanceUpdate_Amount, selectWhere: {gt: "0"})
      BalanceUpdate {
        Address
      }
    }
  }
}
```

You can find the graphql query [here](https://ide.bitquery.io/Fixed---All-token-holders-of-ERC-1165-collection).

