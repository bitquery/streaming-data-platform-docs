---
sidebar_position: 2
---

# Ethereum Token Market Cap API

Use Bitquery’s **Trading** API **`Tokens`** cube to stream or query **market cap**, **fully diluted valuation (USD)**, **total supply**, **price** (OHLC and averages), and **volume** for tokens traded on **Ethereum**. Rows are tied to a time **interval**; filter Ethereum assets via token/currency **`Id`** (for example `eth:` plus the contract address).

For schema details and field meanings, see the **[Tokens cube](/docs/trading/crypto-price-api/tokens)** and **[Supply fields](/docs/trading/crypto-price-api/supply-fields)**.

<head>
<meta name="title" content="Ethereum Token Market Cap API | Trading Tokens"/>
<meta name="description" content="Stream and query Ethereum ERC-20 market cap, FDV, supply, OHLC price, and volume using Bitquery Trading.Tokens GraphQL API."/>
<meta name="keywords" content="ethereum token market cap, erc20 market cap api, token fdv api, trading tokens api, bitquery trading, ethereum token supply price"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>
<meta property="og:type" content="website"/>
<meta property="og:title" content="Ethereum Token Market Cap API"/>
<meta property="og:description" content="Real-time streams and queries for Ethereum token market cap, supply, and price via Trading.Tokens."/>
<meta property="twitter:card" content="summary_large_image"/>
<meta property="twitter:title" content="Ethereum Token Market Cap API"/>
<meta property="twitter:description" content="Real-time streams and queries for Ethereum token market cap, supply, and price via Trading.Tokens."/>
</head>

:::note Trading API and EVM addresses
In the **Trading** API, use **lowercase** hex for EVM contract addresses in token/currency **`Id`** values (e.g. `eth:0xabc…`, not checksum `0xAbC…`).
:::

## Related APIs

- **[Polygon (Matic) Token Market Cap API](/docs/blockchain/Matic/matic-token-marketcap-api)** — same **`Trading.Tokens`** patterns on Polygon (`matic:` ids)
- **[Arbitrum Token Market Cap API](/docs/blockchain/Arbitrum/arbitrum-token-marketcap-api)** — same **`Trading.Tokens`** patterns on Arbitrum (`arbitrum:` ids)
- **[Base Token Market Cap API](/docs/blockchain/Base/base-token-marketcap-api)** — same **`Trading.Tokens`** patterns on Base (`base:` ids)
- **[EVM Token Supply API](/docs/blockchain/Ethereum/token-supply/evm-token-supply)** — on-chain total supply via `EVM` / `TransactionBalances`
- **[Crypto Price API — Tokens](/docs/trading/crypto-price-api/tokens)** — full `Tokens` cube reference

---

## How do I stream live Ethereum token market cap, price, and volume?

Subscribe to **`Tokens`** updates for assets whose **currency id** includes **`eth`** (Ethereum), with an **interval duration** greater than **1** (second). Each payload can include **token metadata**, **block time**, **supply** (including **MarketCap** and **FullyDilutedValuationUsd**), **price** (OHLC and average mean), and **volume**.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/ethereum-token-marketcap-stream_1).

```graphql
subscription MyQuery {
  Trading {
    Tokens(
      where: {
        Currency: { Id: { includes: "eth" } }
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

## How do I get the latest market cap for a specific Ethereum token?

Return the **most recent** row for one token by **`Token.Id`** (e.g. `eth:` + **lowercase** contract address). Use **`limit: { count: 1 }`** and **`orderBy: { descending: Block_Time }`**.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/specific-ethereum-token-latest-marketcap_1).

```graphql
query {
  Trading {
    Tokens(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        Token: {
          Id: { includes: "eth:0xe53ec727dbdeb9e2d5456c3be40cff031ab40a55" }
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

Replace the `includesCaseInsensitive` value with your token’s **`eth:<contract_address>`** id.

---

## How do I stream Ethereum tokens with market cap above $1 million?

Subscribe to **`Tokens`** where the token id matches Ethereum (**`eth`**) and **`Supply.MarketCap`** is **greater than 1,000,000** (USD). The example selects **currency**, **supply**, and **market cap** fields suitable for dashboards and alerts.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/realtime-stream-ethereum-tokens-with-marketcap-above-1-million).

```graphql
subscription {
  Trading {
    Tokens(
      where: {
        Token: { Id: { includes: "eth" } }
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
Adjust **`Supply.MarketCap`** and **`Interval.Time.Duration`** filters to match your use case. See **[Tokens cube](/docs/trading/crypto-price-api/tokens)** for other filter fields.
:::
