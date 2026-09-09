---
title: "Meteora DAMM v2 API: Trades, Prices, OHLC and Pools"
sidebar_label: "Meteora DAMM v2 API"
description: "Meteora DAMM v2 API on Solana: cp_amm swaps with USD price and market cap, OHLC candles, new pools, top traders, volume and pool liquidity via Bitquery."
keywords:
  - Meteora DAMM v2 API
  - Meteora DAMM v2
  - cp_amm program
  - Meteora DAMM v2 program ID
  - Meteora DAMM v2 SDK
  - Meteora DAMM v2 pools
  - Meteora DAMM v2 OHLC
  - Meteora API
  - does Meteora have an API
  - Solana DEX API
---

import FAQ from "@site/src/components/FAQ";

# Meteora DAMM v2 API

Meteora DAMM v2 is Meteora's current constant-product AMM on Solana, built on the `cp_amm` program at `cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG`. Positions are NFTs, ranges can be concentrated, and the program carries an anti-sniper fee schedule. Bitquery reads its activity into GraphQL queries, WebSocket subscriptions, Kafka and gRPC streams: swaps with USD price and market cap, new pools, prices, OHLC candles, top traders, volume and pool reserves. Every query below runs as written in the [Bitquery IDE](https://ide.bitquery.io) with a free trial token.

If you arrived looking for the DAMM v2 SDK or IDL, those build and sign transactions. This page is the other half: reading what those transactions did, across every DAMM v2 pool at once.

:::tip Start with the Trading API
Most questions on this page are answered fastest by the [**Trading API**](/docs/trading/trading-data-overview). [`Trading.Trades`](/docs/trading/crypto-trades-api/trades-api) returns **MEV-filtered swaps with USD price, market cap and supply on every row**, across **9 chains in one API**, and [`Trading.Pairs`](/docs/trading/crypto-price-api/pairs) gives pre-aggregated OHLC per pool down to one second. Filter either with `Pair: { Market: { Protocol: { is: "cp_amm" } } }` for DAMM v2.

Drop to the chain-level cubes further down when you need what the Trading API does not carry: **history older than about 30 days**, pool reserves, or per-instruction detail such as pool creation.
:::

:::note
To query or stream data via GraphQL **outside the Bitquery IDE**, you need to generate an API access token.

Follow the steps here to create one: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

## What is the Meteora DAMM v2 program ID on Solana?

The Meteora DAMM v2 program, `cp_amm`, is deployed at `cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG` on Solana mainnet, and Meteora uses the same address on devnet. Its pool authority PDA is `HLnpSz9h2S4hiLQ43rnSD9XkcUThA7B8hQMKmDaiTLcC`.

```
cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG
```

In the Trading cubes DAMM v2 is `Market.Protocol` `cp_amm`. In the Solana chain-level cubes the same rows carry `Dex.ProtocolName` `cp_amm` and `Dex.ProtocolFamily` `Meteora`.

Meteora runs four trading programs on Solana, each with its own Bitquery page:

| Meteora program | Program ID | Protocol name | Bitquery page |
| --- | --- | --- | --- |
| DAMM v2, constant-product pools with position NFTs | `cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG` | `cp_amm` | This page |
| DLMM, concentrated liquidity in price bins | `LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo` | `lb_clmm` | [Meteora DLMM API](/docs/blockchain/Solana/Meteora-DLMM-API/) |
| DAMM v1, the legacy Dynamic AMM | `Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB` | `amm` | [Meteora DAMM v1 API](/docs/blockchain/Solana/Meteora-DYN-API/) |
| Dynamic Bonding Curve, launches that graduate to a DAMM pool | `dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN` | `dynamic_bonding_curve` | [Meteora DBC API](/docs/blockchain/Solana/meteora-dynamic-bonding-curve-api/) |

