---
sidebar_position: 2
---

# Python Tutorial to use Solana Shreds from Kafka

This tutorial explains how to consume Solana transaction messages in protobuf format from Kafka using Python, and print them efficiently with decoded `bytes` fields in **base58** format.

You can read more about **Bitquery Protobuf Streams** here:  
[Bitquery Kafka Streaming Concepts - Protobuf Streams](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/#protobuf-streams).

The complete code is available [here](https://github.com/bitquery/streaming-protobuf-python/blob/main/consumer.py).

This code is a sample to get it running. At scale, you have to implement queues and/or multiple consumers ( under same group) to read the messages with little effect to throughput.

## **Prerequisites**

Before you begin, install the required Python package that includes the compiled `.pb2` files:

```sh
pip install bitquery-pb2-kafka-package

```

You’ll also need your **Kafka username/password** provided by the Bitquery team.

## **1. Setup Kafka Consumer Configuration**

```python
import uuid
import base58
from confluent_kafka import Consumer, KafkaError, KafkaException
from google.protobuf.message import DecodeError
from google.protobuf.descriptor import FieldDescriptor
from solana import parsed_idl_block_message_pb2  # Bitquery's compiled protobuf schema

```

### Generate a unique Kafka consumer group ID:

```python
group_id_suffix = uuid.uuid4().hex

```

### Define your Kafka config:

non-SSL:

```python
'bootstrap.servers': 'rpk0.bitquery.io:9092,rpk1.bitquery.io:9092,rpk2.bitquery.io:9092',
'security.protocol': 'SASL_PLAINTEXT',

```

Full example:

```python
conf = {
    'bootstrap.servers': 'rpk0.bitquery.io:9092,rpk1.bitquery.io:9092,rpk2.bitquery.io:9092',
    'group.id': f'username-group-{group_id_suffix}',
    'session.timeout.ms': 30000,
    'security.protocol': 'SASL_PLAINTEXT',
    'ssl.endpoint.identification.algorithm': 'none',
    'sasl.mechanisms': 'SCRAM-SHA-512',
    'sasl.username': 'your-username',
    'sasl.password': 'your-password',
    'auto.offset.reset': 'latest',
}

consumer = Consumer(conf)
topic = 'solana.transactions.proto'
consumer.subscribe([topic])

```

## **2. Define a Protobuf Traversal Print Function**

This function **recursively walks** through any protobuf message and prints all its fields, converting `bytes` to **base58** or **hex**.

> 💡 **Solana vs EVM Encoding Tip**
>
> Protobuf `bytes` fields should be decoded differently depending on the blockchain:
>
> - ✅ **Solana**: Use `base58` (e.g. account addresses, signatures)
> - ✅ **EVM (Ethereum, BSC, etc.)**: Use `hex` with a `0x` prefix
>
> This tutorial uses `base58` decoding, appropriate for Solana.  
> If you're consuming EVM Protobuf messages instead, update:
>
> ```python
> print_protobuf_message(msg, encoding='hex')
> ```
>
> and set `convert_bytes()` to return `'0x' + value.hex()`.

```python
def convert_bytes(value, encoding='base58'):
    if encoding == 'base58':
        return base58.b58encode(value).decode()
    return value.hex()

def print_protobuf_message(msg, indent=0, encoding='base58'):
    prefix = ' ' * indent
    for field in msg.DESCRIPTOR.fields:
        value = getattr(msg, field.name)

        if field.label == FieldDescriptor.LABEL_REPEATED: # The field is a repeated (i.e. array/list) field.
            if not value:
                continue
            print(f"{prefix}{field.name} (repeated):")
            for idx, item in enumerate(value):
                if field.type == FieldDescriptor.TYPE_MESSAGE:
                    print(f"{prefix}  [{idx}]:")
                    print_protobuf_message(item, indent + 4, encoding)
                elif field.type == FieldDescriptor.TYPE_BYTES:
                    print(f"{prefix}  [{idx}]: {convert_bytes(item, encoding)}")
                else:
                    print(f"{prefix}  [{idx}]: {item}")

        elif field.type == FieldDescriptor.TYPE_MESSAGE: # The field is a nested protobuf message.
            if msg.HasField(field.name):
                print(f"{prefix}{field.name}:")
                print_protobuf_message(value, indent + 4, encoding)

        elif field.type == FieldDescriptor.TYPE_BYTES:
            print(f"{prefix}{field.name}: {convert_bytes(value, encoding)}")

        elif field.containing_oneof:
            if msg.WhichOneof(field.containing_oneof.name) == field.name:
                print(f"{prefix}{field.name} (oneof): {value}")

        else:
            print(f"{prefix}{field.name}: {value}")

```

---

## **3. Process Messages From Kafka**

This function decodes the raw Protobuf message and passes it to our traversal printer.

```python
def process_message(message):
    try:
        buffer = message.value()

        tx_block = parsed_idl_block_message_pb2.ParsedIdlBlockMessage()
        tx_block.ParseFromString(buffer)

        print("\nNew ParsedIdlBlockMessage received:\n")
        print_protobuf_message(tx_block, encoding='base58')

    except DecodeError as err:
        print(f"Protobuf decoding error: {err}")
    except Exception as err:
        print(f"Error processing message: {err}")

```

### **Note**

You can **easily adapt this script to any topic and Protobuf message type** — simply change the `topic` name and the corresponding **message class** in `process_message()`. The rest of the logic remains the same!

For example, if you're consuming a different topic with a different `.proto` schema:

```python
# Change the topic name
topic = 'other_topic.proto'

# Change the message class in process_message
your_message = your_other_pb2.YourOtherMessage()
your_message.ParseFromString(buffer)

```

## **4. Poll and Print Messages in Real Time**

This is the main loop for consuming Kafka messages and printing parsed protobuf content.

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
    print("Stopping consumer...")

finally:
    consumer.close()

```
