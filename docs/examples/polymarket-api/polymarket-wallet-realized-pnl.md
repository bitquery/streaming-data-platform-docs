---
title: "Polymarket Wallet Realized PnL & Win Rate (Pattern)"
description: "Use Bitquery PredictionTrades on Polygon to fetch a wallet’s Polymarket buys and sells in a time window, then aggregate by condition ID for realized PnL and win rate."
keywords:
  - Polymarket PnL
  - Polymarket wallet analytics
  - prediction market realized PnL
  - Polymarket win rate
  - PredictionTrades Polygon
  - Polymarket GraphQL
---

# Realized PnL & Win Rate for Polymarket Trader

You can use Bitquery **`PredictionTrades`** on Polygon (`network: matic`) to pull a wallet’s **outcome buys** and **outcome sells** on Polymarket over a chosen window (for example the last **24 hours**). From that response, you can aggregate by **`ConditionId`**, calculate `realised PnL` per condition, and derive the total **realized PnL** and **win rate** for Polymarket trading.



## How is PnL and Win Rate calculated?

- **Buys** (`IsOutcomeBuy: true`): collateral spent acquiring outcome tokens (tracked as **`CollateralAmountInUSD`** on the trade).
- **Sells** (`IsOutcomeBuy: false`): collateral received when selling outcome tokens.

For each **condition** (`Trade.Prediction.ConditionId`), treat **realized PnL in the window** as:

```js
Realised PnL per condition = total(sell collateral USD) − total(buy collateral USD)

Realised PnL = sum(Realised PnL per condition)
```

**Win rate**: Percentage of profitable trades in the given time window. Many algorithmic traders use this metric for rating the performance of their systems instead of using PnL as a judge for success.

```js
Win Rate = 100* count(profitable trade)/count(trades)
```

## Get Buys and Sells for a Trader on Polymarket

[This query](https://ide.bitquery.io/buys-and-sells-of-a-wallet-on-polymarket) below uses variables for **hours ago** and the **buyer** wallet. It returns two lists: **`buys`** and **`sells`**, each with **`CollateralAmountInUSD`** and **`ConditionId`** so you can group and calculate at your system.

```graphql
query WalletTrades($hoursAgo: Int!, $title: String!, $buyer: String!) {
  EVM(dataset: realtime, network: matic) {
    buys: PredictionTrades(
      where: {
        Trade: {
          Prediction: {
            Marketplace: { ProtocolName: { is: "polymarket" } }
          }
          OutcomeTrade: { IsOutcomeBuy: true, Buyer: { is: $buyer } }
        }
        Block: { Time: { since_relative: { hours_ago: $hoursAgo } } }
      }
    ) {
      Trade {
        OutcomeTrade {
          CollateralAmountInUSD
        }
        Prediction {
          ConditionId
        }
      }
    }

    sells: PredictionTrades(
      where: {
        Trade: {
          Prediction: {
            Marketplace: { ProtocolName: { is: "polymarket" } }
          }
          OutcomeTrade: { IsOutcomeBuy: false, Buyer: { is: $buyer } }
        }
        Block: { Time: { since_relative: { hours_ago: $hoursAgo } } }
      }
    ) {
      Trade {
        OutcomeTrade {
          CollateralAmountInUSD
        }
        Prediction {
          ConditionId
        }
      }
    }
  }
}
```

Variables:

```json
{
  "hoursAgo": 24,
  "buyer": "Wallet Address"
}
```

## Aggregate by Condition ID

After you receive **`buys`** and **`sells`**, aggregate **`CollateralAmountInUSD`** by **`ConditionId`** for each list.

```text
INITIALIZE empty map buyUsdByCondition
INITIALIZE empty map sellUsdByCondition

FOR each record IN response.buys:
  id = record.Trade.Prediction.ConditionId
  amount = record.Trade.OutcomeTrade.CollateralAmountInUSD   // parse as decimal number
  buyUsdByCondition[id] = buyUsdByCondition[id] + amount

FOR each record IN response.sells:
  id = record.Trade.Prediction.ConditionId
  amount = record.Trade.OutcomeTrade.CollateralAmountInUSD
  sellUsdByCondition[id] = sellUsdByCondition[id] + amount
```

## Realised PnL calculation

Use the union of all **condition IDs** that appear in either **`buyUsdByCondition`** or **`sellUsdByCondition`**, so conditions with only buys or only sells are still included. For each condition, **realised PnL in the window** is **sell collateral USD minus buy collateral USD**; **total realised PnL** is the sum of those values across all conditions.

```text
INITIALIZE totalRealizedPnL = 0
INITIALIZE empty map pnlByCondition

allConditionIds = union(keys(buyUsdByCondition), keys(sellUsdByCondition))

FOR each conditionId IN allConditionIds:
  buyTotal = buyUsdByCondition[conditionId]  OR 0
  sellTotal = sellUsdByCondition[conditionId] OR 0
  pnlForCondition = sellTotal - buyTotal
  pnlByCondition[conditionId] = pnlForCondition
  totalRealizedPnL = totalRealizedPnL + pnlForCondition
```

**Summary**

- **`pnlByCondition`**: `Per-ConditionId` net USD collateral flow for a given time window.
- **`totalRealizedPnL`**: wallet-level sum of **`pnlForCondition`** over every condition in **`allConditionIds`**.

## Win rate calculation

Using the same **`pnlByCondition`** map from the previous step, count how many conditions had **positive** PnL versus how many had **any** activity in the window, then derive **win rate**.

```text
INITIALIZE trades = 0
INITIALIZE profitableTrades = 0

FOR each conditionId IN keys(pnlByCondition):
  trades = trades + 1
  IF pnlByCondition[conditionId] > 0 THEN
    profitableTrades = profitableTrades + 1
  END IF

IF trades > 0 THEN
  winRatePercent = 100 * (profitableTrades / trades)
ELSE
  winRatePercent = undefined   // or 0, depending on product rules
END IF
```

**Interpreting win rate**

- **`trades`**: number of distinct **`ConditionId`** values with at least one matching row in **`buys`** or **`sells`** in your query result.
- **`profitableTrades`**: subset of those where **`pnlByCondition[conditionId] > 0`**.
- **`winRatePercent`**: **`100 * profitableTrades / trades`** when **`trades > 0`**.

## Related APIs

| Topic | Link |
| ----- | ---- |
| PolyMarket APIs Intro | [Polymarket API](https://docs.bitquery.io/docs/examples/polymarket-api/) |
| Advanced Polymarket Analytics | [Advanced Polymarket Metrics](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-advanced-analytics-api/) |
| Prediction trades reference | [Prediction Trades API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-trades-api/) |
| Sports Related PolyMarkets | [Polymarket Sports API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-sports-api/) |
