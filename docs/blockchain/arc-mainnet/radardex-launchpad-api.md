---
title: "RadarDEX Launchpad API on Arc: Tokens, Trades and OHLCV"
sidebar_label: "RadarDEX Launchpad API"
description: "Track RadarDEX Classic and Reflection token launches on Circle Arc mainnet. Query swaps, traders, USD prices and OHLCV with Bitquery Trading APIs and streams."
sidebar_position: 4
keywords:
  - RadarDEX launchpad API
  - RadarDEX token launches
  - RadarDEX Trading API
  - RadarDEX token price API
  - RadarDEX OHLCV API
  - RadarDEX Classic and Reflection
  - Arc mainnet launchpad API
  - Circle blockchain API
---

import FAQ from "@site/src/components/FAQ";

# RadarDEX Launchpad API on Arc: Tokens, Trades and OHLCV

[RadarDEX](https://www.radardex.pro/) offers Classic and Reflection token launches on Arc mainnet, Circle's EVM chain. Its launch page describes opening a Uniswap v3 pool when a token is created. Monitor both factories to build a list of RadarDEX launches.

RadarDEX's site states that it does not currently have its own token. A token name or symbol cannot prove that it belongs to the platform; match the launch contract and event.

Use `EVM.Events` to find launches. All trading examples below use `Trading.Trades`, `Trading.Pairs`, or `Trading.Tokens`.

:::note API access
Run the saved examples in the Bitquery IDE, or create an [API access token](/docs/authorization/how-to-generate/) for `https://streaming.bitquery.io/graphql`. For streams, use `wss://streaming.bitquery.io/graphql` with [WebSocket authorization](/docs/authorization/websocket/).
:::

## Find the latest RadarDEX token launches

Filter by the factory address and the `TokenLaunched` signature. The checks for transaction success and reverted calls exclude failed launches. The 24-hour filter covers only the history currently indexed.

[Run in Bitquery IDE](https://ide.bitquery.io/arc-mainnet-radardex-latest-launches)

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
        LogHeader: {
          Address: {in: ["0x4b638c1502a07a8e1a26112ee98f51a3f34bc93a", "0x2d933ce4bde6f3d99540b5d7886b383e59b2b2f8"]}
          Removed: false
        }
        Log: {Signature: {SignatureHash: {is: "851d681a32f0efba577c4a1bd412f74b575764a6b91e499a05a48a23f3821d66"}}}
      }
    ) {
      Block {Number Time}
      Transaction {Hash From}
      LogHeader {Address Index}
      Log {Signature {SignatureHash}}
      Topics {Hash}
    }
  }
}
```

## Contracts and token identity

| Contract | Arc mainnet address |
| --- | --- |
| RadarDEX Classic | `0x4b638c1502a07a8e1a26112ee98f51a3f34bc93a` |
| RadarDEX Reflection | `0x2d933ce4bde6f3d99540b5d7886b383e59b2b2f8` |

The launch event signature is `851d681a32f0efba577c4a1bd412f74b575764a6b91e499a05a48a23f3821d66`. These contract/event pairs were checked against Arc data on 16 September 2026. Keep older factory addresses in your own registry when you need earlier launches. See the [RadarDEX site](https://www.radardex.pro/) and the [Arc launchpad contract list](/docs/blockchain/arc-mainnet/arc-mainnet-launchpads-api/#verified-launchpad-contracts).

The response's `Topics` array uses these positions:

- `Topics[0].Hash`: event signature.
- `Topics[1].Hash`: token address, padded on the left to 32 bytes.

Take the final 40 hex characters of `Topics[1].Hash`, add `0x`, and lowercase the address. To query Trading, prefix the result with `bid:arc:`. For example, SLJ's token ID is `bid:arc:0xa6fe05d5c5beb68aae0496830199f9b36a5d4483`.

These examples use two tokens whose launch events matched the RadarDEX factory:

| Sample token | Contract |
| --- | --- |
| SLJ | `0xa6fe05d5c5beb68aae0496830199f9b36a5d4483` |
| ARCG | `0x458f4cf6db2458de50ae1727fc64043af3f39ff9` |

They are user-created examples. Replace their addresses with a token returned by the launch query. Save each token's factory, launch time and transaction hash in your application.

:::tip Build a launchpad token list
The Trading cubes do not attach a RadarDEX launchpad label to each token. Build that list from launch events, then pass the token IDs into Trading queries. For Uniswap v2/v3, `Pair.Market.Address` is the DEX factory and `Pair.Pool.Address` is the pool. For Uniswap v4, `Pair.Market.Address` can be empty and several pools share `Pair.Pool.Address`; include `Pair.Pool.Id` to select one pool. These trading fields do not identify the launchpad that created the token.
:::

## Stream new RadarDEX launches

Subscribe with the same factory and signature filters. The decoded event name may be empty; the signature and raw topics still identify the launch.

[Run in Bitquery IDE](https://ide.bitquery.io/arc-mainnet-radardex-launch-stream)

```graphql
subscription {
  EVM(network: arc) {
    Events(
      where: {
        TransactionStatus: {Success: true}
        Call: {Success: true, Reverted: false}
        LogHeader: {
          Address: {in: ["0x4b638c1502a07a8e1a26112ee98f51a3f34bc93a", "0x2d933ce4bde6f3d99540b5d7886b383e59b2b2f8"]}
          Removed: false
        }
        Log: {Signature: {SignatureHash: {is: "851d681a32f0efba577c4a1bd412f74b575764a6b91e499a05a48a23f3821d66"}}}
      }
    ) {
      Block {Number Time}
      Transaction {Hash From}
      LogHeader {Address Index}
      Log {Signature {SignatureHash}}
      Topics {Hash}
    }
  }
}
```

Append new token IDs to your application's list. A Trading subscription has fixed filters: resubscribe with the updated list when a new launch arrives. Keep a time checkpoint and query recent events after reconnecting; the HTTP endpoint and WebSocket do not join these steps for you. Deduplicate launch records by transaction hash and log index.

## Recent trades for a RadarDEX token

Match the token on either side of the pair. This includes trades where it is the quote asset. The `Uniswap` family filter selects the v2/v3/v4 markets observed for Arc; extend the family filter when you verify another venue.

[Run in Bitquery IDE](https://ide.bitquery.io/arc-mainnet-radardex-recent-trades)

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
          {Pair: {Token: {Id: {is: "bid:arc:0xa6fe05d5c5beb68aae0496830199f9b36a5d4483"}}}}
          {Pair: {QuoteToken: {Id: {is: "bid:arc:0xa6fe05d5c5beb68aae0496830199f9b36a5d4483"}}}}
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

`Side` is relative to `Pair.Token`. If the selected token is `Pair.QuoteToken`, reverse Buy/Sell when describing that token's direction. `PriceInUsd` also refers to `Pair.Token` and is an indexed reference price; use the amount ratio when you need the executed price.

Use `AmountsInUsd.Quote` for quoted USD turnover. Do not add base and quote USD amounts from the same row. One transaction can contain several swaps; use a distinct transaction hash count for transaction totals.

## Stream trades for a RadarDEX token

The same token filters work as a Trading subscription.

[Run in Bitquery IDE](https://ide.bitquery.io/arc-mainnet-radardex-trade-stream)

```graphql
subscription {
  Trading {
    Trades(
      where: {
        Pair: {Market: {NetworkBid: {is: "bid:arc"}, ProtocolFamily: {is: "Uniswap"}}}
        any: [
          {Pair: {Token: {Id: {is: "bid:arc:0xa6fe05d5c5beb68aae0496830199f9b36a5d4483"}}}}
          {Pair: {QuoteToken: {Id: {is: "bid:arc:0xa6fe05d5c5beb68aae0496830199f9b36a5d4483"}}}}
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

For several tokens, replace each `is` token filter with an `in` list. Keep both the base-token and quote-token branches.

## Rank a RadarDEX token watchlist by volume

This sample ranks SLJ and ARCG over the last 24 hours. It includes only rows where a listed token is `Pair.Token`, so the Buy/Sell counts have a consistent meaning. Extend the list from launch events to cover more tokens. It is not a total for the whole launchpad.

[Run in Bitquery IDE](https://ide.bitquery.io/arc-mainnet-radardex-watchlist-volume)

```graphql
query {
  Trading {
    Trades(
      limit: {count: 20}
      orderBy: {descendingByField: "volumeUsd"}
      where: {
        Block: {Time: {since_relative: {hours_ago: 24}}}
        Pair: {
          Market: {NetworkBid: {is: "bid:arc"}, ProtocolFamily: {is: "Uniswap"}}
          Token: {Id: {in: [
            "bid:arc:0xa6fe05d5c5beb68aae0496830199f9b36a5d4483"
            "bid:arc:0x458f4cf6db2458de50ae1727fc64043af3f39ff9"
          ]}}
        }
      }
    ) {
      Pair {Token {Id Symbol}}
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

The time filter measures trading during the selected window. It does not restrict token creation time; keep launch timestamps in your own token registry if you need a new-launch cohort.

:::caution Counts and volume
These server aggregates count the indexed rows. The [Trading Trades field notes](/docs/trading/crypto-trades-api/trades-api/#before-you-aggregate-three-things-about-a-trades-row) describe duplicate rows that can affect exact totals. For audited figures, fetch the underlying rows and check duplicates before summing. Wallet counts refer to addresses, not people.
:::

## Most active traders for a RadarDEX token

Rank wallets by quoted USD turnover across both pair orientations. This measures activity, not profit.

[Run in Bitquery IDE](https://ide.bitquery.io/arc-mainnet-radardex-top-traders)

```graphql
query {
  Trading {
    Trades(
      limit: {count: 10}
      orderBy: {descendingByField: "volumeUsd"}
      where: {
        Block: {Time: {since_relative: {hours_ago: 24}}}
        Pair: {Market: {NetworkBid: {is: "bid:arc"}, ProtocolFamily: {is: "Uniswap"}}}
        any: [
          {Pair: {Token: {Id: {is: "bid:arc:0xa6fe05d5c5beb68aae0496830199f9b36a5d4483"}}}}
          {Pair: {QuoteToken: {Id: {is: "bid:arc:0xa6fe05d5c5beb68aae0496830199f9b36a5d4483"}}}}
        ]
      }
    ) {
      Trader {Address}
      trades: count
      transactions: count(distinct: TransactionHeader_Hash)
      volumeUsd: sum(of: AmountsInUsd_Quote)
    }
  }
}
```

## Latest price from the top market

Use `Trading.Pairs` with rank 1 to retrieve the token's most recent one-minute price interval from its top market. Inspect `Interval.Time.End`: a quiet token can return an old interval. Rank 1 may return no row when the top market has not traded within the requested window.

[Run in Bitquery IDE](https://ide.bitquery.io/arc-mainnet-radardex-top-market-price)

```graphql
query {
  Trading {
    Pairs(
      limit: {count: 1}
      orderBy: {descending: Block_Time}
      where: {
        Token: {Id: {is: "bid:arc:0xa6fe05d5c5beb68aae0496830199f9b36a5d4483"}}
        Market: {NetworkBid: {is: "bid:arc"}, ProtocolFamily: {is: "Uniswap"}}
        Block: {Time: {since_relative: {hours_ago: 24}}}
        Interval: {Time: {Duration: {eq: 60}}}
        Ranking: {Position: {eq: 1}}
        Price: {IsQuotedInUsd: true}
      }
    ) {
      Token {Id Symbol}
      QuoteToken {Id Symbol}
      Pool {Address Id}
      Market {Network Protocol}
      Interval {Time {Start End Duration}}
      Price {IsQuotedInUsd Ohlc {Close}}
      Ranking {Position Weight}
      Volume {Usd}
    }
  }
}
```

For broader token coverage, use the [Tokens cube](/docs/trading/crypto-price-api/tokens/). For a fixed pool's history, use the [Pairs cube](/docs/trading/crypto-price-api/pairs/) with `Pool.Address`; on Uniswap v4, also filter by its non-empty `Pool.Id`. Keep the Arc network filter.

## One-minute OHLCV candles

`Trading.Tokens` combines indexed pools for the token. This query returns up to 120 rows for one-minute intervals within the last 24 hours, newest first. Resolve repeated interval rows as noted below, then plot from oldest to newest.

[Run in Bitquery IDE](https://ide.bitquery.io/arc-mainnet-radardex-ohlcv-candles)

```graphql
query {
  Trading {
    Tokens(
      limit: {count: 120}
      orderBy: {descending: Block_Time}
      where: {
        Token: {Id: {is: "bid:arc:0xa6fe05d5c5beb68aae0496830199f9b36a5d4483"}, NetworkBid: {is: "bid:arc"}}
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

`Volume.Usd` is USD volume and `Volume.Base` is token units. These candles can differ from a single pool's price. Empty intervals may be absent; treat a missing interval as missing data unless your chart has an explicit fill rule. The current interval may still change.

Token symbols can arrive after price data, so the same `Token.Id` and `Interval.Time.Start` may appear more than once. Check repeated keys before plotting; do not sum repeated rows or drop conflicting values without a rule. See the [Tokens field notes](/docs/trading/crypto-price-api/tokens/#field-notes).

To stream candles, change `query` to `subscription`, remove `limit`, `orderBy`, and the historical `Block.Time` filter, and keep the token and interval filters.

<FAQ
  items={[
    {
      q: "Which Bitquery cube should I use for RadarDEX trades?",
      a: "Use Trading.Trades for swaps and trader activity, Trading.Pairs for a selected market's price, and Trading.Tokens for token OHLCV. Use EVM.Events on network arc to find token launches."
    },
    {
      q: "Can I filter Trading by the RadarDEX launch factory?",
      a: "Build a list of tokens from factory launch events first. Pass those token IDs to Trading. The trading market's factory address does not identify the launchpad that created the token."
    },
    {
      q: "Does an empty result mean a token has no trades?",
      a: "No. Check the full bid:arc:0x token ID, the time window, both sides of the pair and the supported DEX families. A quiet token or missing decoder coverage can also return no rows."
    },
    {
      q: "Can I request the archive dataset for these examples?",
      a: "These examples leave dataset unset. Trading.Trades does not accept archive or combined. Arc history depends on what is currently indexed; do not assume a complete launch history from a time filter alone."
    }
  ]}
/>

## Related APIs

- [Tolly Launchpad API](/docs/blockchain/arc-mainnet/tolly-launchpad-api/)
- [Arc Mainnet Launchpads API](/docs/blockchain/arc-mainnet/arc-mainnet-launchpads-api/)
- [Circle Blockchain API for Arc Mainnet](/docs/blockchain/arc-mainnet/)
- [Trading Trades API](/docs/trading/crypto-trades-api/trades-api/)
- [Trading Tokens OHLCV API](/docs/trading/crypto-price-api/tokens/)
