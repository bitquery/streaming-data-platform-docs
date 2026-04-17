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

> **Bitquery Crypto Trades API** streams **individual swap-level DEX trades** in **real time** across **Solana**, **Ethereum**, **BSC**, **Base**, **Arbitrum**, and **Polygon**. Each row includes **price**, **USD amounts**, **market cap**, **FDV**, **supply**, **trader address**, and **transaction metadata** via **GraphQL subscriptions**.

The **Trades** cube streams individual **swap-level** rows from the **Trading** API: each event includes **side**, **amounts** (base, quote, USD), **price**, **pair** (market, tokens, currencies), **trader**, **transaction** metadata, and a **supply** snapshot (**MarketCap**, **FDV**, circulating/total/max supply) for the token context on that row.

For **aggregated** token metrics across all pairs, use the **[Tokens cube](/docs/trading/crypto-price-api/tokens)**. For **pair-level** OHLC and volume intervals, use the **[Pairs cube](/docs/trading/crypto-price-api/pairs)**. Supply field meanings are documented under **[Supply fields](/docs/trading/crypto-price-api/supply-fields)**.

### Key points

- **Subscriptions**: These examples use **`subscription`** for real-time streams; you can often run the same selection as a **`query`** with an added time window on **`Block`** / **`Interval`** where supported.
- **Networks**: Filter with **`Pair.Market.Network`** (e.g. **`Solana`**, **`Ethereum`**).
- **Token filter**: Use **`Pair.Token.Id`** with the full id (e.g. **`bid:solana:<mint>`**, **`bid:eth:<lowercase_contract>`**) per your dataset conventions.
- **Trader filter**: Use **`Trader.Address`** for the wallet executing the trade.
- **Aggregations**: Examples at the end of this page use **`query`** with **`limit`**, **`orderBy`**, **`sum`**, **`average`**, **`count`**, **`calculate`**, **`limitBy`**, and **`distinct`** for volume, token, DEX, time-bucket, and fee analytics on **`Trades`**.
- **USD vs quote**: **`PriceInUsd`** and **`AmountsInUsd`** are in USD where indexed; see **[Price Index Algorithm](/docs/trading/crypto-price-api/price-index-algorithm)** for how amounts and prices are derived.

More patterns: **[Crypto Price API examples](/docs/trading/crypto-price-api/examples)**.


## How Do I Stream New DEX Trades Across All Chains in Real Time?

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

## How Do I Get All DEX Trades on Solana With Price, Market Cap, and Supply?

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

## How Do I Stream Trades for a Specific Token on Solana?

> Filter the **Solana trade stream** to a **single token** by its **mint address** using **`Pair.Token.Id`** — get real-time **swap events**, **USD price**, **market cap**, **supply**, and **trader wallet** for any **SPL token** traded on Raydium, Orca, Jupiter, pumpfun, or PumpSwap.

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

## How Do I Get All Trades for a Specific Ethereum Token With Price, Market Cap, and Supply?

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

## How Do I Stream Uniswap v4 Trades on Ethereum With Pool Id and Market Cap?

> Stream **Uniswap v4** swaps on **Ethereum** by filtering **`Pair.Market.Network: Ethereum`** and **`Pair.Market.Protocol: uniswap_v4`**. Each event includes **`Pair.Pool.Id`** (the **v4 pool identifier** the protocol uses), **`Pair.Pool.Address`**, **market cap** and **circulating supply** under **`Supply`**, and full **pair** and **trader** context.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/Uniswap-v4-trades-with-pool-id-and-mcap).

```graphql
subscription {
  Trading {
    Trades(
      where: {Pair: {Market: {Network: {is: "Ethereum"}, Protocol: {is: "uniswap_v4"}}}}
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
        Pool {
          Id
          Address
        }
      }
    }
  }
}
```

On **Uniswap v4**, use **`Pair.Pool.Id`** as the stable **pool id** field (alongside **`Pair.Pool.Address`**). Example shape:

