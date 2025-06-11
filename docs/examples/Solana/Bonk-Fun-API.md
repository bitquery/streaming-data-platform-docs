# Bonk Fun API

import VideoPlayer from "../../../src/components/videoplayer.js";

In this document, we will explore several examples related to Bonk fun and Bonk Swap data.

Need zero-latency Bonk fun data? [Read about our Shred Streams and Contact us for a Trial](https://docs.bitquery.io/docs/streams/real-time-solana-data/).

:::note
To query or stream data via graphQL **outside the Bitquery IDE**, you need to generate an API access token.

Follow the steps here to create one: [How to generate Bitquery API token ➤](https://docs.bitquery.io/docs/authorisation/how-to-generate/)
:::

<head>
  <meta name="title" content="Bonk Fun API - Solana - Tokens, Trades, Live Prices"/>
  <meta name="description" content="Get on-chain data of any Bonk.fun based token through our Bonk.fun API."/>
  <meta name="keywords" content="Bonk.fun API,Bonk.fun on-chain data API,Bonk.fun token data API,Bonk.fun blockchain API,Bonk.fun DEX data API,Bonk.fun API documentation,Bonk.fun crypto API,Bonk.fun web3 API,DEX Trades,Solana,Blast,Bonk.fun memecoins,Solana DEX,Blast DEX,token trading,blockchain data,crypto trading"/>
  <meta name="robots" content="index, follow"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="language" content="English"/>

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Bonk Fun API - Solana - Tokens, Trades, Live Prices"
/>
<meta
  property="og:description"
  content="Get on-chain data of any Bonk.fun based token through our Bonk.fun API."
/>

  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="Bonk Fun API - Solana - Tokens, Trades, Live Prices"/>
  <meta property="twitter:description" content="Get on-chain data of any Bonk.fun based token through our Bonk.fun API."/>
</head>

If you want fastest data without any latency, we can provide Kafka streams, please [fill this form](https://bitquery.io/forms/api) for it. Our Team will reach out.

## Track Bonk.fun Token Creation

Using [this](https://ide.bitquery.io/latest-token-created-on-bonk-fun) query, we can get the most recently created Bonk Fun tokens.

```graphql
{
  Solana {
    InstructionBalanceUpdates(
      where: {
        BalanceUpdate: { Currency: { MintAddress: { endsWith: "bonk" } } }
        Instruction: {
          Program: {
            Address: { is: "LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj" }
            Method: { is: "initialize" }
          }
        }
        Transaction: { Result: { Success: true } }
      }
      orderBy: { descending: Block_Time }
    ) {
      BalanceUpdate {
        Currency {
          MintAddress
          Name
          Symbol
          Decimals
          UpdateAuthority
          Uri
          VerifiedCollection
          Wrapped
          ProgramAddress
        }
        PostBalance
      }
      Block {
        Time
      }
      Transaction {
        Signature
        Signer
      }
    }
  }
}
```

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
