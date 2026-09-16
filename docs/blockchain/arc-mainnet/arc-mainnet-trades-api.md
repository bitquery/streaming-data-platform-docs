---
title: "Arc Mainnet DEX Trades API & Streams"
description: "Query and stream Circle Arc mainnet trades with the Bitquery Trading cube. Get token prices, OHLCV, USD volume and wallet activity for the last 30 days."
sidebar_position: 1
keywords:
  - Arc mainnet trades API
  - Arc mainnet DEX trades
  - Arc mainnet Trading cube
  - Arc mainnet Uniswap v4 trades
  - Arc mainnet OHLCV
  - Arc mainnet token price
  - Arc mainnet swap stream
  - Circle blockchain trading API
  - Circle Arc DEX API
  - Bitquery Arc mainnet
---
# Arc Mainnet DEX Trades API & Streams

Use **`Trading` for Arc mainnet trading queries and live streams**. `Trading.Trades` returns trades, USD amounts, token pairs and trader addresses. Use `Trading.Tokens` for token candles across pools and `Trading.Pairs` for prices from a chosen market.

:::tip Choose by time range
For live streams and trades within the last **30 days**, use the Trading cube. Filter trades with `Pair: {Market: {Network: {is: "Arc"}}}`.

Use `EVM.DEXTrades` or `EVM.DEXTradeByTokens` only for trades **older than 30 days**, after confirming Arc archive availability. Trading has a rolling window; a newly indexed chain may have less than 30 days of data.
:::

:::info Availability checked 16 September 2026
`Trading.Trades`, `Trading.Tokens` and `Trading.Pairs` return Arc data. Use the root `Trading` without `dataset: archive` or `dataset: combined`. Arc's EVM archive and combined datasets were unavailable at the launch-day check.
:::

Open each example with its **Run in IDE** link. Where available, **Run stream** opens the subscription version. For your own app, [create an API access token](/docs/authorization/how-to-generate/) and send queries to `https://streaming.bitquery.io/graphql`. See [WebSocket authentication](/docs/authorization/websocket/) for streams.

:::tip Related docs
- [Arc Mainnet API overview](/docs/blockchain/arc-mainnet/)
- [Arc launchpad token launches and trades](/docs/blockchain/arc-mainnet/arc-mainnet-launchpads-api/)
- [Trading.Trades reference](/docs/trading/crypto-trades-api/trades-api/)
- [Token candles](/docs/trading/crypto-price-api/tokens/) and [pair prices](/docs/trading/crypto-price-api/pairs/)
- [Trading data and history](/docs/trading/trading-data-overview/)
:::

**On this page:** [Identifiers](#network-and-example-addresses) · [Stream](#stream-real-time-trades) · [Latest](#latest-trades) · [By token](#trades-of-a-token) · [By DEX](#trades-on-one-dex) · [By pool](#trades-in-one-pool) · [By trader](#trades-of-a-wallet) · [OHLCV](#ohlcv-candles-for-a-token) · [Latest price](#latest-price-of-a-token) · [Top tokens](#most-traded-tokens) · [DEX breakdown](#trade-count-by-dex-protocol) · [Top traders](#most-active-traders) · [Older history](#trades-older-than-30-days) · [FAQ](#faq)

## Network and example addresses

| Item | Trading field or value |
| --- | --- |
| Arc trades | `Pair.Market.Network: "Arc"` |
| Arc pair candles | `Market.Network: "Arc"` |
| Arc token candles | `Token.Network: "Arc"` |
| Chain ID | `5042` |
| Native USDC | `Token.Id: "bid:arc"`, empty `Token.Address` |
| ERC-20 USDC | `bid:arc:0x3600000000000000000000000000000000000000` |
| EURC example | `bid:arc:0xbef5f6d51cb62b58e6a8f77868681825c6fe21c1` |
| Uniswap v4 | `Pair.Market.Protocol: "uniswap_v4"` |
| Uniswap v3 pool example | `Pair.Pool.Address: "0x01be77f0a364bddafd34521892ea4745ebf9b5a2"` |

`Pair.Token` is the base token; `Pair.QuoteToken` is the quote token. `Side` is the trade direction for the base token. Token IDs include the chain prefix; use `Address` when filtering with a raw contract address.

For a v4 pool, use `Pair.Pool.Id`. `Pair.Pool.Address` is the shared PoolManager, so it alone cannot select one v4 pool. On EVM, `Pair.Market.Address` describes the factory and should not be used as a pool filter.

## Stream real-time trades

Subscribe to Arc trades with the Trading cube. The network filter is case-sensitive: use `Arc`.

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-trading-trades-stream-real-time-trades)

