---
title: "StonkFun API - Solana - New Launches, Trades, Live Prices"
description: "StonkFun API on Solana: stream StonkFun launches on Raydium LaunchLab, bonding curve progress, graduations, trades, USD prices and OHLC with Bitquery GraphQL."
keywords:
  [
    "StonkFun API",
    "StonkFun launchpad",
    "StonkFun new token launches",
    "StonkFun bonding curve",
    "StonkFun graduation",
    "StonkFun trades API",
    "StonkFun price API",
    "STONK token API",
    "xStocks paired tokens Solana",
    "Raydium LaunchLab StonkFun",
    "Bitquery StonkFun API",
  ]
---
import FAQ from "@site/src/components/FAQ";

# StonkFun API - Solana - New Launches, Trades, Live Prices

:::tip Need real-time StonkFun data or anything from the last ~30 days?
For **real-time + last ~30 days**, use the [**Trading cube**](/docs/trading/trading-data-overview): [`Trading.Trades`](/docs/trading/crypto-trades-api/trades-api) gives you clean swaps with **USD price, market cap, and supply on every row**, and [`Trading.Tokens`](/docs/trading/crypto-price-api/tokens) / [`Trading.Pairs`](/docs/trading/crypto-price-api/pairs) give you ready-made OHLC candles. Use the `DEXTradeByTokens` examples at the end of this page only for **historical StonkFun data older than ~30 days**.
:::

