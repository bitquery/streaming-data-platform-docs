# Phoenix DEX API



You can run the query [here](https://ide.bitquery.io/Real-time-trades-on-Phoenix-DEX-on-Solana)

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