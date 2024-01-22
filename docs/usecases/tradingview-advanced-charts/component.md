---
sidebar_position: 2
---

# Component

- Create a folder called `components` and create a file called `callBitquery.js`
- In this file we will write the queries to be used

## Step by Step Guide to the Code

#### 1. GraphQL Endpoint Definition

Define the v2 endpoint URL for Bitquery streaming and export the variable to be accessed outside this file.

```
export const endpoint = "https://streaming.bitquery.io/graphql";
```

#### 2. GraphQL Query for Token Details

The OHLC calculation on the IDE provides OHLC data only for time slots with trades. To obtain continuous OHLC data in cases where there are no trades in certain time slots, you can follow either of the following approaches: 

- Retrieve all trades locally and calculate the OHLC. 

- Alternatively, retrieve the OHLC data from a query and fill in the gaps.

```javascript
export const TOKEN_DETAILS = `
{
  EVM(network: eth, dataset: combined) {
    DEXTradeByTokens(
      orderBy: {ascendingByField: "Block_OHLC_interval"}
      where: {Trade: {Currency: {SmartContract: {is: "0xdac17f958d2ee523a2206206994597c13d831ec7"}}, 
      Side: {Currency: {SmartContract: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}}
    }
      Block:{Time:{since:"2023-12-05T00:00:40Z", till:"2024-01-05T00:00:40Z"}}
  
  }
      limit: {count: 15000}
    ) {
    Block {
         OHLC_interval: Time(interval: {in: minutes, count:1})
      }
     
      volume: sum(of: Trade_Amount)
      Trade {
        high: Price(maximum: Trade_Price, selectWhere:{lt:20000})
        low: Price(minimum: Trade_Price, selectWhere:{lt:20000})
        open: Price(minimum: Block_Number, selectWhere:{lt:20000})
        close: Price(maximum: Block_Number, selectWhere:{lt:20000})
      }
      count
    }
  }
}
`;
```

This query retrieves Open, High, Low, and Close (OHLC) data for the USDT-WETH pair from the earliest 300 records available . You can also retrieve the the data for any period you wish. To avoid outliers we filter prices using `less than ` filter, `selectWhere:{lt:20000}` since WETH-USDT price at the period was much lesser.

**You can add code snippets to dynamically filter records based on the price range.**

- Next, go to [App Page](https://docs.bitquery.io/docs/usecases/tradingview-advanced-charts/app/) to start building
