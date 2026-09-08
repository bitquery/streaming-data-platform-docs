---
title: "Traders API: Stream and Rank Wallet Trades on Solana, Ethereum, BSC, Base"
sidebar_label: "Traders API"
description: "Wallet view of the Trading API: stream one or many wallets' DEX trades, filter by token, chain, DEX or pair, catch whale trades, rank traders by volume and PnL."
keywords:
  - traders API
  - wallet trade tracking API
  - real-time wallet trades stream
  - copy trading API Solana
  - whale trader alerts API
  - smart money tracking crypto
  - multi-wallet monitoring subscription
  - trader PnL GraphQL query
  - top traders by PnL API
---

import VideoPlayer from "../../../src/components/videoplayer.js";
import FAQ from "@site/src/components/FAQ";

# Traders API: Stream and Rank Wallet Trades on Solana, Ethereum, BSC, Base

The Traders API is the wallet view of `Trading.Trades`: every DEX trade a wallet makes on Solana, Ethereum, BSC, Base, Arbitrum and the other chains the cube covers, with the token pair, the USD amounts, the market and the side on each row. Filter on `Trader.Address` for one wallet, `in` for a watchlist, and combine with token, chain, DEX or pair filters. The cube keeps about a month of trades, which is where copy trading, whale alerts and leaderboards live; for older wallet history use the chain cubes. Every example runs in the [IDE](https://ide.bitquery.io) on a free account. The worked wallet, `AgmLJBMDCqWynYnQiPCuj9ewsNNsBJXyzoUhD9LJzN51`, is one of the most active Solana wallets at the time of writing; take any address from the top-traders query below.

## Video Tutorial

<VideoPlayer url="https://youtu.be/-Jwh2I46XIw" />

## How do I stream all trades of a wallet?

Every DEX trade the wallet sends, on every chain, as it lands. Saved stream [here](https://ide.bitquery.io/All-trades-of-a-trader).

```graphql
subscription {
  Trading {
    Trades(where: { Trader: { Address: { is: "AgmLJBMDCqWynYnQiPCuj9ewsNNsBJXyzoUhD9LJzN51" } } }) {
      Block {
        Time
      }
      Side
      Price
      PriceInUsd
      Amounts {
        Base
        Quote
      }
      AmountsInUsd {
        Base
        Quote
      }
      Pair {
        Token {
          Symbol
          Id
        }
        QuoteToken {
          Symbol
          Id
        }
        Market {
          Address
          Protocol
          Network
        }
      }
      TransactionHeader {
        Fee
      }
    }
  }
}
```

## How do I track a wallet's trades on one token?

The token can sit on either side of a pair, so match `Pair.Token.Id` or `Pair.QuoteToken.Id` with `any`. Token ids are `bid:<chain>:<address>`. Saved stream [here](https://ide.bitquery.io/trades-of-a-specific-trader-of-a-specific-token_1).

```graphql
subscription {
  Trading {
    Trades(
      where: {
        Trader: { Address: { is: "AgmLJBMDCqWynYnQiPCuj9ewsNNsBJXyzoUhD9LJzN51" } }
        any: [
          { Pair: { Token: { Id: { is: "bid:solana:AGi2s9zPRPHs3zEDPhPTroumTEXK5ufymYSfEFndCSSW" } } } }
          { Pair: { QuoteToken: { Id: { is: "bid:solana:AGi2s9zPRPHs3zEDPhPTroumTEXK5ufymYSfEFndCSSW" } } } }
        ]
      }
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
        }
      }
    }
  }
}
```

## How do I monitor several wallets in one subscription?

An `in` list on the trader address; each message carries the wallet it belongs to. Saved stream [here](https://ide.bitquery.io/How-do-I-monitor-multiple-wallets-in-one-subscription).

```graphql
subscription {
  Trading {
    Trades(
      where: {
        Trader: {
          Address: {
            in: [
              "AgmLJBMDCqWynYnQiPCuj9ewsNNsBJXyzoUhD9LJzN51"
              "Gygj9QQby4j2jryqyqBHvLP7ctv2SaANgh4sCb69BUpA"
              "FHpcNSe6tb2n15bAdq4BkeYWGyZKFD7yLYrH92ng7wCT"
            ]
          }
        }
      }
    ) {
      Block {
        Time
      }
      Trader {
        Address
      }
      Side
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
          Network
          Protocol
        }
      }
    }
  }
}
```

## How do I stream a wallet's trades on one chain?

Add `Pair.Market.Network`. Saved stream [here](https://ide.bitquery.io/How-do-I-stream-a-wallets-trades-on-a-specific-chain).

```graphql
subscription {
  Trading {
    Trades(
      where: {
        Pair: { Market: { Network: { is: "Solana" } } }
        Trader: { Address: { is: "AgmLJBMDCqWynYnQiPCuj9ewsNNsBJXyzoUhD9LJzN51" } }
      }
    ) {
      Block {
        Time
      }
      Side
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
          Address
          Protocol
        }
      }
    }
  }
}
```

## How do I catch whale trades as they happen?

Trades over a hundred thousand dollars on any chain, a handful a minute across the cube. Saved stream [here](https://ide.bitquery.io/Stream---Trades-over-100k-usd).

```graphql
subscription {
  Trading {
    Trades(where: { AmountsInUsd: { Base: { gt: 100000 } } }) {
      Block {
        Time
      }
      Side
      Trader {
        Address
      }
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
          Network
          Protocol
        }
      }
    }
  }
}
```

## How do I get the whale trades of one wallet?

Combine the trader and the USD floor. The example wallet moves six figures of stablecoins on Manifest a few times a day, so the query form over the last day returns rows; the same `where` as a subscription fires only when the wallet trades. Saved query [here](https://ide.bitquery.io/How-do-I-stream-whale-trades-for-a-specific-wallet).

```graphql
{
  Trading {
    Trades(
      where: {
        Trader: { Address: { is: "5edLA6ZZFAUfDa8mkdPTi6GXY7fqiZ3CrbRwF7dCGjgr" } }
        AmountsInUsd: { Base: { gt: 100000 } }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
      orderBy: { descending: Block_Time }
      limit: { count: 20 }
    ) {
      Block {
        Time
      }
      Side
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
          Network
          Protocol
        }
      }
    }
  }
}
```

## How do I get a wallet's recent trades?

The last ten minutes as a query, newest first. Saved query [here](https://ide.bitquery.io/How-do-I-get-recent-trades-for-a-wallet-last-10-minutes).

```graphql
{
  Trading {
    Trades(
      orderBy: { descending: Block_Time }
      limit: { count: 50 }
      where: {
        Block: { Time: { since_relative: { minutes_ago: 10 } } }
        Trader: { Address: { is: "AgmLJBMDCqWynYnQiPCuj9ewsNNsBJXyzoUhD9LJzN51" } }
      }
    ) {
      Block {
        Time
      }
      Side
      Price
      PriceInUsd
      AmountsInUsd {
        Base
        Quote
      }
      Pair {
        Token {
          Symbol
          Id
        }
        QuoteToken {
          Symbol
        }
        Market {
          Address
          Protocol
          Network
        }
      }
    }
  }
}
```

## How do I watch several wallets on one token?

A watchlist and a token together, the copy-trading shape. Saved stream [here](https://ide.bitquery.io/How-do-I-monitor-multiple-wallets-trading-a-specific-token).

```graphql
subscription {
  Trading {
    Trades(
      where: {
        Trader: {
          Address: {
            in: [
              "AgmLJBMDCqWynYnQiPCuj9ewsNNsBJXyzoUhD9LJzN51"
              "Gygj9QQby4j2jryqyqBHvLP7ctv2SaANgh4sCb69BUpA"
            ]
          }
        }
        any: [
          { Pair: { Token: { Id: { is: "bid:solana:AGi2s9zPRPHs3zEDPhPTroumTEXK5ufymYSfEFndCSSW" } } } }
          { Pair: { QuoteToken: { Id: { is: "bid:solana:AGi2s9zPRPHs3zEDPhPTroumTEXK5ufymYSfEFndCSSW" } } } }
        ]
      }
    ) {
      Block {
        Time
      }
      Trader {
        Address
      }
      Side
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
      }
    }
  }
}
```

## How do I stream a wallet's trades on one DEX?

`Pair.Market.Program` is the DEX program on Solana and the router or pool manager on EVM chains; the example is Raydium's CPMM. Saved stream [here](https://ide.bitquery.io/How-do-I-stream-a-wallets-trades-on-a-specific-DEX).

```graphql
subscription {
  Trading {
    Trades(
      where: {
        Trader: { Address: { is: "AgmLJBMDCqWynYnQiPCuj9ewsNNsBJXyzoUhD9LJzN51" } }
        Pair: { Market: { Program: { is: "CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C" } } }
      }
    ) {
      Block {
        Time
      }
      Side
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
          Address
          Protocol
        }
      }
    }
  }
}
```

## How do I get a wallet's trades on one pair?

Pin both token ids; here WSOL against USDC. Saved stream [here](https://ide.bitquery.io/How-do-I-get-a-wallets-trades-on-a-specific-pair).

```graphql
subscription {
  Trading {
    Trades(
      where: {
        Trader: { Address: { is: "AgmLJBMDCqWynYnQiPCuj9ewsNNsBJXyzoUhD9LJzN51" } }
        Pair: {
          Token: { Id: { is: "bid:solana:So11111111111111111111111111111111111111112" } }
          QuoteToken: { Id: { is: "bid:solana:EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" } }
        }
      }
    ) {
      Block {
        Time
      }
      Side
      Price
      AmountsInUsd {
        Base
      }
      Pair {
        Market {
          Address
          Protocol
        }
      }
    }
  }
}
```

## Who are the most active traders on Solana this hour?

Wallets ranked by trade count, with USD volume split by side. Change the network or the window as needed. Saved query [here](https://ide.bitquery.io/Most-active-traders-by-trade-count).

```graphql
{
  Trading {
    Trades(
      limit: { count: 100 }
      orderBy: [{ descendingByField: "Trades_count" }]
      where: {
        Block: { Time: { since_relative: { hours_ago: 1 } } }
        Pair: { Market: { Network: { is: "Solana" } } }
      }
    ) {
      Trader {
        Address
      }
      Trades_count: count
      Total_Volume: sum(of: AmountsInUsd_Quote)
      buy_volume: sum(of: AmountsInUsd_Quote, if: { Side: { is: "Buy" } })
      sell_volume: sum(of: AmountsInUsd_Quote, if: { Side: { is: "Sell" } })
      buys: count(if: { Side: { is: "Buy" } })
      sells: count(if: { Side: { is: "Sell" } })
    }
  }
}
```

Sort the same query on `Total_Volume` to rank whales by USD volume instead. Saved query [here](https://ide.bitquery.io/Whales-traders-by-total-USD-volume_1).

## Which wallets only bought, or only sold, this hour?

`selectWhere` on an aggregate keeps rows where that count is zero. Sort by volume to see the largest one-sided flows. Saved queries: [only buys](https://ide.bitquery.io/Traders-who-only-buys), [only sells](https://ide.bitquery.io/Traders-who-only-sells_1).

```graphql
{
  Trading {
    Trades(
      limit: { count: 100 }
      orderBy: [{ descendingByField: "Total_Volume" }]
      where: {
        Block: { Time: { since_relative: { hours_ago: 1 } } }
        Pair: { Market: { Network: { is: "Solana" } } }
      }
    ) {
      Trader {
        Address
      }
      Trades_count: count
      Total_Volume: sum(of: AmountsInUsd_Quote)
      buys: count(if: { Side: { is: "Buy" } })
      sells: count(if: { Side: { is: "Sell" } }, selectWhere: { eq: "0" })
    }
  }
}
```

For wallets that only sold, move `selectWhere` to `buys`.

## Which pools did a wallet trade this hour?

One row per market with the counts and USD volume. Saved query [here](https://ide.bitquery.io/Trader-interacted-with-these-tokens).

```graphql
{
  Trading {
    Trades(
      limit: { count: 100 }
      orderBy: [{ descendingByField: "Trades_count" }]
      where: {
        Block: { Time: { since_relative: { hours_ago: 1 } } }
        Pair: { Market: { Network: { is: "Solana" } } }
        Trader: { Address: { is: "AgmLJBMDCqWynYnQiPCuj9ewsNNsBJXyzoUhD9LJzN51" } }
      }
    ) {
      Pair {
        Market {
          Address
          Protocol
        }
        Token {
          Symbol
          Id
        }
        QuoteToken {
          Symbol
        }
      }
      Trades_count: count
      Total_Volume: sum(of: AmountsInUsd_Base)
      buys: count(if: { Side: { is: "Buy" } })
      sells: count(if: { Side: { is: "Sell" } })
    }
  }
}
```

## How do I calculate a wallet's PnL on one token?

Sum what the wallet paid and what it received in USD over the window; `calculate` takes the difference. It is a cash-flow PnL over the window, so open inventory is not marked to market. Saved query [here](https://ide.bitquery.io/Traders-PnL-for-the-last-30mins-for-a-specific-token).

```graphql
{
  Trading {
    Trades(
      where: {
        Block: { Time: { since_relative: { minutes_ago: 30 } } }
        Pair: { Token: { Id: { is: "bid:solana:AGi2s9zPRPHs3zEDPhPTroumTEXK5ufymYSfEFndCSSW" } } }
        Trader: { Address: { is: "AgmLJBMDCqWynYnQiPCuj9ewsNNsBJXyzoUhD9LJzN51" } }
      }
    ) {
      Trader {
        Address
      }
      Pair {
        Token {
          Symbol
        }
      }
      Amount_Bought: sum(of: AmountsInUsd_Base, if: { Side: { is: "Buy" } })
      Amount_Sold: sum(of: AmountsInUsd_Base, if: { Side: { is: "Sell" } })
      Amount_Bought_native: sum(of: Amounts_Base, if: { Side: { is: "Buy" } })
      Amount_Sold_native: sum(of: Amounts_Base, if: { Side: { is: "Sell" } })
      PnL: calculate(expression: "$Amount_Sold - $Amount_Bought")
      buys: count(if: { Side: { is: "Buy" } })
      sells: count(if: { Side: { is: "Sell" } })
    }
  }
}
```

## How do I rank traders by PnL on one pool?

Filter `Pair.Market.Address` and sort on the calculated field. Saved query [here](https://ide.bitquery.io/Top-Traders-by-PnL-of-a-specific-pair).

```graphql
{
  Trading {
    Trades(
      limit: { count: 10 }
      orderBy: [{ descendingByField: "PnL" }]
      where: {
        Block: { Time: { since_relative: { minutes_ago: 30 } } }
        Pair: { Market: { Address: { is: "CsjcF4mEmJsXZDWzBtuviVEV7JiKTY4NAJ1rdcHhVxi3" } } }
      }
    ) {
      Trader {
        Address
      }
      Amount_Bought: sum(of: AmountsInUsd_Base, if: { Side: { is: "Buy" } })
      Amount_Sold: sum(of: AmountsInUsd_Base, if: { Side: { is: "Sell" } })
      PnL: calculate(expression: "$Amount_Sold - $Amount_Bought")
      buys: count(if: { Side: { is: "Buy" } })
      sells: count(if: { Side: { is: "Sell" } })
    }
  }
}
```

## How do I rank traders by PnL across Solana?

Drop the pool filter and keep one row per wallet with `limitBy`. Saved query [here](https://ide.bitquery.io/Top-Traders-on-Solana_2).

```graphql
{
  Trading {
    Trades(
      limit: { count: 10 }
      limitBy: { count: 1, by: Trader_Address }
      orderBy: [{ descendingByField: "PnL" }]
      where: {
        Block: { Time: { since_relative: { minutes_ago: 30 } } }
        Pair: { Market: { Network: { is: "Solana" } } }
      }
    ) {
      Trader {
        Address
      }
      Amount_Bought: sum(of: AmountsInUsd_Base, if: { Side: { is: "Buy" } })
      Amount_Sold: sum(of: AmountsInUsd_Base, if: { Side: { is: "Sell" } })
      PnL: calculate(expression: "$Amount_Sold - $Amount_Bought")
    }
  }
}
```

## Which traders paid the most fees this hour?

`TransactionHeader.Fee` summed per wallet, a quick way to spot bots. Saved query [here](https://ide.bitquery.io/Traders-paying-the-highest-total-fees).

```graphql
{
  Trading {
    Trades(
      limit: { count: 100 }
      orderBy: [{ descendingByField: "Total_fees_paid_by_trader" }]
      where: {
        Block: { Time: { since_relative: { hours_ago: 1 } } }
        Pair: { Market: { Network: { is: "Solana" } } }
      }
    ) {
      Trader {
        Address
      }
      Trades_count: count
      Total_fees_paid_by_trader: sum(of: TransactionHeader_Fee)
      Total_Volume: sum(of: AmountsInUsd_Quote)
    }
  }
}
```

<FAQ
  items={[
    { q: "How do I stream all trades of a wallet with an API?", a: "Subscribe to Trading.Trades with Trader.Address set to the wallet. Every DEX trade it sends on any supported chain arrives with the pair, the side, USD amounts and the market." },
    { q: "How do I track several wallets at once?", a: "Use an in list on Trader.Address in one subscription. Each message carries the trader address, so one connection serves a whole watchlist." },
    { q: "How far back does the Traders API go?", a: "About a month. For older wallet history use the chain cubes, such as DEXTradeByTokens on Solana or EVM chains, which reach the archive." },
    { q: "How is PnL calculated here?", a: "As USD received from sells minus USD paid on buys inside the window, with calculate on the two sums. Tokens still held are not marked to market." },
    { q: "Which address is the trader on EVM chains?", a: "Trader.Address is the account that sent the swap transaction, so router and aggregator contracts do not appear as traders." },
  ]}
/>

## Related APIs {#related-apis}

- [Crypto Trades API](/docs/trading/crypto-trades-api/trades-api)
- [Crypto Price API](/docs/trading/crypto-price-api/)
- [Solana DEX trades API](/docs/blockchain/Solana/solana-dextrades)
- [Ethereum DEX trades API](/docs/blockchain/Ethereum/dextrades/dex-api)
