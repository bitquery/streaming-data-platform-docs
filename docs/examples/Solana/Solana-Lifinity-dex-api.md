# Lifinity DEX API

## Lifinity Trades in Real-Time

The below query gets real-time information whenever there's a new trade on the Lifinity DEX including detailed information about the trade, including the buy and sell details, the block information, and the transaction specifics.
You can run the query [here](https://ide.bitquery.io/Real-time-trades-on-Lifinity-DEX-on-Solana_2)

```graphql
subscription {
  Solana {
    DEXTrades(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {Trade: {Dex: {ProtocolFamily: {is: "Lifinity"}}}}
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
          Price
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
          Price
        }
      }
      Block {
        Time
      }
    }
  }
}

```

## Average Price and Trade Volume of a Token on Lifinity

Trading parameters like the average and volume are important factors for determining entry and exit points of a trade.

[Here](https://ide.bitquery.io/Average-Price-and-Total-Volume-Traded-for-24-hours-for-WSOL-on-Lifinity-DEX-on-Solana) is the query to get these parameters for a selected token based on the last 24 hours activity.

```graphql
query TradeParameters {
  Solana {
    DEXTrades(
      where: {Trade: {Dex: {ProtocolFamily: {is: "Lifinity"}}, Buy: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}}, Block: {Time: {after: "2024-06-04T00:00:00Z", before: "2024-06-05T00:00:00Z"}}}
    ) {
      Volume: sum(of: Trade_Buy_AmountInUSD)
      AveragePrice: average(of: Trade_Buy_PriceInUSD)
    }
  }
}

```