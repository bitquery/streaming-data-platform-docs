---
title: "EVM Blocks Schema"
description: "Blocks: Bitquery EVM GraphQL schema reference with fields, filters, relationships, and query patterns. Copy GraphQL snippets for production apps."
---
Blocks API provide details on blocks.

You can use different [filters](/docs/graphql/filters/) to query data from different dimensions. You can find more examples [here](/docs/blockchain/Ethereum/blocks/blocks-api/)

Let's see an example of Blocks API to get the latest 10 blocks on Ethereum blockchain.

```graphql
{
  EVM(dataset: archive, network: eth) {
    Blocks(limit: { count: 10 }, orderBy: { descending: Block_Number }) {
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

You can see more example of Blocks api in [here](/docs/blockchain/Ethereum/blocks/blocks-api/).
