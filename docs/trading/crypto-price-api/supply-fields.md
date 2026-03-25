---
title: "Supply Fields Reference"
description: "Definitions for Supply metrics (circulating, total, max supply, market cap, FDV) on the Crypto Price API Tokens, Currency, and Pairs cubes."
sidebar_position: 3
keywords:
  - "crypto price api supply"
  - "circulating supply"
  - "total supply"
  - "market cap"
  - "fully diluted valuation"
  - "fdv"
---

# Supply fields reference

The **`Supply`** object appears on the **Tokens**, **Currency**, and **Pairs** cubes with the same field names. Values describe the **underlying asset** (**currency**), not a specific pool or DEX pair.

- On **Tokens** and **Pairs**, **price** and **volume** on the row are **chain- or pair-specific**; **`Supply`** is still **currency-level** (aggregated for the asset across the platform’s reference data).
- On **Currency**, price and volume are already aggregated across chains and representations; **`Supply`** uses the same currency-level semantics.

For how **prices** and **volumes** are computed from trades, see the [Price Index Algorithm](/docs/trading/crypto-price-api/price-index-algorithm).

## Field definitions

Amounts below are **human-readable token units** (not raw integer amounts with decimals applied on-chain), unless your client or tooling documents otherwise.

### `CirculatingSupply`

An estimate of the number of tokens **available to the market** (public float), from CryptoRank.

- Often **unavailable** for assets CryptoRank does not cover well (e.g. many meme tokens).
- May be **null** when a reliable circulating figure is not available.

**Circulating supply** and **max supply** coverage is available for assets that trade on **CEXs**; many **meme tokens** and thinly covered assets may **not** have these supply figures, so those fields are often missing for those names.


### `TotalSupply`

The **total issued supply** of the asset as represented in reference data taken from on-chain **total supply**. May differ from **circulating** when a large portion is not treated as circulating.

### `MaxSupply`

The **maximum supply cap** for the asset. For assets **without** a fixed cap, or when CryptoRank has no figure, this field is typically 0. Often **unavailable** for the same asset classes as **circulating supply** (e.g. many meme tokens).

### `MarketCap`

**Market capitalization in USD**, usually **price × circulating supply** when **circulating supply** is known (using the currency-level figure and the Price Index USD price for that row). When **circulating supply** is **unknown**, **`MarketCap` equals `FullyDilutedValuationUsd`** (see below). 

### `FullyDilutedValuationUsd`

**Fully diluted valuation in USD**: when **max supply** (or other inputs for a standard FDV) is known, this reflects valuation at fully diluted supply at the current USD price. When **circulating supply** is **unknown**, we set **`FullyDilutedValuationUsd` to the same value as `MarketCap`** (so both fields carry the same fallback valuation).

## Bitcoin (`bid:bitcoin`) and on-chain supply

For **Bitcoin**, the **`Supply`** block on **`Tokens`** rows describes **on-chain supply of wrapped and bridged BTC** (for example WBTC on Ethereum), **not** native Bitcoin UTXO supply on the Bitcoin network. **Native BTC does not exist as a single token contract** on EVM (and similar) chains the way ERC-20s do, so any **`TotalSupply`**-style figure in this API is tied to **those on-chain representations**.

That is why you **do not** see **~21 million** in **`TotalSupply`** for a Bitcoin currency query: **21M** is the **network-level** cap for Bitcoin itself, while **`Supply` here** reflects **how much wrapped BTC is tracked on the chain(s)** backing that token row. 

```graphql
 {Trading {
  Tokens(
    where: {
      Currency: { Id: { is: "bid:bitcoin" } }
      Interval: { Time: { Duration: { eq: 1 } } }
    }
    limit: { count: 1 }
    orderBy: { descending: Block_Time }
  ) {
    Token {
      Address
      Id
      IsNative
      Name
      Network
      Symbol
      TokenId
    }
    Block {
      Date
      Time
      Timestamp
    }
    Interval {
      Time {
        Start
        Duration
        End
      }
    }
    Volume {
      Base
      Quote
      Usd
    }
    Price {
      IsQuotedInUsd
      Ohlc {
        Close
        High
        Low
        Open
      }
      Average {
        ExponentialMoving
        Mean
        SimpleMoving
        WeightedSimpleMoving
      }
    }
    Supply {
      TotalSupply
      MarketCap
      FullyDilutedValuationUsd
    }
  }
}
}  
 
```
