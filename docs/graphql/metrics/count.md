---
sidebar_position: 3
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



