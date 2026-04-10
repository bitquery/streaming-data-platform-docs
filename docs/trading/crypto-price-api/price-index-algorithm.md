---
title: "Price Index Algorithm"
description: "How the Crypto Price API filters trades and computes token and currency prices using exponentially decayed volume weighting over the last hour (50% weight at the window midpoint)."
sidebar_position: 2
keywords:
  - "price index algorithm"
  - "volume weighted price"
  - "exponential decay"
  - "trade filtering"
  - "token price"
  - "currency price"
  - "DEX price aggregation"
---

# Price Index Algorithm

This page describes how the Price Index (Crypto Price API) filters trades and computes prices for tokens and currencies. It is the single source of truth for the algorithm in effect from **April 2026**.

## Which Trades Are Filtered Out

A trade is **excluded** from price and volume calculations only if:

1. **Zero amount**: The trade amount is 0.
2. **Below decimal precision**: The trade amount is so small that it would be lost to precision. For a token with `D` decimal places, trades with amount less than `10^D / 10,000` are excluded.

**Example**: USDT has 9 decimals. So `10^9 / 10,000 = 100,000` in the smallest units, i.e. **0.00001 USDT**. Any trade smaller than 0.00001 USDT is not accounted for, to avoid precision loss.

In other words: a trade must have at least 10,000 units of decimal precision (e.g. for 9 decimals, at least 0.00001 of the token).

## Time Window and Volume Weighting

Price and volume aggregation use a **1-hour rolling** window.

Each trade (or price entry) contributes to volume weighting with a factor **`exp(-decayRate × age)`**, where **age** is how far back in time the entry lies within that window (0 at the newest edge, increasing toward the older edge). That gives **exponential decay** toward older data: the **most recent** entries contribute **~100%** of their raw volume, while an entry at the **midpoint** of the window contributes **50%** of its volume (**50% exponential average** profile relative to the window).

<img alt="Volume weight decays from the newest edge of the 1-hour window toward older trades" src="/img/diagrams/decay_pricealgo.png" style={{ maxWidth: '640px', width: '100%', height: 'auto' }} />

Aggregations (pool, token, and **non-stablecoin** currency) use these **decayed** volume contributions instead of raw sums over the window.

<img alt="Trade filtering, exponential decay within the 1-hour window, and effective volume per market" src="/img/diagrams/internal_weights.png" style={{ maxWidth: '640px', width: '100%', height: 'auto' }} />

## How Token Prices Are Determined

Token prices are determined by **volume-weighted aggregation** over eligible trades in the **last hour**, using decayed volumes as above.

### Step 1: Identify pairs where the token is base

We determine in which pairs the token acts as the **base** currency. A token can be quote in one pair (e.g. PUMP/WSOL) and base in another (e.g. WSOL/USDT); for token price we only use pairs where the token is **base**.

### Step 2: Aggregate from pools to token price

For each such pair we use the markets (DEX pools) where it is traded. Conceptually, for pools that trade the same logical pair, the combined price uses **volume-weighted** pooling with **decayed** base-token volumes over the 1-hour window:

```
price(USD) = sum( price(p) × effectiveVolume(p) ) / sum( effectiveVolume(p) )
```

Where:

- **price(p)** = latest price of a trade in pool `p` (in USD; see [How Pool Prices Are Normalized to the Current Quote Token](#how-pool-prices-are-normalized-to-the-current-quote-token) below).
- **effectiveVolume(p)** = sum of **base-token** amounts for trades in pool `p` in the window, each multiplied by **`exp(-decayRate × age)`** for that trade.

The **token** price is then the same style of **volume-weighted** combination across all pairs where the token is base, again using decayed volumes.

<img alt="Multi-market aggregation to token price, market sort, volume-weighted blend, and API ranking" src="/img/diagrams/external_weights.png" style={{ maxWidth: '640px', width: '100%', height: 'auto' }} />

## How Currency Prices Are Determined

The same rules apply for **non-stablecoin** currencies: a **1-hour** window, **exponentially decayed** volume weights (50% at the midpoint), and aggregation over **tokens** (volume and prices of each token representation) instead of over pairs and pools. Currency price is the volume-weighted combination of its token representations (e.g. WBTC, cbBTC, etc.) across chains.

**Stablecoins** are **not** included in this trade-based currency path. Processing skips them in the currency aggregation loop that builds prices from DEX trades; stablecoin USD (or peg) prices come from a **separate pipeline** fed by an **external** spot source, **not** from decay-weighted DEX trade aggregation.

**Ranking** is **not** exposed on currency-level responses. Internal logic may still derive token→currency weights while computing prices, but only **pair** and **token** updates are given a **`Ranking`** on the outbound message—do not look for **`Ranking`** on currency entities in the API.

## Ranking on Trades, Pairs, and Tokens

The API for **Trades**, **Pairs**, and **Tokens** exposes a **Ranking** object with two fields. It does **not** appear on **currencies** (see [How Currency Prices Are Determined](#how-currency-prices-are-determined)):

| Field        | Meaning                                                                                                                                                                                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Position** | **1-based** index describing **priority** when multiple sources contribute: order of the **pair** in **token price**, or of the **token** among representations that feed a **non-stablecoin** currency blend. Lower number means higher priority in that ordering. |
| **Weight**   | Float in **`[0, 1]`** — this pool's share of the total decay-weighted volume at the current moment. Reflects how much this pool drives the blended token price. Weights across all contributing pools for a given token sum to 1.                                   |

Use **Position** for display order or precedence; use **Weight** for how much each contributor matters in the blended price.

### Example: filter by ranking position

Filter pairs in **`where`** using **`Ranking.Position`** when you only want rows that are among the top contributors to the token price (for example positions **1**, **2**, and **3**). Request **`Ranking { Position Weight }`** on each pair to see both the rank and that pair’s **relative weight** in the blend. **`Weight`** is normally used as a returned field rather than as a filter.

```graphql
{
  Trading {
    Pairs(
      where: {
        Ranking: { Position: { in: [1, 2, 3] } }
        Interval: { Time: { Duration: { eq: 3600 } } }
        Block: { Time: { since_relative: { hours_ago: 1 } } }
      }
      limit: { count: 10 }
    ) {
      Block {
        Time(maximum: Block_Time)
      }
      Currency {
        Id
      }
      Token {
        Id
      }
      QuoteToken {
        Id
      }
      Market {
        Id
        Protocol
        Address
      }
      Price {
        Ohlc {
          Close
        }
      }
      Ranking {
        Position
        Weight
      }
      Interval {
        Time {
          Start
          End
        }
      }
    }
  }
}
```

## Volume and Amounts: Quote Token Amounts vs USD

When pricing is in USD (USD-base):

- **GraphQL** `Volume { Quote }` and **Protobuf** `Amounts.Quote` = **sum of quote token amounts** (e.g. sum of USDT, USDC, etc. amounts), **not** sum of USD.
- For **USD amounts** use **`Volume { Usd }`** (GraphQL) and **`Amounts.Usd`** (Protobuf) as before.

So for USD-based pricing, use `Volume.Usd` / `Amounts.Usd` when you need USD totals; use `Volume.Quote` / `Amounts.Quote` when you need the total in quote token units.

## How Pool Prices Are Normalized to the Current Quote Token

The **latest price of a trade in a pool** is not taken at the time that trade happened. It is **normalized** using the **current** price of the quote token at the time when the weighting is performed. So the quote side of the price is evaluated at weighting time, not at the time of the last trade in the pool. This keeps aggregated prices consistent with current quote token (e.g. stablecoin) valuation.
