---
title: "Bags.fm API on Robinhood"
description: "Query and stream Bags.fm trades on Robinhood with Bitquery: live trades, prices, OHLCV, market cap, whale trades, top traders, and bonding-curve events."
sidebar_position: 5
keywords:
  - Bags.fm API
  - Bags.fm Robinhood API
  - Bags fm trades API
  - Bags trading data API
  - Bags.fm price API
  - OHLCV for Bags.fm tokens
  - Bags.fm market cap API
  - Bags.fm whale trades
  - Bags.fm top traders
  - Bags.fm real-time trade stream
  - Bags bonding curve trades
  - Bags TokensBought event
  - Bags TokensSold event
  - bags_v2 protocol
  - Robinhood launchpad API
  - Bitquery Bags.fm Trading API
  - Bitquery Bags.fm Events API
---
# Bags.fm API on Robinhood

**[Bags.fm](https://bags.fm/)** is a token launchpad on the **Robinhood** network where tokens trade on a bonding-curve AMM. This guide focuses on **Bags.fm trading data** — live and historical trades, USD prices, OHLCV/K-line candles, market cap, whale trades, top traders, and the raw bonding-curve `TokensBought`/`TokensSold` events — using Bitquery's `Trading` and `EVM(network: robinhood)` APIs.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::tip Related docs
- [Robinhood Trades API](/docs/blockchain/robinhood/robinhood-trades)
- [Robinhood Meme Coin Launches API](/docs/blockchain/robinhood/robinhood-meme-coin-launches)
- [Flap.sh API on Robinhood](/docs/blockchain/robinhood/flap-sh-api)
- [Robinhood Transfers](/docs/blockchain/robinhood/robinhood-transfers)
- [WebSocket subscriptions](/docs/subscriptions/websockets/)
:::

---

## Bags.fm identifiers

Bags trades are indexed in the `Trading` cube under the **Bags** protocol family. Filter with `ProtocolFamily` (or `Protocol`) — you do **not** need a per-token contract address, since every Bags token trades under the same family.

| Field | Value | Notes |
| --- | --- | --- |
| `Pair.Market.ProtocolFamily` | `Bags` | Selects all Bags markets across tokens |
| `Pair.Market.Protocol` | `bags_v2` | Current Bags protocol version |
| `Network` / `NetworkBid` | `Robinhood` / `bid:robinhood` | Robinhood network |
| **Bags AMM / bonding curve** | `0x0ed8d8116f89def7c904d6b9657657a3ccc7d5b7` | Proxy that routes Bags trades |
| **Bags AMM logic contract** | `0x419890a21711c3d3af46b58548376420b9723275` | Implementation behind the proxy; emits `TokensBought` / `TokensSold` |
| **Bags factory (launch)** | `0xe8cc4431adf8b5a847c113ef0c6af9043219cb37` | Mints new Bags tokens — see [launches](/docs/blockchain/robinhood/robinhood-meme-coin-launches#bagsfm) |

:::note Per-token `Market.Program`
Each Bags token exposes its own `Pair.Market.Program` (the token's bonding-curve/pool contract). To scope trades to a single token, filter by `Pair.Token.Address` rather than `Program`; to get **all** Bags trading activity, filter by `ProtocolFamily: {is: "Bags"}`.
:::

---

## New Bags Token Launches

To detect **newly created** Bags tokens (before or alongside their first trades), use the mint-transfer pattern on the Bags factory contract — covered in detail on the [Robinhood Meme Coin Launches API](/docs/blockchain/robinhood/robinhood-meme-coin-launches#bagsfm) page.

```graphql
{
  EVM(network: robinhood) {
    Transfers(
      orderBy: {descending: Block_Time}
      limit: {count: 50}
      where: {
        Transaction: {To: {is: "0xe8cc4431adf8b5a847c113ef0c6af9043219cb37"}}
        Transfer: {
          Amount: {eq: "1000000000"}
          Sender: {is: "0x0000000000000000000000000000000000000000"}
        }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
        From
      }
      Transfer {
        Amount
        Receiver
        Currency {
          Name
          Symbol
          SmartContract
        }
      }
    }
  }
}
```

---

## Real-Time Bags Trades

Stream every Bags trade as it is indexed via a GraphQL `subscription` on `Trading.Trades`, scoped to the Bags protocol family on Robinhood. Includes side (buy/sell), trader, base/quote amounts (native and USD), market cap, and full transaction header.

▶️ [Run in IDE](https://ide.bitquery.io/bags-amm-trade-websocket)

```graphql
subscription {
  Trading {
    Trades(
      where: {Pair: {Market: {ProtocolFamily: {is: "Bags"}, Network: {is: "Robinhood"}}}}
    ) {
      Side
      Supply {
        CirculatingSupply
        MarketCap
      }
      Trader {
        Address
      }
      TransactionHeader {
        Fee
        FeePayer
        Sender
        To
      }
      Amounts {
        Base
        Quote
      }
      AmountsInUsd {
        Base
        Quote
      }
      Block {
        Date
        Time
        Timestamp
      }
      Pair {
        Currency {
          Id
          Name
          Symbol
        }
        Market {
          Address
          Program
          Network
          Protocol
          ProtocolFamily
        }
        QuoteCurrency {
          Id
          Name
          Symbol
        }
        Token {
          Address
          Id
          IsNative
          Symbol
          TokenId
          Network
        }
        QuoteToken {
          Address
          Id
          IsNative
          Symbol
          TokenId
          Network
        }
      }
    }
  }
}
```

<details>
<summary>Sample response</summary>

```json
{
  "Side": "Sell",
  "Amounts": { "Base": 73809640, "Quote": 0.1017578 },
  "AmountsInUsd": { "Base": 190.31902, "Quote": 190.31883 },
  "Block": { "Date": "2026-07-16", "Time": "2026-07-16T17:25:21Z", "Timestamp": "1784222721000000000" },
  "Supply": { "CirculatingSupply": 0, "MarketCap": 2578.51 },
  "Trader": { "Address": "0x00a60b9760a4aa1a2fd6388b5cb6295f4c90cee0" },
  "Pair": {
    "Currency": { "Name": "Stud", "Symbol": "Stud", "Id": "bid:robinhood:0x3f62c875db9a08cfbb0f0ed7623770cf3fa5f70c" },
    "Market": { "Program": "0x0ed8d8116f89def7c904d6b9657657a3ccc7d5b7", "Protocol": "bags_v2", "ProtocolFamily": "Bags", "Network": "Robinhood" },
    "QuoteCurrency": { "Name": "Ethereum", "Symbol": "ETH", "Id": "bid:eth" },
    "Token": { "Address": "0x3f62c875db9a08cfbb0f0ed7623770cf3fa5f70c", "Symbol": "Stud", "IsNative": false },
    "QuoteToken": { "Symbol": "ETH", "IsNative": true, "Id": "bid:robinhood" }
  }
}
```

</details>

---

## Latest Bags Trades

The query counterpart to the stream above — the most recent Bags trades across all tokens, newest first.

▶️ [Run in IDE](https://ide.bitquery.io/bags-trade)

```graphql
{
  Trading {
    Trades(
      limit: {count: 50}
      orderBy: {descending: Block_Time}
      where: {Pair: {Market: {ProtocolFamily: {is: "Bags"}, Network: {is: "Robinhood"}}}}
    ) {
      Side
      Supply {
        CirculatingSupply
        MarketCap
      }
      Trader {
        Address
      }
      TransactionHeader {
        Fee
        FeePayer
        Sender
        To
      }
      Amounts {
        Base
        Quote
      }
      AmountsInUsd {
        Base
        Quote
      }
      Block {
        Date
        Time
        Timestamp
      }
      Pair {
        Currency {
          Id
          Name
          Symbol
        }
        Market {
          Address
          Program
          Network
          Protocol
          ProtocolFamily
        }
        QuoteCurrency {
          Id
          Name
          Symbol
        }
        Token {
          Address
          Id
          IsNative
          Symbol
          TokenId
          Network
        }
        QuoteToken {
          Address
          Id
          IsNative
          Symbol
          TokenId
          Network
        }
      }
    }
  }
}
```

:::tip Query ⇄ Stream
Every query on this page can be turned into a live stream — switch the operation type from `query` to `subscription` in the Bitquery IDE (and drop `orderBy`/`limit`, which don't apply to subscriptions).
:::

---

## Trades for a Specific Bags Token

Scope trades to a single Bags token with `Pair.Token.Address`. This example uses the `Stud` token (`0x3f62c875db9a08cfbb0f0ed7623770cf3fa5f70c`).

```graphql
{
  Trading {
    Trades(
      limit: {count: 50}
      orderBy: {descending: Block_Time}
      where: {
        Pair: {
          Token: {Address: {is: "0x3f62c875db9a08cfbb0f0ed7623770cf3fa5f70c"}}
          Market: {ProtocolFamily: {is: "Bags"}}
        }
      }
    ) {
      Side
      Block {
        Time
      }
      Trader {
        Address
      }
      Amounts {
        Base
        Quote
      }
      AmountsInUsd {
        Base
      }
      Supply {
        MarketCap
      }
      Pair {
        Token {
          Name
          Symbol
          Address
        }
        QuoteToken {
          Name
          Symbol
        }
      }
      TransactionHeader {
        Hash
      }
    }
  }
}
```

---

## Trades by a Trader on Bags

Track all Bags trades made by a specific wallet by filtering on `Trader.Address`.

```graphql
{
  Trading {
    Trades(
      limit: {count: 50}
      orderBy: {descending: Block_Time}
      where: {
        Trader: {Address: {is: "0x00a60b9760a4aa1a2fd6388b5cb6295f4c90cee0"}}
        Pair: {Market: {ProtocolFamily: {is: "Bags"}}}
      }
    ) {
      Side
      Block {
        Time
      }
      Amounts {
        Base
        Quote
      }
      AmountsInUsd {
        Base
      }
      Pair {
        Token {
          Name
          Symbol
          Address
        }
        QuoteToken {
          Symbol
        }
      }
      TransactionHeader {
        Hash
      }
    }
  }
}
```

---

## Whale Trades on Bags

Surface large Bags trades by filtering on USD value. This example returns trades of at least `$500` — raise or lower the `AmountsInUsd.Base` threshold to match current Bags liquidity.

```graphql
{
  Trading {
    Trades(
      limit: {count: 50}
      orderBy: {descending: AmountsInUsd_Base}
      where: {
        Pair: {Market: {ProtocolFamily: {is: "Bags"}}}
        AmountsInUsd: {Base: {ge: 500}}
      }
    ) {
      Side
      Block {
        Time
      }
      Trader {
        Address
      }
      AmountsInUsd {
        Base
      }
      Amounts {
        Base
        Quote
      }
      Supply {
        MarketCap
      }
      Pair {
        Token {
          Name
          Symbol
          Address
        }
      }
      TransactionHeader {
        Hash
      }
    }
  }
}
```

---

## First Buyers of a Bags Token

Get the earliest trades for a token, ordered oldest first, to find the first buyers after launch. Filtered to `Buy` here; remove the `Side` filter for the first trades of any side.

```graphql
{
  Trading {
    Trades(
      limit: {count: 50}
      orderBy: {ascending: [Block_Time, TransactionHeader_Index]}
      where: {
        Pair: {
          Token: {Address: {is: "0x3f62c875db9a08cfbb0f0ed7623770cf3fa5f70c"}}
          Market: {ProtocolFamily: {is: "Bags"}}
        }
        Side: {is: "Buy"}
      }
    ) {
      Block {
        Time
      }
      Trader {
        Address
      }
      Amounts {
        Base
        Quote
      }
      AmountsInUsd {
        Base
      }
      Side
      TransactionHeader {
        Hash
      }
    }
  }
}
```

---

## Top Traders of a Bags Token

Rank the biggest traders of a specific Bags token by total USD volume, with a buy/sell split and trade count. Aggregates `Trading.Trades` grouped by trader.

```graphql
{
  Trading {
    Trades(
      limit: {count: 50}
      orderBy: {descendingByField: "volume_usd"}
      where: {
        Pair: {
          Token: {Address: {is: "0x3f62c875db9a08cfbb0f0ed7623770cf3fa5f70c"}}
          Market: {ProtocolFamily: {is: "Bags"}}
        }
      }
    ) {
      Trader {
        Address
      }
      volume_usd: sum(of: AmountsInUsd_Base)
      bought_usd: sum(of: AmountsInUsd_Base, if: {Side: {is: "Buy"}})
      sold_usd: sum(of: AmountsInUsd_Base, if: {Side: {is: "Sell"}})
      trades: count
    }
  }
}
```

---

## Latest Price of a Bags Token

Get the latest USD-normalised price of a Bags token using `Trading.Tokens` with the `bid:robinhood` network filter. The price is the pool-weighted average across the token's markets.

```graphql
{
  Trading {
    Tokens(
      limit: {count: 1}
      orderBy: {descending: Interval_Time_End}
      where: {
        Token: {Address: {is: "0x3f62c875db9a08cfbb0f0ed7623770cf3fa5f70c"}, NetworkBid: {is: "bid:robinhood"}}
        Interval: {Time: {Duration: {eq: 1}}}
      }
    ) {
      latest_price: Price {
        Ohlc {
          Close
        }
      }
    }
  }
}
```

---

## Market Cap, FDV and Supply of a Bags Token

Get the latest market cap, fully-diluted valuation, supply, price, and USD volume for a single Bags token in one row.

```graphql
{
  Trading {
    Tokens(
      limit: {count: 1}
      orderBy: {descending: Interval_Time_Start}
      where: {
        Token: {Address: {is: "0x3f62c875db9a08cfbb0f0ed7623770cf3fa5f70c"}, NetworkBid: {is: "bid:robinhood"}}
        Interval: {Time: {Duration: {eq: 1}}}
      }
    ) {
      Token {
        Name
        Symbol
        Address
      }
      Price {
        Ohlc {
          Close
        }
      }
      Supply {
        MarketCap
        FullyDilutedValuationUsd
        CirculatingSupply
        TotalSupply
      }
      Volume {
        Usd
      }
    }
  }
}
```

<details>
<summary>Sample response</summary>

```json
{
  "Token": { "Name": "Stud", "Symbol": "Stud", "Address": "0x3f62c875db9a08cfbb0f0ed7623770cf3fa5f70c" },
  "Price": { "Ohlc": { "Close": 2.3498699e-06 } },
  "Supply": {
    "MarketCap": 2451.49,
    "FullyDilutedValuationUsd": 2451.49,
    "CirculatingSupply": 0,
    "TotalSupply": 1000000000
  },
  "Volume": { "Usd": 44.038837 }
}
```

</details>

---

## OHLCV / K-Line Candles for a Bags Token

Token-level OHLCV candles (USD-normalised, weighted across all pools) for charting. This example uses 1-minute candles (`Duration: 60`); use `1` (1s), `300` (5m), or `3600` (1h — the maximum) as needed.

```graphql
{
  Trading {
    Tokens(
      limit: {count: 100}
      orderBy: {descending: Interval_Time_Start}
      where: {
        Token: {Address: {is: "0x3f62c875db9a08cfbb0f0ed7623770cf3fa5f70c"}, NetworkBid: {is: "bid:robinhood"}}
        Interval: {Time: {Duration: {eq: 60}}}
      }
    ) {
      Interval {
        Time {
          Start
          End
        }
      }
      Price {
        Ohlc {
          Open
          High
          Low
          Close
        }
      }
      Volume {
        Base
        Quote
        Usd
      }
      Supply {
        MarketCap
      }
    }
  }
}
```

---

## Top Bags Tokens by Volume

Rank the most actively traded Bags tokens by USD volume over the last 24 hours. This aggregates `Trading.Trades` grouped by token — the `Trading.Tokens` cube doesn't expose a protocol-family filter, so scope by `ProtocolFamily` on the trades and group by `Pair.Token`.

```graphql
{
  Trading {
    Trades(
      limit: {count: 50}
      orderBy: {descendingByField: "volume_usd"}
      where: {
        Pair: {Market: {ProtocolFamily: {is: "Bags"}}}
        Block: {Time: {since_relative: {days_ago: 1}}}
      }
    ) {
      Pair {
        Token {
          Name
          Symbol
          Address
        }
      }
      volume_usd: sum(of: AmountsInUsd_Base)
      trades: count
    }
  }
}
```

<details>
<summary>Sample response</summary>

```json
{
  "Pair": { "Token": { "Name": "Crypto Cats", "Symbol": "CRYPTOCATS", "Address": "0x366c07ef29f06c7e9e6d0078eb7e31186f87605c" } },
  "trades": "238",
  "volume_usd": "17691.63"
}
```

</details>

:::note Getting per-token market cap
This aggregation gives volume and trade counts per token. To add the latest market cap / FDV for any token in the results, pass its `Token.Address` to the [Market Cap, FDV and Supply](#market-cap-fdv-and-supply-of-a-bags-token) query above.
:::

---

## Raw Bonding-Curve Trades (`TokensBought` / `TokensSold`)

For the lowest-level view, read Bags trades directly from the AMM's decoded logs. The Bags bonding-curve logic contract (`0x419890a21711c3d3af46b58548376420b9723275`, proxied by `0x0ed8d8116f89def7c904d6b9657657a3ccc7d5b7`) emits **`TokensBought`** and **`TokensSold`** with full fee breakdown and virtual reserves — data that isn't exposed by the higher-level `Trading.Trades` cube.

### Bags buys (`TokensBought`)

```graphql
{
  EVM(network: robinhood) {
    Events(
      limit: {count: 25}
      orderBy: {descending: Block_Time}
      where: {Log: {Signature: {Name: {is: "TokensBought"}}, SmartContract: {is: "0x419890a21711c3d3af46b58548376420b9723275"}}}
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
        From
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
        }
      }
    }
  }
}
```

`TokensBought` arguments: `buyer`, `recipient`, `grossQuoteIn`, `netQuoteIn`, `tokensOut`, `feeQuote`, `vaultFeeQuote`, `creatorFeeWETH`, `refundQuote`, `price`, `virtualTokenReserves`, `virtualQuoteReserves`.

### Bags sells (`TokensSold`)

Swap the signature name to stream sells. Arguments: `seller`, `recipient`, `tokensIn`, `grossQuoteOut`, `netQuoteToRecipient`, `feeQuote`, `vaultFeeQuote`, `creatorFeeWETH`, `price`, `virtualTokenReserves`, `virtualQuoteReserves`.

```graphql
{
  EVM(network: robinhood) {
    Events(
      limit: {count: 25}
      orderBy: {descending: Block_Time}
      where: {Log: {Signature: {Name: {is: "TokensSold"}}, SmartContract: {is: "0x419890a21711c3d3af46b58548376420b9723275"}}}
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
        From
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
        }
      }
    }
  }
}
```

:::note Raw integers vs normalized amounts
`TokensBought` / `TokensSold` arguments are **raw on-chain integers** (WETH-style quote amounts are `1e18`-scaled; `tokensOut`/`tokensIn` use the token's own decimals). Use `Trading.Trades` (above) when you want decimal-normalized and USD-priced amounts; use these events when you need the exact fee split, `price`, and `virtualTokenReserves`/`virtualQuoteReserves` from the bonding curve.
:::

---

## All Bags AMM Events

Enumerate the event signatures emitted through the Bags AMM proxy to discover what else you can index (fee splits, initialization, role/ownership changes).

```graphql
{
  EVM(network: robinhood) {
    Events(
      limit: {count: 100}
      where: {LogHeader: {Address: {is: "0x0ed8d8116f89def7c904d6b9657657a3ccc7d5b7"}}}
    ) {
      count
      Log {
        Signature {
          Name
        }
        SmartContract
      }
    }
  }
}
```

Observed signatures include `TokensBought`, `TokensSold`, `FeesSplit`, `Initialized`, `RoleGranted`, `OwnershipTransferred`, and `BeaconUpgraded` (most emitted by the logic contract `0x419890a21711c3d3af46b58548376420b9723275`).

---

## FAQ

### How do I get all Bags.fm trades?

Query `Trading.Trades` filtered by `Pair.Market.ProtocolFamily: {is: "Bags"}` (optionally with `Network: {is: "Robinhood"}`). This returns trades across every Bags token — no per-token address needed.

### How do I stream Bags trades in real time?

Run a GraphQL `subscription` on `Trading.Trades` with the same `ProtocolFamily: "Bags"` filter, or open the [WebSocket IDE link](https://ide.bitquery.io/bags-amm-trade-websocket). Any query on this page can be converted to a stream by switching the operation to `subscription`.

### What's the difference between `Trading.Trades` and the `TokensBought`/`TokensSold` events?

`Trading.Trades` gives decimal-normalized, USD-priced trades with market cap and a unified buy/sell `Side` — best for analytics and charts. The `TokensBought`/`TokensSold` events are the raw bonding-curve logs with the exact fee breakdown (`feeQuote`, `vaultFeeQuote`, `creatorFeeWETH`), execution `price`, and virtual reserves — best when you need on-chain-exact values.

### How do I get the price, market cap, or OHLCV of a Bags token?

Use `Trading.Tokens` with `Token.Address` and `NetworkBid: {is: "bid:robinhood"}`. Set `Interval.Time.Duration` (seconds) for OHLCV candles, or read `Supply.MarketCap` / `Supply.FullyDilutedValuationUsd` for valuations.

### Which protocol value does Bags use?

Bags markets report `Protocol: "bags_v2"` under `ProtocolFamily: "Bags"`. Filter on `ProtocolFamily` so your queries keep working across protocol versions.

### How do I detect a newly launched Bags token?

Use the mint-transfer pattern on the Bags factory (`0xe8cc4431adf8b5a847c113ef0c6af9043219cb37`) — a transfer from the zero address with `Amount` `1000000000`. See the [launches page](/docs/blockchain/robinhood/robinhood-meme-coin-launches#bagsfm).

---

## Next steps

- Stream Bags trades live with the [WebSocket query](https://ide.bitquery.io/bags-amm-trade-websocket) for real-time dashboards and alerts.
- Detect new Bags tokens the moment they launch with the [Robinhood Meme Coin Launches API](/docs/blockchain/robinhood/robinhood-meme-coin-launches#bagsfm).
- Compare against other Robinhood launchpads with the [Flap.sh API](/docs/blockchain/robinhood/flap-sh-api).
- Explore network-wide prices, OHLCV, and top traders in the [Robinhood Trades API](/docs/blockchain/robinhood/robinhood-trades).
