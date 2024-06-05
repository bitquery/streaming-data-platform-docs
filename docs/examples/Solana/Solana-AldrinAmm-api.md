# AldrinAmm DEX API

## AldrinAmm Trades in Real-Time

The below query gets real-time information whenever there's a new trade on the AldrinAmm DEX including detailed information about the trade, including the buy and sell details, the block information, and the transaction specifics.
You can run the query [here](https://ide.bitquery.io/Real-time-trades-on-AldrinAmm-DEX-on-Solana_2)

```graphql
subscription{
  Solana {
    DEXTrades(
      orderBy: {descending: Block_Time}
      where: {
        Trade: {
          Dex: {
            ProgramAddress: {
              is: "AMM55ShdkoGRB5jVYPjWziwk8m5MpwyDgsMWHaMSQWH6"
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
          Currency {
            Name
            Symbol
            MintAddress
          }
          Amount
          Account {
            Address
          }
          PriceAgainstSellCurrency: Price
        }
        Sell {
          Account {
            Address
          }
          Amount
          Currency {
            Name
            Symbol
            MintAddress
          }
          PriceAgainstBuyCurrency: Price
        }
      }
      Block {
        Time
      }
    }
  }
}

```
