---
title: "Uniswap V4 API - Track Trader Activities, Token Trades and Market Behaviour"
description: "Track Uniswap V4 trades, trader activities, token trades, and market behaviour in real time using Bitquery's DEX Trades API on BSC."
---

# Uniswap V4 API - Track Trader Activities, Token Trades and Market Behaviour

Uniswap v4 introduces a major shift in protocol architecture. Instead of deploying a separate smart contract for each liquidity pool, Uniswap v4 uses a singleton PoolManager contract that manages all pools internally as structured state.

Each pool in Uniswap v4 is uniquely identified by a `PoolId`, which is derived from the pool configuration (token pair, fee, tick spacing, and optional hooks), rather than a dedicated contract address. Using Bitquery's Uniswap v4 APIs, you can track:
- DEX trades across all v4 pools
- Trades by specific traders
- Token-level trade activity
- Real-time trade metrics

The Uniswap v4 PoolManager contract emits all pool-related events, including pool initialization, swaps, and liquidity modifications, and serves as the single on-chain source of truth for Uniswap v4 activity on BSC.

## Real time Trades on Uniswap V4

[This](https://ide.bitquery.io/Real-time-trades-for-uniswap-v4-bsc#) subscription allows user to stream trades on Uniswap V4 in real time on BSC.

```graphql
subscription {
  EVM(network: bsc) {
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

## Get All Pool Ids for a Currency

Using [this](https://ide.bitquery.io/get-virtual-pool-address-for-a-token-on-uniswap-v4-bsc#) API we can get all the virtual pool addresses (`PoolId`) for a currency on BSC.

```graphql
query MyQuery {
  EVM(network: bsc) {
    DEXTradeByTokens(
      where: {Trade: {Dex: {ProtocolName: {is: "uniswap_v4"}}, Currency: {SmartContract: {is: "0x55d398326f99059ff775485246999027b3197955"}}}}
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

[This](https://ide.bitquery.io/Latest-Trades-for-a-currency-pair-on-bsc#) API endpoint allows us to filter out the latest trades for a specific pair on BSC, using `PoolId` as a filter option.

```graphql
{
  EVM(network: bsc) {
    DEXTrades(
      orderBy: {descending: Block_Time}
      limit: {count: 100}
      where: {Trade: {Dex: {ProtocolName: {is: "uniswap_v4"}}, PoolId: {is: "0x00bbfee31c72fd3c7fba2febae5404de93cf6803be58db5282d0417a4d63abe6"}}}
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

Using [this](https://ide.bitquery.io/trade-stats-for-a-token-pair-on-uniswap-v4-bsc_1) query get pool stats (volume, bought, sold) for a specific Uniswap V4 pool on BSC.

```graphql
query pairTopTraders {
  EVM(network: bsc, dataset: realtime) {
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
          PoolId: {is: "0x00bbfee31c72fd3c7fba2febae5404de93cf6803be58db5282d0417a4d63abe6"}
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

[This](https://ide.bitquery.io/top-buyers-of-a-currency-on-uniswap-v4-bsc) API returns the top buyers of a token on Uniswap V4 virtual pool on BSC, along with the amount bought in token denominations and USD.

```graphql
{
  EVM(network: bsc) {
    DEXTrades(
      orderBy: {descendingByField: "bought_in_usd"}
      limit: {count: 100}
      where: {
        Trade: {
          Dex: {ProtocolName: {is: "uniswap_v4"}}, 
          Buy: {Currency: {SmartContract: {is: "0x55d398326f99059ff775485246999027b3197955"}}}
          PoolId: {is: "0x00bbfee31c72fd3c7fba2febae5404de93cf6803be58db5282d0417a4d63abe6"}
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

[This](https://ide.bitquery.io/top-sellers-of-a-token-on-uniswap-v4-pool-bsc) API returns the top sellers of a token on Uniswap V4 virtual pool on BSC, along with the amount sold in token denominations and USD.

```graphql
{
  EVM(network: bsc) {
    DEXTrades(
      orderBy: {descendingByField: "sold_in_usd"}
      limit: {count: 10}
      where: {
        Trade: {
          Dex: {ProtocolName: {is: "uniswap_v4"}}, 
          Sell: {Currency: {SmartContract: {is: "0x55d398326f99059ff775485246999027b3197955"}}}
          PoolId: {is: "0x00bbfee31c72fd3c7fba2febae5404de93cf6803be58db5282d0417a4d63abe6"}
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
