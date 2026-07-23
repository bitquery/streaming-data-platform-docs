---
title: "Robinhood Liquidity & Slippage API"
description: "Query & stream Robinhood DEX pool liquidity, TVL, and slippage with Bitquery GraphQL: Uniswap V2/V3/V4 and PancakeSwap reserves, depth, and price impact."
sidebar_position: 3
keywords:
  - Robinhood liquidity API
  - Robinhood DEX pool liquidity
  - Robinhood slippage API
  - Robinhood price impact
  - Robinhood TVL API
  - Robinhood pool depth
  - Robinhood Uniswap V4 liquidity
  - Robinhood PancakeSwap liquidity
  - Robinhood tokenized stock liquidity
  - Robinhood liquidity stream websocket
  - Robinhood pool reserves
  - DEXPoolEvents Robinhood
  - DEXPoolSlippages Robinhood
  - Bitquery Robinhood liquidity
---
# Robinhood Liquidity & Slippage API

Track **DEX pool liquidity, TVL, and slippage / price impact** on Robinhood with Bitquery GraphQL — across **Uniswap V2 / V3 / V4 and PancakeSwap** pools, including **tokenized stock pairs (AAPL, NVDA)**. Use:

| Cube | What it returns |
| --- | --- |
| **`DEXPoolEvents`** | Pool reserves, spot prices (A↔B), protocol metadata, and the tx that changed pool state |
| **`DEXPoolSlippages`** | Max trade size and min out at fixed slippage tolerances (0.1%–10%) for both swap directions |

Both cubes sit on the `EVM` root with `network: robinhood`. For how pool records and price tables are built, see the [DEXPools Cube](/docs/cubes/evm-dexpool/).

