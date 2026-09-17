---
title: "Arc Launchpads API & Streams"
description: "Find and stream token launches from verified Arc launchpads with Bitquery GraphQL, then query trades, prices and OHLCV for each launched token."
sidebar_position: 2
keywords:
  - Arc launchpads API
  - Arc token launches
  - Arc new tokens API
  - Arc launchpad stream
  - Argus launchpad API
  - RadarDEX launchpad API
  - Tolly launchpad API
  - Warp launchpad API
  - Archemist launchpad API
  - PEGD launchpad API
  - Bitquery Arc
---
# Arc Launchpads API & Streams

Find and stream **new token launches on Arc**, then follow each token into its first trades. Use `EVM.Events` for launch events, `Trading.Trades` for recent trades and live streams, and `Trading.Tokens` for prices and candles.

This page covers six launchpads whose own sites publish Arc contracts or contract interfaces and whose launch events were found through Bitquery: [Argus](https://argus.world/docs), [RadarDEX](https://www.radardex.pro/), [Tolly](https://tollylabs.com/guide), [Warp](https://circlewarp.fun/), [Archemist](https://archemist.fun/docs), and [PEGD](https://pegd.fun/docs).

Every query on this page was executed against the production endpoint before publishing.

For platform-specific launch feeds and Trading cube examples, use the [Argus Launchpad API](/docs/blockchain/arc-mainnet/argus-launchpad-api/), [Tolly Launchpad API](/docs/blockchain/arc-mainnet/tolly-launchpad-api/) and [RadarDEX Launchpad API](/docs/blockchain/arc-mainnet/radardex-launchpad-api/).

For Minara.fun, use the separate [Minara Launchpad API](/docs/blockchain/arc-mainnet/minara-launchpad-api/). It includes verified strategy and fee-hook contracts, token/pool/creator checks, and Trading cube examples. Minara is outside the six-platform queries below.

:::info Availability checked 16 September 2026
The realtime path returned live launch events and trades. Leave the `dataset` argument out until `combined` and `archive` are enabled for Arc.
:::

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::tip Related docs
- [Arc Blockchain API overview](/docs/blockchain/arc-mainnet/)
- [Arc DEX Trades API](/docs/blockchain/arc-mainnet/arc-mainnet-trades-api/)
- [Arc Events API](/docs/blockchain/arc-mainnet/arc-mainnet-events-api/)
- [EVM Events schema](/docs/schema/evm/events/)
- [Trading.Trades reference](/docs/trading/crypto-trades-api/trades-api/)
- [Trading token candles](/docs/trading/crypto-price-api/tokens/)
:::

**On this page:** [Launchpad contracts](#verified-launchpad-contracts) · [Event topics](#read-the-launched-token-address) · [Stream launches](#stream-launches) · [Latest launches](#latest-launches) · [Launch counts](#launch-count-by-platform) · [Token trades](#trades-for-a-launched-token) · [OHLCV](#ohlcv-for-a-launched-token)

---

## Verified launchpad contracts

The contract and event pair is the stable ID for each launchpad. Display names can change; contracts and event hashes do not.

| Launchpad | Arc launch contract | Launch event | Signature hash |
| --- | --- | --- | --- |
| Argus | `0xb021be536808f551b31789422fd28a6c9c6e97da` | `TokenCreated` | `1d8917231579f8ce39407f0d616f36f357b07329b0ce5164d0754ac15145ce0a` |
| RadarDEX Classic | `0x4b638c1502a07a8e1a26112ee98f51a3f34bc93a` | `TokenLaunched` | `851d681a32f0efba577c4a1bd412f74b575764a6b91e499a05a48a23f3821d66` |
| RadarDEX Reflection | `0x2d933ce4bde6f3d99540b5d7886b383e59b2b2f8` | `TokenLaunched` | `851d681a32f0efba577c4a1bd412f74b575764a6b91e499a05a48a23f3821d66` |
| Tolly | `0xcad7ee36ac193bf2eddb7b3e2736c5bdb8269c8b` | `TokenCreated` | `875522b092d9e19a1de359e4bd218090d582fa521c9733889acf1a5ff1941255` |
| Warp | `0x0dcad158e98bc24455f9e94f46709d8a5f6d1255` | `TokenCreated` | `0b4cfda446fdf9ec5a85855f088c154869eb62e3e723d7d80319b680f90e0cfd` |
| Archemist V2 | `0x297cebc4de347347205cd08667b56ee951dd8810` | `TokenCreated` | `8e83c293b82cf6e864a90c1ccffea5e0f1ec23b271eff78e78f1dbd5e32a9c7d` |
| PEGD V4 | `0xd0aa679ec263e8f9bc929426eb9eab2e061d2c5f` | `KeyLaunched` | `4b5a1abdb5ebec3e01fa29e6e1f5e3095f8b3cfaed9ffcd46ad35e7ebc58039e` |

Sources: [Argus contract reference](https://github.com/arguspad/argus-world), [RadarDEX launch page](https://www.radardex.pro/), [Tolly guide](https://tollylabs.com/guide), [Warp contracts](https://circlewarp.fun/), [Archemist protocol reference](https://archemist.fun/docs), and [PEGD developer API](https://pegd.fun/docs#developer-api).

The table lists current contracts observed on 17 September 2026. Keep old addresses in your index if you need launches from earlier contract versions.

Launches are concentrated. In a sample hour on 17 September, Argus emitted 2,983 launch events against 10 from Tolly and 2 from Archemist; the [launch count query](#launch-count-by-platform) reproduces this split for any window. Argus also runs older and forked deployments that emit the same hash, such as `0xa5628a11c412596e1f63b75a2c0284f843c549d6` (22 launches) and `0x629c9592c88788b6b31e377e34f7884de9d81ffd` (94), against 94,843 from the portal above. Add them to the address list only if you need those rows.

---

## Read the launched token address

Bitquery exposes the raw indexed values in `Topics`:

- `Topics[0]` is the event signature hash.
- For Argus, RadarDEX, Tolly, Warp, and Archemist, `Topics[1]` contains the launched token address.
- For PEGD, `Topics[2]` contains the launched token address; `Topics[1]` is the launch ID.
- The address is left-padded to 32 bytes. Take its final 40 hex characters and add `0x`.

For example, this topic:

```text
00000000000000000000000091dbd2d6cfe189bea443a9aaab5019d432f7fd99
```

maps to this token:

```text
0x91dbd2d6cfe189bea443a9aaab5019d432f7fd99
```

Custom launch events may have an empty decoded `Name`. Filter on `SignatureHash` and read `Topics`; both are present even when the ABI is not in the decoder.

---

## Stream launches

Change nothing else to receive launches from all six platforms over one WebSocket. Add or remove contract and signature pairs as launchpads deploy new versions.

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-docs-launchpads-stream-launches)

```graphql
subscription {
  EVM(network: arc) {
    Events(
      where: {
        LogHeader: {
          Address: {
            in: [
              "0xb021be536808f551b31789422fd28a6c9c6e97da"
              "0x4b638c1502a07a8e1a26112ee98f51a3f34bc93a"
              "0x2d933ce4bde6f3d99540b5d7886b383e59b2b2f8"
              "0xcad7ee36ac193bf2eddb7b3e2736c5bdb8269c8b"
              "0x0dcad158e98bc24455f9e94f46709d8a5f6d1255"
              "0x297cebc4de347347205cd08667b56ee951dd8810"
              "0xd0aa679ec263e8f9bc929426eb9eab2e061d2c5f"
            ]
          }
        }
        Log: {
          Signature: {
            SignatureHash: {
              in: [
                "1d8917231579f8ce39407f0d616f36f357b07329b0ce5164d0754ac15145ce0a"
                "851d681a32f0efba577c4a1bd412f74b575764a6b91e499a05a48a23f3821d66"
                "875522b092d9e19a1de359e4bd218090d582fa521c9733889acf1a5ff1941255"
                "0b4cfda446fdf9ec5a85855f088c154869eb62e3e723d7d80319b680f90e0cfd"
                "8e83c293b82cf6e864a90c1ccffea5e0f1ec23b271eff78e78f1dbd5e32a9c7d"
                "4b5a1abdb5ebec3e01fa29e6e1f5e3095f8b3cfaed9ffcd46ad35e7ebc58039e"
              ]
            }
          }
        }
      }
    ) {
      Block {
        Number
        Time
      }
      Transaction {
        Hash
        From
      }
      LogHeader {
        Address
      }
      Log {
        Signature {
          SignatureHash
        }
      }
      Topics {
        Hash
      }
    }
  }
}
```

Map `LogHeader.Address` to the contract table to name the launchpad.

---

## Latest launches

Use the same filters with `query`, a row limit, and descending block time to fetch the newest launches.

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-docs-launchpads-latest-launches)

```graphql
{
  EVM(network: arc) {
    Events(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        LogHeader: {
          Address: {
            in: [
              "0xb021be536808f551b31789422fd28a6c9c6e97da"
              "0x4b638c1502a07a8e1a26112ee98f51a3f34bc93a"
              "0x2d933ce4bde6f3d99540b5d7886b383e59b2b2f8"
              "0xcad7ee36ac193bf2eddb7b3e2736c5bdb8269c8b"
              "0x0dcad158e98bc24455f9e94f46709d8a5f6d1255"
              "0x297cebc4de347347205cd08667b56ee951dd8810"
              "0xd0aa679ec263e8f9bc929426eb9eab2e061d2c5f"
            ]
          }
        }
        Log: {
          Signature: {
            SignatureHash: {
              in: [
                "1d8917231579f8ce39407f0d616f36f357b07329b0ce5164d0754ac15145ce0a"
                "851d681a32f0efba577c4a1bd412f74b575764a6b91e499a05a48a23f3821d66"
                "875522b092d9e19a1de359e4bd218090d582fa521c9733889acf1a5ff1941255"
                "0b4cfda446fdf9ec5a85855f088c154869eb62e3e723d7d80319b680f90e0cfd"
                "8e83c293b82cf6e864a90c1ccffea5e0f1ec23b271eff78e78f1dbd5e32a9c7d"
                "4b5a1abdb5ebec3e01fa29e6e1f5e3095f8b3cfaed9ffcd46ad35e7ebc58039e"
              ]
            }
          }
        }
      }
    ) {
      Block {
        Number
        Time
      }
      Transaction {
        Hash
        From
      }
      LogHeader {
        Address
      }
      Log {
        Signature {
          SignatureHash
        }
      }
      Topics {
        Hash
      }
    }
  }
}
```

---

## Launch count by platform

Group launch events by emitting contract to compare activity during the last hour. The result uses contract addresses, so map them to the table above in your app.

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-docs-launchpads-launch-count-by-platform)

```graphql
{
  EVM(network: arc) {
    Events(
      limit: {count: 10}
      orderBy: {descendingByField: "count"}
      where: {
        Block: {Time: {since_relative: {hours_ago: 1}}}
        LogHeader: {
          Address: {
            in: [
              "0xb021be536808f551b31789422fd28a6c9c6e97da"
              "0x4b638c1502a07a8e1a26112ee98f51a3f34bc93a"
              "0x2d933ce4bde6f3d99540b5d7886b383e59b2b2f8"
              "0xcad7ee36ac193bf2eddb7b3e2736c5bdb8269c8b"
              "0x0dcad158e98bc24455f9e94f46709d8a5f6d1255"
              "0x297cebc4de347347205cd08667b56ee951dd8810"
              "0xd0aa679ec263e8f9bc929426eb9eab2e061d2c5f"
            ]
          }
        }
        Log: {
          Signature: {
            SignatureHash: {
              in: [
                "1d8917231579f8ce39407f0d616f36f357b07329b0ce5164d0754ac15145ce0a"
                "851d681a32f0efba577c4a1bd412f74b575764a6b91e499a05a48a23f3821d66"
                "875522b092d9e19a1de359e4bd218090d582fa521c9733889acf1a5ff1941255"
                "0b4cfda446fdf9ec5a85855f088c154869eb62e3e723d7d80319b680f90e0cfd"
                "8e83c293b82cf6e864a90c1ccffea5e0f1ec23b271eff78e78f1dbd5e32a9c7d"
                "4b5a1abdb5ebec3e01fa29e6e1f5e3095f8b3cfaed9ffcd46ad35e7ebc58039e"
              ]
            }
          }
        }
      }
    ) {
      LogHeader {
        Address
      }
      count
    }
  }
}
```

---

## Trades for a launched token

Read the token address from the [launch event topics](#read-the-launched-token-address), then use it in `Trading.Trades`. Most listed launchpads put the address in `Topics[1]`; PEGD uses `Topics[2]`. Match both `Pair.Token` and `Pair.QuoteToken` to catch the token on either side of the pair. This example follows DUKE, launched through Argus.

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-trading-launchpads-trades-for-a-launched-token) · [Run stream](https://ide.bitquery.io/arc-mainnet-trading-launchpads-trades-for-a-launched-token-stream)

```graphql
{
  Trading {
    Trades(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        Pair: {Market: {Network: {is: "Arc"}}}
        any: [
          {Pair: {Token: {Id: {is: "bid:arc:0x41358defd0dedc90528b3f1835715e907b686e6a"}}}}
          {Pair: {QuoteToken: {Id: {is: "bid:arc:0x41358defd0dedc90528b3f1835715e907b686e6a"}}}}
        ]
      }
    ) {
      Block { Time }
      TransactionHeader { Hash }
      Trader { Address }
      Side
      Amounts { Base Quote }
      AmountsInUsd { Quote }
      PriceInUsd
      Pair {
        Token { Id Address Symbol }
        QuoteToken { Id Address Symbol }
        Market { Network Protocol }
        Pool { Address Id }
      }
    }
  }
}
```

Change `{` to `subscription {` to receive the same trades live.

:::caution Example tokens go quiet
Launched tokens stop trading quickly. An empty list means this token has gone quiet, not that the query is wrong — take a current address from [Latest launches](#latest-launches).
:::

## OHLCV for a launched token

`Trading.Tokens` returns USD candles across the token's markets. `Volume.Usd` is USD volume and `Volume.Base` is token volume. The candle cube carries no trade count, so use `Trading.Trades` when you need one.

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-trading-launchpads-ohlcv-for-a-launched-token) · [Run stream](https://ide.bitquery.io/arc-mainnet-trading-launchpads-ohlcv-for-a-launched-token-stream)

```graphql
{
  Trading {
    Tokens(
      limit: {count: 12}
      orderBy: {descending: Block_Time}
      where: {
        Token: {
          Network: {is: "Arc"}
          Address: {is: "0x41358defd0dedc90528b3f1835715e907b686e6a"}
        }
        Interval: {Time: {Duration: {eq: 300}}}
        Block: {Time: {since_relative: {hours_ago: 24}}}
      }
    ) {
      Token { Id Symbol Network }
      Interval { Time { Start End Duration } }
      Price { Ohlc { Open High Low Close } }
      Volume { Base Usd }
    }
  }
}
```

Some launchpads create Uniswap v3 pools, while others use v4 or a bonding curve before moving liquidity. Keeping the token filter on `Trading` follows the token across those routes. Use `EVM.DEXTrades` or `EVM.DEXTradeByTokens` only for history older than 30 days, after confirming Arc archive support.
