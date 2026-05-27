---
title: Cardano Address API - Get Wallet Balances, Native Tokens & Staking
sidebar_label: Cardano Address API
description: Query Cardano wallet balances across ADA and native tokens, plus staking and rewards data, using Bitquery's GraphQL Address API.
keywords:
  - Cardano address API
  - Cardano wallet balance API
  - Cardano staking API
  - addressStats Cardano
  - Cardano GraphQL
  - ADA balance
  - Cardano native token balance
  - Bitquery Cardano
---

# Cardano Address API

The Address API gives you everything tied to a Cardano wallet: ADA balance, balances for every native token the wallet holds, and the staking snapshot (controlled stake, rewards available, rewards withdrawn). For quick activity profiling you can also use the `addressStats` cube, which returns pre-aggregated inflow, outflow, counterparty, and first/last-active metrics.

:::info Endpoint
Cardano GraphQL queries are served at `https://graphql.bitquery.io`.
:::

## Get Cardano wallet balances and staking info

This query returns ADA plus every native token a Cardano address holds, with the wallet's full staking context — total controlled stake, the staked amount with and without rewards, rewards currently available, and how much has already been withdrawn. Useful for portfolio dashboards, wallet UIs, and staking analytics.

Swap the example address with the wallet you want to inspect. Stake addresses (`stake1...`) work in the same filter.

```graphql
{
  cardano(network: cardano) {
    address(
      address: {is: "addr1v9m34968vfwya2dydafkaq48ag9pzerznwjf0ewu4jj5vfsvgmyhk"}
    ) {
      address {
        address
        annotation
      }
      balance {
        value
        currency {
          name
          symbol
          decimals
          address
          tokenId
          tokenType
        }
      }
      staking {
        controlledTotalStake
        stakedAmount
        stakedAmountWithRewards
        rewardsAmount
        rewardsAvailable
        withdrawnAmount
        address {
          address
          annotation
        }
      }
    }
  }
}
```

If you only want the ADA balance, filter the response client-side where `currency.symbol == "ADA"`. Drop the `staking` block when stake context isn't needed.

## Get Cardano address activity stats (addressStats)

`addressStats` is a pre-aggregated view of a wallet's lifetime activity — total inflows and outflows, inbound and outbound transaction counts, unique senders and receivers, unique active days, current balance, and the first / last active timestamps. It's the fastest way to profile an address for compliance checks, exchange screening, or analytics dashboards.

:::caution
`addressStats` is pre-aggregated and can lag the chain slightly. For exact, up-to-the-block balance math, sum `outputs` and subtract `inputs` from the [Inputs and Outputs API](https://docs.bitquery.io/docs/blockchain/Cardano/inputs-outputs).
:::

```graphql
{
  cardano(network: cardano) {
    addressStats(
      address: {is: "addr1v9m34968vfwya2dydafkaq48ag9pzerznwjf0ewu4jj5vfsvgmyhk"}
    ) {
      address {
        address
        annotation
        balance
        inflows
        outflows
        inboundTransactions
        outboundTransactions
        uniqueSenders
        uniqueReceivers
        uniqueDaysWithTransfers
        firstActive {
          time
        }
        lastActive {
          time
        }
      }
    }
  }
}
```

Pair this with the `address(...)` query above when you want fast aggregate metrics and per-asset balances in one round trip, or run it against a list of exchange / DAO / protocol addresses to compare them side-by-side.

## Related resources

- [Cardano Inputs and Outputs API](https://docs.bitquery.io/docs/blockchain/Cardano/inputs-outputs) — UTXO-level balance reconstruction
- [Cardano Transactions API](https://docs.bitquery.io/docs/blockchain/Cardano/transactions) — transaction-level data with fees
- [Cardano Coinpath API](https://docs.bitquery.io/docs/blockchain/Cardano/coinpath) — multi-hop ADA flow tracing
