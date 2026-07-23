---
title: "Polymarket Sports API - Live Odds, Cricket, NBA, NFL & Esports Markets"
description: "Query and stream Polymarket sports prediction markets: live odds and implied probability, odds (line) movement OHLC, market resolutions, volume by outcome, top traders, and whale-bet alerts for NBA, NFL, soccer, cricket, UFC and esports. Real-time via GraphQL subscriptions and Kafka on Polygon."
keywords:
  - Polymarket sports API
  - Polymarket live odds API
  - Polymarket win probability API
  - Polymarket odds movement
  - Polymarket NBA API
  - Polymarket NFL odds API
  - Polymarket soccer markets
  - Polymarket cricket markets
  - Polymarket esports
  - sports prediction markets
  - Polymarket sports whale alerts
  - Polymarket historical odds
  - prediction market subscription
  - Polymarket GraphQL subscription
  - Polymarket Kafka streams
  - prediction market ResolutionSource
  - Polygon prediction markets sports
---

# Polymarket Sports API - Live Odds, Cricket, NBA, NFL & Esports Markets

Get full access to **Polymarket sports markets** through one API. That covers NBA, NFL, soccer, cricket, UFC, esports and more, with live odds (implied probability), trades, volume, market creation and resolution, and trader-level activity.

Bitquery runs **its own blockchain nodes** and **indexes, decodes, and parses** raw Polygon transactions into clean, structured prediction-market data. You don't have to run nodes, decode contract logs, or stitch together odds yourself. The same data is available three ways:

- **Historical queries:** backfill odds, volume, and resolutions over any time range.
- **Real-time GraphQL subscriptions (WebSocket):** stream new trades and odds the moment they hit the chain.
- **Kafka streams:** low-latency, high-throughput feeds for production pipelines.

