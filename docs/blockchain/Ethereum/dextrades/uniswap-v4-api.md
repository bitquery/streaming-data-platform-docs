---
title: "Uniswap V4 API - Track Trader Activities, Token Trades and Market Behaviour"
description: "Track Uniswap V4 trades, trader activities, token trades, and market behaviour in real time using Bitquery's DEX Trades API."
---

# Uniswap V4 API - Track Trader Activities, Token Trades and Market Behaviour

Uniswap v4 introduces a major shift in protocol architecture. Instead of deploying a separate smart contract for each liquidity pool, Uniswap v4 uses a singleton PoolManager contract that manages all pools internally as structured state.

Each pool in Uniswap v4 is uniquely identified by a `PoolId`, which is derived from the pool configuration (token pair, fee, tick spacing, and optional hooks), rather than a dedicated contract address. Using Bitquery’s Uniswap v4 APIs, you can track:
- DEX trades across all v4 pools
- Trades by specific traders
- Token-level trade activity
- Real-time trade metrics

The Uniswap v4 PoolManager contract (`0x000000000004444c5dc75cB358380D2e3dE08A90`) emits all pool-related events, including pool initialization, swaps, and liquidity modifications, and serves as the single on-chain source of truth for Uniswap v4 activity.

## Real time Trades on Uniswap V4

