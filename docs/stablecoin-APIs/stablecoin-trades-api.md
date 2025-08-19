# Stablecoin Trades API

The Stablecoin API by Bitquery provides you the comprehensive set of APIs which can provide you realtime transfers, realtime trades, realtime price, holder distribution of stablecoins across chains with a single API call.

We are going to particularly deep-dive into how to get Stablecoin Trades data in this section.

## Solana

### Stablecoin trades

Below stream will give you realtime trades of `USDT` on Solana. Test the stream [here](https://ide.bitquery.io/solana-trades-subscription_10_1).

```
subscription {
  Solana {
    DEXTrades (where:{any:[{Trade:{Buy:{Currency:{MintAddress:{is:"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"}}}}},{Trade:{Sell:{Currency:{MintAddress:{is:"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"}}}}}]}){
      Block{
        Time
        Slot
      }
      Transaction{
        Signature
        Index
        Result{
          Success
        }
      }
      Trade {
        Index
        Dex {
          ProgramAddress
          ProtocolFamily
          ProtocolName
        }
        Buy {
          Amount
          Account {
            Address
          }
          Currency {
            MetadataAddress
            Key
            MintAddress
            IsMutable
            EditionNonce
            Decimals
            CollectionAddress
            Fungible
            Symbol
            Native
            Name
          }
          Price
          PriceInUSD
          Order {
            LimitPrice
            LimitAmount
            OrderId
          }

        }
        Market {
          MarketAddress
        }
        Sell {
          Account {
            Address
          }
          Currency {
            IsMutable
            Decimals
            CollectionAddress
            Fungible
            Symbol
            Native
            Name
          }
          Price
          PriceInUSD
        }
      }
    }
  }
}
```

### Real Time Stablecoin portfolio

Below stream will provide you the realtime portfolio updates for a particular address for a specific Stablecoin. In this query example, we are tracking portfolio updates for the address `3i51cKbLbaKAqvRJdCUaq9hsnvf9kqCfMujNgFj7nRKt` and for stablecoin `USDC`.
Test the query [here](https://ide.bitquery.io/real-time-stablecoin-portfolio_2).

```
subscription MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {Transaction: {Result: {Success: true}}, Trade: {Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}}, any: [{Trade: {Account: {Address: {is: "3i51cKbLbaKAqvRJdCUaq9hsnvf9kqCfMujNgFj7nRKt"}}}}, {Trade: {Account: {Owner: {is: "3i51cKbLbaKAqvRJdCUaq9hsnvf9kqCfMujNgFj7nRKt"}}}}, {Transaction:{Signer:{is: "3i51cKbLbaKAqvRJdCUaq9hsnvf9kqCfMujNgFj7nRKt"}}}]}
    ) {
      Block {
        Time
      }
      Trade {
        Account {
          Address
          Token {
            Owner
          }
        }
        Amount
        AmountInUSD
        Currency {
          Name
          MintAddress
          Symbol
        }
        Dex {
          ProtocolName
          ProtocolFamily
          ProgramAddress
        }
        Price
        PriceInUSD
        Side {
          Account {
            Address
            Token {
              Owner
            }
          }
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

### Stablecoin Depeg tracking Stream

Below stream will be able to track specific Stablecoin depeg. In this query example, we are tracking depeg for the stablecoin `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` which has a symbol `USDC`.
Test the query [here](https://ide.bitquery.io/stablecoin-depeg-tracking-stream-for-USDC).

```
subscription {
  Solana {
    DEXTradeByTokens(
      where: {Trade: {Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}, PriceInUSD: {lt:0.95 gt: 1.05}}}
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