Every query below can be run live by changing `query` to `subscription`. See [Real-Time: GraphQL Subscriptions and Kafka](#real-time-graphql-subscriptions-and-kafka).

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token. See [How to generate Bitquery API token ➤](https://docs.bitquery.io/docs/authorization/how-to-generate/).
:::

---

## How Sports Markets Are Identified

| Filter               | Use case                                                                    | Where to apply                                    |
| -------------------- | --------------------------------------------------------------------------- | ------------------------------------------------- |
| **ResolutionSource** | Markets resolved by a specific source (e.g. `espncricinfo.com` for cricket) | `Management.Prediction.Question.ResolutionSource` |
| **Description**      | General sports markets (keyword in management description)                  | `Management.Description`                          |
| **Outcome label**    | Trades on outcomes whose label contains a term (e.g. "Esports")             | `Trade.Prediction.Outcome.Label`                  |

### Filter by League or Team

To target a specific league, tournament, or team, match a keyword in **`Question.Title`** with `includesCaseInsensitive` (case-insensitive). The same filter works on **PredictionManagements**, **PredictionTrades**, and **PredictionSettlements**. Just place it under `Prediction.Question.Title`.

| League / Sport     | Example `Question.Title` keyword      |
| ------------------ | ------------------------------------- |
| FIFA / World Cup   | `"World Cup"`                         |
| Soccer (EPL)       | `"Premier League"`                    |
| Soccer (La Liga)   | `"La Liga"`                           |
| Soccer (Serie A)   | `"Serie A"`                           |
| Soccer (UCL)       | `"Champions League"`                  |
| NBA                | `"NBA"`                               |
| NFL                | `"NFL"`                               |
| NHL                | `"NHL"`                               |
| MLB                | `"MLB"`                               |
| UFC / MMA          | `"UFC"`                               |
| Tennis             | `"Australian Open"`, `"Wimbledon"`, … |
| Cricket            | `"cricket"`                           |
| Esports (Valorant) | `"Valorant"`, or `"Esports"` (label)  |
| A specific team    | `"Lakers"`, `"Arsenal"`, …            |

> **Tip:** A single game is uniquely identified by its **`Question.MarketId`**. Use the creation queries above to discover market IDs, then plug them into the live-odds, OHLC, volume, and trader queries below.

---

### Real-Time: GraphQL Subscriptions and Kafka

#### GraphQL Subscriptions

Any **query** on this page can be run in **real time** as a **subscription**: keep the same `where` filters and requested fields, and change the keyword **`query`** to **`subscription`**. You receive new events (market creations or trades) as they occur on Polygon via a WebSocket connection.

#### Kafka Streams

For **ultra-low-latency** and high-throughput consumption, prediction market data (including sports) is also available via **Kafka**. The same lifecycle events and trades are delivered as Protocol Buffers on Polygon topics:

- **`matic.predictions.proto`:** Raw prediction market events (creations, resolutions, trades)
- **`matic.broadcasted.predictions.proto`:** Mempool prediction market data

Kafka requires **separate credentials** (IDE tokens do not work). See the full guide and topic list:

- **[Kafka Streaming Concepts](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/):** Connect, subscribe, parse messages, and configure consumers.

For credentials, [contact support](https://t.me/bloxy_info) or email support@bitquery.io.

## Latest FIFA World Cup Markets Created

Markets resolved via **FIFA** (`ResolutionSource` includes `fifa.com`). Returns the 10 most recent **Created** events with full condition, outcomes, question, and collateral token details.

[Run in Bitquery IDE](https://ide.bitquery.io/Latest-Fifa-World-Cup-Markets-Created)

```graphql
query LatestFifaMarketsCreated {
  EVM(network: matic) {
    PredictionManagements(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: {
        Management: {
          EventType: { is: "Created" }
          Prediction: {
            Question: { ResolutionSource: { includes: "fifa.com" } }
          }
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
      Management {
        Description
        EventType
        Prediction {
          CollateralToken {
            Name
            SmartContract
            Symbol
            AssetId
          }
          Condition {
            Id
            Oracle
            Outcomes {
              Id
              Index
              Label
            }
            QuestionId
          }
          Marketplace {
            ProtocolName
            ProtocolFamily
            SmartContract
          }
          Outcome {
            Id
            Index
            Label
          }
          OutcomeToken {
            Symbol
            SmartContract
            Name
            AssetId
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
        From
        Hash
      }
    }
  }
}
```

## Top FIFA World Cup Markets by Volume
Markets resolved via **FIFA** (`ResolutionSource` includes `fifa.com`). Returns the top 100 cricket related polymarkets sorted by trading volume in the past 24 hours.

[Run in Bitquery IDE](https://ide.bitquery.io/top-FIFA-World-Cup-markets-by-volume)

```graphql
query TopFIFAMarketsByVolume($time_ago: Int!, $limit: Int!) {
  EVM(network: matic) {
    PredictionTrades(
      where: {Block: {Time: {since_relative: {hours_ago: $time_ago}}}, Trade: {Prediction: {Question: {ResolutionSource: {includes: "fifa.com"}}}}}
      limit: {count: $limit}
      orderBy: {descendingByField: "sumBuyAndSell"}
    ) {
      Trade {
        Prediction {
          Question {
            Id
            Image
            Title
            CreatedAt
          }
          OutcomeToken {
            assetId0: AssetId(if: {Trade: {Prediction: {Outcome: {Index: {eq: 0}}}}})
            assetId1: AssetId(if: {Trade: {Prediction: {Outcome: {Index: {eq: 1}}}}})
          }
          Outcome {
            label0: Label(if: {Trade: {Prediction: {Outcome: {Index: {eq: 0}}}}})
            label1: Label(if: {Trade: {Prediction: {Outcome: {Index: {eq: 1}}}}})
          }
        }
        OutcomeTrade {
          price0: Price(
            maximum: Block_Time
            if: {Trade: {Prediction: {Outcome: {Index: {eq: 0}}}}}
          )
          price1: Price(
            maximum: Block_Time
            if: {Trade: {Prediction: {Outcome: {Index: {eq: 1}}}}}
          )
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
      trades: count
      buyers: count(distinct: Trade_OutcomeTrade_Buyer)
      sellers: count(distinct: Trade_OutcomeTrade_Seller)
      resolved: joinPredictionManagements(
        join: left
        Management_Prediction_Question_Id: Trade_Prediction_Question_Id
      ) {
        Block {
          Time(maximum: Block_Time, if: {Management: {EventType: {is: "Resolved"}}})
        }
      }
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

## Top FIFA World Cup Markets by Liquidity

Returns the top 100 FIFA World Cup related polymarkets sorted by liquidity position in the past 24 hours. Here `position` is the metric used for sorting, hence it could be regarded as the liquidity position of the particular market.

[Run in Bitquery IDE](https://ide.bitquery.io/Top-FIFA-World-Cup-Markets-by-Liquidity)

```graphql
query TopFIFAMarketByLiquidity($time_ago: Int!, $limit: Int!) {
  EVM(network: matic) {
    PredictionSettlements(
      where: {Block: {Time: {since_relative: {hours_ago: $time_ago}}}, Settlement: {Prediction: {Question: {ResolutionSource: {includes: "fifa.com"}}}}}
      limit: {count: $limit}
      orderBy: {descendingByField: "position"}
      limitBy: {by: Settlement_Prediction_Question_Id}
    ) {
      Settlement {
        Prediction {
          Question {
            Image
            MarketId
            Title
            Id
            CreatedAt
            ResolutionSource
          }
        }
      }
      split: sum(
        of: Settlement_Amounts_CollateralAmountInUSD
        if: {Settlement: {EventType: {is: "Split"}}}
      )
      merge: sum(
        of: Settlement_Amounts_CollateralAmountInUSD
        if: {Settlement: {EventType: {is: "Merge"}}}
      )
      position: calculate(expression: "$split - $merge")
      count(if: {Settlement: {EventType: {is: "Redemption"}}}, selectWhere: {eq: "0"})
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

## Latest Cricket Markets Created

Markets resolved via **ESPN Cricinfo** (`ResolutionSource` includes `espncricinfo.com`). Returns the 10 most recent **Created** events with full condition, outcomes, question, and collateral token details.

[Run in Bitquery IDE](https://ide.bitquery.io/Latest-Cricket-Markets-Created)

```graphql
query LatestCricketMarketsCreated {
  EVM(network: matic) {
    PredictionManagements(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: {
        Management: {
          EventType: { is: "Created" }
          Prediction: {
            Question: { ResolutionSource: { includes: "espncricinfo.com" } }
          }
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
      Management {
        Description
        EventType
        Prediction {
          CollateralToken {
            Name
            SmartContract
            Symbol
            AssetId
          }
          Condition {
            Id
            Oracle
            Outcomes {
              Id
              Index
              Label
            }
            QuestionId
          }
          Marketplace {
            ProtocolName
            ProtocolFamily
            SmartContract
          }
          Outcome {
            Id
            Index
            Label
          }
          OutcomeToken {
            Symbol
            SmartContract
            Name
            AssetId
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
        From
        Hash
      }
    }
  }
}
```

## Top Cricket Markets by Volume
Markets resolved via **ESPN Cricinfo** (`ResolutionSource` includes `espncricinfo.com`). Returns the top 100 cricket related polymarkets sorted by trading volume in the past 24 hours.

[Run in Bitquery IDE](https://ide.bitquery.io/top-cricket-markets-by-volume)

```graphql
query TopCricketMarketsByVolume($time_ago: Int!, $limit: Int!) {
  EVM(network: matic) {
    PredictionTrades(
      where: {Block: {Time: {since_relative: {hours_ago: $time_ago}}}, Trade: {Prediction: {Question: {ResolutionSource: {includes: "espncricinfo.com"}}}}}
      limit: {count: $limit}
      orderBy: {descendingByField: "sumBuyAndSell"}
    ) {
      Trade {
        Prediction {
          Question {
            Id
            Image
            Title
            CreatedAt
          }
          OutcomeToken {
            assetId0: AssetId(if: {Trade: {Prediction: {Outcome: {Index: {eq: 0}}}}})
            assetId1: AssetId(if: {Trade: {Prediction: {Outcome: {Index: {eq: 1}}}}})
          }
          Outcome {
            label0: Label(if: {Trade: {Prediction: {Outcome: {Index: {eq: 0}}}}})
            label1: Label(if: {Trade: {Prediction: {Outcome: {Index: {eq: 1}}}}})
          }
        }
        OutcomeTrade {
          price0: Price(
            maximum: Block_Time
            if: {Trade: {Prediction: {Outcome: {Index: {eq: 0}}}}}
          )
          price1: Price(
            maximum: Block_Time
            if: {Trade: {Prediction: {Outcome: {Index: {eq: 1}}}}}
          )
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
      trades: count
      buyers: count(distinct: Trade_OutcomeTrade_Buyer)
      sellers: count(distinct: Trade_OutcomeTrade_Seller)
      resolved: joinPredictionManagements(
        join: left
        Management_Prediction_Question_Id: Trade_Prediction_Question_Id
      ) {
        Block {
          Time(maximum: Block_Time, if: {Management: {EventType: {is: "Resolved"}}})
        }
      }
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

You can checkout the above data in more intuitive form on [DexRabbit](https://dexrabbit.bitquery.io/polymarket-predictions/sports/cricket?tab=volume).

![Cricket Markets by Liquidity](/img/dexrabbit/cricket-volume.png)

## Top Cricket Markets by Liquidity

Returns the top 100 cricket related polymarkets sorted by liquidity position in the past 24 hours.

[Run in Bitquery IDE](https://ide.bitquery.io/Top-cricket-Markets-by-Liquidity)

```graphql
query questionByLiquidity($time_ago: Int!, $limit: Int!) {
  EVM(network: matic) {
    PredictionSettlements(
      where: {Block: {Time: {since_relative: {hours_ago: $time_ago}}}, Settlement: {Prediction: {Question: {ResolutionSource: {includes: "espncricinfo.com"}}}}}
      limit: {count: $limit}
      orderBy: {descendingByField: "position"}
      limitBy: {by: Settlement_Prediction_Question_Id}
    ) {
      Settlement {
        Prediction {
          Question {
            Image
            MarketId
            Title
            Id
            CreatedAt
            ResolutionSource
          }
        }
      }
      split: sum(
        of: Settlement_Amounts_CollateralAmountInUSD
        if: {Settlement: {EventType: {is: "Split"}}}
      )
      merge: sum(
        of: Settlement_Amounts_CollateralAmountInUSD
        if: {Settlement: {EventType: {is: "Merge"}}}
      )
      position: calculate(expression: "$split - $merge")
      count(if: {Settlement: {EventType: {is: "Redemption"}}}, selectWhere: {eq: "0"})
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

You can checkout the above data in more intuitive form on [DexRabbit](https://dexrabbit.bitquery.io/polymarket-predictions/sports/cricket?tab=liquidity).

![Cricket Markets by Liquidity](/img/dexrabbit/cricket-liquidity.png)

## Latest Sports Markets Created

Markets whose **management description** includes the word **"sports"**. Use this for broad sports coverage beyond a single resolution source. Returns the 10 most recent **Created** events.

[Run in Bitquery IDE](https://ide.bitquery.io/Latest-Sports-Markets-Created)

```graphql
query LatestSportsMarketsCreated {
  EVM(network: matic) {
    PredictionManagements(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: {
        Management: {
          EventType: { is: "Created" }
          Description: { includes: "sports" }
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
      Management {
        Description
        EventType
        Prediction {
          CollateralToken {
            Name
            SmartContract
            Symbol
            AssetId
          }
          Condition {
            Id
            Oracle
            Outcomes {
              Id
              Index
              Label
            }
            QuestionId
          }
          Marketplace {
            ProtocolName
            ProtocolFamily
            SmartContract
          }
          Outcome {
            Id
            Index
            Label
          }
          OutcomeToken {
            Symbol
            SmartContract
            Name
            AssetId
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
        From
        Hash
      }
    }
  }
}
```

## Latest Esports Prediction Trades

Recent **trades** where the outcome **label** includes **"Esports"**. Returns up to 50 trades ordered by block time, with buyer, seller, amounts, price, and full prediction/question metadata.

[Run in Bitquery IDE](https://ide.bitquery.io/Latest-Esports-Prediction-Trades)

```graphql
query LatestEsportsPredictionTrades {
  EVM(network: matic) {
    PredictionTrades(
      limit: { count: 50 }
      orderBy: { descending: Block_Time }
      where: {
        Trade: { Prediction: { Outcome: { Label: { includes: "Esports" } } } }
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

---

## Live Odds (Implied Probability) for a Single Game

Returns the **latest trade price per outcome** for one market by `MarketId`. This is the **live win probability / odds** for the game. On Polymarket an outcome's `Price` ranges from **0 to 1 and equals its implied probability** (e.g. `0.62` = **62%**). `limitBy` with `orderBy: { descending: Block_Time }` returns one most-recent row per outcome (e.g. Team A vs Team B). Replace `"<MARKET_ID>"` with a market ID from the creation queries above. Change `query` to `subscription` for a live odds feed.

[Run in Bitquery IDE](https://ide.bitquery.io/Polymarket-live-game-odds)

```graphql
query LiveGameOdds {
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

Returns **OHLC** (Open, High, Low, Close) in USD for one outcome of a game, bucketed by interval (here 5 minutes). It shows how the **win probability moved over time**, and powers line-movement charts and strategy backtests. Replace `"<MARKET_ID>"` and `"<OUTCOME_LABEL>"` (e.g. a team name, `"Yes"`, or `"Up"`).

[Run in Bitquery IDE](https://ide.bitquery.io/Polymarket-sports-odds-movement-OHLC)

```graphql
query OddsMovementOHLC {
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

## 24-Hour Odds Change for an Outcome

Returns the **opening and closing odds** (plus high/low) over the **last 24 hours** for one outcome. It is the single-window version of the OHLC query, useful for "biggest movers" leaderboards (run it per market and sort by `Close − Open`). Replace `"<MARKET_ID>"` and `"<OUTCOME_LABEL>"`.

[Run in Bitquery IDE](https://ide.bitquery.io/Polymarket-sports-24h-odds-change)

```graphql
query Odds24hChange {
  EVM(network: matic) {
    PredictionTrades(
      where: {
        Block: { Time: { since_relative: { hours_ago: 24 } } }
        Trade: {
          Prediction: {
            Question: { MarketId: { is: "<MARKET_ID>" } }
            Outcome: { Label: { is: "<OUTCOME_LABEL>" } }
          }
        }
      }
    ) {
      Trade {
        OutcomeTrade {
          Open: PriceInUSD(minimum: Block_Time)
          Close: PriceInUSD(maximum: Block_Time)
          High: PriceInUSD(maximum: Trade_OutcomeTrade_PriceInUSD)
          Low: PriceInUSD(minimum: Trade_OutcomeTrade_PriceInUSD)
        }
        Prediction {
          Outcome {
            Label
          }
          Question {
            Title
            MarketId
          }
        }
      }
    }
  }
}
```

---

## Volume Split by Outcome (Money on Each Side)

Returns **total volume** and **volume per outcome** (e.g. Team A vs Team B) for a single game in the last 24 hours. This is an on-chain **sentiment / sharp-money** signal. Outcomes are split by `Index` (0 and 1) so it works regardless of how the labels are named. Replace `"<MARKET_ID>"`.

[Run in Bitquery IDE](https://ide.bitquery.io/Polymarket-game-volume-by-outcome)

```graphql
query GameVolumeByOutcome {
  EVM(network: matic) {
    PredictionTrades(
      where: {
        Block: { Time: { since_relative: { hours_ago: 24 } } }
        Trade: {
          Prediction: { Question: { MarketId: { is: "<MARKET_ID>" } } }
        }
      }
    ) {
      Trade {
        Prediction {
          Question {
            Title
            MarketId
            Image
            ResolutionSource
          }
          Outcome {
            label0: Label(
              if: { Trade: { Prediction: { Outcome: { Index: { eq: 0 } } } } }
            )
            label1: Label(
              if: { Trade: { Prediction: { Outcome: { Index: { eq: 1 } } } } }
            )
          }
        }
      }
      outcome0_volume: sum(
        of: Trade_OutcomeTrade_CollateralAmountInUSD
        if: { Trade: { Prediction: { Outcome: { Index: { eq: 0 } } } } }
      )
      outcome1_volume: sum(
        of: Trade_OutcomeTrade_CollateralAmountInUSD
        if: { Trade: { Prediction: { Outcome: { Index: { eq: 1 } } } } }
      )
      total_volume: sum(of: Trade_OutcomeTrade_CollateralAmountInUSD)
      trades: count
    }
  }
}
```

---

## Latest Resolved Sports Markets (Winning Outcome)

Returns the 10 most recent **Resolved** sports markets (management description includes `"sports"`), including the resolved/winning **Outcome** and full question metadata. Use this to grade results and settle bets. For a single league, swap the `Description` filter for a `Prediction.Question.Title` keyword (see the league table above).

[Run in Bitquery IDE](https://ide.bitquery.io/Latest-resolved-sports-markets)

```graphql
query LatestResolvedSportsMarkets {
  EVM(network: matic) {
    PredictionManagements(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: {
        Management: {
          EventType: { is: "Resolved" }
          Description: { includes: "sports" }
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

## Top Traders on a Game (Sharp Money)

Returns the top 10 **buyers** and top 10 **sellers** by USD volume on a single market, showing who is putting the most money on each side. Replace `"<MARKET_ID>"`. (Drop the `MarketId` filter and add a `Question.Title` league keyword to rank traders across a whole league.)

[Run in Bitquery IDE](https://ide.bitquery.io/Top-traders-on-a-sports-market)

```graphql
query TopTradersOnGame {
  EVM(network: matic) {
    Top_buyers: PredictionTrades(
      where: {
        Trade: {
          Prediction: { Question: { MarketId: { is: "<MARKET_ID>" } } }
          OutcomeTrade: { IsOutcomeBuy: true }
        }
      }
      limit: { count: 10 }
      orderBy: { descendingByField: "buy_volume" }
    ) {
      Trade {
        OutcomeTrade {
          Buyer
        }
      }
      buy_volume: sum(of: Trade_OutcomeTrade_CollateralAmountInUSD)
      trades: count
    }
    Top_sellers: PredictionTrades(
      where: {
        Trade: {
          Prediction: { Question: { MarketId: { is: "<MARKET_ID>" } } }
          OutcomeTrade: { IsOutcomeBuy: false }
        }
      }
      limit: { count: 10 }
      orderBy: { descendingByField: "sell_volume" }
    ) {
      Trade {
        OutcomeTrade {
          Seller
        }
      }
      sell_volume: sum(of: Trade_OutcomeTrade_CollateralAmountInUSD)
      trades: count
    }
  }
}
```

---

## Top Winners of a Game (by Redemption)

After a game resolves, this returns the top 10 holders by **redeemed amount** (USD). These are the biggest winners. Uses `PredictionSettlements` with `EventType: "Redemption"`. Replace `"<MARKET_ID>"`.

[Run in Bitquery IDE](https://ide.bitquery.io/Top-winners-of-a-sports-market)

```graphql
query TopWinnersOnGame {
  EVM(network: matic) {
    PredictionSettlements(
      limit: { count: 10 }
      orderBy: { descendingByField: "redeemed_amount" }
      where: {
        Settlement: {
          EventType: { is: "Redemption" }
          Prediction: { Question: { MarketId: { is: "<MARKET_ID>" } } }
        }
      }
    ) {
      Settlement {
        Holder
        Prediction {
          Question {
            Title
            MarketId
          }
        }
      }
      redeemed_amount: sum(of: Settlement_Amounts_CollateralAmountInUSD)
    }
  }
}
```

---

## Real-Time Whale-Bet Alerts (Subscription)

Streams live sports trades **above a USD threshold** (here `$5,000`). This is ideal for whale-alert bots and detecting large line-moving bets. Filter the sport with a `Question.Title` keyword (league or team), or swap it for a single-game `MarketId`. Change `subscription` to `query` for historical results.

:::tip No-code option: PolyBit Telegram bot
Don't want to run your own stream? The **[PolyBit Polymarket bot](https://t.me/PolyBit_Polymarket_Bot)** is a **free Telegram bot built by the Bitquery team** that monitors whale trades and other metrics across all markets. Open a specific market directly with a deep link:

```
https://t.me/PolyBit_Polymarket_Bot?start=market_<MARKET_ID>
```

Replace `<MARKET_ID>` with the market's ID, for example [`market_2453464`](https://t.me/PolyBit_Polymarket_Bot?start=market_2453464).
:::

```graphql
subscription {
  EVM(network: matic) {
    PredictionTrades(
      where: {
        Trade: {
          OutcomeTrade: { CollateralAmountInUSD: { gt: "5000" } }
          Prediction: {
            Marketplace: { ProtocolName: { is: "polymarket" } }
            Question: { Title: { includesCaseInsensitive: "<LEAGUE_OR_TEAM>" } }
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
          CollateralAmount
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

## Monitor Specific Wallets on Sports Markets (Subscription)

Streams every sports trade where one of a watched wallet list is the **Buyer** or **Seller**. Powers copy-trading signals, wallet alerts, and PnL dashboards. Pass the addresses in the `$wallets` variable and set the `Question.Title` filter to the league/team you care about.

[Run in Bitquery IDE](https://ide.bitquery.io/Monitor-wallets-on-Polymarket-sports-markets)

```graphql
subscription MonitorWallets($wallets: [String!]) {
  EVM(network: matic) {
    PredictionTrades(
      where: {
        any: [
          { Trade: { OutcomeTrade: { Buyer: { in: $wallets } } } }
          { Trade: { OutcomeTrade: { Seller: { in: $wallets } } } }
        ]
        Trade: {
          Prediction: {
            Marketplace: { ProtocolName: { is: "polymarket" } }
            Question: { Title: { includesCaseInsensitive: "<LEAGUE_OR_TEAM>" } }
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

**Variables:**

```json
{
  "wallets": [
    "0x87a961f161681cc1e9b3af2b6542b95ef3c4bd70",
    "0x0bab932893a7efc76d8e0951366ba933ba9fd3be"
  ]
}
```

---

## Polymarket-Only Filter

To restrict results to **Polymarket** only, add this to the relevant `where` clause:

**PredictionManagements:**

```graphql
Management: {
  Prediction: { Marketplace: { ProtocolName: { is: "polymarket" } } }
  # ... other filters
}
```

**PredictionTrades:**

```graphql
Trade: {
  Prediction: { Marketplace: { ProtocolName: { is: "polymarket" } } }
  # ... other filters
}
```

---

## Related APIs

| Need                                        | API                                                                                                                   |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Market lifecycle (creation, resolution)** | [Prediction Managements API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-managements-api/)    |
| **Trades, volume, prices**                  | [Prediction Trades API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-trades-api/)              |
| **Filter by slug, condition ID, token**     | [Polymarket Markets API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-markets-api/)               |
| **Polymarket overview**                     | [Polymarket API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-api/)                               |
| **Settlements & redemptions**               | [Prediction Settlements API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-settlements-api/)    |
| **User & wallet activity**                  | [Polymarket Wallet & User Activity API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-wallet-api/) |
| **Trader realized PnL & win rate**          | [Realized PnL & Win Rate for Polymarket Trader](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-wallet-realized-pnl/) |
| **Real-time: GraphQL subscriptions**        | [GraphQL subscriptions & WebSockets](https://docs.bitquery.io/docs/subscriptions/websockets/)                         |
| **Real-time: Kafka streams**                | [Kafka Streaming Concepts](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/)                           |

---

## Support

- [Bitquery Telegram](https://t.me/bloxy_info)
