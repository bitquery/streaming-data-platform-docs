---
title: "Crypto Trades API — Real-Time DEX Trade Streams Across Chains"
description: "Stream real-time DEX trades with Bitquery Crypto Trades API. Get swap-level price, USD amounts, market cap, FDV & supply on Solana, Ethereum, BSC, Base & Arbitrum via GraphQL subscriptions."
keywords:
  - crypto trades API
  - real-time DEX trade stream
  - swap-level trade data API
  - Bitquery Trading Trades cube
  - Solana trade stream API
  - Ethereum DEX trades GraphQL
  - BSC trade stream API
  - multi-chain trade subscription
  - trader wallet trade history
  - token trade filter API
---

# Crypto Trades API — Real-Time DEX Trade Streams

> **Bitquery Crypto Trades API** streams **individual swap-level DEX trades** in **real time** across **Solana**, **Ethereum**, **BSC**, **Base**, **Arbitrum**, and **Polygon** — each row includes **price**, **USD amounts**, **market cap**, **FDV**, **supply**, **trader address**, and **transaction metadata** via **GraphQL subscriptions**.

The **Trades** cube streams individual **swap-level** rows from the **Trading** API: each event includes **side**, **amounts** (base, quote, USD), **price**, **pair** (market, tokens, currencies), **trader**, **transaction** metadata, and a **supply** snapshot (**MarketCap**, **FDV**, circulating/total/max supply) for the token context on that row.

For **aggregated** token metrics across all pairs, use the **[Tokens cube](/docs/trading/crypto-price-api/tokens)**. For **pair-level** OHLC and volume intervals, use the **[Pairs cube](/docs/trading/crypto-price-api/pairs)**. Supply field meanings are documented under **[Supply fields](/docs/trading/crypto-price-api/supply-fields)**.

### Key points

- **Subscriptions**: These examples use **`subscription`** for real-time streams; you can often run the same selection as a **`query`** with an added time window on **`Block`** / **`Interval`** where supported.
- **Networks**: Filter with **`Pair.Market.Network`** (e.g. **`Solana`**, **`Ethereum`**).
- **Token filter**: Use **`Pair.Token.Id`** with the full id (e.g. **`bid:solana:<mint>`**, **`bid:eth:<lowercase_contract>`**) per your dataset conventions.
- **Trader filter**: Use **`Trader.Address`** for the wallet executing the trade.
- **USD vs quote**: **`PriceInUsd`** and **`AmountsInUsd`** are in USD where indexed; see **[Price Index Algorithm](/docs/trading/crypto-price-api/price-index-algorithm)** for how amounts and prices are derived.

More patterns: **[Crypto Price API examples](/docs/trading/crypto-price-api/examples)**.

---

## How do I stream new DEX trades across all chains in real time?

> *Real-time* **multi-chain DEX trade stream** — subscribe to every new swap on **Solana**, **Ethereum**, **BSC**, **Base**, **Arbitrum**, and **Polygon** in a single **GraphQL subscription**. Each event returns **price**, **USD amounts**, **market cap**, **supply**, **trader wallet**, and **transaction hash** the moment a trade is confirmed on-chain.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/all-chains-New-Trades-Stream---Solana-eth-bsc-base--arbitrum-matic_2#).

```graphql
subscription {
  Trading {
    Trades {
      Side
      Supply {
        MaxSupply
        TotalSupply
        FullyDilutedValuationUsd
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
        Hash
        Index
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
      Price
      PriceInUsd
    }
  }
}
```

---

## How do I get all DEX trades on Solana with price, market cap, and supply?

> Stream **all Solana DEX trades** in real time with **USD price**, **market cap**, **FDV**, **circulating supply**, and **transaction fee** data. Filter by **`Pair.Market.Network: Solana`** to capture every swap across **Raydium**, **Orca**, **Jupiter**, **PumpSwap**, and other Solana DEXs in a single subscription.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/All-trades-on-Solana-with-Price-Marketcap-supply).

```graphql
subscription {
  Trading {
    Trades(where: { Pair: { Market: { Network: { is: "Solana" } } } }) {
      Side
      Supply {
        MaxSupply
        TotalSupply
        FullyDilutedValuationUsd
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
        Hash
        Index
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
      Price
      PriceInUsd
    }
  }
}
```

---

