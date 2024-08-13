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

```
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