---
title: "Ethereum Eth Blocknumber"
description: "Ethereum Eth Blocknumber: query and stream Ethereum on-chain data with Bitquery GraphQL examples for developers. See examples in the Bitquery IDE."
---
# eth_blockNumber

In this section, we will discuus the eth_blockNumber API endpoint that returns the latest block number of the blockchain.

## Latest Block Number
[This](https://ide.bitquery.io/eth_blockNumber-stream) subscription returns the latest block number.

``` graphql
subscription {
  EVM {
    Blocks {
      Block {
        Number
      }
    }
  }
}

```

## Latest Block Number for Different Network

[This](https://ide.bitquery.io/eth_blockNumber-stream-bsc) returns the latest `Block Number` for the different Network, namely `bsc`.

```graphql
subscription {
  EVM(network: bsc) {
    Blocks {
      Block {
        Number
      }
    }
  }
}

```
