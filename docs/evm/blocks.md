---
title: "EVM Blocks API"
---

<head>
<meta name="title" content="EVM Blocks API"/>

<meta name="description" content="Access Ethereum block data, including gas limits, rewards, and more. Get the latest 10 blocks with the EVM Blocks API."/>

<meta name="keywords" content="Ethereum blockchain, Block information, Block data retrieval, Ethereum network, Block height, Gas limit, Block rewards, Timestamp, Block difficulty, Transaction count, Uncle count, Total difficulty, Block size, Miner, Block hash, Block date, Block filtering options, Block aggregation, Ethereum analytics, Ethereum development"/>

<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />

<meta property="og:title" content="EVM Blocks API" />

<meta property="og:description" content="Access Ethereum block data, including gas limits, rewards, and more. Get the latest 10 blocks with the EVM Blocks API." />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />

<meta property="twitter:title" content="EVM Blocks API" />

<meta property="twitter:description" content="Access Ethereum block data, including gas limits, rewards, and more. Get the latest 10 blocks with the EVM Blocks API." />
</head>

Blocks API provide details on blocks.

You can use different [filters](docs/graphql/filters.md) to query data from different dimensions. You can find more examples [here](/docs/examples/blocks/blocks-api)

Let's see an example of Blocks API to get the latest 10 blocks on Ethereum blockchain.

```graphql
{
  EVM(dataset: combined, network: eth) {
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

You can see more example of Blocks api in [here](docs/examples/blocks/blocks-api.md).
