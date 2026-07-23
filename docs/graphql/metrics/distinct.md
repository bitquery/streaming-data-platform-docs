---
sidebar_position: 6
title: "GraphQL Distinct Metric"
description: "Distinct in Bitquery GraphQL with clear syntax, examples, and tips for fast blockchain queries and streams. Keep queries fast with indexed filters."
---
#  Count Distinct

 ```count``` with ```distinct``` attribute calculates the unique values **in each set of dimensions**.
This query will count miners (unique coinbase) by every date:

```graphql
{
  EVM (dataset: archive){
    Blocks {
      Block {
        Date
      }
      miners: count(distinct: Block_Coinbase)
    }
  }
}
```