## How do I stream trades for a specific token on Solana?

> Filter the **Solana trade stream** to a **single token** by its **mint address** using **`Pair.Token.Id`** — get real-time **swap events**, **USD price**, **market cap**, **supply**, and **trader wallet** for any **SPL token** traded on Raydium, Orca, Jupiter, Pump.fun, or PumpSwap.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/Trades-of-a-specific-token-on-Solana).

```graphql
subscription {
  Trading {
    Trades(
      where: {
        Pair: {
          Market: { Network: { is: "Solana" } }
          Token: {
            Id: { is: "bid:solana:4YiLHDR4B4pE4R5GUMA8HG8YunyeLwcobtEtvwMupump" }
          }
        }
      }
    ) {
      Side
      Supply {
        MaxSupply
        TotalSupply
        FullyDilutedValuationUsd
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
        Hash
        Index
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
      Price
      PriceInUsd
    }
  }
}
```

---

## How do I get all trades for a specific Ethereum token with price, market cap, and supply?

> Stream **Ethereum ERC-20 token trades** in real time — filter by **contract address** with **`Pair.Token.Id: bid:eth:0x…`** to get every **Uniswap**, **SushiSwap**, or other DEX swap including **USD price**, **market cap**, **FDV**, **supply**, **trader address**, and **transaction hash**.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/All-trades-of-a-specific-Ethereum-token-with-Price-Marketcap-supply_1).

```graphql
subscription {
  Trading {
    Trades(
      where: {
        Pair: {
          Market: { Network: { is: "Ethereum" } }
          Token: {
            Id: { is: "bid:eth:0x8b1484d57abbe239bb280661377363b03c89caea" }
          }
        }
      }
    ) {
      Side
      Supply {
        MaxSupply
        TotalSupply
        FullyDilutedValuationUsd
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
        Hash
        Index
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
      Price
      PriceInUsd
    }
  }
}
```

---

## How do I stream all DEX trades on BSC (BNB Chain)?

> Stream **every DEX swap on BNB Smart Chain** in real time — filter by **`Pair.Market.Network: Binance Smart Chain`** to capture trades across **PancakeSwap**, **Four.meme**, and other BSC DEXs. Each event returns **side**, **USD amounts**, **market cap**, **circulating supply**, **trader address**, and **pair metadata**.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/All-BNB-Trade-Stream).

