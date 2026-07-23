---
title: "Algorand Blocks API - Query Blocks by Proposer"
sidebar_label: Algorand Blocks API
description: "Algorand Blocks API - Query Blocks by Proposer: query and stream Algorand on-chain data with Bitquery GraphQL examples for developers."
keywords:
  - Algorand blocks API
  - Algorand block explorer API
  - Algorand proposer API
  - Algorand block rewards API
  - Algorand GraphQL
  - Algorand block height query
  - Bitquery Algorand
---
# Algorand Blocks API

The Blocks API returns block-level data on Algorand: height, hash, protocol version, proposer, seed, reward, and timestamp. Use it to drive explorer front-ends, monitor chain progression, track validator participation, or aggregate block rewards over time.

:::info Endpoint
Algorand GraphQL queries are served at `https://graphql.bitquery.io`.
:::

## Get recent blocks proposed by an address

Returns the 10 most recent blocks proposed by a specific address after a given date, ordered by timestamp descending. Swap the `proposer` filter for a height or time window when you need a broader scan.

```graphql
{
  algorand(network: algorand) {
    blocks(
      date: {after: "2023-08-05"}
      options: {desc: "timestamp.iso8601", limit: 10}
      proposer: {is: "PROPOSER_ADDRESS_HERE"}
    ) {
      currentProtocol
      hash
      height
      proposer {
        address
      }
      reward
      seed
      timestamp {
        iso8601
      }
    }
  }
}
```

Remove the `proposer` filter to query all blocks in the date range, or adjust `limit` and `date` for different windows.

## Sum block rewards earned by a proposer

Aggregates total block rewards for a proposer address. Add a `date` filter to limit the time range, or swap `sum` for `average` to get mean reward per block.

```graphql
{
  algorand(network: algorand) {
    blocks(
      proposer: {is: "PROPOSER_ADDRESS_HERE"}
    ) {
      reward(calculate: sum)
    }
  }
}
```

## Related resources

- [Algorand Transactions API](/docs/blockchain/Algorand/algorand-transactions-api) — per-block transaction details and daily counts
- [Algorand Address API](/docs/blockchain/Algorand/algorand-address-api) — proposer and wallet balances
