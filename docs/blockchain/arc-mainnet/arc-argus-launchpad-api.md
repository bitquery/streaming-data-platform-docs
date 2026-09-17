---
title: "Argus Launchpad API on Arc: Launches, Streams and Trades"
sidebar_label: "Argus Launchpad API"
description: "Argus launchpad API and WebSocket on Arc mainnet. Stream Argus token launches, read creator, metadata, taxes and the Uniswap v4 pool, then follow each token into trades and candles with Bitquery GraphQL."
sidebar_position: 3
keywords:
  - Argus launchpad API
  - Arc Argus launchpad API
  - Argus Arc API
  - Argus launchpad websocket
  - Arc Argus websocket
  - Argus launchpad stream
  - Argus launchpad subscription
  - Argus new token stream
  - Argus new token API
  - Argus token launch API
  - Argus Portal contract
  - Argus Portal v7
  - Argus TokenCreated event
  - Argus CurveOpened event
  - Argus DevBuy event
  - Argus FeeConfigured event
  - Argus PartsDeployed event
  - Argus token metadata API
  - Argus creator API
  - Argus buy tax API
  - Argus sell tax API
  - Argus Uniswap v4 hook
  - Argus liquidity locker
  - Argus revenue splitter
  - Argus trades API
  - Argus OHLCV API
  - Arc mainnet launchpad API
  - Arc launchpad websocket
  - Bitquery Argus API
  - arguspad API
---

# Argus Launchpad API on Arc: Launches, Streams and Trades

Query and stream every token launched through **Argus** on Arc mainnet, read the creator, metadata, taxes and pool that come with each launch, then follow the token into its trades and candles.

Argus is the largest launchpad on Arc by a wide margin. In a sample hour on 17 September 2026 it emitted 2,983 launch events against 10 from Tolly and 2 from Archemist, and 94,843 of the 94,968 launches recorded against its event signature came from the single Portal contract below. If you index one Arc launchpad, index this one.

Every query on this page was executed against the production endpoint before publishing.

:::info Availability checked 17 September 2026
Argus launch events and Trading data both returned live rows on the realtime path. Use `Trading` for trades, prices and candles; use `EVM.Events` for the launch feed. Leave the dataset argument out of Trading.
:::

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::tip Related docs
- [Arc Mainnet Launchpads API](/docs/blockchain/arc-mainnet/arc-mainnet-launchpads-api/) — all six Arc launchpads in one feed
- [Arc Mainnet API overview](/docs/blockchain/arc-mainnet/)
- [Arc Mainnet Events API](/docs/blockchain/arc-mainnet/arc-mainnet-events-api/)
- [EVM Events schema](/docs/schema/evm/events/)
- [Trading.Trades reference](/docs/trading/crypto-trades-api/trades-api/)
- [Trading token candles](/docs/trading/crypto-price-api/tokens/)
:::

