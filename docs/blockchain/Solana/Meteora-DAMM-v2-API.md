# Meteora API - DAMM v2

import VideoPlayer from "../../../src/components/videoplayer.js";

<head>
  <meta name="title" content="Meteora API - DAMM v2 - Solana - Real-time Pools, Trades, Prices, OHLC" />
  <meta name="description" content="Access real-time and historical data for Meteora DAMM v2 on Solana using our GraphQL API. Track pools, DEX trades, token prices, OHLC, and top traders." />
  <meta name="keywords" content="Meteora API DAMM v2,Solana DEX,Meteora API,Solana on-chain API,real-time Solana trades,Meteora pool data,Solana token prices,OHLC data Solana,DEX trading API,crypto trading API,web3 Solana API,Bitquery GraphQL,Meteora v2 API,Solana blockchain data" />
  <meta name="robots" content="index, follow" />
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="language" content="English" />

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Meteora API - DAMM v2 - Solana - Real-time Pools, Trades, Prices, OHLC"
/>
<meta property="og:description" content="Explore real-time DEX trades, latest pool creations, token prices, OHLC, and volume insights on Meteora - DAMM v2 using our Solana API." />

  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:title" content="Meteora API DAMM v2 - Solana - Real-time Pools, Trades, Prices, OHLC" />
  <meta property="twitter:description" content="Get rich on-chain insights into Meteora DAMM v2 pools, trades, and tokens with our real-time Solana API." />
</head>

## Track Latest created pools on Meteora DAMM v2

Below query will give you the latest created Meteora DAMM v2 pools in realtime. You can test the query [here](https://ide.bitquery.io/Track-Latest-created-pools-on-Meteora-DAMM-v2)

```
subscription MyQuery {
  Solana {
    Instructions(
      where: {Transaction: {Result: {Success: true}}, Instruction: {Program: {Method: {is: "EvtInitializePool"}, Address: {is: "cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG"}}}}
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

## Meteora DAMM v2 Trades in Real-Time

The below query gets real-time information whenever there's a new trade on the Meteora DAMM v2 DEX including detailed information about the trade, including the buy and sell details, the block information, and the transaction specifics.
You can run the query [here](https://ide.bitquery.io/Real-time-trades-on-MeteoraDAMMv2-DEX-on-Solana)

```graphql
subscription {
  Solana {
    DEXTrades(
      where: {
        Trade: {
          Dex: {
            ProgramAddress: {
              is: "cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG"
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

## Latest Price of a Token on Meteora DAMM v2

You can use the following query to get the latest price of a token on Meteora DAMM v2 on Solana.

You can run this query using this [link](https://ide.bitquery.io/latest-price-of-a-token-on-Damm-v2).

```
{
  Solana {
    DEXTradeByTokens(
      limit: {count: 1}
      orderBy: {descending: Block_Time}
      where: {Trade: {Dex: {ProgramAddress: {is: "cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG"}}, Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}}}
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

## Realtime Price feed of a Token on Meteora DAMM v2

You can use the following query to get the latest price of a token on Meteora DAMM v2 on Solana.

You can run this query using this [link](https://ide.bitquery.io/Realtime-Price-feed-of-a-Token-on-Meteora-DAMM-v2).

```
subscription{
  Solana {
    DEXTradeByTokens(
      where: {Trade: {Dex: {ProgramAddress: {is: "cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG"}}, Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}}}
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

## Meteora DAMM v2 OHLC API

If you want to get OHLC data for any specific currency pair on Meteora DAMM v2, you can use this api. Only use [this API](https://ide.bitquery.io/Meteora-DAMM-v2-OHLC-API) as query and not subscription websocket as Aggregates and Time Intervals don't work well with subscriptions.

```
{
  Solana {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Block_Timefield"}
      where: {Trade: {Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}, Dex: {ProgramAddress: {is: "cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG"}}, PriceAsymmetry: {lt: 0.1}}}
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

## Get the Top Traders of a specific Token on Meteora DAMM v2 DEX

The below query gets the Top Traders of the specified Token `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` on Meteora DAMM v2. Keep in mind you can use this API only as a query and not a subscription websocket because aggregates don't work with subscription and you will end up getting wrong results. You can run the query [here](https://ide.bitquery.io/Get-the-Top-Traders-of-a-specific-Token-on-Meteora-DAMM-v2-DEX_1)

```
query TopTraders($token: String) {
  Solana {
    DEXTradeByTokens(
      orderBy: {descendingByField: "volumeUsd"}
      limit: {count: 100}
      where: {Trade: {Currency: {MintAddress: {is: $token}}, Dex: {ProgramAddress: {is: "cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG"}}}, Transaction: {Result: {Success: true}}}
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

This query fetches you the traded volume, buy volume and sell volume of a token `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`. Try out the API [here](https://ide.bitquery.io/Get-trading-volume-buy-volume-sell-volume-of-a-token_2).

```
query MyQuery {
  Solana(dataset: combined) {
    DEXTradeByTokens(
      where: {Block: {Time: {since: "2025-03-10T07:00:00Z"}}, Transaction: {Result: {Success: true}}, Trade: {Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}, Dex: {ProgramAddress: {is: "cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG"}}}}
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
