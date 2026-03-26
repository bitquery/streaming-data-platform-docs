---
sidebar_position: 5
---

# Arbitrum Token Market Cap API

Use Bitquery’s **Trading** API **`Tokens`** cube to stream or query **market cap**, **fully diluted valuation (USD)**, **total supply**, **price** (OHLC and averages), and **volume** for tokens traded on **Arbitrum One**. Filter with token/currency **`Id`** values such as **`arbitrum:`** plus a **lowercase** contract address.

For schema details and field meanings, see the **[Tokens cube](/docs/trading/crypto-price-api/tokens)** and **[Supply fields](/docs/trading/crypto-price-api/supply-fields)**.

<head>
<meta name="title" content="Arbitrum Token Market Cap API | Trading Tokens"/>
<meta name="description" content="Stream and query Arbitrum token market cap, FDV, supply, OHLC price, and volume using Bitquery Trading.Tokens GraphQL API."/>
<meta name="keywords" content="arbitrum token market cap, arbitrum one erc20 market cap, arbitrum token api, bitquery trading tokens arbitrum, arbitrum fdv api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>
<meta property="og:type" content="website"/>
<meta property="og:title" content="Arbitrum Token Market Cap API"/>
<meta property="og:description" content="Real-time streams and queries for Arbitrum token market cap, supply, and price via Trading.Tokens."/>
<meta property="twitter:card" content="summary_large_image"/>
<meta property="twitter:title" content="Arbitrum Token Market Cap API"/>
<meta property="twitter:description" content="Real-time streams and queries for Arbitrum token market cap, supply, and price via Trading.Tokens."/>
</head>

:::note Trading API and EVM addresses
On **Arbitrum** (EVM), the **Trading** API expects **lowercase** hex in **`Id`** values (e.g. `arbitrum:0x97e6…`, not mixed-case checksum addresses).
:::

## Related APIs

- **[Ethereum Token Market Cap API](/docs/blockchain/Ethereum/token-supply/ethereum-token-marketcap-api)** — same patterns with **`eth:`** ids
- **[Polygon (Matic) Token Market Cap API](/docs/blockchain/Matic/matic-token-marketcap-api)** — same patterns with **`matic:`** ids
- **[Base Token Market Cap API](/docs/blockchain/Base/base-token-marketcap-api)** — same patterns with **`base:`** ids
- **[Crypto Price API — Tokens](/docs/trading/crypto-price-api/tokens)** — full `Tokens` cube reference

---

## How do I stream live Arbitrum token market cap, price, and volume?

Subscribe to **`Tokens`** where **currency id** includes **`arbitrum`**, with **interval duration** greater than **1** (second). You get **token fields**, **block time**, **supply** (**MarketCap**, **FullyDilutedValuationUsd**), **price** (OHLC and mean), and **volume**.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/arbitrum-token-marketcap-stream).

```graphql
subscription MyQuery {
  Trading {
    Tokens(
      where: {Currency: {Id: {includes: "arbitrum"}}, Interval: {Time: {Duration: {gt: 1}}}}
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

## How do I get the latest market cap for a specific token on Arbitrum?

Use **`limit: { count: 1 }`**, **`orderBy: { descending: Block_Time }`**, and filter **`Token.Id`** with **`includesCaseInsensitive`** (e.g. **`arbitrum:`** + lowercase contract).

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/specific-arbitrum-token-latest-marketcap).

```graphql
query {
  Trading {
    Tokens(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {Token: {Id: {includesCaseInsensitive: "arbitrum:0x97e66d3c4d5bcd7c64e3e55af28544c9addf9281"}}, Interval: {Time: {Duration: {gt: 1}}}}
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

Replace the `includesCaseInsensitive` value with your token’s **`arbitrum:<contract_address>`** id (lowercase hex).

---

## How do I stream Arbitrum tokens with market cap above $1 million?

Subscribe when **`Token.Id`** matches **Arbitrum** (**`arbitrum`**) and **`Supply.MarketCap`** **>** **1,000,000** (USD).

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/realtime-stream-arbitrum-tokens-with-marketcap-above-1-million).

```graphql
subscription {
  Trading {
    Tokens(
      where: {Token: {Id: {includesCaseInsensitive: "arbitrum"}}, Interval: {Time: {Duration: {gt: 1}}}, Supply: {MarketCap: {gt: 1000000}}}
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
