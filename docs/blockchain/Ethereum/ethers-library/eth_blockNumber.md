# eth_blockNumber

In this section, we will discuus the eth_blockNumber API endpoint that returns the latest block number of the blockchain.

<head>
  <meta name="title" content="eth_blockNumber API - Ethereum - Latest Block Information"/>
  <meta name="description" content="Retrieve the latest block number on the Ethereum blockchain using the eth_blockNumber API."/>
  <meta name="keywords" content="eth_blockNumber API,Ethereum latest block API,Ethereum blockchain API,block number retrieval,eth_blockNumber documentation,Ethereum web3 API,latest block data,blockchain status"/>
  <meta name="robots" content="index, follow"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="language" content="English"/>

  <meta property="og:type" content="website" />
  <meta
    property="og:title"
    content="How to Retrieve the Latest Ethereum Block Number with eth_blockNumber API"
  />
  <meta
    property="og:description"
    content="Retrieve the latest block number on the Ethereum blockchain using the eth_blockNumber API."
  />

  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="How to Retrieve the Latest Ethereum Block Number with eth_blockNumber API"/>
  <meta property="twitter:description" content="Retrieve the latest block number on the Ethereum blockchain using the eth_blockNumber API."/>
</head>

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