Paste any example below into the [Bitquery IDE](https://ide.bitquery.io/) to run it against live Robinhood data. Every query on this page was executed against the production endpoint before publishing.

:::warning Realtime dataset only
Robinhood **`DEXPoolEvents`** and **`DEXPoolSlippages`** are available only on **`dataset: realtime`**.

`archive` and `combined` return errors such as *no archive or API tables found for cube DEXPoolEvent / DEXPoolSlippage*. Always use realtime (or omit `dataset`, which defaults to realtime).
:::

:::note API Key Required
To query or stream outside the Bitquery IDE, you need an API access token.

Follow: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::tip Related docs
- [Robinhood Trades](/docs/blockchain/robinhood/robinhood-trades/)
- [Robinhood Transfers](/docs/blockchain/robinhood/robinhood-transfers/)
- [DEXPools Cube](/docs/cubes/evm-dexpool/)
- [Base Liquidity API](/docs/blockchain/Base/base-liquidity-api/)
- [Base Slippage API](/docs/blockchain/Base/base-slippage-api/)
:::

**On this page:** [Latest liquidity](#latest-liquidity-events) · [By pool](#liquidity-for-a-specific-pool) · [By token](#liquidity-for-pools-involving-a-token) · [Protocols](#filter-by-dex-protocol) · [Largest pools](#largest-recent-liquidity-readings-by-usd) · [Price watchlist](#live-price-watchlist-latest-state-per-pool) · [Active pools & ranges](#most-active-pools-and-price-ranges-1-hour-window) · [TVL time series](#pool-tvl-and-price-time-series-5-minute-buckets) · [Stream](#stream-liquidity-updates) · [Slippage](#slippage-and-price-impact) · [FAQ](#faq)

---

## Useful contracts and example pools

| Item | Value |
| --- | --- |
| Network | `network: robinhood` |
| ETH (native, `CurrencyA` on most V4 pools) | `0x` |
| WETH | `0x0bd7d308f8e1639fab988df18a8011f41eacad73` |
| USDG (Global Dollar) | `0x5fc5360d0400a0fd4f2af552add042d716f1d168` |
| AAPL (Apple · Robinhood Token) | `0xaf3d76f1834a1d425780943c99ea8a608f8a93f9` |
| NVDA (NVIDIA · Robinhood Token) | `0xd0601ce157db5bdc3162bbac2a2c8af5320d9eec` |
| Example Uniswap V4 manager | `0x8366a39cc670b4001a1121b8f6a443a643e40951` |
| Example ETH/USDG PoolId (V4) | `0x54f7883914619af9105355bf83ed678bcf9f63560218ac61c9963b9503d0ba32` |
| Example USDG/AAPL PoolId (V4) | `0xc748f4671a867db48b552f6b7650bf3255e05f80f00e3f7aad1b17ccb7898fdb` |
| Example CASHCAT/WETH pool (V3) | `0xa70fc67c9f69da90b63a0e4c05d229954574e313` |

:::note Example pools
The example `PoolId` and pool addresses are **illustrative addresses that were active when this page was last tested**. Meme and long-tail pools can go quiet — replace them with any pool you care about.
:::

:::tip Pool identity: V2/V3 vs V4
- **Uniswap V2/V3:** each pool is its own contract — filter with `Pool.SmartContract`; `PoolId` is empty (`0x`).
- **Uniswap V4:** many pools share the same manager `SmartContract` — use **`Pool.PoolId`** to select a specific pool.
- **Mixed sets (rankings, watchlists):** a pool's unique key is the **pair** (`Pool.SmartContract`, `Pool.PoolId`). Deduplicate with `limitBy: { by: [PoolEvent_Pool_SmartContract, PoolEvent_Pool_PoolId], count: 1 }` so neither family collapses into one row.
:::

---

## How to read pool prices

Price fields are directional and quoted in the pool's own currencies. For the ETH/USDG V4 pool (`CurrencyA` = ETH, `CurrencyB` = USDG), a live row read:

| Field | Meaning | Live value |
| --- | --- | --- |
| `AtoBPrice` | Units of **CurrencyA** per 1 **CurrencyB** | `0.000525` (ETH per USDG) |
| `AtoBPriceInUSD` | USD price of 1 **CurrencyB** | `0.998` (USDG ≈ $1) |
| `BtoAPrice` | Units of **CurrencyB** per 1 **CurrencyA** | `1905.83` (USDG per ETH) |
| `BtoAPriceInUSD` | USD price of 1 **CurrencyA** | often `0` (see below) |

Sanity check: `AtoBPrice × BtoAPrice ≈ 1`. The same convention holds on every pool — on CASHCAT/WETH (V3), `AtoBPrice ≈ 43,072` is CASHCAT per 1 WETH.

:::note When `*InUSD` is 0
USD enrichment is not populated for every row — `BtoAPriceInUSD` and the `Liquidity.*InUSD` fields frequently return `0`, especially on V2/V3 pools and non-ETH-quoted pairs. When you have reserves, derive the missing price yourself: `AmountCurrencyAInUSD ÷ AmountCurrencyA` gives the USD price of CurrencyA (≈ $1,902 per ETH in the row above).
:::

---

## Latest liquidity events

Recent pool updates with reserves and spot prices. Useful for dashboards and pool health monitors.

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    DEXPoolEvents(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
        Number
      }
      PoolEvent {
        AtoBPrice
        AtoBPriceInUSD
        BtoAPrice
        BtoAPriceInUSD
        Dex {
          SmartContract
          ProtocolName
          ProtocolVersion
          ProtocolFamily
        }
        Liquidity {
          AmountCurrencyA
          AmountCurrencyAInUSD
          AmountCurrencyB
          AmountCurrencyBInUSD
        }
        Pool {
          PoolId
          SmartContract
          CurrencyA {
            Name
            Symbol
            SmartContract
          }
          CurrencyB {
            Name
            Symbol
            SmartContract
          }
        }
      }
      Transaction {
        Hash
        From
        To
        CostInUSD
      }
    }
  }
}
```

Example response shape (fields truncated):

```json
{
  "EVM": {
    "DEXPoolEvents": [
      {
        "Block": { "Number": "17339306", "Time": "2026-07-23T13:55:06Z" },
        "PoolEvent": {
          "AtoBPrice": 0.0005247070221230388,
          "AtoBPriceInUSD": 0.9981142611098761,
          "BtoAPrice": 1905.8255615234375,
          "BtoAPriceInUSD": 0,
          "Dex": {
            "ProtocolName": "uniswap_v4",
            "ProtocolVersion": "4",
            "SmartContract": "0x8366a39cc670b4001a1121b8f6a443a643e40951"
          },
          "Liquidity": {
            "AmountCurrencyA": 152.95826721191406,
            "AmountCurrencyAInUSD": 290962.04438267834,
            "AmountCurrencyB": 4398114.5,
            "AmountCurrencyBInUSD": 0
          },
          "Pool": {
            "PoolId": "0x54f7883914619af9105355bf83ed678bcf9f63560218ac61c9963b9503d0ba32",
            "CurrencyA": { "Name": "Ethereum", "SmartContract": "0x", "Symbol": "ETH" },
            "CurrencyB": { "Name": "Global Dollar", "Symbol": "USDG" }
          }
        }
      }
    ]
  }
}
```

Note the `BtoAPriceInUSD: 0` and `AmountCurrencyBInUSD: 0` — real rows carry USD gaps; see [How to read pool prices](#how-to-read-pool-prices).

---

## Liquidity for a specific pool

### Uniswap V3 pool (by SmartContract)

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    DEXPoolEvents(
      where: {
        PoolEvent: {
          Pool: {
            SmartContract: {
              is: "0xa70fc67c9f69da90b63a0e4c05d229954574e313"
            }
          }
        }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
        Number
      }
      PoolEvent {
        AtoBPrice
        BtoAPrice
        Dex {
          ProtocolName
          ProtocolVersion
        }
        Liquidity {
          AmountCurrencyA
          AmountCurrencyAInUSD
          AmountCurrencyB
          AmountCurrencyBInUSD
        }
        Pool {
          SmartContract
          CurrencyA {
            Symbol
            SmartContract
          }
          CurrencyB {
            Symbol
            SmartContract
          }
        }
      }
      Transaction {
        Hash
      }
    }
  }
}
```

