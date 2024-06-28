# Automated Trading on Ethereum: How To Build a Volume Surge Detection Bot

In the fast-paced world of DeFi, Maximal Extractable Value (MEV) has become a crucial concept for traders/investors who want to keep up with the market and maximize their profit. MEV is a bot that increases your chance of profit by reordering, including, excluding, or executing transactions within a blockchain network. With a trading bot, traders/investors can capitalize on price discrepancies and volume surges and execute trades that take advantage of these opportunities.

In this tutorial, we’ll walk you through building a volume surge detection MEV bot with Python and using [Bitquery API](https://docs.bitquery.io/docs/intro/) to extract data from the blockchain. This MEV bot will monitor the trading volume of a specific token and automatically initiate and execute a buy order when it detects a significant surge, say a 10% increase in trading volume.

We’ll leverage the Bitquery APIs with Python to monitor activities and automatically execute trades in real-time. We’ll explore how to access and use Bitquery APIs to fetch real-time trading volume data, calculate volume changes, and perform automated transactions on the Ethereum Sepolia testnet.

## Why Bitquery?

[Bitquery](http://https//bitquery.io) is a blockchain data provider that offers suites of tools and APIs to access blockchain data easily. It enables developers, analysts, and researchers to query and retrieve historical and real-time data from over 40 blockchains and protocols with GraphQL.

## Building a Simple Volume Surge Detection MEV Bot in Python

In this section, we’ll build an MEV bot that detects a surge in trade volume for a specific token and automatically executes a buy order when all conditions are met.

This tutorial will guide you through creating a Python script that detects a surge in trading volume for a specific token and executes a buy order on the Ethereum Sepolia testnet. We'll use the Bitquery API to fetch trading volume data and Web3.py to interact with the Ethereum blockchain.

This bot uses the [Bitquery API](https://docs.bitquery.io/docs/intro/) to fetch real-time trading data and Web3.py to interact with the Ethereum blockchain, demonstrating a practical application of Python in blockchain trading automation using the Bitquery API.

- Here is the [link](https://github.com/bitquery/volume-surge-trading-bot/tree/main) to the GitHub Repository for the volume surge detection MEV bot
- Here is also a [step-by-step video tutorial](https://www.youtube.com/watch?v=2sK-dtYF2-k) for the project.

Here is the step-by-step tutorial on how to build this MEV bot.

### Setting Up Your Programming Environment

To build this MEV Bot, set up your programming environment by installing Python, downloading the necessary libraries (requests, web3 os), and setting up Infura and Bitquery APIs. Follow the steps below to set up your environment and the APIs you need for the project.

1.  By running the query below, you can download the libraries needed for the project without any issues.

```
pip install requests web3 os
```

The requests library is used for making Https requests in python while the web3 library is used for interacting with the Ethereum blockchain network. And the os library lets you use the operating system dependent functionality in python. It allows you to interface with the underlying system in several ways like creating, removing, and manipulating directories and libraries.

2.  Once you’ve set up your python environment and download the necessary library for the project as we’ve done in the previous step, you need to set up the API keys needed to retrieve the data from Bitquery.

- Follow [this link](https://docs.bitquery.io/docs/authorisation/how-to-generate/) to learn how to generate the tokens either programmatically or manually to use for this project.

- Visit the alchemy website, and follow the necessary instructions to generate the URL needed to connect with your Sepolia Testnet through the Infura environment.

### Step1: Importing Required Libraries

Once you’ve set up your programming environment, you have to import all the necessary libraries needed to build the MEV bot. These includes the libraries for fetching web pages or API data (requests), connecting to Ethereum nodes (web3), creating directories and files (OS), and manipulating time (datetime and time module)

```python

import requests
from datetime import datetime, timedelta, timezone
from web3 import Web3
import time
import os

```

### Step 2: Script Configurations

Here, you need to configure your scripts by setting up all the necessary variables and API keys. As seen in the query below, you set up the:

- BITQUERY_AUTH_TOKEN: generated from Bitquery. Learn how to generate an API token here
- TOKEN_ADDRESS: is the address of the token you want the MEV bot to track
- TESTNET_URL: URL gotten from alchemy needed to connect to the Ethereum Sepolia testnet
- PRIVATE_KEY: is the private key of the wallet address where the transaction will be executed
- ADDRESS: is your the wallet address you’ll be using
- VOLUME_SURGE_THRESHOLD: is the volume percentage that triggers the MEV bot to execute a trade
- TIME_WINDOW_MINUTES: is the time-frequency to check the data for executing a trade

```python
# Configuration
BITQUERY_AUTH_TOKEN = "ory_at_"
TOKEN_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'  # Address of the token to track
TESTNET_URL = 'https://eth-sepolia.g.alchemy.com/v2/YTg4XGDZmgtjMXggnHyrKLzeLUhQ4eiO'  # Sepolia testnet URL
PRIVATE_KEY = 'e70988a08cb793b15634ad838c3fb7be4056cef220ea521d42c5428a286f77f4'  # Private key for transactions
ADDRESS = '0xF4a86386e0297E1D53Ece30541091dda8098Ead5'  # Address from which transactions will originate
VOLUME_SURGE_THRESHOLD = 0.1  # Threshold for volume surge detection (0.1% increase)
TIME_WINDOW_MINUTES = 60  # Time window in minutes for historical data fetching
```

### Step 3: Setting Up the Predefined Time Range

The script sets up and prints the start (PREDEFINED_SINCE_DATE) and end (PREDEFINED_TILL_DATE) timestamps for a historical data query.

These timestamps are in ISO 8601 format and represent the range from the current time minus a predefined number of minutes (specified by TIME_WINDOW_MINUTES) to the current time.

This time range can then be used to fetch historical data from a database or an API, ensuring that the data falls within the specified period.

```python
# Predefined time range for historical data query
PREDEFINED_SINCE_DATE = (datetime.now(timezone.utc) - timedelta(minutes=TIME_WINDOW_MINUTES)).strftime("%Y-%m-%dT%H:%M:%SZ")
PREDEFINED_TILL_DATE = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
print(f"PREDEFINED_SINCE_DATE: {PREDEFINED_SINCE_DATE}")
print(f"PREDEFINED_TILL_DATE: {PREDEFINED_TILL_DATE}")
```

### Step 4: Fetch the Historical Volume Data

At this step, you create the fetch_volume_data function to fetch historical trading volume data from Bitquery.

The fetch_volume_data function below takes the token_address parameter and uses the [DEXTradeByTokens API](https://docs.bitquery.io/docs/evm/dextrades/) to retrieve the count of trade, sell, and buy amounts from the blockchain using the variables you set up in Step2 (Script configuration) above.

```python
# Function to fetch historical volume data from Bitquery
def fetch_volume_data(token_address):
    print("Fetching volume data...")
    query = """
    {
      EVM(dataset: realtime, network: eth) {
        DEXTradeByTokens(
          where: {Trade: {Currency: {SmartContract: {is: "%s"}}}, Side: {Currency: {SmartContract: {is: “0xdac17f958d2ee523a2206206994597c13d831ec7”}}}}, Block: {Time: {since: "%s", till: "%s"}}}
        ) {
          buy: sum(of: Trade_AmountInUSD)
          sell: sum(of: Trade_Side_AmountInUSD)
          count
        }
      }
    }
    """ % (token_address, PREDEFINED_SINCE_DATE, PREDEFINED_TILL_DATE)

```

The function also send the POST request, which includes an authorization header to the Bitquery API.

```python
print("Querying Bitquery API...")
    try:
        response = requests.post(
            'https://streaming.bitquery.io/graphql',
            json={'query': query},
            headers={'Authorization': f'Bearer {BITQUERY_AUTH_TOKEN}'}
        )


        if response.status_code == 200:
            print("Data successfully fetched.")
            data = response.json()
            trades = data['data']['EVM']['DEXTradeByTokens']
            if not trades:
                print("No trades found.")
            else:
                print("Fetched trades:")
                for trade in trades:
                    print(f" Buy Volume: {trade['buy']} USD, Sell Volume: {trade['sell']} USD")
            return trades
        else:
            raise Exception(f"Failed to fetch data: {response.text}")


    except Exception as e:
        print(f"Error in fetch_volume_data: {str(e)}")
        return None
```

### Step 5: Calculate the Total Volume Traded

Create a get_volume() function to calculate the total volume traded for the specified token.

This function calculates the total trading volume for the specified token by summing up the buy and sell volumes retrieved from the Bitquery API. If there are no trades or an error occurs, it returns 0.

```python

# Function to calculate total volume traded for the token
def get_volume():
    try:
        print("Calculating token volume...")
        trades = fetch_volume_data(TOKEN_ADDRESS)
        if trades is None:
            return 0  # No trades, so volume is 0


        total_volume = sum(float(trade['buy']) + float(trade['sell']) for trade in trades)
        print(f"Total volume: {total_volume}")
        return total_volume
    except Exception as e:
        print(f"Error in get_volume: {str(e)}")
        return 0  # Return 0 volume on error

```


### Step 6: Check for Volume Surge

In this step, you’ll create the check_volume_surge function to check if there is a surge in trading volume.

The function determines if there is a significant surge in the trading volume of the specified token by comparing the initial volume to the current volume. If the increase in volume exceeds a predefined threshold, it indicates a volume surge.

In the case of this demo, if the increase in volume is equal to or greater than the VOLUME_SURGE_THRESHOLD (which in this case is 0.1), it indicates the volume surge or otherwise returns FALSE.