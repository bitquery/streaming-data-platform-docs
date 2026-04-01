---
sidebar_position: 3
---

import VideoPlayer from "../../../src/components/videoplayer.js";

# Solana Token Market Cap API

Use Bitquery’s **Trading** API **`Tokens`** cube to stream or query **market cap**, **fully diluted valuation (USD)**, **total supply**, **price** (OHLC and averages), and **volume** for tokens on **Solana**. Filter with **`solana:`** plus the token **mint** in **`Token.Id`** / **`Currency.Id`**; ranked queries below use **`Token.Network`** **`Solana`**.

For schema details and field meanings, see the **[Tokens cube](/docs/trading/crypto-price-api/tokens)** and **[Supply fields](/docs/trading/crypto-price-api/supply-fields)**.

<head>
<meta name="title" content="Solana Token Market Cap API | Trading Tokens"/>
<meta name="description" content="Stream and query Solana SPL token market cap, FDV, supply, OHLC price, and volume using Bitquery Trading.Tokens GraphQL API."/>
<meta name="keywords" content="solana token market cap, spl token market cap api, solana fdv api, bitquery trading tokens solana, solana token supply price"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>
<meta property="og:type" content="website"/>
<meta property="og:title" content="Solana Token Market Cap API"/>
<meta property="og:description" content="Real-time streams and queries for Solana token market cap, supply, and price via Trading.Tokens."/>
<meta property="twitter:card" content="summary_large_image"/>
<meta property="twitter:title" content="Solana Token Market Cap API"/>
<meta property="twitter:description" content="Real-time streams and queries for Solana token market cap, supply, and price via Trading.Tokens."/>
</head>

## Related APIs

- **[Ethereum Token Market Cap API](/docs/blockchain/Ethereum/token-supply/ethereum-token-marketcap-api)** — **`eth:`** ids
- **[Base Token Market Cap API](/docs/blockchain/Base/base-token-marketcap-api)** — **`base:`** ids
- **[Arbitrum Token Market Cap API](/docs/blockchain/Arbitrum/arbitrum-token-marketcap-api)** — **`arbitrum:`** ids
- **[Polygon (Matic) Token Market Cap API](/docs/blockchain/Matic/matic-token-marketcap-api)** — **`matic:`** ids
- **[BSC Token Market Cap API](/docs/blockchain/BSC/bsc-token-marketcap-api)** — **`bsc:`** ids
- **[Crypto Price API — Tokens](/docs/trading/crypto-price-api/tokens)** — full `Tokens` cube reference

---

## How do I stream live Solana token market cap, price, and volume?

Subscribe to **`Tokens`** where **currency id** includes **`solana`**, with **interval duration** greater than **1** (second).

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/solana-token-marketcap-stream).

```graphql
subscription MyQuery {
  Trading {
    Tokens(
      where: {
        Currency: { Id: { includes: "solana" } }
        Interval: { Time: { Duration: { gt: 1 } } }
      }
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

## How do I get the latest market cap for a specific token on Solana?

Use **`limit: { count: 1 }`**, **`orderBy: { descending: Block_Time }`**, and **`Token.Id`** with **`includesCaseInsensitive`** (e.g. **`solana:`** + mint).

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/specific-solana-token-latest-marketcap).

```graphql
query {
  Trading {
    Tokens(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        Token: {
          Id: {
            includesCaseInsensitive: "solana:JCsv6w5NGR9NWryUCQLD7gMHbSB9vZRAvgYqJTFKNT3K"
          }
        }
        Interval: { Time: { Duration: { gt: 1 } } }
      }
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

Replace the `includesCaseInsensitive` value with your token’s **`solana:<mint_address>`** id.

---

## How do I stream Solana tokens with market cap above $1 million?

Subscribe when **`Token.Id`** matches **Solana** (**`solana`**) and **`Supply.MarketCap`** **>** **1,000,000** (USD).

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/realtime-stream-solana-tokens-with-marketcap-above-1-million).

```graphql
subscription {
  Trading {
    Tokens(
      where: {
        Token: { Id: { includesCaseInsensitive: "solana" } }
        Interval: { Time: { Duration: { gt: 1 } } }
        Supply: { MarketCap: { gt: 1000000 } }
      }
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

## How do I get top Solana tokens by market cap?

Ranks tokens on **Solana** by **`Supply.MarketCap`**, with **24h** window, **1s** interval, **$1,000+** USD volume, **`limitBy`** per **`Token_Id`**, up to **50** rows. **`Token.Network`** is **Solana**.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/Top-Tokens-by-Market-Cap-on-solana).

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
        Token: { Network: { is: "Solana" } }
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

## How do I get top Solana tokens by market cap change in 1 hour?

**1-hour** OHLC (`Duration: { eq: 3600 }`), ordered by **`change_mcap`**: **(close − open) × total supply**. **`Token.Network`** is **Solana**.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/top-solana-tokens-by-Market-Cap-Change-1h).

```graphql
{
  Trading {
    Tokens(
      limit: { count: 50 }
      orderBy: { descendingByField: "change_mcap" }
      where: {
        Interval: { Time: { Duration: { eq: 3600 } } }
        Token: { Network: { is: "Solana" } }
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

## Video tutorial

<VideoPlayer url="https://youtu.be/AVmscLyye4c" />