```graphql
subscription {
  Trading {
    Trades(where: {Pair: {Market: {Network: {is: "Arc"}}}}) {
      Block { Time }
      TransactionHeader { Hash }
      Trader { Address }
      Side
      Amounts { Base Quote }
      AmountsInUsd { Quote }
      Price
      PriceInUsd
      Pair {
        Market { Network Protocol ProtocolFamily }
        Pool { Address Id }
        Token { Id Address Symbol }
        QuoteToken { Id Address Symbol }
      }
    }
  }
}
```

The feed can include NFT market fills. Add a protocol filter, as in [Trades on one DEX](#trades-on-one-dex), when you need a specific swap venue. Stream selections use no `limit` or `orderBy`.

## Latest trades

Read the latest 20 Arc trade rows. `AmountsInUsd.Quote` gives the USD value of the quote side; use it for USD volume. `PriceInUsd` is the base token's reference USD price and may differ from the executed price during fast moves.

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-trading-trades-latest-trades)

```graphql
{
  Trading {
    Trades(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {Pair: {Market: {Network: {is: "Arc"}}}}
    ) {
      Block { Time }
      TransactionHeader { Hash }
      Trader { Address }
      Side
      Amounts { Base Quote }
      AmountsInUsd { Quote }
      Price
      PriceInUsd
      Pair {
        Market { Network Protocol }
        Pool { Address Id }
        Token { Id Symbol }
        QuoteToken { Id Symbol }
      }
    }
  }
}
```

A transaction can produce several trade rows. Use `count(distinct: TransactionHeader_Hash)` for transaction counts. See the [Trades row notes](/docs/trading/crypto-trades-api/trades-api/#before-you-aggregate-three-things-about-a-trades-row) before reporting exact volumes or counts; duplicate rows can affect sums.

## Trades of a token

Match EURC on either side of the pair. The returned amounts and `Side` still describe `Pair.Token`, so check whether EURC is the base or quote token on each row.

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-trading-trades-trades-of-a-token) · [Run stream](https://ide.bitquery.io/arc-mainnet-trading-trades-trades-of-a-token-stream)

```graphql
{
  Trading {
    Trades(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        Pair: {Market: {Network: {is: "Arc"}}}
        any: [
          {Pair: {Token: {Id: {is: "bid:arc:0xbef5f6d51cb62b58e6a8f77868681825c6fe21c1"}}}}
          {Pair: {QuoteToken: {Id: {is: "bid:arc:0xbef5f6d51cb62b58e6a8f77868681825c6fe21c1"}}}}
        ]
      }
    ) {
      Block { Time }
      TransactionHeader { Hash }
      Trader { Address }
      Side
      Amounts { Base Quote }
      AmountsInUsd { Quote }
      Pair {
        Token { Id Symbol }
        QuoteToken { Id Symbol }
        Market { Network Protocol }
      }
    }
  }
}
```

To stream this token, change the operation to `subscription` and remove `limit` and `orderBy`.

## Trades on one DEX

Use `Pair.Market.Protocol` to select Uniswap v4 on Arc.

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-trading-trades-trades-on-one-dex)

```graphql
{
  Trading {
    Trades(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        Pair: {Market: {Network: {is: "Arc"}, Protocol: {is: "uniswap_v4"}}}
      }
    ) {
      Block { Time }
      TransactionHeader { Hash }
      Side
      Amounts { Base Quote }
      AmountsInUsd { Quote }
      Pair {
        Market { Network Protocol }
        Pool { Address Id }
        Token { Id Symbol }
        QuoteToken { Id Symbol }
      }
    }
  }
}
```

## Trades in one pool

Use `Pair.Pool.Address` for a v2 or v3 pool. This example uses the BUILDOG/USDC v3 pool observed at launch. For v4, replace the address filter with `Pool: {Id: {is: "YOUR_POOL_ID"}}`, using an ID from the live trade feed.

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-trading-trades-trades-in-one-pool)

```graphql
{
  Trading {
    Trades(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        Pair: {
          Market: {Network: {is: "Arc"}}
          Pool: {Address: {is: "0x01be77f0a364bddafd34521892ea4745ebf9b5a2"}}
        }
      }
    ) {
      Block { Time }
      TransactionHeader { Hash }
      Trader { Address }
      Side
      Amounts { Base Quote }
      AmountsInUsd { Quote }
      Pair {
        Pool { Address Id }
        Token { Id Symbol }
        QuoteToken { Id Symbol }
      }
    }
  }
}
```

