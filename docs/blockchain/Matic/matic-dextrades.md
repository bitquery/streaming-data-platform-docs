---
sidebar_position: 2
title: "Polygon (MATIC) DEX Trades API"
description: "Query Polygon DEX trades with Bitquery: live swap streams, OHLC candles, token prices, top traders, and full history through the archive dataset."
---
# Polygon (MATIC) DEX Trades API

:::tip Want structured trades, OHLC and USD on every row? Start with the Trading API
The [**Trading API**](/docs/trading/trading-data-overview) is the fastest path to clean Polygon market data. [`Trading.Trades`](/docs/trading/crypto-trades-api/trades-api) returns **MEV-filtered swaps with USD price, market cap and supply on every row**, across **9 chains in one API** — filter with `Pair.Market.Network: Matic`. Pre-aggregated OHLC down to one second comes from [`Trading.Tokens`](/docs/trading/crypto-price-api/tokens) and [`Trading.Pairs`](/docs/trading/crypto-price-api/pairs), so you never have to build candles yourself.

Reach for the chain-level queries on this page when you need something the Trading API deliberately does not carry: **history older than the Trading window** (via `dataset: combined` or `archive`), **raw per-swap detail**, pool internals, or **call and event context**. Both are shown below, starting with the Trading API.
:::

Polygon (formerly Matic) settles DEX activity across Uniswap v2/v3, QuickSwap, Balancer, SushiSwap and the Polymarket CTF exchange. This page shows how to query and stream that activity with the Bitquery GraphQL API: live swap streams, real-time and historical token prices, OHLC candles, top tokens and traders, and full trade history through the archive dataset.

:::note Token naming on Polygon
Polygon's native asset was rebranded from MATIC to POL, so the wrapped native token reports as **`WPOL`** (contract `0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270` — unchanged from WMATIC). Bridged Tether reports as **`USDT0`** at `0xc2132d05d31c914a87c6611c10748aeb04b58e8f`. Filter by contract address rather than symbol wherever you can — addresses are stable across rebrands.
:::

## Live DEX swap stream (Polygon) {#crypto-trades-live-stream}

[Crypto Trades API](/docs/trading/crypto-trades-api/trades-api): one row per swap, with USD and supply. For Polygon use **`Pair.Market.Network: Matic`**. [When to use this vs chain DEX APIs](/docs/cubes/dextrades-dextradebytokens-trading-trades).

