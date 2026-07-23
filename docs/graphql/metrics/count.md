---
sidebar_position: 6
title: "Count"
description: "Use the Bitquery GraphQL Count metric in queries and aggregations."
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

