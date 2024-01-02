# NFTs Tracking Across Chains

Effortlessly check NFTs across different chains. [You can run the query here](https://ide.bitquery.io/multi-chain-NFT-updates)

By using GraphQL Aliasing and Fragments to combine queries for multiple blockchains in a single API call we simplify complex data aggregation across various chains for more organized handling. In this query below we can NFT balances for the address `0xaba7161a7fb69c88e16ed9f455ce62b791ee4d03` across multiple chains. Replace it with a wallet address whose NFT balance you need.


```

query MyQuery {
  binance: EVM(network: bsc, dataset: combined) {
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
  eth: EVM(network: eth, dataset: combined) {
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
  arbitrum: EVM(network: arbitrum, dataset: combined) {
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
  optimism: EVM(network: optimism, dataset: combined) {
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
