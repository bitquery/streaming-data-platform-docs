---
sidebar_position: 3
---

# Use Variables

When creating a query you can pass parameters to it, this way you can create a more **organized**, **readable** and **maintainable** code.
In the IDE there are two boxes that allow you to insert code, the first one is for queries and the second one is for variables. Below you will see a query that gets the details of a transaction, where the parameters are `network` and `tx_hash`.

![IDE Query Variables](/img/ide/query_variables.png)

> You can obtain the code through this link [Transaction Detail EVM | BSC](https://graphql.bitquery.io/ide/Transaction-Detail-EVM--BSC)


## Variable types

When we are going to pass the variables we have to define what type they are, some of them are:

- `String`
- `Int`
- `evm_network`
- `DateTime`
- `Float`
- `Boolean`

:::tip
You can make the variable required by adding an exclamation mark (`!`) at the end, if the variable is not defined, it will be counted as `null`.
:::