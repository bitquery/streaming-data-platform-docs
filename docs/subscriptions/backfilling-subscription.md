---
sidebar_position: 6
---

# How to Backfill Data After a WebSocket Disconnection in Python

In this section, we'll discuss potential approaches to backfill data when stream disconnects. We will write code to receive live data, handles potential errors and disconnections, backfills any missing data during downtime, and ensures a graceful closure of connections. 

## Overview

In this tutorial, we'll build a system that:

1. **Subscribes to a live data stream via WebSocket.**
2. **Handles errors and detects disconnections.**
3. **Backfills any missing data during downtime by querying historical data.**
4. **Ensures the WebSocket connection is gracefully closed when necessary.**

![flow](/img/diagrams/backfill.png)

We'll use Python's `asyncio` for asynchronous operations, the `gql` library for GraphQL interactions, and the `requests` library for HTTP requests.


## Prerequisites

Before diving into the implementation, ensure you have the following:

- **Python 3.7 or higher** installed.
- **Familiarity with WebSocket and GraphQL**.
- **API access to the Bitquery**.

### Installing Required Libraries

Use `pip` to install the necessary Python libraries:

```bash
pip install asyncio gql requests
```

## System Architecture

The system's workflow can be summarized as follows:

1. **Live Subscription**: Connect to the Bitquery Ethereum Subscription to receive real-time data.
2. **Error Handling**: Monitor the connection for any issues or disconnections.
3. **Backfilling**: Upon detecting a disconnection, query historical data to fill in any gaps.
4. **Graceful Closure**: Properly close the WebSocket connection when done or when an error occurs.

Let's delve into each component in detail.

## Step-by-Step Implementation

### 1. Live Subscription

**Objective**: Establish a live connection to the WebSocket API to receive real-time data.

**Implementation Details**:

- **WebsocketsTransport**: Used from the `gql` library to handle WebSocket connections.
- **GraphQL Subscription**: Defines the query to subscribe to live data.

**Code Explanation**:

```python
import asyncio
from gql import Client, gql
from gql.transport.websockets import WebsocketsTransport
import requests
import datetime
```

We start by importing the necessary libraries. `asyncio` facilitates asynchronous operations, `gql` handles GraphQL queries and subscriptions, `requests` is used for HTTP requests during backfilling, and `datetime` manages time-related operations.

```python
# Bitquery streaming URL and OAuth token
url = "https://streaming.bitquery.io/graphql"
token = "ory_at_...4"
```

Set up the streaming URL and your oAuth token. Replace `"ory_at_...4"` with your actual Bitquery token.

**Live Subscription Function**:

```python
async def subscribe():
    transport = WebsocketsTransport(
        url="wss://streaming.bitquery.io/graphql?token=" + token,
        headers={"Sec-WebSocket-Protocol": "graphql-ws"}
    )

    await transport.connect()
    print("connected")

    try:
        async for result in transport.subscribe(
            gql("""
                subscription MyQuery {
                    EVM(network: eth) {
                        DEXTrades {
                            Block {
                                Time
                            }
                            Transaction {
                                Hash
                            }
                            Trade {
                                Buy {
                                    Buyer
                                    AmountInUSD
                                    Amount
                                    Seller
                                    PriceInUSD
                                    Price
                                    Currency {
                                        Name
                                        Symbol
                                        SmartContract
                                    }
                                }
                                Dex {
                                    SmartContract
                                    ProtocolName
                                    ProtocolVersion
                                }
                                Sell {
                                    Buyer
                                    AmountInUSD
                                    Amount
                                    Seller
                                    PriceInUSD
                                    Price
                                    Currency {
                                        Name
                                        Symbol
                                        SmartContract
                                    }
                                }
                            }
                        }
                    }
                }
            """)
        ):
            # Processing incoming data
            print("Live Data:", result)
    except Exception as e:
        print(f"Error during subscription: {e}")
    finally:
        await transport.close()
```

**Explanation**:

1. **Establish Connection**: Create a `WebsocketsTransport` instance with the WebSocket URL and necessary headers. Connect to the WebSocket using `await transport.connect()`.

2. **Subscription**: Use `transport.subscribe()` with a GraphQL subscription query to listen for live data (`DEXTrades` in this case).

3. **Data Handling**: As live data comes in, it's printed out. In a real-world scenario, you'd process or store this data as needed.

4. **Error Handling**: If any exception occurs during subscription, it's caught and printed.

5. **Graceful Closure**: Regardless of success or failure, the WebSocket connection is closed using `await transport.close()`.

### 2. Error Handling

**Objective**: Detect and handle any network issues or exceptions that may disrupt the WebSocket connection.

**Implementation Details**:

- **Try-Except Blocks**: Used to catch and handle exceptions during the subscription.
- **Logging Errors**: Errors are printed for debugging purposes.

**Code Explanation**:

