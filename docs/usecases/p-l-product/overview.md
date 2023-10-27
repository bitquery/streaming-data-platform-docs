---
sidebar_position: 1
---

# Overview

PnL in crypto is not easy to build. But is is important metric while evaluating the financial performance of an asset. In this tutorial we will see how to build a simple profit and loss calculator in Python using Bitquery's [balanceUpdates API](https://docs.bitquery.io/docs/examples/balances/balance-api/)

## Realized PnL
We will be calculating realised profit and loss. Realized PnL is calculated after traders have sold their holdings of a token. Only the executed price of the orders is taken into account in realized PnL.

This is the formula we will be using:

```
change_in_balance = final_balance - initial_balance
change_in_price = final_price - initial_price
pnl = change_in_balance * change_in_price
```

Go to https://docs.bitquery.io/docs/usecases/p-l-product/balanceUpdates to get started with the project.
