---
sidebar_position: 1
---

# Blocks API

##  Latest blocks in the Ethereum network

This GraphQL query retrieves the latest blocks in real time on the ethereum network that were mined after March 3rd, 2023. It includes information on the block number, hash, mix digest, date, base fee, coinbase, transaction hash, transaction count, and result (including gas and errors). You can find the query [here](https://graphql.bitquery.io/ide/Latest-blocks-in-the-Ethereum-network_1)

```
subscription {
  EVM(network: eth) {
    Blocks(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {Block: {Date: {after: "2023-03-03"}}}
    ) {
      Block {
        Number
        Hash
        MixDigest
        Date
        BaseFee
        Coinbase
        TxHash
        TxCount
        Result {
          Errors
          Gas
        }
      }
    }
  }
}
```


Parameters:

-   `network`: The blockchain network to query (e.g., eth, bsc, polygon).
-   `limit`: The maximum no of blocks to retrieve, here it is set to 10.
-   `orderBy`: The field and direction to sort the results (e.g., `orderBy: {descending: Block_Time}`).
-   `where`: The conditions to filter the blocks by (e.g., `where: {Block: {Date: {after: "2023-03-03"}}}`).

Results:

-   `Block`: The block information, including the block number, hash, mix digest, date, base fee, coinbase address, transaction hash, transaction count, and result information.
-   `Result`: The result information of the block, including any errors encountered and the total gas used.
