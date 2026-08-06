---
title: "Pools.trade API — Uniswap Launchpad on Robinhood Chain"
description: "Pools.trade API: track the Uniswap launchpad on Robinhood Chain with Bitquery GraphQL. Query new token launches, Crowd Launch auctions, trades, OHLCV, and holders."
sidebar_position: 6
keywords:
  - Pools.trade API
  - pools.trade Robinhood API
  - Uniswap launchpad API
  - Uniswap launchpad Robinhood Chain
  - Uniswap token launcher API
  - Uniswap LiquidityLauncher
  - Robinhood Chain launchpad API
  - pools.trade new token launches
  - pools.trade TokenCreated event
  - pools.trade trades API
  - pools.trade price API
  - pools.trade OHLCV API
  - pools.trade token holders
  - Crowd Launch API
  - pools.trade Crowd Launch auction
  - continuous clearing auction API
  - pools.trade BidSubmitted event
  - pools.trade clearing price
  - pools.trade graduation
  - Uniswap v4 Robinhood Chain
  - Uniswap v4 PoolManager Robinhood
  - Robinhood Chain 4663
  - Bitquery pools.trade API
  - Bitquery Robinhood Events API
  - newly launched tokens Robinhood
  - meme coin launchpad API
---

# Pools.trade API — Uniswap Launchpad on Robinhood Chain

