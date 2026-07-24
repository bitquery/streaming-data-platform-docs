---
title: "Solana Meteora Dyn API"
description: "Solana Meteora Dyn API: real-time Solana memecoin and DEX data via Bitquery GraphQL APIs and Kafka streams. Keep queries fast with indexed filters."
---
# Meteora API - DYN

:::tip Need real-time Meteora DYN data or anything from the last ~30 days?
For **real-time + last ~30 days**, use the [**Trading cube**](/docs/trading/trading-data-overview) — [`Trading.Trades`](/docs/trading/crypto-trades-api/trades-api) gives you clean, MEV-filtered Meteora DYN swaps with **USD price, market cap, and supply on every row** across **9 chains in one API**. Use this page when you need **historical Meteora DYN data older than ~30 days**, raw per-swap detail, or call / event context.
:::

import VideoPlayer from "../../../src/components/videoplayer.js";

## Track Latest created pools on Meteora DYN

Below query will give you the latest created Meteora DYN pools in realtime. You can test the query [here](https://ide.bitquery.io/Track-Latest-created-pools-on-MeteoraDYN)

```graphql
subscription MyQuery {
  Solana {
    Instructions(
      where: {Transaction: {Result: {Success: true}}, Instruction: {Program: {Method: {is: "initializePermissionlessConstantProductPoolWithConfig2"}, Address: {is: "Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB"}}}}
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

## Meteora DYN Trades in Real-Time

The below query gets real-time information whenever there's a new trade on the Meteora DYN DEX including detailed information about the trade, including the buy and sell details, the block information, and the transaction specifics.
You can run the query [here](https://ide.bitquery.io/Real-time-trades-on-MeteoraDYN-DEX-on-Solana#)

```graphql
subscription {
  Solana {
    DEXTrades(
      where: {
        Trade: {
          Dex: {
            ProgramAddress: {
              is: "Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB"
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

## Latest Price of a Token on Meteora DYN

You can use the following query to get the latest price of a token on Meteora DYN on Solana.

You can run this query using this [link](https://ide.bitquery.io/latest-price-of-a-token-on-DYN#).

```graphql
{
  Solana {
    DEXTradeByTokens(
      limit: {count: 1}
      orderBy: {descending: Block_Time}
      where: {Trade: {Dex: {ProgramAddress: {is: "Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB"}}, Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}}}
    ) {
      Block {
        Time
      }
      Trade {
        Price
        PriceInUSD
      }
    }
  }
}
```

## Realtime Price feed of a Token on Meteora DYN

You can use the following query to get the latest price of a token on Meteora DYN on Solana.

You can run this query using this [link](https://ide.bitquery.io/Realtime-Price-feed-of-a-Token-on-Meteora-DYN#).

```graphql
subscription{
  Solana {
    DEXTradeByTokens(
      where: {Trade: {Dex: {ProgramAddress: {is: "Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB"}}, Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}}}
    ) {
      Block {
        Time
      }
      Trade {
        Price
        PriceInUSD
      }
    }
  }
}
```

## Meteora DYN OHLC API

If you want to get OHLC data for any specific currency pair on Meteora DYN, you can use this api. Only use [this API](https://ide.bitquery.io/Meteora-DYN-OHLC-API#) as query and not subscription websocket as Aggregates and Time Intervals don't work well with subscriptions.

```graphql
{
  Solana {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Block_Timefield"}
      where: {Trade: {Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}, Dex: {ProgramAddress: {is: "Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB"}}, PriceAsymmetry: {lt: 0.1}}}
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

## Get the Top Traders of a specific Token on Meteora DYN DEX

The below query gets the Top Traders of the specified Token `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` on Meteora DYN. Keep in mind you can use this API only as a query and not a subscription websocket because aggregates don't work with subscription and you will end up getting wrong results. You can run the query [here](https://ide.bitquery.io/Get-the-Top-Traders-of-a-specific-Token-on-Meteora-DYN-DEX#)

```graphql
query TopTraders($token: String) {
  Solana {
    DEXTradeByTokens(
      orderBy: {descendingByField: "volumeUsd"}
      limit: {count: 100}
      where: {Trade: {Currency: {MintAddress: {is: $token}}, Dex: {ProgramAddress: {is: "Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB"}}}, Transaction: {Result: {Success: true}}}
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
{
  "token": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
}
```

## Get trading volume, buy volume, sell volume of a token

This query fetches you the traded volume, buy volume and sell volume of a token `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`. Try out the API [here](https://ide.bitquery.io/Get-trading-volume-buy-volume-sell-volume-of-a-token_4#).

```graphql
query MyQuery {
  Solana(dataset: combined) {
    DEXTradeByTokens(
      where: {Block: {Time: {since: "2025-03-10T07:00:00Z"}}, Transaction: {Result: {Success: true}}, Trade: {Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}, Dex: {ProgramAddress: {is: "Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB"}}}}
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
