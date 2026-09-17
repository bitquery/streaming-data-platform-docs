---
title: "Argus Launchpad API on Arc: Launches, Dev Buys and Trades"
sidebar_label: "Argus Launchpad API"
description: "Track Argus token launches on Circle Arc with Bitquery. Decoded TokenCreated, FeeConfigured and DevBuy events, launch calls, Trading cube swaps, USD prices and OHLCV."
sidebar_position: 3
keywords:
  - Argus launchpad API
  - Argus token launches
  - Argus Arc API
  - Argus DevBuy events
  - Argus token price API
  - Argus OHLCV API
  - Arc launchpad API
  - Circle blockchain API
---

import FAQ from "@site/src/components/FAQ";

# Argus Launchpad API on Arc: Launches, Dev Buys and Trades

[Argus](https://argus.world/docs) is a token launchpad on Arc, Circle's EVM chain. Launches go through a portal contract that deploys the token, opens a Uniswap v4 curve and sets the fee split in one transaction. Bitquery decodes the portal's launch events and its `launch` call, so you get token name, symbol, creator, taxes and social links as named arguments.

Use `EVM.Events` and `EVM.Calls` to find launches. All trading examples below use `Trading.Trades`, `Trading.Pairs`, or `Trading.Tokens`.

:::note API access
Run the saved examples in the Bitquery IDE, or create an [API access token](/docs/authorization/how-to-generate/) for `https://streaming.bitquery.io/graphql`. For streams, use `wss://streaming.bitquery.io/graphql` with [WebSocket authorization](/docs/authorization/websocket/).
:::

## Find the latest Argus token launches

Filter by the portal address and the `TokenCreated` event. `Arguments` returns the token, creator, name, symbol, pool id, image URI, website, Twitter and Telegram.

[Run in Bitquery IDE](https://ide.bitquery.io/arc-mainnet-argus-latest-launches)

```graphql
query {
  EVM(network: arc) {
    Events(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        TransactionStatus: {Success: true}
        LogHeader: {Address: {is: "0xb021be536808f551b31789422fd28a6c9c6e97da"}, Removed: false}
        Log: {Signature: {Name: {is: "TokenCreated"}}}
      }
    ) {
      Block {Number Time}
      Transaction {Hash From}
      LogHeader {Address Index}
      Log {Signature {Name Signature}}
      Arguments {
        Name
        Type
        Value {
          ... on EVM_ABI_Address_Value_Arg {address}
          ... on EVM_ABI_String_Value_Arg {string}
          ... on EVM_ABI_BigInt_Value_Arg {bigInteger}
          ... on EVM_ABI_Integer_Value_Arg {integer}
          ... on EVM_ABI_Bytes_Value_Arg {hex}
        }
      }
    }
  }
}
```

## Contracts and decoded events

| Contract | Arc address |
| --- | --- |
| Argus launch portal | `0xb021be536808f551b31789422fd28a6c9c6e97da` |

| Event | Signature hash | Key arguments |
| --- | --- | --- |
| `TokenCreated` | `1d8917231579f8ce39407f0d616f36f357b07329b0ce5164d0754ac15145ce0a` | `token`, `creator`, `name`, `symbol`, `poolId`, `imageURI`, `website`, `twitter`, `telegram` |
| `CurveOpened` | `55e45784ac0f1201c142dd0d2119dd11980e98f34cb682c49340d5c28c3a9aa0` | `token`, `poolId`, `locker`, `positionId`, `liquidity`, `tickLower`, `tickUpper` |
| `FeeConfigured` | `abe14607f311bb63e5b35c469f88100e8fb2ff250876e2364a402e2f2679e8aa` | `token`, `hook`, `lpFeeBps`, `buyTaxBps`, `sellTaxBps`, `treasuryBps`, `creatorBps`, `burnBps`, `dividendBps`, `liquidityBps` |
| `PartsDeployed` | `a54419a494ae20a1807712ab7a33ff0928b9a0e6e03e4562885aedb8e8fcd4da` | `token`, `locker`, `hook`, `splitter` |
| `DevBuy` | `84d429ed8af1c9cfe8bb07b556e4120e976c9f4c9232a7f50a15d31d83e232a9` | `token`, `creator`, `quoteIn`, `tokensOut` |

The first four fire together on every launch. `DevBuy` fires only when the creator buys in the launch transaction. Contract and events were checked against Arc data on 17 September 2026. See the [Argus docs](https://argus.world/docs) and the [Arc launchpad contract list](/docs/blockchain/arc-mainnet/arc-mainnet-launchpads-api/#verified-launchpad-contracts).

:::caution Decoding start
Decoded names and arguments are available from 17 September 2026, 12:48 UTC. Earlier rows have an empty `Signature.Name`. To include them, filter on `Log.Signature.SignatureHash` from the table above and read `Topics` instead of `Arguments`.
:::

To query Trading, take the `token` argument, lowercase it and prefix it with `bid:arc:`. For example, PERP's token ID is `bid:arc:0x4389b473460474d68533bde2f873b5a2819f308e`.

These examples use two tokens whose `TokenCreated` events came from the Argus portal:

| Sample token | Contract |
| --- | --- |
| PERP | `0x4389b473460474d68533bde2f873b5a2819f308e` |
| GROKBOOK | `0xf25bed776bc17192fbc0630913888d8d1b9bbc1c` |

They are user-created examples. Symbols are not unique on a launchpad, so always identify a token by its address. Replace the addresses with a token returned by the launch query.

:::tip Build a launchpad token list
The Trading cubes do not attach an Argus label to each token. Build that list from launch events, then pass the token IDs into Trading queries. Argus pools are Uniswap v4: `Pair.Market.Address` can be empty and several pools share `Pair.Pool.Address`, so include `Pair.Pool.Id` to select one pool. It matches the `poolId` argument of `TokenCreated`.
:::

## Stream new Argus launches

Subscribe with the same portal and event filters.

[Run in Bitquery IDE](https://ide.bitquery.io/arc-mainnet-argus-launch-stream)

```graphql
subscription {
  EVM(network: arc) {
    Events(
      where: {
        TransactionStatus: {Success: true}
        LogHeader: {Address: {is: "0xb021be536808f551b31789422fd28a6c9c6e97da"}, Removed: false}
        Log: {Signature: {Name: {is: "TokenCreated"}}}
      }
    ) {
      Block {Number Time}
      Transaction {Hash From}
      LogHeader {Address Index}
      Log {Signature {Name Signature}}
      Arguments {
        Name
        Type
        Value {
          ... on EVM_ABI_Address_Value_Arg {address}
          ... on EVM_ABI_String_Value_Arg {string}
          ... on EVM_ABI_BigInt_Value_Arg {bigInteger}
          ... on EVM_ABI_Integer_Value_Arg {integer}
          ... on EVM_ABI_Bytes_Value_Arg {hex}
        }
      }
    }
  }
}
```

Append new token IDs to your application's list. A Trading subscription has fixed filters: resubscribe with the updated list when a new launch arrives. Keep a time checkpoint and query recent events after reconnecting. Deduplicate launch records by transaction hash and log index.

## Argus launches by creator wallet

Filter on the decoded `creator` argument to list every token one wallet launched.

[Run in Bitquery IDE](https://ide.bitquery.io/arc-mainnet-argus-launches-by-creator)

```graphql
query {
  EVM(network: arc) {
    Events(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        TransactionStatus: {Success: true}
        LogHeader: {Address: {is: "0xb021be536808f551b31789422fd28a6c9c6e97da"}, Removed: false}
        Log: {Signature: {Name: {is: "TokenCreated"}}}
        Arguments: {includes: {Name: {is: "creator"}, Value: {Address: {is: "0x01af73b21b0efcd0716577c27fd6a267448db999"}}}}
      }
    ) {
      Block {Number Time}
      Transaction {Hash From}
      LogHeader {Address Index}
      Log {Signature {Name Signature}}
      Arguments {
        Name
        Type
        Value {
          ... on EVM_ABI_Address_Value_Arg {address}
          ... on EVM_ABI_String_Value_Arg {string}
          ... on EVM_ABI_BigInt_Value_Arg {bigInteger}
          ... on EVM_ABI_Integer_Value_Arg {integer}
          ... on EVM_ABI_Bytes_Value_Arg {hex}
        }
      }
    }
  }
}
```

## Launch fees, curve and deployed contracts

Filter on the decoded `token` argument to get the three setup events for one launch. `FeeConfigured` carries buy and sell tax and the fee split in basis points. `CurveOpened` has the v4 position and tick range. `PartsDeployed` lists the hook, locker and splitter contracts.

[Run in Bitquery IDE](https://ide.bitquery.io/arc-mainnet-argus-launch-config)

```graphql
query {
  EVM(network: arc) {
    Events(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        TransactionStatus: {Success: true}
        LogHeader: {Address: {is: "0xb021be536808f551b31789422fd28a6c9c6e97da"}, Removed: false}
        Log: {Signature: {Name: {in: ["FeeConfigured", "CurveOpened", "PartsDeployed"]}}}
        Arguments: {includes: {Name: {is: "token"}, Value: {Address: {is: "0x4389b473460474d68533bde2f873b5a2819f308e"}}}}
      }
    ) {
      Block {Number Time}
      Transaction {Hash From}
      LogHeader {Address Index}
      Log {Signature {Name Signature}}
      Arguments {
        Name
        Type
        Value {
          ... on EVM_ABI_Address_Value_Arg {address}
          ... on EVM_ABI_String_Value_Arg {string}
          ... on EVM_ABI_BigInt_Value_Arg {bigInteger}
          ... on EVM_ABI_Integer_Value_Arg {integer}
          ... on EVM_ABI_Bytes_Value_Arg {hex}
        }
      }
    }
  }
}
```

## Creator dev buys

`DevBuy` records the creator's first buy in the launch transaction. `quoteIn` is the quote asset amount in its smallest unit (USDC uses 6 decimals) and `tokensOut` is the token amount in 18-decimal units.

[Run in Bitquery IDE](https://ide.bitquery.io/arc-mainnet-argus-dev-buys)

```graphql
query {
  EVM(network: arc) {
    Events(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        TransactionStatus: {Success: true}
        LogHeader: {Address: {is: "0xb021be536808f551b31789422fd28a6c9c6e97da"}, Removed: false}
        Log: {Signature: {Name: {is: "DevBuy"}}}
      }
    ) {
      Block {Number Time}
      Transaction {Hash From}
      LogHeader {Address Index}
      Log {Signature {Name Signature}}
      Arguments {
        Name
        Type
        Value {
          ... on EVM_ABI_Address_Value_Arg {address}
          ... on EVM_ABI_String_Value_Arg {string}
          ... on EVM_ABI_BigInt_Value_Arg {bigInteger}
          ... on EVM_ABI_Integer_Value_Arg {integer}
          ... on EVM_ABI_Bytes_Value_Arg {hex}
        }
      }
    }
  }
}
```

### Stream dev buys

[Run in Bitquery IDE](https://ide.bitquery.io/arc-mainnet-argus-dev-buy-stream)

```graphql
subscription {
  EVM(network: arc) {
    Events(
      where: {
        TransactionStatus: {Success: true}
        LogHeader: {Address: {is: "0xb021be536808f551b31789422fd28a6c9c6e97da"}, Removed: false}
        Log: {Signature: {Name: {is: "DevBuy"}}}
      }
    ) {
      Block {Number Time}
      Transaction {Hash From}
      LogHeader {Address Index}
      Log {Signature {Name Signature}}
      Arguments {
        Name
        Type
        Value {
          ... on EVM_ABI_Address_Value_Arg {address}
          ... on EVM_ABI_String_Value_Arg {string}
          ... on EVM_ABI_BigInt_Value_Arg {bigInteger}
          ... on EVM_ABI_Integer_Value_Arg {integer}
          ... on EVM_ABI_Bytes_Value_Arg {hex}
        }
      }
    }
  }
}
```

## Argus launch calls

The `launch` call carries inputs that the events do not: total supply, curve targets, the quote asset and the metadata URI. Struct members arrive as repeated rows in declaration order; `Path.Name` tells you whether a row belongs to the launch parameters (`p`) or the token metadata (`meta`).

[Run in Bitquery IDE](https://ide.bitquery.io/arc-mainnet-argus-launch-calls)

```graphql
query {
  EVM(network: arc) {
    Calls(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {
        TransactionStatus: {Success: true}
        Call: {
          To: {is: "0xb021be536808f551b31789422fd28a6c9c6e97da"}
          Signature: {Name: {is: "launch"}}
          Success: true
        }
      }
    ) {
      Block {Number Time}
      Transaction {Hash From}
      Call {From To Signature {Name SignatureHash}}
      Arguments {
        Name
        Type
        Path {Name}
        Value {
          ... on EVM_ABI_Address_Value_Arg {address}
          ... on EVM_ABI_String_Value_Arg {string}
          ... on EVM_ABI_BigInt_Value_Arg {bigInteger}
          ... on EVM_ABI_Integer_Value_Arg {integer}
          ... on EVM_ABI_Bytes_Value_Arg {hex}
        }
      }
    }
  }
}
```

## Recent trades for an Argus token

Match the token on either side of the pair. This includes trades where it is the quote asset.

[Run in Bitquery IDE](https://ide.bitquery.io/arc-mainnet-argus-recent-trades)

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
          {Pair: {Token: {Id: {is: "bid:arc:0x4389b473460474d68533bde2f873b5a2819f308e"}}}}
          {Pair: {QuoteToken: {Id: {is: "bid:arc:0x4389b473460474d68533bde2f873b5a2819f308e"}}}}
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

## Stream trades for an Argus token

The same token filters work as a Trading subscription.

[Run in Bitquery IDE](https://ide.bitquery.io/arc-mainnet-argus-trade-stream)

```graphql
subscription {
  Trading {
    Trades(
      where: {
        Pair: {Market: {NetworkBid: {is: "bid:arc"}, ProtocolFamily: {is: "Uniswap"}}}
        any: [
          {Pair: {Token: {Id: {is: "bid:arc:0x4389b473460474d68533bde2f873b5a2819f308e"}}}}
          {Pair: {QuoteToken: {Id: {is: "bid:arc:0x4389b473460474d68533bde2f873b5a2819f308e"}}}}
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

## Rank an Argus token watchlist by volume

This sample ranks PERP and GROKBOOK over the last 24 hours. It includes only rows where a listed token is `Pair.Token`, so the Buy/Sell counts have a consistent meaning. Extend the list from launch events to cover more tokens. It is not a total for the whole launchpad.

[Run in Bitquery IDE](https://ide.bitquery.io/arc-mainnet-argus-watchlist-volume)

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
            "bid:arc:0x4389b473460474d68533bde2f873b5a2819f308e"
            "bid:arc:0xf25bed776bc17192fbc0630913888d8d1b9bbc1c"
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

:::caution Counts and volume
These server aggregates count the indexed rows. The [Trading Trades field notes](/docs/trading/crypto-trades-api/trades-api/#before-you-aggregate-three-things-about-a-trades-row) describe duplicate rows that can affect exact totals. For audited figures, fetch the underlying rows and check duplicates before summing. Wallet counts refer to addresses, not people.
:::

## Most active traders for an Argus token

Rank wallets by quoted USD turnover across both pair orientations. This measures activity, not profit.

[Run in Bitquery IDE](https://ide.bitquery.io/arc-mainnet-argus-top-traders)

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
          {Pair: {Token: {Id: {is: "bid:arc:0x4389b473460474d68533bde2f873b5a2819f308e"}}}}
          {Pair: {QuoteToken: {Id: {is: "bid:arc:0x4389b473460474d68533bde2f873b5a2819f308e"}}}}
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

Use `Trading.Pairs` with rank 1 to retrieve the token's most recent one-minute price interval from its top market. Inspect `Interval.Time.End`: a quiet token can return an old interval, or no row at all.

[Run in Bitquery IDE](https://ide.bitquery.io/arc-mainnet-argus-top-market-price)

```graphql
query {
  Trading {
    Pairs(
      limit: {count: 1}
      orderBy: {descending: Block_Time}
      where: {
        Token: {Id: {is: "bid:arc:0x4389b473460474d68533bde2f873b5a2819f308e"}}
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

## One-minute OHLCV candles

`Trading.Tokens` combines indexed pools for the token. This query returns up to 120 one-minute intervals within the last 24 hours, newest first. Plot from oldest to newest.

[Run in Bitquery IDE](https://ide.bitquery.io/arc-mainnet-argus-ohlcv-candles)

```graphql
query {
  Trading {
    Tokens(
      limit: {count: 120}
      orderBy: {descending: Block_Time}
      where: {
        Token: {Id: {is: "bid:arc:0x4389b473460474d68533bde2f873b5a2819f308e"}, NetworkBid: {is: "bid:arc"}}
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

`Volume.Usd` is USD volume and `Volume.Base` is token units. Empty intervals may be absent; treat a missing interval as missing data unless your chart has an explicit fill rule. The current interval may still change. The same `Token.Id` and `Interval.Time.Start` can appear more than once; see the [Tokens field notes](/docs/trading/crypto-price-api/tokens/#field-notes).

To stream candles, change `query` to `subscription`, remove `limit`, `orderBy`, and the historical `Block.Time` filter, and keep the token and interval filters.

<FAQ
  items={[
    {
      q: "Which Argus events does Bitquery decode on Arc?",
      a: "TokenCreated, CurveOpened, FeeConfigured, PartsDeployed and DevBuy on the Argus portal, plus the launch call. Each returns named arguments such as token, creator, symbol and tax settings."
    },
    {
      q: "Which Bitquery cube should I use for Argus trades?",
      a: "Use Trading.Trades for swaps and trader activity, Trading.Pairs for a selected market price, and Trading.Tokens for token OHLCV. Use EVM.Events on network arc to find token launches."
    },
    {
      q: "Can I filter Trading by the Argus portal?",
      a: "No. Build a list of tokens from TokenCreated events first, then pass those token IDs to Trading. Trading market fields do not identify the launchpad that created the token."
    },
    {
      q: "Why is Signature.Name empty on older Argus events?",
      a: "Decoding started on 17 September 2026. Filter earlier rows by signature hash and read the token address from Topics."
    }
  ]}
/>

## Related APIs

- [Tolly Launchpad API](/docs/blockchain/arc-mainnet/tolly-launchpad-api/)
- [RadarDEX Launchpad API](/docs/blockchain/arc-mainnet/radardex-launchpad-api/)
- [Minara Launchpad API](/docs/blockchain/arc-mainnet/minara-launchpad-api/)
- [Arc Launchpads API](/docs/blockchain/arc-mainnet/arc-mainnet-launchpads-api/)
- [Arc Blockchain API](/docs/blockchain/arc-mainnet/)
- [Trading Trades API](/docs/trading/crypto-trades-api/trades-api/)
- [Trading Tokens OHLCV API](/docs/trading/crypto-price-api/tokens/)
