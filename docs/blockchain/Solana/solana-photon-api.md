---
sidebar_position: 1
title: "Solana Photon API"
description: "Solana Photon API: query and stream Solana on-chain data with Bitquery GraphQL examples for developers. Keep queries fast with indexed filters."
---
import FAQ from "@site/src/components/FAQ";

# Photon Solana API

:::tip Need real-time Photon-style trader data or anything from the last ~30 days?
For **real-time trader and wallet data over the last ~30 days** across **9 chains in one API**, use the [**Trading cube**](/docs/trading/trading-data-overview) — [`Trading.Trades`](/docs/trading/crypto-trades-api/trades-api) gives you clean, MEV-filtered swaps with **`Trader.Address`** as a first-class filter plus **USD price, market cap, and supply on every row**. Use this page when you need **historical Photon-style trader data older than ~30 days**, raw per-swap detail, or call / event context.
:::

Photon is a routing aggregator on Solana that finds the best execution paths across multiple DEXs. To identify trades that were routed through Photon, we use their program address `BSfD6SHZigAfDWSjzD5Q41jw8LmKwtmjskPH9XW1mrRW` in our queries.

This program address appears in the instruction data when Photon routes a trade, allowing us to filter and analyze only the trades that went through their routing system. By joining DEX trade data with instruction data containing this program address, we can accurately track Photon's routing activity and provide insights into their trade execution patterns.

:::note
`Trade Side Account` field will not be available for aggregate queries in Archive and Combined Datasets
:::

## Latest Trades Routed via Photon

This query retrieves the latest 100 trades that were routed through Photon on Solana.
The query uses a `joinInstructions` function to filter trades that specifically involved Photon's routing program (address: `BSfD6SHZigAfDWSjzD5Q41jw8LmKwtmjskPH9XW1mrRW`). For more information about using joins in Bitquery APIs, see our [graphQL joins documentation](/docs/graphql/capabilities/joins/).

