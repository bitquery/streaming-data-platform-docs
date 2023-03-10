---
sidebar_position: 1
---

# NFT API

Non-Fungible Tokens (NFTs) are digital assets with unique identification codes that cannot be exchanged for other tokens on a one-to-one basis. NFTs have gained significant popularity in recent years, with the growth of digital art, collectables, and gaming.

Bitquery's APIs help you extract and analyze NFT data from various blockchain networks. Below are some examples of NFT queries that can be performed using Bitquery's platform:

## NFT Metadata


You can type the address in the [Explorer](https://explorer.bitquery.io/) and view the details of any currency

![NFT explorer](/img/ide/NFT_1.png)

## NFT Holders for a project

This query retrieves the Ethereum addresses that hold Axie Infinity NFT tokens associated with that smart contract, ordered by the sum of the token balances in descending order.

```graphql 
{
  EVM(network: eth  dataset: combined) {
    BalanceUpdates(
      limit: {count: 100}
      orderBy: {descendingByField: "balance"}
      where: {Currency: {SmartContract: {is: "0xf5b0a3efb8e8e4c201e2a935f110eaaf3ffecb8d"}}}
    ) {
      BalanceUpdate {
        Address
      }
      balance: sum(of: BalanceUpdate_Amount)
    }
  }
}

```

**Parameters**

-   `network`: This specifies the Ethereum network to use. In this case, the network is "eth".
-   `dataset`: This specifies the dataset to use. In this case, the dataset is [combined](/docs/graphql/dataset/combined). 
-   `limit`: This parameter specifies the maximum number of results to return. In this query, the limit is set to 100.
-   `orderBy`: This parameter specifies the field to order the results by. In this query, the results are ordered in descending order of balance.
-   `where`: This parameter specifies the conditions to filter the results by. In this query, the filter condition is that the Currency is a Smart Contract with the address "0xf5b0a3efb8e8e4c201e2a935f110eaaf3ffecb8d".

** Returned Data**

-   `Address`: This field returns the Ethereum wallet address holding the NFT
-   `balance`: This field returns the sum of the token balances associated with the Ethereum address.


## NFT owned by an address

```graphql
{
  EVM(network: eth, dataset: combined) {
    BalanceUpdates(
      limit: {count: 100}
      orderBy: {descendingByField: "balance"}
      where: {Currency: {SmartContract: {is: "0xBE223020724CC3e2999f5dCeDA3120484FdBfef7"}}, BalanceUpdate: {Address: {is: "0xb92505a3364B7C7E333c05B44cE1E55377fC43cA"}, Amount: {gt: "0"}}}
    ) {
      Currency {
        Fungible
        Symbol
        SmartContract
        Name
        HasURI
        Delegated
      }
      BalanceUpdate {
        Id
        Amount
        Address
      }
    }
  }
}

```
**Parameters**
-   `EVM(network: eth, dataset: combined)`: specifies that we want to query the [combined](/docs/graphql/dataset/combined) dataset of the Ethereum blockchain.
-   `BalanceUpdates`: specifies that we want to retrieve balance updates for a specific smart contract.
-   `where: { Currency: { SmartContract: { is: "0xBE223020724CC3e2999f5dCeDA3120484FdBfef7" } }, BalanceUpdate: { Address: { is: "0xb92505a3364B7C7E333c05B44cE1E55377fC43cA" }, Amount: { gt: "0" } } }`: specifies the filter condition to retrieve balance updates for a specific smart contract with address "0xBE223020724CC3e2999f5dCeDA3120484FdBfef7" and a specific address "0xb92505a3364B7C7E333c05B44cE1E55377fC43cA" which has a balance greater than 0.

**Returned Data**
-   `Currency`: returns the currency information for the specified smart contract.
-   `Fungible`: specifies if the currency is fungible or non-fungible.
-   `Symbol`: returns the symbol for the currency.
-   `SmartContract`: returns the address of the smart contract for the currency.
-   `Name`: returns the name of the currency.
-   `HasURI`: specifies if the currency has a URI.
-   `Delegated`: specifies if the currency is delegated.
-   `BalanceUpdate`: returns the balance update information for the specified address.
-   `Id`: returns the ID of the balance update.
-   `Amount`: returns the amount of the balance update.
-   `Address`: returns the address of the balance update.

## Latest NFT trades for given project

```graphql
{
  EVM(network: eth, dataset: combined) {
    BalanceUpdates(
      limit: {count: 100}
      orderBy: {descendingByField: "balance"}
      where: {Currency: {Fungible: false}, BalanceUpdate: {Address: {is: "0xb92505a3364b7c7e333c05b44ce1e55377fc43ca"}, Amount: {gt: "0"}}}
    ) {
      Currency {
        Fungible
        Symbol
        SmartContract
        Name
        HasURI
        Delegated
      }
      total_token: sum(of: BalanceUpdate_Amount)
    }
  }
}

```

**Parameters**
-   `network: eth` specifies that the Ethereum network is being queried.
-   `dataset: combined` specifies that the [combined](/docs/graphql/dataset/combined) dataset is being used.
-   `BalanceUpdates` retrieves information about balance updates.
-   `limit: {count: 100}` specifies that up to 100 results will be returned.
-   `orderBy: {descendingByField: "balance"}` sorts the results in descending order by the token balance.
-   `where` filters the results based on certain criteria. In this case, the results are filtered to only include NFTs held by the address "0xb92505a3364b7c7e333c05b44ce1e55377fc43ca" with a balance greater than 0.
-   `Currency` specifies that the token is non-fungible.

**Returned Data**
-  `Currency`: This field is an object that contains information about the currency being queried, including whether it is fungible or not, its symbol, name, URI, whether it has been delegated, and the address of the smart contract that created it.
    
-  `total_token`: This field is the sum of the `Amount` field from all the `BalanceUpdate` objects that meet the criteria specified in the `where` clause of the query. It represents the total amount of non-fungible tokens owned by the address specified in the `where` clause.


## All NFT transfers in a block
This query retrieves all NFT token transfers on the Ethereum network within a specific block, and returns information about the block, transfer amount, token currency, sender, and receiver.

```graphql
 {
  EVM(dataset: combined, network: eth) {
    Transfers(
      orderBy: {descending: Block_Time}
      where: {Block: {Number: {eq: "16747554"}}, Transfer: {Currency: {Fungible: false}}}
    ) {
      Block {
        Hash
        Number
      }
      Transfer {
        Amount
        Currency {
          Name
          Symbol
          Native
        }
        Sender
        Receiver
      }
    }
  }
}
```
 **Parameters**:

The EVM Transfers query takes in the following parameters:

-   `dataset`: This specifies the dataset to use. In this case, the dataset is [combined](/docs/graphql/dataset/combined)
-   `network`: This specifies the Ethereum network to use. In this case, the network is "eth".
-   `orderBy`: This parameter specifies the field to order the results by. In this query, the results are ordered in descending order of block time.
-   `where`: This parameter specifies the conditions to filter the results by. In this query, the filter condition is that the transfer is non-fungible and occurred within a specific block identified by the block number.

**Returned Data**

The EVM Transfers query returns the following fields:

-   `Hash`: This field returns the hash of the block in which the transfer occurred.
-   `Number`: This field returns the number of the block in which the transfer occurred.
-   `Amount`: This field returns the amount transferred.
-   `Currency.Name`: This field returns the name of the token currency.
-   `Currency.Symbol`: This field returns the symbol of the token currency.
-   `Currency.Native`: This field returns a boolean indicating whether the token currency is a native currency of the blockchain.
-   `Sender`: This field returns the Ethereum address of the sender.
-   `Receiver`: This field returns the Ethereum address of the receiver.


## All transfers of an NFT
This query retrieves the most recent transfers of a specific non-fungible token (NFT) on the Ethereum network.
You can find the GraphQL query [here](https://graphql.bitquery.io/ide/All-transfers-of-an-NFT)

```graphql
query MyQuery {
  EVM(dataset: combined, network: eth) {
    Transfers(
      orderBy: {descending: Block_Time}
      where: {Transfer: {Currency: {Fungible: false, SmartContract: {is: "0x005e6b6776108f4c9e9c5c1259b9554036f8d55e"}}}}
      limit: {count: 20}
    ) {
      Block {
        Hash
        Number
      }
      Transfer {
        Amount
        Currency {
          Name
          Symbol
          Native
        }
        Sender
        Receiver
      }
    }
  }
}
```
**Parameters**
-   `EVM(dataset: combined, network: eth)` specifies that the query will be executed on the Ethereum blockchain network.
-   `Transfers` specifies that the query will retrieve transfer transactions on the Ethereum network.
-   `orderBy: {descending: Block_Time}` specifies that the transfers should be ordered by the time of the block in which they occurred, in descending order (i.e., most recent first).
-   `where: {Transfer: {Currency: {Fungible: false, SmartContract: {is: "0x005e6b6776108f4c9e9c5c1259b9554036f8d55e"}}}}` specifies the conditions for the transfers to be retrieved. In this case, it specifies that the transfers must involve a non-fungible token (Fungible: false) whose smart contract address is `0x005e6b6776108f4c9e9c5c1259b9554036f8d55e`.
-   `limit: {count: 20}` specifies that the query should only return the 20 most recent transfers that meet the specified conditions.

**Returned Data**
-   `Block.Hash`: The hash of the block in which the transfer occurred.
-   `Block.Number`: The number of the block in which the transfer occurred.
-   `Amount`: The amount of the NFT that was transferred.
-   `Currency.Name`: The name of the NFT's currency.
-   `Currency.Symbol`: The symbol of the NFT's currency.
-   `Currency.Native`: The native type of the NFT's currency.
-   `Sender`: The address of the sender of the transfer.
-   `Receiver`: The address of the receiver of the transfer.


