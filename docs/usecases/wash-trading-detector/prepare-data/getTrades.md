# Fetching Solana DEX Trades

This module connects to the Bitquery GraphQL API to fetch latest Solana DEX trade data. The trades returned are used throughout the project for labeling, model training, and prediction.

## Understanding the `get_trades` Function

### Importing Dependencies

```py
import requests
import json
import streamlit as st
```

- `requests` – for making HTTP requests to the Bitquery GraphQL API
- `json` – to handle request/response bodies
- `streamlit` – for safely accessing secret API keys in deployment

### Defining Function and Constants

In this code snippet we are defining the `get_trades` function, and inside the function we are defining constants such as:

- `token`: [Access Token](https://account.bitquery.io/user/api_v2/access_tokens) required for authorising request sent to Bitquery API endpoint.
- `query`: The [GraphQL query](https://ide.bitquery.io/Solana-dextrades) which we are looking to retrieve

Along with that, we are also defining the `payload` and `headers` for the request.

```py
def get_trades():
    token = st.secrets['token']
    url = "https://streaming.bitquery.io/graphql"

    query = """
    {
        Solana {
            DEXTrades(
                orderBy: {descending: Block_Time}
                where: {Transaction: {Result: {Success: true}}}
            ) {
                Trade {
                    Dex {
                        ProtocolName
                        ProtocolFamily
                    }
                    Buy {
                        Account{
                            Address
                        }
                        Amount
                        AmountInUSD
                        Currency {
                            Symbol
                            Name
                            MintAddress
                        }
                        PriceInUSD
                    }
                    Sell {
                        Account{
                            Address
                        }
                        Amount
                        AmountInUSD
                        Currency {
                            Symbol
                            Name
                            MintAddress
                        }
                        PriceInUSD
                    }
                }
                Block {
                    Time
                    Height
                }
                Transaction {
                    Signature
                    FeePayer
                }
            }
        }
    }
    """

    payload = json.dumps({
        "query": query,
        "variables": "{}"
    })

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    }

    # try-catch block to be written here
```

### Send Request and Handle Results

Inside the `try-catch` block we are sending the request and processing the data returned.

```py
    try:
        response = requests.post(url, headers=headers, data=payload)
        response.raise_for_status()
        data = response.json()

        trades = data["data"]["Solana"]["DEXTrades"]
        return trades

    except (requests.exceptions.RequestException, KeyError, json.JSONDecodeError) as e:
        print(f"Error fetching DEX trades: {e}")
        return []
```