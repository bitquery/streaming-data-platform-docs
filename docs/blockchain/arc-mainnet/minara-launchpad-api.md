---
title: "Minara Launchpad API on Arc: Tokens, Trades and OHLCV"
sidebar_label: "Minara Launchpad API"
description: "Track Minara.fun launches on Circle's Arc blockchain. Verify token creators and pools, then query trades, USD prices and OHLCV with Bitquery's Trading cubes."
sidebar_position: 5
keywords:
  - Minara launchpad API
  - Minara.fun API
  - Minara token launches
  - Minara fee hook
  - Minara token price API
  - Minara OHLCV API
  - Arc launchpad API
  - Circle blockchain API
---

import FAQ from "@site/src/components/FAQ";

# Minara Launchpad API on Arc: Tokens, Trades and OHLCV

Track [Minara.fun](https://minara.fun/) token launches on Arc, Circle's EVM blockchain. Verify each token's launch and creator from on-chain events, then use the Trading cubes for swaps, pool prices and token candles.

Use `EVM.Events` for launch records. Trading examples use `Trading.Trades`, `Trading.Pairs` and `Trading.Tokens`, with the Arc network ID `bid:arc`.

:::note API access and history
Run the saved queries in the Bitquery IDE, or create an [API access token](/docs/authorization/how-to-generate/) for `https://streaming.bitquery.io/graphql`. Streams use `wss://streaming.bitquery.io/graphql` with [WebSocket authorization](/docs/authorization/websocket/).

Leave `dataset` unset in these examples. A 24-hour filter does not promise 24 hours of indexed Arc history. Check [data coverage and retention](/docs/graphql/data-coverage-retention/) before requesting older launches.
:::

## Contracts and launch identity

Minara's [contract list](https://api.minara.fun/minara-fun/contracts?chainId=5042) and [launch strategy list](https://api.minara.fun/minara-fun/launch-strategies?chainId=5042) publish these Arc addresses. Check the lists for new deployments and retain verified older addresses in your own registry.

| Contract | Arc address |
| --- | --- |
| Liquidity Launcher, launch entry point | `0xb6c6f77ee74af874a183bfd77dd0176d1ac91de6` |
| Current InstantLaunchStrategyWithHook | `0x4d3a3f4e1a918845c2038bc064c4d250822b203e` |
| Shared UERC20Factory | `0xff99d8f6c994607576eb652edcf12e04a7ebfbf6` |
| Minara fee hook | `0xb6a65950534f061618b4ae102fbcbb8541a8e0cc` |
| Uniswap v4 PoolManager | `0x8366a39cc670b4001a1121b8f6a443a643e40951` |

The fee hook emits `PoolRegistered`, which records the pool ID, token and creator. The token factory is shared; its `TokenCreated` event alone cannot prove that a token came from Minara. A shared PoolManager address also cannot identify one pool.

### Find recent launches

Filter by Minara's verified strategy address and its `TokenLaunched` signature. Success and revert checks exclude failed launches. This feed covers the listed strategy; it does not claim every historical Minara deployment.

[Run in Bitquery IDE](https://ide.bitquery.io/arc-mainnet-minara-latest-launches)

```graphql
query {
  EVM(network: arc) {
    Events(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        Block: {Time: {since_relative: {hours_ago: 24}}}
        TransactionStatus: {Success: true}
        Call: {Success: true, Reverted: false}
        LogHeader: {Address: {in: ["0x4d3a3f4e1a918845c2038bc064c4d250822b203e"]}, Removed: false}
        Log: {Signature: {SignatureHash: {is: "3b3d2bafdcae274a232217e1f80ee4305d3af6aa25c8b14b1681bd68d18042a4"}}}
      }
    ) {
      Block {Number Time}
      Transaction {Hash From}
      LogHeader {Address Index Data}
      Log {Signature {SignatureHash}}
      Topics {Hash}
    }
  }
}
```

In the zero-based `Topics` array:

- `Topics[0].Hash` is the event signature.
- `Topics[1].Hash` is the pool ID.
- `Topics[2].Hash` is the token address, padded to 32 bytes.
- `Topics[3].Hash` is `finalPositionRecipient`, the LP position recipient. Read the creator from `PoolRegistered`.

Take the final 40 hex characters of the token topic and add `0x`. Prefix that address with `bid:arc:` for Trading queries.

For `Trading` pool filters, keep all 64 hex characters of the pool topic and add `0x` if absent. Pass that value as `Pool.Id`.

## Verify a token, pool and creator

The sample token is `0xa163d7624da3b5d9182c50eab5b8cd247ae861bb`, named Minara. A token's name is user-supplied and does not establish ownership by the platform.

| Sample field | Verified value |
| --- | --- |
| Launch pool ID | `0xd77a1efbc8d143b100cf2496ff970da0a616a6796886e6ba1f45e7d7e09bb150` |
| Creator at launch | `0x47ba13f9cc965fc89d7c7fb2f568fe873ad31751` |
| Launch transaction | `0xf4bda4c4dc4b8a28f0367abe0587aa2de369e885a8b8ce56e32ebe65df11747b` |

### Read the launch receipt

Fetch the four contract/event pairs from the same successful transaction. Compare their values using the checks below. To verify another launch, replace the transaction hash with one returned by the launch feed.

[Run in Bitquery IDE](https://ide.bitquery.io/arc-mainnet-minara-launch-receipt)

```graphql
query {
  EVM(network: arc) {
    Events(
      limit: {count: 20}
      orderBy: {ascending: LogHeader_Index}
      where: {
        Transaction: {Hash: {is: "0xf4bda4c4dc4b8a28f0367abe0587aa2de369e885a8b8ce56e32ebe65df11747b"}}
        TransactionStatus: {Success: true}
        Call: {Success: true, Reverted: false}
        LogHeader: {Removed: false}
        any: [
          {LogHeader: {Address: {in: ["0x4d3a3f4e1a918845c2038bc064c4d250822b203e"]}}, Log: {Signature: {SignatureHash: {is: "3b3d2bafdcae274a232217e1f80ee4305d3af6aa25c8b14b1681bd68d18042a4"}}}}
          {LogHeader: {Address: {in: ["0xff99d8f6c994607576eb652edcf12e04a7ebfbf6"]}}, Log: {Signature: {SignatureHash: {is: "4ef8284ecf42d4cd19686572ffd87f630858c82398911e776cb831de35eddbf4"}}}}
          {LogHeader: {Address: {in: ["0x8366a39cc670b4001a1121b8f6a443a643e40951"]}}, Log: {Signature: {SignatureHash: {is: "dd466e674ea557f56295e2d0218a125ea4b4f0f6f3307b95f85e6110838d6438"}}}}
          {LogHeader: {Address: {in: ["0xb6a65950534f061618b4ae102fbcbb8541a8e0cc"]}}, Log: {Signature: {SignatureHash: {is: "a5cdccdb5046ff61139bbc5a059c0de074321d78f08066766c498ac1818e7f0e"}}}}
        ]
      }
    ) {
      Block {Number Time}
      Transaction {Hash From}
      LogHeader {Address Index Data}
      Log {Signature {SignatureHash}}
      Topics {Hash}
    }
  }
}
```

| Event and emitter | Values that must agree |
| --- | --- |
| `TokenLaunched`, verified strategy | Pool ID in topic 1; token in topic 2; hook in the fifth ABI data word |
| `TokenCreated`, shared factory | Token in the last 20 bytes of the first ABI data word |
| `Initialize`, PoolManager | Pool ID in topic 1; currencies in topics 2 and 3 include the token; hook in the third ABI data word |
| `PoolRegistered`, Minara hook | Same pool ID in topic 1 and token in topic 2; creator in topic 3 |

Topic positions in this table are zero-based. For raw `LogHeader.Data`, strip an optional `0x` and split into 64-character hex words. Addresses occupy each word's final 40 hex characters.

The query returns candidate events; your application must check that the transaction, token, pool and hook agree. For the sample, all four events match. The LP position recipient is `0x000000000000000000000000000000000000dead`; the creator is the separate address above.

Keep Bitquery's `LogHeader.Index` and Arc RPC's `logIndex` as separate fields. Their indexes differed for this sample, while the block hash, event addresses, topics and data matched. Compare those values within the same transaction when checking an RPC receipt.

An old receipt may fall outside indexed history. An empty response then calls for a coverage check; it does not disprove the launch.

### Read pool creators and fee terms

Filter the fee hook for `PoolRegistered`. These records give the creator at registration. The current creator role can change later; do not treat this feed as a current-owner list.

[Run in Bitquery IDE](https://ide.bitquery.io/arc-mainnet-minara-pool-registrations)

```graphql
query {
  EVM(network: arc) {
    Events(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        Block: {Time: {since_relative: {hours_ago: 24}}}
        TransactionStatus: {Success: true}
        Call: {Success: true, Reverted: false}
        LogHeader: {Address: {in: ["0xb6a65950534f061618b4ae102fbcbb8541a8e0cc"]}, Removed: false}
        Log: {Signature: {SignatureHash: {is: "a5cdccdb5046ff61139bbc5a059c0de074321d78f08066766c498ac1818e7f0e"}}}
      }
    ) {
      Block {Number Time}
      Transaction {Hash From}
      LogHeader {Address Index Data}
      Log {Signature {SignatureHash}}
      Topics {Hash}
    }
  }
}
```

`Topics[1].Hash` is the pool ID, `Topics[2].Hash` is the token and `Topics[3].Hash` is the creator. The first two ABI data words are `platformFeeBps` and `creatorFeeBps`. Decode them as unsigned integers; divide by 100 for percent. The sample records 75 and 25 basis points, or 0.75% and 0.25%.

These are pool fee terms recorded at launch. They do not measure realized revenue or all fees and taxes a swap may pay. To attribute a launch to the listed strategy, also perform the four-event check.

### Stream new launches

Subscribe with the same strategy and event filters. The decoded event name may be empty, so keep the signature and raw topics.

[Run in Bitquery IDE](https://ide.bitquery.io/arc-mainnet-minara-launch-stream)

```graphql
subscription {
  EVM(network: arc) {
    Events(
      where: {
        TransactionStatus: {Success: true}
        Call: {Success: true, Reverted: false}
        LogHeader: {Address: {in: ["0x4d3a3f4e1a918845c2038bc064c4d250822b203e"]}, Removed: false}
        Log: {Signature: {SignatureHash: {is: "3b3d2bafdcae274a232217e1f80ee4305d3af6aa25c8b14b1681bd68d18042a4"}}}
      }
    ) {
      Block {Number Time}
      Transaction {Hash From}
      LogHeader {Address Index Data}
      Log {Signature {SignatureHash}}
      Topics {Hash}
    }
  }
}
```

Save each token ID, pool ID, launch time, transaction hash and log index. Deduplicate Bitquery events by transaction hash and `LogHeader.Index`. Check the receipt to attach a verified creator.

Trading subscriptions use fixed token filters. Resubscribe when your token list changes. Keep a checkpoint and query recent events after reconnecting to recover gaps.

## Trading queries

The sample token trades on more than one pool. Token-wide turnover can include those other pools; select the pool ID when you need only the Minara launch pool.

### Recent trades for a Minara token

Match the token as either `Pair.Token` or `Pair.QuoteToken`. The `Uniswap` family filter covers the observed v3/v4 markets; extend it only when you verify another venue.

[Run in Bitquery IDE](https://ide.bitquery.io/arc-mainnet-minara-recent-trades)

```graphql
query {
  Trading {
    Trades(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        Block: {Time: {since_relative: {hours_ago: 24}}}
        Pair: {Market: {NetworkBid: {is: "bid:arc"}, ProtocolFamily: {is: "Uniswap"}}}
        any: [
          {Pair: {Token: {Id: {is: "bid:arc:0xa163d7624da3b5d9182c50eab5b8cd247ae861bb"}}}}
          {Pair: {QuoteToken: {Id: {is: "bid:arc:0xa163d7624da3b5d9182c50eab5b8cd247ae861bb"}}}}
        ]
      }
    ) {
      Block {Time}
      TransactionHeader {Hash Index}
      Trader {Address}
      Side
      Amounts {Base Quote}
      AmountsInUsd {Quote}
      PriceInUsd
      Pair {
        Token {Id Symbol}
        QuoteToken {Id Symbol}
        Market {Network Protocol}
        Pool {Address Id}
      }
    }
  }
}
```

`Side` and `PriceInUsd` refer to `Pair.Token`. Reverse Buy/Sell when the token you follow is `Pair.QuoteToken`. `PriceInUsd` is an indexed reference price; the amount ratio gives the executed price.

`Pair.Pool.Address` is the shared PoolManager on v4, so also keep `Pair.Pool.Id`. Neither the market address nor PoolManager address proves the token's launchpad.

### Stream token trades

Use the same token filters over WebSocket. This stream follows indexed Uniswap trades across the sample token's pools.

[Run in Bitquery IDE](https://ide.bitquery.io/arc-mainnet-minara-trade-stream)

```graphql
subscription {
  Trading {
    Trades(
      where: {
        Pair: {Market: {NetworkBid: {is: "bid:arc"}, ProtocolFamily: {is: "Uniswap"}}}
        any: [
          {Pair: {Token: {Id: {is: "bid:arc:0xa163d7624da3b5d9182c50eab5b8cd247ae861bb"}}}}
          {Pair: {QuoteToken: {Id: {is: "bid:arc:0xa163d7624da3b5d9182c50eab5b8cd247ae861bb"}}}}
        ]
      }
    ) {
      Block {Time}
      TransactionHeader {Hash Index}
      Trader {Address}
      Side
      Amounts {Base Quote}
      AmountsInUsd {Quote}
      PriceInUsd
      Pair {
        Token {Id Symbol}
        QuoteToken {Id Symbol}
        Market {Network Protocol}
        Pool {Address Id}
      }
    }
  }
}
```

For a watchlist, change both token `is` filters to `in` lists. Keep both pair orientations.

### Launch-pool volume, trades and traders

Filter by the PoolManager address and the exact v4 pool ID. This sample selects the token as `Pair.Token`, so Buy/Sell refers to Minara token units. It measures only this pool and pair orientation.

[Run in Bitquery IDE](https://ide.bitquery.io/arc-mainnet-minara-pool-activity)

```graphql
query {
  Trading {
    Trades(
      where: {
        Block: {Time: {since_relative: {hours_ago: 24}}}
        Pair: {
          Market: {NetworkBid: {is: "bid:arc"}, ProtocolFamily: {is: "Uniswap"}}
          Pool: {Address: {is: "0x8366a39cc670b4001a1121b8f6a443a643e40951"}, Id: {is: "0xd77a1efbc8d143b100cf2496ff970da0a616a6796886e6ba1f45e7d7e09bb150"}}
          Token: {Id: {is: "bid:arc:0xa163d7624da3b5d9182c50eab5b8cd247ae861bb"}}
        }
      }
    ) {
      Pair {Token {Id Symbol} QuoteToken {Id Symbol} Pool {Address Id}}
      trades: count
      transactions: count(distinct: TransactionHeader_Hash)
      traders: count(distinct: Trader_Address)
      volumeUsd: sum(of: AmountsInUsd_Quote)
      buys: count(if: {Side: {is: "Buy"}})
      sells: count(if: {Side: {is: "Sell"}})
    }
  }
}
```

Sum `AmountsInUsd.Quote` once per trade; adding base and quote USD amounts counts the same swap twice. A transaction may contain several swaps. Trader counts refer to wallet addresses, not people. Turnover is not profit, fee revenue or net inflow.

:::caution Exact totals
These aggregates count indexed rows. Check the [Trading Trades field notes](/docs/trading/crypto-trades-api/trades-api/#before-you-aggregate-three-things-about-a-trades-row) for duplicate-row limits. For audited totals, fetch the underlying trades and check their identities before summing.
:::

### Latest price from the launch pool

Use `Trading.Pairs` for the selected pool's latest one-minute interval. The explicit pool filter keeps this query on the launch pool even if another market becomes the token's top market.

[Run in Bitquery IDE](https://ide.bitquery.io/arc-mainnet-minara-pool-price)

```graphql
query {
  Trading {
    Pairs(
      limit: {count: 1}
      orderBy: {descending: Block_Time}
      where: {
        Token: {Id: {is: "bid:arc:0xa163d7624da3b5d9182c50eab5b8cd247ae861bb"}}
        Market: {NetworkBid: {is: "bid:arc"}, ProtocolFamily: {is: "Uniswap"}}
        Pool: {Address: {is: "0x8366a39cc670b4001a1121b8f6a443a643e40951"}, Id: {is: "0xd77a1efbc8d143b100cf2496ff970da0a616a6796886e6ba1f45e7d7e09bb150"}}
        Block: {Time: {since_relative: {hours_ago: 24}}}
        Interval: {Time: {Duration: {eq: 60}}}
        Price: {IsQuotedInUsd: true}
      }
    ) {
      Token {Id Symbol}
      QuoteToken {Id Symbol}
      Pool {Address Id}
      Market {Network Protocol}
      Interval {Time {Start End Duration}}
      Price {IsQuotedInUsd Ohlc {Close}}
      Volume {Usd}
    }
  }
}
```

Check `Interval.Time.End` for freshness. A quiet pool can return an old interval or no result within the requested window.

### One-minute token OHLCV candles

`Trading.Tokens` combines indexed pools for the token. This returns up to 120 rows of one-minute intervals within the requested window; it is not limited to the launch pool.

[Run in Bitquery IDE](https://ide.bitquery.io/arc-mainnet-minara-ohlcv-candles)

```graphql
query {
  Trading {
    Tokens(
      limit: {count: 120}
      orderBy: {descending: Block_Time}
      where: {
        Token: {Id: {is: "bid:arc:0xa163d7624da3b5d9182c50eab5b8cd247ae861bb"}, NetworkBid: {is: "bid:arc"}}
        Block: {Time: {since_relative: {hours_ago: 24}}}
        Interval: {Time: {Duration: {eq: 60}}}
        Price: {IsQuotedInUsd: true}
      }
    ) {
      Token {Id Symbol}
      Interval {Time {Start End Duration}}
      Price {IsQuotedInUsd Ohlc {Open High Low Close}}
      Volume {Base Usd}
    }
  }
}
```

`Volume.Usd` is quoted USD volume and `Volume.Base` is token units. Missing intervals may be absent, and the current interval can change. Resolve repeated `Token.Id` / `Interval.Time.Start` keys before plotting from oldest to newest; do not sum repeated rows. See the [Tokens field notes](/docs/trading/crypto-price-api/tokens/#field-notes).

To stream candles, change `query` to `subscription`, remove `limit`, `orderBy` and the historical `Block.Time` filter, and keep the token and interval filters.

<FAQ
  items={[
    {
      q: "What is Minara's 0xb6A65950534F061618B4AE102FBcbb8541a8e0cC contract?",
      a: "It is Minara's fee hook on Arc. Its PoolRegistered event links a pool ID, token and creator at launch. Tokens are deployed through a separate shared UERC20Factory."
    },
    {
      q: "Can the shared factory identify every Minara token?",
      a: "The factory alone is insufficient. Check TokenLaunched from a verified Minara strategy, TokenCreated from the factory, Initialize from the PoolManager and PoolRegistered from Minara's hook in the same successful transaction."
    },
    {
      q: "Which cube should I use for Minara trades and prices?",
      a: "Use Trading.Trades for swaps, Trading.Pairs for a selected pool's price and Trading.Tokens for token OHLCV. Build the token list from EVM.Events on network arc."
    },
    {
      q: "Why must a Uniswap v4 query include the pool ID?",
      a: "Several pools share one PoolManager address. Use both Pool.Address and Pool.Id to isolate the intended pool, along with the Arc network filter."
    },
    {
      q: "Does an empty result prove a Minara token has no trades?",
      a: "Check the token ID, time range, pair orientation and indexed DEX coverage first. An empty result can reflect limited history or missing data."
    }
  ]}
/>

## Next steps

- [Arc Launchpads API](/docs/blockchain/arc-mainnet/arc-mainnet-launchpads-api/)
- [Tolly Launchpad API](/docs/blockchain/arc-mainnet/tolly-launchpad-api/)
- [RadarDEX Launchpad API](/docs/blockchain/arc-mainnet/radardex-launchpad-api/)
- [Circle Blockchain API for Arc](/docs/blockchain/arc-mainnet/)
- [Trading Trades API](/docs/trading/crypto-trades-api/trades-api/)
- [Minara docs](https://minara.fun/docs)
