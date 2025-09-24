# BonkSwap API

In this document, we will explore several examples related to BonkSwap data.

Need zero-latency BonkSwap data? [Read about our Shred Streams and Contact us for a Trial](https://docs.bitquery.io/docs/streams/real-time-solana-data/).

:::note
To query or stream data via graphQL **outside the Bitquery IDE**, you need to generate an API access token.

Follow the steps here to create one: [How to generate Bitquery API token ➤](https://docs.bitquery.io/docs/authorisation/how-to-generate/)
:::

import VideoPlayer from "../../../src/components/videoplayer.js";

## Table of Contents

- [BonkSwap Examples](#bonkswap-examples)
  - [Latest Trades on BonkSwap](#latest-trades-on-bonkswap)
  - [Get Top Traders on BonkSwap](#get-top-traders-on-bonkswap)
  - [Get Latest Trades By Trader on BonkSwap](#get-latest-trades-by-trader-on-bonkswap)
  - [OHLC of a token on BonkSwap](#get-ohlc-for-a-bonkswap-token)

<head>
  <meta name="title" content="BonkSwap API - Solana - Tokens, Trades, Live Prices"/>
  <meta name="description" content="Get on-chain data of any BonkSwap based token through our BonkSwap API."/>
  <meta name="keywords" content="BonkSwap API,BonkSwap on-chain data API,BonkSwap token data API,BonkSwap blockchain API,BonkSwap DEX data API,BonkSwap API documentation,BonkSwap crypto API,BonkSwap web3 API,DEX Trades,Solana,Blast,BonkSwap memecoins,Solana DEX,Blast DEX,token trading,blockchain data,crypto trading"/>
  <meta name="robots" content="index, follow"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="language" content="English"/>

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="BonkSwap API - Solana - Tokens, Trades, Live Prices"
/>
<meta
  property="og:description"
  content="Get on-chain data of any BonkSwap based token through our BonkSwap API."
/>

  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="BonkSwap API - Solana - Tokens, Trades, Live Prices"/>
  <meta property="twitter:description" content="Get on-chain data of any BonkSwap based token through our BonkSwap API."/>
</head>

If you want fastest data without any latency, we can provide Kafka streams, please [fill this form](https://bitquery.io/forms/api) for it. Our Team will reach out.

## BonkSwap Examples

## Latest Trades on BonkSwap

This is a graphQL query that fetches latest swaps on BonkSwap, you can convert this to a stream by changing the word `query` to `subscription`.

[Run Query ➤](https://ide.bitquery.io/Latest-Trades-on-BonkSwap)

```
query LatestTrades {
  Solana {
    DEXTradeByTokens(
      orderBy: {descending: Block_Time}
      limit: {count: 50}
      where: {
        Transaction: {Result: {Success: true}},
        Trade: {Dex: {ProtocolName: {is: "bonkswap"}}}
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Signature
      }
      Trade {
        Dex {
          ProtocolFamily
          ProtocolName
        }
        Account {
          Owner
        }
        Side {
          Type
          Account {
            Address
            Owner
          }
        }
        AmountInUSD
        PriceInUSD
        Amount
        Side {
          Currency {
            Symbol
            MintAddress
            Name
          }
          AmountInUSD
          Amount
        }
        Currency {
          Symbol
          MintAddress
          Name
        }
      }
    }
  }
}

```

## Get Top Traders on BonkSwap

The below API fetches top traders on BonkSwap using recent trading volume of the trader.

[Run Query ➤](https://ide.bitquery.io/Top-Traders-on-BonkSwap)

```
query TopTraders {
  Solana {
    DEXTradeByTokens(
      orderBy: {descendingByField: "volumeUsd"}
      limit: {count: 70}
      where: {
        Transaction: {Result: {Success: true}},
        Trade: {Dex: {ProtocolName: {is: "bonkswap"}}},
        Block: {Time: {after: "2025-06-10T09:07:39Z"}},
        any: [
          {Trade: {Side: {Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}}}},
          {Trade: {
            Currency: {MintAddress: {not: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}},
            Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}
          }},
          {Trade: {
            Currency: {MintAddress: {notIn: [
              "So11111111111111111111111111111111111111112",
              "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
            ]}},
            Side: {Currency: {MintAddress: {notIn: [
              "So11111111111111111111111111111111111111112",
              "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
            ]}}}
          }}
        ]
      }
    ) {
      Trade {
        Account {
          Owner
        }
        Dex {
          ProtocolFamily
          ProtocolName
        }
        Currency {
          MintAddress
          Symbol
          Name
        }
        Side {
          Currency {
            MintAddress
            Symbol
            Name
          }
        }
      }
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
    }
  }
}

```

## Get Latest Trades By Trader on BonkSwap

The below API fetches recent trades by a particular trader. We use the `Transaction->Signer` field to set this criteria.

[Run Query ➤](https://ide.bitquery.io/Bonkswap-Trades-by-Trader-API)

```
{
  Solana(network: solana, dataset: realtime) {
    DEXTrades(
      orderBy: [{descending: Block_Time}, {descending: Transaction_Index}, {descending: Trade_Index}]
      limit: {count: 10}
      where: {Transaction: {Signer: {is: "EATeN8nptyVmydeDGD6966Sgw14BXdbLwxKXr19UH9q8"}}, Trade: {Dex: {ProtocolName: {is: "bonkswap"}}}}
    ) {
      Block {
        Time
      }
      Instruction {
        Program {
          Method
        }
      }
      Trade {
        Dex {
          ProtocolFamily
          ProtocolName
          ProgramAddress
        }
        Buy {
          Price
          PriceInUSD
          Amount
          AmountInUSD
          Account {
            Address
            Owner
          }
          Currency {
            Name
            Symbol
            MintAddress
            Decimals
            Fungible
            Uri
          }
        }
        Sell {
          Price
          PriceInUSD
          Amount
          AmountInUSD
          Account {
            Owner
            Address
          }
          Currency {
            Name
            Symbol
            MintAddress
            Decimals
            Fungible
            Uri
          }
        }
      }
      Transaction {
        Signature
        Signer
        FeePayer
      }
    }
  }
}

```

## Get OHLC for a BonkSwap Token

[Run Query ➤](https://ide.bitquery.io/ohlc-for-bonkswap-token)

```
query MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {Trade: {Dex: {ProtocolName: {is: "bonkswap"}}, Currency: {MintAddress: {is: "token mint address"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}}, Transaction: {Result: {Success: true}}}
      limit: {count: 100}
      orderBy: {descendingByField: "Block_Timefield"}
    ){
      Block{
        Timefield: Time(interval:{count:1 in:minutes})
      }
      Trade{
        open: Price(minimum:Block_Slot)
        high: Price(maximum:Trade_Price)
        low: Price(minimum:Trade_Price)
        close: Price(maximum:Block_Slot)
      }
      volumeInUSD: sum(of:Trade_Side_AmountInUSD)
      count
    }
  }
}


```