**On this page:** [Contract and events](#contract-and-events) · [How a launch works](#how-an-argus-launch-works) · [Decoded vs raw](#decoded-names-and-the-abi-cutover) · [Latest launches](#latest-launches) · [Stream launches](#stream-launches-websocket) · [Token metadata](#token-metadata-image-website-and-socials) · [One token's launch](#one-tokens-full-launch-record) · [Older launches](#older-launches-filter-on-topics) · [Dev buys](#dev-buys) · [Taxes](#taxes-and-the-fee-split) · [Creators](#most-active-creators) · [Launch rate](#launch-rate-over-time) · [Trades](#trades-for-an-argus-token) · [Candles](#ohlcv-candles) · [Combined stream](#combined-launch-and-trade-stream)

---

## Contract and events

Every Argus launch is emitted by one Portal contract. Filter on the contract plus a signature hash; both are stable, while display names are not.

| Field | Value |
| --- | --- |
| Portal (v7) | `0xb021be536808f551b31789422fd28a6c9c6e97da` |
| Network | Arc mainnet, chain 5042 (`network: arc`) |
| Market | Uniswap v4, 1% pool fee |
| Quote asset | Native USDC `0x3600000000000000000000000000000000000000` |

| Event | Signature hash | Arguments |
| --- | --- | --- |
| `TokenCreated` | `1d8917231579f8ce39407f0d616f36f357b07329b0ce5164d0754ac15145ce0a` | `token`, `creator`, `name`, `symbol`, `poolId`, `imageURI`, `website`, `twitter`, `telegram` |
| `PartsDeployed` | `a54419a494ae20a1807712ab7a33ff0928b9a0e6e03e4562885aedb8e8fcd4da` | `token`, `locker`, `hook`, `splitter` |
| `CurveOpened` | `55e45784ac0f1201c142dd0d2119dd11980e98f34cb682c49340d5c28c3a9aa0` | `token`, `poolId`, `locker`, `positionId`, `liquidity`, `tickLower`, `tickUpper` |
| `FeeConfigured` | `abe14607f311bb63e5b35c469f88100e8fb2ff250876e2364a402e2f2679e8aa` | `token`, `hook`, `lpFeeBps`, `buyTaxBps`, `sellTaxBps`, `treasuryBps`, `creatorBps`, `burnBps`, `dividendBps`, `liquidityBps` |
| `DevBuy` | `84d429ed8af1c9cfe8bb07b556e4120e976c9f4c9232a7f50a15d31d83e232a9` | `token`, `creator`, `quoteIn`, `tokensOut` |

Full signatures, for client-side decoding:

```text
TokenCreated(address,address,string,string,bytes32,string,string,string,string)
PartsDeployed(address,address,address,address)
CurveOpened(address,bytes32,address,uint256,uint128,int24,int24)
FeeConfigured(address,address,uint16,uint16,uint16,uint16,uint16,uint16,uint16,uint16)
DevBuy(address,address,uint256,uint256)
```

Source: the [Argus contract reference](https://github.com/arguspad/argus-world) publishes the Portal address; the signatures and hashes above were read from Arc mainnet.

Argus runs other deployments that emit the same hashes, including `0xa5628a11c412596e1f63b75a2c0284f843c549d6` and `0x629c9592c88788b6b31e377e34f7884de9d81ffd`. Together they account for well under 1% of launches. Add them to an `in:` list if you need those rows.

---

## How an Argus launch works

One transaction creates the token and everything around it. A launch emits four events, or five when the creator buys in at launch:

1. **`PartsDeployed`** — a `locker`, a `hook` and a `splitter` are deployed **per token**, so these addresses differ on every launch. Do not cache them as protocol constants.
2. **`TokenCreated`** — the token address, the creator, and the metadata the creator typed in.
3. **`FeeConfigured`** — the buy and sell taxes, fixed at launch, and how the tax is split.
4. **`CurveOpened`** — the Uniswap v4 position that holds the supply: `poolId`, `positionId`, `liquidity` and the tick range.
5. **`DevBuy`** — present on roughly one launch in ten, recording the creator's own first purchase.

There is no separate graduation step to wait for. The supply goes into a single v4 position above the opening price at launch and buys walk the price up through it, so a token is tradable from its first block and `Trading` has it immediately.

`TokenCreated` and `CurveOpened` both carry `poolId`, which is the Uniswap v4 pool identifier — use it to join a launch to its pool without a second lookup.

---

## Decoded names and the ABI cutover

:::warning Filter on `SignatureHash`, not on the event name
Argus's ABI entered the decoder at **2026-09-17 12:48 UTC**. Events emitted before that moment are indexed with an **empty** `Log.Signature.Name` and **no decoded `Arguments`** — 450,457 of them against 48,249 decoded when this page was written. A query that filters on `Signature: {Name: {is: "TokenCreated"}}`, or that reads `Arguments`, silently returns nothing for those launches.

`Log.Signature.SignatureHash` and `Topics` are populated on every row, decoded or not. Use them and the queries work across the whole history. See [Older launches](#older-launches-filter-on-topics).
:::

---

## Latest launches

The newest Argus launches with their full decoded payload.

▶️ [Run in IDE](https://ide.bitquery.io/arc-argus-latest-launches)

```graphql
{
  EVM(network: arc) {
    Events(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {
        LogHeader: {Address: {is: "0xb021be536808f551b31789422fd28a6c9c6e97da"}}
        Log: {Signature: {SignatureHash: {is: "1d8917231579f8ce39407f0d616f36f357b07329b0ce5164d0754ac15145ce0a"}}}
      }
    ) {
      Block { Time Number }
      Transaction { Hash From }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Address_Value_Arg { address }
          ... on EVM_ABI_String_Value_Arg { string }
          ... on EVM_ABI_Bytes_Value_Arg { hex }
        }
      }
    }
  }
}
```

`Transaction.From` is the wallet that paid for the launch. It matches the `creator` argument on ordinary launches and differs when a launch is routed through another contract, so read `creator` when you want the credited creator.

---

## Stream launches (WebSocket)

The same filter as a `subscription` delivers each launch over the WebSocket endpoint as it is mined. Connect to `wss://streaming.bitquery.io/graphql?token=ory_at_YOUR_TOKEN` — see [WebSocket authorization](/docs/authorization/websocket/).

▶️ [Run in IDE](https://ide.bitquery.io/arc-argus-launch-stream)

```graphql
subscription {
  EVM(network: arc) {
    Events(
      where: {
        LogHeader: {Address: {is: "0xb021be536808f551b31789422fd28a6c9c6e97da"}}
        Log: {Signature: {SignatureHash: {is: "1d8917231579f8ce39407f0d616f36f357b07329b0ce5164d0754ac15145ce0a"}}}
      }
    ) {
      Block { Time Number }
      Transaction { Hash From }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Address_Value_Arg { address }
          ... on EVM_ABI_String_Value_Arg { string }
          ... on EVM_ABI_Bytes_Value_Arg { hex }
        }
      }
    }
  }
}
```

To receive the whole launch bundle — parts, metadata, taxes, pool and dev buy — drop the signature filter and keep only the contract filter. Every event Argus emits then arrives on one subscription, and you switch on `Log.Signature.SignatureHash` client-side.

---

## Token metadata: image, website and socials

`TokenCreated` carries the creator-supplied metadata, so no off-chain lookup is needed. This query returns only launches that filled in a Twitter handle.

▶️ [Run in IDE](https://ide.bitquery.io/arc-argus-token-metadata)

```graphql
{
  EVM(network: arc) {
    Events(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        LogHeader: {Address: {is: "0xb021be536808f551b31789422fd28a6c9c6e97da"}}
        Log: {Signature: {SignatureHash: {is: "1d8917231579f8ce39407f0d616f36f357b07329b0ce5164d0754ac15145ce0a"}}}
        Arguments: {includes: {Name: {is: "twitter"}, Value: {String: {not: ""}}}}
      }
    ) {
      Block { Time }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_String_Value_Arg { string }
          ... on EVM_ABI_Address_Value_Arg { address }
        }
      }
    }
  }
}
```

A returned row looks like this:

```json
{
  "token": "0x2a0928b39921316ee926e739e741d60555849308",
  "creator": "0x74cc548ffe9b79fbba229c63edae199a7433b0c8",
  "name": "Godfather of AI",
  "symbol": "Geoffrey",
  "imageURI": "ipfs://bafkreih3xaepgy6v4g6lepqcbvjpgg277bsfsz46k6x5icopzuumbdhk6q",
  "website": "https://youtu.be/xiKOZ0aPe38?t=38",
  "twitter": "https://x.com/geoffreyhinton",
  "telegram": ""
}
```

`imageURI` is usually an `ipfs://` URI. The three social fields are free text and frequently empty; treat them as unverified creator input.

---

## One token's full launch record

`token` is an indexed argument on every Argus event, so one filter returns the token's whole launch bundle — parts, pool, taxes, metadata and dev buy.

▶️ [Run in IDE](https://ide.bitquery.io/arc-argus-token-launch-record)

```graphql
{
  EVM(network: arc) {
    Events(
      limit: {count: 10}
      where: {
        LogHeader: {Address: {is: "0xb021be536808f551b31789422fd28a6c9c6e97da"}}
        Arguments: {includes: {
          Name: {is: "token"}
          Value: {Address: {is: "0x821c49d5e1d54ad556ff817a1af59984d1e0db95"}}
        }}
      }
    ) {
      Block { Time }
      Transaction { Hash }
      Log { Signature { Name } }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Address_Value_Arg { address }
          ... on EVM_ABI_String_Value_Arg { string }
          ... on EVM_ABI_Bytes_Value_Arg { hex }
          ... on EVM_ABI_BigInt_Value_Arg { bigInteger }
          ... on EVM_ABI_Integer_Value_Arg { integer }
        }
      }
    }
  }
}
```

For JOAN (`0x821c49d5…`) that returns the locker, hook and splitter from `PartsDeployed`; pool `b9e0add4…` with position `171034` from `CurveOpened`; a 1% LP fee with a 0 bps buy tax and 1 bps sell tax from `FeeConfigured`; the name, symbol and socials from `TokenCreated`; and a 2,000 USDC dev buy for 443,872,137 tokens from `DevBuy`.

This query reads `Arguments`, so it only covers launches after the [ABI cutover](#decoded-names-and-the-abi-cutover). Use the next query for older ones.

---

## Older launches: filter on `Topics`

`Topics` is present on every row whether or not the ABI was decoded, so it reaches the full history. `Topics[0]` is the signature hash and the indexed `token` and `creator` follow, each left-padded to 32 bytes.

▶️ [Run in IDE](https://ide.bitquery.io/arc-argus-launches-by-topic)

```graphql
{
  EVM(network: arc) {
    Events(
      limit: {count: 10}
      where: {
        LogHeader: {Address: {is: "0xb021be536808f551b31789422fd28a6c9c6e97da"}}
        Topics: {includes: [{Hash: {is: "0x00000000000000000000000041358defd0dedc90528b3f1835715e907b686e6a"}}]}
      }
    ) {
      Block { Time }
      Transaction { Hash From }
      Log { Signature { Name SignatureHash } }
      Topics { Hash }
    }
  }
}
```

Take the final 40 hex characters of a padded topic and prefix `0x` to recover an address. On rows from before the cutover, `Name` comes back empty while `SignatureHash` still identifies the event — match it against the [event table](#contract-and-events) and decode the unindexed fields from the log data client-side using the full signatures above.

---

## Dev buys

`DevBuy` records the creator buying their own token at launch. `quoteIn` is USDC in 6 decimals; `tokensOut` is the token amount in 18 decimals.

▶️ [Run in IDE](https://ide.bitquery.io/arc-argus-dev-buys)

```graphql
{
  EVM(network: arc) {
    Events(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        LogHeader: {Address: {is: "0xb021be536808f551b31789422fd28a6c9c6e97da"}}
        Log: {Signature: {SignatureHash: {is: "84d429ed8af1c9cfe8bb07b556e4120e976c9f4c9232a7f50a15d31d83e232a9"}}}
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

A launch with no `DevBuy` means the creator took no allocation at launch, which is worth surfacing in any screener built on this feed.

---

## Taxes and the fee split

`FeeConfigured` fixes the economics at launch and they cannot change afterwards. All values are basis points.

Swap the signature hash in the [latest launches](#latest-launches) query for `abe14607f311bb63e5b35c469f88100e8fb2ff250876e2364a402e2f2679e8aa` and read the numeric arguments with `... on EVM_ABI_Integer_Value_Arg { integer }`.

The shape observed across launches on 17 September 2026:

| Argument | Typical value | Meaning |
| --- | --- | --- |
| `lpFeeBps` | 100 | Uniswap v4 pool fee, 1% on every launch |
| `buyTaxBps` / `sellTaxBps` | 0–1000 | Fixed at launch, capped at 10%. The most common settings were 1000/1000, then 300/300, then 100/100 |
| `treasuryBps` | 1000 | Share of tax to the Argus treasury |
| `creatorBps` | 10000 | Share of the remaining tax to the creator |
| `burnBps`, `dividendBps`, `liquidityBps` | 0 | Available, rarely used |

Buy and sell taxes are set separately, so a token can launch with a free buy and a taxed exit. Read both before quoting a round-trip cost.

---

## Most active creators

Group launches by the paying wallet to rank creators over a window.

▶️ [Run in IDE](https://ide.bitquery.io/arc-argus-top-creators)

```graphql
{
  EVM(network: arc) {
    Events(
      limit: {count: 10}
      orderBy: {descendingByField: "launches"}
      where: {
        LogHeader: {Address: {is: "0xb021be536808f551b31789422fd28a6c9c6e97da"}}
        Log: {Signature: {SignatureHash: {is: "1d8917231579f8ce39407f0d616f36f357b07329b0ce5164d0754ac15145ce0a"}}}
        Block: {Time: {since_relative: {hours_ago: 6}}}
      }
    ) {
      Transaction { From }
      launches: count
    }
  }
}
```

Swap `Transaction { From }` for the `creator` argument if you want the credited creator instead of the payer.

---

## Launch rate over time

Bucket launches by hour and count distinct creators alongside them, which separates a genuine crowd from one wallet minting in a loop.

▶️ [Run in IDE](https://ide.bitquery.io/arc-argus-launch-rate)

```graphql
{
  EVM(network: arc) {
    Events(
      orderBy: {descendingByField: "launches"}
      where: {
        LogHeader: {Address: {is: "0xb021be536808f551b31789422fd28a6c9c6e97da"}}
        Log: {Signature: {SignatureHash: {is: "1d8917231579f8ce39407f0d616f36f357b07329b0ce5164d0754ac15145ce0a"}}}
        Block: {Time: {since_relative: {hours_ago: 6}}}
      }
    ) {
      Block { Time(interval: {in: hours, count: 1}) }
      launches: count
      uniqueCreators: count(distinct: Transaction_From)
    }
  }
}
```

On 17 September this returned roughly 1,500 to 3,000 launches per hour from 450 to 740 distinct creators.

---

## Trades for an Argus token

Take the token address from the launch feed and hand it to `Trading.Trades`. Argus tokens quote against native USDC on Uniswap v4, and matching both `Pair.Token` and `Pair.QuoteToken` catches the token on either side of the pair.

▶️ [Run in IDE](https://ide.bitquery.io/arc-argus-token-trades)

```graphql
{
  Trading {
    Trades(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        Pair: {Market: {Network: {is: "Arc"}}}
        any: [
          {Pair: {Token: {Id: {is: "bid:arc:0x821c49d5e1d54ad556ff817a1af59984d1e0db95"}}}}
          {Pair: {QuoteToken: {Id: {is: "bid:arc:0x821c49d5e1d54ad556ff817a1af59984d1e0db95"}}}}
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
Launched tokens stop trading quickly. An empty list here means this token has gone quiet, not that the query is wrong — take a current address from [Latest launches](#latest-launches).
:::

---

## OHLCV candles

`Trading.Tokens` returns USD candles across the token's markets. `Volume.Usd` is USD volume and `Volume.Base` is token volume; the candle cube carries no trade count, so use `Trading.Trades` when you need one.

▶️ [Run in IDE](https://ide.bitquery.io/arc-argus-ohlcv-candles)

```graphql
{
  Trading {
    Tokens(
      limit: {count: 12}
      orderBy: {descending: Block_Time}
      where: {
        Token: {
          Network: {is: "Arc"}
          Address: {is: "0x821c49d5e1d54ad556ff817a1af59984d1e0db95"}
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

---

## Combined: launch and trade stream

A screener needs both halves — the launch as it happens, then the trades that follow. Run these two subscriptions over one WebSocket connection.

▶️ [Run in IDE](https://ide.bitquery.io/arc-argus-launch-bundle-stream)

```graphql
# 1. Every Argus launch, with metadata, taxes, pool and dev buy on one stream
subscription {
  EVM(network: arc) {
    Events(
      where: {LogHeader: {Address: {is: "0xb021be536808f551b31789422fd28a6c9c6e97da"}}}
    ) {
      Block { Time Number }
      Transaction { Hash From }
      Log { Signature { Name SignatureHash } }
      Topics { Hash }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Address_Value_Arg { address }
          ... on EVM_ABI_String_Value_Arg { string }
          ... on EVM_ABI_Bytes_Value_Arg { hex }
          ... on EVM_ABI_BigInt_Value_Arg { bigInteger }
          ... on EVM_ABI_Integer_Value_Arg { integer }
        }
      }
    }
  }
}
```

▶️ [Run in IDE](https://ide.bitquery.io/arc-argus-trade-stream)

```graphql
# 2. Every Arc trade on Uniswap v4, filtered to your watchlist client-side
subscription {
  Trading {
    Trades(
      where: {Pair: {Market: {Network: {is: "Arc"}, Protocol: {is: "uniswap_v4"}}}}
    ) {
      Block { Time }
      Trader { Address }
      Side
      Amounts { Base Quote }
      AmountsInUsd { Quote }
      PriceInUsd
      Pair { Token { Address Symbol } QuoteToken { Symbol } Pool { Id } }
    }
  }
}
```

Keying the two streams together is straightforward: `TokenCreated.token` from the first is `Pair.Token.Address` in the second, and `TokenCreated.poolId` is `Pair.Pool.Id`. Stream 1 gives a token its identity and economics at birth; stream 2 gives it a price a moment later.

For a narrower trade stream, add `Pair: {Token: {Id: {is: "bid:arc:0x…"}}}` once you know which tokens you care about, and reopen the subscription as the watchlist changes.

---

## Next steps

- Widen the feed to every Arc launchpad with the [Arc Mainnet Launchpads API](/docs/blockchain/arc-mainnet/arc-mainnet-launchpads-api/).
- Follow token holders and supply with the [Arc Mainnet Balances API](/docs/blockchain/arc-mainnet/arc-mainnet-balances-api/).
- Read the raw launch transaction with the [Arc Mainnet Transactions API](/docs/blockchain/arc-mainnet/arc-mainnet-transactions-api/).
