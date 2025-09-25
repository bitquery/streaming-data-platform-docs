# Meteora DLMM API

Bitquery provides comprehensive real-time and historical data APIs and Streams for the Solana blockchain, enabling developers and traders to build powerful applications and execute trades based on reliable information from Meteora's Dynamic Liquidity Market Maker (DLMM).

## Frequently Asked Questions (FAQ)

### Can I monitor Meteora DLMM trades in real-time?

Yes, you can subscribe to real-time Meteora DLMM trades using GraphQL subscriptions. The API filters trades by the Meteora DLMM program address `LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo` and provides trade data as it happens on-chain. Examples available below.

### What data can I get from the Meteora DLMM API?

The API provides data for:

- **DEX Trades**: Buy/sell amounts, token details (name, symbol, mint address, decimals), trader addresses, and transaction signatures
- **Pool Creation**: Track new DLMM pools with token pairs, creator information, and account details
- **Price Data**: Real-time and historical token prices with USD conversions
- **OHLC Data**: Open, High, Low, Close price data for technical analysis
- **Volume Analytics**: Trading volume, buy/sell volume, and top trader insights

### How do I use Bitquery's Solana APIs?

Bitquery provides GraphQL APIs for Solana data. You can test queries using the IDE at ide.bitquery.io or convert queries to subscriptions for real-time data via WebSocket connections. To access API outside the IDE, you need to use your OAuth token, generate one [here](https://account.bitquery.io/user/api_v2/access_tokens). For enterprise users, we also offer Kafka streams for high-throughput data processing.

### What Kafka streams are available for Solana?

Bitquery provides managed Kafka topics including `solana.dextrades.proto`, `solana.tokens.proto`, and `solana.transactions.proto` with pre-parsed, enriched Protocol-Buffers events. These streams offer sub-second latency and enterprise-grade reliability for high-volume data processing. Read more [here](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/).

### Where can I find more information about Solana APIs?

For comprehensive Solana API documentation, visit [https://docs.bitquery.io/docs/blockchain/Solana/](https://docs.bitquery.io/docs/blockchain/Solana/). For real-time streaming options, check out [https://docs.bitquery.io/docs/streams/real-time-solana-data/](https://docs.bitquery.io/docs/streams/real-time-solana-data/).

## Meteora DLMM API Guide

In this section we will see how to get data on Meteora DLMM trades in real-time. According to the official Meteora documentation, DLMM (Dynamic Liquidity Market Maker) is an advanced AMM that provides efficient price discovery and liquidity provision for token pairs on Solana with concentrated liquidity features.

:::note
`Trade Side Account` field will not be available as aggregates in Archive and Combined Datasets
:::

<head>
<meta name="title" content="Meteora DLMM API - Monitor Solana Liquidity Pools & Trading Activity"/>
<meta name="description" content="Access real-time data on Meteora's Dynamic Liquidity Market Maker (DLMM) on Solana. Use our API to track liquidity pools, trades, and more."/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Meteora DLMM API - Real-Time Solana Liquidity Pools & Trades"
/>
<meta
  property="og:description"
  content="Get up-to-date information on Meteora's DLMM on Solana. Use our API to monitor liquidity pools and trading activities."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Meteora DLMM API - Monitor Solana Liquidity Pools & Trading Activity" />
<meta property="twitter:description" content="Access real-time data on Meteora's DLMM on Solana. Use our API to track liquidity pools, trades, and more." />
</head>

## Latest Pool Creation on Meteora DLMM

The below query tracks latest pool creation on Meteora DLMM.

The `"Program": {"AccountNames"}` includes the order in which account addresses are mentioned in `Accounts` list.

This includes pool creator, token vaults and token mints for the tokens being used in the pool.

The mint addresses for the tokens being used in the pool are listed, indicating which tokens the DLMM pool will support.

You can test the query [here](https://ide.bitquery.io/Track-Latest-created-pools-on-Meteora-DLMM_1)

```
subscription MyQuery {
  Solana {
    Instructions(
      where: {Transaction: {Result: {Success: true}}, Instruction: {Program: {Method: {is: "initializeLbPair2"}, Address: {is: "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo"}}}}
    ) {
      Block {
        Time
      }
      Instruction {
        Accounts {
          Address
          IsWritable
          Token {
            Mint
            Owner
            ProgramId
          }
        }
        Program {
          AccountNames
          Address
          Arguments {
            Name
            Type
            Value {
              ... on Solana_ABI_Integer_Value_Arg {
                integer
              }
              ... on Solana_ABI_String_Value_Arg {
                string
              }
              ... on Solana_ABI_Address_Value_Arg {
                address
              }
              ... on Solana_ABI_BigInt_Value_Arg {
                bigInteger
              }
              ... on Solana_ABI_Bytes_Value_Arg {
                hex
              }
              ... on Solana_ABI_Boolean_Value_Arg {
                bool
              }
              ... on Solana_ABI_Float_Value_Arg {
                float
              }
              ... on Solana_ABI_Json_Value_Arg {
                json
              }
            }
          }
          Method
          Name
        }
      }
      Transaction {
        Signature
        Signer
      }
    }
  }
}
```

## Subscribe to Realtime DLMM Trades

This query subscribes to real-time trades on the Meteora DLMM (Dynamic Liquidity Market Maker) on the Solana blockchain by filtering using the program address `LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo`.
You can run the query [here](https://ide.bitquery.io/Real-time-trades-on-MeteoraDLMM-DEX-on-Solana)

```graphql
subscription {
  Solana {
    DEXTrades(
      where: {
        Trade: {
          Dex: {
            ProgramAddress: {
              is: "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo"
            }
          }
        }
      }
    ) {
      Trade {
        Dex {
          ProgramAddress
          ProtocolFamily
          ProtocolName
        }
        Buy {
          Currency {
            Name
            Symbol
            MintAddress
          }
          Amount
          Account {
            Address
          }
          PriceAgainstSellCurrency: Price
        }
        Sell {
          Account {
            Address
          }
          Amount
          Currency {
            Name
            Symbol
            MintAddress
          }
          PriceAgainstBuyCurrency: Price
        }
      }
      Block {
        Time
      }
    }
  }
}
```

## Latest Price of a Token on Meteora DLMM

You can use the following query to get the latest price of a token on Meteora DLMM on Solana. This query fetches the most recent trade data for a specific token pair.

You can run this query using this [link](https://ide.bitquery.io/latest-price-of-a-token-on-DLMM#).

```
{
  Solana {
    DEXTradeByTokens(
      limit: {count: 1}
      orderBy: {descending: Block_Time}
      where: {Trade: {Dex: {ProgramAddress: {is: "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo"}}, Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}}}
    ) {
      Block {
        Time
      }
      Trade {
        Price
        PriceInUSD
      }
    }
  }
}

```

## Realtime Price Feed of a Token on Meteora DLMM

You can use the following subscription to get real-time price updates of a token on Meteora DLMM on Solana. This provides live price data as new trades occur.

You can run this query using this [link](https://ide.bitquery.io/Realtime-Price-feed-of-a-Token-on-Meteora-DLMM#).

```
subscription{
  Solana {
    DEXTradeByTokens(
      where: {Trade: {Dex: {ProgramAddress: {is: "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo"}}, Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}}}
    ) {
      Block {
        Time
      }
      Trade {
        Price
        PriceInUSD
      }
    }
  }
}
```

## Meteora DLMM OHLC API

If you want to get OHLC (Open, High, Low, Close) data for any specific currency pair on Meteora DLMM, you can use this API. This provides technical analysis data for charting and trading strategies.

:::note
Only use this API as a query and not as a subscription websocket, as Aggregates and Time Intervals don't work well with subscriptions.
:::

You can run this query [here](https://ide.bitquery.io/Meteora-DLMM-OHLC-API#).

```
{
  Solana {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Block_Timefield"}
      where: {Trade: {Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}, Dex: {ProgramAddress: {is: "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo"}}, PriceAsymmetry: {lt: 0.1}}}
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

## Get the Top Traders of a specific Token on Meteora DLMM DEX

The below query gets the Top Traders of the specified Token on Meteora DLMM. This provides insights into the most active traders and their trading patterns.

:::note
Keep in mind you can use this API only as a query and not a subscription websocket because aggregates don't work with subscription and you will end up getting wrong results.
:::

You can run the query [here](https://ide.bitquery.io/Get-the-Top-Traders-of-a-specific-Token-on-Meteora-DLMM-DEX#)

```
query TopTraders($token: String) {
  Solana {
    DEXTradeByTokens(
      orderBy: {descendingByField: "volumeUsd"}
      limit: {count: 100}
      where: {Trade: {Currency: {MintAddress: {is: $token}}, Dex: {ProgramAddress: {is: "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo"}}}, Transaction: {Result: {Success: true}}}
    ) {
      Trade {
        Account {
          Owner
        }
        Side {
          Account {
            Address
          }
          Type
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
  "token": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
}
```

## Get Trading Volume, Buy Volume, Sell Volume of a Token

This query fetches the traded volume, buy volume and sell volume of a specific token on Meteora DLMM. This provides comprehensive volume analytics for trading insights and market analysis.

Try out the API [here](https://ide.bitquery.io/Get-trading-volume-buy-volume-sell-volume-of-a-token_3#).

```
query MyQuery {
  Solana(dataset: combined) {
    DEXTradeByTokens(
      where: {Block: {Time: {since: "2025-03-10T07:00:00Z"}}, Transaction: {Result: {Success: true}}, Trade: {Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}, Dex: {ProgramAddress: {is: "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo"}}}}
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
      buy_volume: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: buy}}}}
      )
      sell_volume: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: sell}}}}
      )
    }
  }
}
```

## Related Documentation

- [Solana DEX Trades API](https://docs.bitquery.io/docs/blockchain/Solana/dextrades/)
- [Solana Token Holders API](https://docs.bitquery.io/docs/blockchain/Solana/token-holders/)
- [Real-time Solana Data Streams](https://docs.bitquery.io/docs/streams/real-time-solana-data/)
- [GraphQL Reference](https://docs.bitquery.io/docs/graphql-reference/)
- [API Authorization](https://docs.bitquery.io/docs/authorisation/how-to-use/)

## Support

For technical support and questions contact our support team via telegram or create a ticket [here](https://support.bitquery.io/)
