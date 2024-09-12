---
sidebar_position: 7
---

# KafkaJS Stream to Get Real-time Data

## Overview

This guide explains a Node.js Kafka consumer implementation to get [onchain data streams](https://bitquery.io/products/streaming) in real-time.

In this example, we subscribe to a Kafka topic, decompress messages using **LZ4** if necessary, and log them to the console. The consumer is secured with SSL and uses certificates for authentication. Additionally, the script generates a unique **groupId** for each run, ensuring that the consumer receives messages independently.

The complete code is available [here](https://github.com/bitquery/kafka-consumer-example)

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Code Components](#code-components)
   - [Dependencies](#dependencies)
   - [Kafka Client Initialization](#kafka-client-initialization)
   - [Group ID Generation](#group-id-generation)
   - [Kafka Consumer Setup](#kafka-consumer-setup)
   - [LZ4 Decompression](#lz4-decompression)
   - [Message Logging](#message-logging)
3. [Execution Workflow](#execution-workflow)
4. [Security Considerations](#security-considerations)
5. [Configuring the Kafka Consumer](#configuring-the-kafka-consumer)
6. [Further Customization](#further-customization)

---

## Prerequisites

Ensure that you have the following components in place before running the code:

1. **Kafka Cluster**: Accessible Kafka brokers.
2. **SSL Certificates**: Server certificate (`server.cer.pem`), client private key (`client.key.pem`), and client certificate (`client.cer.pem`).
3. **Node.js**: Version >= 12.
4. **KafkaJS**: Kafka client library for Node.js.
5. **LZ4**: Compression library for decompression of Kafka messages.

---

## Code Components

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
  clientId: "client-id-anonymized", // Replaced with anonymized clientId
  brokers: ["rpk0.bitquery.io:A", "rpk1.bitquery.io:B", "rpk2.bitquery.io:C"],
  ssl: {
    rejectUnauthorized: false, // Disables server certificate validation
    ca: [fs.readFileSync("server.cer.pem", "utf-8")], // Load server certificate
    key: fs.readFileSync("client.key.pem", "utf-8"), // Load client private key
    cert: fs.readFileSync("client.cer.pem", "utf-8"), // Load client certificate
  },
});
```

- **clientId**: Identifies the Kafka client. This is anonymized in the documentation for security purposes.
- **brokers**: Kafka broker addresses that the client connects to.
- **ssl**: SSL/TLS configuration to secure communication between the client and brokers. Certificates are loaded from local files.

### Group ID Generation

A unique **groupId** is generated for every execution using the `uuid` library. This allows the consumer to consume messages independently of other consumers.

```javascript
const uniqueGroupId = `client-id-test-${uuidv4()}`; // Generate a unique groupId
console.log(`Generated Group ID: ${uniqueGroupId}`);
```

- **groupId**: Used by Kafka to manage message consumption. Each groupId represents a distinct consumer group.

### Kafka Consumer Setup

The Kafka consumer is created and configured to consume from a specific topic. In this example, the consumer connects to the `tron.broadcasted.transactions` topic and listens for new messages.

```javascript
const consumer = kafka.consumer({
  groupId: uniqueGroupId,
  sessionTimeout: 30000,
});
```

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

## Execution Workflow

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

---

## Security Considerations

- **SSL Certificates**: Ensure that the SSL certificates are kept secure. The private key, especially, should not be exposed.
- **Certificate Validation**: In the example, `rejectUnauthorized: false` disables server certificate validation, which is not recommended for production environments. For secure deployments, ensure that server certificates are properly validated.

---

## Configuring the Kafka Consumer

You can customize the consumer by changing the following parameters:

- **Topic**: Modify the `topic` variable to subscribe to a different Kafka topic.
- **Max Messages**: Change the `maxMessages` variable to control how many messages are saved to the log file.
- **Auto-Commit**: The script currently has `autoCommit: false`, meaning offsets are not automatically committed after message processing.

---

## Further Customization

### Error Handling

Improve error handling logic for Kafka consumer connection and message processing.

### Message Filtering

Implement logic to filter messages based on content or metadata (e.g., filtering by `partition` or `offset`).
