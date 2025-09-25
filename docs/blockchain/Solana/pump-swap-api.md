---
title: "PumpSwap API - Solana - Tokens, Trades, Live Prices"
description: "Get on-chain data of any PumpSwap based token through our PumpSwap API."
---

# PumpSwap API

Bitquery provides PumpSwap data via APIs, streams, and real-time subscriptions. These endpoints let you track liquidity, trades, prices, token activity, and more on the PumpSwap AMM DEX. If you have any question on other data points reach out to [support](https://t.me/Bloxy_info)

:::note
To query or stream data via graphQL **outside the Bitquery IDE**, you need to generate an API access token.

Follow the steps here to create one: [How to generate Bitquery API token ➤](https://docs.bitquery.io/docs/authorisation/how-to-generate/)
:::

- You can also explore [Pump Fun Data documentation ➤](https://docs.bitquery.io/docs/blockchain/Solana/Pump-Fun-API/)
- Also check out [LetsBonk.fun APIs ➤](https://docs.bitquery.io/docs/blockchain/Solana/letsbonk-api/)
- Need zero-latency PumpSwap data? [Read about our Shred Streams and Contact us for a Trial](https://docs.bitquery.io/docs/streams/real-time-solana-data/).

Join us on [Telegram](https://t.me/Bloxy_info) for support and integration help.

import VideoPlayer from "../../../src/components/videoplayer.js";

<head>
<title>PumpSwap API - Solana - Tokens, Trades, Live Prices</title>
  <meta name="title" content="PumpSwap API - Solana - Tokens, Trades, Live Prices"/>
  <meta name="description" content="Get on-chain data of any PumpSwap based token through our PumpSwap API."/>
  <meta name="keywords" content="PumpSwap API,PumpSwap on-chain data API,PumpSwap token data API,PumpSwap blockchain API,PumpSwap DEX data API,PumpSwap API documentation,PumpSwap crypto API,PumpSwap web3 API,DEX Trades,Solana,Blast,PumpSwap memecoins,Solana DEX,Blast DEX,token trading,blockchain data,crypto trading"/>
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
  content="Get on-chain data of any PumpSwap based token through our PumpSwap API."
/>

  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="PumpSwap On-Chain Data with PumpSwap API"/>
  <meta property="twitter:description" content="Get on-chain data of any PumpSwap based token through our PumpSwap API."/>
</head>

---

### Table of Contents

### 1. Pool Creation & Migration

- [Get Newly Created Pools in Real-time ➤](#get-newly-created-pools-on-pumpswap-dex-in-realtime)
- [Track Pools Migrated to PumpSwap ➤](#track-pools-that-are-migrated-to-pumpswap)

### 2. Trade Activity & Price Data

- [Latest Trades on PumpSwap ➤](#latest-trades-on-pumpswap)
- [Real-Time Trades (WebSocket) ➤](#latest-trades-on-pumpswap-websocket)
- [Latest Trades for a Token ➤](#latest-trades-for-a-token-on-pumpswap)
- [Track Price in Real-Time ➤](#track-price-of-a-token-in-realtime-on-pumpswap)
- [Get OHLC Data ➤](#ohlc-for-pumpswap-token)
- [Get Trading Volume ➤](#get-the-trading-volume-of-a-specific-token-on-pumpswap-dex)

### 3. Trader Insights

- [Latest Trades by a Trader ➤](#latest-trades-by-a-trader)
- [Real-Time Trades by a Trader ➤](#latest-trades-by-a-trader---get-data-in-real-time-via-a-websocket)
- [Top Traders on PumpSwap ➤](#top-trader-on-pumpswap)

### 4. Token Analytics

- [Token Stats: Buys, Sells, Volume, Makers ➤](#get-buy-volume-sell-volume-buys-sells-makers-total-trade-volume-buyers-sellers-of-a-specific-token)

### 5. Video Tutorials

- [Watch PumpSwap Tutorials ➤](#pumpswap-video-tutorials)

## Get Newly created pools on PumpSwap DEX in realtime

Use the below query to get the latest created pools on PumpSwap. Try the stream: [PumpSwap — newly created pools (realtime) ➤](https://ide.bitquery.io/pumpSwap-new-pools-Stream)

<details>
  <summary>Click to expand GraphQL query</summary>

```
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

## Track Pools that are migrated to PumpSwap

Use the below query to track Pump Fun token migrations to PumpSwap in realtime. You will get the following account addresses information through the query's `Instruction Accounts[]` field and the amount of liquidity added through arguments' `Value` field

Try the stream: [Track Pump.fun → PumpSwap pool migrations ➤](https://ide.bitquery.io/pumpfun-migration-stream_2#).

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

## Latest trades on PumpSwap

Below query returns latest trades on PumpSwap
Run the query: [Latest trades on PumpSwap ➤](https://ide.bitquery.io/Pumpswap-latest-Trades-API).

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

## Latest trades on PumpSwap websocket

Below query can help you get real-time trades on PumpSwap using `subscription`.
Run the stream: [Real-time trades on PumpSwap (WebSocket) ➤](https://ide.bitquery.io/pumpswap-trades).

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

## OHLC for PumpSwap token

Below API query can get you the OHLC of a given token pair on PumpSwap. You can use the OHLC to build charts.
Run the query: [OHLC for a PumpSwap token ➤](https://ide.bitquery.io/ohlc-for-pumpswap).

:::note
Note: The `Trade Side Account` field is **not available** in aggregate queries across archive or combined datasets.
:::

<details>
  <summary>Click to expand GraphQL query</summary>

```
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

## Latest Trades by a Trader

Run the query: [Latest trades by a trader on PumpSwap ➤](https://ide.bitquery.io/Pumpswap-latest-Trade-for-a-trader-api_1).

<details>
  <summary>Click to expand GraphQL query</summary>

```
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

## Latest Trades by a Trader - Get Data in Real-time via a Websocket

Below query can get you the latest trades of a trader in real time.
Run the stream: [Real-time trades by a trader (PumpSwap) ➤](https://ide.bitquery.io/Pumpswap-latest-Trade-for-a-trader-stream_1).

<details>
  <summary>Click to expand GraphQL query</summary>

```
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

## Latest Trades for a token on Pumpswap

Below query can get you the latest trades of a token on Pumpswap.
Run the query: [Latest trades for a token on PumpSwap ➤](https://ide.bitquery.io/Solana-trade-for-a-token_2).

<details>
  <summary>Click to expand GraphQL query</summary>

```
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

## Latest Trades for a token on Pumpswap - Websocket

Below query can get you the latest trades of a token on Pumpswap in real time.
Run the stream: [Real-time trades for a token (PumpSwap) ➤](https://ide.bitquery.io/Latest-Trades-for-a-token-on-Pumpswap).

<details>
  <summary>Click to expand GraphQL query</summary>

```
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

## Top Trader on Pumpswap

Below query can get you top traders on Pumpswap.
Run the query: [Top traders on PumpSwap ➤](https://ide.bitquery.io/top-traders-on-pumpswap_2).

<details>
  <summary>Click to expand GraphQL query</summary>

```
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

## Get Buy Volume, Sell Volume, Buys, Sells, Makers, Total Trade Volume, Buyers, Sellers of a specific Token

The below query gives you the essential stats for a token such as buy volume, sell volume, total buys, total sells, makers, total trade volume, buyers, sellers (in last 5 min, 1 hour) of a specific token.
Run the query: [Token stats — buys, sells, makers, volume ➤](https://ide.bitquery.io/Buys-Sells-BuyVolume-SellVolume-Makers-TotalTradedVolume-PriceinUSD-for-solana-token-pair0_4)

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
{
  "token":"token mint address",
  "pair_address": "48oGgzAdYJ5nzMmNz2Jvv5qvX4HXhNgp27tmdEM5n2EF",
  "time_5min_ago":"2025-03-25T09:14:00Z",
  "time_1h_ago": "2025-03-25T08:19:00Z"
}
```

</details>

## Track Price of a Token in Realtime on PumpSwap

The below query gets real-time price of the specified Token `token mint address` on the PumpSwap DEX.
Run the stream: [Real-time price of a PumpSwap token ➤](https://ide.bitquery.io/realtime-price-of-a-pumpswap-token).

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

## Get Latest Price of a Token on PumpSwap

The below query gets real-time price of the specified Token `token mint address` on the PumpSwap DEX.
Run the query: [Latest price of a PumpSwap token ➤](https://ide.bitquery.io/Price-of-a-pumpswap-token_1)

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

## Get the Trading Volume of a specific Token on PumpSwap DEX

The below query gets the Trading volume of the specified Token `token mint address` on PumpSwap DEX. You will have to change the time in this `Block: { Time: { since: "2025-03-25T09:30:00Z" till: "2025-03-25T10:30:00Z" } }` when you try the query yourself. Keep in mind you can use this API only as a query and not a subscription websocket because aggregates don't work with subscription and you will end up getting wrong results.
Run the query: [Trading volume of a PumpSwap token ➤](https://ide.bitquery.io/trading-volume-of-a-token-pumpSwap)

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

## PumpSwap Video Tutorials

### Video Tutorial | How to get Trades, Trades of a token and Trades of a trader on PumpSwap DEX in realtime

<VideoPlayer url="https://www.youtube.com/watch?v=MMazeabdirM" />

### Video Tutorial | How to get Top Traders on PumpSwap AMM

<VideoPlayer url="https://www.youtube.com/watch?v=TwQoD5vybLI" />
