# GMGN EVM API

This section will guide you through different APIs which will tell you how to get data like realtime trades, price of a token, buys, sells, sell volume, makers, top holders of a token, liquidity of a pair and many more just like how GMGN shows for EVM Chains.

import VideoPlayer from "../../../../src/components/videoplayer.js";

## Get the Top Trading Pairs

The query will fetch you the Top Trading Pairs in desceneding order of the total number of trades took place in them just like how GMGN shows in its UI. You can check out the video tutorial [here](https://www.youtube.com/watch?v=qAJ2SPFaO-k) to understand the query better.

You can find the query [here](https://ide.bitquery.io/List-of-trading-pairs-in-descending-order-of-trxns-in-last-24-hours)

```
query TrendingPairs {
  EVM(dataset: combined, network: eth) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "TradeCount"}
      where: {Block: {Time: {since: "2024-06-05T08:08:00Z"}}, TransactionStatus: {Success: true}}
      limit: {count: 10}
      limitBy: {by: Trade_Dex_Pair_SmartContract, count: 1}
    ) {
      TradeCount: count
      Trade {
        Dex {
          SmartContract
          ProtocolName
          ProtocolFamily
          Pair {
            SmartContract
          }
        }
        Currency {
          Symbol
          SmartContract
        }
        Side {
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

## Get Trade Transactions for a particular pair in realtime

The query will subscribe you to real-time trade transactions for a pair, providing a continuous stream of data as new trades are processed and recorded.
You can find the query [here](https://ide.bitquery.io/Get-pair-trades-data-just-like-dexcsreener)

```
subscription{
  EVM(network: eth) {
    DEXTradeByTokens(
      orderBy: {ascending: Block_Time}
      where: {Trade: {Currency: {SmartContract: {is: "0x382ea807A61a418479318Efd96F1EFbC5c1F2C21"}}, Side: {Currency: {SmartContract: {is: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"}}}}}
    ) {
      Block{
        Time
      }
      Trade {
        Amount
        Currency {
          Symbol
        }
        PriceInUSD
        Dex {
          ProtocolName
          SmartContract
        }
        Side {
          Amount
          AmountInUSD
          Currency {
            Symbol
          }
          Buyer
          Seller
        }
        Buyer
        Seller
      }
      Transaction {
        Maker: From
        Hash
        Type
      }
    }
  }
}


```

## Get Price of a Token

This query will give you the latest Price of a specified token using DEXTrades API. Here we have calculated the price of a token in USD and also against the sell currency. Here is the [saved query link](https://ide.bitquery.io/Price-of-a-token-in-realtime)

```
query MyQuery {
  EVM(network: eth, dataset: realtime) {
    DEXTrades(
      limit: {count: 1}
      orderBy: {descending: Block_Time}
      where: {Trade: {Buy: {Currency: {SmartContract: {is: "0xaaeE1A9723aaDB7afA2810263653A34bA2C21C7a"}}}, Sell: {Currency: {SmartContract: {is: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"}}}, Dex: {Pair: {SmartContract: {is: "0xc2eaB7d33d3cB97692eCB231A5D0e4A649Cb539d"}}}}, TransactionStatus: {Success: true}}
    ) {
      Trade {
        Buy {
          Currency {
            Symbol
          }
          Price_In_USD: PriceInUSD
          Price_against_sell_currency: Price
        }
        Sell {
          Currency {
            Symbol
          }
        }
      }
    }
  }
}


```

## Get Liquidity of a specific pair by using its Pair Address

The below query finds the liquidity of a pool using the pool address `0xc2eaB7d33d3cB97692eCB231A5D0e4A649Cb539d`. With this query we can get balance of the pool tokens. And to get the USD Liquidity you can multiply the balances of both the tokens to their respective USD prices and then sum it up.

You can find the query [here](https://ide.bitquery.io/Get-liquidity-of-a-pair_1)

```
query MyQuery {
  EVM(dataset: archive, network: eth) {
    BalanceUpdates(
      where: {BalanceUpdate: {Address: {is: "0xc2eaB7d33d3cB97692eCB231A5D0e4A649Cb539d"}}, Currency: {SmartContract: {in: ["0xaaeE1A9723aaDB7afA2810263653A34bA2C21C7a","0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"]}}}
      orderBy: {descendingByField: "balance"}
  ) {
      Currency {
        Name
      }
      balance: sum(of: BalanceUpdate_Amount)
    }
  }
}


```

## Get the Buys, Sells, Buy Volume, Sell Volume and Makers

The query will fetch you the buys, sells, buy volume, sell volume and also the number of makers for a particular token just like how GMGN shows in its UI. We are getting these trade metrics for this particular pool address `0x842293fa6ee0642bf61ebf8310e7e546039ba7f4`.

You can find the query [here](https://ide.bitquery.io/Buys-Sells-BuyVolume-SellVolume-Makers-TotalTradedVolume-PriceinUSD-for-a-eth-pair#)

```
query MyQuery($network: evm_network, $token: String,$pairAddress: String , $min5_timestamp: DateTime, $hr1_timestamp: DateTime) {
  EVM(dataset: realtime, network: $network) {
    DEXTradeByTokens(
      where: {TransactionStatus: {Success: true}, Trade: {Currency: {SmartContract: {is: $token}}, Dex: {SmartContract: {is: $pairAddress}}}, Block: {Time: {since: $hr1_timestamp}}}
    ) {
      Trade {
        Currency {
          Name
          SmartContract
          Symbol
        }
        startPrice: PriceInUSD(minimum: Block_Time)
        Price_at_min5: PriceInUSD(
          minimum: Block_Time
          if: {Block: {Time: {after: $min5_timestamp}}}
        )
        current_price: PriceInUSD(maximum: Block_Time)
        Dex {
          ProtocolName
          ProtocolFamily
          SmartContract
        }
        Side {
          Currency {
            Symbol
            Name
            SmartContract
          }
        }
      }
      makers: count(distinct: Transaction_From)
      makers_5min: count(
        distinct: Transaction_From
        if: {Block: {Time: {after: $min5_timestamp}}}
      )
      buyers: count(
        distinct: Transaction_From
        if: {Trade: {Side: {Type: {is: sell}}}}
      )
      buyers_5min: count(
        distinct: Transaction_From
        if: {Trade: {Side: {Type: {is: sell}}}, Block: {Time: {after: $min5_timestamp}}}
      )
      sellers: count(
        distinct: Transaction_From
        if: {Trade: {Side: {Type: {is: buy}}}}
      )
      sellers_5min: count(
        distinct: Transaction_From
        if: {Trade: {Side: {Type: {is: buy}}}, Block: {Time: {after: $min5_timestamp}}}
      )
      trades: count
      trades_5min: count(if: {Block: {Time: {after: $min5_timestamp}}})
      traded_volume: sum(of: Trade_Side_AmountInUSD)
      traded_volume_5min: sum(
        of: Trade_Side_AmountInUSD
        if: {Block: {Time: {after: $min5_timestamp}}}
      )
      buy_volume: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: sell}}}}
      )
      buy_volume_5min: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: sell}}}, Block: {Time: {after: $min5_timestamp}}}
      )
      sell_volume: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: buy}}}}
      )
      sell_volume_5min: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: buy}}}, Block: {Time: {after: $min5_timestamp}}}
      )
      buys: count(if: {Trade: {Side: {Type: {is: sell}}}})
      buys_5min: count(
        if: {Trade: {Side: {Type: {is: sell}}}, Block: {Time: {after: $min5_timestamp}}}
      )
      sells: count(if: {Trade: {Side: {Type: {is: buy}}}})
      sells_5min: count(
        if: {Trade: {Side: {Type: {is: buy}}}, Block: {Time: {after: $min5_timestamp}}}
      )
    }
  }
}
{
  "network": "eth",
  "token": "0x6982508145454Ce325dDbE47a25d4ec3d2311933",
  "pairAddress": "0xA43fe16908251ee70EF74718545e4FE6C5cCEc9f",
  "hr1_timestamp": "2024-11-14T03:20:00Z",
  "min5_timestamp": "2024-11-14T04:15:00Z"
}
```

## Get OHLC of a token pair

This query retrieves the Open, High, Low, and Close (OHLC) prices in USD for a specific token traded on DEXes over a defined time period and interval. You can use the `quoteCurrency` to input the contract address of the currency used for quoting the token prices.

You can find the query [here](https://ide.bitquery.io/WETH-USDT-OHLC-on-Ethereum_1)

```
{
  EVM(network: eth, dataset: archive) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Block_testfield"}
      where: {Trade: {Currency: {SmartContract: {is: "0xdac17f958d2ee523a2206206994597c13d831ec7"}}, Side: {Currency: {SmartContract: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}, Type: {is: buy}}, PriceAsymmetry: {lt: 0.1}}}
      limit: {count: 10}
    ) {
      Block {
        testfield: Time(interval: {in: hours, count: 1})
      }
      volume: sum(of: Trade_Amount)
      Trade {
        high: Price(maximum: Trade_Price)
        low: Price(minimum: Trade_Price)
        open: Price(minimum: Block_Number)
        close: Price(maximum: Block_Number)
      }
      count
    }
  }
}
```

## Top Traders of a token

This query will fetch you top traders of a token for the selected network.
You can test the query [here](https://ide.bitquery.io/top-traders-of-a-token_7).

```
query topTraders($network: evm_network, $token: String) {
  EVM(network: $network) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "volumeUsd"}
      limit: {count: 100}
      where: {Trade: {Currency: {SmartContract: {is: $token}}}}
    ) {
      Trade {
        Buyer
        Dex {
          OwnerAddress
          ProtocolFamily
          ProtocolName
        }
      }
      bought: sum(of: Trade_Amount, if: {Trade: {Side: {Type: {is: buy}}}})
      sold: sum(of: Trade_Amount, if: {Trade: {Side: {Type: {is: sell}}}})
      volume: sum(of: Trade_Amount)
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
    }
  }
}
{
  "network": "eth",
  "token": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"
}
```

## Track newly created pairs on uniswap v3

You can track newly created pairs on uniswap v3 on ethereum mainnet.

Open this query on our GraphQL IDE using this [link](https://ide.bitquery.io/Latest-pools-created-Uniswap-v3_9).

```graphql
subscription {
  EVM(network: eth) {
    Events(
      orderBy: { descending: Block_Number }
      limit: { count: 10 }
      where: {
        Log: {
          SmartContract: { is: "0x1f98431c8ad98523631ae4a59f267346ea31f984" }
          Signature: { Name: { is: "PoolCreated" } }
        }
      }
    ) {
      Log {
        Signature {
          Name
          Parsed
          Signature
        }
        SmartContract
      }
      Transaction {
        Hash
      }
      Block {
        Date
        Number
      }
      Arguments {
        Type
        Value {
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
        }
        Name
      }
    }
  }
}
```
