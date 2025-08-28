# Quick Start Examples

## OHLC Stream on a Chain

Mention the chain/network using the `Token: {Network}` filter.  
Available values: `Ethereum`, `Solana`, `Base`, `Optimism`, `Opbnb`, `Matic`, `Arbitrum`, `Binance Smart Chain`, `Tron`.

The available duration intervals are listed [here](https://docs.bitquery.io/docs/trading/price-index/introduction/#understanding-intervals).

In Tokens cube, only `IsQuotedInUsd:true` is supported so you will see OHLC and Price values in USD only.

Stream real-time OHLC (Open, High, Low, Close) prices, trading volume, and moving averages for all tokens on a specific blockchain (e.g., Solana). Useful for market dashboards or monitoring live token activity on one chain.

[Run Stream ➤](https://ide.bitquery.io/Aggregated-Price-of-all-tokens-in-real-time-on-one-chain)

```graphql
subscription {
  Trading {
    Tokens(
      where: {
        Token: { Network: { is: "Solana" } }
        Interval: { Time: { Duration: { eq: 60 } } }
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

```graphql
subscription {
  Trading {
    Pairs(
      where: {
        Price: { IsQuotedInUsd: false }
        Interval: { Time: { Duration: { eq: 1 } } }
        Currency: { Id: { is: "bid:eth" } }
        QuoteCurrency: { Id: { is: "usdc" } }
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

```graphql
query {
  Trading {
    Pairs(
      where: {
        Price: { IsQuotedInUsd: true }
        Currency: { Id: { is: "bid:bitcoin" } }
        QuoteCurrency: { Id: { is: "usdt" } }
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

## Volume-Based Bitcoin Price Stream

Stream Bitcoin price data (USD OHLC) with a focus on volume-based intervals, useful for detecting price action tied to trading activity rather than fixed time windows.

Here we have selected the filter `Price: {IsQuotedInUsd: true}`, this means that any price values such as OHLC or Average indicators will be in USD. If you want them in quote currency, change the filter to `Price: {IsQuotedInUsd: false}`.

[Run Stream ➤](https://ide.bitquery.io/5-minute-price-change-api-on-solana_5)

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

```
subscription {
  Trading {
    Pairs(
      where: {Interval: {Time: {Duration: {eq: 1}}}, Price: {IsQuotedInUsd: true}, Market: {Network: {is: "Solana"}, Program: {is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"}}}
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

```
subscription {
  Trading {
    Pairs(
      where: {Interval: {Time: {Duration: {eq: 1}}}, Price: {IsQuotedInUsd: true}, Market: {Network: {is: "Solana"}, Program: {is: "HEAVENoP2qxoeuF8Dj2oT1GHEnu49U5mJYkdeC8BAX2o"}}}
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

```
subscription {
  Trading {
    Pairs(
      where: {Interval: {Time: {Duration: {eq: 1}}}, Price: {IsQuotedInUsd: true}, Market: {Network: {is: "Solana"}, Program: {is: "HEAVENoP2qxoeuF8Dj2oT1GHEnu49U5mJYkdeC8BAX2o"}}}
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

```
subscription {
  Trading {
    Pairs(
      where: {Interval: {Time: {Duration: {eq: 1}}}, Price: {IsQuotedInUsd: true}, Market: {Network: {is: "Solana"}, Program: {is: "LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj"}}}
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

```
subscription {
  Trading {
    Pairs(
      where: {Interval: {Time: {Duration: {eq: 1}}}, Price: {IsQuotedInUsd: true}, Market: {Network: {is: "Ethereum"}, Address: {is: "0x1f98431c8ad98523631ae4a59f267346ea31f984"}}}
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

```
subscription {
  Trading {
    Pairs(
      where: {Interval: {Time: {Duration: {eq: 1}}}, Price: {IsQuotedInUsd: true}, Market: {Network: {is: "Ethereum"}, Address: {is: "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac"}}}
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

```
subscription {
  Trading {
    Pairs(
      where: {Interval: {Time: {Duration: {eq: 1}}}, Price: {IsQuotedInUsd: true}, Market: {Network: {is: "Ethereum"}, Address: {is: "0x0bfbcf9fa4f9c56b0f40a671ad40e0805a091865"}}}
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

```
subscription {
  Trading {
    Pairs(
      where: {Interval: {Time: {Duration: {eq: 1}}}, Price: {IsQuotedInUsd: true}, Market: {Network: {is: "Binance Smart Chain"}, Address: {is: "0x5c952063c7fc8610ffdb798152d69f0b9550762b"}}}
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
