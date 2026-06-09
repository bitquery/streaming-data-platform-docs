---
title: "Polymarket Insider & Fresh-Wallet Detection API"
description: "Detect insider trading and suspicious wallets on Polymarket with Bitquery on-chain data: fresh-wallet checks, USDC funding-source tracing, wallet clustering (Sybil detection), large bets, and pre-resolution timing on Polygon."
keywords:
  - Polymarket insider trading API
  - Polymarket fresh wallet detection
  - Polymarket whale tracking API
  - Polymarket wallet clustering
  - Polymarket funding source
  - Polymarket smart money
  - prediction market insider detection
  - Sybil detection Polymarket
  - Polygon USDC funding source
  - Polymarket on-chain surveillance
---

# Polymarket Insider & Fresh-Wallet Detection API

Detect suspicious trading on **Polymarket** using on-chain data from Polygon. This page shows how to flag potential insiders by combining **fresh-wallet checks**, **USDC funding-source tracing**, **wallet clustering**, **large bets**, and **pre-resolution timing**.

Bitquery runs **its own blockchain nodes** and **indexes, decodes, and parses** raw Polygon transactions. That gives you signals the off-chain Polymarket Gamma and Data APIs cannot provide, such as how old a wallet is, where its money came from, and which other wallets share the same funder. These on-chain signals are the foundation of every serious insider-detection and copy-trading tool.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token. See [How to generate Bitquery API token ➤](https://docs.bitquery.io/docs/authorisation/how-to-generate/).
:::

---

## How Insider Detection Works on Polymarket

A suspected insider leaves a specific footprint on-chain:

1. A **brand-new wallet** with little or no prior activity.
2. Funded by a **traceable USDC source**, often shared with other suspicious wallets.
3. A **large bet** in a low-volume or niche market.
4. Entered **shortly before resolution**, on the winning side.
5. **Redeems** the winnings and goes dormant.

No single signal is proof. You combine them into a score and flag wallets that cross a threshold. The queries below produce each signal.

### Signal to Data Map

| Signal | What you measure | Bitquery source |
| ------ | ---------------- | --------------- |
| **Fresh wallet** | Wallet age (first on-chain activity) vs first bet | `EVM.Transfers` (`dataset: combined`) |
| **Funding source** | First USDC transfer into the wallet | `EVM.Transfers` (USDC.e) |
| **Wallet cluster (Sybil)** | Other wallets funded by the same sender | `EVM.Transfers` grouped by receiver |
| **Large bet in niche market** | Bet USD vs market 24h volume | `PredictionTrades` |
| **Pre-resolution timing** | Hours between trade and resolution, winning side | `PredictionTrades` + `joinPredictionManagements` |
| **Won and dormant** | Redemption amount, then no activity | `PredictionSettlements` + `Transfers` |

:::tip Why `dataset: combined`
The wallet-history queries below use `dataset: combined` so they search the **full chain history**, not just the realtime window. This matters for wallet age and funding traces, where you need the earliest activity ever recorded.
:::

---

## Step 1: Catch Large Trades in Real Time

Start by streaming large Polymarket trades. Each event gives you a **buyer address** to investigate. Change `subscription` to `query` for historical results.

[Run in Bitquery IDE](https://ide.bitquery.io/large-trades--on-polymarket)

```graphql
subscription {
  EVM(network: matic) {
    PredictionTrades(
      where: {
        Trade: {
          OutcomeTrade: { CollateralAmountInUSD: { gt: "5000" } }
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
          CollateralAmountInUSD
          Price
          IsOutcomeBuy
        }
        Prediction {
          Question {
            MarketId
            Title
          }
          Outcome {
            Index
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

## Step 2: Is the Buyer a Fresh Wallet?

Look up the buyer's **earliest on-chain activity**. If the wallet's first transfer is close to the time of its first big bet, it is a fresh wallet and scores high. Replace the address with the buyer from Step 1.

[Run in Bitquery IDE](https://ide.bitquery.io/freshwallet-check-for-polymarket)

```graphql
query FreshWalletCheck {
  EVM(network: matic, dataset: combined) {
    Transfers(
      where: {
        Transfer: { Sender: { is: "0xe8a2057abd53d285f7bea590b8f1dff1f04454c2" } }
      }
    ) {
      earliest: Block {
        Time(minimum: Block_Time)
      }
    }
  }
}
```

A recent `earliest` time means a young wallet. You can also add `count` to the selection to get the wallet's lifetime transfer count, another freshness signal.

---

## Step 3: Trace the Funding Source

Find where the wallet's money came from. The **first inbound USDC transfer** is usually the original funder, often a centralized exchange withdrawal or a parent wallet. This query uses bridged USDC.e on Polygon (`0x2791bca1f2de4661ed88a30c99a7a9449aa84174`).

[Run in Bitquery IDE](https://ide.bitquery.io/FundingSource-for-poylmarket)

```graphql
query FundingSource {
  EVM(network: matic, dataset: combined) {
    Transfers(
      orderBy: { ascending: Block_Time }
      limit: { count: 5 }
      where: {
        Transfer: {
          Currency: {
            SmartContract: { is: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174" }
          }
          Receiver: { is: "0xe8a2057abd53d285f7bea590b8f1dff1f04454c2" }
        }
      }
    ) {
      Block {
        Time
      }
      Transfer {
        Sender
        Amount
      }
      Transaction {
        Hash
      }
    }
  }
}
```

---

## Step 4: Find the Wallet Cluster (Sybil Detection)

Take the funder from Step 3 and list **every other wallet it funded**. Wallets sharing a funder are likely controlled by the same operator. A large cluster placing correlated bets is a strong signal.

[Run in Bitquery IDE](https://ide.bitquery.io/SiblingWallets-for-polymarket)

```graphql
query SiblingWallets {
  EVM(network: matic, dataset: combined) {
    Transfers(
      limitBy: { by: Transfer_Receiver, count: 1 }
      where: {
        Transfer: {
          Currency: {
            SmartContract: { is: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174" }
          }
          Sender: { is: "0xe8a2057abd53d285f7bea590b8f1dff1f04454c2" }
        }
      }
    ) {
      Transfer {
        Receiver
      }
      received: sum(of: Transfer_Amount)
    }
  }
}
```

---

## Step 5: Timing and Outcome

The final signals come from the trade itself. Check how soon before resolution the wallet entered, and whether it was on the winning side.

- **Pre-resolution timing:** join the wallet's trades to the market's `Resolved` event and compute the lead time. Use the `joinPredictionManagements` pattern from the [Polymarket Sports API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-sports-api/).
- **Won and dormant:** confirm the payout with a `Redemption` query on `PredictionSettlements`, then re-run Step 2 to check the wallet went quiet afterward.
- **Realized profit and win rate:** see [Realized PnL & Win Rate for Polymarket Trader](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-wallet-realized-pnl/).

---

## Scoring Model

Combine the signals into a weighted score and flag wallets above a threshold. Tune the weights to your tolerance for false positives.

```
score = 0.30 * fresh_wallet
      + 0.25 * shared_funder_cluster
      + 0.20 * bet_pct_of_market_volume
      + 0.15 * entered_within_24h_of_resolution
      + 0.10 * won_and_went_dormant

flag if score >= threshold
```

This mirrors how tools like CrowdIntel and PolyTrack work. Bitquery provides the on-chain primitives they otherwise have to reverse-engineer.

---

## Limitations

Read this before acting on a flag.

- These are **heuristics, not proof**. A fresh wallet or a shared funder is not evidence of wrongdoing. Exchange withdrawal addresses fund many unrelated users and create false clusters.
- The "**entered before the news broke**" idea needs an off-chain news timestamp. On-chain you can only proxy it with the **resolution time** or a **sharp odds move** (see the OHLC query on the Sports API page).
- Always verify the current **collateral token** and any neg-risk or Conditional Token Framework specifics in the IDE before relying on results.

---

## Related APIs

| Need | API |
| ---- | --- |
| **Live odds, trades, volume by sport** | [Polymarket Sports API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-sports-api/) |
| **Trader realized PnL & win rate** | [Realized PnL & Win Rate for Polymarket Trader](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-wallet-realized-pnl/) |
| **User & wallet activity** | [Polymarket Wallet & User Activity API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-wallet-api/) |
| **Trades, prices, whales** | [Polymarket API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-api/) |
| **Settlements & redemptions** | [Prediction Settlements API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-settlements-api/) |
| **Real-time: Kafka streams** | [Kafka Streaming Concepts](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/) |

---

## Support

- [Bitquery Telegram](https://t.me/bloxy_info)
