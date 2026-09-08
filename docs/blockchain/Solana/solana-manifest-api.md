---
title: "Manifest DEX API: Order Book Fills, Prices, 1-Minute OHLC and Top Traders"
sidebar_label: "Manifest API"
description: "Manifest, Solana's on-chain order book, via Bitquery GraphQL: live fills, USDT/USDC price and 1-minute candles, buy and sell volume and top traders."
keywords:
  - Manifest DEX API
  - Manifest Solana order book
  - Manifest trades GraphQL
  - USDT USDC Solana order book
  - Manifest OHLC API
---

import VideoPlayer from "../../../src/components/videoplayer.js";
import FAQ from "@site/src/components/FAQ";

# Manifest DEX API: Order Book Fills, Prices, 1-Minute OHLC and Top Traders

Manifest is an on-chain limit order book on Solana, program `MNFSTqtC93rEfYHB6hF82sKdZpUDFWkViLByLd1k1Ms`, and most of what trades on it is stablecoins: the USDT/USDC market at `8sjV1AqBFvFuADBCQHhotaRq5DFFYSjjg1jMyVWMqXvZ` is its busiest market by a wide margin. Because fills are matched orders rather than pool swaps, prices sit within a few basis points of parity and candles are tight, which makes Manifest a good reference market for stablecoin pricing. Bitquery records each fill in the Solana `DEXTrades` and `DEXTradeByTokens` cubes under `ProtocolFamily: "Manifest"` and `ProtocolName: "manifest"`. Every example runs in the [IDE](https://ide.bitquery.io) on a free account; Solana queries go to the `eap` endpoint. Aggregates such as candles and rankings are queries; subscriptions are for the live fill and price feeds.

<VideoPlayer url="https://youtu.be/SgFPOql5Q5A" />

## Live fills

Every Manifest fill as it lands, with both sides, the accounts and the market. Saved stream [here](https://ide.bitquery.io/manifest-dextrades).

```graphql
subscription {
  Solana {
    DEXTrades(where: { Trade: { Dex: { ProtocolFamily: { is: "Manifest" } } } }) {
      Block {
        Time
      }
      Trade {
        Market {
          MarketAddress
        }
        Buy {
          Currency {
            Symbol
            MintAddress
          }
          Amount
          AmountInUSD
          Price
          Account {
            Address
          }
        }
        Sell {
          Currency {
            Symbol
            MintAddress
          }
          Amount
          AmountInUSD
          Account {
            Address
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

## Price of USDT in USDC, right now

The newest fill in the market. `Price` is the quote per unit of the token and `PriceInUSD` its dollar value. Saved query [here](https://ide.bitquery.io/token-price-on-manifest).

```graphql
{
  Solana {
    DEXTradeByTokens(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        Trade: {
          Dex: { ProtocolFamily: { is: "Manifest" } }
          Currency: { MintAddress: { is: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB" } }
          Side: { Currency: { MintAddress: { is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" } } }
        }
      }
    ) {
      Block {
        Time
      }
      Trade {
        Price
        PriceInUSD
        Market {
          MarketAddress
        }
      }
    }
  }
}
```

As a subscription the same filter is a price feed that ticks on every fill. Saved stream [here](https://ide.bitquery.io/Realtime-Price-feed-of-a-Token-on-Manifest).

```graphql
subscription {
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: { ProtocolFamily: { is: "Manifest" } }
          Currency: { MintAddress: { is: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB" } }
          Side: { Currency: { MintAddress: { is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" } } }
        }
      }
    ) {
      Block {
        Time
      }
      Trade {
        Price
        PriceInUSD
        Amount
      }
    }
  }
}
```

## One-minute candles

USDT/USDC over the last hour, one row per minute with volume and fill count. `PriceAsymmetry` below 0.1 keeps fills whose two sides agree on price. Saved query [here](https://ide.bitquery.io/manifest-OHLC-API).

```graphql
{
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: { ProtocolFamily: { is: "Manifest" } }
          Currency: { MintAddress: { is: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB" } }
          Side: { Currency: { MintAddress: { is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" } } }
          PriceAsymmetry: { lt: 0.1 }
        }
        Transaction: { Result: { Success: true } }
        Block: { Time: { since_relative: { hours_ago: 1 } } }
      }
      limit: { count: 60 }
      orderBy: { descendingByField: "Block_Timefield" }
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

## Buy and sell volume of a token

Totals for USDT on Manifest over the last hour, in USD, split by direction. `Side.Type` describes the counter-side, so USDT was bought where the side was sold. Saved query [here](https://ide.bitquery.io/Get-trading-volume-buy-volume-sell-volume-of-a-token_7).

```graphql
{
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: { ProtocolFamily: { is: "Manifest" } }
          Currency: { MintAddress: { is: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB" } }
        }
        Transaction: { Result: { Success: true } }
        Block: { Time: { since_relative: { hours_ago: 1 } } }
      }
    ) {
      trades: count
      volume: sum(of: Trade_Amount)
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
      bought: sum(of: Trade_Amount, if: { Trade: { Side: { Type: { is: sell } } } })
      sold: sum(of: Trade_Amount, if: { Trade: { Side: { Type: { is: buy } } } })
    }
  }
}
```

## Top traders of a token

Rank signers by USD volume over a day. Saved query [here](https://ide.bitquery.io/Get-the-Top-Traders-of-a-specific-Token-on-ManifestDEX).

```graphql
{
  Solana {
    DEXTradeByTokens(
      orderBy: { descendingByField: "volumeUsd" }
      limit: { count: 50 }
      where: {
        Trade: {
          Dex: { ProtocolFamily: { is: "Manifest" } }
          Currency: { MintAddress: { is: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB" } }
        }
        Transaction: { Result: { Success: true } }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      Transaction {
        Signer
      }
      trades: count
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
      bought: sum(of: Trade_Amount, if: { Trade: { Side: { Type: { is: sell } } } })
      sold: sum(of: Trade_Amount, if: { Trade: { Side: { Type: { is: buy } } } })
    }
  }
}
```

## The busiest Manifest markets

Group the last day by market and token pair.

```graphql
{
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: { Dex: { ProtocolFamily: { is: "Manifest" } } }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      orderBy: { descendingByField: "fills" }
      limit: { count: 20 }
    ) {
      Trade {
        Market {
          MarketAddress
        }
        Currency {
          Symbol
          MintAddress
        }
        Side {
          Currency {
            Symbol
            MintAddress
          }
        }
      }
      fills: count
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
      traders: uniq(of: Transaction_Signer)
    }
  }
}
```

<FAQ
  items={[
    { q: "How do I get Manifest trades on Solana?", a: "Filter Trade.Dex.ProtocolFamily on Manifest in the Solana DEXTrades or DEXTradeByTokens cubes on the eap endpoint. Each row is one fill, with the market address, both sides and the signer." },
    { q: "What is the Manifest program address?", a: "MNFSTqtC93rEfYHB6hF82sKdZpUDFWkViLByLd1k1Ms. A filter on Trade.Dex.ProgramAddress is equivalent to the family filter." },
    { q: "Which Manifest market is the most active?", a: "USDT/USDC at 8sjV1AqBFvFuADBCQHhotaRq5DFFYSjjg1jMyVWMqXvZ. The busiest-markets query on this page ranks them for any window." },
    { q: "Can I get order book depth from these cubes?", a: "No. The cubes record fills, not resting orders. For the book itself read the program's accounts; for fills, prices and volume the queries here are enough." },
    { q: "Do candles work as subscriptions?", a: "No. Intervals and aggregates run as queries only. Subscribe to the price feed for live ticks and build candles on your side, or poll the candle query." },
  ]}
/>

## Related pages

- [Solana DEX trades API](/docs/blockchain/Solana/solana-dextrades)
- [Crypto Trades API](/docs/trading/crypto-trades-api/trades-api)
- [Solana API hub](/docs/blockchain/Solana/)
