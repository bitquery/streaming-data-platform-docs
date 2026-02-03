# Quick Start Examples

## Real-Time Token Prices in USD on Solana

Stream live OHLC (Open, High, Low, Close) price and volume data for all tokens on Solana, quoted directly in USD. Useful for dashboards, analytics, or bots that need stable fiat-based prices.

Here we have selected the filter `Price: {IsQuotedInUsd: true}`, this means that any price values such as OHLC or Average indicators will be in USD. If you want them denominated in quote currency, change the filter to `Price: {IsQuotedInUsd: false}`.

[Run Stream ➤](https://ide.bitquery.io/Real-Time-usd-price-on-solana-chain)

> Note: We include `Volume: { Usd: { gt: 5 } }` to further remove extreme outliers; the stream already pre-filters outliers—this is an additional check.

```
subscription {
  Trading {
    Pairs(
      where: {Interval: {Time: {Duration: {eq: 1}}}, Price: {IsQuotedInUsd: true}, Market: {Network: {is: "Solana"}}, Volume: {Usd: {gt: 5}}}
    ) {
      Token {
        Name
        Symbol
        Address
      }
      Market {
        Protocol
        Program
        Network
        Name
        Address
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
        Ohlc {
          Close
          High
          Low
          Open
        }
      }
    }
  }
}
```

## Real-Time Token Prices in Quote Pair (USDC, USDT, etc.)

Stream live OHLC prices for Solana tokens denominated in their trading pair token (e.g., USDC, USDT, or another crypto), instead of direct USD. Great for analyzing token behavior relative to stablecoins or other assets.

Here we have selected the filter `Price: {IsQuotedInUsd: false}`, this means that any price values such as OHLC or Average indicators will be in quote currency. If you want them denominated in USD, change the filter to `Price: {IsQuotedInUsd: true}`.

[Run Stream ➤](https://ide.bitquery.io/Real-Time-usd-price-on-solana-chain-in-paired-token)

> Note: We include `Volume: { Usd: { gt: 5 } }` to further remove extreme outliers; the stream already pre-filters outliers—this is an additional check.

```
subscription {
  Trading {
    Pairs(
      where: {Interval: {Time: {Duration: {eq: 1}}}, Price: {IsQuotedInUsd: false}, Market: {Network: {is: "Solana"}}, Volume: {Usd: {gt: 5}}}
    ) {
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
      Market {
        Protocol
        Program
        Network
        Name
        Address
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
        Ohlc {
          Close
          High
          Low
          Open
        }
      }
    }
  }
}
```

## Real-Time Token Prices Against SOL/WSOL

Stream real-time OHLC and volume data for Solana tokens specifically paired against SOL or WSOL. Useful when building apps or bots that want token values expressed relative to Solana’s native currency.

Here we have selected the filter `Price: {IsQuotedInUsd: false}`, this means that any price values such as OHLC or Average indicators will be in quote currency. If you want them denominated in USD, change the filter to `Price: {IsQuotedInUsd: true}`.

[Run Stream ➤](https://ide.bitquery.io/Real-Time-usd-price-on-solana-chain-against-WSOLSOL)

> Note: We include `Volume: { Usd: { gt: 5 } }` to further remove extreme outliers; the stream already pre-filters outliers—this is an additional check.

```
subscription {
  Trading {
    Pairs(
      where: {Interval: {Time: {Duration: {eq: 1}}},
        Price: {IsQuotedInUsd: false},
        QuoteToken:{
          Address:{
            in:["So11111111111111111111111111111111111111112"
            ,"11111111111111111111111111111111"
            ]
          }
        },
        Market: {Network: {is: "Solana"}}, Volume: {Usd: {gt: 5}}}
    ) {
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
      Market {
        Protocol
        Program
        Network
        Name
        Address
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
        Ohlc {
          Close
          High
          Low
          Open
        }
      }
    }
  }
}
```

## Aggregated Token Data (Volume & Price, Last 24h)

Get a snapshot of tokens with aggregated USD volume and average price over the last 24 hours. The query uses `limitBy: { count: 1, by: Token_Id }` to return one row per token, and conditional metrics (`Volume.Usd(if: ...)`, `Price.Average.Mean(..., if: ...)`) to show volume and price for the last 1h, 4h, and 24h. Useful for dashboards, top-movers lists, or comparing short-term vs daily metrics.

[Run query ➤](https://ide.bitquery.io/aggregated-data)

```graphql
{
  Trading {
    Tokens(
      limit: { count: 100 }
      limitBy: { count: 1, by: Token_Id }
      where: { Block: { Time: { since_relative: { hours_ago: 24 } } } }
    ) {
      Token {
        Address
        Id
        IsNative
        Name
        Network
        Symbol
        TokenId
      }
      Volume {
        Usd
        H1VAgo: Usd(
          if: { Block: { Time: { since_relative: { hours_ago: 1 } } } }
        )
        H4VAgo: Usd(
          if: { Block: { Time: { since_relative: { hours_ago: 4 } } } }
        )
        H24VAgo: Usd(
          if: { Block: { Time: { since_relative: { hours_ago: 24 } } } }
        )
      }
      Price {
        Average {
          currentPrice: Mean(maximum: Block_Time)
          H1Ago: Mean(
            minimum: Block_Time
            if: { Block: { Time: { since_relative: { hours_ago: 1 } } } }
          )
          H4Ago: Mean(
            minimum: Block_Time
            if: { Block: { Time: { since_relative: { hours_ago: 4 } } } }
          )
          H24Ago: Mean(
            minimum: Block_Time
            if: { Block: { Time: { since_relative: { hours_ago: 24 } } } }
          )
        }
      }
    }
  }
}
```

## OHLC of a currency on multiple blockchains

This query retrieves the OHLC (Open, High, Low, Close) prices of a currency(in this eg Bitcoin; it will include all sorts of currencies whose underlying asset is Bitcoin like cbBTC, WBTC, etc) across all supported blockchains, aggregated into a given time interval (e.g., 60 seconds in this example).

[Run Stream ➤](https://ide.bitquery.io/OHLC-of-a-currency-on-multiple-blockchains)

> Note: We include `Volume: { Usd: { gt: 5 } }` to further remove extreme outliers; the stream already pre-filters outliers—this is an additional check.

```
{
  Trading {
    Currencies(
      where: {
        Currency: { Id: { is: "bid:bitcoin" } },
        Interval: { Time: { Duration: { eq: 60 } } },
        Volume: { Usd: { gt: 5 } }
      },
      limit: { count: 1 },
      orderBy: { descending: Block_Time }
    ) {
      Currency {
        Id
        Name
        Symbol
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
        BaseAttributedToUsd
        Quote
        Usd
      }
      Price {
        IsQuotedInUsd #The price is shown in USD (`IsQuotedInUsd: true` by default).
        Ohlc {
          Open    # Earliest price across chains in the interval
          High    # Highest price across chains in the interval
          Low     # Lowest price across chains in the interval
          Close   # Latest price across chains in the interval
        }
        Average {
          Estimate
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

## OHLC Stream on a Chain

Mention the chain/network using the `Token: {Network}` filter.  
Available values: `Ethereum`, `Solana`, `Base`, `Optimism`, `Opbnb`, `Matic`, `Arbitrum`, `Binance Smart Chain`, `Tron`.

The available duration intervals are listed [here](https://docs.bitquery.io/docs/trading/price-index/introduction/#understanding-intervals).

In Tokens cube, only `IsQuotedInUsd:true` is supported so you will see OHLC and Price values in USD only.

Stream real-time OHLC (Open, High, Low, Close) prices, trading volume, and moving averages for all tokens on a specific blockchain (e.g., Solana). Useful for market dashboards or monitoring live token activity on one chain.

[Run Stream ➤](https://ide.bitquery.io/Aggregated-Price-of-all-tokens-in-real-time-on-one-chain)

> Note: We include `Volume: { Usd: { gt: 5 } }` to further remove extreme outliers; the stream already pre-filters outliers—this is an additional check.

```graphql
subscription {
  Trading {
    Tokens(
      where: {
        Token: { Network: { is: "Solana" } }
        Interval: { Time: { Duration: { eq: 60 } } }
        Volume: { Usd: { gt: 5 } }
      }
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

## OHLC of a Token Pair Across Chains

This subscription fetches real-time OHLC (Open, High, Low, Close) price data for a token pair across different blockchains.  
For **native tokens**, you only need to specify their ID (e.g., `bid:eth` for ETH).

Here we have selected the filter `Price: {IsQuotedInUsd: false}`, this means that any price values such as OHLC or Average indicators will be in terms of quote currency instead of USD. If you want them in USD, change the filter to `Price: {IsQuotedInUsd: true}`.

[Run Stream ➤](https://ide.bitquery.io/Token-OHLC-Stream-1-second-Multi-Chains_1)

> Note: We include `Volume: { Usd: { gt: 5 } }` to further remove extreme outliers; the stream already pre-filters outliers—this is an additional check.

```graphql
subscription {
  Trading {
    Pairs(
      where: {
        Price: { IsQuotedInUsd: false }
        Interval: { Time: { Duration: { eq: 1 } } }
        Currency: { Id: { is: "bid:eth" } }
        QuoteCurrency: { Id: { is: "usdc" } }
        Volume: { Usd: { gt: 5 } }
      }
    ) {
      Token {
        Id
        Symbol
        Address
        NetworkBid
        Network
        Name
      }
      QuoteToken {
        Id
        Symbol
        Address
        Name
        NetworkBid
      }
      Interval {
        Time {
          Start
          End
          Duration
        }
      }
      Volume {
        Usd
        Quote
        Base
      }
      Price {
        IsQuotedInUsd
        Ohlc {
          Open
          High
          Low
          Close
        }
        Average {
          Estimate
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

## Find Price Arbitrage Opportunity of Pair Across Chains

Compare token prices (e.g., BTC/USDT) across multiple markets and chains to identify arbitrage opportunities. Returns one latest price per market.

Here we have selected the filter `Price: {IsQuotedInUsd: true}`, this means that any price values such as OHLC or Average indicators will be in USD. If you want them in quote currency, change the filter to `Price: {IsQuotedInUsd: false}`.

[Run Stream ➤](https://ide.bitquery.io/Find-arbitrage-opportunity-with-same-token-across-chains_1)

> Note: We include `Volume: { Usd: { gt: 5 } }` to further remove extreme outliers; the stream already pre-filters outliers—this is an additional check.

```graphql
query {
  Trading {
    Pairs(
      where: {
        Price: { IsQuotedInUsd: true }
        Currency: { Id: { is: "bid:bitcoin" } }
        QuoteCurrency: { Id: { is: "usdt" } }
        Volume: { Usd: { gt: 5 } }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      limitBy: { by: Market_Address, count: 1 }
    ) {
      Currency {
        Id
        Name
        Symbol
      }
      QuoteCurrency {
        Id
        Name
        Symbol
      }
      Market {
        Name
        NetworkBid
        Network
        Address
      }
      Price {
        IsQuotedInUsd
        Average {
          Mean
          Estimate
          SimpleMoving
          ExponentialMoving
          WeightedSimpleMoving
        }
      }
      QuoteToken {
        Symbol
        Name
        Id
        NetworkBid
        Network
        Did
        Address
      }
      Token {
        Symbol
        Name
        Id
        NetworkBid
        Network
        Did
        Address
      }
    }
  }
}
```

## 5 Minute Price Change API

Fetch the top 10 tokens by 5-minute percentage price change (USD-based), only including tokens with at least $100k trading volume. Ideal for building a "top movers" list.

Here we have selected the filter `Price: {IsQuotedInUsd: true}`, this means that any price values such as OHLC or Average indicators will be in USD. If you want them in quote currency, change the filter to `Price: {IsQuotedInUsd: false}`.

This stream uses [expressions](http://docs.bitquery.io/docs/graphql/capabilities/expression/)

[Run Stream ➤](https://ide.bitquery.io/5-minute-price-change-api_2)

> Note: We include `Volume: { Usd: { gt: 5 } }` in most examples to remove extreme outliers; this stream already filters by `Volume: { Usd: { gt: 100000 } }`.

```graphql
{
  Trading {
    Tokens(
      limit: { count: 10 }
      orderBy: { descendingByField: "change" }
      where: {
        Price: { IsQuotedInUsd: true }
        Volume: { Usd: { gt: 100000 } }
        Interval: { Time: { Duration: { eq: 300 } } }
      }
    ) {
      Token {
        Address
        Did
        Id
        IsNative
        Name
        Network
        Name
        Symbol
        TokenId
      }
      Currency {
        Symbol
        Id
        Name
      }
      Interval {
        VolumeBased
        Time {
          Start
          End
          Duration
        }
      }
      Volume {
        Base
        BaseAttributedToUsd
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
          Estimate
          ExponentialMoving
          Mean
          SimpleMoving
          WeightedSimpleMoving
        }
      }
      diff: calculate(expression: "Price_Ohlc_Close - Price_Ohlc_Open")
      change: calculate(expression: "round(($diff / Price_Ohlc_Open), 3) * 100")
    }
  }
}
```

## 5 Minute Price Change Stream on Solana

Stream the top 10 tokens on Solana by 5-minute price change (in USD), filtered by $100k+ volume. Updates continuously.

Here we have selected the filter `Price: {IsQuotedInUsd: true}`, this means that any price values such as OHLC or Average indicators will be in USD. If you want them in quote currency, change the filter to `Price: {IsQuotedInUsd: false}`.

This stream uses [expressions](http://docs.bitquery.io/docs/graphql/capabilities/expression/)

[Run Stream ➤](https://ide.bitquery.io/5-minute-price-change-api-on-solana_6)

> Note: We include `Volume: { Usd: { gt: 5 } }` in most examples to remove extreme outliers; this stream already filters by `Volume: { Usd: { gt: 100000 } }`.

```
subscription{
  Trading {
    Tokens(
      orderBy:[{descending:Block_Time} {descendingByField:"change"}]
      where: {
        Price:{IsQuotedInUsd:true}
        Token:{Network:{is:"Solana"}}
        Volume:{Usd:{gt:100000}}
        Interval: {Time: {Duration: {eq: 300}}}}) {
      Token {
        Address
        Did
        Id
        IsNative
        Name
        Network
        Name
        Symbol
        TokenId
      }
      Currency {
        Symbol
        Id
        Name
      }
      Interval {
        VolumeBased
        Time {
          Start
          End
          Duration
        }
      }
      Volume {
        Base
        BaseAttributedToUsd
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
          Estimate
          ExponentialMoving
          Mean
          SimpleMoving
          WeightedSimpleMoving
        }
      }
		   diff:  calculate(expression:"Price_Ohlc_Close - Price_Ohlc_Open")
      change: calculate(expression:"round(($diff / Price_Ohlc_Open), 3) * 100")
    }
  }
}
```

## Drawdown of an Asset in the Last Hour

Calculate the percentage drawdown (price decline) for tokens of a specific currency (e.g., Bitcoin) over a 1-hour interval.

This query uses [expressions](http://docs.bitquery.io/docs/graphql/capabilities/expression/) to calculate drawdown as: `((Close - Open) / Open) * 100`.

> **Note:** You can use `Token: {Address: {is: "token_address"}}` filter instead of `Currency: {Id: {is: "bid:bitcoin"}}` to filter by token address. We include `Volume: { Usd: { gt: 10 } }` to filter out tokens with very low trading volume.

[Run query](https://ide.bitquery.io/Drawdown-of-a-token-last-hour)

```graphql
{
  Trading {
    Tokens(
      limit: { count: 1 }
      orderBy: { ascendingByField: "drawdown" }
      where: {
        Volume: { Usd: { gt: 10 } }
        Interval: { Time: { Duration: { eq: 3600 } } }
        Currency: { Id: { is: "bid:bitcoin" } }
      }
    ) {
      Token {
        Address
        Did
        Id
        IsNative
        Name
        Network
        Symbol
        TokenId
      }
      Currency {
        Symbol
        Id
        Name
      }
      Interval {
        VolumeBased
        Time {
          Start
          End
          Duration
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
          Estimate
          ExponentialMoving
          Mean
          SimpleMoving
          WeightedSimpleMoving
        }
      }
      diff: calculate(expression: "Price_Ohlc_Close - Price_Ohlc_Open")
      drawdown: calculate(expression: "($diff / Price_Ohlc_Open) * 100")
    }
  }
}
```

## Volume-Based Bitcoin Price Stream

Stream Bitcoin price data (USD OHLC) with a focus on volume-based intervals, useful for detecting price action tied to trading activity rather than fixed time windows.

Here we have selected the filter `Price: {IsQuotedInUsd: true}`, this means that any price values such as OHLC or Average indicators will be in USD. If you want them denominated in quote currency, change the filter to `Price: {IsQuotedInUsd: false}`.

[Run Stream ➤](https://ide.bitquery.io/5-minute-price-change-api-on-solana_5)

> Note: We include `Volume: { Usd: { gt: 5 } }` in most examples to remove extreme outliers; this stream already filters by `Volume: { Usd: { gt: 100000 } }`.

```graphql
{
  Trading {
    Tokens(
      limit: { count: 10 }
      limitBy: { count: 1, by: Token_Id }
      orderBy: [{ descending: Block_Time }, { descendingByField: "change" }]
      where: {
        Price: { IsQuotedInUsd: true }
        Token: { Network: { is: "Solana" } }
        Volume: { Usd: { gt: 100000 } }
        Interval: { Time: { Duration: { eq: 300 } } }
      }
    ) {
      Token {
        Address
        Did
        Id
        IsNative
        Name
        Network
        Name
        Symbol
        TokenId
      }
      Currency {
        Symbol
        Id
        Name
      }
      Interval {
        VolumeBased
        Time {
          Start
          End
        }
      }
      Volume {
        Base
        BaseAttributedToUsd
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
          Estimate
          ExponentialMoving
          Mean
          SimpleMoving
          WeightedSimpleMoving
        }
      }
      diff: calculate(expression: "Price_Ohlc_Close - Price_Ohlc_Open")
      change: calculate(expression: "round(($diff / Price_Ohlc_Open), 3) * 100")
    }
  }
}
```

## PumpAMM 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders

Real-time (1-second interval) price, OHLC, volume, and moving averages for Pump.fun AMM tokens on Solana. Useful for high-frequency trading bots.

Here we have selected the filter `Price: {IsQuotedInUsd: true}`, this means that any price values such as OHLC or Average indicators will be in USD. If you want them in quote currency, change the filter to `Price: {IsQuotedInUsd: false}`.

[Run Stream ➤](https://ide.bitquery.io/PumpAMM-tokens-1-second-price-stream-with-OHLC_1)

> Note: We include `Volume: { Usd: { gt: 5 } }` to further remove extreme outliers; the stream already pre-filters outliers—this is an additional check.

```
subscription {
  Trading {
    Pairs(
      where: {Interval: {Time: {Duration: {eq: 1}}}, Price: {IsQuotedInUsd: true}, Market: {Network: {is: "Solana"}, Program: {is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"}}, Volume: {Usd: {gt: 5}}}
    ) {
      Market {
        Protocol
        Program
        Network
        Name
        Address
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
        Ohlc {
          Close
          High
          Low
          Open
        }
        IsQuotedInUsd
      }
      Currency {
        Symbol
        Name
        Id
      }
      QuoteCurrency{
        Name
        Symbol
        Id
      }
      Token{
        Name
        Symbol
        Address
        Id
        NetworkBid
      }
      QuoteToken{
        Name
        Symbol
        Id
        Address
        NetworkBid
      }
    }
  }
}
```

## Heaven DEX 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders

Real-time (1s) stream of prices, OHLC, and volumes for tokens traded on Heaven DEX (Solana).

Here we have selected the filter `Price: {IsQuotedInUsd: true}`, this means that any price values such as OHLC or Average indicators will be in USD. If you want them in quote currency, change the filter to `Price: {IsQuotedInUsd: false}`.

[Run Stream ➤](https://ide.bitquery.io/Heaven-DEX-tokens-1-second-price-stream-with-OHLC)

> Note: We include `Volume: { Usd: { gt: 5 } }` to further remove extreme outliers; the stream already pre-filters outliers—this is an additional check.

```
subscription {
  Trading {
    Pairs(
      where: {Interval: {Time: {Duration: {eq: 1}}}, Price: {IsQuotedInUsd: true}, Market: {Network: {is: "Solana"}, Program: {is: "HEAVENoP2qxoeuF8Dj2oT1GHEnu49U5mJYkdeC8BAX2o"}}, Volume: {Usd: {gt: 5}}}
    ) {
      Market {
        Protocol
        Program
        Network
        Name
        Address
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
        Ohlc {
          Close
          High
          Low
          Open
        }
        IsQuotedInUsd
      }
      Currency {
        Symbol
        Name
        Id
      }
      QuoteCurrency{
        Name
        Symbol
        Id
      }
      Token{
        Name
        Symbol
        Address
        Id
        NetworkBid
      }
      QuoteToken{
        Name
        Symbol
        Id
        Address
        NetworkBid
      }
    }
  }
}

```

## Meteora DBC 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders

Real-time (1s) OHLC, price, and volume feed for Meteora DBC DEX on Solana.

Here we have selected the filter `Price: {IsQuotedInUsd: true}`, this means that any price values such as OHLC or Average indicators will be in USD. If you want them in quote currency, change the filter to `Price: {IsQuotedInUsd: false}`.

[Run Stream ➤](https://ide.bitquery.io/Meteora-DBC-DEX-tokens-1-second-price-stream-with-OHLC)

> Note: We include `Volume: { Usd: { gt: 5 } }` to further remove extreme outliers; the stream already pre-filters outliers—this is an additional check.

```
subscription {
  Trading {
    Pairs(
      where: {Interval: {Time: {Duration: {eq: 1}}}, Price: {IsQuotedInUsd: true}, Market: {Network: {is: "Solana"}, Program: {is: "HEAVENoP2qxoeuF8Dj2oT1GHEnu49U5mJYkdeC8BAX2o"}}, Volume: {Usd: {gt: 5}}}
    ) {
      Market {
        Protocol
        Program
        Network
        Name
        Address
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
        Ohlc {
          Close
          High
          Low
          Open
        }
        IsQuotedInUsd
      }
      Currency {
        Symbol
        Name
        Id
      }
      QuoteCurrency{
        Name
        Symbol
        Id
      }
      Token{
        Name
        Symbol
        Address
        Id
        NetworkBid
      }
      QuoteToken{
        Name
        Symbol
        Id
        Address
        NetworkBid
      }
    }
  }
}

```

## Raydium Launchlab 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders

Monitor Raydium Launchlab token listings on Solana with 1-second OHLC and volume streams. Perfect for tracking new token launches.

Here we have selected the filter `Price: {IsQuotedInUsd: true}`, this means that any price values such as OHLC or Average indicators will be in USD. If you want them in quote currency, change the filter to `Price: {IsQuotedInUsd: false}`.

[Run Stream ➤](https://ide.bitquery.io/Raydium-Launchpad-DEX-tokens-1-second-price-stream-with-OHLC)

> Note: We include `Volume: { Usd: { gt: 5 } }` to further remove extreme outliers; the stream already pre-filters outliers—this is an additional check.

```
subscription {
  Trading {
    Pairs(
      where: {Interval: {Time: {Duration: {eq: 1}}}, Price: {IsQuotedInUsd: true}, Market: {Network: {is: "Solana"}, Program: {is: "LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj"}}, Volume: {Usd: {gt: 5}}}
    ) {
      Market {
        Protocol
        Program
        Network
        Name
        Address
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
        Ohlc {
          Close
          High
          Low
          Open
        }
        IsQuotedInUsd
      }
      Currency {
        Symbol
        Name
        Id
      }
      QuoteCurrency{
        Name
        Symbol
        Id
      }
      Token{
        Name
        Symbol
        Address
        Id
        NetworkBid
      }
      QuoteToken{
        Name
        Symbol
        Id
        Address
        NetworkBid
      }
    }
  }
}

```

## Uniswap v3 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders

1-second OHLC and volume stream for tokens traded on Uniswap v3 (Ethereum). Great for bot trading strategies.

Here we have selected the filter `Price: {IsQuotedInUsd: true}`, this means that any price values such as OHLC or Average indicators will be in USD. If you want them in quote currency, change the filter to `Price: {IsQuotedInUsd: false}`.

[Run Stream ➤](https://ide.bitquery.io/Uniswap-v3-DEX-tokens-1-second-price-stream-with-OHLC)

> Note: We include `Volume: { Usd: { gt: 5 } }` to further remove extreme outliers; the stream already pre-filters outliers—this is an additional check.

```
subscription {
  Trading {
    Pairs(
      where: {Interval: {Time: {Duration: {eq: 1}}}, Price: {IsQuotedInUsd: true}, Market: {Network: {is: "Ethereum"}, Address: {is: "0x1f98431c8ad98523631ae4a59f267346ea31f984"}}, Volume: {Usd: {gt: 5}}}
    ) {
      Market {
        Protocol
        Program
        Network
        Name
        Address
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
        Ohlc {
          Close
          High
          Low
          Open
        }
        IsQuotedInUsd
      }
      Currency {
        Symbol
        Name
        Id
      }
      QuoteCurrency{
        Name
        Symbol
        Id
      }
      Token{
        Name
        Symbol
        Address
        Id
        NetworkBid
      }
      QuoteToken{
        Name
        Symbol
        Id
        Address
        NetworkBid
      }
    }
  }
}

```

## Sushiswap 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders

Stream 1-second OHLC, price, and volume data from Sushiswap DEX (Ethereum).

Here we have selected the filter `Price: {IsQuotedInUsd: true}`, this means that any price values such as OHLC or Average indicators will be in USD. If you want them in quote currency, change the filter to `Price: {IsQuotedInUsd: false}`.

[Run Stream ➤](https://ide.bitquery.io/Sushiswap-DEX-tokens-1-second-price-stream-with-OHLC)

> Note: We include `Volume: { Usd: { gt: 5 } }` to further remove extreme outliers; the stream already pre-filters outliers—this is an additional check.

```
subscription {
  Trading {
    Pairs(
      where: {Interval: {Time: {Duration: {eq: 1}}}, Price: {IsQuotedInUsd: true}, Market: {Network: {is: "Ethereum"}, Address: {is: "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac"}}, Volume: {Usd: {gt: 5}}}
    ) {
      Market {
        Protocol
        Program
        Network
        Name
        Address
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
        Ohlc {
          Close
          High
          Low
          Open
        }
        IsQuotedInUsd
      }
      Currency {
        Symbol
        Name
        Id
      }
      QuoteCurrency{
        Name
        Symbol
        Id
      }
      Token{
        Name
        Symbol
        Address
        Id
        NetworkBid
      }
      QuoteToken{
        Name
        Symbol
        Id
        Address
        NetworkBid
      }
    }
  }
}
```

## PancakeSwap v3 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders

1-second OHLC and volume stream for tokens traded on PancakeSwap v3 (Ethereum).

Here we have selected the filter `Price: {IsQuotedInUsd: true}`, this means that any price values such as OHLC or Average indicators will be in USD. If you want them in quote currency, change the filter to `Price: {IsQuotedInUsd: false}`.

[Run Stream ➤](https://ide.bitquery.io/PancakeSwap-v3-DEX-tokens-1-second-price-stream-with-OHLC_1)

> Note: We include `Volume: { Usd: { gt: 5 } }` to further remove extreme outliers; the stream already pre-filters outliers—this is an additional check.

```
subscription {
  Trading {
    Pairs(
      where: {Interval: {Time: {Duration: {eq: 1}}}, Price: {IsQuotedInUsd: true}, Market: {Network: {is: "Ethereum"}, Address: {is: "0x0bfbcf9fa4f9c56b0f40a671ad40e0805a091865"}}, Volume: {Usd: {gt: 5}}}
    ) {
      Market {
        Protocol
        Program
        Network
        Name
        Address
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
        Ohlc {
          Close
          High
          Low
          Open
        }
        IsQuotedInUsd
      }
      Currency {
        Symbol
        Name
        Id
      }
      QuoteCurrency{
        Name
        Symbol
        Id
      }
      Token{
        Name
        Symbol
        Address
        Id
        NetworkBid
      }
      QuoteToken{
        Name
        Symbol
        Id
        Address
        NetworkBid
      }
    }
  }
}
```

## FourMeme 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders

Track token activity (OHLC, price, volume) every 1 second on FourMeme DEX (BSC).

Here we have selected the filter `Price: {IsQuotedInUsd: true}`, this means that any price values such as OHLC or Average indicators will be in USD. If you want them in quote currency, change the filter to `Price: {IsQuotedInUsd: false}`.

[Run Stream ➤](https://ide.bitquery.io/FourMeme-DEX-tokens-1-second-price-stream-with-OHLC)

> Note: We include `Volume: { Usd: { gt: 5 } }` to further remove extreme outliers; the stream already pre-filters outliers—this is an additional check.

```
subscription {
  Trading {
    Pairs(
      where: {Interval: {Time: {Duration: {eq: 1}}}, Price: {IsQuotedInUsd: true}, Market: {Network: {is: "Binance Smart Chain"}, Address: {is: "0x5c952063c7fc8610ffdb798152d69f0b9550762b"}}, Volume: {Usd: {gt: 5}}}
    ) {
      Market {
        Protocol
        Program
        Network
        Name
        Address
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
        Ohlc {
          Close
          High
          Low
          Open
        }
        IsQuotedInUsd
      }
      Currency {
        Symbol
        Name
        Id
      }
      QuoteCurrency{
        Name
        Symbol
        Id
      }
      Token{
        Name
        Symbol
        Address
        Id
        NetworkBid
      }
      QuoteToken{
        Name
        Symbol
        Id
        Address
        NetworkBid
      }
    }
  }
}
```
