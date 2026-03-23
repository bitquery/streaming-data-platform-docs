---
title: "Polymarket API - Advanced Analytics"
description: "Polymarket analytics on Polygon: USDC TVL in core contracts, daily volume and maker/taker splits, order-flow by market, whale trades, settlement flows, and top markets by volume. GraphQL examples with Bitquery IDE links."
keywords:
  - Polymarket analytics
  - Polymarket TVL
  - Polymarket volume
  - Polymarket GraphQL
  - prediction market analytics
  - Polygon Polymarket
  - Polymarket maker taker
  - Polymarket open interest proxy
---

# Polymarket API - Advanced Analytics

This guide shows **GraphQL examples** for deeper **Polymarket** metrics on **Polygon** (`network: matic`): **TVL** of Polymarket, **daily trade aggregates**, **buy vs sell pressure** for a market, **large-trade streaming**, **split/merge settlement** totals, and **top markets by volume**. All examples use **`dataset: realtime`**, which covers about the **last 7 days** of data. Use it together with the [Polymarket API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-api/), [Prediction Trades API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-trades-api/), and [Prediction Settlements API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-settlements-api/).

:::note API Key Required
To run these queries outside the Bitquery IDE, you need an API access token. See [How to generate Bitquery API token](https://docs.bitquery.io/docs/authorisation/how-to-generate/).
:::

:::tip Contract addresses
Confirm **USDC.e**, **Conditional Tokens**, and **exchange** addresses on Polygon from [Polymarket](https://polymarket.com/) or block explorers before production use; upgradeable deployments can change over time.
:::

:::note Dataset: `realtime` and retention
Polymarket prediction-market data on Polygon (**`PredictionTrades`**, **`PredictionSettlements`**, and related examples on this page) must use **`dataset: realtime`**. This dataset holds roughly the **last 7 days**—use time filters that fall inside that window.
:::

---

## Overview

| Topic                                | API                               | What you get                                                                          |
| ------------------------------------ | --------------------------------- | ------------------------------------------------------------------------------------- |
| **TVL Polymarket**                   | `TransactionBalances`             | Latest **USDC.e** balance for listed custody addresses                                |
| **Daily volume & maker/taker split** | `PredictionTrades`                | **Shares** (`Amount`), **USDC** collateral, split by **Buyer** vs CTF-style addresses |
| **Order flow (hourly)**              | `PredictionTrades`                | **Buy** vs **sell** pressure using `IsOutcomeBuy`, optional **market title** filter   |
| **Whale trades**                     | `PredictionTrades` (subscription) | Trades above a **USD** threshold                                                      |
| **open Interest (one day)**          | `PredictionSettlements`           | **Split** / **merge** USDC and **net** (liquidity-style proxy, not CLOB OI)           |
| **Top markets by volume**            | `PredictionTrades`                | Markets ranked by **buy + sell** USD over **24 hours**                                |

---

## USDC TVL — balances for Conditional Tokens and neg-risk collateral

Summarize **USDC.e** (`0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174`) held by **Conditional Tokens** and **neg-risk wrapped collateral** contracts. Extend the `Address` list if you track additional custodians.

[Run in Bitquery IDE](https://ide.bitquery.io/Polymarket-TVL)

```graphql
query PolymarketUSDCBalancesTVL {
  EVM(dataset: realtime, network: matic) {
    TransactionBalances(
      where: {
        TokenBalance: {
          Address: {
            in: [
              "0x4D97DCd97eC945f40cF65F87097ACe5EA0476045"
              "0x3A3BD7bb9528E159577F7C2e685CC81A765002E2"
            ]
          }
          Currency: {
            SmartContract: { is: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174" }
            Fungible: true
          }
        }
      }
    ) {
      TokenBalance {
        Address
        PostBalance(maximum: Block_Time)
        PostBalanceInUSD(maximum: Block_Time)
        Currency {
          Symbol
          SmartContract
          Decimals
        }
      }
    }
  }
}
```

---

## Daily volume — notional shares, USDC, and buyer-address split

For a **single calendar day** (UTC), aggregate:

- **volume_notional_shares** — sum of outcome **`Amount`** (share-like notional)
- **volume_usdc** — sum of **`CollateralAmountInUSD`**
- **taker_volume_usdc_address_rule** — USDC where **`Buyer`** is in **`$PolymarketContractAddresses`**
- **maker_volume_usdc_address_rule** — USDC where **`Buyer`** is **not** in that list

Use **`dataset: realtime`** (see the **Dataset: realtime and retention** note at the top of this page).

[Run in Bitquery IDE](https://ide.bitquery.io/Polymarket-Notional-Volume-Taker-VolumeMaker-Volume)

```graphql
query PolymarketVolume(
  $date: String!
  $PolymarketContractAddresses: [String!]!
) {
  EVM(dataset: realtime, network: matic) {
    PredictionTrades(
      where: {
        TransactionStatus: { Success: true }
        Block: { Date: { is: $date } }
        Trade: {
          Prediction: { Marketplace: { ProtocolName: { is: "polymarket" } } }
        }
      }
    ) {
      Block {
        Date
      }
      volume_notional_shares: sum(of: Trade_OutcomeTrade_Amount)
      volume_usdc: sum(of: Trade_OutcomeTrade_CollateralAmountInUSD)
      taker_volume_usdc_address_rule: sum(
        of: Trade_OutcomeTrade_CollateralAmountInUSD
        if: {
          Trade: {
            OutcomeTrade: { Buyer: { in: $PolymarketContractAddresses } }
          }
        }
      )
      maker_volume_usdc_address_rule: sum(
        of: Trade_OutcomeTrade_CollateralAmountInUSD
        if: {
          Trade: {
            OutcomeTrade: { Buyer: { notIn: $PolymarketContractAddresses } }
          }
        }
      )
    }
  }
}
```

**Variables (example):**

```json
{
  "date": "2026-03-20",
  "PolymarketContractAddresses": [
    "0x4bfb41d5b3570defd03c39a9a4d8de6bd8b8982e",
    "0xc5d563a36ae78145c45a50134d48a1215220f80a"
  ]
}
```

---

## Order flow — buy vs sell pressure by hour

Bucket trades by **hour** and split **collateral USD** using **`IsOutcomeBuy`** (see [Prediction Trades API — trade direction](https://docs.bitquery.io/docs/examples/prediction-market/prediction-trades-api/)).

### One market (filter by exact question title)

[Run in Bitquery IDE](https://ide.bitquery.io/buy-sell-pressure-of-aspecific-market)

```graphql
query PolymarketOrderFlowPressureOneMarket(
  $hours_ago: Int!
  $marketTitle: String!
) {
  EVM(dataset: realtime, network: matic) {
    PredictionTrades(
      orderBy: { ascending: Block_Time }
      where: {
        TransactionStatus: { Success: true }
        Block: { Time: { since_relative: { hours_ago: $hours_ago } } }
        Trade: {
          Prediction: {
            Marketplace: { ProtocolName: { is: "polymarket" } }
            Question: { Title: { is: $marketTitle } }
          }
        }
      }
    ) {
      Block {
        Time(interval: { count: 1, in: hours })
      }
      Trade {
        Prediction {
          Question {
            MarketId
            Title
          }
        }
      }
      buy_pressure_usd: sum(
        of: Trade_OutcomeTrade_CollateralAmountInUSD
        if: { Trade: { OutcomeTrade: { IsOutcomeBuy: true } } }
      )
      sell_pressure_usd: sum(
        of: Trade_OutcomeTrade_CollateralAmountInUSD
        if: { Trade: { OutcomeTrade: { IsOutcomeBuy: false } } }
      )
    }
  }
}
```

**Variables (example):**

```json
{
  "hours_ago": 24,
  "marketTitle": "US x Iran ceasefire by April 30?"
}
```

---

## Whale trades — subscription above a USD threshold

Stream **successful** Polymarket trades whose **collateral** exceeds **$10,000** USD. Adjust the threshold string as needed.

[Run in Bitquery IDE](https://ide.bitquery.io/polymarket-whale-trades-alert_1)

```graphql
subscription PolymarketWhaleTradesAlert {
  EVM(dataset: realtime, network: matic) {
    PredictionTrades(
      where: {
        TransactionStatus: { Success: true }
        Trade: {
          Prediction: { Marketplace: { ProtocolName: { is: "polymarket" } } }
          OutcomeTrade: { CollateralAmountInUSD: { gt: "10000" } }
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
          }
          Outcome {
            Label
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

## Open Interest on Polymarket on a specific date

For a **calendar day**, sum **Split** and **Merge** **collateral USD** and the **net** (`split − merge`). This describes **Open Interest** of that day.

[Run in Bitquery IDE](https://ide.bitquery.io/Open-Interest-on-a-day)

```graphql
query PolymarketSettlementFlowOneDay($day: String!) {
  EVM(dataset: realtime, network: matic) {
    PredictionSettlements(
      where: {
        Block: { Date: { is: $day } }
        Settlement: {
          Prediction: { Marketplace: { ProtocolName: { is: "polymarket" } } }
        }
      }
    ) {
      split_usd: sum(
        of: Settlement_Amounts_CollateralAmountInUSD
        if: { Settlement: { EventType: { is: "Split" } } }
      )
      merge_usd: sum(
        of: Settlement_Amounts_CollateralAmountInUSD
        if: { Settlement: { EventType: { is: "Merge" } } }
      )
      net_split_merge_usd: calculate(expression: "$split_usd - $merge_usd")
    }
  }
}
```

**Variables (example):**

```json
{
  "day": "2026-03-22"
}
```

---

## Top markets by volume — last 24 hours

Rank **Polymarket** markets by **buy + sell** collateral USD, with **buy/sell** breakdown, **trade count**, **distinct buyers/sellers**, and optional **resolution** join. Uses **`limitBy: Trade_Prediction_Question_Id`** so each row is **one market**.

[Run in Bitquery IDE](https://ide.bitquery.io/top-100-markets-by-volumein-last24-hrs)

```graphql
query TopMarketsByVolume($limit: Int!) {
  EVM(dataset: realtime, network: matic) {
    PredictionTrades(
      where: {
        TransactionStatus: { Success: true }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
        Trade: {
          Prediction: { Marketplace: { ProtocolName: { is: "polymarket" } } }
        }
      }
      limit: { count: $limit }
      orderBy: { descendingByField: "sumBuyAndSell" }
      limitBy: { by: Trade_Prediction_Question_Id }
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
            assetId0: AssetId(
              if: { Trade: { Prediction: { Outcome: { Index: { eq: 0 } } } } }
            )
            assetId1: AssetId(
              if: { Trade: { Prediction: { Outcome: { Index: { eq: 1 } } } } }
            )
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
        OutcomeTrade {
          price0: Price(
            maximum: Block_Time
            if: { Trade: { Prediction: { Outcome: { Index: { eq: 0 } } } } }
          )
          price1: Price(
            maximum: Block_Time
            if: { Trade: { Prediction: { Outcome: { Index: { eq: 1 } } } } }
          )
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
      resolved: joinPredictionManagements(
        join: left
        Management_Prediction_Question_Id: Trade_Prediction_Question_Id
      ) {
        Block {
          Time(
            maximum: Block_Time
            if: { Management: { EventType: { is: "Resolved" } } }
          )
        }
      }
    }
  }
}
```

**Variables (example):**

```json
{
  "limit": 100
}
```

---

## Related APIs

| Need                        | Doc                                                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Trades, prices, filters     | [Prediction Trades API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-trades-api/)                       |
| Splits, merges, redemptions | [Prediction Settlements API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-settlements-api/)             |
| Condition ID, slug, token   | [Polymarket Markets API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-markets-api/)                        |
| Overview                    | [Polymarket API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-api/)                                        |
| Wallet-level activity       | [Wallet & User Activity API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-wallet-api/)                     |
| Token balances (USDC)       | [Token Balance API](https://docs.bitquery.io/docs/blockchain/Ethereum/balances/transaction-balance-tracker/token-balance-api/) |

---

## Support

- [Bitquery Telegram](https://t.me/bloxy_info)
