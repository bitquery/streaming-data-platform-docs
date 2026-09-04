---
title: "Robinhood Chain New Pools & Trending Tokens API"
description: "Query new Uniswap pools, trending tokens, most active pools, pair lookups and token search on Robinhood Chain with Bitquery GraphQL and WebSocket streams."
sidebar_position: 2
keywords:
  - Robinhood Chain new pools API
  - Robinhood Chain trending tokens
  - Robinhood Chain new pairs
  - Robinhood Chain pair lookup
  - Robinhood Chain token search API
  - Robinhood Chain DEX pairs
  - new pools Robinhood Chain
  - trending pools Robinhood Chain
  - GeckoTerminal Robinhood Chain alternative
  - DexScreener Robinhood Chain alternative
  - Robinhood Chain Uniswap v4 pools
  - Robinhood Chain new token listings
  - Robinhood Chain most traded tokens
  - Bitquery Robinhood pools API
---

# Robinhood Chain New Pools & Trending Tokens API

This page covers the four questions a token screener asks on **Robinhood Chain**: *what pools were just created*, *what is trading right now*, *what is this pair*, and *where is the token with this symbol*. Every answer is a GraphQL query you can run on your own key, page through, and convert to a WebSocket stream — no rate-limited third-party endpoint in between.

If you have been calling a public aggregator's Robinhood endpoints and hit their limits, coverage gaps, or delays, the table below maps each one to its Bitquery equivalent.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::tip Related docs
- [Robinhood Chain API overview](/docs/blockchain/robinhood/) — every Robinhood Chain API, launchpad guide and stream in one place
- [Robinhood Trades API](/docs/blockchain/robinhood/robinhood-trades) — prices, OHLCV, market cap, top traders
- [Robinhood Liquidity & Slippage API](/docs/blockchain/robinhood/robinhood-liquidity) — pool reserves, TVL and price impact
- [Robinhood Meme Coin Launches API](/docs/blockchain/robinhood/robinhood-meme-coin-launches) — new tokens by launchpad
- [Crypto Price API](/docs/trading/crypto-price-api/introduction/) — the `Trading` cubes in full
- [WebSocket subscriptions](/docs/subscriptions/websockets/)
:::

---

## What you would call elsewhere {#endpoint-mapping}

