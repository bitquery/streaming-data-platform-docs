# Raydium Launchpad API

import VideoPlayer from "../../../src/components/videoplayer.js";

In this section we see how to get data on Launchpad by Raydium. This includes token creation, latest trades by trader, for a token etc. You can also check out our [Pump Fun API Docs](https://docs.bitquery.io/docs/examples/Solana/Pump-Fun-API/) and [LetsBonk.fun API Docs](https://docs.bitquery.io/docs/examples/Solana/letsbonk-api/).

These APIs can be provided through different streams including Kafka for zero latency requirements. Please contact us on telegram.

<head>
  <meta name="title" content="Raydium Launchpad API - Solana On-Chain Token & Trade Data" />
  <meta name="description" content="Access real-time on-chain data for Raydium Launchpad tokens using the Bitquery-powered Raydium Launchpad API. Track trades, liquidity, token prices, and more on Solana." />
  <meta name="keywords" content="Raydium Launchpad API,Raydium token data,Solana API,Raydium on-chain data,Raydium DEX API,Solana Launchpad tokens,Raydium AcceleRaytor,Raydium LaunchLab,Bitquery API,crypto trading API,Solana memecoins,Raydium blockchain data,token analytics API" />
  <meta name="robots" content="index, follow" />
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="language" content="English" />

  <meta property="og:type" content="website" />
  <meta property="og:title" content="Raydium Launchpad API - Solana On-Chain Token & Trade Data" />
  <meta property="og:description" content="Explore token analytics and real-time data from Raydium Launchpad projects on Solana with the Bitquery API." />

  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:title" content="Raydium Launchpad API - Token & Trade Data on Solana" />
  <meta property="twitter:description" content="Monitor token trades, prices, and liquidity for Raydium Launchpad projects using Bitquery's on-chain API." />
</head>

## Latest Pools Created on Launchpad

We will use the `PoolCreateEvent` method to filter latest pools on Launchpad. The `Argument` filed includes more information about the pool like `base_mint_param`( token details), `curve_param`( bonding curve details) and `vesting_param` ( cliff period, amount locked etc). Token address is at the 7th entry in Accounts Array.

You can run the query [here](https://ide.bitquery.io/Raydium-Launchpad-pool-creations_1)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana(network: solana) {
    Instructions(
      where: {
        Instruction: {
          Program: {
            Address: { is: "LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj" }
            Method: { is: "initialize_v2" }
          }
        }
        Transaction: { Result: { Success: true } }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Signer
        Signature
      }
      Instruction {
        Accounts {
          Address
        }
        Program {
          Name
          Method
          AccountNames
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
        }
      }
    }
  }
}
```

</details>

## Get all the instructions of Raydium LaunchLab

Below query will get you all the instructions that the Raydium LaunchLab Program has. You can test the API [here](https://ide.bitquery.io/all-the-instructions-of-Raydium-LaunchLab).

<details>
  <summary>Click to expand GraphQL query</summary>

```
query MyQuery {
  Solana {
    Instructions(
      where: {Instruction: {Program: {Address: {is: "LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj"}}}}
    ) {
      Instruction {
        Program {
          Method
        }
      }
      count
    }
  }
}
```

</details>

## Track Token Migrations to Raydium DEX and Raydium CPMM in Realtime

Using above `get all instructions` api, you will figure out that there are 2 instructions `migrate_to_amm`, `migrate_to_cpswap` whose invocations migrate the Raydium LaunchLab Token to Raydium V4 AMM and Raydium CPMM Dexs respectively.

Thats why we have filtered for these 2 instructions in the below API, and tracking these.

Test out the API [here](https://ide.bitquery.io/Track-Token-Migrations-to-Raydium-DEX-and-Raydium-CPMM-in-realtime).

<details>
  <summary>Click to expand GraphQL query</summary>

```
subscription MyQuery {
  Solana {
    Instructions(
      where: {Instruction: {Program: {Address: {is: "LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj"}, Method: {in: ["migrate_to_amm","migrate_to_cpswap"]}}}, Transaction: {Result: {Success: true}}}
    ) {
      Block{
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

## Track Raydium Launchlab, Meteora DBC, Boop.fun, LetsBonk.fun and Moonshot Token Migrations in a single subscription

Use this single subscription to stream real-time token migration events across Boop.fun, Raydium Launchlab, Meteora DBC, and Moonshot. It filters by the respective program IDs and migration methods, returning block time, program details, involved accounts, and transaction signatures as events occur.

Try out the [API](https://ide.bitquery.io/Raydium-Launchlab-Meteora-DBC-BoopFun-Moonshot-LetsBonkfun-token-migrations-in-realtime_2) here on IDE.

<details>
  <summary>Click to expand GraphQL query</summary>

```
subscription{
  Solana {
    Instructions(
      where: {any: [{Instruction: {Program: {Address: {is: "LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj"}, Method: {is: "initialize_v2"}}}}, {Instruction: {Program: {Address: {is: "boop8hVGQGqehUK2iVEMEnMrL5RbjywRzHKBmBE7ry4"}, Method: {is: "graduate"}}}}, {Instruction: {Program: {Address: {is: "MoonCVVNZFSYkqNXP6bxHLPL6QQJiMagDL3qcqUQTrG"}, Method: {is: "migrateFunds"}}}}, {Instruction: {Program: {Address: {is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN"}, Method: {in: ["migrate_meteora_damm", "migration_damm_v2"]}}}}, {Instruction: {Program: {Address: {is: "LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj"}, Method: {in: ["migrate_to_amm", "migrate_to_cpswap"]}}, Accounts: {includes: {Address: {is: "FfYek5vEz23cMkWsdJwG2oa6EphsvXSHrGpdALN4g6W1"}}}}}], Transaction: {Result: {Success: true}}}
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
          # LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj - Launchlab
          # boop8hVGQGqehUK2iVEMEnMrL5RbjywRzHKBmBE7ry4 - boop.fun
          # MoonCVVNZFSYkqNXP6bxHLPL6QQJiMagDL3qcqUQTrG - Moonshot/Moonit
          # dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN - Meteora DBC
          # LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj - Program Address and FfYek5vEz23cMkWsdJwG2oa6EphsvXSHrGpdALN4g6W1(letsbonk.fun platform config addr) is present in Accounts array then its Letsbonk.fun migration
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

Below query will give you the Bonding curve progress percentage of a specific Raydium Launchlab Token.

### Bonding Curve Progress Formula

- **Formula**:
  BondingCurveProgress = 100 - ((leftTokens \* 100) / initialRealTokenReserves)

Where:

- leftTokens = realTokenReserves - reservedTokens
- initialRealTokenReserves = totalSupply - reservedTokens

- **Definitions**:
  - `initialRealTokenReserves` = `totalSupply` - `reservedTokens`
    - `totalSupply`: 1,000,000,000 (Raydium Launchlab Token)
    - `reservedTokens`: 206,900,000
    - Therefore, `initialRealTokenReserves`: 793,100,000
  - `leftTokens` = `realTokenReserves` - `reservedTokens`
    - `realTokenReserves`: Token balance at the market address.

:::note
**Simplified Formula**:
BondingCurveProgress = 100 - (((balance - 206900000) \* 100) / 793100000)
:::

### Additional Notes

- **Balance Retrieval**:
  - The `balance` is the token balance at the market address.
  - Use this query to fetch the balance and then we use `espressions` to calculate the bonding curve progress percentage in the query itself: [Query Link](https://ide.bitquery.io/bonding-curve-progress-percentage-of-a-letsbonkfun-token).

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
              MintAddress: {
                is: "CctsjizSC6pwf2T8bhdHdZTEV4PEcfXoumjeK7FBbonk"
              }
            }
          }
          Dex: {
            ProgramAddress: {
              is: "LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj"
            }
          }
        }
      }
    ) {
      Bonding_Curve_Progress_precentage: calculate(
        expression: "100-((($Pool_Base_Balance - 206900000) * 100) / 793100000)"
      )
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

## Track Raydium Launchlab Tokens above 95% Bonding Curve Progress in realtime

We can use above Bonding Curve formulae and get the Balance of the Pool needed to get to 95% and 100% Bonding Curve Progress range. And then track liquidity changes which result in `Base{PostAmount}` to fall in this range. You can run and test the saved query [here](https://ide.bitquery.io/LetsBonkfun-Tokens-between-95-and-100-bonding-curve-progress_2).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription MyQuery {
  Solana {
    DEXPools(
      where: {
        Pool: {
          Base: { PostAmount: { gt: "206900000", lt: "246555000" } }
          Dex: {
            ProgramAddress: {
              is: "LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj"
            }
          }
          Market: {
            QuoteCurrency: {
              MintAddress: {
                in: [
                  "11111111111111111111111111111111"
                  "So11111111111111111111111111111111111111112"
                ]
              }
            }
          }
        }
        Transaction: { Result: { Success: true } }
      }
    ) {
      Bonding_Curve_Progress_precentage: calculate(
        expression: "100 - ((($Pool_Base_Balance - 206900000) * 100) / 793100000)"
      )
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

## Top 100 About to Graduate Raydium Launchlab Tokens

We can use below query to get top 100 About to Graduate Raydium Launchlab Tokens. You can run and test the saved query [here](https://ide.bitquery.io/Top-100-graduating-raydium-launchlab-tokens-in-last-5-minutes).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Solana {
    DEXPools(
      limitBy: { by: Pool_Market_BaseCurrency_MintAddress, count: 1 }
      limit: { count: 100 }
      orderBy: { ascending: Pool_Base_PostAmount }
      where: {
        Pool: {
          Base: { PostAmount: { gt: "206900000" } }
          Dex: {
            ProgramAddress: {
              is: "LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj"
            }
          }
          Market: {
            QuoteCurrency: {
              MintAddress: {
                in: [
                  "11111111111111111111111111111111"
                  "So11111111111111111111111111111111111111112"
                ]
              }
            }
          }
        }
        Transaction: { Result: { Success: true } }
        Block: { Time: { since_relative: { minutes_ago: 5 } } }
      }
    ) {
      Bonding_Curve_Progress_precentage: calculate(
        expression: "100 - ((($Pool_Base_Balance - 206900000) * 100) / 793100000)"
      )
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
          Balance: PostAmount(maximum: Block_Time)
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

## Latest Trades on Launchpad

This query fetches the most recent trades on the Raydium Launchpad.
You can run the query [here](https://ide.bitquery.io/Latest-Trades-on-Launchpad)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query LatestTrades {
  Solana {
    DEXTradeByTokens(
      orderBy: { descending: Block_Time }
      limit: { count: 50 }
      where: { Trade: { Dex: { ProtocolName: { is: "raydium_launchpad" } } } }
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

Similarly, you can subscribe to trades on launchpad in real-time using [subscription query](https://ide.bitquery.io/Subscribe-to-Trades-on-Launchpad). The same can be tracked using [Bitquery Kafka Streams](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/)

## Latest Price of a Token on Launchpad

This query provides the most recent price data for a specific token launched on Raydium Launchpad. You can filter by the token’s `MintAddress`, and the query will return the last recorded trade price.
You can run the query [here](https://ide.bitquery.io/Latest-Price-of-a-Token-on-Launchpad)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Solana {
    DEXTradeByTokens(
      orderBy: { descending: Block_Time }
      limit: { count: 1 }
      where: {
        Trade: {
          Dex: { ProtocolName: { is: "raydium_launchpad" } }
          Currency: { MintAddress: { is: "token mint address" } }
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

## Latest Trades of an User on Launchpad

[This](https://ide.bitquery.io/trades-by-user-on-launchpad_1) query returns the latest trades by a user on Launchpad by filtering on the basis of `Transaction_Signer`. [This](https://ide.bitquery.io/trades-by-user-on-launchpad-stream) stream of data allows to monitor the trade activities of the user on Launchpad in real time.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: { Dex: { ProtocolName: { is: "raydium_launchpad" } } }
        Transaction: {
          Signer: { is: "8KjdBwz6Q3EYUDYmqfg33em3p9GFcP48v3ghJmw2KDNe" }
        }
      }
      orderBy: { descending: Block_Time }
      limit: { count: 100 }
    ) {
      Trade {
        Currency {
          MintAddress
          Name
          Symbol
        }
        Market {
          MarketAddress
        }
        usd_price: PriceInUSD
        sol_price: Price
        Side {
          Currency {
            Symbol
            Name
            MintAddress
          }
          Type
        }
      }
    }
  }
}
```

</details>

## Top Buyers of a Token on LaunchPad

[This](https://ide.bitquery.io/top-buyers-of-a-token-on-launchpad) API endpoint returns the top 100 buyers for a token, which is `8CgTj1bVFPVFN9AgY47ZfXkMZDRwXawQ2vckp1ziqray` in this case.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: { ProtocolName: { is: "raydium_launchpad" } }
          Currency: { MintAddress: { is: "token mint address" } }
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

## Top Sellers of a Token on LaunchPad

Using [this](https://ide.bitquery.io/top-sellers-of-a-token-on-launchpad_1) query top 100 sellers for the token with `Mint Address` as `8CgTj1bVFPVFN9AgY47ZfXkMZDRwXawQ2vckp1ziqray` could be retrieved.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: { ProtocolName: { is: "raydium_launchpad" } }
          Currency: { MintAddress: { is: "token mint address" } }
          Side: { Type: { is: sell } }
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
      sell_volume: sum(of: Trade_Side_AmountInUSD)
    }
  }
}
```

</details>

## OHLCV for LaunchPad Tokens

[This](https://ide.bitquery.io/ohlc-for-launchpad-token) API end point returns the OHLCV vlaues for a LaunchPad token with the currency `mint address` as `72j7mBkX54KNH7djeJ2mUz5L8VoDToPbSQTd24Sdhray` when traded against WSOL.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: { ProtocolName: { is: "raydium_launchpad" } }
          Currency: { MintAddress: { is: "token mint address" } }
          Side: {
            Currency: {
              MintAddress: { is: "So11111111111111111111111111111111111111112" }
            }
          }
        }
        Transaction: { Result: { Success: true } }
      }
      limit: { count: 100 }
      orderBy: { descendingByField: "Block_Timefield" }
    ) {
      Block {
        Timefield: Time(interval: { count: 1, in: minutes })
      }
      Trade {
        open: Price(minimum: Block_Slot)
        high: Price(maximum: Trade_Price)
        low: Price(minimum: Trade_Price)
        close: Price(maximum: Block_Slot)
      }
      volumeInUSD: sum(of: Trade_Side_AmountInUSD)
      count
    }
  }
}
```

</details>

## Get Liquidity Pool Address for a LaunchPad Token

[This](https://ide.bitquery.io/pool-address-for-launchpad-token) query returns the pair address for the LaunchPad token with `mint address` as `72j7mBkX54KNH7djeJ2mUz5L8VoDToPbSQTd24Sdhray` on the LaunchPad exchange. The liquidity pool address is denoted by `MarketAddress`.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: { ProtocolName: { is: "raydium_launchpad" } }
          Currency: { MintAddress: { is: "token mint address" } }
        }
      }
    ) {
      Trade {
        Market {
          MarketAddress
        }
        Currency {
          Name
          Symbol
          MintAddress
        }
        Side {
          Currency {
            Name
            Symbol
            MintAddress
          }
        }
      }
      count
    }
  }
}
```

</details>

## Get Liquidity for a LaunchPad Token Pair Address

Using [this](https://ide.bitquery.io/liquidity-for-a-launchpad-token-pair) query we can get the liquidity for a LaunchPad Token Pair, where `Base_PostBalance` is the amount of LaunchPad tokens present in the pool and `Quote_PostBalance` is the amount of WSOL present in the pool. For the purpose of filtering we are applying the condition that the `MarketAddress` is `H5875KoMLaWAovsjjXuTtHZv9otmH7EgJ2nXMovykZvp`.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Solana {
    DEXPools(
      where: {
        Pool: {
          Market: {
            MarketAddress: {
              is: "H5875KoMLaWAovsjjXuTtHZv9otmH7EgJ2nXMovykZvp"
            }
          }
        }
        Transaction: { Result: { Success: true } }
      }
      orderBy: { descending: Block_Time }
      limit: { count: 1 }
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

[This](https://ide.bitquery.io/liquidity-for-a-launchpad-token-pair-stream) subscription could be utilised to monitor updates in liquidity pools in real time.

## Video Tutorial | How to track Raydium LaunchPad Token Migrations to Raydium V4 and Raydium CPMM Dex

<VideoPlayer url="https://www.youtube.com/watch?v=lp1V2uLAu3Q" />

## Video Tutorial | How to Track Raydium Launchpad Newly Launched Tokens in Realtime

<VideoPlayer url="https://www.youtube.com/watch?v=2jQ4dyR_cqw" />

## Video Tutorial | How to track Dex Trades of a Traders on Raydium LaunchPad in Realtime

<VideoPlayer url="https://www.youtube.com/watch?v=V1Fd8uXm6mc" />

## Video Tutorial | How to get OHLCV of a token on Raydium LaunchLab

<VideoPlayer url="https://www.youtube.com/watch?v=M9wSVqRE7_o" />

## Video Tutorial | How to get Top Buyers and Sellers of a Raydium LaunchLab Token

<VideoPlayer url="https://www.youtube.com/watch?v=it8xf3kdILo" />
