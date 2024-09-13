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


## Kafka Streaming Concepts

### Pro and Cons

Kafka provides faster and more reliable streams comparing to GraphQL subscriptions due to the following advantages:

1. It has lower lattency due to the shorter data pipeline, as GraphQL subscriptions involve custom databases and additional logic to process, filter and format the data
2. Better reliabilty of the connection protocol compared to WebSocket interface, better optimised for persistent connections
3. Messages from Kafka topic can be read from the latest offset, it is possible to create consumers that have all messages without gaps and interuptions
4. Scalability is better as multiple consumers may split the load to consume one topic, automaticlly redistributing load on them

There are some disadvantages however compared to GraphQL subscriptions:

1. There is no way to consume Kafka streams in browser. You can only use it only on server side.
2. It is not possible to pre-filter or re-format messages on Kafka streams, as schema is pre-defined, and you need to make all post-processing in your code. Some calculations, as usd vlue of trade have to be executed on client side as well
3. IDE does not support Kafka streams yet, debugging the code have to be done on consumer side

Kafka streams contains same set of data as GraphQL subscriptions, and the decision which one to use dependent more on your application type.
Consider the following factors when selecting which technology to use.

### Consider using GraphQL if:

* You are building a prototype and the speed of development is a primary factor for you. Integrating GraphQL is easier, IDE helps to de-bug queries and see the data you receive in application;
* Your application uses archive and real-time data altogether. GraphQL has a unified interface to query and subscribe the data streams, that makes such application easier to build and maintain;
* Your application provides different data on web pages, for example show price diagrams for trading. Then GraphQL makes simpler to filter the data and make queries based on page content;
* There is no server side for your application, or it is minimal. Then GraphQL can be integrated directlty to JS client code;

### Consider using Kafka if:

* Latency is the most important factor and you building fast scalable application in cloud or on dedicated servers;
* It is not acceptable to lose any single message from the stream, you need persistent reliability;
* You have a complex calculations, filtering or formatting of the data that GraphQL does not deliver. Then instead of consuming unfiltered stream from GraphQL consider switch to Kafka.

This decision sometimes not straightforward, consult our sales and support team, we will help you find optimal solution.

### Important Notes about Kafka Streams

* Stream is not filtered, it contains all the messages with a compleet data for every topic. It means you need to have a good throughput network, fast server and code to efficently consume and parse it;
* Granularity of data message is different in topics, depending on the nature of the data. Topic that 
* It is **not** guaranteed that the message will come in sequence of the block number, time or any other attribute. 
* Messages in topic **may have** duplicates. If this makes a problem, your code must have a storage or the cache to remember which messages are already processed to avoid double processing.
* Large messages can be separated on smaller ones, as Kafka does not allow pass more than 1 Mbyte in one message. For example, first 1200 transaction may come in one message, and the remaining 1000 will follow in another.

## Consuming Messages

Your application must implement the code:

* Connect to Kafka server;
* Subscribe to particular topic(s);
* Read and parse messages;

### Connect to Kafka server

You need the following to connect:

1. server list for connection is  "kfk0.bitquery.io:9093,kfk1.bitquery.io:9093,kfk2.bitquery.io:9093"
2. username and password for SASL over SSL authentication, that you will receive from our team

Example of connection config looks as:

```
sasl_conf = {
     'bootstrap.servers': 'kfk0.bitquery.io:9093,kfk1.bitquery.io:9093,kfk2.bitquery.io:9093',
     'security.protocol': 'SASL_SSL',
     'sasl.mechanism': 'SCRAM-SHA-512',
     'sasl.username': '<YOUR USERNAME HERE>',
     'sasl.password': '<YOUR PASSWORD HERE>'
}
```

### Subscribe to particular topic(s)

To receive messages you first create consumer and subscribe it to a topic or list of topics.
Topic contains messages of the same type, for example:

* tron.transactions contains messages with transactions, smart contract calls and events in Tron blockchain
* tron.broadcasted.transactions contains messages from mempool broadcasted channel ( before they included in blocks )
* tron.dextrades contains trades happen on Tron blockchain
* solana.dextrades contains trades happen on Solana blockchain
* and so on...

General pattern of the topic name is:

```
<BLOCKCHAIN_NAME>.<MESSAGE_TYPE>
<BLOCKCHAIN_NAME>.broadcasted.<MESSAGE_TYPE>
```

MESSAGE_TYPE is specific on blockchain, most blockchain has topics for:

