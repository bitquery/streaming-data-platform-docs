---
sidebar_position: 10
---

# Base Token Market Cap API

Use Bitquery’s **Trading** API **`Tokens`** cube to stream or query **market cap**, **fully diluted valuation (USD)**, **total supply**, **price** (OHLC and averages), and **volume** for tokens traded on **Base**. Filter Base assets with token/currency **`Id`** values such as **`base:`** plus a **lowercase** contract address.

For schema details and field meanings, see the **[Tokens cube](/docs/trading/crypto-price-api/tokens)** and **[Supply fields](/docs/trading/crypto-price-api/supply-fields)**.

<head>
<meta name="title" content="Base Token Market Cap API | Trading Tokens"/>
<meta name="description" content="Stream and query Base chain token market cap, FDV, supply, OHLC price, and volume using Bitquery Trading.Tokens GraphQL API."/>
<meta name="keywords" content="base token market cap, base chain erc20 market cap, base token api, bitquery trading tokens base, base fdv api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>
<meta property="og:type" content="website"/>
<meta property="og:title" content="Base Token Market Cap API"/>
<meta property="og:description" content="Real-time streams and queries for Base token market cap, supply, and price via Trading.Tokens."/>
<meta property="twitter:card" content="summary_large_image"/>
<meta property="twitter:title" content="Base Token Market Cap API"/>
<meta property="twitter:description" content="Real-time streams and queries for Base token market cap, supply, and price via Trading.Tokens."/>
</head>

:::note Trading API and EVM addresses
On **Base** (EVM), the **Trading** API expects **lowercase** hex in **`Id`** values (e.g. `base:0x1f1c…`, not mixed-case checksum addresses).
:::

## Related APIs

- **[Ethereum Token Market Cap API](/docs/blockchain/Ethereum/token-supply/ethereum-token-marketcap-api)** — same **`Trading.Tokens`** patterns on Ethereum (`eth:` ids)
- **[Polygon (Matic) Token Market Cap API](/docs/blockchain/Matic/matic-token-marketcap-api)** — same patterns with **`matic:`** ids
- **[Arbitrum Token Market Cap API](/docs/blockchain/Arbitrum/arbitrum-token-marketcap-api)** — same patterns with **`arbitrum:`** ids
- **[Crypto Price API — Tokens](/docs/trading/crypto-price-api/tokens)** — full `Tokens` cube reference

---

## How do I stream live Base token market cap, price, and volume?

Subscribe to **`Tokens`** where **currency id** includes **`base`**, with **interval duration** greater than **1** (second). You get **token fields**, **block time**, **supply** (**MarketCap**, **FullyDilutedValuationUsd**), **price** (OHLC and mean), and **volume**.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/base-token-marketcap-stream).

```graphql
subscription MyQuery {
  Trading {
    Tokens(
      where: {Currency: {Id: {includes: "base"}}, Interval: {Time: {Duration: {gt: 1}}}}
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

## How do I get the latest market cap for a specific token on Base?

Use **`limit: { count: 1 }`**, **`orderBy: { descending: Block_Time }`**, and filter **`Token.Id`** with **`includesCaseInsensitive`** (e.g. **`base:`** + lowercase contract).

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/specific-base-token-latest-marketcap).

```graphql
query {
  Trading {
    Tokens(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {Token: {Id: {includesCaseInsensitive: "base:0x1f1c695f6b4a3f8b05f2492cef9474afb6d6ad69"}}, Interval: {Time: {Duration: {gt: 1}}}}
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

Replace the `includesCaseInsensitive` value with your token’s **`base:<contract_address>`** id (lowercase hex).

---

## How do I stream Base tokens with market cap above $1 million?

Subscribe when **`Token.Id`** matches **Base** (**`base`**) and **`Supply.MarketCap`** **>** **1,000,000** (USD).

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/realtime-stream-base-tokens-with-marketcap-above-1-million).

```graphql
subscription {
  Trading {
    Tokens(
      where: {Token: {Id: {includesCaseInsensitive: "base"}}, Interval: {Time: {Duration: {gt: 1}}}, Supply: {MarketCap: {gt: 1000000}}}
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
