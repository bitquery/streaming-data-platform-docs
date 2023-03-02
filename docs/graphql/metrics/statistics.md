---
sidebar_position: 7
---

#  Statistics

##  Over One Variable

Elements that calculate different statistics with the self-descriptive names:

* ```average``` calculates the arithmetic mean.
* ```standard_deviation``` square root of dispersion for a set of values
* ```dispersion``` dispersion for a set of values ( Σ((x - x̅)^2) / n ), , where n is the sample size and x̅is the average value of x
* ```median``` median of a numeric data sample
* ```entropy```  calculates [Shannon entropy](https://en.wikipedia.org/wiki/Entropy_(information_theory)) of a set of values
* ```skew``` [skewness](https://en.wikipedia.org/wiki/Skewness) of a set of values
* ```kurtosis``` [kurtosis](https://en.wikipedia.org/wiki/Kurtosis) of a set of values
* ```quantile```approximate [quantile](https://en.wikipedia.org/wiki/Quantile) of a numeric data sequence ( have ```level``` argument from 0 to 1, 0.5 is median)

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

* ```covariance``` value of Σ((x - x̅)(y - y̅)) / n
* ```correlation``` pearson correlation coefficient: Σ((x - x̅)(y - y̅)) / sqrt(Σ((x - x̅)^2) * Σ((y - y̅)^2))
* ```contingency``` calculates the [contingency coefficient](https://en.wikipedia.org/wiki/Contingency_table#Cram%C3%A9r's_V_and_the_contingency_coefficient_C), a value that measures the association between two columns in a table. The computation is similar to the cramersV function but with a different denominator in the square root
* ```rank_correlation``` rank correlation coefficient of the ranks of x and y. The value of the correlation coefficient ranges from -1 to +1. If less than two arguments are passed, the function will return an exception. The value close to +1 denotes a high linear relationship, and with an increase of one random variable, the second random variable also increases. The value close to -1 denotes a high linear relationship, and with an increase of one random variable, the second random variable decreases. The value close or equal to 0 denotes no relationship between the two random variables.
* ```cramers``` [Cramér's V](https://en.wikipedia.org/wiki/Cram%C3%A9r%27s_V) (sometimes referred to as Cramér's phi) is a measure of association between two columns in a table. The result of the cramers function ranges from 0 (corresponding to no association between the variables) to 1 and can reach 1 only when each value is completely determined by the other. It may be viewed as the association between two variables as a percentage of their maximum possible variation.
* ```cramers_bias_corrected``` Cramér's V is a measure of association between two columns in a table. The result of the cramersV function ranges from 0 (corresponding to no association between the variables) to 1 and can reach 1 only when each value is completely determined by the other. The function can be heavily biased, so this version of Cramér's V uses the bias correction.
* ```theils``` calculates the [Theil's U uncertainty coefficient](https://en.wikipedia.org/wiki/Contingency_table#Uncertainty_coefficient), a value that measures the association between two columns in a table. Its values range from −1.0 (100% negative association, or perfect inversion) to +1.0 (100% positive association, or perfect agreement). A value of 0.0 indicates the absence of association.

:::tip
You can use [condition](where) to any of these metrics
:::
