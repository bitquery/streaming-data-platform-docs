---
sidebar_position: 2
---

# JS Example to use Kafka Streams to get Real-time Data

## Overview

This guide explains a Node.js Kafka consumer implementation to get [onchain data streams](https://bitquery.io/products/streaming) in real-time. In this example, we subscribe to a Kafka topic, handle message compression with LZ4, and log the data to the console. The consumer is secured with SSL and uses certificates for authentication.

The complete code is available [here](https://github.com/bitquery/kafka-consumer-example).

### Prerequisites

Ensure that you have the following components before running the code:

1. **Kafka Cluster**: Accessible Kafka brokers.
2. **Username and Password**: To connect to brokers.
3. **Topic names** you will use.
4. **Node.js**: Version >= 12.
5. **KafkaJS**: Kafka client library for Node.js.
6. **SSL Certificates**: CA, client key, and client certificate files.
7. **LZ4 Compression**: To handle message compression.

### Dependencies

The script relies on several dependencies, which can be installed using npm:

```bash
npm install kafkajs uuid fs kafkajs-lz4
```

- **KafkaJS**: A Kafka client library for Node.js.
- **uuid**: A utility to generate unique group IDs.
- **fs**: A Node.js core module used to read SSL certificates.
- **kafkajs-lz4**: An LZ4 codec to handle compressed messages.

### Kafka Client Initialization

The Kafka client is initialized using the `Kafka` class from the **KafkaJS** library. The client is configured with SSL for authentication via certificates and supports LZ4 message compression.

```javascript
const { Kafka } = require("kafkajs");
const fs = require("fs");
const { CompressionTypes, CompressionCodecs } = require("kafkajs");
const LZ4 = require("kafkajs-lz4");

CompressionCodecs[CompressionTypes.LZ4] = new LZ4().codec;

// Pre-requisites
const username = "<USERNAME>";
const password = "<PASSWORD>";
const topic = "tron.broadcasted.transactions";
// End of pre-requisites

const kafka = new Kafka({
  clientId: username,
  brokers: [
    "rpk0.bitquery.io:9093",
    "rpk1.bitquery.io:9093",
    "rpk2.bitquery.io:9093",
  ],
  ssl: {
    rejectUnauthorized: false,
    ca: [fs.readFileSync("server.cer.pem", "utf-8")],
    key: fs.readFileSync("client.key.pem", "utf-8"),
    cert: fs.readFileSync("client.cer.pem", "utf-8"),
  },
  sasl: {
    mechanism: "scram-sha-512",
    username: username,
    password: password,
  },
});
```

### Kafka Consumer Setup

The Kafka consumer is created and configured to consume from a specific topic. In this example, the consumer connects to the `tron.broadcasted.transactions` topic and listens for new messages.

```javascript
const consumer = kafka.consumer({
  groupId: username + "-my-group",
  sessionTimeout: 30000,
});
```

- **groupId**: You can use any groupId, preferably starting with your username.
- **sessionTimeout**: The time (in milliseconds) after which the consumer is considered dead if it hasn’t sent a heartbeat.

### Consumer Message Handling and Compression

The consumer subscribes to the topic and processes messages. LZ4 compression is supported, and message content is logged to the console.

```javascript
const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: false });

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ partition, message }) => {
      try {
        const buffer = message.value;
        const logEntry = {
          partition,
          offset: message.offset,
          value: buffer.toString("utf-8"),
        };
        console.log(logEntry);
      } catch (err) {
        console.error("Error processing message:", err);
      }
    },
  });
};

run().catch(console.error);
```

### Execution Workflow

1. **Kafka Client Initialization**: The Kafka client is created and configured with SSL certificates and SASL authentication.
2. **Group ID Generation**: A groupId is created, ensuring no collision with other consumers.
3. **Kafka Consumer Connection**: The consumer connects to the Kafka brokers and subscribes to the specified topic.
4. **Message Processing**:
   - **Connecting the Consumer**: Establishes the connection with Kafka.
   - **Subscribing to the Topic**: Begins listening to the specified Kafka topic.
   - **Running the Consumer**: Processes messages with the `eachMessage` handler.
   - **Compression**: Supports handling messages compressed with LZ4.
5. **Error Handling**: Any errors during message processing are caught and logged.

By following this guide, you can set up a Node.js Kafka consumer using KafkaJS, secure it with SSL, and handle message compression using LZ4.
