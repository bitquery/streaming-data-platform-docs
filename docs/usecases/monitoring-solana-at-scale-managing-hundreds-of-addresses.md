# Monitoring Solana at Scale: Managing 100s of Addresses

This guide demonstrates how to monitor real-time trades efficiently, and token transfers for up to 100s of blockchain addresses using WebSockets and Streamlit. Learn to dynamically track and display key transfer and trade details, ensuring real-time updates for large-scale address monitoring.

## Monitoring 100s of Addresses on Solana Transfers in Real-Time

Learn how to track real-time Solana token transfers for millions of addresses using a WebSocket connection and display sender, receiver, amount, and time in a dynamic Streamlit dashboard.

### 1. Setting Up the Environment

Begin by importing necessary libraries like asyncio, pandas, streamlit, gql, and WebsocketsTransport. Make sure to install these dependencies using pip:

```
pip install streamlit pandas gql
```

Import the Libraries:

```
import asyncio
import pandas as pd
import streamlit as st
from gql import Client, gql
from gql.transport.websockets import WebsocketsTransport
```

Then, set your Bitquery API token, which is needed to authenticate WebSocket connections to monitor real-time transfers on the Solana blockchain.

```
TOKEN = "your_bitquery_api_token"
```

### 2. Preparing the List of Addresses

A list of Solana addresses is defined that you want to monitor. These addresses are formatted as a list of strings.

```
addresses = [
"7Ppgch9d4XRAygVNJP4bDkc7V6htYXGfghX4zzG9r4cH",
"G6xptnrkj4bxg9H9ZyPzmAnNsGghSxZ7oBCL1KNKJUza",
# Add more addresses here...
]
```

### 3. Creating the Transfer Subscription Query

The create_transfer_subscription_query function dynamically generates a GraphQL query by injecting the list of addresses into the query. This query will track the transfers that involve these addresses in real-time.

```
def create_transfer_subscription_query():
    address_list = ', '.join(f'"{addr}"' for addr in addresses)
    return gql(f"""
        subscription {{
            Solana {{
                Transfers(
                    where: {{any: [{{
                        Transfer: {{Sender: {{Address: {{in: [{address_list}]}}}}}}
                    }}]}}
                ) {{
                    Transfer {{
                        Amount
                        AmountInUSD
                        Receiver {{
                            Address
                        }}
                        Sender {{
                            Address
                        }}
                        Currency {{
                            Symbol
                        }}
                    }}
                }}
            }}
        }}
    """)


```

### 4. Monitoring Real-Time Transfers

The monitor_transfers function connects to the Bitquery WebSocket and subscribes to the transfer data based on the addresses provided. The result is normalized into a pandas DataFrame, which is then updated in real-time on the Streamlit dashboard.

```
async def monitor_transfers():
    transport = WebsocketsTransport(
        url=f"wss://streaming.bitquery.io/eap?token={TOKEN}",
        headers={"Sec-WebSocket-Protocol": "graphql-transport-ws"}
    )

    await transport.connect()
    print("Connected to WebSocket for transfer monitoring.")

    transfers_df = pd.DataFrame()

    # Set up Streamlit display for transfers
    st.title("Solana Transfer Monitoring Dashboard")
    table = st.empty()  # Initialize an empty Streamlit table

    try:
        query = create_transfer_subscription_query()
        async for result in transport.subscribe(query):
            if result.data:
                print("Transfer Data:", result.data)
                transfer_data = pd.json_normalize(result.data['Solana']['Transfers'])

                # Select only the relevant fields
                display_data = transfer_data[[
                    'Transfer.Sender.Address',
                    'Transfer.Receiver.Address',
                    'Transfer.Amount',
                    'Transfer.AmountInUSD',
                    'Transfer.Currency.Symbol'
                ]]

                transfers_df = pd.concat([transfers_df, display_data], ignore_index=True)

                # Update the Streamlit table with the new data
                with st.spinner('Updating data...'):
                    table.table(transfers_df)

    except Exception as e:
        print("Error during transfer monitoring:", e)
    finally:
        await transport.close()


```

### 5. Running the Dashboard

The main function runs the monitor_transfers function asynchronously. This initiates the WebSocket connection and starts streaming real-time transfer data into the Streamlit dashboard.

```
def main():
    asyncio.run(monitor_transfers())

if __name__ == "__main__":
    main()
```

### 6. Deploying the Streamlit Dashboard

To run the real-time monitoring dashboard, use the following command:

```
streamlit run your_script.py

```

The dashboard will be launched in your browser, and you'll see real-time updates of Solana transfers for the specified addresses, showing the sender, receiver, amount, amount in USD, and the currency symbol.

### Output

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXcHwqHt9hYgvazmJ4ZfkN8DcZMAzjH_AUxfVnr6tKLFL6eqQFXct7tgn7SWuRyFoYtMQGS0a4w7aUY76rnuKK7Limapq6X_fxcHYkHHg6Xm4aKdCqp3BAwpx-tTw3zDudUm6PzBz_kV0-DqjnWuhd8EZrZ2?key=muUf06a4jey2zW53BrA-2A)![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXdxHmz1fqQOP1LidJY93Z517fAXmY2NERMzDlD01itskSrSIKpczKdjigeKl_TWDGp-a3LsBnEvd_h47OTxQfBBfzrbT9JA5MlxErfTulEH6Wg1Lc6iMDvpS2mQiqNNKTtgh6IjaFVXiNDkx6pvKTUwjeY?key=muUf06a4jey2zW53BrA-2A)

## Scaling the Monitoring

