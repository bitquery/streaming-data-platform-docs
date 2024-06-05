# OrcaWhirpool DEX API

## OrcaWhirpool Trades in Real-Time

The below query gets real-time information whenever there's a new trade on the OrcaWhirpool DEX including detailed information about the trade, including the buy and sell details, the block information, and the transaction specifics.
You can run the query [here](https://ide.bitquery.io/Real-time-trades-on-OrcaWhirpool-DEX-on-Solana#)

```graphql
subscription {
  Solana {
    DEXTrades(
      orderBy: {descending: Block_Time}
      where: {Trade: {Dex: {ProtocolFamily: {is: "OrcaWhirpool"}}}}
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
          PriceAgainstSellCurrency:Price
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

## OrcaWhirpool OHLC API

You can also query OHLC data in real time from Raydium DEX.

To get OHLC data for any specific currency pair, you can use [this Websocket api](https://ide.bitquery.io/OrcaWhirpool-Dex-on-Solana-OHLC-for-specific-pair).

```graphql
subscription{
  Solana {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Block_Timefield"}
      where: {
        Trade: {
          Currency: {
            MintAddress: {
              is: "6D7NaB2xsLd7cauWu1wKk6KBsJohJmP2qZH9GEfVi5Ui"
            }
          }, 
          Side: {
            Currency: {
              MintAddress: {
                is: "So11111111111111111111111111111111111111112"
              }
            }
          },
          Dex: {
            ProgramAddress: {
              is: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc"
            }
          }
        }
      }
    ) {
      Block {
        Timefield: Time(interval: {in: minutes, count: 1})
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