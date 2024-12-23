# Setting up Google Pub-Sub

This tutorial walks through a process of subscribing to the Bitquery Streaming API and publishing its data to a Google Cloud Pub/Sub topic.

### 1. Set Up Google Cloud Pub/Sub

1. Create a Pub/Sub Topic:

   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Navigate to Pub/Sub > Topics.
   - Create a new topic named `bitquery-data-stream`( this is an example).

![](/img/diagrams/pubsub.png)

2. Create a Subscription:

   - Click on the topic and create a subscription (e.g., `test1d`).
   - Choose Pull or Push, depending on your architecture.


3. Service Account Configuration:
   - Create a service account with the role `Pub/Sub Publisher`.
   - Download the service account key as `key.json`.

---

### 2. Writing Code - Install Required Libraries

Now we will setup the code to publish messages to the subscribers.
Install the Python libraries needed for WebSocket communication and Pub/Sub interaction:

```bash
pip install websockets google-cloud-pubsub
```

---

### 3. Write the Script

#### Imports and Setup

Set up the necessary imports and environment variables:

```python
import asyncio
import json
import websockets
from google.cloud import pubsub_v1
import os

# Set Google Application Credentials
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "key.json"
```

#### Bitquery WebSocket API Details

Configure the WebSocket URL and the query to fetch Pumpfun DEX trades. To learn how to generate a token to use with the url, go [here](https://docs.bitquery.io/docs/authorisation/how-to-generate/)

```python
url = "wss://streaming.bitquery.io/eap?token=<YOUR_TOKEN>"
query = """
subscription MyQuery {
  Solana {
    DEXTrades(
      where: {
        Trade: { Dex: { ProtocolName: { is: "pump" } } }
        Transaction: { Result: { Success: true } }
      }
    ) {
      Trade {
        Dex {
          ProtocolFamily
          ProtocolName
        }
        Buy {
          Amount
          Account {
            Address
          }
        }
        Sell {
          Amount
          Account {
            Address
          }
        }
      }
      Transaction {
        Signature
      }
    }
  }
}
"""
```

#### Google Pub/Sub Configuration

Set up the Pub/Sub publisher:

```python
project_id = "your project id"
topic_id = "bitquery-data-stream"

publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path(project_id, topic_id)
```

#### Fetch and Publish Function

Handle WebSocket communication and Pub/Sub publishing:

```python
async def fetch_and_publish():
    async with websockets.connect(url, subprotocols=["graphql-ws"]) as websocket:
        # Step 1: Initialize connection
        await websocket.send(json.dumps({"type": "connection_init"}))

        # Wait for connection acknowledgment
        while True:
            response = await websocket.recv()
            response_data = json.loads(response)
            if response_data.get("type") == "connection_ack":
                print("Connection acknowledged.")
                break

        # Step 2: Send subscription query
        await websocket.send(json.dumps({"type": "start", "id": "1", "payload": {"query": query}}))

        # Step 3: Listen and publish messages to Pub/Sub
        while True:
            response = await websocket.recv()
            data = json.loads(response)

            # Process pumpfun data
            if data.get("type") == "data" and "payload" in data:
                trades = data['payload']['data'].get('Solana', {}).get('DEXTrades', [])

                for trade in trades:
                    message = {
                        "protocol_family": trade['Trade']['Dex']['ProtocolFamily'],
                        "protocol_name": trade['Trade']['Dex']['ProtocolName'],
                        "buy_amount": trade['Trade']['Buy']['Amount'],
                        "buy_account": trade['Trade']['Buy']['Account']['Address'],
                        "sell_amount": trade['Trade']['Sell']['Amount'],
                        "sell_account": trade['Trade']['Sell']['Account']['Address'],
                        "transaction_signature": trade['Transaction']['Signature']
                    }
                    await publish_to_pubsub(message)
```

#### Publish to Pub/Sub

Create a function to publish messages to Pub/Sub:

```python
async def publish_to_pubsub(message):
    print(f"Publishing message: {message}")
    future = publisher.publish(topic_path, json.dumps(message).encode("utf-8"))
    future.result()  # Wait for the message to be successfully published
    print("Message published.")
```

#### Main Function

Handle errors and run the WebSocket fetch:

```python
async def main():
    try:
        await fetch_and_publish()
    except Exception as e:
        print(f"Error occurred: {e}")

# Run the main function
asyncio.run(main())
```

### 4. Part 2 - Setup Data Write to Bigquery

Next, we will create a subscriber to write this data to a Bigquery Table

### 5. Architecture Overview

- WebSocket Client: Fetches live data from Bitquery.
- Google Pub/Sub: Acts as a message bus for downstream consumers.
- Downstream Processing: Consume and process data from Pub/Sub using Bigquery, Dataflow, or other analytics tools.

---

### 6. Debugging Tips

- Use `print()` statements or logging to debug errors.
- Ensure your WebSocket token and Pub/Sub credentials are valid.
- Test Pub/Sub message flow using the Pub/Sub console.
