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

## How are points calculated for subscriptions?

Under [new pricing](https://bitquery.io/blog/new-pricing-june-2024), we charge per simultaneous streams, instead of points.

However, internally each subscription is charged at the rate of 40 points per minute. We add enough points that it runs 24\*7 for the whole month.

**Note**: Each data cube (e.g., Transfers, DEXTrades, or Blocks) activated counts as a separate subscription. If multiple cubes are used within a single WebSocket connection, each is billed as an individual subscription.

### Example

```
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

In the example above, querying the `Transactions` data cube within the Ethereum (`eth`) network counts as a single subscription. The complexity of the query or the volume of data requested does not affect the points charged. You are billed solely based on the number of subscriptions and their duration.

### What Counts as a Single Cube?

When using the same method multiple times with different configurations or filters, each unique query counts as a separate cube.

For instance, the following query uses the `Transactions` method twice with different filters, resulting in two cubes:

```
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

## Example Calculation

For instance:

- **One Subscription**: If you maintain this subscription active for 10 minutes, you will be charged 400 points (10 minutes \* 40 points per minute).
- **Multiple Subscriptions**: If you use both `Transfers` and `DEXTrades` in the same WebSocket, it counts as two subscriptions. Keeping these active for 10 minutes would result in 800 points being charged (2 subscriptions _ 10 minutes _ 40 points per minute).

For more detailed information about subscriptions and best practices, please refer to the [documentation on subscriptions](/docs/subscriptions/subscription.md).

## How do you check points for your account?

You can check points consumed via streams under your [account](https://account.bitquery.io/user/api_v2/subscriptions).

![stream_points](/img/ide/stream_points.png)

## Need help?

If you still have questions about points or pricing, you can reach out to [support.bitquery.io](https://support.bitquery.io) or [sales@bitquery.io](mailto:sales@bitquery.io).
