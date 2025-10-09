import VideoPlayer from "../../src/components/videoplayer.js";

# How to Build a Solana Copy Trading Bot - Tutorial

This project is a Solana copy trading bot that allows users to replicate trades executed by a specified account on the Solana blockchain. The bot fetches trading data using the Bitquery API. For real-time price monitoring, consider using our [Crypto Price API](https://docs.bitquery.io/docs/trading/crypto-price-api/introduction/). However since this is a tutorial project we don't execute a trade but rather store the trade info in an excel document. This is to provide an understanding on how Bitquery APIs could be used to build a full product.

> Note: This material is for educational and informational purposes only and is not intended as investment advice. The content reflects the author's personal research and understanding. While specific investments and strategies are mentioned, no endorsement or association with these entities is implied. Readers should conduct their own research and consult with qualified professionals before making any investment decisions. Bitquery is not liable for any losses or damages resulting from the application of this information.

## Understanding the Code

You can view the entire codebase [here](https://github.com/Kshitij0O7/copy-trading-bot/tree/main). The major logical part is in the `main.py` file, so lets try to breakdown the code written here.

### Imports

This code snippet will cover all the imports needed for running the script.

```python

import requests
import json
import pandas as pd
from constant import token

```

If any error is encountered due to import statement then try running the `pip install ...` command.

### Get Trades Function

This function provides the trade info for a particular address, `HH3BmVQoVsH2c5H3nonkw2ySGogyohBXGGgF7vM7MRdk` in this case that could be stored in a doc or copied by adding custom logic. This function hits the Bitquery API with [this query](https://ide.bitquery.io/Get-Trade-Activities_1) to retrieve the latest trades by this account.

```python

def getTrades():

```

#### Declaring URL, payload and headers

```python

url = "https://streaming.bitquery.io/graphql"

    payload = json.dumps({
        "query": """subscription {
            Solana {
                DEXTrades(
                    where: {
                        Trade: {Buy: {Account: {Address: {is: "HH3BmVQoVsH2c5H3nonkw2ySGogyohBXGGgF7vM7MRdk"}}}},
                        Transaction: {Result: {Success: true}}
                    }
                ) {
                    Trade {
                        Buy {
                            Amount
                            Currency {
                                Name
                                Symbol
                                MintAddress
                            }
                            Price
                        }
                        Dex {
                            ProtocolName
                            ProgramAddress
                            ProtocolFamily
                        }
                        Sell {
                            Currency {
                                MintAddress
                                Name
                                Symbol
                            }
                            Price
                            Amount
                        }
                    }
                    Transaction {
                        Signature
                    }
                }
            }
        }""",
        "variables": "{}"
    })

    headers = {
        'Content-Type': 'application/json',
        'X-API-KEY': 'BQYuTITWanwYGz0YLGdcWSADO74o5RTX',
        'Authorization': token
    }


```

#### Response Handling

```python

response = requests.post(url, headers=headers, data=payload)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}")
        return None

```

### Execute Trades Function

Note that the function doesn't actually execute/replicate the trades retrieved but stores it in an excel document. However, if you wish to build an actual bot or contribute to the project then you can easily do that by adding your own logic to the `executeTrades(trades_data)` function.

```python

def executeTrades(trades_data):

```

#### Error Handling and Variable Declaration

This snippet handles the case where empty `trades_data` is returned. Also, we define variables such as `dex_trades` to call data in a more direct manner and `trade_records` to mould data into the format of our dataframe.

```python

if not trades_data or "data" not in trades_data or "Solana" not in trades_data["data"]:
        print("No trade data found.")
        return

    dex_trades = trades_data["data"]["Solana"]["DEXTrades"]

    # Prepare the data for DataFrame
    trade_records = []

```

#### Iterating the Dex Trades

In this section we are iterating the `dex_trades` and updating the `trade_records` simultaneously.

```python

for trade in dex_trades:
        buy_currency = trade['Trade']['Buy']['Currency']
        sell_currency = trade['Trade']['Sell']['Currency']
        dex_info = trade['Trade']['Dex']
        transaction_info = trade['Transaction']

        trade_records.append({
            'Buy Amount': trade['Trade']['Buy']['Amount'],
            'Buy Currency Name': buy_currency['Name'],
            'Buy Currency Symbol': buy_currency['Symbol'],
            'Buy Mint Address': buy_currency['MintAddress'],
            'Buy Price': trade['Trade']['Buy']['Price'],
            'Sell Amount': trade['Trade']['Sell']['Amount'],
            'Sell Currency Name': sell_currency['Name'],
            'Sell Currency Symbol': sell_currency['Symbol'],
            'Sell Mint Address': sell_currency['MintAddress'],
            'Sell Price': trade['Trade']['Sell']['Price'],
            'Dex Protocol Name': dex_info['ProtocolName'],
            'Dex Program Address': dex_info['ProgramAddress'],
            'Dex Protocol Family': dex_info['ProtocolFamily'],
            'Transaction Signature': transaction_info['Signature']
        })

```

#### Creating a DataFrame and Saving Trade Info to an Excel File

```python

df = pd.DataFrame(trade_records)
    excel_file = 'trades_data.xlsx'
    df.to_excel(excel_file, index=False)
    print(f"Data saved to {excel_file}")

```

### Running the Script

This part of code actually runs the script and calls the functions.

```python

trades_data = getTrades()

executeTrades(trades_data)

```

To run this script enter the following command:

```bash

python3 main.py

```

## Video Tutorial

<VideoPlayer url="https://www.youtube.com/watch?v=TEuwTkRpkYI" />
