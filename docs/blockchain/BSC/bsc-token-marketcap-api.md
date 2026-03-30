---
sidebar_position: 8
---

# BNB Smart Chain (BSC) Token Market Cap API

Use Bitquery’s **Trading** API **`Tokens`** cube to stream or query **market cap**, **fully diluted valuation (USD)**, **total supply**, **price** (OHLC and averages), and **volume** for tokens on **BNB Smart Chain** (**BSC**). Filter with **`bsc:`** + **lowercase** contract in **`Token.Id`** / **`Currency.Id`**; ranked queries below use **`Token.Network`** **`Binance Smart Chain`**.

For schema details and field meanings, see the **[Tokens cube](/docs/trading/crypto-price-api/tokens)** and **[Supply fields](/docs/trading/crypto-price-api/supply-fields)**.

<head>
<meta name="title" content="BSC Token Market Cap API | Trading Tokens"/>
<meta name="description" content="Stream and query BNB Smart Chain (BSC) token market cap, FDV, supply, OHLC price, and volume using Bitquery Trading.Tokens GraphQL API."/>
<meta name="keywords" content="BSC token market cap, BNB chain token market cap, PancakeSwap token api, bitquery trading tokens bsc, bsc fdv api, binance smart chain token api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>
<meta property="og:type" content="website"/>
<meta property="og:title" content="BSC Token Market Cap API"/>
<meta property="og:description" content="Real-time streams and queries for BSC token market cap, supply, and price via Trading.Tokens."/>
<meta property="twitter:card" content="summary_large_image"/>
<meta property="twitter:title" content="BSC Token Market Cap API"/>
<meta property="twitter:description" content="Real-time streams and queries for BSC token market cap, supply, and price via Trading.Tokens."/>
</head>

:::note Trading API and EVM addresses
On **BSC** (EVM), use **lowercase** hex in **`Id`** values (e.g. `bsc:0x2eb0…`, not mixed-case checksum addresses).
:::

## Related APIs

- **[Ethereum Token Market Cap API](/docs/blockchain/Ethereum/token-supply/ethereum-token-marketcap-api)** — **`eth:`** ids
- **[Base Token Market Cap API](/docs/blockchain/Base/base-token-marketcap-api)** — **`base:`** ids
- **[Arbitrum Token Market Cap API](/docs/blockchain/Arbitrum/arbitrum-token-marketcap-api)** — **`arbitrum:`** ids
- **[Polygon (Matic) Token Market Cap API](/docs/blockchain/Matic/matic-token-marketcap-api)** — **`matic:`** ids
- **[Solana Token Market Cap API](/docs/blockchain/Solana/solana-token-marketcap-api)** — **`solana:`** ids
- **[Crypto Price API — Tokens](/docs/trading/crypto-price-api/tokens)** — full `Tokens` cube reference

---

## How do I stream live BSC token market cap, price, and volume?

Subscribe to **`Tokens`** where **currency id** includes **`bsc`**, with **interval duration** greater than **1** (second).

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/bsc-token-marketcap-stream#).

```graphql
subscription MyQuery {
  Trading {
    Tokens(
      where: {Currency: {Id: {includes: "bsc"}}, Interval: {Time: {Duration: {gt: 1}}}}
    ) {
      Token {
        Name
        Id
        Address
        Symbol
      }
      Block {
        Time
      }
      Supply {
        TotalSupply
        FullyDilutedValuationUsd
        MarketCap
      }
      Price {
        Average {
          Mean
        }
        Ohlc {
          Open
          Low
          High
          Close
        }
      }
      Volume {
        Base
        BaseAttributedToUsd
        Quote
        Usd
      }
    }
  }
}
```

---

## How do I get the latest market cap for a specific token on BSC?

Use **`limit: { count: 1 }`**, **`orderBy: { descending: Block_Time }`**, and **`Token.Id`** with **`includesCaseInsensitive`** (e.g. **`bsc:`** + lowercase contract).

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/specific-bsc-token-latest-marketcap_1).

