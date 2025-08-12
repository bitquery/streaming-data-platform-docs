---
sidebar_position: 2
---

# Getting Historical Data

In this section, we will write the code to get historical OHLC data to populate a chart with candlesticks up to the current timestamp. Create a new file called `histOHLC.js` and add the following code. Each part of the code is explained below.

### Imports

```javascript
import axios from "axios";
import config from "./configs.json";
```

- **axios**: Axios is used to make HTTP requests to the Bitquery API.
- **config**: A local JSON file storing your API token securely.

### API Endpoint and Query

We are using the [Tokens Cube from the Crypto Price API](https://docs.bitquery.io/docs/trading/price-index/tokens/) which gives you price of a token on different chains in **USD**. You can use Pairs Cube as well to get price against specific currency.
 
```javascript
const endpoint = "https://streaming.bitquery.io/eap";
```

```javascript
const TOKEN_DETAILS = `
{
  Trading {
    Tokens(
      where: {
        Token: {
          Network: {is: "Solana"},
          Address: {is: "6ft9XJZX7wYEH1aywspW5TiXDcshGc2W2SqBHN9SLAEJ"}
        },
        Interval: {Time: {Duration: {eq: 60}}}
      },
      orderBy: {descending: Block_Time},
      limit: {count: 10000}
    ) {
      Token {
        Address
        Name
        Symbol
        Network
      }
      Block {
        Date
        Time
        Timestamp
      }
      Interval {
        Time {
          Start
          Duration
          End
        }
      }
      Volume {
        Base
        Quote
        Usd
      }
      Price {
        IsQuotedInUsd
        Ohlc {
          Open
          High
          Low
          Close
        }
        Average {
          SimpleMoving
          ExponentialMoving
        }
      }
    }
  }
}
`;
```

- **TOKEN_DETAILS**: This GraphQL query fetches token trading data on the Solana blockchain for 1-minute intervals (`Duration: {eq: 60}`), including OHLC prices in USD. It’s scoped to a specific token by address:
  `6ft9XJZX7wYEH1aywspW5TiXDcshGc2W2SqBHN9SLAEJ` for the sake of this explanation. You can pass the variables `quote` from url and set it here.



### fetchHistoricalData Function

```javascript
export async function fetchHistoricalData(from) {
  const requiredBars = 360; // Hardcoding the value
```

- **fetchHistoricalData**: Retrieves at least 360 one-minute OHLC bars, starting from the `from` timestamp.

### API Request

```javascript
  try {
    const response = await axios.post(
      endpoint,
      { query: TOKEN_DETAILS },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.authtoken}`,
        },
      }
    );
    console.log("API called");
```

- **axios.post**: Sends a POST request to Bitquery's streaming endpoint with the GraphQL query and an authorization token.
- **Authorization**: Token is stored securely in `configs.json`. You can generate one by following [these instructions](https://docs.bitquery.io/docs/authorisation/how-to-generate/).

### Data Processing

```javascript
const trades = response.data.data.Trading.Tokens;

let bars = trades.map((trade) => {
  const blockTime = new Date(trade.Block.Time).getTime();

  return {
    time: blockTime,
    open: trade.Price.Ohlc.Open || 0,
    high: trade.Price.Ohlc.High || 0,
    low: trade.Price.Ohlc.Low || 0,
    close: trade.Price.Ohlc.Close || 0,
    volume: trade.Volume.Base || 0,
  };
});
```

- **Preprocessing the Data**: Maps the raw response into `bars`, where each bar has:

  - **time**: Unix timestamp in milliseconds.
  - **open/high/low/close**: OHLC prices.
  - **volume**: Trading volume in base tokens.

### Sorting the Data

```javascript
bars.sort((a, b) => a.time - b.time);
```

Sorts the bars chronologically, as the API returns them in descending order by default. You can skip this step by changing query to return it in **ascending** order. 

### Handling Missing Bars

The new price stream will handle all intervals, and this step can be skipped.

```javascript
if (bars.length < requiredBars) {
  const earliestTime = bars[0]?.time || from;
  const missingBarsCount = requiredBars - bars.length;

  for (let i = 1; i <= missingBarsCount; i++) {
    bars.unshift({
      time: earliestTime - i * 60000,
      open: 0,
      high: 0,
      low: 0,
      close: 0,
      volume: 0,
      count: 0,
    });
  }
}
```

- **Missing Bar Padding**: If fewer than 360 bars are returned, the function backfills missing bars with zero values, maintaining continuity in the chart.

### Return the Processed Data

```javascript
    return bars;
  } catch (err) {
    console.error("Error fetching historical data:", err);
    throw err;
  }
}
```

- Returns the final processed bar array or throws an error if the API request fails.
