---
sidebar_position: 1
---

# API Comparison

To choose the right Bitquery API offering, it helps to understand their differences. The table below summarizes key features and capabilities of GraphQL Query vs GraphQL Subscription vs Kafka Streams:

| Feature / Method                  | GraphQL Query                                | GraphQL Subscription (WebSocket)               | Kafka Streams (JSON or Protobuf)                          |
| --------------------------------- | -------------------------------------------- | ---------------------------------------------- | --------------------------------------------------------- |
| **Use case**                      | On‑demand historical + real‑time via polling | Real-time pushes for new on-chain events       | High‑throughput, event-driven pipelines                   |
| **Data model**                    | Flexible GraphQL with filtering, aggregation | Same GraphQL query syntax, live updates        | Topic-based structured streams with JSON or Protobuf      |
| **Latency**                       | ~1 sec                                       | ~1 sec latency                                 | Sub‑second; streamed within 500 ms, supports HFT          |
| **Delivery model**                | Pull via REST/GraphQL                        | Push over WebSocket (GraphQL subscription)     | Consumer‑driven pull from Kafka broker                    |
| **Schema granularity**            | Customizable projections                     | Customizable projection                        | Kafka topics per type (e.g., dextrades, transactions)     |
| **Ordering & duplication**        | Strong consistency in query response         | No guaranteed order; WebSocket delivery        | Consumer logic needed                                     |
| **Authentication**                | OAuth/API‑Key                                | OAuth token over WebSocket                     | SASL username, password                                   |
| **Ideal Implementation Language** | Any language                                 | Any language except curl                       | Go, Java, Python, Rust                                    |
| **Best for**                      | Interactive apps, ad-hoc querying            | Monitoring, alerts, dashboards, mempool events | Streaming pipelines, HFT, data lakes, analytics workloads |

## When to Use Each API

### GraphQL Queries

**Best for on-demand, ad-hoc, and historical data needs:**

- When you need to fetch past blockchain activity (trades, transfers, balances)
- For dashboards, reports, and analytics that rely on filtering, sorting, and pagination
- When requests are driven by user actions or scheduled jobs
- Ideal for combining historical + near-real-time data via polling

### GraphQL Subscriptions (WebSocket)

**Ideal for lightweight real-time updates and UI integration:**

- When you want push-based delivery of live on-chain events (e.g., swaps, transfers, new blocks)
- For wallet trackers, price alerts, or monitoring dashboards
- When you need low-latency updates (~500 ms) but don’t require ultra-high throughput
- Perfect for embedding live feeds into web or mobile interfaces

### Kafka Streams (JSON / Protobuf)

**Perfect for high-throughput, fault-tolerant streaming pipelines:**

- When you need sub-second end-to-end latency for trades, mempool events, or order books
- For building scalable data lakes, HFT bots, or real-time analytics systems
- When you require integration with Kafka-based ecosystems

Pick Queries for flexibility and history, Subscriptions for easy real-time UI feeds, and Kafka Streams when you need industrial-scale, ultra-low-latency pipelines.
