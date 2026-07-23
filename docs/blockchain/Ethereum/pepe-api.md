---
title: "PEPE Coin API"
description: "Get real-time and historical on-chain data for PEPE coin on Ethereum — OHLCV price feeds, whale transfers, DEX volume, top buyers and sellers, and holder rankings using Bitquery's GraphQL API."
keywords: ["PEPE API", "PEPE coin API", "PEPE on-chain data", "PEPE price API", "PEPE OHLCV", "PEPE whale tracker", "PEPE DEX trades", "PEPE holder API", "Ethereum memecoin API", "PEPE GraphQL", "PEPE market cap API", "PEPE trading API"]
---
# PEPE Coin API

Query real-time and historical on-chain data for [PEPE](https://explorer.bitquery.io/ethereum/token/0x6982508145454ce325ddbe47a25d4ec3d2311933), a popular ERC-20 memecoin on Ethereum. All examples below target PEPE's contract address: `0x6982508145454ce325ddbe47a25d4ec3d2311933`.

---

## Real Time PEPE Trades Stream

Every PEPE DEX trade as it is confirmed on-chain in real time using Bitquery subscription.

[Run In IDE ➤](https://ide.bitquery.io/pepe-live-trades-stream)

```graphql
subscription {
  EVM(network: eth) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: {
            SmartContract: { is: "0x6982508145454ce325ddbe47a25d4ec3d2311933" }
          }
        }
      }
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
      }
      Trade {
        AmountInUSD
        Price
        Side {
          Type
          AmountInUSD
          Currency { Symbol }
        }
        Buyer
        Seller
        Dex {
          ProtocolName
          SmartContract
        }
        Currency { Symbol }
      }
    }
  }
}
```

---

## Real Time PEPE OHLCV Stream

Stream live PEPE price data with 1-minute candles, moving averages, and USD volume.

> Note: `Volume: { Usd: { gt: 5 } }` is included to filter outlier ticks; the stream already pre-filters outliers—this is an additional check.

[Run In IDE ➤](https://ide.bitquery.io/pepe-ohlcv-stream)

```graphql
subscription {
  Trading {
    Tokens(
      where: {
        Token: {
          Address: { is: "0x6982508145454ce325ddbe47a25d4ec3d2311933" }
        }
        Interval: { Time: { Duration: { eq: 60 } } }
        Volume: { Usd: { gt: 5 } }
      }
    ) {
      Token {
        Symbol
        Name
        Network
        Address
      }
      Block {
        Time
        Timestamp
      }
      Interval {
        Time {
          Start
          Duration
          End
        }
      }
      Price {
        IsQuotedInUsd
        Ohlc {
          Open
          High
          Low
          Close
        }
        Average {
          Mean
          SimpleMoving
          WeightedSimpleMoving
          ExponentialMoving
        }
      }
    }
  }
}
```

---

## Historical PEPE OHLCV (Last 30 Days)

Fetch hourly OHLCV candles for the past 30 days. Change `Duration` for different intervals, such as 60 (1 minute) or 300 (5 minutes).

[Run In IDE ➤](https://ide.bitquery.io/pepe-historical-ohlcv-30days)

```graphql
{
  Trading {
    Tokens(
      where: {
        Token: {
          Address: { is: "0x6982508145454ce325ddbe47a25d4ec3d2311933" }
        }
        Interval: { Time: { Duration: { eq: 3600 } } }
        Volume: { Usd: { gt: 5 } }
        Block: { Time: { since_relative: { days_ago: 30 } } }
      }
      limit: { count: 1000 }
      orderBy: { descending: Interval_Time_Start }
    ) {
      Interval {
        Time {
          Start
          End
          Duration
        }
      }
      Price {
        IsQuotedInUsd
        Ohlc {
          Open
          High
          Low
          Close
        }
        Average {
          Mean
          ExponentialMoving
          SimpleMoving
        }
      }
      Volume {
        Usd
      }
    }
  }
}
```

---
<!-- 
## PEPE Price on Uniswap V3

Get OHLCV data scoped to a specific PEPE pair on Uniswap v3, which turns out useful when you need DEX-level price isolation rather than an aggregated index.

> Note: `Volume: { Usd: { gt: 5 } }` is included to filter outlier ticks.

[Run In IDE ➤](https://ide.bitquery.io/pepe-uniswap-v3-ohlc-stream)

```graphql
subscription {
  Trading {
    Pairs(
      where: {
        Currency: {
          SmartContract: { is: "0x6982508145454ce325ddbe47a25d4ec3d2311933" }
        }
        Market: {
          Network: { is: "Ethereum" }
          Protocol: { is: "Uniswap v3" }
        }
        Interval: { Time: { Duration: { eq: 60 } } }
        Volume: { Usd: { gt: 5 } }
      }
    ) {
      Market {
        Name
        Protocol
        Address
        Network
      }
      Token {
        Symbol
        Address
      }
      QuoteToken {
        Symbol
        Address
      }
      Price {
        IsQuotedInUsd
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
    }
  }
}
```

---

## PEPE Price Change Percentage

Calculate 5-minute price change percentage, which can be useful for momentum signals in trading bots.

[Run In IDE ➤](https://ide.bitquery.io/pepe-price-change-percentage)

```graphql
{
  Trading {
    Tokens(
      where: {
        Currency: {
          SmartContract: { is: "0x6982508145454ce325ddbe47a25d4ec3d2311933" }
        }
        Price: { IsQuotedInUsd: true }
        Interval: { Time: { Duration: { eq: 300 } } }
        Volume: { Usd: { gt: 5 } }
      }
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
    ) {
      Block { Time }
      Price {
        Ohlc {
          Open
          Close
        }
      }
      diff: calculate(expression: "Price_Ohlc_Close - Price_Ohlc_Open")
      change: calculate(expression: "round(($diff / Price_Ohlc_Open), 4) * 100")
    }
  }
}
```

--- -->

## Monitor Whale Activities for PEPE in Real Time

Subscribe to PEPE transfers above 1 billion tokens the moment they hit the chain.

[Run In IDE ➤](https://ide.bitquery.io/pepe-whale-transfer-stream)

```graphql
subscription {
  EVM(network: eth) {
    Transfers(
      where: {
        Transfer: {
          Currency: {
            SmartContract: { is: "0x6982508145454ce325ddbe47a25d4ec3d2311933" }
          }
          Amount: { ge: "1000000000000" }
        }
      }
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
      }
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Currency {
          Symbol
        }
      }
    }
  }
}
```

---

<!-- ## Recent Whale Transfers (Historical)

Query the last 50 large PEPE transfers in the past 7 days.

[Run In IDE ➤](https://ide.bitquery.io/pepe-whale-transfers-historical)

```graphql
{
  EVM(network: eth) {
    Transfers(
      where: {
        Transfer: {
          Currency: {
            SmartContract: { is: "0x6982508145454ce325ddbe47a25d4ec3d2311933" }
          }
          Amount: { ge: "1000000000000" }
        }
        Block: { Time: { since_relative: { days_ago: 7 } } }
      }
      limit: { count: 50 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
      }
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
      }
    }
  }
}
```

---

## Whale Net Flow (Accumulation vs Distribution) -->

<!-- Aggregate inflows and outflows for a wallet over 30 days to determine whether it is accumulating or distributing PEPE.

[Run In IDE ➤](https://ide.bitquery.io/pepe-whale-net-flow)

```graphql
{
  EVM(network: eth) {
    received: Transfers(
      where: {
        Transfer: {
          Currency: {
            SmartContract: { is: "0x6982508145454ce325ddbe47a25d4ec3d2311933" }
          }
          Receiver: { is: "WALLET_ADDRESS_HERE" }
        }
        Block: { Time: { since_relative: { days_ago: 30 } } }
      }
    ) {
      totalReceived: sum(of: Transfer_AmountInUSD)
      count(of: Transaction_Hash)
    }
    sent: Transfers(
      where: {
        Transfer: {
          Currency: {
            SmartContract: { is: "0x6982508145454ce325ddbe47a25d4ec3d2311933" }
          }
          Sender: { is: "WALLET_ADDRESS_HERE" }
        }
        Block: { Time: { since_relative: { days_ago: 30 } } }
      }
    ) {
      totalSent: sum(of: Transfer_AmountInUSD)
      count(of: Transaction_Hash)
    }
  }
}
```

--- -->

## Latest Trading Volume and Market Cap for PEPE

This query provides the latest trade volume for the past one hour along with the latest market cap.

[Run In IDE ➤](https://ide.bitquery.io/pepe-volume-marketcap)

```graphql
 {
  Trading {
    Tokens(
      where: {
        Token: {
          Address: { is: "0x6982508145454ce325ddbe47a25d4ec3d2311933" }
        }
        Interval: { Time: { Duration: { eq: 3600 } } }
      }
      orderBy: {descending: Interval_Time_End}
      limit: {count: 1}
    ) {
      Interval{
        Time{
          Start
          End
        }
      }
      Price {
        Ohlc { Close }
      }
      Volume {
        Usd
        Base
        Quote
      }
      Supply {
        TotalSupply
        MarketCap
        FullyDilutedValuationUsd
      }
    }
  }
}
```

---

## PEPE Volume by DEX (Last 24 Hours)

Break down PEPE trading volume across all DEXs.

[Run In IDE ➤](https://ide.bitquery.io/pepe-volume-by-dex)

```graphql
{
  EVM(network: eth) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: {
            SmartContract: { is: "0x6982508145454ce325ddbe47a25d4ec3d2311933" }
          }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      orderBy: { descendingByField: "volumeUsd" }
    ) {
      Trade {
        Dex {
          ProtocolName
          ProtocolFamily
          SmartContract
        }
      }
      volumeUsd: sum(of: Trade_AmountInUSD)
      tradeCount: count(of: Transaction_Hash)
    }
  }
}
```

---

## Historical Daily Volume for 30 Days

The below query returns the daily trading volume for the past 30 days.

[Run In IDE ➤](https://ide.bitquery.io/pepe-daily-volume-30days)

```graphql
query MyQuery {
  Trading {
    Trades(
      where: {
        Block: {Time: {since_relative: {days_ago: 30}}}, 
        Pair: {Token: {Address: {is: "0x6982508145454ce325ddbe47a25d4ec3d2311933"}}}
      }
      orderBy: {ascending: Block_Date}
    ) {
      Block{ Date }
      volume: sum(of: AmountsInUsd_Base)
      trades: count
      traders: uniq(of: Trader_Address)
    }
  }
}
```

---

<!-- ## PEPE Volume Across All Active Pairs (Real-Time)

Monitor volume across PEPE/WETH, PEPE/USDC, and all other active pairs simultaneously.

> Note: `Volume: { Usd: { gt: 5 } }` is included to filter outlier ticks.

[Run In IDE ➤](https://ide.bitquery.io/pepe-all-pairs-volume-stream)

```graphql
subscription {
  Trading {
    Pairs(
      where: {
        Currency: {
          SmartContract: { is: "0x6982508145454ce325ddbe47a25d4ec3d2311933" }
        }
        Interval: { Time: { Duration: { eq: 60 } } }
        Volume: { Usd: { gt: 5 } }
      }
    ) {
      Market {
        Name
        Protocol
        Network
        Address
      }
      Token { Symbol Address }
      QuoteToken { Symbol Address }
      Volume {
        Base
        Quote
        Usd
      }
      Supply {
        MarketCap
        FullyDilutedValuationUsd
      }
      Price {
        Ohlc { Close }
      }
    }
  }
}
```

---
 -->

## Top PEPE Buyers for Last 24 Hours

Rank wallets by total USD spent buying PEPE.

[Run In IDE ➤](https://ide.bitquery.io/pepe-top-buyers-24h)

```graphql
query MyQuery {
  Trading {
    Trades(
      where: {
        Block: {Time: {since_relative: {hours_ago: 24}}},
        Pair: {Token: {Address: {is: "0x6982508145454ce325ddbe47a25d4ec3d2311933"}}}, 
        Side: {is: "Buy"}
      }
      limit: {count: 20}
      orderBy: {descendingByField: "volume"}
    ) {
      Trader {
        Address
      }
      volume: sum(of: AmountsInUsd_Base)
      trades: count
    }
  }
}
```

---

## Top PEPE Sellers for Last 24 Hours

Rank wallets by total USD value of PEPE sold.

[Run In IDE ➤](https://ide.bitquery.io/pepe-top-sellers-24h)

```graphql
query MyQuery {
  Trading {
    Trades(
      where: {
        Block: {Time: {since_relative: {hours_ago: 24}}},
        Pair: {Token: {Address: {is: "0x6982508145454ce325ddbe47a25d4ec3d2311933"}}}, 
        Side: {is: "Sell"}
      }
      limit: {count: 20}
      orderBy: {descendingByField: "volume"}
    ) {
      Trader {
        Address
      }
      volume: sum(of: AmountsInUsd_Base)
      trades: count
    }
  }
}
```

---

<!-- ## Largest Single PEPE Trades (Last 24 Hours)

Spot the biggest individual trades by USD size — useful for identifying smart money entries and exits.

[Run In IDE ➤](https://ide.bitquery.io/pepe-largest-trades-24h)

```graphql
{
  EVM(network: eth) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: {
            SmartContract: { is: "0x6982508145454ce325ddbe47a25d4ec3d2311933" }
          }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      limit: { count: 20 }
      orderBy: { descending: Trade_AmountInUSD }
    ) {
      Block { Time }
      Transaction { Hash }
      Trade {
        AmountInUSD
        Price
        Side {
          Type
          Currency { Symbol }
          AmountInUSD
        }
        Buyer
        Seller
        Dex { ProtocolName }
      }
    }
  }
}
```

---
 -->

## PEPE Top Holders by Balance

[Run In IDE ➤](https://ide.bitquery.io/pepe-top-holders_3)

```graphql
query MyQuery {
  Trading {
    Trades(
      where: {
        Pair: {Token: {Address: {is: "0x6982508145454ce325ddbe47a25d4ec3d2311933"}}}, 
      }
      limit: {count: 20}
      orderBy: {descendingByField: "holdings"}
    ) {
      Trader {
        Address
      }
      buy_volume: sum(of: AmountsInUsd_Base if: {Side: {is: "Buy"}})
      sell_volume: sum(of: AmountsInUsd_Base if: {Side: {is: "Sell"}})
      holdings: calculate(expression: "$buy_volume - $sell_volume")
      trades: count
    }
  }
}
```

---

<!-- ## PEPE Total Holder Count (Snapshot)

Check how many unique wallets hold PEPE at a given date. Change the `snapshot` date to compare across time.

[Run In IDE ➤](https://ide.bitquery.io/pepe-holder-count-snapshot)

```graphql
{
  EVM(network: eth) {
    TokenHolders(
      tokenSmartContract: "0x6982508145454ce325ddbe47a25d4ec3d2311933"
      snapshot: "2026-05-01"
    ) {
      count(of: Holder_Address, distinct: true)
    }
  }
}
```

---

## Wallet PEPE Balance Lookup

Check the current PEPE balance of any specific wallet.

[Run In IDE ➤](https://ide.bitquery.io/pepe-wallet-balance)

```graphql
{
  EVM(network: eth) {
    TokenHolders(
      tokenSmartContract: "0x6982508145454ce325ddbe47a25d4ec3d2311933"
      where: {
        Holder: { Address: { is: "WALLET_ADDRESS_HERE" } }
      }
    ) {
      Holder {
        Address
      }
      Balance {
        Amount
      }
    }
  }
}
```

---

## New Wallets and Trader Engagement

Signals for new buyers and day-to-day trader breadth on PEPE.

## First-Time PEPE Buyers (Last 24 Hours)

Identify wallets buying PEPE for the first time — a signal for new retail adoption.

[Run In IDE ➤](https://ide.bitquery.io/pepe-first-time-buyers)

```graphql
{
  EVM(network: eth) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: {
            SmartContract: { is: "0x6982508145454ce325ddbe47a25d4ec3d2311933" }
          }
          Side: { Type: { is: buy } }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      orderBy: { ascending: Block_Time }
      limitBy: { by: Trade_Buyer, count: 1 }
    ) {
      Block { Time }
      Trade {
        Buyer
        AmountInUSD
        Dex { ProtocolName }
      }
    }
  }
}
```

---

## Unique Daily Traders (Last 7 Days)

Track unique buyers and sellers per day — a measure of market breadth and community engagement.

[Run In IDE ➤](https://ide.bitquery.io/pepe-unique-traders-7days)

```graphql
{
  EVM(network: eth) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: {
            SmartContract: { is: "0x6982508145454ce325ddbe47a25d4ec3d2311933" }
          }
        }
        Block: { Time: { since_relative: { days_ago: 7 } } }
      }
      orderBy: { ascending: Block_Date }
    ) {
      Block {
        Date
      }
      uniqueBuyers: count(of: Trade_Buyer, distinct: true)
      uniqueSellers: count(of: Trade_Seller, distinct: true)
      tradeCount: count(of: Transaction_Hash)
      volumeUsd: sum(of: Trade_AmountInUSD)
    }
  }
}
```

--- -->
