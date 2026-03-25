---
title: "Supply fields reference"
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

An estimate of the number of tokens **available to the market** (public float), from **CryptoRank** (methodology and exclusions follow CryptoRank).

- Often **unavailable** for assets CryptoRank does not cover well (e.g. many meme tokens).
- May be **null** when a reliable circulating figure is not available.

**Circulating supply** and **max supply** coverage is available for assets that trade on **CEXs**; many **meme tokens** and thinly covered assets may **not** have these supply figures, so those fields are often missing for those names.


### `TotalSupply`

The **total issued supply** of the asset as represented in reference data taken from on-chain **total supply**. May differ from **circulating** when a large portion is not treated as circulating.

### `MaxSupply`

The **maximum supply cap** for the asset when CryptoRank provides one (e.g. Bitcoin’s 21M cap). For assets **without** a fixed cap, or when CryptoRank has no figure, this field is typically **null** or omitted in responses. Often **unavailable** for the same asset classes as **circulating supply** (e.g. many meme tokens).

### `MarketCap`

**Market capitalization in USD**, usually **price × circulating supply** when **circulating supply** is known (using the currency-level figure and the Price Index USD price for that row). When **circulating supply** is **unknown**, **`MarketCap` equals `FullyDilutedValuationUsd`** (see below). 

- May be **null** if a usable **USD price** is missing.

### `FullyDilutedValuationUsd`

**Fully diluted valuation in USD**: when **max supply** (or other inputs for a standard FDV) is known, this reflects valuation at fully diluted supply at the current USD price. When **circulating supply** is **unknown**, we set **`FullyDilutedValuationUsd` to the same value as `MarketCap`** (so both fields carry the same fallback valuation).

- May be **null** when a usable **USD price** is missing.