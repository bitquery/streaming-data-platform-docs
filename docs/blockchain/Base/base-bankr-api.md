---
sidebar_position: 8
title: "Base Bankr (Doppler) API"
description: "Bitquery blockchain API docs: Base Bankr (Doppler) API."
---
# Base Bankr (Doppler) API

<head>
<meta name="title" content="Base Bankr / Doppler API | Track Bankr Tokens, Market Cap, OHLC"/>
<meta name="description" content="Track every Bankr-launched token on Base in real time. Bitquery exposes launches, Uniswap V4 trades, OHLC, market cap, FDV, and holder activity for tokens deployed via Bankr through the Doppler Protocol."/>
<meta name="keywords" content="bankr api, bankr base launchpad, doppler protocol api, bankr token tracker, base launchpad, bankr market cap, bankr ohlc, uniswap v4 bankr, doppler multicurve, bankr token api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>
<meta property="og:type" content="website"/>
<meta property="og:title" content="Base Bankr (Doppler) API | Track Bankr Tokens, Market Cap, OHLC"/>
<meta property="og:description" content="Real-time market cap, OHLC, and trade data for Bankr-launched tokens on Base."/>
<meta property="twitter:card" content="summary_large_image"/>
<meta property="twitter:title" content="Base Bankr (Doppler) API | Track Bankr Tokens, Market Cap, OHLC"/>
<meta property="twitter:description" content="Real-time market cap, OHLC, and trade data for Bankr-launched tokens on Base."/>
</head>

This page provides a set of queries to track tokens launched by **[Bankr](https://bankr.bot/)** on Base. Bankr deploys tokens using the **[Doppler Protocol](https://docs.doppler.lol/)** (canonical contracts maintained by Whetstone Research). Each token is minted into the Doppler **Airlock** orchestrator, seeded into a **Uniswap V4** multicurve pool via an initializer contract, and traded on V4 from the moment it launches.

Bankr uses Doppler's `NoOpMigrator`, which means **liquidity never migrates** — the multicurve LP stays in the same V4 pool forever and fees stream out through `StreamableFeesLockerV2` to the creator and Doppler. Because of this, there is **no on-chain `Graduated` event** for Bankr tokens; "graduation" is inferred from curve exhaustion (initializer's token balance reaching zero, or the pool tick crossing the final curve segment).

For the broader DEX schema, see:

- [Crypto Trades API ➤](/docs/trading/crypto-trades-api/trades-api)
- [Crypto Price API ➤](/docs/trading/crypto-price-api/introduction/)
- [Base DEX Trades API ➤](/docs/blockchain/Base/base-dextrades)
- [Uniswap V4 API ➤](/docs/blockchain/Base/uniswap-v4-api)
- [Base Token Market Cap API ➤](/docs/blockchain/Base/base-token-marketcap-api)

:::note
To query or stream data via GraphQL **outside the Bitquery IDE**, you need to generate an API access token. Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/).
:::

## Bankr / Doppler Contract Map (Base)

| Component                          | Address                                      | Role                                                                |
| ---------------------------------- | -------------------------------------------- | ------------------------------------------------------------------- |
| **Airlock**                        | `0x660eAaEdEBc968f8f3694354FA8EC0b4c5Ba8D12` | Orchestrator — emits `Create` per launch, receives the initial mint |
| **DecayMulticurveInitializer**     | `0xd59ce43…`                                 | Holds the V4 LP position (current default)                          |
| **ScheduledMulticurveInitializer** | `0xA36715d…`                                 | Holds the V4 LP position (original Feb 2025 deployment)             |
| **Uniswap V4 PoolManager**         | `0x498581fF718922c3f8e6A244956aF099B2652b2b` | Singleton where swaps actually clear                                |
| **NoOpMigrator**                   | (reverts on call)                            | Bankr's migrator slot — disables migration by design                |

## Latest Tokens Launched via Bankr

Every Bankr launch emits a `Create(address,address,address,address)` event on the Airlock contract. This query returns the most recent launches with the new token address and deployer.

