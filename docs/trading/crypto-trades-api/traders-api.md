---
title: "Traders API — Real-Time Wallet Trade Streams"
description: "Stream real-time wallet trades with Bitquery Traders API. Track specific wallets, monitor multiple addresses, detect whale trades, filter by token/pair/DEX/chain, rank top traders by volume or PnL, and aggregate wallet PnL across Solana, Ethereum & BSC via GraphQL."
keywords:
  - traders API
  - wallet trade tracking API
  - real-time wallet trades stream
  - copy trading API Solana
  - whale trader alerts API
  - smart money tracking crypto
  - multi-wallet monitoring subscription
  - track wallet trades GraphQL
  - Solana trader API Bitquery
  - Ethereum wallet trade history
  - BSC top traders API
  - wallet DEX trade filter
  - top traders by trade count
  - trader PnL GraphQL query
  - top traders by PnL API
  - crypto wallet activity feed
---

# Traders API — Real-Time Wallet Trade Streams

> **Bitquery Traders API** lets you **stream wallet trades in real time** across **Solana**, **Ethereum**, **BSC**, **Base**, and **Arbitrum** . You can track a **single wallet** or **multiple addresses**, detect **whale trades** above a USD threshold, filter by **token**, **pair**, **DEX program**, or **chain**, rank **top traders by volume** or **PnL**, and aggregate **buy/sell USD** with **`sum`**, **`calculate`**, **`limitBy`**, and **`orderBy`** using **GraphQL subscriptions** and **queries**.

This page focuses on **trader/wallet-centric** queries using the unified **Trading** schema. For trade-level streaming (by token, pair, chain, or DEX), see the **[Trades API](https://docs.bitquery.io/docs/trading/crypto-trades-api/trades-api)**.

## Video Tutorial

import VideoPlayer from "../../../src/components/videoplayer.js";

<VideoPlayer url="https://youtu.be/-Jwh2I46XIw" />

---

## How Do I Stream All Trades for a Specific Wallet?

> Subscribe to **every DEX trade** a wallet executes in **real time** across all supported chains — captures **buys and sells** across all tokens and DEXs, returning **token pair**, **USD amounts**, **market cap**, **supply**, **pool**, and **transaction metadata**. Useful for **copy trading bots**, **whale watching**, and **wallet activity feeds**.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/All-trades-of-a-trader).

