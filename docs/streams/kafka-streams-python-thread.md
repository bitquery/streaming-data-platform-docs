# Python Tutorial: Real-Time Kafka Consumer with Multihreading

This guide will walk you through implementing a **multi-threaded Kafka consumer** in Python that subscribes to a [**Bitquery onchain data stream**](https://bitquery.io/products/streaming) in real time. We will use the **Confluent Kafka library** to consume messages securely using **SSL and SASL authentication**.

### **Key Features of This Consumer**

- Uses **multiple threads** to run parallel Kafka consumers.
- **Auto-balances** partitions across consumers.

## **Prerequisites**

Ensure you have the following before running the script:

1.  **Bitquery Kafka Cluster Access**

    - Kafka brokers (`rpk0.bitquery.io:9093`, `rpk1.bitquery.io:9093`, `rpk2.bitquery.io:9093`)
    - Username & Password for authentication.
    - Topic name (`solana.transfers`).

2.  **Python Environment**

    - Python
    - `confluent-kafka` library installed.

3.  **Username and Password**
    - Credentials to access the Kafka Broker, this will be provided by the Bitquery team

### **Install Dependencies**

Run the following command to install the required package:

```bash
pip install confluent_kafka

```

---

## **Kafka Consumer Code**

The following script initializes multiple **Kafka consumers** using Python threads.

```python
from confluent_kafka import Consumer, KafkaError, KafkaException
import threading

# Kafka Configuration
conf = {
    'bootstrap.servers': 'rpk0.bitquery.io:9093,rpk1.bitquery.io:9093,rpk2.bitquery.io:9093',
    'group.id': 'username-group-SOMENUMBER',  # Must start with your assigned username
    'session.timeout.ms': 30000,
    'security.protocol': 'SASL_SSL',
    'ssl.ca.location': 'server.cer.pem',
    'ssl.key.location': 'client.key.pem',
    'ssl.certificate.location': 'client.cer.pem',
    'ssl.endpoint.identification.algorithm': 'none',
    'sasl.mechanisms': 'SCRAM-SHA-512',
    'sasl.username': 'username',
    'sasl.password': 'password',
    'auto.offset.reset': 'latest',
}

# Kafka Topic to Subscribe
topic = 'solana.transfers'

# Number of Consumers
NUM_CONSUMERS = 4


def on_assign(consumer, partitions, consumer_id):
    """
    Callback function when partitions are assigned to a consumer.
    """
    assigned_partitions = [p.partition for p in partitions]
    print(f"Consumer {consumer_id} assigned to partitions: {assigned_partitions}")
    consumer.assign(partitions)


def start_consumer(consumer_id):
    """
    Starts a Kafka consumer in a separate thread.
    """
    local_conf = conf.copy()
    consumer = Consumer(local_conf)

    # Subscribe to topic with partition assignment callback
    consumer.subscribe([topic], on_assign=lambda c, p: on_assign(c, p, consumer_id))

    print(f"Consumer {consumer_id} started...")

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

            print(f"Consumer {consumer_id} received from Partition {msg.partition()}: Offset {msg.offset()}")

    except KeyboardInterrupt:
        pass
    finally:
        consumer.close()
        print(f"Consumer {consumer_id} stopped.")


# Launch multiple consumers using threading
threads = []
for i in range(NUM_CONSUMERS):
    t = threading.Thread(target=start_consumer, args=(i,))
    t.start()
    threads.append(t)

# Join threads to keep the script running
for t in threads:
    t.join()

```

## **Understanding the Code**

### **1. Kafka Consumer Configuration**

The `conf` dictionary contains essential **Kafka settings**, including:

- **Bootstrap servers** (`rpk0.bitquery.io:9093, rpk1.bitquery.io:9093, rpk2.bitquery.io:9093`)
- **Group ID** (`username-group-number`) – Consumers within the **same group** share the load.
- **SSL authentication** (`ssl.ca.location`, `ssl.key.location`, `ssl.certificate.location`).
- **SASL Authentication** using `SCRAM-SHA-512` (username & password).
- **Auto offset reset** to `latest` (reads only new messages).

### **2. Partition Assignment Callback (`on_assign`)**

When Kafka assigns partitions to a consumer, the `on_assign()` function logs the assigned partitions:

```python
def on_assign(consumer, partitions, consumer_id):
    assigned_partitions = [p.partition for p in partitions]
    print(f"Consumer {consumer_id} assigned to partitions: {assigned_partitions}")
    consumer.assign(partitions)

```

### **3. Consumer Thread Execution (`start_consumer`)**

Each consumer:

- Creates a local **Kafka consumer instance**.
- **Subscribes** to the `solana.transfers` topic.
- **Polls messages in a loop** and logs the partition and offset.
- **Handles errors** using `KafkaError` and `KafkaException`.
- **Gracefully shuts down** on `KeyboardInterrupt`.

```python
while True:
    msg = consumer.poll(timeout=1.0)
    if msg is None:
        continue
    if msg.error():
        if msg.error().code() == KafkaError._PARTITION_EOF:
            continue
        else:
            raise KafkaException(msg.error())

    print(f"Consumer {consumer_id} received from Partition {msg.partition()}: Offset {msg.offset()}")

```

### **4. Multi-threading for Parallel Consumers**

Kafka partitions messages across multiple consumers in the same **group**. This script spawns **four** consumer threads:

```python
NUM_CONSUMERS = 4
threads = []

for i in range(NUM_CONSUMERS):
    t = threading.Thread(target=start_consumer, args=(i,))
    t.start()
    threads.append(t)

for t in threads:
    t.join()

```

Each consumer **runs independently**, receiving a subset of messages from the topic.

## **Execution Workflow**

### **When the Script Runs:**

1.  **Initialize consumers** with SSL and SASL authentication.
2.  **Start multiple threads** for parallel Kafka consumption.
3.  **Consumers automatically balance** partitions among themselves.
4.  **Messages are polled** and logged with partition & offset details.
5.  **Consumers gracefully exit** on script termination.

## **Error Handling**

- **Connection Issues:** If the Kafka cluster is unreachable, an exception is raised.
- **Message Errors:** Handled with `KafkaError._PARTITION_EOF` or `KafkaException(msg.error())`.
- **SSL Issues:** Ensure certificates (`.pem` files) are correctly configured.

## **How to Run the Consumer**

1.  **Save the script as** `kafka_consumer.py`
2.  **Run the script:**

    ```bash
    python kafka_consumer.py

    ```

3.  **Monitor logs** for incoming messages.
