---
sidebar_position: 4
title: "Conditional Metrics"
description: "Conditional Metrics in Bitquery GraphQL with clear syntax, examples, and tips for fast blockchain queries and streams. See examples in the Bitquery IDE."
---
#  Conditional Metrics

Metrics have ```if``` attribute to define the condition for metric execution.
This way you can calculate metrics, that only refer to the part of the dataset you request.

This expression returns count of blocks with the non-zero gas used:
```
count(distinct: Block_Number if: {Block: {GasUsed: {gt: "0"}}})
```

:::note
The ```if``` attribute has the same structure as [filters](/docs/graphql/filters), and applies to
almost all metrics — see the exceptions below.
:::

## Example: buy and sell statistics in one row

`if:` is what lets you split a group without splitting the query. On the Trading cube:

```graphql
{
  Trading {
    Trades(
      where: { Pair: { Market: { Network: { is: "Solana" } } }, Block: { Time: { since: "...", till: "..." } } }
      limitBy: { by: Trader_Address, count: 1 }
      limit: { count: 100 }
    ) {
      Trader { Address }
      buys:     count(if: { Side: { is: "Buy" } })
      sells:    count(if: { Side: { is: "Sell" } })
      bought:   sum(of: AmountsInUsd_Quote, if: { Side: { is: "Buy" } })
      sold:     sum(of: AmountsInUsd_Quote, if: { Side: { is: "Sell" } })
      PnL:      calculate(expression: "$sold - $bought")
    }
  }
}
```

`if:` also accepts **string dimensions that the `of:` / `with:` arguments reject**, so it is the
escape hatch that makes much of the metric surface usable on categorical columns.

## Exceptions and limits

:::warning `any:` inside `if:` crashes the request
Nesting an `any:` combinator inside an `if:` filter returns
`runtime error: invalid memory address or nil pointer dereference`. Express the alternation a
different way — usually as two separate aliased metrics.
:::

Three metrics do **not** accept `if:` at all: `gini`, `nakamoto` and `theil_index`. Every other
metric, including `entropy`, does.

Combining `if:` with [`selectWhere`](/docs/graphql/metrics/selectWhere) gives a conditional
HAVING — filtering groups on a **slice** of their own data, such as wallets whose buy-side
volume alone clears a threshold.

:::tip
Use [Aliases](/docs/graphql/metrics/alias) to name these metrics
:::

