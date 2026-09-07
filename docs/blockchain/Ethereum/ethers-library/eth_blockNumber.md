---
title: "Get the Latest Block Number with Bitquery Instead of eth_blockNumber"
description: "Latest Ethereum block number and time by GraphQL query or WebSocket stream, with the same call for BSC, Base and other EVM chains."
keywords:
  - eth_blockNumber
  - latest block number Ethereum API
  - Ethereum block number GraphQL
  - current block number BSC
  - block height stream
---

import FAQ from "@site/src/components/FAQ";

# Get the Latest Block Number with Bitquery Instead of eth_blockNumber

`eth_blockNumber` is the JSON-RPC call that returns the height of the newest block. On Bitquery the same answer comes from the `Blocks` cube in two shapes: a query that returns the newest block with its timestamp, and a subscription that pushes a row every time a block is produced, so you never poll. Both run on Ethereum and, by changing `network`, on BNB Chain, Base, Arbitrum, Optimism, Polygon and Robinhood Chain. No node, no RPC key: an access token from [account.bitquery.io](https://account.bitquery.io/) and the same query runs in the [IDE](https://ide.bitquery.io) on a free account.

## Latest block number as a query

One row, sorted by block number descending. `Time` is the block timestamp, so the same row tells you how fresh the tip is.

```graphql
{
  EVM(network: eth) {
    Blocks(limit: { count: 1 }, orderBy: { descending: Block_Number }) {
      Block {
        Number
        Time
      }
    }
  }
}
```

## Latest block number as a stream

Every new Ethereum block arrives as one message. Open it in the IDE [here](https://ide.bitquery.io/eth_blockNumber-stream).

```graphql
subscription {
  EVM(network: eth) {
    Blocks {
      Block {
        Number
      }
    }
  }
}
```

## Other EVM chains

Change the network name and nothing else. This is the BNB Chain stream, saved [here](https://ide.bitquery.io/eth_blockNumber-stream-bsc); `base`, `arbitrum`, `optimism`, `matic` and `robinhood` work the same way.

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

## What else the Blocks cube returns

Add fields to the same selection: `Block { Hash ParentHash Time Number GasUsed GasLimit BaseFee Difficulty }` and `TxCount`. That covers `eth_getBlockByNumber` for the header, without a second call. For the transactions inside a block, filter the `Transactions` cube on `Block: { Number: { is: "..." } }`; the [EVM blocks schema](/docs/schema/evm/blocks) lists every field.

<FAQ
  items={[
    { q: "How do I get the latest Ethereum block number without an RPC node?", a: "Query the Blocks cube with limit 1 and orderBy descending Block_Number; the row carries the number and the timestamp. Or open a subscription on Blocks to receive each new block as it is produced." },
    { q: "Is the block number from Bitquery the same as eth_blockNumber from a node?", a: "It is the height of the newest block Bitquery has indexed, which trails the chain tip by the indexing delay of the realtime pipeline. For most uses that is a matter of seconds; for chain-tip-critical logic, compare with your node." },
    { q: "Does this work on chains other than Ethereum?", a: "Yes. The Blocks cube exists under EVM(network: ...) for BNB Chain, Base, Arbitrum, Optimism, Polygon and Robinhood Chain, and Solana has its own Blocks cube under the Solana root." },
    { q: "Can I get the block hash and gas fields with the number?", a: "Yes. Add Hash, ParentHash, Time, GasUsed, GasLimit, BaseFee or Difficulty to the Block selection, and TxCount for the number of transactions." },
  ]}
/>

## Related pages

- [EVM blocks schema](/docs/schema/evm/blocks)
- [debug_traceCall with Bitquery](/docs/blockchain/Ethereum/ethers-library/debug_traceCall)
- [WebSocket subscriptions](/docs/subscriptions/subscription)
- [Ethereum API hub](/docs/blockchain/Ethereum/)
