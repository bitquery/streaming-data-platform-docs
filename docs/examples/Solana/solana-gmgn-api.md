---
sidebar_position: 1
---

# GMGN Solana API

This section will guide you through different APIs which will tell you how to get data like realtime trades just like how GMGN shows for Solana.

import VideoPlayer from "../../../src/components/videoplayer.js";

<img width="1467" alt="Image" src="https://github.com/user-attachments/assets/bd1225d0-c464-44d1-a18c-c74661bbd83a" />

## Get Trade Transactions of GMGN for a particular pair in realtime

The query will subscribe you to real-time trade transactions for a Solana pair, providing a continuous stream of data as new trades are processed and recorded.
You can find the query [here](https://ide.bitquery.io/Get-Solana-pair-trades-data)

```
subscription MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {Trade: {Currency: {MintAddress: {is: "3B5wuUrMEi5yATD7on46hKfej3pfmd7t1RKgrsN3pump"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}, Dex: {ProgramAddress: {is: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"}}}, Transaction: {Result: {Success: true}}}
    ) {
      Block {
        Time
      }
      Trade {
        Currency {
          Name
          Symbol
        }
        Amount
        PriceAgainstSideCurrency: Price
        PriceInUSD
        Side {
          Currency {
            Name
            Symbol
          }
          Amount
          Type
        }
      }
      Transaction {
        Maker: Signer
        Signature
      }
    }
  }
}

```

## Get Buy Volume, Sell Volume, Buys, Sells, Makers, Total Trade Volume, Buyers, Sellers of a specific Token of GMGN

The below query gives you the essential stats for a token such as buy volume, sell volume, total buys, total sells, makers, total trade volume, buyers, sellers (in last 5 min, 1 hour) of a specific token.
You can run the query [here](https://ide.bitquery.io/Buys-Sells-BuyVolume-SellVolume-Makers-TotalTradedVolume-PriceinUSD-for-solana-token-pair)

```graphql
query MyQuery($token: String!, $side_token: String!, $pair_address: String!, $time_5min_ago: DateTime!, $time_1h_ago: DateTime!) {
  Solana(dataset: realtime) {
    DEXTradeByTokens(
      where: {Transaction: {Result: {Success: true}}, Trade: {Currency: {MintAddress: {is: $token}}, Side: {Currency: {MintAddress: {is: $side_token}}}, Market: {MarketAddress: {is: $pair_address}}}, Block: {Time: {since: $time_1h_ago}}}
    ) {
      Trade {
        Currency {
          Name
          MintAddress
          Symbol
        }
        start: PriceInUSD(minimum: Block_Time)
        min5: PriceInUSD(
          minimum: Block_Time
          if: {Block: {Time: {after: $time_5min_ago}}}
        )
        end: PriceInUSD(maximum: Block_Time)
        Dex {
          ProtocolName
          ProtocolFamily
          ProgramAddress
        }
        Market {
          MarketAddress
        }
        Side {
          Currency {
            Symbol
            Name
            MintAddress
          }
        }
      }
      makers: count(distinct: Transaction_Signer)
      makers_5min: count(
        distinct: Transaction_Signer
        if: {Block: {Time: {after: $time_5min_ago}}}
      )
      buyers: count(
        distinct: Transaction_Signer
        if: {Trade: {Side: {Type: {is: buy}}}}
      )
      buyers_5min: count(
        distinct: Transaction_Signer
        if: {Trade: {Side: {Type: {is: buy}}}, Block: {Time: {after: $time_5min_ago}}}
      )
      sellers: count(
        distinct: Transaction_Signer
        if: {Trade: {Side: {Type: {is: sell}}}}
      )
      sellers_5min: count(
        distinct: Transaction_Signer
        if: {Trade: {Side: {Type: {is: sell}}}, Block: {Time: {after: $time_5min_ago}}}
      )
      trades: count
      trades_5min: count(if: {Block: {Time: {after: $time_5min_ago}}})
      traded_volume: sum(of: Trade_Side_AmountInUSD)
      traded_volume_5min: sum(
        of: Trade_Side_AmountInUSD
        if: {Block: {Time: {after: $time_5min_ago}}}
      )
      buy_volume: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: buy}}}}
      )
      buy_volume_5min: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: buy}}}, Block: {Time: {after: $time_5min_ago}}}
      )
      sell_volume: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: sell}}}}
      )
      sell_volume_5min: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: sell}}}, Block: {Time: {after: $time_5min_ago}}}
      )
      buys: count(if: {Trade: {Side: {Type: {is: buy}}}})
      buys_5min: count(
        if: {Trade: {Side: {Type: {is: buy}}}, Block: {Time: {after: $time_5min_ago}}}
      )
      sells: count(if: {Trade: {Side: {Type: {is: sell}}}})
      sells_5min: count(
        if: {Trade: {Side: {Type: {is: sell}}}, Block: {Time: {after: $time_5min_ago}}}
      )
    }
  }
}
{
  "token":"2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
  "side_token": ""So11111111111111111111111111111111111111112",
  "pair_address: "4AZRPNEfCJ7iw28rJu5aUyeQhYcvdcNm8cswyL51AY9i",
  "time_5min_ago":"2024-11-06T15:13:00Z",
  "time_1h_ago": "2024-11-06T14:18:00Z"
}
```

## Get Top Pairs on Solana on GMGN

The query will give the top 10 pairs on Solana network in descending order of their total trades happened in their pools in last 1 hour. This query will get you all the data you need such as total trades, total buys, total sells, total traded volume, total buy volume
Please change the `Block: {Time: {since: "2024-08-15T04:19:00Z"}}` accordingly when you try out the query.
Keep in mind you cannot use this as a websocket subscription becuase aggregate functions like `sum` doesn't work well in `subscription`.
You can find the query [here](https://ide.bitquery.io/GMGN--All-in-One-query_1)

```
query MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {Transaction: {Result: {Success: true}}, Trade: {Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}}, Block: {Time: {since: "2024-08-15T04:19:00Z"}}}
      orderBy: {descendingByField: "total_trades"}
      limit: {count: 10}
    ) {
      Trade {
        Currency {
          Name
          MintAddress
          Symbol
        }
        start: PriceInUSD(minimum: Block_Time)
        min5: PriceInUSD(
          minimum: Block_Time
          if: {Block: {Time: {after: "2024-08-15T05:14:00Z"}}}
        )
        end: PriceInUSD(maximum: Block_Time)
        Dex {
          ProtocolName
          ProtocolFamily
          ProgramAddress
        }
        Market {
          MarketAddress
        }
        Side {
          Currency {
            Symbol
            Name
            MintAddress
          }
        }
      }
      makers: count(distinct:Transaction_Signer)
      total_trades: count
      total_traded_volume: sum(of: Trade_Side_AmountInUSD)
      total_buy_volume: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: buy}}}}
      )
      total_sell_volume: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: sell}}}}
      )
      total_buys: count(if: {Trade: {Side: {Type: {is: buy}}}})
      total_sells: count(if: {Trade: {Side: {Type: {is: sell}}}})
    }
  }
}
```

## Get OHLC for a token pair

You can use the below query to build charts like how you see on BullX. You will get OHLC data for a token pair using below query. Test the API [here](https://ide.bitquery.io/Solana-OHLC-Query_5?_gl=1*1simohi*_ga*MTU0ODE3ODUxMy4xNzM5Nzg0Njcw*_ga_ZWB80TDH9J*MTc0MjQ2MjAwNi43Ny4xLjE3NDI0NjIwNDQuMC4wLjA.)

```
{
  Solana {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Block_Timefield"}
      where: {Trade: {Currency: {MintAddress: {is: "6D7NaB2xsLd7cauWu1wKk6KBsJohJmP2qZH9GEfVi5Ui"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}, PriceAsymmetry: {lt: 0.1}}}
      limit: {count: 10}
    ) {
      Block {
        Timefield: Time(interval: {in: minutes, count: 1})
      }
      volume: sum(of: Trade_Amount)
      Trade {
        high: Price(maximum: Trade_Price)
        low: Price(minimum: Trade_Price)
        open: Price(minimum: Block_Slot)
        close: Price(maximum: Block_Slot)
      }
      count
    }
  }
}
```

## Get Top Traded Pairs

This query will give you top traded pairs data. You can find the query [here](https://ide.bitquery.io/top-trading-pairs?_gl=1*131rbu4*_ga*MTU0ODE3ODUxMy4xNzM5Nzg0Njcw*_ga_ZWB80TDH9J*MTc0MjQ2MjAwNi43Ny4xLjE3NDI0NjIwNDQuMC4wLjA.).

```
query ($time_10min_ago: DateTime, $time_1h_ago: DateTime, $time_3h_ago: DateTime) {
  Solana {
    DEXTradeByTokens(
      where: {Transaction: {Result: {Success: true}}, Block: {Time: {after: $time_3h_ago}}, any: [{Trade: {Side: {Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}}}}, {Trade: {Currency: {MintAddress: {not: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}}}, {Trade: {Currency: {MintAddress: {notIn: ["So11111111111111111111111111111111111111112", "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"]}}, Side: {Currency: {MintAddress: {notIn: ["So11111111111111111111111111111111111111112", "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"]}}}}}]}
      orderBy: {descendingByField: "usd"}
      limit: {count: 100}
    ) {
      Trade {
        Currency {
          Symbol
          Name
          MintAddress
        }
        Side {
          Currency {
            Symbol
            Name
            MintAddress
          }
        }
        price_last: PriceInUSD(maximum: Block_Slot)
        price_10min_ago: PriceInUSD(
          maximum: Block_Slot
          if: {Block: {Time: {before: $time_10min_ago}}}
        )
        price_1h_ago: PriceInUSD(
          maximum: Block_Slot
          if: {Block: {Time: {before: $time_1h_ago}}}
        )
        price_3h_ago: PriceInUSD(minimum: Block_Slot)
      }
      dexes: uniq(of: Trade_Dex_ProgramAddress)
      amount: sum(of: Trade_Side_Amount)
      usd: sum(of: Trade_Side_AmountInUSD)
      traders: uniq(of: Trade_Account_Owner)
      count(selectWhere: {ge: "100"})
    }
  }
}
{
  "time_10min_ago": "2024-09-19T12:26:17Z",
  "time_1h_ago": "2024-09-19T11:36:17Z",
  "time_3h_ago": "2024-09-19T09:36:17Z"
}
```

## Track newly created Pump Fun tokens, Creation Time, Dev Address, Metadata

Now you can track the newly created Pump Fun Tokens along with their dev address, metadata and supply. `PostBalance` will give you the current supply for the token. Check the query [here](https://ide.bitquery.io/newly-created-PF-token-dev-address-metadata)

```
subscription {
  Solana {
    TokenSupplyUpdates(
      where: {Instruction: {Program: {Address: {is: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"}, Method: {is: "create"}}}}
    ) {
      Block{
        Time
      }
      Transaction{
        Signer
      }
      TokenSupplyUpdate {
        Amount
        Currency {
          Symbol
          ProgramAddress
          PrimarySaleHappened
          Native
          Name
          MintAddress
          MetadataAddress
          Key
          IsMutable
          Fungible
          EditionNonce
          Decimals
          Wrapped
          VerifiedCollection
          Uri
          UpdateAuthority
          TokenStandard
        }
        PostBalance
      }
    }
  }
}

```

# Get trading volume, buy volume, sell volume of a token

This query fetches you the traded volume, buy volume and sell volume of a token `J4JbUQRaZMxdoQgY6oEHdkPttoLtZ1oKpBThic76pump`. Try out the API [here](https://ide.bitquery.io/trade_volume_Solana#).

```
query MyQuery {
  Solana(dataset: combined) {
    DEXTradeByTokens(
      where: {Block: {Time: {since: "2025-02-10T07:00:00Z"}}, Transaction: {Result: {Success: true}}, Trade: {Currency: {MintAddress: {is: "J4JbUQRaZMxdoQgY6oEHdkPttoLtZ1oKpBThic76pump"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}}}
    ) {
      Trade {
        Currency {
          MintAddress
          Decimals
        }
        Side {
          Currency {
            Name
            MintAddress
          }
        }
      }
      traded_volume_USD: sum(of: Trade_Side_AmountInUSD)
      traded_volume: sum(of: Trade_Amount)
    buy_volume: sum(of:Trade_Side_AmountInUSD if:{Trade:{Side:{Type:{is:buy}}}})
      sell_volume: sum(of:Trade_Side_AmountInUSD if:{Trade:{Side:{Type:{is:sell}}}})
    }
  }
}
```

## Get OHLC for a token pair

You can use the below query to build charts like how you see on BullX. You will get OHLC data for a token pair using below query. Test the API [here](https://ide.bitquery.io/Solana-OHLC-Query_5?_gl=1*1simohi*_ga*MTU0ODE3ODUxMy4xNzM5Nzg0Njcw*_ga_ZWB80TDH9J*MTc0MjQ2MjAwNi43Ny4xLjE3NDI0NjIwNDQuMC4wLjA.)

```
{
  Solana {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Block_Timefield"}
      where: {Trade: {Currency: {MintAddress: {is: "6D7NaB2xsLd7cauWu1wKk6KBsJohJmP2qZH9GEfVi5Ui"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}, PriceAsymmetry: {lt: 0.1}}}
      limit: {count: 10}
    ) {
      Block {
        Timefield: Time(interval: {in: minutes, count: 1})
      }
      volume: sum(of: Trade_Amount)
      Trade {
        high: Price(maximum: Trade_Price)
        low: Price(minimum: Trade_Price)
        open: Price(minimum: Block_Slot)
        close: Price(maximum: Block_Slot)
      }
      count
    }
  }
}
```

## Get Top Traded Pairs

This query will give you top traded pairs data. You can find the query [here](https://ide.bitquery.io/top-trading-pairs?_gl=1*131rbu4*_ga*MTU0ODE3ODUxMy4xNzM5Nzg0Njcw*_ga_ZWB80TDH9J*MTc0MjQ2MjAwNi43Ny4xLjE3NDI0NjIwNDQuMC4wLjA.).

```
query ($time_10min_ago: DateTime, $time_1h_ago: DateTime, $time_3h_ago: DateTime) {
  Solana {
    DEXTradeByTokens(
      where: {Transaction: {Result: {Success: true}}, Block: {Time: {after: $time_3h_ago}}, any: [{Trade: {Side: {Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}}}}, {Trade: {Currency: {MintAddress: {not: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}}}, {Trade: {Currency: {MintAddress: {notIn: ["So11111111111111111111111111111111111111112", "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"]}}, Side: {Currency: {MintAddress: {notIn: ["So11111111111111111111111111111111111111112", "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"]}}}}}]}
      orderBy: {descendingByField: "usd"}
      limit: {count: 100}
    ) {
      Trade {
        Currency {
          Symbol
          Name
          MintAddress
        }
        Side {
          Currency {
            Symbol
            Name
            MintAddress
          }
        }
        price_last: PriceInUSD(maximum: Block_Slot)
        price_10min_ago: PriceInUSD(
          maximum: Block_Slot
          if: {Block: {Time: {before: $time_10min_ago}}}
        )
        price_1h_ago: PriceInUSD(
          maximum: Block_Slot
          if: {Block: {Time: {before: $time_1h_ago}}}
        )
        price_3h_ago: PriceInUSD(minimum: Block_Slot)
      }
      dexes: uniq(of: Trade_Dex_ProgramAddress)
      amount: sum(of: Trade_Side_Amount)
      usd: sum(of: Trade_Side_AmountInUSD)
      traders: uniq(of: Trade_Account_Owner)
      count(selectWhere: {ge: "100"})
    }
  }
}
{
  "time_10min_ago": "2024-09-19T12:26:17Z",
  "time_1h_ago": "2024-09-19T11:36:17Z",
  "time_3h_ago": "2024-09-19T09:36:17Z"
}
```

# Get trading volume, buy volume, sell volume of a token

This query fetches you the traded volume, buy volume and sell volume of a token `J4JbUQRaZMxdoQgY6oEHdkPttoLtZ1oKpBThic76pump`. Try out the API [here](https://ide.bitquery.io/trade_volume_Solana#).

```
query MyQuery {
  Solana(dataset: combined) {
    DEXTradeByTokens(
      where: {Block: {Time: {since: "2025-02-10T07:00:00Z"}}, Transaction: {Result: {Success: true}}, Trade: {Currency: {MintAddress: {is: "J4JbUQRaZMxdoQgY6oEHdkPttoLtZ1oKpBThic76pump"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}}}
    ) {
      Trade {
        Currency {
          MintAddress
          Decimals
        }
        Side {
          Currency {
            Name
            MintAddress
          }
        }
      }
      traded_volume_USD: sum(of: Trade_Side_AmountInUSD)
      traded_volume: sum(of: Trade_Amount)
    buy_volume: sum(of:Trade_Side_AmountInUSD if:{Trade:{Side:{Type:{is:buy}}}})
      sell_volume: sum(of:Trade_Side_AmountInUSD if:{Trade:{Side:{Type:{is:sell}}}})
    }
  }
}
```
