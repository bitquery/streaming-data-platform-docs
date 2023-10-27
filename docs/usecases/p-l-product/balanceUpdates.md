# Calculating Balance Change Over Time

This is the first step, where we calculate

```
change_in_balance = final_balance - initial_balance
```
We get the daily balance for the entire period so that we don't have to query the API repeatedly to calculate change in balance between other time periods. If you don't need it, then you can use `BalanceUpdates` directly.


1.  Import the necessary libraries:



```python
import requests
import json
import pandas as pd

```

2.  Define the URL and payload for the v2 API request:

In this query we calculate daily USDC balance across 10 days for this walle `0x3416cf6c708da44db2624d63ea0aaef7113527c6`

```python
url = "https://streaming.bitquery.io/graphql"

payload = json.dumps({
   "query":"query MyQuery {\n  EVM(dataset: combined, network: eth) {\n    BalanceUpdates(\n      where: {BalanceUpdate: {Address: {is: \"0x3416cf6c708da44db2624d63ea0aaef7113527c6\"}}, Currency: {SmartContract: {is: \"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48\"}}}\n      orderBy: {descending: Block_Date}\n      limit: {count: 10}\n    ) {\n      Currency {\n        Name\n      }\n      balance: sum(of: BalanceUpdate_Amount, selectWhere: {gt: \"0\"})\n      BalanceUpdate {\n        Address\n      }\n      Block {\n        Date\n      }\n    }\n  }\n}\n",
   "variables": "{}"
})

```

3.  Set the headers for the request, including your API key:



```python
headers = {
   'Content-Type': 'application/json',
   'X-API-KEY': 'keyy'
}

```

4.  Make the POST request to the v2 API:


```python
response = requests.request("POST", url, headers=headers, data=payload)

```

5.  Check the response status code to make sure the request was successful:



```python
if response.status_code == 200:
    print("Request successful")
else:
    print("Request failed. Error code:", response.status_code)

```

6.  Parse the JSON response:



```python
response_json = json.loads(response.text)

```

7.  Extract the balance updates data:



```python
balance_updates = response_json['data']['EVM']['BalanceUpdates']

```

8.  Create a DataFrame from the balance updates data:



```python
df = pd.DataFrame(balance_updates, columns=['Currency', 'Block', 'BalanceUpdate','balance'])

```

9.  Extract the Time column from the Block array:



```python
block_dates = df['Block'].apply(lambda x: x['Date'])

```

10.  Extract the balance values:



```python
Balances=df['balance']

```

11.  Combine the two DataFrames into a new DataFrame:



```python
combined_df = pd.concat([block_dates, Balances], axis=1)

```

12.  Rename the columns for clarity:



```python
combined_df.columns = ['Date', 'Balance']

```

13.  Find the minimum and maximum values of the Time column:



```python
min_time = block_dates.min()
max_time = block_dates.max()

```

14.  Print the maximum time and the combined DataFrame:



```python
print("max_time ",max_time)
print(combined_df)

```

 You can modify the query and parameters to get the balance for a different address, token, or time period.
