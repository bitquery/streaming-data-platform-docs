---
sidebar_position: 7
title: "GraphQL Sum Metric"
description: "Sum trade amounts and transfer volumes in Bitquery GraphQL aggregates to power clear blockchain analytics dashboards. See examples in the Bitquery IDE."
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

