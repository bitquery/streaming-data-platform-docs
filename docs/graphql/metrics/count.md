---
sidebar_position: 6
title: "GraphQL Count Metric"
description: "Use Bitquery’s count metric in GraphQL to aggregate blockchain events, trades, transfers, and other on-chain activity. See examples in the Bitquery IDE."
---
#  Count

 ```count``` element in the query returns the total count of elements **in each set of dimensions**.
This query will count blocks by every date:

```graphql
{
  EVM (dataset: archive){
    Blocks {
      Block {
        Date
      }
      count
    }
  }
}
```

