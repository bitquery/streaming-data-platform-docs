# NFT API

Non-Fungible Tokens (NFTs) are digital assets with unique identification codes that cannot be exchanged for other tokens on a one-to-one basis. NFTs have gained significant popularity in recent years, with the growth of digital art, collectables, and gaming.

Bitquery's  APIs help you extract and analyze NFT data from various blockchain networks. Below are some examples of NFT queries that can be performed using Bitquery's platform:

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
-   `dataset`: This specifies the dataset to use. In this case, the dataset is "combined".
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


## All the NFT collections owned by an address

```
query MyQuery {
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

## All NFT transfers in a block

## All the NFTs owned by an address cross chain

## All the NFTs from a collection

## All transfers of an NFT collection


## All transfers of an NFT


## NFT Metadata

## Get the owner of an NFT

## Get the owners of an NFT collection