### Uniswap V4 pool (by PoolId)

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    DEXPoolEvents(
      where: {
        PoolEvent: {
          Pool: {
            PoolId: {
              is: "0x54f7883914619af9105355bf83ed678bcf9f63560218ac61c9963b9503d0ba32"
            }
          }
        }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
        Number
      }
      PoolEvent {
        AtoBPrice
        AtoBPriceInUSD
        BtoAPrice
        BtoAPriceInUSD
        Dex {
          ProtocolName
          ProtocolVersion
          SmartContract
        }
        Liquidity {
          AmountCurrencyA
          AmountCurrencyAInUSD
          AmountCurrencyB
          AmountCurrencyBInUSD
        }
        Pool {
          PoolId
          SmartContract
          CurrencyA {
            Name
            Symbol
            SmartContract
          }
          CurrencyB {
            Name
            Symbol
            SmartContract
          }
        }
      }
      Transaction {
        Hash
        From
        To
      }
    }
  }
}
```

---

## Liquidity for pools involving a token

**Trading / RWA / stablecoins:** find pools where a token is CurrencyA or CurrencyB. Examples: WETH, USDG, AAPL, NVDA.

### WETH pools

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    DEXPoolEvents(
      where: {
        any: [
          {
            PoolEvent: {
              Pool: {
                CurrencyA: {
                  SmartContract: {
                    is: "0x0bd7d308f8e1639fab988df18a8011f41eacad73"
                  }
                }
              }
            }
          }
          {
            PoolEvent: {
              Pool: {
                CurrencyB: {
                  SmartContract: {
                    is: "0x0bd7d308f8e1639fab988df18a8011f41eacad73"
                  }
                }
              }
            }
          }
        ]
      }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      PoolEvent {
        AtoBPrice
        BtoAPrice
        Dex {
          ProtocolName
          ProtocolVersion
        }
        Liquidity {
          AmountCurrencyA
          AmountCurrencyAInUSD
          AmountCurrencyB
          AmountCurrencyBInUSD
        }
        Pool {
          PoolId
          SmartContract
          CurrencyA {
            Symbol
            SmartContract
          }
          CurrencyB {
            Symbol
            SmartContract
          }
        }
      }
      Transaction {
        Hash
      }
    }
  }
}
```

### Tokenized stock pools (AAPL)

Robinhood tokenized equities trade in ordinary DEX pools. AAPL's most liquid venue at the time of testing was the **USDG/AAPL Uniswap V4 pool** (`PoolId 0xc748f467…`), where `AtoBPrice ≈ 320.79` — the AAPL price quoted in USDG. Swap in the NVDA address (`0xd0601ce1…`) for NVIDIA pools.

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    DEXPoolEvents(
      where: {
        any: [
          {
            PoolEvent: {
              Pool: {
                CurrencyA: {
                  SmartContract: {
                    is: "0xaf3d76f1834a1d425780943c99ea8a608f8a93f9"
                  }
                }
              }
            }
          }
          {
            PoolEvent: {
              Pool: {
                CurrencyB: {
                  SmartContract: {
                    is: "0xaf3d76f1834a1d425780943c99ea8a608f8a93f9"
                  }
                }
              }
            }
          }
        ]
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      PoolEvent {
        AtoBPrice
        BtoAPrice
        Dex {
          ProtocolName
          ProtocolVersion
        }
        Liquidity {
          AmountCurrencyA
          AmountCurrencyAInUSD
          AmountCurrencyB
          AmountCurrencyBInUSD
        }
        Pool {
          PoolId
          SmartContract
          CurrencyA {
            Name
            Symbol
            SmartContract
          }
          CurrencyB {
            Name
            Symbol
            SmartContract
          }
        }
      }
      Transaction {
        Hash
      }
    }
  }
}
```

### Find pools by token symbol

When you only know the ticker, filter on `Currency.Symbol`. One latest row per pool via the composite `limitBy`.

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    DEXPoolEvents(
      where: { PoolEvent: { Pool: { CurrencyB: { Symbol: { is: "NVDA" } } } } }
      limitBy: { by: [PoolEvent_Pool_SmartContract, PoolEvent_Pool_PoolId], count: 1 }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      PoolEvent {
        AtoBPriceInUSD
        Dex {
          ProtocolName
        }
        Liquidity {
          AmountCurrencyA
          AmountCurrencyAInUSD
          AmountCurrencyB
        }
        Pool {
          PoolId
          SmartContract
          CurrencyA {
            Symbol
            SmartContract
          }
          CurrencyB {
            Name
            Symbol
            SmartContract
          }
        }
      }
    }
  }
}
```

:::warning Symbols are not unique
Running this exact query returned **two different contracts both claiming the NVDA symbol**: the canonical `NVIDIA • Robinhood Token` (`0xd0601ce1…`) and a copycat named just `NVDA` (`0xdecf74e4…`). Use symbol filters for discovery, then pin the `SmartContract` address in anything that trades. Also check the other side of the pair — the ETH/NVDA pool has NVDA as `CurrencyB`, but flip the filter to `CurrencyA` (or use `any:`) for full coverage.
:::

---

## Filter by DEX protocol

Isolate one protocol's pool updates — Uniswap V2/V3/V4 or PancakeSwap.

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    DEXPoolEvents(
      where: {
        PoolEvent: {
          Dex: { ProtocolName: { is: "uniswap_v4" } }
        }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      PoolEvent {
        Dex {
          ProtocolName
          ProtocolVersion
          ProtocolFamily
        }
        Liquidity {
          AmountCurrencyA
          AmountCurrencyAInUSD
          AmountCurrencyB
          AmountCurrencyBInUSD
        }
        Pool {
          PoolId
          CurrencyA {
            Symbol
          }
          CurrencyB {
            Symbol
          }
        }
      }
    }
  }
}
```

### Protocol activity breakdown

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    DEXPoolEvents(
      limit: { count: 10 }
      orderBy: { descendingByField: "count" }
    ) {
      PoolEvent {
        Dex {
          ProtocolName
          ProtocolVersion
          ProtocolFamily
        }
      }
      count
    }
  }
}
```

Protocols observed on Robinhood pool events when this page was last tested:

