# GoonFi API

import VideoPlayer from "../../../src/components/videoplayer.js";

<head>
  <meta name="title" content="GoonFi API - Solana - Real-time Pools, Trades, Prices, OHLC" />
  <meta name="description" content="Access real-time and historical data for GoonFi on Solana using our GraphQL API. Track pools, DEX trades, token prices, OHLC, and top traders." />
  <meta name="keywords" content="GoonFi,Solana DEX,GoonFi API,Solana on-chain API,real-time Solana trades,GoonFi pool data,GoonFi token prices,GoonFi OHLC data Solana,DEX trading API,crypto trading API,web3 Solana API,Bitquery GraphQL,GoonFi v2 API,Solana blockchain data" />
  <meta name="robots" content="index, follow" />
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="language" content="English" />

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="GoonFi API - Solana - Real-time Pools, Trades, Prices, OHLC"
/>
<meta property="og:description" content="Explore real-time DEX trades, latest pool creations, token prices, OHLC, and volume insights on GoonFi using our Solana API." />

  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:title" content="GoonFi API - Solana - Real-time Pools, Trades, Prices, OHLC" />
  <meta property="twitter:description" content="Get rich on-chain insights into GoonFi pools, trades, and tokens with our real-time Solana API." />
</head>

## GoonFi Trades in Real-Time

The below query gets real-time information whenever there's a new trade on the GoonFi DEX including detailed information about the trade, including the buy and sell details, the block information, and the transaction specifics.
You can run the query [here](https://ide.bitquery.io/Real-time-trades-on-goonfi-DEX-on-Solana)

```graphql
subscription {
  Solana {
    DEXTrades(
      where: {
        Trade: {
          Dex: {
            ProgramAddress: {
              is: "goonERTdGsjnkZqWuVjs73BZ3Pb9qoCUdBUL17BnS5j"
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

## Latest Price of a Token on GoonFi

You can use the following query to get the latest price of a token on GoonFi on Solana.

You can run this query using this [link](https://ide.bitquery.io/latest-price-of-a-token-on-GoonFi).

```
{
  Solana {
    DEXTradeByTokens(
      limit: {count: 1}
      orderBy: {descending: Block_Time}
      where: {Trade: {Dex: {ProgramAddress: {is: "goonERTdGsjnkZqWuVjs73BZ3Pb9qoCUdBUL17BnS5j"}}, Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}}}
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

## Realtime Price feed of a Token on GoonFi

You can use the following query to get the latest price of a token on GoonFi on Solana.

You can run this query using this [link](https://ide.bitquery.io/Realtime-Price-feed-of-a-Token-on-GoonFi).

```
subscription{
  Solana {
    DEXTradeByTokens(
      where: {Trade: {Dex: {ProgramAddress: {is: "goonERTdGsjnkZqWuVjs73BZ3Pb9qoCUdBUL17BnS5j"}}, Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}}}
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

## GoonFi OHLC API - query

If you want to get OHLC data for any specific currency pair on GoonFi, you can use this api. Only use [this API](https://ide.bitquery.io/GoonFi-OHLC-API) as query and not subscription websocket as Aggregates and Time Intervals don't work well with subscriptions.

```
{
  Solana {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Block_Timefield"}
      where: {Trade: {Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}, Dex: {ProgramAddress: {is: "goonERTdGsjnkZqWuVjs73BZ3Pb9qoCUdBUL17BnS5j"}}, PriceAsymmetry: {lt: 0.1}}}
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

## GoonFi Realtime OHLC, Price, Volume API - Crypto Price API

Below API will give you realtime prices, OHLC, and volume data for all GoonFi trading pairs. We have selected `1` sec as the interval for the OHLC, volume or moving average calculation. You can select any other interval as well like 5 sec, 30 sec, 60 sec, 3600 sec, etc.
Try the API [here](https://ide.bitquery.io/GoonFi-Realtime-OHLC-Price-Volume-API---Crypto-Price-API).

```
subscription MyQuery {
  Trading {
    Pairs(
      where: {Market: {Name: {is: "GoonFi"}, Network: {is: "Solana"}}, Interval: {Time: {Duration: {eq: 1}}}}
    ) {
      Interval {
        Time {
          Duration
          Start
          End
        }
      }
      Market {
        Name
        Address
        Program
      }
      Token {
        Name
        Symbol
        Address
      }
      Price {
        Average {
          Estimate
          ExponentialMoving
          Mean
          SimpleMoving
          WeightedSimpleMoving
        }
        Ohlc {
          Open
          High
          Low
          Close
        }
      }
      Volume {
        Base
        Quote
        Usd
      }
      QuoteToken {
        Name
        Symbol
        Address
      }
    }
  }
}
```

## Get the Top Traders of a specific Token on GoonFi DEX

The below query gets the Top Traders of the specified Token `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` on GoonFi. Keep in mind you can use this API only as a query and not a subscription websocket because aggregates don't work with subscription and you will end up getting wrong results. You can run the query [here](https://ide.bitquery.io/Get-the-Top-Traders-of-a-specific-Token-on-GoonFi-DEX)

```
query TopTraders($token: String) {
  Solana {
    DEXTradeByTokens(
      orderBy: {descendingByField: "volumeUsd"}
      limit: {count: 100}
      where: {Trade: {Currency: {MintAddress: {is: $token}}, Dex: {ProgramAddress: {is: "goonERTdGsjnkZqWuVjs73BZ3Pb9qoCUdBUL17BnS5j"}}}, Transaction: {Result: {Success: true}}}
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

## Get trading volume, buy volume, sell volume of a token on GoonFi

This query fetches you the traded volume, buy volume and sell volume of a token `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`. Try out the API [here](hhttps://ide.bitquery.io/Get-trading-volume-buy-volume-sell-volume-of-a-token-on-GoonFi-DEX).

```
query MyQuery {
  Solana(dataset: combined) {
    DEXTradeByTokens(
      where: {Block: {Time: {since: "2025-03-10T07:00:00Z"}}, Transaction: {Result: {Success: true}}, Trade: {Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}, Dex: {ProgramAddress: {is: "goonERTdGsjnkZqWuVjs73BZ3Pb9qoCUdBUL17BnS5j"}}}}
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
