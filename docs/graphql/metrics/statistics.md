---
sidebar_position: 7
---

#  Statistics

##  Over One Variable

Elements that calculate different statistics with the self-descriptive names:

* ```average```
* ```standard_deviation```
* ```dispersion```
* ```median```
* ```entropy```
* ```skew```
* ```kurtosis```
* ```quantile``` ( have ```level``` argument from 0 to 1, 0.5 is median)

For example to calculate average reward:

```
average(of: Reward_Total)
```


##  Over Two Variables

Some statistics require 2 variables. 
One variable is specified in ```of``` attribute, the other in ```with``` attribute, for example:

```
correlation(of: Reward_Total with: Block_GasUsed)
```

Elements that calculate different statistics with the self-descriptive names:

* ```covariance```
* ```correlation```
* ```contingency```
* ```rank_correlation```
* ```cramers```
* ```cramers_bias_corrected```
* ```theils```

:::tip
You can use [condition](where) to any of these metrics
:::
