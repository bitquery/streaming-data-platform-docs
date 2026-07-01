import FAQ from "@site/src/components/FAQ";

# Byreal API

:::tip Need real-time Byreal data or anything from the last ~30 days?
Use the [**Trading cube**](https://docs.bitquery.io/docs/trading/trading-data-overview) — [`Trading.Trades`](https://docs.bitquery.io/docs/trading/crypto-trades-api/trades-api) for swap-level rows and [`Trading.Pairs`](https://docs.bitquery.io/docs/trading/crypto-price-api/pairs) for **OHLC**, **volume**, and **market cap**. Both include **USD price and supply** on every row. For **historical data older than ~30 days** and **historical aggregates** (OHLC, volume, top traders), see [Historical Solana aggregate data](https://docs.bitquery.io/docs/blockchain/Solana/historical-aggregate-data/).
:::

Bitquery provides real-time and historical data APIs and streams for **Byreal**, a Solana trading protocol. For **prices, OHLC, volume, market cap, and trader analytics** over the **last ~30 days**, use the [**Crypto Price API**](https://docs.bitquery.io/docs/trading/crypto-price-api/introduction/) (`Trading.Pairs`) and [**Crypto Trades API**](https://docs.bitquery.io/docs/trading/crypto-trades-api/trades-api) (`Trading.Trades`), filtering by **`Market.Program`** **`REALQqNEomY6cQGZJUGwywTBD2UmDT32rZcNnfxQ5N2`**.

For **historical aggregates** going back to **May 2024** — OHLC candlesticks, volume, and time-bucketed analytics on **`DEXTradeByTokens`** with **`dataset: combined`** or **`dataset: archive`** — see [Historical Solana aggregate data](https://docs.bitquery.io/docs/blockchain/Solana/historical-aggregate-data/). Filter those queries by **`Trade.Dex.ProgramAddress`** **`REALQqNEomY6cQGZJUGwywTBD2UmDT32rZcNnfxQ5N2`** for Byreal-specific history.

Need zero-latency Byreal data? [Read about our Shred Streams and Contact us for a Trial](https://docs.bitquery.io/docs/streams/real-time-solana-data/).

:::note
To query or stream data via GraphQL **outside the Bitquery IDE**, you need to generate an API access token.

Follow the steps here to create one: [How to generate Bitquery API token ➤](https://docs.bitquery.io/docs/authorisation/how-to-generate/)
:::

<head>
  <meta name="title" content="Byreal API - Solana - Real-time Trades, Prices, OHLC" />
  <meta name="description" content="Access real-time and historical data for Byreal on Solana using our GraphQL API. Track DEX trades, token prices, OHLC, market cap, and top traders." />
  <meta name="keywords" content="Byreal,Byreal API,Solana DEX,Byreal trading protocol,Solana on-chain API,real-time Solana trades,Byreal token prices,Byreal OHLC data Solana,DEX trading API,crypto trading API,web3 Solana API,Bitquery GraphQL,Solana blockchain data" />
  <meta name="robots" content="index, follow" />
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="language" content="English" />

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Byreal API - Solana - Real-time Trades, Prices, OHLC"
/>
<meta property="og:description" content="Explore real-time Byreal trades, token prices, OHLC, market cap, and volume on Solana using Bitquery GraphQL APIs." />

  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:title" content="Byreal API - Solana - Real-time Trades, Prices, OHLC" />
  <meta property="twitter:description" content="Get on-chain Byreal trading data — swaps, prices, OHLC, and volume — with Bitquery's Solana API." />
</head>

## Byreal Trades in Real-Time — Crypto Trades API

Stream new Byreal swaps via **`Trading.Trades`** with **USD price**, **market cap**, **FDV**, **supply**, **trader address**, and **transaction metadata** on every row. Filter by **`Pair.Market.Program`** **`REALQqNEomY6cQGZJUGwywTBD2UmDT32rZcNnfxQ5N2`**.

For schema details, see the [**Crypto Trades API**](https://docs.bitquery.io/docs/trading/crypto-trades-api/trades-api) and [**Supply fields**](https://docs.bitquery.io/docs/trading/crypto-price-api/supply-fields).

Run the subscription [in the Bitquery IDE](https://ide.bitquery.io/Real-time-trades-on-Byreal-DEX-on-Solana).

<details>
  <summary>Click to expand GraphQL subscription</summary>

```graphql
subscription {
  Trading {
    Trades(
      where: {
        Pair: {
          Market: {
            Network: { is: "Solana" }
            Program: { is: "REALQqNEomY6cQGZJUGwywTBD2UmDT32rZcNnfxQ5N2" }
          }
        }
      }
    ) {
      Side
      Price
      PriceInUsd
      Supply {
        TotalSupply
        FullyDilutedValuationUsd
        MarketCap
      }
      Trader {
        Address
      }
      TransactionHeader {
        Hash
        Fee
        FeePayer
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
        Time
        Timestamp
      }
      Pair {
        Market {
          Address
          Program
          Protocol
          ProtocolFamily
          Network
        }
        Token {
          Address
          Id
          Symbol
          Network
        }
        QuoteToken {
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

</details>

### Stream live prices for a specific Byreal token

Lock onto one token with **`Pair.Token.Id`** (e.g. **`bid:solana:<mint>`**) and the Byreal program address.

Run the subscription [in the Bitquery IDE](https://ide.bitquery.io/Byreal-token-live-prices-using-trades-api).

<details>
  <summary>Click to expand GraphQL subscription</summary>

```graphql
subscription {
  Trading {
    Trades(
      where: {
        Pair: {
          Market: {
            Network: { is: "Solana" }
            Program: { is: "REALQqNEomY6cQGZJUGwywTBD2UmDT32rZcNnfxQ5N2" }
          }
          Token: { Id: { is: "bid:solana:token Mint Address" } }
        }
      }
    ) {
      Side
      Price
      PriceInUsd
      Supply {
        TotalSupply
        FullyDilutedValuationUsd
        MarketCap
      }
      Trader {
        Address
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
        Time
      }
      Pair {
        Token {
          Address
          Symbol
        }
        QuoteToken {
          Address
          Symbol
        }
      }
    }
  }
}
```

</details>

## Market cap — Crypto Price API

Use **`Trading.Pairs`** with **`Market.Program`** **`REALQqNEomY6cQGZJUGwywTBD2UmDT32rZcNnfxQ5N2`** for aggregated **market cap**, **FDV**, **supply**, **price**, and **volume**. Replace **`solana:<mint>`** in **`Token.Id`** with your token.

See the [**Pairs cube**](https://docs.bitquery.io/docs/trading/crypto-price-api/pairs) for full field reference.

### Get latest market cap for a specific Byreal token

Run the query [in the Bitquery IDE](https://ide.bitquery.io/Sandisk---Backpack-Securities-MCAP).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Trading {
    Pairs(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        Token: { Address: { is: "token address here" } }
        Interval: { Time: { Duration: { gt: 1 } } }
        Market: {
          Program: { is: "REALQqNEomY6cQGZJUGwywTBD2UmDT32rZcNnfxQ5N2" }
        }
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
      Market {
        Program
        Protocol
        ProtocolFamily
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

</details>

### Stream Byreal tokens with market cap above $10K

Subscribe when the token is on **Solana**, **`Market.Program`** is Byreal, **`Supply.MarketCap`** **&gt; 10,000** (USD), and interval duration **&gt; 1** second. Adjust **`gt`** to change the threshold.

Run the subscription [in the Bitquery IDE](https://ide.bitquery.io/realtime-stream-byreal-tokens-with-marketcap-above-10k).

<details>
  <summary>Click to expand GraphQL subscription</summary>

```graphql
subscription {
  Trading {
    Pairs(
      where: {
        Interval: { Time: { Duration: { gt: 1 } } }
        Supply: { MarketCap: { gt: 10000 } }
        Market: {
          Program: { is: "REALQqNEomY6cQGZJUGwywTBD2UmDT32rZcNnfxQ5N2" }
        }
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
      Market {
        Protocol
        ProtocolFamily
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

</details>

## Latest Price of a Token on Byreal — Crypto Price API

Returns the latest **OHLC close**, **average price**, and **volume** for a Byreal pair via **`Trading.Pairs`**. Replace **`token Mint Address`** with your SPL mint. Adjust **`Interval.Time.Duration`** for the candle size (e.g. `60` for 1-minute bars).

Run the query [in the Bitquery IDE](https://ide.bitquery.io/latest-price-of-a-token-on-Byreal).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Trading {
    Pairs(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        Market: {
          Network: { is: "Solana" }
          Program: { is: "REALQqNEomY6cQGZJUGwywTBD2UmDT32rZcNnfxQ5N2" }
        }
        Token: { Address: { is: "token Mint Address" } }
        Interval: { Time: { Duration: { eq: 60 } } }
      }
    ) {
      Block {
        Time
      }
      Market {
        Address
        Program
        Protocol
        ProtocolFamily
      }
      Token {
        Address
        Name
        Symbol
      }
      QuoteToken {
        Address
        Symbol
      }
      Price {
        IsQuotedInUsd
        Average {
          Mean
        }
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
      Supply {
        MarketCap
        FullyDilutedValuationUsd
        TotalSupply
      }
    }
  }
}
```

</details>

## Byreal OHLC API — Crypto Price API

Fetch historical **OHLC candles** for a Byreal pair. Set **`Interval.Time.Duration`** to your bar size in seconds (`60` = 1 minute, `3600` = 1 hour). Use as a **query** for historical bars; use a **subscription** for live candle updates.

Run the query [in the Bitquery IDE](https://ide.bitquery.io/Byreal-OHLC-API).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Trading {
    Pairs(
      limit: { count: 100 }
      orderBy: { descending: Block_Time }
      where: {
        Market: {
          Network: { is: "Solana" }
          Program: { is: "REALQqNEomY6cQGZJUGwywTBD2UmDT32rZcNnfxQ5N2" }
        }
        Token: { Address: { is: "token Mint Address" } }
        Interval: { Time: { Duration: { eq: 60 } } }
      }
    ) {
      Block {
        Time
      }
      Interval {
        Time {
          Start
          End
          Duration
        }
      }
      Token {
        Address
        Symbol
      }
      QuoteToken {
        Address
        Symbol
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

</details>

## Get the Top Traders of a specific Token on Byreal — Crypto Trades API

Ranks wallets by **quoted USD volume** on Byreal for a given token. Use as a **query** only — aggregates do not work correctly over subscriptions.

Run the query [in the Bitquery IDE](https://ide.bitquery.io/Get-the-Top-Traders-of-a-specific-Token-on-Byreal-DEX).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Trading {
    Trades(
      limit: { count: 100 }
      orderBy: { descendingByField: "Total_Volume" }
      where: {
        Block: { Time: { since_relative: { hours_ago: 24 } } }
        Pair: {
          Market: {
            Network: { is: "Solana" }
            Program: { is: "REALQqNEomY6cQGZJUGwywTBD2UmDT32rZcNnfxQ5N2" }
          }
          Token: { Id: { is: "bid:solana:token Mint Address" } }
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
    }
  }
}
```

</details>

## Get Trading Volume, Buy Volume, Sell Volume of a Token on Byreal

Run the query [in the Bitquery IDE](https://ide.bitquery.io/Get-trading-volume-buy-volume-sell-volume-of-a-token-on-Byreal-DEX).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Trading {
    Trades(
      where: {
        Block: { Time: { since_relative: { hours_ago: 24 } } }
        Pair: {
          Market: {
            Network: { is: "Solana" }
            Program: { is: "REALQqNEomY6cQGZJUGwywTBD2UmDT32rZcNnfxQ5N2" }
          }
          Token: { Id: { is: "bid:solana:token Mint Address" } }
        }
      }
    ) {
      Trades_count: count
      total_volume: sum(of: AmountsInUsd_Quote)
      buy_volume: sum(of: AmountsInUsd_Quote, if: { Side: { is: "Buy" } })
      sell_volume: sum(of: AmountsInUsd_Quote, if: { Side: { is: "Sell" } })
      buys: count(if: { Side: { is: "Buy" } })
      sells: count(if: { Side: { is: "Sell" } })
      Pair {
        Token {
          Address
          Symbol
        }
        QuoteToken {
          Address
          Symbol
        }
      }
    }
  }
}
```

</details>

## Historical data and aggregates

The **Trading APIs** on this page cover **real-time streams** and roughly the **last ~30 days** of Byreal trades, prices, and OHLC.

For **older Byreal history** and **historical aggregates** — OHLC candlesticks, volume buckets, and time-series analytics from **May 2024** onward — use chain-level queries on **`Solana(dataset: combined)`** or **`Solana(dataset: archive)`** with **`DEXTradeByTokens`**. Filter by **`Trade.Dex.ProgramAddress`** **`REALQqNEomY6cQGZJUGwywTBD2UmDT32rZcNnfxQ5N2`**.

See the full guide with working examples: [Historical Solana aggregate data](https://docs.bitquery.io/docs/blockchain/Solana/historical-aggregate-data/).

For a Byreal-specific historical OHLC starting point, try [Byreal historical OHLC — DEXTradeByTokens](https://ide.bitquery.io/Byreal-historical-OHLC-DEXTradeByTokens) in the IDE (uses **`Solana(dataset: combined)`** and **`Trade.Dex.ProgramAddress`** **`REALQqNEomY6cQGZJUGwywTBD2UmDT32rZcNnfxQ5N2`**).

:::note
Historical aggregate queries use **`query`** only — **`sum`**, **`count`**, and interval-based OHLC do not work reliably as **`subscription`** websockets.
:::

<FAQ
items={[
{ q: "What is the Byreal program address on Solana?", a: "REALQqNEomY6cQGZJUGwywTBD2UmDT32rZcNnfxQ5N2. Filter Trading.Trades and Trading.Pairs with Pair.Market.Program or Market.Program." },
{ q: "How do I get Byreal token prices with USD on every row?", a: "Use Trading.Trades filtered by Pair.Market.Program REALQqNEomY6cQGZJUGwywTBD2UmDT32rZcNnfxQ5N2 for real-time and the last ~30 days. Each row includes PriceInUsd, market cap, and supply." },
{ q: "How do I get OHLC for a Byreal pair?", a: "Use Trading.Pairs with Market.Program and Interval.Time.Duration — OHLC is in Price.Ohlc (Open, High, Low, Close). Subscribe for live candles or query for bars within the last ~30 days." },
{ q: "How do I get historical Byreal OHLC and volume older than ~30 days?", a: "Use Solana(dataset: combined) or archive with DEXTradeByTokens, filtered by Trade.Dex.ProgramAddress REALQqNEomY6cQGZJUGwywTBD2UmDT32rZcNnfxQ5N2. See Historical Solana aggregate data for examples." },
{ q: "Do I need an API key outside the IDE?", a: "Yes. Generate an OAuth token from your Bitquery account to run queries in your app or bot." },
]}
/>

## Related Documentation

- [Crypto Trades API](https://docs.bitquery.io/docs/trading/crypto-trades-api/trades-api)
- [Crypto Price API — Pairs](https://docs.bitquery.io/docs/trading/crypto-price-api/pairs)
- [Crypto Price API — OHLC](https://docs.bitquery.io/docs/trading/crypto-price-api/crypto-ohlc-candle-k-line-api)
- [Traders API](https://docs.bitquery.io/docs/trading/crypto-trades-api/traders-api)
- [Historical Solana aggregate data](https://docs.bitquery.io/docs/blockchain/Solana/historical-aggregate-data/)
- [Real-time Solana Data Streams](https://docs.bitquery.io/docs/streams/real-time-solana-data/)
- [API Authorization](https://docs.bitquery.io/docs/authorisation/how-to-use/)
