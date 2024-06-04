# OpenBook DEX API

## OpenBook Trades in Real-Time

The below query gets real-time information whenever there's a new trade on the OpenBook DEX including detailed information about the trade, including the buy and sell details, the block information, and the transaction specifics.
You can run the query [here](https://ide.bitquery.io/Real-time-trades-on-OpenBook-DEX-on-Solana)

```graphql
query SolanaOpenBookDexTrades {
  Solana {
    DEXTrades(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {Trade: {Dex: {ProtocolFamily: {is: "OpenBook"}}}}
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
            ProgramAddress
            MintAddress
          }
          Amount
          Account {
            Address
          }
          Price
          AmountInUSD
        }
        Sell {
          Account {
            Address
          }
          Amount
          Currency {
            Name
            Symbol
            ProgramAddress
            MintAddress
          }
          PriceAgainstSellCurrency:Price
          AmountInUSD
        }
      }
      Block {
        Time
      }
    }
  }
}

```

## Price Average of Pair on OpenBook

[Here](https://ide.bitquery.io/Average-Price-for-24-hours-of-a-token-on-OpenBook-DEX-on-Solana_1) is the query to get average price of a selected pair on a selected day.

```graphql
query PriceAverage {
  Solana {
    DEXTrades(
      limit: {count: 1}
      orderBy: {descending: Block_Time}
      where: {Trade: {Dex: {ProtocolFamily: {is: "OpenBook"}}, Sell: {Currency: {Symbol: {is: "USDC"}}}, Buy: {Currency: {Symbol: {is: "WSOL"}}}}, Block: {Time: {after: "2024-06-03T00:00:00Z", before: "2024-06-04T00:00:00Z"}}}
    ) {
      tokenPrice: average(of: Trade_Buy_Price)
    }
  }
}
```