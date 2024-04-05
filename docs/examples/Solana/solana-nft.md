# Solana NFT API

In this section we'll have a look at some examples using the Solana NFT API.
This Solana API is part of our Early Access Program (EAP), which is intended for evaluation purposes.
This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)


## Track Latest NFT Trades

The subscription query provided below fetches the most recent NFT trades on the Solana blockchain. 
You can find the query [here](https://ide.bitquery.io/Latest-Solana-NFT-Trades)

```
subscription {
  Solana {
    DEXTradeByTokens(where: {Trade: {Currency: {Fungible: false}}}) {
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