Run this subscription [in the Bitquery IDE](https://ide.bitquery.io/All-trades-on-Polygon-with-Price-Marketcap-supply).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Trading {
    Trades(where: { Pair: { Market: { Network: { is: "Matic" } } } }) {
      Side
      Supply {
        MaxSupply
        TotalSupply
        FullyDilutedValuationUsd
        CirculatingSupply
        MarketCap
      }
      Trader {
        Address
      }
      TransactionHeader {
        Fee
        FeePayer
        Sender
        To
        Hash
        Index
      }
      Amounts {
        Base
        Quote
      }
      AmountsInUsd {
        Base
        Quote
      }
      Block {
        Date
        Time
        Timestamp
      }
      Pair {
        Currency {
          Id
          Name
          Symbol
        }
        Market {
          Address
          Program
          Network
        }
        QuoteCurrency {
          Id
          Name
          Symbol
        }
        Token {
          Address
          Id
          IsNative
          Symbol
          TokenId
          Network
        }
        QuoteToken {
          Address
          Id
          IsNative
          Symbol
          TokenId
          Network
        }
      }
      Price
      PriceInUsd
    }
  }
}
```

</details>

## OHLC candles for a Polygon token {#ohlc}

If you are building a chart, do not aggregate raw swaps yourself. [`Trading.Tokens`](/docs/trading/crypto-price-api/tokens) returns ready-made candles: set `Interval.Time.Duration` to the candle width in seconds (`60`, `300`, `3600`, `86400`) and filter the token by address.

This example returns five-minute candles for **WPOL** over the last three hours, with volume in both base units and USD.

```graphql
{
  Trading {
    Tokens(
      limit: { count: 36 }
      orderBy: { descending: Block_Time }
      where: {
        Token: {
          Network: { is: "Matic" }
          Address: { is: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270" }
        }
        Interval: { Time: { Duration: { eq: 300 } } }
        Block: { Time: { since_relative: { hours_ago: 3 } } }
      }
    ) {
      Interval {
        Time {
          Start
          End
          Duration
        }
      }
      Token {
        Symbol
        Address
        Network
      }
      Currency {
        Symbol
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
        Base
        Usd
      }
    }
  }
}
```

Swap `Duration` for the candle size you need, and drop the `Block.Time` filter to walk further back. For pair-level candles — one specific pool rather than the token's aggregated price — use [`Trading.Pairs`](/docs/trading/crypto-price-api/pairs) with a `Market.Address` filter.

## Historical Polygon trades (archive dataset) {#historical}

The realtime dataset covers a rolling recent window. For anything older, add **`dataset: archive`** (history only) or **`dataset: combined`** (history plus realtime) to the `EVM` selector. This is the main reason to use chain-level `DEXTrades` instead of the Trading API.

The query below pulls Polygon swaps from a fixed historical day. Change the `since` / `till` bounds to any range you need.

```graphql
{
  EVM(network: matic, dataset: archive) {
    DEXTrades(
      limit: { count: 25 }
      orderBy: { descending: Block_Time }
      where: {
        Block: {
          Time: { since: "2025-01-01T00:00:00Z", till: "2025-01-02T00:00:00Z" }
        }
      }
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
        From
      }
      Trade {
        Dex {
          ProtocolName
          ProtocolFamily
          SmartContract
        }
        Buy {
          Amount
          Currency {
            Symbol
            SmartContract
          }
          PriceInUSD
          Buyer
        }
        Sell {
          Amount
          Currency {
            Symbol
            SmartContract
          }
        }
      }
    }
  }
}
```

:::caution USD values on thin pools
`PriceInUSD` is derived from the trade itself, so it can come back as `0` or wildly off for pools with almost no liquidity. If you need dependable USD, use the Trading API (which carries a vetted price per row) or filter on [`PriceAsymmetry`](/docs/graphql/metrics/priceAsymmetry/) as shown below.
:::

## Latest Polygon DEX trades {#latest-trades}

This example uses the chain-specific **DEXTrades** cube via `EVM(network: matic) { DEXTrades }` (pool-side Buy/Sell; see [DEXTrades cube](/docs/cubes/dextrades)). For trader-oriented rows with reliable USD, use the [stream at the top](#crypto-trades-live-stream).

Read [DEXTrades vs DEXTradeByTokens vs Trades cube](/docs/cubes/dextrades-dextradebytokens-trading-trades) to understand when to use which cube.
You can find the query [here](https://ide.bitquery.io/Realtime-matic-dex-trades-websocket)

```graphql
subscription {
  EVM(network: matic) {
    DEXTrades {
      Block {
        Time
      }
      Trade {
        Dex {
          ProtocolName
          ProtocolFamily
          SmartContract
        }
        Buy {
          Amount
          Buyer
          Seller
          Currency {
            Decimals
            Fungible
            HasURI
            Name
            ProtocolName
            SmartContract
            Symbol
          }
          OrderId
        }
        Sell {
          Buyer
          Seller
          Currency {
            Decimals
            Fungible
            HasURI
            Name
            ProtocolName
            SmartContract
            Symbol
          }
        }
      }
    }
  }
}
```

## Real-time price of a token in terms of another {#realtime-price}

This subscription streams the price of **WPOL** in terms of **USDC**, including the DEX, market and order details. Filtering both sides pins you to a single trading direction on a specific pair.

```graphql
subscription {
  EVM(network: matic) {
    DEXTrades(
      where: {
        Trade: {
          Sell: {
            Currency: {
              SmartContract: {
                is: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"
              }
            }
          }
          Buy: {
            Currency: {
              SmartContract: {
                is: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359"
              }
            }
          }
        }
      }
    ) {
      Block {
        Time
      }
      Trade {
        Buy {
          Amount
          Buyer
          Seller
          Price_in_terms_of_sell_currency: Price
          Currency {
            Name
            Symbol
            SmartContract
          }
          OrderId
        }
        Sell {
          Amount
          Buyer
          Seller
          Price_in_terms_of_buy_currency: Price
          Currency {
            Symbol
            SmartContract
            Name
          }
          OrderId
        }
        Dex {
          ProtocolFamily
          ProtocolName
          SmartContract
          ProtocolVersion
        }
      }
    }
  }
}
```

To watch one pool rather than every pool for the pair, add a
`Trade: { Dex: { SmartContract: { is: "0x..." } } }` filter.

## Latest USD price of a token {#usd-price}

This subscription returns the USD price of a token by filtering on the buy-side contract — here **WETH** on Polygon. Read `PriceInUSD` for the USD value. `PriceAsymmetry(selectWhere: {lt: 1})` drops trades whose two legs disagree badly on value, which is the cheapest way to filter out bot noise and broken pools.

```graphql
subscription {
  EVM(network: matic) {
    DEXTrades(
      where: {
        Trade: {
          Buy: {
            Currency: {
              SmartContract: {
                is: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619"
              }
            }
          }
        }
      }
    ) {
      Block {
        Number
        Time
      }
      Transaction {
        From
        To
        Hash
      }
      Trade {
        Buy {
          Amount
          Buyer
          Currency {
            Name
            Symbol
            SmartContract
          }
          Seller
          Price
          PriceInUSD
        }
        Sell {
          Amount
          Buyer
          Currency {
            Name
            SmartContract
            Symbol
          }
          Seller
          Price
        }
        PriceAsymmetry(selectWhere: { lt: 1 })
      }
    }
  }
}
```

## Top tokens on Polygon by traded volume {#top-tokens}

This query ranks Polygon tokens by USD volume over a relative window and returns the price now versus the start of the window, so you can compute a change percentage client-side.

Two filters matter more than they look:

- **`Currency: { Fungible: true }`** — without it, results are dominated by Polymarket's ERC-1155 outcome tokens, which trade in enormous quantities on Polygon, carry empty symbols, and are almost certainly not what you are ranking. See the [Polymarket API](/docs/examples/polymarket-api/) if they *are* what you want.
- **`SmartContract: { notIn: $quotes }`** on the trade side and **`in: $quotes`** on the counter-side — this keeps stablecoins and wrapped majors as *quote* assets instead of letting them top their own leaderboard.

Using `since_relative` rather than fixed timestamps means the query stays correct whenever it is run.

```graphql
query topTokens($network: evm_network, $quotes: [String!], $min_usd: String) {
  EVM(network: $network) {
    DEXTradeByTokens(
      where: {
        Block: { Time: { since_relative: { hours_ago: 24 } } }
        Trade: {
          Currency: { Fungible: true, SmartContract: { notIn: $quotes } }
          Side: { Currency: { SmartContract: { in: $quotes } } }
        }
      }
      orderBy: { descendingByField: "usd" }
      limit: { count: 25 }
    ) {
      Trade {
        Currency {
          Symbol
          Name
          SmartContract
        }
        price_now: PriceInUSD(maximum: Block_Number)
        price_window_start: PriceInUSD(minimum: Block_Number)
      }
      usd: sum(of: Trade_Side_AmountInUSD, selectWhere: { ge: $min_usd })
      trades: count
      buyers: uniq(of: Trade_Buyer)
      sellers: uniq(of: Trade_Seller)
      dexes: uniq(of: Trade_Dex_OwnerAddress)
    }
  }
}
```

Variables — the quote list is native USDC, bridged USDC.e, USDT0, DAI, WETH, WPOL and WBTC:

```json
{
  "network": "matic",
  "quotes": [
    "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
    "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
    "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
    "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6"
  ],
  "min_usd": "25000"
}
```

A heatmap built on this shape of query is live at [dexrabbit.com/matic](https://dexrabbit.com/matic).

![Top Polygon tokens by volume on DEXrabbit](/img/dexrabbit/matic_toptokens.png)

## Top traders of a token {#top-traders}

This query ranks traders of one token by volume, splitting bought and sold amounts and totalling volume in native and USD terms. `since_relative` keeps the window rolling.

You can run the query [here](https://ide.bitquery.io/top-traders-of-a-token-on-matic_1)

```graphql
query topTraders($network: evm_network, $token: String) {
  EVM(network: $network) {
    DEXTradeByTokens(
      orderBy: { descendingByField: "volumeUsd" }
      limit: { count: 100 }
      where: {
        Trade: { Currency: { SmartContract: { is: $token } } }
        Block: { Time: { since_relative: { days_ago: 3 } } }
      }
    ) {
      Trade {
        Buyer
        Dex {
          ProtocolFamily
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

```json
{
  "network": "matic",
  "token": "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"
}
```

This query is available as a chart and table on [dexrabbit.com/matic](https://dexrabbit.com/matic).

![Top Polygon traders on DEXrabbit](/img/dexrabbit/matic_toptraders.png)

---

## More examples

### Top Traders by PnL for a Specific Pool (Last 30 Minutes)

Rank traders by **`PnL`** on one pool: filter **`Pair.Market.Address`**, last **30 minutes**, **`limit: 10`**, and **`orderBy`** **`PnL`** descending. Useful for **leaderboards**, **smart-money screens**, and **pool-specific trader analytics**.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/Top-Traders-by-PnL-of-a-specific-polygon-pool).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Trading {
    Trades(
      limit: { count: 10 }
      orderBy: { descendingByField: "PnL" }
      where: {
        Block: { Time: { since_relative: { minutes_ago: 30 } } }
        Pair: {
          Market: {
            Address: { is: "0x5757371414417b8c6caad45baef941abc7d3ab32" }
          }
        }
      }
    ) {
      Trader {
        Address
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

</details>

## Related Polygon APIs

- [Polygon (MATIC) Address Balance API](/docs/blockchain/Matic/matic-balance-api) — token and native balances
- [Polygon (MATIC) Transfers API](/docs/blockchain/Matic/matic-transfers) — ERC-20 and native transfers
- [Polymarket API](/docs/examples/polymarket-api/) — prediction market trades and outcome prices on Polygon
- [Trading API overview](/docs/trading/trading-data-overview) — structured trades, prices and OHLC across 9 chains

---
