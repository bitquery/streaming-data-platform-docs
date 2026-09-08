---
title: "Stablecoin Trades API: USDT and USDC DEX Trades, Depeg Checks and Wallet Flows"
sidebar_label: "Stablecoin Trades API"
description: "Stablecoin DEX trades on Ethereum, Solana and Tron via Bitquery GraphQL: live USDT streams, off-peg trade checks with a USD floor, a wallet's stablecoin flows."
keywords:
  - stablecoin trades API
  - USDT trades API
  - USDC depeg API
  - stablecoin price feed
  - Tron USDT DEX trades
---

import FAQ from "@site/src/components/FAQ";

# Stablecoin Trades API: USDT and USDC DEX Trades, Depeg Checks and Wallet Flows

Stablecoins are the quote side of most DEX volume, so a stablecoin trade feed is close to a feed of everything. This page filters Bitquery's trade cubes down to one stablecoin at a time on Ethereum, Solana and Tron: the live trades, the trades that printed away from one dollar, and what one wallet did with its USDC. Every example runs in the [IDE](https://ide.bitquery.io) on a free account. Solana queries go to the `eap` endpoint, Ethereum and Tron to `graphql`. The [Trading cube](/docs/trading/crypto-trades-api/trades-api) gives the same trades across nine chains with USD on every row for the last month, which is the first section; the chain cubes below add history and per-pool detail.

## Live USDT trades across all chains

One subscription, every chain, filtered on the symbol.

```graphql
subscription {
  Trading {
    Trades(where: { Pair: { Currency: { Symbol: { is: "USDT" } } } }) {
      Block {
        Time
      }
      Price
      PriceInUsd
      AmountsInUsd {
        Base
        Quote
      }
      Pair {
        Currency {
          Id
          Symbol
        }
        Token {
          Symbol
          Network
        }
        QuoteToken {
          Symbol
        }
        Market {
          Network
          Protocol
        }
      }
    }
  }
}
```

