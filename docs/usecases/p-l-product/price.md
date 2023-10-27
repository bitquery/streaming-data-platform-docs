# Getting Prices for the Period of P&L Calculation

This code will extract the price of the specified token on the first and last day of the period for which you need the PL. You can modify the query and parameters to get the prices for a different token, time period, or multiple tokens.



1.  Import the necessary libraries:



```Python
import requests
import json
from balanceUpdates import min_time, max_time
import pandas as pd

```

2.  Define the URL and payload for the v2 API request:

In this query we use DEXTradeByTokens to get the price for the token. We get it for the trades that happened in the earliest timestamp in the first day and last day of the focused time period.

```Python
url = "https://streaming.bitquery.io/graphql"

payload = json.dumps({
   "query": "query MyQuery {\n  EVM(dataset: combined, network: eth) {\n    min_trade: DEXTradeByTokens(\n      where: {Trade: {Currency: {SmartContract: {is: \"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48\"}}}, Block: {Date: {after: \"" +min_time+ "\"}}}\n      limitBy: {by: Block_Date, count: 1}\n      orderBy: {ascending: Block_Date}\n      limit: {count: 1}\n    ) {\n      Block {\n        Date\n      }\n      Trade {\n        Price\n      }\n    }\n    latest: DEXTradeByTokens(\n      where: {Trade: {Currency: {SmartContract: {is: \"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48\"}}}, Block: {Date: {is: \"" +max_time+ "\"}}}\n      limitBy: {by: Block_Date, count: 1}\n   orderBy: {ascending: Block_Date}\n     limit: {count: 1}\n    ) {\n      Block {\n        Date\n      }\n      Trade {\n        Price\n      }\n    }\n  }\n}\n",
   "variables": "{}"
})

```

3.  Set the headers for the request, including your API key:



```Python
headers = {
   'Content-Type': 'application/json',
   'X-API-KEY': 'keyy'
}

```

4.  Make the POST request to the v2 API:



```Python
response = requests.request("POST", url, headers=headers, data=payload)

```

5.  Check the response status code to make sure the request was successful:



```Python
if response.status_code == 200:
    print("Request successful")
else:
    print("Request failed. Error code:", response.status_code)

```

6.  Parse the JSON response:



```Python
response_json = json.loads(response.text)

```

7.  Extract the trade price data:



```Python
latest_prices = response_json['data']['EVM']['latest']
earliest_prices = response_json['data']['EVM']['min_trade']

```

8.  Create DataFrames from the latest and earliest trade price data:



```Python
trade_latest = pd.DataFrame(latest_prices, columns=[ 'Block', 'Trade'])

trade_earliest = pd.DataFrame(earliest_prices, columns=[ 'Block', 'Trade'])

```

9.  Print the DataFrames for Reference:



```Python
print(trade_latest)
print(trade_earliest)

```
