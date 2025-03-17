---
sidebar_position: 2
---

# Tutorial: Consuming Solana Transaction Protobuf Messages from Kafka Using Python

This tutorial explains how to consume Solana transaction messages in protobuf format from Kafka using Python.

You can read more about **Bitquery Protobuf Streams** here:  
[Bitquery Kafka Streaming Concepts - Protobuf Streams](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/#protobuf-streams).

## **Prerequisites**

- Before you begin, install the required Python package containing pb2 files for the proto schema:

```sh
pip install bitquery-pb2-kafka-package

```

- Username and password will be provided by the Bitquery team upon request.

## **1. Setup Kafka Consumer Configuration**

Kafka is used as the message broker for streaming Solana transactions. Below is the required configuration:

```python
import json
import os
import uuid
from confluent_kafka import Consumer, KafkaError, KafkaException
from google.protobuf.message import DecodeError
from solana import parsed_idl_block_message_pb2  # Import the protobuf definition
import base58

```

Generate a unique group ID for the Kafka consumer:

```python
group_id_suffix = uuid.uuid4().hex

```

Define the Kafka configuration:

```python
conf = {
    'bootstrap.servers': 'rpk0.bitquery.io:9093,rpk1.bitquery.io:9093,rpk2.bitquery.io:9093',
    'group.id': f'username-group-{group_id_suffix}',
    'session.timeout.ms': 30000,
    'security.protocol': 'SASL_SSL',
    'ssl.ca.location': '/path-to/server.cer.pem',
    'ssl.key.location': '/path-to/client.key.pem',
    'ssl.certificate.location': '/path-to/client.cer.pem',
    'ssl.endpoint.identification.algorithm': 'none',
    'sasl.mechanisms': 'SCRAM-SHA-512',
    'sasl.username': 'usernamee',
    'sasl.password': 'pwww',
    'auto.offset.reset': 'latest',
}

```

Initialize the Kafka consumer:

```python
consumer = Consumer(conf)
topic = 'solana.transactions.proto'

```

## **2. Processing Kafka Messages**

We define a function to process incoming messages from the Kafka topic. In this function;

- First we create an empty instance of the `ParsedIdlBlockMessage` class, which is defined in the **Bitquery Protobuf schema**.    
-   The `ParseFromString(buffer)` method **decodes** the binary Protobuf message stored in `buffer`.
    -   The `buffer` contains raw binary data received from the Kafka topic (`solana.transactions.proto`).
    -   This method converts the **binary Protobuf data** into a structured Python object (`tx_block`), which can then be processed to extract transaction details.
- Then we traverse the nested data to extract and print individual fields.

```python
def process_message(message):
    try:
        buffer = message.value()

        # Deserialize the protobuf message
        tx_block = parsed_idl_block_message_pb2.ParsedIdlBlockMessage()
        tx_block.ParseFromString(buffer)

        print("\nNew Block Message Received\n")

        # Process Block Header (if available)
        if tx_block.HasField("Header"):
            header = tx_block.Header
            print(f"Block Slot: {header.Slot}")
            print(f"Block Hash: {base58.b58encode(header.Hash).decode()}")
            print(f"Timestamp: {header.Timestamp}")

        # Process Transactions in the Block
        for tx in tx_block.Transactions:
            print("\nTransaction Details:")
            print(f"Transaction Signature: {base58.b58encode(tx.Signature).decode()}")
            print(f"Transaction Index: {tx.Index}")

            # Check transaction status
            if tx.HasField("Status"):
                print(f"Transaction Success: {tx.Status.Success}")

            # Process Transaction Header
            if tx.HasField("Header"):
                header = tx.Header
                print(f"Fee Payer: {base58.b58encode(header.FeePayer).decode()}")
                print(f"Fee: {header.Fee}")
                print(f"Recent Blockhash: {base58.b58encode(header.RecentBlockhash).decode()}")

                # Process Signatures
                print("Signatures:")
                for sig in header.Signatures:
                    print(f"   {base58.b58encode(sig).decode()}")

                # Process Accounts
                print("Accounts Involved:")
                for account in header.Accounts:
                    print(f"   Address: {base58.b58encode(account.Address).decode()}")
                    print(f"   Is Signer: {account.IsSigner}")
                    print(f"   Is Writable: {account.IsWritable}")

            # Balance Updates
            for balance_update in tx.TotalBalanceUpdates:
                print(f"Balance Update: {balance_update.PreBalance} → {balance_update.PostBalance}")

            # Token Balance Updates
            for token_balance_update in tx.TotalTokenBalanceUpdates:
                print(f"Token Balance Update: {token_balance_update.PreBalance} → {token_balance_update.PostBalance}")

            # Process Parsed Instructions
            for instruction in tx.ParsedIdlInstructions:
                print("\nInstruction Details:")
                print(f"Instruction Index: {instruction.Index}")
                print(f"Caller Index: {instruction.CallerIndex}")
                print(f"Depth: {instruction.Depth}")


                # Process Associated Program
                if instruction.HasField("Program"):
                    program = instruction.Program
                    print(f"Program Address: {base58.b58encode(program.Address).decode()}")
                    print(f"Program Name: {program.Name}")
                    print(f"Method Called: {program.Method}")

                # Log Account Updates
                for account in instruction.Accounts:
                    print(f"Instruction Account: {base58.b58encode(account.Address).decode()}")

                # Log Messages from Execution
                for log in instruction.Logs:
                    print(f"Execution Log: {log}")

                # Balance updates inside the instruction
                for balance_update in instruction.BalanceUpdates:
                    print(f"Instruction Balance Update: {balance_update.PreBalance} → {balance_update.PostBalance}")

                for token_balance_update in instruction.TokenBalanceUpdates:
                    print(f"Instruction Token Balance Update: {token_balance_update.PreBalance} → {token_balance_update.PostBalance}")

        # Log the extracted data
        log_entry = {
            'partition': message.partition(),
            'offset': message.offset()
        }

    except DecodeError as err:
        print(f"Protobuf decoding error: {err}")
    except Exception as err:
        print(f"Error processing message: {err}")

```

## **3. Subscribing to the Kafka Topic**

Subscribe the consumer to the Solana transaction topic:

```python
consumer.subscribe([topic])

```

## **4. Polling and Processing Messages**

The consumer continuously polls for new messages:

```python
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

## **Conclusion**

This tutorial provides a Kafka consumer that connects to a secure Kafka cluster, subscribes to a Solana transaction topic, deserializes protobuf messages, and processes transaction details. You can extend this script to store data in a database, trigger alerts, or perform further analysis.


