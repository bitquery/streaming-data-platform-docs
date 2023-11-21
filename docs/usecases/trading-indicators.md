# Build Trading Indicators for Crypto Data

Technical indicators are a vital tool for cryptocurrency traders, as they can help to identify trends, predict price movements, and make informed trading decisions. In this tutorial, we will discuss how to calculate popular trading indicators easily with Bitquery APIs in Python.


**Step 1: Import Libraries**

The code begins by importing the necessary libraries for making API requests, parsing JSON data, and data manipulation:

```Python
import requests
import json
import pandas as pd

```

**Step 2: Define V2 Query**

 We write a query to get OHLC data for the Uniswap pair ETH-DAI, filtering for trades in the past 10 minutes and returning the volume, trade details, and block timestamps. You can [extend the query to get data for longer duration of different periods like year/month/day](https://ide.bitquery.io/USDT-OHLC-Price-Data-V2_3).

```Python
query = """
{
  EVM(dataset: combined) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Block_Time"},
      where: {
        Trade: {
          Side: {
            Currency: { SmartContract: { is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" } }
          },
          Currency: { SmartContract: { is: "0xdac17f958d2ee523a2206206994597c13d831ec7" } }
        }
      },
      limit: { count: 10 }
    ) {
      Block {
        Time(interval: { in: minutes, count: 10 })
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
"""

```

**Step 3: Set Up Request Payload and Headers**

The API request payload and headers are prepared using the URL, query, and API key. Starting December 16,2023 we will move to OAuth. Read more [here](https://docs.bitquery.io/docs/ide/authorisation/)

```Python
url = "https://streaming.bitquery.io/graphql"
payload = json.dumps({"query": query, "variables": "{}"})
headers = {
  'Content-Type': 'application/json',
  'X-API-KEY': 'keyy'
}

```

**Step 4: Make API Request and Extract Trade Data**

The API request is sent using the `requests` library, and the JSON response is parsed to extract the relevant trade data:

```Python
response = requests.request("POST", url, headers=headers, data=payload)
response_data_trades = json.loads(response.text)['data']['EVM']['DEXTradeByTokens']
df = pd.DataFrame(response_data_trades)

```

**Step 5: Calculate Simple Moving Average (SMA)**

The SMA is calculated for the closing price of the last 10 trades:

```Python
df_trade = pd.json_normalize(df['Trade'])
sma = df_trade['close'].rolling(window=10).mean().iloc[9]
print("SMA:", sma)

```

**Step 6: Calculate Daily Returns**

Daily returns are calculated for each trade, representing the percentage change in closing price from the previous day:

```Python
daily_returns = []
for i in range(1, len(df_trade)):
  close_last = df_trade['close'].iloc[i]
  close_last_1 = df_trade['close'].iloc[i - 1]
  daily_return = (close_last - close_last_1) / close_last_1 * 100
  daily_returns.append(daily_return)

print(daily_returns)

```

**Step 7: Calculate Volatility**

Volatility is calculated as the standard deviation of daily returns:

```Python
import numpy as np

volatility = np.std(daily_returns)
print(volatility)

```

**Step 8: Calculate Relative Strength Index (RSI)**

The RSI is calculated using the following steps:

2.  Calculate the difference between consecutive closing prices.
3.  Separate the price differences into positive gains and negative losses.
4.  Calculate the average gain and average loss over a specified window length (9 in this case).
5.  Calculate the relative strength (RS) as the average gain divided by the average loss.
6.  Calculate the RSI as 100 minus (100 divided by (1 plus RS)).

The RSI is then printed for the last trade in the

```python
df_trade['diff_close'] = df_trade['close'].diff(1)
df_trade['gain'] = df_trade['diff_close'].clip(lower=0).round(2)
df_trade['loss'] = df_trade['diff_close'].clip(upper=0).abs().round(2)

window_length = 9
df_trade['avg_gain'] = df_trade['gain'].rolling(window=window_length, min_periods=window_length).mean()[:window_length+1]
df_trade['avg_loss'] = df_trade['loss'].rolling(window=window_length, min_periods=window_length).mean()[:window_length+1]

for i in range(window_length+1, len(df_trade)):
    df_trade.loc[i, 'avg_gain'] = ((df_trade.loc[i-1, 'avg_gain'] * (window_length - 1)) + df_trade.loc[i, 'gain']) / window_length
    df_trade.loc[i, 'avg_loss'] = ((df_trade.loc[i-1, 'avg_loss'] * (window_length - 1)) + df_trade.loc[i, 'loss']) / window_length

df_trade['rs'] = df_trade['avg_gain'] / df_trade['avg_loss']
df_trade['rsi'] = 100 - (100 / (1.0 + df_trade['rs']))
print("RSI",df_trade['rsi'][window_length])

```
