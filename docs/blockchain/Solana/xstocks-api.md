# xStocks API

import VideoPlayer from "../../../src/components/videoplayer.js";

<head>
  <meta name="title" content="xStocks API - Real-time Tesla, Apple, Meta, etc stocks Trades & Prices on Solana" />
  <meta name="description" content="Track real-time trades, live token prices, OHLC data, trading volumes, and top traders of Tesla, Apple, Meta, etc xStocks on Solana using Bitquery's powerful GraphQL API." />
  <meta name="keywords" content="xStocks API, Solana Stocks API, Solana xStock trades, Tesla xStock API, Apple xStock GraphQL, Meta xStock price, Bitquery Solana API, OHLC API xStocks, real-time tokenized stocks, Solana stock tokens, crypto stock trading API, Tesla Solana token, Apple on-chain token price" />
  <meta name="robots" content="index, follow" />
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="language" content="English" />

  <meta property="og:type" content="website" />
  <meta property="og:title" content="xStocks API - Real-time Tesla, Apple, Meta, etc stocks Trades & Prices on Solana" />
  <meta property="og:description" content="Use Bitquery's Solana API to monitor xStock trades and prices for Tesla, Apple, Meta, etc. Access OHLC, volumes, and top trader data with simple GraphQL queries." />

  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:title" content="xStocks API - Real-time Tesla, Apple, Meta, etc stocks Trades & Prices on Solana" />
  <meta property="twitter:description" content="Track live Solana xStock data (Tesla, Apple, Meta,etc) using Bitquery’s GraphQL APIs. Real-time prices, OHLC, and top trader insights for tokenized stocks." />
</head>

## Tesla xStock Trades in Real-Time

