---
sidebar_position: 1
title: "GeckoTerminal-style Solana API: Pair Trades, Buys, Sells, Makers, Top Pairs"
sidebar_label: "GeckoTerminal Solana"
description: "GeckoTerminal-style Solana pool data with Bitquery GraphQL: live pair trades, buys, sells, makers and volume, 1-minute candles, pool reserves, and top pairs."
keywords:
  - GeckoTerminal Solana API
  - Solana pool trades API
  - Solana buys sells makers API
  - Solana pair OHLC API
  - GeckoTerminal alternative API
---

import VideoPlayer from "../../../src/components/videoplayer.js";
import FAQ from "@site/src/components/FAQ";

# GeckoTerminal-style Solana API: Pair Trades, Buys, Sells, Makers, Top Pairs

A GeckoTerminal pool page is a handful of numbers over one market: the trades scrolling in, buys against sells, how many wallets made them, the volume, the candles and the reserves. Each of those is one Bitquery query over the Solana `DEXTradeByTokens` and `DEXPools` cubes, filtered on the pool's market address, and the same queries cover every Solana DEX Bitquery indexes. The worked pool is the WSOL/USDC Orca Whirlpool at `Czfq3xZZDmsdGdUyrNLtRhGc47cXcZtLG4crryfu44zE`, one of the busiest markets on the chain, so every example returns rows at any hour. Every example runs in the [IDE](https://ide.bitquery.io) on a free account; Solana queries go to the `eap` endpoint. The [EVM version](/docs/blockchain/Ethereum/dextrades/evm-geckoterminal-api/) covers Ethereum and the other EVM chains.

## Recommended: Trading API queries (real-time + last ~30 days)

### Live trades with USD price, market cap and supply