```graphql
query {
  Trading {
    Tokens(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {Token: {Id: {includesCaseInsensitive: "bsc:0x2eb08a8fe215f72e01e089c1cd8c4c4937414444"}}, Interval: {Time: {Duration: {gt: 1}}}}
    ) {
      Token {
        Name
        Id
        Address
        Symbol
      }
      Block {
        Time
      }
      Supply {
        TotalSupply
        FullyDilutedValuationUsd
        MarketCap
      }
      Price {
        Average {
          Mean
        }
        Ohlc {
          Open
          Low
          High
          Close
        }
      }
      Volume {
        Base
        BaseAttributedToUsd
        Quote
        Usd
      }
    }
  }
}
```

Replace the `includesCaseInsensitive` value with your token’s **`bsc:<contract_address>`** id (lowercase hex).

---

## How do I stream BSC tokens with market cap above $1 million?

Subscribe when **`Token.Id`** matches **BSC** (**`bsc`**) and **`Supply.MarketCap`** **>** **1,000,000** (USD).

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/realtime-stream-bsc-tokens-with-marketcap-above-1-million_1).

```graphql
subscription {
  Trading {
    Tokens(
      where: {Token: {Id: {includesCaseInsensitive: "bsc"}}, Interval: {Time: {Duration: {gt: 1}}}, Supply: {MarketCap: {gt: 1000000}}}
    ) {
      Currency {
        Name
        Id
        Symbol
      }
      Token {
        Name
        Symbol
        Id
        Address
        Network
      }
      Supply {
        TotalSupply
        FullyDilutedValuationUsd
        MarketCap
      }
    }
  }
}
```

:::tip Threshold and interval
Tune **`Supply.MarketCap`** and **`Interval.Time.Duration`** for your alerts or dashboards. See **[Tokens cube](/docs/trading/crypto-price-api/tokens)** for more filters.
:::

---

## How do I get top BSC tokens by market cap?

Ranks tokens on **BNB Smart Chain** by **`Supply.MarketCap`**, with **24h** window, **1s** interval, **$1,000+** USD volume, **`limitBy`** per **`Token_Id`**, up to **50** rows. **`Token.Network`** is **Binance Smart Chain**.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/Top-Tokens-by-Market-Cap-on-bsc).

```graphql
{
  Trading {
    Tokens(
      limit: { count: 50 }
      limitBy: { count: 1, by: Token_Id }
      orderBy: { descending: Supply_MarketCap }
      where: {
        Block: { Time: { since_relative: { hours_ago: 24 } } }
        Interval: { Time: { Duration: { eq: 1 } } }
        Volume: { Usd: { gt: 1000 } }
        Token: { Network: { is: "Binance Smart Chain" } }
      }
    ) {
      Currency {
        Id
        Name
        Symbol
      }
      Price {
        Average {
          Mean(maximum: Block_Time)
        }
      }
      Volume {
        Base(maximum: Block_Time)
        Quote(maximum: Block_Time)
        Usd(maximum: Block_Time)
      }
      Token {
        Network
        Symbol
        Address
      }
      Supply {
        MarketCap(maximum: Block_Time)
        FullyDilutedValuationUsd(maximum: Block_Time)
        TotalSupply(maximum: Block_Time)
      }
    }
  }
}
```

---

## How do I get top BSC tokens by market cap change in 1 hour?

**1-hour** OHLC (`Duration: { eq: 3600 }`), ordered by **`change_mcap`**: **(close − open) × total supply**. **`Token.Network`** is **Binance Smart Chain**.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/top-bsc-tokens-by-Market-Cap-Change-1h).

```graphql
{
  Trading {
    Tokens(
      limit: { count: 50 }
      orderBy: { descendingByField: "change_mcap" }
      where: {
        Interval: { Time: { Duration: { eq: 3600 } } }
        Token: { Network: { is: "Binance Smart Chain" } }
      }
    ) {
      Currency {
        Id
        Name
        Symbol
      }
      Token {
        Network
        Symbol
        Address
      }
      Supply {
        MarketCap
        FullyDilutedValuationUsd
        CirculatingSupply
        TotalSupply
        MaxSupply
      }
      change_mcap: calculate(
        expression: "($Price_Ohlc_Close-$Price_Ohlc_Open) * Supply_TotalSupply"
      )
      Price {
        Ohlc {
          Open
          Close
        }
      }
    }
  }
}
```
