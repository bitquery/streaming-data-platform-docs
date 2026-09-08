---
title: "Trends.fun API: Token Launches, Bonding Curve Progress, Migrations and Trades"
sidebar_label: "Trends.fun API"
description: "Trends.fun tokens launch on Meteora's Dynamic Bonding Curve. Bitquery GraphQL for launches by config, curve progress, pools near graduation, migrations, trades."
keywords:
  - Trends.fun API
  - trends.fun token launches
  - Meteora dynamic bonding curve API
  - bonding curve progress Solana
  - DBC migration stream
---

import FAQ from "@site/src/components/FAQ";

# Trends.fun API: Token Launches, Bonding Curve Progress, Migrations and Trades

Trends.fun turns a tweet into a token on Solana. The tokens it mints launch on Meteora's Dynamic Bonding Curve, program `dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN`, trade there until the curve fills, and then migrate to a Meteora DAMM v2 pool. Bitquery decodes the curve program's instructions, records every pool state change in `DEXPools` and every trade in `DEXTradeByTokens`, so a trends.fun tracker is a set of Dynamic Bonding Curve queries. The curve program is shared by many launchpads; what makes a launch a trends.fun launch is the config account passed as the first account of the launch instruction, and the second section shows how to isolate one. Every example runs in the [IDE](https://ide.bitquery.io) on a free account on the `eap` endpoint. The worked token is a trends.fun token, `@easytopredict` at `CY1P83KnKwFYostvjQcoR2HJLyEJWRBRaVQmYyyD3cR8`, which launched on the curve in October 2025 and trades on Meteora DAMM v2 today. Curve pool rows are kept for about half a day and decoded instructions for a few days, so the curve and launch queries below run without a token filter and show the filter line as a comment; trade history reaches the archive.

## Every launch on the bonding curve, live

`initialize_virtual_pool_with_spl_token` creates the curve pool. The accounts arrive in program order: `config`, `pool_authority`, `creator`, `base_mint`, `quote_mint`, `pool`, then the vaults. Saved stream [here](https://ide.bitquery.io/latest-pools-created-on-trendsfun-stream).

```graphql
subscription {
  Solana {
    Instructions(
      where: {
        Instruction: {
          Program: {
            Address: { is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN" }
            Method: { is: "initialize_virtual_pool_with_spl_token" }
          }
        }
        Transaction: { Result: { Success: true } }
      }
    ) {
      Block {
        Time
      }
      Instruction {
        Program {
          AccountNames
        }
        Accounts {
          Address
          Token {
            Mint
          }
        }
      }
      Transaction {
        Signature
        Signer
      }
    }
  }
}
```

## Launches from one launchpad config

Every launchpad on the curve program has its own config account, and it is the first account of every launch it makes. Run the query below once, read the first address of a row that belongs to a trends.fun token, then uncomment the `Accounts` filter with that address to see only trends.fun launches. The same `includes` filter with a mint address finds one token's launch.

```graphql
{
  Solana {
    Instructions(
      where: {
        Instruction: {
          Program: {
            Address: { is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN" }
            Method: { is: "initialize_virtual_pool_with_spl_token" }
          }
          # Accounts: { includes: { Address: { is: "<config account>" } } }
        }
        Transaction: { Result: { Success: true } }
        Block: { Time: { since_relative: { hours_ago: 1 } } }
      }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Instruction {
        Accounts {
          Address
        }
      }
      Transaction {
        Signature
        Signer
      }
    }
  }
}
```

## Bonding curve state and progress

Each `DEXPools` row is the curve after one trade: the tokens still on the curve under `Base.PostAmount`, the quote raised under `Quote.PostAmount` with its USD value, and the price. Progress toward graduation is the quote raised against the migration threshold set in the launchpad's config, since the curve migrates when the quote reserve reaches it. The query returns the latest state of every curve pool that traded recently, one row per market; uncomment the `BaseCurrency` filter for one token. Saved query [here](https://ide.bitquery.io/bonding-curve-progress-percentage-of-a-trends-fun-token).

```graphql
{
  Solana {
    DEXPools(
      where: {
        Pool: {
          Dex: { ProgramAddress: { is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN" } }
          # Market: { BaseCurrency: { MintAddress: { is: "<token mint>" } } }
        }
        Transaction: { Result: { Success: true } }
      }
      limitBy: { by: Pool_Market_MarketAddress, count: 1 }
      orderBy: { descending: Block_Time }
      limit: { count: 20 }
    ) {
      Block {
        Time
      }
      Pool {
        Market {
          MarketAddress
          BaseCurrency {
            Name
            Symbol
            MintAddress
          }
          QuoteCurrency {
            Symbol
          }
        }
        Base {
          PostAmount
        }
        Quote {
          PostAmount
          PostAmountInUSD
          PriceInUSD
        }
      }
    }
  }
}
```

## Pools closest to graduation

The curve pools with the fewest tokens left, among those that traded in the last hour, one row per market. Saved query [here](https://ide.bitquery.io/trends-fun-tokens-between-95-and-100-bonding-curve-progress).

```graphql
{
  Solana {
    DEXPools(
      where: {
        Pool: {
          Dex: { ProgramAddress: { is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN" } }
          Market: {
            QuoteCurrency: {
              MintAddress: {
                in: [
                  "So11111111111111111111111111111111111111112"
                  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
                ]
              }
            }
          }
        }
        Transaction: { Result: { Success: true } }
        Block: { Time: { since_relative: { hours_ago: 1 } } }
      }
      limitBy: { by: Pool_Market_MarketAddress, count: 1 }
      orderBy: { ascending: Pool_Base_PostAmount }
      limit: { count: 20 }
    ) {
      Block {
        Time
      }
      Pool {
        Market {
          MarketAddress
          BaseCurrency {
            Symbol
            MintAddress
          }
        }
        Base {
          PostAmount
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

## Migrations to Meteora, live

When a curve fills, the program migrates the token's liquidity into a DAMM pool. Two methods cover both destinations, and the accounts of each call name the token and the new pool.

```graphql
subscription {
  Solana {
    Instructions(
      where: {
        Instruction: {
          Program: {
            Address: { is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN" }
            Method: { in: ["migrate_meteora_damm", "migration_damm_v2"] }
          }
        }
        Transaction: { Result: { Success: true } }
      }
    ) {
      Block {
        Time
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
          }
        }
      }
      Transaction {
        Signature
        Signer
      }
    }
  }
}
```

## Latest trades of a token

One row per trade, newest first, with the counter token, the USD price and the market. For the worked token the market is its DAMM v2 pool; for a token still on the curve it is the curve pool. Saved query [here](https://ide.bitquery.io/Latest-Trades-of-a-Trends-Fun-Token).

```graphql
{
  Solana {
    DEXTradeByTokens(
      orderBy: { descending: Block_Time }
      limit: { count: 50 }
      where: {
        Trade: { Currency: { MintAddress: { is: "CY1P83KnKwFYostvjQcoR2HJLyEJWRBRaVQmYyyD3cR8" } } }
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
      Trade {
        Market {
          MarketAddress
        }
        Dex {
          ProtocolName
        }
        Amount
        AmountInUSD
        PriceInUSD
        Side {
          Type
          Amount
          AmountInUSD
          Currency {
            Symbol
          }
        }
      }
    }
  }
}
```

## Top buyers and top sellers of a token

`Side.Type` names the counter-side, so the token was bought where the side was sold. Sort on `bought` for buyers and `sold` for sellers; add `dataset: archive` to the root for the token's whole life. Saved queries: [top buyers](https://ide.bitquery.io/Top-Buyers-of-a-Trends-Fun-Token), [top sellers](https://ide.bitquery.io/Top-Sellers-of-a-Trends-Fun-Token).

```graphql
{
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: { Currency: { MintAddress: { is: "CY1P83KnKwFYostvjQcoR2HJLyEJWRBRaVQmYyyD3cR8" } } }
        Transaction: { Result: { Success: true } }
      }
      orderBy: { descendingByField: "bought" }
      limit: { count: 100 }
    ) {
      Transaction {
        Signer
      }
      bought: sum(of: Trade_Side_AmountInUSD, if: { Trade: { Side: { Type: { is: sell } } } })
      sold: sum(of: Trade_Side_AmountInUSD, if: { Trade: { Side: { Type: { is: buy } } } })
      trades: count
    }
  }
}
```

## Hourly OHLC of a token

Candles against WSOL for the last week; curve tokens are quoted in WSOL or USDC, so put the quote mint under `Side.Currency`. Saved query [here](https://ide.bitquery.io/OHLCV-of-a-trends-fun-token).

```graphql
{
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: { MintAddress: { is: "CY1P83KnKwFYostvjQcoR2HJLyEJWRBRaVQmYyyD3cR8" } }
          Side: { Currency: { MintAddress: { is: "So11111111111111111111111111111111111111112" } } }
        }
        Transaction: { Result: { Success: true } }
        Block: { Time: { since_relative: { days_ago: 7 } } }
      }
      limit: { count: 168 }
      orderBy: { descendingByField: "Block_Timefield" }
    ) {
      Block {
        Timefield: Time(interval: { in: hours, count: 1 })
      }
      volume: sum(of: Trade_Amount)
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
      Trade {
        high: Price(maximum: Trade_Price)
        low: Price(minimum: Trade_Price)
        open: Price(minimum: Block_Slot)
        close: Price(maximum: Block_Slot)
      }
      count
    }
  }
}
```

## Tokens launched by one creator

The creator signs the launch transaction, so grouping launches by signer ranks the most active creators of the last day; uncomment the `Signer` filter and drop the aggregate to list one creator's launches, where the fourth account of each row is the mint. Saved query [here](https://ide.bitquery.io/All-Tokens-Created-by-a-Trends-Fun-Token-CreatorDeveloper).

```graphql
{
  Solana {
    Instructions(
      where: {
        Instruction: {
          Program: {
            Address: { is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN" }
            Method: { is: "initialize_virtual_pool_with_spl_token" }
          }
        }
        Transaction: {
          # Signer: { is: "<creator address>" }
          Result: { Success: true }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      orderBy: { descendingByField: "launches" }
      limit: { count: 20 }
    ) {
      Transaction {
        Signer
      }
      launches: count
    }
  }
}
```

<FAQ
  items={[
    { q: "How do I get trends.fun token data from an API?", a: "Trends.fun tokens launch on Meteora's Dynamic Bonding Curve, so filter the curve program dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN in Bitquery's Solana Instructions, DEXPools and DEXTradeByTokens cubes as this page shows." },
    { q: "How do I tell trends.fun launches apart from other launchpads on the curve?", a: "By the config account, the first account of every launch instruction. Read it from any trends.fun token's launch and filter Accounts includes on it." },
    { q: "How is bonding curve progress calculated?", a: "The curve migrates when its quote reserve reaches the migration threshold in the launchpad's config, so progress is Quote.PostAmount from the latest DEXPools row divided by that threshold. Base.PostAmount shows how many tokens are still on the curve." },
    { q: "How do I know a token has graduated?", a: "The curve program emits migrate_meteora_damm or migration_damm_v2 for the token; after that its trades carry a Meteora DAMM market instead of the curve pool." },
    { q: "How far back does the data go?", a: "Trades reach the archive dataset. Curve pool rows are kept for about half a day and decoded instructions for a few days, which is why the curve and launch queries take a live token." },
  ]}
/>

## Related pages

- [Meteora Dynamic Bonding Curve API](/docs/blockchain/Solana/meteora-dynamic-bonding-curve-api/)
- [Solana DEX trades API](/docs/blockchain/Solana/solana-dextrades)
- [Solana API hub](/docs/blockchain/Solana/)
- [Kafka streams for Solana](/docs/streams/kafka-streaming-concepts/)
