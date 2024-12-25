---
sidebar_position: 2
---

# Solana Token Supply API

import VideoPlayer from "../../../src/components/videoplayer.js";

In this section we will see how to get Solana Token Supply information using our API.

This Solana API is part of our Early Access Program (EAP), which is intended for evaluation purposes. This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/).

<head>
<meta name="title" content="Solana Token Supply API | Easiest way to get Solana Token supply"/>
<meta name="description" content="Access real-time on-chain data for Solana token supply and more through our Solana Token Supply API."/>
<meta name="keywords" content="Solana Token Supply API, Solana Token Supply python api, Solana Token Supply data api, Solana Token Supply blockchain api, token supply scan api, Solana web3 token supply api, Solana DEX token supply API, Solana network token supply API"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Solana Token Supply API | Easiest way to get Solana Token supply"
/>
<meta
  property="og:description"
  content="Access real-time on-chain data for Solana token supply and more through our Solana Token Supply API."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Solana Token Supply API | Easiest way to get Solana Token supply" />
<meta property="twitter:description" content="Access real-time on-chain data for Solana token supply and more through our Solana Token Supply API." />
</head>

## Subscribe to Token Supply Changes

This subscription will return the token supply changes in realtime. `PostBalance` will give you the current supply. Check the query [here](https://ide.bitquery.io/token-supply-updates-sub)

```
subscription {
  Solana{
    TokenSupplyUpdates {
      TokenSupplyUpdate {

        Amount
        Currency {
          MintAddress
          Name
        }

        PreBalance
        PostBalance
      }
    }
  }
}
```

## Get Supply of specific Token

This query will return the latest token supply of a specific token. We are getting here supply for this `6D7NaB2xsLd7cauWu1wKk6KBsJohJmP2qZH9GEfVi5Ui` token `PostBalance` will give you the current supply for this token. Check the query [here](https://ide.bitquery.io/token-supply_2)

```
{
  Solana {
    TokenSupplyUpdates(
      limit:{count:1}
      orderBy:{descending:Block_Time}
      where: {TokenSupplyUpdate: {Currency: {MintAddress: {is: "6D7NaB2xsLd7cauWu1wKk6KBsJohJmP2qZH9GEfVi5Ui"}}}}
    ) {
      TokenSupplyUpdate {
        Amount
        Currency {
          MintAddress
          Name
        }
        PreBalance
        PostBalance
      }
    }
  }
}

```

## Get newly created Pump Fun tokens and their Metadata

Now you can track the newly created Pump Fun Tokens along with their metadata and supply. `PostBalance` will give you the current supply for the token. Check the query [here](https://ide.bitquery.io/Get-newly-created-pump-fun-tokens-and-their-metadata#)

```
subscription {
  Solana {
    TokenSupplyUpdates(
      where: {Instruction: {Program: {Address: {is: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"}, Method: {is: "create"}}}}
    ) {
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

## Get newly created Moonshot tokens and their Metadata

Now you can track the newly created Moonshot Tokens along with their metadata and supply. `PostBalance` will give you the current supply for the token. Check the query [here](https://ide.bitquery.io/Get-newly-created-Moonshot-tokens-with-metadata#)

```
subscription {
  Solana {
    TokenSupplyUpdates(
      where: {Instruction: {Program: {Address: {is: "MoonCVVNZFSYkqNXP6bxHLPL6QQJiMagDL3qcqUQTrG"}, Method: {is: "tokenMint"}}}}
    ) {
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

## Marketcap of a Token

[This](https://ide.bitquery.io/market-cap-of-token_1) query returns latest marketcap of a particular token.

``` graphql

query MyQuery {
  Solana {
    TokenSupplyUpdates(
      where: {TokenSupplyUpdate: {Currency: {MintAddress: {is: "6D7NaB2xsLd7cauWu1wKk6KBsJohJmP2qZH9GEfVi5Ui"}}}}
      limit: {count: 1}
      orderBy: {descending: Block_Time}
    ) {
      TokenSupplyUpdate {
        PostBalanceInUSD
      }
    }
  }
}

```

## Top Solana Tokens By MarketCap

[This](https://ide.bitquery.io/top-Solana-tokens-based-on-market-cap) query returns the top Solana tokens based on the latest MarketCap.

``` graphql

query MyQuery {
  Solana {
    TokenSupplyUpdates(
      orderBy: {descending: Block_Time, descendingByField: "TokenSupplyUpdate_Marketcap"}
      limitBy: {by: TokenSupplyUpdate_Currency_MintAddress, count: 1}
    ) {
      TokenSupplyUpdate {
        Marketcap: PostBalanceInUSD
        Currency {
          Name
          Symbol
          MintAddress
          Fungible
          Decimals
        }
      }
    }
  }
}

```

## Top 100 Pump Fun Tokens By MarketCap

[This](https://ide.bitquery.io/top-pump-fun-tokens-based-on-market-cap_1) query returns the top Solana tokens based on the latest MarketCap.

``` graphql

query MyQuery {
  Solana {
    TokenSupplyUpdates(
      where: {TokenSupplyUpdate: {Currency: {MintAddress: {includes: "pump"}}}}
      orderBy: {descending: Block_Time, descendingByField: "TokenSupplyUpdate_Marketcap"}
      limitBy: {by: TokenSupplyUpdate_Currency_MintAddress, count: 1}
      limit: {count: 100}
    ) {
      TokenSupplyUpdate {
        Marketcap: PostBalanceInUSD
        Currency {
          Name
          Symbol
          MintAddress
          Fungible
          Decimals
          Uri
        }
      }
    }
  }
}

```

## Get Solana Tokens With a Specific MarketCap

Lets say we need to get the tokens whose marketcap has crossed the `1M USD` mark but is less than `2M USD` for various reasons like automated trading. We can get the token details that have crossed a particular marketcap using [this](https://ide.bitquery.io/tokens-with-market-cap-range) query.

``` graphql

query MyQuery {
  Solana {
    TokenSupplyUpdates(
      where: {TokenSupplyUpdate: {PostBalanceInUSD: {ge: "1000000", le: "2000000"}}}
      orderBy: {descending: Block_Time}
      limitBy: {by: TokenSupplyUpdate_Currency_MintAddress, count: 1}
    ) {
      TokenSupplyUpdate {
        Marketcap: PostBalanceInUSD
        Currency {
          Name
          Symbol
          MintAddress
          Decimals
          Uri
        }
      }
    }
  }
}

```

## Video Tutorial on Streaming and Getting Total Supply of a Solana Token 

<VideoPlayer url="https://youtu.be/U_fuHEow3fQ" />

## Video Tutorial on Getting New Pump Fun Token Metadata

<VideoPlayer url="https://youtu.be/GmJOEWxhlVM" />