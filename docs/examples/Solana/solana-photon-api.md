---
sidebar_position: 1
---

# Photon Solana API

This section will guide you through different APIs which will tell you how to get data like realtime trades just like how Photon shows for Solana.

:::note
`Trade Side Account` field will not be available for aggregate queries in Archive and Combined Datasets
:::

import VideoPlayer from "../../../src/components/videoplayer.js";

## Latest Trades Routed via Photon

This query retrieves the latest 100 trades that were routed through Photon on Solana.
The query uses a `joinInstructions` function to filter trades that specifically involved Photon's routing program (address: `BSfD6SHZigAfDWSjzD5Q41jw8LmKwtmjskPH9XW1mrRW`). For more information about using joins in Bitquery APIs, see our [graphQL joins documentation](https://docs.bitquery.io/docs/graphql/joins/).

[Run Query](https://ide.bitquery.io/Trades-Executed-on-Photon)

```
{
  Solana {
    DEXTrades(limit: {count: 100}, orderBy: {descending: Block_Time}) {
      Trade {
        Dex {
          ProtocolName
        }
        Sell {
          Currency {
            Symbol
          }
          Amount
          AmountInUSD
          Account {
            Address
          }
          Price
          PriceInUSD
        }
        Buy {
          Currency {
            Symbol
          }
          Amount
          AmountInUSD
          Account {
            Address
          }
          Price
          PriceInUSD
        }
      }
      Transaction {
        Signature
      }
      Instruction {
        ExternalSeqNumber
        InternalSeqNumber
      }
      joinInstructions(
        join: inner
        Block_Slot: Block_Slot
        Transaction_Signature: Transaction_Signature
        where: {Instruction: {Program: {Address: {is: "BSfD6SHZigAfDWSjzD5Q41jw8LmKwtmjskPH9XW1mrRW"}}}}
      ) {
        Instruction {
          Program {
            Address
          }
        }
        Transaction {
          Signature
        }
      }
    }
  }
}


```

## Get Trade Transactions Of Photon For A Particular Pair In Realtime

The query will subscribe you to real-time trade transactions for a Solana pair, providing a continuous stream of data as new trades are processed and recorded.
You can find the query [here](https://ide.bitquery.io/Get-Solana-pair-trades-data)

```graphql
subscription MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: { MintAddress: { is: "token mint address" } }
          Side: {
            Currency: {
              MintAddress: { is: "So11111111111111111111111111111111111111112" }
            }
          }
          Dex: {
            ProgramAddress: {
              is: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"
            }
          }
        }
        Transaction: { Result: { Success: true } }
      }
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

## Get Buy Volume, Sell Volume, Buys, Sells, Makers, Total Trade Volume, Buyers, Sellers Of A Specific Token Of Photon

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
  "token":"token mint address",
  "side_token": ""So11111111111111111111111111111111111111112",
  "pair_address: "4AZRPNEfCJ7iw28rJu5aUyeQhYcvdcNm8cswyL51AY9i",
  "time_5min_ago":"2024-11-06T15:13:00Z",
  "time_1h_ago": "2024-11-06T14:18:00Z"
}
```

## Get Top Pairs On Solana On Photon

The query will give the top 10 pairs on Solana network in descending order of their total trades happened in their pools in last 1 hour. This query will get you all the data you need such as total trades, total buys, total sells, total traded volume, total buy volume
Please change the `Block: {Time: {since: "2024-08-15T04:19:00Z"}}` accordingly when you try out the query.
Keep in mind you cannot use this as a websocket subscription becuase aggregate functions like `sum` doesn't work well in `subscription`.
You can find the query [here](https://ide.bitquery.io/Photon--All-in-One-query_1)

```graphql
query MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {
        Transaction: { Result: { Success: true } }
        Trade: {
          Side: {
            Currency: {
              MintAddress: { is: "So11111111111111111111111111111111111111112" }
            }
          }
        }
        Block: { Time: { since: "2024-08-15T04:19:00Z" } }
      }
      orderBy: { descendingByField: "total_trades" }
      limit: { count: 10 }
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
          if: { Block: { Time: { after: "2024-08-15T05:14:00Z" } } }
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
      total_trades: count
      total_traded_volume: sum(of: Trade_Side_AmountInUSD)
      total_buy_volume: sum(
        of: Trade_Side_AmountInUSD
        if: { Trade: { Side: { Type: { is: buy } } } }
      )
      total_sell_volume: sum(
        of: Trade_Side_AmountInUSD
        if: { Trade: { Side: { Type: { is: sell } } } }
      )
      total_buys: count(if: { Trade: { Side: { Type: { is: buy } } } })
      total_sells: count(if: { Trade: { Side: { Type: { is: sell } } } })
    }
  }
}
```
