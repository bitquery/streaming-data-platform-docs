# LetsBonk.fun API

import VideoPlayer from "../../../src/components/videoplayer.js";

In this document, we will explore several examples related to LetsBonk.fun.
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
  <meta name="description" content="Get on-chain data of any LetsBonk.fun based token through our LetsBonk.fun API."/>
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
  content="Get on-chain data of any LetsBonk.fun based token through our LetsBonk.fun API."
/>

  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="LetsBonk.Fun API - Solana - Tokens, Trades, Live Prices"/>
  <meta property="twitter:description" content="Get on-chain data of any LetsBonk.fun based token through our LetsBonk.fun API."/>
</head>

If you want fastest data without any latency, we can provide Kafka streams, please [fill this form](https://bitquery.io/forms/api) for it. Our Team will reach out.

## Track LetsBonk.fun Token Creation

Using [this](https://ide.bitquery.io/Launchpad-latest-pool-created) query, we can get the most recently created LetsBonk.fun tokens.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Solana(network: solana, dataset: realtime) {
    Instructions(
      where: {
        Instruction: {
          Program: {
            Address: { is: "LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj" }
            Method: { is: "PoolCreateEvent" }
          }
        }
      }
      orderBy: { descending: Block_Time }
    ) {
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

This query fetches the most recent trades of a LetsBonk.fun Token `6dCG3QhvCrJ2rJPY41s8UjTVFTWhyEnFJkDSkmBrbonk` on the Raydium Launchpad.
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
          Currency: {
            MintAddress: { is: "6dCG3QhvCrJ2rJPY41s8UjTVFTWhyEnFJkDSkmBrbonk" }
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

This query provides the most recent price data for a specific LetsBonk.fun token `6dCG3QhvCrJ2rJPY41s8UjTVFTWhyEnFJkDSkmBrbonk` launched on Raydium Launchpad. You can filter by the token’s `MintAddress`, and the query will return the last recorded trade price.
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
          Currency: {
            MintAddress: { is: "6dCG3QhvCrJ2rJPY41s8UjTVFTWhyEnFJkDSkmBrbonk" }
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

[This](https://ide.bitquery.io/top-buyers-of-a-letsbonkfun-token-on-launchpad) API endpoint returns the top 100 buyers for a token, which is `6dCG3QhvCrJ2rJPY41s8UjTVFTWhyEnFJkDSkmBrbonk` in this case.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: { ProtocolName: { is: "raydium_launchpad" } }
          Currency: {
            MintAddress: { is: "6dCG3QhvCrJ2rJPY41s8UjTVFTWhyEnFJkDSkmBrbonk" }
          }
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

Using [this](https://ide.bitquery.io/top-sellers-of-a-letsbonkfun-token-on-launchpad_1) query top 100 sellers for the token with `Mint Address` as `6dCG3QhvCrJ2rJPY41s8UjTVFTWhyEnFJkDSkmBrbonk` could be retrieved.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: { ProtocolName: { is: "raydium_launchpad" } }
          Currency: {
            MintAddress: { is: "6dCG3QhvCrJ2rJPY41s8UjTVFTWhyEnFJkDSkmBrbonk" }
          }
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

[This](https://ide.bitquery.io/ohlc-for-letsbonkfun-token) API end point returns the OHLCV vlaues for a LetsBonk.fun token with the currency `mint address` as `72j7mBkX54KNH7djeJ2mUz5L8VoDToPbSQTd24Sdhray` when traded against WSOL.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: { ProtocolName: { is: "raydium_launchpad" } }
          Currency: {
            MintAddress: { is: "6dCG3QhvCrJ2rJPY41s8UjTVFTWhyEnFJkDSkmBrbonk" }
          }
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

[This](https://ide.bitquery.io/pool-address-for-letsbonkfun-token_1) query returns the pair address for the LetsBonk.fun token with `mint address` as `6dCG3QhvCrJ2rJPY41s8UjTVFTWhyEnFJkDSkmBrbonk` on the LaunchPad exchange. The liquidity pool address is denoted by `MarketAddress`.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: { ProtocolName: { is: "raydium_launchpad" } }
          Currency: {
            MintAddress: { is: "6dCG3QhvCrJ2rJPY41s8UjTVFTWhyEnFJkDSkmBrbonk" }
          }
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

Using [this](https://ide.bitquery.io/liquidity-for-a-Letsbonkfun-token-pair_2) query we can get the liquidity for a LaunchPad Token Pair, where `Base_PostBalance` is the amount of LaunchPad tokens present in the pool and `Quote_PostBalance` is the amount of WSOL present in the pool. For the purpose of filtering we are applying the condition that the `MarketAddress` is `2NhS34gTq87kjXq1hikmEkwzbBFs5Er3gCAMjVGv1kS4`.

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
              is: "2NhS34gTq87kjXq1hikmEkwzbBFs5Er3gCAMjVGv1kS4"
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
