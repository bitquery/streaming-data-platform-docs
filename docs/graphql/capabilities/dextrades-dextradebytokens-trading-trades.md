---
title: "DEXTrades vs DEXTradeByTokens vs Trades cube"
description: "Compare DEXTrades, DEXTradeByTokens, and the Trading API Trades cube: EVM pool-centric vs Solana trader-centric chain cubes, and trader-focused streams with reliable USD via the price index."
---

# DEXTrades vs DEXTradeByTokens vs Trades cube

Bitquery exposes **three** common ways to work with **DEX swap–level** data. They differ by **GraphQL root**, **row shape** (how each swap is represented), and **what fields are normalized for you**.

This page compares them so you can pick the right primitive before you write filters, subscriptions, or aggregations. For the broader “transfers vs events vs calls vs DEX” picture, see the [mental model guide](/docs/start/mental-model-transfers-events-calls).

---

## At a glance

| | **DEXTrades** | **DEXTradeByTokens** | **Trades cube** (`Trading { Trades }` — [Crypto Trades API](/docs/trading/crypto-trades-api/trades-api)) |
|---|----------------|----------------------|---------------------------------------------|
| **GraphQL root** | Chain APIs such as `EVM(...)`, `Solana { ... }`, `Tron { ... }` | Same chain roots | `Trading { Trades }` |
| **Focus (by chain)** | **EVM / Tron:** **Pool-focused**—`Buy`/`Sell` follow the pool’s perspective ([DEXTrades cube](/docs/cubes/dextrades)). **Solana:** **Trader-focused**—natural fit for signer, buyer/seller, and account-style filters (see [Solana DEX Trades](/docs/blockchain/Solana/solana-dextrades), [trader patterns](/docs/blockchain/Solana/solana-trader-API)). | **EVM / Tron:** Still **pool-relative** on the **`Side`** leg (e.g. `Side.Type` vs pool); rows are **token-expanded**, not “wallet-first.” **Solana:** **Trader-focused** in practice—e.g. buyers/sellers and volume by **`Transaction.Signer`** and `Side.Type` in [Solana examples](/docs/blockchain/Solana/solana-dextrades). | **Trader-focused** everywhere: first-class **`Trader.Address`**, **`Pair`**, **`Side`**, and USD fields aligned to the [Price Index](/docs/trading/crypto-price-api/price-index-algorithm). |
| **Rows per swap** | **One** row per swap | **Multiple** rows per swap (token-centric; typically **two** for a two-token pool) | **One** row per swap |
| **Core shape** | `Trade.Buy` / `Trade.Sell` (shape varies by chain; see above) | `Trade` (primary token) + `Trade.Side` (counter leg) | `Side`, `Pair` (market, tokens, currencies), `Amounts` / `AmountsInUsd`, `Price` / `PriceInUsd`, `Trader`, transaction header |
| **USD / long-tail tokens** | **`PriceInUSD`** and related fields are **often missing or zero** for illiquid or meme tokens—amounts exist, but USD requires a usable valuation path ([DEXTrades cube — PriceInUSD](/docs/cubes/dextrades#video-tutorial--why-priceinusd-is-0-in-bitquery-api-response)). Same class of issue on **`DEXTradeByTokens`** when the schema cannot price the leg. | Same limitation as chain DEX rows: **not guaranteed** for every token. | **Much more usable USD for trading UIs:** **`PriceInUsd`** and **`AmountsInUsd`** are driven by the **Trading price index**, so you typically **do not hit the “no USD for meme coins” problem** that shows up on raw chain DEX cubes. |
| **Best when you need** | **EVM:** one record per pool swap, protocol/pool analytics, multi-hop debugging. **Solana:** trades by **wallet** / signer / account, buy vs sell counts, DEX-level analytics on chain. | **EVM:** token-level OHLC from raw trades, “all pairs for this token,” portfolio-style filters (with dedupe discipline). **Solana:** token **and** trader analytics (buyers, sellers, makers) in one model. | **Real-time** (or windowed) **multi-chain** swap stream, **trader-centric** apps, **reliable USD** on each row, **supply snapshot** (market cap, FDV, circulating/total/max). |
| **Watch out for** | On **EVM**, `Buy`/`Sell` are **pool**-relative—not the end-user’s intuition without reading the field docs. | **Double counting** if you sum without filtering by token or deduplicating (e.g. by transaction hash / index). | Not a substitute for **pre-aggregated OHLC** on **Tokens** / **Pairs**; for aggregated charts prefer [Crypto Price API](/docs/trading/crypto-price-api/introduction) unless you need raw swap rows |

Full reference pages: [DEXTrades cube](/docs/cubes/dextrades), [DEXTradesByTokens cube](/docs/cubes/dextradesbyTokens), [Crypto Trades API — `Trades`](/docs/trading/crypto-trades-api/trades-api).

---

## DEXTrades

The [DEXTrades](/docs/cubes/dextrades) cube is **normalized DEX swap data** with **`Trade.Buy`** and **`Trade.Sell`**. How you should read those fields depends on the chain:

**EVM (and similar pool-centric docs):** **`Buy`** and **`Sell`** are from the **pool’s** perspective—the pool always sits in the trade; **`Buy`** is what the pool received, **`Sell`** what it paid out (diagrams and examples on the [DEXTrades cube](/docs/cubes/dextrades) page). You get **one row per swap** at the pool, which fits **protocol**, **pair/pool**, **routing**, and **multi-hop** analysis ([multi-hop section](/docs/cubes/dextrades)).

**Solana:** The same `DEXTrades` field is **trader- and account-oriented** in typical queries—e.g. filtering by **`Transaction.Signer`**, **`Trade.Buy` / `Trade.Sell`** accounts and token owners, and building **buy vs sell** stats for wallets. See [Solana DEX Trades](/docs/blockchain/Solana/solana-dextrades) and [Solana trader API patterns](/docs/blockchain/Solana/solana-trader-API).

**USD on chain DEX rows:** For many **long-tail or meme** tokens, **`PriceInUSD`** (and similar) may be **0 or absent** because USD is derived from trade amounts and available USD legs—not a guaranteed field for every asset. See pricing notes and the video on the [DEXTrades cube — Why PriceInUSD is 0](/docs/cubes/dextrades#video-tutorial--why-priceinusd-is-0-in-bitquery-api-response) section.

**Available on chain roots** such as `EVM`, `Solana`, and `Tron` (see [mental model — applying across chains](/docs/start/mental-model-transfers-events-calls#applying-this-model-across-chains)).

---

## DEXTradeByTokens (token-expanded; EVM pool leg vs Solana trader stats)

The [DEXTradesByTokens](/docs/cubes/dextradesbyTokens) / **`DEXTradeByTokens`** field describes the **same swaps** as DEXTrades, but **explodes** them into **token-centric** rows:

- Each row emphasizes **`Trade`** (one token leg: **currency**, **amount**, **buyer**, **seller**) and **`Side`** (the counter leg). On **EVM**, **`Side.Type`** and buyer/seller on the side are still **pool-relative** (see [structure comparison](/docs/cubes/dextradesbyTokens#understanding-trade-and-side-structure)).
- **Solana** examples often stress **trader** dimensions—e.g. **distinct signers**, **buyers** and **sellers** conditional on **`Trade.Side.Type`**, and volume in USD when available ([Solana DEX Trades](/docs/blockchain/Solana/solana-dextrades)).
- A single swap can produce **multiple rows** (e.g. both tokens get a row). That is **by design** for “everything involving token X” without reshaping **`Buy`/`Sell`** yourself on **EVM**.

**Important:** There are **roughly twice as many records per swap** as with DEXTrades for a two-asset swap. **Filter by token (or pair)** and understand [how to avoid duplicate-looking totals](/docs/cubes/dextradesbyTokens#how-do-i-avoid-duplicate-results-in-dex-trade-queries) (e.g. specify side currency, dedupe by transaction, or use DEXTrades when you need **strictly one row per swap**).

**Typical uses:** token price across DEXs, portfolio-style **user** tracking (buyer or seller), pairs a token trades in, and **historical OHLC derived from raw DEX trades** (bucket with `Block { Time(interval: ...) }` and min/max price fields—see [OHLC on DEXTradeByTokens](/docs/cubes/dextradesbyTokens#how-do-i-get-ohlc-in-a-dextradebytokens-query)).

**OHLCV choice between the two DEX cubes:** Prefer **`DEXTradeByTokens`** for **one token’s** candle path (all pools/sides from the token’s view). Prefer **`DEXTrades`** when you need **each raw swap** as a single row (pool view, routing, debugging). For **default** OHLC/charting, the docs recommend the **[Crypto Price API](/docs/trading/crypto-price-api/introduction)** first; see [DEXTradeByTokens vs DEXTrades for OHLCV](/docs/cubes/dextradesbyTokens#how-do-i-use-dextradebytokens-vs-dextrades-for-ohlcv) and [Crypto OHLC FAQ](/docs/trading/crypto-price-api/crypto-ohlc-candle-k-line-api).

---

## Trades cube (Crypto Trades API — trader-focused, strong USD)

The **`Trades`** field under **`Trading`** is documented as the [Crypto Trades API — real-time DEX trade streams](/docs/trading/crypto-trades-api/trades-api). It is **not** nested under `EVM` / `Solana` per chain in the same way; you use **`Trading { Trades }`** and narrow with **`Pair.Market.Network`**, token ids, and **`Trader.Address`**.

**Trader-first model:** Rows are built for **who traded**—**`Trader.Address`** is a first-class filter—alongside **`Pair`**, **`Side`**, and amounts. That is the natural API for **wallet streams**, **leaderboards**, and **per-user** trade history across **Solana**, **Ethereum**, **BSC**, **Base**, **Arbitrum**, and **Polygon** in one schema ([Trades API](/docs/trading/crypto-trades-api/trades-api)).

**USD vs chain DEX cubes:** On **`DEXTrades`** / **`DEXTradeByTokens`**, **`PriceInUSD`** is often **missing or zero** for **meme or thinly traded** tokens (see [DEXTrades cube](/docs/cubes/dextrades) pricing notes). The **`Trades`** cube is different: **`PriceInUsd`** and **`AmountsInUsd`** are tied to the **Trading price index**, so you **usually get usable USD** for the same long-tail assets where raw chain DEX USD fields fail. Details: [Price Index Algorithm](/docs/trading/crypto-price-api/price-index-algorithm).

**What each row includes (per docs):** **`Side`**, **amounts** (base, quote, **USD**), **`Price`** / **`PriceInUsd`**, **`Pair`** (market, tokens, currencies), **`Trader`**, **transaction** header fields, and **`Supply`** (**MarketCap**, **FDV**, circulating/total/max) for token context.

**Operational notes from the Trades docs:**

- **Subscriptions** are the primary pattern for **live** streams; you can often use the **same selection as a `query`** with a **time window** on **`Block`** / **`Interval`** where supported.
- **Token filter:** **`Pair.Token.Id`** with the full id (e.g. `bid:solana:<mint>`, `bid:eth:<lowercase_contract>`) per dataset conventions.
- **Trader filter:** **`Trader.Address`**.

For **aggregated** token metrics across pairs, use **[Tokens](/docs/trading/crypto-price-api/tokens)**; for **pair-level** OHLC intervals, use **[Pairs](/docs/trading/crypto-price-api/pairs)**—as noted on the [Trades API page](/docs/trading/crypto-trades-api/trades-api).

---

## Quick decision guide

1. **EVM / Tron: one row per pool swap** with pool **`Buy`/`Sell`** semantics, or **Solana: trades by signer / account / buy vs sell** on chain? → **`DEXTrades`** on the right **chain root**.

2. **Token-expanded rows**, OHLC **from raw DEX trades**, or **Solana** maker/buyer/seller aggregates on **`DEXTradeByTokens`**? → **`DEXTradeByTokens`**, with **strict filters** on **EVM** so counts are not doubled.

3. **Trader-centric** product, **multi-chain** `Trading` stream, **reliable USD** (including meme / long-tail), plus **supply** on each row? → **`Trading { Trades }`** ([Crypto Trades API](/docs/trading/crypto-trades-api/trades-api)).

4. **Need pre-built candles / moving averages / mean price** without aggregating raw swaps yourself? → **[Crypto Price API](/docs/trading/crypto-price-api/introduction)** (**Tokens**, **Pairs**, **Currencies**)—not the same as **`Trades`**, as explained in the [mental model](/docs/start/mental-model-transfers-events-calls#trading-crypto-price-cube).

---

## Related documentation

- [Mental model: transfers, events, calls, DEX, Trading](/docs/start/mental-model-transfers-events-calls)
- [DEXTrades cube](/docs/cubes/dextrades)
- [DEXTradesByTokens cube](/docs/cubes/dextradesbyTokens)
- [Crypto Trades API — `Trades`](/docs/trading/crypto-trades-api/trades-api)
- [GraphQL limits](/docs/graphql/limits) (paging, `orderBy`, time windows)
