# Quick Start Examples

## OHLC Stream on A Chain

Mention the chain/network using the `Token: {Network}` filter. Available values are: `Ethereum`,`Solana`
, `Base`, `Optimism`, `Opbnb`, `Matic`, `Arbitrum`, `Binance Smart Chain`. 

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