## Trades of a wallet

Filter with `Trader.Address`. Replace the sample address with the wallet you want to track. Use `TransactionHeader.Hash` to fetch its [transaction details](/docs/blockchain/arc-mainnet/arc-mainnet-transactions-api/), [calls](/docs/blockchain/arc-mainnet/arc-mainnet-calls-api/) or [logs](/docs/blockchain/arc-mainnet/arc-mainnet-events-api/) in a separate EVM query.

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-trading-trades-trades-of-a-wallet)

```graphql
{
  Trading {
    Trades(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        Pair: {Market: {Network: {is: "Arc"}}}
        Trader: {Address: {is: "0xada5bb90d0de0bd1b6f3938708f49295a8d1f7cb"}}
      }
    ) {
      Block { Time }
      TransactionHeader { Hash }
      Trader { Address }
      Side
      Amounts { Base Quote }
      AmountsInUsd { Quote }
      Pair {
        Market { Network Protocol }
        Token { Id Symbol }
        QuoteToken { Id Symbol }
      }
    }
  }
}
```

## OHLCV candles for a token

Use `Trading.Tokens` for hourly EURC candles across its markets. Duration is in seconds: `3600` is one hour, `300` is five minutes. Select one duration to avoid adding overlapping candle intervals. This query returns the newest 24 intervals within the last 24 hours; reverse the rows before plotting from oldest to newest.

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-trading-trades-ohlcv-candles-for-a-token-v2) · [Run stream](https://ide.bitquery.io/arc-mainnet-trading-trades-ohlcv-candles-for-a-token-stream-v2)

```graphql
{
  Trading {
    Tokens(
      limit: {count: 24}
      orderBy: {descending: Block_Time}
      where: {
        Token: {
          Network: {is: "Arc"}
          Address: {is: "0xbef5f6d51cb62b58e6a8f77868681825c6fe21c1"}
        }
        Interval: {Time: {Duration: {eq: 3600}}}
        Block: {Time: {since_relative: {hours_ago: 24}}}
        Price: {IsQuotedInUsd: true}
      }
    ) {
      Token { Id Symbol Network }
      Interval { Time { Start End Duration } }
      Price { IsQuotedInUsd Ohlc { Open High Low Close } }
      Volume { Base Usd }
    }
  }
}
```

Missing intervals may be absent, and the current candle can still change. Check the [Tokens field notes](/docs/trading/crypto-price-api/tokens/#field-notes) before treating every row as a unique candle.

For a chart tied to one pool or quote token, use [Trading.Pairs](/docs/trading/crypto-price-api/pairs/) with `Market.Network: "Arc"` and the desired pool or quote-token filter. To stream candle updates, use `subscription` and remove `limit`, `orderBy`, and the historical `Block.Time` filter. The stream sends updates after connection; fetch earlier candles with the HTTP query.

## Latest price of a token

Query `Trading.Pairs` with rank 1 for EURC's price from its top market. `Price.Ohlc.Close` is the closing USD price of the returned one-minute interval. Check `Interval.Time.End`: a quiet top market can return a stale interval or no row within the last 24 hours. Widen the time window or use `Trading.Tokens` to check other indexed markets.

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-trading-trades-latest-price-of-a-token-v2) · [Run stream](https://ide.bitquery.io/arc-mainnet-trading-trades-latest-price-of-a-token-stream-v2)

```graphql
{
  Trading {
    Pairs(
      limit: {count: 1}
      orderBy: {descending: Block_Time}
      where: {
        Market: {Network: {is: "Arc"}}
        Token: {Address: {is: "0xbef5f6d51cb62b58e6a8f77868681825c6fe21c1"}}
        Ranking: {Position: {eq: 1}}
        Interval: {Time: {Duration: {eq: 60}}}
        Block: {Time: {since_relative: {hours_ago: 24}}}
        Price: {IsQuotedInUsd: true}
      }
    ) {
      Block { Time }
      Token { Id Symbol }
      QuoteToken { Id Symbol }
      Market { Network Protocol }
      Pool { Address Id }
      Interval { Time { Start End Duration } }
      Price { IsQuotedInUsd Ohlc { Close } }
      Ranking { Position Weight }
      Volume { Usd }
    }
  }
}
```

For the saved price stream, remove `limit`, `orderBy`, and the historical `Block.Time` filter. Keep the token, network, interval, USD and rank filters. The top market can change as trading moves between pools.

## Most traded tokens

Rank base tokens by trade-row count over the last 24 hours. These are base-token totals: quote-token activity is not grouped into the same token row. USD volume uses the quote side of each trade.

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-trading-trades-most-traded-tokens)

```graphql
{
  Trading {
    Trades(
      limit: {count: 20}
      orderBy: {descendingByField: "trade_rows"}
      where: {
        Pair: {Market: {Network: {is: "Arc"}}}
        Block: {Time: {since_relative: {hours_ago: 24}}}
      }
    ) {
      Pair { Token { Id Symbol } }
      trade_rows: count
      transactions: count(distinct: TransactionHeader_Hash)
      traders: count(distinct: Trader_Address)
      volume_usd: sum(of: AmountsInUsd_Quote)
    }
  }
}
```

## Trade count by DEX protocol

Compare protocols by trade-row count and USD volume over the last 24 hours. The network-wide result may also include NFT protocols; filter `Pair.Market.ProtocolFamily` to narrow the comparison.

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-trading-trades-trade-count-by-dex-protocol)

