---
title: "Robinhood Trades"
description: "Query and stream Robinhood token trades and prices with Bitquery Trading APIs. Filter with NetworkBid bid:robinhood for real-time OHLC and volume."
sidebar_position: 1
keywords:
  - Robinhood API
  - Robinhood trades API
  - OHLCV for Robinhood tokens
  - Marketcap for Robinhood tokens
  - Robinhood token trades
  - Latest price for Robinhood tokens
---

# Robinhood Trades

Bitquery exposes **Robinhood** trade and price data through the **Trading** APIs. 

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](https://docs.bitquery.io/docs/authorisation/how-to-generate/)
:::

:::tip Related docs
- [Trading data overview](https://docs.bitquery.io/docs/trading/trading-data-overview/)
- [Trades API](https://docs.bitquery.io/docs/category/crypto-trades-api/)
- [Crypto Trades API](https://docs.bitquery.io/docs/trading/crypto-trades-api/trades-api/)
:::

---

## Network identifier

| Field | Value | Notes |
| --- | --- | --- |
| `NetworkBid` | `bid:robinhood` | Filter to select Robinhood data (indexed and faster) |
| `Network` | `Robinhood` | Filter to select Robinhood data |


---

## Real time Trades on Robinhood

Stream real time tardes on Robinhood via a GraphQL subscription on `Trading.Trades` that includes details such as Trader Address, Base and Quote Currency Details, amounts, type of trade (buy or sell), market cap and transaction details.

▶️ [Run in IDE](https://ide.bitquery.io/Robinhood-Trades)

```graphql
subscription {
  Trading {
    Trades(
      where: {
      Pair: {
        Market: {
          NetworkBid: {
            is: "bid:robinhood"
          }
        }
      }
    }) {
      Block {
        Time
      }
      Trader{
        Address
      }
      Amounts{
        Base
        Quote
      }
      AmountsInUsd{
        Base
      }
      Pair{
        Token{
          Name
          Symbol
          Address
        }
        QuoteToken{
          Name
          Symbol
          Address
        }
      }
      Side
      Supply{
        FullyDilutedValuationUsd
        MarketCap
      }
      TransactionHeader{
        Hash
      }
    }
  }
}
```

<!-- TODO: Expand returned fields (Volume, Average, Supply, full OHLC) as needed -->

---

## Historical Trades on Robinhood

Trade APIs allows user to query upto past 30 days of data using the GraphQL API.

▶️ [Run in IDE](https://ide.bitquery.io/Historical-Robinhood-Trades)

```graphql
{
  Trading {
    Trades(
      orderBy: {ascending: Block_Date}
      where: {
        Block: {
          Time: {
            since_relative: {weeks_ago: 3}
            till_relative: {weeks_ago: 1}
          }
        }
        Pair: {
          Market: {
            NetworkBid: {
              is: "bid:robinhood"
            }
          }
        }
    }) {
      Block {
        Time
      }
      Trader{
        Address
      }
      Amounts{
        Base
        Quote
      }
      AmountsInUsd{
        Base
      }
      Pair{
        Token{
          Name
          Symbol
          Address
        }
        QuoteToken{
          Name
          Symbol
          Address
        }
      }
      Side
      Supply{
        FullyDilutedValuationUsd
        MarketCap
      }
      TransactionHeader{
        Hash
      }
    }
  }
}
```

---

## Real Time Trades for a specific token

Using this GrpahQL stream you can get real time trades for a specific token with details such as trader address, token details, marketcap, FDV and transaction hash.

▶️ [Run in IDE](https://ide.bitquery.io/Robinhood-Trades-for-a-token)

```graphql
subscription {
  Trading {
    Trades(
      where: {
      Pair: {
        Token: {
          Address: {
            is: "0x9077841e155faaf4e4e89470822c2187eeef7777"
          }
        }
        Market: {
          NetworkBid: {
            is: "bid:robinhood"
          }
        }
      }
    }) {
      Block {
        Time
      }
      Trader{
        Address
      }
      Amounts{
        Base
        Quote
      }
      AmountsInUsd{
        Base
      }
      Pair{
        Token{
          Name
          Symbol
          Address
        }
        QuoteToken{
          Name
          Symbol
          Address
        }
      }
      Side
      Supply{
        FullyDilutedValuationUsd
        MarketCap
      }
      TransactionHeader{
        Hash
      }
    }
  }
}
```

---

## Trades by a Trader

Using this GrpahQL API endpoint you can get token trades by a trader with details such as trade amount, trade type, token details, marketcap, FDV and transaction hash.

▶️ [Run in IDE](https://ide.bitquery.io/Robinhood-Trades-by-a-trader)

```graphql
{
  Trading {
    Trades(
      where: {
        Trader:{
          Address:{
            is: "0x39d83c23dbf34fa574b9afbb0c0e364bdfd97099"
          }
        }
        Pair: {
          Market: {
            NetworkBid: {
              is: "bid:robinhood"
            }
          }
        }
    }) {
      Block {
        Time
      }
      Trader{
        Address
      }
      Amounts{
        Base
        Quote
      }
      AmountsInUsd{
        Base
      }
      Pair{
        Token{
          Name
          Symbol
          Address
        }
        QuoteToken{
          Name
          Symbol
          Address
        }
      }
      Side
      Supply{
        FullyDilutedValuationUsd
        MarketCap
      }
      TransactionHeader{
        Hash
      }
    }
  }
}
```

---


## Latest Price of a Token on Robinhood

Get the latest USD normalised price of a token on Robinhood network using this API endpoint using `Trading.Tokens`.

:::note A single token might be traded on multiple pools, with each pool having a difference in price. As for the price returned by Bitquery we provide the weighted average price across all pools. To know more about the price calculation refer to [this](https://docs.bitquery.io/docs/trading/crypto-price-api/price-index-algorithm/#how-token-prices-are-determined) document. 

If you want to monitor price for a particular pool, we suggest usage of `Trading.Pairs` instead of `Trading.Tokens` where you could specify the pool address.
:::

▶️ [Run in IDE](https://ide.bitquery.io/latest-price-of-a-token_10)

```graphql
{
  Trading {
    Tokens(
      where: {Token: {Address: {is: "0x9077841e155faaf4e4e89470822c2187eeef7777"}, NetworkBid: {is: "bid:robinhood"}}, Interval: {Time: {Duration: {eq: 1}}}}
      orderBy: {descending: Interval_Time_End}
      limit: {count: 1}
    ) {
      latest_price: Price {
        Ohlc {
          Close
        }
      }
    }
  }
}
```

---

## Latest Price of a Token for a Liquidity Pool

This API endpoint retrieves the latest price of a token for a particular token pair or liquidity pool using `Token.Pairs` cube.

▶️ [Run in IDE](https://ide.bitquery.io/latest-price-of-a-token-on-a-pool)

```graphql
{
  Trading {
    Pairs(
      where: {
        Pool: {
          Address:{
            is: "0xbbaefcfcd7b92ed0df1a3eec22a21ba6beb0b52b"
          }
        }
        Token: {
          Address: {
            is: "0x9077841e155faaf4e4e89470822c2187eeef7777"
          }, 
          NetworkBid: {is: "bid:robinhood"}}, 
        Interval: {Time: {Duration: {eq: 1}}}
      }
      orderBy: {descending: Interval_Time_End}
      limit: {count: 1}
    ) {
      Pool{
        Address
      }
      latest_price: Price {
        Ohlc {
          Close
        }
      }
    }
  }
}
```

---

## Real Time OHLCV stream for a Pair on Robinhood

This GraphQL stream for 1 second OHLCV streams the USD normalised OHLC/K-line data for a token pair, and also contains info such as interval start and end time, marketcap, volume and token details for both base and quote tokens.

▶️ [Run in IDE](https://ide.bitquery.io/OHLCV-stream-for-a-token-pair-on-robinhood)

```graphql
subscription{
  Trading {
    Pairs(
      where: {
        Pool: {
          Address:{
            is: "0xbbaefcfcd7b92ed0df1a3eec22a21ba6beb0b52b"
          }
        }
        Token: {
          Address: {
            is: "0x9077841e155faaf4e4e89470822c2187eeef7777"
          }, 
          NetworkBid: {is: "bid:robinhood"}}, 
        Interval: {Time: {Duration: {eq: 1}}}
      }
    ) {
      Interval{
        Time{
          Start
          End
        }
      }
      Price {
        Ohlc {
          Open
          High
          Low
          Close
        }
      }
      Token{
        Name
        Symbol
        Address
      }
      QuoteToken{
        Name
        Symbol
        Address
      }
      Volume{
        Base
        Quote
        Usd
      }
      Supply{
        MarketCap
      }
    }
  }
}
```