| `ProtocolFamily` | `ProtocolName` | Share of pool events* |
| --- | --- | --- |
| Uniswap | `uniswap_v3` | ~63% |
| Uniswap | `uniswap_v4` | ~29% |
| Uniswap | `uniswap_v2` | ~7% |
| PancakeSwap | `pancake_swap_v3` | under 1% |
| PancakeSwapInfinity | `pancakeswap_infinity` | trace |

*Share of the realtime window at the time of writing (~16.7M pool updates across ~85,000 pools); it shifts constantly.

### Network-wide totals

One-row dashboard stat: total pool updates and distinct pool contracts in the realtime window. `count(distinct: …)` is exact; `uniq(of: …)` is a faster approximate alternative.

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    DEXPoolEvents {
      updates: count
      pools: count(distinct: PoolEvent_Pool_SmartContract)
    }
  }
}
```

Note: this counts distinct **contracts** — every V2/V3 pool individually, while all V4 pools share their manager contract. Count `PoolEvent_Pool_PoolId` instead to enumerate V4 pools.

---

## Largest recent liquidity readings by USD

**Trading / risk:** rank recent pool **events** by `AmountCurrencyAInUSD` within the realtime window.

Without `limitBy`, the same busy pool fills the top rows (many updates, one pool). Deduplicate on the **composite pool key** — using `PoolId` alone would merge every V2/V3 pool into a single row, since they all share `PoolId: "0x"`:

```
limitBy: { by: [PoolEvent_Pool_SmartContract, PoolEvent_Pool_PoolId], count: 1 }
```

:::note Float filters and USD gaps
`AmountCurrencyAInUSD` / `AmountCurrencyBInUSD` filters expect **Float** values (for example `gt: 10000`), not quoted strings. Because V2/V3 and non-ETH-quoted rows often report `0` USD, a USD threshold effectively ranks the native-ETH V4 pools — combine with token filters, or rank raw amounts per token, when you need the rest.
:::

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    DEXPoolEvents(
      where: {
        PoolEvent: {
          Liquidity: { AmountCurrencyAInUSD: { gt: 10000 } }
        }
      }
      limit: { count: 20 }
      limitBy: { by: [PoolEvent_Pool_SmartContract, PoolEvent_Pool_PoolId], count: 1 }
      orderBy: { descending: PoolEvent_Liquidity_AmountCurrencyAInUSD }
    ) {
      Block {
        Time
      }
      PoolEvent {
        AtoBPrice
        AtoBPriceInUSD
        Dex {
          ProtocolName
        }
        Liquidity {
          AmountCurrencyA
          AmountCurrencyAInUSD
          AmountCurrencyB
          AmountCurrencyBInUSD
        }
        Pool {
          PoolId
          SmartContract
          CurrencyA {
            Symbol
            SmartContract
          }
          CurrencyB {
            Symbol
            SmartContract
          }
        }
      }
      Transaction {
        Hash
      }
    }
  }
}
```

---

## Live price watchlist (latest state per pool)

One call, one **latest** row per active pool: spot prices both directions plus current reserves in USD. This is the query behind a screener or watchlist page — poll it, or move to the [stream](#stream-liquidity-updates) for push updates. The `gt: 100` USD floor drops dust pools.

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    DEXPoolEvents(
      where: { PoolEvent: { Liquidity: { AmountCurrencyAInUSD: { gt: 100 } } } }
      limitBy: { by: [PoolEvent_Pool_SmartContract, PoolEvent_Pool_PoolId], count: 1 }
      limit: { count: 30 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      PoolEvent {
        AtoBPrice
        AtoBPriceInUSD
        BtoAPrice
        BtoAPriceInUSD
        Dex {
          ProtocolName
        }
        Liquidity {
          AmountCurrencyAInUSD
          AmountCurrencyBInUSD
        }
        Pool {
          PoolId
          SmartContract
          CurrencyA {
            Symbol
          }
          CurrencyB {
            Symbol
          }
        }
      }
    }
  }
}
```

---

## Most active pools and price ranges (1-hour window)

**Momentum / volatility screening:** group the last hour of pool events per pool and get update count, price high/low/last, and current TVL — a volatility screener in a single query.

The `Field(maximum: OtherField)` syntax is an **argmax**: it returns this field's value on the row where `OtherField` is highest. So `AtoBPriceInUSD(maximum: PoolEvent_AtoBPriceInUSD)` is the window high, and `AtoBPriceInUSD(maximum: Block_Number)` is the **latest** price (value at the highest block).

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    DEXPoolEvents(
      where: {
        Block: { Time: { since_relative: { hours_ago: 1 } } }
        PoolEvent: {
          AtoBPriceInUSD: { gt: 0 }
          Liquidity: { AmountCurrencyAInUSD: { gt: 1000 } }
        }
      }
      limit: { count: 10 }
      orderBy: { descendingByField: "updates" }
    ) {
      PoolEvent {
        Dex {
          ProtocolName
        }
        Pool {
          SmartContract
          PoolId
          CurrencyA {
            Symbol
          }
          CurrencyB {
            Symbol
          }
        }
      }
      updates: count
      price_high: PoolEvent { AtoBPriceInUSD(maximum: PoolEvent_AtoBPriceInUSD) }
      price_low: PoolEvent { AtoBPriceInUSD(minimum: PoolEvent_AtoBPriceInUSD) }
      price_last: PoolEvent { AtoBPriceInUSD(maximum: Block_Number) }
      price_avg: average(of: PoolEvent_AtoBPriceInUSD)
      tvl_last: PoolEvent { Liquidity { AmountCurrencyAInUSD(maximum: Block_Number) } }
    }
  }
}
```