* dextrades - events from DEX trading 
* dexorders - events on creation / chaing status of DEX orders
* dexpools - events on creation / chaing status of DEX pools
* transactions - events, calls, transactions
* transfers - token and coin transfers events
* blocks - new blocks

Contact our support team for the topics that you can connect to for your specific needs.

When subscribing, you also specify some important properties:

* Configuration for offset management. It is done a bit differently in Kafka libraries, but the idea is that you have a choice of:
  1. receiving only latest messages, the next time you re-connect it will re-wing to the last one. It is controlled by config: ```autoCommit: false, fromBeginning: false, auto.offset.reset: latest```
  2. or you want to consume all messages and do not lose any. Note that in this case when you re-start your server you will have a gap as it starts reading from the last message you received!
  You have to configure it as: ```autoCommit: true, fromBeginning: false, auto.offset.reset: latest```.
     Check https://docs.confluent.io/platform/current/clients/consumer.html#offset-management-configuration for more info.

* Group ID. Group ID you have to specify when creating a consumer. It **must** start with your username. In most cases you need just one group ID that can be set the same as username.
You may need several group IDs in an advanced configuration when you using multiple independent applications consuming same stream.


Note that you can deploy many instances of your application with same Group ID for fault tolerance and better performance.
Then only one instance will receive the message from the topic, automatically re-distributing the load across your servers.

Typicaly you need setup of one consumer per one topic, as the message parsing for them anyway will need different code.

### Read and parse messages

Your consumer will read messages from the topic, and you will be able to parse them. Depending on the setting you used
to subscribe to topic, you will read the last message, or some message on the past that is the net message to read.
If you do not read messages fast enough, the lag will be accumulated, and the latency will grow.

Message in topic is JSON, compressed using lz4 method. You first need to decompress using any of lz4 library, and then parse
using JSON parser. This code is specific for prgramming language that you use, but should be very simple.

Message contains the list of objects on the top level. Structure of objects corresponds to the topic that you consume. 
General schema is described in https://github.com/bitquery/streaming_protobuf. The top level element depends on which stream 
of which blockchain you use. For example, for DEX Trades on Solana you will have JSON structure as:


*	Trade of type [solana_messages.DexTradeEvent](https://github.com/bitquery/streaming_protobuf/blob/c76bf63ff3874b9a6f09a4cc1c9203fdde623565/solana/dex_block_message.proto#L79)
*	Transaction of type [solana_messages.ParsedDexTransaction](https://github.com/bitquery/streaming_protobuf/blob/c76bf63ff3874b9a6f09a4cc1c9203fdde623565/solana/dex_block_message.proto#L89)
*	Block of type    [solana_messages.BlockHeader](https://github.com/bitquery/streaming_protobuf/blob/c76bf63ff3874b9a6f09a4cc1c9203fdde623565/solana/block_message.proto#L79)

### Documentation References

Kafka has a lot of documentation in public access, generic and programming-language-specific.

Some useful links that you may find useful are:

* [General Intro to Kafka and Concepts](https://docs.confluent.io/kafka/introduction.html)
* [Javascript Guild Connecting To Kafka using KafkaJS](https://kafka.js.org/)
* [Golang Client Library](https://github.com/confluentinc/confluent-kafka-go)
* [Python Client Library](https://github.com/confluentinc/confluent-kafka-python)

In addition, you may need a reference to Bitquery schema for messages: 

* [Schemas for Streaming](https://github.com/bitquery/streaming_protobuf)


##  Example of Javascript Code

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
  brokers: ["kfk0.bitquery.io:9093", "kfk1.bitquery.io:9093", "kfk2.bitquery.io:9093"], 
  ssl: true, 
  sasl: {
    mechanism: 'scram-sha-512',
    username: '<YOUR USERNAME>',
    password: '<YOUR PASSWORD>'
  }
});
```

- **clientId**: Identifies the Kafka client. This is anonymized in the documentation for security purposes.
- **brokers**: Kafka broker addresses that the client connects to.
- **ssl/sasl**: SSL/SASL configuration to secure and authenticate communication between the client and brokers.


### Kafka Consumer Setup

The Kafka consumer is created and configured to consume from a specific topic. In this example, the consumer connects to the `tron.broadcasted.transactions` topic and listens for new messages.

```javascript
const consumer = kafka.consumer({
  groupId: '<YOUR USERNAME>-group',
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


