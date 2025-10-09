---
slug: solana-dex
title: Introducing new DEXs on Solana
authors: [Divyasshree]
tags: [new data]
---

# New Data

We have now added data for several new Solana DEXes into our platform: Phoenix, Meteora, Lifi, and more!

You can filter information on a particular DEX by mentioning them in the `ProtocolFamily` field. For example the below query retrieves all trades in real-time from the Phoenix DEX.

```
subscription {
  Solana {
    DEXTrades(where: {Trade: {Dex: {ProtocolFamily: {is: "Phoenix"}}}}) {
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
          PriceAgainstSellCurrency: Price
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
          PriceAgainstBuyCurrency: Price
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
