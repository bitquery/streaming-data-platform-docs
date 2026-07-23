---
sidebar_position: 7
title: "Sum"
description: "Use the Bitquery GraphQL Sum metric in queries and aggregations."
---
#  Sum

 ```sum``` element in the query returns the sum of elements **in each set of dimensions**.

Example: 

```
{
  EVM (dataset: archive){
    MinerRewards {
      Block {
        Date
      }
      sum(of: Reward_Total)
      miners: count(distinct: Block_Coinbase)
    }
  }
}
```

```sum(of: Reward_Total)``` returns the sum of total rewards over every date.

