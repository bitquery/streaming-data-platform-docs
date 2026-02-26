---
title: "Polymarket Wallet & User Activity API"
description: "Query Polymarket user activity, positions, and wallet-level data. Use Bitquery GraphQL for trader stats and link to official Polymarket profile and bridge APIs."
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

Get **user- and wallet-level data** for Polymarket: recent activity, positions, trade volume, and market counts. Use Bitquery GraphQL to analyze trader behavior by wallet address, and combine with the [Polymarket API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-api/) overview for trades and market data.

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
| **Trades, prices, volume**                     | [Polymarket API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-api/) · [Prediction Trades API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-trades-api/) |
| **Filter by market slug, condition ID, token** | [Polymarket Markets API](https://docs.bitquery.io/docs/examples/polymarket-api/polymarket-markets-api/)                                                   |
| **Settlements & redemptions**                  | [Prediction Settlements API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-settlements-api/)                                        |
| **Market lifecycle & resolution**              | [Prediction Market API](https://docs.bitquery.io/docs/examples/prediction-market/prediction-market-api/)                                                 |
| **On-chain contracts & events**                | [Main Polymarket Contract](https://docs.bitquery.io/docs/examples/polymarket-api/main-polymarket-contract/)                                               |

---

## Support

- [Bitquery Telegram](https://t.me/bloxy_info)