Streams MEV-filtered trades across all 9 chains; add `Network: {is: "Solana"}` inside `Pair.Market` to scope to one chain. Run it [in the IDE](https://ide.bitquery.io/Trading-API-Live-Trades-All-Chains).

```graphql
subscription {
  Trading {
    Trades {
      Block { Time }
      Price
      PriceInUsd
      Amounts { Base Quote }
      AmountsInUsd { Base Quote }
      Trader { Address }
      Pair {
        Token { Symbol Network }
        QuoteToken { Symbol }
        Market { Protocol Network }
      }
    }
  }
}
```

### Most accurate token price with 1-minute OHLC (top market)

Returns the token's price from its top-volume market via `Ranking: { Position: { eq: 1 } }`; swap the token address and network for your token. Run it [in the IDE](https://ide.bitquery.io/Trading-API-Token-Price-Top-Market-Rank-1).

```graphql
{
  Trading {
    Pairs(
      where: {
        Token: {Address: {is: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"}, Network: {is: "Solana"}}
        Ranking: {Position: {eq: 1}}
        Interval: {Time: {Duration: {eq: 60}}}
        Price: {IsQuotedInUsd: true}
      }
      limit: {count: 1}
      orderBy: {descending: Block_Time}
    ) {
      Token { Symbol Address }
      QuoteToken { Symbol }
      Market { Protocol Address Network }
      Price { IsQuotedInUsd Ohlc { Open High Low Close } Average { Mean } }
      Volume { Base Usd }
      Block { Time }
    }
  }
}
```

The chain-level queries below are the tool for history older than about 30 days and for per-pool detail.

## Live trades of a pool

Filter `Trade.Market.MarketAddress` and put the token you want priced under `Trade.Currency`. Each message is one swap with the amount, the price in the counter token and in USD, the side and the signer. Saved stream [here](https://ide.bitquery.io/Get-Solana-pair-trades-data-just-like-geckoTerminal_1).

```graphql
subscription {
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Market: { MarketAddress: { is: "Czfq3xZZDmsdGdUyrNLtRhGc47cXcZtLG4crryfu44zE" } }
          Currency: { MintAddress: { is: "So11111111111111111111111111111111111111112" } }
        }
        Transaction: { Result: { Success: true } }
      }
    ) {
      Block {
        Time
      }
      Trade {
        Currency {
          Symbol
        }
        Amount
        Price
        PriceInUSD
        Side {
          Currency {
            Symbol
          }
          Amount
          Type
        }
      }
      Transaction {
        Maker: Signer
        Signature
      }
    }
  }
}
```

## Buys, sells, makers, buyers, sellers and volume of a pool

The stat block of a pool page in one query: the last hour with a five-minute sub-window on every metric. `Side.Type` names the counter-side of each trade, so WSOL was bought where the side was sold, and wallets are counted by transaction signer. Saved query [here](https://ide.bitquery.io/Buys-Sells-BuyVolume-SellVolume-Makers-TotalTradedVolume-PriceinUSD-for-solana-token-pair00_2).

```graphql
{
  Solana {
    DEXTradeByTokens(
      where: {
        Transaction: { Result: { Success: true } }
        Trade: {
          Market: { MarketAddress: { is: "Czfq3xZZDmsdGdUyrNLtRhGc47cXcZtLG4crryfu44zE" } }
          Currency: { MintAddress: { is: "So11111111111111111111111111111111111111112" } }
        }
        Block: { Time: { since_relative: { hours_ago: 1 } } }
      }
    ) {
      Trade {
        Currency {
          Symbol
          MintAddress
        }
        Side {
          Currency {
            Symbol
          }
        }
        start: PriceInUSD(minimum: Block_Slot)
        min5: PriceInUSD(minimum: Block_Slot, if: { Block: { Time: { after_relative: { minutes_ago: 5 } } } })
        end: PriceInUSD(maximum: Block_Slot)
      }
      trades: count
      trades5m: count(if: { Block: { Time: { after_relative: { minutes_ago: 5 } } } })
      buys: count(if: { Trade: { Side: { Type: { is: sell } } } })
      sells: count(if: { Trade: { Side: { Type: { is: buy } } } })
      makers: uniq(of: Transaction_Signer)
      makers5m: uniq(of: Transaction_Signer, if: { Block: { Time: { after_relative: { minutes_ago: 5 } } } })
      buyers: uniq(of: Transaction_Signer, if: { Trade: { Side: { Type: { is: sell } } } })
      sellers: uniq(of: Transaction_Signer, if: { Trade: { Side: { Type: { is: buy } } } })
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
      volumeUsd5m: sum(of: Trade_Side_AmountInUSD, if: { Block: { Time: { after_relative: { minutes_ago: 5 } } } })
      buyVolumeUsd: sum(of: Trade_Side_AmountInUSD, if: { Trade: { Side: { Type: { is: sell } } } })
      sellVolumeUsd: sum(of: Trade_Side_AmountInUSD, if: { Trade: { Side: { Type: { is: buy } } } })
    }
  }
}
```

## One-minute candles for the pool

Thirty one-minute candles with volume and trade count. `PriceAsymmetry` below 0.1 drops trades whose two sides disagree on price.

```graphql
{
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Market: { MarketAddress: { is: "Czfq3xZZDmsdGdUyrNLtRhGc47cXcZtLG4crryfu44zE" } }
          Currency: { MintAddress: { is: "So11111111111111111111111111111111111111112" } }
          PriceAsymmetry: { lt: 0.1 }
        }
        Transaction: { Result: { Success: true } }
        Block: { Time: { since_relative: { minutes_ago: 30 } } }
      }
      limit: { count: 30 }
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

## Reserves of the pool

The newest `DEXPools` row for the market carries both reserves after the last change, with the quote side in USD.

```graphql
{
  Solana {
    DEXPools(
      where: {
        Pool: { Market: { MarketAddress: { is: "Czfq3xZZDmsdGdUyrNLtRhGc47cXcZtLG4crryfu44zE" } } }
        Transaction: { Result: { Success: true } }
      }
      orderBy: { descending: Block_Time }
      limit: { count: 1 }
    ) {
      Block {
        Time
      }
      Pool {
        Dex {
          ProtocolName
        }
        Market {
          BaseCurrency {
            Symbol
          }
          QuoteCurrency {
            Symbol
          }
        }
        Base {
          PostAmount
        }
        Quote {
          PostAmount
          PostAmountInUSD
          PriceInUSD
        }
      }
    }
  }
}
```

## Top pairs on Solana

The busiest WSOL-quoted markets of the last hour with the numbers a pair list shows. Aggregates only run as queries, so poll this rather than subscribing. Saved query [here](https://ide.bitquery.io/Get-Top-Pairs-on-Solana-on-GeckoTerminal_1).

```graphql
{
  Solana {
    DEXTradeByTokens(
      where: {
        Transaction: { Result: { Success: true } }
        Trade: {
          Side: { Currency: { MintAddress: { is: "So11111111111111111111111111111111111111112" } } }
        }
        Block: { Time: { since_relative: { hours_ago: 1 } } }
      }
      orderBy: { descendingByField: "trades" }
      limit: { count: 10 }
    ) {
      Trade {
        Currency {
          Name
          Symbol
          MintAddress
        }
        Market {
          MarketAddress
        }
        Dex {
          ProtocolName
        }
        start: PriceInUSD(minimum: Block_Slot)
        min5: PriceInUSD(minimum: Block_Slot, if: { Block: { Time: { after_relative: { minutes_ago: 5 } } } })
        end: PriceInUSD(maximum: Block_Slot)
      }
      makers: uniq(of: Transaction_Signer)
      trades: count
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
      buyVolumeUsd: sum(of: Trade_Side_AmountInUSD, if: { Trade: { Side: { Type: { is: sell } } } })
      sellVolumeUsd: sum(of: Trade_Side_AmountInUSD, if: { Trade: { Side: { Type: { is: buy } } } })
      buys: count(if: { Trade: { Side: { Type: { is: sell } } } })
      sells: count(if: { Trade: { Side: { Type: { is: buy } } } })
    }
  }
}
```

<FAQ
  items={[
    { q: "How do I get GeckoTerminal-style pool data for Solana from an API?", a: "Filter the Solana DEXTradeByTokens cube on Trade.Market.MarketAddress for trades, stats and candles, and DEXPools on the same address for reserves. The queries on this page cover every panel of a pool page." },
    { q: "Why do buys use Side.Type sell?", a: "Side.Type describes the counter-side of the trade. When the token under Trade.Currency is bought, the side token is sold, so buys of WSOL are rows where the side type is sell." },
    { q: "How do I count makers, buyers and sellers?", a: "Use uniq over Transaction_Signer, with an if on Side.Type for buyers and sellers. The signer is the wallet that sent the swap, which is what a maker column shows." },
    { q: "Can I get the candles as a stream?", a: "No. Interval aggregates run as queries only. Subscribe to the pool's trades for live ticks and build candles on your side, or poll the candle query." },
    { q: "Where is the pool's market address?", a: "Every trade row carries Trade.Market.MarketAddress. The top pairs query lists the busiest markets with their addresses, and any Solana explorer shows it on the pool page." },
  ]}
/>

## Video Tutorial

### Get Gecko Terminal Data with Bitquery API and Streams

<VideoPlayer url="https://youtu.be/VtT5Kq5ckCs" />

## Related pages

- [Solana DEX trades API](/docs/blockchain/Solana/solana-dextrades)
- [GeckoTerminal-style EVM API](/docs/blockchain/Ethereum/dextrades/evm-geckoterminal-api/)
- [Crypto Trades API](/docs/trading/crypto-trades-api/trades-api)
- [Solana API hub](/docs/blockchain/Solana/)
