---
title: "GMGN-style Token Discovery on Ethereum: New Tokens, Smart Money, DEX Activity"
sidebar_label: GMGN
description: "GMGN-style token discovery on Ethereum via Bitquery GraphQL: new tokens' first trades, token stats and market cap, top bought and sold tokens, top traders."
keywords:
  - GMGN API
  - GMGN alternative Ethereum
  - new tokens Ethereum API
  - smart money Ethereum API
  - Ethereum DEX activity API
---

import FAQ from "@site/src/components/FAQ";

# GMGN-style Token Discovery on Ethereum: New Tokens, Smart Money, DEX Activity

GMGN is a discovery screen: tokens that just started trading, the ones being bought and sold most, the wallets behind them, and a wallet's holdings when you click through. On Ethereum each of those is one query on Bitquery's `DEXTradeByTokens`, `Trading` and `Balances` cubes, and the same queries work on BSC, Base, Arbitrum and the other EVM chains with a network change. The worked token is Mog, `0xaaee1a9723aadb7afa2810263653a34ba2c21c7a`. Every example runs in the [IDE](https://ide.bitquery.io) on a free account. Pair feeds and terminal-style data are on the [BullX-style page](/docs/blockchain/Ethereum/dextrades/evm-bullx-api/); pool analytics are on the [GeckoTerminal-style page](/docs/blockchain/Ethereum/dextrades/evm-geckoterminal-api/).

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

## Tokens that just started trading

The first WETH-quoted trade of each token seen in the last six hours: `limitBy` keeps one row per token and the ascending order makes that row its earliest. Established tokens appear too, since the window only sees their first trade inside it; a token whose first trade ever falls in the window is new.

```graphql
{
  EVM(network: eth) {
    DEXTradeByTokens(
      where: {
        Block: { Time: { since_relative: { hours_ago: 6 } } }
        Trade: { Side: { Currency: { SmartContract: { is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" } } } }
      }
      limitBy: { by: Trade_Currency_SmartContract, count: 1 }
      orderBy: { ascending: Block_Time }
      limit: { count: 50 }
    ) {
      Block {
        Time
      }
      Trade {
        Currency {
          Symbol
          SmartContract
        }
        Dex {
          ProtocolName
          SmartContract
        }
        PriceInUSD
        Side {
          AmountInUSD
        }
      }
      Transaction {
        From
        Hash
      }
    }
  }
}
```

## Token stats with market cap

The Trading cube keeps hourly rows per token with the close price, USD volume and market cap; the latest row is the token card. Token ids are `bid:eth:<lowercase address>`.

```graphql
{
  Trading {
    Tokens(
      where: {
        Token: { Id: { is: "bid:eth:0xaaee1a9723aadb7afa2810263653a34ba2c21c7a" } }
        Interval: { Time: { Duration: { eq: 3600 } } }
        Block: { Time: { since_relative: { hours_ago: 3 } } }
      }
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Token {
        Symbol
        Network
      }
      Price {
        Ohlc {
          Open
          High
          Low
          Close
        }
      }
      Volume {
        Usd
      }
      Supply {
        MarketCap
      }
    }
  }
}
```

## Most bought and most sold tokens

USD bought and sold per token over the last day. `Side.Type` names the counter-side, so the token was bought where the side was sold; sort on `bought` or `sold`. The single-trade USD cap keeps mispriced rows out of the sums.

```graphql
{
  EVM(network: eth) {
    DEXTradeByTokens(
      orderBy: { descendingByField: "bought" }
      limit: { count: 20 }
      where: {
        Trade: { Side: { AmountInUSD: { lt: "10000000" } } }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      Trade {
        Currency {
          Symbol
          SmartContract
        }
      }
      bought: sum(of: Trade_Side_AmountInUSD, if: { Trade: { Side: { Type: { is: sell } } } })
      sold: sum(of: Trade_Side_AmountInUSD, if: { Trade: { Side: { Type: { is: buy } } } })
      trades: count
      makers: uniq(of: Transaction_From)
    }
  }
}
```

## Top traders of a token

Rank by `Transaction.From`, the wallet that sent the swap, with what each bought and sold. Saved query [here](https://ide.bitquery.io/top-traders-of-a-token_7).

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

## DEX activity across Ethereum

Trades, USD volume and active pools per protocol over the last day. Saved query [here](https://ide.bitquery.io/dex-markets).

```graphql
{
  EVM(network: eth) {
    DEXTradeByTokens(
      orderBy: { descendingByField: "trades" }
      where: {
        Trade: { Side: { AmountInUSD: { lt: "10000000" } } }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      Trade {
        Dex {
          ProtocolName
          ProtocolFamily
        }
      }
      trades: count
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
      pools: uniq(of: Trade_Dex_SmartContract)
      makers: uniq(of: Transaction_From)
    }
  }
}
```

## Trading pairs on one DEX

The busiest Uniswap v3 pools of the last day, one row per pool. Saved query [here](https://ide.bitquery.io/trading-pairs-on-a-specific-dex).

```graphql
{
  EVM(network: eth) {
    DEXTradeByTokens(
      orderBy: { descendingByField: "trades" }
      limit: { count: 20 }
      limitBy: { by: Trade_Dex_SmartContract, count: 1 }
      where: {
        Trade: {
          Dex: { ProtocolName: { is: "uniswap_v3" } }
          Side: { AmountInUSD: { lt: "10000000" } }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      Trade {
        Dex {
          SmartContract
        }
        Currency {
          Symbol
          SmartContract
        }
        Side {
          Currency {
            Symbol
          }
        }
      }
      trades: count
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
    }
  }
}
```

## Latest trades on one DEX

Both sides of the newest Uniswap v3 swaps with USD and the sender. Saved query [here](https://ide.bitquery.io/latest-trades_5).

```graphql
{
  EVM(network: eth) {
    DEXTrades(
      where: { Trade: { Dex: { ProtocolName: { is: "uniswap_v3" } } } }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
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
        Dex {
          SmartContract
        }
      }
      Transaction {
        From
        Hash
      }
    }
  }
}
```

## A wallet's token balances

The `Balances` cube returns the current balance of every token a wallet holds; the example is a wallet from the whale feed. Saved query [here](https://ide.bitquery.io/balance-of-a-wallet_1).

```graphql
{
  EVM(network: eth) {
    Balances(
      where: { Balance: { Address: { is: "0xae2fc483527b8ef99eb5d9b44875f005ba1fae13" } } }
      orderBy: { descending: Balance_Amount }
      limit: { count: 20 }
    ) {
      Currency {
        Symbol
        SmartContract
      }
      Balance {
        Amount
      }
    }
  }
}
```

<FAQ
  items={[
    { q: "How do I find new tokens on Ethereum with an API?", a: "Query DEXTradeByTokens over a short window with limitBy on Trade.Currency.SmartContract and ascending time; each row is a token's first trade in the window. Pair it with PoolCreated events for the pool side." },
    { q: "How do I get a token's market cap?", a: "Trading.Tokens keeps hourly rows per token with Supply.MarketCap, price and USD volume. Use the id bid:eth: followed by the lowercase address." },
    { q: "Which address is the trader?", a: "Transaction.From, the wallet that sent the swap. Trade.Buyer and Trade.Seller are often routers or pool managers, so rankings use Transaction.From." },
    { q: "Why cap single-trade USD in rankings?", a: "A thin pool can price one trade at millions of dollars. The cap on Trade.Side.AmountInUSD keeps those rows out of the sums without changing the counts." },
    { q: "Does this work on BSC or Base?", a: "Yes. Change network and the addresses; the cubes and fields are the same on every EVM chain Bitquery indexes." },
  ]}
/>

## Related pages

- [BullX-style EVM API](/docs/blockchain/Ethereum/dextrades/evm-bullx-api/)
- [GeckoTerminal-style EVM API](/docs/blockchain/Ethereum/dextrades/evm-geckoterminal-api/)
- [Latest trading pairs API](/docs/blockchain/Ethereum/dextrades/latest-trading-pairs-api)
- [Ethereum token balance API](/docs/blockchain/Ethereum/balances/)