```json
"Pool": {
  "Address": "0x000000000004444c5dc75cb358380d2e3de08a90",
  "Id": "0x71ad627a0586a06b24834f7af328c5c387a512d183dbd7b8c31189a866adcefa"
}
```

---

## How Do I Stream All DEX Trades on BSC (BNB Chain)?

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

## How Do I Stream All DEX Trades on Base?

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

## How Do I Get All Trades for a Specific Wallet on Solana?

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

## How Do I Get Trades for a Specific Trader on a Specific Token?

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

## How Do I Stream All PumpFun Trades?

> Stream **every pumpfun trade** in real time by filtering on the **pumpfun program address** (`6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P`). Captures all bonding-curve swaps on pumpfun including **token pair**, **USD amounts**, **market cap**, **circulating supply**, and **trader wallet** — useful for **new token sniping**, **bonding-curve monitoring**, and **pumpfun analytics dashboards**.

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

## How Do I Stream All PumpSwap Trades?

> Stream **every PumpSwap trade** in real time by filtering on the **PumpSwap program address** (`pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA`). Captures all AMM swaps on PumpSwap — the successor DEX for tokens that graduated from the pumpfun bonding curve — including **token pair**, **USD amounts**, **market cap**, **supply**, and **trader wallet**.

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

## How Do I Get Only Buy or Sell Trades for a Token?

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

## How Do I Get Recent Trades for WSOL (Last 10 Minutes)?

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

## How Do I Stream Trades for a Specific Trading Pair?

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

## How Do I Get the Last 10 Trades for a Token Pair Across All Pools?

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

## How Do I Get Trades Above a Minimum USD Value (Whale Trades)?

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

## How Do I Track Trades for Multiple Tokens in One Subscription?

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

## What Are the Most Traded Tokens on Solana in the Last Hour?

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

---

## How do I compare buy vs sell volume in USD per pool on Solana (last hour)?

> Aggregates **Solana** **`Trades`** from the last **hour** into up to **100** rows per **liquidity pool**, ranked by **trade count**. Each row returns **quoted USD volume** (`AmountsInUsd_Quote`) split into **buy** vs **sell** sums plus **buy/sell counts**. Useful for **per-pool flow** and **directional pressure** dashboards.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/Total-buy-vs-sell-volume-in-USD-per-token_1#).

