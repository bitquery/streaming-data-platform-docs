# Heaven DEX API

import VideoPlayer from "../../../src/components/videoplayer.js";

In this document, we will explore several examples related to Heaven Dex. You can also check out our [Pump Fun API Docs](https://docs.bitquery.io/docs/blockchain/Solana/Pump-Fun-API/) and [FourMeme API Docs](https://docs.bitquery.io/docs/blockchain/BSC/four-meme-api/).

Need zero-latency Heaven DEX data? [Read about our Shred Streams and Contact us for a Trial](https://docs.bitquery.io/docs/streams/real-time-solana-data/).

:::note
To query or stream data via graphQL **outside the Bitquery IDE**, you need to generate an API access token.

Follow the steps here to create one: [How to generate Bitquery API token ➤](https://docs.bitquery.io/docs/authorisation/how-to-generate/)
:::

<head>
  <meta name="title" content="Heaven DEX API - Solana - Tokens, Trades, Live Prices"/>
  <meta name="description" content="Get real time prices, charts, marketcap, liquidity, ATH, Trades and other trading related data using our Heaven DEX API."/>
  <meta name="keywords" content="Heaven DEX API,Heaven DEX on-chain data API,Heaven DEX token data API,Heaven DEX blockchain API,Heaven DEX DEX data API,Heaven DEX API documentation,Heaven DEX crypto API,Heaven DEX web3 API,DEX Trades,Solana,Blast,Heaven DEX memecoins,Solana DEX,Blast DEX,token trading,blockchain data,crypto trading"/>
  <meta name="robots" content="index, follow"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="language" content="English"/>

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Heaven DEX API - Solana - Tokens, Trades, Live Prices"
/>
<meta
  property="og:description"
  content="Get real time prices, charts, marketcap, liquidity, ATH, Trades and other trading related data using our Heaven DEX API."
/>

  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="Heaven DEX API - Solana - Tokens, Trades, Live Prices"/>
  <meta property="twitter:description" content="Get on-chain data of any Heaven DEX based token through our Heaven DEX API."/>
</head>

If you want fastest data without any latency, we can provide Kafka streams, please [fill this form](https://bitquery.io/forms/api) for it. Our Team will reach out.

## Track Heaven DEX Token Creation

Using [this](https://ide.bitquery.io/Track-Heaven-DEX-Token-Creation_1) query, we can get the realtime created Heaven DEX tokens.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription MyQuery {
  Solana {
    Instructions(
      where: {
        Instruction: {
          Program: {
            Address: { is: "HEAVENoP2qxoeuF8Dj2oT1GHEnu49U5mJYkdeC8BAX2o" }
            Method: { is: "create_standard_liquidity_pool" }
          }
        }
        Transaction: { Result: { Success: true } }
      }
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

</details>

## Latest price of a token on Heaven DEX

You can use the following query to get the latest price of a token on Heaven DEX on Solana.

You can run this query using [this link](https://ide.bitquery.io/live-price-of-token-on-heaven-dex).

<details>
  <summary>Click to expand GraphQL query</summary>

```
{
  Solana {
    DEXTradeByTokens(
      limit: {count: 1}
      orderBy: {descending: Block_Time}
      where: {Trade: {Dex: {ProgramAddress: {is: "HEAVENoP2qxoeuF8Dj2oT1GHEnu49U5mJYkdeC8BAX2o"}}, Currency: {MintAddress: {is: "G9z2bN7rqxdoN526H4XzdLNWt8Wy8GdbqwNFSrpMv777"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}}}
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

</details>

## Latest Trades on Solana Heaven

To subscribe to the real-time trades stream for Solana Heaven DEX, [try this GraphQL subscription (WebSocket)](https://ide.bitquery.io/Real-time-trades-on-Heaven-DEX-on-Solana).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    DEXTrades(
      where: {
        Trade: {
          Dex: {
            ProgramAddress: {
              is: "HEAVENoP2qxoeuF8Dj2oT1GHEnu49U5mJYkdeC8BAX2o"
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
          Account {
            Address
          }
          Amount
          Currency {
            MintAddress
            Decimals
            Symbol
            ProgramAddress
            Name
          }
          PriceAgaistSellCurrency: Price
        }
        Sell {
          Account {
            Address
          }
          Amount
          Currency {
            MintAddress
            Decimals
            Symbol
            Name
          }
          PriceAgaistBuyCurrency: Price
        }
      }
      Block {
        Time
        Height
      }
      Transaction {
        Signature
        FeePayer
        Signer
      }
    }
  }
}
```

</details>

## Latest Trades for a specific currency on Solana Heaven DEX

Let's say you want to receive [trades only for a specific currency on Heaven DEX](https://ide.bitquery.io/Real-time-buy-and-sell-of-specific-currency-on-Heaven-DEX-on-Solana_3). You can use the following stream.
Use currency's mint address; for example, in the following query, we are using Ray token's Mint address to get buy and sells of Ray token.

If you limit it to 1, you will get the latest price of the token because the latest trade = the Latest Price.

Run this query [using this link](https://ide.bitquery.io/Real-time-buy-and-sell-of-specific-currency-on-Heaven-DEX-on-Solana_2).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    Buyside: DEXTrades(
      where: {
        Trade: {
          Buy: {
            Currency: {
              MintAddress: {
                is: "G9z2bN7rqxdoN526H4XzdLNWt8Wy8GdbqwNFSrpMv777"
              }
            }
          }
          Dex: {
            ProgramAddress: {
              is: "HEAVENoP2qxoeuF8Dj2oT1GHEnu49U5mJYkdeC8BAX2o"
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
          Account {
            Address
          }
          Amount
          Currency {
            Decimals
            Symbol
            MintAddress
            Name
          }
          PriceAgaistSellCurrency: Price
        }
        Sell {
          Account {
            Address
          }
          Amount
          Currency {
            Decimals
            Symbol
            MintAddress
            Name
          }
          PriceAgaistBuyCurrency: Price
        }
      }
      Block {
        Time
        Height
      }
      Transaction {
        Signature
        FeePayer
        Signer
      }
    }
    Sellside: DEXTrades(
      where: {
        Trade: {
          Sell: {
            Currency: {
              MintAddress: {
                is: "G9z2bN7rqxdoN526H4XzdLNWt8Wy8GdbqwNFSrpMv777"
              }
            }
          }
          Dex: {
            ProgramAddress: {
              is: "HEAVENoP2qxoeuF8Dj2oT1GHEnu49U5mJYkdeC8BAX2o"
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
          Account {
            Address
          }
          Amount
          Currency {
            Decimals
            Symbol
            MintAddress
            Name
          }
          PriceAgaistSellCurrency: Price
        }
        Sell {
          Account {
            Address
          }
          Amount
          Currency {
            Decimals
            Symbol
            MintAddress
            Name
          }
          PriceAgaistBuyCurrency: Price
        }
      }
      Block {
        Time
        Height
      }
      Transaction {
        Signature
        FeePayer
        Signer
      }
    }
  }
}
```

</details>

## Heaven OHLC API

If you want to get OHLC data for any specific currency pair on Heaven DEX, you can use [this api](https://ide.bitquery.io/Heaven-OHLC-for-specific-pair).
Only use this API as `query` and not `subscription` websocket as Aggregates and Time Intervals don't work well with subscriptions.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Solana {
    DEXTradeByTokens(
      orderBy: { descendingByField: "Block_Timefield" }
      where: {
        Trade: {
          Currency: {
            MintAddress: { is: "G9z2bN7rqxdoN526H4XzdLNWt8Wy8GdbqwNFSrpMv777" }
          }
          Side: {
            Currency: {
              MintAddress: { is: "So11111111111111111111111111111111111111112" }
            }
          }
          Dex: {
            ProgramAddress: {
              is: "HEAVENoP2qxoeuF8Dj2oT1GHEnu49U5mJYkdeC8BAX2o"
            }
          }
          PriceAsymmetry: { lt: 0.1 }
        }
      }
      limit: { count: 10 }
    ) {
      Block {
        Timefield: Time(interval: { in: minutes, count: 1 })
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

</details>

## Get the Top Traders of a specific Token on Heaven DEX

The below query gets the Top Traders of the specified Token `G9z2bN7rqxdoN526H4XzdLNWt8Wy8GdbqwNFSrpMv777` on Heaven DEX. Keep in mind you can use this API only as a query and not a subscription websocket because aggregates don't work with subscription and you will end up getting wrong results. You can run the query [here](https://ide.bitquery.io/Get-the-Top-Traders-of-a-specific-Token-on-Heaven-DEX)

<details>
  <summary>Click to expand GraphQL query</summary>

```
query TopTraders($token: String) {
  Solana {
    DEXTradeByTokens(
      orderBy: {descendingByField: "volumeUsd"}
      limit: {count: 100}
      where: {Trade: {Currency: {MintAddress: {is: $token}}, Dex: {ProgramAddress: {is: "HEAVENoP2qxoeuF8Dj2oT1GHEnu49U5mJYkdeC8BAX2o"}}}, Transaction: {Result: {Success: true}}}
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
  "token": "G9z2bN7rqxdoN526H4XzdLNWt8Wy8GdbqwNFSrpMv777"
}
```

</details>

## Get trading volume, buy volume, sell volume of a Heaven DEX token

This query fetches you the traded volume, buy volume and sell volume of a token `G9z2bN7rqxdoN526H4XzdLNWt8Wy8GdbqwNFSrpMv777`. Try out the API [here](https://ide.bitquery.io/Get-trading-volume-buy-volume-sell-volume-of-a-heaven-dex-token).

<details>
  <summary>Click to expand GraphQL query</summary>

```
query MyQuery {
  Solana(dataset: combined) {
    DEXTradeByTokens(
      where: {Block: {Time: {since_relative: {hours_ago: 1}}}, Transaction: {Result: {Success: true}}, Trade: {Currency: {MintAddress: {is: "G9z2bN7rqxdoN526H4XzdLNWt8Wy8GdbqwNFSrpMv777"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}, Dex: {ProgramAddress: {is: "HEAVENoP2qxoeuF8Dj2oT1GHEnu49U5mJYkdeC8BAX2o"}}}}
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

</details>

## Video Tutorials

### Get Unlimited Bags FM Token Data Using Bitquery API

<VideoPlayer url="https://youtu.be/X38_YhDYqi0" />
