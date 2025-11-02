---
title: "Jupiter Studio API - Live Token Launches, Trades, OHLC, Migration Data"
description: "Ultra low latency Jupiter Studio launchpad data, token trades, OHLC, migration tracking, and Meteora DBC analytics. Get real-time Jupiter Studio API data for token launches, trading, and migration insights."
---

# Jupiter Studio API - Live Token Launches, Trades, OHLC, Migration Data

Get ultra low latency Jupiter Studio launchpad data, token trades, OHLC, migration tracking, and Meteora DBC analytics from Jupiter Studio API, Streams and Data Dumps.
Access real-time data for Jupiter Studio token launches, trading activity, migration events, and Meteora Dynamic Bonding Curve insights through our Jupiter Studio API.
The below GraphQL APIs and Streams are examples of data points you can get with Bitquery.
If you have any question on other data points reach out to [support](https://t.me/Bloxy_info)

Need zero-latency Jupiter Studio data? [Read about our Shred Streams and Contact us for a Trial](https://docs.bitquery.io/docs/streams/real-time-solana-data/).

You may also be interested in:

- [Jupiter API ➤](https://docs.bitquery.io/docs/blockchain/Solana/solana-jupiter-api/)
- [Pump.fun APIs ➤](https://docs.bitquery.io/docs/blockchain/Solana/Pump-Fun-API/)
- [Meteora APIs ➤](https://docs.bitquery.io/docs/blockchain/Solana/meteora-api/)
- [Raydium APIs ➤](https://docs.bitquery.io/docs/blockchain/Solana/raydium-api/)

:::note
Jupiter studio tokens are launched and traded on Meteora DBC. So a Jup Studio token follows a lifecycle of a Meteora DBC Token.
:::

:::note
To query or stream data via graphQL **outside the Bitquery IDE**, you need to generate an API access token.

Follow the steps here to create one: [How to generate Bitquery API token ➤](https://docs.bitquery.io/docs/authorisation/how-to-generate/)
:::

import VideoPlayer from "../../../src/components/videoplayer.js";

<head>
<title>Jupiter Studio API - Live Token Launches, Trades, OHLC, Migration Data</title>
<meta
  name="title"
  content="Jupiter Studio API - Live Token Launches, Trades, OHLC, Migration Data"
/>
<meta
  name="description"
  content="Ultra low latency Jupiter Studio launchpad data, token trades, OHLC, migration tracking, and Meteora DBC analytics. Get real-time Jupiter Studio API data for token launches, trading, and migration insights."
/>
<meta
  name="keywords"
  content="Jupiter Studio API,jupiter studio launchpad api,jupiter studio token api,jupiter studio meteora api,jupiter studio dbc api,jupiter studio migration api,jupiter studio trades api,jupiter studio ohlc api,jupiter studio price api,jupiter studio volume api,jupiter studio analytics api,meteora dynamic bonding curve api,meteora dbc api,meteora jupiter studio api,solana launchpad api,solana token launch api,solana dex api,solana trading api,jupiter studio real time data,jupiter studio websocket api,jupiter studio blockchain api,jupiter studio trading analytics,solana token launches,launchpad data,blockchain trading data,crypto launchpad api"
/>
<meta name="robots" content="index, follow" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="language" content="English" />

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Jupiter Studio API - Solana - Token Launches, Trades, Migration Data"
/>
<meta
  property="og:description"
  content="Get Jupiter Studio launchpad data, token trades, OHLC, migration tracking and Meteora DBC analytics"
/>

  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="Jupiter Studio API - Solana - Token Launches, Trades, Migration Data"/>
  <meta property="twitter:description" content="Get Jupiter Studio launchpad data, token trades, OHLC, migration tracking and Meteora DBC analytics"/>
</head>

---

### Table of Contents

### 1. Jupiter Studio Trading & Market Data

- [Track Real-Time Jupiter Studio Token Trades ➤](#track-real-time-jupiter-studio-token-trades)
- [Get Latest Price of Jupiter Studio Token ➤](#get-latest-price-of-jupiter-studio-token)
- [Jupiter Studio Token OHLC Data ➤](#jupiter-studio-token-ohlc-data)
- [Get Trading Volume & Analytics ➤](#get-trading-volume--analytics)

### 2. Jupiter Studio Token Launches & Migration

- [Track Latest Jupiter Studio Token Launches ➤](#track-latest-jupiter-studio-token-launches-on-meteora-dbc)
- [Monitor Jupiter Studio Token Migrations ➤](#monitor-jupiter-studio-token-migrations)
- [Check Token Migration Status ➤](#check-token-migration-status)

### 3. Jupiter Studio Trader Insights

- [Get Top Traders of Jupiter Studio Token ➤](#get-top-traders-of-jupiter-studio-token)

## Jupiter Studio Trading & Market Data

### Track Real-Time Jupiter Studio Token Trades

Get real-time Jupiter Studio token trades on Meteora Dynamic Bonding Curve with comprehensive trade details including buy/sell information, account addresses, and transaction specifics.

We monitor Jupiter Studio tokens (ending with "jups") trading on Meteora DBC program address `dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN`.
The query returns detailed trade information including currency details, amounts, prices, and account addresses.

[Jupiter Studio Token Trades — Stream ➤](https://ide.bitquery.io/trades-of-jup-studio-tokens-on-meteora-dbc-in-realtime)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    DEXTrades(
      where: {
        any: [
          {
            Trade: { Buy: { Currency: { MintAddress: { endsWith: "jups" } } } }
          }
          {
            Trade: { Sell: { Currency: { MintAddress: { endsWith: "jups" } } } }
          }
        ]
        Trade: {
          Dex: {
            ProgramAddress: {
              is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN"
            }
          }
        }
      }
    ) {
      Trade {
        Dex {
          ProgramAddress
          ProtocolFamily
          ProtocolName
        }
        Buy {
          Currency {
            Name
            Symbol
            MintAddress
          }
          Amount
          Account {
            Address
          }
          PriceAgainstSellCurrency: Price
        }
        Sell {
          Account {
            Address
          }
          Amount
          Currency {
            Name
            Symbol
            MintAddress
          }
          PriceAgainstBuyCurrency: Price
        }
      }
      Block {
        Time
      }
    }
  }
}
```

</details>

### Track Latest Jupiter Studio Token Launches on Meteora DBC

Monitor real-time Jupiter Studio token pool creations on Meteora Dynamic Bonding Curve with comprehensive launch details including token metadata, creator addresses, and pool configuration.

We track Meteora DBC program address `dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN` for `initialize_virtual_pool_with_spl_token` instructions.
The query returns token details, account information, program arguments, and transaction specifics for new Jupiter Studio token launches.

[Jupiter Studio Token Launches — Stream ➤](https://ide.bitquery.io/jup-studio-token-creations-on-meteora-DBC)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription MyQuery {
  Solana {
    Instructions(
      where: {
        Instruction: {
          Accounts:{includes:{Address:{endsWith:"jups"}}}
          Program: {
            Address: { is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN" }
            Method: { is: "initialize_virtual_pool_with_spl_token" }
          }
        }
        Transaction: {
          Result: { Success: true }
        }
      }
    ) {
      Block {
        Time
      }
      Instruction {
        Accounts {
          Token {
            ProgramId
            Owner
            Mint
          }
          IsWritable
          Address
        }
        Program {
          Parsed
          Name
          Method
          Arguments {
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
            Type
            Name
          }
          Address
          AccountNames
        }
      }
      Transaction {
        Fee
        FeeInUSD
        FeePayer
        Signature
      }
    }
  }
}
```

</details>

## Jupiter Studio Token Launches & Migration

### Monitor Jupiter Studio Token Migrations

Track real-time Jupiter Studio token migrations from Meteora Dynamic Bonding Curve to Meteora DEX with comprehensive migration details and transaction information.

We monitor Meteora DBC program address `dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN` for migration instructions including `migrate_meteora_damm` and `migration_damm_v2`.
The query returns token details, account information, and migration transaction specifics for Jupiter Studio tokens.

[Jupiter Studio Token Migrations — Stream ➤](https://ide.bitquery.io/jup-studio-token-migrations-from-Meteora-DBC-to-Meteors-DEX_1)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription MyQuery {
  Solana {
    Instructions(
      where: {Instruction: {Accounts: {includes: {Address: {endsWith: "jups"}}}, Program: {Address: {is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN"}, Method: {in: ["migrate_meteora_damm", "migration_damm_v2"]}}}, Transaction: {Result: {Success: true}}}
    ) {
      Block {
        Time
      }
      Instruction {
        Accounts {
          Token {
            ProgramId
            Owner
            Mint
          }
          IsWritable
          Address
        }
        Program {
          Parsed
          Name
          Method
          Arguments {
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
            Type
            Name
          }
          Address
          AccountNames
        }
      }
      Transaction {
        Fee
        FeeInUSD
        FeePayer
        Signature
      }
    }
  }
}
```

</details>

### Check Token Migration Status

Check if specific Jupiter Studio tokens have migrated from Meteora DBC to Meteora DEX with detailed migration history and transaction information.

[Jupiter Studio Migration Status Check — Query ➤](https://ide.bitquery.io/Check-if-these-jup-tokens-tokens-have-migrated-from-Meteora-DBC)

<details>
  <summary>Click to expand GraphQL query</summary>

```
query MyQuery($tokenAddresses: [String!]) {
  Solana {
    Instructions(
      orderBy:{descending:Block_Time}
      where: {Instruction: {Program: {Address: {is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN"}, Method: {in: ["migrate_meteora_damm", "migration_damm_v2"]}}, Accounts: {includes: {Address: {in: $tokenAddresses}}}}, Transaction: {Result: {Success: true}}}
    ) {
      Block {
        Time
      }
      Instruction {
        Accounts {
          Token {
            ProgramId
            Owner
            Mint
          }
          IsWritable
          Address
        }
        Program {
          Parsed
          Name
          Method
          Arguments {
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
            Type
            Name
          }
          Address
          AccountNames
        }
      }
      Transaction {
        Fee
        FeeInUSD
        FeePayer
        Signature
      }
    }
  }
}
{
  "tokenAddresses":["CEVuiDHBxUeuuwvLugKqZpRpNtv5ejaQ1wKm2qzyjups","3Po3offygJjPg4cQpvc1AVT9JsYXyUapN2EKgFUbjups"]
}
```
</details>

### Get Latest Price of Jupiter Studio Token

Get the most recent price data for a specific Jupiter Studio token trading on Meteora Dynamic Bonding Curve with comprehensive price information.

[Jupiter Studio Token Latest Price — Query ➤](https://ide.bitquery.io/latest-price-of-a-jup-studio-token-on-meteora-dbc)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Solana {
    DEXTradeByTokens(
      limit: {count: 1}
      orderBy: {descending: Block_Time}
      where: {Trade: {Dex: {ProgramAddress: {is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN"}}, Currency: {MintAddress: {is: "3Po3offygJjPg4cQpvc1AVT9JsYXyUapN2EKgFUbjups"}}}}
    ) {
      Block {
        Time
      }
      Trade {
        Price
        PriceInUSD
        Currency{
          Name
          Symbol
          MintAddress
        }
      }
    }
  }
}
```

</details>

### Jupiter Studio Token OHLC Data

Get comprehensive OHLC (Open, High, Low, Close) data for Jupiter Studio tokens trading on Meteora DBC with volume analysis and price movement insights.

:::note
Use this API as a query only, not as a subscription websocket, as aggregates and time intervals don't work well with subscriptions.
:::

[Jupiter Studio Token OHLC — Query ➤](https://ide.bitquery.io/Jupiter-studio-OHLC-API)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Solana {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Block_Timefield"}
      where: {Trade: {Currency: {MintAddress: {is: "3Po3offygJjPg4cQpvc1AVT9JsYXyUapN2EKgFUbjups"}}, Side: {Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}}, Dex: {ProgramAddress: {is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN"}}, PriceAsymmetry: {lt: 0.1}}}
      limit: {count: 10}
    ) {
      Block {
        Timefield: Time(interval: {in: minutes, count: 1})
      }
      volume: sum(of: Trade_Amount)
      Trade {
        high: Price(maximum: Trade_Price)
        low: Price(minimum: Trade_Price)
        open: Price(minimum: Block_Slot)
        close: Price(maximum: Block_Slot)
      }
      count
    }
  }
}
```

</details>

### Get Trading Volume & Analytics

Get comprehensive trading volume analytics for Jupiter Studio tokens including total volume, buy volume, sell volume, and USD value analysis.

[Jupiter Studio Trading Volume — Query ➤](https://ide.bitquery.io/Get-trading-volume-buy-volume-sell-volume-of-a-jup-studio-token)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery {
  Solana(dataset: combined) {
    DEXTradeByTokens(
      where: {Block: {Time: {since: "2025-07-18T09:00:00Z", till: "2025-07-19T00:00:00Z"}}, Transaction: {Result: {Success: true}}, Trade: {Currency: {MintAddress: {is: "3Po3offygJjPg4cQpvc1AVT9JsYXyUapN2EKgFUbjups"}}, Side: {Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}}, Dex: {ProgramAddress: {is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN"}}}}
    ) {
      Trade {
        Currency {
          MintAddress
          Decimals
        }
        Side {
          Currency {
            Name
            MintAddress
          }
        }
      }
      traded_volume_USD: sum(of: Trade_Side_AmountInUSD)
      traded_volume: sum(of: Trade_Amount)
      buy_volume: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: buy}}}}
      )
      sell_volume: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: sell}}}}
      )
    }
  }
}
```

</details>

## Jupiter Studio Trader Insights

### Get Top Traders of Jupiter Studio Token

Get comprehensive trader analytics for Jupiter Studio tokens including top traders by volume, buy/sell activity, and USD trading volume rankings.

:::note
Use this API as a query only, not as a subscription websocket, because aggregates don't work with subscriptions and will return incorrect results.
:::

[Jupiter Studio Top Traders — Query ➤](https://ide.bitquery.io/Get-the-Top-Traders-of-a-specific-jup-studio-Token-on-Meteora-DBC)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query TopTraders($token: String) {
  Solana {
    DEXTradeByTokens(
      orderBy: {descendingByField: "volumeUsd"}
      limit: {count: 100}
      where: {Trade: {Currency: {MintAddress: {is: $token}}, Dex: {ProgramAddress: {is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN"}}}, Transaction: {Result: {Success: true}}}
    ) {
      Trade {
        Account {
          Owner
        }
        Side {
          Account {
            Address
          }
          Type
        }
      }
      bought: sum(of: Trade_Amount, if: {Trade: {Side: {Type: {is: buy}}}})
      sold: sum(of: Trade_Amount, if: {Trade: {Side: {Type: {is: sell}}}})
      volume: sum(of: Trade_Amount)
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
    }
  }
}
```

```json
{
  "token": "3Po3offygJjPg4cQpvc1AVT9JsYXyUapN2EKgFUbjups"
}
```

</details>
