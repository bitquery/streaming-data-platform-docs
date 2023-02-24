---
sidebar_position: 5
---

# Querying Latest Trades on DEXs

This query retrieves the latest trades for new token pairs created on DEXs.

```
query MyQuery {
  EVM(dataset: realtime, network: eth) {
    DEXTrades(
      limit: {count: 10}
      where: {Block: {Date: {since: "2023-02-23"}}, Trade: {Dex: {ProtocolFamily: {is: "Uniswap"}}}, Log: {Index: {eq: 0}}}
    ) {
      Block {
        Date
      }
      Trade {
        Sell {
          Amount
          Currency {
            Name
            ProtocolName
          }
          Price
          Seller
        }
        Buy {
          Buyer
          Amount
          Price
          Currency {
            Name
            ProtocolName
          }
        }
        Dex {
          ProtocolName
        }
      }
      Log {
        Index
      }
    }
  }
}
```
### Parameters

-   `limit`: Limits the number of results returned by the query. In this query, it limits the number of trades returned to 10.
-   `where`: Specifies the filters to apply to the results. In this query, it filters trades by:
    -   `Block: {Date: {since: "2023-02-23"}}`: To filter trades that occurred within the last 24 hours.
    -   `Trade: {Dex: {ProtocolFamily: {is: "Uniswap"}}}`: Trades that occurred on Uniswap Protocol Family DEXs.
    -   `Log: {Index: {eq: 0}}`: Trades with a `Log` index of 0, which ensures that we get the latest trades for each token pair.
-   `Block`: Returns the date of the block in which the trade occurred.
-   `Trade`: Returns the details of the trade, including the amount, price, and currencies of the buying and selling sides, as well as the DEX on which the trade occurred.
-   `Log`: Returns the index of the log for the trade, which is used to paginate through the results.
