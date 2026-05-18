---
slug: kafka-protobuf-js
sidebar_position: 4
sidebar_label: Javascript Tutorial to Setup Solana Kafka Shred Stream
title: Javascript Tutorial to Setup Solana Kafka Shred Stream
description: Use Node.js, KafkaJS, LZ4, and bitquery-protobuf-schema to consume Bitquery Solana Kafka protobuf; run js-consumer-example from kafka-streams-examples-usecases.
---

# Javascript Tutorial to Setup Solana Kafka Shred Stream

This tutorial explains how to consume **Solana** protobuf messages from **Bitquery Kafka** using **JavaScript** (Node.js **CommonJS** — not a browser bundle), and print them with **`bytes`** fields decoded to **base58** where **`printProtobufMessage`** applies that encoding.

**Streaming concepts:** **[Kafka streaming concepts — Protobuf streams](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/#protobuf-streams)**.

**Runnable project:** **[`bitquery/kafka-streams-examples-usecases`](https://github.com/bitquery/kafka-streams-examples-usecases)** — **[`js-consumer-example/`](https://github.com/bitquery/kafka-streams-examples-usecases/tree/main/js-consumer-example)** ([`src/index.js`](https://github.com/bitquery/kafka-streams-examples-usecases/blob/main/js-consumer-example/src/index.js), [`src/config.js`](https://github.com/bitquery/kafka-streams-examples-usecases/blob/main/js-consumer-example/src/config.js), [`package.json`](https://github.com/bitquery/kafka-streams-examples-usecases/blob/main/js-consumer-example/package.json)).

Use **[`bitquery-protobuf-schema npm Package`](https://www.npmjs.com/package/bitquery-protobuf-schema)** so you do **not** hand-manage `.proto` files—the package resolves the schema from **`KAFKA_TOPIC`**.

> **Throughput:** Treat this repo as a **minimal** consumer. Saturating high-volume topics typically requires tuning **KafkaJS** parallelism, **partition-aware** runners, or **multiple consumers under one consumer group**. See **[Kafka streaming concepts](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/)** for partition-oriented guidance.

## Prerequisites

- **Node.js 18+** (`package.json` `engines`).
- **npm**
- Bitquery **Kafka username and password** for stream access.

> You need separate Kafka credentials. Please contact sales on our official telegram channel or fill out the [form on our website](https://bitquery.io/forms/api).

Install all dependencies declared in **`package.json`**:

```bash
npm install
```

Key runtime libraries: **`kafkajs`**, **`kafkajs-lz4`** (+ **`lz4` / `lz4-asm`**), **`bitquery-protobuf-schema`**, **`dotenv`**, **`uuid`**, **`bs58`**.

## 1. Kafka client initialization (non-TLS baseline)

The sample builds a **KafkaJS** client with **SASL SCRAM-SHA-512**, **no TLS** (**`ssl: false`**), and default Bitquery broker endpoints (overridable via **`KAFKA_BOOTSTRAP_SERVERS`**). Compression: **LZ4** codec registration matches Bitquery payloads.

See the live **`createKafka`** helper in **`src/index.js`** and env loading in **`src/config.js`** on GitHub (**links above**).

> You need separate Kafka credentials. Please contact sales on our official telegram channel or fill out the [form on our website](https://bitquery.io/forms/api).

## 2. Protobuf traversal and `bytes` (Solana vs EVM)

Printing is implemented in **`src/printProtobuf.js`** and mirrors the **recursive traversal** pattern from earlier Bitquery tutorials: nested objects descend; **`bytes`** are encoded with **`bs58`** when the printer runs in **`base58`** mode (Solana-focused default in **`index.js`**).

> **Solana vs EVM `bytes`**
>
> Protobuf **`bytes`** often encode addresses, hashes, or signatures—the display encoding depends on the chain:
>
> - **Solana:** **base58** (this tutorial’s default path).
> - **EVM (Ethereum, BSC, Base, etc.):** **hex**, typically **`0x` + buffer.toString("hex")** when you customize the printer.
>
> Example pattern for hex (not used in the default Solana tree):
>
> ```js
> const hex0x = (buffer) => "0x" + Buffer.from(buffer).toString("hex");
> ```

## 3. Consumer group and subscribe

Group id:

- Prefer **stable** **`KAFKA_GROUP_ID`** beginning with **your Kafka username** (Bitquery requirement for stable ids).
- If unset, **`index.js`** uses **`${username}-group-${uuid}`** (hyphens stripped from uuid), matching the spirit of the older tutorial’s dynamic suffix.

Subscribe uses **`fromBeginning`** from **`KAFKA_FROM_BEGINNING`** (boolean-style env parsing in **`config.js`**).

> **Reminder vs Python / Go**
>
> Node uses **`KAFKA_FROM_BEGINNING`**. Python and Go in the **same repository** use **`KAFKA_AUTO_OFFSET_RESET`** (**`latest` / `earliest`**). Align env vars when you compare languages side by side.

## 4. Run stream: load proto, decode, LZ4-ready pipeline

[`src/index.js`](https://github.com/bitquery/kafka-streams-examples-usecases/blob/main/js-consumer-example/src/index.js):

1. **`await loadProto(cfg.topic)`** before consuming.
2. **`consumer.connect()`** → **`subscribe({ topic, fromBeginning })`**.
3. **`consumer.run({ autoCommit: false, eachMessage: ... })`**.
4. **`decode`** + **`toObject`** ( **`bytes`** as **`Buffer`** for the printer ).
5. **`printProtobufMessage`** to stdout; errors logged to stderr.

KafkaJS timeouts in code: **`connectionTimeout: 10_000`**, **`requestTimeout: 60_000`**.

## Execution workflow

1. **Initialize client** — brokers from env or defaults; **`ssl: false`**; SCRAM SASL credentials.
2. **Resolve group id** — explicit **`KAFKA_GROUP_ID`** or generated **`username-group-uuid`**.
3. **`loadProto(topic)`** — bind decode type to **`KAFKA_TOPIC`**.
4. **Connect and subscribe** — optional **`fromBeginning`** for new consumer groups without committed offsets—understand semantics vs **`autoCommit: false`** in this baseline.
5. **Process messages** — **`eachMessage`** decodes protobuf, prints traversal.
6. **Compression** — LZ4 codec registered for Kafka compression on the wire.
7. **Errors** — caught per message where possible; fatal errors exit non-zero.

**TLS:** baseline is **plaintext Kafka** on **9092**. For **`SASL_SSL`**, populate KafkaJS **`ssl`** objects and migrate brokers per **[Kafka streaming concepts — SASL_SSL](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/#ssl-connection-sasl_ssl-)** plus **`js-consumer-example/README.md`**.

## Clone and run (quick reference)

> You need separate Kafka credentials. Please contact sales on our official telegram channel or fill out the [form on our website](https://bitquery.io/forms/api).

```bash
git clone https://github.com/bitquery/kafka-streams-examples-usecases.git
cd kafka-streams-examples-usecases/js-consumer-example
npm install
cp .env.example .env
# set KAFKA_USERNAME, KAFKA_PASSWORD
npm start
```

Debug KafkaJS internals:

```bash
npm run start:debug
```

## Troubleshooting

| Issue                     | Action                                                                                   |
| ------------------------- | ---------------------------------------------------------------------------------------- |
| Missing env vars          | **`cp .env.example .env`**, validate names                                               |
| Auth / SASL failures      | Credentials, **`scram-sha-512`** mechanism, broker connectivity **9092**                 |
| LZ4 / native addon errors | Re-run **`npm install`**; verify Node version ≥ 18                                       |
| Decode failures           | Topic unsupported in your **`bitquery-protobuf-schema`** version or wrong topic spelling |

## See also

- **[bitquery-protobuf-schema (npm package)](https://www.npmjs.com/package/bitquery-protobuf-schema)**
- **[Kafka streaming concepts](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/)**
