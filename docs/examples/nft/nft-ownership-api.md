---
sidebar_position: 2
---

# NFT Ownership API

The NFT Ownership API can be used to retrieve information about the ownership of a specific NFT ( Non-Fungible Token ) on the supported blockchain. For instance using this we can access the owners of an NFT including their addresses and associated metadata and also we can retrieve a list of the top holders of a particular NFT.

## Get NFT Owners

This query fetches the most recent owner of the NFT. The API leverages the BalanceUpdates method, which keeps track of all balance updates. Alternatively, you can achieve similar results by utilizing the Transfers API.

```graphql
query MyQuery {
  EVM(dataset: combined, network: eth) {
    BalanceUpdates(
      orderBy: { descending: Block_Time }
      limit: { count: 1 }
      where: {
        BalanceUpdate: { Id: { eq: "9996" } }
        Currency: {
          Fungible: false
          SmartContract: { is: "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e" }
        }
      }
    ) {
      Currency {
        Name
        SmartContract
      }
      BalanceUpdate {
        Address
        Amount
        Id
      }
      Block {
        Number
        Date
      }
    }
  }
}
```

**Parameters**

- `network` : This specifies the Ethereum network to use.
- `dataset` : This specifies the dataset to use. In this case, the dataset is [combined](/docs/graphql/dataset/combined).
- `limit` : Specifies the maximum results to return. In this query, the limit is 1.
- `orderBy` : Results are in descending order by Block_Time.
- `where` : This parameter allows you to filter the results based on specific conditions. In this case, the token ID is "9996" and the Currency is non-fungible, with the Smart Contract being `0x8a90cab2b38dba80c64b7734e58ee1db38b8992e`.

**Returned Data**

- `Currency` : Specifies the NFT currency. `Name` represents the currency name, and `SmartContract` contains its smart contract address.
- `BalanceUpdate` : Contains the address of the NFT holder, along with the amount and ID of the token involved in the balance update.
- `Block` : Includes the block number and date.

You can find the graphql query [here](https://ide.bitquery.io/Who-owns-specific-NFT).

## Top Holders of an NFT

Let's see an example showcasing the retrieval of the top 10 holders for a particular NFT, with their balances.

```graphql
query MyQuery {
  EVM(dataset: combined, network: eth) {
    BalanceUpdates(
      orderBy: { descendingByField: "Balance" }
      limit: { count: 10 }
      where: {
        Currency: {
          SmartContract: { is: "0x7dD4F223D9155F412790D696Fa30923489d4Ad34" }
        }
      }
    ) {
      BalanceUpdate {
        Address
      }
      Balance: sum(of: BalanceUpdate_Amount, selectWhere: { gt: "0" })
    }
  }
}
```

In this query, you'll need to replace `0x7dD4F223D9155F412790D696Fa30923489d4Ad34` with the contract address of the NFT you'd like to retrieve top holders for.

**Parameters**

- `dataset` : Specifies combined dataset that includes both realtime & archive data.
- `network` : Specifies that the Ethereum network is being queried.
- `orderBy` : Orders the results based on the "Balance" field in descending order, meaning the holder with highest balance will appear first.
- `limit` : Limits the number of results returned to 10.
- `where` : It filters the query results based on the NFT smart contract address `0x7dD4F223D9155F412790D696Fa30923489d4Ad34` . `Currency: {SmartContract: {is: ""}}` specifies the filter for the smart contract address.

**Returned Data**

- `Balance` : Specifies the balance amount in the results.
- `BalanceUpdate` : The `Address` field specifies the address who holds the NFT.

You can find the graphql query [here](https://ide.bitquery.io/top-token-holders-of-Moonwalker-NFT).

## Find NFT Creator Address

The creator of the NFT can be inferred from the sender of the first transfer.
By setting, `Transfers(limit: {count: 1} orderBy: {ascending: Block_Time})` we fetch the earliest (first) transfer record based on block time.

You can run the query [here](https://ide.bitquery.io/Fidenza-725)

```
query MyQuery {
  EVM(dataset: archive) {
    Transfers(
      limit: {count: 1}
      orderBy: {ascending: Block_Time}
      where: {Transfer: {Currency: {SmartContract: {is: "0xa7d8d9ef8D8Ce8992Df33D8b8CF4Aebabd5bD270"}}, Id: {eq: "78000725"}}}
    ) {
      Block {
        Time
      }
      Transfer {
        Amount
        Currency {
          Symbol
          SmartContract
          ProtocolName
          Native
          Name
          HasURI
          Fungible
          DelegatedTo
          Delegated
          Decimals
        }
        Data
        Id
        Receiver
        Success
        Type
      }
    }
  }
}


```


## Past (churned) holders of tokens

Check past (churned) token holders of a NFT token [using following query](https://ide.bitquery.io/past-token-holder-of-a-token_1).


```
{
  EVM(dataset: combined) {
    BalanceUpdates(
      limit: {count: 10}
      where: {Currency: {Fungible: false, SmartContract: {is: "0x364c828ee171616a39897688a831c2499ad972ec"}}}
    ) {
      BalanceUpdate {
        Address
      }
      Block {
        lastHoldingDate: Time(
          maximum: Block_Time
          if: {Currency: {SmartContract: {is: "0x364c828ee171616a39897688a831c2499ad972ec"}}}
        )
        fistHoldingDate: Time(
          minimum: Block_Time
          if: {Currency: {SmartContract: {is: "0x364c828ee171616a39897688a831c2499ad972ec"}}}
        )
      }
      sum(of: BalanceUpdate_Amount, selectWhere: {le: "0"})
    }
  }
}
```