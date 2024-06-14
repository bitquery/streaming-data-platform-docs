---
sidebar_position: 4
---

# Solana NFT API

In this section we'll have a look at some examples using the Solana NFT API.

This Solana API is part of our Early Access Program (EAP), which is intended for evaluation purposes.

This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

<head>
<meta name="title" content="Solana NFT API | Get NFT metadata, trades, pricing history"/>
<meta name="description" content="Get NFT data through our powerful and highly scalabe NFT API. Access all information about pricing history, NFT balances, NFT metadata and NFT trades."/>
<meta name="keywords" content="Solana NFT API, NFT trades API, NFT balance api, NFT pricing history api, nft python api, nft api, rarible api, opensea api, nft api docs, nft crypto api, nft blockchain api,solana network api, solana web3 api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Solana NFT API | Get NFT metadata, trades, pricing history"
/>
<meta
  property="og:description"
  content="Get NFT data through our powerful and highly scalabe NFT API. Access all information about pricing history, NFT balances, and NFT trades."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Solana NFT API | Get NFT metadata, trades, pricing history"/>
<meta property="twitter:description" content="Get NFT data through our powerful and highly scalabe NFT API. Access all information about pricing history, NFT balances, and NFT trades." />
</head>

## Track Latest NFT Trades

The subscription query provided below fetches the most recent NFT trades on the Solana blockchain.
You can find the query [here](https://ide.bitquery.io/Latest-Solana-NFT-Trades)

```
subscription {
  Solana {
    DEXTradeByTokens(where: {Trade: {Side: {Currency: {Fungible: false}}}}) {
      Block {
        Time
      }
      Trade {
        Amount
        Price
        Currency {
          Symbol
          Name
        }
        Side {
          Amount
        }
      }
    }
  }
}

```

## Track all NFT balance updates across the Solana Ecosystem

The subscription query provided below fetches the real time nft balance updates of addressses across Solana Ecosystem. This query also gives us NFT balance of the wallets using `PreBalance` and `PostBalance`.
You can find the query [here](https://ide.bitquery.io/real-time-nft-balance-updates-across-solana-ecosystem)

```
subscription {
  Solana {
    BalanceUpdates(
      where: {BalanceUpdate: {Currency: {Fungible: false}}}
    ) {
      BalanceUpdate {
        Currency {
          Name
          MintAddress
          TokenCreator {
            Address
            Share
          }
        }
        Account {
          Address
        }
        PreBalance
        PostBalance
      }
    }
  }
}



```
