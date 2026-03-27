---
sidebar_position: 3
---

# Polygon (Matic) Token Market Cap API

Use Bitquery’s **Trading** API **`Tokens`** cube to stream or query **market cap**, **fully diluted valuation (USD)**, **total supply**, **price** (OHLC and averages), and **volume** for tokens on **Polygon** (network id **`matic`** in the Trading API). Filter with **`matic:`** plus a **lowercase** contract address in **`Token.Id`** / **`Currency.Id`**.

For schema details and field meanings, see the **[Tokens cube](/docs/trading/crypto-price-api/tokens)** and **[Supply fields](/docs/trading/crypto-price-api/supply-fields)**.

<head>
<meta name="title" content="Polygon Matic Token Market Cap API | Trading Tokens"/>
<meta name="description" content="Stream and query Polygon (Matic) token market cap, FDV, supply, OHLC price, and volume using Bitquery Trading.Tokens GraphQL API."/>
<meta name="keywords" content="polygon token market cap, matic token market cap, polygon erc20 api, bitquery trading tokens matic, polygon fdv api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>
<meta property="og:type" content="website"/>
<meta property="og:title" content="Polygon (Matic) Token Market Cap API"/>
<meta property="og:description" content="Real-time streams and queries for Polygon token market cap, supply, and price via Trading.Tokens."/>
<meta property="twitter:card" content="summary_large_image"/>
<meta property="twitter:title" content="Polygon (Matic) Token Market Cap API"/>
<meta property="twitter:description" content="Real-time streams and queries for Polygon token market cap, supply, and price via Trading.Tokens."/>
</head>

:::note Trading API and EVM addresses
On **Polygon** (**`matic`** in Trading), use **lowercase** hex in **`Id`** values (e.g. `matic:0xeb51…`, not mixed-case checksum addresses).
:::

## Related APIs

- **[Ethereum Token Market Cap API](/docs/blockchain/Ethereum/token-supply/ethereum-token-marketcap-api)** — **`eth:`** ids
- **[Base Token Market Cap API](/docs/blockchain/Base/base-token-marketcap-api)** — **`base:`** ids
- **[Arbitrum Token Market Cap API](/docs/blockchain/Arbitrum/arbitrum-token-marketcap-api)** — **`arbitrum:`** ids
- **[Crypto Price API — Tokens](/docs/trading/crypto-price-api/tokens)** — full `Tokens` cube reference

---

## How do I stream live Polygon (Matic) token market cap, price, and volume?

Subscribe to **`Tokens`** where **currency id** includes **`matic`**, with **interval duration** greater than **1** (second).

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/matic-token-marketcap-stream).

```graphql
subscription MyQuery {
  Trading {
    Tokens(
      where: {
        Currency: { Id: { includes: "matic" } }
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

## How do I get the latest market cap for a specific token on Polygon?

Use **`limit: { count: 1 }`**, **`orderBy: { descending: Block_Time }`**, and filter **`Token.Id`** with **`includes`** (or **`includesCaseInsensitive`**) for **`matic:`** + lowercase contract.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/specific-matic-token-latest-marketcap).

```graphql
query {
  Trading {
    Tokens(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        Token: {
          Id: { includes: "matic:0xeb51d9a39ad5eef215dc0bf39a8821ff804a0f01" }
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

Replace the `includes` value with your token’s **`matic:<contract_address>`** id (lowercase hex).

---

## How do I stream Polygon tokens with market cap above $1 million?

Subscribe when **`Token.Id`** matches **Polygon** (**`matic`**) and **`Supply.MarketCap`** **>** **1,000,000** (USD).

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/realtime-stream-matic-tokens-with-marketcap-above-1-million).

```graphql
subscription {
  Trading {
    Tokens(
      where: {
        Token: { Id: { includesCaseInsensitive: "matic" } }
        Interval: { Time: { Duration: { gt: 1 } } }
        Supply: { MarketCap: { gt: 1000000 } }
      }
    ) {
      Currency {
        Name
        Id
        Symbol
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

## How do I get top Polygon (Matic) tokens by market cap?

This query ranks **Polygon** tokens by **`Supply.MarketCap`**. Set **`Token.Network`** to **Matic** (Polygon’s label in the Trading API). It uses roughly the **last 24 hours**, **1-second** intervals, at least **$1,000** **USD volume**, **`limitBy`** one row per **`Token_Id`**, and up to **50** tokens.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/Top-Tokens-by-Market-Cap-on-Polygon_1).

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
        Token: { Network: { is: "Matic" } }
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

## How do I get top Polygon tokens by market cap change in 1 hour?

Uses a **1-hour** OHLC interval (`Duration: { eq: 3600 }`) and orders by **`change_mcap`**: **(close − open) × total supply**. **`Token.Network`** is **Matic**.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/top-Polygon-tokens-by-Market-Cap-Change-1h).

```graphql
{
  Trading {
    Tokens(
      limit: { count: 50 }
      orderBy: { descendingByField: "change_mcap" }
      where: {
        Interval: { Time: { Duration: { eq: 3600 } } }
        Token: { Network: { is: "Matic" } }
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