[This](https://ide.bitquery.io/Real-time-trades-on-uniswap-v4----subscription) subscription allows user to stream trades on Uniswap V4 in real time.

```graphql
subscription {
  EVM {
    DEXTrades(where: {Trade: {Dex: {ProtocolName: {is: "uniswap_v4"}}}}) {
      Block{
        Time
      }
      Trade {
        PoolId
        Buy {
          Currency {
            Name
            Symbol
            SmartContract
            Decimals
          }
          Buyer
          Amount
          AmountInUSD
          Price
          PriceInUSD
          Seller
        }
        Sell {
          Currency {
            Name
            Symbol
            SmartContract
            Decimals
          }
          Buyer
          Amount
          AmountInUSD
          Price
          PriceInUSD
          Seller
        }
      }
      Transaction {
        From
        To
        Hash
      }
    }
  }
}
```

## Crypto Trades API: Uniswap v4 with Pool Id and market cap

The subscription above uses **`EVM { DEXTrades }`**, where each row includes **`Trade.PoolId`**. You can also stream **Uniswap v4** swaps on **Ethereum** through the unified **[Crypto Trades API](/docs/trading/crypto-trades-api/trades-api)** with **`Trading { Trades }`**: filter **`Pair.Market.Network: Ethereum`** and **`Pair.Market.Protocol: uniswap_v4`**. Each event returns **`Pair.Pool.Id`** (the v4 pool identifier), **`Pair.Pool.Address`**, **`Supply`** (**`MarketCap`**, **`CirculatingSupply`**), and **pair / trader** fields.

Run this subscription [in the Bitquery IDE](https://ide.bitquery.io/Uniswap-v4-trades-with-pool-id-and-mcap).

```graphql
subscription {
  Trading {
    Trades(
      where: {Pair: {Market: {Network: {is: "Ethereum"}, Protocol: {is: "uniswap_v4"}}}}
    ) {
      Side
      Supply {
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
        Pool {
          Id
          Address
        }
      }
    }
  }
}
```

On **Uniswap v4**, use **`Pair.Pool.Id`** as the stable **pool id** (alongside **`Pair.Pool.Address`**). Example shape:

```json
"Pool": {
  "Address": "0x000000000004444c5dc75cb358380d2e3de08a90",
  "Id": "0x71ad627a0586a06b24834f7af328c5c387a512d183dbd7b8c31189a866adcefa"
}
```

## Get All Pool Ids for a Currency

Using [this](https://ide.bitquery.io/All-Pool_Ids-for-currency) API we can get all the virtual pool addresses (`PoolId`) for a currency, which is USDT (`0xdac17f958d2ee523a2206206994597c13d831ec7`) in this case.

```graphql
query MyQuery {
  EVM {
    DEXTradeByTokens(
      where: {Trade: {Dex: {ProtocolName: {is: "uniswap_v4"}}, Currency: {SmartContract: {is: "0xdac17f958d2ee523a2206206994597c13d831ec7"}}}}
    ) {
      Trade {
        PoolId
      }
      count
    }
  }
}
```

## Latest Trades for a Specific Currencies Pair

[This](https://ide.bitquery.io/Latest-trades-for-a-Pool-Id-on-uniswap-v4) API endpoint allows us to filter out the latest trades for a specific pair, using `PoolId` as a filter option. Here, we are getting latest trades for the `PoolId: 0x2a5bf4f7f9f6044f854ae1170113504a023dbcb347f25a1809bab471f07a7dba`

```graphql
{
  EVM {
    DEXTrades(
      orderBy: {descending: Block_Time}
      limit: {count: 100}
      where: {Trade: {Dex: {ProtocolName: {is: "uniswap_v4"}}, PoolId: {is: "0x2a5bf4f7f9f6044f854ae1170113504a023dbcb347f25a1809bab471f07a7dba"}}}
    ) {
      Block {
        Time
      }
      Trade {
        PoolId
        Buy {
          Currency {
            Name
            Symbol
            SmartContract
            Decimals
          }
          Amount
          AmountInUSD
          Price
          PriceInUSD
          Seller
        }
        Sell {
          Currency {
            Name
            Symbol
            SmartContract
            Decimals
          }
          Buyer
          Amount
          AmountInUSD
          Price
          PriceInUSD
        }
      }
      Transaction {
        From
        To
        Hash
      }
    }
  }
}
```

## Uniswap V4 Pair Trade Stats

Using [this](https://ide.bitquery.io/uniswap-v4-stats---Volume-bought-and-sold) query get SWFTC/USDT v4 pool stats (volume, bought, sold)

```graphql
query pairTopTraders {
  EVM(network: eth, dataset: realtime) {
    DEXTradeByTokens(
      orderBy: { descendingByField: "volumeUsd" }
      where: {
        Block:{
          Time: {since_relative: {days_ago: 1}}
        }
        Trade: {
          Dex: {
            ProtocolName: {is: "uniswap_v4"}
          }
          PoolId: {is: "0x2a5bf4f7f9f6044f854ae1170113504a023dbcb347f25a1809bab471f07a7dba"}
        }
      }
    ) {
      Trade {
        Currency{
          Name
          Symbol
          SmartContract
        }
      }
      bought: sum(
        of: Trade_Amount
        if: { Trade: { Side: { Type: { is: buy } } } }
      )
      sold: sum(
        of: Trade_Amount
        if: { Trade: { Side: { Type: { is: sell } } } }
      )
      volume: sum(of: Trade_Amount)
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
    }
  }
}
```

## Top Buyers of a Token on Uniswap V4

[This](https://ide.bitquery.io/Top-Buyers-of-a-currency-on-uniswap-v4) API returns the top buyers of a token on Uniswap V4 virtual pool, along with the amount bought in token denominations and USD.

```graphql
{
  EVM {
    DEXTrades(
      orderBy: {descendingByField: "bought_in_usd"}
      limit: {count: 100}
      where: {
        Trade: {
          Dex: {ProtocolName: {is: "uniswap_v4"}}, 
          Buy: {Currency: {SmartContract: {is: "0x0bb217e40f8a5cb79adf04e1aab60e5abd0dfc1e"}}}
          PoolId: {is: "0x2a5bf4f7f9f6044f854ae1170113504a023dbcb347f25a1809bab471f07a7dba"}
        }
      }
    ) {
      Trade {
        Sell {
          Currency {
            Name
            Symbol
            SmartContract
            Decimals
          }
          Buyer
        }
      }
      bought:sum(of: Trade_Buy_Amount)
      bought_in_usd:sum(of: Trade_Buy_AmountInUSD)
    }
  }
}
```

## Top Sellers of a Token on Uniswap V4

[This](https://ide.bitquery.io/Top-Sellers-of-a-currency-on-uniswap-v4) API returns the top buyers of a token on Uniswap V4 virtual pool, along with the amount bought in token denominations and USD.

```graphql
{
  EVM {
    DEXTrades(
      orderBy: {descendingByField: "sold_in_usd"}
      limit: {count: 10}
      where: {
        Trade: {
          Dex: {ProtocolName: {is: "uniswap_v4"}}, 
          Sell: {Currency: {SmartContract: {is: "0x0bb217e40f8a5cb79adf04e1aab60e5abd0dfc1e"}}}
          PoolId: {is: "0x2a5bf4f7f9f6044f854ae1170113504a023dbcb347f25a1809bab471f07a7dba"}
        }
      }
    ) {
      Trade {
        Buy {
          Currency {
            Name
            Symbol
            SmartContract
            Decimals
          }
          Seller
        }
      }
      sold:sum(of: Trade_Buy_Amount)
      sold_in_usd:sum(of: Trade_Buy_AmountInUSD)
    }
  }
}
```