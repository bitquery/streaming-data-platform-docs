# AldrinAmm DEX API

import VideoPlayer from "../../../src/components/videoplayer.js";

## AldrinAmm Trades in Real-Time

The below query gets real-time information whenever there's a new trade on the AldrinAmm DEX including detailed information about the trade, including the buy and sell details, the block information, and the transaction specifics.
You can run the query [here](https://ide.bitquery.io/Real-time-trades-on-AldrinAmm-DEX-on-Solana_4)

```graphql
subscription {
  Solana {
    DEXTrades(
      where: { Trade: { Dex: { ProtocolFamily: { is: "AldrinAmm" } } } }
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

## Latest Price of a Token on AldrinAmm

You can use the following query to get the latest price of a token on AldrinAmm on Solana.

You can run this query using this [link](https://ide.bitquery.io/live-price-of-token-on-aldrinAmm).

```
{
  Solana {
    DEXTradeByTokens(
      limit: {count: 1}
      orderBy: {descending: Block_Time}
      where: {Trade: {Dex: {ProtocolFamily: {is: "AldrinAmm"}}, Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}}}
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

## AldrinAmm OHLC API

If you want to get OHLC data for any specific currency pair on AldrinAmm, you can use this api. Only use [this API](https://ide.bitquery.io/AldrinAmm-OHLC-for-specific-pair) as query and not subscription websocket as Aggregates and Time Intervals don't work well with subscriptions.

```
{
  Solana {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Block_Timefield"}
      where: {Trade: {Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}, Dex: {ProtocolFamily: {is: "AldrinAmm"}}, PriceAsymmetry: {lt: 0.1}}}
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

## Get the Top Traders of a specific Token on AldrinAmm DEX

The below query gets the Top Traders of the specified Token `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` on AldrinAmm. Keep in mind you can use this API only as a query and not a subscription websocket because aggregates don't work with subscription and you will end up getting wrong results. You can run the query [here](https://ide.bitquery.io/top-traders-of-a-token-on-aldrinAmm)

```
query TopTraders($token: String) {
  Solana {
    DEXTradeByTokens(
      orderBy: {descendingByField: "volumeUsd"}
      limit: {count: 100}
      where: {Trade: {Currency: {MintAddress: {is: $token}}, Dex: {ProtocolFamily: {is: "AldrinAmm"}}}, Transaction: {Result: {Success: true}}}
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
  "token": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
}
```

## Get trading volume, buy volume, sell volume of a token

This query fetches you the traded volume, buy volume and sell volume of a token `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` on AldrinAmm DEX. Try out the API [here](https://ide.bitquery.io/trade_volume_aldrinAmm).

```
query MyQuery {
  Solana(dataset: combined) {
    DEXTradeByTokens(
      where: {Block: {Time: {since: "2025-03-10T07:00:00Z"}}, Transaction: {Result: {Success: true}}, Trade: {Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}, Dex: {ProtocolFamily: {is: "AldrinAmm"}}}}
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

## Volatility of a Pair on AldrinAmm

Volatility is an important factor in trading world as it determines the fluctuation in price that implies the possibility of profit and risk of loss. Lesser volatility denotes that the pair is stable.

[Here](https://ide.bitquery.io/Volatility-of-WSOL-USDC-Pair-on-AldrinAmm-Dex-on-Solana_1) is the query to get the volatility for a selected pair in the last 24 hours.

```graphql
query Volatilityon {
  Solana {
    DEXTrades(
      where: {
        Trade: {
          Dex: { ProtocolFamily: { is: "AldrinAmm" } }
          Buy: {
            Currency: {
              MintAddress: { is: "So11111111111111111111111111111111111111112" }
            }
          }
          Sell: {
            Currency: {
              MintAddress: {
                is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
              }
            }
          }
        }
        Block: { Time: { after: "2025-03-18T00:00:00Z" } }
      }
    ) {
      volatility: standard_deviation(of: Trade_Buy_Price)
    }
  }
}
```
