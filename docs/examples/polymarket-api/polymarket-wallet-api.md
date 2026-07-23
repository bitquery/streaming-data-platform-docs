---
title: "Polymarket Wallet & User Activity API"
description: "Polymarket Wallet & User Activity API: Bitquery documentation with GraphQL examples, real-time streams, and integration guidance."
keywords:
  - Polymarket wallet API
  - Polymarket user activity
  - Polymarket positions API
  - trader activity Polymarket
  - Polymarket profile by wallet
  - prediction market user data
  - Polymarket bridge API
---
# Wallet & User Activity API

Get **user- and wallet-level data** for Polymarket: recent activity, positions, trade volume, and market counts. Use Bitquery GraphQL to analyze trader behavior by wallet address, and combine with the [Polymarket API](/docs/examples/polymarket-api/polymarket-api/) overview for trades and market data.

## Check if an address ever interacted with Polymarket (on-chain transfers)

Polymarket collateral on Polygon flows through conditional tokens keyed to USDC denomination at **`0x4d97DCd97eC945f40cF65F87097ACe5EA0476045`**. To see whether a wallet likely has **any** Polymarket-related receipts, query for **at least one inbound transfer** of that token (`limit: { count: 1 }`). Empty results mean no indexed match—not a guarantee that the wallet never traded (e.g. only outbound paths), but useful for onboarding and tagging.

The same pattern is documented under [Polygon (MATIC) Transfers](/docs/blockchain/Matic/matic-transfers/).

**Try it:** [IDE — Polymarket interaction check](https://ide.bitquery.io/check-if-an-address-interacted-with-polymarket-ever)

```graphql
query ($address: String) {
  EVM(dataset: combined, network: matic) {
    Transfers(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        Transfer: {
          Currency: {
            SmartContract: { is: "0x4d97DCd97eC945f40cF65F87097ACe5EA0476045" }
          }
          Receiver: { is: $address }
        }
      }
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
      }
      Transfer {
        Sender
        Receiver
        Amount
      }
    }
  }
}
```

**Variables:**

```json
{
  "address": "0x0c79f21ec570f5cc0d52d1bc640845faef430ad2"
}
```

## Recent user activity by wallet

Get aggregate stats for a trader over the last 5 hours: total outcomes traded, collateral amounts, and number of distinct markets.

[Run query in IDE](https://ide.bitquery.io/Get-recent-user-activity-on-polymarket)

```graphql
query MyQuery($trader: String) {
  EVM(network: matic) {
    PredictionTrades(
      where: {
        TransactionStatus: { Success: true }
        any: [
          { Trade: { OutcomeTrade: { Buyer: { is: $trader } } } }
          { Trade: { OutcomeTrade: { Seller: { is: $trader } } } }
        ]
        Block: { Time: { since_relative: { hours_ago: 5 } } }
      }
    ) {
      Total_Outcomes_traded: count
      Total_Outcome_Amount: sum(of: Trade_OutcomeTrade_Amount)
      Total_Collateral_Amount: sum(of: Trade_OutcomeTrade_CollateralAmount)
      Total_Markets: count(distinct: Trade_Prediction_Question_MarketId)
    }
  }
}
```

**Variables:**

```json
{
  "trader": "0x101f2f96db1e39a9f36a1fa067751d541fd38e1a"
}
```

Replace `trader` with any Polygon wallet address (EOA or proxy wallet).

---

## What you can get by wallet

| Data                                | Source                                          | Notes                                                              |
| ----------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------ |
| **Recent activity & volume**        | Bitquery (above)                                | GraphQL `PredictionTrades` filtered by Buyer/Seller                |
| **Closed positions**                | Polymarket CLOB                                 | Profile API                                                        |
| **User activity timeline**          | Polymarket CLOB                                 | Profile API                                                        |
| **Total value of positions**        | Polymarket CLOB                                 | Profile API                                                        |
| **Trades for a user or market**     | Polymarket CLOB                                 | Profile API                                                        |
| **Positions for a specific market** | Polymarket CLOB                                 | Profile API                                                        |
| **Public profile by wallet**        | Polymarket Gamma API                            | `GET /public-profile?address=<wallet>` (no auth)                   |
| **Deposits & withdrawals**          | Polymarket Bridge API                           | Supported assets, deposit/withdrawal addresses, transaction status |

---

## Related APIs

| Need                                           | API                                                                                                                                                       |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Trades, prices, volume**                     | [Polymarket API](/docs/examples/polymarket-api/polymarket-api/) · [Prediction Trades API](/docs/examples/prediction-market/prediction-trades-api/) |
| **Filter by market slug, condition ID, token** | [Polymarket Markets API](/docs/examples/polymarket-api/polymarket-markets-api/)                                                   |
| **Settlements & redemptions**                  | [Prediction Settlements API](/docs/examples/prediction-market/prediction-settlements-api/)                                        |
| **Market lifecycle & resolution**              | [Prediction Market API](/docs/examples/prediction-market/prediction-market-api/)                                                 |
| **On-chain contracts & events**                | Main Polymarket Contract (on-chain)                                               |

---

## Support

- [Bitquery Telegram](https://t.me/bloxy_info)
