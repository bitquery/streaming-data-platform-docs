---
sidebar_position: 5
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