Live sample from this query — the ETH/NVDA pool over one hour: 413 updates, high `210.52`, low `208.04`, last `209.16` (the tokenized NVIDIA price in USD), TVL ≈ `$44,940`. Meme pools show far wider ranges (an ETH/MARSCOIN pool printed a 2× intra-hour swing). Compute swing % client-side as `(high − low) ÷ low`; use absolute `since:`/`till:` timestamps if you prefer fixed windows.

---

## Pool TVL and price time series (5-minute buckets)

**Charting / TWAP checks:** bucket one pool's events into intervals with `Time(interval: …)` and take close values via argmax on `Block_Number`. This builds candles for **price and TVL** from pool state — complementary to trade-based OHLCV in [Robinhood Trades](/docs/blockchain/robinhood/robinhood-trades/).

Note `orderBy: { descendingByField: "interval_Time" }` — the sort key is the alias plus `_Time`, the name the server generates for the interval field.

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    DEXPoolEvents(
      where: {
        PoolEvent: {
          Pool: {
            PoolId: {
              is: "0x54f7883914619af9105355bf83ed678bcf9f63560218ac61c9963b9503d0ba32"
            }
          }
        }
        Block: { Time: { since_relative: { hours_ago: 2 } } }
      }
      limit: { count: 24 }
      orderBy: { descendingByField: "interval_Time" }
    ) {
      interval: Block { Time(interval: { count: 5, in: minutes }) }
      updates: count
      price_avg: average(of: PoolEvent_BtoAPrice)
      price_close: PoolEvent { BtoAPrice(maximum: Block_Number) }
      tvl_eth_close: PoolEvent { Liquidity { AmountCurrencyA(maximum: Block_Number) } }
      tvl_usd_close: PoolEvent { Liquidity { AmountCurrencyAInUSD(maximum: Block_Number) } }
    }
  }
}
```

Live sample (ETH/USDG V4 pool — `BtoAPrice` is USDG per ETH):

| Interval (UTC) | Updates | Close | Avg | Pool ETH | ETH side USD |
| --- | --- | --- | --- | --- | --- |
| 13:55 | 126 | 1898.60 | 1902.26 | 156.04 | 296,749 |
| 13:50 | 123 | 1905.83 | 1901.66 | 152.96 | 290,961 |
| 13:45 | 84 | 1901.55 | 1904.09 | 160.11 | 304,924 |
| 13:40 | 77 | 1906.09 | 1904.22 | 152.65 | 290,604 |

The realtime window only reaches back a number of hours — this is for intraday series, not multi-month TVL history.

---

## Stream liquidity updates

Live pool reserve and spot-price updates for bots and alerting, over GraphQL subscriptions.

:::warning Filter production streams
Robinhood pool events are frequent. Prefer filters by `PoolId`, `SmartContract`, token, or protocol in production.
:::

```graphql
subscription {
  EVM(network: robinhood) {
    DEXPoolEvents(
      where: {
        PoolEvent: {
          Pool: {
            PoolId: {
              is: "0x54f7883914619af9105355bf83ed678bcf9f63560218ac61c9963b9503d0ba32"
            }
          }
        }
      }
    ) {
      Block {
        Time
        Number
      }
      PoolEvent {
        AtoBPrice
        BtoAPrice
        Dex {
          ProtocolName
        }
        Liquidity {
          AmountCurrencyA
          AmountCurrencyAInUSD
          AmountCurrencyB
          AmountCurrencyBInUSD
        }
        Pool {
          PoolId
          CurrencyA {
            Symbol
          }
          CurrencyB {
            Symbol
          }
        }
      }
      Transaction {
        Hash
      }
    }
  }
}
```

:::tip WebSocket connection
Connect to `wss://streaming.bitquery.io/graphql?token=YOUR_TOKEN` with the `graphql-transport-ws` subprotocol (`connection_init` → `connection_ack` → `subscribe`). This exact subscription delivered its first live event within seconds when tested. See [WebSocket authentication](/docs/authorization/websocket/).
:::

---

## Slippage and price impact

`DEXPoolSlippages` answers: *how much can I trade before I exceed X% price impact?*

