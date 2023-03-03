# NFT API

Non-Fungible Tokens (NFTs) are digital assets with unique identification codes that cannot be exchanged for other tokens on a one-to-one basis. NFTs have gained significant popularity in recent years, with the growth of digital art, collectables, and gaming.

Bitquery's  APIs help you extract and analyze NFT data from various blockchain networks. Below are some examples of NFT queries that can be performed using Bitquery's platform:

## NFT Holders for a project


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


## All NFT transfers in a block

## All the NFTs owned by an address cross chain

## All the NFTs from a collection

## All transfers of an NFT collection


## All transfers of an NFT


## NFT Metadata

## Get the owner of an NFT

## Get the owners of an NFT collection
