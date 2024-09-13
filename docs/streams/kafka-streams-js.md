---
sidebar_position: 2
---

# JS Example to use Kafka Streams to get Real-time Data

## Overview

This guide explains a Node.js Kafka consumer implementation to get [onchain data streams](https://bitquery.io/products/streaming) in real-time.

In this example, we subscribe to a Kafka topic, decompress messages using **LZ4** if necessary, and log them to the console. The consumer is secured with SSL and uses certificates for authentication. Additionally, the script generates a unique **groupId** for each run, ensuring that the consumer receives messages independently.

The complete code is available [here](https://github.com/bitquery/kafka-consumer-example)

### Prerequisites

Ensure that you have the following components in place before running the code:

1. **Kafka Cluster**: Accessible Kafka brokers.
2. **Username and Password**: to connect to brokers
3. **topic names(s)** that you will use
4. **Node.js**: Version >= 12.
5. **KafkaJS**: Kafka client library for Node.js.
6. **LZ4**: Compression library for decompression of Kafka messages.

### Dependencies

The script relies on several dependencies, which must be installed using npm:

```bash
npm install kafkajs lz4 uuid fs
```

- **KafkaJS**: A Kafka client library for Node.js.
- **lz4**: A compression library for handling LZ4-compressed Kafka messages.
- **uuid**: A utility to generate unique group IDs.
- **fs**: A Node.js core module used to read SSL certificates.

### Kafka Client Initialization

The Kafka client is initialized using the `Kafka` class from the **KafkaJS** library. The client is configured with SSL, providing authentication via certificates.

```javascript
const kafka = new Kafka({
  clientId: "my-client-id", // Replace with the name of your company
  brokers: [
    "kfk0.bitquery.io:9093",
    "kfk1.bitquery.io:9093",
    "kfk2.bitquery.io:9093",
  ],
  ssl: {
    rejectUnauthorized: false,
    ca: [fs.readFileSync('server.cer.pem', 'utf-8')],
    key: fs.readFileSync('client.key.pem', 'utf-8'),
    cert: fs.readFileSync('client.cer.pem', 'utf-8')
  },
  sasl: {
    mechanism: "scram-sha-512",
    username: "<YOUR USERNAME>",
    password: "<YOUR PASSWORD>",
  },
});
```

- **clientId**: Identifies the Kafka client. This is anonymized in the documentation for security purposes.
- **brokers**: Kafka broker addresses that the client connects to.
- **ssl/sasl**: SSL/SASL configuration to secure and authenticate communication between the client and brokers.
- **server.cer.pem**, **client.key.pem** and **client.cer.pem** are files that you receive from our support team


### Kafka Consumer Setup

The Kafka consumer is created and configured to consume from a specific topic. In this example, the consumer connects to the `tron.broadcasted.transactions` topic and listens for new messages.

```javascript
const consumer = kafka.consumer({
  groupId: "<YOUR USERNAME>-group",
  sessionTimeout: 30000,
});
```

- **groupId**: can use any groupId starting with your username

- **sessionTimeout**: The time (in milliseconds) after which, if the consumer has not sent a heartbeat, it will be considered dead.

```javascript
const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: false });

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ partition, message }) => {
      try {
        //processing code continued below
        console.log(logEntry);
      } catch (err) {
        console.error("Error processing message:", err);
      }
    },
  });
};

run().catch(console.error);
```

### LZ4 Decompression

Kafka messages are sometimes compressed using LZ4. The script attempts to decompress each message. If decompression fails, it assumes the message is not compressed and handles it as a regular UTF-8 string.

```javascript
const buffer = message.value;
let decompressedValue;

try {
  decompressedValue = lz4.decode(buffer).toString("utf-8");
} catch (err) {
  console.error("LZ4 frame decompression failed:", err);
  decompressedValue = buffer.toString("utf-8");
}
```

- **LZ4 Compression**: If the message is compressed using LZ4, the `lz4.decode` method is used to decompress it.
- If the decompression fails, the message is treated as a regular UTF-8 string.

### Message Logging

Messages are logged into the console in the format `{ partition, offset, value }` using `console.log(logEntry);`.

```javascript
const logEntry = {
  partition,
  offset: message.offset,
  value: decompressedValue,
};
console.log(logEntry);
```

---

### Execution Workflow

The following sequence of operations occurs when the script runs:

1. **Kafka Client Initialization**: The Kafka client is created and configured using SSL certificates.
2. **Group ID Generation**: A unique groupId is generated using UUID, ensuring no collision with other consumers.
3. **Kafka Consumer Connection**: The consumer connects to the Kafka brokers and subscribes to the specified topic.
4. **Message Processing**:
   - The `run` function is responsible for the main consumer logic:
     - **Connecting the Consumer**: Establishes the connection with Kafka. When you set `autoCommit` to false, you disable the automatic committing of message offsets.
     - **Subscribing to the Topic**: Begins listening to the specified Kafka topic.
     - **Running the Consumer**: Starts consuming messages with the `eachMessage` handler.
       - **Message Handling**: Attempts to decompress messages using LZ4. If decompression fails, treats the message as plain text.
       - **Logging**: Logs the message's partition, offset, and content to the console.
5. **Error Handling**: Errors during message processing are caught and logged.