**In this section:** [Latest rows](#latest-slippage-rows) · [Curve for one pool](#slippage-curve-for-one-pool-all-bps-levels) · [1% tolerance](#fixed-tolerance-1--100-bps) · [USDG at 1%](#usdg-pools-at-1-slippage) · [Deepest pools](#deepest-pools-by-executable-trade-size) · [Capacity screeners](#whale-capacity-and-thin-liquidity-screeners) · [Pool stream](#stream-slippage-for-a-pool) · [Screener stream](#stream-a-network-wide-slippage-screener)

Each row is one slippage level for a pool update:

| `SlippageBasisPoints` | Tolerance |
| --- | --- |
| 10 | 0.1% |
| 50 | 0.5% |
| 100 | 1% |
| 200 | 2% |
| 500 | 5% |
| 1000 | 10% |
| 0 | Spot / zero-slippage reference (often empty max amounts) |

For each level you get **AtoB** and **BtoA**:

- **`MaxAmountIn` / `MaxAmountInInUSD`** — largest input that stays within that slippage
- **`MinAmountOut` / `MinAmountOutInUSD`** — minimum output at that size
- **`Price` / `PriceInUSD`** — average execution price for that size

### Latest slippage rows

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    DEXPoolSlippages(
      limit: { count: 12 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
        Number
      }
      Price {
        SlippageBasisPoints
        AtoB {
          MaxAmountIn
          MaxAmountInInUSD
          MinAmountOut
          MinAmountOutInUSD
          Price
          PriceInUSD
        }
        BtoA {
          MaxAmountIn
          MaxAmountInInUSD
          MinAmountOut
          MinAmountOutInUSD
          Price
          PriceInUSD
        }
        Pool {
          PoolId
          SmartContract
          CurrencyA {
            Name
            Symbol
            SmartContract
            Decimals
          }
          CurrencyB {
            Name
            Symbol
            SmartContract
            Decimals
          }
        }
        Dex {
          SmartContract
          ProtocolName
          ProtocolVersion
          ProtocolFamily
        }
      }
      Transaction {
        Hash
        From
        To
      }
    }
  }
}
```

### Slippage curve for one pool (all bps levels)

Pull recent levels for a V4 `PoolId`. Compare `MaxAmountIn` across 10 → 1000 bps to build a depth curve. Rows for all seven levels (0, 10, 50, 100, 200, 500, 1000) come back interleaved.

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    DEXPoolSlippages(
      where: {
        Price: {
          Pool: {
            PoolId: {
              is: "0x54f7883914619af9105355bf83ed678bcf9f63560218ac61c9963b9503d0ba32"
            }
          }
        }
      }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Price {
        SlippageBasisPoints
        AtoB {
          MaxAmountIn
          MaxAmountInInUSD
          MinAmountOut
          Price
        }
        BtoA {
          MaxAmountIn
          MinAmountOut
          MinAmountOutInUSD
          Price
        }
        Pool {
          PoolId
          CurrencyA {
            Symbol
          }
          CurrencyB {
            Symbol
          }
        }
        Dex {
          ProtocolName
        }
      }
    }
  }
}
```

### Fixed tolerance (1% = 100 bps)

`SlippageBasisPoints` filters use **Int** (`eq: 100`), not strings.

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    DEXPoolSlippages(
      where: {
        Price: {
          Pool: {
            PoolId: {
              is: "0x54f7883914619af9105355bf83ed678bcf9f63560218ac61c9963b9503d0ba32"
            }
          }
          SlippageBasisPoints: { eq: 100 }
        }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Price {
        SlippageBasisPoints
        AtoB {
          MaxAmountIn
          MaxAmountInInUSD
          MinAmountOut
          Price
        }
        BtoA {
          MaxAmountIn
          MinAmountOut
          MinAmountOutInUSD
          Price
        }
      }
    }
  }
}
```

### USDG pools at 1% slippage

**Payments / stablecoin routing:** size trades against USDG pairs at a fixed tolerance.

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    DEXPoolSlippages(
      where: {
        any: [
          {
            Price: {
              Pool: {
                CurrencyA: {
                  SmartContract: {
                    is: "0x5fc5360d0400a0fd4f2af552add042d716f1d168"
                  }
                }
              }
            }
          }
          {
            Price: {
              Pool: {
                CurrencyB: {
                  SmartContract: {
                    is: "0x5fc5360d0400a0fd4f2af552add042d716f1d168"
                  }
                }
              }
            }
          }
        ]
        Price: { SlippageBasisPoints: { eq: 100 } }
      }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Price {
        SlippageBasisPoints
        AtoB {
          MaxAmountIn
          MaxAmountInInUSD
          MinAmountOut
        }
        BtoA {
          MaxAmountIn
          MinAmountOut
          MinAmountOutInUSD
        }
        Pool {
          PoolId
          SmartContract
          CurrencyA {
            Symbol
            SmartContract
          }
          CurrencyB {
            Symbol
            SmartContract
          }
        }
        Dex {
          ProtocolName
          ProtocolVersion
        }
      }
    }
  }
}
```

### Deepest pools by executable trade size

**Venue routing:** rank pools by how much you can actually trade at 1% impact. Ranking the **raw** `MaxAmountIn` on native-ETH-quoted pools (`CurrencyA` = `0x`) gives a depth leaderboard in ETH terms — "which pool absorbs the most ETH at 1%". One row per pool via composite `limitBy`.

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    DEXPoolSlippages(
      where: {
        Price: {
          SlippageBasisPoints: { eq: 100 }
          Pool: { CurrencyA: { SmartContract: { is: "0x" } } }
          AtoB: { MaxAmountIn: { gt: 0.1, lt: 10000 } }
        }
      }
      limitBy: { by: [Price_Pool_SmartContract, Price_Pool_PoolId], count: 1 }
      limit: { count: 10 }
      orderBy: { descending: Price_AtoB_MaxAmountIn }
    ) {
      Block {
        Time
      }
      Price {
        SlippageBasisPoints
        AtoB {
          MaxAmountIn
          MaxAmountInInUSD
          MinAmountOut
        }
        Pool {
          PoolId
          CurrencyA {
            Symbol
          }
          CurrencyB {
            Symbol
            Name
            SmartContract
          }
        }
        Dex {
          ProtocolName
        }
      }
    }
  }
}
```

Live sample: ETH/CASHCAT `140.3 ETH` (≈$260k), ETH/dollars `136.8 ETH`, ETH/FIRE `133.1 ETH`, ETH/AnsemCat `118.9 ETH`, down to ETH/SUBT `27.3 ETH` (≈$51k).

:::warning Degenerate pools report absurd depth
Without the `lt` cap, testing surfaced pools claiming capacity of **850 million ETH** (and USD values in the trillions) — one-sided or broken V4 pools whose curve math degenerates. Keep a sanity band on `MaxAmountIn`, and cross-check any surprising top row against the pool's actual reserves in `DEXPoolEvents` before routing (the sample's own top row — 5,625 ETH against a meme token — deserves exactly that check). The same applies to `MaxAmountInInUSD` screeners: long-tail token USD prices can be wildly inflated.
:::

### Whale capacity and thin liquidity screeners

Flip one filter to screen from either side. Pools that can absorb **at least $50k** at 1% (whale-tradeable):

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    DEXPoolSlippages(
      where: {
        Price: {
          SlippageBasisPoints: { eq: 100 }
          AtoB: { MaxAmountInInUSD: { ge: 50000 } }
        }
      }
      limitBy: { by: [Price_Pool_SmartContract, Price_Pool_PoolId], count: 1 }
      limit: { count: 20 }
      orderBy: { descending: Price_AtoB_MaxAmountInInUSD }
    ) {
      Block {
        Time
      }
      Price {
        SlippageBasisPoints
        AtoB {
          MaxAmountInInUSD
          MinAmountOutInUSD
        }
        Pool {
          PoolId
          SmartContract
          CurrencyA {
            Symbol
          }
          CurrencyB {
            Symbol
          }
        }
        Dex {
          ProtocolName
        }
      }
    }
  }
}
```

