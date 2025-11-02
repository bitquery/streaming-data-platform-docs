# Trends.Fun API - Solana - New Tokens, Trades, Live Prices

In this page, we will explore several examples related to Trends.fun. You can also check out our [Pump Fun API Docs](https://docs.bitquery.io/docs/blockchain/Solana/Pump-Fun-API/) and [Jupiter Studio API Docs](https://docs.bitquery.io/docs/blockchain/Solana/jupiter-studio-api/).

:::note
**Trends.fun tokens are created and traded on Meteora Dynamic Bonding Curve (DBC).**
:::

Need zero-latency Trends.fun data? [Read about our Shred Streams and Contact us for a Trial](https://docs.bitquery.io/docs/streams/real-time-solana-data/).

:::note
To query or stream data via graphQL **outside the Bitquery IDE**, you need to generate an API access token.

Follow the steps here to create one: [How to generate Bitquery API token ➤](https://docs.bitquery.io/docs/authorisation/how-to-generate/)
:::

<head>
<title>Trends.Fun API - Solana - New Tokens, Trades, Live Prices</title>
  <meta name="title" content="Trends.Fun API - Solana - New Tokens, Trades, Live Prices"/>
  <meta name="description" content="Get real time prices, charts, marketcap, liquidity, ATH, Trades and other trading related data using our Trends.fun API."/>
  <meta name="keywords" content="Trends.fun API,Trends.fun on-chain data API,Trends.fun token data API,Trends.fun blockchain API,Trends.fun DEX data API,Trends.fun API documentation,Trends.fun crypto API,Trends.fun web3 API,DEX Trades,Solana,Trends.fun memecoins,Solana DEX,token trading,blockchain data,crypto trading,Meteora DBC API"/>
  <meta name="robots" content="index, follow"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="language" content="English"/>

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Trends.Fun API - Solana - New Tokens, Trades, Live Prices"
/>
<meta
  property="og:description"
  content="Get real time prices, charts, marketcap, liquidity, ATH, Trades and other trading related data using our Trends.fun API."
/>

  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="Trends.Fun API - Solana - New Tokens, Trades, Live Prices"/>
  <meta property="twitter:description" content="Get on-chain data of any Trends.fun based token through our Trends.fun API."/>
</head>

If you want fastest data without any latency, we can provide gRPC and Kafka streams, please [fill this form](https://bitquery.io/forms/api) for it. Our Team will reach out.

## Table of Contents

### 1. Trends.fun Token Launches & Creation

- [Track Trends.fun Token Creation ➤](#track-trendsfun-pool-creation)

### 2. Bonding Curve & Progress APIs

- [Bonding Curve Progress API ➤](#bonding-curve-progress-api)
- [Track Tokens above 95% Bonding Curve Progress ➤](#track-trendsfun-tokens-above-95-bonding-curve-progress-in-realtime)

### 3. Token Migration & Graduation

- [Track Trends.fun Token Migrations ➤](#track-trendsfun-token-migrations-to-meteora-dex-in-realtime)
- [Top 100 About to Graduate Tokens ➤](#track-trendsfun-tokens-above-95-bonding-curve-progress-in-realtime)

### 4. Trading & Market Data

- [Latest Trades of a Trends.fun Token ➤](#latest-trades-of-a-trendsfun-token)
- [Latest Price of a Trends.fun Token ➤](#ohlcv-for-specific-trendsfun-token)
- [OHLCV Data ➤](#ohlcv-for-specific-trendsfun-token)
- [Top Buyers and Sellers ➤](#top-buyers-of-a-trendsfun-token)

### 5. Liquidity & Pool Data

- [Get Pair Address for a Token ➤](#get-liquidity-for-a-trendsfun-token-pair-address)
- [Get Liquidity for a Token Pair ➤](#get-liquidity-for-a-trendsfun-token-pair-address)

---

## Track Trends.fun Pool Creation

Using [this stream](https://ide.bitquery.io/latest-pools-created-on-trendsfun-stream) , we can get the realtime created Trends.fun tokens on Meteora Dynamic Bonding Curve.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    Instructions(
      where: {
        Instruction: {
          Program: {
            Address: { is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN" }
            Method: { is: "initialize_virtual_pool_with_spl_token" }
          }
        }
        Transaction: { Result: { Success: true } }
      }
    ) {
      Block {
        Time
      }
      Instruction {
        Accounts {
          Address
          IsWritable
          Token {
            Mint
            Owner
            ProgramId
          }
        }
        Program {
          AccountNames
          Address
          Arguments {
            Name
            Type
            Value {
              ... on Solana_ABI_Integer_Value_Arg {
                integer
              }
              ... on Solana_ABI_String_Value_Arg {
                string
              }
              ... on Solana_ABI_Address_Value_Arg {
                address
              }
              ... on Solana_ABI_BigInt_Value_Arg {
                bigInteger
              }
              ... on Solana_ABI_Bytes_Value_Arg {
                hex
              }
              ... on Solana_ABI_Boolean_Value_Arg {
                bool
              }
              ... on Solana_ABI_Float_Value_Arg {
                float
              }
              ... on Solana_ABI_Json_Value_Arg {
                json
              }
            }
          }
          Method
          Name
        }
      }
      Transaction {
        Signature
        Signer
      }
    }
  }
}
```

</details>

## Bonding Curve Progress API

Below query will give you the Bonding curve progress percentage of a specific Trends.fun Token.

### Bonding Curve Progress Formula

- **Formula**:
  BondingCurveProgress = 100 - ((leftTokens \* 100) / initialRealTokenReserves)

Where:

- leftTokens = realTokenReserves - reservedTokens
- initialRealTokenReserves = totalSupply - reservedTokens

- **Definitions**:
  - `initialRealTokenReserves` = `totalSupply` - `reservedTokens`
    - `totalSupply`: 1,000,000,000 (Trends.fun Token)
    - `reservedTokens`: Varies by token configuration
  - `leftTokens` = `realTokenReserves` - `reservedTokens`
    - `realTokenReserves`: Token balance at the market address.

:::note
**Note**: The exact reserved tokens amount may vary for Trends.fun tokens. Check the specific token's parameters for accurate calculations.
:::

### Get Bonding Curve Progress

Use this query to fetch the bonding curve progress percentage: [Query Link](https://ide.bitquery.io/bonding-curve-progress-percentage-of-a-trends-fun-token).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query GetBondingCurveProgressPercentage {
  Solana {
    DEXPools(
      limit: { count: 1 }
      orderBy: { descending: Block_Slot }
      where: {
        Pool: {
          Market: {
            BaseCurrency: {
              MintAddress: { is: "YOUR_TRENDS_FUN_TOKEN_ADDRESS" }
            }
          }
          Dex: {
            ProgramAddress: {
              is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN"
            }
          }
        }
      }
    ) {
      Pool {
        Market {
          MarketAddress
          BaseCurrency {
            MintAddress
            Symbol
            Name
          }
          QuoteCurrency {
            MintAddress
            Symbol
            Name
          }
        }
        Dex {
          ProtocolFamily
          ProtocolName
        }
        Quote {
          PostAmount
          PriceInUSD
          PostAmountInUSD
        }
        Base {
          Balance: PostAmount
        }
      }
    }
  }
}
```

</details>

## Track Trends.fun Tokens above 95% Bonding Curve Progress in realtime

Track Trends.fun tokens that are approaching graduation with high bonding curve progress percentages. Run the query: [Trends.fun tokens between 95–100% bonding-curve progress ➤](https://ide.bitquery.io/trends-fun-tokens-between-95-and-100-bonding-curve-progress).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription TrendsFunHighProgressTokens {
  Solana {
    DEXPools(
      where: {
        Pool: {
          Dex: {
            ProgramAddress: {
              is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN"
            }
          }
          Market: {
            QuoteCurrency: {
              MintAddress: {
                in: [
                  "11111111111111111111111111111111"
                  "So11111111111111111111111111111111111111112"
                  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
                ]
              }
            }
          }
        }
        Transaction: { Result: { Success: true } }
      }
    ) {
      Pool {
        Market {
          BaseCurrency {
            MintAddress
            Name
            Symbol
          }
          MarketAddress
          QuoteCurrency {
            MintAddress
            Name
            Symbol
          }
        }
        Dex {
          ProtocolName
          ProtocolFamily
        }
        Base {
          Balance: PostAmount
        }
        Quote {
          PostAmount
          PriceInUSD
          PostAmountInUSD
        }
      }
    }
  }
}
```

</details>

## Track Trends.fun Token Migrations to Meteora DEX in Realtime

Track real-time migrations of Trends.fun tokens from the bonding curve to Meteora DEX when they graduate.

Run the stream: [Track Trends.fun token migrations ➤](https://ide.bitquery.io/Track-trends-fun-Token-Migrations-to-Meteora-DEX-in-realtime).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription TrendsFunMigrations {
  Solana {
    Instructions(
      where: {
        Instruction: {
          Program: {
            Address: { is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN" }
            Method: { in: ["migrate_meteora_damm", "migration_damm_v2"] }
          }
        }
        Transaction: { Result: { Success: true } }
      }
    ) {
      Block {
        Time
      }
      Instruction {
        Program {
          Method
          AccountNames
          Address
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
              ... on Solana_ABI_Integer_Value_Arg {
                integer
              }
              ... on Solana_ABI_String_Value_Arg {
                string
              }
            }
            Type
            Name
          }
          Name
        }
        Accounts {
          Address
          IsWritable
          Token {
            ProgramId
            Owner
            Mint
          }
        }
      }
      Transaction {
        Signature
        Signer
      }
    }
  }
}
```

</details>

## Latest Trades of a Trends.fun Token

This query fetches the most recent trades of a specific Trends.fun token.
[Run query](https://ide.bitquery.io/Latest-Trades-of-a-Trends-Fun-Token)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query LatestTrades {
  Solana {
    DEXTradeByTokens(
      orderBy: { descending: Block_Time }
      limit: { count: 50 }
      where: {
        Trade: {
          Currency: {
            MintAddress: { is: "CY1P83KnKwFYostvjQcoR2HJLyEJWRBRaVQmYyyD3cR8" }
          }
        }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Signature
      }
      Trade {
        Market {
          MarketAddress
        }
        Dex {
          ProtocolName
          ProtocolFamily
        }
        AmountInUSD
        PriceInUSD
        Amount
        Currency {
          Name
          Symbol
          MintAddress
        }
        Side {
          Type
          Currency {
            Symbol
            MintAddress
            Name
          }
          AmountInUSD
          Amount
        }
      }
    }
  }
}
```

</details>

## Top Buyers of a Trends.fun Token

[This](https://ide.bitquery.io/Top-Buyers-of-a-Trends-Fun-Token) API endpoint returns the top 100 buyers for a specific Trends.fun token.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query TopBuyers {
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: { MintAddress: { is: "YOUR_TRENDS_TOKEN_ADDRESS" } }
          Side: { Type: { is: buy } }
        }
      }
      orderBy: { descendingByField: "buy_volume" }
      limit: { count: 100 }
    ) {
      Trade {
        Currency {
          MintAddress
          Name
          Symbol
        }
      }
      Transaction {
        Signer
      }
      buy_volume: sum(of: Trade_Side_AmountInUSD)
    }
  }
}
```

</details>

## Top Sellers of a Trends.fun Token

Using [this](https://ide.bitquery.io/Top-Sellers-of-a-Trends-Fun-Token) query, get the top 100 sellers for a specific Trends.fun token.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query TopSellers {
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: { MintAddress: { is: "YOUR Token Address here" } }
          Side: { Type: { is: buy } }
        }
      }
      orderBy: { descendingByField: "sell_volume" }
      limit: { count: 100 }
    ) {
      Trade {
        Currency {
          MintAddress
          Name
          Symbol
        }
      }
      Transaction {
        Signer
      }
      sell_volume: sum(of: Trade_AmountInUSD)
    }
  }
}
```

</details>

## OHLCV for specific Trends.fun Token

[This](https://ide.bitquery.io/OHLCV-of-a-trends-fun-token) API endpoint returns the OHLCV values for a Trends.fun token when traded against WSOL or USDC.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Trading {
    Currencies(
      where: {
        Currency: {
          Id: { is: "bid:solana:CY1P83KnKwFYostvjQcoR2HJLyEJWRBRaVQmYyyD3cR8" }
        }
        Interval: { Time: { Duration: { eq: 1 } } }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Currency {
        Id
        Name
        Symbol
      }
      Block {
        Date
        Time
        Timestamp
      }
      Interval {
        Time {
          Start
          Duration
          End
        }
      }
      Volume {
        Base
        BaseAttributedToUsd
        Quote
        Usd
      }
      Price {
        IsQuotedInUsd #The price is shown in USD (`IsQuotedInUsd: true` by default).
        Ohlc {
          Open # Earliest price across chains in the interval
          High # Highest price across chains in the interval
          Low # Lowest price across chains in the interval
          Close # Latest price across chains in the interval
        }
        Average {
          Estimate
          ExponentialMoving
          Mean
          SimpleMoving
          WeightedSimpleMoving
        }
      }
    }
  }
}
```

</details>

## Get Liquidity for a Trends.fun Token Pair Address

Using [this](https://ide.bitquery.io/liquidity-for-a-trends-fun-token-pair) query we can get the liquidity for a Trends.fun Token Pair, where `Base_PostBalance` is the amount of tokens present in the pool and `Quote_PostBalance` is the amount of quote currency (WSOL/USDC) present in the pool.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Solana {
    DEXPools(
      where: {Pool: {Market: {BaseCurrency: {MintAddress: {is: "TOKEN ADDRESS here"}}}, Dex: {ProgramAddress: {is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN"}}}, Transaction: {Result: {Success: true}}}
      orderBy: {descending: Block_Time}
      limit: {count: 1}
    ) {
      Pool {
        Base {
          PostAmount
        }
        Quote {
          PostAmount
        }
        Market {
          BaseCurrency {
            MintAddress
            Name
            Symbol
          }
          QuoteCurrency {
            MintAddress
            Name
            Symbol
          }
        }
      }
    }
  }
}

```

</details>

## Find All Tokens Created by a Trends.fun Developer

Get all tokens created by a specific Trends.fun developer/creator address.

[Run Query](https://ide.bitquery.io/All-Tokens-Created-by-a-Trends-Fun-Token-CreatorDeveloper)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Solana(network: solana) {
    Instructions(
      limit: { count: 10 }
      where: {
        Instruction: { Program: { Method: { is: "initializeMint2" } } }
        Transaction: { FeePayer: { is: "DEVELOPER_ADDRESS_HERE" } }
      }
    ) {
      Instruction {
        Program {
          Address
          Name
          Method
          AccountNames
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

---

### Additional Resources

- Need ultra-low latency Trends.fun data? Check out our [Kafka Streaming Services](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/)
- Explore more Solana APIs: [Solana Documentation ➤](https://docs.bitquery.io/docs/blockchain/Solana/)
- For technical support, join our [Telegram](https://t.me/Bloxy_info)
