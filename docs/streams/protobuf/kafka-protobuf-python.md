---
slug: kafka-protobuf-python
sidebar_position: 3
sidebar_label: Python Tutorial to use Solana Shreds from Kafka
title: Python Tutorial to use Solana Shreds from Kafka
description: "Python Tutorial to use Solana Shreds from Kafka with Bitquery Kafka and protobuf streams for low-latency blockchain ingestion in trading systems."
---
# Python Tutorial to use Solana Shreds from Kafka

This tutorial explains how to consume **Solana** transaction protobuf messages from **Bitquery Kafka** using **Python**, and print them with **`bytes`** fields shown in **base58** (pipe-friendly **stdout**; logs on **stderr**).

Background: **[Kafka streaming concepts — Protobuf streams](/docs/streams/kafka-streaming-concepts/#protobuf-streams)**.

**Runnable project:** **[`bitquery/kafka-streams-examples-usecases`](https://github.com/bitquery/kafka-streams-examples-usecases)** — folder **[`python-consumer-example/`](https://github.com/bitquery/kafka-streams-examples-usecases/tree/main/python-consumer-example)** ([`consumer.py`](https://github.com/bitquery/kafka-streams-examples-usecases/blob/main/python-consumer-example/consumer.py), [`settings.py`](https://github.com/bitquery/kafka-streams-examples-usecases/blob/main/python-consumer-example/settings.py), [`protobuf_print.py`](https://github.com/bitquery/kafka-streams-examples-usecases/blob/main/python-consumer-example/protobuf_print.py)).

> **Scaling:** This sample is a single process. For high throughput, add **parallel partition consumption** and/or **worker pools** behind the poll loop, following Bitquery’s Kafka guidance in **[Kafka streaming concepts](/docs/streams/kafka-streaming-concepts/)**.

## Prerequisites

Install dependencies from **`requirements.txt`** (pinned for compatibility with generated protobuf code):

```bash
pip install -r requirements.txt
```

Typical packages (see file for exact versions):

- **`confluent-kafka`**
- **`bitquery-pb2-kafka-package`** (Solana **`ParsedIdlBlockMessage`** and pb2 files of all schema, can be viewed [here](https://pypi.org/project/bitquery-pb2-kafka-package/))
- **`protobuf`**, **`base58`**, **`python-dotenv`**

You also need **Kafka username and password** from Bitquery for stream access.

> You need separate Kafka credentials. Please contact sales on our official telegram channel or fill out the [form on our website](https://bitquery.io/forms/api).

## 1. Setup Kafka consumer configuration

Configuration is **not** embedded as a large literal in the tutorial source: it is built in **`settings.load_settings()`** from environment variables (after **`load_dotenv()`**).

Conceptually, the consumer uses **non-TLS** Bitquery brokers by default:

- **`bootstrap.servers`**: `rpk0.bitquery.io:9092,rpk1.bitquery.io:9092,rpk2.bitquery.io:9092` (overridable)
- **`security.protocol`**: `SASL_PLAINTEXT`
- **`sasl.mechanisms`**: `SCRAM-SHA-512`
- **`enable.auto.commit`**: `False`
- **`auto.offset.reset`**: `latest` or `earliest` (from **`KAFKA_AUTO_OFFSET_RESET`**)

Full key list: **[`settings.py`](https://github.com/bitquery/kafka-streams-examples-usecases/blob/main/python-consumer-example/settings.py)**.

### Environment variables

| Variable                  | Required | Notes                                    |
| ------------------------- | -------- | ---------------------------------------- |
| `KAFKA_USERNAME`          | Yes      |                                          |
| `KAFKA_PASSWORD`          | Yes      |                                          |
| `KAFKA_TOPIC`             | No       | Default `solana.transactions.proto`      |
| `KAFKA_BOOTSTRAP_SERVERS` | No       | Default Bitquery `rpk*` **9092** cluster |
| `KAFKA_GROUP_ID`          | No       | If unset: `{username}-group-{uuid}`      |
| `KAFKA_AUTO_OFFSET_RESET` | No       | `latest` or `earliest`                   |

> You need separate Kafka credentials. Please contact sales on our official telegram channel or fill out the [form on our website](https://bitquery.io/forms/api).

## 2. Define / use the protobuf print helper

The runnable project implements traversal in **`protobuf_print.py`** (**`print_protobuf_message`**) instead of pasting a long snippet into the docs. It walks protobuf fields recursively and uses **`base58`** when **`encoding='base58'`**.

> **Solana vs EVM `bytes`**
>
> - **Solana:** **`base58`** for typical addresses / signatures (this tutorial default).
> - **EVM (Ethereum, BSC, Polygon, …):** prefer **`hex`** (often **`0x` + hex**).
>
> If you switch consumers to **EVM** protobuf types later, align **`print_protobuf_message(..., encoding=...)`** and any **`convert_bytes`** logic with your chain—not with Solana base58 defaults.

_(Implementation detail: **`protobuf_print.py`** uses **`field.is_repeated()`** where available so it stays compatible with modern **`protobuf`** runtimes pinned in **`requirements.txt`**.)_

## 3. Process messages from Kafka

In **`consumer.py`**, **`process_payload`** parses the wire bytes:

```python
block = parsed_idl_block_message_pb2.ParsedIdlBlockMessage()
block.ParseFromString(raw)
print_protobuf_message(block, indent=0, encoding="base58")
```

### Adapting to another topic

You can adapt the script by changing **`KAFKA_TOPIC`** **and** the **imported message class** / **`ParseFromString`** target so the **generated type matches the topic schema**. Other plumbing (Kafka config, polling) can stay parallel to this sample.

## 4. Poll and shut down cleanly

The main loop (**[`consumer.py`](https://github.com/bitquery/kafka-streams-examples-usecases/blob/main/python-consumer-example/consumer.py)**) **`poll`s** until **SIGINT** / **SIGTERM**, logs on **stderr**, and closes the consumer in **`finally`**.

## Clone and run (quick reference)

> You need separate Kafka credentials. Please contact sales on our official telegram channel or fill out the [form on our website](https://bitquery.io/forms/api).

```bash
git clone https://github.com/bitquery/kafka-streams-examples-usecases.git
cd kafka-streams-examples-usecases/python-consumer-example
python3 -m venv .venv
source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# edit KAFKA_USERNAME, KAFKA_PASSWORD
python consumer.py
```

## TLS (optional)

Extend the **`conf`** dict from **`settings.py`** using Bitquery’s **[SASL_SSL](/docs/streams/kafka-streaming-concepts/#ssl-connection-sasl_ssl-)** snippet (brokers **9093**, PEM paths). Summary and **`curl`** for PEMs: **[examples repo `README.md`](https://github.com/bitquery/kafka-streams-examples-usecases/blob/main/README.md)**.

## Troubleshooting

| Issue                                    | Action                                                                         |
| ---------------------------------------- | ------------------------------------------------------------------------------ |
| Missing env vars                         | **`cp .env.example .env`** and set credentials                                 |
| **`KafkaException`** / auth              | Credentials, topic enabled for account, outbound **9092**                      |
| **`DecodeError`**                        | Topic schema ≠ **`ParsedIdlBlockMessage`**                                     |
| Protobuf reflection errors after upgrade | Keep **`requirements.txt`** pins aligned with **`bitquery-pb2-kafka-package`** |

## See also

- **[bitquery-pb2-kafka-package (PyPI)](https://pypi.org/project/bitquery-pb2-kafka-package/)**
- **[Kafka streaming concepts](/docs/streams/kafka-streaming-concepts/)**
