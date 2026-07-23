---
sidebar_position: 5
sidebar_label: Multi-Chain Trading Data Streams
title: Multi-Chain Trading Data Streams (Protobuf)
description: Kafka topics trading.prices and trading.trades—not tied to one network. Credentials, docs links, and schema references match Kafka streaming concepts.
---

# Multi-Chain Trading Data Streams (Protobuf)

Broker setup, SASL authentication, consumer groups, and general Kafka behavior are covered in **[Bitquery Kafka Streams — Understanding Concepts](/docs/streams/kafka-streaming-concepts)**.

All Kafka topics documented there deliver messages in **protobuf** format (JSON data samples for inspection: **[kafka-data-sample](https://github.com/bitquery/kafka-data-sample)**).

## Multi-chain trading topics

The **`trading`** namespace defines two Kafka topics. **Both use the same credentials** as your subscription:

- **`trading.prices`** — Multi-chain [Price Index Streams](/docs/trading/crypto-price-api/introduction/). See the [Crypto Price API](/docs/trading/crypto-price-api/introduction) for usage.
- **`trading.trades`** — Real-time DEX trades aligned with the [Crypto Trades API](/docs/trading/crypto-trades-api/trades-api). Message structure is defined in [`market/trades.proto`](https://github.com/bitquery/streaming_protobuf/blob/main/market/trades.proto) in [Bitquery Streaming Protobuf](https://github.com/bitquery/streaming_protobuf).

## See also

- [Kafka streaming concepts](/docs/streams/kafka-streaming-concepts) — brokers, protobuf streams, partitioning, duplicates, retention (e.g. **Proto Streams**: messages retained **4 hours**), and limitations vs GraphQL subscriptions.
- Chain-prefixed protobuf topics (**`<BLOCKCHAIN_NAME>.<MESSAGE_TYPE>`**, etc.) are listed under **Complete List of Topics** on that same page. Individual chain layouts are the **Chain-specific Stream** items in this sidebar (Bitcoin, EVM, Solana, TRON).
