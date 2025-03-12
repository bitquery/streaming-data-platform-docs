# Comparing WebSocket vs Kafka Performance in Bitquery

Real-time blockchain data is crucial for many applications, from trading bots to analytics dashboards. Bitquery offers two primary methods for accessing streaming data: WebSocket subscriptions and Kafka streams. But which one is faster? This tutorial will walk you through a practical comparison of both methods, with code examples and performance analysis.

## Introduction

Bitquery provides two ways to access real-time blockchain data:

1. **WebSocket Subscriptions**: Direct, persistent connections using GraphQL subscriptions
2. **Kafka Streams**: Message queue-based approach for high-throughput data consumption

This guide will help you understand:

- How to implement both connection types
- How to run them simultaneously for fair comparison
- How to analyze the performance differences
- When to choose one method over the other

## Prerequisites

To follow along, you'll need:

- Python
- Bitquery API access (for WebSocket). Check the steps to generate OAuth token [here](https://docs.bitquery.io/docs/authorisation/how-to-generate/).
- Bitquery Kafka access credentials. Contact us on [telegram](https://t.me/bloxy_info) to get the credentials.
- Clone the repository:
  ```
  git clone https://github.com/Akshat-cs/Kafka-vs-websocket.git .
  ```
- The following Python packages:
  ```
  pip install gql confluent-kafka pandas asyncio
  ```

## Setting Up WebSocket Client in websocket_recorder.py file

Let's start by examining our WebSocket implementation. This client connects to Bitquery's streaming service and listens for DEX trades on the Solana blockchain.

```python
import asyncio
import csv
from datetime import datetime
from gql import Client, gql
from gql.transport.websockets import WebsocketsTransport

# Configuration
runtime_seconds = 60 * 15  # 15 minutes
output_file = 'websocket_trades.csv'
```

The WebSocket client uses the `gql` library to handle GraphQL subscriptions. Here's the key part of the implementation:

```python
transport = WebsocketsTransport(
    url="wss://streaming.bitquery.io/eap?token=YOUR_TOKEN",
    headers={"Sec-WebSocket-Protocol": "graphql-ws"},
    connect_timeout=30,
    close_timeout=5,
    keep_alive_timeout=60,
    init_payload={'type': 'connection_init'}
)

# Define the subscription query - focusing on Pump DEX trades
query = gql("""
    subscription MyQuery {
        Solana {
            DEXTradeByTokens (where: {Trade: {Dex: {ProtocolName: {is: "pump"}}}}){
                Transaction {
                    Signature
                }
                Trade {
                    Dex {
                        ProtocolName
                    }
                }
            }
        }
    }
""")
```

The client subscribes to the GraphQL endpoint and processes incoming messages asynchronously:

```python
async for result in subscription:
    recorded_time = datetime.now().isoformat()

    if hasattr(result, 'data') and result.data:
        trades = result.data.get('Solana', {}).get('DEXTradeByTokens', [])

        if trades:
            for trade in trades:
                txn_hash = trade.get('Transaction', {}).get('Signature', 'unknown')
                csv_writer.writerow([recorded_time, txn_hash])
                f.flush()  # Write data immediately to disk
                trade_count += 1
```

This loop runs until the specified runtime is reached, recording each trade's transaction hash and the exact time it was received.

## Setting Up Kafka Consumer in k_recorder.py file

Now let's look at our Kafka implementation. This client connects to Bitquery's Kafka stream to consume the same DEX trades data.

```python
import json
import time
from datetime import datetime
from confluent_kafka import Consumer, KafkaError

# Configuration
username = 'your_username'
password = 'your_password'
topic = 'solana.dextrades'
runtime_seconds = 60 * 15  # 15 minutes
output_file = 'kafka_trades.csv'
```

The Kafka consumer configuration includes authentication and connection settings:

```python
conf = {
    'bootstrap.servers': 'rpk0.bitquery.io:9093,rpk1.bitquery.io:9093,rpk2.bitquery.io:9093',
    'group.id': username + '-group-id',
    'session.timeout.ms': 30000,
    'security.protocol': 'SASL_SSL',
    'ssl.ca.location': 'server.cer.pem',
    'ssl.key.location': 'client.key.pem',
    'ssl.certificate.location': 'client.cer.pem',
    'ssl.endpoint.identification.algorithm': 'none',
    'sasl.mechanisms': 'SCRAM-SHA-512',
    'sasl.username': username,
    'sasl.password': password,
    'auto.offset.reset': 'latest',
    "enable.auto.commit": 'false',
}
```

The consumer polls for messages in a loop:

```python
while time.time() - start_time < runtime_seconds:
    msg = consumer.poll(timeout=1.0)

    if msg is None:
        continue
    if msg.error():
        if msg.error().code() == KafkaError._PARTITION_EOF:
            continue
        else:
            print(f"Error: {msg.error()}")
            continue

    # Record the time this message was received
    recorded_time = datetime.now().isoformat()

    buffer = msg.value().decode('utf-8')
    trade_data = json.loads(buffer)

    # Process each trade in the list
    for trade in trade_data:
        txn_hash = trade.get('Transaction', {}).get('Signature', 'unknown')

        # Filter for Pump trades
        if trade.get('Trade', {}).get('Dex', {}).get('ProtocolName', '').lower() == 'pump':
            trade_count += 1

            # Write to CSV file
            f.write(f"{recorded_time},{txn_hash}\n")
            f.flush()  # Ensure immediate disk write
```

This loop records each trade's transaction hash along with the exact time it was received, similar to the WebSocket client.

## Running Both Clients Simultaneously

To ensure a fair comparison, we need to run both clients simultaneously. This script manages both processes:

```python
import subprocess
import time
import sys
from datetime import datetime

# Configuration
runtime_seconds = 60 * 15  # 15 minutes
kafka_script = 'k_recorder.py'
websocket_script = 'websocket_recorder.py'

# Start both scripts as subprocesses
kafka_process = subprocess.Popen([sys.executable, kafka_script],
                                stdout=subprocess.PIPE,
                                stderr=subprocess.PIPE,
                                text=True,
                                bufsize=1)

websocket_process = subprocess.Popen([sys.executable, websocket_script],
                                    stdout=subprocess.PIPE,
                                    stderr=subprocess.PIPE,
                                    text=True,
                                    bufsize=1)
```

The script uses threading to monitor and display the output from both processes:

```python
# Function to handle and print process output
def handle_output(process, name):
    for line in process.stdout:
        print(f"[{name}] {line.strip()}")

# Start threads to monitor output
import threading
kafka_thread = threading.Thread(target=handle_output, args=(kafka_process, "KAFKA"), daemon=True)
websocket_thread = threading.Thread(target=handle_output, args=(websocket_process, "WEBSOCKET"), daemon=True)

kafka_thread.start()
websocket_thread.start()
```

This approach ensures both clients are running concurrently and experiencing the same network conditions.

## Analyzing the Results

After both clients have run, we need to compare their performance. This script analyzes the recorded timestamps:

```python
import pandas as pd
from datetime import datetime

def parse_datetime(dt_str):
    """Parse ISO format datetime string to datetime object."""
    return datetime.fromisoformat(dt_str)

# Load the CSV files
kafka_df = pd.read_csv('kafka_trades.csv')
websocket_df = pd.read_csv('websocket_trades.csv')

# Convert timestamp strings to datetime objects
kafka_df['recorded_time'] = kafka_df['recorded_time'].apply(parse_datetime)
websocket_df['recorded_time'] = websocket_df['recorded_time'].apply(parse_datetime)

# Merge based on transaction hash
merged_df = pd.merge(kafka_df, websocket_df, on='transaction_hash', how='inner', suffixes=('_kafka', '_websocket'))

# Compare timestamps
kafka_first = (merged_df['recorded_time_kafka'] < merged_df['recorded_time_websocket']).sum()
websocket_first = (merged_df['recorded_time_kafka'] > merged_df['recorded_time_websocket']).sum()
same_time = (merged_df['recorded_time_kafka'] == merged_df['recorded_time_websocket']).sum()
```

This analysis tells us which method received each transaction first, allowing for a direct comparison of latency.

## Interpreting the Results

When running this comparison, you'll likely see results similar to this:

<img width="577" alt="Image" src="https://github.com/user-attachments/assets/2768c877-c9b5-4c9e-81f2-1087736fdfbe" />
<img width="666" alt="Image" src="https://github.com/user-attachments/assets/763b7136-ca02-41dc-8578-a5417193b69c" />

In the first example, Kafka received trades first in 60% of cases in just the runtime of mere 15 minutes when we ran the script on EC2 India(Mumbai) servers, suggesting it has lower latency in general. In the second example, Kafka received trades first in 99.7% cases when we ran the script on EC2 Europe(Frankfurt) servers . However, your results may vary based on:

- Network conditions
- Geographic location relative to Bitquery servers
- The specific blockchain and event types being monitored
- Current load on the Bitquery infrastructure

## Implementation Details and Optimizations

### WebSocket Implementation Notes

The WebSocket client uses asyncio for handling the asynchronous nature of WebSocket connections:

```python
# Set a timeout for receiving the first message
timeout_task = asyncio.create_task(asyncio.sleep(30))
subscription_task = asyncio.create_task(get_next_subscription(subscription))

done, pending = await asyncio.wait(
    {timeout_task, subscription_task},
    return_when=asyncio.FIRST_COMPLETED
)
```

This approach ensures the client doesn't hang if the connection isn't working properly. Other optimizations include:

- Periodic heartbeat messages to verify the connection is alive
- Immediate flushing of data to disk to prevent data loss
- Error handling to recover from transient connection issues

### Kafka Implementation Notes

The Kafka consumer is configured with several important settings:

```python
'auto.offset.reset': 'latest',  # Start from the latest messages
"enable.auto.commit": 'false',  # Don't automatically commit offsets
```

These settings ensure we're only getting the most recent data and have full control over message processing. The consumer also:

- Decodes and parses JSON messages
- Handles batched messages (multiple trades in a single Kafka message)
- Filters for the specific protocol we're interested in
- Immediately flushes data to disk for reliability

## When to Choose WebSocket vs Kafka

### Choose WebSocket when:

1. **Simplicity is important**: WebSocket connections are easier to set up and require less infrastructure
2. **You need direct, real-time access**: WebSocket gives you a direct connection to the data source
3. **You're building lightweight applications**: WebSockets have lower overhead for simple use cases
4. **You prefer working with GraphQL**: WebSocket subscriptions use the same GraphQL schema as Bitquery's API

### Choose Kafka when:

1. **Low latency is critical**: As our benchmark shows, Kafka often receives messages faster
2. **You need high throughput**: Kafka is designed for high-volume data processing
3. **Reliability is essential**: Kafka's message queue architecture provides better reliability
4. **You're building enterprise applications**: Kafka integrates well with data processing pipelines
5. **You need horizontal scalability**: Multiple consumers can process the same data stream

## Conclusion

Both WebSocket and Kafka provide effective ways to access real-time blockchain data from Bitquery. While our testing shows Kafka often has lower latency, the right choice depends on your specific requirements.

For simple applications or direct GraphQL integration, WebSocket provides a straightforward solution. For high-performance, enterprise-grade applications with strict latency requirements, Kafka is likely the better choice.

By understanding the strengths and characteristics of each approach, you can select the optimal method for your blockchain data streaming needs.
