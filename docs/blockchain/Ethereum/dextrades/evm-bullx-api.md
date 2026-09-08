---
sidebar_position: 1
sidebar_label: BullX
title: "BullX-style Trading Terminal Data on Ethereum: Pair Feeds, Prices, Traders"
description: "BullX-style terminal data on Ethereum via Bitquery GraphQL: live pair trades, token price and stats, top traders, a wallet's trades, whale swaps and new pools."
keywords:
  - BullX API
  - BullX alternative Ethereum
  - trading terminal API Ethereum
  - Ethereum pair trades stream
  - whale swaps Ethereum API
---

import FAQ from "@site/src/components/FAQ";

# BullX-style Trading Terminal Data on Ethereum: Pair Feeds, Prices, Traders

A trading terminal like BullX is built from a few feeds: the trades of the pair on screen, the token's price and stats, who the biggest traders are, what one wallet has been doing, and the large swaps hitting the chain. Each is one Bitquery query or subscription on Ethereum, and the same filters work on BSC, Base, Arbitrum and the other EVM chains by changing the network. The worked token is Mog, `0xaaee1a9723aadb7afa2810263653a34ba2c21c7a`, in its Uniswap v2 pool with WETH, `0xc2eab7d33d3cb97692ecb231a5d0e4a649cb539d`. Every example runs in the [IDE](https://ide.bitquery.io) on a free account. For pool-page analytics such as trending pools, candles and reserves, see the [GeckoTerminal-style page](/docs/blockchain/Ethereum/dextrades/evm-geckoterminal-api/); for token discovery, the [GMGN-style page](/docs/blockchain/Ethereum/dextrades/evm-gmgn-api/).

## Recommended: Trading API queries (real-time + last ~30 days)

### Live trades with USD price, market cap and supply