DAMM v2 method names keep the IDL's snake_case spelling, so pool creation is `initialize_pool`, not `initializePool`. DLMM is the odd one out with camelCase. Rows whose method starts with `Evt`, such as `EvtSwap2` and `EvtInitializePool`, are the program's event logs emitted as inner instructions beside the real instruction; they carry no account names, so read accounts from the instruction itself.

## Does Meteora have an API?

Yes, for pool-level data. Meteora publishes a free REST [DAMM v2 Data API](https://docs.meteora.ag/developer-guides/damm-v2/api-reference/overview) at `https://damm-v2.datapi.meteora.ag`, limited to 10 requests a second with no key, covering pools and pool groups, per-pool OHLCV and volume history, and protocol stats. It has no per-swap trade endpoint, no per-wallet swap history and no streaming. Bitquery reads the same activity from the chain: swaps as individual rows with the trader and a USD price, new pools the moment they are created, reserves after every liquidity change, and history back to mid-2024.

| | Meteora DAMM v2 Data API | Bitquery Meteora DAMM v2 API |
| --- | --- | --- |
| Access | REST, no key, 10 requests a second | GraphQL, WebSocket, Kafka and gRPC with an access token; seven-day free trial |
| Pools | Paginated pool list and single-pool state | New pools as they are created; reserves after each decoded swap, deposit or withdrawal |
| Trades | No per-swap endpoint | Swaps as individual rows with trader, amounts, USD price, market cap and signature |
| Candles and volume | Per-pool OHLCV and volume history | Pre-built candles from `Trading.Pairs`; any interval from `DEXTradeByTokens` |
| Traders | Not served | Top traders, buy and sell volume per wallet, PnL |
| History | Per-pool candles and volume | About 30 days on the Trading cubes, back to mid-2024 on the Solana archive |
| Rate limits | 10 requests a second | 30, 90 or 240 query requests a minute by plan, custom on Enterprise; streams metered separately |

## Real-time Meteora DAMM v2 trades

Stream every decoded DAMM v2 swap with the trader, both amounts, the USD price and the token's market cap and circulating supply. `Side` is the trader's own side. This is the query most integrations start from.

```graphql
subscription {
  Trading {
    Trades(
      where: {
        Pair: { Market: { Protocol: { is: "cp_amm" }, Network: { is: "Solana" } } }
      }
    ) {
      Block {
        Time
      }
      Side
      Price
      PriceInUsd
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
      Supply {
        MarketCap
        CirculatingSupply
      }
      TransactionHeader {
        Hash
      }
      Pair {
        Market {
          Address
          Protocol
        }
        Token {
          Symbol
          Address
        }
        QuoteToken {
          Symbol
          Address
        }
      }
    }
  }
}
```

Add `Pair: { Token: { Address: { is: "<mint>" } } }` to follow one token, or `AmountsInUsd: { Base: { gt: 10000 } }` to watch only large trades. The same body runs as a query with `limit`, `orderBy: { descending: Block_Time }` and a `Block: { Time: { since_relative: { minutes_ago: 10 } } }` filter.

For the lowest latency the same swaps are on the Kafka topic `solana.dextrades.proto` and the [gRPC DEX trades topic](/docs/grpc/solana/topics/dextrades/); filter on `ProtocolName` `cp_amm` in the consumer.

## Latest price and market cap of a token on Meteora DAMM v2

The token examples below use MET (`METvsvVRapdj9cFLzq4Tr43xK4tAjQfwX76z3n6mWQL`), Meteora's own token, which has traded on DAMM v2 since October 2025. `Trading.Pairs` returns the latest interval for the pool with OHLC, average price, volume and market cap already computed.

`Price: { IsQuotedInUsd: true }` matters: every market publishes each interval twice, once in USD and once in the quote token.

```graphql
{
  Trading {
    Pairs(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        Token: { Address: { is: "METvsvVRapdj9cFLzq4Tr43xK4tAjQfwX76z3n6mWQL" } }
        Market: { Protocol: { is: "cp_amm" }, Network: { is: "Solana" } }
        Price: { IsQuotedInUsd: true }
        Interval: { Time: { Duration: { eq: 60 } } }
      }
    ) {
      Block {
        Time
      }
      Token {
        Symbol
        Address
      }
      QuoteToken {
        Symbol
      }
      Market {
        Address
        Protocol
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
      }
      Volume {
        Usd
        Base
      }
      Supply {
        MarketCap
        FullyDilutedValuationUsd
      }
    }
  }
}
```

This gives the price **on DAMM v2**, which is what you want on a venue page. For a token's price across every venue, weighted to its most liquid market, drop the protocol filter and add `Ranking: { Position: { eq: 1 } }` as described in [most accurate token price](/docs/trading/crypto-price-api/pairs/#most-accurate-token-price). The two differ whenever a token's deepest pool sits on another program: MET itself is priced from a DLMM pool by that measure.

## Real-time price feed of a token on Meteora DAMM v2

The same filter as a subscription. Each message is one interval of the MET pool on DAMM v2 with fresh OHLC and market cap.

```graphql
subscription {
  Trading {
    Pairs(
      where: {
        Token: { Address: { is: "METvsvVRapdj9cFLzq4Tr43xK4tAjQfwX76z3n6mWQL" } }
        Market: { Protocol: { is: "cp_amm" }, Network: { is: "Solana" } }
        Price: { IsQuotedInUsd: true }
        Interval: { Time: { Duration: { eq: 1 } } }
      }
    ) {
      Block {
        Time
      }
      Token {
        Symbol
      }
      QuoteToken {
        Symbol
      }
      Market {
        Address
      }
      Price {
        Ohlc {
          Open
          High
          Low
          Close
        }
      }
      Volume {
        Usd
      }
      Supply {
        MarketCap
      }
    }
  }
}
```

## Meteora DAMM v2 OHLC API

`Trading.Pairs` serves candles at any interval you ask for, so there is nothing to aggregate. Set `Interval.Time.Duration` in seconds: 1 for one-second candles, 60 for one-minute, 3600 for hourly.

```graphql
{
  Trading {
    Pairs(
      limit: { count: 30 }
      orderBy: { descending: Block_Time }
      where: {
        Token: { Address: { is: "METvsvVRapdj9cFLzq4Tr43xK4tAjQfwX76z3n6mWQL" } }
        Market: { Protocol: { is: "cp_amm" }, Network: { is: "Solana" } }
        Price: { IsQuotedInUsd: true }
        Interval: { Time: { Duration: { eq: 3600 } } }
      }
    ) {
      Block {
        Time
      }
      Market {
        Address
      }
      QuoteToken {
        Symbol
      }
      Price {
        Ohlc {
          Open
          High
          Low
          Close
        }
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

## Top traders of a token on Meteora DAMM v2

Ranks wallets by USD volume on DAMM v2 over the last 24 hours, one row per wallet, with the USD each bought and sold. `Trading.Trades` reports `Side` from the trader's point of view, so the split needs no field gymnastics.

:::note
Run this as a query, not a subscription. Aggregates over WebSocket return partial results.
:::

```graphql
query TopTraders($token: String) {
  Trading {
    Trades(
      limit: { count: 100 }
      orderBy: { descendingByField: "volumeUsd" }
      where: {
        Pair: {
          Market: { Protocol: { is: "cp_amm" }, Network: { is: "Solana" } }
          Token: { Address: { is: $token } }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      Trader {
        Address
      }
      volumeUsd: sum(of: AmountsInUsd_Base)
      bought: sum(of: AmountsInUsd_Base, if: { Side: { is: "Buy" } })
      sold: sum(of: AmountsInUsd_Base, if: { Side: { is: "Sell" } })
      buys: count(if: { Side: { is: "Buy" } })
      sells: count(if: { Side: { is: "Sell" } })
      trades: count
    }
  }
}
{
  "token": "METvsvVRapdj9cFLzq4Tr43xK4tAjQfwX76z3n6mWQL"
}
```

Subtracting `bought` from `sold` gives a rough realised PnL for the window. The [wallet PnL guide](/docs/trading/crypto-trades-api/wallet-pnl/) covers the full method.

## Trading volume, buy volume and sell volume on Meteora DAMM v2

Seven-day totals for MET on DAMM v2: USD volume, the buy and sell split, trade counts and the number of distinct wallets. Change `days_ago` for other windows, up to the roughly 30-day Trading window.

```graphql
{
  Trading {
    Trades(
      where: {
        Pair: {
          Market: { Protocol: { is: "cp_amm" }, Network: { is: "Solana" } }
          Token: {
            Address: { is: "METvsvVRapdj9cFLzq4Tr43xK4tAjQfwX76z3n6mWQL" }
          }
        }
        Block: { Time: { since_relative: { days_ago: 7 } } }
      }
    ) {
      volumeUsd: sum(of: AmountsInUsd_Base)
      buy_volume: sum(of: AmountsInUsd_Base, if: { Side: { is: "Buy" } })
      sell_volume: sum(of: AmountsInUsd_Base, if: { Side: { is: "Sell" } })
      buys: count(if: { Side: { is: "Buy" } })
      sells: count(if: { Side: { is: "Sell" } })
      traders: count(distinct: Trader_Address)
    }
  }
}
```

Drop the `Token` filter to get the same totals for the whole DAMM v2 program.

## New Meteora DAMM v2 pools in real time

Pool creation is per-instruction detail, so this one uses the chain-level `Instructions` cube. DAMM v2 creates pools through three instructions: `initialize_pool_with_dynamic_config` carries most of the traffic, with `initialize_pool` and `initialize_customizable_pool` behind it. Match all three.

`Program.AccountNames` names each entry of `Instruction.Accounts` in order: `creator` and `payer` are the wallets, `pool` is the new pool address, `token_a_mint` and `token_b_mint` the pair, `token_a_vault` and `token_b_vault` the reserves, and `position_nft_mint` the NFT minted for the creator's opening position.

:::note
Filter the instructions, not the `EvtInitializePool` event. The event fires once per pool as well, but its row carries a single account and an empty `AccountNames` list, so you cannot read the mints or vaults off it.
:::

```graphql
subscription {
  Solana {
    Instructions(
      where: {
        Transaction: { Result: { Success: true } }
        Instruction: {
          Program: {
            Address: { is: "cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG" }
            Method: {
              in: [
                "initialize_pool"
                "initialize_pool_with_dynamic_config"
                "initialize_customizable_pool"
              ]
            }
          }
        }
      }
    ) {
      Block {
        Time
      }
      Instruction {
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
          AccountNames
          Address
          Method
          Name
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

Swap `subscription` for a query and add `Block: { Time: { since_relative: { hours_ago: 24 } } }` with `limit` to list the day's new pools instead of waiting for the next one.

## Liquidity of a Meteora DAMM v2 pool

`DEXPools` records a pool's reserves after each swap, deposit or withdrawal it decodes. `Base.PostAmount` and `Quote.PostAmount` are the balances after the event, `PostAmountInUSD` their USD value, and `ChangeAmount` the signed change that event caused. This returns the latest state of the MET/USDC pool.

:::note
`DEXPools` is a realtime-only cube: it keeps roughly the last 12 hours and has no archive dataset, so use it for current reserves and live liquidity events rather than TVL history. See [data coverage and retention](/docs/graphql/data-coverage-retention/).
:::

```graphql
{
  Solana {
    DEXPools(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        Pool: {
          Market: {
            MarketAddress: { is: "BnztueWcXv93mgW7yJe8WYpnCxpz34nujPhfjQT6SLu1" }
          }
          Dex: {
            ProgramAddress: { is: "cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG" }
          }
        }
      }
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
          QuoteCurrency {
            Symbol
            MintAddress
          }
        }
        Dex {
          ProtocolName
          ProtocolFamily
        }
        Base {
          ChangeAmount
          PostAmount
          PostAmountInUSD
        }
        Quote {
          ChangeAmount
          PostAmount
          PostAmountInUSD
          PriceInUSD
        }
      }
    }
  }
}
```

To stream liquidity changes across all DAMM v2 pools, subscribe to the same cube and keep rows where either reserve moved, using `any` over `Base` and `Quote`.

## Historical Meteora DAMM v2 trades

The Trading cubes hold about 30 days. For anything older, use the chain-level `DEXTradeByTokens` cube with `dataset: archive`, which reaches back to mid-2024. This returns monthly trade counts and volume in MET for the token on DAMM v2 since it started trading.

:::caution Aggregate in native amounts on `archive` and `combined`, not USD
Summing `Trade_Side_AmountInUSD` on the Solana `archive` and `combined` datasets does not aggregate cleanly: adding it to a grouped query shatters one row per month into hundreds of partial rows, and `combined` also returns fewer trades than `realtime` over the same window. Aggregate `Trade_Amount` instead, and take USD figures from the Trading cubes, where every row carries a vetted USD price.
:::

```graphql
{
  Solana(dataset: archive) {
    DEXTradeByTokens(
      orderBy: { descendingByField: "Block_month" }
      where: {
        Block: { Time: { since: "2025-10-01T00:00:00Z" } }
        Transaction: { Result: { Success: true } }
        Trade: {
          Currency: {
            MintAddress: { is: "METvsvVRapdj9cFLzq4Tr43xK4tAjQfwX76z3n6mWQL" }
          }
          Dex: {
            ProgramAddress: { is: "cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG" }
          }
        }
      }
    ) {
      Block {
        month: Time(interval: { in: months, count: 1 })
      }
      volume_met: sum(of: Trade_Amount)
      trades: count
    }
  }
}
```

The chain-level cubes also carry per-swap detail the Trading cubes leave out, such as the exact instruction that produced a swap and the token accounts on each side. The [Solana DEX Trades API](/docs/blockchain/Solana/solana-dextrades/) covers those fields, and [DEXTrades vs DEXTradeByTokens vs Trading.Trades](/docs/cubes/dextrades-dextradebytokens-trading-trades/) explains when each one is the right tool.

## API key, free trial and pricing

Create an access token at [account.bitquery.io](https://account.bitquery.io/) and follow [how to generate a token](/docs/authorization/how-to-generate/). The free trial runs for seven days and includes 1,000 API points, 100 MCP credits and two simultaneous streams. Request rate limits by plan are 30 a minute on Personal, 90 on Pro and 240 on Scale, with custom limits on Enterprise; see [rate limits](/docs/plans/rate-limits/). Points and streams are explained on [how billing works](/docs/plans/how-billing-works/), and plan prices are on the [Solana DEX API product page](https://bitquery.io/products/solana-dex-api) and the [pricing page](https://bitquery.io/pricing). Kafka access is a separate line item from the GraphQL plan.

<FAQ
  items={[
    { q: "What is the Meteora DAMM v2 program ID on Solana?", a: "cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG, the same on mainnet and devnet, with pool authority HLnpSz9h2S4hiLQ43rnSD9XkcUThA7B8hQMKmDaiTLcC. In Bitquery data DAMM v2 is Market.Protocol cp_amm in the Trading cubes and ProtocolName cp_amm, family Meteora, in the Solana cubes." },
    { q: "Does Meteora have an official API?", a: "Yes, for pool-level data. The DAMM v2 Data API at damm-v2.datapi.meteora.ag returns pools, per-pool OHLCV and volume history and protocol stats, at 10 requests a second with no key. It has no per-swap trade feed, no per-wallet swap history and no streaming; Bitquery serves those over GraphQL, WebSocket, Kafka and gRPC." },
    { q: "How do I stream Meteora DAMM v2 trades in real time?", a: "Subscribe to Trading.Trades with Pair.Market.Protocol cp_amm. Every row carries the trader, both amounts, USD price, market cap and circulating supply. For the lowest latency use the Kafka topic solana.dextrades.proto or the gRPC DEX trades stream and filter on ProtocolName cp_amm." },
    { q: "How do I get OHLC candles for a Meteora DAMM v2 pair?", a: "Query Trading.Pairs filtered by Market.Protocol cp_amm with Price.IsQuotedInUsd true, and set Interval.Time.Duration in seconds: 1, 60 or 3600. The candles are pre-built, so no aggregation is needed. Trading.Pairs also works as a subscription." },
    { q: "How do I detect new Meteora DAMM v2 pools?", a: "Subscribe to Solana.Instructions on the cp_amm program with methods initialize_pool, initialize_pool_with_dynamic_config and initialize_customizable_pool. AccountNames names each account: pool is the new pool, token_a_mint and token_b_mint the pair, and creator the wallet that opened it. Do not filter the EvtInitializePool event, whose row carries no account names." },
    { q: "Why is the price on this page different from the token's price elsewhere?", a: "Filtering Market.Protocol cp_amm gives the price on DAMM v2. A token's headline price comes from its deepest market across all venues, which you get from Trading.Pairs with Ranking.Position 1 and no protocol filter. The two differ whenever the token's top pool is on another program." },
    { q: "Can I get historical Meteora DAMM v2 data?", a: "Yes. The Trading cubes hold about 30 days. For older data use Solana.DEXTradeByTokens with dataset archive, which reaches back to mid-2024, and aggregate native Trade_Amount rather than Trade_Side_AmountInUSD, which does not aggregate cleanly on archive or combined. DEXPools is realtime-only at roughly 12 hours." },
    { q: "What is the difference between Meteora DAMM v2, DAMM v1, DLMM and DBC?", a: "All four are Meteora programs on Solana. DAMM v2 (cp_amm) is the current constant-product AMM with position NFTs. DLMM (lb_clmm) is concentrated liquidity in price bins. DAMM v1 (amm) is the legacy Dynamic AMM. The Dynamic Bonding Curve (dynamic_bonding_curve) launches tokens that graduate to a DAMM pool. Each has its own Bitquery page." },
    { q: "Do I need an API key, and is there a free tier?", a: "Yes, an access token from account.bitquery.io. The seven-day trial includes 1,000 API points, 100 MCP credits and two simultaneous streams; paid plans are listed on the pricing page." },
  ]}
/>

## Related documentation

- [Meteora DLMM API](/docs/blockchain/Solana/Meteora-DLMM-API/)
- [Meteora DAMM v1 API](/docs/blockchain/Solana/Meteora-DYN-API/)
- [Meteora Dynamic Bonding Curve API](/docs/blockchain/Solana/meteora-dynamic-bonding-curve-api/)
- [Trading API overview](/docs/trading/trading-data-overview/), [Trades cube](/docs/trading/crypto-trades-api/trades-api/) and [Pairs cube](/docs/trading/crypto-price-api/pairs/)
- [Wallet PnL](/docs/trading/crypto-trades-api/wallet-pnl/)
- [Solana DEX Trades API](/docs/blockchain/Solana/solana-dextrades/)
- [DEXTrades vs DEXTradeByTokens vs Trading.Trades](/docs/cubes/dextrades-dextradebytokens-trading-trades/)
- [Data coverage and retention](/docs/graphql/data-coverage-retention/)
- [gRPC DEX trades topic](/docs/grpc/solana/topics/dextrades/) and [real-time Solana streams over Kafka](/docs/streams/real-time-solana-data/)
- [Schema overview](/docs/schema/schema-intro/)
- [API Authorization](/docs/authorization/how-to-use/)

## Support

For technical support and questions contact our support team via telegram or create a ticket [here](https://support.bitquery.io/)