[Run Query](https://ide.bitquery.io/Trades-Executed-on-Photon)

```graphql
{
  Solana {
    DEXTrades(limit: {count: 100}, orderBy: {descending: Block_Time}) {
      Trade {
        Dex {
          ProtocolName
        }
        Sell {
          Currency {
            Symbol
          }
          Amount
          AmountInUSD
          Account {
            Address
          }
          Price
          PriceInUSD
        }
        Buy {
          Currency {
            Symbol
          }
          Amount
          AmountInUSD
          Account {
            Address
          }
          Price
          PriceInUSD
        }
      }
      Transaction {
        Signature
      }
      Instruction {
        ExternalSeqNumber
        InternalSeqNumber
      }
      joinInstructions(
        join: inner
        Block_Slot: Block_Slot
        Transaction_Signature: Transaction_Signature
        where: {Instruction: {Program: {Address: {is: "BSfD6SHZigAfDWSjzD5Q41jw8LmKwtmjskPH9XW1mrRW"}}}}
      ) {
        Instruction {
          Program {
            Address
          }
        }
        Transaction {
          Signature
        }
      }
    }
  }
}

```

## Get Trade Transactions Of Photon For A Particular Pair

The query will get latest trades for a Solana pair executed via Photon
You can find the query [here](https://ide.bitquery.io/Trades-of-a-Pair-Executed-on-Photon)

```graphql
{
  Solana {
    DEXTrades(
      limit: {count: 100}
      orderBy: {descending: Block_Time}
      where: {Trade: {Market:{MarketAddress:{is:"FsKeY7bWnGL3ucTVfWWWJZyGCqr1VGXbKVZWteUHPYzX"}}}}
    ) {
      Trade {
        Dex {
          ProtocolName
        }
        Sell {
          Currency {
            Symbol
          }
          Amount
          AmountInUSD
          Account {
            Address
          }
          Price
          PriceInUSD
        }
        Buy {
          Currency {
            Symbol
          }
          Amount
          AmountInUSD
          Account {
            Address
          }
          Price
          PriceInUSD
        }
        Market {
          MarketAddress
        }
      }
      Transaction {
        Signature
      }
      Instruction {
        ExternalSeqNumber
        InternalSeqNumber
      }
      joinInstructions(
        join: inner
        Block_Slot: Block_Slot
        Transaction_Signature: Transaction_Signature
        where: {Instruction: {Program: {Address: {is: "BSfD6SHZigAfDWSjzD5Q41jw8LmKwtmjskPH9XW1mrRW"}}}}
      ) {
        Instruction {
          Program {
            Address
          }
        }
        Transaction {
          Signature
        }
      }
    }
  }
}

```

---

## Trader-Focused Trade APIs (with USD Price, Market Cap & Supply)

The queries below use the **[Trades cube](/docs/trading/crypto-trades-api/trades-api/)** (`Trading { Trades }`) which is trader-focused and provides reliable USD prices including for all tokens. See [DEXTrades vs DEXTradeByTokens vs Trades cube](/docs/cubes/dextrades-dextradebytokens-trading-trades) for when to use which.

### Get All DEX Trades on Solana With Price, Market Cap, and Supply

Stream **all Solana DEX trades** in real time with **USD price**, **market cap**, **FDV**, **circulating supply**, and **transaction fee** data. Filter by **`Pair.Market.Network: Solana`** to capture every swap across **Raydium**, **Orca**, **Jupiter**, **PumpSwap**, and other Solana DEXs in a single subscription.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/All-trades-on-Solana-with-Price-Marketcap-supply).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Trading {
    Trades(where: { Pair: { Market: { Network: { is: "Solana" } } } }) {
      Side
      Supply {
        MaxSupply
        TotalSupply
        FullyDilutedValuationUsd
        CirculatingSupply
        MarketCap
      }
      Trader {
        Address
      }
      TransactionHeader {
        Fee
        FeePayer
        Sender
        To
        Hash
        Index
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
        Date
        Time
        Timestamp
      }
      Pair {
        Currency {
          Id
          Name
          Symbol
        }
        Market {
          Address
          Program
          Network
        }
        QuoteCurrency {
          Id
          Name
          Symbol
        }
        Token {
          Address
          Id
          IsNative
          Symbol
          TokenId
          Network
        }
        QuoteToken {
          Address
          Id
          IsNative
          Symbol
          TokenId
          Network
        }
      }
      Price
      PriceInUsd
    }
  }
}
```

</details>

### Top Traders by PnL for a Specific Pool (Last 30 Minutes)

Rank traders by **`PnL`** on one pool: filter **`Pair.Market.Address`**, last **30 minutes**, **`limit: 10`**, and **`orderBy`** **`PnL`** descending. Useful for **leaderboards**, **smart-money screens**, and **pool-specific trader analytics**.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/Top-Traders-by-PnL-of-a-specific-pair#).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Trading {
    Trades(
      limit: { count: 10 }
      orderBy: [{ descendingByField: "PnL" }]
      where: {
        Block: { Time: { since_relative: { minutes_ago: 30 } } }
        Pair: {
          Market: {
            Address: { is: "2axyccPzS7Ei57c7ESEq7tBpo4HxtpfCR9gKxh5uNUpu" }
          }
        }
      }
    ) {
      Trader {
        Address
      }
      Amount_Bought: sum(of: AmountsInUsd_Base, if: { Side: { is: "Buy" } })
      Amount_Sold: sum(of: AmountsInUsd_Base, if: { Side: { is: "Sell" } })
      Amount_Bought_native: sum(of: Amounts_Base, if: { Side: { is: "Buy" } })
      Amount_Sold_native: sum(of: Amounts_Base, if: { Side: { is: "Sell" } })
      PnL: calculate(expression: "$Amount_Sold - $Amount_Bought")
      buys: count(if: { Side: { is: "Buy" } })
      sells: count(if: { Side: { is: "Sell" } })
    }
  }
}
```

</details>

---

## Video Tutorial | Photon API Tutorial: Track DEXTrades on Solana (2026)

import VideoPlayer from "../../../src/components/videoplayer.js";

<VideoPlayer url="https://www.youtube.com/watch?v=XoKQIymC4kA" />

<FAQ
  items={[
    { q: "How do I query Photon aggregator trades?", a: "Filter Solana.DEXTrades for Photon routes — the examples on this page show the program and protocol filters to use." },
    { q: "Is Photon data available in real time?", a: "Yes. Use GraphQL subscriptions or Kafka streams for live swap data as blocks are processed." },
    { q: "How is Photon different from querying Raydium directly?", a: "Photon is an aggregator — one swap may route through multiple DEXs. Filter by Photon to see aggregator-level trades." },
  ]}
/>