[StonkFun](https://www.stonkfun.xyz/) is a Solana launchpad where every new coin is paired with a quote asset of the creator's choice: tokenized stocks such as SPYx, NVDAx and QQQx from [xStocks](/docs/blockchain/Solana/xstocks-api/), pre-IPO tokens from PreStocks such as OPENAI and ANTHROPIC, crypto assets such as ZEC, WBTC and HYPE, SOL, or another StonkFun coin.

Since September 2026 new StonkFun launches run on [Raydium LaunchLab](/docs/blockchain/Solana/launchpad-raydium/): the token trades on a bonding curve first and graduates into a [Raydium CPMM](/docs/blockchain/Solana/raydium-cpmm-API/) pool once the curve has raised its target in the quote asset. Before that, every StonkFun launch opened a one-sided [Raydium CLMM](/docs/blockchain/Solana/raydium-clmm-API/) pool directly, and that direct-pool path still shows up on-chain. This page covers both, plus trades, prices, candles, holders and the Burn & Earn buybacks of the platform token STONK.

You can also check out our [Raydium LaunchLab API Docs](/docs/blockchain/Solana/launchpad-raydium/), [xStocks API Docs](/docs/blockchain/Solana/xstocks-api/) and [LetsBonk.fun API Docs](/docs/blockchain/Solana/letsbonk-api/), which runs on the same LaunchLab program.

:::note
To query or stream data via graphQL **outside the Bitquery IDE**, you need to generate an API access token.

Follow the steps here to create one: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

If you want fastest data without any latency, we can provide Kafka streams, please [fill this form](https://bitquery.io/forms/api) for it. Our Team will reach out.

## How StonkFun works on-chain

| What                                       | Address                                        | Notes                                                                                 |
| ------------------------------------------ | ---------------------------------------------- | ------------------------------------------------------------------------------------- |
| Raydium LaunchLab program                  | `LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj` | Bonding-curve launches. `raydium_launchpad` in `Dex.ProtocolName` and `Market.Protocol` |
| StonkFun platform config, reward launches  | `6BwHHDg3u1854jC8PDLXvR4spTcLNaoBxLJNGC4nTESt` | Token-2022 mints with a 1% or 3% transfer fee, the source of StonkFun's reward payouts |
| StonkFun platform config, standard launches | `4E876qZTE9FJMrBzgVtBrSrzz2TLivB5Y5QXPjB4gZL7` | Token-2022 mints without a transfer fee                                               |
| Raydium CPMM program                       | `CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C` | Where graduated tokens trade. `raydium_cp_swap`                                       |
| CPMM fee config used at graduation         | `CRRS5ieQmBrZjWhcj99JuGrT5tyuWDaGAXLXLFjbAtjQ` | 0.25% trade fee tier                                                                  |
| Raydium CLMM program                       | `CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK` | Direct-pool launches. `amm_v3`                                                        |
| StonkFun launcher and fee wallet           | `5CEbueQnq1Ym2uSSx2xXds3jQAqT1BDnkA59RZobSPAG` | Platform fee wallet of both configs, signs direct-pool launches and Burn & Earn burns  |
| STONK (platform token)                     | `6GmAFSYs4gk3FDao5FzzySQpPZaWsa4rUJHacpMpUNgx` | Used as the example token on this page                                                |
| STONK / SPYx pool (CLMM)                   | `7a8xxAJBELDo6P9dikSYctdw6ce8F4mWr3ahcAD8Ao49` | Used as the example pool on this page                                                 |
| SPYx (xStocks S&P 500)                     | `XsoCS1TfEyfFhfvj8EtZ528L3CaKBDBRqRapnBbDF2W` | Most common stock quote asset                                                         |

Both platform configs carry the name `StonkFun` on-chain and share the same fee settings. The only difference is the launch type: reward launches add a Token-2022 transfer-fee extension to the new mint, standard launches do not.

### Bonding-curve launch on Raydium LaunchLab

A launch is one `initialize_with_token_2022` instruction on the LaunchLab program that references a StonkFun platform config. It does the following:

1. Creates the base mint with 1,000,000,000 supply and 6 decimals on the Token-2022 program. Reward launches attach a transfer fee of 100 or 300 basis points. Its authority is `5KXDF6QnqhBj72hDtJNkkpFaQVUfbFXNybMsp3DiK6tD`, the wallet that also sends out StonkFun's reward payouts.
2. Opens a constant-product bonding curve that sells 793,100,000 tokens (79.31% of supply). The graduation target is `total_quote_fund_raising`, expressed in the quote asset's smallest unit. StonkFun converts a fixed dollar target into the quote asset at launch time, so the number differs from launch to launch even for the same quote asset. Read it from the launch instruction instead of hard-coding it.
3. Charges a 1% fee on every curve trade, set by `fee_rate` (10,000 out of 1,000,000) on the platform config and paid in the quote asset. Raydium's 0.25% protocol fee, the RAY buyback share, comes out of that 1% rather than on top of it, and the rest goes to the StonkFun fee wallet. The creator fee rate is 0. On buys the fee comes off the quote amount before the curve math; on sells it comes off the quote amount the curve pays out.
4. Optionally runs the creator's dev buy as a `buy_exact_in` instruction in the same transaction.

When the quote vault reaches the target, LaunchLab calls `migrate_to_cpswap`: the remaining 206,900,000 tokens and the raised quote asset seed a Raydium CPMM pool on the 0.25% fee tier. The whole LP position is locked to the platform (`platform_scale` 1,000,000, nothing burned, no creator share), which is how StonkFun keeps earning fees from graduated pools.

### Direct-pool launch on Raydium CLMM

The original StonkFun mode mints the token and opens a one-sided Raydium CLMM pool in a single transaction signed by the launcher wallet: 1,000,000,000 supply with 9 decimals, mint and freeze authorities revoked, two one-sided positions holding the full supply (950M + 50M) and an optional dev buy as `swapV2`. There is no curve, no migration and no on-chain graduation, so the pool address never changes.

## Track StonkFun Token Launches on Raydium LaunchLab in Real Time

Subscribe to LaunchLab `initialize_with_token_2022` instructions whose accounts include one of the two StonkFun platform configs. `initialize_v2` is included for completeness; it is the variant LaunchLab uses for classic SPL Token mints. `Program.AccountNames` names every account in the instruction, and `Program.Arguments` returns the decoded mint, curve and transfer-fee parameters.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription StonkFunLaunchLabLaunches {
  Solana {
    Instructions(
      where: {
        Instruction: {
          Program: {
            Address: { is: "LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj" }
            Method: { in: ["initialize_v2", "initialize_with_token_2022"] }
          }
          Accounts: {
            includes: {
              Address: {
                in: [
                  "6BwHHDg3u1854jC8PDLXvR4spTcLNaoBxLJNGC4nTESt"
                  "4E876qZTE9FJMrBzgVtBrSrzz2TLivB5Y5QXPjB4gZL7"
                ]
              }
            }
          }
        }
        Transaction: { Result: { Success: true } }
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
        Program {
          Method
          AccountNames
          Arguments {
            Name
            Type
            Value {
              ... on Solana_ABI_Integer_Value_Arg {
                integer
              }
              ... on Solana_ABI_String_Value_Arg {
                string
              }
              ... on Solana_ABI_Address_Value_Arg {
                address
              }
              ... on Solana_ABI_BigInt_Value_Arg {
                bigInteger
              }
              ... on Solana_ABI_Bytes_Value_Arg {
                hex
              }
              ... on Solana_ABI_Boolean_Value_Arg {
                bool
              }
              ... on Solana_ABI_Float_Value_Arg {
                float
              }
              ... on Solana_ABI_Json_Value_Arg {
                json
              }
            }
          }
        }
        Accounts {
          Address
          IsWritable
          Token {
            Mint
            Owner
            ProgramId
          }
        }
      }
    }
  }
}
```

</details>

Account positions in the `initialize_with_token_2022` instruction (the same order as `AccountNames`):

| Index | Account                                            |
| ----- | -------------------------------------------------- |
| 0     | Payer                                              |
| 1     | Creator                                            |
| 2     | LaunchLab global config                            |
| 3     | **StonkFun platform config** (reward or standard)  |
| 4     | LaunchLab authority                                |
| 5     | **Pool state** (the bonding-curve market address)  |
| 6     | **Base mint** (the new StonkFun token)             |
| 7     | **Quote mint** (SPYx, OPENAI, ZEC, SOL, ...)       |
| 8, 9  | Base and quote vaults                              |
| 10, 11 | Token programs for base and quote                 |
| 12    | System program                                     |
| 13    | Event authority                                    |
| 14    | LaunchLab program                                  |

Arguments worth reading:

| Argument                       | What it holds                                                                                      |
| ------------------------------ | -------------------------------------------------------------------------------------------------- |
| `base_mint_param`              | `decimals`, `name`, `symbol` and metadata `uri` of the new token                                   |
| `curve_param`                  | `supply`, `total_base_sell`, `total_quote_fund_raising` (graduation target) and `migrate_type` (1 = CPMM) |
| `vesting_param`                | Creator vesting; StonkFun launches use zero                                                        |
| `transfer_fee_extension_param` | `transfer_fee_basis_points` on reward launches, `null` on standard launches                        |

Unlike the direct-pool launches below, the mints are not sorted by public key: the new token is always the base mint at index 6 and the quote asset is at index 7.

## Bonding Curve Progress of a StonkFun Token

`DEXPools` returns the curve reserves after every trade. Because every StonkFun curve sells 793,100,000 of 1,000,000,000 tokens, progress can be computed from the base side without knowing the quote asset:

```
progress % = 100 - ((Base.PostAmount - 206,900,000) * 100 / 793,100,000)
```

Or use the quote side: `Quote.PostAmount` divided by the launch's `total_quote_fund_raising` (after adjusting for the quote asset's decimals). The example uses a live curve pool; bonding-curve pools graduate or go quiet within hours, so take a current `Pool state` address from the launch stream above and swap it in.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query StonkFunBondingCurveProgress {
  Solana {
    DEXPools(
      where: {
        Pool: {
          Market: {
            MarketAddress: { is: "AX4FJkpEPDeHdSdha5iGvyqnok8AdbjWJMg4u68GKPLh" }
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
          MarketAddress
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

Change `query` to `subscription` and drop `orderBy` and `limit` to get every reserve update of the curve as it happens.

## Track StonkFun Graduations to Raydium CPMM in Real Time

Graduation is a `migrate_to_cpswap` instruction on the LaunchLab program that references the StonkFun platform config. The new CPMM pool is the sixth account and the old curve pool is the eighteenth, so one message gives you the mapping from the bonding curve to the pool where trading continues.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription StonkFunGraduations {
  Solana {
    Instructions(
      where: {
        Instruction: {
          Program: {
            Address: { is: "LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj" }
            Method: { is: "migrate_to_cpswap" }
          }
          Accounts: {
            includes: {
              Address: {
                in: [
                  "6BwHHDg3u1854jC8PDLXvR4spTcLNaoBxLJNGC4nTESt"
                  "4E876qZTE9FJMrBzgVtBrSrzz2TLivB5Y5QXPjB4gZL7"
                ]
              }
            }
          }
        }
        Transaction: { Result: { Success: true } }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Signature
      }
      Instruction {
        Program {
          Method
          AccountNames
        }
        Accounts {
          Address
          Token {
            Mint
            ProgramId
          }
        }
      }
    }
  }
}
```

</details>

Account positions in `migrate_to_cpswap`:

| Index | Account                                   |
| ----- | ----------------------------------------- |
| 0     | Payer                                     |
| 1     | Base mint (the StonkFun token)            |
| 2     | Quote mint                                |
| 3     | StonkFun platform config                  |
| 4     | Raydium CPMM program                      |
| 5     | **New CPMM pool** (the market address after graduation) |
| 6     | CPMM authority                            |
| 7     | CPMM LP mint                              |
| 8, 9  | CPMM base and quote vaults                |
| 10    | CPMM fee config                           |
| 11    | CPMM create-pool fee account              |
| 12    | CPMM observation state                    |
| 13, 14, 15 | LP lock program, lock authority, locked LP vault |
| 16    | LaunchLab authority                       |
| 17    | **Bonding-curve pool state** being migrated |

## Latest StonkFun Trades using the Trading API

StonkFun pools are ordinary Raydium pools, so the cleanest way to get their trades is the [Trading cube](/docs/trading/trading-data-overview). Every row already carries the USD price and market cap of the token at the time of the trade, and router hops from Jupiter or DFlow are attributed to the pool they hit, so nothing is double counted.

The query below returns the latest trades quoted in SPYx across the three programs StonkFun uses. `Market.Protocol` tells you which stage the token is in: `raydium_launchpad` for bonding-curve trades, `raydium_cp_swap` for graduated pools and `amm_v3` for direct-pool launches. Swap the `QuoteToken.Address` for any other quote asset listed on StonkFun (NVDAx, OPENAI, ZEC, STONK itself) to follow that segment. Keep a `Block.Time` window on program-wide queries; without one the scan across all Raydium pools can time out.

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
            Program: {
              in: [
                "LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj"
                "CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C"
                "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK"
              ]
            }
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

To get trades in real time, change `query` to `subscription` and remove the `orderBy`, `limit` and `Block.Time` arguments. The same can be tracked using [Bitquery Kafka Streams](/docs/streams/kafka-streaming-concepts/).

## Latest Trades of a Specific StonkFun Token

To follow one token, filter on `Pair.Token.Address` (the mint) or on `Pair.Market.Address` (the pool). Filtering by pool is the exact equivalent of the chart on the StonkFun token page. For a bonding-curve token, use the `Pool state` address before graduation and the new CPMM pool address after it, or filter by mint only to get both.

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

[`Trading.Tokens`](/docs/trading/crypto-price-api/tokens) aggregates every pool of a token into one USD price series, which matters for STONK because it now trades in SOL pools on other DEXs as well as in its own SPYx pool. The one-minute interval with `limit: 1` gives you the latest price, volume and market cap in a single row.

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

[`Trading.Pairs`](/docs/trading/crypto-price-api/pairs) gives candles per pool, with volume in both the token and the quote asset. Use it when you want the STONK / SPYx chart specifically rather than the token-wide price, or the chart of one bonding curve.

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

Aggregate `Trading.Trades` by trader to rank the most active wallets over a time window. `AmountsInUsd_Base` is the USD value of the StonkFun token side of each trade, and `Side` is the trader's own action, so the buy and sell splits are labelled from the wallet's point of view.

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
      boughtUsd: sum(of: AmountsInUsd_Base, if: { Side: { is: "Buy" } })
      soldUsd: sum(of: AmountsInUsd_Base, if: { Side: { is: "Sell" } })
      trades: count
    }
  }
}
```

</details>

## Liquidity of a StonkFun Pool

`DEXPools` returns the pool reserves after every liquidity change or trade. `Base` and `Quote` follow the pool's own ordering; for STONK / SPYx the base is SPYx and the quote is STONK. The same query works for a bonding-curve pool (it returns the curve reserves) and for the CPMM pool after graduation.

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

StonkFun sweeps trading fees, buys tokens and burns them from the launcher wallet. STONK is burned every few minutes, and the program also buys and burns the platform's largest tokens by market cap. Each burn lowers the supply, so the whole buyback history is one `TokenSupplyUpdates` query filtered on the launcher wallet as signer. Add a `Currency.MintAddress` filter to follow STONK alone, and change `query` to `subscription` to get each burn as it happens.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query StonkFunBurns {
  Solana {
    TokenSupplyUpdates(
      where: {
        TokenSupplyUpdate: { Amount: { lt: "0" } }
        Transaction: {
          Signer: { is: "5CEbueQnq1Ym2uSSx2xXds3jQAqT1BDnkA59RZobSPAG" }
          Result: { Success: true }
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
          MintAddress
          Decimals
        }
      }
    }
  }
}
```

