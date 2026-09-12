---
title: "Kafka Streams for Blockchain Data: Topics, Setup and Examples"
description: "Bitquery Kafka streams: protobuf topics for trades, transfers, balances and blocks per chain, four-hour replay, how to get access, and where each guide sits."
slug: /category/kafka-streams
sidebar_label: "Kafka Streams"
keywords:
  - Kafka blockchain data
  - Kafka crypto stream
  - Bitquery Kafka
  - protobuf blockchain stream
  - Solana Kafka stream
  - real-time DEX trades Kafka
---

import FAQ from "@site/src/components/FAQ";

# Kafka Streams for Blockchain Data: Topics, Setup and Examples

Bitquery Kafka streams push every trade, transfer, balance change, transaction and block as protobuf messages on chain-specific topics, plus a multi-chain trading topic with USD prices. They carry the same data as the GraphQL subscriptions with a shorter pipeline, so latency is lower and a consumer can replay from an offset without gaps. Messages stay on the broker for four hours. Access uses separate SASL credentials issued by sales, not the IDE token, and Kafka is billed as its own line item, not from query points. Kafka runs server-side only; there is no browser client and no server-side filtering, so your consumer drops what it does not need.

This page is the map of the Kafka section. Start with the concepts guide if Kafka is new to you, then jump to the chain and language you use.

## Which topics exist

| Group | Topics | Guide |
|---|---|---|
| Multi-chain trading | Trades, token and pair prices with USD values across the Trading cube chains | [Multi-chain trading streams](/docs/streams/protobuf/kafka-trading-topics-protobuf) |
| EVM chains | Transactions, calls, events, transfers, balances and blocks for Ethereum, BNB Chain, Base, Polygon, Optimism, Robinhood Chain and Arc testnet | [EVM protobuf streams](/docs/streams/protobuf/chains/EVM-protobuf) |
| Solana | Shred-level transactions, DEX trades, transfers and balances, ahead of block confirmation | [Solana shred streams](/docs/streams/protobuf/chains/Solana-protobuf) |
| Solana perpetuals | Orders, fills, positions, PnL, liquidations and prices | [Solana perpetuals stream](/docs/streams/protobuf/chains/Solana-perpetual-protobuf) |
| Tron | Transactions, transfers, balances and blocks | [Tron protobuf streams](/docs/streams/protobuf/chains/Tron-protobuf) |
| Bitcoin | Blocks, transactions, inputs and outputs | [Bitcoin protobuf streams](/docs/streams/protobuf/chains/Bitcoin-protobuf) |

The full topic list with names, including Hyperliquid, is in [Complete list of topics](/docs/streams/kafka-streaming-concepts#complete-list-of-topics).

## Pick the guide

| You want to | Read |
|---|---|
| Understand topics, offsets, SASL auth and protobuf payloads | [Kafka streaming concepts](/docs/streams/kafka-streaming-concepts) |
| Connect, authenticate, handle offsets, timestamps and retention | [Kafka operations cookbook](/docs/streams/kafka-operations) |
| Consume from Go | [Go example](/docs/streams/protobuf/kafka-protobuf-go) |
| Consume from Python | [Python tutorial](/docs/streams/protobuf/kafka-protobuf-python) |
| Consume from JavaScript | [JavaScript tutorial](/docs/streams/protobuf/kafka-protobuf-js) |
| Keep only the messages you need | [Filtering Kafka streams](/docs/streams/protobuf/filtering_kafka_streams) |
| Get Solana data before the block lands | [Real-time Solana data](/docs/streams/real-time-solana-data) |
| Build your own indexer on the stream | [Real-time indexer with Kafka](/docs/streams/real-time-indexer-with-kafka-stream) |
| Feed a trading bot | [Trading bot on Kafka streams](/docs/streams/sniper-trade-using-bitquery-kafka-stream) |

## Try the same data without Kafka credentials

Every Kafka topic has a GraphQL subscription with the same rows, so you can see the shape of the data in the [Bitquery IDE](https://ide.bitquery.io) on a free account before asking for Kafka access. This stream is the WebSocket twin of the multi-chain trading topic, filtered to Ethereum:

```graphql
subscription {
  Trading {
    Trades(where: { Pair: { Market: { NetworkBid: { is: "bid:eth" } } } }) {
      Block {
        Time
      }
      Pair {
        Token {
          Symbol
        }
        QuoteToken {
          Symbol
        }
        Market {
          Protocol
        }
      }
      Side
      PriceInUsd
      AmountsInUsd {
        Base
      }
    }
  }
}
```

Change `bid:eth` to `bid:solana`, `bid:bsc`, `bid:base` or another chain id from the [Crypto Price API](/docs/trading/crypto-price-api/) to switch chains. When the subscription does what you need and you want lower latency, replay from an offset or several consumers on one feed, move to the Kafka topic that carries the same rows.

## How access and billing work

- Ask sales for Kafka credentials on the [official Telegram](https://t.me/Bloxy_info) or through the [website form](https://bitquery.io/forms/api). IDE tokens do not work on Kafka.
- Kafka is a separate line item from the GraphQL plan. Streams are billed by simultaneous streams and stream time, not by query points; each consumer group counts as its own stream. Details are on [how billing works](/docs/plans/how-billing-works/).
- Messages are kept for four hours. A consumer that is down longer than that misses data, so use offsets and monitor lag as the [operations cookbook](/docs/streams/kafka-operations) describes.

<FAQ
  items={[
    { q: "How do I get access to Bitquery Kafka streams?", a: "Contact sales on the official Telegram channel or through the website form to get SASL credentials. IDE tokens do not work on Kafka. Kafka access is billed separately from the GraphQL plan and counts stream time rather than query points." },
    { q: "How long are Kafka messages retained?", a: "Four hours. A consumer can replay anything within that window from an offset; anything older is gone, so keep consumers running and watch lag." },
    { q: "Kafka or WebSocket subscriptions: which should I use?", a: "Both carry the same rows. Kafka has lower latency, replays from offsets without gaps and lets several consumers split one feed, but runs server-side only with a fixed schema. WebSocket subscriptions work from a browser, can be filtered and reshaped in the query, and run in the IDE. Prototype on WebSocket, move to Kafka when latency or reliability matters." },
    { q: "Can I filter a Kafka topic on the server?", a: "No. Topics have a fixed protobuf schema and carry every message for that chain and data type; filtering happens in your consumer. The filtering guide shows the patterns, and the GraphQL subscription of the same data is the place to filter server-side." },
    { q: "Which chains have Kafka topics?", a: "Ethereum, BNB Chain, Base, Polygon, Optimism, Robinhood Chain, Arc testnet, Bitcoin, Solana (including shred-level and perpetuals topics), Tron and Hyperliquid, plus the multi-chain trading topics with USD prices. The complete list with topic names is on the concepts page." },
  ]}
/>

## Related pages

- [Real-time blockchain data streaming: WebSocket, Kafka and gRPC compared](/docs/streams/)
- [WebSocket subscriptions](/docs/subscriptions/subscription)
- [Solana gRPC streams](/docs/grpc/solana/examples/pump-fun-grpc-streams/)
- [Crypto Price API](/docs/trading/crypto-price-api/)
