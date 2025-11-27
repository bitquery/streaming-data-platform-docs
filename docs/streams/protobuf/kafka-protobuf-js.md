---
sidebar_position: 2
---

# Javascript Tutorial to Setup Solana Kafka Shred Stream

This tutorial explains how to consume Solana transaction messages in protobuf format from Kafka using Javascript (Common JS), and print them efficiently with decoded `bytes` fields in **base58** format.

You can read more about **Bitquery Protobuf Streams** here:  
[Bitquery Kafka Streaming Concepts - Protobuf Streams](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/#protobuf-streams).

The complete code is available [here](https://github.com/bitquery/bitquery-protobuf). You can also try the [npm](https://www.npmjs.com/package/bitquery-protobuf) package that wraps the entire code for the ease of development.

## **Prerequisites**

To avoid the hastle of manually downloading `proto` files containing schemas and writing code for loading and compiling those files, install the required npm package.

```shell
npm install bitquery-protobuf-schema
```

Also, install other dependencies using the following command line.

```shell
npm install kafkajs@2.2.3 uuid fs@0.0.1-security kafkajs-lz4@1.2.1 lz4@0.6.5 lz4-asm@0.4.2 bs58 
```

You’ll also need your **Kafka username/password** provided by the Bitquery team.

## **1. Setup Kafka Consumer Configuration**

### Kafka Client Initialization - Non SSL Version

```js
const { Kafka } = require("kafkajs");
const bs58 = require("bs58");
const { loadProto } = require("bitquery-protobuf-schema");
const { CompressionTypes, CompressionCodecs } = require("kafkajs");
const LZ4 = require("kafkajs-lz4");
const { v4: uuidv4 } = require("uuid");

CompressionCodecs[CompressionTypes.LZ4] = new LZ4().codec;

const username = "<username>";
const password = "<password>";
const topic = "solana.transactions.proto";
const id = uuidv4();

const kafka = new Kafka({
  clientId: username,
  brokers: [
    "rpk0.bitquery.io:9092",
    "rpk1.bitquery.io:9092",
    "rpk2.bitquery.io:9092",
  ],
  sasl: {
    mechanism: "scram-sha-512",
    username: username,
    password: password,
  },
});
```

## **2. Define a Protobuf Traversal Print Function**

This function **recursively walks** through any protobuf message and prints all its fields, converting `bytes` to **base58** or **hex**.

> **Solana vs EVM Encoding Tip**
>
> Protobuf `bytes` fields represent things like public keys, signatures, and hashes — and must be decoded according to the target blockchain:
>
> - **Solana**: Decode as `base58` (e.g. account addresses, signatures)
> - **EVM (Ethereum, BSC, etc.)**: Decode as `hex` with a `0x` prefix
>
> This tutorial uses `base58` decoding for Solana.  
> If you're consuming **EVM data**, update your decoder to:
>
> ```js
> const convertBytes = (buffer, encoding = "hex") => {
>   return "0x" + buffer.toString("hex");
> };
> ```

```js
const convertBytes = (buffer, encoding = "base58") => {
  if (encoding === "base58") {
    return bs58.default.encode(buffer);
  }
  return buffer.toString("hex");
};

const printProtobufMessage = (msg, indent = 0, encoding = "base58") => {
  const prefix = " ".repeat(indent);
  for (const [key, value] of Object.entries(msg)) {
    if (Array.isArray(value)) {
      console.log(`${prefix}${key} (repeated):`);
      value.forEach((item, idx) => {
        if (typeof item === "object" && item !== null) {
          console.log(`${prefix}  [${idx}]:`);
          printProtobufMessage(item, indent + 4, encoding);
        } else {
          console.log(`${prefix}  [${idx}]: ${item}`);
        }
      });
    } else if (value && typeof value === "object" && Buffer.isBuffer(value)) {
      console.log(`${prefix}${key}: ${convertBytes(value, encoding)}`);
    } else if (value && typeof value === "object") {
      console.log(`${prefix}${key}:`);
      printProtobufMessage(value, indent + 4, encoding);
    } else {
      console.log(`${prefix}${key}: ${value}`);
    }
  }
};
```

## **3. Initialize Consumer**

```js
const consumer = kafka.consumer({ groupId: username + "-" + id });
```

## **4. Consumer Running Stream and Getting Messages**

The consumer subscribes to the topic and processes messages. LZ4 compression is supported, and message content is logged to the console.

```js
const run = async () => {
  let ParsedIdlBlockMessage = await loadProto(topic); // Load proto before starting Kafka
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: false });

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ partition, message }) => {
      try {
        const buffer = message.value;
        const decoded = ParsedIdlBlockMessage.decode(buffer);
        const msgObj = ParsedIdlBlockMessage.toObject(decoded, {
          bytes: Buffer,
        });
        printProtobufMessage(msgObj);
      } catch (err) {
        console.error("Error decoding Protobuf message:", err);
      }
    },
  });
};

run().catch(console.error);
```

## Execution Workflow

1. **Kafka Client Initialization**: The Kafka client is created and configured with or without SSL certificates and SASL authentication.
2. **Group ID Generation**: A groupId is created, ensuring no collision with other consumers.
3. **Kafka Consumer Connection**: The consumer connects to the Kafka brokers and subscribes to a specified topic.
4. **Message Processing**:
   - **Loading Protobuf Schema**: Loads Protobuf Schema to decode the message recieved.
   - **Connecting the Consumer**: Establishes the connection with Kafka.
   - **Subscribing to the Topic**: Begins listening to the specified Kafka topic.
   - **Running the Consumer**: Processes messages with the `eachMessage` handler.
   - **Compression**: Supports handling messages compressed with LZ4.
5. **Error Handling**: Any errors during message processing are caught and logged.

By following this guide, you can set up a Node.js Kafka consumer using KafkaJS, secure it with SSL, and handle message compression using LZ4.
