---
slug: kafka-protobuf-go
sidebar_position: 2
sidebar_label: Go Example to Use Kafka Protobuf Streams for Real-time Data
title: Go Example to Use Kafka Protobuf Streams for Real-time Data
description: "Go Example to Use Kafka Protobuf Streams for Real-time Data with Bitquery Kafka and protobuf streams for low-latency blockchain ingestion in trading."
---
# Go Example to Use Kafka Protobuf Streams for Real-time Data

This guide explains how to consume **Bitquery Kafka** topics from **Go**, receive **Protocol Buffers** payloads, and decode **Solana** blocks as **`ParsedIdlBlockMessage`**. The **reference implementation** you run is the minimal app in **[`bitquery/kafka-streams-examples-usecases`](https://github.com/bitquery/kafka-streams-examples-usecases)** ([`go-consumer-example/`](https://github.com/bitquery/kafka-streams-examples-usecases/tree/main/go-consumer-example)): one process, **`.env`** configuration, **`Poll`** loop, stdout for decoded data and stderr for logs.

Read the platform overview in **[Kafka streaming concepts — Protobuf streams](/docs/streams/kafka-streaming-concepts/#what-to-know-about-protobuf-streams)**. **`.proto` sources and generated Go types** live under **[Bitquery Streaming Protobuf](https://github.com/bitquery/streaming_protobuf)** (Solana tree: [`solana/`](https://github.com/bitquery/streaming_protobuf/tree/main/solana)); this sample imports **`github.com/bitquery/streaming_protobuf/v2/solana/messages`**.

**Default wire security:** **SASL** (**SCRAM-SHA-512**) over **Kafka without TLS** on port **9092** (`SASL_PLAINTEXT`). Optional **TLS** is **`SASL_SSL`** on **9093** with PEM files—see **[SSL (SASL_SSL)](/docs/streams/kafka-streaming-concepts/#ssl-connection-sasl_ssl-)**. The minimal example does not enable TLS until you extend **[`kafka.ConfigMap`](https://github.com/bitquery/kafka-streams-examples-usecases/blob/main/go-consumer-example/main.go)**.

> **Scaling:** The repository consumer is intentionally small. For production throughput, use **parallel partition readers**, **queues**, and/or **multiple consumer instances in the same group**, per Bitquery’s partition guidance in **[Kafka streaming concepts](/docs/streams/kafka-streaming-concepts/)**. A larger **Go** reference (YAML, partitioned consumers, worker-style processing) remains **[`stream_protobuf_example`](https://github.com/bitquery/stream_protobuf_example)**—a **different** layout than `go-consumer-example`.

### Prerequisites

| #   | Requirement                                                                                                                                                                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **Bitquery Kafka access** — username and password for streams ([access](/docs/streams/kafka-streaming-concepts/#how-to-get-access-to-these-streams)).  |
| 2   | **Authorized topic** — default **`solana.transactions.proto`**; your contract must include the topic you set.                                                                  |
| 3   | **Go** **1.23+** — see [`go.mod`](https://github.com/bitquery/kafka-streams-examples-usecases/blob/main/go-consumer-example/go.mod).                                           |
| 4   | **`confluent-kafka-go/v2`** with **CGO** and system **`librdkafka`** (e.g. macOS: `brew install librdkafka pkg-config`; Debian/Ubuntu: `librdkafka-dev`, `pkg-config`, `gcc`). |
| 5   | **Git** — to clone the examples repository.                                                                                                                                    |

> You need separate Kafka credentials. Please contact sales on our official telegram channel or fill out the [form on our website](https://bitquery.io/forms/api).

### Key components (this repository)

| Piece                       | Role                                                                                                                                                                                     |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`main.go`**               | Loads **`.env`**, builds **`kafka.ConfigMap`**, **`Subscribe`**, **`Poll`** loop, **`proto.Unmarshal`** into **`ParsedIdlBlockMessage`**, prints tree to **stdout**, logs to **stderr**. |
| **`printproto.go`**         | Walks **protoreflect**; encodes **`bytes`** as **base58** (Solana-style).                                                                                                                |
| **`.env` / `.env.example`** | **`KAFKA_USERNAME`**, **`KAFKA_PASSWORD`**, optional topic, bootstrap, group id, offset reset.                                                                                           |

## Step by step

### 1. Clone the Go example

```bash
git clone https://github.com/bitquery/kafka-streams-examples-usecases.git
cd kafka-streams-examples-usecases/go-consumer-example
```

### 2. Install modules

```bash
go mod tidy
```

### 3. Configure environment

```bash
cp .env.example .env
```

Set at minimum:

> You need separate Kafka credentials. Please contact sales on our official telegram channel or fill out the [form on our website](https://bitquery.io/forms/api).

```env
KAFKA_USERNAME=your_kafka_username
KAFKA_PASSWORD=your_kafka_password
```

Optional (defaults match the Python and Node baselines in the same repository):

```env
# KAFKA_TOPIC=solana.transactions.proto
# KAFKA_BOOTSTRAP_SERVERS=rpk0.bitquery.io:9092,rpk1.bitquery.io:9092,rpk2.bitquery.io:9092
# KAFKA_GROUP_ID=my-username-stable-group
# KAFKA_AUTO_OFFSET_RESET=latest
```

If **`KAFKA_GROUP_ID`** is omitted, the program generates **`{username}-group-{uuid}`** (see **`loadConfigFromEnv`** in **`main.go`**). Bitquery expects **`group.id`** to **start with your Kafka username** when you choose a stable id.

### 4. Run

```bash
go run .
```

Stop with **Ctrl+C** (**`signal.NotifyContext`**).

### 5. Configuration map (as built in code)

The following keys are set in **[`main.go`](https://github.com/bitquery/kafka-streams-examples-usecases/blob/main/go-consumer-example/main.go)** (values from env where noted):

```go
cm := kafka.ConfigMap{
	"bootstrap.servers":                     cfg.bootstrap,
	"security.protocol":                     "SASL_PLAINTEXT",
	"sasl.mechanisms":                       "SCRAM-SHA-512",
	"sasl.username":                         cfg.username,
	"sasl.password":                         cfg.password,
	"group.id":                              cfg.groupID,
	"session.timeout.ms":                    30_000,
	"enable.auto.commit":                    false,
	"ssl.endpoint.identification.algorithm": "none",
	"auto.offset.reset":                     cfg.autoOffset,
}
```

## Output and `bytes` fields

- **Stdout:** decoded protobuf tree only (no partition/offset prefix).
- **Stderr:** subscribe line, Kafka errors, decode errors, shutdown.

> **Solana vs EVM `bytes`**
>
> This example prints **`bytes`** as **base58**, which matches typical **Solana** address / signature style. If you point the decoder at **EVM** protobuf types later, adjust **`printproto.go`** (or an equivalent printer) so **`bytes`** render as **hex** (commonly `0x`-prefixed) instead of base58.

## Changing topic or message type

Updating **`KAFKA_TOPIC`** only works when the topic still decodes as **`ParsedIdlBlockMessage`**. Otherwise change the import and **`proto.Unmarshal` target** in **`main.go`** to the type that matches the topic schema (**[`pkg.go.dev` / streaming_protobuf/v2](https://pkg.go.dev/github.com/bitquery/streaming_protobuf/v2)**).

## TLS (optional)

Follow **[SASL_SSL](/docs/streams/kafka-streaming-concepts/#ssl-connection-sasl_ssl-)** and extend **`kafka.ConfigMap`** (and broker list, usually **9093**). PEM filenames and fetch commands are summarized in the **[examples repository `README.md`](https://github.com/bitquery/kafka-streams-examples-usecases/blob/main/README.md)** and **[`kafka-consumer-example`](https://github.com/bitquery/kafka-consumer-example)**.

## Troubleshooting

| Symptom                        | Check                                                                                                |
| ------------------------------ | ---------------------------------------------------------------------------------------------------- |
| Consumer create / load failure | **`librdkafka`**, **`CGO_ENABLED=1`**, **`pkg-config`**.                                             |
| SASL / auth errors             | Credentials, topic entitlement, reachability of **9092** (or **9093** if using TLS).                 |
| Protobuf unmarshal errors      | Message type does not match topic schema.                                                            |
| Little or no stdout            | Offset policy (**`latest`** vs **`earliest`**) and group id; see Bitquery retention and offset docs. |

## See also

- **[Kafka streaming concepts](/docs/streams/kafka-streaming-concepts/)**
- **[`stream_protobuf_example`](https://github.com/bitquery/stream_protobuf_example)** — optional advanced Go sample (not the same as `go-consumer-example`).
