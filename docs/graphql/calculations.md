---
sidebar_position: 6
title: "GraphQL Calculations and Expressions"
description: "GraphQL Calculations and Expressions in Bitquery GraphQL with clear syntax, examples, and tips for fast blockchain queries and streams."
---
# Calculations

Attributes ```maximum``` ```minimum``` ```where``` can be appended to an element in query.
They convert the value to the metric, calculated by the following rules:

* if ```maximum``` or ```minimum``` is added, the element returns **its own value on the row where the provided argument is maximal / minimal**. This is an *argmax*, not the maximum of the argument itself: `Number(maximum: Block_GasUsed)` returns the block **number** of the highest-gas block, not the gas figure.
* if ```where``` attribute is defined, then the value of element is taken with the provided condition
* if ```where``` attribute is used with any of ```maximum``` or ```minimum```, then max / min taken conditionally

:::caution On Trading cubes the argument is `if`, not `where`
Field-level `where:` is **rejected** on the `Trading` cubes with
`Unknown argument "where"`. Use `if:` instead, which takes the same filter shape:

```
Price { Ohlc { Close(maximum: Block_Time if: {Trade: {Side: {is: "Buy"}}}) } }
```

The always-true-`where` tip below therefore does not apply to Trading cubes.
:::

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

:::note Selectors sharing one key resolve to the same row
Several selectors keyed on the **same** argument all read from that one row, so they are mutually
consistent. Mixing keys is what breaks coherence: `Open(minimum: Block_Time)` and
`High(maximum: Price_Ohlc_High)` come from two different rows by design.
:::
:::tip
Use ```where``` with some always-true condition (say, ChainId equal 1) to get **any** value of element
:::

:::tip 
Use [Aliases](/docs/graphql/metrics/alias) to name the elements if needed
:::
