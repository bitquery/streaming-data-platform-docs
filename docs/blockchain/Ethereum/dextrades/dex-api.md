# DEX API

> **Before you start**: Not sure when to use DexTrades vs DexTradesByTokens vs Events vs Calls? Read our [Mental Model guide](https://docs.bitquery.io/docs/start/mental-model-transfers-events-calls) to understand which primitive to use for your use case.

We have two main APIs to get DEX trading data.

- DEXTrades
- DEXTradeByTokens

To learn the difference between two APIs, please check [this doc](https://docs.bitquery.io/docs/schema/evm/dextrades/).

## Get all the DEXs info on a Ethereum network

This query will fetch you all the DEXs info for the selected network.
You can test the query [here](https://ide.bitquery.io/dex-markets).

```
query DexMarkets($network: evm_network) {
  EVM(network: $network) {
    DEXTradeByTokens {
      Trade {
        Dex {
          ProtocolFamily
        }
      }
      buyers: uniq(of: Trade_Buyer)
      sellers: uniq(of: Trade_Sender)
      count(if: {Trade: {Side: {Type: {is: buy}}}})
    }
  }
}
{
  "network": "eth"
}
```

![image](https://github.com/user-attachments/assets/591eac39-2e11-4885-b297-87aa65d0a185)

You can check the data here on [DEXrabbit](https://dexrabbit.com/eth/dex_market).

## Get a specific DEX statistics

This query will fetch you a specific DEX stats for the selected network.
You can test the query [here](https://ide.bitquery.io/dex-info).

```
query DexMarkets($network: evm_network, $market: String) {
  EVM(network: $network) {
    DEXTradeByTokens(
      orderBy: {ascendingByField: "Block_Time"}
      where: {Trade: {Dex: {ProtocolFamily: {is: $market}}}}
    ) {
      Block {
        Time(interval: {count: 1, in: hours})
      }
      trades: count
      buyers: uniq(of: Trade_Buyer)
      sellers: uniq(of: Trade_Sender)
      tokens: uniq(of: Trade_Currency_SmartContract)
    }
  }
}
{
  "market": "Uniswap",
  "network": "eth"
}
```

![image](https://github.com/user-attachments/assets/ea23fa51-e21c-4f97-8719-905475e00769)

You can check the data here on [DEXrabbit](https://dexrabbit.com/eth/dex_market/Uniswap).

## Get All Trading Pairs on a particular DEX

This query will fetch you all trading pairs on a particular DEX for the selected network.
You can test the query [here](https://ide.bitquery.io/trading-pairs-on-a-specific-dex).

```
query DexMarkets($network: evm_network, $market: String, $time_10min_ago: DateTime, $time_1h_ago: DateTime, $time_3h_ago: DateTime) {
  EVM(network: $network) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "usd"}
      where: {Trade: {Dex: {ProtocolFamily: {is: $market}}}, Block: {Time: {after: $time_3h_ago}}}
      limit: {count: 200}
    ) {
      Trade {
        Currency {
          Symbol
          Name
          SmartContract
          Fungible
        }
        Side {
          Currency {
            Symbol
            Name
            SmartContract
          }
        }
        price_usd: PriceInUSD(maximum: Block_Number)
        price_last: Price(maximum: Block_Number)
        price_10min_ago: Price(
          maximum: Block_Number
          if: {Block: {Time: {before: $time_10min_ago}}}
        )
        price_1h_ago: Price(
          maximum: Block_Number
          if: {Block: {Time: {before: $time_1h_ago}}}
        )
        price_3h_ago: PriceInUSD(minimum: Block_Number)
      }
      usd: sum(of: Trade_AmountInUSD)
      count
    }
  }
}
{
  "market": "Uniswap",
  "network": "eth",
  "time_10min_ago": "2024-09-22T13:21:39Z",
  "time_1h_ago": "2024-09-22T12:31:39Z",
  "time_3h_ago": "2024-09-22T10:31:39Z"
}
```

![image](https://github.com/user-attachments/assets/a5d80402-54d1-49e9-a9e0-62cea1204f73)

You can check the data here on [DEXrabbit](https://dexrabbit.com/eth/dex_market/Uniswap).

## Top Traders on a DEX

This query will fetch you Top Traders on a particular DEX for the selected network.
You can test the query [here](https://ide.bitquery.io/top-traders-on-a-DEX_1).

```
query DexMarkets($network: evm_network, $market: String) {
  EVM(network: $network) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "volumeUsd"}
      limit: {count: 100}
      where: {Trade: {Dex: {ProtocolFamily: {is: $market}}}}
    ) {
      Trade {
        Buyer
        Dex {
          OwnerAddress
          ProtocolFamily
          ProtocolName
        }
        Currency {
          SmartContract
          Symbol
          Name
        }
        Side {
          Currency {
            SmartContract
            Symbol
            Name
          }
        }
      }
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
    }
  }
}
{
  "market": "Uniswap",
  "network": "eth"
}
```

![image](https://github.com/user-attachments/assets/3cf6b7bd-b04f-45a1-bcb1-d9369d1ed638)

You can check the data here on [DEXrabbit](https://dexrabbit.com/eth/dex_market/Uniswap#traders).

## Latest Trades on a DEX

This query will fetch you latest trades on a particular DEX for the selected network.
You can test the query [here](https://ide.bitquery.io/latest-trades_5).

```
query LatestTrades($network: evm_network, $market: String) {
  EVM(network: $network) {
    DEXTradeByTokens(
      orderBy: {descending: Block_Time}
      limit: {count: 50}
      where: {Trade: {Dex: {ProtocolFamily: {is: $market}}}}
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Trade {
        Dex {
          OwnerAddress
          ProtocolFamily
          ProtocolName
        }
        AmountInUSD
        Price
        Amount
        Side {
          Type
          Currency {
            Symbol
            SmartContract
            Name
          }
          AmountInUSD
          Amount
        }
        Currency {
          Symbol
          SmartContract
          Name
        }
      }
    }
  }
}
{
  "market": "Uniswap",
  "network": "eth"
}
```

![image](https://github.com/user-attachments/assets/4495ec8e-ab55-4cf9-8b58-99ef264dcc1d)

You can check the data here on [DEXrabbit](https://dexrabbit.com/eth/dex_market/Uniswap#trades).
