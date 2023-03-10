---
sidebar_position: 6
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



