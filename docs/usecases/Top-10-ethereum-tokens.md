---
sidebar_position: 4
---

# Dashboard : Top 10 Ethereum Token Pairs

The following tutorial helps build a Top 10 Ethereum Tokens Dashboard with Next JS and Bitquery APIs that fetches and displays the Top 10 Token Pairs in last 1 hour on Ethereum mainnet in desceneding order of number of transactions.

import VideoPlayer from "../../src/components/videoplayer.js";

## Video Tutorial of the project

<VideoPlayer url="https://www.youtube.com/watch?v=EL6RLs6xU8k" />

## Github Repository

Github Code Repository - [Repository Link](https://github.com/Akshat-cs/Top-10-Ethereum-Tokens-live.git)

## Prerequisites

1. **Node.js** and **npm** installed on your system.
2. **Bitquery Account** with OAuth token (follow instructions [here](https://docs.bitquery.io/docs/authorisation/how-to-generate/)).
3. **Git** installed on your pc.

## Code Walkthrough

### Data Fetching

We are going to fetch our dashboard data using these 3 files -

#### 1. **data.js file** -

We are using Bitquery API and made this `getData` utility function which will fetch top 10 Token Pairs according to the transactions happened in them in last 1 hour.
Query used here gives the top pair addresses, tokens in them, total transactions, total buys, total sells, price in usd of the token ( at last 1 hour timestamp, past 5 min timestamp and current timestamp). We will use these prices to get Price change in our `page.js` file.
You can test the saved query on ide [here](https://ide.bitquery.io/Top-10-pairs-on-ethereum_2).

```javascript
import axios from "axios";

// Function to fetch trade data
const getData = async () => {
  // Get the current UTC time and subtract one hour and five minutes
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const min5backtimestamp = new Date(Date.now() - 5 * 60 * 1000).toISOString();

  let data = JSON.stringify({
    query: `
      query MyQuery($oneHourAgo: DateTime, $min5backtimestamp: DateTime) {
        EVM(network: eth, dataset: realtime) {
          DEXTradeByTokens(
            orderBy: {descendingByField: "total_trades"}
            limit: {count: 10}
            where: {
              Block: {Time: {since: $oneHourAgo}},
              Trade: {Side: {Currency: {SmartContract: {is: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"}}}},
              TransactionStatus: {Success: true}
            }
          ) {
            Trade {
              hour1: PriceInUSD(minimum: Block_Time)
              min5: PriceInUSD(minimum: Block_Time, if: { Block: { Time: { after: $min5backtimestamp } } })
              end: PriceInUSD(maximum: Block_Time)
              Currency {
                Name
                Symbol
              }
              Side {
                Currency {
                  Name
                  Symbol
                }
              }
              Dex {
                ProtocolName
                ProtocolFamily
                ProtocolVersion
                SmartContract
              }
            }
            total_trades: count
            totalbuys: count(if: {Trade: {Side: {Type: {is: sell}}}})
			totalsells: count(if: {Trade: {Side: {Type: {is: buy}}}})
            total_traded_volume: sum(of: Trade_Side_AmountInUSD)
          }
        }
      }
    `,
    variables: { oneHourAgo, min5backtimestamp },
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://streaming.bitquery.io/graphql",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": "BQY7em4KPZ9CMvjl4aUUOPf2hqEBIHF1",
      Authorization: process.env.NEXT_PUBLIC_BITQUERY_TOKEN,
    },
    data: data,
  };

  let response = await axios.request(config);
  return response.data.data.EVM.DEXTradeByTokens;
};

export default getData;
```

#### 2. **liquidity.js file** -

We are using Bitquery API here and have made this utility function `getLiquidityData` to get `current liquidity` and `initial liquidity` of a particular pool. We are going to pass the 10 pool addresses to `getLiquidityData` we are going to get when we call `getData` in `page.js` and get the initial and current liquidities for the top 10 pools.
You can test the saved query on ide [here](https://ide.bitquery.io/Current-liquidity-and-initial-liquidity-of-pools-on-etherum).

```javascript
// liquidityData.js
import axios from "axios";

const getLiquidityData = async (poolAddresses) => {
  let data = JSON.stringify({
    query: `
    query MyQuery ($poolAddresses: [String!]){
  EVM(dataset: combined, network: eth) {
    Initial_liquidity: Transfers(
      limitBy:{by:Transfer_Receiver count:2}
      orderBy: {ascending: Block_Time}
      where: {Transfer: {Receiver: {in: $poolAddresses }}, TransactionStatus: {Success: true}}
    ) {
      Transaction {
        Hash
      }
      Transfer {
        Receiver
        Amount
        Currency {
          SmartContract
          Name
          Symbol
        }
      }
    }
    Current_liquidity: BalanceUpdates(
      where: {BalanceUpdate: {Address:  {in: $poolAddresses}}}
      orderBy: {descendingByField: "balance"}
    ) {
      Currency {
        Name
        SmartContract
        Symbol
      }
      balance: sum(of: BalanceUpdate_Amount, selectWhere: {gt: "0"})
      BalanceUpdate {
        Address
      }
    }
  }
}
`,
    variables: { poolAddresses },
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://streaming.bitquery.io/graphql",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": "BQYD4KszrYRIhb3cjIylKVLILgZfV0Ai",
      Authorization: process.env.NEXT_PUBLIC_BITQUERY_TOKEN,
    },
    data: data,
  };

  let response = await axios.request(config);
  return response.data.data.EVM;
};

export default getLiquidityData;
```

#### 3. **wethPrice.js file** -

We used Bitquery API here to get the latest USD price of `WETH` token as it will help us in converting Amount of WETH to USD Amount in current liquidity.
You can test the saved query on ide [here](https://ide.bitquery.io/get-weth-price).

```javascript
import axios from "axios";

const getPrice = async () => {
  let data = JSON.stringify({
    query: `
      query MyQuery{
        EVM(network: eth, dataset: realtime) {
          DEXTradeByTokens(
      limit: {count: 1}
      orderBy: {descending: Block_Time}
      where: {Trade: {Currency: {SmartContract: {is: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"}}, Side: {Currency: {SmartContract: {is: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"}}}}, TransactionStatus: {Success: true}}
    ){
      Trade{
        PriceInUSD
      }
    }
        }
      }
    `,
    variables: {},
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://streaming.bitquery.io/graphql",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": "BQYD4KszrYRIhb3cjIylKVLILgZfV0Ai",
      Authorization: process.env.NEXT_PUBLIC_BITQUERY_TOKEN,
    },
    data: data,
  };

  let response = await axios.request(config);
  return response.data.data.EVM.DEXTradeByTokens;
};

export default getPrice;
```

### Dashboard frontend

#### **page.js file**

The `page.js` file is a React component that serves as the main page for displaying the top 10 Ethereum token pairs traded in the last hour. It uses Bitquery APIs to fetch and display various data, including trade information, token prices, and liquidity data.

#### 1. Imports

The component imports necessary dependencies, including React, hooks (`useState`, `useEffect`), and three functions (`getData`, `getPrice`, `getLiquidityData`) used to fetch trade details, weth price, and liquidity data, respectively.

#### 2. State Management

It uses the `useState` hook to manage several states, such as `trades`, `liquidityData`, `currentPage`, and `price`.

#### 3. Component Structure

##### a. **State Initialization**:

- `trades`: Stores the trade data.
- `liquidityData`: Stores initial and current liquidity data.
- `currentPage`: Keeps track of the current page number for pagination.
- `price`: Stores the price data.

##### b. **Data Fetching with `useEffect`**:

- The first `useEffect` fetches trade and price data using `getData` and `getPrice` functions and sets the `trades` and `price` states.
- The second `useEffect` fetches liquidity data once the `trades` data is available. It extracts pool addresses from the trades and fetches corresponding liquidity data using the `getLiquidityData` function.

##### c. **Utility Functions**:

- `truncateAddress(address)`: Truncates a given address for display purposes.
- `calculatePriceChange(endPrice, hour1Price, min5Price)`: Calculates the percentage change in price over the last hour and the last 5 minutes.
- `formatInitialLiquidity(liquidityList)`: Formats the initial liquidity for display, showing both token amounts.
- `formatCurrentLiquidity(liquidityList, rowCurrencySymbol, currentPrice)`: Formats the current liquidity in USD based on the token amounts and prices.

##### d. **Rendering**:

- The component displays a table with information about the top 10 Ethereum pairs, including token pair, price, DEX, smart contract address, price change, total traded volume, transaction count, initial liquidity, and current liquidity.
- It uses the `currentTrades` variable to slice the trades array for pagination and display the trades of the current page.

##### e. **Export**:

- The component is exported as the default export of the file.

#### 4. **Key Components in the Table**

- **Token Pair**: Displays the symbol of the trading pair.
- **Price**: Shows the current price in USD.
- **DEX**: The decentralized exchange where the pair is traded.
- **Pair Smart Contract**: A link to the smart contract address on the Bitquery explorer.
- **Price Change (1 Hour and 5 Min)**: Displays the percentage price change in the last hour and last 5 minutes.
- **Total Traded Volume**: The total volume traded for the pair.
- **Txns**: The number of transactions, including buys and sells.
- **Initial Liquidity**: The initial liquidity provided in the pool.
- **Current Liquidity**: The current liquidity in USD.
