---
sidebar_position: 1
---

# Overview

Profit and Loss calculation in crypto is not easy to build. However, it is an important metric while evaluating the financial performance of an asset. In this tutorial, we will see how to build a simple profit and loss calculator in Javascript using Bitquery's [DEXTrades API](https://docs.bitquery.io/docs/examples/dextrades/dex-api/)

## Realized PnL
We will be calculating realised profit and loss. Realized PnL is calculated after traders have sold their holdings of a token. Only the executed price of the orders is taken into account in realized PnL. For this purpose, we will the weighted average of the buy price(WABP) in USD.

This is the formula we will be using:

```
WABP = sum(buyAmount*buyPriceInUSD)/sum(buyAmount)
pnl = sum(sellAmount*(sellPriceInUSD-WABP))
```

![Example](https://files.oaiusercontent.com/file-1nIzzD1ZGpoCrLAyWS219QD2?se=2024-10-22T10%3A47%3A22Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D85d6ea28-86bd-4e1a-9a12-a7eb5f4a9cfd.webp&sig=2iik69vD68j7G0RX9qgaB4a20oxAkmCXkYXmYLkaxeY%3D)

Click  [here](https://docs.bitquery.io/docs/usecases/p-l-product/pnl) to get started with the project.
