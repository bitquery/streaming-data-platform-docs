---
title: "Polymarket API - Prediction Market Data"
description: "Query Polymarket on-chain data with Bitquery GraphQL: trades, outcome prices, wallet PnL, market lifecycle and oracle resolutions, with WebSocket and Kafka streams."
# This doc is the "Polymarket API" category page. /examples/polymarket-api/ is the
# URL that ranks for "polymarket api", so the full guide lives here; the old
# /polymarket-api/polymarket-api/ URL redirects to it (docusaurus.config.js).
slug: /examples/polymarket-api
keywords:
  - Polymarket API
  - Polymarket GraphQL API
  - prediction market trades
  - Polymarket trading data
  - prediction market API
  - query Polymarket markets
  - Polymarket price API
  - get Polymarket data
  - Polymarket blockchain API
  - prediction market trades API
  - position settlement API
  - oracle resolution
  - Polygon smart contracts
  - GraphQL blockchain API
  - cryptocurrency prediction markets
  - real-time market data
  - position trading API
  - oracle resolution API
---
import FAQ from "@site/src/components/FAQ";
import ProductCTA from "@site/src/components/ProductCTA";

# Polymarket API - Prediction Market Data

The Bitquery Polymarket API provides prediction market data on Polygon via GraphQL. Use `dataset: realtime` on `EVM` queries for `PredictionTrades`, `PredictionSettlements`, and related prediction-market APIs. This dataset retains roughly the **last 7 days**. Use it to query trades, settlements, market metadata, and volume; filter by condition_id, outcome token, or trade size; and access data via REST, WebSocket subscriptions, or Kafka streams. Filter by Polymarket using `ProtocolName: "polymarket"` or `Marketplace.ProtocolName` in your queries.

