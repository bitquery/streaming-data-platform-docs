# Quick Start Examples

## OHLC Stream on A Chain

Mention the chain/network using the `Token: {Network}` filter. Available values are: `Ethereum`,`Solana`
, `Base`, `Optimism`, `Opbnb`, `Matic`, `Arbitrum`, `Binance Smart Chain`,`Tron`.

The available duration intervals are listed [here](https://docs.bitquery.io/docs/trading/price-index/introduction/#understanding-intervals)

[Run Stream ➤](https://ide.bitquery.io/Aggregated-Price-of-all-tokens-in-real-time-on-one-chain_1)

<details>
  <summary>Click to expand GraphQL query</summary>

```
subscription {
  Trading {
    Tokens(
      where: {Token: {Network: {is: "Solana"}}, Interval: {Time: {Duration: {eq: 60}}}}
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

</details>

## OHLC of a Token Pair Across Chains

This subscription fetches real-time OHLC (Open, High, Low, Close) price data for a token pair across different blockchains.
For **native tokens**, you only need to specify their ID (e.g., `bid:eth` for ETH).

[Run Stream ➤](https://ide.bitquery.io/Copy-of-Pair-OHLC-Stream)

<details>
  <summary>Click to expand GraphQL query</summary>

```
subscription{
  Trading {
    Pairs(
      where: {Price: {IsQuotedInUsd: false}, Interval: {Time: {Duration: {eq: 60}}}, Token: {Address: {is: "0xc0634090f2fe6c6d75e61be2b949464abb498973"}}, QuoteCurrency: {Id: {is: "bid:eth"}}}
    ) {
      Token {
        Id
      }
      QuoteToken {
        Id
      }
      Currency {
        Symbol
      }
      QuoteCurrency {
        Symbol
      }
      Interval {
        Time {
          Start
        }
      }
      Volume {
        Usd
        Quote
        BaseQuotedInUsd
      }
      Price {
        Ohlc {
          open
          High
          Low
          Close
        }
      }
    }
  }
}


```

</details>

## Find Price Arbitrage Opportunity Of Pair Across Chains

[Run Stream ➤](https://ide.bitquery.io/Find-arbitrage-opportunity-with-same-token-across-chains)

<details>
  <summary>Click to expand GraphQL query</summary>

```
{
  Trading {
    Pairs(
      where: {Currency: {Id: {is: "bid:bitcoin"}}, QuoteCurrency: {Id: {is: "usdt"}}}
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      limitBy: {by: Market_Address, count: 1}
    ) {
      Currency {
        Name
        Id
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
        }
      }
      QuoteCurrency {
        Id
        Symbol
        Name
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
        Name
        Id
        NetworkBid
      }
    }
  }
}
```

</details>
