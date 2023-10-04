---
title: "EVM Uncle Blocks API"
---

<head>
<meta name="title" content="EVM Uncle Blocks API"/>

<meta name="description" content="Get information on uncle blocks including historical and realtime blocks, bloom, hash and more "/>

<meta name="keywords" content="EVM uncle blocks, EVM uncle blocks per second, EVM uncle blocks analysis, ERC-20 uncle blocks, EVM token transaction data, EVM uncle blocks history, EVM uncle blocks API, EVM uncle blocks tracking, EVM uncle blocks monitoring, ERC-20 uncle blocks analytics"/>

<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />

<meta property="og:title" content="EVM Uncle Blocks API" />

<meta property="og:description" content="Get information on uncle blocks including historical and realtime blocks, bloom, hash and more "/>

### What are Uncle Blocks?

Uncle blocks, also known as "orphan blocks", are blocks on the blockchain that are not included in the main blockchain. Uncle blocks are still valid blocks, but they were not selected to be included in the main blockchain by the network consensus algorithm.

Please note that after the September 2022 merge of PoS Ethereum, validators will be pre-selected to validate the blocks. Hence, there will be no uncle blocks created.

### Why do Uncle Blocks occur?

Uncle blocks occur due to network latency issues or network forks that can cause two or more miners to solve a block at the same time. Only one of these blocks can be included in the main blockchain, while the others become uncle blocks.

### What is the significance of Uncle Blocks?

Uncle blocks are significant because they can have an impact on the security and efficiency of the Ethereum blockchain. When uncle blocks are created, they reduce the rewards that miners receive for their work, and can also reduce the overall efficiency of the blockchain.

### How can I access Uncle Blocks data?

You can access Uncle Blocks data using our API. Here's an example GraphQL query to retrieve Uncle Blocks data:

```graphql
query MyQuery {
  EVM(dataset: archive, network: eth) {
    Uncles(limit: { count: 10 }, orderBy: { descending: Uncle_Block_Time }) {
      Block {
        Time
      }
      Uncle {
        Index
        Block {
          TxHash
          Time
          Number
          ParentHash
          Bloom
          Date
        }
      }
    }
  }
}
```

- `Block`: Returns the details of the block that included the uncle block.

  - `Time`: Returns the time that the block was created.

- `Uncle`: Returns the details of the uncle block.

  - `Index`: Returns the index of the uncle block.
  - `Block`: Returns the details of the uncle block itself.

    - `TxHash`: Returns the hash of the uncle block's transaction.
    - `Time`: Returns the time that the uncle block was created.
    - `Number`: Returns the number of the uncle block.
    - `ParentHash`: Returns the hash of the uncle block's parent block.
    - `Bloom`: Returns the bloom filter of the uncle block.
    - `Date`: Returns the date that the uncle block was created.