For a **thin-liquidity warning list** — pools where even $1k of input breaches 1% impact — change the filter to `AtoB: { MaxAmountInInUSD: { lt: 1000, gt: 0 } }` and order `ascending`. Remember the USD-inflation caveat above when reading either screen.

### Stream slippage for a pool

```graphql
subscription {
  EVM(network: robinhood) {
    DEXPoolSlippages(
      where: {
        Price: {
          Pool: {
            PoolId: {
              is: "0x54f7883914619af9105355bf83ed678bcf9f63560218ac61c9963b9503d0ba32"
            }
          }
          SlippageBasisPoints: { in: [10, 50, 100, 200, 500, 1000] }
        }
      }
    ) {
      Block {
        Time
        Number
      }
      Price {
        SlippageBasisPoints
        AtoB {
          MaxAmountIn
          MaxAmountInInUSD
          MinAmountOut
          Price
        }
        BtoA {
          MaxAmountIn
          MinAmountOut
          MinAmountOutInUSD
          Price
        }
        Pool {
          PoolId
          CurrencyA {
            Symbol
          }
          CurrencyB {
            Symbol
          }
        }
      }
    }
  }
}
```

### Stream a network-wide slippage screener

Drop the pool filter and keep one tolerance to watch **every pool's 1% depth** as it changes — the push-based version of the screeners above. This subscription delivered its first event in about a second when tested live.

```graphql
subscription {
  EVM(network: robinhood) {
    DEXPoolSlippages(
      where: { Price: { SlippageBasisPoints: { eq: 100 } } }
    ) {
      Block {
        Time
      }
      Price {
        SlippageBasisPoints
        AtoB {
          MaxAmountIn
          MaxAmountInInUSD
          MinAmountOut
        }
        Pool {
          PoolId
          SmartContract
          CurrencyA {
            Symbol
          }
          CurrencyB {
            Symbol
          }
        }
        Dex {
          ProtocolName
        }
      }
    }
  }
}
```

---

## Useful product patterns