In the `subscribe` function, the `try-except-finally` block ensures that any exceptions during the subscription process are caught. If an error occurs, it's printed, and the connection is closed gracefully in the `finally` block.

Additionally, the `main` function is designed to catch exceptions from the `subscribe` function and trigger the backfilling process.

```python
def handle_disconnection(start_time, end_time):
    print(f"Connection lost. Backfilling data from {start_time} to {end_time}.")
    asyncio.run(backfill_data(start_time, end_time))
```

The `handle_disconnection` function is invoked when a disconnection is detected. It logs the disconnection and triggers the backfilling process for the time range between `start_time` and `end_time`.

### 3. Backfilling Missing Data

**Objective**: Retrieve any data that was missed during the disconnection period to ensure data completeness.

**Implementation Details**:

-   **Historical Data Query**: In backfilling, the GraphQL query is essentially the same as the live subscription query, but instead of listening to real-time updates, we perform a  **query**  (instead of a  **subscription**) for historical data. The query includes an additional time filter to specify the period for which we want to retrieve the missing data.
    
-   **Time Filter**: The query uses a  `where`  clause to filter data by a specific time range. The parameters  `since`  and  `till`  are added to ensure only data from the disconnected period is queried. This allows us to target the exact time window for which we need to backfill data.
    
-   **Time Range Calculation**: The  `start_time`  (when the disconnection began) and  `end_time`  (when the connection is restored) are used to define the missing data period. This time range is passed into the backfill query to retrieve the missing trades or data.

**Code Explanation**:

```python
# Function to backfill data for a given time range
async def backfill_data(start_time, end_time):
    query = """
    {
      EVM(network: eth) {
        DEXTrades(where: {Block: {Time: {since: "%s", till: "%s"}}}) {
          Block {
            Time
          }
          Transaction {
            Hash
          }
          Trade {
            Buy {
              Buyer
              AmountInUSD
              Amount
              Seller
              PriceInUSD
              Price
              Currency {
                Name
                Symbol
                SmartContract
              }
            }
            Dex {
              SmartContract
              ProtocolName
              ProtocolVersion
            }
            Sell {
              Buyer
              AmountInUSD
              Amount
              Seller
              PriceInUSD
              Price
              Currency {
                Name
                Symbol
                SmartContract
              }
            }
          }
        }
      }
    }
    """ % (start_time, end_time)

    # Make an HTTP request to backfill missing data
    headers = {
        'Content-Type': 'application/json',
        'Authorization': "Bearer "+token
    }
    response = requests.post(url, json={"query": query}, headers=headers)

    if response.status_code == 200:
        result = response.json()
        print("Backfilled Data:", result)
    else:
        print("Failed to backfill data:", response.status_code, response.text)
```

**Explanation**:

1. **GraphQL Query**: The query fetches `DEXTrades` within the specified `start_time` and `end_time`. 

2. **HTTP Request**: Sends the query to the Bitquery API using an HTTP POST request with the necessary headers, including the authorization token.

3. **Response Handling**: If the request is successful (`status_code == 200`), the backfilled data is printed. Otherwise, an error message with the status code and response text is displayed.

**Note**: In a production environment, instead of printing the data, you'd likely store it in a database or process it further.

### 4. Graceful Closure

**Objective**: Ensure that the WebSocket connection is properly closed when it's no longer needed or when an error occurs.

**Implementation Details**:

- **Finally Block**: Ensures the connection is closed regardless of success or failure.
- **Explicit Closure**: Uses `await transport.close()` to terminate the WebSocket connection.

**Code Explanation**:

Within the `subscribe` function, the `finally` block guarantees that the WebSocket connection is closed even if an error occurs during data streaming. This prevents resource leaks and ensures that the connection state is cleanly managed.

```python
finally:
    await transport.close()
```

Additionally, the `handle_disconnection` function ensures that any necessary cleanup or data retrieval occurs when a disconnection is detected.

### Putting It All Together

**Main Function**:

```python
# Main function to run the subscription and detect disconnection
async def main():
    start_time = datetime.datetime.now(datetime.timezone.utc)

    try:
        await subscribe()
    except Exception as e:
        print(f"Disconnection detected: {e}")
        end_time = datetime.datetime.now(datetime.timezone.utc)
        # Call backfill function to handle missing data
        handle_disconnection(start_time.isoformat(), end_time.isoformat())
```

**Explanation**:

1. **Start Time**: Records the current UTC time before initiating the subscription.

2. **Subscription**: Awaits the `subscribe` function to start receiving live data.

3. **Exception Handling**: If an exception occurs (indicating a disconnection), it captures the current time as `end_time` and calls `handle_disconnection` to backfill data for the period between `start_time` and `end_time`.

**Running the Event Loop**:

```python
# Run the asyncio event loop
asyncio.run(main())
```

This line starts the asynchronous event loop, executing the `main` function.

## Complete Code

Here's the complete code assembled from the components discussed:

