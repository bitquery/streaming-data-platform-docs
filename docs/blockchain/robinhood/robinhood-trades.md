---
title: "Robinhood Trades API"
description: "Robinhood Trades API: live trades, USD prices, OHLCV candles, market cap, whale trades, buy/sell pressure, and top traders via Bitquery GraphQL & WebSockets."
sidebar_position: 1
keywords:
  - Robinhood API
  - Robinhood trades API
  - Robinhood price API
  - OHLCV for Robinhood tokens
  - Marketcap for Robinhood tokens
  - Robinhood token trades
  - Latest price for Robinhood tokens
  - Robinhood whale trades
  - Robinhood top traders
  - Robinhood real-time trade stream
  - Robinhood K-line candles
  - Robinhood buy sell pressure
  - Robinhood most active pools
  - Robinhood token price watchlist
  - Bitquery Robinhood Trading API
---
# Robinhood Trades API & Streams

Bitquery exposes **Robinhood** trade and price data through the **Trading** APIs. Use these queries and real-time GraphQL subscriptions to get **live trades, USD prices, OHLCV/K-line candles, market cap, whale trades, top traders, and token leaderboards** on Robinhood — all scoped with the `bid:robinhood` network filter.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::tip Related docs
- [Robinhood Transfers](/docs/blockchain/robinhood/robinhood-transfers/)
- [Robinhood Liquidity & Slippage API](/docs/blockchain/robinhood/robinhood-liquidity/)
- [Robinhood Token Supply API](/docs/blockchain/robinhood/robinhood-token-supply/)
- [Robinhood Meme Coin Launches API](/docs/blockchain/robinhood/robinhood-meme-coin-launches/)
- [Trading data overview](/docs/trading/trading-data-overview/)
- [Crypto Trades API](/docs/trading/crypto-trades-api/trades-api/)
- [Crypto Price API](/docs/trading/crypto-price-api/introduction/)
:::

---

## Network identifier

| Field | Value | Notes |
| --- | --- | --- |
| `NetworkBid` | `bid:robinhood` | Filter to select Robinhood data (indexed and faster) |
| `Network` | `Robinhood` | Filter to select Robinhood data |

### Example tokens used on this page

| Item | Value |
| --- | --- |
| ASSETH (AssetHood, example token) | `0x9077841e155faaf4e4e89470822c2187eeef7777` |
| Example pool trading ASSETH | `0xbbaefcfcd7b92ed0df1a3eec22a21ba6beb0b52b` |
| SOLdiers (first-buyers example) | `0xaf81aa091665c60cfa172f86a5a8d6b437a79353` |
| WETH | `0x0bd7d308f8e1639fab988df18a8011f41eacad73` |

These are live examples — meme tokens go quiet over time, so swap in any token, pool, or trader you care about.

---

## Real-Time Trades on Robinhood

Stream real-time trades on Robinhood via a GraphQL subscription on `Trading.Trades` that includes details such as Trader Address, Base and Quote Currency Details, amounts, type of trade (buy or sell), market cap and transaction details.