- Initial tests were conducted with 50 addresses, yielding fast response times.
- Increased the number of addresses to 150, and the response speed remained consistent without any noticeable delay.
- Further tested with over 500 addresses, and again, no visible latency was observed.
- The response time remained relatively quick even as the number of addresses increased, demonstrating the scalability and efficiency of the system.

## Monitoring Solana DEX Trades for 100s of Addresses

This tutorial demonstrates how to monitor real-time DEXTrades on Solana using WebSockets and Streamlit, fetching transaction details such as buy/sell data, currency information, and average trade prices for 100s of addresses.

### 1. Setting Up the Environment

Begin by importing necessary libraries like asyncio, pandas, streamlit, gql, and WebsocketsTransport. Make sure to install these dependencies using pip:

```
pip install streamlit pandas gql

Import the Libraries:

import asyncio
import pandas as pd
import streamlit as st
from gql import Client, gql
from gql.transport.websockets import WebsocketsTransport
```

Then, set your Bitquery API token, which is necessary for authenticating WebSocket connections to monitor real-time DEXTrades on the Solana blockchain.

```
TOKEN = "your_bitquery_api_token"

```

### 2. Preparing the List of Addresses

A list of Solana addresses is defined. The DEXTrades involving these addresses will be monitored. These addresses are formatted as a list of strings.

```
addresses = [
"5qrvgpvr55Eo7c5bBcwopdiQ6TpvceiRm42yjHTbtDvc",
"FpCMFDFGYotvufJ7HrFHsWEiiQCGbkLCtwHiDnh7o28Q",
# Add more addresses here...
]
```

### 3. Creating the DEXTrades Subscription Query

The create_dex_trades_subscription_query function dynamically generates a GraphQL query. It includes the list of addresses to filter the DEXTrades involving those addresses. The query is formatted using the addresses list for monitoring the trade events.

```
def create_dex_trades_subscription_query():
    address_list = ', '.join(f'"{addr}"' for addr in addresses)
    return gql(f"""
        subscription {{
            Solana {{
                DEXTrades(
                    where: {{
                        Transaction: {{ Result: {{ Success: true }} }},
                        Trade: {{ Market: {{ MarketAddress: {{ in: [{address_list}] }} }} }}
                    }}
                ) {{
                    average(of: Trade_Buy_Price)
                    Trade {{
                        Buy {{
                            Currency {{
                                Name
                                Symbol
                                MintAddress
                            }}
                        }}
                    }}
                }}
            }}
        }}
    """)


```

### 4. Monitoring Real-Time DEXTrades

The monitor_dex_trades function establishes a WebSocket connection to Bitquery and subscribes to DEXTrades using the generated query. The resulting data is normalized into a pandas DataFrame, and it is updated in real-time on the Streamlit dashboard.

```
async def monitor_dex_trades():
    transport = WebsocketsTransport(
        url=f"wss://streaming.bitquery.io/eap?token={TOKEN}",
        headers={"Sec-WebSocket-Protocol": "graphql-transport-ws"}
    )

    await transport.connect()
    print("Connected to WebSocket for DEXTrades monitoring.")

    dex_trades_df = pd.DataFrame()

    # Set up Streamlit display for DEXTrades
    st.title("Solana DEXTrades Monitoring Dashboard")
    table = st.empty()  # Initialize an empty Streamlit table

    try:
        query = create_dex_trades_subscription_query()
        async for result in transport.subscribe(query):
            if result.data:
                print("DEXTrade Data:", result.data)
                dex_trade_data = pd.json_normalize(result.data["Solana"]["DEXTrades"])

                # Select relevant fields: Name, Symbol, MintAddress, and average
                display_data = dex_trade_data[[
                    'Trade.Buy.Currency.Name',
                    'Trade.Buy.Currency.Symbol',
                    'Trade.Buy.Currency.MintAddress',
                    'average'
                ]]

                dex_trades_df = pd.concat([dex_trades_df, display_data], ignore_index=True)

                # Update the Streamlit table with the new data
                with st.spinner("Updating data..."):
                    table.table(dex_trades_df)

    except Exception as e:
        print("Error during DEXTrades monitoring:", e)
    finally:
        await transport.close()


```

### 5. Running the Dashboard

The main function runs the monitor_dex_trades function asynchronously. This initiates the WebSocket connection and streams real-time trade data into the Streamlit dashboard.

```
def main():
asyncio.run(monitor_dex_trades())

if __name__ == "__main__":
main()

```

### 6. Deploying the Streamlit Dashboard

To run the real-time monitoring dashboard, use the following command

```
streamlit run your_script.py
```

The dashboard will be launched in your browser, and you will see real-time updates of Solana DEXTrades for the specified addresses. The information displayed includes the trade currency name, symbol, mint address, and the average price of the trades.

### Output

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXem1sKPBSx2mDlPq2AwQhuYYlxgnywbcCuXmzlWJ5oq7vuOW9b0W5ztX0hzA4Do55GkeBOgt0gSym9f94c4SG_c0F98c71ZIssiBcO8HYw7h8NK-wy5qC48D-Lh8qh1ukowza0ZFmi7Ddhz3f5g0ghCp0mk?key=muUf06a4jey2zW53BrA-2A)![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXdc6DMf9mfKu-gox3C7KLTmJ8dYcra4HxwU2gpn-Nhyp6JS1lGUt7WtHZttxn9OYkEqgnLT5hamNnyxZoH3oz-Mc1kV4wBTuF_-iLMQOvin7xXiNUzzinTaXc5aBewDucIcU7aqMmB5zqifW5B6wLkpi8Zz?key=muUf06a4jey2zW53BrA-2A)
