---
sidebar_position: 10
---

# Combined Queries

Several queries can be combined and return results in one request:

* queries to different databases and blockchains can be combined in one query;
* queries to different cubes can be combined as well

Example of query returning max block for ETH and BSC networks:

```graphql
query {
  eth: EVM(network: eth) {
    Blocks {
      Block{
        Number(maximum: Block_Number)
      }
    }
  }
  bsc: EVM(network: bsc) {
    Blocks {
      Block{
        Number(maximum: Block_Number)
      }
    }
  }
}
```

:::tip
Use [Aliases](metrics/alias) to name the elements if needed
:::

:::danger
Subscriptions and queries can not be combined
:::