</details>

## Track Direct-Pool StonkFun Launches on Raydium CLMM

The original StonkFun launch mode is a Raydium CLMM `create_customizable_pool` instruction signed by the StonkFun launcher wallet, and these launches still appear alongside the bonding-curve ones. Our decoder does not name this instruction, so `Program.Method` is empty for it; filter on the instruction data prefix `2B44D4A7592FA401` (the instruction discriminator) together with the launcher wallet as `Transaction.Signer`.

The pool address is the third account in the `Accounts` array. The two mints are the fourth and fifth accounts, ordered by public key, so the new token can be in either slot: the new token is the mint whose `Token.Owner` and metadata were created in the same signature, and the other one is the quote asset.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription StonkFunDirectPoolLaunches {
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

The `Instructions` cube is real-time only and keeps a short window of history, with no archive dataset. For launches older than that, take the first trade of each pool from the `DEXTradeByTokens` archive instead.

## Historical StonkFun Data older than 30 days

For history beyond the Trading cube window, use `DEXTradeByTokens` on the `combined` dataset. Always filter on the pool's `MarketAddress` so that aggregator hops and pools where the token is used as a quote asset are excluded; otherwise a token-level sum overstates volume. For a graduated token, run the query once for the bonding-curve pool and once for the CPMM pool.

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
    { q: "What is StonkFun and how is it indexed?", a: "StonkFun is a Solana launchpad that pairs new coins with tokenized stocks, pre-IPO tokens, crypto assets or SOL. New launches run on Raydium LaunchLab and graduate into Raydium CPMM pools; older launches opened Raydium CLMM pools directly. Bitquery indexes all three programs, so StonkFun tokens are queried like any other Raydium market." },
    { q: "How do I detect new StonkFun launches?", a: "Subscribe to Raydium LaunchLab initialize_with_token_2022 instructions whose accounts include one of the two StonkFun platform configs, 6BwHHDg3u1854jC8PDLXvR4spTcLNaoBxLJNGC4nTESt for reward launches and 4E876qZTE9FJMrBzgVtBrSrzz2TLivB5Y5QXPjB4gZL7 for standard launches. The pool state is the sixth account, the new token is the seventh and the quote asset is the eighth. For the older direct-pool launches, filter Raydium CLMM instructions whose data starts with 2B44D4A7592FA401 and whose signer is the StonkFun launcher wallet." },
    { q: "How do I know when a StonkFun token graduates?", a: "Subscribe to migrate_to_cpswap instructions on Raydium LaunchLab that include a StonkFun platform config. The sixth account is the new Raydium CPMM pool and the eighteenth is the bonding-curve pool that was migrated. Bonding curve progress before that comes from DEXPools: 100 minus (base reserve minus 206.9M) times 100 over 793.1M." },
    { q: "How do I get StonkFun token prices and trades?", a: "Use the Trading cube: Trading.Trades for individual swaps with USD price and market cap, Trading.Tokens for token-level candles and Trading.Pairs for per-pool candles. Market.Protocol shows the stage: raydium_launchpad on the curve, raydium_cp_swap after graduation, amm_v3 for direct-pool launches. Use DEXTradeByTokens on the combined dataset only for history older than about 30 days." },
    { q: "Do I need an API key outside the IDE?", a: "Yes. Generate an OAuth token from your Bitquery account to run queries in your app or bot." },
  ]}
/>
