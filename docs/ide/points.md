---
sidebar_position: 11
---

# Points

Bitquery indexes more than 1 Petabyte of structured blockchain data and exposes it through a single GraphQL interface. Using one endpoint, you can get a chain’s latest block height, follow money trails, pull DEX trades across supported blockchains, and more.

Not every query uses the same resources: some need a small set of records, others scan billions; some are served from cache, others may use large amounts of memory. Charging only by number of API calls would be unfair, because each call has a different cost.

**Points** solve this by tying cost to actual resource usage:

**Points = Resources consumed × Price per unit**

So you pay in proportion to what your queries consume. The exact algorithm and resource prices may change over time, but pricing is based on Points (not raw API call count).

At Bitquery we use the points system to calculate the cost for each query. Each query consumes a different number of points based on its complexity and the amount of data requested. 

**For a comprehensive understanding of the points system, please see this [video](https://youtu.be/L5QOTnvUwkg).**

When you first sign up, you’ll get 10K free points for the first month on the Developer plan. After that, you’ll need to upgrade or contact our sales team for a trial or paid plan to continue.
For every query you run, you can check the points consumed in real time.

![points](/img/ide/points.png)

Different plans have different limits for points available. You can always request a custom top-up of points by directly contacting us.

Check pricing [here](https://bitquery.io/pricing)

> **WARNING**  
> Please do not send money or pay unless you receive an invoice from [bitquery.io](https://bitquery.io). Beware of scammers.

## How are points calculated?

The number of points can vary for various reasons. Even the same query can produce different results. These points are dynamically calculated based on the following factors:

- The quantity of records being queried, either through the count of records in limit or the date range.
- The level of complexity of the query.

For instance, if you include additional addresses, the points will be calculated considering the resources occupied by those addresses. To optimize this query, there are a few approaches you can consider. Firstly, narrowing down the date range can help to refine the results. Secondly, reducing the list of addresses may also be beneficial. However, the effectiveness of these strategies will depend on your specific goal.

## How are points calculated for the realtime dataset?

When you select `dataset:realtime` you are charged at 5 points per cube irrespective of the number of records you query.

Here's how it works:

- **Rate**: Each cube is charged at the rate of 5 points per cube. If multiple cubes are used within a single query, each is billed individually.

### Example

```
{
  EVM(network: eth, dataset: realtime) {
    Transactions {
      Block {
        Hash
      }
    }
  }
}

```

In the example above, querying the `Transactions` data cube within the Ethereum (`eth`) network consumes 5 points. The complexity of the query or the volume of data requested does not affect the points charged.

## Streaming Data — Points and Pricing

Bitquery offers two streaming interfaces for real-time blockchain data. Each has a different pricing model:

### 1. WebSocket Subscriptions (GraphQL)

WebSocket-based [GraphQL subscriptions](/docs/subscriptions/subscription) deliver real-time blockchain data through the same API you use for queries.

**How pricing works:**

- Internally, each subscription stream costs **40 points per minute**.
- Under [paid plans](https://bitquery.io/pricing), you purchase a number of **concurrent streams** — and Bitquery adds enough points to keep those streams running 24/7 for the entire billing period.
- **As a paid customer, you don't need to worry about points for streaming.** Simply tell us how many concurrent streams you need and we handle the rest.

**What counts as one stream?**

Each data cube (e.g., Transfers, DEXTrades, Blocks) activated counts as a **separate stream**. If you use multiple cubes within a single WebSocket connection, each one is billed individually.

#### Example — Single Stream

```graphql
subscription {
  EVM(network: eth) {
    Transactions {
      Block {
        Hash
      }
    }
  }
}
```

This counts as **1 stream** (one cube: `Transactions`).

#### Example — Multiple Streams

Using the same method twice with different filters results in two separate streams:

```graphql
subscription {
  EVM(network: eth) {
    Cube1: Transactions(where: {#filters A}) {
      Block {
        Hash
      }
    }
    Cube2: Transactions(where: {#filters B}) {
      Block {
        Hash
      }
    }
  }
}
```

This counts as **2 streams**.

#### Points Calculation (Internal Reference)

- **One stream for 10 minutes** = 400 points (10 min × 40 points/min)
- **Two streams for 10 minutes** = 800 points (2 streams × 10 min × 40 points/min)

On paid plans this is handled automatically — you just pick the number of concurrent streams you need.

For more details on subscriptions, see the [subscriptions documentation](/docs/subscriptions/subscription).

### 2. Kafka Streams

[Kafka streams](/docs/streams/kafka-streaming-concepts) provide high-throughput, low-latency blockchain data delivery via Apache Kafka.

**Kafka pricing is completely separate from the points system.** There are no point deductions, no bandwidth caps, and no per-minute charges.

- Access is granted directly as part of your plan.
- There are no limitations on bandwidth or data volume.
- Kafka streams are ideal for high-throughput use cases such as trading bots, real-time indexers, and large-scale analytics pipelines.

To get started with Kafka streams, [contact our sales team](mailto:sales@bitquery.io) or visit the [Kafka streaming documentation](/docs/streams/kafka-streaming-concepts).

## How do you check points for your account?

You can check points consumed via streams under your [account](https://account.bitquery.io/user/api_v2/subscriptions).

![stream_points](/img/ide/stream_points.png)

## Need help?

If you still have questions about points or pricing, you can reach out to [support.bitquery.io](https://support.bitquery.io) or [sales@bitquery.io](mailto:sales@bitquery.io).