```graphql
{
  Trading {
    Trades(
      limit: {count: 10}
      orderBy: {descendingByField: "trade_rows"}
      where: {
        Pair: {Market: {Network: {is: "Arc"}}}
        Block: {Time: {since_relative: {hours_ago: 24}}}
      }
    ) {
      Pair { Market { Network Protocol ProtocolFamily } }
      trade_rows: count
      traders: count(distinct: Trader_Address)
      volume_usd: sum(of: AmountsInUsd_Quote)
    }
  }
}
```

## Most active traders

Rank trader addresses by trade-row count. The same wallet can send several swaps in a single transaction, so the query also returns a distinct transaction count. A wallet address can belong to a bot or router.

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-trading-trades-most-active-traders)

```graphql
{
  Trading {
    Trades(
      limit: {count: 20}
      orderBy: {descendingByField: "trade_rows"}
      where: {
        Pair: {Market: {Network: {is: "Arc"}}}
        Block: {Time: {since_relative: {hours_ago: 24}}}
      }
    ) {
      Trader { Address }
      trade_rows: count
      transactions: count(distinct: TransactionHeader_Hash)
      base_tokens: count(distinct: Pair_Token_Id)
      volume_usd: sum(of: AmountsInUsd_Quote)
    }
  }
}
```

## Trades older than 30 days

Use chain-level `EVM(network: arc)` trade cubes only when the requested trades are older than the Trading window. Choose [`DEXTrades`](/docs/schema/evm/dextrades/) for swaps or [`DEXTradeByTokens`](/docs/cubes/dextradesbyTokens/) for token-based history.

For a range that crosses the 30-day cutoff, query recent trades through Trading and older trades through EVM, then join the results in your app. Set the cutoff once in UTC and avoid counting its boundary twice; Trading time bounds are inclusive. The cubes have different row shapes, so do not add their raw row counts as if they were the same measure.

Arc's `dataset: archive` and `dataset: combined` did not answer at the 16 September 2026 check. Confirm support and the date range before using either mode. The [Arc history check](/docs/blockchain/arc-mainnet/#datasets) explains the launch-day limits. Do not send archive or combined arguments to `Trading`.

## FAQ

**Which cube should I use for Arc trading streams?**
Use `Trading.Trades` with `Pair.Market.Network` set to `Arc`. Use `Trading.Tokens` or `Trading.Pairs` for candle and price streams.

**When should I use `DEXTrades` or `DEXTradeByTokens`?**
Only for trades older than 30 days, subject to Arc archive support. Query EVM events, calls, transfers and transactions separately when you need those types of data.

**Which fields give USD prices and volume?**
`Trading.Trades` uses `PriceInUsd` and `AmountsInUsd.Quote`. Candle cubes use `Price.Ohlc` and `Volume.Usd`. Field names are case-sensitive.

**Does Arc already have 30 days of Trading history?**
The Trading cube's window is about 30 days, but Arc's available history depends on when indexing began. A rolling limit does not guarantee a full 30 days for a newly indexed chain.

**How do I identify native USDC?**
In Trading, native USDC has ID `bid:arc` and an empty address. ERC-20 USDC has ID `bid:arc:0x3600000000000000000000000000000000000000`. In EVM transfer and balance cubes, use `Currency.Native: true` for native USDC.
