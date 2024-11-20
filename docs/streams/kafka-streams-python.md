---
sidebar_position: 3
---

# Python Example to Use Kafka Streams for Real-time Data

## Overview

This guide explains how to implement a Python Kafka consumer to receive [onchain data streams from Bitquery](https://bitquery.io/products/streaming) in real-time using the Confluent Kafka library. The consumer is secured with SSL and uses certificates for authentication, subscribing to a Kafka topic and logging messages to the console.

The complete code is available [here](https://github.com/bitquery/kafka-consumer-example).

## Video Tutorial

import VideoPlayer from "../../src/components/videoplayer.js";

<VideoPlayer url="https://youtu.be/pNXq7H8_pfw" />


### Prerequisites

Ensure that you have the following components in place before running the code:

1. **Kafka Cluster**: Accessible Kafka brokers from Bitquery.
2. **Username and Password**: For authentication with the Kafka brokers.
3. **Topic name(s)** to subscribe to.
4. **Python**: Version >= 3.7.
5. **Confluent Kafka Python Client**: Kafka client library for Python.

### Dependencies

The script relies on several dependencies, which must be installed using pip:

```bash
pip install confluent_kafka lz4
```

- **confluent_kafka**: A Python client for Apache Kafka.
- **lz4**: A Python library for LZ4 compression, used to decompress messages.
- **ssl** and **pathlib**: Standard Python libraries for SSL certificates and file path handling.

### Kafka Client Initialization

The Kafka client is initialized using the `Consumer` class from the **confluent_kafka** library. The client is configured with SSL to authenticate communication with the Kafka brokers.

```python
from confluent_kafka import Consumer, KafkaError, KafkaException
import ssl
from pathlib import Path

# Kafka consumer configuration
conf = {
    'bootstrap.servers': 'rpk0.bitquery.io:9093,rpk1.bitquery.io:9093,rpk2.bitquery.io:9093',
    'group.id': 'trontest1-group-1',  # the group id has to start with the username
    'session.timeout.ms': 30000,
    'security.protocol': 'SASL_SSL',
    'ssl.ca.location': 'server.cer.pem',
    'ssl.key.location': 'client.key.pem',
    'ssl.certificate.location': 'client.cer.pem',
    'ssl.endpoint.identification.algorithm': 'none',
    'sasl.mechanisms': 'SCRAM-SHA-512',
    'sasl.username': 'username',
    'sasl.password': 'passwrod',
    'auto.offset.reset': 'latest'
}
```

- **group.id**: A unique identifier for the consumer group. It has to start with the username that was shared with you, for e.g. `trontest1-group-3`, `trontest1-group-5` etc.
- **bootstrap.servers**: List of Kafka broker addresses.
- **SSL configuration**: Paths to the CA, key, and certificate files are provided for SSL authentication.
- **SASL configuration**: Username and password are used for secure communication.

### Kafka Consumer Setup

The Kafka consumer is initialized to consume messages from a specified topic. In this case, the consumer listens to the `tron.broadcasted.transactions` topic.

```python
consumer = Consumer(conf)
topic = 'tron.broadcasted.transactions'
```

### Message Processing

A function `process_message` is used to handle each incoming message. It first attempts to decompress the message using LZ4, falling back to plain text if decompression fails.

```python
import lz4.frame

def process_message(message):
    try:
        buffer = message.value()
        decompressed_value = None

        try:
            # Attempt to decompress LZ4 frame
            decompressed_value = lz4.frame.decompress(buffer).decode('utf-8')
        except Exception as err:
            print(f'LZ4 frame decompression failed: {err}')
            # Fallback to original UTF-8 value
            decompressed_value = buffer.decode('utf-8')

        # Log message data
        log_entry = {
            'partition': message.partition(),
            'offset': message.offset(),
            'value': decompressed_value
        }
        print(log_entry)

    except Exception as err:
        print(f'Error processing message: {err}')
```

- **Decompression**: The message is decompressed using LZ4, or it falls back to standard UTF-8 decoding.
- **Logging**: The partition, offset, and message content are printed to the console.

### Subscribing and Polling

The consumer subscribes to the topic and polls for new messages. Messages are processed in a loop until interrupted.

```python
# Subscribe to the topic
consumer.subscribe([topic])

# Poll messages and process them
try:
    while True:
        msg = consumer.poll(timeout=1.0)
        if msg is None:
            continue
        if msg.error():
            if msg.error().code() == KafkaError._PARTITION_EOF:
                continue
            else:
                raise KafkaException(msg.error())
        process_message(msg)

except KeyboardInterrupt:
    pass

finally:
    # Close down consumer
    consumer.close()
```

- **Polling**: The consumer polls the Kafka broker for new messages. If a message is available, it is processed by `process_message()`.
- **Error Handling**: Errors in message processing or communication with the broker are logged, and the consumer gracefully shuts down on keyboard interruption.

---

### Execution Workflow

The following sequence of operations occurs when the script runs:

1. **Kafka Client Initialization**: The Kafka client is initialized with SSL and SASL configurations.
2. **Group ID Assignment**: A unique `group.id` is used to ensure independent message processing.
3. **Kafka Consumer Connection**: The consumer subscribes to a Kafka topic.
4. **Message Processing**:
   - **Polling**: The consumer polls messages from Kafka, attempting to decompress them if necessary.
   - **Logging**: The partition, offset, and message content are logged.
5. **Graceful Shutdown**: The consumer closes cleanly upon termination.