Below query will give you realtime trades of Tesla xStock (TESLAx).
You can run the query [here](https://ide.bitquery.io/Latest-Trades-of-TESLA-onchain-xStock_1)

```graphql
subscription LatestTrades {
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: {
            MintAddress: { is: "XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB" }
          }
        }
        Transaction: { Result: { Success: true } }
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

## Latest Price of xStocks using Crypto Price api

You can get latest price of xStocks tokens prices using our [Crypto price api](https://docs.bitquery.io/docs/trading/crypto-price-api/introduction/).

You can run the query [here](https://ide.bitquery.io/xStocks-prices)

```
subscription {
  Trading {
    Tokens(
      where: {Token: {Name: {includes: "xStock"}}, Interval: {Time: {Duration: {eq: 1}}}}
    ) {
      Token {
        Address
        Id
        IsNative
        Name
        Network
        Name
        Symbol
        TokenId
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
        Quote
        Usd
      }
      Price {
        IsQuotedInUsd
        Ohlc {
          Close
          High
          Low
          Open
        }
        Average {
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

## Latest Price of the Apple xstock

You can use the following query to get the latest price of a Apple xStock on Solana.

You can run this query using this [link](https://ide.bitquery.io/Get-Latest-Price-of-Apple-xStock-in--USD-Real-time).

```
query {
  Solana {
    DEXTradeByTokens(
      limit:{count:1}
      orderBy:{descending:Block_Time}
      where: {Trade: {Currency: {MintAddress: {is: "XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp"}}}}
    ) {
      Transaction {
        Signature
      }
      Trade {
        AmountInUSD
        Amount
        Currency {
          MintAddress
          Name
        }
        Dex {
          ProgramAddress
          ProtocolName
        }
        Price
        PriceInUSD
        Side {
          Account {
            Address
          }
          AmountInUSD
          Amount
          Currency {
            Name
            MintAddress
          }
        }
      }
    }
  }
}
```

## Realtime Price feed of Apple xstock

You can use the following query to get the latest price of a Apple xStock on Solana.

You can run this query using this [link](https://ide.bitquery.io/Get-realtime-Price-of-Apple-xStock-in--USD-Real-time).

```
subscription {
  Solana {
    DEXTradeByTokens(
      where: {Trade: {Currency: {MintAddress: {is: "XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp"}}}}
    ) {
      Transaction {
        Signature
      }
      Trade {
        AmountInUSD
        Amount
        Currency {
          MintAddress
          Name
        }
        Dex {
          ProgramAddress
          ProtocolName
        }
        Price
        PriceInUSD
        Side {
          Account {
            Address
          }
          AmountInUSD
          Amount
          Currency {
            Name
            MintAddress
          }
        }
      }
    }
  }
}
```

## Tesla xStock OHLC API

If you want to get OHLC data for any xStock, you can use this api. Only use [this API](https://ide.bitquery.io/Tesla-xStock-OHLC-for-specific-pair) as query and not subscription websocket as Aggregates and Time Intervals don't work well with subscriptions.

```
{
  Solana {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Block_Timefield"}
      where: {Trade: {Currency: {MintAddress: {is: "XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}, PriceAsymmetry: {lt: 0.1}}}
      limit: {count: 10}
    ) {
      Block {
        Timefield: Time(interval: {in: minutes, count: 1})
      }
      volume: sum(of: Trade_Side_AmountInUSD)
      Trade {
        high: PriceInUSD(maximum: Trade_Price)
        low: PriceInUSD(minimum: Trade_Price)
        open: PriceInUSD(minimum: Block_Slot)
        close: PriceInUSD(maximum: Block_Slot)
      }
      count
    }
  }
}
```

## Get the Top Traders of the Apple xStock

The below query gets the Top Traders of the Apple xStock `XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp`. Keep in mind you can use this API only as a query and not a subscription websocket because aggregates don't work with subscription and you will end up getting wrong results. You can run the query [here](https://ide.bitquery.io/Top-Traders-of-the-Apple-xStock_1)

```
query TopTraders($token: String) {
  Solana {
    DEXTradeByTokens(
      orderBy: {descendingByField: "volume"}
      limit: {count: 100}
      where: {Trade: {Currency: {MintAddress: {is: $token}}}, Transaction: {Result: {Success: true}}}
    ) {
      Trade {
        Account {
          Owner
        }
        Currency{
          Name
          Symbol
          MintAddress
        }
        Side {
          Account {
            Address
          }
          Type
        }
      }
      buyVolume: sum(of: Trade_Side_AmountInUSD, if: {Trade: {Side: {Type: {is: buy}}}})
      sellVolume: sum(of: Trade_Side_AmountInUSD, if: {Trade: {Side: {Type: {is: sell}}}})
      volume: sum(of: Trade_Side_AmountInUSD)
    }
  }
}
{
  "token": "XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp"
}
```

## Get trading volume, buy volume, sell volume of the Meta xStock

This query fetches you the traded volume, buy volume and sell volume of a Meta xStock `Xsa62P5mvPszXL1krVUnU5ar38bBSVcWAB6fmPCo5Zu`. Try out the API [here](https://ide.bitquery.io/trade_volume-META-xStock).

```
query MyQuery {
  Solana(dataset: combined) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "traded_volume"}
      where: {Block: {Time: {since: "2025-06-20T01:00:00Z"}}, Transaction: {Result: {Success: true}}, Trade: {Currency: {MintAddress: {is: "Xsa62P5mvPszXL1krVUnU5ar38bBSVcWAB6fmPCo5Zu"}}, Side: {Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}}}}
    ) {
      Trade {
        Currency {
          Name
          MintAddress
          Symbol
        }
        Side {
          Currency {
            Name
            Symbol
            MintAddress
          }
        }
      }
      traded_volume_USD: sum(of:Trade_Side_AmountInUSD)
      traded_volume: sum(of: Trade_Amount)
      buy_volume: sum(of: Trade_Amount, if: {Trade: {Side: {Type: {is: buy}}}})
      sell_volume: sum(of: Trade_Amount, if: {Trade: {Side: {Type: {is: sell}}}})
    }
  }
}
```
