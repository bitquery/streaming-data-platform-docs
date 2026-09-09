---
title: "Solana Xstocks API"
description: "Solana Xstocks API: query and stream Solana on-chain data with Bitquery GraphQL examples for developers. Works with WebSocket live subscriptions."
---
# xStocks API

:::tip These examples use the Trading API
The queries on this page use the [**Trading cube**](/docs/trading/trading-data-overview) — [`Trading.Trades`](/docs/trading/crypto-trades-api/trades-api) gives you clean, MEV-filtered xStocks swaps with **USD price, market cap, and supply on every row** across **9 chains in one API**, and [`Trading.Tokens`](/docs/trading/crypto-price-api/tokens) / [`Trading.Pairs`](/docs/trading/crypto-price-api/pairs) give you ready-made OHLC candles. `Trading.Trades` covers **real-time and roughly the last 30 days**; for xStocks history older than that, drop down to the chain-level [`DEXTradeByTokens`](/docs/cubes/dextradesbyTokens) cube.
:::

:::note Some tickers only trade via RFQ
Several tokenized equities settle through Jupiter's RFQ order engine rather than a pool, which means they have no DEX trades at all and no price here. The [Solana RFQ API](/docs/blockchain/Solana/solana-rfq-api/) shows how to read their executed prices from the `fill` instruction.
:::

import VideoPlayer from "../../../src/components/videoplayer.js";

## Tesla xStock Trades in Real-Time

Below subscription gives you realtime trades of Tesla xStock (TESLAx). The token is selected with `Pair.Token.Id`, which on Solana takes the form `bid:solana:<mint>`.

