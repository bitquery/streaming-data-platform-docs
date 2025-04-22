# Raydium Launchpad API

In this section we see how to get data on Launchpad by Raydium. This includes token creation, latest trades by trader, for a token etc.

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

We will use the `PoolCreateEvent` method to filter latest pools on Launchpad. The `Argument` filed includes more information about the pool like `base_mint_param`( token details), `curve_param`( bonding curve details) and `vesting_param` ( cliff period, amount locked etc).

You can run the query [here](https://ide.bitquery.io/Launchpad-latest-pool-created)

```

{
  Solana(network: solana, dataset: realtime) {
    Instructions(
      where: {Instruction: {Program: {Address: {is: "LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj"}, Method: {is: "PoolCreateEvent"}}}}
      orderBy: {descending: Block_Time}
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

## Latest Trades on Launchpad

This query fetches the most recent trades on the Raydium Launchpad.
You can run the query [here](https://ide.bitquery.io/Latest-Trades-on-Launchpad)

```
query LatestTrades {
  Solana {
    DEXTradeByTokens(
      orderBy: {descending: Block_Time}
      limit: {count: 50}
      where: {Trade: {Dex: {ProtocolName: {is: "raydium_launchpad"}}}}
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

Similarly, you can subscribe to trades on launchpad in real-time using [subscription query](https://ide.bitquery.io/Subscribe-to-Trades-on-Launchpad). The same can be tracked using [Bitquery Kafka Streams](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/)

## Latest Price of a Token on Launchpad

This query provides the most recent price data for a specific token launched on Raydium Launchpad. You can filter by the token’s `MintAddress`, and the query will return the last recorded trade price.
You can run the query [here](https://ide.bitquery.io/Latest-Price-of-a-Token-on-Launchpad)

```
{
  Solana {
    DEXTradeByTokens(
      orderBy: {descending: Block_Time}
      limit: {count: 1}
      where: {Trade: {Dex: {ProtocolName: {is: "raydium_launchpad"}}, Currency: {MintAddress: {is: "5SA3y1LSB55D36G6BYXwqpEXZferX5zosSdQuky7aray"}}}}
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

## Top Tokens on Launchpad

Get stats on top tokens that are trading on Launchpad. We use `any`( OR condition) and `notIn` to exclude trades involving WSOL, USDC, and USDT. These tokens are excluded to focus on new tokens, especially in markets like Raydium Launchpad where new projects launch.
You can run the query [here](https://ide.bitquery.io/Top-Token-Stats-on-Launchpad)

```
{
  Solana {
    DEXTradeByTokens(
      where: {Transaction: {Result: {Success: true}}, Block: {Time: {after: "2025-04-22T01:48:43Z"}}, any: [{Trade: {Currency: {MintAddress: {notIn: ["EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"]}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}}}, {Trade: {Currency: {MintAddress: {not: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}, Side: {Currency: {MintAddress: {is: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"}}}}}, {Trade: {Side: {Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}}}}, {Trade: {Currency: {MintAddress: {notIn: ["So11111111111111111111111111111111111111112", "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"]}}, Side: {Currency: {MintAddress: {notIn: ["So11111111111111111111111111111111111111112", "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"]}}}}}], Trade: {Dex: {ProtocolName: {is: "raydium_launchpad"}}}}
      orderBy: {descendingByField: "usd"}
      limit: {count: 100}
    ) {
      Trade {
        Currency {
          Symbol
          Name
          MintAddress
        }
        Side {
          Currency {
            Symbol
            Name
            MintAddress
          }
        }
        price_last: PriceInUSD(maximum: Block_Slot)
        price_10min_ago: PriceInUSD(
          maximum: Block_Slot
          if: {Block: {Time: {before: "2025-04-22T09:38:43Z"}}}
        )
        price_1h_ago: PriceInUSD(
          maximum: Block_Slot
          if: {Block: {Time: {before: "2025-04-22T08:48:43Z"}}}
        )
        price_3h_ago: PriceInUSD(
          maximum: Block_Slot
          if: {Block: {Time: {before: "2025-04-22T06:48:43Z"}}}
        )
      }
      dexes: uniq(of: Trade_Dex_ProgramAddress)
      amount: sum(of: Trade_Side_Amount)
      usd: sum(of: Trade_Side_AmountInUSD)
      traders: uniq(of: Trade_Account_Owner)
      count(selectWhere: {ge: "100"})
    }
  }
}

```