Streams MEV-filtered trades across all 9 chains; the network filter scopes it to Ethereum. Run it [in the IDE](https://ide.bitquery.io/Trading-API-Live-Trades-All-Chains).

```graphql
subscription {
  Trading {
    Trades(where: { Pair: { Market: { Network: { is: "Ethereum" } } } }) {
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
        Token: {Address: {is: "0xaaee1a9723aadb7afa2810263653a34ba2c21c7a"}, Network: {is: "Ethereum"}}
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

## Live trades of a pair

Filter the pool under `Trade.Dex.SmartContract` and the token under `Trade.Currency`. Each message is one swap with the amount, the USD price, the side and the wallet that sent it. Saved stream [here](https://ide.bitquery.io/Get-pair-trades-data-just-like-dexcsreener).

```graphql
subscription {
  EVM(network: eth) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: { SmartContract: { is: "0xc2eab7d33d3cb97692ecb231a5d0e4a649cb539d" } }
          Currency: { SmartContract: { is: "0xaaee1a9723aadb7afa2810263653a34ba2c21c7a" } }
        }
      }
    ) {
      Block {
        Time
      }
      Trade {
        Amount
        PriceInUSD
        Currency {
          Symbol
        }
        Side {
          Amount
          AmountInUSD
          Type
          Currency {
            Symbol
          }
        }
        Dex {
          ProtocolName
        }
      }
      Transaction {
        Maker: From
        Hash
      }
    }
  }
}
```

## Price and stats of a token

The header block of a token page in one query: the price at the start and end of the window, trades, buys, sells, makers and USD volume, over the last day with a one-hour sub-window. `Side.Type` names the counter-side of a trade, so the token was bought where the side was sold. Saved query [here](https://ide.bitquery.io/Buys-Sells-BuyVolume-SellVolume-Makers-TotalTradedVolume-PriceinUSD-for-a-eth-pair).

```graphql
{
  EVM(network: eth) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: { SmartContract: { is: "0xc2eab7d33d3cb97692ecb231a5d0e4a649cb539d" } }
          Currency: { SmartContract: { is: "0xaaee1a9723aadb7afa2810263653a34ba2c21c7a" } }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      Trade {
        Currency {
          Symbol
        }
        Side {
          Currency {
            Symbol
          }
        }
        start: PriceInUSD(minimum: Block_Number)
        end: PriceInUSD(maximum: Block_Number)
      }
      trades: count
      trades1h: count(if: { Block: { Time: { after_relative: { hours_ago: 1 } } } })
      buys: count(if: { Trade: { Side: { Type: { is: sell } } } })
      sells: count(if: { Trade: { Side: { Type: { is: buy } } } })
      makers: uniq(of: Transaction_From)
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
      volumeUsd1h: sum(of: Trade_Side_AmountInUSD, if: { Block: { Time: { after_relative: { hours_ago: 1 } } } })
      buyVolumeUsd: sum(of: Trade_Side_AmountInUSD, if: { Trade: { Side: { Type: { is: sell } } } })
      sellVolumeUsd: sum(of: Trade_Side_AmountInUSD, if: { Trade: { Side: { Type: { is: buy } } } })
    }
  }
}
```

## Top traders of a token

Rank by `Transaction.From`, the wallet that sent the swap, so routers and aggregators do not appear as traders. Saved query [here](https://ide.bitquery.io/top-traders-of-a-token_7).

```graphql
{
  EVM(network: eth) {
    DEXTradeByTokens(
      orderBy: { descendingByField: "volumeUsd" }
      limit: { count: 50 }
      where: {
        Trade: { Currency: { SmartContract: { is: "0xaaee1a9723aadb7afa2810263653a34ba2c21c7a" } } }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      Transaction {
        From
      }
      trades: count
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
      bought: sum(of: Trade_Amount, if: { Trade: { Side: { Type: { is: sell } } } })
      sold: sum(of: Trade_Amount, if: { Trade: { Side: { Type: { is: buy } } } })
    }
  }
}
```

## One wallet's trades

The Trading cube keys trades by wallet across chains, with USD on every row. The example is an Ethereum wallet with large trades at the time of writing; take any address from the top traders above. As a subscription without the `Block` filter the same `where` follows the wallet live.

```graphql
{
  Trading {
    Trades(
      where: {
        Trader: { Address: { is: "0xae2fc483527b8ef99eb5d9b44875f005ba1fae13" } }
        Pair: { Market: { Network: { is: "Ethereum" } } }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      orderBy: { descending: Block_Time }
      limit: { count: 50 }
    ) {
      Block {
        Time
      }
      Side
      PriceInUsd
      AmountsInUsd {
        Base
        Quote
      }
      Pair {
        Token {
          Symbol
        }
        QuoteToken {
          Symbol
        }
        Market {
          Protocol
          Address
        }
      }
    }
  }
}
```

## Whale swaps on Ethereum

Swaps over a hundred thousand dollars in the last hour, newest first. Drop the `Block` filter and subscribe for alerts.

```graphql
{
  Trading {
    Trades(
      where: {
        AmountsInUsd: { Base: { gt: 100000 } }
        Pair: { Market: { Network: { is: "Ethereum" } } }
        Block: { Time: { since_relative: { hours_ago: 1 } } }
      }
      orderBy: { descending: Block_Time }
      limit: { count: 50 }
    ) {
      Block {
        Time
      }
      Side
      Trader {
        Address
      }
      AmountsInUsd {
        Base
      }
      Pair {
        Token {
          Symbol
        }
        QuoteToken {
          Symbol
        }
        Market {
          Protocol
        }
      }
    }
  }
}
```

## New Uniswap v3 pools

The factory's `PoolCreated` event names both tokens, the fee tier and the new pool address. New pools on Ethereum arrive minutes to hours apart, so query the last day rather than waiting on a stream. Saved query [here](https://ide.bitquery.io/Latest-pools-created-Uniswap-v3_9).

```graphql
{
  EVM(network: eth) {
    Events(
      where: {
        Log: {
          SmartContract: { is: "0x1f98431c8ad98523631ae4a59f267346ea31f984" }
          Signature: { Name: { is: "PoolCreated" } }
        }
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
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
        }
      }
    }
  }
}
```

<FAQ
  items={[
    { q: "How do I get BullX-style trade feeds for Ethereum from an API?", a: "Subscribe to DEXTradeByTokens with the pool under Trade.Dex.SmartContract and the token under Trade.Currency. Each message is one swap with the USD price, the side and the wallet that sent it." },
    { q: "Which address is the trader on Ethereum?", a: "Transaction.From, the account that sent the swap transaction. Trade.Buyer and Trade.Seller are often routers or pool managers, so rankings use Transaction.From." },
    { q: "How do I follow one wallet across chains?", a: "Use Trading.Trades with Trader.Address; it covers Ethereum, BSC, Base, Arbitrum, Solana and more with USD on every row for the last month." },
    { q: "Why do buys use Side.Type sell?", a: "Side.Type describes the counter-side. When the token under Trade.Currency is bought, the side token is sold, so buys are rows where the side type is sell." },
    { q: "Does this work on BSC or Base?", a: "Yes. Change network to bsc or base and the pool and token addresses; the cubes and fields are the same on every EVM chain Bitquery indexes." },
  ]}
/>

## Related pages

- [GeckoTerminal-style EVM API](/docs/blockchain/Ethereum/dextrades/evm-geckoterminal-api/)
- [GMGN-style EVM API](/docs/blockchain/Ethereum/dextrades/evm-gmgn-api/)
- [Traders API](/docs/trading/crypto-trades-api/traders-api)
- [Ethereum DEX trades API](/docs/blockchain/Ethereum/dextrades/dex-api)
