# Phoenix DEX API

:::note
`Trade Side Account` field will not be available for aggregate queries in Archive and Combined Datasets
:::

## Phoenix Trades in Real-Time

The below query gets real-time information whenever there's a new trade on the Phoenix DEX including detailed information about the trade, including the buy and sell details, the block information, and the transaction specifics.
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