**[Pools.trade](https://pools.trade/)** is the token launchpad **built by Uniswap for Robinhood Chain**, launched on **5 August 2026**. Its contracts self-describe as the *Uniswap LiquidityLauncher*. This guide shows how to track **new pools.trade token launches**, **Crowd Launch auctions**, **trades**, **OHLCV prices**, and **holders** with Bitquery GraphQL APIs, using the `EVM(network: robinhood)` and `Trading` cubes.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::tip Related docs
- [Robinhood Trades API](/docs/blockchain/robinhood/robinhood-trades)
- [Robinhood Meme Coin Launches API](/docs/blockchain/robinhood/robinhood-meme-coin-launches)
- [Flap.sh API on Robinhood](/docs/blockchain/robinhood/flap-sh-api)
- [Bags.fm API on Robinhood](/docs/blockchain/robinhood/bags-fm-api)
- [Robinhood Token Holders API](/docs/blockchain/robinhood/robinhood-token-holders-api)
- [WebSocket subscriptions](/docs/subscriptions/websockets/)
:::

---

## How pools.trade differs from other launchpads

Most launchpads (Flap.sh, Bags.fm, pump.fun-style venues) run trades through a **custom bonding-curve contract**, then emit a **graduation event** when the token migrates to a real DEX pool.

**Pools.trade does not work that way.** Every launch immediately creates a **real Uniswap v4 pool** in the same transaction as the token mint. There is no separate bonding-curve AMM and no migration step.

| Property | Value |
| --- | --- |
| Network | Robinhood Chain (`network: robinhood`, chain ID **4663**) |
| AMM | **Uniswap v4** (`Protocol: uniswap_v4`) |
| Pool quote currency | **Native ETH** (`currency0` = `0x000…000`) |
| Pool fee | `2500` (0.25%) |
| Tick spacing | `25` |
| Hooks | **None** (`hooks` = `0x000…000`) |
| Launch supply | `1000000000` (1 billion, decimal-normalized) |

The practical consequences for anyone building on this data:

- **Trades are queryable from block one** in the `Trading` cube — you do not have to wait for graduation.
- The "bonding curve" you see in the UI is **single-sided concentrated liquidity** in a plain v4 pool, not a separate contract.
- There is **no `Graduated` / `LaunchedToDEX` event** to subscribe to for curve launches. See [Graduation](#graduation).

### The two launch modes

| Mode | UI label | Mechanism | Graduation target |
| --- | --- | --- | --- |
| **Curve launch** | *(default)* | Token + v4 pool created instantly; price discovered by trading | **$50,000 FDV** |
| **Crowd Launch** | `Crowd Launch` | A **continuous clearing auction (CCA)** runs first in its own per-token contract, then the pool opens | ~5 ETH-denominated raise |

Crowd Launches run in a **fixed ~4-hour window** and can be *oversubscribed*. Each auction gets its **own contract address**. See [Crowd Launch auctions](#crowd-launch-cca-auctions).

---

## Contract addresses

| Role | Address | Notes |
| --- | --- | --- |
| **Launch entry / router** | `0x0000ffffbe8efe702c8703ae3477ff5de3d319c0` | Emits the decoded `TokenCreated`; is `Transaction.To` for every launch |
| **Token factory** | `0x000000e200088d55c39a11f609e5f667729ad49b` | Emits the rich metadata event (name, symbol, description, image) |
| **Launchpad (primary)** | `0x23f8209572b4a1c2ad88a42749e830791fb027f1` | Emits `TokenLaunched` with the v4 `PoolKey` |
| **Launchpad (secondary)** | `0xad44d55e7f8337c3ce113fbb591486e85be104b2` | Same ABI, lower volume |
| **Uniswap v4 PoolManager** | `0x8366a39cc670b4001a1121b8f6a443a643e40951` | Shared singleton — **not** pools.trade-specific |
| **CCA auction** | *per token* | e.g. `0xD10dc5f79F95E953e710F1eDeBddE0baD2e8fed8` |
| **USDG** | `0x5fc5360d0400a0fd4f2af552add042d716f1d168` | Secondary quote token |
| **WETH** | `0x0bd7d308f8e1639fab988df18a8011f41eacad73` | Secondary quote token |

:::caution The v4 PoolManager is not a pools.trade filter
`0x8366a39c…` is the **Uniswap v4 singleton** for all of Robinhood Chain. Every v4 trade on the network routes through it, including pools launched elsewhere. Filtering on it will **not** isolate pools.trade activity — use the token set from `TokenCreated` instead (see [Top tokens](#top-poolstrade-tokens-by-volume)).
:::

---

## Event reference

`Log.Signature.Name` is populated only for events Bitquery has an ABI for. On pools.trade, **one launch event is decoded and the rest are raw** — including the entire Crowd Launch auction. Raw events are still fully queryable by their `SignatureHash` (topic0).

| Event | Emitter | Decoded? | topic0 (`SignatureHash`) |
| --- | --- | --- | --- |
| `TokenCreated(address)` | entry `0x0000ffff…` | ✅ **Yes** | `2e2b3f61b70d2d131b2a807371103cc98d51adcaa5e9a8f9c32658ad8426e74e` |
| `TokenDistributed(address,address,uint256)` | entry `0x0000ffff…` | ❌ Raw | `67226bacccef969dab310a9e55dc1cf821363658e433fd330344f5cc00c79ac8` |
| `TokenCreated(address,(string,string,string,bytes))` | factory `0x000000e2…` | ❌ Raw | `4ef8284ecf42d4cd19686572ffd87f630858c82398911e776cb831de35eddbf4` |
| `TokenLaunched(bytes32,address,address,(address,address,uint24,int24,address))` | launchpad `0x23f82095…` | ❌ Raw | `3b3d2bafdcae274a232217e1f80ee4305d3af6aa25c8b14b1681bd68d18042a4` |
| `DistributionInitialized(address,address,uint256)` | launchpad `0x23f82095…` | ❌ Raw | `0afd26d7f0833a451173acef122d058906aa7708ceb6f67ea7471a649d88b44b` |
| `BidSubmitted(uint256,address,uint256,uint128)` | CCA auction | ❌ Raw | `650baad5cd8ca09b8f580be220fa04ce2ba905a041f764b6a3fe2c848eb70540` |
| `ClearingPriceUpdated(uint256,uint256)` | CCA auction | ❌ Raw | `30adbe996d7a69a21fdebcc1f8a46270bf6c22d505a7d872c1ab4767aa707609` |
| `CheckpointUpdated(uint256,uint256,uint24)` | CCA auction | ❌ Raw | `f1e4b6d7d0d7c5deb6393a39862d66a2f2ecb034f3283a8a597f9bf0c36f76fa` |
| `TickInitialized(uint256)` | CCA auction | ❌ Raw | `7fdd20e2dbf90ff60a7d9be5ad62f1ec6d9d9cba8b36174a3839cafd059f0958` |
| `NextActiveTickUpdated(uint256)` | CCA auction | ❌ Raw | `b9a86892440ed5515518351623ecfc523d283b21e92f1505e533ef26137be5b0` |
| `AuctionStepRecorded(uint256,uint256,uint24)` | CCA auction | ❌ Raw | `6863f2b489f9186bf89231dc73aa0e9836f536b9ddb0f708f74260ed3160f297` |
| `Initialize` / `ModifyLiquidity` / `Swap` | v4 PoolManager | ✅ Yes | *(standard Uniswap v4)* |

:::note `SignatureHash` filters need the realtime dataset
Filtering by `Log: {Signature: {SignatureHash: …}}` is only served by the **realtime** dataset. Adding `dataset: archive` to a `SignatureHash` query returns
`no archive or API tables found for cube Event`. Use `Log.Signature.Name` (decoded events) for archive queries, and omit `dataset` for raw topic0 queries.

Note also that `SignatureHash` values are supplied **without** a `0x` prefix.
:::

---

## Newly launched tokens

### Latest pools.trade launches

The decoded `TokenCreated` event on the entry contract is the cleanest launch feed — one row per launch.

```graphql
{
  EVM(network: robinhood) {
    Events(
      limit: {count: 25}
      orderBy: {descending: Block_Time}
      where: {
        LogHeader: {Address: {is: "0x0000ffffbe8efe702c8703ae3477ff5de3d319c0"}}
        Log: {Signature: {Name: {is: "TokenCreated"}}}
      }
    ) {
      Block { Time Number }
      Transaction { Hash From }
      Arguments {
        Name
        Type
        Value {
          ... on EVM_ABI_Address_Value_Arg { address }
        }
      }
    }
  }
}
```

The single argument `token` is the new token's contract address. `Transaction.From` is the creator wallet.

:::note This event is intentionally thin
`TokenCreated(address)` carries **only** the token address — no name, symbol, or image. Those live in the *undecoded* factory event; see [Token metadata](#token-metadata-name-symbol-description-image).
:::

### Stream new launches in real time

Launches arrive continuously — pools.trade minted **6,907 tokens on 5 August 2026** alone. Polling will always lag; subscribe instead.

```graphql
subscription {
  EVM(network: robinhood) {
    Events(
      where: {
        LogHeader: {Address: {is: "0x0000ffffbe8efe702c8703ae3477ff5de3d319c0"}}
        Log: {Signature: {Name: {is: "TokenCreated"}}}
      }
    ) {
      Block { Time }
      Transaction { Hash From }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Address_Value_Arg { address }
        }
      }
    }
  }
}
```

### Launches via mint transfers

The equivalent transfer-based pattern — useful because it returns the token's **name, symbol and decimals** in the same row, which the decoded event does not.

```graphql
{
  EVM(network: robinhood) {
    Transfers(
      limit: {count: 25}
      orderBy: {descending: Block_Time}
      where: {
        Transfer: {
          Sender: {is: "0x0000000000000000000000000000000000000000"}
          Amount: {eq: "1000000000"}
        }
        Transaction: {To: {is: "0x0000ffffbe8efe702c8703ae3477ff5de3d319c0"}}
      }
    ) {
      Block { Time }
      Transaction { Hash From }
      Transfer {
        Amount
        Receiver
        Currency { Name Symbol Decimals SmartContract }
      }
    }
  }
}
```

:::note Amounts are decimal-normalized
`Transfer.Amount` is already adjusted for the token's `Decimals`, so `1000000000` means 1 billion whole tokens — not the raw on-chain integer.
:::

### Launches per day

```graphql
{
  EVM(network: robinhood, dataset: archive) {
    Events(
      where: {
        LogHeader: {Address: {is: "0x0000ffffbe8efe702c8703ae3477ff5de3d319c0"}}
        Log: {Signature: {Name: {is: "TokenCreated"}}}
        Block: {Time: {since: "2026-08-05T00:00:00Z"}}
      }
    ) {
      Block { Date }
      launches: count
    }
  }
}
```

### Most active token creators

Useful for spotting spam-bot deployers — a single wallet can mint hundreds of tokens a day.

```graphql
{
  EVM(network: robinhood, dataset: archive) {
    Events(
      limit: {count: 25}
      orderBy: {descendingByField: "launches"}
      where: {
        LogHeader: {Address: {is: "0x0000ffffbe8efe702c8703ae3477ff5de3d319c0"}}
        Log: {Signature: {Name: {is: "TokenCreated"}}}
        Block: {Time: {since: "2026-08-05T00:00:00Z"}}
      }
    ) {
      Transaction { From }
      launches: count
    }
  }
}
```

---

## Token metadata (name, symbol, description, image)

The factory contract emits `TokenCreated(address, (string,string,string,bytes))`, whose tuple carries the **description** and the **IPFS image URI** that the pools.trade UI renders. Bitquery does not decode it, so read `LogHeader.Data` and ABI-decode client-side.

```graphql
{
  EVM(network: robinhood) {
    Events(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {
        Log: {
          Signature: {
            SignatureHash: {is: "4ef8284ecf42d4cd19686572ffd87f630858c82398911e776cb831de35eddbf4"}
          }
        }
      }
    ) {
      Block { Time }
      Transaction { Hash }
      LogHeader { Address Data }
    }
  }
}
```

`LogHeader.Data` is standard ABI encoding: word 0 is the token address, words 1–5 are offsets into the tuple, and the dynamic `string` sections follow. Decoding a sample yields:

```text
token       0x7a5009db1689992cc56a863b3cbffd763f3d4144
description "A token launched through Uniswap LiquidityLauncher on Robinhood Chain."
image       ipfs://bafkreifh4km3huz6323y3tptlhsn6252q5atgd7zoqurko7kog5bcqs4
```

---

## The Uniswap v4 pool behind each launch

### PoolKey from `TokenLaunched`

`TokenLaunched` is the richest launch event: its indexed fields are the **v4 `poolId`**, and its data payload is the full **`PoolKey`**.

```graphql
{
  EVM(network: robinhood) {
    Events(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {
        Log: {
          Signature: {
            SignatureHash: {is: "3b3d2bafdcae274a232217e1f80ee4305d3af6aa25c8b14b1681bd68d18042a4"}
          }
        }
        LogHeader: {Address: {is: "0x23f8209572b4a1c2ad88a42749e830791fb027f1"}}
      }
    ) {
      Block { Time }
      Transaction { Hash }
      LogHeader { Address Data }
    }
  }
}
```

`LogHeader.Data` decodes as five 32-byte words:

| Word | Field | Typical value |
| --- | --- | --- |
| 0 | `currency0` | `0x000…000` (native ETH) |
| 1 | `currency1` | the launched token |
| 2 | `fee` | `2500` |
| 3 | `tickSpacing` | `25` |
| 4 | `hooks` | `0x000…000` |

:::tip Distinguishing pools.trade from other Robinhood launchpads
Other launchpads on Robinhood emit an **identically-named `TokenLaunched`** event. They are distinguishable by `tickSpacing`: pools.trade uses **25**, while `0xce57498d3474dcc244dfb6710ffbe6d4441cd2b2` and `0x60d73b21cdf2ea846ab3d58699bbbb8f29d72491` use **60**. Always constrain `LogHeader.Address` to the pools.trade launchpad contracts.
:::

### Decoded pool creation (`Initialize`)

The v4 PoolManager's `Initialize` **is** decoded, so you can read the same `PoolKey` without manual decoding — at the cost of having to scope it to a token.

```graphql
{
  EVM(network: robinhood) {
    Events(
      limit: {count: 5}
      orderBy: {descending: Block_Time}
      where: {
        LogHeader: {Address: {is: "0x8366a39cc670b4001a1121b8f6a443a643e40951"}}
        Log: {Signature: {Name: {is: "Initialize"}}}
      }
    ) {
      Block { Time }
      Transaction { Hash }
      Arguments {
        Name
        Type
        Value {
          ... on EVM_ABI_Address_Value_Arg { address }
          ... on EVM_ABI_BigInt_Value_Arg { bigInteger }
          ... on EVM_ABI_Bytes_Value_Arg { hex }
        }
      }
    }
  }
}
```

Returns `id` (poolId), `currency0`, `currency1`, `fee`, `tickSpacing`, `hooks`, `sqrtPriceX96`, `tick`.

---

## Trading data

pools.trade tokens are indexed in the `Trading` cube under the **generic Uniswap protocol family**, because they *are* ordinary Uniswap v4 pools:

| Field | Value |
| --- | --- |
| `Pair.Market.ProtocolFamily` | `Uniswap` |
| `Pair.Market.Protocol` | `uniswap_v4` |
| `Pair.Market.Network` | `Robinhood` |

:::caution There is no `pools.trade` protocol label
Unlike Bags.fm (`ProtocolFamily: "Bags"`), pools.trade tokens **cannot be isolated by protocol filter** — `uniswap_v4` on Robinhood also covers pools created outside pools.trade. To scope a query to pools.trade, first collect the token set from `TokenCreated`, then filter `Trading` by `Token.Address: {in: [...]}`.

Tokens also migrate onto other venues once liquid — the same token can show `uniswap_v3` and `pancake_swap_v3` markets with `WETH` and `USDG` quotes.
:::

### Latest trades for a pools.trade token

```graphql
{
  Trading {
    Trades(
      limit: {count: 50}
      orderBy: {descending: Block_Time}
      where: {
        Pair: {
          Token: {Address: {is: "0x6245e67affa44a23077f0ea7f981a8dc743a0c47"}}
          Market: {Network: {is: "Robinhood"}}
        }
      }
    ) {
      Block { Time }
      Side
      Price
      PriceInUsd
      Amounts { Base Quote }
      AmountsInUsd { Base Quote }
      Trader { Address }
      TransactionHeader { Hash }
      Pair {
        Token { Address Symbol Name }
        QuoteToken { Address Symbol }
        Pool { Address }
        Market { Protocol ProtocolFamily Network }
      }
    }
  }
}
```

:::caution Deduplicate before summing USD volume
On Robinhood v4, `Trading.Trades` returns **each trade leg roughly twice**, with the two copies differing only in the last decimals of `AmountsInUsd`. In a measured 300-row sample, 138 of 162 distinct legs appeared exactly twice — a **1.9× inflation factor**.

Deduplicate on `(TransactionHeader.Hash, Block.Time, Side, Amounts.Base, Pair.QuoteToken.Symbol, Trader.Address)` before aggregating. Naively summing FRONG's `Volume_Usd` over 24h gives **$61.8M**; after deduplication it is **$30.9M**, which matches the $30.8M that pools.trade itself reports.

Note also that one user swap can fan out into **several routed legs** across ETH, WETH, and USDG pairs in the same transaction. Summing every leg overstates end-user volume even after deduplication.
:::

### OHLCV price candles

```graphql
{
  Trading {
    Tokens(
      limit: {count: 24}
      orderBy: {descending: Block_Time}
      where: {
        Token: {Address: {is: "0x6245e67affa44a23077f0ea7f981a8dc743a0c47"}}
        Interval: {Time: {Duration: {eq: 3600}}}
      }
    ) {
      Block { Time }
      Token { Address Symbol Name Network }
      Volume { Usd }
      Price { Ohlc { Open High Low Close } }
    }
  }
}
```

Change `Duration` to `60`, `300`, `900`, or `86400` for other candle sizes.

### Top pools.trade tokens by volume

The two-step pattern: pass a token set harvested from `TokenCreated` into the `Trading` cube.

```graphql
{
  Trading {
    Tokens(
      limit: {count: 25}
      orderBy: {descendingByField: "vol"}
      where: {
        Token: {
          Address: {in: [
            "0x6245e67affa44a23077f0ea7f981a8dc743a0c47",
            "0x385b36ff682ab4c76e7c37a66b96aabc466471d5",
            "0xd3d5be6558f84e628ee091b511df92b4e461a53b"
          ]}
          Network: {is: "Robinhood"}
        }
        Interval: {Time: {Duration: {eq: 3600}}}
        Block: {Time: {since: "2026-08-05T06:00:00Z"}}
      }
    ) {
      Token { Address Symbol Name }
      vol: sum(of: Volume_Usd)
      trades: count
    }
  }
}
```

:::note Keep per-interval metrics out of aggregations
Selecting a per-row metric such as `Supply { MarketCap }` alongside `sum(of: Volume_Usd)` adds it as a grouping key, so you get one row **per interval** instead of one row per token. Drop it to get a clean per-token total.

Time windows go in `Block: {Time: {since: …}}` — `Interval.Time.Since` is not a valid field.
:::

---

## Crowd Launch (CCA) auctions

A Crowd Launch runs a **continuous clearing auction** in its own contract for ~4 hours before the pool opens. Bidders submit into discrete **price ticks**; the clearing price ratchets up as the book fills, and the auction can end **oversubscribed**.

All auction events are **raw**, so query them by topic0. Because each auction has its own contract, filtering on `SignatureHash` alone gives you **every auction on the network at once** — which is usually what you want.

### Every bid across all live auctions

```graphql
{
  EVM(network: robinhood) {
    Events(
      limit: {count: 50}
      orderBy: {descending: Block_Time}
      where: {
        Log: {
          Signature: {
            SignatureHash: {is: "650baad5cd8ca09b8f580be220fa04ce2ba905a041f764b6a3fe2c848eb70540"}
          }
        }
      }
    ) {
      Block { Time Number }
      Transaction { Hash From }
      LogHeader { Address Data }
    }
  }
}
```

`LogHeader.Address` is the auction contract; `Transaction.From` is the bidder. `BidSubmitted(uint256 auctionId, address bidder, uint256, uint128)` has its first two parameters indexed, so `LogHeader.Data` holds the two remaining numeric fields (amount and tick/quantity).

### Clearing price updates

```graphql
{
  EVM(network: robinhood) {
    Events(
      limit: {count: 50}
      orderBy: {descending: Block_Time}
      where: {
        Log: {
          Signature: {
            SignatureHash: {is: "30adbe996d7a69a21fdebcc1f8a46270bf6c22d505a7d872c1ab4767aa707609"}
          }
        }
        LogHeader: {Address: {is: "0xD10dc5f79F95E953e710F1eDeBddE0baD2e8fed8"}}
      }
    ) {
      Block { Time }
      Transaction { Hash }
      LogHeader { Address Data }
    }
  }
}
```

Swap the `SignatureHash` for any row in the [event reference](#event-reference) to follow tick initialization (`TickInitialized`), the moving book edge (`NextActiveTickUpdated`), or auction checkpoints (`CheckpointUpdated`, `AuctionStepRecorded`).

:::note Prices are Q96 fixed-point
Clearing, floor, and tick-size prices are **Q96** values. Divide by `2**96` to get a human-readable ratio.
:::

---

## Holders and supply

```graphql
{
  EVM(dataset: archive, network: robinhood) {
    Holders(
      limit: {count: 100}
      orderBy: {descending: Balance_Amount}
      where: {
        Currency: {SmartContract: {is: "0x6245e67affa44a23077f0ea7f981a8dc743a0c47"}}
        Balance: {Amount: {gt: "0"}}
      }
    ) {
      Holder { Address }
      Balance { Amount FirstChangeTime LastChangeTime UpdateCount }
    }
  }
}
```

:::caution Exclude the PoolManager from holder analytics
The **top holder of every pools.trade token is the Uniswap v4 PoolManager** `0x8366a39cc670b4001a1121b8f6a443a643e40951`, because the pool's liquidity is held there. For FRONG it holds ~57M tokens with 301,360 balance updates.

Filter it out before computing holder counts, concentration, or "top wallet" leaderboards, or the pool itself will dominate every result.
:::

For circulating supply and market cap, see [Robinhood Token Supply](/docs/blockchain/robinhood/robinhood-token-supply).

---

## Graduation

The pools.trade UI shows a **graduation progress** percentage and a *Near graduation* filter. It is computed off-chain as:

```text
graduationProgress = fdvUsd / graduationTargetUsd * 100
```

with a **$50,000 FDV** target for curve launches. Because the v4 pool already exists from block one, crossing 100% does **not** emit a migration event — tokens well past target still report a live-curve status.

To reproduce it, take FDV from the `Trading` cube (`Supply { MarketCap }`) and compare against the $50,000 threshold, rather than looking for an on-chain graduation event.

Crowd Launch auctions **do** have a discrete terminal state: the auction contract stops accepting bids at `endsAt` and the token transitions to graduated. Track that via the auction's final `CheckpointUpdated` / `ClearingPriceUpdated` events, or by watching for the first `Swap` on the token's v4 pool.

---

## FAQ

### How do I detect a newly launched pools.trade token?

Subscribe to the decoded `TokenCreated` event on `0x0000ffffbe8efe702c8703ae3477ff5de3d319c0`, or watch for mint transfers of `1000000000` where `Transaction.To` is that contract. See [Newly launched tokens](#newly-launched-tokens).

### Why can't I filter pools.trade trades by protocol?

Because pools.trade tokens trade in **plain Uniswap v4 pools**, they are indexed as `ProtocolFamily: "Uniswap"` / `Protocol: "uniswap_v4"` alongside every other v4 pool on Robinhood. Scope queries by token address instead — see [Top pools.trade tokens](#top-poolstrade-tokens-by-volume).

### Why is my USD volume roughly double what pools.trade shows?

`Trading.Trades` returns each leg about twice on Robinhood v4. Deduplicate before summing — see the [caution above](#latest-trades-for-a-poolstrade-token).

### How do I track Crowd Launch bids?

All CCA auction events are undecoded, so filter `Log.Signature.SignatureHash` on `650baad5…` for `BidSubmitted`. Omit `dataset: archive` — `SignatureHash` filtering is realtime-only.

### Where do I get a token's name, symbol, and image?

The decoded `TokenCreated(address)` has only the address. Use the mint-transfer query for name/symbol/decimals, or ABI-decode the raw factory event for description and IPFS image — see [Token metadata](#token-metadata-name-symbol-description-image).

### Is there a bonding-curve contract to query?

No. Unlike Flap.sh or Bags.fm, pools.trade has no separate bonding-curve AMM and no `LaunchedToDEX`-style graduation event. Trades hit a real Uniswap v4 pool from the first block.

---

## Next steps

- [Robinhood Trades API](/docs/blockchain/robinhood/robinhood-trades) — full trade schema for the network
- [Robinhood Meme Coin Launches API](/docs/blockchain/robinhood/robinhood-meme-coin-launches) — compare launchpads side by side
- [Robinhood Token Holders API](/docs/blockchain/robinhood/robinhood-token-holders-api) — holder distribution queries
- [WebSocket subscriptions](/docs/subscriptions/websockets/) — turn any query above into a live stream
