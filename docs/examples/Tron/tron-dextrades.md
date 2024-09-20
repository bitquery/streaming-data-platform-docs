---
sidebar_position: 2
---

# Tron DEX Trades API

In this section we will see how to get Tron DEX trades information using our API.

This Tron API is part of our Early Access Program (EAP), which is intended for evaluation purposes.
This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

<head>
<meta name="title" content="How to Get Tron Decentralized Exchange Data with DEX Trades API"/>
<meta name="description" content="Get on-chain data of any Tron based DEX through our DEX Trades API."/>
<meta name="keywords" content="Tron DEX Trades api,Tron DEX Trades python api,Tron DEX Trades token api,Tron Dex NFT api, DEX Trades scan api, DEX Trades api, DEX Trades api docs, DEX Trades crypto api, DEX Trades blockchain api,Tron network api, Tron web3 api, tronscan api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="How to Get Tron Decentralized Exchange Data with DEX Trades API"
/>
<meta
  property="og:description"
  content="Get on-chain data of any Tron based DEX through our DEX Trades API."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="How to Get Tron Decentralized Exchange Data with DEX Trades API" />
<meta property="twitter:description" content="Get on-chain data of any Tron based DEX through our DEX Trades API." />
</head>

## Subscribe to Latest Tron Trades

