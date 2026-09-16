---
title: "Arc Mainnet Launchpads API & Streams"
description: "Find and stream token launches from verified Arc mainnet launchpads with Bitquery GraphQL, then query trades, prices and OHLCV for each launched token."
sidebar_position: 2
keywords:
  - Arc mainnet launchpads API
  - Arc token launches
  - Arc new tokens API
  - Arc launchpad stream
  - Argus launchpad API
  - RadarDEX launchpad API
  - Tolly launchpad API
  - Warp launchpad API
  - Archemist launchpad API
  - PEGD launchpad API
  - Bitquery Arc mainnet
---
# Arc Mainnet Launchpads API & Streams

Find and stream **new token launches on Arc mainnet**, then follow each token into its first trades. The queries use `EVM.Events` for launch contracts and `EVM.DEXTradeByTokens` for market data.

This page covers six launchpads whose own sites publish Arc contracts or contract interfaces and whose launch events were found through Bitquery: [Argus](https://argus.world/docs), [RadarDEX](https://www.radardex.pro/), [Tolly](https://tollylabs.com/guide), [Warp](https://circlewarp.fun/), [Archemist](https://archemist.fun/docs), and [PEGD](https://pegd.fun/docs).

Every query on this page was executed against the production endpoint before publishing.

For platform-specific launch feeds and Trading cube examples, use the [Tolly Launchpad API](/docs/blockchain/arc-mainnet/tolly-launchpad-api/) and [RadarDEX Launchpad API](/docs/blockchain/arc-mainnet/radardex-launchpad-api/).

For Minara.fun, use the separate [Minara Launchpad API](/docs/blockchain/arc-mainnet/minara-launchpad-api/). It includes verified strategy and fee-hook contracts, token/pool/creator checks, and Trading cube examples. Minara is outside the six-platform queries below.

:::info Availability checked 16 September 2026
The realtime path returned live launch events and trades. Leave the `dataset` argument out until `combined` and `archive` are enabled for Arc mainnet.
:::

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::tip Related docs
- [Arc Mainnet API overview](/docs/blockchain/arc-mainnet/)
- [Arc Mainnet DEX Trades API](/docs/blockchain/arc-mainnet/arc-mainnet-trades-api/)
- [Arc Mainnet Events API](/docs/blockchain/arc-mainnet/arc-mainnet-events-api/)
- [EVM Events schema](/docs/schema/evm/events/)
- [EVM DEXTrades schema](/docs/schema/evm/dextrades/)
:::

**On this page:** [Launchpad contracts](#verified-launchpad-contracts) · [Event topics](#read-the-launched-token-address) · [Stream launches](#stream-launches) · [Latest launches](#latest-launches) · [Launch counts](#launch-count-by-platform) · [Token trades](#trades-for-a-launched-token) · [OHLCV](#ohlcv-for-a-launched-token)

---

## Verified launchpad contracts

The contract and event pair is the stable ID for each launchpad. Display names can change; contracts and event hashes do not.

| Launchpad | Arc mainnet launch contract | Launch event | Signature hash |
| --- | --- | --- | --- |
| Argus | `0xa5628a11c412596e1f63b75a2c0284f843c549d6` | `TokenCreated` | `1d8917231579f8ce39407f0d616f36f357b07329b0ce5164d0754ac15145ce0a` |
| RadarDEX Classic | `0x4b638c1502a07a8e1a26112ee98f51a3f34bc93a` | `TokenLaunched` | `851d681a32f0efba577c4a1bd412f74b575764a6b91e499a05a48a23f3821d66` |
| RadarDEX Reflection | `0x2d933ce4bde6f3d99540b5d7886b383e59b2b2f8` | `TokenLaunched` | `851d681a32f0efba577c4a1bd412f74b575764a6b91e499a05a48a23f3821d66` |
| Tolly | `0xcad7ee36ac193bf2eddb7b3e2736c5bdb8269c8b` | `TokenCreated` | `875522b092d9e19a1de359e4bd218090d582fa521c9733889acf1a5ff1941255` |
| Warp | `0x0dcad158e98bc24455f9e94f46709d8a5f6d1255` | `TokenCreated` | `0b4cfda446fdf9ec5a85855f088c154869eb62e3e723d7d80319b680f90e0cfd` |
| Archemist V2 | `0x297cebc4de347347205cd08667b56ee951dd8810` | `TokenCreated` | `8e83c293b82cf6e864a90c1ccffea5e0f1ec23b271eff78e78f1dbd5e32a9c7d` |
| PEGD V4 | `0xd0aa679ec263e8f9bc929426eb9eab2e061d2c5f` | `KeyLaunched` | `4b5a1abdb5ebec3e01fa29e6e1f5e3095f8b3cfaed9ffcd46ad35e7ebc58039e` |

Sources: [Argus contract bundle](https://argus.world/argus-v4.json), [RadarDEX launch page](https://www.radardex.pro/), [Tolly guide](https://tollylabs.com/guide), [Warp contracts](https://circlewarp.fun/), [Archemist protocol reference](https://archemist.fun/docs), and [PEGD developer API](https://pegd.fun/docs#developer-api).

The table lists current contracts observed on 16 September 2026. Keep old addresses in your index if you need launches from earlier contract versions.

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
              "0xa5628a11c412596e1f63b75a2c0284f843c549d6"
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
              "0xa5628a11c412596e1f63b75a2c0284f843c549d6"
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
              "0xa5628a11c412596e1f63b75a2c0284f843c549d6"
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

Copy the token address from `Topics[1]` into `Trade.Currency.SmartContract`. This example follows a token launched through RadarDEX.

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-docs-launchpads-trades-for-a-launched-token)

```graphql
{
  EVM(network: arc) {
    DEXTradeByTokens(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        Trade: {
          Currency: {
            SmartContract: {
              is: "0x91dbd2d6cfe189bea443a9aaab5019d432f7fd99"
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
      Trade {
        Amount
        Price
        PriceInUSD
        Currency {
          Name
          Symbol
          SmartContract
        }
        Side {
          Type
          Amount
          AmountInUSD
          Currency {
            Symbol
            SmartContract
          }
        }
        Dex {
          ProtocolName
          SmartContract
        }
      }
    }
  }
}
```

Change `query` to `subscription` and remove `limit` and `orderBy` to stream the token's trades as they arrive.

---

## OHLCV for a launched token

This query builds five-minute candles for the same token against Arc's ERC-20 USDC interface. It returns USD volume, open, high, low, close, and trade count.

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-docs-launchpads-ohlcv-for-a-launched-token)

```graphql
{
  EVM(network: arc) {
    DEXTradeByTokens(
      limit: {count: 12}
      orderBy: {descendingByField: "Block_Time"}
      where: {
        Trade: {
          Currency: {
            SmartContract: {
              is: "0x91dbd2d6cfe189bea443a9aaab5019d432f7fd99"
            }
          }
          Side: {
            Currency: {
              SmartContract: {
                is: "0x3600000000000000000000000000000000000000"
              }
            }
          }
        }
      }
    ) {
      Block {
        Time(interval: {in: minutes, count: 5})
      }
      volume: sum(of: Trade_Side_AmountInUSD)
      Trade {
        high: PriceInUSD(maximum: Trade_PriceInUSD)
        low: PriceInUSD(minimum: Trade_PriceInUSD)
        open: PriceInUSD(minimum: Block_Number)
        close: PriceInUSD(maximum: Block_Number)
      }
      count
    }
  }
}
```

Some launchpads create Uniswap v3 pools, while others use v4 or a bonding curve before moving liquidity. `DEXTradeByTokens` keeps the token filter the same across those routes.
