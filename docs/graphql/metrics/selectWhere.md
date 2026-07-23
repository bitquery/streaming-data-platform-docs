---
sidebar_position: 5
title: "Select Rows by GraphQL Metric"
description: "Select By Metric in Bitquery GraphQL with clear syntax, examples, and tips for fast blockchain queries and streams. Keep queries fast with indexed filters."
---
#  Select By Metric

Metric value can be used to filter out the result by  ```selectIf``` attribute to 
define the condition applied for results.
This way you can filter the results by the metirc values.

This expression filters the balances just by positive values:
```
sum(of: BalanceUpdate_Amount selectWhere: {gt: "0"})
```

:::note
You can combine this attribute with other attributes, including conditions in ```if```
:::

