# Bonk Fun API

import VideoPlayer from "../../../src/components/videoplayer.js";

In this document, we will explore several examples related to Bonk fun data. We also have [Raydium Launchpad APIs](https://docs.bitquery.io/docs/examples/Solana/launchpad-raydium/).
Additionally, you can also check out our [Moonshot APIs](https://docs.bitquery.io/docs/examples/Solana/Moonshot-API/), [FourMeme APIs](https://docs.bitquery.io/docs/examples/BSC/four-meme-api/).
These APIs can be provided through different streams including Kafka for zero latency requirements. Please contact us on [telegram](https://t.me/Bloxy_info).

:::note
`Trade Side Account` field will not be available for aggregate queries in Archive and Combined Datasets
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
      where: {BalanceUpdate: {Currency: {MintAddress: {endsWith: "bonk"}}}, Instruction: {Program: {Address: {is: "LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj"}, Method: {is: "initialize"}}}, Transaction: {Result: {Success: true}}}
      orderBy: {descending: Block_Time}
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

## Streaming Bonk.fun Trades for a Token

[This](https://ide.bitquery.io/bonkfun-token-trade-stream) subscription allows us to stream the latest trades for a Bonk.fun tokens in real time.

```graphql
subscription {
  Solana {
    DEXTradeByTokens(
      where: {Trade: {Currency: {MintAddress: {is: "6r3dLonVjdFgbexHMKoMtiiAXCzVYBmoUrmixER9bonk"}}}}
    ) {
      Trade {
        Dex {
          ProgramAddress
          ProtocolFamily
          ProtocolName
        }
        Currency {
            Name
            Symbol
            MintAddress
            Decimals
        }
        Amount
        AmountInUSD
        Account {
          Owner
        }
        Market {
          MarketAddress
        }
        Price
        PriceInUSD
        Side {
          Currency {
            Name
            Symbol
            MintAddress
            Decimals
          }
          Type
        }
      }
    }
  }
}
```

## Get Latest Buys for a Bonk.fun Token

[This](https://ide.bitquery.io/bonkfun-token-buys) API returns the latest buys for a Bonk.fun token.

```graphql
{
  Solana {
    DEXTradeByTokens(
      where: {Trade: {Currency: {MintAddress: {is: "6r3dLonVjdFgbexHMKoMtiiAXCzVYBmoUrmixER9bonk"}}, Side: {Type: {is: buy}}}, Transaction: {Result: {Success: true}}}
      orderBy: {descending: Block_Time}
      limit: {count: 10}
    ) {
      Trade {
        Dex {
          ProgramAddress
          ProtocolFamily
          ProtocolName
        }
        Currency {
          Name
          Symbol
          MintAddress
          Decimals
        }
        Amount
        AmountInUSD
        Account {
          Owner
        }
        Market {
          MarketAddress
        }
        Price
        PriceInUSD
        Side {
          Currency {
            Name
            Symbol
            MintAddress
            Decimals
          }
          Type
        }
      }
    }
  }
}
```

## Get Latest Sells for a Bonk.fun Token

[This](https://ide.bitquery.io/bonkfun-token-sells) API returns the latest sells for a Bonk.fun token.

```graphql
{
  Solana {
    DEXTradeByTokens(
      where: {Trade: {Currency: {MintAddress: {is: "6r3dLonVjdFgbexHMKoMtiiAXCzVYBmoUrmixER9bonk"}}, Side: {Type: {is: sell}}}, Transaction: {Result: {Success: true}}}
      orderBy: {descending: Block_Time}
      limit: {count: 10}
    ) {
      Trade {
        Dex {
          ProgramAddress
          ProtocolFamily
          ProtocolName
        }
        Currency {
          Name
          Symbol
          MintAddress
          Decimals
        }
        Amount
        AmountInUSD
        Account {
          Owner
        }
        Market {
          MarketAddress
        }
        Price
        PriceInUSD
        Side {
          Currency {
            Name
            Symbol
            MintAddress
            Decimals
          }
          Type
        }
      }
    }
  }
}
```