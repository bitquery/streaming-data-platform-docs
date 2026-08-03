---
title: "NFTs Tracking Across Chains"
description: "NFTs Tracking Across Chains: Bitquery documentation with GraphQL examples, real-time streams, and integration guidance. See examples in the Bitquery IDE."
---
# NFTs Tracking Across Chains

:::danger `BalanceUpdates` sunsets 10 August 2026
Queries on this page that use **`BalanceUpdates`** will stop working on **10 August 2026**. Migrate to the **`Balances`** and **`Holders`** cubes, which return the current balance directly instead of summing deltas.

See the [migration mapping](/docs/cubes/balances-cube/#migrating-from-balanceupdates) for the query-by-query translation.
:::


Effortlessly check NFTs across different chains. [You can run the query here](https://ide.bitquery.io/multi-chain-NFT-updates)

By using GraphQL Aliasing and Fragments to combine queries for multiple blockchains in a single API call we simplify complex data aggregation across various chains for more organized handling. In this query below we can NFT balances for the address `0xaba7161a7fb69c88e16ed9f455ce62b791ee4d03` across multiple chains. Replace it with a wallet address whose NFT balance you need.

```graphql

query MyQuery {
  binance: EVM(network: bsc, dataset: archive) {
    BalanceUpdates(
      limit: {count: 10}
      orderBy: {descending: BalanceUpdate_Amount}
      where: {BalanceUpdate: {Address: {is: "0xaba7161a7fb69c88e16ed9f455ce62b791ee4d03"}}, Currency: {Fungible: false}}
    ) {
      Currency {
        Fungible
        Symbol
        SmartContract
        Name
        HasURI
        Delegated
        Decimals
      }
      BalanceUpdate {
        Id
        Amount
        Address
        URI
      }
    }
  }
  eth: EVM(network: eth, dataset: archive) {
    BalanceUpdates(
      limit: {count: 10}
      orderBy: {descending: BalanceUpdate_Amount}
      where: {BalanceUpdate: {Address: {is: "0xaba7161a7fb69c88e16ed9f455ce62b791ee4d03"}}, Currency: {Fungible: false}}
    ) {
      Currency {
        Fungible
        Symbol
        SmartContract
        Name
        HasURI
        Delegated
        Decimals
      }
      BalanceUpdate {
        Id
        Amount
        Address
        URI
      }
    }
  }
  arbitrum: EVM(network: arbitrum, dataset: archive) {
    BalanceUpdates(
      limit: {count: 10}
      orderBy: {descending: BalanceUpdate_Amount}
      where: {BalanceUpdate: {Address: {is: "0xaba7161a7fb69c88e16ed9f455ce62b791ee4d03"}}, Currency: {Fungible: false}}
    ) {
      Currency {
        Fungible
        Symbol
        SmartContract
        Name
        HasURI
        Delegated
        Decimals
      }
      BalanceUpdate {
        Id
        Amount
        Address
        URI
      }
    }
  }
  optimism: EVM(network: optimism, dataset: archive) {
    BalanceUpdates(
      limit: {count: 10}
      orderBy: {descending: BalanceUpdate_Amount}
      where: {BalanceUpdate: {Address: {is: "0xaba7161a7fb69c88e16ed9f455ce62b791ee4d03"}}, Currency: {Fungible: false}}
    ) {
      Currency {
        Fungible
        Symbol
        SmartContract
        Name
        HasURI
        Delegated
        Decimals
      }
      BalanceUpdate {
        Id
        Amount
        Address
        URI
      }
    }
  }
}

```
