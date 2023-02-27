---
sidebar_position: 2
---

# NFT API

Non-Fungible Tokens (NFTs) are digital assets with unique identification codes that cannot be exchanged for other tokens on a one-to-one basis. NFTs have gained significant popularity in recent years, with the growth of digital art, collectables, and gaming.

Bitquery's  APIs help you extract and analyze NFT data from various blockchain networks. Below are some examples of NFT queries that can be performed using Bitquery's platform:

## 1. NFT Balance API
One of the most common queries for NFTs is to track the ownership in a wallet.

```
query MyQuery {
  EVM(dataset: realtime, network: eth) {
    BalanceUpdates(
      where: {Currency: {SmartContract: {is: "0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270"}}, BalanceUpdate: {Amount: {ge: "1"}}}
      limit: {count: 10}
      orderBy: {descending: Block_Date}
    ) {
      BalanceUpdate {
        Address
        
      }
      Currency {
        Name
        ProtocolName
      }
      Block {
        Hash
        Date
      }
    }
  }
}

```

In this query, you'll need to replace "0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270" with the address you'd like to retrieve the balances for.

-   `dataset` specifies the type of data that will be queried. In this case, we are using `realtime`, which means that the query will retrieve the most up-to-date data available.
-   `network` specifies the Ethereum network that will be queried. In this case, we are using `eth` for the Ethereum Mainnet.
-   `BalanceUpdates` is the field that is being queried, and it returns an array of balance update objects that match the specified criteria.
-   `where` is used to filter the results based on specific criteria. In this query, the results are filtered based on the currency smart contract address and the minimum balance amount of 1.
-   `limit` is used to limit the number of results returned. In this case, we are limiting the results to the latest 10 balance updates.
-   `orderBy` is used to sort the results in descending order based on the block date of each balance update.
-   `BalanceUpdate` is a field within the `BalanceUpdates` object that returns the Ethereum address associated with the balance update.
-   `Currency` is a field within the `BalanceUpdates` object that returns information about the currency associated with the balance update, including its name and protocol name.
-   `Block` is a field within the `BalanceUpdates` object that returns information about the block that the balance update was included in, including its hash and date.


## 2. Getting NFT Metadata

You can type the address in the [Explorer](https://explorer.bitquery.io/) and view the details of any currency

![NFT explorer](/img/ide/NFT_1.png)

## 3. Querying NFT Transfers

This query can be used to retrieve information about NFT transfers on the Ethereum network sorted by transfer amount. The query takes one variable, the smartcontract address, which specifies the address of the NFT contract to be queried.

```
query MyQuery {
  EVM(dataset: realtime, network: eth) {
    Transfers(
      limit: {count: 10}
      orderBy: {descending: Transfer_Amount}
      where: {Transfer: {Currency: {SmartContract: {is: "Smart Contract Address of NFT"}}}}
    ) {
      Transfer {
        Amount
        Currency {
          Name
        }
        Sender
        Receiver
      }
      Block {
        Date
      }
    }
  }
}
```
-   `EVM` is the top-level schema field that provides access to Ethereum Virtual Machine data in the Bitquery API.
-   `Transfers` is the field that is being queried, and it returns information about NFT transfers on the Ethereum network.
-   `limit` is used to specify the maximum number of transfer records to be returned (in this case, we are only interested in the top 10).
-   `orderBy` is used to sort the transfer records by transfer amount in descending order.
-   `descending` specifies the sorting order (in this case, we want to sort in descending order).
-   `Transfer` is a field within the `Transfers` object that returns information about the transfer event.
-   `Currency` is a field within the `Transfer` object that returns information about the NFT token being transferred.
-   `SmartContract` is a field within the `Currency` object that returns information about the NFT contract associated with the token.
-   `is` is used to specify the Ethereum address of the NFT contract to be queried.
-   `Amount` returns the amount of NFT tokens transferred in the transfer event.
-   `Sender` returns the Ethereum address of the account that sent the NFT tokens.
-   `Receiver` returns the Ethereum address of the account that received the NFT tokens.
-   `Block` returns information about the Ethereum block in which the transfer event occurred.
-   `Date` returns the timestamp of the Ethereum block in which the transfer event occurred.
