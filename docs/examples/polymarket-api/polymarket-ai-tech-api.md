---
title: "Polymarket AI & Tech Markets API - OpenAI, GPT & Big Tech Odds"
description: "Query and stream Polymarket AI and tech prediction markets: OpenAI, GPT, Anthropic, AGI and big-tech bets. Live odds (implied probability), odds movement OHLC, market creation and resolution, volume, and whale trades via GraphQL and Kafka on Polygon."
keywords:
  - Polymarket AI markets API
  - Polymarket tech markets
  - Polymarket OpenAI odds
  - Polymarket GPT prediction
  - Polymarket AGI market
  - AI prediction markets
  - Polymarket live odds API
  - Polymarket GraphQL subscription
  - Polymarket Kafka streams
  - Polygon prediction markets AI
---
# Polymarket AI & Tech Markets API

Get full access to **Polymarket AI and tech prediction markets** through one API. That covers OpenAI, GPT, Anthropic, AGI, and big-tech bets, with live odds (implied probability), trades, volume, market creation and resolution, and trader activity.

Bitquery runs **its own blockchain nodes** and **indexes, decodes, and parses** raw Polygon transactions into clean, structured prediction-market data. You don't have to run nodes, decode contract logs, or stitch together odds yourself. The same data is available three ways:

- **Historical queries:** backfill odds, volume, and resolutions over any time range.
- **Real-time GraphQL subscriptions (WebSocket):** stream new trades and odds the moment they hit the chain.
- **Kafka streams:** low-latency, high-throughput feeds for production pipelines.

Every query below can be run live by changing `query` to `subscription`.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token. See [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/).
:::

---

## How AI & Tech Markets Are Identified

AI and tech markets are matched by a keyword in **`Question.Title`** using `includesCaseInsensitive`. The same filter works on **PredictionManagements**, **PredictionTrades**, and **PredictionSettlements**, placed under `Prediction.Question.Title`.

| Topic            | Example `Question.Title` keyword |
| ---------------- | -------------------------------- |
| OpenAI           | `"OpenAI"`                       |
| ChatGPT / GPT    | `"GPT"`                          |
| Anthropic        | `"Anthropic"`                    |
| Claude           | `"Claude"`                       |
| Google Gemini    | `"Gemini"`                       |
| xAI / Grok       | `"Grok"`                         |
| AGI              | `"AGI"`                          |
| Big Tech         | `"Apple"`, `"Nvidia"`, `"Tesla"` |

> **Tip:** To match the whole AI category, use the standalone word with surrounding spaces, `" AI "`. This avoids the substring trap where a bare `"AI"` also catches unrelated words such as "Spain" or "fair". For a specific company or model, use a precise term like `"OpenAI"` or `"GPT"`. A single market is uniquely identified by its **`Question.MarketId`**.

---

## Latest AI Markets Created

Returns the 10 most recent **Created** events for Polymarket markets whose title includes the standalone word **" AI "** (note the surrounding spaces). Swap the keyword for any term from the table above.

