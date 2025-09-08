# LetsBonk.Fun API - Solana - Tokens, Trades, Live Prices

import VideoPlayer from "../../../src/components/videoplayer.js";

In this document, we will explore several examples related to LetsBonk.fun. You can also check out our [Pump Fun API Docs](https://docs.bitquery.io/docs/blockchain/Solana/Pump-Fun-API/) and [FourMeme API Docs](https://docs.bitquery.io/docs/blockchain/BSC/four-meme-api/).

:::note
**LetsBonk.fun tokens are created and traded on Raydium Launchlab.**
:::

Need zero-latency LetsBonk.fun data? [Read about our Shred Streams and Contact us for a Trial](https://docs.bitquery.io/docs/streams/real-time-solana-data/).

:::note
To query or stream data via graphQL **outside the Bitquery IDE**, you need to generate an API access token.

Follow the steps here to create one: [How to generate Bitquery API token ➤](https://docs.bitquery.io/docs/authorisation/how-to-generate/)
:::

<head>
  <meta name="title" content="LetsBonk.Fun API - Solana - Tokens, Trades, Live Prices"/>
  <meta name="description" content="Get real time prices, charts, marketcap, liquidity, ATH, Trades and other trading related data using our LetsBonk.fun API."/>
  <meta name="keywords" content="LetsBonk.fun API,LetsBonk.fun on-chain data API,LetsBonk.fun token data API,LetsBonk.fun blockchain API,LetsBonk.fun DEX data API,LetsBonk.fun API documentation,LetsBonk.fun crypto API,LetsBonk.fun web3 API,DEX Trades,Solana,Blast,LetsBonk.fun memecoins,Solana DEX,Blast DEX,token trading,blockchain data,crypto trading"/>
  <meta name="robots" content="index, follow"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="language" content="English"/>

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="LetsBonk.Fun API - Solana - Tokens, Trades, Live Prices"
/>
<meta
  property="og:description"
  content="Get real time prices, charts, marketcap, liquidity, ATH, Trades and other trading related data using our LetsBonk.fun API."
/>

  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="LetsBonk.Fun API - Solana - Tokens, Trades, Live Prices"/>
  <meta property="twitter:description" content="Get on-chain data of any LetsBonk.fun based token through our LetsBonk.fun API."/>
</head>

If you want fastest data without any latency, we can provide Kafka streams, please [fill this form](https://bitquery.io/forms/api) for it. Our Team will reach out.

## Track LetsBonk.fun Token Creation

Using [this](https://ide.bitquery.io/latest-token-created-on-letsbonk-fun-in-realtime) query, we can get the realtime created LetsBonk.fun tokens.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    InstructionBalanceUpdates(
      where: {
        BalanceUpdate: { Currency: { MintAddress: { endsWith: "bonk" } } }
        Instruction: {
          Program: {
            Address: { is: "LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj" }
            Method: { is: "initialize" }
          }
        }
        Transaction: { Result: { Success: true } }
      }
    ) {
      BalanceUpdate {
        Currency {
          MintAddress
          Name
          Symbol
          Decimals
          UpdateAuthority
          Uri
          VerifiedCollection
          Wrapped
          ProgramAddress
        }
        PostBalance
      }
      Block {
        Time
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

Below query will give you the Bonding curve progress percentage of a specific LetsBonk.fun Token.

### Bonding Curve Progress Formula

- **Formula**:
  BondingCurveProgress = 100 - ((leftTokens \* 100) / initialRealTokenReserves)

Where:

- leftTokens = realTokenReserves - reservedTokens
- initialRealTokenReserves = totalSupply - reservedTokens

- **Definitions**:
  - `initialRealTokenReserves` = `totalSupply` - `reservedTokens`
    - `totalSupply`: 1,000,000,000 (LetsBonk.fun Token)
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

## Track LetsBonk.fun Tokens above 95% Bonding Curve Progress in realtime

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

## Top 100 About to Graduate LetsBonk.fun Tokens

We can use below query to get top 100 About to Graduate LetsBonk.fun Tokens. You can run and test the saved query [here](https://ide.bitquery.io/Top-100-graduating-raydium-launchlab-tokens-in-last-5-minutes).

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

## Track LetsBonk.fun Token Migrations to Raydium DEX and Raydium CPMM in Realtime

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

## Latest Trades of a LetsBonk.fun token on Launchpad

This query fetches the most recent trades of a LetsBonk.fun Token `token Mint Address` on the Raydium Launchpad.
You can run the query [here](https://ide.bitquery.io/Latest-Trades-of-a-letsbonkfun-token-on-Launchpad)

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
          Dex: { ProtocolName: { is: "raydium_launchpad" } }
          Currency: { MintAddress: { is: "token Mint Address" } }
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

Similarly, you can subscribe to trades on launchpad in real-time using [subscription query](https://ide.bitquery.io/Subscribe-to-Trades-on-Launchpad). The same can be tracked using [Bitquery Kafka Streams](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/)

## Latest Price of a LetsBonk.fun Token on Raydium Lanchlab

This query provides the most recent price data for a specific LetsBonk.fun token `token Mint Address` launched on Raydium Launchpad. You can filter by the token’s `MintAddress`, and the query will return the last recorded trade price.
You can run the query [here](https://ide.bitquery.io/Latest-Price-of-a-LetsBonkfun-Token-on-Launchpad)

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
          Currency: { MintAddress: { is: "token Mint Address" } }
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

## Top Buyers of a LetsBonk.fun Token on LaunchPad

[This](https://ide.bitquery.io/top-buyers-of-a-letsbonkfun-token-on-launchpad) API endpoint returns the top 100 buyers for a token, which is `token Mint Address` in this case.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: { ProtocolName: { is: "raydium_launchpad" } }
          Currency: { MintAddress: { is: "token Mint Address" } }
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

Using [this](https://ide.bitquery.io/top-sellers-of-a-letsbonkfun-token-on-launchpad_1) query top 100 sellers for the token with `Mint Address` as `token Mint Address` could be retrieved.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: { ProtocolName: { is: "raydium_launchpad" } }
          Currency: { MintAddress: { is: "token Mint Address" } }
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

## OHLCV for specific LetsBonk.fun Token on Raydium Launchlab

[This](https://ide.bitquery.io/ohlc-for-letsbonkfun-token) API end point returns the OHLCV vlaues for a LetsBonk.fun token with the currency `mint address` as `token mint address` when traded against WSOL.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: { ProtocolName: { is: "raydium_launchpad" } }
          Currency: { MintAddress: { is: "token Mint Address" } }
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

## Get Pair Address for a LetsBonk.fun Token

[This](https://ide.bitquery.io/pool-address-for-letsbonkfun-token_1) query returns the pair address for the LetsBonk.fun token with `mint address` as `token Mint Address` on the LaunchPad exchange. The liquidity pool address is denoted by `MarketAddress`.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: { ProtocolName: { is: "raydium_launchpad" } }
          Currency: { MintAddress: { is: "token Mint Address" } }
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

## Get Liquidity for a LetsBonk.fun Token Pair Address

Using [this](https://ide.bitquery.io/liquidity-for-a-Letsbonkfun-token-pair_2) query we can get the liquidity for a LaunchPad Token Pair, where `Base_PostBalance` is the amount of LaunchPad tokens present in the pool and `Quote_PostBalance` is the amount of WSOL present in the pool. For the purpose of filtering we are applying the condition that the `MarketAddress` is `insert pool address`.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Solana {
    DEXPools(
      where: {
        Pool: { Market: { MarketAddress: { is: "token pool address" } } }
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

### Video Tutorial | How to get Bonding Curve Progress of any LetsBonk.fun Token

<VideoPlayer url="https://www.youtube.com/watch?v=fCA5Pts4LbE" />

### Video Tutorial | How to track LetsBonk.fun Token Migrations to Raydium in realtime

<VideoPlayer url="https://www.youtube.com/watch?v=t_gYK89kQzI" />

### Video Tutorial | How to get Top 100 About to Graduate LetsBonk.fun tokens

<VideoPlayer url="https://www.youtube.com/watch?v=g3SVPcbUxX0" />
