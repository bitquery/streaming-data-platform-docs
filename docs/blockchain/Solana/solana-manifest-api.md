# Solana Manifest API

Track real-time trades, token prices, OHLC data, top traders, and trading volume on **Manifest** DEX on Solana using Bitquery's GraphQL API. Filter by `Dex: { ProtocolFamily: { is: "Manifest" } }` to get Manifest-only data.

:::note
Use these APIs as **queries** for OHLC, top traders, and volume aggregates. Subscriptions are for real-time trades and price feeds; aggregates and time intervals do not work with subscriptions.
:::

## Real-time Manifest DEX Trades

Subscribe to trades on Manifest DEX as they happen. Returns buy/sell amounts, currencies, accounts, and prices.

[Run Query](https://ide.bitquery.io/manifest-dextrades)

```graphql
subscription ManifestDEXTrades {
  Solana {
    DEXTrades(where: { Trade: { Dex: { ProtocolFamily: { is: "Manifest" } } } }) {
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

## Latest Price of a Token on Manifest

Get the most recent trade price for a token on Manifest. Example uses USDC (`EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`) against SOL (`So11111111111111111111111111111111111111112`). Change the mint addresses in the `where` clause for another pair.

[Run Query](https://ide.bitquery.io/token-price-on-manifest)

```graphql
{
  Solana {
    DEXTradeByTokens(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        Trade: {
          Dex: { ProtocolFamily: { is: "Manifest" } }
          Currency: { MintAddress: { is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" } }
          Side: { Currency: { MintAddress: { is: "So11111111111111111111111111111111111111112" } } }
        }
      }
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

## Realtime Price Feed of a Token on Manifest

Subscribe to live price updates for a token on Manifest. Replace the currency mint address with your token’s mint.

[Run Query](https://ide.bitquery.io/Realtime-Price-feed-of-a-Token-on-Manifest)

```graphql
subscription RealtimeManifestPrice {
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: { ProtocolFamily: { is: "Manifest" } }
          Currency: { MintAddress: { is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" } }
        }
      }
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

## Manifest OHLC API

Get OHLC (open, high, low, close), volume, and trade count for a token pair on Manifest. Uses 1-minute candles. `PriceAsymmetry: { lt: 0.1 }` filters for balanced price data. Use as a **query** only; aggregates and intervals are not supported in subscriptions.

[Run Query](https://ide.bitquery.io/manifest-OHLC-API)

```graphql
{
  Solana {
    DEXTradeByTokens(
      orderBy: { descendingByField: "Block_Timefield" }
      where: {
        Trade: {
          Currency: { MintAddress: { is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" } }
          Side: { Currency: { MintAddress: { is: "USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB" } } }
          Dex: { ProtocolFamily: { is: "Manifest" } }
          PriceAsymmetry: { lt: 0.1 }
        }
      }
      limit: { count: 10 }
    ) {
      Block {
        Timefield: Time(interval: { in: minutes, count: 1 })
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

## Top Traders of a Token on Manifest

Get the top 100 traders by USD volume for a token on Manifest. Pass the token mint address as the `$token` variable.

[Run Query](https://ide.bitquery.io/Get-the-Top-Traders-of-a-specific-Token-on-ManifestDEX)

**Variables (example):**

```json
{
  "token": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
}
```

```graphql
query TopTraders($token: String) {
  Solana {
    DEXTradeByTokens(
      orderBy: { descendingByField: "volumeUsd" }
      limit: { count: 100 }
      where: {
        Trade: {
          Currency: { MintAddress: { is: $token } }
          Dex: { ProtocolFamily: { is: "Manifest" } }
        }
        Transaction: { Result: { Success: true } }
      }
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
      bought: sum(of: Trade_Amount, if: { Trade: { Side: { Type: { is: buy } } } })
      sold: sum(of: Trade_Amount, if: { Trade: { Side: { Type: { is: sell } } } })
      volume: sum(of: Trade_Amount)
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
    }
  }
}
```

## Trading Volume, Buy Volume, and Sell Volume of a Token

Get total traded volume (token and USD), buy volume, and sell volume for a token on Manifest over a time window. Example uses last 1 hour and USDC/SOL pair; adjust `since_relative` or mint addresses as needed. Uses `dataset: combined` for historical coverage.

[Run Query](https://ide.bitquery.io/Get-trading-volume-buy-volume-sell-volume-of-a-token_7)

```graphql
query ManifestTokenVolume {
  Solana(dataset: combined) {
    DEXTradeByTokens(
      where: {
        Block: { Time: { since_relative: { hours_ago: 1 } } }
        Transaction: { Result: { Success: true } }
        Trade: {
          Currency: { MintAddress: { is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" } }
          Side: { Currency: { MintAddress: { is: "So11111111111111111111111111111111111111112" } } }
          Dex: { ProtocolFamily: { is: "Manifest" } }
        }
      }
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
        if: { Trade: { Side: { Type: { is: buy } } } }
      )
      sell_volume: sum(
        of: Trade_Side_AmountInUSD
        if: { Trade: { Side: { Type: { is: sell } } } }
      )
    }
  }
}
```
