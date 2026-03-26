---
title: "PumpSwap API - Solana - Tokens, Trades, Live Prices"
description: "How to query and stream PumpSwap trades, prices, OHLC, volume, and pool events on Solana with Bitquery GraphQL. Track PumpSwap trades in real time via WebSocket, get historical data with dataset combined."
keywords:
  - PumpSwap API
  - track PumpSwap trades in real time
  - PumpSwap WebSocket
  - Solana PumpSwap GraphQL
  - PumpSwap program address
---

# PumpSwap API

Bitquery’s **PumpSwap API** exposes the PumpSwap AMM on Solana through GraphQL: **live and historical trades**, **prices**, **OHLC**, **volume**, **pool creation**, and **Pump.fun → PumpSwap migrations**. Use **queries** for snapshots, **subscriptions** to track PumpSwap trades in real time, and **`dataset: combined`** when you need more history than **`dataset: realtime`** (~recent window). Filter trades with **`Dex.ProgramAddress: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"`**.


For other data points, reach out to [support](https://t.me/Bloxy_info).

:::note
To query or stream data via graphQL **outside the Bitquery IDE**, you need to generate an API access token.

Follow the steps here to create one: [How to generate Bitquery API token ➤](https://docs.bitquery.io/docs/authorisation/how-to-generate/)
:::

- You can also explore [Pump Fun Data documentation ➤](https://docs.bitquery.io/docs/blockchain/Solana/Pump-Fun-API/)
- Also check out [LetsBonk.fun APIs ➤](https://docs.bitquery.io/docs/blockchain/Solana/letsbonk-api/)
- Need zero-latency PumpSwap data? [Read about our Shred Streams and Contact us for a Trial](https://docs.bitquery.io/docs/streams/real-time-solana-data/).

Join us on [Telegram](https://t.me/Bloxy_info) for support and integration help.

import VideoPlayer from "../../../../src/components/videoplayer.js";

<head>
<title>PumpSwap API - Solana - Tokens, Trades, Live Prices</title>
  <meta name="title" content="PumpSwap API - Solana - Tokens, Trades, Live Prices"/>
  <meta name="description" content="Query and stream PumpSwap trades, prices, OHLC, and volume on Solana with Bitquery. Track PumpSwap trades in real time via GraphQL subscription."/>
  <meta name="keywords" content="PumpSwap API,track PumpSwap trades in real time,PumpSwap WebSocket,PumpSwap GraphQL,Solana PumpSwap,PumpSwap on-chain data,PumpSwap program address,PumpSwap trades subscription,PumpSwap historical data,Bitquery"/>
  <meta name="robots" content="index, follow"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="language" content="English"/>

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="PumpSwap API - Solana - Tokens, Trades, Live Prices"
/>
<meta
  property="og:description"
  content="Get APIs and streams for PumpSwap trades, prices, OHLC, and volume on Solana with Bitquery GraphQL and WebSocket."
/>

  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="PumpSwap API - Solana - Tokens, Trades, Live Prices"/>
  <meta property="twitter:description" content="Track PumpSwap trades in real time and query PumpSwap prices, OHLC, and volume on Solana."/>
</head>

---

### Table of Contents

### 1. Pool creation and migration

- [What is the PumpSwap program address? ➤](#what-is-the-pumpswap-program-address-on-solana)
- [How do I get newly created PumpSwap pools in real time? ➤](#get-newly-created-pools-on-pumpswap-dex-in-realtime)
- [How do I track Pump.fun pool migrations to PumpSwap in real time? ➤](#track-pools-that-are-migrated-to-pumpswap)

### 2. Trades and prices

- [How do I get the latest PumpSwap trades? ➤](#latest-trades-on-pumpswap)
- [How do I track PumpSwap trades in real time? ➤](#latest-trades-on-pumpswap-websocket)
- [How do I get OHLC data for a PumpSwap token? ➤](#ohlc-for-pumpswap-token)
- [How do I get the latest trades for a token on PumpSwap? ➤](#latest-trades-for-a-token-on-pumpswap)
- [How do I track PumpSwap trades for a specific token in real time? ➤](#latest-trades-for-a-token-on-pumpswap---websocket)
- [How do I track a token’s price on PumpSwap in real time? ➤](#track-price-of-a-token-in-realtime-on-pumpswap)
- [How do I get the latest price of a token on PumpSwap? ➤](#get-latest-price-of-a-token-on-pumpswap)
- [How do I get trading volume for a PumpSwap token in a time range? ➤](#get-the-trading-volume-of-a-specific-token-on-pumpswap-dex)

### 3. Trader insights

- [How do I get the latest PumpSwap trades by a trader? ➤](#latest-trades-by-a-trader)
- [How do I track a trader’s PumpSwap trades in real time? ➤](#latest-trades-by-a-trader---get-data-in-real-time-via-a-websocket)
- [How do I get top traders on PumpSwap? ➤](#top-trader-on-pumpswap)

### 4. Token analytics

- [How do I get buy/sell volume and maker stats for a PumpSwap token? ➤](#get-buy-volume-sell-volume-buys-sells-makers-total-trade-volume-buyers-sellers-of-a-specific-token)

### 5. FAQ and videos

- [Frequently asked questions ➤](#frequently-asked-questions-pumpswap)
- [PumpSwap video tutorials ➤](#pumpswap-video-tutorials)

## What is the PumpSwap program address on Solana? {#what-is-the-pumpswap-program-address-on-solana}

The PumpSwap AMM program on Solana mainnet is **`pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA`**. Use this value in **`Trade.Dex.ProgramAddress`** or **`Instruction.Program.Address`** filters in Bitquery GraphQL so results are limited to PumpSwap (not other Solana DEXs).

## How do I get newly created PumpSwap pools in real time? {#get-newly-created-pools-on-pumpswap-dex-in-realtime}

Subscribe to **`Instructions`** where the program method is **`create_pool`** and the program address is the PumpSwap AMM ID above. Each event reflects a new pool on PumpSwap; use account and argument fields for pair and liquidity details.

[Run in Bitquery IDE — newly created PumpSwap pools (stream)](https://ide.bitquery.io/pumpSwap-new-pools-Stream)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    Instructions(
      where: {Instruction: {Program: {Method: {is: "create_pool"}, Address: {is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"}}}}
    ) {
      Instruction {
        Program {
          Address
          Name
          Method
          Arguments {
            Name
            Type
            Value {
              ... on Solana_ABI_Json_Value_Arg {
                json
              }
              ... on Solana_ABI_Float_Value_Arg {
                float
              }
              ... on Solana_ABI_Boolean_Value_Arg {
                bool
              }
              ... on Solana_ABI_Bytes_Value_Arg {
                hex
              }
              ... on Solana_ABI_BigInt_Value_Arg {
                bigInteger
              }
              ... on Solana_ABI_Address_Value_Arg {
                address
              }
              ... on Solana_ABI_String_Value_Arg {
                string
              }
              ... on Solana_ABI_Integer_Value_Arg {
                integer
              }
            }
          }
          AccountNames
          Json
        }
        Accounts {
          Address
          IsWritable
          Token {
            Mint
            Owner
            ProgramId
          }
        }
        Logs
        BalanceUpdatesCount
        AncestorIndexes
        CallPath
        CallerIndex
        Data
        Depth
        ExternalSeqNumber
        Index
        InternalSeqNumber
        TokenBalanceUpdatesCount
      }
      Transaction {
        Fee
        FeeInUSD
        Signature
        Signer
        FeePayer
        Result {
          Success
          ErrorMessage
        }
      }
      Block {
        Time
        Height
      }
    }
  }
}
```

</details>

## How do I track Pump.fun pool migrations to PumpSwap in real time? {#track-pools-that-are-migrated-to-pumpswap}

Subscribe to **`create_pool`** instructions on the PumpSwap program when they follow a Pump.fun **`migrate`** flow. **`Instruction.Accounts[]`** carries pool and token accounts; argument **`Value`** fields include liquidity added. Pair with the [Pump Fun to PumpSwap](https://docs.bitquery.io/docs/blockchain/Solana/pump-fun-to-pump-swap/) guide for full migration logic.

[Run in Bitquery IDE — Pump.fun → PumpSwap migrations](https://ide.bitquery.io/pumpfun-migration-stream_2#)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    Instructions(
      where: {
        Instruction: {
          CallerIndex: { eq: 2 }
          Depth: { eq: 1 }
          CallPath: { includes: { eq: 2 } }
          Program: {
            Method: { is: "create_pool" }
            Address: { is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA" }
          }
        }
      }
    ) {
      Instruction {
        Program {
          Address
          Name
          Method
          Arguments {
            Name
            Type
            Value {
              ... on Solana_ABI_Json_Value_Arg {
                json
              }
              ... on Solana_ABI_Float_Value_Arg {
                float
              }
              ... on Solana_ABI_Boolean_Value_Arg {
                bool
              }
              ... on Solana_ABI_Bytes_Value_Arg {
                hex
              }
              ... on Solana_ABI_BigInt_Value_Arg {
                bigInteger
              }
              ... on Solana_ABI_Address_Value_Arg {
                address
              }
              ... on Solana_ABI_String_Value_Arg {
                string
              }
              ... on Solana_ABI_Integer_Value_Arg {
                integer
              }
            }
          }
          AccountNames
          Json
        }
        Accounts {
          Address
          IsWritable
          Token {
            Mint
            Owner
            ProgramId
          }
        }
        Logs
        BalanceUpdatesCount
        AncestorIndexes
        CallPath
        CallerIndex
        Data
        Depth
        ExternalSeqNumber
        Index
        InternalSeqNumber
        TokenBalanceUpdatesCount
      }
      Transaction {
        Fee
        FeeInUSD
        Signature
        Signer
        FeePayer
        Result {
          Success
          ErrorMessage
        }
      }
      Block {
        Time
        Height
      }
    }
  }
}
```

</details>

## How do I get the latest PumpSwap trades? {#latest-trades-on-pumpswap}

Use **`DEXTrades`** with **`Solana(network: solana, dataset: realtime)`** and filter **`Trade.Dex.ProgramAddress`** to the PumpSwap AMM. This returns the most recent successful swaps on PumpSwap (snapshot query, not a live stream). For continuous updates, use the subscription in the next section.

[Run in Bitquery IDE — latest PumpSwap trades](https://ide.bitquery.io/Pumpswap-latest-Trades-API)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Solana(network: solana, dataset: realtime) {
    DEXTrades(
      where: {
        Trade: {
          Dex: {
            ProgramAddress: {
              is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"
            }
          }
        }
      }
      limit: { count: 100 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Instruction {
        Program {
          Method
        }
      }
      Trade {
        Dex {
          ProtocolFamily
          ProtocolName
          ProgramAddress
        }
        Buy {
          Price
          PriceInUSD
          Amount
          AmountInUSD
          Account {
            Address
            Owner
          }
          Currency {
            Name
            Symbol
            MintAddress
            Decimals
            Fungible
            Uri
          }
        }
        Sell {
          Price
          PriceInUSD
          Amount
          AmountInUSD
          Account {
            Owner
            Address
          }
          Currency {
            Name
            Symbol
            MintAddress
            Decimals
            Fungible
            Uri
          }
        }
      }
      Transaction {
        Signature
        Signer
        FeePayer
      }
    }
  }
}
```

</details>

## How do I track PumpSwap trades in real time? {#latest-trades-on-pumpswap-websocket}

Use a GraphQL **`subscription`** on **`DEXTrades`** with the same PumpSwap **`ProgramAddress`** filter. Bitquery pushes each new PumpSwap trade over WebSocket as it is indexed—this is the primary way to **track PumpSwap trades in real time** for dashboards and bots.

[Run in Bitquery IDE — real-time PumpSwap trades (WebSocket)](https://ide.bitquery.io/pumpswap-trades)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    DEXTrades(
      where: {
        Trade: {
          Dex: {
            ProgramAddress: {
              is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"
            }
          }
        }
      }
    ) {
      Trade {
        Dex {
          ProtocolName
        }
        Sell {
          Currency {
            Symbol
          }
        }
        Buy {
          Currency {
            Symbol
          }
        }
      }
      Transaction {
        Signature
      }
      Instruction {
        ExternalSeqNumber
        InternalSeqNumber
      }
    }
  }
}
```

</details>

## How do I get OHLC data for a PumpSwap token? {#ohlc-for-pumpswap-token}

Use **`DEXTradeByTokens`** with PumpSwap **`ProgramAddress`**, your token mint, and the quote side (e.g. WSOL) to aggregate **`open` / `high` / `low` / `close`** and volume per time bucket. **`Trade Side Account`** is not available on combined/archive aggregates—see the note below.

[Run in Bitquery IDE — OHLC for a PumpSwap token](https://ide.bitquery.io/ohlc-for-pumpswap)

:::note
Note: The `Trade Side Account` field is **not available** in aggregate queries across archive or combined datasets.
:::

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {Trade: {Dex: {ProgramAddress: {is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"}}, Currency: {MintAddress: {is: "6qN87akZ3Ghs3JbGmnNMYP2rCHSBDwtiXttBV4Hspump"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}}, Transaction: {Result: {Success: true}}}
      limit: {count: 100}
      orderBy: {descendingByField: "Block_Timefield"}
    ){
      Block{
        Timefield: Time(interval:{count:1 in:minutes})
      }
      Trade{
        open: Price(minimum:Block_Slot)
        high: Price(maximum:Trade_Price)
        low: Price(minimum:Trade_Price)
        close: Price(maximum:Block_Slot)
      }
      volumeInUSD: sum(of:Trade_Side_AmountInUSD)
      count
    }
  }
}

```

</details>

## How do I get the latest PumpSwap trades by a trader? {#latest-trades-by-a-trader}

Query **`DEXTrades`** with **`Transaction.Signer`** equal to the wallet and **`Trade.Dex.ProgramAddress`** set to PumpSwap. Returns recent buys/sells and signatures for that trader on PumpSwap only.

[Run in Bitquery IDE — latest trades by a trader on PumpSwap](https://ide.bitquery.io/Pumpswap-latest-Trade-for-a-trader-api_1)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Solana {
    DEXTrades(
      orderBy: [{descending: Block_Time}, {descending: Transaction_Index}, {descending: Trade_Index}]
      limit: {count: 10}
      where: {
        Transaction:{
          Signer:{is:"78mgMi3caj9CY5EdAW9FHhUoLcWB5suyfDF8dsQ2CNHR"}
        }
        Trade: {Dex: {ProgramAddress: {is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"}}}}
    ) {
      Block {
        Time
      }
      Instruction {
        Program {
          Method
        }
      }
      Trade {
        Dex {
          ProtocolFamily
          ProtocolName
          ProgramAddress
        }
        Buy {
          Price
          PriceInUSD
          Amount
          AmountInUSD
          Account {
            Address
            Owner
          }
          Currency {
            Name
            Symbol
            MintAddress
            Decimals
            Fungible
            Uri
          }
        }
        Sell {
          Price
          PriceInUSD
          Amount
          AmountInUSD
          Account {
            Owner
            Address
          }
          Currency {
            Name
            Symbol
            MintAddress
            Decimals
            Fungible
            Uri
          }
        }
      }
      Transaction {
        Signature
        Signer
        FeePayer
      }
    }
  }
}
```

</details>

## How do I track a trader’s PumpSwap trades in real time? {#latest-trades-by-a-trader---get-data-in-real-time-via-a-websocket}

Use a **`subscription`** on **`DEXTrades`** with the same **`Signer`** and PumpSwap **`ProgramAddress`** filters. New trades for that wallet on PumpSwap stream as they are confirmed.

[Run in Bitquery IDE — real-time trades by a trader (PumpSwap)](https://ide.bitquery.io/Pumpswap-latest-Trade-for-a-trader-stream_1)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    DEXTrades(
      where: {Transaction: {Signer: {is: "78mgMi3caj9CY5EdAW9FHhUoLcWB5suyfDF8dsQ2CNHR"}}, Trade: {Dex: {ProgramAddress: {is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"}}}}
    ) {
      Block {
        Time
      }
      Instruction {
        Program {
          Method
        }
      }
      Trade {
        Dex {
          ProtocolFamily
          ProtocolName
          ProgramAddress
        }
        Buy {
          Price
          PriceInUSD
          Amount
          AmountInUSD
          Account {
            Address
            Owner
          }
          Currency {
            Name
            Symbol
            MintAddress
            Decimals
            Fungible
            Uri
          }
        }
        Sell {
          Price
          PriceInUSD
          Amount
          AmountInUSD
          Account {
            Owner
            Address
          }
          Currency {
            Name
            Symbol
            MintAddress
            Decimals
            Fungible
            Uri
          }
        }
      }
      Transaction {
        Signature
        Signer
        FeePayer
      }
    }
  }
}
```

</details>

## How do I get the latest trades for a token on PumpSwap? {#latest-trades-for-a-token-on-pumpswap}

Use **`DEXTradeByTokens`** with PumpSwap **`ProgramAddress`** and the token **`MintAddress`**. Replace the placeholder mint with your token. Returns recent fills, price, and side for that token on PumpSwap.

[Run in Bitquery IDE — latest trades for a token on PumpSwap](https://ide.bitquery.io/Solana-trade-for-a-token_2)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Solana {
    DEXTradeByTokens(
      where: {

        Trade: {
          Dex:{
            ProgramAddress:{
              is:"pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"
            }
          }
          Currency:
        {MintAddress: {is: "token mint address"}}}}
      limit: {count: 20}
      orderBy: [{descending: Block_Time}, {descending: Transaction_Index}, {descending: Trade_Index}]
    ) {
      Instruction {
        Program {
          Method
        }
      }
      Trade {
        Currency {
          Name
          Symbol
          MintAddress
        }
        Price
        PriceInUSD
        Amount
        AmountInUSD
        Price
        PriceInUSD
        Side {
          Type
          Amount
          AmountInUSD
          Currency {
            Symbol
            Name
            MintAddress
          }
        }
        Dex {
          ProtocolName
          ProtocolFamily
          ProgramAddress
        }
      }
      Block {
        Time
        Height
        Slot
      }
      Transaction {
        Signature
        FeePayer
        Signer
      }
    }
  }
}
```

</details>

## How do I track PumpSwap trades for a specific token in real time? {#latest-trades-for-a-token-on-pumpswap---websocket}

Subscribe to **`DEXTradeByTokens`** with PumpSwap **`ProgramAddress`** and the token mint. Each update is a new trade involving that token on PumpSwap—use this to stream per-token activity without polling.

[Run in Bitquery IDE — real-time trades for a token (PumpSwap)](https://ide.bitquery.io/Latest-Trades-for-a-token-on-Pumpswap)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    DEXTradeByTokens(
      where: {Trade: {Dex: {ProgramAddress:
        {is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"}},
        Currency: {MintAddress:
          {is: "token mint address"}}}}
    ) {
      Instruction {
        Program {
          Method
        }
      }
      Trade {
        Currency {
          Name
          Symbol
          MintAddress
        }
        Price
        PriceInUSD
        Amount
        AmountInUSD
        Price
        PriceInUSD
        Side {
          Type
          Amount
          AmountInUSD
          Currency {
            Symbol
            Name
            MintAddress
          }
        }
        Dex {
          ProtocolName
          ProtocolFamily
          ProgramAddress
        }
      }
      Block {
        Time
        Height
        Slot
      }
      Transaction {
        Signature
        FeePayer
        Signer
      }
    }
  }
}
```

</details>

## How do I get top traders on PumpSwap? {#top-trader-on-pumpswap}

Aggregate **`DEXTradeByTokens`** by **`Transaction.Signer`** with **`limitBy`** and **`orderBy`** on trade count or volume (USD). Filter **`Dex.ProgramAddress`** to PumpSwap and optionally WSOL as the side currency to rank active wallets on the AMM.

[Run in Bitquery IDE — top traders on PumpSwap](https://ide.bitquery.io/top-traders-on-pumpswap_2)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery {
  Solana {
    DEXTradeByTokens(
      limitBy: {count: 1, by: Transaction_Signature}
      limit: {count: 10}
      where: {Trade: {Dex: {ProgramAddress: {is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}}, Transaction: {Result: {Success: true}}}
      orderBy: {descendingByField: "total_trades"}
    ) {
      Transaction {
        Signer
      }
      total_trades: count
      total_traded_volume: sum(of: Trade_Side_AmountInUSD)
    }
  }
}
```

</details>

## How do I get buy/sell volume and maker stats for a PumpSwap token? {#get-buy-volume-sell-volume-buys-sells-makers-total-trade-volume-buyers-sellers-of-a-specific-token}

Use **`DEXTradeByTokens`** with **`dataset: realtime`**, token mint, **`Market.MarketAddress`**, and time variables for **5-minute** and **1-hour** windows. The query returns buyers, sellers, makers, trade counts, and USD volume splits—ideal for live token dashboards on PumpSwap pairs.

[Run in Bitquery IDE — token stats (buys, sells, makers, volume)](https://ide.bitquery.io/Buys-Sells-BuyVolume-SellVolume-Makers-TotalTradedVolume-PriceinUSD-for-solana-token-pair0_4)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery($token: String!, $pair_address: String!, $time_5min_ago: DateTime!, $time_1h_ago: DateTime!) {
  Solana(dataset: realtime) {
    DEXTradeByTokens(
      where: {Transaction: {Result: {Success: true}},Trade: {Currency: {MintAddress: {is: $token}}, Market: {MarketAddress: {is: $pair_address}}}, Block: {Time: {since: $time_1h_ago}}}
    ) {
      Trade {
        Currency {
          Name
          MintAddress
          Symbol
        }
        start: PriceInUSD(minimum: Block_Time)
        min5: PriceInUSD(
          minimum: Block_Time
          if: {Block: {Time: {after: $time_5min_ago}}}
        )
        end: PriceInUSD(maximum: Block_Time)
        Dex {
          ProtocolName
          ProtocolFamily
          ProgramAddress
        }
        Market {
          MarketAddress
        }
        Side {
          Currency {
            Symbol
            Name
            MintAddress
          }
        }
      }
      makers: count(distinct: Transaction_Signer)
      makers_5min: count(
        distinct: Transaction_Signer
        if: {Block: {Time: {after: $time_5min_ago}}}
      )
      buyers: count(
        distinct: Transaction_Signer
        if: {Trade: {Side: {Type: {is: buy}}}}
      )
      buyers_5min: count(
        distinct: Transaction_Signer
        if: {Trade: {Side: {Type: {is: buy}}}, Block: {Time: {after: $time_5min_ago}}}
      )
      sellers: count(
        distinct: Transaction_Signer
        if: {Trade: {Side: {Type: {is: sell}}}}
      )
      sellers_5min: count(
        distinct: Transaction_Signer
        if: {Trade: {Side: {Type: {is: sell}}}, Block: {Time: {after: $time_5min_ago}}}
      )
      trades: count
      trades_5min: count(if: {Block: {Time: {after: $time_5min_ago}}})
      traded_volume: sum(of: Trade_Side_AmountInUSD)
      traded_volume_5min: sum(
        of: Trade_Side_AmountInUSD
        if: {Block: {Time: {after: $time_5min_ago}}}
      )
      buy_volume: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: buy}}}}
      )
      buy_volume_5min: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: buy}}}, Block: {Time: {after: $time_5min_ago}}}
      )
      sell_volume: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: sell}}}}
      )
      sell_volume_5min: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: sell}}}, Block: {Time: {after: $time_5min_ago}}}
      )
      buys: count(if: {Trade: {Side: {Type: {is: buy}}}})
      buys_5min: count(
        if: {Trade: {Side: {Type: {is: buy}}}, Block: {Time: {after: $time_5min_ago}}}
      )
      sells: count(if: {Trade: {Side: {Type: {is: sell}}}})
      sells_5min: count(
        if: {Trade: {Side: {Type: {is: sell}}}, Block: {Time: {after: $time_5min_ago}}}
      )
    }
  }
}
```

**Variables (example):**

```json
{
  "token": "token mint address",
  "pair_address": "48oGgzAdYJ5nzMmNz2Jvv5qvX4HXhNgp27tmdEM5n2EF",
  "time_5min_ago": "2025-03-25T09:14:00Z",
  "time_1h_ago": "2025-03-25T08:19:00Z"
}
```

</details>

## How do I track a token’s price on PumpSwap in real time? {#track-price-of-a-token-in-realtime-on-pumpswap}

Subscribe to **`DEXTradeByTokens`** filtered by PumpSwap **`ProgramAddress`** and the token **`MintAddress`**. Each event includes **`Price`** and **`PriceInUSD`** for the latest leg—use it as a live price feed for that token on PumpSwap.

[Run in Bitquery IDE — real-time price of a PumpSwap token](https://ide.bitquery.io/realtime-price-of-a-pumpswap-token)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: {
            ProgramAddress: {
              is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"
            }
          }
          Currency: { MintAddress: { is: "token mint address" } }
        }
        Transaction: { Result: { Success: true } }
      }
    ) {
      Block {
        Time
      }
      Trade {
        Currency {
          MintAddress
          Name
          Symbol
        }
        Dex {
          ProtocolName
          ProtocolFamily
          ProgramAddress
        }
        Side {
          Currency {
            MintAddress
            Symbol
            Name
          }
        }
        Price
        PriceInUSD
      }
      Transaction {
        Signature
      }
    }
  }
}
```

</details>

## How do I get the latest price of a token on PumpSwap? {#get-latest-price-of-a-token-on-pumpswap}

Query **`DEXTradeByTokens`** with **`orderBy: descending Block_Time`** and **`limit`** on PumpSwap **`ProgramAddress`** plus the token mint. Returns the most recent trade-based price without keeping a subscription open.

[Run in Bitquery IDE — latest price of a PumpSwap token](https://ide.bitquery.io/Price-of-a-pumpswap-token_1)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery {
  Solana {
    DEXTradeByTokens(
      orderBy: { descending: Block_Time }
      limit: { count: 10 }
      where: {
        Trade: {
          Dex: {
            ProgramAddress: {
              is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"
            }
          }
          Currency: { MintAddress: { is: "token mint address" } }
        }
        Transaction: { Result: { Success: true } }
      }
    ) {
      Block {
        Time
      }
      Trade {
        Currency {
          MintAddress
          Name
          Symbol
        }
        Dex {
          ProtocolName
          ProtocolFamily
          ProgramAddress
        }
        Side {
          Currency {
            MintAddress
            Symbol
            Name
          }
        }
        Price
        PriceInUSD
      }
      Transaction {
        Signature
      }
    }
  }
}
```

</details>

## How do I get trading volume for a PumpSwap token in a time range? {#get-the-trading-volume-of-a-specific-token-on-pumpswap-dex}

Use **`DEXTradeByTokens`** with **`Block.Time`** **`since` / `till`** and **`sum(of: Trade_Side_AmountInUSD)`** (and token volume) for the window. **Use a `query` only**—aggregates such as **`sum`** are not valid on subscriptions; a WebSocket subscription would return incorrect aggregates.

[Run in Bitquery IDE — trading volume of a PumpSwap token](https://ide.bitquery.io/trading-volume-of-a-token-pumpSwap)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: { MintAddress: { is: "token mint address" } }
          Dex: { ProtocolFamily: { is: "Pumpswap" } }
        }
        Block: {
          Time: { since: "2025-03-25T09:30:00Z", till: "2025-03-25T10:30:00Z" }
        }
      }
    ) {
      Trade {
        Currency {
          Name
          Symbol
          MintAddress
        }
        Dex {
          ProtocolName
          ProtocolFamily
        }
      }
      TradeVolume_USD: sum(of: Trade_Side_AmountInUSD)
      TradeVolume: sum(of: Trade_Amount)
    }
  }
}
```

</details>

## Frequently asked questions (PumpSwap) {#frequently-asked-questions-pumpswap}

### How do I track PumpSwap trades in real time?

Use a GraphQL **`subscription`** on **`DEXTrades`** (all PumpSwap trades) or **`DEXTradeByTokens`** (one token) with **`Trade.Dex.ProgramAddress: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"`**. See [How do I track PumpSwap trades in real time?](#latest-trades-on-pumpswap-websocket) and [per-token stream](#latest-trades-for-a-token-on-pumpswap---websocket). For a one-off snapshot, use a **`query`** with **`dataset: realtime`** instead.

### What is the PumpSwap program address on Solana?

**`pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA`** — use it on every PumpSwap trade and pool filter. [Details above](#what-is-the-pumpswap-program-address-on-solana).

### Why do I only see recent PumpSwap data with `dataset: realtime`?

**`dataset: realtime`** covers a **rolling recent window** (roughly the last several hours of activity). For **full history**, use **`dataset: combined`** (or archive where applicable) on **`Solana`**, as described in [historical aggregate data](https://docs.bitquery.io/docs/blockchain/Solana/historical-aggregate-data/).

### Can I run PumpSwap volume or OHLC aggregates as a subscription?

**No.** **`sum`**, **`count`**, and bucketed OHLC require **queries**, not **`subscription`**. Use subscriptions for **raw trades** or **per-trade prices**, and run **aggregates in your app** or via **scheduled queries**.

### Where can I get Pump.fun data before a token moves to PumpSwap?

Use the [Pump.fun API](https://docs.bitquery.io/docs/blockchain/Solana/Pump-Fun-API/) and [Pump Fun to PumpSwap](https://docs.bitquery.io/docs/blockchain/Solana/pump-fun-to-pump-swap/) guides. This page focuses on **PumpSwap** only after migration.

---

## PumpSwap video tutorials {#pumpswap-video-tutorials}

### Video Tutorial | How to get Trades, Trades of a token and Trades of a trader on PumpSwap DEX in realtime

<VideoPlayer url="https://www.youtube.com/watch?v=MMazeabdirM" />

### Video Tutorial | How to get Top Traders on PumpSwap AMM

<VideoPlayer url="https://www.youtube.com/watch?v=TwQoD5vybLI" />