```python
import asyncio
from gql import Client, gql
from gql.transport.websockets import WebsocketsTransport
import requests
import datetime

# Bitquery streaming URL and API token
url = "https://streaming.bitquery.io/graphql"
token = "ory_at_...4"

# Function to backfill data for a given time range
async def backfill_data(start_time, end_time):
    query = """
    {
      EVM(network: eth) {
        DEXTrades(where: {Block: {Time: {since: "%s", till: "%s"}}}) {
          Block {
            Time
          }
          Transaction {
            Hash
          }
          Trade {
            Buy {
              Buyer
              AmountInUSD
              Amount
              Seller
              PriceInUSD
              Price
              Currency {
                Name
                Symbol
                SmartContract
              }
            }
            Dex {
              SmartContract
              ProtocolName
              ProtocolVersion
            }
            Sell {
              Buyer
              AmountInUSD
              Amount
              Seller
              PriceInUSD
              Price
              Currency {
                Name
                Symbol
                SmartContract
              }
            }
          }
        }
      }
    }
    """ % (start_time, end_time)

    # Make an HTTP request to backfill missing data
    headers = {
        'Content-Type': 'application/json',
        'Authorization': "Bearer "+token
    }
    response = requests.post(url, json={"query": query}, headers=headers)

    if response.status_code == 200:
        result = response.json()
        print("Backfilled Data:", result)
    else:
        print("Failed to backfill data:", response.status_code, response.text)

# Function to subscribe to live data stream
async def subscribe():
    transport = WebsocketsTransport(
        url="wss://streaming.bitquery.io/graphql?token=" + token,
        headers={"Sec-WebSocket-Protocol": "graphql-ws"}
    )

    await transport.connect()
    print("connected")

    try:
        async for result in transport.subscribe(
            gql("""
                subscription MyQuery {
                    EVM(network: eth) {
                        DEXTrades {
                            Block {
                                Time
                            }
                            Transaction {
                                Hash
                            }
                            Trade {
                                Buy {
                                    Buyer
                                    AmountInUSD
                                    Amount
                                    Seller
                                    PriceInUSD
                                    Price
                                    Currency {
                                        Name
                                        Symbol
                                        SmartContract
                                    }
                                }
                                Dex {
                                    SmartContract
                                    ProtocolName
                                    ProtocolVersion
                                }
                                Sell {
                                    Buyer
                                    AmountInUSD
                                    Amount
                                    Seller
                                    PriceInUSD
                                    Price
                                    Currency {
                                        Name
                                        Symbol
                                        SmartContract
                                    }
                                }
                            }
                        }
                    }
                }
            """)
        ):
            # Processing incoming data
            print("Live Data:", result)
    except Exception as e:
        print(f"Error during subscription: {e}")
    finally:
        await transport.close()

# Function to calculate time range and trigger backfill
def handle_disconnection(start_time, end_time):
    print(f"Connection lost. Backfilling data from {start_time} to {end_time}.")
    asyncio.run(backfill_data(start_time, end_time))

# Main function to run the subscription and detect disconnection
async def main():
    start_time = datetime.datetime.now(datetime.timezone.utc)

    try:
        await subscribe()
    except Exception as e:
        print(f"Disconnection detected: {e}")
        end_time = datetime.datetime.now(datetime.timezone.utc)
        # Call backfill function to handle missing data
        handle_disconnection(start_time.isoformat(), end_time.isoformat())

# Run the asyncio event loop
asyncio.run(main())
```

## Running the System

1. **Configure OAuth Token**: Replace `"ory_at_...4"` with your actual Bitquery token.

2. **Execute the Script**: Run the script using Python.

```bash
python your_script_name.py
```

3. **Monitor Output**: The console will display messages indicating successful connections, live data, any errors, and backfilled data as needed.

**Example Output**:

```
connected
Live Data: {...}  # Real-time data received
Error during subscription: Connection closed unexpectedly
Disconnection detected: Connection closed unexpectedly
Connection lost. Backfilling data from 2024-10-14T12:00:00+00:00 to 2024-10-14T12:05:00+00:00.
Backfilled Data: {...}  # Historical data fetched to fill the gap
```

## Alternative Approach: Using Block Heights to Backfill Data
You can implement an alternative approach that uses block heights instead of relying on time periods. 


1.  **Track the Last Processed Block Height**: Continuously update and save the latest block height received from the live data stream.
2.  **Detect Disconnections**: Monitor the WebSocket connection for any interruptions.
3.  **Backfill Missing Data**: Using historical query, use the last saved block height to query and retrieve data from the missed blocks.
4.  **Update the Last Processed Block Height**: After successful backfilling, update the saved block height to reflect the latest processed block.

## Conclusion

In this tutorial, we built a resilient real-time data streaming system using Python. The system effectively manages live data subscriptions, handles errors and disconnections, backfills any missing data to maintain data integrity, and ensures that connections are gracefully closed when necessary.