[Run in Bitquery IDE](https://ide.bitquery.io/Latest-AI-markets-created-on-Polymarket)

```graphql
query LatestAIMarketsCreated {
  EVM(network: matic) {
    PredictionManagements(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: {
        Management: {
          EventType: { is: "Created" }
          Prediction: {
            Marketplace: { ProtocolName: { is: "polymarket" } }
            Question: { Title: { includesCaseInsensitive: " AI " } }
          }
        }
      }
    ) {
      Block {
        Time
      }
      Management {
        Description
        EventType
        Prediction {
          Condition {
            Id
            QuestionId
            Outcomes {
              Index
              Label
            }
          }
          Outcome {
            Index
            Label
          }
          Question {
            CreatedAt
            Id
            Image
            MarketId
            ResolutionSource
            Title
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

---

## Live Odds (Implied Probability) for an AI Market

Returns the **latest trade price per outcome** for one market by `MarketId`. This is the **live implied probability** for that question. On Polymarket an outcome's `Price` ranges from 0 to 1 and equals its implied probability (e.g. `0.62` = 62%). Replace `"<MARKET_ID>"` with a market ID from the creation query above. Change `query` to `subscription` for a live odds feed.

[Run in Bitquery IDE](https://ide.bitquery.io/Polymarket-AI-market-live-odds)

```graphql
query AIMarketLiveOdds {
  EVM(network: matic) {
    PredictionTrades(
      limitBy: { by: Trade_Prediction_Outcome_Label, count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        Trade: {
          Prediction: {
            Marketplace: { ProtocolName: { is: "polymarket" } }
            Question: { MarketId: { is: "<MARKET_ID>" } }
          }
        }
      }
    ) {
      Trade {
        OutcomeTrade {
          Price
          PriceInUSD
        }
        Prediction {
          Outcome {
            Index
            Label
          }
          OutcomeToken {
            Name
            AssetId
          }
          Question {
            Title
            MarketId
            ResolutionSource
            Image
          }
        }
      }
    }
  }
}
```

---

## Odds (Line) Movement: OHLC for an Outcome

Returns **OHLC** (Open, High, Low, Close) in USD for one outcome of an AI market, bucketed by interval (here 5 minutes). It shows how the implied probability moved over time, and powers charts and backtests. Replace `"<MARKET_ID>"` and `"<OUTCOME_LABEL>"` (e.g. `"Yes"` or `"No"`).

[Run in Bitquery IDE](https://ide.bitquery.io/Polymarket-AI-odds-movement-OHLC)

```graphql
query AIOddsMovementOHLC {
  EVM(network: matic) {
    PredictionTrades(
      limit: { count: 100 }
      orderBy: { descendingByField: "Block_Interval" }
      where: {
        Trade: {
          Prediction: {
            Question: { MarketId: { is: "<MARKET_ID>" } }
            Outcome: { Label: { is: "<OUTCOME_LABEL>" } }
          }
        }
      }
    ) {
      Block {
        Interval: Time(interval: { count: 5, in: minutes })
      }
      Trade {
        OutcomeTrade {
          Open: PriceInUSD(minimum: Block_Time)
          High: PriceInUSD(maximum: Trade_OutcomeTrade_PriceInUSD)
          Low: PriceInUSD(minimum: Trade_OutcomeTrade_PriceInUSD)
          Close: PriceInUSD(maximum: Block_Time)
        }
        Prediction {
          OutcomeToken {
            Name
            AssetId
          }
          Outcome {
            Id
            Label
          }
        }
      }
    }
  }
}
```

---

## Top AI Markets by Volume (Last 24 Hours)

Returns AI markets (title includes the standalone word **" AI "**) ranked by USD trading volume in the last 24 hours, with buyer and seller counts. Adjust `time_ago`, `limit`, and the title keyword as needed.

[Run in Bitquery IDE](https://ide.bitquery.io/Top-AI-markets-by-volume-Polymarket)

```graphql
query TopAIMarketsByVolume($time_ago: Int!, $limit: Int!) {
  EVM(network: matic) {
    PredictionTrades(
      where: {
        Block: { Time: { since_relative: { hours_ago: $time_ago } } }
        Trade: {
          Prediction: {
            Marketplace: { ProtocolName: { is: "polymarket" } }
            Question: { Title: { includesCaseInsensitive: " AI " } }
          }
        }
      }
      limit: { count: $limit }
      orderBy: { descendingByField: "sumBuyAndSell" }
    ) {
      Trade {
        Prediction {
          Question {
            Id
            Image
            Title
            MarketId
            CreatedAt
          }
        }
      }
      buyUSD: sum(
        of: Trade_OutcomeTrade_CollateralAmountInUSD
        if: { Trade: { OutcomeTrade: { IsOutcomeBuy: true } } }
      )
      sellUSD: sum(
        of: Trade_OutcomeTrade_CollateralAmountInUSD
        if: { Trade: { OutcomeTrade: { IsOutcomeBuy: false } } }
      )
      sumBuyAndSell: calculate(expression: "$buyUSD + $sellUSD")
      trades: count
      buyers: count(distinct: Trade_OutcomeTrade_Buyer)
      sellers: count(distinct: Trade_OutcomeTrade_Seller)
    }
  }
}
```

Variables:

```json
{
  "time_ago": 24,
  "limit": 100
}
```

---

## Latest Resolved AI Markets

Returns the 10 most recent **Resolved** AI markets, including the winning outcome. Use this to grade results and settle positions.

[Run in Bitquery IDE](https://ide.bitquery.io/Latest-resolved-AI-markets-Polymarket)

```graphql
query LatestResolvedAIMarkets {
  EVM(network: matic) {
    PredictionManagements(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: {
        Management: {
          EventType: { is: "Resolved" }
          Prediction: {
            Marketplace: { ProtocolName: { is: "polymarket" } }
            Question: { Title: { includesCaseInsensitive: " AI " } }
          }
        }
      }
    ) {
      Block {
        Time
      }
      Management {
        Description
        EventType
        Prediction {
          Outcome {
            Index
            Label
          }
          Question {
            Title
            MarketId
            ResolutionSource
            Image
            CreatedAt
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

---

## Real-Time Whale-Bet Alerts (Subscription)

Streams live AI-market trades above a USD threshold (here `$5,000`). This is ideal for whale-alert bots and detecting large, conviction bets. Filter with a `Question.Title` keyword, or swap it for a single-market `MarketId`. Change `subscription` to `query` for historical results.

[Run in Bitquery IDE](https://ide.bitquery.io/Polymarket-AI-whale-trades-stream)

```graphql
subscription {
  EVM(network: matic) {
    PredictionTrades(
      where: {
        Trade: {
          OutcomeTrade: { CollateralAmountInUSD: { gt: "5000" } }
          Prediction: {
            Marketplace: { ProtocolName: { is: "polymarket" } }
            Question: { Title: { includesCaseInsensitive: " AI " } }
          }
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
          CollateralAmountInUSD
          Price
          PriceInUSD
          IsOutcomeBuy
        }
        Prediction {
          Question {
            Title
            MarketId
            ResolutionSource
            Image
          }
          Outcome {
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

---

## Real-Time: GraphQL Subscriptions and Kafka

### GraphQL Subscriptions

Any query on this page can be run as a subscription. Keep the same `where` filters and fields, and change the keyword `query` to `subscription`. You receive new events as they occur on Polygon over a WebSocket connection.

### Kafka Streams

For ultra-low-latency consumption, prediction market data (including AI and tech markets) is available via Kafka:

- **`matic.predictions.proto`:** Raw prediction market events (creations, resolutions, trades)
- **`matic.broadcasted.predictions.proto`:** Mempool prediction market data

Kafka requires separate credentials. See [Kafka Streaming Concepts](/docs/streams/kafka-streaming-concepts/). For access, [contact support](https://t.me/bloxy_info) or email support@bitquery.io.

---

## Related APIs

| Need | API |
| ---- | --- |
| **Live odds, trades, volume by sport** | [Polymarket Sports API](/docs/examples/polymarket-api/polymarket-sports-api/) |
| **Commodity markets (gold, oil)** | [Polymarket Commodity API](/docs/examples/polymarket-api/polymarket-commodity-api/) |
| **Bitcoin up or down odds** | [Polymarket Bitcoin API](/docs/examples/polymarket-api/bitcoin-polymarket-api/) |
| **Insider & fresh-wallet detection** | [Polymarket Insider Detection API](/docs/examples/polymarket-api/polymarket-insider-detection-api/) |
| **Trader realized PnL & win rate** | [Realized PnL & Win Rate for Polymarket Trader](/docs/examples/polymarket-api/polymarket-wallet-realized-pnl/) |
| **Settlements & redemptions** | [Prediction Settlements API](/docs/examples/prediction-market/prediction-settlements-api/) |
| **Real-time: Kafka streams** | [Kafka Streaming Concepts](/docs/streams/kafka-streaming-concepts/) |

---

## Support

- [Bitquery Telegram](https://t.me/bloxy_info)