```graphql
subscription {
  Trading {
    Trades(
      where: {
        Trader: {
          Address: { is: "GWcAopUZKokUUQAMDrNzd1YVHLJqbzJomu2pzNqLe9U3" }
        }
      }
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
        Pool {
          Address
        }
        Market {
          Address
          Program
          Network
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

---

## How Do I Track a Wallet's Trades on a Specific Token?

> Filter a wallet's trade stream to a **single token** — combines **`Trader.Address`** with **`any`** on **`Pair.Token.Id`** and **`Pair.QuoteToken.Id`** so the token is matched whether it appears on the base or quote side of the pair. Returns **side**, **USD amounts**, **market cap**, **supply**, and **pool** for every trade — useful for **position tracking**, **entry/exit analysis**, and **per-token wallet stats**.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/trades-of-a-specific-trader-of-a-specific-token_1).

```graphql
subscription {
  Trading {
    Trades(
      where: {
        any: [
          {
            Pair: {
              Token: {
                Id: {
                  is: "bid:solana:4YiLHDR4B4pE4R5GUMA8HG8YunyeLwcobtEtvwMupump"
                }
              }
            }
          }
          {
            Pair: {
              QuoteToken: {
                Id: {
                  is: "bid:solana:4YiLHDR4B4pE4R5GUMA8HG8YunyeLwcobtEtvwMupump"
                }
              }
            }
          }
        ]
        Pair: { Market: { Network: { is: "Solana" } } }
        Trader: {
          Address: { is: "GWcAopUZKokUUQAMDrNzd1YVHLJqbzJomu2pzNqLe9U3" }
        }
      }
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
        Pool {
          Address
        }
        Market {
          Address
          Program
          Network
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

---

## How Do I Monitor Multiple Wallets in One Subscription?

> Watch **multiple wallets** in a **single real-time subscription** using the **`in`** operator on **`Trader.Address`** — captures every buy and sell across all tokens for your entire watchlist. Ideal for **copy trading dashboards**, **fund monitoring**, and **whale group tracking**.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/How-do-I-monitor-multiple-wallets-in-one-subscription).

```graphql
subscription {
  Trading {
    Trades(
      where: {
        Trader: {
          Address: {
            in: [
              "GWcAopUZKokUUQAMDrNzd1YVHLJqbzJomu2pzNqLe9U3"
              "7eWHXZefGY98o9grrrt1Z3j7DcPDEhA4UviQ1pVNhTXX"
              "6LNdbvyb11JH8qxAsJoPSfkwK4zJDQKQ6LNp4mxt8VpR"
            ]
          }
        }
      }
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
        Pool {
          Address
        }
        Market {
          Address
          Program
          Network
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

---

## How Do I Stream a Wallet's Trades on a Specific Chain?

> Filter a wallet's real-time trade stream to a **single chain** (e.g. Solana, Ethereum, BSC) by combining **`Trader.Address`** with **`Pair.Market.Network`**. Returns every swap the wallet executes on that chain with **side**, **USD amounts**, **market cap**, **pool**, and **transaction details**.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/How-do-I-stream-a-wallets-trades-on-a-specific-chain).

```graphql
subscription {
  Trading {
    Trades(
      where: {
        Pair: { Market: { Network: { is: "Solana" } } }
        Trader: {
          Address: { is: "GWcAopUZKokUUQAMDrNzd1YVHLJqbzJomu2pzNqLe9U3" }
        }
      }
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
        Pool {
          Address
        }
        Market {
          Address
          Program
          Network
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

Change `Network` to `"Ethereum"`, `"Binance Smart Chain"`, `"Base"`, `"Arbitrum"`, etc. for other chains.

---

## How Do I Detect Whale Traders in Real Time?

> Stream **large trades** above a **USD threshold** across all chains — each event includes the **trader wallet address**, **token pair**, **USD amounts**, **market cap**, **pool**, and **transaction details**. Use for **whale alert bots**, **smart money feeds**, and **large-order flow monitoring**.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/Stream---Trades-over-100k-usd).

```graphql
subscription {
  Trading {
    Trades(where: { AmountsInUsd: { Base: { gt: 100000 } } }) {
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
        Pool {
          Address
        }
        Market {
          Address
          Program
          Network
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

Adjust the `gt` threshold — e.g. `10000` for $10K+, `1000000` for $1M+ trades.

---

## How Do I Stream Whale Trades for a Specific Wallet?

> Combine **wallet address** and **USD amount threshold** to stream only **large trades** by a specific wallet — useful for tracking when a **known whale** or **smart money wallet** makes a significant move above your chosen USD value.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/How-do-I-stream-whale-trades-for-a-specific-wallet).

```graphql
subscription {
  Trading {
    Trades(
      where: {
        Trader: {
          Address: { is: "GWcAopUZKokUUQAMDrNzd1YVHLJqbzJomu2pzNqLe9U3" }
        }
        AmountsInUsd: { Base: { gt: 10000 } }
      }
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
        Pool {
          Address
        }
        Market {
          Address
          Program
          Network
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

---

## How Do I Get Recent Trades for a Wallet (Last 10 Minutes)?

> Query a wallet's **most recent trades** using **`Block.Time.since_relative`** — returns trades sorted by **most recent first** with **side**, **USD amounts**, **market cap**, **pool**, and **token pair**. Ideal for building **wallet activity feeds**, **recent trades tables**, and **portfolio dashboards**.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/How-do-I-get-recent-trades-for-a-wallet-last-10-minutes).

```graphql
{
  Trading {
    Trades(
      orderBy: { descending: Block_Time }
      where: {
        Block: { Time: { since_relative: { minutes_ago: 10 } } }
        Trader: {
          Address: { is: "GWcAopUZKokUUQAMDrNzd1YVHLJqbzJomu2pzNqLe9U3" }
        }
      }
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
        Pool {
          Address
        }
        Market {
          Address
          Program
          Network
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

---

## How Do I Monitor Multiple Wallets Trading a Specific Token?

> Combine a **wallet watchlist** with a **token filter** using the **`any`** combinator on **`Pair.Token.Id`** and **`Pair.QuoteToken.Id`** — captures trades where any of the watched wallets swap the token on either side of the pair. Ideal for **tracking smart money positions on a token**, **coordinated trading detection**, and **group wallet analysis**.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/How-do-I-monitor-multiple-wallets-trading-a-specific-token).

```graphql
subscription {
  Trading {
    Trades(
      where: {
        Trader: {
          Address: {
            in: [
              "GWcAopUZKokUUQAMDrNzd1YVHLJqbzJomu2pzNqLe9U3"
              "7eWHXZefGY98o9grrrt1Z3j7DcPDEhA4UviQ1pVNhTXX"
            ]
          }
        }
        any: [
          {
            Pair: {
              Token: {
                Id: {
                  is: "bid:solana:4YiLHDR4B4pE4R5GUMA8HG8YunyeLwcobtEtvwMupump"
                }
              }
            }
          }
          {
            Pair: {
              QuoteToken: {
                Id: {
                  is: "bid:solana:4YiLHDR4B4pE4R5GUMA8HG8YunyeLwcobtEtvwMupump"
                }
              }
            }
          }
        ]
      }
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
        Pool {
          Address
        }
        Market {
          Address
          Program
          Network
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

---

## How Do I Stream a Wallet's Trades on a Specific DEX?

> Filter a wallet's trade stream to a **specific DEX program** (e.g. Raydium, PumpSwap, PancakeSwap) by combining **`Trader.Address`** with **`Pair.Market.Program`**. Useful for understanding **which DEXs a wallet prefers**, **protocol-level analytics**, and **DEX-specific copy trading**.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/How-do-I-stream-a-wallets-trades-on-a-specific-DEX).

```graphql
subscription {
  Trading {
    Trades(
      where: {
        Trader: {
          Address: { is: "GWcAopUZKokUUQAMDrNzd1YVHLJqbzJomu2pzNqLe9U3" }
        }
        Pair: {
          Market: {
            Program: { is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA" }
          }
        }
      }
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
        Pool {
          Address
        }
        Market {
          Address
          Program
          Network
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

Change the `Program` address to target different DEXs — e.g. `6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P` for Pump.fun.

---

## How Do I Get a Wallet's Trades on a Specific Pair?

> Filter a wallet's trades to a **specific token pair** (e.g. WSOL/USDC) by combining **`Trader.Address`**, **`Pair.Token.Id`**, and **`Pair.QuoteToken.Id`** — captures every swap the wallet makes between those two tokens **across all pools and DEXs**. Useful for **pair-level position tracking** and **per-pair PnL**.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/How-do-I-get-a-wallets-trades-on-a-specific-pair).

```graphql
subscription {
  Trading {
    Trades(
      where: {
        Trader: {
          Address: { is: "GWcAopUZKokUUQAMDrNzd1YVHLJqbzJomu2pzNqLe9U3" }
        }
        Pair: {
          Token: {
            Id: { is: "bid:solana:So11111111111111111111111111111111111111112" }
          }
          QuoteToken: {
            Id: {
              is: "bid:solana:EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
            }
          }
        }
      }
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
        Pool {
          Address
        }
        Market {
          Address
          Program
          Network
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

---

## Who Are the Top Traders on Solana by Trade Count in the Last Hour?

> Rank up to **100** **Solana** wallets in the last **hour** by **trade count**, with **total quoted USD volume**, **per-side buy/sell volume**, and **buy/sell trade counts**. Useful for **activity leaderboards**, **bot detection**, and **comparing aggressive buyers vs sellers**.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/Most-active-traders-by-trade-count#).

```graphql
{
  Trading {
    Trades(
      limit: { count: 100 }
      orderBy: [{ descendingByField: "Trades_count" }]
      where: {
        Block: { Time: { since_relative: { hours_ago: 1 } } }
        Pair: { Market: { Network: { is: "Solana" } } }
      }
    ) {
      Trades_count: count
      Total_Volume: sum(of: AmountsInUsd_Quote)
      buy_volume: sum(of: AmountsInUsd_Quote, if: { Side: { is: "Buy" } })
      sell_volume: sum(of: AmountsInUsd_Quote, if: { Side: { is: "Sell" } })
      buys: count(if: { Side: { is: "Buy" } })
      sells: count(if: { Side: { is: "Sell" } })
      Trader {
        Address
      }
    }
  }
}
```

---

## How do I rank whale traders on Solana by total USD volume (last hour)?

> Same **one-hour Solana** window as above, but ordered by **`Total_Volume`** (quoted USD) so the **largest notional traders** surface first — still includes **trade count** and **buy vs sell** split.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/Whales-traders-by-total-USD-volume_1).

```graphql
{
  Trading {
    Trades(
      limit: { count: 100 }
      orderBy: [{ descendingByField: "Total_Volume" }]
      where: {
        Block: { Time: { since_relative: { hours_ago: 1 } } }
        Pair: { Market: { Network: { is: "Solana" } } }
      }
    ) {
      Trades_count: count
      Total_Volume: sum(of: AmountsInUsd_Quote)
      buy_volume: sum(of: AmountsInUsd_Quote, if: { Side: { is: "Buy" } })
      sell_volume: sum(of: AmountsInUsd_Quote, if: { Side: { is: "Sell" } })
      buys: count(if: { Side: { is: "Buy" } })
      sells: count(if: { Side: { is: "Sell" } })
      Trader {
        Address
      }
    }
  }
}
```

---

## How do I find traders on Solana who only bought (no sells) in the last hour?

> Lists wallets with **`sells: 0`** in the last hour on **Solana** (only **Buy** side trades), ordered by **total quoted USD volume**. Adjust the window or network in **`where`** for other scopes.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/Traders-who-only-buys#).

```graphql
{
  Trading {
    Trades(
      limit: { count: 100 }
      orderBy: [{ descendingByField: "Total_Volume" }]
      where: {
        Block: { Time: { since_relative: { hours_ago: 1 } } }
        Pair: { Market: { Network: { is: "Solana" } } }
      }
    ) {
      Trades_count: count
      Total_Volume: sum(of: AmountsInUsd_Quote)
      buy_volume: sum(of: AmountsInUsd_Quote, if: { Side: { is: "Buy" } })
      sell_volume: sum(of: AmountsInUsd_Quote, if: { Side: { is: "Sell" } })
      buys: count(if: { Side: { is: "Buy" } })
      sells: count(if: { Side: { is: "Sell" } }, selectWhere: { eq: "0" })
      Trader {
        Address
      }
    }
  }
}
```

---

## How do I find traders on Solana who only sold (no buys) in the last hour?

> Lists wallets with **`buys: 0`** (only **Sell** side trades) in the same window. Pair with the **only buy** query to study **one-sided flow**.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/Traders-who-only-sells_1#).

```graphql
{
  Trading {
    Trades(
      limit: { count: 100 }
      orderBy: [{ descendingByField: "Total_Volume" }]
      where: {
        Block: { Time: { since_relative: { hours_ago: 1 } } }
        Pair: { Market: { Network: { is: "Solana" } } }
      }
    ) {
      Trades_count: count
      Total_Volume: sum(of: AmountsInUsd_Quote)
      buy_volume: sum(of: AmountsInUsd_Quote, if: { Side: { is: "Buy" } })
      sell_volume: sum(of: AmountsInUsd_Quote, if: { Side: { is: "Sell" } })
      buys: count(if: { Side: { is: "Buy" } }, selectWhere: { eq: "0" })
      sells: count(if: { Side: { is: "Sell" } })
      Trader {
        Address
      }
    }
  }
}
```

---

## How do I list pools a wallet traded on Solana (last hour)?

> For a fixed **`Trader.Address`**, aggregate up to **100** **pools** by **trade count** with **volume** and **buy/sell** breakdown per pool. Replace the sample address with any wallet you track.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/Trader-interacted-with-these-tokens).

```graphql
{
  Trading {
    Trades(
      limit: { count: 100 }
      orderBy: [{ descendingByField: "Trades_count" }]
      where: {
        Block: { Time: { since_relative: { hours_ago: 1 } } }
        Pair: { Market: { Network: { is: "Solana" } } }
        Trader: {
          Address: { is: "2amy6YiYin3s49MEnXNA6ASDDnrrvhjMTd4WF59LJXBu" }
        }
      }
    ) {
      Trades_count: count
      Total_Volume: sum(of: AmountsInUsd_Quote)
      buy_volume: sum(of: AmountsInUsd_Quote, if: { Side: { is: "Buy" } })
      sell_volume: sum(of: AmountsInUsd_Quote, if: { Side: { is: "Sell" } })
      buys: count(if: { Side: { is: "Buy" } })
      sells: count(if: { Side: { is: "Sell" } })
      Trader {
        Address
      }
      Pair {
        Pool {
          Address
        }
        Market {
          Address
          Program
          Network
          Protocol
          ProtocolFamily
        }
        Token {
          Name
          Symbol
          Address
          Id
          IsNative
          TokenId
          Network
        }
        QuoteToken {
          Name
          Symbol
          Address
          Id
          IsNative
          TokenId
          Network
        }
      }
    }
  }
}
```

---

## How do I calculate a wallet's PnL for a specific token (last 30 minutes)?

> Aggregate **`Trades`** over **`Block.Time`** (last **30 minutes**) for one **`Pair.Token.Id`** and one **`Trader.Address`**. **`PnL`** is **`Amount_Sold − Amount_Bought`** on **`AmountsInUsd_Base`**; native sums use **`Amounts_Base`**. Useful for **short-window position PnL**, **per-wallet token performance**, and **trading dashboards**.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/Traders-PnL-for-the-last-30mins-for-a-specific-token#).

```graphql
{
  Trading {
    Trades(
      where: {
        Block: { Time: { since_relative: { minutes_ago: 30 } } }
        Pair: {
          Token: {
            Id: {
              is: "bid:solana:8xs8TCoAMJ4zj5aeXmrDP2BechGrXLMzVyMVBxfCpump"
            }
          }
        }
        Trader: {
          Address: { is: "QeHykJGZj6B2Syhi5a63t9oaLTwKXZqM4J5PjeZBWC2" }
        }
      }
    ) {
      Trader {
        Address
      }
      Amount_Bought: sum(of: AmountsInUsd_Base, if: { Side: { is: "Buy" } })
      Amount_Sold: sum(of: AmountsInUsd_Base, if: { Side: { is: "Sell" } })
      Amount_Bought_native: sum(of: Amounts_Base, if: { Side: { is: "Buy" } })
      Amount_Sold_native: sum(of: Amounts_Base, if: { Side: { is: "Sell" } })
      PnL: calculate(expression: "$Amount_Sold - $Amount_Bought")
      buys: count(if: { Side: { is: "Buy" } })
      sells: count(if: { Side: { is: "Sell" } })
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

---

## How Do I Rank Top Traders by PnL for a Specific Pool (Last 30 Minutes)?

> Rank traders by **`PnL`** on one pool: filter **`Pair.Market.Address`**, last **30 minutes**, **`limit: 10`**, and **`orderBy`** **`PnL`** descending. Useful for **leaderboards**, **smart-money screens**, and **pool-specific trader analytics**.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/Top-Traders-by-PnL-of-a-specific-pair#).

```graphql
{
  Trading {
    Trades(
      limit: { count: 10 }
      orderBy: [{ descendingByField: "PnL" }]
      where: {
        Block: { Time: { since_relative: { minutes_ago: 30 } } }
        Pair: {
          Market: {
            Address: { is: "2axyccPzS7Ei57c7ESEq7tBpo4HxtpfCR9gKxh5uNUpu" }
          }
        }
      }
    ) {
      Trader {
        Address
      }
      Amount_Bought: sum(of: AmountsInUsd_Base, if: { Side: { is: "Buy" } })
      Amount_Sold: sum(of: AmountsInUsd_Base, if: { Side: { is: "Sell" } })
      Amount_Bought_native: sum(of: Amounts_Base, if: { Side: { is: "Buy" } })
      Amount_Sold_native: sum(of: Amounts_Base, if: { Side: { is: "Sell" } })
      PnL: calculate(expression: "$Amount_Sold - $Amount_Bought")
      buys: count(if: { Side: { is: "Buy" } })
      sells: count(if: { Side: { is: "Sell" } })
    }
  }
}
```

---

## How Do I Rank Top Traders on Solana by PnL (Last 30 Minutes)?

> Across **Solana** pairs in the window, aggregate **one row per trader** with **`limitBy: {count: 1, by: Trader_Address}`**, then return the top **10** by **`PnL`**. Useful for **chain-wide PnL leaderboards** and **short-horizon trader rankings**.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/Top-Traders-on-Solana_2#).

```graphql
{
  Trading {
    Trades(
      limit: { count: 10 }
      limitBy: { count: 1, by: Trader_Address }
      orderBy: [{ descendingByField: "PnL" }]
      where: {
        Block: { Time: { since_relative: { minutes_ago: 30 } } }
        Pair: { Market: { Network: { is: "Solana" } } }
      }
    ) {
      Trader {
        Address
      }
      Amount_Bought: sum(of: AmountsInUsd_Base, if: { Side: { is: "Buy" } })
      Amount_Sold: sum(of: AmountsInUsd_Base, if: { Side: { is: "Sell" } })
      Amount_Bought_native: sum(of: Amounts_Base, if: { Side: { is: "Buy" } })
      Amount_Sold_native: sum(of: Amounts_Base, if: { Side: { is: "Sell" } })
      PnL: calculate(expression: "$Amount_Sold - $Amount_Bought")
      buys: count(if: { Side: { is: "Buy" } })
      sells: count(if: { Side: { is: "Sell" } })
    }
  }
}
```

---

## How do I rank traders paying the highest total transaction fees on Solana (last hour)?

> Ranks up to **100** wallets by **sum of `TransactionHeader.Fee`** over **Solana** **`Trades`** in the last hour (native fee units, e.g. **lamports** — convert with your own **SOL** price or decimals). Includes **trade count** and **quoted USD volume** for context.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/Traders-paying-the-highest-total-fees).

```graphql
{
  Trading {
    Trades(
      limit: { count: 100 }
      orderBy: [{ descendingByField: "Total_fees_paid_by_trader" }]
      where: {
        Block: { Time: { since_relative: { hours_ago: 1 } } }
        Pair: { Market: { Network: { is: "Solana" } } }
      }
    ) {
      Trades_count: count
      Total_fees_paid_by_trader: sum(of: TransactionHeader_Fee)
      Total_Volume: sum(of: AmountsInUsd_Quote)
      buy_volume: sum(of: AmountsInUsd_Quote, if: { Side: { is: "Buy" } })
      sell_volume: sum(of: AmountsInUsd_Quote, if: { Side: { is: "Sell" } })
      buys: count(if: { Side: { is: "Buy" } })
      sells: count(if: { Side: { is: "Sell" } })
      Trader {
        Address
      }
    }
  }
}
```

---

## Related APIs {#related-apis}

> Extend your **trader analytics** with these complementary Bitquery APIs — **trade streams**, **price data**, **market cap**, **OHLC**, and **chain-specific DEX** docs for deeper wallet and token analysis.

- **[Trades API](https://docs.bitquery.io/docs/trading/crypto-trades-api/trades-api)** — stream trades by token, pair, chain, DEX, or USD threshold (not wallet-filtered)
- **[Crypto MarketCap API](https://docs.bitquery.io/docs/trading/crypto-price-api/crypto-marketcap-api)** — USD market cap, FDV, and token supply data
- **[Crypto Price API](https://docs.bitquery.io/docs/trading/crypto-price-api/introduction)** — Tokens, Pairs, Currencies cubes and Kafka `trading.prices`
- **[OHLC / K-line API](https://docs.bitquery.io/docs/trading/crypto-price-api/crypto-ohlc-candle-k-line-api)** — candlestick and interval data for charting
- **[Solana DEX Trades](https://docs.bitquery.io/docs/blockchain/Solana/solana-dextrades)** — chain-level `DEXTrades` and `DEXTradeByTokens` with aggregation (top traders, PnL, first buyers)
- **[Solana Trader API](https://docs.bitquery.io/docs/blockchain/Solana/solana-trader-API)** — Solana-specific wallet queries with `DEXTradeByTokens` aggregation
- **[BSC DEX Trades](https://docs.bitquery.io/docs/blockchain/BSC/bsc-dextrades)** — BSC top traders by profit, first buyers, and per-wallet token stats
- **[Pump.fun API](https://docs.bitquery.io/docs/blockchain/Solana/Pumpfun/Pump-Fun-API)** — Pump.fun trades, bonding curve, top traders, and market cap
- **[PumpSwap API](https://docs.bitquery.io/docs/blockchain/Solana/Pumpfun/pump-swap-api)** — PumpSwap AMM trades, pools, and pricing
- **[gRPC Copy Trading Bot](https://docs.bitquery.io/docs/grpc/solana/examples/grpc-copy-trading-bot)** — low-latency CoreCast gRPC streaming for copy trading
