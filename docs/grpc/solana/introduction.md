---
title: CoreCast - Smart Solana gRPC Streams
description: Low-latency, context-aware, topic-wise streaming from Bitquery for onchain data over gRPC.
---

### What are Smart gRPC Streams?

Bitquery Smart gRPC Streams provide low-latency, context-aware, topic-wise event delivery from the Solana blockchain. Unlike raw gRPC streams, Smart Streams enrich and filter events so your application receives only the data it needs (trades,balances, token context, program metadata).

### Why gRPC

- **Low latency**: stream RPCs for near real-time delivery.
- **Strong typing**: Protobuf contracts for stable schemas and efficient encoding.

### Topics

Bitquery exposes multiple topics so you subscribe only to what you need:

- **[transactions](https://docs.bitquery.io/docs/grpc/solana/topics/transactions)**: Finalized transactions with instructions, logs, and status.
- **transfers**: All token transfers with token context.
- **[dex_trades](https://docs.bitquery.io/docs/grpc/solana/topics/dextrades)**: DEX trade/swaps across supported protocols.
- **dex_orders**: Order lifecycle updates where applicable.
- **dex_pools**: Pool creation/updates and liquidity changes.
- **[balances](https://docs.bitquery.io/docs/grpc/solana/topics/balance)**: Balance updates for tracked accounts and mints.

Each topic supports context-aware filters and consistent identifiers for easy correlation across streams.

### Context-aware filtering

Filters are required to use Smart gRPC Streams. You must specify at least one filter per subscription; empty filter sets are rejected. Select exactly what to stream by combining filters. Common options include:

- **addresses**: `senders`, `receivers`, `owners`, `program_ids`
- **tokens**: Mint addresses (e.g., WSOL, USDC) and token standards
- **value thresholds**: Minimal amounts in native or token units
- **markets/pools**: By protocol, pool, or market identifiers (for DEX topics)

Filters are applied server-side to reduce bandwidth and speed up downstream processing.

## Quick Start Examples

- [JS Example](https://github.com/bitquery/grpc-code-samples/tree/main/js-demo)
- [Python Example](https://github.com/bitquery/grpc-code-samples/tree/main/python-demo)

### Quickstart (YAML config example)

Use a minimal configuration to subscribe to Solana transfers for specific addresses and tokens. Note: at least one filter is mandatory.

```yaml
server:
  address: "corecast.bitquery.io"
  authorization: "<your_api_token>"
  insecure: false

stream:
  type: "transfers" # one of: transactions, transfers, dex_trades, dex_orders, dex_pools, balances

filters:
  signers:
    - "7epLWkFd7xo18k4a4ySmN2UiiAFELDTV2ZNYAedCNh" # example address
```

**Get your API token**: Generate one at [https://account.bitquery.io/user/api_v2/access_tokens](https://account.bitquery.io/user/api_v2/access_tokens)

## Schema for the Data

- If you are a first time Bitquery user, schema is available in below mentioned files

  - [Solana](https://github.com/bitquery/streaming_protobuf/tree/main/solana)
  - [corecast](https://github.com/bitquery/streaming_protobuf/tree/main/solana/corecast)

- If you are a Kafka user, the schema is the same as the Kafka schema, you only need the corecast schema

The schema need not be downloaded, we have it as packages for install in NPM and PYPI.

- Python `pip install bitquery-corecast-proto`
- Node `npm install bitquery-corecast-proto`
