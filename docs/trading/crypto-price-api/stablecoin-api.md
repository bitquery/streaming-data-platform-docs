# Stablecoin API

The Stablecoin API by Bitquery provides you the comprehensive set of APIs which can provide you realtime transfers, realtime trades, realtime price, holder distribution of stablecoins across chains with a single API call. We will use the new [Crypto Price APIs](https://docs.bitquery.io/docs/trading/price-index/introduction/)


## Stream Latest Stablecoin Price

[Run Stream](https://ide.bitquery.io/stablecoin-1-second-price-stream)

```
subscription {
  Trading {
    Tokens(
      where: {Interval: {Time: {Duration: {eq: 1}}}, Currency: {Id: {in: ["usdt", "usdc", "tusd", "usdd", "usds", "usd₮0", "usd1", "dai"]}}}
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

## Stablecoin Realtime Transfers Stream

Below stream will give you realtime transfers of `USDC` on Solana. Test the stream [here](https://ide.bitquery.io/stablecoin-transfers-websocket).

```
subscription {
  Solana {
    Transfers(
      where: {Transfer: {Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}}}
    ) {
      Transfer {
        Currency {
          MintAddress
          Symbol
          Name
          Fungible
          Native
        }
        Receiver {
          Address
        }
        Sender {
          Address
        }
        Amount
        AmountInUSD
      }
      Transaction{
        Signature
      }
    }
  }
}
```

