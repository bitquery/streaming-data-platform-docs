---
title: "Solana Meteora Damm V2 API"
description: "Solana Meteora Damm V2 API: real-time Solana memecoin and DEX data via Bitquery GraphQL APIs and Kafka streams. Keep queries fast with indexed filters."
---
import FAQ from "@site/src/components/FAQ";

# Meteora DAMM v2 API

:::tip Need real-time Meteora DAMM v2 data or anything from the last ~30 days?
For **real-time + last ~30 days**, use the [**Trading cube**](/docs/trading/trading-data-overview) — [`Trading.Trades`](/docs/trading/crypto-trades-api/trades-api) gives you clean, MEV-filtered Meteora DAMM v2 swaps with **USD price, market cap, and supply on every row** across **9 chains in one API**. Use this page when you need **historical Meteora DAMM v2 data older than ~30 days**, raw per-swap detail, or call / event context.
:::

Bitquery provides comprehensive real-time and historical data APIs and Streams for the Solana blockchain, enabling developers and traders to build powerful applications and execute trades based on reliable information from Meteora's Dynamic Automated Market Maker (DAMM) v2.

## Meteora DAMM v2 API Guide

In this section we will see how to get data on Meteora DAMM v2 trades in real-time. According to the official Meteora documentation, DAMM v2 is a Dynamic Automated Market Maker that provides efficient price discovery and liquidity provision for token pairs on Solana.

:::note
`Trade Side Account` field will not be available as aggregates in Archive and Combined Datasets
:::

## Subscribe to Realtime DAMM v2 Trades

This query subscribes to real-time trades on the Meteora DAMM v2 (Dynamic Automated Market Maker) on the Solana blockchain by filtering using the program address `cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG`.
You can run the query [here](https://ide.bitquery.io/Real-time-trades-on-MeteoraDAMMv2-DEX-on-Solana)

```
subscription {
  Solana {
    DEXTrades(
      where: {
        Trade: {
          Dex: {
            ProgramAddress: {
              is: "cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG"
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
            Decimals
            Fungible
            Uri
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
            Decimals
            Fungible
            Uri
          }
          PriceAgainstBuyCurrency: Price
        }
      }
      Block {
        Time
      }
      Transaction {
        Signature
      }
    }
  }
}
```

## Latest Pool Creation on Meteora DAMM v2

The below query tracks latest pool creation on Meteora DAMM v2.

The `"Program": {"AccountNames"}` includes the order in which account addresses are mentioned in `Accounts` list.

This includes pool creator, token vaults and token mints for the tokens being used in the pool.

The mint addresses for the tokens being used in the pool are listed, indicating which tokens the DAMM v2 pool will support.

You can test the query [here](https://ide.bitquery.io/Track-Latest-created-pools-on-Meteora-DAMM-v2)

```
subscription MyQuery {
  Solana {
    Instructions(
      where: {Transaction: {Result: {Success: true}}, Instruction: {Program: {Method: {is: "EvtInitializePool"}, Address: {is: "cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG"}}}}
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

## Latest Price of a Token on Meteora DAMM v2

You can use the following query to get the latest price of a token on Meteora DAMM v2 on Solana. This query fetches the most recent trade data for a specific token pair.

You can run this query using this [link](https://ide.bitquery.io/latest-price-of-a-token-on-Damm-v2).

```
{
  Solana {
    DEXTradeByTokens(
      limit: {count: 1}
      orderBy: {descending: Block_Time}
      where: {Trade: {Dex: {ProgramAddress: {is: "cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG"}}, Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}}}
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

## Realtime Price Feed of a Token on Meteora DAMM v2

You can use the following subscription to get real-time price updates of a token on Meteora DAMM v2 on Solana. This provides live price data as new trades occur.

You can run this query using this [link](https://ide.bitquery.io/Realtime-Price-feed-of-a-Token-on-Meteora-DAMM-v2).

```
subscription{
  Solana {
    DEXTradeByTokens(
      where: {Trade: {Dex: {ProgramAddress: {is: "cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG"}}, Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}}}
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

## Meteora DAMM v2 OHLC API

If you want to get OHLC (Open, High, Low, Close) data for any specific currency pair on Meteora DAMM v2, you can use this API. This provides technical analysis data for charting and trading strategies.

:::note
Only use this API as a query and not as a subscription websocket, as Aggregates and Time Intervals don't work well with subscriptions.
:::

You can run this query [here](https://ide.bitquery.io/Meteora-DAMM-v2-OHLC-API).

```
{
  Solana {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Block_Timefield"}
      where: {Trade: {Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}, Dex: {ProgramAddress: {is: "cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG"}}, PriceAsymmetry: {lt: 0.1}}}
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

## Get the Top Traders of a specific Token on Meteora DAMM v2 DEX

The below query gets the Top Traders of the specified Token on Meteora DAMM v2. This provides insights into the most active traders and their trading patterns.

:::note
Keep in mind you can use this API only as a query and not a subscription websocket because aggregates don't work with subscription and you will end up getting wrong results.
:::

You can run the query [here](https://ide.bitquery.io/Get-the-Top-Traders-of-a-specific-Token-on-Meteora-DAMM-v2-DEX_1)

```
query TopTraders($token: String) {
  Solana {
    DEXTradeByTokens(
      orderBy: {descendingByField: "volumeUsd"}
      limit: {count: 100}
      where: {Trade: {Currency: {MintAddress: {is: $token}}, Dex: {ProgramAddress: {is: "cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG"}}}, Transaction: {Result: {Success: true}}}
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

This query fetches the traded volume, buy volume and sell volume of a specific token on Meteora DAMM v2. This provides comprehensive volume analytics for trading insights and market analysis.

Try out the API [here](https://ide.bitquery.io/Get-trading-volume-buy-volume-sell-volume-of-a-token_2).

```
query MyQuery {
  Solana(dataset: combined) {
    DEXTradeByTokens(
      where: {Block: {Time: {since: "2025-03-10T07:00:00Z"}}, Transaction: {Result: {Success: true}}, Trade: {Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}, Dex: {ProgramAddress: {is: "cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG"}}}}
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

<FAQ
  items={[
    { q: "Can I monitor Meteora DAMM v2 trades in real time?", a: "Yes. Subscribe to Solana.DEXTrades filtered by program cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG. Trade examples are on this page." },
    { q: "What data can I get from Meteora DAMM v2?", a: "DEX trades, new pools, OHLC-style aggregates, volume rankings, and USD-normalized prices." },
    { q: "How do I get OHLC for a Meteora DAMM v2 pair?", a: "Use DEXTradeByTokens with interval aggregation, or Trading.Trades for recent USD candles on Solana." },
    { q: "Do I need an API token outside the IDE?", a: "Yes. Generate an OAuth token from your Bitquery account to run production queries and subscriptions." },
  ]}
/>

## Related Documentation

- [Solana DEX Trades API](/docs/blockchain/Solana/solana-dextrades/)
- [Solana Token Holders API](/docs/blockchain/Solana/solana-token-holders/)
- [Real-time Solana Data Streams](/docs/streams/real-time-solana-data/)
- [Schema overview](/docs/schema/schema-intro/)
- [API Authorization](/docs/authorization/how-to-use/)

## Support

For technical support and questions contact our support team via telegram or create a ticket [here](https://support.bitquery.io/)