If you are evaluating data providers, the [Polymarket API product page](https://bitquery.io/products/polymarket-api) summarizes market, trade and position coverage with plans and real-time delivery options.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::note Dataset
Polymarket prediction-market data on Polygon requires `dataset: realtime` (~**7 days** of rolling history). Add `dataset: realtime` to the `EVM(...)` argument in your GraphQL examples when using prediction trades and settlements. For anything older, use the [Polymarket historical data exports](/docs/cloud/polymarket/).
:::

---

<ProductCTA href="https://bitquery.io/products/polymarket-api" title="Polymarket API" />

## Bitquery Polymarket API vs the official Polymarket API

Polymarket's own APIs (Gamma, CLOB, Data API) are the right choice for **placing orders**, reading the **order book**, and looking up one market or one account at a time. Bitquery indexes Polymarket **on-chain**, straight from the exchange and Conditional Tokens contracts on Polygon, so it fits the jobs the official API is not built for:

| Job | Official Polymarket API | Bitquery Polymarket API |
| --- | --- | --- |
| Place and manage orders, order book depth | Yes (CLOB) | No, read-only data |
| Aggregate across **all markets** in one request (top markets, top traders, volume by day) | Paginate and compute yourself | One GraphQL query with `sum`, `count`, `limitBy` |
| **Whale and insider detection** across every market | Manual | One subscription or query, see [insider detection](/docs/examples/polymarket-api/polymarket-insider-detection-api/) |
| **Wallet PnL** and cross-market activity | Per-account endpoints | [Wallet API](/docs/examples/polymarket-api/polymarket-wallet-api/) and [realized PnL](/docs/examples/polymarket-api/polymarket-wallet-realized-pnl/) |
| Join with other Polygon data (funding transfers, balances, DEX trades) | No | Same GraphQL endpoint and schema |
| Delivery | REST and WebSocket | GraphQL, WebSocket subscriptions, **Kafka**, and [Parquet historical exports](/docs/cloud/polymarket/) |

Many teams use both: the official CLOB API to trade, and Bitquery for analytics, alerts and backfills. A longer comparison is in [Polymarket API vs Bitquery Polymarket API](/docs/API-Blog/polymarket-api-vs-bitquery-polymarket-api/).

:::info Polymarket contracts and collateral (2026 migration)
Polymarket moved trading to new exchange contracts in April 2026 and now settles in **pUSD** (`0xC011a7E12a19f7B1f670d46F03B03f3342E82DFB`), a USDC-backed ERC-20 that wraps USDC.e. Current Polygon addresses:

- **CTF Exchange:** `0xE111180000d2663C0091e4f400237545B87B996B`
- **Neg Risk CTF Exchange:** `0xe2222d279d744050d28e00520010520000310F59`
- **Conditional Tokens (CTF):** `0x4D97DCd97eC945f40cF65F87097ACe5EA0476045` (unchanged)

Inside the Conditional Tokens contract, custody is still USDC.e; pUSD is what traders hold and what `CollateralToken` returns on trades. Queries that filter by `ProtocolName: "polymarket"` need no change. If you hardcode exchange or collateral addresses, use the ones above; the previous exchanges (`0x4bFb41d5…8982E`, `0xC5d563A3…0f80a`) no longer emit `OrderFilled`.
:::

## Polymarket API guides

- [Polymarket Wallet & User Activity API](/docs/examples/polymarket-api/polymarket-wallet-api/): activity, volume and market counts by wallet
- [Polymarket Wallet Realized PnL](/docs/examples/polymarket-api/polymarket-wallet-realized-pnl/): profit and loss per trader
- [Polymarket Advanced Analytics API](/docs/examples/polymarket-api/polymarket-advanced-analytics-api/): TVL, daily volume, order flow, whale streams
- [Polymarket Markets API](/docs/examples/polymarket-api/polymarket-markets-api/): look up markets by slug, condition ID or outcome token
- [Polymarket Insider Detection API](/docs/examples/polymarket-api/polymarket-insider-detection-api/): fresh wallets, funding sources, pre-resolution bets
- [Polymarket Sports API](/docs/examples/polymarket-api/polymarket-sports-api/), [Commodity API](/docs/examples/polymarket-api/polymarket-commodity-api/), [Bitcoin API](/docs/examples/polymarket-api/bitcoin-polymarket-api/) and [AI & Tech API](/docs/examples/polymarket-api/polymarket-ai-tech-api/): category-specific markets
- [Polymarket historical data (Parquet, S3, Snowflake, BigQuery)](/docs/cloud/polymarket/): full-history backfills
- [Polymarket Telegram alerts bot](/docs/usecases/polymarket-tg-alerts-bot/): tutorial
- [bitquery/polymarket-api on GitHub](https://github.com/bitquery/polymarket-api): SDKs and runnable examples

## What Polymarket data can I get with Bitquery?

Bitquery provides **trades and prices** (buy/sell activity, volume, outcome prices), **positions and redemptions** (splits, merges after resolution), **market lifecycle** (creation, resolution, oracle outcomes), **market metadata** (condition ID, slug, token filters via CTF Exchange), **wallet activity** (volume and market counts by address), and **real-time streaming** (Kafka for trades and settlements). All data is on Polygon (`network: matic`) with `dataset: realtime` (about the **last 7 days**). Use the links below to find the right API.

### How do I get Polymarket trades and prices?

Use the **[Prediction Trades API](/docs/examples/prediction-market/prediction-trades-api)** to query buy/sell activity, track prices, and monitor volume across Polymarket.

[→ Prediction Trades API](/docs/examples/prediction-market/prediction-trades-api)

### How do I track positions and redemptions?

Use the **[Prediction Settlements API](/docs/examples/prediction-market/prediction-settlements-api)** to query splits, merges, and redemptions after market resolution.

[→ Prediction Settlements API](/docs/examples/prediction-market/prediction-settlements-api)

### How do I get market lifecycle data?

Use the **[Prediction Market API](/docs/examples/prediction-market/prediction-market-api)** to query market creation, resolution, and complete lifecycle events.

[→ Prediction Market API](/docs/examples/prediction-market/prediction-market-api)

### How do I query Polymarket CTF exchange data (condition ID, slug, token)?

Use the **[Polymarket Markets API](/docs/examples/polymarket-api/polymarket-markets-api)** (CTF Exchange) to query market data by slug, condition ID, outcome token, or event. Combine with [Prediction Trades API](/docs/examples/prediction-market/prediction-trades-api) and [Prediction Market API](/docs/examples/prediction-market/prediction-market-api) for full lifecycle.

[→ Polymarket Markets API (CTF Exchange)](/docs/examples/polymarket-api/polymarket-markets-api)

### How do I get Polymarket wallet and user activity?

Use the **[Polymarket Wallet & User Activity API](/docs/examples/polymarket-api/polymarket-wallet-api)** to query recent activity, volume, and market counts by wallet address.

[→ Wallet & User Activity API](/docs/examples/polymarket-api/polymarket-wallet-api)

### How do I build TVL, open-interest-style metrics, maker/taker splits, and order-flow analytics?

Use the **[Polymarket Advanced Analytics API](/docs/examples/polymarket-api/polymarket-advanced-analytics-api)** for GraphQL examples: USDC balances in core contracts, daily volume and maker/taker splits, order-flow by market, whale-trade subscriptions, settlement flows, and top markets by volume.

[→ Polymarket Advanced Analytics API](/docs/examples/polymarket-api/polymarket-advanced-analytics-api)

### How do I stream Polymarket data in real time?

Use **Kafka Streams** for low-latency Polymarket data. Subscribe to trades, settlements, and market events as they happen.

Available Kafka topics:

- `matic.predictions.proto`: Raw prediction market events
- `matic.broadcasted.predictions.proto`: Mempool prediction market data

Note: Kafka streaming requires separate credentials. [Contact support](https://t.me/bloxy_info) or email support@bitquery.io for access.

[→ Kafka Streams Documentation](/docs/streams/kafka-streaming-concepts)

---

## How do I get real-time Polymarket trades using Bitquery?

Use Bitquery's `PredictionTrades` GraphQL query filtered by `ProtocolName: "polymarket"` on Polygon (`network: matic`). For live streaming, use a subscription or Kafka.

[Run in Bitquery IDE](https://ide.bitquery.io/prediction_trades)

```graphql
query {
  EVM(network: matic) {
    PredictionTrades(
      limit: { count: 10 }
      orderBy: { descending: Transaction_Time }
      where: {
        Trade: {
          Prediction: { Marketplace: { ProtocolName: { is: "polymarket" } } }
          OutcomeTrade: { IsOutcomeBuy: true }
        }
      }
    ) {
      Transaction {
        Hash
        Time
      }
      Trade {
        Prediction {
          Question {
            Title
            MarketId
          }
          Outcome {
            Label
          }
          CollateralToken {
            Symbol
          }
        }
        OutcomeTrade {
          Buyer
          Seller
          Amount
          CollateralAmount
        }
      }
    }
  }
}
```

---

## Query Examples

### How do I subscribe to live Polymarket trades?

Use a GraphQL subscription on `PredictionTrades` filtered by `Marketplace.ProtocolName: "polymarket"` to stream trades as they happen on Polygon:

```graphql
subscription PredictionTradesStream {
  EVM(network: matic) {
    PredictionTrades(
      where: {
        TransactionStatus: { Success: true }
        Trade: {
          Prediction: { Marketplace: { ProtocolName: { is: "polymarket" } } }
        }
      }
    ) {
      Block {
        Time
      }
      Trade {
        OutcomeTrade {
          Buyer
          Seller
          Amount
          CollateralAmount
          Price
          IsOutcomeBuy
        }
        Prediction {
          Question {
            Title
            MarketId
          }
          Outcome {
            Label
          }
          CollateralToken {
            Symbol
          }
        }
      }
      Transaction {
        Hash
      }
    }
  }
}
```

### How do I filter Polymarket trades by condition_id or asset ID?

Use `PredictionManagements` with `OutcomeToken.AssetId` or `Condition.Id` in the where clause. For condition_id, market_slug, and combined filters, see the [Polymarket Markets API (CTF Exchange)](/docs/examples/polymarket-api/polymarket-markets-api/).

[Run query](https://ide.bitquery.io/Filter-markets-by-asset-ID-Polymarket)

```graphql
query MarketsByAssetId($assetIds: [String!]) {
  EVM(network: matic) {
    PredictionManagements(
      limit: { count: 50 }
      orderBy: { descending: Block_Time }
      where: {
        Management: {
          Prediction: {
            Marketplace: { ProtocolName: { is: "polymarket" } }
            OutcomeToken: { AssetId: { in: $assetIds } }
          }
        }
      }
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
        Time
      }
      Management {
        EventType
        Prediction {
          Condition {
            Id
            QuestionId
            Outcomes {
              Id
              Index
              Label
            }
          }
          Question {
            MarketId
            Title
            Image
            ResolutionSource
            CreatedAt
          }
          CollateralToken {
            Symbol
            Name
          }
          Outcome {
            Id
            Label
          }
          OutcomeToken {
            AssetId
            SmartContract
          }
        }
      }
    }
  }
}
```

**Variables (example):**

```json
{
  "assetIds": [
    "19443761038809394075988687891855393102730862479306560066876868792031660494383"
  ]
}
```

### How do I get Polymarket markets ranked by volume?

Use Bitquery's `PredictionTrades` with `limitBy: Trade_Prediction_Question_Id`, `orderBy: descendingByField: "sumBuyAndSell"`, and `sum(of: Trade_OutcomeTrade_CollateralAmountInUSD)` grouped by buy/sell to rank markets by total volume over a time window.

[Run query](https://ide.bitquery.io/Top-Polymarket-Markets-by-Volume)

```graphql
query questionsByVolume($time_ago: DateTime) {
  EVM(network: matic) {
    PredictionTrades(
      where: {
        TransactionStatus: {Success: true}
        Block: {Time: {since: $time_ago}}
        Trade: {Prediction: {Marketplace: {ProtocolName: {is: "polymarket"}}}}
      }
      limit: {count: 100}
      orderBy: {descendingByField: "sumBuyAndSell"}
      limitBy: {by: Trade_Prediction_Question_Id}
    ) {
      Trade {
        Prediction {
          Question {
            Id
            Image
            Title
            CreatedAt
          }
        }
      }
      buyUSD: sum(
        of: Trade_OutcomeTrade_CollateralAmountInUSD
        if: {Trade: {OutcomeTrade: {IsOutcomeBuy: true}}}
      )
      sellUSD: sum(
        of: Trade_OutcomeTrade_CollateralAmountInUSD
        if: {Trade: {OutcomeTrade: {IsOutcomeBuy: false}}}
      )
      sumBuyAndSell: calculate(expression: "$buyUSD + $sellUSD")
    }
  }
}
```

**Variables (example):**

```json
{
  "time_ago": "2026-02-24T07:22:21Z"
}
```

## How do I get real-time odds for all active Polymarket markets?

Use a GraphQL subscription on `PredictionTrades` with `limitBy: { count: 1, by: [Trade_Prediction_Question_Id, Trade_Prediction_Outcome_Label] }` filtered by `ProtocolName: "polymarket"` to stream the latest odds for every active market. Returns live price and outcome probabilities.

[Run in Bitquery IDE](https://ide.bitquery.io/How-do-I-get-real-time-odds-for-all-active-Polymarket-markets)

```graphql
subscription {
  EVM(network: matic) {
    PredictionTrades(
      limitBy: {count: 1, by: [Trade_Prediction_Question_Id, Trade_Prediction_Outcome_Label]}
      where: {Trade: {Prediction: {Marketplace: {ProtocolName: {is: "polymarket"}}}}}
    ) {
      Trade {
        OutcomeTrade {
          Price
          PriceInUSD
          IsOutcomeBuy
        }
        Prediction {
          CollateralToken {
            Name
            Symbol
            AssetId
          }
          Question {
            Title
            ResolutionSource
            Image
            MarketId
            Id
            CreatedAt
          }
          Outcome {
            Label
          }
        }
      }
    }
  }
}
```

## How do I track high-value or whale trades on Polymarket?

Use a GraphQL subscription on `PredictionTrades` filtered by `CollateralAmountInUSD: { gt: "10000" }` and `ProtocolName: "polymarket"` to monitor trades exceeding $10,000 USD in real time. Ideal for detecting whale activity and large market movements.

[Run in Bitquery IDE](https://ide.bitquery.io/How-do-I-track-high-value-or-whale-trades-on-Polymarket)

```graphql
subscription {
  EVM(network: matic) {
    PredictionTrades(
      where: {
        TransactionStatus: {Success: true}
        Trade: {
          Prediction: {Marketplace: {ProtocolName: {is: "polymarket"}}}
          OutcomeTrade: {CollateralAmountInUSD: {gt: "10000"}}
        }
      }
    ) {
      Block {
        Time
      }
      Call {
        Signature {
          Name
        }
      }
      Log {
        Signature {
          Name
        }
        SmartContract
      }
      Trade {
        OutcomeTrade {
          Buyer
          Seller
          Amount
          CollateralAmount
          CollateralAmountInUSD
          OrderId
          Price
          PriceInUSD
          IsOutcomeBuy
        }
        Prediction {
          CollateralToken {
            Name
            Symbol
            SmartContract
            AssetId
          }
          ConditionId
          OutcomeToken {
            Name
            Symbol
            SmartContract
            AssetId
          }
          Marketplace {
            SmartContract
            ProtocolVersion
            ProtocolName
            ProtocolFamily
          }
          Question {
            Title
            ResolutionSource
            Image
            MarketId
            Id
            CreatedAt
          }
          Outcome {
            Id
            Index
            Label
          }
        }
      }
      Transaction {
        From
        Hash
      }
    }
  }
}
```

## What are the largest Polymarket trades in the last 7 days?

Use `PredictionTrades` with `orderBy: { descending: Trade_OutcomeTrade_CollateralAmountInUSD }` and filter by `ProtocolName: "polymarket"` to get the top 10 largest trades by USD volume. Add `Block.Time: { since: $time_ago }` for a custom time window.

[Run in Bitquery IDE](https://ide.bitquery.io/What-are-the-largest-Polymarket-trades-in-the-last-7-days)

```graphql
query {
  EVM(network: matic) {
    PredictionTrades(
      limit: {count: 10}
      orderBy: {descending: Trade_OutcomeTrade_CollateralAmountInUSD}
      where: {
        TransactionStatus: {Success: true}
        Trade: {
          Prediction: {Marketplace: {ProtocolName: {is: "polymarket"}}}
          OutcomeTrade: {CollateralAmountInUSD: {gt: "10000"}}
        }
      }
    ) {
      Block{
        Time
        Date
      }
      Trade {
        OutcomeTrade {
          Buyer
          Seller
          Amount
          CollateralAmount
          CollateralAmountInUSD
          OrderId
          Price
          PriceInUSD
          IsOutcomeBuy
        }
        Prediction {
          CollateralToken {
            Name
            Symbol
            SmartContract
            AssetId
          }
          ConditionId
          OutcomeToken {
            Name
            Symbol
            SmartContract
            AssetId
          }
          Marketplace {
            SmartContract
            ProtocolVersion
            ProtocolName
            ProtocolFamily
          }
          Question {
            Title
            ResolutionSource
            Image
            MarketId
            Id
            CreatedAt
          }
          Outcome {
            Id
            Index
            Label
          }
        }
      }
      Transaction {
        From
        Hash
      }
    }
  }
}
```

## How do I get top buyers and sellers on Polymarket by volume?

Use `PredictionTrades` with `limitBy` and `sum(of: Trade_OutcomeTrade_CollateralAmountInUSD)` grouped by Buyer (or Seller) to rank the top 100 wallets by volume over the last 5 days. Useful for leaderboards, whale tracking, and trader analytics.

[Run in Bitquery IDE](https://ide.bitquery.io/How-do-I-get-top-buyers-and-sellers-on-Polymarket-by-volume)

```graphql
query {
  EVM(network: matic) {
    buyers: PredictionTrades(
      limit: {count: 100}
      orderBy: {descendingByField: "volume_usd"}
      where: {
        Block: {Time: {since_relative: {days_ago: 5}}}
        TransactionStatus: {Success: true}
        Trade: {Prediction: {Marketplace: {ProtocolName: {is: "polymarket"}}}}
      }
    ) {
      volume_usd: sum(of: Trade_OutcomeTrade_CollateralAmountInUSD)
      Trade {
        OutcomeTrade {
          Buyer
        }
      }
    }
    sellers: PredictionTrades(
      limit: {count: 100}
      orderBy: {descendingByField: "volume_usd"}
      where: {
        Block: {Time: {since_relative: {days_ago: 5}}}
        TransactionStatus: {Success: true}
        Trade: {Prediction: {Marketplace: {ProtocolName: {is: "polymarket"}}}}
      }
    ) {
      volume_usd: sum(of: Trade_OutcomeTrade_CollateralAmountInUSD)
      Trade {
        OutcomeTrade {
          Seller
        }
      }
    }
  }
}
```

## How do I count trades for a specific Polymarket trader?

Use `PredictionTrades` with `any` filter on `Buyer` or `Seller` to return the total trade count for a wallet. Add `ProtocolName: "polymarket"` to restrict to Polymarket only. Replace the address with your target wallet.

[Run in Bitquery IDE](https://ide.bitquery.io/How-do-I-count-trades-for-a-specific-Polymarket-trader)

```graphql
query {
  EVM(network: matic) {
    PredictionTrades(
      where: {
        TransactionStatus: {Success: true}
        any: [
          {Trade: {Prediction: {Marketplace: {ProtocolName: {is: "polymarket"}}}, OutcomeTrade: {Buyer: {is: "0xd48165a42bb4eeb5971e5e830c068eef0890af35"}}}}
          {Trade: {Prediction: {Marketplace: {ProtocolName: {is: "polymarket"}}}, OutcomeTrade: {Seller: {is: "0xd48165a42bb4eeb5971e5e830c068eef0890af35"}}}}
        ]
      }
    ) {
      count
    }
  }
}
```

---

<FAQ
  items={[
    { q: "How do I get Polymarket trade data through an API?", a: "Query EVM(dataset: realtime, network: matic) for PredictionTrades with ProtocolName polymarket. Filter by wallet, condition_id, or outcome token. Use the IDE to test, then add your API token for production." },
    { q: "How do I filter trades by market or condition_id?", a: "Look up the condition_id in the Polymarket Markets API, then pass it into PredictionTrades or PredictionManagements filters. The Markets API also accepts slug and token ID." },
    { q: "What is the Polymarket CTF Exchange?", a: "The CTF (Conditional Token Framework) Exchange is Polymarket's prediction market layer on Polygon. Bitquery indexes it as polymarket protocol. Use the Polymarket Markets API to query by condition_id, slug, or token ID." },
    { q: "How far back does Polymarket data go?", a: "The realtime dataset keeps roughly the last 7 days of prediction trades and settlements. For longer history or bulk loads, ask about cloud exports or archive options." },
    { q: "Can I stream Polymarket trades in real time?", a: "Yes. Change your query to a GraphQL subscription over WebSocket, or use Kafka on matic.predictions.proto if your plan includes streaming access." },
    { q: "Where can I get Polymarket BTC up/down market data?", a: "Filter PredictionTrades by market question or condition_id for BTC up/down markets. For a dedicated short-interval product, contact support on Telegram." },
  ]}
/>

## How much Polymarket volume goes through each exchange contract?

Group one day of trades by exchange contract and collateral token. This shows the split between the **CTF Exchange** and the **Neg Risk CTF Exchange**, and confirms the collateral token (pUSD) your integration should expect.

[Run in Bitquery IDE](https://ide.bitquery.io/polymarket-volume-by-exchange-contract-and-collateral)

```graphql
query PolymarketVolumeByExchange($date: String!) {
  EVM(dataset: realtime, network: matic) {
    PredictionTrades(
      where: {
        TransactionStatus: { Success: true }
        Block: { Date: { is: $date } }
        Trade: {
          Prediction: { Marketplace: { ProtocolName: { is: "polymarket" } } }
        }
      }
      limit: { count: 10 }
      orderBy: { descendingByField: "volume_usd" }
    ) {
      Trade {
        Prediction {
          Marketplace {
            SmartContract
            ProtocolVersion
          }
          CollateralToken {
            Symbol
            SmartContract
          }
        }
      }
      volume_usd: sum(of: Trade_OutcomeTrade_CollateralAmountInUSD)
      trades: count
    }
  }
}
```

**Variables (example):**

```json
{
  "date": "2026-09-17"
}
```

## Support

For questions and technical support:

- [Bitquery Telegram](https://t.me/bloxy_info)
