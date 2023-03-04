---
sidebar_position: 2
---

# Blocks

Blocks API provide details on blocks. 

You can use different[filters](docs/graphql/filters.md) to query data from different dimensions.

Let's see an example of Blocks API to get the latest 10 blocks on Ethereum blockchain.

```graphql
{
  EVM(dataset: combined, network: eth) {
    Blocks(limit: {count: 10}, orderBy: {descending: Block_Number}) {
      Block {
        Time
        Date
        Number
        Hash
      }
    }
  }
}
```

You can see more example of Blocks api in [here](docs/examples/blocks/blocks-api.md).