---
sidebar_position: 1
---

# GeckoTerminal Solana API

Everything you see on the GeckoTerminal Solana dashboard—live pairs, trades, prices, volumes, makers/buyers/sellers, and more—can be accessed via APIs/Streams with Bitquery.
We expose the same on-chain data via GraphQL APIs, real-time WebSocket streams, and enterprise Kafka topics, with optional cloud connectors (AWS, GCP, Snowflake) for analytics pipelines.

Checkout our [GeckoTerminal EVM API documentation](https://docs.bitquery.io/docs/blockchain/Ethereum/dextrades/evm-geckoterminal-api/) if you are interested in getting EVM chains(Ethereum, Binance Smart Chain(BSC), Arbitrum, Base, Matic, Optimism, etc) data which GeckoTerminal shows.

## Bitquery Solana Data Access Options

- **GraphQL APIs**: Query historical and real-time Solana data with flexible filtering and aggregation
- **Real-time Streams**: Subscribe to live Solana blockchain events via WebSocket subscriptions
- **Cloud Solutions**: Access Solana data through AWS, GCP, and Snowflake integrations
- **Kafka Streams**: High-throughput data streaming for enterprise applications

## Getting Started with Solana

- **[Solana API Examples](https://docs.bitquery.io/docs/blockchain/Solana/)** - Complete collection of Solana API examples
- **[Solana DEX Trades](https://docs.bitquery.io/docs/blockchain/Solana/solana-dextrades)** - Real-time DEX trading data and analytics
- **[Solana Subscriptions](https://docs.bitquery.io/docs/subscriptions/subscription)** - Learn how to set up real-time data streams
- **[IDE for Solana](https://graphql.bitquery.io/ide)** - Interactive development environment for testing Solana queries

This guide shows how to retrieve the same Solana DEX data that GeckoTerminal displays—real-time trades, pair stats, volumes, buyers/sellers, and more—using Bitquery APIs, streams, and Kafka.

<Head>
  <meta name="title" content="GeckoTerminal API | Solana - Live DEX & Token Data" />
  <meta name="description" content="Access real-time Solana DEX trades, token pairs, volumes, buyers, sellers, and live price data as seen on GeckoTerminal, via Bitquery GraphQL APIs and streaming." />
  <meta name="keywords" content="GeckoTerminal API,Solana DEX API,Solana live trades,token pair data,Solana on-chain analytics,Bitquery API,DEX statistics,DeFi analytics,Raydium,Orca,Jupiter,crypto API,blockchain data,real-time Solana stream" />
  <meta name="robots" content="index, follow" />
  <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="language" content="English" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="GeckoTerminal API | Solana - Live DEX & Token Data" />
  <meta property="og:description" content="Explore Solana DEX pairs, trades, volumes, live prices and buyer/seller stats from GeckoTerminal, using Bitquery API and real-time subscriptions." />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:title" content="GeckoTerminal API | Solana - Live DEX & Token Data" />
  <meta property="twitter:description" content="Access real-time Solana token pair analytics, trades, volumes, DEX prices and participant metrics just like GeckoTerminal, via Bitquery GraphQL API." />
</Head>

## Get Trade Transactions of GeckoTerminal for a particular pair in realtime

The query will subscribe you to real-time trade transactions for a Solana pair, providing a continuous stream of data as new trades are processed and recorded.
You can find the query [here](https://ide.bitquery.io/Get-Solana-pair-trades-data-just-like-geckoTerminal)

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

## Get Buy Volume, Sell Volume, Buys, Sells, Makers, Total Trade Volume, Buyers, Sellers of a specific Token of GeckoTerminal

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

## Get Top Pairs on Solana on GeckoTerminal

The query will give the top 10 pairs on Solana network in descending order of their total trades happened in their pools in last 1 hour. This query will get you all the data you need such as total trades, total buys, total sells, total traded volume, total buy volume
Please change the `Block: {Time: {since: "2024-08-15T04:19:00Z"}}` accordingly when you try out the query.
Keep in mind you cannot use this as a websocket subscription becuase aggregate functions like `sum` doesn't work well in `subscription`.
You can find the query [here](https://ide.bitquery.io/Get-Top-Pairs-on-Solana-on-GeckoTerminal)

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