[ Try it in the IDE ](https://ide.bitquery.io/Latest-Bankr-launches-Doppler-Airlock-Base)

```graphql
{
  EVM(network: base) {
    Events(
      limit: { count: 25 }
      orderBy: { descending: Block_Time }
      where: {
        LogHeader: {
          Address: { is: "0x660eAaEdEBc968f8f3694354FA8EC0b4c5Ba8D12" }
        }
        Log: { Signature: { Name: { is: "Create" } } }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
        From
      }
      Arguments {
        Name
        Value {
          __typename
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
        }
      }
    }
  }
}
```

The four positional arguments are typically `(asset, numeraire, initializer, migrator)`. The first address is the newly created token; the third is the multicurve initializer holding its LP; the fourth identifies whether the launch uses `NoOpMigrator` or a real migrator.

## Recent Bankr Tokens Created by a Deployer

Filter `Create` events on the Airlock by **`Transaction.From`** to list every Bankr token launched by a specific wallet. Replace the deployer address with the wallet you want to track.

[ Try it in the IDE ](https://ide.bitquery.io/All-bankers-tokens-created-by-a-deployer)

```graphql
{
  EVM(network: base, dataset: realtime) {
    Events(
      limit: { count: 50 }
      orderBy: { descending: Block_Time }
      where: {
        Log: {
          SmartContract: { is: "0x660eaaedebc968f8f3694354fa8ec0b4c5ba8d12" }
          Signature: { Name: { is: "Create" } }
        }
        Transaction: {
          From: { is: "0x36d4f6cddca1219440a5983f4d4459b20682e103" }
        }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
        From
      }
      Arguments {
        Name
        Value {
          __typename
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
        }
      }
    }
  }
}
```

The first address in `Arguments` is the newly minted token contract.

## Real-time Stream of Bankr Launches

Convert the above query into a subscription to be notified of every new token the moment it lands on Base.

[ Try it in the IDE ](https://ide.bitquery.io/Realtime-stream-Bankr-launches-Base)

```graphql
subscription {
  EVM(network: base) {
    Events(
      where: {
        LogHeader: {
          Address: { is: "0x660eAaEdEBc968f8f3694354FA8EC0b4c5Ba8D12" }
        }
        Log: { Signature: { Name: { is: "Create" } } }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
        From
      }
      Arguments {
        Name
        Value {
          __typename
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
        }
      }
    }
  }
}
```

## Latest Market Cap, FDV, Price for a Bankr Token

`Trading.Tokens` returns the latest 1-second interval row with USD price, OHLC, supply, market cap, and FDV. Filter by `Token.Address` + `Token.Network: "Base"`. Example uses OSAURUS (`0xa739D3728C13ad5a0d480525A6B9618863AA5bA3`).

[ Try it in the IDE ](https://ide.bitquery.io/Bankr-token-latest-marketcap-OHLC)

```graphql
query {
  Trading {
    Tokens(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        Token: {
          Address: { is: "0xa739d3728c13ad5a0d480525a6b9618863aa5ba3" }
          Network: { is: "Base" }
        }
        Interval: { Time: { Duration: { eq: 1 } } }
      }
    ) {
      Token {
        Address
        Symbol
        Name
      }
      Block {
        Time
      }
      Price {
        IsQuotedInUsd
        Ohlc {
          Open
          High
          Low
          Close
        }
        Average {
          Mean
          SimpleMoving
          ExponentialMoving
          WeightedSimpleMoving
        }
      }
      Supply {
        TotalSupply
        CirculatingSupply
        MarketCap
        FullyDilutedValuationUsd
      }
      Volume {
        Base
        Quote
        Usd
      }
    }
  }
}
```

## Real-time Market Cap & OHLC Stream

Subscribe to live 1-second OHLC + market cap updates for a specific Bankr token.

[ Try it in the IDE ](https://ide.bitquery.io/Bankr-token-realtime-marketcap-OHLC-stream)

```graphql
subscription {
  Trading {
    Tokens(
      where: {
        Token: {
          Address: { is: "0xa739d3728c13ad5a0d480525a6b9618863aa5ba3" }
          Network: { is: "Base" }
        }
        Interval: { Time: { Duration: { gt: 1 } } }
      }
    ) {
      Token {
        Address
        Symbol
        Name
      }
      Block {
        Time
      }
      Price {
        Ohlc {
          Open
          High
          Low
          Close
        }
        Average {
          Mean
        }
      }
      Supply {
        MarketCap
        FullyDilutedValuationUsd
        TotalSupply
      }
      Volume {
        Usd
      }
    }
  }
}
```

## OHLC Candles (1-Minute) for a Bankr Token

Build candlestick charts directly from `Trading.Tokens` using 60-second intervals.

[ Try it in the IDE ](https://ide.bitquery.io/Bankr-token-1min-OHLC-candles)

```graphql
query {
  Trading {
    Tokens(
      limit: { count: 100 }
      orderBy: { descending: Block_Time }
      where: {
        Token: {
          Address: { is: "0xa739d3728c13ad5a0d480525a6b9618863aa5ba3" }
          Network: { is: "Base" }
        }
        Interval: { Time: { Duration: { eq: 60 } } }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      Block {
        Time
      }
      Interval {
        Time {
          Start
          End
          Duration
        }
      }
      Price {
        Ohlc {
          Open
          High
          Low
          Close
        }
      }
      Volume {
        Base
        Quote
        Usd
      }
    }
  }
}
```

## Real-time DEX Swaps for a Bankr Token

Bankr trades clear on the Uniswap V4 singleton. Use the **[Crypto Trades API](/docs/trading/crypto-trades-api/trades-api)** (`Trading.Trades`) to stream swap-level rows with **USD price**, **market cap**, **supply**, **trader**, and **V4 pool id**. Filter by **`Pair.Market.Network: "Base"`**, **`Pair.Market.Protocol: "uniswap_v4"`**, and **`Pair.Token.Id`** (use **`base:`** + lowercase contract, e.g. `base:0xa739d3728c13ad5a0d480525a6b9618863aa5ba3`).

[ Try it in the IDE ](https://ide.bitquery.io/Bankr-token-V4-swaps-realtime)

```graphql
subscription {
  Trading {
    Trades(
      where: {
        Pair: {
          Market: { Network: { is: "Base" }, Protocol: { is: "uniswap_v4" } }
          Token: {
            Id: { is: "base:0xa739d3728c13ad5a0d480525a6b9618863aa5ba3" }
          }
        }
      }
    ) {
      Side
      Supply {
        CirculatingSupply
        MarketCap
        FullyDilutedValuationUsd
      }
      Trader {
        Address
      }
      TransactionHeader {
        Hash
        Sender
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
        Time
      }
      Price
      PriceInUsd
      Pair {
        Market {
          Network
          Protocol
          Program
        }
        Token {
          Address
          Symbol
        }
        QuoteToken {
          Address
          Symbol
        }
        Pool {
          Id
          Address
        }
      }
    }
  }
}
```

## All Pools for a Bankr Token (V4 PoolIds)

A Bankr token can have multiple V4 multicurve pools (e.g., one against WETH and one against USDC). List them with trade counts.

[ Try it in the IDE ](https://ide.bitquery.io/Bankr-token-all-V4-pools)

```graphql
{
  EVM(network: base) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: { ProtocolName: { is: "uniswap_v4" } }
          Currency: {
            SmartContract: { is: "0xa739d3728c13ad5a0d480525a6b9618863aa5ba3" }
          }
        }
      }
    ) {
      Trade {
        PoolId
        Side {
          Currency {
            Symbol
            SmartContract
          }
        }
      }
      trades: count
    }
  }
}
```

## Top Buyers of a Bankr Token (Last 24h)

Rank wallets by USD spent on a specific Bankr token over the last 24 hours.

[ Try it in the IDE ](https://ide.bitquery.io/Bankr-token-top-buyers-24h)

```graphql
{
  EVM(network: base) {
    DEXTradeByTokens(
      limit: { count: 25 }
      orderBy: { descendingByField: "spentUsd" }
      where: {
        Trade: {
          Dex: { ProtocolName: { is: "uniswap_v4" } }
          Currency: {
            SmartContract: { is: "0xa739d3728c13ad5a0d480525a6b9618863aa5ba3" }
          }
          Side: { Type: { is: buy } }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      Trade {
        Buyer
      }
      spentUsd: sum(of: Trade_Side_AmountInUSD)
      buys: count
    }
  }
}
```

## Top Sellers of a Bankr Token (Last 24h)

Same shape as above, but for sells.

[ Try it in the IDE ](https://ide.bitquery.io/Bankr-token-top-sellers-24h)

```graphql
{
  EVM(network: base) {
    DEXTradeByTokens(
      limit: { count: 25 }
      orderBy: { descendingByField: "receivedUsd" }
      where: {
        Trade: {
          Dex: { ProtocolName: { is: "uniswap_v4" } }
          Currency: {
            SmartContract: { is: "0xa739d3728c13ad5a0d480525a6b9618863aa5ba3" }
          }
          Side: { Type: { is: sell } }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      Trade {
        Seller
      }
      receivedUsd: sum(of: Trade_Side_AmountInUSD)
      sells: count
    }
  }
}
```

## Base Tokens Above a Market Cap Threshold

Stream every Base token currently above $100k FDV. Useful as a high-mcap or "graduated by mcap" alert.

[ Try it in the IDE ](https://ide.bitquery.io/Base-tokens-above-100k-marketcap-stream)

```graphql
subscription {
  Trading {
    Tokens(
      where: {
        Token: { Network: { is: "Base" } }
        Interval: { Time: { Duration: { gt: 1 } } }
        Supply: { FullyDilutedValuationUsd: { gt: 100000 } }
      }
    ) {
      Token {
        Address
        Symbol
        Name
      }
      Supply {
        MarketCap
        FullyDilutedValuationUsd
        TotalSupply
      }
      Price {
        Ohlc {
          Close
        }
      }
      Volume {
        Usd
      }
    }
  }
}
```

To narrow strictly to Bankr-deployed tokens, intersect with the list of token addresses emitted by `Airlock.Create` (first query on this page).

## Newly Launched Bankr Tokens With Trades (Last Hour)

Combine the launch feed with trading data to surface tokens that launched in the last hour and already have on-chain volume.

[ Try it in the IDE ](https://ide.bitquery.io/Bankr-tokens-last-hour-with-trades)

```graphql
{
  Trading {
    Tokens(
      limit: { count: 50 }
      limitBy: { by: Token_Address, count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        Token: { Network: { is: "Base" } }
        Interval: { Time: { Duration: { eq: 1 } } }
        Block: { Time: { since_relative: { minutes_ago: 60 } } }
        Volume: { Usd: { gt: 100 } }
      }
    ) {
      Token {
        Address
        Symbol
        Name
      }
      Block {
        Time
      }
      Price {
        Ohlc {
          Open
          Close
        }
      }
      Volume {
        Usd
      }
      Supply {
        FullyDilutedValuationUsd
        MarketCap
      }
    }
  }
}
```
