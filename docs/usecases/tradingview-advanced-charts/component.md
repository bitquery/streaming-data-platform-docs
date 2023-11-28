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

```javascript
export const TOKEN_DETAILS = `
{
  EVM(network: eth, dataset: combined) {
    DEXTradeByTokens(
      orderBy: { ascending: Block_Time }
      where: {
        Trade: {
          Currency: { SmartContract: { is: "0xdac17f958d2ee523a2206206994597c13d831ec7" } }
          Side: { Currency: { SmartContract: { is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" } } }
        }
      }
      limit: { count: 300 }
    ) {
      Block {
        Time(interval: { in: minutes })
      }
      volume: sum(of: Trade_Amount)
      Trade {
        high: Price(maximum: Trade_Price)
        low: Price(minimum: Trade_Price)
        open: Price(minimum: Block_Number)
        close: Price(maximum: Block_Number)
      }
      count
    }
  }
}
`;
```

This query retrieves Open, High, Low, and Close (OHLC) data for the USDT-WETH pair from the earliest 300 records available . You can also retrieve the the data for any period you wish.

- Next, go to [App Page](https://docs.bitquery.io/docs/usecases/tradingview-advanced-charts/app/) to start building