▶️ [Run in IDE](https://ide.bitquery.io/Robinhood-Trades)

```graphql
subscription {
  Trading {
    Trades(
      where: {
      Pair: {
        Market: {
          NetworkBid: {
            is: "bid:robinhood"
          }
        }
      }
    }) {
      Block {
        Time
      }
      Trader{
        Address
      }
      Amounts{
        Base
        Quote
      }
      AmountsInUsd{
        Base
      }
      Pair{
        Token{
          Name
          Symbol
          Address
        }
        QuoteToken{
          Name
          Symbol
          Address
        }
      }
      Side
      Supply{
        FullyDilutedValuationUsd
        MarketCap
      }
      TransactionHeader{
        Hash
      }
    }
  }
}
```

:::tip WebSocket connection
Run subscriptions against `wss://streaming.bitquery.io/graphql?token=YOUR_TOKEN` with the `graphql-transport-ws` subprotocol (`connection_init` → `connection_ack` → `subscribe`). See [WebSocket authentication](/docs/authorization/websocket/).
:::

---

## Historical Trades on Robinhood

The Trading APIs cover roughly the **last 30 days** of history (for newer networks, data starts when Bitquery indexing began — measure the exact coverage with [this query](#check-the-trading-data-window)). This example pulls a past window using relative time bounds.

▶️ [Run in IDE](https://ide.bitquery.io/Historical-Robinhood-Trades)

```graphql
{
  Trading {
    Trades(
      limit: {count: 50}
      orderBy: {ascending: Block_Date}
      where: {
        Block: {
          Time: {
            since_relative: {weeks_ago: 3}
            till_relative: {weeks_ago: 1}
          }
        }
        Pair: {
          Market: {
            NetworkBid: {
              is: "bid:robinhood"
            }
          }
        }
    }) {
      Block {
        Time
      }
      Trader{
        Address
      }
      Amounts{
        Base
        Quote
      }
      AmountsInUsd{
        Base
      }
      Pair{
        Token{
          Name
          Symbol
          Address
        }
        QuoteToken{
          Name
          Symbol
          Address
        }
      }
      Side
      Supply{
        FullyDilutedValuationUsd
        MarketCap
      }
      TransactionHeader{
        Hash
      }
    }
  }
}
```

---

## Latest Trades on Robinhood

Query the most recent trades across all Robinhood tokens — the query counterpart to the real-time stream above — ordered by newest first.

```graphql
{
  Trading {
    Trades(
      limit: { count: 50 }
      orderBy: { descending: Block_Time }
      where: {
        Pair: {
          Market: {
            NetworkBid: { is: "bid:robinhood" }
          }
        }
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
      Pair {
        Token {
          Name
          Symbol
          Address
        }
        QuoteToken {
          Name
          Symbol
          Address
        }
      }
      Side
      Supply {
        FullyDilutedValuationUsd
        MarketCap
      }
      TransactionHeader {
        Hash
      }
    }
  }
}
```

---

## Whale Trades on Robinhood

Fetch large trades by filtering on USD value. This example returns trades of at least `$10,000` — adjust the `AmountsInUsd.Base` threshold as needed.

```graphql
{
  Trading {
    Trades(
      limit: {count: 50}
      orderBy: {descending: Block_Time}
      where: {Pair: {Market: {NetworkBid: {is: "bid:robinhood"}}}, AmountsInUsd: {Base: {ge: 10000}}}
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
      Pair {
        Token {
          Name
          Symbol
          Address
        }
        QuoteToken {
          Name
          Symbol
          Address
        }
      }
      Side
      Supply {
        FullyDilutedValuationUsd
        MarketCap
      }
      TransactionHeader {
        Hash
      }
    }
  }
}
```

---

## Real-Time Trades for a Specific Token

Using this GraphQL stream you can get real-time trades for a specific token (example: AssetHood, `ASSETH`) with details such as trader address, token details, marketcap, FDV and transaction hash.

▶️ [Run in IDE](https://ide.bitquery.io/Robinhood-Trades-for-a-token)

```graphql
subscription {
  Trading {
    Trades(
      where: {
      Pair: {
        Token: {
          Address: {
            is: "0x9077841e155faaf4e4e89470822c2187eeef7777"
          }
        }
        Market: {
          NetworkBid: {
            is: "bid:robinhood"
          }
        }
      }
    }) {
      Block {
        Time
      }
      Trader{
        Address
      }
      Amounts{
        Base
        Quote
      }
      AmountsInUsd{
        Base
      }
      Pair{
        Token{
          Name
          Symbol
          Address
        }
        QuoteToken{
          Name
          Symbol
          Address
        }
      }
      Side
      Supply{
        FullyDilutedValuationUsd
        MarketCap
      }
      TransactionHeader{
        Hash
      }
    }
  }
}
```

---

## Trades for a Specific Pair or Pool

Scope trades to a single liquidity pool using `Pool.Address` — useful when a token trades across multiple pools and you want just one.

```graphql
{
  Trading {
    Trades(
      limit: { count: 50 }
      orderBy: { descending: Block_Time }
      where: {
        Pair: {
          Market: {
            NetworkBid: { is: "bid:robinhood" }
          }
          Pool: {
            Address: { is: "0xbbaefcfcd7b92ed0df1a3eec22a21ba6beb0b52b" }
          }
        }
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
      Pair {
        Pool {
          Address
        }
        Token {
          Name
          Symbol
          Address
        }
        QuoteToken {
          Name
          Symbol
          Address
        }
      }
      Side
      Supply {
        FullyDilutedValuationUsd
        MarketCap
      }
      TransactionHeader {
        Hash
      }
    }
  }
}
```

---

## First Buyers of a Token on Robinhood

Get the earliest trades for a token (example: the SOLdiers meme token), ordered oldest first, to find the first buyers after launch. Filtered to buys here; remove the `Side` filter for first trades of any side.

```graphql
{
  Trading {
    Trades(
      limit: { count: 50 }
      orderBy: { ascending: [Block_Time, TransactionHeader_Index] }
      where: {
        Pair: {
          Token: {
            Address: { is: "0xaf81aa091665c60cfa172f86a5a8d6b437a79353" }
          }
          Market: {
            NetworkBid: { is: "bid:robinhood" }
          }
        }
        Side: { is: "Buy" }
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
      Pair {
        Token {
          Name
          Symbol
          Address
        }
        QuoteToken {
          Name
          Symbol
          Address
        }
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

## Trades by a Trader

Using this GraphQL API endpoint you can get token trades by a trader with details such as trade amount, trade type, token details, marketcap, FDV and transaction hash.

▶️ [Run in IDE](https://ide.bitquery.io/Robinhood-Trades-by-a-trader)

```graphql
{
  Trading {
    Trades(
      limit: { count: 50 }
      orderBy: { descending: Block_Time }
      where: {
        Trader:{
          Address:{
            is: "0x39d83c23dbf34fa574b9afbb0c0e364bdfd97099"
          }
        }
        Pair: {
          Market: {
            NetworkBid: {
              is: "bid:robinhood"
            }
          }
        }
    }) {
      Block {
        Time
      }
      Trader{
        Address
      }
      Amounts{
        Base
        Quote
      }
      AmountsInUsd{
        Base
      }
      Pair{
        Token{
          Name
          Symbol
          Address
        }
        QuoteToken{
          Name
          Symbol
          Address
        }
      }
      Side
      Supply{
        FullyDilutedValuationUsd
        MarketCap
      }
      TransactionHeader{
        Hash
      }
    }
  }
}
```

---

## Top Traders of a Token on Robinhood

Rank the biggest traders of a specific token by total USD volume, with a buy/sell split and trade count. Aggregates `Trading.Trades` grouped by trader.

```graphql
{
  Trading {
    Trades(
      limit: { count: 50 }
      orderBy: { descendingByField: "volume_usd" }
      where: {
        Pair: {
          Token: {
            Address: { is: "0x9077841e155faaf4e4e89470822c2187eeef7777" }
          }
          Market: {
            NetworkBid: { is: "bid:robinhood" }
          }
        }
      }
    ) {
      Trader {
        Address
      }
      volume_usd: sum(of: AmountsInUsd_Base)
      bought_usd: sum(
        of: AmountsInUsd_Base
        if: { Side: { is: "Buy" } }
      )
      sold_usd: sum(
        of: AmountsInUsd_Base
        if: { Side: { is: "Sell" } }
      )
      trades: count
    }
  }
}
```

---

## Latest Price of a Token on Robinhood

Get the latest USD normalised price of a token on Robinhood network using this API endpoint using `Trading.Tokens`.

:::note A single token might be traded on multiple pools, with each pool having a difference in price. As for the price returned by Bitquery we provide the weighted average price across all pools. To know more about the price calculation refer to [this](/docs/trading/crypto-price-api/price-index-algorithm/#how-token-prices-are-determined) document. 

If you want to monitor price for a particular pool, we suggest usage of `Trading.Pairs` instead of `Trading.Tokens` where you could specify the pool address.
:::

▶️ [Run in IDE](https://ide.bitquery.io/latest-price-of-a-token_10)

```graphql
{
  Trading {
    Tokens(
      where: {Token: {Address: {is: "0x9077841e155faaf4e4e89470822c2187eeef7777"}, NetworkBid: {is: "bid:robinhood"}}, Interval: {Time: {Duration: {eq: 1}}}}
      orderBy: {descending: Interval_Time_End}
      limit: {count: 1}
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

## Latest Price of a Token for a Liquidity Pool

This API endpoint retrieves the latest price of a token for a particular token pair or liquidity pool using the `Trading.Pairs` cube.

▶️ [Run in IDE](https://ide.bitquery.io/latest-price-of-a-token-on-a-pool)

```graphql
{
  Trading {
    Pairs(
      where: {
        Pool: {
          Address:{
            is: "0xbbaefcfcd7b92ed0df1a3eec22a21ba6beb0b52b"
          }
        }
        Token: {
          Address: {
            is: "0x9077841e155faaf4e4e89470822c2187eeef7777"
          }, 
          NetworkBid: {is: "bid:robinhood"}}, 
        Interval: {Time: {Duration: {eq: 1}}}
      }
      orderBy: {descending: Interval_Time_End}
      limit: {count: 1}
    ) {
      Pool{
        Address
      }
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

## Market Cap, FDV and Supply of a Token

Get the latest market cap, fully-diluted valuation, supply, and price for a single Robinhood token in one row. `limit: 1` with `orderBy: { descending: Interval_Time_Start }` returns the most recent interval — the current snapshot.

```graphql
{
  Trading {
    Tokens(
      limit: { count: 1 }
      orderBy: { descending: Interval_Time_Start }
      where: {
        Token: {
          Address: { is: "0x9077841e155faaf4e4e89470822c2187eeef7777" }
          NetworkBid: { is: "bid:robinhood" }
        }
        Interval: { Time: { Duration: { eq: 1 } } }
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
        MaxSupply
      }
      Volume {
        Usd
      }
    }
  }
}
```

---

## Token Supply on Robinhood

While `Trading.Tokens` (above) returns supply alongside price and market cap, you can also read **total supply** directly from the `EVM.TransactionBalances` cube. `TokenBalance.TotalSupply` is decimal-normalized (whole tokens). See the full guide in the [Robinhood Token Supply API](/docs/blockchain/robinhood/robinhood-token-supply).

### Latest Supply of a Token

Get the most recent total supply for a single token by filtering on its contract address.

```graphql
{
  EVM(network: robinhood) {
    TransactionBalances(
      limit: {count: 1}
      orderBy: {descending: Block_Time}
      where: {TokenBalance: {Currency: {SmartContract: {is: "0x0bd7d308f8e1639fab988df18a8011f41eacad73"}}}}
    ) {
      TokenBalance {
        Currency {
          Symbol
          HasURI
          SmartContract
        }
        TotalSupply
      }
    }
  }
}
```

### Real-Time Supply Stream

Stream live total-supply updates across Robinhood tokens. The `SmartContract: {not: "0x"}` filter excludes the native coin.

```graphql
subscription {
  EVM(network: robinhood) {
    TransactionBalances(
      where: {
        TokenBalance: {
          Currency: {
            SmartContract: {not: "0x"}
          }
        }
      }
    ) {
      TokenBalance {
        Currency {
          Symbol
          HasURI
          SmartContract
        }
        TotalSupply
      }
    }
  }
}
```

### Supply of All Active Tokens

Fetch the latest total supply for every recently active token. `limitBy` returns one row — the newest supply — per token contract. Keep a `limit`: unbounded, this returns one row per active token, which can be very large.

```graphql
{
  EVM(network: robinhood) {
    TransactionBalances(
      limitBy: {by: TokenBalance_Currency_SmartContract, count: 1}
      limit: {count: 100}
      orderBy: {descending: Block_Time}
      where: {TokenBalance: {Currency: {SmartContract: {not: "0x"}}}}
    ) {
      TokenBalance {
        Currency {
          Symbol
          HasURI
          SmartContract
        }
        TotalSupply
      }
    }
  }
}
```

---

## OHLCV / K-Line Candles for a Token

Token-level OHLCV candles (USD-normalised, weighted across all pools) for charting. This example uses 1-minute candles (`Duration: 60`); use `300` (5m) or `3600` (1h — the maximum candle) as needed.

```graphql
{
  Trading {
    Tokens(
      limit: { count: 100 }
      orderBy: { descending: Interval_Time_Start }
      where: {
        Token: {
          Address: { is: "0x9077841e155faaf4e4e89470822c2187eeef7777" }
          NetworkBid: { is: "bid:robinhood" }
        }
        Interval: { Time: { Duration: { eq: 60 } } }
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
        FullyDilutedValuationUsd
      }
      Token {
        Name
        Symbol
        Address
      }
    }
  }
}
```

---

## Real-Time OHLCV Stream for a Pair on Robinhood

This GraphQL stream for 1 second OHLCV streams the USD normalised OHLC/K-line data for a token pair, and also contains info such as interval start and end time, marketcap, volume and token details for both base and quote tokens.

▶️ [Run in IDE](https://ide.bitquery.io/OHLCV-stream-for-a-token-pair-on-robinhood)

```graphql
subscription{
  Trading {
    Pairs(
      where: {
        Pool: {
          Address:{
            is: "0xbbaefcfcd7b92ed0df1a3eec22a21ba6beb0b52b"
          }
        }
        Token: {
          Address: {
            is: "0x9077841e155faaf4e4e89470822c2187eeef7777"
          }, 
          NetworkBid: {is: "bid:robinhood"}}, 
        Interval: {Time: {Duration: {eq: 1}}}
      }
    ) {
      Interval{
        Time{
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
      Token{
        Name
        Symbol
        Address
      }
      QuoteToken{
        Name
        Symbol
        Address
      }
      Volume{
        Base
        Quote
        Usd
      }
      Supply{
        MarketCap
      }
    }
  }
}
```

---

## Top Tokens on Robinhood by Volume

Rank the most actively traded Robinhood tokens by USD volume over the last 24 hours, aggregated from 1-second intervals with `sum`.

```graphql
{
  Trading {
    Tokens(
      limit: {count: 50}
      limitBy: {count: 1, by: Token_Id}
      orderBy: {descending: [Volume_Usd]}
      where: {Interval: {Time: {Start: {since_relative: {days_ago: 1}}, Duration: {eq: 1}}}, Token: {NetworkBid: {is: "bid:robinhood"}}}
    ) {
      sum(of: Volume_Base)
      usd: sum(of: Volume_Usd)
      Token {
        Name
        Symbol
        Address
      }
      Supply {
        MarketCap
        FullyDilutedValuationUsd
      }
    }
  }
}
```

---

## Buy vs Sell Pressure for a Token

Gauge demand in one call: buy and sell USD volume, trade counts, and unique traders for a token over a window. Compute net flow client-side as `bought_usd − sold_usd`.

```graphql
{
  Trading {
    Trades(
      where: {
        Pair: {
          Token: { Address: { is: "0x9077841e155faaf4e4e89470822c2187eeef7777" } }
          Market: { NetworkBid: { is: "bid:robinhood" } }
        }
        Block: { Time: { since_relative: { days_ago: 1 } } }
      }
    ) {
      bought_usd: sum(of: AmountsInUsd_Base, if: { Side: { is: "Buy" } })
      sold_usd: sum(of: AmountsInUsd_Base, if: { Side: { is: "Sell" } })
      buys: count(if: { Side: { is: "Buy" } })
      sells: count(if: { Side: { is: "Sell" } })
      traders: uniq(of: Trader_Address)
    }
  }
}
```

---

## Most Active Pools on Robinhood

Rank pools by trade count over the last day, with USD volume and unique traders per pool. Trade count is a more robust ranking key than USD volume, which can be inflated to absurd values on thin meme pools — treat extreme `volume_usd` readings as suspect.

```graphql
{
  Trading {
    Trades(
      limit: { count: 20 }
      orderBy: { descendingByField: "trades" }
      where: {
        Pair: { Market: { NetworkBid: { is: "bid:robinhood" } } }
        Block: { Time: { since_relative: { days_ago: 1 } } }
      }
    ) {
      Pair {
        Pool {
          Address
        }
        Market {
          Protocol
        }
        Token {
          Symbol
          Address
        }
        QuoteToken {
          Symbol
        }
      }
      trades: count
      volume_usd: sum(of: AmountsInUsd_Base)
      traders: uniq(of: Trader_Address)
    }
  }
}
```

---

## Price Watchlist: Latest Price for Multiple Tokens

One latest price per token in a single call — `limitBy` on `Token_Id` keeps the newest 1-second interval for each token in the list. `Interval.Time.End` doubles as a staleness indicator: it is the last time that token actually traded.

```graphql
{
  Trading {
    Tokens(
      limit: { count: 10 }
      limitBy: { by: Token_Id, count: 1 }
      orderBy: { descending: Interval_Time_End }
      where: {
        Token: {
          Address: {
            in: [
              "0x9077841e155faaf4e4e89470822c2187eeef7777"
              "0xaf81aa091665c60cfa172f86a5a8d6b437a79353"
            ]
          }
          NetworkBid: { is: "bid:robinhood" }
        }
        Interval: { Time: { Duration: { eq: 1 } } }
      }
    ) {
      Token {
        Symbol
        Address
      }
      Price {
        Ohlc {
          Close
        }
      }
      Interval {
        Time {
          End
        }
      }
    }
  }
}
```

---

## Check the Trading Data Window

Don't guess how far back Trading data reaches — ask for the earliest available trade.

```graphql
{
  Trading {
    Trades(
      limit: { count: 1 }
      orderBy: { ascending: Block_Time }
      where: { Pair: { Market: { NetworkBid: { is: "bid:robinhood" } } } }
    ) {
      Block {
        Time
      }
    }
  }
}
```

---

## FAQ

### How do I stream Robinhood trades in real time?

Run a GraphQL `subscription` on `Trading.Trades` filtered by `Pair.Market.NetworkBid: "bid:robinhood"`. Every matching trade is pushed to your client as it is indexed. Any query on this page can be turned into a stream by switching the operation to `subscription`.

### What is the difference between `NetworkBid` and `Network`?

Both scope results to Robinhood. `NetworkBid: "bid:robinhood"` is the indexed identifier and is faster; `Network: "Robinhood"` is the human-readable equivalent. Prefer `NetworkBid` in filters.

### How do I get the current price of a Robinhood token?

Use `Trading.Tokens` for the USD-normalised, pool-weighted price, or `Trading.Pairs` when you need the price on a specific pool.

### Can I get OHLCV / candlestick data for Robinhood tokens?

Yes. Query `Trading.Tokens` or `Trading.Pairs` with an `Interval.Time.Duration` in seconds — from 1 second up to a maximum of 3600 (1 hour) per candle.

### How far back does Robinhood trade data go?

The Trading APIs cover real-time data and roughly the last 30 days — for newer networks, data starts when Bitquery indexing began. Measure the exact coverage with the [window query](#check-the-trading-data-window). For older history, use the chain-level `DEXTrades` / `DEXTradeByTokens` APIs.

### How do I measure buy vs sell pressure for a Robinhood token?

Aggregate `Trading.Trades` with conditional sums — `sum(of: AmountsInUsd_Base, if: {Side: {is: "Buy"}})` versus the `Sell` side — over your window, and compare. See [Buy vs Sell Pressure](#buy-vs-sell-pressure-for-a-token).
