---
title: "Blockchain Data Pipeline to Google BigQuery with Bitquery"
description: "Land live blockchain data in Google BigQuery: a Bitquery subscription feeds Pub/Sub and a subscriber writes rows to a BigQuery table. Guides and prerequisites."
slug: /category/data-pipeline-writing-to-google-bigquery
sidebar_label: "Data Pipeline: Writing to Google BigQuery"
keywords:
  - blockchain data BigQuery
  - Bitquery BigQuery pipeline
  - Pub/Sub blockchain data
  - stream blockchain data to BigQuery
  - Ethereum transfers BigQuery
---

import FAQ from "@site/src/components/FAQ";

# Blockchain Data Pipeline to Google BigQuery with Bitquery

This section builds a live pipeline in three steps: a Bitquery GraphQL subscription streams rows over WebSocket, a small process publishes each row to a Google Pub/Sub topic, and a Pub/Sub subscriber writes them into a BigQuery table. Pub/Sub sits in the middle so the Bitquery side never changes when you add consumers: BigQuery today, a Cloud Function or an alerting job tomorrow. It scales on its own, delivers each message at least once, and fans out one topic to many subscribers. You need a Google Cloud project with billing enabled (the free tier is enough) and a service account allowed to use Pub/Sub and BigQuery. For bulk history rather than a live feed, [cloud datasets](/docs/cloud/) deliver Parquet straight to BigQuery without a pipeline.

## The three guides

| Step | Guide | What you set up |
|---|---|---|
| 1 | [Getting started](/docs/subscriptions/google-bigquery/intro) | The architecture, prerequisites and a video walkthrough |
| 2 | [Setting up Google Pub/Sub](/docs/subscriptions/google-bigquery/pub-sub) | A topic, a subscription, credentials, and the publisher that forwards subscription rows |
| 3 | [Filing data into Google BigQuery](/docs/subscriptions/google-bigquery/bigquery) | The BigQuery table and the subscriber that writes rows into it |

## The stream that feeds the pipeline

Any subscription works as the source. This one streams every ETH transfer on Ethereum; swap the network, the cube or the filter for the data you want in your table. Run it in the [Bitquery IDE](https://ide.bitquery.io) on a free account to see the rows before wiring Pub/Sub.

```graphql
subscription {
  EVM(network: eth) {
    Transfers(where: { Transfer: { Currency: { Native: true } } }) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Transfer {
        Amount
        Sender
        Receiver
      }
    }
  }
}
```

Keep the selection flat, as above: each field becomes a column, and nested objects are easier to load when the publisher flattens them before Pub/Sub.

<FAQ
  items={[
    { q: "Do I need Kafka to write blockchain data into BigQuery?", a: "No. A GraphQL subscription over WebSocket is enough for this pipeline. Kafka is the option when you need lower latency, replay from offsets or several consumers on one feed." },
    { q: "Why put Pub/Sub between Bitquery and BigQuery?", a: "So the Bitquery side stays untouched when consumers change. Pub/Sub scales on its own, delivers at least once, and can fan one topic out to BigQuery, Cloud Functions and alerts at the same time." },
    { q: "What does the pipeline cost on Google Cloud?", a: "Billing must be enabled on the project, but the free tier covers a small pipeline. Pub/Sub and BigQuery charge by volume, so filter the subscription to the rows you need." },
    { q: "Can I load history instead of a live stream?", a: "Yes. Cloud datasets deliver Parquet files to BigQuery, S3, GCS or Snowflake for bulk history; the pipeline on this page is for rows as they happen." },
    { q: "Can I use a different database than BigQuery?", a: "Yes. The Pub/Sub subscriber can write anywhere; the guides use BigQuery as the example, and the same publisher works for any cloud database." },
  ]}
/>

## Related pages

- [WebSocket subscriptions](/docs/subscriptions/subscription)
- [Kafka streams](/docs/category/kafka-streams)
- [Cloud datasets](/docs/cloud/)
- [Real-time streaming compared](/docs/streams/)
