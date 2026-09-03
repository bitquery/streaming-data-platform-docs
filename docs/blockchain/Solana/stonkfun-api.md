---
title: "StonkFun API - Solana - New Launches, Trades, Live Prices"
description: "StonkFun API - Solana: track StonkFun token launches paired with xStocks, and query trades, USD prices, OHLC candles and market cap with Bitquery GraphQL examples."
---
import FAQ from "@site/src/components/FAQ";

# StonkFun API - Solana - New Launches, Trades, Live Prices

:::tip Need real-time StonkFun data or anything from the last ~30 days?
For **real-time + last ~30 days**, use the [**Trading cube**](/docs/trading/trading-data-overview) — [`Trading.Trades`](/docs/trading/crypto-trades-api/trades-api) gives you clean swaps with **USD price, market cap, and supply on every row**, and [`Trading.Tokens`](/docs/trading/crypto-price-api/tokens) / [`Trading.Pairs`](/docs/trading/crypto-price-api/pairs) give you ready-made OHLC candles. Use the `DEXTradeByTokens` examples at the end of this page only for **historical StonkFun data older than ~30 days**.
:::

[StonkFun](https://www.stonkfun.xyz/) is a Solana launchpad where every new coin is paired with a quote asset of the creator's choice: tokenized stocks such as SPYx, NVDAx and TSLAx from [xStocks](/docs/blockchain/Solana/xstocks-api/), PreStocks such as OPENAI and ANTHROPIC, SOL, USDC, or another StonkFun coin. There is no bonding curve and no migration. Each launch is a single transaction that mints the token and opens a one-sided **Raydium CLMM** pool, so the pool address never changes for the life of the token.

You can also check out our [Raydium CLMM API Docs](/docs/blockchain/Solana/raydium-clmm-API/), [xStocks API Docs](/docs/blockchain/Solana/xstocks-api/) and [LetsBonk.fun API Docs](/docs/blockchain/Solana/letsbonk-api/).

:::note
To query or stream data via graphQL **outside the Bitquery IDE**, you need to generate an API access token.

Follow the steps here to create one: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

If you want fastest data without any latency, we can provide Kafka streams, please [fill this form](https://bitquery.io/forms/api) for it. Our Team will reach out.

## How StonkFun works on-chain

| What                          | Address                                        | Notes                                                                 |
| ----------------------------- | ---------------------------------------------- | --------------------------------------------------------------------- |
| Raydium CLMM program          | `CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK` | Appears as `amm_v3` in `Dex.ProtocolName` and `Market.Protocol`       |
| StonkFun launcher wallet      | `5CEbueQnq1Ym2uSSx2xXds3jQAqT1BDnkA59RZobSPAG` | Signs every StonkFun launch and every Burn & Earn buyback             |
| Raydium amm config, 1% fee    | `A1BBtTYJd4i3xU8D6Tc2FzU6ZN4oXZWXKZnCxwbHXr8x` | Default fee tier used by StonkFun pools                               |
| STONK (platform token)        | `6GmAFSYs4gk3FDao5FzzySQpPZaWsa4rUJHacpMpUNgx` | Used as the example token on this page                                |
| STONK / SPYx pool             | `7a8xxAJBELDo6P9dikSYctdw6ce8F4mWr3ahcAD8Ao49` | Used as the example pool on this page                                 |
| SPYx (xStocks S&P 500)        | `XsoCS1TfEyfFhfvj8EtZ528L3CaKBDBRqRapnBbDF2W` | Most common quote asset                                               |

A launch transaction does all of this in one signature:

1. Creates the mint with 1,000,000,000 supply and 9 decimals. "Standard" launches use the classic SPL Token program; "reward" launches use Token-2022 with a transfer-fee extension. Mint and freeze authorities are revoked in the same transaction.
2. Calls Raydium CLMM `create_customizable_pool` for the new token against the chosen quote asset.
3. Opens two one-sided liquidity positions with the full supply (950M + 50M), starting at roughly $5,000 market cap.
4. Optionally performs the creator's dev buy as a `swapV2` in the same transaction.

"Graduation" on the StonkFun site is a label applied at $40k market cap. Nothing moves on-chain, so the queries below work for a token before and after graduation.

## Track StonkFun Token Launches in Real Time

Every StonkFun launch is a Raydium CLMM `create_customizable_pool` instruction signed by the StonkFun launcher wallet. Our decoder currently does not name this instruction, so `Program.Method` is empty for it; filter on the instruction data prefix `2B44D4A7592FA401` (the instruction discriminator) together with the launcher wallet as `Transaction.Signer`. Tested against StonkFun's own launch ledger, this filter matched every launch with no false positives.

The pool address is the third account in the `Accounts` array. The two mints are the fourth and fifth accounts, ordered by public key, so the new token can be in either slot: the new token is the mint whose `Token.Owner` and metadata were created in the same signature, and the other one is the quote asset.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription StonkFunLaunches {
  Solana {
    Instructions(
      where: {
        Instruction: {
          Program: {
            Address: { is: "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK" }
          }
          Data: { startsWith: "2B44D4A7592FA401" }
        }
        Transaction: {
          Signer: { is: "5CEbueQnq1Ym2uSSx2xXds3jQAqT1BDnkA59RZobSPAG" }
          Result: { Success: true }
        }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Signature
        Signer
      }
      Instruction {
        Data
        Accounts {
          Address
          IsWritable
          Token {
            Mint
            Owner
            ProgramId
          }
        }
        Program {
          Address
          Name
          Method
        }
      }
    }
  }
}
```

</details>

Account positions in the `create_customizable_pool` instruction:

| Index | Account                                   |
| ----- | ----------------------------------------- |
| 0     | Pool creator (StonkFun launcher wallet)   |
| 1     | Raydium amm config (fee tier)             |
| 2     | **Pool state** (the market address)       |
| 3     | Token mint 0                              |
| 4     | Token mint 1                              |
| 5, 6  | Token vaults 0 and 1                      |
| 7     | Observation state                         |
| 8     | Tick array bitmap                         |
| 9, 10 | Token programs for mint 0 and mint 1      |
| 11    | System program                            |
| 12    | Rent sysvar                               |

To catch the creator's dev buy, subscribe to `swapV2` instructions on the same program and match on `Transaction.Signature`.

## Latest StonkFun Trades using the Trading API

StonkFun pools are ordinary Raydium CLMM pools, so the cleanest way to get their trades is the [Trading cube](/docs/trading/trading-data-overview). Every row already carries the USD price and market cap of the token at the time of the trade, and router hops from Jupiter or DFlow are attributed to the pool they hit, so nothing is double counted.

The query below returns the latest trades on all Raydium CLMM pools quoted in SPYx, which is where most StonkFun activity is. Swap the `QuoteToken.Address` for any other quote asset listed on StonkFun (NVDAx, TSLAx, USDC, STONK itself) to follow that segment. Keep a `Block.Time` window on program-wide queries; without one the scan across all Raydium CLMM pools can time out.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query LatestStonkFunTrades {
  Trading {
    Trades(
      where: {
        Pair: {
          Market: {
            Network: { is: "Solana" }
            Program: { is: "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK" }
          }
          QuoteToken: {
            Address: { is: "XsoCS1TfEyfFhfvj8EtZ528L3CaKBDBRqRapnBbDF2W" }
          }
        }
        Block: { Time: { since_relative: { hours_ago: 6 } } }
      }
      orderBy: { descending: Block_Time }
      limit: { count: 50 }
    ) {
      Block {
        Time
      }
      Side
      Price
      PriceInUsd
      Amounts {
        Base
        Quote
      }
      AmountsInUsd {
        Base
        Quote
      }
      Supply {
        MarketCap
      }
      Trader {
        Address
      }
      Pair {
        Token {
          Symbol
          Name
          Address
        }
        QuoteToken {
          Symbol
          Address
        }
        Market {
          Address
          Program
          Protocol
          Network
        }
      }
      TransactionHeader {
        Hash
      }
    }
  }
}
```

</details>

Note that in `Trading.Trades`, `Price` and `PriceInUsd` are plain float fields with no sub-selection, and `Side` is a string (`Buy` or `Sell`).

To get trades in real time, change `query` to `subscription` and remove the `orderBy` and `limit` arguments. The same can be tracked using [Bitquery Kafka Streams](/docs/streams/kafka-streaming-concepts/).

## Latest Trades of a Specific StonkFun Token

To follow one token, filter on `Pair.Token.Address` (the mint) or on `Pair.Market.Address` (the pool). Filtering by pool is the exact equivalent of the chart on the StonkFun token page.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query LatestTradesOfStonkFunToken {
  Trading {
    Trades(
      where: {
        Pair: {
          Token: {
            Address: { is: "6GmAFSYs4gk3FDao5FzzySQpPZaWsa4rUJHacpMpUNgx" }
          }
          Market: {
            Address: { is: "7a8xxAJBELDo6P9dikSYctdw6ce8F4mWr3ahcAD8Ao49" }
          }
        }
      }
      orderBy: { descending: Block_Time }
      limit: { count: 50 }
    ) {
      Block {
        Time
      }
      Side
      Price
      PriceInUsd
      Amounts {
        Base
        Quote
      }
      AmountsInUsd {
        Base
        Quote
      }
      Supply {
        MarketCap
      }
      Trader {
        Address
      }
      TransactionHeader {
        Hash
      }
    }
  }
}
```

</details>

## Latest Price and Market Cap of a StonkFun Token

[`Trading.Tokens`](/docs/trading/crypto-price-api/tokens) aggregates every pool of a token into one USD price series. The one-minute interval with `limit: 1` gives you the latest price, volume and market cap in a single row.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query LatestStonkFunTokenPrice {
  Trading {
    Tokens(
      where: {
        Token: {
          Address: { is: "6GmAFSYs4gk3FDao5FzzySQpPZaWsa4rUJHacpMpUNgx" }
        }
        Interval: { Time: { Duration: { eq: 60 } } }
      }
      orderBy: { descending: Block_Time }
      limit: { count: 1 }
    ) {
      Block {
        Time
      }
      Token {
        Symbol
        Name
        Address
      }
      Price {
        Ohlc {
          Close
        }
        IsQuotedInUsd
      }
      Volume {
        Usd
      }
      Supply {
        MarketCap
        CirculatingSupply
        TotalSupply
      }
    }
  }
}
```

</details>

To stream price updates, change `query` to `subscription` and remove `orderBy` and `limit`.

## OHLC Candles of a StonkFun Token (Trading API)

The same cube serves candles at 1, 3, 5, 10, 30 and 60 seconds and at 5, 15, 30 and 60 minutes. Set `Interval.Time.Duration` in seconds. The example returns hourly candles for the last two days.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query StonkFunTokenOHLC {
  Trading {
    Tokens(
      where: {
        Token: {
          Address: { is: "6GmAFSYs4gk3FDao5FzzySQpPZaWsa4rUJHacpMpUNgx" }
        }
        Interval: { Time: { Duration: { eq: 3600 } } }
        Block: { Time: { since_relative: { hours_ago: 48 } } }
      }
      orderBy: { descending: Block_Time }
      limit: { count: 48 }
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
      Price {
        Ohlc {
          Open
          High
          Low
          Close
        }
        Average {
          Mean
        }
        IsQuotedInUsd
      }
      Volume {
        Usd
        Base
      }
    }
  }
}
```

</details>

## OHLC Candles of a StonkFun Pool

[`Trading.Pairs`](/docs/trading/crypto-price-api/pairs) gives candles per pool, with volume in both the token and the quote asset. Use it when you want the STONK / SPYx chart specifically rather than the token-wide price.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query StonkFunPoolOHLC {
  Trading {
    Pairs(
      where: {
        Market: {
          Address: { is: "7a8xxAJBELDo6P9dikSYctdw6ce8F4mWr3ahcAD8Ao49" }
        }
        Interval: { Time: { Duration: { eq: 300 } } }
        Block: { Time: { since_relative: { hours_ago: 6 } } }
      }
      orderBy: { descending: Block_Time }
      limit: { count: 72 }
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
        Symbol
        Address
      }
      QuoteToken {
        Symbol
        Address
      }
      Price {
        Ohlc {
          Open
          High
          Low
          Close
        }
        IsQuotedInUsd
      }
      Volume {
        Usd
        Base
        Quote
      }
    }
  }
}
```

</details>

## Top Traders of a StonkFun Token

Aggregate `Trading.Trades` by trader to rank the most active wallets over a time window. `AmountsInUsd_Base` is the USD value of the StonkFun token side of each trade.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query TopStonkFunTraders {
  Trading {
    Trades(
      where: {
        Pair: {
          Token: {
            Address: { is: "6GmAFSYs4gk3FDao5FzzySQpPZaWsa4rUJHacpMpUNgx" }
          }
          Market: { Network: { is: "Solana" } }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      orderBy: { descendingByField: "volumeUsd" }
      limit: { count: 100 }
    ) {
      Trader {
        Address
      }
      volumeUsd: sum(of: AmountsInUsd_Base)
      trades: count
    }
  }
}
```

</details>

## Liquidity of a StonkFun Pool

`DEXPools` returns the pool reserves after every liquidity change or trade. `Base` and `Quote` follow the pool's own ordering; for STONK / SPYx the base is SPYx and the quote is STONK.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query StonkFunPoolLiquidity {
  Solana {
    DEXPools(
      where: {
        Pool: {
          Market: {
            MarketAddress: { is: "7a8xxAJBELDo6P9dikSYctdw6ce8F4mWr3ahcAD8Ao49" }
          }
        }
        Transaction: { Result: { Success: true } }
      }
      orderBy: { descending: Block_Time }
      limit: { count: 1 }
    ) {
      Block {
        Time
      }
      Pool {
        Dex {
          ProtocolName
        }
        Market {
          BaseCurrency {
            MintAddress
            Symbol
          }
          QuoteCurrency {
            MintAddress
            Symbol
          }
        }
        Base {
          PostAmount
          PostAmountInUSD
          PriceInUSD
        }
        Quote {
          PostAmount
          PostAmountInUSD
        }
      }
    }
  }
}
```

</details>

## Top Holders of a StonkFun Token

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query StonkFunTopHolders {
  Solana {
    BalanceUpdates(
      where: {
        BalanceUpdate: {
          Currency: {
            MintAddress: { is: "6GmAFSYs4gk3FDao5FzzySQpPZaWsa4rUJHacpMpUNgx" }
          }
        }
      }
      orderBy: { descendingByField: "BalanceUpdate_Holding_maximum" }
      limit: { count: 100 }
    ) {
      BalanceUpdate {
        Account {
          Address
          Owner
        }
        Holding: PostBalance(maximum: Block_Slot)
        Currency {
          Symbol
        }
      }
    }
  }
}
```

</details>

## Track StonkFun Burn & Earn Buybacks

StonkFun sweeps trading fees, buys STONK and burns it from the launcher wallet. Each buyback is a `burnChecked` that lowers the supply, so the whole buyback history is one `TokenSupplyUpdates` query. Change `query` to `subscription` to get each burn as it happens.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query StonkFunBurns {
  Solana {
    TokenSupplyUpdates(
      where: {
        TokenSupplyUpdate: {
          Currency: {
            MintAddress: { is: "6GmAFSYs4gk3FDao5FzzySQpPZaWsa4rUJHacpMpUNgx" }
          }
          Amount: { lt: "0" }
        }
        Transaction: {
          Signer: { is: "5CEbueQnq1Ym2uSSx2xXds3jQAqT1BDnkA59RZobSPAG" }
        }
      }
      orderBy: { descending: Block_Time }
      limit: { count: 100 }
    ) {
      Block {
        Time
      }
      Transaction {
        Signature
      }
      TokenSupplyUpdate {
        Amount
        PostBalance
        Currency {
          Symbol
          Decimals
        }
      }
    }
  }
}
```

</details>

## Historical StonkFun Data older than 30 days

For history beyond the Trading cube window, use `DEXTradeByTokens` on the `combined` dataset. Always filter on the pool's `MarketAddress` so that aggregator hops and pools where the token is used as a quote asset are excluded; otherwise a token-level sum overstates volume.

### Daily Volume of a StonkFun Pool since Launch

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query StonkFunDailyVolume {
  Solana(dataset: combined) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: {
            MintAddress: { is: "6GmAFSYs4gk3FDao5FzzySQpPZaWsa4rUJHacpMpUNgx" }
          }
          Market: {
            MarketAddress: { is: "7a8xxAJBELDo6P9dikSYctdw6ce8F4mWr3ahcAD8Ao49" }
          }
        }
        Block: { Time: { since: "2026-07-23T00:00:00Z" } }
      }
      orderBy: { ascending: Block_Date }
      limit: { count: 365 }
    ) {
      Block {
        Date
      }
      trades: count
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
      priceUsd: median(of: Trade_PriceInUSD)
    }
  }
}
```

</details>

### Historical Hourly OHLC of a StonkFun Pool

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query StonkFunHistoricalOHLC {
  Solana(dataset: combined) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: {
            MintAddress: { is: "6GmAFSYs4gk3FDao5FzzySQpPZaWsa4rUJHacpMpUNgx" }
          }
          Market: {
            MarketAddress: { is: "7a8xxAJBELDo6P9dikSYctdw6ce8F4mWr3ahcAD8Ao49" }
          }
        }
        Block: { Time: { since: "2026-07-23T00:00:00Z" } }
      }
      orderBy: { descendingByField: "Block_Timefield" }
      limit: { count: 1000 }
    ) {
      Block {
        Timefield: Time(interval: { count: 1, in: hours })
      }
      Trade {
        open: PriceInUSD(minimum: Block_Slot)
        high: PriceInUSD(maximum: Trade_PriceInUSD)
        low: PriceInUSD(minimum: Trade_PriceInUSD)
        close: PriceInUSD(maximum: Block_Slot)
      }
      volumeInUSD: sum(of: Trade_Side_AmountInUSD)
      count
    }
  }
}
```

</details>

<FAQ
  items={[
    { q: "What is StonkFun and how is it indexed?", a: "StonkFun is a Solana launchpad that pairs new coins with tokenized stocks and other quote assets. Every launch creates a Raydium CLMM pool, so Bitquery indexes StonkFun tokens like any other Raydium CLMM market." },
    { q: "How do I detect new StonkFun launches?", a: "Subscribe to Raydium CLMM instructions whose data starts with 2B44D4A7592FA401 (create_customizable_pool) and whose signer is the StonkFun launcher wallet. The pool address is the third account and the two mints are the fourth and fifth." },
    { q: "How do I get StonkFun token prices and trades?", a: "Use the Trading cube: Trading.Trades for individual swaps with USD price and market cap, Trading.Tokens for token-level candles and Trading.Pairs for per-pool candles. Use DEXTradeByTokens on the combined dataset only for history older than about 30 days." },
    { q: "Do I need an API key outside the IDE?", a: "Yes. Generate an OAuth token from your Bitquery account to run queries in your app or bot." },
  ]}
/>