| Goal | Cube | Approach |
| --- | --- | --- |
| Live reserve / TVL monitor | `DEXPoolEvents` | Filter by `PoolId` or token; track `Liquidity.*` on the **short realtime window** or via subscription (not long archive history) |
| Price watchlist / screener page | `DEXPoolEvents` | Composite `limitBy` → one latest row per pool ([query](#live-price-watchlist-latest-state-per-pool)) |
| Volatility / momentum screen | `DEXPoolEvents` | Argmax high/low/last per pool over `since_relative` window ([query](#most-active-pools-and-price-ranges-1-hour-window)) |
| Intraday TVL & price candles | `DEXPoolEvents` | `Time(interval: …)` buckets + argmax close ([query](#pool-tvl-and-price-time-series-5-minute-buckets)) |
| Liquidity add/remove alerts | `DEXPoolEvents` | Stream a pool; alert when reserves jump or drain |
| Trade sizing / RFQ | `DEXPoolSlippages` | Pick bps (e.g. 100); read `MaxAmountIn` / `MinAmountOut` for AtoB and BtoA |
| Best venue for a size | `DEXPoolSlippages` | Rank raw `MaxAmountIn` at fixed bps with a sanity cap ([query](#deepest-pools-by-executable-trade-size)) |
| Whale capacity / thin-liquidity flags | `DEXPoolSlippages` | `MaxAmountInInUSD` `ge` / `lt` screeners at 100 bps |
| RWA / tokenized stock depth (AAPL, NVDA) | both | Token filter on the stock token; pair with USDG/ETH pools |
| Protocol share | `DEXPoolEvents` | Aggregate `count` by `Dex.ProtocolName` (realtime window only) |

:::tip Interpreting a slippage row
If you want to sell up to `MaxAmountIn` of CurrencyA for CurrencyB at 1% impact, use the **AtoB** fields on the `SlippageBasisPoints: 100` row. `MinAmountOut` is the guaranteed CurrencyB received at that size. See also the [slippage FAQ](/docs/API-Blog/slippage-faq-using-dexpool-stream/).
:::

---

## Response fields (quick reference)

### DEXPoolEvents

| Group | Fields |
| --- | --- |
| **Liquidity** | `AmountCurrencyA`, `AmountCurrencyB`, `AmountCurrencyAInUSD`, `AmountCurrencyBInUSD` |
| **Prices** | `AtoBPrice` (A per 1 B), `BtoAPrice` (B per 1 A), `AtoBPriceInUSD` (USD price of B), `BtoAPriceInUSD` (USD price of A) — see [How to read pool prices](#how-to-read-pool-prices) |
| **Pool** | `PoolId`, `SmartContract`, `CurrencyA.*`, `CurrencyB.*` |
| **Dex** | `ProtocolName`, `ProtocolVersion`, `ProtocolFamily`, `SmartContract` |

### DEXPoolSlippages

| Group | Fields |
| --- | --- |
| **Level** | `SlippageBasisPoints` |
| **AtoB / BtoA** | `MaxAmountIn`, `MinAmountOut`, `Price`, plus `*InUSD` variants |
| **Pool / Dex** | Same identity fields as pool events |

Aggregations available on both cubes: `count` (with `distinct:`/`if:`), `sum`, `average`, `median`, `quantile`, `standard_deviation`, `uniq`, plus per-field argmax/argmin via `Field(maximum: Other_Field)` / `Field(minimum: Other_Field)`.

---

## Tips

1. Always use **`dataset: realtime`** for Robinhood liquidity and slippage (archive/combined are not supported). Use these cubes for **live and short-window** monitoring, not multi-month TVL history.
2. A pool's identity is the pair **(`Pool.SmartContract`, `Pool.PoolId`)**: filter with `SmartContract` for V2/V3 and `PoolId` for V4, and always deduplicate mixed sets with the composite `limitBy` — `by: [PoolEvent_Pool_SmartContract, PoolEvent_Pool_PoolId]` (V2/V3 pools all share `PoolId: "0x"`; V4 pools all share the manager contract).
3. Use **Float** for USD liquidity filters (`gt: 10000`) and **Int** for `SlippageBasisPoints` (`eq: 100`).
4. Treat `*InUSD: 0` as "USD unknown" (common on V2/V3 and non-ETH-quoted rows) and treat extreme `*InUSD` values on long-tail tokens as suspect — size with raw token amounts and sanity caps, and derive prices from `AmountCurrencyAInUSD ÷ AmountCurrencyA` when needed.
5. Window queries with `Block: { Time: { since_relative: { hours_ago: 1 } } }` (or absolute `since:`/`till:` ISO timestamps).
6. Filter WebSocket subscriptions by pool, token, or protocol — unfiltered streams are very noisy. Connect with the `graphql-transport-ws` subprotocol and the token in the URL ([WebSocket auth](/docs/authorization/websocket/)).
7. Symbol filters (`Currency.Symbol`) are handy for discovery but **symbols are not unique** — pin `SmartContract` addresses in production.
8. Combine with [Robinhood Trades](/docs/blockchain/robinhood/robinhood-trades/) for execution prints and [Transfers](/docs/blockchain/robinhood/robinhood-transfers/) for token movements around LP activity.

---

## FAQ

### Is Robinhood liquidity available in archive history?

No. `DEXPoolEvents` and `DEXPoolSlippages` on Robinhood work only with the **realtime** dataset. Archive and combined queries error. Build live monitors and short-window views here — not long historical TVL series from these cubes.

### How do I choose between DEXPoolEvents and DEXPoolSlippages?

Use **DEXPoolEvents** for current reserves and spot price after each pool update. Use **DEXPoolSlippages** when you need trade-size capacity and price impact at standard slippage tolerances.

### How do I size a swap with 1% max impact?

Query `DEXPoolSlippages` with `SlippageBasisPoints: { eq: 100 }` for your pool. Read `AtoB.MaxAmountIn` / `MinAmountOut` (or `BtoA` for the opposite direction).

### How do I find the deepest pool to trade a token?

Rank `DEXPoolSlippages` rows at a fixed tolerance by `MaxAmountIn` (raw units, with a sanity cap) or `MaxAmountInInUSD`, deduplicated per pool — see [Deepest pools by executable trade size](#deepest-pools-by-executable-trade-size). Cross-check winners against reserves in `DEXPoolEvents`.

### Can I get a TVL or price time series for a Robinhood pool?

Yes, within the realtime window: bucket `DEXPoolEvents` with `Time(interval: { count: 5, in: minutes })` and take closes via `Field(maximum: Block_Number)` — see [the time-series query](#pool-tvl-and-price-time-series-5-minute-buckets). For longer trade-based OHLCV history, use the [Robinhood Trades API](/docs/blockchain/robinhood/robinhood-trades/).

### Which DEX protocols run on Robinhood?

Pool events at the time of testing came from `uniswap_v3` (~63%), `uniswap_v4` (~29%), `uniswap_v2` (~7%), plus small shares of `pancake_swap_v3` and `pancakeswap_infinity`. Run the [protocol breakdown query](#protocol-activity-breakdown) for current numbers.

### Why are some USD fields 0 — or absurdly large?

USD enrichment covers mainly native-ETH-quoted pools; V2/V3 and exotic pairs often report `0`, and broken or one-sided pools can report inflated USD capacity (test runs saw trillion-dollar readings on meme pools). Prefer raw token amounts with sanity bounds, and derive USD from reserves where needed.

### Why is PoolId `0x` on some rows?

V2/V3 pools leave `PoolId` empty and identify the pool via `Pool.SmartContract`. V4 pools use a non-zero `PoolId` under a shared manager contract.