| Screener endpoint | Bitquery equivalent | Section |
| --- | --- | --- |
| `networks/robinhood/new_pools` | `Initialize` and `PoolCreated` events on `EVM.Events` | [New pools](#new-pools) |
| `networks/robinhood/pools` | `Trading.Trades` grouped by `Pair.Pool.Address` | [Most active pools](#most-active-pools) |
| `networks/robinhood/trending_pools` | `Trading.Trades` over a 24-hour bound | [Trending tokens](#trending-tokens) |
| `dex/pairs/robinhood/{pool}` | `Trading.Trades` filtered on `Pair.Pool.Address`, or `Pair.Pool.Id` for Uniswap v4 | [Look up a pair](#pair-lookup) |
| `dex/search?q={text}` | `Trading.Trades` filtered on `Token.Symbol` / `Token.Name` | [Search for a token](#token-search) |
| Pool reserves and TVL | `EVM.DEXPoolEvents` | [Liquidity API](/docs/blockchain/robinhood/robinhood-liquidity) |

Two differences are worth knowing before you port a screener across. Bitquery returns **every pool on the chain**, including the thousands minted by launchpads each day, so most feeds want a filter rather than the raw firehose. And any query here becomes a live stream by swapping `query` for `subscription`, which removes the polling loop a REST screener forces on you.

---

## New pools {#new-pools}

Robinhood Chain creates pools through two paths, and a complete new-pool feed reads both.

### Uniswap v4 pools

Uniswap v4 keeps every pool inside one singleton, the **PoolManager** at `0x8366a39cc670b4001a1121b8f6a443a643e40951`, which emits `Initialize` for each new pool. This is the busiest path on the chain by a wide margin, because the launchpads graduate into it.

```graphql
{
  EVM(network: robinhood, dataset: combined) {
    Events(
      limit: {count: 25}
      orderBy: {descending: Block_Time}
      where: {
        LogHeader: {Address: {is: "0x8366a39cc670b4001a1121b8f6a443a643e40951"}}
        Log: {Signature: {Name: {is: "Initialize"}}}
        Block: {Time: {since_relative: {hours_ago: 1}}}
      }
    ) {
      Block { Time }
      Transaction { Hash From }
      Arguments {
        Name
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

`Initialize` decodes into eight arguments: `id` (the v4 pool id), `currency0` and `currency1` (the pair, where `0x000…000` means native ETH), `fee`, `tickSpacing`, `hooks`, `sqrtPriceX96` and the opening `tick`.

The **`hooks` argument is the useful one for filtering**. It is `0x000…000` for a plain pool, and a protocol's own address when that protocol owns the pool — so a single `Arguments` filter isolates one launchpad's graduations:

```graphql
{
  EVM(network: robinhood, dataset: combined) {
    Events(
      limit: {count: 25}
      orderBy: {descending: Block_Time}
      where: {
        LogHeader: {Address: {is: "0x8366a39cc670b4001a1121b8f6a443a643e40951"}}
        Log: {Signature: {Name: {is: "Initialize"}}}
        Arguments: {includes: {
          Name: {is: "hooks"}
          Value: {Address: {is: "0xe5e702641ea86f4ae6cc3cdaed2b886f976be044"}}
        }}
      }
    ) {
      Block { Time }
      Transaction { Hash }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Address_Value_Arg { address }
          ... on EVM_ABI_BigInt_Value_Arg { bigInteger }
        }
      }
    }
  }
}
```

That hook address is the [Pons](/docs/blockchain/robinhood/pons-api) meme hook, so the query returns Pons graduations only. Swap it for any other protocol's hook.

### Uniswap v3 and other factories

The older factory model emits `PoolCreated` from the factory contract itself. Several factories are live on Robinhood Chain, so filter by the event name and read `LogHeader.Address` to see which factory minted each pool.

```graphql
{
  EVM(network: robinhood, dataset: combined) {
    Events(
      limit: {count: 25}
      orderBy: {descending: Block_Time}
      where: {
        Log: {Signature: {Name: {is: "PoolCreated"}}}
        Block: {Time: {since_relative: {hours_ago: 6}}}
      }
    ) {
      Block { Time }
      LogHeader { Address }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Address_Value_Arg { address }
          ... on EVM_ABI_BigInt_Value_Arg { bigInteger }
        }
      }
    }
  }
}
```

`PoolCreated` gives `token0`, `token1`, `fee`, `tickSpacing` and the new `pool` address.

To see which factories are actually producing pools, group the same event by emitter:

```graphql
{
  EVM(network: robinhood, dataset: combined) {
    Events(
      limit: {count: 15}
      orderBy: {descendingByField: "count"}
      where: {
        Log: {Signature: {Name: {is: "PoolCreated"}}}
        Block: {Time: {since_relative: {hours_ago: 24}}}
      }
    ) {
      LogHeader { Address }
      count
    }
  }
}
```

The chain-wide Uniswap V3 factory `0x1f7d7550b1b028f7571e69a784071f0205fd2efa` dominates this list. It is **not** owned by any launchpad, so do not treat it as a protocol filter.

### Stream new pools

Both feeds work as subscriptions. This one pushes every new v4 pool as its block is indexed:

```graphql
subscription {
  EVM(network: robinhood) {
    Events(
      where: {
        LogHeader: {Address: {is: "0x8366a39cc670b4001a1121b8f6a443a643e40951"}}
        Log: {Signature: {Name: {is: "Initialize"}}}
      }
    ) {
      Block { Time }
      Transaction { Hash From }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Address_Value_Arg { address }
          ... on EVM_ABI_BigInt_Value_Arg { bigInteger }
        }
      }
    }
  }
}
```

:::caution A raw new-pool feed is mostly launchpad noise
Thousands of pools are created on Robinhood Chain every day, and the overwhelming majority never attract a second trade. If you are building a watchlist rather than an archive, filter by `hooks`, or start from [trending tokens](#trending-tokens) and work backwards to the pool.
:::

---

## Trending tokens {#trending-tokens}

The `Trading` cubes carry swaps with USD pricing already attached, so a trending list is one aggregation over a time bound. Rank by **trade count and unique traders** rather than USD volume: thin pools can print enormous dollar figures from a single swap.

### Most traded tokens in the last 24 hours

```graphql
{
  Trading {
    Trades(
      limit: {count: 25}
      orderBy: {descendingByField: "trades"}
      where: {
        Pair: {Market: {NetworkBid: {is: "bid:robinhood"}}}
        Block: {Time: {since_relative: {hours_ago: 24}}}
      }
    ) {
      Pair {
        Token { Symbol Name Address }
      }
      trades: count
      traders: uniq(of: Trader_Address)
      buys: count(if: {Side: {is: "Buy"}})
      sells: count(if: {Side: {is: "Sell"}})
    }
  }
}
```

`Side` is the string `"Buy"` or `"Sell"`, so the two `count(if: …)` aggregates give you buy pressure alongside the raw count. Widen or narrow the window with `hours_ago`.

### Most active pools {#most-active-pools}

The same aggregation keyed on the pair answers "which pools are hot", which is what a trending-pools endpoint returns. Rows are grouped by the whole `Pair` selection, so Uniswap v4 pairs come back separately even though they share one `Pool.Address` — read `Pool.Id` to tell them apart:

```graphql
{
  Trading {
    Trades(
      limit: {count: 25}
      orderBy: {descendingByField: "trades"}
      where: {
        Pair: {Market: {NetworkBid: {is: "bid:robinhood"}}}
        Block: {Time: {since_relative: {hours_ago: 24}}}
      }
    ) {
      Pair {
        Pool { Address Id }
        Token { Symbol Address }
        QuoteToken { Symbol }
        Market { Protocol }
      }
      trades: count
      traders: uniq(of: Trader_Address)
    }
  }
}
```

### Where trading happens

Grouping by protocol shows how the chain's activity is split, and how many distinct pools each venue is running:

```graphql
{
  Trading {
    Trades(
      limit: {count: 15}
      orderBy: {descendingByField: "trades"}
      where: {
        Pair: {Market: {NetworkBid: {is: "bid:robinhood"}}}
        Block: {Time: {since_relative: {hours_ago: 24}}}
      }
    ) {
      Pair { Market { Protocol ProtocolFamily } }
      trades: count
      traders: uniq(of: Trader_Address)
    }
  }
}
```

Uniswap v3 and v4 carry most of the trades on the chain. The bonding-curve launchpads sit at the other end of the shape: they mint one pool per launched token, so they run far more pools than the AMMs while averaging a small fraction of the trades on each.

:::caution Do not count pools with `uniq(of: Pair_Pool_Address)`
No single field counts pools correctly across venues, which is why the query above does not try. Uniswap v4 keeps every pool inside one singleton contract, so **all v4 pairs report the same `Pool.Address`** and that aggregate collapses them to `1`. The reverse is true of `Pool.Id`, which only v4-style venues populate. Count pools within one protocol at a time, using `Pool.Id` for Uniswap v4 and PancakeSwap Infinity and `Pool.Address` for everything else.
:::

---

## Look up a pair {#pair-lookup}

Given a pool address, return its recent trades with both sides of the pair, the venue, and price in the quote asset and in USD. This works for pools that have their own contract — Uniswap v2 and v3, PancakeSwap v3, and the bonding-curve launchpads. **Uniswap v4 needs `Pool.Id` instead**, covered right below.

```graphql
{
  Trading {
    Trades(
      limit: {count: 25}
      orderBy: {descending: Block_Time}
      where: {
        Pair: {
          Market: {NetworkBid: {is: "bid:robinhood"}}
          Pool: {Address: {is: "0xbbaefcfcd7b92ed0df1a3eec22a21ba6beb0b52b"}}
        }
      }
    ) {
      Block { Time }
      Pair {
        Token { Symbol Name Address }
        QuoteToken { Symbol Address }
        Market { Protocol }
        Pool { Address Id }
      }
      Price
      PriceInUsd
      Amounts { Base Quote }
      AmountsInUsd { Base }
      Side
      Trader { Address }
      TransactionHeader { Hash }
    }
  }
}
```

`Price` and `PriceInUsd` are plain numbers on this cube, not nested objects. For candles, market cap and supply on the same pair, see the [Trades API](/docs/blockchain/robinhood/robinhood-trades); for reserves and price impact, see the [Liquidity API](/docs/blockchain/robinhood/robinhood-liquidity).

### Uniswap v4 pairs: look up by pool id {#v4-pool-id}

Uniswap v4 has no per-pool contract. Every v4 pool lives inside the PoolManager singleton, so **`Pool.Address` is `0x8366a39cc670b4001a1121b8f6a443a643e40951` on every v4 pair** and filtering on it returns the whole venue rather than one pair. The per-pool identifier is `Pool.Id`, the 32-byte v4 pool id:

```graphql
{
  Trading {
    Trades(
      limit: {count: 25}
      orderBy: {descending: Block_Time}
      where: {
        Pair: {
          Market: {NetworkBid: {is: "bid:robinhood"}}
          Pool: {Id: {is: "0x7fb39eb653999feb9f0d3b1410848911383dfc681f3585229df4aa5b560bf0ba"}}
        }
      }
    ) {
      Block { Time }
      Pair {
        Token { Symbol Name Address }
        QuoteToken { Symbol }
        Market { Protocol }
        Pool { Id }
      }
      Price
      PriceInUsd
      Side
      Trader { Address }
    }
  }
}
```

This is the same value the `Initialize` event carries in its `id` argument, so a pool you picked up from the [new-pool feed](#new-pools) can be handed straight to this query — add the `0x` prefix, which the event argument omits. If you only have a token address, filter on `Pair.Token.Address` instead and read `Pool.Id` off the result.

### Newly listed tokens

Sorting ascending inside a recent window gives the first trades to arrive — tokens that just started trading, with the pool and venue they landed on:

```graphql
{
  Trading {
    Trades(
      limit: {count: 25}
      orderBy: {ascending: Block_Time}
      where: {
        Pair: {Market: {NetworkBid: {is: "bid:robinhood"}}}
        Block: {Time: {since_relative: {hours_ago: 2}}}
      }
    ) {
      Block { Time }
      Pair {
        Token { Symbol Name Address }
        QuoteToken { Symbol }
        Market { Protocol }
        Pool { Address }
      }
    }
  }
}
```

:::note This is "first trade in the window", not "first trade ever"
The `Trading` cubes hold a rolling window of roughly the last 30 days. Ascending order inside that window returns the oldest rows it still holds, so for a token older than the window you get its oldest *retained* trade. To pin a real launch time, find the mint on the [Meme Coin Launches API](/docs/blockchain/robinhood/robinhood-meme-coin-launches) or the launchpad's own guide.
:::

---

## Search for a token {#token-search}

### By symbol

```graphql
{
  Trading {
    Trades(
      limit: {count: 25}
      orderBy: {descendingByField: "trades"}
      where: {
        Pair: {
          Market: {NetworkBid: {is: "bid:robinhood"}}
          Token: {Symbol: {includesCaseInsensitive: "cat"}}
        }
        Block: {Time: {since_relative: {hours_ago: 24}}}
      }
    ) {
      Pair { Token { Symbol Name Address } }
      trades: count
      traders: uniq(of: Trader_Address)
    }
  }
}
```

### By name

```graphql
{
  Trading {
    Trades(
      limit: {count: 25}
      orderBy: {descendingByField: "trades"}
      where: {
        Pair: {
          Market: {NetworkBid: {is: "bid:robinhood"}}
          Token: {Name: {includesCaseInsensitive: "gamestop"}}
        }
        Block: {Time: {since_relative: {hours_ago: 24}}}
      }
    ) {
      Pair { Token { Symbol Name Address } }
      trades: count
    }
  }
}
```

:::caution Symbols and names are not unique
Anyone can deploy a token called `GME`. A name search on Robinhood Chain returns the tokenized stock alongside look-alikes, and ordering by trade count is what separates them — the real one is usually far ahead. Always resolve to a **contract address** before you quote a price, and never treat a symbol match as identity.
:::

---

## Datasets and windows {#datasets}

| Data | Where it lives | Reach |
| --- | --- | --- |
| New pools (`Initialize`, `PoolCreated`) | `EVM.Events` | `realtime` holds the most recent days; add `dataset: combined` or `archive` for history |
| Trending, pair lookup, search | `Trading` cubes | A rolling window of roughly the last 30 days; takes no `dataset` argument |
| Pool reserves and TVL | `EVM.DEXPoolEvents` | **Realtime only** on Robinhood Chain — see the [Liquidity API](/docs/blockchain/robinhood/robinhood-liquidity) |

The most common surprise is an event query that works for today and returns nothing for last month: that is the default `realtime` dataset, and `dataset: combined` fixes it. See [data coverage and retention](/docs/graphql/data-coverage-retention).

---

## FAQ {#faq}

### How do I get new pools on Robinhood Chain without a third-party API?

Read `Initialize` from the Uniswap v4 PoolManager and `PoolCreated` from the v3 factories, both on `EVM.Events`. Run them as subscriptions and you have a push feed instead of a polling loop. See [New pools](#new-pools).

### Why does my new-pool feed return thousands of pools an hour?

Because it is complete. Robinhood Chain launchpads mint pools continuously and most never trade again. Filter by the `hooks` argument on v4, or build your list from [trending tokens](#trending-tokens) instead.

### How do I find trending tokens or pairs?

Aggregate `Trading.Trades` over a `Block.Time` bound, ranked by `count` and `uniq(of: Trader_Address)`. Rank by trade count rather than USD volume, since thin pools distort dollar figures.

### How do I look up a pair by pool address?

Filter `Trading.Trades` on `Pair.Pool.Address`. That returns both sides of the pair, the venue, the price in quote and USD terms, and the trader. **Uniswap v4 is the exception**: all its pools share the PoolManager address, so filter `Pair.Pool.Id` instead. See [Look up a pair](#pair-lookup) and [Uniswap v4 pairs](#v4-pool-id).

### Can I search tokens by symbol or name?

Yes, with `includesCaseInsensitive` on `Token.Symbol` or `Token.Name`. Symbols are not unique on-chain, so rank by trade count and resolve to a contract address before trusting a match.

### Does this cover pool liquidity and TVL?

Not on this page. Reserves, depth and per-swap slippage live in the [Robinhood Liquidity & Slippage API](/docs/blockchain/robinhood/robinhood-liquidity), which uses the `DEXPools` cubes.

---

## Next steps

- [Robinhood Trades API](/docs/blockchain/robinhood/robinhood-trades) — prices, OHLCV candles, market cap and top traders
- [Robinhood Liquidity & Slippage API](/docs/blockchain/robinhood/robinhood-liquidity) — reserves, TVL and price impact
- [Robinhood Meme Coin Launches API](/docs/blockchain/robinhood/robinhood-meme-coin-launches) — new tokens by launchpad
- [Pons Launchpad API](/docs/blockchain/robinhood/pons-api) — the launchpad behind most v4 graduations
- [Robinhood Chain API overview](/docs/blockchain/robinhood/) — the full cube map
- [WebSocket subscriptions](/docs/subscriptions/websockets/) — turn any query above into a stream
