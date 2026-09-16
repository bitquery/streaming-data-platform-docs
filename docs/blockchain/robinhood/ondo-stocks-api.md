---
title: "ONDO Tokenized Stocks API on Robinhood Chain"
description: "Query and stream Ondo Finance tokenized stocks on Robinhood Chain: catalog of ONDO stocks, holders, OHLCV, latest price, live price streams, and cross-pool arbitrage via Bitquery GraphQL."
sidebar_position: 19
keywords:
  - Ondo Finance
  - ONDO tokenized stocks
  - tokenized stocks Robinhood
  - Robinhood ONDO stocks API
  - Ondo Global Markets
  - stock tokens GraphQL
  - ONDO OHLCV
  - ONDO token holders
  - Bitquery Robinhood ONDO
---

# ONDO Tokenized Stocks API on Robinhood Chain

[Ondo Finance](https://ondo.finance/) issues **tokenized stocks and ETFs** as ERC-20s on Robinhood Chain (`network: robinhood`, chain ID **4663**). Each ticker is a 1:1 on-chain claim on the underlying equity (for example `NVDAon`, `AAPLon`). Bitquery indexes those tokens as ordinary ERC-20s, so you can catalog every ONDO stock, list holders, and pull prices, candles, and live streams through the same `EVM` and `Trading` cubes used for any Robinhood token.

:::tip These examples use the Trading API
Price, OHLCV, live quotes, and cross-pool prices on this page use the [**Trading cube**](/docs/trading/trading-data-overview) — [`Trading.Tokens`](/docs/trading/crypto-price-api/tokens) and [`Trading.Pairs`](/docs/trading/crypto-price-api/pairs). Scope Robinhood with `NetworkBid: { is: "bid:robinhood" }`. `Trading` covers **real-time plus roughly the last 30 days**. Holder rankings use `EVM.Holders` on `dataset: archive`.
:::

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::tip Related docs
- [Robinhood Trades API](/docs/blockchain/robinhood/robinhood-trades/)
- [Robinhood Token Holders API](/docs/blockchain/robinhood/robinhood-token-holders-api/)
- [xStocks API (Solana)](/docs/blockchain/Solana/xstocks-api/)
- [Trading data overview](/docs/trading/trading-data-overview/)
:::

---

## How ONDO stocks appear on-chain

ONDO tickers on Robinhood Chain use a symbol that **ends with `on`**. New supply is minted from the zero address into Ondo's issuance / custody contract. The catalog query below uses that mint pattern:

| Filter | Value | Meaning |
| --- | --- | --- |
| `Transfer.Sender` | `0x0000000000000000000000000000000000000000` | Mint (issuance) |
| `Transfer.Receiver` | `0xf2dc25b8a5231667d8cf0ecd476fb46805186572` | Ondo issuance / custody wallet |
| `Currency.Symbol.endsWith` | `"on"` | ONDO ticker suffix |

Copy a `SmartContract` from the catalog into the holder, OHLCV, price, and arbitrage queries. Token IDs in the Trading cubes look like `bid:robinhood:<checksummed-or-lowercase-address>`.

---

## All ONDO tokenized stocks (address, name, symbol, minted amount)

Lists every ONDO stock mint on Robinhood Chain: token name, symbol, contract address, and amount minted in that transfer.

▶️ [Run in IDE](https://ide.bitquery.io/All-tokenised-ONDO-stocks-on-Robinhood)

```graphql
{
  EVM(network: robinhood, dataset: combined) {
    Transfers(
      where: {Transfer: {Sender: {is: "0x0000000000000000000000000000000000000000"}, Receiver: {is: "0xf2dc25b8a5231667d8cf0ecd476fb46805186572"}, Currency: {Symbol: {endsWith: "on"}}}}
      orderBy: {descending: Block_Time}
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Transfer {
        Currency {
          Name
          Symbol
          SmartContract
        }
        Amount
      }
    }
  }
}
```

---

## Streaming Real time trades for Amazon ONDO stock

Subscribe on `Trading.Trades` to subscribe to the latest trades for Amazon ONDO tokenised stocks on Robinhood. This stream message includes info such as trade time, trader address, trade transaction hash, trade amount and price in both base and USD evaluation, along with currency and quote currency details. The token address for Amazon ONDO tokenised stock is `0x6c0b8c7071899bf9e7fc2d6d8cc2accd23ce6135`.

▶️ [Run in IDE](https://ide.bitquery.io/real-time-trades-for-amazon-ondo-stocks)

```graphql
 subscription {
  Trading {
    Trades(
      where: {
        Pair: {
          Token: {
            Address: {is: "0x6c0b8c7071899bf9e7fc2d6d8cc2accd23ce6135"}
            NetworkBid: { is: "bid:robinhood" }
          }
        }
      }
    ) {
      Amounts {
        Base
        Quote
      }
      AmountsInUsd {
        Base
      }
      Block {
        Time
      }
      Price
      PriceInUsd
      Pair {
        Market {
          Address
        }
        Pool {
          Address
        }
        Token {
          Name
          Symbol
          Address
        }
        QuoteToken {
          Name
          Symbol
          Address
        }
      }
      Side
      Trader {
        Address
      }
      Supply {
        MarketCap
      }
      TransactionHeader{
        Hash
      }
    }
  }
}
```

To stream **one pool** instead of the blended token price, subscribe to `Trading.Pairs` and filter `Pool.Address` — same pattern as [Real-Time OHLCV for a pair](/docs/blockchain/robinhood/robinhood-trades/#real-time-ohlcv-stream-for-a-pair-on-robinhood).

## Token holders of Nvidia ONDO stock

Using `EVM.Holders`, we can get top holders for Nvidia ONDO stock, with wallets ranked by balance. `Amount` is the tokenized share count. Use `dataset: combined` and add `Balance: { Amount: { gt: "0" } }` for **current** holders. The token address for `Nvidia ONDO stock` is `0x6026fd22df0ba04c1c176e1beb79cda8748ff8d7`.


▶️ [Run in IDE](https://ide.bitquery.io/token-holders-of-Nvidia-ONDO-stock)

```graphql
{
  EVM(dataset: combined, network: robinhood) {
    Holders(
      where: {
        Currency: {
          SmartContract: { is: "0x6026fd22df0ba04c1c176e1beb79cda8748ff8d7"}
        }
        Balance: { Amount: { gt: "0" } }
      }
      limit: { count: 20 }
      orderBy: { descending: Balance_Amount }
    ) {
      Holder {
        Address
      }
      Balance {
        Amount
        FirstChangeTime
        LastChangeTime
        UpdateCount
      }
      Currency {
        Name
        Symbol
        SmartContract
      }
    }
  }
}
```

---

## OHLCV of Google ONDO stock

Using `Trading.Tokens`, we can get normalised OHLC candle values without the need of data normalisation from raw trades data. `Duration: { eq: 60 }` is 1-minute candles (`300` = 5 minutes, `3600` = 1 hour). For a **single pool**, use `Trading.Pairs` and add `Pool.Address`.
The token address for Google ONDO tokenised stock is `0x3381a810a40cea0b7f145e341aa53a296ed4093b`.

▶️ [Run in IDE](https://ide.bitquery.io/OHLCV-of-Google-ONDO-stocks)

```graphql
{
  Trading {
    Tokens(
      where: {
        Token: {
          Address: { is: "0x3381a810a40cea0b7f145e341aa53a296ed4093b" }
          NetworkBid: { is: "bid:robinhood" }
        }
        Interval: { Time: { Duration: { eq: 60 } } }
        Price: { IsQuotedInUsd: true }
      }
      orderBy: { descending: Interval_Time_End }
    ) {
      Token {
        Name
        Symbol
        Address
      }
      Interval {
        Time {
          Start
          Duration
          End
        }
      }
      Price {
        IsQuotedInUsd
        Ohlc {
          Open
          High
          Low
          Close
        }
      }
      Volume {
        Base
        Quote
        Usd
      }
      Block {
        Time
      }
    }
  }
}
```

---

## Latest price of Amazon ONDO stock

`Trading.Tokens` returns Bitquery's **volume-weighted price across pools**. `Interval.Time.Duration: 1` is the latest 1-second bar; `limit: 1` plus `orderBy: descending Interval_Time_End` is the current snapshot.

▶️ [Run in IDE](https://ide.bitquery.io/latest-price-of-Amazon-ONDO-stock)

```graphql
{
  Trading {
    Tokens(
      where: {
        Token: {
          Address: { is: "0x6c0b8c7071899bf9e7fc2d6d8cc2accd23ce6135" }
          NetworkBid: { is: "bid:robinhood" }
        }
        Interval: { Time: { Duration: { eq: 1 } } }
      }
      orderBy: { descending: Interval_Time_End }
      limit: { count: 1 }
    ) {
      Interval{
        Time{
          End
        }
      }
      Token {
        Name
        Symbol
        Address
      }
      latest_price: Price {
        Ohlc {
          Close
        }
      }
      Supply {
        MarketCap
        FullyDilutedValuationUsd
      }
    }
  }
}
```