```graphql
{
  Trading {
    Trades(
      limit: {count: 100}
      orderBy: {descendingByField: "count"}
      where: {Block: {Time: {since_relative: {hours_ago: 1}}}, Pair: {Market: {Network: {is: "Solana"}}}}
    ) {
      count
      average_trade_size: average(of: AmountsInUsd_Quote)
      total_volume: sum(of: AmountsInUsd_Quote)
      buy_volume: sum(of: AmountsInUsd_Quote, if: {Side: {is: "Buy"}})
      sell_volume: sum(of: AmountsInUsd_Quote, if: {Side: {is: "Sell"}})
      buys: count(if: {Side: {is: "Buy"}})
      sells: count(if: {Side: {is: "Sell"}})
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

## How do I rank pools by net buy-minus-sell trade count on Solana (last hour)?

> Same **pool-level** aggregation as above, but adds **`net_flow`** as **`buys − sells`** (difference in **trade counts**, not USD). Ordered by **`net_flow`** so pools with more **buy-side prints** rank higher. For **USD** net flow, define a **`calculate`** on **`buy_volume`** and **`sell_volume`** instead.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/Net-flow-buys---sells-per-token-symbol_2).

```graphql
{
  Trading {
    Trades(
      limit: {count: 100}
      orderBy: {descendingByField: "net_flow"}
      where: {Block: {Time: {since_relative: {hours_ago: 1}}}, Pair: {Market: {Network: {is: "Solana"}}}}
    ) {
      count
      average_trade_size: average(of: AmountsInUsd_Quote)
      total_volume: sum(of: AmountsInUsd_Quote)
      buy_volume: sum(of: AmountsInUsd_Quote, if: {Side: {is: "Buy"}})
      sell_volume: sum(of: AmountsInUsd_Quote, if: {Side: {is: "Sell"}})
      buys: count(if: {Side: {is: "Buy"}})
      sells: count(if: {Side: {is: "Sell"}})
      net_flow: calculate(expression: "$buys - $sells")
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

## How do I aggregate quoted USD volume by DEX program on Solana (last hour)?

> Groups **Solana** trades by **`Pair.Market.Program`** (and **protocol** metadata), returning **trade count** and **total quoted USD volume** per **DEX program**. Useful for **share-of-volume** charts across **AMMs** and programs.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/Volume-distribution-by-DEX-program#).

```graphql
{
  Trading {
    Trades(
      limit: {count: 100}
      orderBy: {descendingByField: "Dex_Volume"}
      where: {Block: {Time: {since_relative: {hours_ago: 1}}}, Pair: {Market: {Network: {is: "Solana"}}}}
    ) {
      Trades_count: count
      Dex_Volume: sum(of: AmountsInUsd_Quote)
      Pair {
        Market {
          Program
          Protocol
          ProtocolFamily
          Network
        }
      }
    }
  }
}
```

---

## How do I rank Solana tokens by market cap using trade-window supply snapshots (last hour)?

> One row per **base token** (**`limitBy`** on **`Pair.Token.Address`**) with **`Supply.MarketCap`**, **FDV**, and **total supply** taken at **`maximum: Block_Time`** inside the last hour, plus **volume** and **trade stats**. Replace **`Pair.Market.Network`** or add **`Pair.Token.Id`** filters to narrow the universe.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/Tokens-ranked-by-market-cap_1).

```graphql
{
  Trading {
    Trades(
      limit: {count: 100}
      limitBy: {by: Pair_Token_Address, count: 1}
      orderBy: {descending: Supply_MarketCap}
      where: {Block: {Time: {since_relative: {hours_ago: 1}}}, Pair: {Market: {Network: {is: "Solana"}}}}
    ) {
      count
      average_trade_size: average(of: AmountsInUsd_Quote)
      total_volume: sum(of: AmountsInUsd_Quote)
      buy_volume: sum(of: AmountsInUsd_Quote, if: {Side: {is: "Buy"}})
      sell_volume: sum(of: AmountsInUsd_Quote, if: {Side: {is: "Sell"}})
      buys: count(if: {Side: {is: "Buy"}})
      sells: count(if: {Side: {is: "Sell"}})
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
      Supply {
        TotalSupply(maximum: Block_Time)
        FullyDilutedValuationUsd(maximum: Block_Time)
        MarketCap(maximum: Block_Time)
      }
    }
  }
}
```

---

## How do I find tokens with the highest trade frequency on Solana (last hour)?

> Ranks **base tokens** by **`count`** of **`Trades`** in the window (plus **average trade size** and **volume** on **`AmountsInUsd_Quote`**). The selection nests **`Pair.Token`** only — ideal for **“most swapped assets”** style lists.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/Tokens-with-highest-trade-frequency).

```graphql
{
  Trading {
    Trades(
      limit: {count: 100}
      orderBy: {descendingByField: "count"}
      where: {Block: {Time: {since_relative: {hours_ago: 1}}}, Pair: {Market: {Network: {is: "Solana"}}}}
    ) {
      count
      average_trade_size: average(of: AmountsInUsd_Quote)
      total_volume: sum(of: AmountsInUsd_Quote)
      buy_volume: sum(of: AmountsInUsd_Quote, if: {Side: {is: "Buy"}})
      sell_volume: sum(of: AmountsInUsd_Quote, if: {Side: {is: "Sell"}})
      buys: count(if: {Side: {is: "Buy"}})
      sells: count(if: {Side: {is: "Sell"}})
      Pair {
        Token {
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

## How do I rank tokens by number of unique buyers on Solana (last hour)?

> Adds **`unique_buyers`** as **`count(distinct: Trader_Address)`** on **Buy** side trades, ordered by that field — surfaces tokens with the **widest retail participation** in the window (subject to your filters).

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/Tokens-with-most-unique-buyers).

```graphql
{
  Trading {
    Trades(
      limit: {count: 100}
      orderBy: {descendingByField: "unique_buyers"}
      where: {Block: {Time: {since_relative: {hours_ago: 1}}}, Pair: {Market: {Network: {is: "Solana"}}}}
    ) {
      count
      average_trade_size: average(of: AmountsInUsd_Quote)
      total_volume: sum(of: AmountsInUsd_Quote)
      buy_volume: sum(of: AmountsInUsd_Quote, if: {Side: {is: "Buy"}})
      sell_volume: sum(of: AmountsInUsd_Quote, if: {Side: {is: "Sell"}})
      buys: count(if: {Side: {is: "Buy"}})
      sells: count(if: {Side: {is: "Sell"}})
      unique_buyers: count(distinct: Trader_Address, if: {Side: {is: "Buy"}})
      Pair {
        Token {
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

## How do I find the most active liquidity pools on Solana by trade count (last hour)?

> Ranks **pools** by **`count`** with full **pair** context (tokens + market). Same shape as **buy/sell volume per pool** but sorted purely by **activity** — good for **“hottest pools”** views.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/Most-active-market-pools-by-trades).

```graphql
{
  Trading {
    Trades(
      limit: {count: 100}
      orderBy: {descendingByField: "count"}
      where: {Block: {Time: {since_relative: {hours_ago: 1}}}, Pair: {Market: {Network: {is: "Solana"}}}}
    ) {
      count
      average_trade_size: average(of: AmountsInUsd_Quote)
      total_volume: sum(of: AmountsInUsd_Quote)
      buy_volume: sum(of: AmountsInUsd_Quote, if: {Side: {is: "Buy"}})
      sell_volume: sum(of: AmountsInUsd_Quote, if: {Side: {is: "Sell"}})
      buys: count(if: {Side: {is: "Buy"}})
      sells: count(if: {Side: {is: "Sell"}})
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

## How do I count unique tokens traded per DEX program on Solana (last hour)?

> Groups by **`Pair.Market`** program metadata and computes **`Unique_tokens`** with **`count(distinct: Pair_Token_Id)`** plus **volume** and **trade count** — shows how many **different base tokens** touched each **program** in the window.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/Unique-tokens-per-DEX-program).

```graphql
{
  Trading {
    Trades(
      limit: {count: 100}
      orderBy: {descendingByField: "Unique_tokens"}
      where: {Block: {Time: {since_relative: {hours_ago: 1}}}, Pair: {Market: {Network: {is: "Solana"}}}}
    ) {
      Trades_count: count
      Dex_Volume: sum(of: AmountsInUsd_Quote)
      Unique_tokens: count(distinct: Pair_Token_Id)
      Pair {
        Market {
          Program
          Protocol
          ProtocolFamily
          Network
        }
      }
    }
  }
}
```

---

## How do I get per-minute trade counts for a Solana token (last hour)?

> Buckets **`Block.Time`** into **1-minute** intervals via **`Time(interval: {in: minutes, count: 1})`**, filtered to one **`Pair.Token.Id`** on **Solana**. Returns **count**, **volume**, and **buy/sell** breakdown **per minute** — useful for **intraday activity** charts.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/Trade-count-over-time-by-block-timestamp).

```graphql
{
  Trading {
    Trades(
      limit: {count: 100}
      orderBy: {descendingByField: "Block_Timefield"}
      where: {
        Block: {Time: {since_relative: {hours_ago: 1}}}
        Pair: {
          Token: {Id: {is: "bid:solana:FVo4K9FtXg9A4M6cAovqm4qgM7ALUpgei2da4D6R9FXb"}}
          Market: {Network: {is: "Solana"}}
        }
      }
    ) {
      Block {
        Timefield: Time(interval: {in: minutes, count: 1})
      }
      count
      average_trade_size: average(of: AmountsInUsd_Quote)
      total_volume: sum(of: AmountsInUsd_Quote)
      buy_volume: sum(of: AmountsInUsd_Quote, if: {Side: {is: "Buy"}})
      sell_volume: sum(of: AmountsInUsd_Quote, if: {Side: {is: "Sell"}})
      buys: count(if: {Side: {is: "Buy"}})
      sells: count(if: {Side: {is: "Sell"}})
      Pair {
        Token {
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

## How do I find the busiest one-minute volume windows for a Solana token (last hour)?

> Same **1-minute** buckets and **token** filter as above, but **`orderBy`** **`total_volume`** so the **largest quoted-USD minutes** float to the top — a simple **volume spike** detector.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/Volume-spikes--busiest-1min-time-windows).

```graphql
{
  Trading {
    Trades(
      limit: {count: 100}
      orderBy: {descendingByField: "total_volume"}
      where: {
        Block: {Time: {since_relative: {hours_ago: 1}}}
        Pair: {
          Token: {Id: {is: "bid:solana:FVo4K9FtXg9A4M6cAovqm4qgM7ALUpgei2da4D6R9FXb"}}
          Market: {Network: {is: "Solana"}}
        }
      }
    ) {
      Block {
        Timefield: Time(interval: {in: minutes, count: 1})
      }
      count
      average_trade_size: average(of: AmountsInUsd_Quote)
      total_volume: sum(of: AmountsInUsd_Quote)
      buy_volume: sum(of: AmountsInUsd_Quote, if: {Side: {is: "Buy"}})
      sell_volume: sum(of: AmountsInUsd_Quote, if: {Side: {is: "Sell"}})
      buys: count(if: {Side: {is: "Buy"}})
      sells: count(if: {Side: {is: "Sell"}})
      Pair {
        Token {
          Address
          Id
          Symbol
          Network
        }
      }
    }
  }
}
```

---

## How do I get total Solana DEX trade count, quoted USD volume, and sum of fees (last hour)?

> Single-row aggregate over **all Solana** **`Trades`** in the window: **`TransactionHeader.Fee`** summed in **native units** (e.g. **lamports**), plus **trade count** and **`AmountsInUsd_Quote`** sum. Interpret **fees** with your own **SOL** reference price or decimals.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/Total-SOL-fees-Total-Volume-Total-count-trades).

```graphql
{
  Trading {
    Trades(
      where: {Block: {Time: {since_relative: {hours_ago: 1}}}, Pair: {Market: {Network: {is: "Solana"}}}}
    ) {
      Trades_count_solana: count
      Solana_Volume: sum(of: AmountsInUsd_Quote)
      Total_fees_Solana: sum(of: TransactionHeader_Fee)
    }
  }
}
```

---

## How do I get average transaction fee per trade by DEX program on Solana (last hour)?

> Groups by **`Pair.Market`** program fields, returning **`average(of: TransactionHeader_Fee)`** alongside **trade count**, **total fees**, and **quoted USD volume** per **program**. Fee values are **native**; compare **programs** on a **relative** basis or convert off-chain.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/Average-fee-per-trade-Total-fees-total-volume-trades-count-per-DEX-program).

```graphql
{
  Trading {
    Trades(
      limit: {count: 100}
      orderBy: {descendingByField: "Average_Fee_per_DEX"}
      where: {Block: {Time: {since_relative: {hours_ago: 1}}}, Pair: {Market: {Network: {is: "Solana"}}}}
    ) {
      Trades_count_dex: count
      Dex_Volume: sum(of: AmountsInUsd_Quote)
      Total_fees_DEX: sum(of: TransactionHeader_Fee)
      Average_Fee_per_DEX: average(of: TransactionHeader_Fee)
      Pair {
        Market {
          Program
          Protocol
          ProtocolFamily
        }
      }
    }
  }
}
```