For ready-made stablecoin dashboards, browse [DEXrabbit's Stablecoins category](https://dexrabbit.bitquery.io/categories/stablecoins).

## Ethereum

### USDT trades on Ethereum, live

`DEXTradeByTokens` gives one row per trade with USDT under `Trade.Currency`, whichever side it was on. Saved stream [here](https://ide.bitquery.io/Stablecoin-trades-for-etheruem).

```graphql
subscription {
  EVM(network: eth) {
    DEXTradeByTokens(
      where: {
        Trade: { Currency: { SmartContract: { is: "0xdac17f958d2ee523a2206206994597c13d831ec7" } } }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
        From
      }
      Trade {
        Amount
        AmountInUSD
        Price
        PriceInUSD
        Side {
          Type
          Amount
          AmountInUSD
          Currency {
            Symbol
            SmartContract
          }
        }
        Dex {
          ProtocolName
          SmartContract
        }
      }
    }
  }
}
```

### USDT trades away from the peg on Ethereum {#stablecoin-depeg-tracking-stream-for-evm}

A depeg check has to ignore dust and thin pairs, or it fires all day. This query keeps trades against WETH or USDC worth over a thousand dollars whose USDT price printed more than half a percent from one dollar, over the last day. Two ranges on one field need `any`; a single `PriceInUSD: {lt, gt}` block is an AND and matches nothing. Widen the band or shorten the window for alerts, or run it as a subscription without the `Block` filter. Saved query [here](https://ide.bitquery.io/Stablecoin-Depeg-tracking-Stream-for-evm).

```graphql
{
  EVM(network: eth) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: { SmartContract: { is: "0xdac17f958d2ee523a2206206994597c13d831ec7" } }
          Side: {
            AmountInUSD: { gt: "1000" }
            Currency: {
              SmartContract: {
                in: [
                  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
                  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
                ]
              }
            }
          }
        }
        any: [
          { Trade: { PriceInUSD: { lt: 0.995 } } }
          { Trade: { PriceInUSD: { gt: 1.005 } } }
        ]
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      limit: { count: 50 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Trade {
        PriceInUSD
        Amount
        AmountInUSD
        Side {
          Currency {
            Symbol
          }
          AmountInUSD
        }
        Dex {
          ProtocolName
          SmartContract
        }
      }
    }
  }
}
```

## Solana

### USDT trades on Solana, live

Both sides of each swap, with the accounts and the market. Saved stream [here](https://ide.bitquery.io/solana-trades-subscription_10_1).

```graphql
subscription {
  Solana {
    DEXTrades(
      where: {
        any: [
          { Trade: { Buy: { Currency: { MintAddress: { is: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB" } } } } }
          { Trade: { Sell: { Currency: { MintAddress: { is: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB" } } } } }
        ]
        Transaction: { Result: { Success: true } }
      }
    ) {
      Block {
        Time
        Slot
      }
      Transaction {
        Signature
        Signer
      }
      Trade {
        Dex {
          ProgramAddress
          ProtocolName
        }
        Market {
          MarketAddress
        }
        Buy {
          Amount
          AmountInUSD
          Price
          PriceInUSD
          Currency {
            Symbol
            MintAddress
          }
          Account {
            Address
          }
        }
        Sell {
          Amount
          AmountInUSD
          Currency {
            Symbol
            MintAddress
          }
          Account {
            Address
          }
        }
      }
    }
  }
}
```

### One wallet's stablecoin flows on Solana

Filter the transaction signer and the stablecoin mints. The example wallet swaps USDC around the clock at the time of writing; the totals split what it bought from what it sold. Saved query [here](https://ide.bitquery.io/real-time-stablecoin-portfolio_2).

```graphql
{
  Solana {
    DEXTradeByTokens(
      where: {
        Transaction: {
          Signer: { is: "3i51cKbLbaKAqvRJdCUaq9hsnvf9kqCfMujNgFj7nRKt" }
          Result: { Success: true }
        }
        Trade: {
          Currency: {
            MintAddress: {
              in: [
                "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
                "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
              ]
            }
          }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      Trade {
        Currency {
          Symbol
          MintAddress
        }
      }
      trades: count
      bought: sum(of: Trade_Amount, if: { Trade: { Side: { Type: { is: sell } } } })
      sold: sum(of: Trade_Amount, if: { Trade: { Side: { Type: { is: buy } } } })
    }
  }
}
```

Drop the aggregates and the `Block` filter and subscribe to the same `where` for each swap as it happens:

```graphql
subscription {
  Solana {
    DEXTradeByTokens(
      where: {
        Transaction: {
          Signer: { is: "3i51cKbLbaKAqvRJdCUaq9hsnvf9kqCfMujNgFj7nRKt" }
          Result: { Success: true }
        }
        Trade: {
          Currency: {
            MintAddress: {
              in: [
                "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
                "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
              ]
            }
          }
        }
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
        AmountInUSD
        Side {
          Type
          Amount
          Currency {
            Symbol
          }
        }
      }
      Transaction {
        Signature
      }
    }
  }
}
```

### USDT trades away from the peg on Solana

Same band and floor as the Ethereum check, against USDC or WSOL so that thin memecoin pairs do not set off the alarm. Saved query [here](https://ide.bitquery.io/stablecoin-depeg-tracking-stream-for-USDC).

```graphql
{
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: { MintAddress: { is: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB" } }
          Side: {
            AmountInUSD: { gt: "1000" }
            Currency: {
              MintAddress: {
                in: [
                  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
                  "So11111111111111111111111111111111111111112"
                ]
              }
            }
          }
        }
        any: [
          { Trade: { PriceInUSD: { lt: 0.995 } } }
          { Trade: { PriceInUSD: { gt: 1.005 } } }
        ]
        Transaction: { Result: { Success: true } }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      limit: { count: 50 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Transaction {
        Signature
      }
      Trade {
        PriceInUSD
        Amount
        AmountInUSD
        Side {
          Currency {
            Symbol
          }
          AmountInUSD
        }
        Dex {
          ProtocolName
        }
        Market {
          MarketAddress
        }
      }
    }
  }
}
```

## Tron

### USDT trades on Tron, live

Most Tron DEX volume is USDT against TRX on SunSwap. Streams on Tron match currencies by symbol; use the contract address, `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`, in queries. Saved stream [here](https://ide.bitquery.io/Stablecoin-trades-for-tron).

```graphql
subscription {
  Tron {
    DEXTradeByTokens(where: { Trade: { Currency: { Symbol: { is: "USDT" } } } }) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Trade {
        Amount
        AmountInUSD
        PriceInUSD
        Side {
          Type
          Amount
          Currency {
            Symbol
          }
        }
        Dex {
          ProtocolName
        }
      }
    }
  }
}
```

### USDT trades away from the peg on Tron

The band check for Tron, with the USD floor and no counter-token list, since almost everything on Tron is quoted in TRX. Saved query [here](https://ide.bitquery.io/Stablecoin-Depeg-tracking-Stream-for-tron).

```graphql
{
  Tron {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: { SmartContract: { is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t" } }
          Side: { AmountInUSD: { gt: "1000" } }
        }
        any: [
          { Trade: { PriceInUSD: { lt: 0.995 } } }
          { Trade: { PriceInUSD: { gt: 1.005 } } }
        ]
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      limit: { count: 50 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Trade {
        PriceInUSD
        Amount
        AmountInUSD
        Side {
          Currency {
            Symbol
          }
          AmountInUSD
        }
        Dex {
          ProtocolName
        }
      }
    }
  }
}
```

<FAQ
  items={[
    { q: "How do I get all USDT DEX trades from an API?", a: "Subscribe to Trading.Trades with the symbol filter for every chain at once, or to the chain cube with the token's contract or mint under Trade.Currency for one chain with per-pool detail." },
    { q: "Why does a price filter with both lt and gt return nothing?", a: "The two bounds in one block are an AND, and no price is below 0.995 and above 1.005 at once. Put the two ranges in an any list as the depeg queries do." },
    { q: "Why filter the counter token and add a USD floor for depeg checks?", a: "Thin pairs against small tokens print stablecoin prices a few percent off all day. Keeping trades against a major token over a thousand dollars leaves only prices a real trader could act on." },
    { q: "How do I stream a wallet's stablecoin trades on Solana?", a: "Filter Transaction.Signer and the stablecoin mints on DEXTradeByTokens as a subscription. Signer is the wallet that sent the swap, which is what a portfolio view keys on." },
    { q: "Why does the Tron stream filter by symbol rather than address?", a: "Tron subscriptions currently match currencies by Symbol; the contract-address filter works in queries. Use the address in queries and the symbol in streams." },
  ]}
/>

## Related pages

- [Crypto Trades API](/docs/trading/crypto-trades-api/trades-api)
- [Ethereum DEX trades API](/docs/blockchain/Ethereum/dextrades/dex-api)
- [Solana DEX trades API](/docs/blockchain/Solana/solana-dextrades)
- [Tron DEX trades API](/docs/blockchain/Tron/tron-dextrades)