This subscription will return information about the most recent trades executed on Tron's DEX platforms.
You can try the query [here](https://ide.bitquery.io/Latest-trades-on-Tron)

```
subscription {
  Tron {
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
            Fungible
            Decimals
            Name
            Native
            SmartContract
            Symbol
          }
        }
      }
    }
  }
}


```

## Get Top gainer tokens on Tron Network

This query fetches you the top gainer tokens on Tron network.
You can try the query [here](https://ide.bitquery.io/top-gainers_1).

```
{
  Tron {
    DEXTradeByTokens(
      where: {Transaction: {Result: {Success: true}}}
      orderBy: {descendingByField: "usd"}
      limit: {count: 100}
    ) {
      Trade {
        Currency {
          Symbol
          Name
          SmartContract
        }
        Side {
          Currency {
            Symbol
            Name
            SmartContract
          }
        }
        price_last: PriceInUSD(maximum: Block_Number)
        price_1h_ago: PriceInUSD(minimum: Block_Number)
      }
      dexes: uniq(of: Trade_Dex_OwnerAddress)
      amount: sum(of: Trade_Side_Amount)
      usd: sum(of: Trade_Side_AmountInUSD)
      buyers: uniq(of: Trade_Buyer)
      sellers: uniq(of: Trade_Seller)
      count(selectWhere: {ge: "100"})
    }
  }
}
```

![image](https://github.com/user-attachments/assets/59eae28e-bfdd-42ea-b942-fd0c9facf583)

You can check the data here on [DEXrabbit](https://dexrabbit.com/tron).

## Get Top loser tokens on Tron Network

This query fetches you the top loser tokens on Tron network.
You can try the query [here](https://ide.bitquery.io/top-losers).

```
{
  Tron {
    DEXTradeByTokens(
      where: {Transaction: {Result: {Success: true}}}
      orderBy: {ascendingByField: "usd"}
      limit: {count: 100}
    ) {
      Trade {
        Currency {
          Symbol
          Name
          SmartContract
        }
        Side {
          Currency {
            Symbol
            Name
            SmartContract
          }
        }
        price_last: PriceInUSD(maximum: Block_Number)
        price_1h_ago: PriceInUSD(minimum: Block_Number)
      }
      dexes: uniq(of: Trade_Dex_OwnerAddress)
      amount: sum(of: Trade_Side_Amount)
      usd: sum(of: Trade_Side_AmountInUSD)
      buyers: uniq(of: Trade_Buyer)
      sellers: uniq(of: Trade_Seller)
      count(selectWhere: {ge: "100"})
    }
  }
}
```

![image](https://github.com/user-attachments/assets/67d6b503-1232-42d3-94da-05f1d3737b80)

You can check the data here on [DEXrabbit](https://dexrabbit.com/tron).

## Get Top bought tokens on Tron Network

This query fetches you the top bought tokens on Tron network.
You can try the query [here](https://ide.bitquery.io/top-bought).

```
{
  Tron {
    DEXTradeByTokens(
      orderBy: {descendingByField: "buy"}
      where: {Transaction: {Result: {Success: true}}}
      limit: {count: 100}
    ) {
      Trade {
        Currency {
          Symbol
          Name
          SmartContract
        }
      }
      buy: sum(of: Trade_Side_AmountInUSD, if: {Trade: {Side: {Type: {is: buy}}}})
      sell: sum(of: Trade_Side_AmountInUSD, if: {Trade: {Side: {Type: {is: sell}}}})
    }
  }
}

```

Arranged in the descending order of `bought - sold` on [DEXrabbit](https://dexrabbit.com/tron).

![image](https://github.com/user-attachments/assets/e3dcd6e7-7ee8-469b-a2ee-de1a3ce63e78)

You can check the data here on [DEXrabbit](https://dexrabbit.com/tron).

## Get Top sold tokens on Tron Network

This query fetches you the top sold tokens on Tron network.
You can try the query [here](https://ide.bitquery.io/top-sold).

```
{
  Tron {
    DEXTradeByTokens(
      orderBy: {descendingByField: "sell"}
      where: {Transaction: {Result: {Success: true}}}
      limit: {count: 100}
    ) {
      Trade {
        Currency {
          Symbol
          Name
          SmartContract
        }
      }
      buy: sum(of: Trade_Side_AmountInUSD, if: {Trade: {Side: {Type: {is: buy}}}})
      sell: sum(of: Trade_Side_AmountInUSD, if: {Trade: {Side: {Type: {is: sell}}}})
    }
  }
}

```

Arranged in the descending order of `sold - bought` on [DEXrabbit](https://dexrabbit.com/tron).

![image](https://github.com/user-attachments/assets/fc1e4ae8-8ef9-41c8-bf08-175000cac870)

You can check the data here on [DEXrabbit](https://dexrabbit.com/tron).

## Get OHLC data of a token on Tron Network

This query fetches you the OHLC data of a specific token on Tron network.
You can try the query [here](https://ide.bitquery.io/ohlc_9).

```
query tradingViewPairs($token: String, $base: String) {
  Tron {
    DEXTradeByTokens(
      orderBy: {ascendingByField: "Block_Time"}
      where: {Trade: {Side: {Amount: {gt: "0"}, Currency: {SmartContract: {is: $base}}}, Currency: {SmartContract: {is: $token}}}}
    ) {
      Block {
        Time(interval: {count: 5, in: minutes})
      }
      Trade {
        open: PriceInUSD(minimum: Block_Number)
        close: PriceInUSD(maximum: Block_Number)
        max: PriceInUSD(maximum: Trade_PriceInUSD)
        min: PriceInUSD(minimum: Trade_PriceInUSD)
      }
      volume: sum(of: Trade_Side_Amount)
    }
  }
}
{
  "token": "TJ9mxWPmQSJswqMakEehFWcAntg73odiAq",
  "base": "TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR"
}
```

![image](https://github.com/user-attachments/assets/5ed90e34-a6ed-4c9b-a458-30d81a19d9f1)

You can check the data here on [DEXrabbit](https://dexrabbit.com/tron/pair/TJ9mxWPmQSJswqMakEehFWcAntg73odiAq/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR).

## Get Latest Trades of a token on Tron Network

This query fetches you the latest trades of a specific token on Tron network.
You can try the query [here](https://ide.bitquery.io/latest-trades_3).

```
query LatestTrades($token: String, $base: String) {
  Tron {
    DEXTradeByTokens(
      orderBy: {descending: Block_Time}
      limit: {count: 50}
      where: {Trade: {Side: {Amount: {gt: "0"}, Currency: {SmartContract: {is: $base}}}, Currency: {SmartContract: {is: $token}}, Price: {gt: 0}}, Transaction: {Result: {Success: true}}}
    ) {
      Block {
        allTime: Time
      }
      Trade {
        Dex {
          OwnerAddress
          ProtocolFamily
          ProtocolName
        }
        Currency {
          Symbol
          SmartContract
          Name
        }
        Price
        AmountInUSD
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
      }
    }
  }
}
{
  "token": "TJ9mxWPmQSJswqMakEehFWcAntg73odiAq",
  "base": "TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR"
}
```

![image](https://github.com/user-attachments/assets/af073bde-0e9e-45cf-8d27-bd9176d7bf73)

You can check the data here on [DEXrabbit](https://dexrabbit.com/tron/pair/TJ9mxWPmQSJswqMakEehFWcAntg73odiAq/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR#pair_latest_trades).

## Get Top Traders of a token on Tron Network

This query fetches you the top traders of a specific token on Tron network.
You can try the query [here](https://ide.bitquery.io/top-traders_6).

```
query TopTraders($token: String, $base: String) {
  Tron {
    DEXTradeByTokens(
      orderBy: {descendingByField: "volumeUsd"}
      limit: {count: 100}
      where: {Trade: {Currency: {SmartContract: {is: $token}}, Side: {Amount: {gt: "0"}, Currency: {SmartContract: {is: $base}}}}, Transaction: {Result: {Success: true}}}
    ) {
      Trade {
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
  "token": "TJ9mxWPmQSJswqMakEehFWcAntg73odiAq",
  "base": "TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR"
}
```

![image](https://github.com/user-attachments/assets/f40658bd-aa9f-4c32-bcf3-792c098ea66e)

You can check the data here on [DEXrabbit](https://dexrabbit.com/tron/pair/TSig7sWzEL2K83mkJMQtbyPpiVSbR6pZnb/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR#pair_top_traders).

## Get DEX markets for a specific Token

This query fetches you the DEXs where a specific token is being traded on Tron network.
You can try the query [here](https://ide.bitquery.io/DEX-Markets-for-a-token_1).

```
query ($token: String, $base: String, $time_10min_ago: DateTime, $time_1h_ago: DateTime, $time_3h_ago: DateTime) {
  Tron {
    DEXTradeByTokens(
      orderBy: {descendingByField: "amount"}
      where: {Trade: {Currency: {SmartContract: {is: $token}}, Side: {Amount: {gt: " "}, Currency: {SmartContract: {is: $base}}}}, Transaction: {Result: {Success: true}}, Block: {Time: {after: $time_3h_ago}}}
    ) {
      Trade {
        Dex {
          ProtocolFamily
          ProtocolName
        }
        price_last: PriceInUSD(maximum: Block_Number)
        price_10min_ago: PriceInUSD(
          maximum: Block_Number
          if: {Block: {Time: {before: $time_10min_ago}}}
        )
        price_1h_ago: PriceInUSD(
          maximum: Block_Number
          if: {Block: {Time: {before: $time_1h_ago}}}
        )
        price_3h_ago: PriceInUSD(minimum: Block_Number)
      }
      amount: sum(of: Trade_Side_Amount)
      pairs: uniq(of: Trade_Side_Currency_SmartContract)
      trades: count
    }
  }
}
{
  "token": "TSig7sWzEL2K83mkJMQtbyPpiVSbR6pZnb",
  "base": "TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR",
  "time_10min_ago": "2024-09-20T08:36:40Z",
  "time_1h_ago": "2024-09-20T07:46:40Z",
  "time_3h_ago": "2024-09-20T05:46:40Z"
}
```

![image](https://github.com/user-attachments/assets/cf2e2b29-8a15-41d1-bbef-41339fd41f60)

You can check the data here on [DEXrabbit](https://dexrabbit.com/tron/pair/TSig7sWzEL2K83mkJMQtbyPpiVSbR6pZnb/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR#pair_dex_list).

## Get All DEXs info on Tron network

This query fetches you all the DEXs information on Tron network such as unique sellers, unique buyers etc.
You can try the query [here](https://ide.bitquery.io/all-dexs-info).

```
query DexMarkets {
  Tron {
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
```

![image](https://github.com/user-attachments/assets/01287a30-53e1-4ffa-b5fc-828009282ac5)

You can check the data here on [DEXrabbit](https://dexrabbit.com/tron/dex_market).

## Get Top Traders on Tron network

This query fetches you TOp Traders information on Tron network.
You can try the query [here](https://ide.bitquery.io/top-traders-on-tron-network).

```
query DexMarkets {
  Tron {
    DEXTradeByTokens(orderBy: {descendingByField: "trades"}, limit: {count: 100}) {
      Trade {
        Dex {
          OwnerAddress
        }
      }
      trades: count(if: {Trade: {Side: {Type: {is: buy}}}})
      tokens: uniq(of: Trade_Currency_SmartContract)
    }
  }
}
```

![image](https://github.com/user-attachments/assets/1184d54f-47db-428f-8f71-cd0c591a310b)

You can check the data here on [DEXrabbit](https://dexrabbit.com/tron/trader).

## Subscribe to Latest Price of a Token in Real-time

This query provides real-time updates on price of token `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t` in terms of USDT `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`, including details about the DEX. Try the query [here](https://ide.bitquery.io/Track-price-of-a-tron-token-in-realtime)

```
subscription MyQuery {
  Tron {
    DEXTradeByTokens(
      where: {Trade: {Currency: {SmartContract: {is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"}}}, TransactionStatus: {Success: true}}
    ) {
      Block {
        Time
      }
      Trade {
        Amount
        AmountInUSD
        Buyer
        Price
        PriceInUSD
        Seller
        Currency {
          Symbol
          SmartContract
          Name
        }
        Dex {
          SmartContract
          ProtocolName
          ProtocolFamily
        }
        Side {
          Amount
          AmountInUSD
          Buyer
          Seller
          Currency {
            Name
            Symbol
            SmartContract
          }
        }
      }
    }
  }
}


```