```graphql
subscription {
  Trading {
    Trades(where: {Pair: {Market: {Network: {is: "Binance Smart Chain"}}}}) {
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
        }
        Currency {
          Symbol
          Id
          Name
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

---

## How do I stream all DEX trades on Base?

> Stream **every DEX swap on Base** in real time — filter by **`Pair.Market.Network: Base`** to capture trades across **Aerodrome**, **Uniswap**, **BaseSwap**, and other Base DEXs. Each event returns **side**, **USD amounts**, **market cap**, **circulating supply**, **trader wallet**, and **pair metadata**.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/All-Base-Trade-Stream).

```graphql
subscription {
  Trading {
    Trades(where: {Pair: {Market: {Network: {is: "Base"}}}}) {
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
        }
        Currency {
          Symbol
          Id
          Name
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

---

## How do I get all trades for a specific wallet on Solana?

> Track a **Solana wallet's DEX trading activity** in real time — filter by **`Trader.Address`** to stream every **buy and sell** swap executed by a specific wallet, including **token pair**, **USD price**, **amounts**, **market cap**, and **transaction details**. Useful for **copy trading bots**, **whale watching**, and **wallet PnL tracking**.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/All-trades-of-a-trader).

```graphql
subscription {
  Trading {
    Trades(
      where: {
        Pair: { Market: { Network: { is: "Solana" } } }
        Trader: { Address: { is: "GWcAopUZKokUUQAMDrNzd1YVHLJqbzJomu2pzNqLe9U3" } }
      }
    ) {
      Side
      Supply {
        MaxSupply
        TotalSupply
        FullyDilutedValuationUsd
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
        Hash
        Index
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
      Price
      PriceInUsd
    }
  }
}
```

---

## How do I get trades for a specific trader on a specific token?

> Combine **wallet address** and **token mint** filters to stream only the trades a **specific trader** made on a **specific token** — ideal for **position tracking**, **entry/exit analysis**, and **wallet-level PnL** on a per-token basis across **Solana**, **Ethereum**, or any supported chain.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/trades-of-a-specific-trader-of-a-specific-token).

```graphql
subscription {
  Trading {
    Trades(
      where: {
        Pair: {
          Market: { Network: { is: "Solana" } }
          Token: {
            Id: { is: "bid:solana:4YiLHDR4B4pE4R5GUMA8HG8YunyeLwcobtEtvwMupump" }
          }
        }
        Trader: { Address: { is: "GWcAopUZKokUUQAMDrNzd1YVHLJqbzJomu2pzNqLe9U3" } }
      }
    ) {
      Side
      Supply {
        MaxSupply
        TotalSupply
        FullyDilutedValuationUsd
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
        Hash
        Index
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
      Price
      PriceInUsd
    }
  }
}
```

---

## How do I stream all Pump.fun trades?

> Stream **every Pump.fun trade** in real time by filtering on the **Pump.fun program address** (`6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P`). Captures all bonding-curve swaps on Pump.fun including **token pair**, **USD amounts**, **market cap**, **circulating supply**, and **trader wallet** — useful for **new token sniping**, **bonding-curve monitoring**, and **Pump.fun analytics dashboards**.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/All-pumpfun-Trade-Stream_2).

```graphql
subscription {
  Trading {
    Trades(
      where: {Pair: {Market: {Program: {is: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"}}}}
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
        }
        Currency {
          Symbol
          Id
          Name
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

---

## How do I stream all PumpSwap trades?

> Stream **every PumpSwap trade** in real time by filtering on the **PumpSwap program address** (`pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA`). Captures all AMM swaps on PumpSwap — the successor DEX for tokens that graduated from the Pump.fun bonding curve — including **token pair**, **USD amounts**, **market cap**, **supply**, and **trader wallet**.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/All-Pumpswap-Trade-Stream).

```graphql
subscription {
  Trading {
    Trades(
      where: {Pair: {Market: {Program: {is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"}}}}
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
        }
        Currency {
          Symbol
          Id
          Name
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

---

## How do I get only buy or sell trades for a token?

> Stream **buy-side or sell-side trades** for a specific token by filtering on **`Pair.Token.Address`**. The **`Side`** field on each event tells you whether the trade was a **buy** or **sell** — use it client-side to split streams, calculate **buy/sell ratio**, track **buy pressure**, or trigger **sell alerts** for any token across supported chains.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/All-wsol-Trade-Stream).

```graphql
subscription {
  Trading {
    Trades(
      where: {Pair: {Token: {Address: {is: "So11111111111111111111111111111111111111112"}}}}
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
          Id
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

## How do I get recent trades for WSOL (last 10 minutes)?

> Query the **last 10 minutes of WSOL trades** using **`Block.Time.since_relative`** with **`Pair.Token.Id`** (indexed field for faster lookups). Returns trades sorted by **most recent first** with **USD amounts**, **market cap**, **supply**, **pool address**, and **trader wallet** — ideal for building **live trade feeds**, **recent activity widgets**, or **short-window analytics**.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/Last-10-minutes-trades-for-WSOL).

```graphql
{
  Trading {
    Trades(
      orderBy:{descending:Block_Time}
      where: {
        Block:{Time:{since_relative:{minutes_ago:10}}}
        Pair: {Token: {Id: {is: "bid:solana:So11111111111111111111111111111111111111112"}}}}
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
          Id
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

## How do I stream trades for a specific trading pair?

> Stream **trades for a specific token pair** (e.g. **WSOL/USDC**) by filtering both **`Pair.Token.Id`** and **`Pair.QuoteToken.Id`**. This captures every swap between the two tokens **across all pools and DEXs** — useful for **pair-level price feeds**, **liquidity monitoring**, and **arbitrage detection** between Raydium, Orca, Jupiter, and other venues.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/WSOL-USDC-Token-pair-trade-stream).

```graphql
subscription {
  Trading {
    Trades(
      where: {Pair: {Token: {Id: {is: "bid:solana:So11111111111111111111111111111111111111112"}}, QuoteToken: {Id: {is: "bid:solana:EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}}}
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
          Id
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

## How do I get the last 10 trades for a token pair across all pools?

> Query the **last 10 trades** for a specific pair (e.g. **WSOL/USDC**) across **every pool and DEX** using **`limit`**, **`orderBy: descending Block_Time`**, and a **`since_relative`** time window. Returns the most recent swaps with **pool address**, **USD amounts**, **market cap**, **trader wallet**, and **side** — ideal for **recent trades widgets**, **pair activity tables**, and **cross-pool comparison**.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/Last-10-WSOL-USDC-Token-pair-trades).

```graphql
{
  Trading {
    Trades(
      limit:{count:10}
      orderBy: {descending: Block_Time}
      where: {Block: {Time: {since_relative: {minutes_ago: 10}}},
        Pair: {Token: {Id: {is: "bid:solana:So11111111111111111111111111111111111111112"}}, 
          QuoteToken: {Id: {is: "bid:solana:EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}}}
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
          Id
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

## How do I get trades above a minimum USD value (whale trades)?

> Stream **whale trades** across all chains by filtering **`AmountsInUsd.Base`** with **`gt`** (greater than) — for example, only swaps worth **over $100,000 USD**. Captures large-size DEX trades in real time with **trader wallet**, **token pair**, **pool**, **market cap**, and **supply** — ideal for **whale alert bots**, **smart money tracking**, **large-order flow analysis**, and **institutional activity monitoring**.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/Stream---Trades-over-100k-usd).

```graphql
subscription {
  Trading {
    Trades(where: {AmountsInUsd: {Base: {gt: 100000}}}) {
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
          Id
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

## How do I track trades for multiple tokens in one subscription?

> Monitor **multiple tokens in a single subscription** using the **`in`** operator on **`Pair.Token.Id`** and **`Pair.QuoteToken.Id`** with the **`any`** combinator — or filter by **multiple pool addresses** with **`Pair.Pool.Address.in`**. Both approaches let you batch-watch a **token watchlist** or a **set of liquidity pools** without opening separate streams — ideal for **portfolio dashboards**, **multi-token alert bots**, and **pool-level monitoring**.

There are two ways to track multiple tokens. You can specify token IDs using the **`any`** combinator to match trades where your tokens appear on either side of the pair.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/How-do-I-track-trades-for-multiple-tokens-in-one-subscription).

```graphql
subscription {
  Trading {
    Trades(where: {
      any:[
        {Pair:{Token:{Id:{in:["bid:solana:EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", "bid:solana:SKRbvo6Gf7GondiT3BbTfuRDPqLWei4j2Qy2NPGZhW3","bid:solana:Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"]}}}}
        {Pair:{QuoteToken:{Id:{in:["bid:solana:EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", "bid:solana:SKRbvo6Gf7GondiT3BbTfuRDPqLWei4j2Qy2NPGZhW3","bid:solana:Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"]}}}}
      ]
      Pair: {Market: {Network: {is: "Solana"}}}}) {
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
          Id
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

You can also specify **pool addresses** directly to monitor all tokens traded in those pools.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/Using-Pairs---How-do-I-track-trades-for-multiple-tokens-in-one-subscription).

```graphql
subscription {
  Trading {
    Trades(
      where: {Pair: {Pool: {Address: {in: ["BMhbJpKihPsrQwWTNrzYLFwh2LbuDwWYbHKzEZrV9f6V",
        "916HUQvjHzJ3UP1LgtyoVYyxhkwqbnBxPshxNKBbz5uN", 
        "aXQtJ9cGr1zgLyrppKJ5BR5jv1RMjyYL5Wetd2KZNtB"]}}}}
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
          Id
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

## What are the most traded tokens on Solana in the last hour?

> Get the **most traded tokens on Solana** in the last hour ranked by **trade count** — returns **number of trades**, **average trade size in USD**, and **total volume** per token pair. Useful for **trending token feeds**, **volume dashboards**, **hot token detection**, and identifying which tokens have the highest trading activity right now.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/Most-traded-token-in-last-1-hour-on-solana-and-its-average-trade-amount-and-total-volume).

```graphql
{
  Trading {
    Trades(
      orderBy: {descendingByField: "count"}
      where: {Block: {Time: {since_relative: {hours_ago: 1}}}, Pair: {Market: {Network: {is: "Solana"}}}}
    ) {
      count
      average_trade_size: average(of: AmountsInUsd_Quote)
      sum(of:AmountsInUsd_Quote)
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
