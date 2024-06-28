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


