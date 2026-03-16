---
title: "Price Index Algorithm"
description: "How the Crypto Price API filters trades and computes token and currency prices using volume-weighted aggregation over the last 1 hour."
sidebar_position: 2
keywords:
  - "price index algorithm"
  - "volume weighted price"
  - "trade filtering"
  - "token price"
  - "currency price"
  - "DEX price aggregation"
---

# Price Index Algorithm

This page describes how the Price Index (Crypto Price API) filters trades and computes prices for tokens and currencies. It is the single source of truth for the algorithm in effect from **March 11 2026**.

## Which Trades Are Filtered Out

A trade is **excluded** from price and volume calculations only if:

1. **Zero amount**: The trade amount is 0.
2. **Below decimal precision**: The trade amount is so small that it would be lost to precision. For a token with `D` decimal places, trades with amount less than `10^D / 10,000` are excluded.

**Example**: USDT has 9 decimals. So `10^9 / 10,000 = 100,000` in the smallest units, i.e. **0.00001 USDT**. Any trade smaller than 0.00001 USDT is not accounted for, to avoid precision loss.

In other words: a trade must have at least 10,000 units of decimal precision (e.g. for 9 decimals, at least 0.00001 of the token).

## How Token Prices Are Determined 

Token prices are determined by **volume-weighted aggregation** over the **last 1 hour** of trading data.

### Step 1: Identify Pairs Where the Token Is Base

First we determine in which pairs the token acts as the **base** currency. A token can be quote in one pair (e.g. PUMP/WSOL) and base in another (e.g. WSOL/USDT); for token price we only use pairs where the token is **base**.

### Step 2: Aggregate Price Across DEX Pools for Each Pair

For each such pair we find the markets (DEX pools) where it is traded. If there are **several pools** for the same pair, the price for that pair is:

```
price(USD) = sum( price(p) × volume1h(p) ) / sum( volume1h(p) )
```

Where:

- **price(p)** = latest price of a trade in pool `p` (in USD; see [How Pool Prices Are Normalized to the Current Quote Token](#how-pool-prices-are-normalized-to-the-current-quote-token) below).
- **volume1h(p)** = volume in **base token** over the last 1 hour in pool `p`.

### Step 3: Aggregate to a Single Token Price

We then apply the same formula at **token** level: we weight all pair prices by their 1h volume (in base token), so the token price is the volume-weighted average over all pairs where the token is base.

![](/img/token-currency.png)

## How Currency Prices Are Determined

The same rules apply for **currencies**, but aggregation is done over **tokens** (volume and prices of each token representation) instead of over pairs and pools. So currency price is the volume-weighted combination of its token representations (e.g. WBTC, cbBTC, etc.) across chains.

## Volume and Amounts: Quote Token Amounts vs USD

When pricing is in USD (USD-base):

- **GraphQL** `Volume { Quote }` and **Protobuf** `Amounts.Quote` = **sum of quote token amounts** (e.g. sum of USDT, USDC, etc. amounts), **not** sum of USD.
- For **USD amounts** use **`Volume { Usd }`** (GraphQL) and **`Amounts.Usd`** (Protobuf) as before.

So for USD-based pricing, use `Volume.Usd` / `Amounts.Usd` when you need USD totals; use `Volume.Quote` / `Amounts.Quote` when you need the total in quote token units.

## How Pool Prices Are Normalized to the Current Quote Token

The **latest price of a trade in a pool** is not taken at the time that trade happened. It is **normalized** using the **current** price of the quote token at the time when the weighting is performed. So the quote side of the price is evaluated at weighting time, not at the time of the last trade in the pool. This keeps aggregated prices consistent with current quote token (e.g. stablecoin) valuation.
