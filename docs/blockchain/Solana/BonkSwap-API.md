---
title: "BonkSwap API: Trades, Top Traders, One Wallet's Swaps and OHLC on Solana"
sidebar_label: "BonkSwap API"
description: "BonkSwap on Solana via Bitquery GraphQL: latest swaps, top traders by USD volume, one wallet's BonkSwap trades, hourly OHLC for USELESS/USD1, and a live stream."
keywords:
  - BonkSwap API
  - BonkSwap trades Solana
  - bonkswap GraphQL
  - USD1 Solana DEX
  - BonkSwap top traders
---

import VideoPlayer from "../../../src/components/videoplayer.js";
import FAQ from "@site/src/components/FAQ";

# BonkSwap API: Trades, Top Traders, One Wallet's Swaps and OHLC on Solana

BonkSwap is the AMM of the Bonk ecosystem on Solana, program `BSwp6bEBihVLdqJRKGgzjcGLHkcTuzmSo1TQkHepzH8p`. Its volume today runs through pairs quoted in USD1, the stablecoin the venue leans on, with USELESS/USD1 the busiest of them. Bitquery labels its swaps `ProtocolName: "bonkswap"` in the Solana `DEXTrades` and `DEXTradeByTokens` cubes, so every query on this page is one filter away from covering any other Solana DEX. Every example runs in the [IDE](https://ide.bitquery.io) on a free account; Solana queries go to the `eap` endpoint. For swaps with the trader, USD and market cap on every row for the last month, the [Trading cube](/docs/trading/crypto-trades-api/trades-api) covers BonkSwap too.

## Latest swaps on BonkSwap

One row per swap per token, newest first, with the counter token, the price in USD, the market and the signer. Change `query` to `subscription` and drop `limit` and `orderBy` for a live feed. Saved query [here](https://ide.bitquery.io/Latest-Trades-on-BonkSwap).

```graphql
{
  Solana {
    DEXTradeByTokens(
      orderBy: { descending: Block_Time }
      limit: { count: 50 }
      where: {
        Transaction: { Result: { Success: true } }
        Trade: { Dex: { ProtocolName: { is: "bonkswap" } } }
      }
    ) {
      Block {
        Time
      }
      Trade {
        Currency {
          Symbol
          MintAddress
        }
        Amount
        PriceInUSD
        Side {
          Currency {
            Symbol
          }
          Amount
          Type
        }
        Market {
          MarketAddress
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

## Top traders by USD volume

Group the last day by the transaction signer. `tokens` says how many different tokens each wallet touched. Saved query [here](https://ide.bitquery.io/Top-Traders-on-BonkSwap).

```graphql
{
  Solana {
    DEXTradeByTokens(
      orderBy: { descendingByField: "volumeUsd" }
      limit: { count: 50 }
      where: {
        Transaction: { Result: { Success: true } }
        Trade: { Dex: { ProtocolName: { is: "bonkswap" } } }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      Transaction {
        Signer
      }
      trades: count
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
      tokens: uniq(of: Trade_Currency_MintAddress)
    }
  }
}
```

## One wallet's BonkSwap trades

Filter `Transaction.Signer`. The example is the most active BonkSwap wallet at the time of writing; take any address from the table above. Saved query [here](https://ide.bitquery.io/Bonkswap-Trades-by-Trader-API).

```graphql
{
  Solana {
    DEXTrades(
      orderBy: [{ descending: Block_Time }, { descending: Transaction_Index }, { descending: Trade_Index }]
      limit: { count: 20 }
      where: {
        Transaction: { Signer: { is: "9EVzTzLSfYHrjXpejBRFGmZVG9jRsS4tDtcE1NpD6srb" } }
        Trade: { Dex: { ProtocolName: { is: "bonkswap" } } }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      Block {
        Time
      }
      Trade {
        Buy {
          Currency {
            Symbol
          }
          Amount
          AmountInUSD
        }
        Sell {
          Currency {
            Symbol
          }
          Amount
          AmountInUSD
        }
        Market {
          MarketAddress
        }
      }
      Transaction {
        Signature
      }
    }
  }
}
```

## Hourly OHLC for USELESS/USD1

Candles for the last day of the busiest BonkSwap pair. `Trade.Amount` sums the USELESS volume; the four price fields come from the highest and lowest prices in the hour and the first and last slot. Saved query [here](https://ide.bitquery.io/ohlc-for-bonkswap-token).

```graphql
{
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: { ProtocolName: { is: "bonkswap" } }
          Currency: { MintAddress: { is: "Dz9mQ9NzkBcCsuGPFJ3r1bS4wgqKMHBPiVuniW8Mbonk" } }
          Side: { Currency: { MintAddress: { is: "USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB" } } }
        }
        Transaction: { Result: { Success: true } }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      limit: { count: 24 }
      orderBy: { descendingByField: "Block_Timefield" }
    ) {
      Block {
        Timefield: Time(interval: { in: hours, count: 1 })
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

## Every BonkSwap swap, live

The protocol filter on `DEXTrades` as a subscription; each message is one swap with both sides.

```graphql
subscription {
  Solana {
    DEXTrades(
      where: {
        Trade: { Dex: { ProtocolName: { is: "bonkswap" } } }
        Transaction: { Result: { Success: true } }
      }
    ) {
      Block {
        Time
      }
      Trade {
        Buy {
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
        Sell {
          Currency {
            Symbol
            MintAddress
          }
          Amount
          AmountInUSD
        }
        Market {
          MarketAddress
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

<FAQ
  items={[
    { q: "How do I get BonkSwap trades with the Bitquery API?", a: "Filter Trade.Dex.ProtocolName on bonkswap in the Solana DEXTrades or DEXTradeByTokens cubes on the eap endpoint. DEXTradeByTokens gives one row per swap per token, which is the shape for prices, candles and rankings." },
    { q: "What is the BonkSwap program address?", a: "BSwp6bEBihVLdqJRKGgzjcGLHkcTuzmSo1TQkHepzH8p. Filtering Trade.Dex.ProgramAddress on it is equivalent to the protocol name filter." },
    { q: "How do I find the top traders on BonkSwap?", a: "Group DEXTradeByTokens by Transaction.Signer over a window and sort by the USD sum of Trade.Side.AmountInUSD. Add a token filter to rank traders of one token." },
    { q: "Which quote token do BonkSwap pairs use?", a: "Most BonkSwap volume today is quoted in USD1, mint USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB. Put it under Trade.Side.Currency to build candles in USD1 terms." },
    { q: "How far back does BonkSwap data go?", a: "DEXTradeByTokens reaches history on the archive dataset from mid-2024; add dataset: archive or combined to the Solana root for windows beyond the realtime one." },
  ]}
/>

## Related pages

- [Solana DEX trades API](/docs/blockchain/Solana/solana-dextrades)
- [Crypto Trades API](/docs/trading/crypto-trades-api/trades-api)
- [Solana API hub](/docs/blockchain/Solana/)
- [Shred streams for Solana](/docs/streams/real-time-solana-data/)