[Run in IDE ➤](https://ide.bitquery.io/Tesla-stock-trades-stream)

```graphql
subscription LatestTrades {
  Trading {
    Trades(
      where: {
        Pair: {
          Market: { Network: { is: "Solana" } }
          Token: {
            Id: { is: "bid:solana:XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB" }
          }
        }
      }
    ) {
      Block {
        Time
      }
      TransactionHeader {
        Hash
      }
      Side
      Price
      PriceInUsd
      Amounts {
        Base
        Quote
      }
      AmountsInUsd {
        Base
        Quote
      }
      Trader {
        Address
      }
      Supply {
        CirculatingSupply
        TotalSupply
        MarketCap
        FullyDilutedValuationUsd
      }
      Pair {
        Pool {
          Address
        }
        Market {
          Address
          Program
          Protocol
          Network
        }
        Token {
          Address
          Id
          Symbol
          Name
        }
        QuoteToken {
          Address
          Id
          Symbol
          Name
        }
      }
    }
  }
}
```

## Latest Price of the Apple xstock

You can use the following query to get the latest price of Apple xStock (AAPLx) on Solana. We are using `Ranking_Position` filter set to one to ensure that the latest price comes from the pair providing the most liquidity, hence the price is normalised. If you need the latest price regardless of that, then the filter could be removed.

[Run in IDE ➤](https://ide.bitquery.io/Apple-xStock-latest-price)

```graphql
{
  Trading {
    Trades(
      where: {Pair: {Token: {Address: {is: "XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp"}, Network: {is: "Solana"}}}, Ranking: {Position: {eq: 1}}}
      limit: {count: 1}
      orderBy: {descending: Block_Time}
    ) {
      Block {
        Time
      }
      Price
      PriceInUsd
      Pair {
        QuoteToken {
          Address
          Name
          Symbol
        }
      }
    }
  }
}
```

## Stream Real Time Price and Marketcap of Apple xstock

Change the query above into a subscription to receive every new Apple xStock print as it is confirmed on-chain. By adding the Supply_MarketCap, you can also see the Market cap of the token in real time.

[Run in IDE ➤](https://ide.bitquery.io/Apple-xStock-price-and-market-cap-stream)

```graphql
subscription {
  Trading {
    Trades(
      where: {Pair: {Token: {Address: {is: "XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp"}, Network: {is: "Solana"}}}, Ranking: {Position: {eq: 1}}}
    ) {
      Block {
        Time
      }
      Price
      PriceInUsd
      Pair {
        QuoteToken {
          Address
          Name
          Symbol
        }
      }
      Supply{
        MarketCap
      }
    }
  }
}
```

## Tesla xStock OHLC API

The Trading API publishes ready-made candles, so you no longer need to aggregate raw trades yourself. The query below returns the last 10 one-minute candles for Tesla xStock on its top-ranked market. Change `Interval.Time.Duration` to get another timeframe (`60` = 1 minute, `300` = 5 minutes, `3600` = 1 hour).

[Run in IDE ➤](https://ide.bitquery.io/Tslax-OHLCV)

```graphql
{
  Trading {
    Pairs(
      where: {
        Token: {
          Address: { is: "XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB" }
          Network: { is: "Solana" }
        }
        Ranking: { Position: { eq: 1 } }
        Interval: { Time: { Duration: { eq: 60 } } }
        Price: { IsQuotedInUsd: true }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Token {
        Symbol
        Address
      }
      QuoteToken {
        Symbol
        Address
      }
      Market {
        Protocol
        Address
        Network
      }
      Interval {
        Time {
          Start
          Duration
          End
        }
      }
      Price {
        IsQuotedInUsd
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
      Block {
        Time
      }
    }
  }
}
```

For candles blended across every market the token trades on, use the [`Tokens`](/docs/trading/crypto-price-api/tokens) cube with the same `Interval` filter instead of `Pairs`.

## Get the Top Traders of the Apple xStock

The below query gets the Top Traders of the Apple xStock `XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp`, ranked by USD volume over the last 24 hours. Keep in mind you can use this API only as a query and not a subscription websocket, because aggregates don't work with subscriptions and you will end up getting wrong results.

[Run in IDE ➤](https://ide.bitquery.io/Top-traders-of-Apple-on-xStocks)

```graphql
query TopTraders($token: String) {
  Trading {
    Trades(
      limit: { count: 100 }
      orderBy: { descendingByField: "volume" }
      where: {
        Block: { Time: { since_relative: { hours_ago: 24 } } }
        Pair: {
          Market: { Network: { is: "Solana" } }
          Token: { Id: { is: $token } }
        }
      }
    ) {
      Trader {
        Address
      }
      Pair {
        Token {
          Symbol
          Name
          Address
        }
      }
      trades: count
      volume: sum(of: AmountsInUsd_Quote)
      buyVolume: sum(of: AmountsInUsd_Quote, if: { Side: { is: "Buy" } })
      sellVolume: sum(of: AmountsInUsd_Quote, if: { Side: { is: "Sell" } })
    }
  }
}
```

```json
{
  "token": "bid:solana:XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp"
}
```

`AmountsInUsd.Quote` is the sound USD leg — see [Use `AmountsInUsd.Quote` for USD](/docs/trading/crypto-trades-api/trades-api) for why you should not aggregate on `.Base`.

## Get trading volume, buy volume, sell volume of the Meta xStock

This query fetches you the traded volume, buy volume and sell volume of Meta xStock `Xsa62P5mvPszXL1krVUnU5ar38bBSVcWAB6fmPCo5Zu` over the last 24 hours, broken out per market.

[Run in IDE ➤](https://ide.bitquery.io/trading-volume-buy-volume-sell-volume-of-the-Meta-xStock-per-pool)

```graphql
query MyQuery {
  Trading {
    Trades(
      limit: { count: 100 }
      orderBy: { descendingByField: "traded_volume_USD" }
      where: {
        Block: { Time: { since_relative: { hours_ago: 24 } } }
        Pair: {
          Market: { Network: { is: "Solana" } }
          Token: {
            Id: { is: "bid:solana:Xsa62P5mvPszXL1krVUnU5ar38bBSVcWAB6fmPCo5Zu" }
          }
        }
      }
    ) {
      Pair {
        Market {
          Protocol
          Address
        }
        Token {
          Name
          Symbol
          Address
        }
        QuoteToken {
          Name
          Symbol
          Address
        }
      }
      trades: count
      traded_volume_USD: sum(of: AmountsInUsd_Quote)
      traded_volume: sum(of: Amounts_Base)
      buy_volume: sum(of: Amounts_Base, if: { Side: { is: "Buy" } })
      sell_volume: sum(of: Amounts_Base, if: { Side: { is: "Sell" } })
    }
  }
}
```

## Video Tutorial | How to Monitor Tokenized Stocks (Tesla, Apple, Meta, etc) on Solana 

<VideoPlayer url="https://www.youtube.com/watch?v=ypJY7OWuoi4" />
