---
sidebar_position: 6
---

# Calculations

Attributes ```maximum``` ```minimum``` ```where``` can be appended to an element in query.
They convert the value to the metric, calculated by the following rules:

* if ```maximum``` or ```minimum``` is added, then the value of the element corresponds to max / min of the provided argument
* if ```where``` attribute is defined, then the value of element is taken with the provided condition
* if ```where``` attribute is used with any of ```maximum``` or ```minimum```, then max / min taken conditionally

## Examples

Maximum block number:

```
Number(maximum: Block_Number)
```

Number of the block with the maximum gas used:

```
Number(maximum: Block_GasUsed)
```

Number of the block with the given root hash:

```
Number(where: {Block: {Root: {is: "..."}}})
```

Number of the block with the maximum gas used in specific date:

```
Number(maximum: Block_GasUsed where: {Block: {Date:{is: "2022-01-01"}}})
```
:::tip
Use ```where``` with some always-true condition (say, ChainId equal 1) to get **any** value of element
:::

:::tip 
Use [Aliases](/docs/graphql/metrics/alias) to name the elements if needed
:::